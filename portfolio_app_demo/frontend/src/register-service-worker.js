// src/register-service-worker.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[SW] Registered:', reg);
    } catch (err) {
      console.error('[SW] Register failed:', err);
    }
  });
}
