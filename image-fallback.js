// Image Fallback System
// Handles broken images gracefully

// Create a simple fallback image
function createFallbackImage(width = 200, height = 150) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Draw a simple placeholder
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#666';
  ctx.fillRect(10, 10, width - 20, height - 20);
  ctx.fillStyle = '#999';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Image', width / 2, height / 2 - 10);
  ctx.fillText('Not Available', width / 2, height / 2 + 10);
  
  return canvas.toDataURL();
}

// Handle image loading errors
function handleImageError(img) {
  console.log('Image failed to load:', img.src);
  
  // Create fallback image
  const fallbackDataUrl = createFallbackImage(img.width || 200, img.height || 150);
  
  // Set fallback image
  img.src = fallbackDataUrl;
  img.alt = 'Image not available';
  
  // Remove error handler to prevent infinite loop
  img.onerror = null;
}

// Initialize image fallback system
function initializeImageFallbacks() {
  // Handle existing images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      img.addEventListener('error', () => handleImageError(img));
    }
  });
  
  // Handle dynamically added images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG') {
            node.addEventListener('error', () => handleImageError(node));
          } else {
            const images = node.querySelectorAll('img');
            images.forEach(img => {
              img.addEventListener('error', () => handleImageError(img));
            });
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeImageFallbacks);
} else {
  initializeImageFallbacks();
}

// Export for global access
window.handleImageError = handleImageError;
window.createFallbackImage = createFallbackImage; 