// Function to create buttons
function createButton(options) {
  const {
      type = null,
      text = null,
      id = null,
      className = null,
      attribute = {}
  } = options;

  const button = document.createElement(type);
  if (id) button.id = id;
  if (className) button.className = className;

  // Set attributes from the attribute object
  if (Object.keys(attribute).length > 0) {
      Object.entries(attribute).forEach(([attrName, attrValue]) => {
          button.setAttribute(attrName, attrValue);
      });
  }

  if (text) button.textContent = text;
  return button;
}

// Function to display the loader
function showLoader(containerDiv) {
  const loader = document.createElement("div");
  loader.classList.add("page-loader"); // Add the loader class
  containerDiv.appendChild(loader);
  return loader; // Return the loader element
}

// Function to remove the loader
function hideLoader(loader, containerDiv) {
  if (loader && loader.parentNode === containerDiv) {
    containerDiv.removeChild(loader);
  }
}

// Function to simulate a delay
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// IncludePage function with a simulated delay and loader
async function includePage(url, targetDiv, containerDiv, delay = 0, useLoader = true) {
  let loader = null;

  if (useLoader) {
    // Display the loader
    loader = showLoader(containerDiv);
  }

  try {
    // Simulate a delay (remove this line in your production code)
    await wait(delay);

    // Fetch the content from the target page
    const response = await fetch(url);
    const html = await response.text();

    if (useLoader) {
      // Remove the loader once content is fetched
      hideLoader(loader, containerDiv);
    }

    // Extract and insert the specific part you want from the fetched content
    const parser = new DOMParser();
    const targetPageDOM = parser.parseFromString(html, "text/html");
    const extractedContent = targetPageDOM.querySelector(targetDiv);

    if (extractedContent) {
      // Append the extracted content to the container div
      containerDiv.appendChild(extractedContent);
    } else {
      console.error("Error: Element with selector '" + targetDiv + "' not found in the fetched content.");
    }
  } catch (error) {
    console.error("Error fetching content: " + error);
    if (useLoader) {
      // Remove the loader in case of an error
      hideLoader(loader, containerDiv);
    }
  }
}
// Example usage:
// includePage("target-page.html", "#targetDivId", "contentContainer", false);

// Object to store key-element pairs
const keyElementPairs = [];

// Function to add a key-element pair and corresponding event listener
function addKeyElementPair(key, elementOrFunction) {
    keyElementPairs.push({ key, elementOrFunction });
    window.addEventListener("keydown", handleKeyDown);
}

// Function to remove a key-element pair and corresponding event listener
function removeKeyElementPair(key, elementOrFunction) {
    const index = keyElementPairs.findIndex(pair => pair.key === key && pair.elementOrFunction === elementOrFunction);
    if (index !== -1) {
        keyElementPairs.splice(index, 1);
        if (keyElementPairs.length === 0) {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }
}

// Handle keyboard events
function handleKeyDown(event) {
    const pressedKey = event.key;

    // Iterate through the key-element pairs
    keyElementPairs.forEach(pair => {
        if (pair.key === pressedKey) {
            if (typeof pair.elementOrFunction === "function") {
                // Execute the provided function
                pair.elementOrFunction();
            } else {
                // Get the element to trigger a click
                const targetElement = typeof pair.elementOrFunction === "string" ? document.querySelector(pair.elementOrFunction) : pair.elementOrFunction;

                // Trigger a click on the target element
                if (targetElement) {
                    targetElement.click();
                }
            }
        }
    });
}

/**
 * Disables scrolling for the entire page and saves the current scroll position.
 */
function disableScroll() {
  // Get the current scroll position
  var scrollX = window.scrollX || window.pageXOffset;
  var scrollY = window.scrollY || window.pageYOffset;

  // Save the current scroll position and prevent further scrolling
  window.onscroll = function() {
    window.scrollTo(scrollX, scrollY);
  };

  // Hide the scrollbar
  document.body.style.overflow = 'hidden';
}

/**
 * Enables normal scrolling behavior by restoring the scroll event.
 */
function enableScroll() {
  // Restore normal scrolling behavior by removing the scroll event handler
  window.onscroll = null;

  // Show the scrollbar
  document.body.style.overflow = 'auto';
}


/**
 * Function: setCookie
 * Description: Set a cookie with the given name and value.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store in the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Function: getCookie
 * Description: Get the value of a cookie by its name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} - The value of the cookie or null if the cookie is not found.
 */
function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}


/**
 * Copies text to the clipboard.
 * 
 * @param {string} text - The text to be copied to the clipboard.
 */
function copyToClipboard(text) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
  
    // Set the input value to the provided text
    tempInput.value = text;
  
    // Append the input element to the body
    document.body.appendChild(tempInput);
  
    // Select the text in the input element
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
  
    // Copy the selected text to the clipboard
    document.execCommand('copy');
  
    // Remove the temporary input element
    document.body.removeChild(tempInput);
}


/**
 * Show a pop-up notification with a message.
 * 
 * @param {string} text - The text to display in the pop-up.
 * @param {string} messageKey - The translation key for the pop-up message.
 * @param {boolean} includeText - Whether to include the text in the message (default is true).
 */
function showPopup(text, messageKey, includeText = true, copyText = true) {
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const copyButton = document.getElementById('copy-button');
    
    // Disable the button to prevent multiple clicks
    copyButton.disabled = true;

    // Translate the message using the provided message key
    insertTranslation("#popup-text", messageKey, 1, defaultContentLanguage, false, true).then((translatedMessage) => {
      if (translatedMessage) {
        if (includeText) {
          popupText.textContent = `${translatedMessage}: ${text}`;
        } else {
          popupText.textContent = translatedMessage;
        }
      } else {
        if (includeText) {
          popupText.textContent = `Copied to clipboard: ${text}`;
        } else {
          popupText.textContent = 'Copied to clipboard';
        }
      }
  
      // Show the pop-up
      popup.style.display = 'block';
      
      // Copy text to clipboard
      if (copyText) {
        copyToClipboard(text);
      }
    
      // Hide the pop-up and enable the button after 3 seconds (adjust the delay as needed)
      setTimeout(function() {
        popup.style.display = 'none';
        copyButton.disabled = false; // Re-enable the button
      }, 3000);
    });
}

