# Guide: Making the Closed Loop PWA Installable Like a Real App

This guide enables users to install the app to their device (desktop or mobile) with offline support, like a native application.

---

## ✅ 1. Include a Valid Web App Manifest

Place a `manifest.json` in the root of the project:

```json
{
  "name": "Closed Loop Maintenance App",
  "short_name": "Closed Loop",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0055ff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/icons/icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

In `index.html`, link it:

```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0055ff" />
```

---

## ✅ 2. Add a Service Worker

Create a `service-worker.js` file to cache the app’s static assets:

```js
const CACHE_NAME = "closed-loop-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/worksheet-1.html",
  "/worksheet-2.html",
  "/worksheet-3.html",
  "/worksheet-4.html",
  "/worksheet-5.html",
  "/plc-simulation.js",
  "/styles.css",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});
```

---

## ✅ 3. Register the Service Worker in JavaScript

In `index.html` or `main.js`:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch(console.error);
}
```

---

## ✅ 4. Ensure Hosting is over HTTPS or `localhost`

Service workers and install prompts only work on:
- A secure domain (`https://yourdomain.com`)
- Or `http://localhost` for development

---

## ✅ 5. Optional: Add `install` Prompt Control (Optional)

To manually show the “Install” banner:

```js
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show your install button
  document.getElementById("installBtn").style.display = "block";

  document.getElementById("installBtn").addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  });
});
```

---

## ✅ 6. Test and Verify

- Open in Chrome.
- Check DevTools > Application tab:
  - Service worker registered.
  - Manifest loaded.
  - App is installable.
- Click browser install icon or test install prompt.