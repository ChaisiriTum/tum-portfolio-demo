// frontend/src/components/UploadExcel.jsx
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { API_URL } from '../config'; // ตรวจว่ามีไฟล์ config.js ที่ export ตัวแปรนี้

export default function UploadExcel() {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]); // parsed rows preview
  const [status, setStatus] = useState('idle'); // idle | parsing | sending | done | error
  const [errorMsg, setErrorMsg] = useState('');

  // ฟังก์ชันส่งข้อมูลขึ้น backend (POST JSON)
  async function sendToBackend(parsedRows) {
    if (!API_URL) {
      setErrorMsg('API_URL not configured. Please set VITE_BACKEND_URL.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/upload-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(`Backend returned ${res.status}: ${text || res.statusText}`);
      }

      const data = await res.json().catch(() => null);
      console.log('Backend response:', data);
      setStatus('done');
    } catch (err) {
      console.error('Backend error:', err);
      setErrorMsg(String(err));
      setStatus('error');
    }
  }

  // อ่านไฟล์ Excel แล้ว parse เป็น JSON
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('parsing');
    setErrorMsg('');
    setRows([]);

    try {
      // อ่านไฟล์เป็น ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // ผมแปลงทุก sheet เป็น json แล้วรวมเป็น array ของ rows
      const allRows = [];
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
        // ใส่ชื่อ sheet ให้แต่ละ row (ถ้าต้องการ)
        const withSheet = json.map((r) => ({ __sheet: sheetName, ...r }));
        allRows.push(...withSheet);
      });

      console.log('Excel parsed:', allRows);
      setRows(allRows);
      setStatus('idle');

      // ถ้าต้องการส่งอัตโนมัติขึ้น backend ให้เปิดบรรทัดนี้:
      if (allRows.length > 0) {
        await sendToBackend(allRows);
      }
    } catch (err) {
      console.error('Error parsing excel:', err);
      setErrorMsg(String(err));
      setStatus('error');
    }
  };

  return (
    <div className="card" style={{
      padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
    }}>
      <h3>Upload แผน Excel (เวอร์ชันพรีเมียม)</h3>

      <div style={{ marginTop: 8 }}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
        />
        {fileName ? <span style={{ marginLeft: 12 }}>{fileName}</span> : null}
      </div>

      <div style={{ marginTop: 12 }}>
        {status === 'parsing' && <div>Parsing Excel…</div>}
        {status === 'sending' && <div>Sending to backend…</div>}
        {status === 'done' && <div style={{ color: 'green' }}>Sent to backend successfully.</div>}
        {status === 'error' && <div style={{ color: 'crimson' }}>Error: {errorMsg}</div>}
      </div>

      <div style={{ marginTop: 14 }}>
        <strong>Preview (first 5 rows):</strong>
        <div style={{
          marginTop: 8,
          maxHeight: 220,
          overflow: 'auto',
          border: '1px solid #eee',
          borderRadius: 6,
          padding: 8,
          background: '#fafafa'
        }}>
          {rows.length === 0 && <div style={{ color: '#888' }}>ยังไม่มีข้อมูล (เลือกไฟล์เพื่อ parse)</div>}
          {rows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {Object.keys(rows[0]).slice(0, 8).map((k) => (
                    <th key={k} style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={i}>
                    {Object.keys(rows[0]).slice(0, 8).map((k) => (
                      <td key={k} style={{ padding: 6, borderBottom: '1px solid #f5f5f5' }}>
                        {String(r[k] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, color: '#666', fontSize: 13 }}>
        <div>Note:</div>
        <ul>
          <li>ระบบจะส่ง POST ไปที่ <code>{API_URL ? `${API_URL.replace(/\/$/, '')}/api/upload-excel` : 'API_URL ไม่ได้ตั้งค่า'}</code></li>
          <li>ตรวจสอบว่า backend มี endpoint <code>POST /api/upload-excel</code> และยอมรับ JSON</li>
          <li>ถ้า CORS ขึ้น ให้เปิดบน server หรือแก้ header ที่ backend</li>
        </ul>
      </div>
    </div>
  );
}
