
import React, {useEffect, useState} from 'react';
import UploadExcel from './UploadExcel';
import BuySignals from './BuySignals';

export default function Dashboard(){
  const [signals, setSignals] = useState([]);
  const [priceQQQ, setPriceQQQ] = useState(null);

  useEffect(()=> {
    // fetch demo price
    fetch('http://localhost:4000/api/price/QQQ')
      .then(r=>r.json()).then(d=>{
        setPriceQQQ(d.price);
      }).catch(()=>{});
  },[]);

  const handleSignals = (s) => setSignals(s);

  return (
    <div>
      <div className="header">
        <div>
          <div className="h1">Tum Portfolio AI (Demo)</div>
          <div className="small">Demo Dashboard — Push Notifications enabled</div>
        </div>
        <div>
          <button className="btn" onClick={()=>{
            // request permission and subscribe
            if('serviceWorker' in navigator && 'PushManager' in window){
              navigator.serviceWorker.register('/service-worker.js').then(async reg=>{
                const sub = await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey: localStorage.getItem('vapidPublic') || ''});
                // send subscription to backend
                await fetch('http://localhost:4000/api/subscribe', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});
                alert('Subscribed to Push (demo). Now backend can send demo pushes.');
              }).catch(e=> alert('ServiceWorker error: '+e.message));
            } else alert('Push not supported in this browser');
          }}>Subscribe Push</button>
        </div>
      </div>

      <div className="card">
        <h3>ราคาล่าสุด QQQ (จาก Yahoo)</h3>
        <div style={{fontSize:28,fontWeight:700}}>{priceQQQ ? priceQQQ : 'N/A'}</div>
      </div>

      <UploadExcel onData={(d)=> console.log('excel', d)} />

      <BuySignals onCheck={(s)=> handleSignals(s)} />

      <div className="card">
        <h3>สัญญาณล่าสุด</h3>
        <pre>{JSON.stringify(signals, null, 2)}</pre>
      </div>
    </div>
  );
}
