// src/App.jsx
import React from 'react';
import UploadExcel from './components/UploadExcel';

export default function App() {
  return (
    <div className="app" style={{ padding: 24 }}>
      <h1>Tum Portfolio AI (Demo)</h1>

      <section style={{ marginTop: 24 }}>
        <UploadExcel />
      </section>
    </div>
  );
}
