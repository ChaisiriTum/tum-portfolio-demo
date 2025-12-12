// public/service-worker.js
self.addEventListener('install', (event) => {
  console.log('[SW] install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.text() : 'New notification';
  const options = {
    body: payload,
    icon: '/icons/icon-192.png'
  };
  event.waitUntil(self.registration.showNotification('Tum Portfolio AI', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
