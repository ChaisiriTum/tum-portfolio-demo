// frontend/src/components/UploadExcel.jsx
import React from 'react';
import * as XLSX from 'xlsx';
import { API_URL } from '../config';

export default function UploadExcel() {
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

      console.log('Excel parsed:', json);

      // ถ้าไม่มี API_URL แจ้งเตือน
      if (!API_URL) {
        console.warn('No API_URL configured. Set VITE_BACKEND_URL in Vercel.');
        alert('ยังไม่ได้ตั้งค่า backend URL (VITE_BACKEND_URL)');
        return;
      }

      // ส่งข้อมูลไป backend
      const res = await fetch(`${API_URL}/api/upload-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: json }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error('Backend returned non-OK:', res.status, text);
        alert(`Backend error: ${res.status}`);
        return;
      }

      const result = await res.json().catch(() => null);
      console.log('Backend response:', result);
      alert('อัปโหลดสำเร็จ! ดูผลใน console');
    } catch (err) {
      console.error('Error reading or sending file:', err);
      alert('Error: ดู console สำหรับรายละเอียด');
    }
  };

  return (
    <div className="card" style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
      <h3>Upload แผน Excel (เวอร์ชันทดลอง)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}
