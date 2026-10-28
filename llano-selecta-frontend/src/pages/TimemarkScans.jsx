import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Search, 
  Plus, 
  Filter, 
  Printer, 
  Calendar, 
  Snowflake, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  FileText, 
  Upload, 
  User, 
  Check, 
  X, 
  Eye, 
  Sparkles,
  Barcode,
  Image as ImageIcon
} from 'lucide-react';
import { formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function TimemarkScans() {
  const { currentUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [freezers, setFreezers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7)); // e.g. '2026-10'
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    freezer_id: '',
    store_id: '',
    store_name: '',
    freezer_code: '',
    reporting_month: new Date().toISOString().slice(0, 7),
    scan_date: new Date().toISOString(),
    staff_name: currentUser?.name || 'Field Inspector',
    photo_url: '',
    notes: '',
    verification_status: 'Verified'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, fData] = await Promise.all([
        api.get('/api/freezer-scans').catch(() => []),
        api.get('/api/freezers').catch(() => [])
      ]);
      setScans(Array.isArray(sData) ? sData : []);
      setFreezers(Array.isArray(fData) ? fData : []);
    } catch (err) {
      console.error('Failed to load freezer scans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Freezer selection in upload modal
  const handleSelectFreezer = (e) => {
    const frzId = e.target.value;
    const selected = freezers.find(f => f.id === frzId || f.selecta_number === frzId || f.serial_number === frzId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        freezer_id: selected.id,
        store_id: selected.assigned_store || '',
        store_name: selected.assigned_store || 'Customer Store',
        freezer_code: selected.barcode || selected.barcode_no || selected.selecta_number || selected.serial_number || ''
      }));
    }
  };

  // Photo file upload & preview conversion
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit freezer scan record
  const handleSubmitScan = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.freezer_code) {
      setErrorMsg('Freezer Code or Barcode is required.');
      return;
    }

    try {
      await api.post('/api/freezer-scans', formData);
      setSuccessMsg('Timemark freezer scan evidence recorded successfully.');
      setIsUploadModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save scan');
    }
  };

  // Delete scan
  const handleDeleteScan = async (id) => {
    if (!window.confirm('Delete this freezer scan record?')) return;
    try {
      await api.delete(`/api/freezer-scans/${id}`);
      setSuccessMsg('Scan record removed');
      loadData();
    } catch (err) {
      setErrorMsg('Failed to delete scan');
    }
  };

  // Filtered scans
  const filteredScans = scans.filter(s => {
    const matchesSearch = (s.store_name && s.store_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.freezer_code && s.freezer_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.staff_name && s.staff_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || s.verification_status === statusFilter;
    const matchesMonth = !monthFilter || s.reporting_month === monthFilter;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Calculate compliance for current month across all freezers
  const totalFreezers = freezers.length || 8;
  const scannedThisMonth = freezers.filter(f => {
    return scans.some(s => 
      (s.freezer_id === f.id || s.freezer_code === f.barcode || s.freezer_code === f.selecta_number) &&
      s.reporting_month === monthFilter
    );
  }).length;
  const overdueCount = Math.max(0, totalFreezers - scannedThisMonth);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Monthly Timemark Freezer Scans
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
              Asset Audit Compliance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record monthly mobile Timemark freezer inspections, bar code verification, and photo timestamp evidence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Audit Sheet
          </button>
          <button
            onClick={() => {
              setFormData({
                freezer_id: freezers[0]?.id || '',
                store_id: freezers[0]?.assigned_store || '',
                store_name: freezers[0]?.assigned_store || '',
                freezer_code: freezers[0]?.barcode || freezers[0]?.selecta_number || '',
                reporting_month: new Date().toISOString().slice(0, 7),
                scan_date: new Date().toISOString(),
                staff_name: currentUser?.name || 'Field Inspector',
                photo_url: '',
                notes: '',
                verification_status: 'Verified'
              });
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30"
          >
            <Camera className="w-4 h-4" /> Upload Timemark Scan
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            {errorMsg}
          </div>
          <button onClick={() => setErrorMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Selecta-Owned Freezers</span>
            <Snowflake className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalFreezers} Assets</p>
          <p className="text-[11px] text-slate-400 mt-1">Deployed in customer stores</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Scanned this Month</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {scannedThisMonth} / {totalFreezers}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {((scannedThisMonth / totalFreezers) * 100).toFixed(0)}% month compliance
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Due / Overdue Scans</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{overdueCount} Pending</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires staff photo visit</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Audit Compliance</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">
            {monthFilter}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Monthly reporting cycle</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search store, code, staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500 w-52 sm:w-64"
            />
          </div>

          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredScans.length}</strong> photo scan(s)
        </span>
      </div>

      {/* Scans Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Freezer Code & ID</th>
                <th className="py-3 px-3">Assigned Customer Store</th>
                <th className="py-3 px-3">Reporting Month</th>
                <th className="py-3 px-3">Scan Date & Staff</th>
                <th className="py-3 px-3 text-center">Timemark Photo</th>
                <th className="py-3 px-3">Notes & Condition</th>
                <th className="py-3 px-3 text-center">Verification</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No Timemark scan records found for this period. Click "Upload Timemark Scan" to add one.
                  </td>
                </tr>
              ) : (
                filteredScans.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                        <Barcode className="w-4 h-4 text-slate-400" />
                        <span>{s.freezer_code || 'SEL-FRZ'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{s.freezer_id || s.id}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {s.store_name || 'Customer Store'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 font-bold text-[10px]">
                        {s.reporting_month}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{formatDate(s.scan_date)}</div>
                      <div className="text-[10px] text-slate-400">By: {s.staff_name}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {s.photo_url ? (
                        <button
                          onClick={() => setSelectedPhoto(s.photo_url)}
                          className="relative inline-block rounded-lg overflow-hidden border border-slate-200 group"
                        >
                          <img
                            src={s.photo_url}
                            alt="Scan Evidence"
                            className="w-10 h-10 object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {s.notes || 'Timemark barcode verified.'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        s.verification_status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        s.verification_status === 'Flagged' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteScan(s.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg text-xs font-bold"
                        title="Remove record"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD SCAN EVIDENCE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-black text-slate-900">Upload Monthly Timemark Scan</h3>
                <p className="text-xs text-slate-500">Capture or upload photo evidence showing freezer barcode stamp</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitScan} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Freezer / Store</label>
                <select
                  required
                  value={formData.freezer_id}
                  onChange={handleSelectFreezer}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="">-- Choose Assigned Freezer --</option>
                  {freezers.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.serial_number || f.selecta_number || f.id} — {f.assigned_store || 'Unassigned'} ({f.barcode || f.barcode_no || 'No Barcode'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Freezer Code / Barcode</label>
                  <input
                    type="text"
                    required
                    value={formData.freezer_code}
                    onChange={(e) => setFormData({ ...formData, freezer_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    placeholder="e.g. BC-8821-VAL"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reporting Month</label>
                  <input
                    type="month"
                    required
                    value={formData.reporting_month}
                    onChange={(e) => setFormData({ ...formData, reporting_month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inspecting Staff</label>
                  <input
                    type="text"
                    value={formData.staff_name}
                    onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Verification Status</label>
                  <select
                    value={formData.verification_status}
                    onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Verified">Verified (Clean Scan)</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Flagged">Flagged (Defaced Barcode / Damaged)</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Timemark Photo Evidence</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-red-400 transition-colors">
                  {formData.photo_url ? (
                    <div className="space-y-2">
                      <img
                        src={formData.photo_url}
                        alt="Evidence Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain shadow-sm border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photo_url: '' })}
                        className="text-xs text-red-600 font-bold hover:underline"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Take photo or upload image showing the freezer code with Timemark stamp
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Inspection Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Freezer condition, temperature reading, glass top cleanliness..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save Timemark Scan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW LIGHTBOX */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-3 shadow-2xl" onClick={e => e.stopPropagation()}>
            <img
              src={selectedPhoto}
              alt="Full evidence"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
