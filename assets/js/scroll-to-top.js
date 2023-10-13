/**
 * Function: initializeScrollToTopButton
 * Description: Initializes a "scroll-to-top" button with scroll behavior.
 * 
 * This function sets up a "scroll-to-top" button that becomes visible when the user scrolls
 * down a specified distance from the top of the page. Clicking the button smoothly scrolls
 * the page to the top.
 */
function initializeScrollToTopButton() {
  
  const showScrollToTopButton = () => {
    // Get the "scroll-to-top" button element by its ID
    const scrollToTopButton = document.getElementById('back-to-top');

    // Show the button when the user scrolls down a specified distance from the top
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 200) {
        scrollToTopButton.classList.add('active');
      } else {
        scrollToTopButton.classList.remove('active');
      }
    });

    // Scroll to the top when the button is clicked
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // Check if the "scroll-to-top" button element exists
  if (document.getElementById('back-to-top')) {
    // Call the function to initialize the "scroll-to-top" button
    showScrollToTopButton();
  }
}
