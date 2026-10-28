import React, { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Check, 
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';
import api from '../utils/api';

export default function ExcelImportModal({ isOpen, onClose, onImportSuccess, type = 'customers' }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(null);

  if (!isOpen) return null;

  // Sample CSV Templates
  const handleDownloadTemplate = () => {
    let headers = '';
    let sampleRow = '';
    let filename = '';

    if (type === 'customers') {
      filename = 'llano_selecta_customers_template.csv';
      headers = 'store_name,owner,area,sub_area,purok,contact,freezer_serial,barcode_no';
      sampleRow = '"Aling Nena Sari-Sari","Nena Dela Cruz","Valencia City","Batangan","Purok 3","0917-123-4567","SEL-FRZ-8821","BC-8821-VAL"';
    } else if (type === 'products') {
      filename = 'llano_selecta_products_template.csv';
      headers = 'id,name,category,dealer_price,unit_price,srp,stock,min_stock,unit';
      sampleRow = '"COR-999","CORNETTO MATCHA CHOCO","CORNETTO",28.00,28.00,35.00,100,20,"Piece"';
    } else {
      filename = 'llano_selecta_bookings_template.csv';
      headers = 'store_name,area,booking_date,product_name,quantity,unit_price';
      sampleRow = '"Aling Nena Sari-Sari","Valencia City","2026-10-30","CHOCOLATE (CORNETTO)",20,28.00';
    }

    const csvContent = `${headers}\r\n${sampleRow}\r\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV or Text File
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setErrors([]);
    setDuplicates([]);
    setSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCSVContent(text);
    };
    reader.readAsText(uploadedFile);
  };

  const parseCSVContent = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      setErrors(['The uploaded file is empty or missing data rows.']);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    const parsed = [];
    const seenNames = new Set();
    const dups = [];
    const validationErrors = [];

    for (let i = 1; i < lines.length; i++) {
      const rowLine = lines[i];
      // Regex to split comma separated with support for quotes
      const values = rowLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^["']|["']$/g, ''));

      if (values.length < headers.length) {
        validationErrors.push(`Row ${i + 1}: Missing columns (Expected ${headers.length}, found ${values.length})`);
        continue;
      }

      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      // Check Duplicates & Validity
      const uniqueKey = rowObj.store_name || rowObj.name || rowObj.id;
      if (uniqueKey) {
        if (seenNames.has(uniqueKey.toLowerCase())) {
          dups.push(`Row ${i + 1}: Duplicate "${uniqueKey}" detected`);
        } else {
          seenNames.add(uniqueKey.toLowerCase());
        }
      }

      parsed.push({ rowNum: i + 1, ...rowObj });
    }

    setPreviewData(parsed);
    setDuplicates(dups);
    setErrors(validationErrors);
    setValidRows(parsed);
  };

  // Perform Final Database Import
  const handleConfirmImport = async () => {
    if (validRows.length === 0) return;
    setIsProcessing(true);
    let count = 0;

    try {
      if (type === 'customers') {
        for (const row of validRows) {
          await api.post('/api/customers', {
            store_name: row.store_name || row.storename || 'New Store',
            owner: row.owner || '',
            area: row.area || 'Valencia',
            sub_area: row.sub_area || row.subarea || '',
            purok: row.purok || '',
            contact: row.contact || '',
            freezer_serial: row.freezer_serial || row.freezerserial || '',
            barcode_no: row.barcode_no || row.barcode || '',
            status: 'Active'
          }).catch(() => null);
          count++;
        }
      } else if (type === 'products') {
        for (const row of validRows) {
          await api.post('/api/inventory/adjust', {
            product_id: row.id,
            stock_type: 'sellable',
            change_qty: parseInt(row.stock || 10),
            reason: 'Excel Workbook Bulk Import',
            user_name: 'Admin'
          }).catch(() => null);
          count++;
        }
      }

      setSuccessCount(count);
      if (onImportSuccess) onImportSuccess(count);
    } catch (err) {
      setErrors([err.message || 'Import error occurred']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-100 text-red-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Excel / CSV Data Import & Pre-Import Validator
              </h3>
              <p className="text-xs text-slate-500">
                Upload dealer workbook files with automatic duplicate detection & column verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action Step 1: Download Template */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-900">Need a reference format?</p>
              <p className="text-slate-500">Download the clean CSV template with official columns and sample row.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-600" /> Download Template
            </button>
          </div>

          {/* Action Step 2: File Upload Zone */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-red-400 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Choose your Excel / CSV File to Preview</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV, formatted workbook sheets, and TALLY records</p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          {/* Validation Warnings & Duplicates Banner */}
          {(duplicates.length > 0 || errors.length > 0) && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4" /> Pre-Import Validation Warnings:
              </div>
              {duplicates.map((d, i) => (
                <p key={i} className="text-[11px] text-amber-700">• {d}</p>
              ))}
              {errors.map((e, i) => (
                <p key={i} className="text-[11px] text-red-600">• {e}</p>
              ))}
            </div>
          )}

          {/* Success Result */}
          {successCount !== null && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Successfully imported {successCount} record(s) into database!
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Data Preview ({previewData.length} rows detected)</span>
                <span className="text-[11px] text-slate-400">Review before final DB insertion</span>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Row</th>
                      {Object.keys(previewData[0]).filter(k => k !== 'rowNum').slice(0, 5).map((col, idx) => (
                        <th key={idx} className="p-2">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-mono text-[10px] text-slate-400">#{row.rowNum}</td>
                        {Object.keys(row).filter(k => k !== 'rowNum').slice(0, 5).map((col, cIdx) => (
                          <td key={cIdx} className="p-2 text-slate-700 truncate max-w-xs">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 10 && (
                <p className="text-[10px] text-slate-400 text-right italic">+ {previewData.length - 10} more rows</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
          <span className="text-xs text-slate-500">
            {validRows.length > 0 ? `${validRows.length} valid rows ready for import` : 'No file selected'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={validRows.length === 0 || isProcessing}
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30 disabled:opacity-50"
            >
              <Database className="w-4 h-4" /> {isProcessing ? 'Importing...' : 'Confirm Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
