/**
 * Function: initializeDarkModeToggle
 * Description: Initializes a dark mode toggle for changing CSS themes.
 * 
 * This function sets up a dark mode toggle system that enables or disables CSS files (themes)
 * to switch between light and dark modes when triggered by a user click.
 * 
 */
function initializeDarkModeToggle() {

    // Select the dark mode and light mode icons by their IDs
    const darkModeIcon = document.getElementById('dark-mode');
    const lightModeIcon = document.getElementById('light-mode');

    // Function to hide the active icon based on initial isDarkMode state
    const hideActiveIcon = () => {
        if (isDarkMode) {
            darkModeIcon.style.display = 'inline-block'; // Show the dark mode icon
            lightModeIcon.style.display = 'none';
        } else {
            darkModeIcon.style.display = 'none';
            lightModeIcon.style.display = 'inline-block'; // Show the light mode icon
        }
    };

    // Function to toggle the data-dark attribute on the <html> element
    const toggleDataDarkAttribute = () => {
        const htmlElement = document.documentElement;
        if (isDarkMode) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
    };

    // Add click event listeners to dark mode toggle buttons
    const toggleDarkModeButtons = document.querySelectorAll('.view-mode');
    toggleDarkModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            isDarkMode = !isDarkMode; // Toggle the dark mode state

            // Update the cookie with the user's choice
            setCookie("viewMode", isDarkMode ? "dark" : "light", 365);

            // Update charts
            createChart(charts);

            toggleDataDarkAttribute(); // Toggle data-dark attribute
            hideActiveIcon(); // Update the visibility of icons
        });
    });

    // Initialize data-dark attribute based on the initial dark mode state
    toggleDataDarkAttribute();
    hideActiveIcon(); // Initially hide the appropriate icon
}