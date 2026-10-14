import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function POS() {
  // Mock Invoices / Sales Records
  const [salesRecords, setSalesRecords] = useState([
    {
      id: 'SALE-2026-101',
      deliveryRef: 'DEL-2026-101',
      customer: 'Aling Nena Sari-Sari',
      route: 'Valencia -> San Fernando',
      date: '2026-10-09',
      grossAmount: 5000.00,
      boDeduction: 150.00,
      missingDeduction: 56.00,
      netBillAmount: 4794.00, // 5000 - 150 - 56
      paidAmount: 4794.00,
      shortageAmount: 0.00,
      paymentMethod: 'Cash',
      status: 'Paid',
      paymentDetails: { collector: 'Juan Driver', date: '2026-10-09' },
      items: [
        { name: 'Cornetto Vanilla 110ml', qty: 20, price: 28.00 },
        { name: 'Magnum Classic Almond 80ml', qty: 10, price: 58.00 },
        { name: 'Big Scoop Chocolate Fudge 1.5L', qty: 20, price: 195.00 }
      ]
    },
    {
      id: 'SALE-2026-102',
      deliveryRef: 'DEL-2026-102',
      customer: 'San Isidro Mini-Mart',
      route: 'San Isidro Route',
      date: '2026-10-09',
      grossAmount: 10000.00,
      boDeduction: 174.00,
      missingDeduction: 0.00,
      netBillAmount: 9826.00,
      paidAmount: 9000.00,
      shortageAmount: 826.00, // Rule 5: Shortage tracked separately
      paymentMethod: 'Cash',
      status: 'Partially Paid',
      paymentDetails: { collector: 'Pedro Loader', date: '2026-10-09', reason: 'Store owner ran short on physical cash, promises balance tomorrow.' },
      items: [
        { name: 'SELECTA 3-in-1 Double Dutch 1.3L', qty: 40, price: 165.00 },
        { name: 'Cornetto Chocolate 110ml', qty: 120, price: 28.00 }
      ]
    },
    {
      id: 'SALE-2026-103',
      deliveryRef: 'DEL-2026-099',
      customer: 'Cabanglasan Express',
      route: 'Cabanglasan Route',
      date: '2026-10-08',
      grossAmount: 12500.00,
      boDeduction: 0.00,
      missingDeduction: 0.00,
      netBillAmount: 12500.00,
      paidAmount: 12500.00,
      shortageAmount: 0.00,
      paymentMethod: 'GCash',
      status: 'Paid',
      paymentDetails: { collector: 'Maria Cashier', date: '2026-10-08', gcashRef: '900281749122' },
      items: [
        { name: 'Big Scoop Chocolate Fudge 1.5L', qty: 50, price: 195.00 },
        { name: 'Cornetto Vanilla 110ml', qty: 100, price: 28.00 }
      ]
    },
    {
      id: 'SALE-2026-104',
      deliveryRef: 'DEL-2026-100',
      customer: 'Batangan Corner Store',
      route: 'Batangan Area',
      date: '2026-10-08',
      grossAmount: 15000.00,
      boDeduction: 0.00,
      missingDeduction: 0.00,
      netBillAmount: 15000.00,
      paidAmount: 15000.00,
      shortageAmount: 0.00,
      paymentMethod: 'Bank Check',
      status: 'Pending Verification',
      paymentDetails: { collector: 'Juan Driver', date: '2026-10-08', checkNumber: 'CHK-881920', bankName: 'Landbank Valencia', checkDate: '2026-10-15' },
      items: [
        { name: 'Magnum Classic Almond 80ml', qty: 200, price: 58.00 },
        { name: 'Cornetto Vanilla 110ml', qty: 120, price: 28.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal States
  const [selectedSale, setSelectedSale] = useState(null); // For Receipt Viewing
  const [paymentModalSale, setPaymentModalSale] = useState(null); // For Payment Collection Form

  // Payment Form State
  const [method, setMethod] = useState('Cash');
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [collector, setCollector] = useState('Juan Driver');
  const [gcashRef, setGcashRef] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [bankName, setBankName] = useState('BDO Valencia');
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split('T')[0]);
  const [shortageReason, setShortageReason] = useState('');

  const openPaymentModal = (sale) => {
    setPaymentModalSale(sale);
    setReceivedAmount(sale.netBillAmount - sale.paidAmount);
    setMethod('Cash');
    setShortageReason('');
  };

  const handleProcessPayment = () => {
    if (!paymentModalSale) return;

    const netBill = paymentModalSale.netBillAmount;
    const newPaidTotal = paymentModalSale.paidAmount + parseFloat(receivedAmount || 0);
    const calculatedShortage = Math.max(0, netBill - newPaidTotal);

    let newStatus = 'Paid';
    if (method === 'Bank Check') {
      newStatus = 'Pending Verification';
    } else if (calculatedShortage > 0) {
      newStatus = 'Partially Paid';
    }

    const updatedSales = salesRecords.map(s => {
      if (s.id === paymentModalSale.id) {
        return {
          ...s,
          paidAmount: newPaidTotal,
          shortageAmount: calculatedShortage,
          paymentMethod: method,
          status: newStatus,
          paymentDetails: {
            collector,
            date: new Date().toISOString().split('T')[0],
            gcashRef: method === 'GCash' ? gcashRef : undefined,
            checkNumber: method === 'Bank Check' ? checkNumber : undefined,
            bankName: method === 'Bank Check' ? bankName : undefined,
            checkDate: method === 'Bank Check' ? checkDate : undefined,
            reason: calculatedShortage > 0 ? shortageReason : undefined
          }
        };
      }
      return s;
    });

    setSalesRecords(updatedSales);
    setPaymentModalSale(null);
  };

  // Aggregated Stats
  const totalGrossSales = salesRecords.reduce((sum, s) => sum + s.grossAmount, 0);
  const totalNetBill = salesRecords.reduce((sum, s) => sum + s.netBillAmount, 0);
  const totalCollected = salesRecords.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalShortages = salesRecords.reduce((sum, s) => sum + s.shortageAmount, 0);

  // Filtered List
  const filteredSales = salesRecords.filter(s => {
    const matchesSearch = s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.deliveryRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'All' || s.paymentMethod === filterMethod;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">POS & Customer Payments</h1>
          <p className="text-sm text-slate-500">Receipt settlement, multi-channel payment collection & shortage reconciliation</p>
        </div>
      </div>

      {/* Quick Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Invoices</p>
            <h3 className="text-lg font-bold text-slate-900">{formatPHP(totalGrossSales)}</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-slate-800 flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Payable Sales</p>
            <h3 className="text-lg font-bold text-slate-900">{formatPHP(totalNetBill)}</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Cash/Collected</p>
            <h3 className="text-lg font-bold text-emerald-700">{formatPHP(totalCollected)}</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uncollected Shortages</p>
            <h3 className="text-lg font-bold text-brand-red">{formatPHP(totalShortages)}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID, customer store, or delivery ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              value={filterMethod} 
              onChange={(e) => setFilterMethod(e.target.value)}
              className="input-field cursor-pointer sm:w-40"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank Check">Bank Check</option>
            </select>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer sm:w-44"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sale Ref / Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store & Route</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Amount</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Collected</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Shortage</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Payment Method</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredSales.length > 0 ? (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{s.id}</div>
                      <div className="text-[11px] text-slate-400">{s.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{s.customer}</div>
                      <div className="text-xs text-slate-500 font-mono">{s.deliveryRef}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{formatPHP(s.netBillAmount)}</div>
                      {(s.boDeduction > 0 || s.missingDeduction > 0) && (
                        <div className="text-[10px] text-brand-red font-medium">
                          Deductions applied
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-emerald-700">
                      {formatPHP(s.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-brand-red">
                      {s.shortageAmount > 0 ? `-${formatPHP(s.shortageAmount)}` : '₱0.00'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {s.paymentMethod === 'Cash' && <Wallet className="w-3.5 h-3.5 text-emerald-600" />}
                        {s.paymentMethod === 'GCash' && <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
                        {s.paymentMethod === 'Bank Check' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        s.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        s.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        s.status === 'Pending Verification' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {s.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {s.status === 'Partially Paid' && <AlertCircle className="w-3 h-3" />}
                        {s.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status !== 'Paid' && (
                          <button 
                            onClick={() => openPaymentModal(s)}
                            className="btn-primary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Pay
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedSale(s)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No sales or payments found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {paymentModalSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Collect Customer Payment</h2>
              </div>
              <button onClick={() => setPaymentModalSale(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Store: {paymentModalSale.customer}</span>
                  <span>Ref: {paymentModalSale.id}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Net Amount Due:</span>
                  <span className="text-brand-red">{formatPHP(paymentModalSale.netBillAmount - paymentModalSale.paidAmount)}</span>
                </div>
              </div>

              {/* Method Selector Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setMethod('Cash')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      method === 'Cash' 
                        ? 'bg-brand-red text-white border-brand-red shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4" /> Cash
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMethod('GCash')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      method === 'GCash' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> GCash
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMethod('Bank Check')}
                    className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      method === 'Bank Check' 
                        ? 'bg-purple-700 text-white border-purple-700 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Bank Check
                  </button>
                </div>
              </div>

              {/* Method Specific Fields */}
              {method === 'GCash' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">GCash Reference Number <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={gcashRef} 
                    onChange={(e) => setGcashRef(e.target.value)} 
                    placeholder="e.g. 900281749122" 
                    className="input-field font-mono" 
                  />
                </div>
              )}

              {method === 'Bank Check' && (
                <div className="space-y-3 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Check Number <span className="text-brand-red">*</span></label>
                      <input 
                        type="text" 
                        value={checkNumber} 
                        onChange={(e) => setCheckNumber(e.target.value)} 
                        placeholder="CHK-XXXXXX" 
                        className="input-field uppercase font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Bank Name</label>
                      <input 
                        type="text" 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)} 
                        placeholder="e.g. BDO / Landbank" 
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Check Date</label>
                    <input 
                      type="date" 
                      value={checkDate} 
                      onChange={(e) => setCheckDate(e.target.value)} 
                      className="input-field" 
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Actual Amount Received (₱) <span className="text-brand-red">*</span></label>
                  <input 
                    type="number" 
                    value={receivedAmount} 
                    onChange={(e) => setReceivedAmount(e.target.value)} 
                    className="input-field text-base font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Collector / Cashier</label>
                  <select 
                    value={collector} 
                    onChange={(e) => setCollector(e.target.value)} 
                    className="input-field cursor-pointer"
                  >
                    <option>Juan Driver</option>
                    <option>Pedro Loader</option>
                    <option>Maria Cashier</option>
                  </select>
                </div>
              </div>

              {/* Live Shortage Indicator (Rule 5) */}
              {paymentModalSale.netBillAmount - paymentModalSale.paidAmount - parseFloat(receivedAmount || 0) > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs space-y-2">
                  <div className="flex justify-between items-center text-amber-800 font-bold">
                    <span>Payment Shortage Detected:</span>
                    <span className="text-brand-red">-{formatPHP(paymentModalSale.netBillAmount - paymentModalSale.paidAmount - parseFloat(receivedAmount || 0))}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Rule 5 Compliance: Original receipt total remains unchanged. Shortage will be logged separately under reconciliation.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shortage Reason / Store Agreement</label>
                    <input 
                      type="text" 
                      value={shortageReason} 
                      onChange={(e) => setShortageReason(e.target.value)} 
                      placeholder="e.g. Store ran out of change, balance tomorrow..." 
                      className="input-field text-xs" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setPaymentModalSale(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleProcessPayment} className="btn-primary text-xs">Confirm & Complete Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500">CUSTOMER OFFICIAL RECEIPT</span>
              <button onClick={() => setSelectedSale(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Area */}
            <div className="p-6 space-y-4 font-sans text-slate-900">
              <div className="text-center border-b border-slate-200 pb-3">
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">LLANO SELECTA DEALER</h2>
                <p className="text-[11px] text-slate-500">Official Ice Cream Distributor • Bukidnon</p>
                <p className="text-[10px] text-slate-400 mt-1">Receipt ID: <strong className="text-slate-800">{selectedSale.id}</strong></p>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Store:</span><span className="font-bold">{selectedSale.customer}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date:</span><span>{selectedSale.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Collector:</span><span>{selectedSale.paymentDetails?.collector || 'Staff'}</span></div>
              </div>

              {/* Items Table */}
              <div className="border-t border-b border-slate-200 py-2 space-y-1 text-xs">
                {selectedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-semibold">{formatPHP(item.qty * item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Order Amount:</span>
                  <span>{formatPHP(selectedSale.grossAmount)}</span>
                </div>
                {selectedSale.missingDeduction > 0 && (
                  <div className="flex justify-between text-brand-red font-medium">
                    <span>Missing Product Deduction:</span>
                    <span>-{formatPHP(selectedSale.missingDeduction)}</span>
                  </div>
                )}
                {selectedSale.boDeduction > 0 && (
                  <div className="flex justify-between text-brand-red font-medium">
                    <span>BO / Melted Item Deduction:</span>
                    <span>-{formatPHP(selectedSale.boDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Final Net Payable:</span>
                  <span>{formatPHP(selectedSale.netBillAmount)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-bold">{selectedSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Actual Cash Received:</span>
                  <span className="font-bold text-emerald-700">{formatPHP(selectedSale.paidAmount)}</span>
                </div>
                {selectedSale.shortageAmount > 0 && (
                  <div className="flex justify-between text-brand-red font-bold pt-1 border-t border-slate-200">
                    <span>Balance / Shortage:</span>
                    <span>{formatPHP(selectedSale.shortageAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Official Receipt
              </button>
              <button onClick={() => setSelectedSale(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}