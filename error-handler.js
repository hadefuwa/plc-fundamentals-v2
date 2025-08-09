// Error Handler for Industrial Maintenance Training System
// Gracefully handles service worker and resource loading errors

// Global error handler
window.addEventListener('error', function(event) {
  // Log the error for debugging
  console.warn('Error caught by global handler:', event.error);
  
  // Prevent the error from breaking the application
  event.preventDefault();
  
  // If it's a resource loading error, try to handle it gracefully
  if (event.target && event.target.tagName) {
    handleResourceError(event.target, event.error);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.warn('Unhandled promise rejection:', event.reason);
  
  // Prevent the rejection from breaking the application
  event.preventDefault();
  
  // If it's a fetch error, handle it gracefully
  if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
    handleFetchError(event.reason);
  }
});

// Handle resource loading errors
function handleResourceError(element, error) {
  if (element.tagName === 'IMG') {
    // Replace broken images with a fallback
    element.src = '/assets/icons/matrix-icon.png';
    element.onerror = null; // Prevent infinite loop
    console.log('Replaced broken image with fallback');
  } else if (element.tagName === 'SCRIPT') {
    // Handle script loading errors
    console.warn('Script loading failed:', element.src);
    // Try to load a fallback or continue without the script
  } else if (element.tagName === 'LINK') {
    // Handle CSS loading errors
    console.warn('CSS loading failed:', element.href);
  }
}

// Handle fetch errors
function handleFetchError(error) {
  console.warn('Fetch error handled:', error.message);
  
  // If it's a service worker fetch error, try to unregister and re-register
  if (error.message.includes('service-worker')) {
    handleServiceWorkerError();
  }
}

// Handle service worker errors
function handleServiceWorkerError() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function() {
          console.log('Service worker unregistered due to errors');
          // Optionally re-register after a delay
          setTimeout(() => {
            registerServiceWorker();
          }, 1000);
        });
      }
    });
  }
}

// Register service worker with error handling
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service worker registered successfully:', registration);
      })
      .catch(function(error) {
        console.warn('Service worker registration failed:', error);
        // Continue without service worker
      });
  }
}

// Initialize error handling
function initializeErrorHandling() {
  console.log('Error handling system initialized');
  
  // Add error handling to specific elements
  document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', function() {
        this.src = '/assets/icons/matrix-icon.png';
        console.log('Image error handled for:', this.src);
      });
    });
    
    // Handle script loading errors
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      script.addEventListener('error', function() {
        console.warn('Script loading failed:', this.src);
      });
    });
  });
}

// Safe function execution wrapper
function safeExecute(func, fallback = null) {
  try {
    return func();
  } catch (error) {
    console.warn('Function execution failed:', error);
    return fallback;
  }
}

// Safe async function execution wrapper
async function safeExecuteAsync(asyncFunc, fallback = null) {
  try {
    return await asyncFunc();
  } catch (error) {
    console.warn('Async function execution failed:', error);
    return fallback;
  }
}

// Resource availability checker
function checkResourceAvailability(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Initialize error handling when the script loads
initializeErrorHandling();

// Export functions for global access
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;
window.checkResourceAvailability = checkResourceAvailability;
window.handleResourceError = handleResourceError; 