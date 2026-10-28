import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  CreditCard, 
  Search, 
  Plus, 
  Filter, 
  DollarSign, 
  X, 
  Printer, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Building2, 
  Wallet, 
  FileText, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Store,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function SalesReceipts() {
  const { currentUser } = useAuth();
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Adjustment Form State (Missing products & BO returns)
  const [adjustmentData, setAdjustmentData] = useState({
    bookingId: '',
    storeName: '',
    items: []
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: 'Cash',
    reference_no: '',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/bookings').catch(() => []);
      setSalesRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load sales receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Adjusted Delivery Settlement Modal
  const handleOpenAdjustModal = (booking) => {
    const rawItems = Array.isArray(booking.items) ? booking.items : [];
    const existingBO = Array.isArray(booking.bo_items) ? booking.bo_items : [];
    const existingMissing = Array.isArray(booking.missing_items) ? booking.missing_items : [];

    const preparedItems = rawItems.map((it, idx) => {
      const boMatch = existingBO.find(b => b.name === it.name) || {};
      const misMatch = existingMissing.find(m => m.name === it.name) || {};
      const ordered = parseInt(it.qty || 1);
      const packed = parseInt(it.packedQty || ordered);
      const missing = parseInt(misMatch.qty || 0);
      const bo = parseInt(boMatch.qty || 0);
      const accepted = Math.max(0, packed - missing);

      return {
        id: it.id || `ITEM-${idx}`,
        name: it.name,
        price: parseFloat(it.price || 0),
        orderedQty: ordered,
        packedQty: packed,
        acceptedQty: accepted,
        missingQty: missing,
        boQty: bo,
        reason: boMatch.reason || misMatch.reason || ''
      };
    });

    setAdjustmentData({
      bookingId: booking.id,
      storeName: booking.store_name || booking.customer,
      items: preparedItems
    });
    setIsAdjustModalOpen(true);
  };

  // Calculate billable quantities and financial totals following Section 13 exactly:
  // Billable quantity = quantity accepted by the customer − approved BO quantity credited back.
  // Final product amount = sum of each product's billable quantity multiplied by its saved unit price.
  // The quantity never delivered (missing) is not billable.
  const calculateTotals = (items) => {
    let gross = 0;
    let missingDeductions = 0;
    let boCredits = 0;
    let netBillable = 0;

    items.forEach(it => {
      const price = parseFloat(it.price || 0);
      const ordered = parseInt(it.orderedQty || 0);
      const accepted = parseInt(it.acceptedQty || 0);
      const missing = parseInt(it.missingQty || 0);
      const bo = parseInt(it.boQty || 0);

      gross += ordered * price;
      missingDeductions += missing * price;
      boCredits += bo * price;

      // Billable qty = accepted - bo
      const billableQty = Math.max(0, accepted - bo);
      netBillable += billableQty * price;
    });

    return {
      gross,
      missingDeductions,
      boCredits,
      netBillable
    };
  };

  // Submit Adjusted Delivery Receipt
  const handleSaveAdjustedReceipt = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const totals = calculateTotals(adjustmentData.items);
    const boItems = adjustmentData.items.filter(it => it.boQty > 0).map(it => ({
      name: it.name,
      qty: it.boQty,
      price: it.price,
      credit: it.boQty * it.price,
      reason: it.reason
    }));
    const missingItems = adjustmentData.items.filter(it => it.missingQty > 0).map(it => ({
      name: it.name,
      qty: it.missingQty,
      price: it.price,
      reason: it.reason
    }));

    try {
      await api.put(`/api/bookings/${adjustmentData.bookingId}`, {
        status: 'Delivered',
        total_receipt: totals.gross,
        bo_deductions: totals.boCredits,
        missing_deductions: totals.missingDeductions,
        net_delivered_amount: totals.netBillable,
        bo_items: boItems,
        missing_items: missingItems,
        receipt_ref: `OR-VAL-${adjustmentData.bookingId.replace(/[^0-9]/g, '') || Date.now().toString().slice(-4)}`
      });

      // Also log discrepancies if any BO or missing
      if (boItems.length > 0 || missingItems.length > 0) {
        for (const bo of boItems) {
          await api.post('/api/discrepancies', {
            delivery_ref: adjustmentData.bookingId,
            store_name: adjustmentData.storeName,
            type: 'BO / Melted',
            product_name: bo.name,
            quantity: bo.qty,
            deduction_amount: bo.credit,
            reported_by: currentUser?.name || 'Delivery Staff',
            status: 'Approved BO Credit',
            notes: bo.reason || 'Melted ice cream credited on customer adjusted receipt.'
          }).catch(() => null);
        }
      }

      setSuccessMsg('Adjusted receipt calculated and finalized according to delivery audit.');
      setIsAdjustModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update receipt');
    }
  };

  // Open Record Payment Modal for Receipt
  const handleOpenPayment = (receipt) => {
    setSelectedReceipt(receipt);
    const net = parseFloat(receipt.net_delivered_amount || receipt.total_receipt || 0);
    const paid = parseFloat(receipt.paid_amount || 0);
    const remaining = Math.max(0, net - paid);

    setPaymentData({
      amount: remaining.toFixed(2),
      payment_method: 'Cash',
      reference_no: '',
      notes: ''
    });
    setIsPayModalOpen(true);
  };

  // Submit Payment for Receipt
  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!selectedReceipt) return;

    const amt = parseFloat(paymentData.amount || 0);
    if (amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      await api.post('/api/payments', {
        receipt_id: selectedReceipt.receipt_ref || selectedReceipt.id,
        booking_id: selectedReceipt.id,
        customer_id: selectedReceipt.customer_id || '',
        store_name: selectedReceipt.store_name || selectedReceipt.customer,
        amount: amt,
        payment_method: paymentData.payment_method,
        reference_no: paymentData.reference_no,
        received_by: currentUser?.name || 'Staff Collector',
        notes: paymentData.notes
      });

      setSuccessMsg(`Payment of ${formatPHP(amt)} recorded successfully.`);
      setIsPayModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    }
  };

  const filteredRecords = salesRecords.filter(r => {
    const matchesSearch = (r.store_name && r.store_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (r.receipt_ref && r.receipt_ref.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (r.id && r.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sales & Customer Receipts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Delivery Linked POS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and audit store customer receipts with automatic deductions for missing items and approved BO returns.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Receipts Summary
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

      {/* Mathematical Rule Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 shadow-md">
        <div className="flex items-center gap-2 font-black text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Section 13 Business Accounting Rule Enforced:</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-normal">
          <strong>Billable Quantity</strong> = Quantity Accepted by Customer − Approved BO Quantity Credited Back. <br />
          <strong>Final Product Amount</strong> = Sum of (Billable Qty × Saved Unit Price). Missing products not packed/delivered are NEVER charged. Approved BO credits are applied once and never duplicated.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search store name, receipt #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500 w-52 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="Delivered">Delivered (Finalized Receipt)</option>
            <option value="Ready for Deliver">Ready for Deliver</option>
            <option value="Booked">Booked (Estimated)</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredRecords.length}</strong> receipt(s)
        </span>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Receipt / Booking ID</th>
                <th className="py-3 px-3">Customer Store</th>
                <th className="py-3 px-3">Delivery Date</th>
                <th className="py-3 px-3 text-right">Original Order</th>
                <th className="py-3 px-3 text-right text-red-600">Missing</th>
                <th className="py-3 px-3 text-right text-amber-600">BO Credit</th>
                <th className="py-3 px-3 text-right font-black text-slate-900">Final Billable</th>
                <th className="py-3 px-3 text-right text-emerald-700">Paid Amount</th>
                <th className="py-3 px-3 text-right text-amber-700">Balance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    No sales receipts matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const gross = parseFloat(r.total_receipt || r.estimated_total || 0);
                  const missing = parseFloat(r.missing_deductions || 0);
                  const bo = parseFloat(r.bo_deductions || 0);
                  const net = parseFloat(r.net_delivered_amount || gross);
                  const paid = parseFloat(r.paid_amount || 0);
                  const balance = Math.max(0, net - paid);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.receipt_ref || r.id}
                        <span className="block text-[10px] text-slate-400">{r.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">{r.store_name || r.customer}</span>
                        <span className="block text-[10px] text-slate-500">{r.area}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{r.booking_date}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">{formatPHP(gross)}</td>
                      <td className="py-3 px-3 text-right font-bold text-red-600">
                        {missing > 0 ? `-${formatPHP(missing)}` : '₱0.00'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-600">
                        {bo > 0 ? `-${formatPHP(bo)}` : '₱0.00'}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{formatPHP(net)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatPHP(paid)}</td>
                      <td className="py-3 px-3 text-right font-black text-amber-700">
                        {balance > 0 ? formatPHP(balance) : <span className="text-emerald-700 font-bold">Paid</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Adjust & Settle Delivery Button */}
                          <button
                            onClick={() => handleOpenAdjustModal(r)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-[10px]"
                            title="Audit Missing & BO Returns"
                          >
                            Audit Delivery
                          </button>

                          {/* Record Payment */}
                          {balance > 0 && (
                            <button
                              onClick={() => handleOpenPayment(r)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                            >
                              Pay
                            </button>
                          )}

                          {/* Printable Receipt */}
                          <button
                            onClick={() => {
                              setSelectedReceipt(r);
                              window.print();
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800"
                            title="Print Official Customer Receipt"
                          >
                            <Printer className="w-3.5 h-3.5" />
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

      {/* AUDIT DELIVERY & ADJUST RECEIPT MODAL */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Delivery Receipt Audit & Adjustment — {adjustmentData.storeName}
                </h3>
                <p className="text-xs text-slate-500">Record missing products and approved BO returns for credit</p>
              </div>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustedReceipt} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Product Flavor</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Ordered</th>
                      <th className="p-2.5 text-right text-red-600">Missing</th>
                      <th className="p-2.5 text-right text-emerald-700">Accepted</th>
                      <th className="p-2.5 text-right text-amber-600">BO Return</th>
                      <th className="p-2.5 text-right font-black">Billable</th>
                      <th className="p-2.5 text-right font-black">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adjustmentData.items.map((it, idx) => {
                      const billable = Math.max(0, it.acceptedQty - it.boQty);
                      const lineTotal = billable * it.price;

                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{it.name}</td>
                          <td className="p-2.5 text-right text-slate-600">{formatPHP(it.price)}</td>
                          <td className="p-2.5 text-right font-semibold">{it.orderedQty}</td>

                          {/* Missing Input */}
                          <td className="p-2.5 text-right">
                            <input
                              type="number"
                              min="0"
                              max={it.orderedQty}
                              value={it.missingQty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const updated = [...adjustmentData.items];
                                updated[idx].missingQty = val;
                                updated[idx].acceptedQty = Math.max(0, updated[idx].packedQty - val);
                                setAdjustmentData({ ...adjustmentData, items: updated });
                              }}
                              className="w-14 px-1.5 py-0.5 rounded border border-red-300 bg-red-50/50 text-right text-xs font-bold text-red-700"
                            />
                          </td>

                          {/* Accepted Qty (Auto-calculated: Packed - Missing) */}
                          <td className="p-2.5 text-right font-bold text-emerald-700">
                            {it.acceptedQty}
                          </td>

                          {/* BO Return Input */}
                          <td className="p-2.5 text-right">
                            <input
                              type="number"
                              min="0"
                              max={it.acceptedQty}
                              value={it.boQty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const updated = [...adjustmentData.items];
                                updated[idx].boQty = Math.min(updated[idx].acceptedQty, val);
                                setAdjustmentData({ ...adjustmentData, items: updated });
                              }}
                              className="w-14 px-1.5 py-0.5 rounded border border-amber-300 bg-amber-50/50 text-right text-xs font-bold text-amber-700"
                            />
                          </td>

                          <td className="p-2.5 text-right font-black text-slate-900">{billable}</td>
                          <td className="p-2.5 text-right font-black text-slate-900">{formatPHP(lineTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Real-time Math Summary */}
              {(() => {
                const totals = calculateTotals(adjustmentData.items);
                return (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Original Gross Booking:</span>
                      <span className="font-bold text-slate-800">{formatPHP(totals.gross)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Less: Undelivered / Missing (Not Charged):</span>
                      <span className="font-bold">-{formatPHP(totals.missingDeductions)}</span>
                    </div>
                    <div className="flex justify-between text-amber-600">
                      <span>Less: Approved Melted / BO Credits:</span>
                      <span className="font-bold">-{formatPHP(totals.boCredits)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                      <span>Final Billable Amount:</span>
                      <span className="text-emerald-700 text-base">{formatPHP(totals.netBillable)}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Finalize Adjusted Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isPayModalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Record Payment</h3>
                <p className="text-xs text-slate-500">{selectedReceipt.store_name || selectedReceipt.customer}</p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Amount to Pay (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-base font-black text-emerald-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="Cash">Cash (Physical bills & coins)</option>
                  <option value="GCash">GCash (QR / Mobile Wallet)</option>
                  <option value="Bank Check">Bank Check</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {paymentData.payment_method !== 'Cash' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Transaction Ref / Check #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GCASH-19283719"
                    value={paymentData.reference_no}
                    onChange={(e) => setPaymentData({ ...paymentData, reference_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid in full to Juan Driver upon delivery"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
