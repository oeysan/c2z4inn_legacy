/**
 * Initializes a slideshow with navigation buttons for moving between slides.
 * @param {number} initialSlideIndex - The index of the initial slide to display.
 */
function initializeSlideshow(initialSlideIndex) {

    // Display the initial slide
    showSlide(initialSlideIndex);
  
    /**
     * Move to the next or previous slide.
     * @param {number} slideOffset - The number of slides to move (positive for next, negative for previous).
     */
    function changeSlide(slideOffset) {
      showSlide(slideIndex + slideOffset);
    }
  
    /**
     * Jump to a specific slide.
     * @param {number} targetSlideIndex - The index of the slide to jump to.
     */
    function jumpToSlide(targetSlideIndex) {
      showSlide(targetSlideIndex);
    }
  
    /**
     * Display the specified slide and hide the rest.
     * @param {number} slideIndexToShow - The index of the slide to display.
     */
    function showSlide(slideIndexToShow) {
      let i;
      let slides = document.getElementsByClassName("chart");
      let numbertext = document.getElementsByClassName("numbertext");
      let navigationButtons = document.getElementsByClassName("slideshow-buttons");
  
      // Wrap around to the first slide if exceeding slide count
      if (slideIndexToShow > slides.length) { slideIndexToShow = 1 }
      if (slideIndexToShow < 1) { slideIndexToShow = slides.length }
  
      // Hide all slides
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        numbertext[i].style.display = "none";
      }
  
      // Hide navigation buttons if there's only one slide
      if (slides.length > 1) {
        for (i = 0; i < navigationButtons.length; i++) {
          navigationButtons[i].style.display = "block";
        }
      }
  
      // Display the current slide
      if (slides.length > 0) {
        slides[slideIndexToShow - 1].style.display = "block";
        numbertext[slideIndexToShow -1].style.display = "block";
      }
      slideIndex = slideIndexToShow;
    }
  
    // Add event listeners to the "previous" and "next" buttons
    const prevButton = document.querySelector(".slideshow-previous");
    const nextButton = document.querySelector(".slideshow-next");
  
    if (prevButton && nextButton) {
      prevButton.addEventListener("click", () => {
        changeSlide(-1); // Move to the previous slide
      });
  
      nextButton.addEventListener("click", () => {
        changeSlide(1); // Move to the next slide
      });
    }
    
  }
