
import React from 'react';
import * as XLSX from 'xlsx';

export default function UploadExcel({onData}){
  const handleFile = async (e) => {
    const f = e.target.files[0];
    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, {header:1});
    onData(json);
    alert('ไฟล์อ่านแล้ว (demo).');
  };
  return (
    <div className="card">
      <h3>Upload แผน Excel (เวอร์ชันพรีเมียม)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}
