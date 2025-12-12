// frontend/src/config.js
export const API_URL = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL)
  ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') // เอา / ท้ายออก
  : '';

