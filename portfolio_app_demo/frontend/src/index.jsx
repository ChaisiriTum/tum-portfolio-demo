import './register-service-worker';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';
import './register-service-worker';

ReactDOM.render(<App />, document.getElementById('root'));

// register service worker (from public/service-worker.js)
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
