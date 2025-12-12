// src/components/UploadExcel.jsx
import React from 'react';
import * as XLSX from 'xlsx';
import { API_URL } from '../config';   // ⭐ สำคัญ

export default function UploadExcel() {

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

      console.log('[Excel parsed]', json);

      // ⭐ ส่ง Excel JSON ไป backend
      const res = await fetch(`${API_URL}/api/upload-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: json })
      });

      const result = await res.json();
      console.log('[UploadExcel → backend result]', result);

      alert('อัปโหลดสำเร็จ ดูผลลัพธ์ใน Console ได้เลย');

    } catch (err) {
      console.error('Error parsing Excel or uploading:', err);
      alert('เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="card" style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
      <h3>Upload แผน Excel (เวอร์ชันพรีเมียม)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}
