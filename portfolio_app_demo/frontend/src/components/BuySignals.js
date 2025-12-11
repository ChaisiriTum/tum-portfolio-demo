
import React from 'react';

export default function BuySignals({onCheck}){
  const check = async ()=>{
    // demo: call backend alerts endpoint with sample assets
    const payload = { assets: [
      { symbol: 'QQQ', highest: 450, currentPrice: 380, triggerPercent: -10, highestPrice:450 },
      { symbol: 'SOXX', highest: 600, currentPrice: 480, triggerPercent: -15, highestPrice:600 }
    ]};
    const res = await fetch('http://localhost:4000/api/alerts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json();
    alert('Signals checked (demo). See console.');
    console.log(data);
    onCheck(data.signals || []);
  };
  return (
    <div className="card">
      <h3>Buy Signals (Demo)</h3>
      <p className="small">กดปุ่มเพื่อตรวจสอบสัญญาณจาก backend (demo)</p>
      <button className="btn" onClick={check}>ตรวจสอบสัญญาณ</button>
    </div>
  );
}
