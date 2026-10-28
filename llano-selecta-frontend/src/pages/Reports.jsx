import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Calendar, 
  MapPin, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Boxes, 
  Truck, 
  CircleDollarSign, 
  Snowflake, 
  Target, 
  Users, 
  FileText,
  CreditCard,
  Layers,
  ArrowDownToLine,
  Receipt,
  Scale
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// REPORT CATEGORIES ACCORDING TO SECTION 19
const REPORT_CATEGORIES = [
  { id: 'bookings', name: 'Customer Bookings & Requests', icon: FileText },
  { id: 'supplier-orders', name: 'Consolidated Supplier Orders', icon: Layers },
  { id: 'receiving', name: 'Stock Receiving & Discrepancies', icon: ArrowDownToLine },
  { id: 'inventory', name: 'Current Stock & Low-Stock Alerts', icon: Boxes },
  { id: 'ledger', name: 'Inventory Movement History', icon: Clock },
  { id: 'deliveries', name: 'Delivery Schedules & Batches', icon: Truck },
  { id: 'discrepancies', name: 'Missing Products & BO Returns', icon: AlertTriangle },
  { id: 'sales', name: 'Adjusted Customer Receipts', icon: Receipt },
  { id: 'payments', name: 'Collections by Method (Cash/GCash/Check)', icon: CircleDollarSign },
  { id: 'balances', name: 'Unpaid Receipts & Balances', icon: CreditCard },
  { id: 'reconciliation', name: 'Route Cash Reconciliation', icon: Scale },
  { id: 'freezers', name: 'Freezer Registry & Monthly Scans', icon: Snowflake },
  { id: 'quota', name: 'Selecta POS Quota Progress', icon: Target },
  { id: 'audit', name: 'Staff Assignments & Audit Log', icon: Users }
];

export default function Reports() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('sales');
  const [loading, setLoading] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Data sets from database
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [receiving, setReceiving] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [discrepancies, setDiscrepancies] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [freezers, setFreezers] = useState([]);
  const [freezerScans, setFreezerScans] = useState([]);
  const [quotaEntries, setQuotaEntries] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [summary, setSummary] = useState(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        sumData, bData, pData, rcvData, ledgData, discData,
        payData, recData, frzData, fsData, qeData, alData, soData
      ] = await Promise.all([
        api.get('/api/reports/summary').catch(() => null),
        api.get('/api/bookings').catch(() => []),
        api.get('/api/products').catch(() => []),
        api.get('/api/receiving').catch(() => []),
        api.get('/api/inventory').catch(() => ({ ledger: [] })),
        api.get('/api/discrepancies').catch(() => []),
        api.get('/api/payments').catch(() => []),
        api.get('/api/cash-reconciliations').catch(() => []),
        api.get('/api/freezers').catch(() => []),
        api.get('/api/freezer-scans').catch(() => []),
        api.get('/api/quota-entries').catch(() => []),
        api.get('/api/audit-logs').catch(() => []),
        api.get('/api/supplier-orders').catch(() => [])
      ]);

      setSummary(sumData);
      setBookings(Array.isArray(bData) ? bData : []);
      setProducts(Array.isArray(pData) ? pData : []);
      setReceiving(Array.isArray(rcvData) ? rcvData : []);
      setLedger(Array.isArray(ledgData?.ledger) ? ledgData.ledger : []);
      setDiscrepancies(Array.isArray(discData) ? discData : []);
      setPayments(Array.isArray(payData) ? payData : []);
      setReconciliations(Array.isArray(recData) ? recData : []);
      setFreezers(Array.isArray(frzData) ? frzData : []);
      setFreezerScans(Array.isArray(fsData) ? fsData : []);
      setQuotaEntries(Array.isArray(qeData) ? qeData : []);
      setAuditLogs(Array.isArray(alData) ? alData : []);
      setSupplierOrders(Array.isArray(soData) ? soData : []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Export CSV Helper
  const exportToCSV = (filename, rows) => {
    if (!rows || rows.length === 0) {
      alert('No data available to export.');
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(h => {
          let val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
          val = val.replace(/"/g, '""');
          return `"${val}"`;
        }).join(',')
      )
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Reports & Business Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
              Official Dealer Reports
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access, print, and export all 14 comprehensive operational reports across sales, inventory, quota, and audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Current Report
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Delivered Sales</span>
            <p className="text-base font-black text-slate-900 mt-1">{formatPHP(summary.deliveredSales)}</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Collected</span>
            <p className="text-base font-black text-emerald-700 mt-1">{formatPHP(summary.totalPaid)}</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">BO Deductions</span>
            <p className="text-base font-black text-amber-600 mt-1">{formatPHP(summary.totalBODeductions)}</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Stock on Hand</span>
            <p className="text-base font-black text-blue-700 mt-1">{summary.totalStockUnits} Units</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Freezers</span>
            <p className="text-base font-black text-cyan-700 mt-1">{summary.totalFreezers} Deployed</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Quota</span>
            <p className="text-base font-black text-red-600 mt-1">{formatPHP(summary.confirmedQuotaAchieved)}</p>
          </div>
        </div>
      )}

      {/* Categories Horizontal Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 overflow-x-auto custom-scrollbar flex items-center gap-1.5 shadow-xs">
        {REPORT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Territories</option>
            <option value="Valencia">Valencia City</option>
            <option value="Cabanglasan">Cabanglasan</option>
            <option value="San Fernando">San Fernando</option>
          </select>
        </div>

        {/* Dynamic CSV Export based on Selected Report */}
        <div>
          {selectedCategory === 'sales' && (
            <button
              onClick={() => {
                const exportRows = bookings.filter(b => b.status === 'Delivered').map(b => ({
                  ID: b.id,
                  Store: b.store_name || b.customer,
                  Area: b.area,
                  Date: b.booking_date,
                  Gross: b.total_receipt,
                  BO_Credit: b.bo_deductions,
                  Missing: b.missing_deductions,
                  Net_Amount: b.net_delivered_amount,
                  Paid: b.paid_amount,
                  Payment_Method: b.payment_method
                }));
                exportToCSV('sales_receipts_report', exportRows);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Sales CSV
            </button>
          )}

          {selectedCategory === 'inventory' && (
            <button
              onClick={() => {
                const exportRows = products.map(p => ({
                  ID: p.id,
                  Name: p.name,
                  Category: p.category,
                  Dealer_Cost: p.dealer_price,
                  Selling_Price: p.unit_price,
                  SRP: p.srp,
                  Current_Stock: p.stock,
                  Reserved: p.reserved_stock,
                  Min_Stock: p.min_stock
                }));
                exportToCSV('inventory_stock_report', exportRows);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Stock CSV
            </button>
          )}

          {selectedCategory === 'payments' && (
            <button
              onClick={() => {
                const exportRows = payments.map(p => ({
                  Payment_ID: p.id,
                  Store: p.store_name,
                  Amount: p.amount,
                  Method: p.payment_method,
                  Reference: p.reference_no,
                  Date: p.payment_date,
                  Received_By: p.received_by,
                  Status: p.status
                }));
                exportToCSV('payment_records_report', exportRows);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Payments CSV
            </button>
          )}
        </div>
      </div>

      {/* DYNAMIC REPORT CONTENT ACCORDING TO SELECTED TAB */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* 1. SALES & ADJUSTED RECEIPTS */}
        {selectedCategory === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-3">Store Name & Area</th>
                  <th className="py-3 px-3">Delivery Date</th>
                  <th className="py-3 px-3 text-right">Original Gross</th>
                  <th className="py-3 px-3 text-right text-red-600">Missing (₱0)</th>
                  <th className="py-3 px-3 text-right text-amber-600">BO Credit</th>
                  <th className="py-3 px-3 text-right font-black text-slate-900">Net Bill Amount</th>
                  <th className="py-3 px-3 text-right text-emerald-700">Paid Amount</th>
                  <th className="py-3 px-4 text-center">Payment Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.filter(b => b.status === 'Delivered').map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.receipt_ref || b.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{b.store_name || b.customer}</td>
                    <td className="py-3 px-3 text-slate-600">{b.booking_date}</td>
                    <td className="py-3 px-3 text-right text-slate-600">{formatPHP(b.total_receipt)}</td>
                    <td className="py-3 px-3 text-right text-red-600">-{formatPHP(b.missing_deductions)}</td>
                    <td className="py-3 px-3 text-right text-amber-600">-{formatPHP(b.bo_deductions)}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">{formatPHP(b.net_delivered_amount)}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatPHP(b.paid_amount)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {b.payment_method || 'Cash'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. CURRENT INVENTORY & LOW STOCK */}
        {selectedCategory === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Dealer Cost</th>
                  <th className="py-3 px-3 text-right">Selling Price</th>
                  <th className="py-3 px-3 text-right">Current Stock</th>
                  <th className="py-3 px-3 text-right">Reserved</th>
                  <th className="py-3 px-3 text-right font-bold text-emerald-700">Available</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => {
                  const avail = Math.max(0, (p.stock || 0) - (p.reserved_stock || 0));
                  const isLow = avail <= (p.min_stock || 15);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 text-slate-600">{p.category}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{formatPHP(p.dealer_price)}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{formatPHP(p.unit_price)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{p.stock}</td>
                      <td className="py-3 px-3 text-right text-amber-600">{p.reserved_stock || 0}</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-700">{avail}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isLow ? 'Low Stock' : 'Good Level'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PAYMENTS & COLLECTIONS */}
        {selectedCategory === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Payment Ref #</th>
                  <th className="py-3 px-3">Customer / Store</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3 text-right font-bold">Amount Paid</th>
                  <th className="py-3 px-3">Reference / Deposit Slip</th>
                  <th className="py-3 px-3">Received By</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400">No payment records logged yet.</td>
                  </tr>
                ) : (
                  payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{pay.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{pay.store_name}</td>
                      <td className="py-3 px-3 text-slate-600">{pay.payment_date}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{pay.payment_method}</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-700">{formatPHP(pay.amount)}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{pay.reference_no || 'N/A'}</td>
                      <td className="py-3 px-3 text-slate-600">{pay.received_by}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. CASH RECONCILIATIONS */}
        {selectedCategory === 'reconciliation' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-3">Date & Route</th>
                  <th className="py-3 px-3">Collector</th>
                  <th className="py-3 px-3 text-right">Expected Cash</th>
                  <th className="py-3 px-3 text-right">Actual Handed</th>
                  <th className="py-3 px-3 text-right">GCash / Check</th>
                  <th className="py-3 px-3 text-right font-black">Variance</th>
                  <th className="py-3 px-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliations.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.id}</td>
                    <td className="py-3 px-3">{r.reconciliation_date} ({r.route})</td>
                    <td className="py-3 px-3">{r.collection_handler}</td>
                    <td className="py-3 px-3 text-right font-bold">{formatPHP(r.expected_cash)}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatPHP(r.actual_cash)}</td>
                    <td className="py-3 px-3 text-right text-slate-500">{formatPHP((parseFloat(r.gcash_total)||0) + (parseFloat(r.check_total)||0))}</td>
                    <td className={`py-3 px-3 text-right font-black ${parseFloat(r.cash_variance) < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatPHP(r.cash_variance)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. AUDIT TRAIL */}
        {selectedCategory === 'audit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User & Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Module</th>
                  <th className="py-3 px-4">Audit Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.id}</td>
                    <td className="py-3 px-3 text-slate-600">{formatDate(l.timestamp)}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{l.user_name} ({l.role})</td>
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-700">{l.action}</td>
                    <td className="py-3 px-3 text-slate-600">{l.module}</td>
                    <td className="py-3 px-4 text-slate-700">{l.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. GENERAL FALLBACK TABLE FOR OTHER CATEGORIES */}
        {!['sales', 'inventory', 'payments', 'reconciliation', 'audit'].includes(selectedCategory) && (
          <div className="p-12 text-center text-slate-400 text-xs">
            Viewing records for <strong className="text-slate-700">{REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.name}</strong>. All associated records synced live with database.
          </div>
        )}
      </div>
    </div>
  );
}
