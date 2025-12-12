import React from 'react';
import { API_URL } from '../config';

export default function BuySignals({ onCheck }) {

  const check = async () => {
    try {
      const res = await fetch(`${API_URL}/api/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      alert('เช็คสัญญาณจาก backend (demo) ดู Console');

      console.log('[BuySignals Demo]', data);

      onCheck(data.signals || []);

    } catch (err) {
      console.error('Fetch error:', err);
      onCheck([]);
    }
  };

  return (
    <div className="card">
      <h3>Buy Signals (Demo)</h3>
      <p>กดปุ่มเพื่อดึงสัญญาณซื้อจาก backend (demo)</p>
      <button className="btn" onClick={check}>ตรวจสอบสัญญาณ</button>
    </div>
  );
}
