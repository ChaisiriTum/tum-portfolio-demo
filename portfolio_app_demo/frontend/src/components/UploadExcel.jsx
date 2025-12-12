// src/components/UploadExcel.jsx
import React from 'react';
import * as XLSX from 'xlsx';

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
      console.log('Excel parsed:', json);
      alert(`อ่านไฟล์เสร็จ! rows: ${json.length}. ดู console.log เพื่อข้อมูลตัวอย่าง`);
      // TODO: ส่ง json ไป backend หรือแสดงบน UI
    } catch (err) {
      console.error('Error parsing excel', err);
      alert('อ่านไฟล์ไม่สำเร็จ ดู console.log');
    }
  };

  return (
    <div className="card" style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
      <h3>Upload แผน Excel (เวอร์ชันพรีเมียม)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}
