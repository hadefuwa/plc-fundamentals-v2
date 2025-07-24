const CACHE_NAME = 'matrix-training-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/worksheets.html',
  '/cp0539-worksheets.html',
  '/cp6773-worksheets.html',
  '/settings.html',
  '/worksheet.html',
  '/main.css',
  '/manifest.json',
  '/scenario-popup.js',
  '/pdf-popup.js',
  '/dbMaintenanceScenarios.json',
  '/dbFaultScenarios.json',
  '/assets/icons/matrix-icon-192.png',
  '/assets/icons/matrix-icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return a fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => {
        console.log('Deleting old cache:', key);
        return caches.delete(key);
      }))
    )
  );
}); 