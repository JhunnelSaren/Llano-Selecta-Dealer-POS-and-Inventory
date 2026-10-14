import React, { useState } from 'react';
import { 
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
  Upload,
  Calendar,
  UserCheck
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { INITIAL_CUSTOMERS } from '../utils/productCatalog';

export default function Payments() {
  const [collections, setCollections] = useState([
    {
      id: 'REM-2026-101',
      invoiceRef: 'SALE-2026-101',
      deliveryRef: 'DEL-2026-101',
      customer: 'Aling Nena Sari-Sari Store',
      area: 'Valencia',
      route: 'Valencia -> San Fernando',
      date: '2026-10-12',
      grossAmount: 5000.00,
      deductions: 206.00, // BO + Missing
      netDue: 4794.00,
      collectedAmount: 4794.00,
      shortageAmount: 0.00,
      paymentMethod: 'Cash',
      remittedBy: 'Juan Driver',
      receiverVault: 'Maria Cashier',
      status: 'Fully Remitted',
      depositSlipPhoto: 'https://images.unsplash.com/photo-1554415707-9e49fe830836?auto=format&fit=crop&q=80&w=700',
      notes: 'Paid in full upon Bongo truck unloading.'
    },
    {
      id: 'REM-2026-102',
      invoiceRef: 'SALE-2026-102',
      deliveryRef: 'DEL-2026-102',
      customer: 'San Isidro Mini-Mart',
      area: 'Valencia',
      route: 'San Isidro Route',
      date: '2026-10-12',
      grossAmount: 10000.00,
      deductions: 174.00,
      netDue: 9826.00,
      collectedAmount: 9000.00,
      shortageAmount: 826.00,
      paymentMethod: 'Cash',
      remittedBy: 'Pedro Loader',
      receiverVault: 'Maria Cashier',
      status: 'Shortage / Partial',
      depositSlipPhoto: null,
      notes: 'Store owner ran short on cash; promised to settle ₱826 on next Tuesday delivery.'
    },
    {
      id: 'REM-2026-103',
      invoiceRef: 'SALE-2026-103',
      deliveryRef: 'DEL-2026-099',
      customer: 'Cabanglasan Express Mart',
      area: 'Cabanglasan Area',
      route: 'Cabanglasan Loop',
      date: '2026-10-11',
      grossAmount: 12500.00,
      deductions: 0.00,
      netDue: 12500.00,
      collectedAmount: 12500.00,
      shortageAmount: 0.00,
      paymentMethod: 'GCash',
      referenceNumber: 'GCASH-9021849102',
      remittedBy: 'Pedro Penduko',
      receiverVault: 'Direct Dealer Wallet',
      status: 'Fully Remitted',
      depositSlipPhoto: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=700',
      notes: 'Direct QR payment verified.'
    },
    {
      id: 'REM-2026-104',
      invoiceRef: 'SALE-2026-104',
      deliveryRef: 'DEL-2026-103',
      customer: 'Batangan Corner Store',
      area: 'Valencia',
      route: 'Valencia -> San Fernando',
      date: '2026-10-10',
      grossAmount: 8400.00,
      deductions: 0.00,
      netDue: 8400.00,
      collectedAmount: 8400.00,
      shortageAmount: 0.00,
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'BDO-TRX-882194',
      remittedBy: 'Juan Driver',
      receiverVault: 'Dealer Bank Account',
      status: 'Fully Remitted',
      depositSlipPhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=700',
      notes: 'Bank transfer confirmation verified via mobile banking.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewProof, setViewProof] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customer: INITIAL_CUSTOMERS[0].store_name,
    invoiceRef: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split('T')[0],
    grossAmount: '',
    deductions: '0',
    collectedAmount: '',
    paymentMethod: 'Cash',
    referenceNumber: '',
    remittedBy: 'Juan Driver',
    depositSlipPhoto: '',
    notes: ''
  });

  // Calculate Metrics
  const totalCollected = collections.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalShortages = collections.reduce((acc, c) => acc + c.shortageAmount, 0);
  const cashCollected = collections.filter(c => c.paymentMethod === 'Cash').reduce((acc, c) => acc + c.collectedAmount, 0);
  const electronicCollected = collections.filter(c => c.paymentMethod !== 'Cash').reduce((acc, c) => acc + c.collectedAmount, 0);

  // Handle Photo Upload from Device
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, depositSlipPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    const gross = parseFloat(formData.grossAmount) || 0;
    const ded = parseFloat(formData.deductions) || 0;
    const net = gross - ded;
    const collected = parseFloat(formData.collectedAmount) || 0;
    const shortage = Math.max(0, net - collected);

    const matchedStore = INITIAL_CUSTOMERS.find(s => s.store_name === formData.customer);

    const newRecord = {
      id: `REM-2026-${100 + collections.length + 1}`,
      invoiceRef: formData.invoiceRef,
      deliveryRef: `DEL-2026-${100 + collections.length + 1}`,
      customer: formData.customer,
      area: matchedStore?.area || 'Valencia',
      route: matchedStore?.route || 'General Route',
      date: formData.date,
      grossAmount: gross,
      deductions: ded,
      netDue: net,
      collectedAmount: collected,
      shortageAmount: shortage,
      paymentMethod: formData.paymentMethod,
      referenceNumber: formData.referenceNumber,
      remittedBy: formData.remittedBy,
      receiverVault: 'Maria Cashier',
      status: shortage > 0 ? 'Shortage / Partial' : 'Fully Remitted',
      depositSlipPhoto: formData.depositSlipPhoto || 'https://images.unsplash.com/photo-1554415707-9e49fe830836?auto=format&fit=crop&q=80&w=700',
      notes: formData.notes || 'Field collection logged.'
    };

    setCollections([newRecord, ...collections]);
    setIsModalOpen(false);
  };

  const filteredCollections = collections.filter(c => {
    const matchesSearch = 
      c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.remittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'All' || c.paymentMethod === filterMethod;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Collections & Remittance</h1>
          <p className="text-sm text-slate-500">
            Dedicated store collection management, driver remittances, physical cash turn-overs, and digital deposits
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Record New Collection
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Collected</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatPHP(totalCollected)}</h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active remitted balance</p>
        </div>

        <div className="card border-l-4 border-l-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Cash In Hand (Vault)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatPHP(cashCollected)}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">From driver field remittances</p>
        </div>

        <div className="card border-l-4 border-l-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">GCash & Bank Deposits</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatPHP(electronicCollected)}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Direct electronic payments</p>
        </div>

        <div className="card border-l-4 border-l-brand-red">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Store Shortages (Unpaid)</p>
              <h3 className="text-2xl font-bold text-brand-red mt-1">{formatPHP(totalShortages)}</h3>
            </div>
            <div className="p-3 bg-red-100 text-brand-red rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Pending store receivables</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Remittance ID, customer name, collector..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div className="flex items-center gap-2 sm:w-48">
            <select 
              value={filterMethod} 
              onChange={(e) => setFilterMethod(e.target.value)}
              className="input-field cursor-pointer text-xs"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="flex items-center gap-2 sm:w-48">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Fully Remitted">Fully Remitted</option>
              <option value="Shortage / Partial">Shortage / Partial</option>
            </select>
          </div>
        </div>

        {/* Collections Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Remittance Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Customer Store & Area</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Net Due</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Amount Remitted</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Method</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Collector</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase text-center">Receipt Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredCollections.length > 0 ? (
                filteredCollections.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-xs">{c.id}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.invoiceRef} • {c.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-xs">{c.customer}</div>
                      <div className="text-[11px] text-slate-500">{c.area} • {c.route}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                      {formatPHP(c.netDue)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold text-emerald-700">{formatPHP(c.collectedAmount)}</div>
                      {c.shortageAmount > 0 && (
                        <div className="text-[11px] text-brand-red font-semibold">
                          Short: {formatPHP(c.shortageAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        c.paymentMethod === 'Cash' 
                          ? 'bg-blue-100 text-blue-800' 
                          : c.paymentMethod === 'GCash'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.paymentMethod}
                      </span>
                      {c.referenceNumber && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.referenceNumber}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 font-medium">
                      {c.remittedBy}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.status === 'Fully Remitted' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.depositSlipPhoto ? (
                        <button
                          onClick={() => setViewProof(c)}
                          className="p-1 text-slate-500 hover:text-brand-red rounded transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          title="View Remittance Slip Photo"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Slip
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No photo</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                    No payment collection records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-bold text-slate-800">Record Store Remittance</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Store *</label>
                <select 
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="input-field text-xs"
                >
                  {INITIAL_CUSTOMERS.map(c => (
                    <option key={c.id} value={c.store_name}>{c.store_name} ({c.area})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invoice / Delivery Ref #</label>
                  <input 
                    type="text" 
                    value={formData.invoiceRef}
                    onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collection Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gross Bill (₱) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="0.00"
                    value={formData.grossAmount}
                    onChange={(e) => setFormData({ ...formData, grossAmount: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BO/Damages Ded (₱)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Paid (₱) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    placeholder="0.00"
                    value={formData.collectedAmount}
                    onChange={(e) => setFormData({ ...formData, collectedAmount: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select 
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="input-field text-xs"
                  >
                    <option value="Cash">Cash (Physical Bill Turn-over)</option>
                    <option value="GCash">GCash QR / Mobile Wallet</option>
                    <option value="Bank Transfer">Bank Transfer (BDO / Landbank)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Collector / Driver Staff</label>
                  <select 
                    value={formData.remittedBy}
                    onChange={(e) => setFormData({ ...formData, remittedBy: e.target.value })}
                    className="input-field text-xs"
                  >
                    <option value="Juan Driver">Juan Driver</option>
                    <option value="Pedro Loader">Pedro Loader</option>
                    <option value="Roberto Backride">Roberto Backride</option>
                    <option value="Maria Cashier">Maria Cashier</option>
                  </select>
                </div>
              </div>

              {formData.paymentMethod !== 'Cash' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Reference Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. GCash Ref # or Bank Trace #"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="input-field text-xs font-mono"
                  />
                </div>
              )}

              {/* Upload Deposit / Slip Photo from Device */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Remittance Receipt / Deposit Slip Photo (From Device)
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white hover:file:bg-brand-dark cursor-pointer"
                  />
                </div>
                {formData.depositSlipPhoto && (
                  <div className="mt-2 h-20 w-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={formData.depositSlipPhoto} alt="Slip Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Shortage Reason</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Store short on cash, remaining balance payable next delivery..."
                  className="input-field text-xs h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Remittance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Proof Modal */}
      {viewProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Remittance Receipt / Slip Proof</h3>
              <button onClick={() => setViewProof(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-800">{viewProof.customer}</div>
                <div className="text-slate-500">Ref: {viewProof.id} • {formatPHP(viewProof.collectedAmount)} ({viewProof.paymentMethod})</div>
              </div>
              <div className="max-h-80 overflow-hidden rounded-lg border border-slate-200 flex items-center justify-center bg-slate-100">
                <img src={viewProof.depositSlipPhoto} alt="Remittance Proof" className="max-h-80 w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
