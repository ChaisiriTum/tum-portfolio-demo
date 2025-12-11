
Tum Portfolio AI - Demo App
===========================

This repo contains a demo all-in-one app (backend + frontend) tailored for:
- Push Notifications (Web Push)
- Yahoo Finance as price source
- Blue theme
- App name: Tum Portfolio AI
- Demo deploy locally

Folders:
- backend/  => Node/Express server (api: /api/price/:symbol, trades, subscribe, send-demo-push)
- frontend/ => React demo (simple, PWA-ready service worker, upload excel, buy signals)

Quick start (local):
1) Backend:
   cd backend
   npm install
   # optionally set VAPID keys:
   # export VAPID_PUBLIC="..." && export VAPID_PRIVATE="..."
   npm start
   Backend will run on port 4000.

2) Frontend (demo):
   cd frontend
   npm install
   # for development you can use create-react-app or your preferred bundler.
   # the provided frontend is a simple demo; to run quickly, use `serve` to serve build output.
   npm run dev

Notes:
- For Web Push to work in localhost, use HTTPS or run in supported browsers with special flags.
- Replace web-push VAPID keys in backend or set env variables before sending real pushes.
- Yahoo Finance is used via `yahoo-finance2` package in backend.

Files generated in /mnt/data/portfolio_app_demo
