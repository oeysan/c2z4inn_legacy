/**
 * Function: initializeMenu
 * Description: Initializes a responsive menu with scroll behavior.
 * 
 * This function sets up a responsive navigation menu that can be toggled by clicking an icon.
 * It also adds scroll behavior that hides the menu and header when the user scrolls down and
 * shows them when scrolling up.
 */
function initializeMenu() {
    // Get the menu element by its ID
    const menu = document.querySelector('#menu');
  
    // Check if the menu element exists
    if (menu) {
      // Get references to related elements
      const header = document.querySelector('header');
      const menuIcon = document.querySelector('#menu-icon');
      const menuClosed = document.querySelector('#menu-closed');
      const menuOpen = document.querySelector('#menu-open');
      const menuIcons = document.querySelectorAll('.menu-icon i');
      const dropdownContent = document.querySelector('.dropdown-content');
  
      /**
       * Function: toggleMenu
       * Description: Toggles the menu's visibility and icon state.
       * 
       * This function adds or removes the 'active' class from the menu element and toggles
       * the 'inactive' class of menu icons when called.
       */
      function toggleMenu() {
        menu.classList.toggle('active');
        menuIcons.forEach(icon => icon.classList.toggle('inactive'));
      }
  
      // Add a click event listener to the menu icon to toggle the menu
      menuIcon.addEventListener('click', toggleMenu);
  
      // Variables for tracking scroll behavior
      let didScroll;
      let lastScrollTop = 0;
      const delta = 5;
      const navbarHeight = header.offsetHeight;
  
      // Add a scroll event listener to the window to track scroll events
      window.addEventListener('scroll', function () {
        didScroll = true;
      });
  
      // Function to handle scroll behavior, called at intervals
      setInterval(function () {
        if (didScroll) {
          hasScrolled();
          didScroll = false;
        }
      }, 250);
  
      /**
       * Function: hasScrolled
       * Description: Handles scroll behavior and updates header and menu visibility.
       * 
       * This function determines if the page has scrolled, calculates the scroll direction,
       * and updates the header and menu visibility accordingly.
       */
      function hasScrolled() {
        const st = window.scrollY;
  
        if (Math.abs(lastScrollTop - st) <= delta) {
          return;
        }
  
        if (st > lastScrollTop && st > navbarHeight) {
          header.classList.remove('nav-down');
          header.classList.add('nav-up');
          menu.classList.remove('active');
          menuOpen.classList.add('inactive');
          menuClosed.classList.remove('inactive');
          dropdownContent.classList.remove('show');
        } else {
          if (st + window.innerHeight < document.documentElement.scrollHeight) {
            header.classList.remove('nav-up');
            header.classList.add('nav-down');
          }
        }
  
        lastScrollTop = st;
      }
    }
  }
  