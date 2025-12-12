// src/index.jsx (ตัวอย่าง)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(<App />, document.getElementById('root'));

// inline SW register (ถ้าไม่อยากเพิ่มไฟล์)
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
