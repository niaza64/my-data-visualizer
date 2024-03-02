import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

const FileUploader = ({ onColumnSelectForVisual }) => {
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [fileData, setFileData] = useState([]);
  const fileInputRef = useRef(null); // Add this line

  const sanitizeKey = (key) => key.trim().replace(/^"+|"+$/g, '');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }).map(row => {
          const sanitizedRow = {};
          Object.keys(row).forEach(key => {
            const sanitizedKey = sanitizeKey(key);
            sanitizedRow[sanitizedKey] = row[key];
          });
          return sanitizedRow;
        });
        setFileData(jsonData);
        setColumns(Object.keys(jsonData[0]).map(sanitizeKey));
      };
      reader.readAsBinaryString(file);
    } else {
      resetFileUploadState();
    }
  };

  const resetFileUploadState = () => {
    setFileName('');
    setFileData([]);
    setColumns([]);
    setSelectedColumn('');
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset the file input
  };
  
  const handleColumnSelect = (event) => {
    const column = event.target.value;
    setSelectedColumn(column);

    const columnData = fileData.map(row => {
        return { [column]: row[column] };
      });

    onColumnSelectForVisual(columnData);
  };

  return (
    <div className="flex justify-center items-center bg-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <p className="text-lg text-blue-800 font-semibold mb-4">Upload your Excel file to visualize the data.</p>
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="file-upload" className="relative cursor-pointer">
            <span className="px-4 py-2 text-blue-800 border border-blue-300 rounded-md hover:bg-blue-300 transition duration-300 ease-in-out">Choose file</span>
            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".xlsx, .xls" />
          </label>
          <p className="text-blue-600">or drag and drop</p>
          {columns.length > 0 && (
            <select value={selectedColumn} onChange={handleColumnSelect} className="form-select">
              <option value="">Select a column to visualize</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>
                  {column}
                </option>
              ))}
            </select>
          )}
          {fileName && <button onClick={resetFileUploadState} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 ease-in-out">Remove File</button>}
        </div>
        <p className="text-xs text-blue-500 mt-1">XLS, XLSX up to 10MB</p>
        <div className="text-sm font-medium text-blue-700 mt-2">
          {fileName || "No file chosen"}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
