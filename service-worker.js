// Service Worker for Matrix IM6930 Curriculum
const CACHE_NAME = 'matrix-training-cache-v1';

// Resources to cache
const CORE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './CP2388-worksheets.html',
  './main.css',
  './manifest.json',
  './assets/matrix-logo.png',
  './assets/icons/matrix-icon-192.png',
  './assets/icons/matrix-icon-512.png'
];

// Additional assets to cache
const ADDITIONAL_ASSETS = [
  // JavaScript files
  './worksheet-core.js',
  './worksheet-tracking.js',
  './worksheet-maintenance-handler.js',
  './pwa-install.js',
  './scenario-popup.js',
  './pdf-popup.js',
  './image-fallback.js'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets...');
        // Cache core assets with individual error handling
        return Promise.allSettled(
          CORE_ASSETS.map(url => 
            cache.add(url).catch(err => {
              console.log(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('Core assets caching completed');
        // Cache additional assets in the background with error handling
        return caches.open(CACHE_NAME)
          .then(cache => 
            Promise.allSettled(
              ADDITIONAL_ASSETS.map(url => 
                cache.add(url).catch(err => {
                  console.log(`Failed to cache ${url}:`, err);
                  return null;
                })
              )
            )
          )
          .catch(err => console.log('Additional assets caching error:', err));
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        // Take control immediately
        return clients.claim();
      })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests that aren't CDN
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Serve from cache
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        // Make network request
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            // Cache the new resource (only for successful responses)
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => console.log('Cache put error:', err));

            return response;
          })
          .catch(error => {
            console.log('Fetch failed for:', event.request.url, error);
            // For CDN failures, just return the original request to let the browser handle it
            if (event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
              return fetch(event.request);
            }
            // For local resources, you could return a custom offline page here
            return new Response('Network error', { status: 503 });
          });
      })
  );
}); 