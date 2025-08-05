// Shared Navigation Component
// This file contains the navigation HTML and functionality that can be loaded on all pages

function createSharedNavigation() {
  const navigationHTML = `
    <!-- Navigation -->
    <nav class="main-navigation">
      <div class="nav-container">
        <div class="nav-logo" onclick="window.location='index.html'" title="Go to Home">
          <img src="assets/matrix-logo.png" alt="Matrix Logo">
        </div>
        <ul class="nav-menu" id="nav-menu">
          <li class="nav-item">
            <a href="#" onclick="window.location='index.html'" class="nav-link" id="nav-home">
              <i class="fas fa-home"></i> HOME
            </a>
          </li>
          <li class="nav-item">
            <a href="#" onclick="window.location='CP2388-worksheets.html'" class="nav-link" id="nav-cp2388">
              <i class="fas fa-cogs"></i> CP2388
            </a>
          </li>
          <li class="nav-item">
            <a href="#" onclick="window.location='tracking-dashboard.html'" class="nav-link" id="nav-progress">
              <i class="fas fa-chart-line"></i> PROGRESS
            </a>
          </li>
          <li class="nav-item">
            <a href="#" onclick="window.location='about.html'" class="nav-link" id="nav-about">
              <i class="fas fa-info-circle"></i> ABOUT
            </a>
          </li>
          <li class="nav-item">
            <button onclick="installPWA()" class="nav-link pwa-install-button">
              <i class="fas fa-download"></i> INSTALL APP
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // Insert navigation at the beginning of the body
  document.body.insertAdjacentHTML('afterbegin', navigationHTML);

  // Set active navigation item based on current page
  setActiveNavigationItem();
}

function setActiveNavigationItem() {
  // Get current page path
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';

  // Remove active class from all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));

  // Set active class based on current page
  switch (currentPage) {
    case 'index.html':
      document.getElementById('nav-home')?.classList.add('active');
      break;
    case 'CP2388-worksheets.html':
      document.getElementById('nav-cp2388')?.classList.add('active');
      break;
    case 'tracking-dashboard.html':
      document.getElementById('nav-progress')?.classList.add('active');
      break;
    case 'about.html':
      document.getElementById('nav-about')?.classList.add('active');
      break;
    default:
      // If no specific match, check if it's a worksheet page
      if (currentPage.includes('worksheet-')) {
        document.getElementById('nav-cp2388')?.classList.add('active');
      } else {
        document.getElementById('nav-home')?.classList.add('active');
      }
      break;
  }
}

// Load navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  createSharedNavigation();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSharedNavigation, setActiveNavigationItem };
} 