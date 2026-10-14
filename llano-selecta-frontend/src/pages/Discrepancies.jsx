import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  Filter, 
  DollarSign, 
  X, 
  Printer, 
  Eye, 
  FileText, 
  IceCream, 
  TrendingDown, 
  Truck, 
  Store, 
  PackageX,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Discrepancies() {
  // Available SELECTA products for discrepancy entry
  const availableProducts = [
    { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', price: 28.00 },
    { id: 'PRD-002', name: 'Cornetto Chocolate 110ml', price: 28.00 },
    { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', price: 58.00 },
    { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', price: 195.00 },
    { id: 'PRD-005', name: 'SELECTA 3-in-1 Double Dutch 1.3L', price: 165.00 }
  ];

  // Mock Discrepancy Records (Missing Products & BO / Melted Items)
  const [discrepancyLogs, setDiscrepancyLogs] = useState([
    {
      id: 'DISC-2026-001',
      deliveryRef: 'DEL-2026-102',
      customer: 'Aling Nena Sari-Sari',
      route: 'Valencia -> San Fernando',
      date: '2026-10-09',
      type: 'Missing Product',
      productName: 'Cornetto Vanilla 110ml',
      orderedQty: 20,
      deliveredQty: 18,
      discrepancyQty: 2,
      unitPrice: 28.00,
      deductionAmount: 56.00, // 2 x ₱28
      originalInvoiceAmount: 5000.00,
      adjustedInvoiceAmount: 4944.00,
      reason: 'Forgotten in Bongo Ice Box #001 during packing',
      recordedBy: 'Juan Driver',
      condition: 'Not Delivered',
      photoProof: false
    },
    {
      id: 'DISC-2026-002',
      deliveryRef: 'DEL-2026-102',
      customer: 'San Isidro Mini-Mart',
      route: 'San Isidro Route',
      date: '2026-10-09',
      type: 'BO / Melted',
      productName: 'Magnum Classic Almond 80ml',
      orderedQty: 10,
      deliveredQty: 10,
      discrepancyQty: 3,
      unitPrice: 58.00,
      deductionAmount: 174.00, // 3 x ₱58
      originalInvoiceAmount: 3200.00,
      adjustedInvoiceAmount: 3026.00,
      reason: 'Melted during delivery transition due to defective ice pack seal',
      recordedBy: 'Pedro Loader',
      condition: 'Soft / Melted - Returned to Store',
      photoProof: true
    },
    {
      id: 'DISC-2026-003',
      deliveryRef: 'DEL-2026-098',
      customer: 'Cabanglasan Express',
      route: 'Cabanglasan Route',
      date: '2026-10-08',
      type: 'BO / Melted',
      productName: 'Big Scoop Chocolate Fudge 1.5L',
      orderedQty: 5,
      deliveredQty: 5,
      discrepancyQty: 1,
      unitPrice: 195.00,
      deductionAmount: 195.00,
      originalInvoiceAmount: 8500.00,
      adjustedInvoiceAmount: 8305.00,
      reason: 'Damaged tub lid during transport bump',
      recordedBy: 'Juan Driver',
      condition: 'Lid Cracked / Unsealed',
      photoProof: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  // New Discrepancy Form State
  const [formDeliveryRef, setFormDeliveryRef] = useState('DEL-2026-105');
  const [formCustomer, setFormCustomer] = useState('');
  const [formType, setFormType] = useState('Missing Product');
  const [formProductId, setFormProductId] = useState('PRD-001');
  const [formOrderedQty, setFormOrderedQty] = useState(10);
  const [formDeliveredQty, setFormDeliveredQty] = useState(8);
  const [formDiscrepancyQty, setFormDiscrepancyQty] = useState(2);
  const [formUnitPrice, setFormUnitPrice] = useState(28.00);
  const [formOriginalInvoice, setFormOriginalInvoice] = useState(5000.00);
  const [formReason, setFormReason] = useState('Forgotten during packing');
  const [formRecordedBy, setFormRecordedBy] = useState('Juan Driver');
  const [formCondition, setFormCondition] = useState('Not Delivered');

  // Calculations for live form
  const calculatedDeduction = formDiscrepancyQty * formUnitPrice;
  const calculatedAdjustedInvoice = Math.max(0, formOriginalInvoice - calculatedDeduction);

  const handleProductSelect = (pId) => {
    const prod = availableProducts.find(p => p.id === pId);
    if (!prod) return;
    setFormProductId(prod.id);
    setFormUnitPrice(prod.price);
  };

  const handleQtyChange = (qty) => {
    const val = Math.max(1, parseInt(qty) || 1);
    setFormDiscrepancyQty(val);
    if (formType === 'Missing Product') {
      setFormDeliveredQty(Math.max(0, formOrderedQty - val));
    }
  };

  const handleSaveDiscrepancy = () => {
    if (!formCustomer.trim()) {
      alert('Please select or enter a store name.');
      return;
    }

    const selectedProduct = availableProducts.find(p => p.id === formProductId);

    const newRecord = {
      id: `DISC-2026-${100 + discrepancyLogs.length + 1}`,
      deliveryRef: formDeliveryRef,
      customer: formCustomer,
      route: 'Valencia -> San Fernando',
      date: new Date().toISOString().split('T')[0],
      type: formType,
      productName: selectedProduct ? selectedProduct.name : 'Cornetto Vanilla 110ml',
      orderedQty: formOrderedQty,
      deliveredQty: formDeliveredQty,
      discrepancyQty: formDiscrepancyQty,
      unitPrice: formUnitPrice,
      deductionAmount: calculatedDeduction,
      originalInvoiceAmount: formOriginalInvoice,
      adjustedInvoiceAmount: calculatedAdjustedInvoice,
      reason: formReason,
      recordedBy: formRecordedBy,
      condition: formCondition,
      photoProof: formType === 'BO / Melted'
    };

    setDiscrepancyLogs([newRecord, ...discrepancyLogs]);
    setIsModalOpen(false);
    setFormCustomer('');
    setFormReason('');
  };

  // Metrics summary
  const totalMissingDeductions = discrepancyLogs
    .filter(d => d.type === 'Missing Product')
    .reduce((sum, d) => sum + d.deductionAmount, 0);

  const totalBODeductions = discrepancyLogs
    .filter(d => d.type === 'BO / Melted')
    .reduce((sum, d) => sum + d.deductionAmount, 0);

  const filteredLogs = discrepancyLogs.filter(d => {
    const matchesSearch = d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.deliveryRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missing Products & BO (Melted) Log</h1>
          <p className="text-sm text-slate-500">Field delivery adjustments, customer deductions & invoice auto-reconciliation</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Log Field Discrepancy
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing Product Deductions</p>
            <h3 className="text-xl font-bold text-slate-900">{formatPHP(totalMissingDeductions)}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <IceCream className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BO / Melted Deductions</p>
            <h3 className="text-xl font-bold text-slate-900">{formatPHP(totalBODeductions)}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-slate-800">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Adjustments</p>
            <h3 className="text-xl font-bold text-brand-red">{formatPHP(totalMissingDeductions + totalBODeductions)}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Discrepancy ID, Store, Delivery Ref, or Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Discrepancy Types</option>
              <option value="Missing Product">Missing Products Only</option>
              <option value="BO / Melted">BO / Melted Only</option>
            </select>
          </div>
        </div>

        {/* Discrepancy Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ref ID / Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store & Delivery</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Affected Item</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Deduction</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Adjusted Invoice</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{log.id}</div>
                      <div className="text-[11px] text-slate-400">{log.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{log.customer}</div>
                      <div className="text-xs text-slate-500 font-mono">{log.deliveryRef} • {log.recordedBy}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
                        log.type === 'Missing Product' 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {log.type === 'BO / Melted' ? <IceCream className="w-3 h-3" /> : <PackageX className="w-3 h-3" />}
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-slate-800">{log.productName}</div>
                      <div className="text-xs text-slate-500">
                        {log.discrepancyQty} units @ {formatPHP(log.unitPrice)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-brand-red">
                      -{formatPHP(log.deductionAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{formatPHP(log.adjustedInvoiceAmount)}</div>
                      <div className="text-[11px] text-slate-400 line-through">Orig: {formatPHP(log.originalInvoiceAmount)}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedDiscrepancy(log)}
                        className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No delivery discrepancies found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Discrepancy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Log Delivery Discrepancy</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discrepancy Category <span className="text-brand-red">*</span></label>
                  <select 
                    value={formType}
                    onChange={(e) => {
                      setFormType(e.target.value);
                      setFormCondition(e.target.value === 'BO / Melted' ? 'Soft / Melted in Transit' : 'Not Delivered');
                    }}
                    className="input-field cursor-pointer"
                  >
                    <option value="Missing Product">Missing Product (Rule 3)</option>
                    <option value="BO / Melted">BO / Melted Item (Rule 4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Reference</label>
                  <input 
                    type="text" 
                    value={formDeliveryRef}
                    onChange={(e) => setFormDeliveryRef(e.target.value)}
                    className="input-field uppercase" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Store / Customer <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    placeholder="e.g. Aling Nena Sari-Sari" 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Recorded By Staff</label>
                  <select 
                    value={formRecordedBy}
                    onChange={(e) => setFormRecordedBy(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Juan Driver</option>
                    <option>Pedro Loader</option>
                    <option>Maria Checker</option>
                  </select>
                </div>
              </div>

              {/* Product & Deduction Calculator */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Item Deduction Calculator</span>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Discrepant SKU</label>
                  <select 
                    value={formProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="input-field text-xs cursor-pointer"
                  >
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} — Dealer Price: {formatPHP(p.price)}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Unit Price</label>
                    <input 
                      type="number" 
                      value={formUnitPrice}
                      onChange={(e) => setFormUnitPrice(parseFloat(e.target.value) || 0)}
                      className="input-field text-xs text-center font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Discrepancy Qty</label>
                    <input 
                      type="number" 
                      min="1"
                      value={formDiscrepancyQty}
                      onChange={(e) => handleQtyChange(e.target.value)}
                      className="input-field text-xs text-center font-bold text-brand-red bg-red-50/50" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Auto Deduction</label>
                    <div className="input-field text-xs font-bold text-brand-red bg-slate-100 flex items-center justify-center">
                      {formatPHP(calculatedDeduction)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Original Receipt Total (₱)</label>
                  <input 
                    type="number" 
                    value={formOriginalInvoice}
                    onChange={(e) => setFormOriginalInvoice(parseFloat(e.target.value) || 0)}
                    className="input-field font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Final Customer Amount</label>
                  <div className="input-field font-bold text-emerald-700 bg-emerald-50 border-emerald-200 flex items-center">
                    {formatPHP(calculatedAdjustedInvoice)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Description</label>
                <textarea 
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Explain why the product was missing or melted..."
                  className="input-field resize-none h-16"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveDiscrepancy} className="btn-primary text-xs">Confirm & Apply Bill Deduction</button>
            </div>
          </div>
        </div>
      )}

      {/* Details / Receipt Slip Modal */}
      {selectedDiscrepancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500">DELIVERY DISCREPANCY & DEDUCTION VOUCHER</span>
              <button onClick={() => setSelectedDiscrepancy(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedDiscrepancy.customer}</h2>
                  <p className="text-xs text-slate-500">{selectedDiscrepancy.route}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-red">{selectedDiscrepancy.id}</p>
                  <p className="text-[11px] text-slate-400">{selectedDiscrepancy.date}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Discrepancy Type:</span>
                  <span className="font-bold text-slate-800">{selectedDiscrepancy.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Delivery Reference:</span>
                  <span className="font-mono text-slate-800">{selectedDiscrepancy.deliveryRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Recorded By Staff:</span>
                  <span className="text-slate-800">{selectedDiscrepancy.recordedBy}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Deduction Breakdown</p>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-800">{selectedDiscrepancy.discrepancyQty}x {selectedDiscrepancy.productName}</span>
                  <span className="font-bold text-brand-red">-{formatPHP(selectedDiscrepancy.deductionAmount)}</span>
                </div>
                
                <div className="pt-2 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Original Hardcopy Invoice:</span>
                    <span>{formatPHP(selectedDiscrepancy.originalInvoiceAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Adjusted Bill Payable:</span>
                    <span className="text-emerald-700">{formatPHP(selectedDiscrepancy.adjustedInvoiceAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedDiscrepancy.reason && (
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span className="font-bold text-amber-800">Reason / Condition Note:</span> {selectedDiscrepancy.reason}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Deduction Slip
              </button>
              <button onClick={() => setSelectedDiscrepancy(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}