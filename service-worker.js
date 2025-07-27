// Disabled Service Worker - Minimal version to prevent fetch errors
// This service worker does nothing to avoid interfering with image loading

const CACHE_NAME = 'matrix-training-cache-disabled';

self.addEventListener('install', event => {
  console.log('Service worker installing (disabled mode)...');
  // Skip to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service worker activating (disabled mode)...');
  // Clear all caches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        console.log('Deleting cache:', key);
        return caches.delete(key);
      }))
    )
  );
});

// No fetch handler - let browser handle all requests normally 