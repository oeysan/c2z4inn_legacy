/**
 * Function: initializeScrollToTopButton
 * Description: Initializes a "scroll-to-top" button with scroll behavior.
 * 
 * This function sets up a "scroll-to-top" button that becomes visible when the user scrolls
 * down a specified distance from the top of the page. Clicking the button smoothly scrolls
 * the page to the top.
 */
function initializeScrollToTopButton() {
  const scrollToTopButton = document.getElementById('back-to-top');
  let timeout;

  const showScrollToTopButton = () => {
    clearTimeout(timeout); // Clear previous timeout
    if (window.scrollY >= 200) {
      scrollToTopButton.classList.add('active');
    } else {
      scrollToTopButton.classList.remove('active');
    }

    // Set a timeout to hide the button after 2 seconds of inactivity
    timeout = setTimeout(() => {
      scrollToTopButton.classList.remove('active');
    }, 1000);
  };

  window.addEventListener('scroll', showScrollToTopButton);

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Check if the "scroll-to-top" button element exists
  if (document.getElementById('back-to-top')) {
    // Call the function to initialize the "scroll-to-top" button
    showScrollToTopButton();
  }
}
