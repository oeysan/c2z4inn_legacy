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

async function includePage(
  url, 
  targetDiv, 
  containerDiv, 
  delay = 0, 
  useLoader = true, 
  customFunctions = []
) {
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

      // Execute the custom functions if provided
      if (customFunctions && Array.isArray(customFunctions)) {
        customFunctions.forEach((customFunction) => {
          if (typeof customFunction === "function") {
            customFunction();
          }
        });
      }
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

document.addEventListener("DOMContentLoaded", function() {
  var dropdownButtons = document.querySelectorAll('.dropdown-button');

  function toggleDropdownIcon() {
    var dropdown = document.querySelector('.dropdown-button');
    var dropdownContent = document.querySelector('.dropdown-content');

    if (dropdown && dropdownContent) {
        var firstIcon = dropdown.querySelector('i');

        if (dropdownContent.classList.contains('show')) {
            firstIcon.classList.remove('la-chevron-down');
            firstIcon.classList.add('la-chevron-up');
        } else {
            firstIcon.classList.remove('la-chevron-up');
            firstIcon.classList.add('la-chevron-down');
        }
    }
  }

  dropdownButtons.forEach(function(dropdown) {
    var dropdownContent = dropdown.nextElementSibling;

    // Toggle the dropdown menu visibility for each dropdown button
    dropdown.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdownContent.classList.toggle('show');

      if (dropdownContent.classList.contains('show')) {
        var section = document.createElement('section');
        dropdownContent.appendChild(section);
        var dropdownId = dropdown.id;
        const targetPageURL = baseURL + `${defaultContentLanguage}/headless/${dropdownId}`;
        const containerDiv = dropdownContent.querySelector('section');
        containerDiv.innerHTML = "";
        includePage(targetPageURL, ".include", containerDiv, 0, false, [updateTreeUlHeight, checkTreeDimensions]);
      } else {
        // Remove the section when the dropdown is hidden
        var section = dropdownContent.querySelector('section');
        if (section) {
          dropdownContent.removeChild(section);
        }
      }

      toggleDropdownIcon(dropdown, dropdownContent);
    });

    // Close the dropdown menu if user clicks outside of it
    document.addEventListener('click', function(event) {
      if (!dropdownContent.contains(event.target)) {
        // Check if the section exists before removing it
        var existingSection = dropdownContent.querySelector('section');
        if (existingSection) {
          dropdownContent.removeChild(existingSection);
        }

        dropdownContent.classList.remove('show');
        toggleDropdownIcon(dropdown, dropdownContent);
      }
    });

    // Prevent clicks inside the dropdown content from closing the dropdown
    dropdownContent.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  });
});


function updateTreeUlHeight() {
  // Get all .tree ul ul elements
  const ulElements = document.querySelectorAll('.tree ul ul');
  // Iterate through each ul element
  ulElements.forEach((ul) => {

      // Clone the ul element to preserve the original ul structure
      const clonedUl = ul.cloneNode(true);

      // Remove any nested ul elements from the cloned ul
      clonedUl.querySelectorAll('ul').forEach(nestedUl => 
          nestedUl.parentNode.removeChild(nestedUl));
      
      // Get the id of the last li element inside the cloned ul
      const cloneId = clonedUl.querySelector('li:last-child').
      getAttribute('id');
      
      // Find the corresponding original li element by its id
      const lastLi = ul.querySelector(`#${cloneId}`);
  
      if (lastLi) {
      
          // Find the first <a> or <span> element within lastLi
          const liText = lastLi.querySelector('a, span');
      
          // Get the bounding rectangle for the <ul> element
          const ulRect = ul.getBoundingClientRect();
  
          // Get the bounding rectangle for the text element
          const textRect = liText.getBoundingClientRect();
  
          // Calculate the middle position of the text element
          const textMiddle = textRect.top + textRect.height / 2;
  
          // Calculate the distance from the top of the <ul> to the middle of the text element
          const ulHeight = Math.abs(ulRect.top - textMiddle);
          
          // Set the height of ul using calculated height
          ul.style.setProperty(
              '--tree-connector', ulHeight + 'px'
          );
      }
  });
}

function checkTreeDimensions() {
  let treeElement = document.querySelector('.tree');
  let treeSelectElement = document.querySelector('#tree-select');

  if (treeElement) {
    var treeHeight = treeElement.offsetHeight + 100;
    var treeWidth = treeElement.offsetWidth;
    var viewportHeight = window.innerHeight;
    var viewportWidth = window.innerWidth;
    if (treeHeight > viewportHeight || treeWidth > viewportWidth) {
        treeElement.style.display = 'none';
        treeSelectElement.style.display = 'block';
    }
  }

  treeSelectElement.addEventListener('change', function() {
    // Get the selected option's value (which is the URL)
    const selectedUrl = this.value;
    // Check if the selected URL is not empty
    if (selectedUrl) {
        // Navigate to the selected URL
        window.location.href = selectedUrl;
    }
});
}


