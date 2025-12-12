// public/service-worker.js
const CACHE_NAME = 'tum-portfolio-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // เพิ่มไฟล์ assets ที่อยาก cache
];

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch (basic cache-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});
