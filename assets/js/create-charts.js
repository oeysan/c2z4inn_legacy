/**
 * Creates and initializes charts within specified containers.
 * @param {Array} charts - An array of chart objects with containerId, chartId, and options properties.
 * 
 */


// Function to recursively update properties containing "color"
function replaceVariable(obj, variableName, newValue, parentKeys = []) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    for (let key in obj) {
      const newParentKeys = [...parentKeys, key]; // Add the current key to the parent keys
  
      if (key === variableName) {
        // Check if any parent key contains "label" or "tick" or "title"
        if (newParentKeys.some(parentKey => /label|tick|title/i.test(parentKey))) {
          obj[key] = newValue;
        }
      } else if (typeof obj[key] === 'object') {
        obj[key] = replaceVariable(obj[key], variableName, newValue, newParentKeys);
      }
    }
  
    return obj;
  }
function createChart(charts) {
  var numCharts = charts.length; // Get the initial number of charts

  // Loop through each chart in the charts array using a for loop
  for (var i = 0; i < numCharts; i++) {
    var chart = charts[i];
    var containerId = chart.containerId;
    var id = chart.chartId;
    var options = chart.options;

    // Remove the existing chart canvas if it exists
    var existingCanvas = document.getElementById(id);
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Create a new canvas element and append it to the specified container
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', id);
    document.querySelector('#' + containerId).appendChild(canvas);

    // Add the CSS class to hide the canvas initially
    canvas.style.opacity = '0'
    
    // Get the 2D rendering context of the canvas and create the chart
    var ctx = document.getElementById(id).getContext('2d');
    var newChart = new Chart(ctx, options);

    // Update properties containing "color" in the chart options recursively
    replaceVariable(chart.options, "color", isDarkMode ? 'white' : 'black');

    // Update the chart to apply the changes
    newChart.update();

    // Replace the chart object at the same index in the array
    charts[i] = { 
      containerId: containerId, 
      chartId: id, 
      chart: newChart, 
      options: options 
    };

    canvas.style.transition = 'opacity 1s ease-in-out';
    canvas.style.opacity = '1';
    
  }
}

/**
 * Toggles the fullscreen mode for a chart container and re-creates the charts.
 */
// Get references to the necessary elements
const fullscreenToggle = document.querySelectorAll('.fullscreen-toggle span');
fullscreenToggle.forEach((button) => {
    button.addEventListener('click', () => {
       toggleFullscreenAndText();
    });
});

// Function to toggle fullscreen and text
function toggleFullscreenAndText() {
    const chartContainer = document.getElementById("chart-container");

    if (chartContainer.classList.contains("full-viewport")) {
        chartContainer.classList.remove("full-viewport");
        fullscreenToggle.forEach((button) => {
            button.setAttribute("data-i18n", "fullscreen"); // Add the attribute
            enableScroll();            
        });
        removeKeyElementPair("ArrowLeft", ".slideshow-previous");
        removeKeyElementPair("ArrowRight", ".slideshow-next");
        removeKeyElementPair("Escape", toggleFullscreenAndText);
    } else {
        chartContainer.classList.add("full-viewport");
        fullscreenToggle.forEach((button) => {
            button.setAttribute("data-i18n", "windowed"); // Add the attribute
        });
        addKeyElementPair("ArrowLeft", ".slideshow-previous");
        addKeyElementPair("ArrowRight", ".slideshow-next");
        addKeyElementPair("Escape", toggleFullscreenAndText);

    }
    initializeTranslationUpdater(defaultContentLanguage);
}


