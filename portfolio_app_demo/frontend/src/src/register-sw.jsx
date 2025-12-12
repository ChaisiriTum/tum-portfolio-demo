// src/register-sw.js
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[SW] Registered:', reg);
      return reg;
    } catch (err) {
      console.error('[SW] Register failed:', err);
      return null;
    }
  } else {
    console.warn('[SW] Service workers not supported');
    return null;
  }
}
