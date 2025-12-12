// frontend/src/config.js
export const API_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL) ||
  process.env.REACT_APP_BACKEND_URL ||
  ''; // ถ้าไม่ตั้ง env จะเป็นค่าว่าง
