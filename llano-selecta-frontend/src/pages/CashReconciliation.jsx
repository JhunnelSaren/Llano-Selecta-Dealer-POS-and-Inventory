import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  Plus, 
  Filter, 
  Printer, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle,
  FileText, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building2, 
  User, 
  Check, 
  X, 
  Eye, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CashReconciliation() {
  const { currentUser } = useAuth();
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Form State for new route-closing reconciliation
  const [formData, setFormData] = useState({
    delivery_batch_id: '',
    reconciliation_date: new Date().toISOString().split('T')[0],
    area: 'Valencia City',
    route: 'Valencia City Route',
    driver_name: 'Juan Santos',
    collection_handler: currentUser?.name || 'Staff Collector',
    expected_cash: 0,
    actual_cash: 0,
    gcash_total: 0,
    check_total: 0,
    other_total: 0,
    explanation: '',
    receipts_summary: []
  });

  const [reviewExplanation, setReviewExplanation] = useState('');
  const [reviewStatus, setReviewStatus] = useState('Resolved');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/cash-reconciliations').catch(() => []);
      setReconciliations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reconciliations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pre-seed some sample calculations if form is opened
  const handleOpenNewModal = async () => {
    try {
      // Fetch delivered bookings from today to auto-populate expected cash
      const bookings = await api.get('/api/bookings').catch(() => []);
      const delivered = bookings.filter(b => b.status === 'Delivered');

      let expCash = 0;
      let gcash = 0;
      let check = 0;
      let other = 0;

      const summary = delivered.map(b => {
        const netAmt = parseFloat(b.net_delivered_amount || b.paid_amount || 0);
        const method = b.payment_method || 'Cash';

        if (method === 'Cash') expCash += netAmt;
        else if (method === 'GCash') gcash += netAmt;
        else if (method.toLowerCase().includes('check')) check += netAmt;
        else other += netAmt;

        return {
          bookingId: b.id,
          storeName: b.store_name || b.customer,
          area: b.area,
          amount: netAmt,
          method: method
        };
      });

      setFormData({
        delivery_batch_id: `DB-${Date.now().toString().slice(-4)}`,
        reconciliation_date: new Date().toISOString().split('T')[0],
        area: 'Valencia City',
        route: 'Valencia City (Batangan & San Isidro)',
        driver_name: 'Juan Santos',
        collection_handler: currentUser?.name || 'Staff Collector',
        expected_cash: expCash,
        actual_cash: expCash, // default to matching
        gcash_total: gcash,
        check_total: check,
        other_total: other,
        explanation: '',
        receipts_summary: summary
      });
      setIsNewModalOpen(true);
    } catch (err) {
      setIsNewModalOpen(true);
    }
  };

  // Submit new route-closing reconciliation
  const handleSubmitReconciliation = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const exp = parseFloat(formData.expected_cash || 0);
    const act = parseFloat(formData.actual_cash || 0);
    const gcash = parseFloat(formData.gcash_total || 0);
    const check = parseFloat(formData.check_total || 0);
    const other = parseFloat(formData.other_total || 0);

    const variance = act - exp;
    const totalColl = act + gcash + check + other;

    if (variance !== 0 && !formData.explanation.trim()) {
      setErrorMsg('An explanation is mandatory whenever actual cash differs from expected cash.');
      return;
    }

    try {
      await api.post('/api/cash-reconciliations', {
        ...formData,
        expected_cash: exp,
        actual_cash: act,
        gcash_total: gcash,
        check_total: check,
        other_total: other,
        total_collected: totalColl,
        cash_variance: variance,
        status: variance === 0 ? 'Resolved' : 'Pending Review'
      });

      setSuccessMsg('Route cash reconciliation submitted successfully.');
      setIsNewModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit reconciliation');
    }
  };

  // Owner Review & Resolution
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    try {
      await api.put(`/api/cash-reconciliations/${selectedRecord.id}`, {
        status: reviewStatus,
        explanation: reviewExplanation || selectedRecord.explanation,
        reviewed_by: currentUser?.name || 'Dealer Owner'
      });

      setSuccessMsg(`Discrepancy marked as ${reviewStatus}.`);
      setIsReviewModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg('Failed to update reconciliation');
    }
  };

  // Filtered List
  const filteredRecords = reconciliations.filter(r => {
    const matchesSearch = (r.route && r.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (r.driver_name && r.driver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (r.collection_handler && r.collection_handler.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesDate = !dateFilter || (r.reconciliation_date && r.reconciliation_date.startsWith(dateFilter));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalVariance = reconciliations.reduce((sum, r) => sum + (parseFloat(r.cash_variance) || 0), 0);
  const pendingCount = reconciliations.filter(r => r.status === 'Pending Review').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Route Cash Reconciliation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Route Closing & Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reconcile physical cash handed over by the delivery crew against expected cash sales (GCash & checks excluded).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Closing Report
          </button>
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30"
          >
            <Plus className="w-4 h-4" /> Close Route / Reconcile Cash
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

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reconciliations</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{reconciliations.length} Batches</p>
          <p className="text-[11px] text-slate-400 mt-1">Route closings recorded</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Owner Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingCount} Pending</p>
          <p className="text-[11px] text-slate-400 mt-1">Shortages or overages unresolved</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Variance</span>
            <Scale className="w-4 h-4 text-slate-500" />
          </div>
          <p className={`text-2xl font-black mt-2 ${totalVariance < 0 ? 'text-red-600' : totalVariance > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
            {totalVariance < 0 ? '-' : totalVariance > 0 ? '+' : ''}{formatPHP(Math.abs(totalVariance))}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalVariance < 0 ? 'Net Cash Shortage' : totalVariance > 0 ? 'Net Cash Overage' : 'Perfect Balance'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Actual Cash Handed</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {formatPHP(reconciliations.reduce((s, r) => s + (parseFloat(r.actual_cash) || 0), 0))}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Vault physical cash received</p>
        </div>
      </div>

      {/* Critical Business Rule Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950">Important Cold-Chain Accounting Rule:</strong> Never compare total sales amount directly with physical cash. Payments made via GCash, bank checks, or credits must be excluded from Expected Cash. Cash Variance = Actual Cash Handed Over − Expected Cash Collection. Discrepancies stay visible until authorized review.
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search route, driver, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 w-52 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Explained">Explained</option>
            <option value="Resolved">Resolved</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredRecords.length}</strong> record(s)
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Batch / Ref ID</th>
                <th className="py-3 px-3">Date & Route</th>
                <th className="py-3 px-3">Crew (Driver & Collector)</th>
                <th className="py-3 px-3 text-right">Expected Cash</th>
                <th className="py-3 px-3 text-right">Actual Handed</th>
                <th className="py-3 px-3 text-right">GCash / Checks</th>
                <th className="py-3 px-4 text-right font-black">Variance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    No route reconciliation records matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const variance = parseFloat(r.cash_variance || 0);
                  const isShortage = variance < 0;
                  const isOverage = variance > 0;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.id}
                        {r.delivery_batch_id && (
                          <span className="block text-[10px] text-slate-400 font-mono">{r.delivery_batch_id}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">{r.reconciliation_date}</span>
                        <span className="block text-[10px] text-slate-500 truncate max-w-xs">{r.route}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{r.driver_name || 'Driver'}</span>
                        <span className="block text-[10px] text-slate-400">Coll: {r.collection_handler}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatPHP(r.expected_cash)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {formatPHP(r.actual_cash)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">
                        <div>GCash: {formatPHP(r.gcash_total)}</div>
                        <div className="text-[10px] text-slate-400">Check: {formatPHP(r.check_total)}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-black">
                        <span className={`px-2 py-0.5 rounded-full text-xs inline-block ${
                          isShortage ? 'bg-red-100 text-red-800' :
                          isOverage ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {isShortage ? `-${formatPHP(Math.abs(variance))}` : isOverage ? `+${formatPHP(variance)}` : '₱0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          r.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'Explained' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setReviewExplanation(r.explanation || '');
                              setReviewStatus(r.status);
                              setIsReviewModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-[11px]"
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ROUTE RECONCILIATION MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-black text-slate-900">Close Delivery Route & Reconcile Money</h3>
                <p className="text-xs text-slate-500">Record physical cash handed over vs non-cash payments</p>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReconciliation} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Route & Territory</label>
                  <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reconciliation Date</label>
                  <input
                    type="date"
                    required
                    value={formData.reconciliation_date}
                    onChange={(e) => setFormData({ ...formData, reconciliation_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Collection Handler</label>
                  <input
                    type="text"
                    value={formData.collection_handler}
                    onChange={(e) => setFormData({ ...formData, collection_handler: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Collections by Payment Method */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Collections Breakdown by Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Expected Cash Sales (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.expected_cash}
                      onChange={(e) => setFormData({ ...formData, expected_cash: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Cash expected based on customer receipts</p>
                  </div>

                  <div>
                    <label className="text-slate-900 block mb-1 font-bold text-emerald-800">Actual Cash Handed Over (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.actual_cash}
                      onChange={(e) => setFormData({ ...formData, actual_cash: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs font-black text-emerald-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Physical bills & coins counted into vault</p>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">GCash Direct Collections (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.gcash_total}
                      onChange={(e) => setFormData({ ...formData, gcash_total: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Bank Checks / Deposit (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.check_total}
                      onChange={(e) => setFormData({ ...formData, check_total: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Variance Live Calculation */}
                {(() => {
                  const exp = parseFloat(formData.expected_cash || 0);
                  const act = parseFloat(formData.actual_cash || 0);
                  const variance = act - exp;
                  return (
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Calculated Cash Variance:</span>
                      <span className={`font-black text-sm px-3 py-1 rounded-full ${
                        variance < 0 ? 'bg-red-100 text-red-800' :
                        variance > 0 ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {variance < 0 ? `Shortage of -${formatPHP(Math.abs(variance))}` :
                         variance > 0 ? `Overage of +${formatPHP(variance)}` :
                         'Exact Match (₱0.00)'}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Explanation / Remarks {parseFloat(formData.actual_cash || 0) !== parseFloat(formData.expected_cash || 0) && <span className="text-red-500">* (Mandatory for discrepancy)</span>}
                </label>
                <textarea
                  rows="3"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Provide reason for shortage or overage (e.g. Aling Nena short ₱100 to settle next trip, or change coins rounding)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save Route Reconciliation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & RESOLUTION MODAL */}
      {isReviewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Review Reconciliation #{selectedRecord.id}</h3>
                <p className="text-xs text-slate-500">{selectedRecord.route}</p>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Physical Cash:</span>
                <span className="font-bold text-slate-900">{formatPHP(selectedRecord.expected_cash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actual Cash Handed Over:</span>
                <span className="font-bold text-emerald-700">{formatPHP(selectedRecord.actual_cash)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-700">Variance:</span>
                <span className={selectedRecord.cash_variance < 0 ? 'text-red-600' : 'text-emerald-600'}>
                  {formatPHP(selectedRecord.cash_variance)}
                </span>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Audit Resolution Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="Resolved">Resolved (Settled / Deducted)</option>
                  <option value="Explained">Explained (Pending Next Remittance)</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Resolution Notes</label>
                <textarea
                  rows="3"
                  value={reviewExplanation}
                  onChange={(e) => setReviewExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Record authorized owner decision..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
