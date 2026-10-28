import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  X, 
  MapPin, 
  BarChart3, 
  ArrowUpRight, 
  Clock, 
  Zap,
  ChevronRight,
  Plus,
  Printer,
  FileCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function QuotaTracker() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quotaEntries, setQuotaEntries] = useState([]);
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(1000000.00); // Default ₱1,000,000
  const [currentMonth, setCurrentMonth] = useState('2026-10'); // YYYY-MM
  const [targetNotes, setTargetNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isAdjustTargetModalOpen, setIsAdjustTargetModalOpen] = useState(false);
  const [newTargetInput, setNewTargetInput] = useState(1000000.00);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);

  // New Entry Form State
  const [newEntryData, setNewEntryData] = useState({
    month: '2026-10',
    entry_date: new Date().toISOString().split('T')[0],
    reference_no: '',
    supplier_order_ref: '',
    amount: '',
    status: 'Confirmed',
    confirmed_by: currentUser?.name || 'Dealer Owner',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [qData, eData, soData] = await Promise.all([
        api.get('/api/quotas').catch(() => []),
        api.get('/api/quota-entries').catch(() => []),
        api.get('/api/supplier-orders').catch(() => [])
      ]);

      if (Array.isArray(qData) && qData.length > 0) {
        setMonthlyTarget(parseFloat(qData[0].target_amount || 1000000));
        setTargetNotes(qData[0].notes || '');
      }
      setQuotaEntries(Array.isArray(eData) ? eData : []);
      setSupplierOrders(Array.isArray(soData) ? soData : []);
    } catch (err) {
      console.error('Failed to load quota data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter entries for the selected reporting month
  const monthEntries = quotaEntries.filter(e => e.month === currentMonth);
  const confirmedEntries = monthEntries.filter(e => e.status === 'Confirmed');
  const pendingEntries = monthEntries.filter(e => e.status === 'Pending');

  // Exact Business Rule: ONLY confirmed entries count toward achieved quota!
  const confirmedAmount = confirmedEntries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const pendingAmount = pendingEntries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const remainingQuota = Math.max(0, monthlyTarget - confirmedAmount);
  const percentageAchieved = monthlyTarget > 0 ? ((confirmedAmount / monthlyTarget) * 100).toFixed(1) : '0.0';

  // Update monthly target
  const handleSaveTarget = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/quotas', {
        target_amount: parseFloat(newTargetInput),
        month: currentMonth,
        notes: targetNotes
      });
      setMonthlyTarget(parseFloat(newTargetInput));
      setSuccessMsg('Monthly Selecta POS Quota target updated successfully.');
      setIsAdjustTargetModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg('Failed to update quota target');
    }
  };

  // Record a confirmed Selecta POS entry
  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const amt = parseFloat(newEntryData.amount || 0);
    if (amt <= 0) {
      setErrorMsg('Please enter a valid amount greater than zero.');
      return;
    }
    if (!newEntryData.reference_no.trim()) {
      setErrorMsg('Reference number from Selecta POS is required.');
      return;
    }

    try {
      await api.post('/api/quota-entries', {
        ...newEntryData,
        amount: amt
      });
      setSuccessMsg(`Selecta POS entry ${newEntryData.reference_no} recorded successfully.`);
      setIsAddEntryModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record quota entry');
    }
  };

  // Delete entry
  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Delete this quota entry?')) return;
    try {
      await api.delete(`/api/quota-entries/${id}`);
      setSuccessMsg('Quota entry removed.');
      loadData();
    } catch (err) {
      setErrorMsg('Failed to delete quota entry');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Selecta POS Quota Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              Supplier Target
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed wholesale orders placed into Selecta's external POS toward the monthly quota target.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          />
          <button
            onClick={() => {
              setNewTargetInput(monthlyTarget);
              setIsAdjustTargetModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Edit className="w-4 h-4 text-slate-500" /> Set Target
          </button>
          <button
            onClick={() => {
              setNewEntryData({
                month: currentMonth,
                entry_date: new Date().toISOString().split('T')[0],
                reference_no: '',
                supplier_order_ref: '',
                amount: '',
                status: 'Confirmed',
                confirmed_by: currentUser?.name || 'Dealer Owner',
                notes: ''
              });
              setIsAddEntryModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30"
          >
            <Plus className="w-4 h-4" /> Record Selecta POS Entry
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Main Quota Progress Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/40">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Monthly Quota Target ({currentMonth})
                </span>
                <h2 className="text-3xl font-black text-white mt-0.5 tracking-tight">
                  {formatPHP(monthlyTarget)}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                Confirmed in Selecta POS
              </span>
              <p className="text-3xl font-black text-emerald-400 tracking-tight">
                {formatPHP(confirmedAmount)}
              </p>
              <span className="text-xs text-slate-400">
                Remaining: <strong className="text-white">{formatPHP(remainingQuota)}</strong>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Progress Achieved</span>
              <span className="text-white font-black text-sm">{percentageAchieved}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-700 shadow-md"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(percentageAchieved)))}%` }}
              />
            </div>
          </div>

          {/* Pending Entries Notice */}
          {pendingAmount > 0 && (
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pending entries awaiting Selecta confirmation: <strong>{formatPHP(pendingAmount)}</strong></span>
              </div>
              <span className="text-[11px] text-slate-400 italic">Excluded from achieved quota until confirmed</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Separation Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-slate-900">Strict Separation Rule:</strong> Only confirmed bulk entries recorded in Selecta's external POS count toward achieved quota. Dealer customer sales, receiving receipts, customer collections, or estimated store bookings must never be confused with confirmed Selecta POS quota.
        </div>
      </div>

      {/* Confirmed Entries vs Pending Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Confirmed Entries (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">
                Confirmed Selecta POS Entries ({confirmedEntries.length})
              </h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-700">
              Total: {formatPHP(confirmedAmount)}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {confirmedEntries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No confirmed entries recorded for {currentMonth}.
              </div>
            ) : (
              confirmedEntries.map((e) => (
                <div key={e.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{e.reference_no}</span>
                      {e.supplier_order_ref && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          PO: {e.supplier_order_ref}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Date: {e.entry_date} • Confirmed by: {e.confirmed_by}
                    </p>
                    {e.notes && (
                      <p className="text-xs text-slate-600 italic">"{e.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-base font-black text-slate-900">{formatPHP(e.amount)}</p>
                    <button
                      onClick={() => handleDeleteEntry(e.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
                      title="Delete entry"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pending Entries & Historical Breakdown */}
        <div className="space-y-6">
          {/* Pending Entries */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Pending Entries ({pendingEntries.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-700">
                {formatPHP(pendingAmount)}
              </span>
            </div>

            <div className="p-3 divide-y divide-slate-100 text-xs">
              {pendingEntries.length === 0 ? (
                <p className="py-6 text-center text-slate-400 italic">No pending entries</p>
              ) : (
                pendingEntries.map((pe) => (
                  <div key={pe.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{pe.reference_no}</span>
                      <p className="text-[10px] text-slate-400">{pe.entry_date}</p>
                    </div>
                    <span className="font-bold text-amber-700">{formatPHP(pe.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historical Summary by Month */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Recent Historical Results
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">September 2026</p>
                  <p className="text-[10px] text-slate-400">Target: ₱950,000.00</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700">₱982,000.00</p>
                  <span className="text-[10px] font-bold text-emerald-600">103.4% Achieved</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">August 2026</p>
                  <p className="text-[10px] text-slate-400">Target: ₱900,000.00</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700">₱891,000.00</p>
                  <span className="text-[10px] font-bold text-slate-600">99.0% Achieved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECORD ENTRY MODAL */}
      {isAddEntryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Record Confirmed Selecta POS Entry</h3>
                <p className="text-xs text-slate-500">Log wholesale transaction recorded in Selecta POS</p>
              </div>
              <button onClick={() => setIsAddEntryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selecta POS Reference #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEL-INV-00305"
                    value={newEntryData.reference_no}
                    onChange={(e) => setNewEntryData({ ...newEntryData, reference_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Entry Date</label>
                  <input
                    type="date"
                    required
                    value={newEntryData.entry_date}
                    onChange={(e) => setNewEntryData({ ...newEntryData, entry_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Wholesale Amount (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 195000.00"
                    value={newEntryData.amount}
                    onChange={(e) => setNewEntryData({ ...newEntryData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Related Supplier PO (Optional)</label>
                  <select
                    value={newEntryData.supplier_order_ref}
                    onChange={(e) => setNewEntryData({ ...newEntryData, supplier_order_ref: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="">-- None / Direct --</option>
                    {supplierOrders.map(so => (
                      <option key={so.id} value={so.id}>{so.id} ({formatPHP(so.supplier_amount)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Entry Status</label>
                <select
                  value={newEntryData.status}
                  onChange={(e) => setNewEntryData({ ...newEntryData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="Confirmed">Confirmed (Counts toward monthly quota)</option>
                  <option value="Pending">Pending (Draft / In Process)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirmed By</label>
                <input
                  type="text"
                  value={newEntryData.confirmed_by}
                  onChange={(e) => setNewEntryData({ ...newEntryData, confirmed_by: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Remarks</label>
                <textarea
                  rows="2"
                  value={newEntryData.notes}
                  onChange={(e) => setNewEntryData({ ...newEntryData, notes: e.target.value })}
                  placeholder="e.g. Batch 3 Cabanglasan & San Fernando pre-orders..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEntryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST TARGET MODAL */}
      {isAdjustTargetModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Configure Monthly Target</h3>
              <button onClick={() => setIsAdjustTargetModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTarget} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Amount (₱)</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={newTargetInput}
                  onChange={(e) => setNewTargetInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-base font-black text-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Notes</label>
                <input
                  type="text"
                  value={targetNotes}
                  onChange={(e) => setTargetNotes(e.target.value)}
                  placeholder="e.g. Summer season target..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustTargetModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
