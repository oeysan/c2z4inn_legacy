
from flask import Flask, render_template, request, redirect, url_for, Response
import os
from os.path import join, dirname, realpath
import re
import pandas as pd
import numpy as np
import glob
import argparse

import nltk
from nltk import tokenize

from transformers import BertTokenizer, TFBertModel, BertConfig
from transformers.utils.dummy_tf_objects import TFBertMainLayer

import tensorflow as tf
from tensorflow import convert_to_tensor
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.initializers import TruncatedNormal
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import BinaryAccuracy, Precision, Recall

from flask import current_app as app

import logging

# Initialize the logger
logging.basicConfig(level=logging.INFO)  # Set the desired logging level

app = Flask(__name__)

# Enable debugging mode
app.config["DEBUG"] = False

# Initialize the BERT tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-uncased')

# Base dir for all models
# Parse command-line arguments
parser = argparse.ArgumentParser(description="Predict SDGs from abstracts using a trained model.")
parser.add_argument("--model_dir", required=True, help="Directory of the trained model file.")
args = parser.parse_args()

# Assign the model directory from command-line argument to BASE_MODEL_DIR
BASE_MODEL_DIR = args.model_dir

def tokenize_abstracts(abstracts):
    """
    Tokenize a list of abstracts into BERT format.

    Args:
        abstracts (list): List of abstracts (strings).

    Returns:
        list: List of tokenized abstracts.
    """
    t_abstracts = []
    for abstract in abstracts:
        t_abstract = "[CLS] "
        for sentence in tokenize.sent_tokenize(abstract):
            t_abstract = t_abstract + sentence + " [SEP] "
        t_abstracts.append(t_abstract)
    return t_abstracts

def b_tokenize_abstracts(t_abstracts, max_len=512):
    """
    Tokenize abstracts into BERT tokens with a maximum length.

    Args:
        t_abstracts (list): List of tokenized abstracts.
        max_len (int): Maximum sequence length.

    Returns:
        list: List of tokenized abstracts with limited length.
    """
    b_t_abstracts = [tokenizer.tokenize(_)[:max_len] for _ in t_abstracts]
    return b_t_abstracts

def convert_to_ids(b_t_abstracts):
    """
    Convert tokenized abstracts to BERT input IDs.

    Args:
        b_t_abstracts (list): List of tokenized abstracts.

    Returns:
        list: List of BERT input IDs.
    """
    input_ids = [tokenizer.convert_tokens_to_ids(_) for _ in b_t_abstracts]
    return input_ids

def abstracts_to_ids(abstracts):
    """
    Convert abstracts to BERT input IDs with padding.

    Args:
        abstracts (list): List of abstracts.

    Returns:
        list: Padded BERT input IDs.
    """
    tokenized_abstracts = tokenize_abstracts(abstracts)
    b_tokenized_abstracts = b_tokenize_abstracts(tokenized_abstracts)
    ids = convert_to_ids(b_tokenized_abstracts)
    return ids

def pad_ids(input_ids, max_len=512):
    """
    Pad input IDs to a fixed length.

    Args:
        input_ids (list): List of BERT input IDs.
        max_len (int): Maximum sequence length.

    Returns:
        list: Padded input IDs.
    """
    p_input_ids = pad_sequences(input_ids,
                                maxlen=max_len,
                                dtype="long",
                                truncating="post",
                                padding="post")
    return p_input_ids

def create_attention_masks(inputs):
    """
    Create attention masks for BERT inputs.

    Args:
        inputs (list): List of input sequences.

    Returns:
        tf.Tensor: Tensor of attention masks.
    """
    masks = []
    for seq in inputs:
        seq_mask = [i > 0 for i in seq]
        masks.append(seq_mask)
    return tf.cast(masks, tf.int32)

def prepare_input(abstracts):
    """
    Prepare BERT input tensors.

    Args:
        abstracts (list): List of abstracts.

    Returns:
        tf.Tensor: Tensor of padded input IDs.
        tf.Tensor: Tensor of attention masks.
    """
    ids = abstracts_to_ids(abstracts)
    padded_ids = pad_ids(ids)
    masks = create_attention_masks(padded_ids)
    return tf.convert_to_tensor(padded_ids), tf.convert_to_tensor(masks)

def model_number(filename):
    """
    Extract the model number from a filename.

    Args:
        filename (str): Name of the file.

    Returns:
        int: Extracted model number.
    """
    match = re.search(r"(\d+).h5", filename)
    return int(match.group(1)) if match else 0

def find_model_files(model_dir):
    """
    Find all model files in a directory and sort them by model number.

    Args:
        model_dir (str): Directory containing model files.

    Returns:
        list: List of sorted model file paths.
    """
    h5_files = glob.glob(os.path.join(model_dir, "*.h5"))
    if len(h5_files):
        h5_files = sorted(h5_files, key=model_number)
    return h5_files

def predict_sdg(model_files, abstracts, keys):
    """
    Generate predictions using BERT models for given abstracts.

    Args:
        model_files (list): List of model file paths.
        abstracts (list): List of abstracts to be predicted.
        keys (list): List of keys corresponding to the abstracts.

    Returns:
        pd.DataFrame: DataFrame containing predictions for each SDG goal.

    This function takes a list of BERT model files, a list of abstracts, and a 
    list of keys as input. It generates predictions for each abstract using the 
    provided BERT models. The predictions are concatenated along the last axis 
    and returned as a DataFrame with columns 'key', 'sdg1', 'sdg2', ..., 'sdgn',
    where n is the number of SDG goals.

    """
    input_ids, masks = prepare_input(abstracts)
    input_dict = {
        "input_ids": input_ids,
        "attention_masks": masks
    }

    predictions = []  # List to store individual model predictions
    
    for model in model_files:

        # Define model
        model = load_model(model)

        # Predict using the individual model
        prediction = model.predict(input_dict)

        # Store predictions
        predictions.append(prediction)

        # Remove the model from memory
        del model

    # Concatenate predictions along the last axis
    concatenated_predictions = np.concatenate(predictions, axis=-1)

    # Convert concatenated predictions to DataFrame
    predictions_df = pd.DataFrame(concatenated_predictions)

    # Add key column to the DataFrame
    predictions_df.insert(0, "key", keys)

    # Rename columns
    num_classes = concatenated_predictions.shape[1] if concatenated_predictions.shape else 0
    predictions_df.columns = (
        ["key"] +
        ["sdg" + str(i + 1) for i in range(num_classes)]
    )

    return predictions_df

# Handle file upload and make predictions
@app.route("/", methods=['POST'])
def uploadFiles():
    """
    Handle file upload and make predictions.

    Returns:
        Response: JSON response containing predictions or error message.
    """
    # Get the uploaded file
    uploaded_file = request.files['file']

    try:
        # Check if the file is a CSV
        if uploaded_file.filename.rsplit('.', 1)[1].lower() != 'csv':
            raise ValueError("Invalid file format. Please upload a CSV file.")

        # Check file size (50 MB limit)
        max_file_size = 50 * 1024 * 1024  # 50 MB in bytes
        if len(uploaded_file.read()) > max_file_size:
            raise ValueError("File size exceeds the limit of 50 MB.")

        # Reset file pointer after reading for further processing
        uploaded_file.seek(0)

        # Create dataframe from uploaded csv
        data = pd.read_csv(uploaded_file)

        # Extract abstracts and keys from data
        abstracts = data["abstract"].tolist()
        keys = data["key"].tolist()

        # Get the model directory specified in the POST request
        relative_model_dir = request.form.get('model')

        # Construct the absolute path to the specific model directory
        specific_model_dir = os.path.join(BASE_MODEL_DIR, relative_model_dir)

        # Find model files in the specific model directory
        model_files = find_model_files(specific_model_dir)

        if len(model_files) < 1:
            raise ValueError("No model files found.")

        # Make predictions
        predictions = predict_sdg(model_files, abstracts, keys)

        # Return predictions as JSON response
        return Response(
            predictions.to_json(orient="records"),
            mimetype='application/json'
        )

    except Exception as e:
        # Log the error
        logging.error(f"Error processing uploaded file: {e}")
        
        # Return error message as JSON response
        return Response(
            f'{{"error": "{str(e)}"}}',
            status=400,
            mimetype='application/json'
        )

if (__name__ == "__main__"):
     app.run(port = 6963)
