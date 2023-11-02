/**
 * Function: initializeTranslationUpdater
 * Description: Initializes a translation update system for elements with localization needs.
 * 
 * This function sets up a translation update system for elements with data-i18n attributes
 * that require localization. It handles loading JSON translation data from files and updating
 * the content of HTML elements based on the selected locale.
 * @param {string} defaultLocale - The default language.
 */
function initializeTranslationUpdater(defaultLocale) {

  /**
   * Function: translate
   * Description: Translates a string based on the selected locale and handles pluralization.
   * 
   * This function loads JSON translation data for a selected locale and translates a string
   * based on the provided key and count. It handles pluralization using "one" and "other" keys.
   * If the key is not defined, it returns the count as a string.
   * 
   * @param {string} selectedLocale - The selected locale for translation.
   * @param {string} key - The translation key.
   * @param {number} count - The count used for pluralization.
   * @returns {string} - The translated string or the count as a string.
   */
  async function translate(selectedLocale, key, count) {
    // Define data
    var dataURL = baseURL + "i18n/" + selectedLocale + ".json";
    const translationData = await loadJSON(dataURL);

    // Check if the translation key exists
    if (!translationData[key]) {
      return count.toString(); // Return the count as a string if translation is not found
    }

    // Determine whether to use "one" or "other" for pluralization
    const translationValue = translationData[key][count === 1 ? "one" : "other"];

    if (translationValue) {
      return translationValue;
    } else {
      return translationData[key]; // Use the default translation if "one" or "other" is missing
    }
  }

  
  // Export the insertTranslation function for global use
  window.insertTranslation = insertTranslation;

  /**
   * Function: insertTranslation
   * Description: Inserts translated content with count into elements based on the selected locale and handles pluralization.
   * 
   * This function loads JSON translation data for a selected locale and inserts translated content
   * into elements with the specified `id` (if it's a string) or directly into the provided element (if it's an element).
   * It uses the provided `key` for translation and handles pluralization
   * based on the `count`. If the translation key is not defined, it inserts the count as a string followed by
   * "publication" or "publications" based on the count.
   * 
   * @param {string|Element} id - The id of the elements to update (string) or the element itself (element).
   * @param {string} key - The translation key.
   * @param {number} count - The count used for pluralization.
   * @param {string} locale - The selected locale for translation.
   * @param {boolean} showCountOnly - Whether to show only the count (default is false).
   * @param {boolean} showTextOnly - Whether to show only the text without the count (default is false).
   */
  async function insertTranslation(id, key, count, locale, showCountOnly = false, showTextOnly = false) {
    try {
      const translatedValue = await translate(locale, key, count);

      // Determine whether to show both count and text, only count, or only text
      let contentToDisplay = '';
      if (!showCountOnly && !showTextOnly) {
        contentToDisplay = `<span class="count">${count}</span> ${translatedValue}`;
      } else if (showCountOnly) {
        contentToDisplay = `<span class="count">${count}</span>`;
      } else if (showTextOnly) {
        contentToDisplay = translatedValue;
      }
      if (typeof id === 'string') {
        // If id is a string, select the elements with that id
        const elementsToUpdate = document.querySelectorAll(id);

        elementsToUpdate.forEach((element) => {
          element.innerHTML = contentToDisplay;
        });
      } else if (id instanceof Element) {
        // If id is an element, update the element directly
        id.innerHTML = contentToDisplay;
      }

      // Return the translated value so it can be used if needed
      return translatedValue;
    } catch (error) {
      console.error(error);
    }
  }


  // Get the 'change-lang' link element by its ID
  const changeLangLink = document.getElementById('change-lang');

  // Check if the 'change-lang' link element exists
  if (changeLangLink) {
    // Add a click event listener to the 'change-lang' link
    changeLangLink.addEventListener('click', function (e) {
    
        // Given URL
        var givenURL = window.location.href;

        // Check if the given URL starts with the base URL
        if (givenURL.startsWith(baseURL)) {

          // Split the givenURL by the baseURL
          var segments = givenURL.split(baseURL);
          
          // Get the unique part of the given URL
          var uniquePart = segments[1];
          
          // Split the unique part by '/'
          var parts = uniquePart.split('/');            
          
          // Join the parts back with '/'
          var restOfURL = parts.slice(1).join('/');

          // Get the target language from the link's 'href' attribute
          const newLang = changeLangLink.getAttribute('data-lang');

          // Create the new URL
          var newURL = baseURL + newLang + '/' + restOfURL;
        
          // Redirect to the new URL to change the language
          window.location.href = newURL;
        } 
    });
}

  // Select all elements with the class "language"
  const languageElements = document.querySelectorAll('.language');

  /**
   * Function: loadJSON
   * Description: Loads JSON data from a specified file.
   * 
   * This asynchronous function fetches JSON data from a specified file and returns the data
   * or logs an error if the fetch fails.
   * 
   * @param {string} file - The path to the JSON file to load.
   * @returns {Promise} - A promise that resolves with the loaded JSON data.
   */
  async function loadJSON(file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error('Failed to load JSON');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Function: updateLocale
   * Description: Updates elements with translations based on the selected locale.
   * 
   * This asynchronous function loads JSON translation data for a selected locale and updates
   * elements with data-i18n attributes to display the translated content.
   * 
   * @param {string} selectedLocale - The selected locale for translation.
   */
  async function updateLocale(selectedLocale) {
    // Define data
    var dataURL = baseURL + "i18n/" + selectedLocale + ".json";
    const translationData = await loadJSON(dataURL);

    // Select all elements with data-i18n attribute
    const elementsToUpdate = document.querySelectorAll('[data-i18n]');

    // Update each element with its corresponding translation
    elementsToUpdate.forEach((element) => {
      const translationKey = element.getAttribute('data-i18n');
      const translationValue = translationData[translationKey];

      if (translationValue) {
        // Check if the element is an input and set the placeholder
        if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
          element.placeholder = translationValue;
        // Check if the translation is an HTML string
        } else if (typeof translationValue === 'string' && translationValue.includes('<a ')) {
          // Use innerHTML to render the HTML content
          element.innerHTML = translationValue;
        } else {
          // Use textContent for non-HTML content
          element.textContent = translationValue;
        }
      }
    });
  }

  // Call the updateLocale function with the selected language
  updateLocale(defaultLocale);
  
}
