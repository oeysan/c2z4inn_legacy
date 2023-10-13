/**
 * Creates a loader element and appends it to a specified target element.
 * @param {string} targetElement - The selector for the target element where the loader will be appended.
 * @returns {Object} - An object with a `remove` function to remove the loader.
 */
function createLoader(targetElement) {
  // Create a loader container
  const loaderContainer = document.createElement("div");
  loaderContainer.id = "loader-container";
  
  // Replace the loader with your SVG image
  const loader = document.createElement("img");
  loader.src = baseURL + "images/logo.svg"; // Replace with the path to your SVG image
  loaderContainer.appendChild(loader);

  // Find the target element and insert the loader container as its first child
  const target = document.querySelector(targetElement);
  if (target) {
      target.insertBefore(loaderContainer, target.firstChild);
  }

  // Function to remove the loader
  function removeLoader() {
    loaderContainer.style.opacity = "0";
    setTimeout(function () {
      loaderContainer.style.display = "none";
    }, 500); // Additional delay for fading out
  }

  // Return an object with a `remove` function
  return {
    remove: removeLoader
  };
}

/**
 * Function to load content, display a loader, run a provided function, and remove the loader when the function completes.
 * @param {string} targetElement - The selector for the target element where the loader will be appended.
 * @param {Function} callback - The function to run while the loader is displayed.
 */
// Function to load content, display a loader, run a provided function, and remove the loader when the function completes.
function loadWithLoader(targetElement, callback) {
  const loader = createLoader(targetElement);

  // Execute the provided callback function
  callback(function () {
    // Remove the loader when the callback function completes
    loader.remove();
  });
}