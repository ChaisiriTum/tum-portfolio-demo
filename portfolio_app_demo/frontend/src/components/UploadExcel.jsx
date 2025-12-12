import React from "react";
import * as XLSX from "xlsx";

function UploadExcel() {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log("excel json", json);
      // TODO: แปลง json ให้เข้ากับ template และส่งไป backend
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="card">
      <h3>Upload แผน Excel (เวอร์ชันพรีเมียม)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
    </div>
  );
}

export default UploadExcel;
