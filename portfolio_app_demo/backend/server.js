
/*
Backend server for Portfolio Demo
Features:
- Yahoo Finance price fetch using 'yahoo-finance2' (npm package)
- Simple trades CRUD (sqlite)
- Web-push endpoint for storing subscription and sending demo push
Note: Replace VAPID keys before production. For demo you can generate via web-push CLI.
*/
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fetch = require('node-fetch');
const yahooFinance = require('yahoo-finance2').default;
const webpush = require('web-push');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// load or create VAPID keys (demo - replace for production)
let VAPID = { publicKey: process.env.VAPID_PUBLIC || '', privateKey: process.env.VAPID_PRIVATE || '' };
if(!VAPID.publicKey || !VAPID.privateKey){
  console.log("No VAPID keys in env. Please generate and set VAPID_PUBLIC and VAPID_PRIVATE for real pushes.");
}

// configure web-push (will fail silently if keys empty)
try {
  webpush.setVapidDetails('mailto:demo@tumportfolio.ai', VAPID.publicKey, VAPID.privateKey);
} catch(e){
  console.log("web-push not configured: " + e.message);
}

// init sqlite
const dbFile = './db.sqlite';
const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    asset TEXT,
    price REAL,
    units REAL,
    amount REAL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT,
    keys TEXT
  )`);
});

// trades endpoints
app.get('/api/trades', (req,res)=>{
  db.all('SELECT * FROM trades ORDER BY id DESC', (err,rows)=>{
    if(err) return res.status(500).json({err: err.message});
    res.json(rows);
  });
});
app.post('/api/trades', (req,res)=>{
  const { date, asset, price, units, amount } = req.body;
  db.run(`INSERT INTO trades (date, asset, price, units, amount) VALUES (?,?,?,?,?)`,
    [date, asset, price, units, amount],
    function(err){
      if(err) return res.status(500).json({err: err.message});
      res.json({id: this.lastID});
    });
});

// subscription endpoints
app.post('/api/subscribe', (req,res)=>{
  const sub = req.body;
  db.run(`INSERT INTO subscriptions (endpoint, keys) VALUES (?,?)`, [sub.endpoint, JSON.stringify(sub.keys)], function(err){
    if(err) return res.status(500).json({err: err.message});
    res.json({id: this.lastID});
  });
});

app.post('/api/send-demo-push', async (req,res)=>{
  // send demo push to all subscriptions
  db.all('SELECT * FROM subscriptions', async (err, rows)=>{
    if(err) return res.status(500).json({err:err.message});
    const payload = JSON.stringify({ title: 'Tum Portfolio AI', body: 'Demo alert: QQQ crossed trigger' });
    for(const r of rows){
      try {
        const sub = { endpoint: r.endpoint, keys: JSON.parse(r.keys) };
        await webpush.sendNotification(sub, payload);
      } catch(e){
        console.log("Push error:", e.message);
      }
    }
    res.json({sent: rows.length});
  });
});

// Yahoo Finance price endpoint
app.get('/api/price/:symbol', async (req,res)=>{
  const symbol = req.params.symbol;
  try {
    // Using yahoo-finance2 to fetch quote
    const quote = await yahooFinance.quote(symbol);
    res.json({ symbol, price: quote.regularMarketPrice, timestamp: quote.regularMarketTime });
  } catch(e){
    res.status(500).json({error: e.message});
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Backend running on ${PORT}`));
