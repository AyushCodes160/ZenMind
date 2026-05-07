const CACHE_NAME = 'zen-alpha-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/zen-ai.html',
  '/community.html',
  '/quotes.html',
  '/videos.html',
  '/meditation.html',
  '/journal.html',
  '/zen-styles.css',
  '/zen-nav.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
