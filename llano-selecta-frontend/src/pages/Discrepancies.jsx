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
  CheckCircle2,
  Upload,
  Layers
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES, INITIAL_CUSTOMERS } from '../utils/productCatalog';

export default function Discrepancies() {
  // Mock Discrepancy Records (Missing Products & BO / Melted Items)
  const [discrepancyLogs, setDiscrepancyLogs] = useState([
    {
      id: 'DISC-2026-001',
      deliveryRef: 'DEL-2026-102',
      customer: 'Aling Nena Sari-Sari Store',
      route: 'Valencia City Route (Batangan)',
      date: '2026-10-09',
      type: 'Missing Product',
      category: 'CORNETTO',
      productName: 'CHOCOLATE',
      orderedQty: 20,
      deliveredQty: 18,
      discrepancyQty: 2,
      unitPrice: 484.80,
      deductionAmount: 969.60,
      originalInvoiceAmount: 26215.60,
      adjustedInvoiceAmount: 25246.00,
      reason: 'Forgotten in Bongo Ice Box #001 during warehouse packing',
      recordedBy: 'Juan Driver',
      condition: 'Not Delivered',
      photoProof: null
    },
    {
      id: 'DISC-2026-002',
      deliveryRef: 'DEL-2026-102',
      customer: 'San Isidro Mini-Mart',
      route: 'Valencia City Route (San-Isidro)',
      date: '2026-10-09',
      type: 'BO / Melted',
      category: 'MAGNUM',
      productName: 'CLASSIC',
      orderedQty: 10,
      deliveredQty: 10,
      discrepancyQty: 3,
      unitPrice: 1651.96,
      deductionAmount: 4955.88,
      originalInvoiceAmount: 15543.64,
      adjustedInvoiceAmount: 10587.76,
      reason: 'Defective dry ice pack seal in corner of box; softened during afternoon trip',
      recordedBy: 'Pedro Loader',
      condition: 'Soft / Melted - Returned to Warehouse',
      photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'DISC-2026-003',
      deliveryRef: 'DEL-2026-098',
      customer: 'Cabanglasan Highland Corner',
      route: 'Cabanglasan Loop',
      date: '2026-10-08',
      type: 'BO / Melted',
      category: 'SUPREME 1.3L',
      productName: 'DOUBLE DUTCH',
      orderedQty: 5,
      deliveredQty: 5,
      discrepancyQty: 1,
      unitPrice: 1477.58,
      deductionAmount: 1477.58,
      originalInvoiceAmount: 12120.00,
      adjustedInvoiceAmount: 10642.42,
      reason: 'Damaged tub rim during rough transport bump on unpaved road',
      recordedBy: 'Juan Driver',
      condition: 'Lid Cracked / Unsealed',
      photoProof: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  // Form State with All Categories & Flavors
  const [formDeliveryRef, setFormDeliveryRef] = useState('DEL-2026-105');
  const [formCustomer, setFormCustomer] = useState(INITIAL_CUSTOMERS[0].store_name);
  const [formType, setFormType] = useState('BO / Melted'); // 'Missing Product' | 'BO / Melted'
  const [selectedCategory, setSelectedCategory] = useState(SELECTA_CATEGORIES[0]);
  const [formProductId, setFormProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [formOrderedQty, setFormOrderedQty] = useState(10);
  const [formDeliveredQty, setFormDeliveredQty] = useState(8);
  const [formDiscrepancyQty, setFormDiscrepancyQty] = useState(2);
  const [formUnitPrice, setFormUnitPrice] = useState(Number(INITIAL_PRODUCTS[0].dealerPrice || INITIAL_PRODUCTS[0].unit_price));
  const [formOriginalInvoice, setFormOriginalInvoice] = useState(5000.00);
  const [formReason, setFormReason] = useState('Ice pack seal melted during transport');
  const [formRecordedBy, setFormRecordedBy] = useState('Juan Driver');
  const [formCondition, setFormCondition] = useState('Melted / Soft');
  const [formPhotoProof, setFormPhotoProof] = useState('');

  // Products filtered by currently selected category
  const categoryProducts = INITIAL_PRODUCTS.filter(p => p.category === selectedCategory);

  // When category changes, auto-select first flavor in that category
  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    const firstInCat = INITIAL_PRODUCTS.find(p => p.category === newCat);
    if (firstInCat) {
      setFormProductId(firstInCat.id);
      setFormUnitPrice(Number(firstInCat.dealerPrice || firstInCat.unit_price));
    }
  };

  const handleFlavorChange = (prodId) => {
    const prod = INITIAL_PRODUCTS.find(p => p.id === prodId);
    if (!prod) return;
    setFormProductId(prod.id);
    setFormUnitPrice(Number(prod.dealerPrice || prod.unit_price));
  };

  // Handle Photo Upload from Device
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormPhotoProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculations for live form
  const calculatedDeduction = formDiscrepancyQty * formUnitPrice;
  const calculatedAdjustedInvoice = Math.max(0, formOriginalInvoice - calculatedDeduction);

  const handleQtyChange = (qty) => {
    const val = Math.max(1, parseInt(qty) || 1);
    setFormDiscrepancyQty(val);
    if (formType === 'Missing Product') {
      setFormDeliveredQty(Math.max(0, formOrderedQty - val));
    }
  };

  const handleSaveDiscrepancy = () => {
    if (!formCustomer.trim()) {
      alert('Please select a store.');
      return;
    }

    const selectedProduct = INITIAL_PRODUCTS.find(p => p.id === formProductId);
    const matchedCustomer = INITIAL_CUSTOMERS.find(c => c.store_name === formCustomer);

    const newRecord = {
      id: `DISC-2026-${100 + discrepancyLogs.length + 1}`,
      deliveryRef: formDeliveryRef,
      customer: formCustomer,
      route: matchedCustomer?.route || 'Valencia City Route',
      date: new Date().toISOString().split('T')[0],
      type: formType,
      category: selectedCategory,
      productName: selectedProduct ? selectedProduct.name : 'Ice Cream Product',
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
      photoProof: formPhotoProof
    };

    setDiscrepancyLogs([newRecord, ...discrepancyLogs]);
    setIsModalOpen(false);
    setFormPhotoProof('');
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
                          d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.category && d.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missing Products & BO (Melted) Log</h1>
          <p className="text-sm text-slate-500">Log discrepancies across all product categories & flavors with device photo evidence</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormPhotoProof('');
          }}
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
            <span className="text-[11px] text-red-600 font-medium">Packing omissions</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <IceCream className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BO / Melted Deductions</p>
            <h3 className="text-xl font-bold text-slate-900">{formatPHP(totalBODeductions)}</h3>
            <span className="text-[11px] text-amber-600 font-medium">Transit damage & melting</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-slate-800">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Adjustments</p>
            <h3 className="text-xl font-bold text-brand-red">{formatPHP(totalMissingDeductions + totalBODeductions)}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Deducted from invoices</span>
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
              placeholder="Search by Discrepancy ID, Store, Product flavor, or Category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field cursor-pointer text-xs font-semibold"
            >
              <option value="All">All Discrepancy Types</option>
              <option value="Missing Product">Missing Product Only</option>
              <option value="BO / Melted">BO / Melted Only</option>
            </select>
          </div>
        </div>

        {/* Discrepancy Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Log Ref / Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store Customer</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category & Flavor</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type & Qty</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Deduction</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Photo Proof</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{log.id}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.deliveryRef} • {log.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{log.customer}</div>
                      <div className="text-xs text-slate-500">{log.route}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{log.productName}</div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.category || 'SELECTA SKU'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                        log.type === 'BO / Melted' 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {log.type}
                      </span>
                      <div className="text-xs font-semibold text-slate-700 mt-1">
                        {log.discrepancyQty} units @ {formatPHP(log.unitPrice)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-red-600">
                        -{formatPHP(log.deductionAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Inv: {formatPHP(log.adjustedInvoiceAmount)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {log.photoProof ? (
                        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedDiscrepancy(log)}>
                          <img src={log.photoProof} alt="Proof" className="w-9 h-9 object-cover rounded border" />
                          <span className="text-[11px] text-blue-600 hover:underline font-medium">View</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No photo</span>
                      )}
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
                    No discrepancies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Discrepancy Modal with All Categories and Flavors */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Log Missing Product or BO (Melted)</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discrepancy Type</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="input-field cursor-pointer text-xs font-bold text-brand-red"
                  >
                    <option value="BO / Melted">BO / Melted (Soft ice cream, damaged packaging)</option>
                    <option value="Missing Product">Missing Product (Shortage in packing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Select Store Customer</label>
                  <select 
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    className="input-field cursor-pointer text-xs font-medium"
                  >
                    {INITIAL_CUSTOMERS.map(c => (
                      <option key={c.id} value={c.store_name}>{c.store_name} ({c.area})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category and Flavor Selection */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  1. Select Product Category & Specific Flavor:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product Category</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input-field cursor-pointer text-xs font-bold text-brand-red"
                    >
                      {SELECTA_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Specific Flavor / Type</label>
                    <select 
                      value={formProductId}
                      onChange={(e) => handleFlavorChange(e.target.value)}
                      className="input-field cursor-pointer text-xs font-semibold"
                    >
                      {categoryProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({formatPHP(p.dealerPrice || p.unit_price)})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-600 font-medium">Dealer Cost Unit Price:</span>
                  <span className="font-bold text-slate-900">{formatPHP(formUnitPrice)}</span>
                </div>
              </div>

              {/* Quantities & Auto Deduction */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discrepancy Qty</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={formDiscrepancyQty} 
                    onChange={(e) => handleQtyChange(e.target.value)}
                    className="input-field text-xs text-center font-bold text-red-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Original Invoice (₱)</label>
                  <input 
                    type="number" 
                    value={formOriginalInvoice} 
                    onChange={(e) => setFormOriginalInvoice(parseFloat(e.target.value) || 0)}
                    className="input-field text-xs text-center font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Calculated Deduction</label>
                  <div className="input-field bg-red-50 text-red-700 font-bold text-center text-xs flex items-center justify-center">
                    -{formatPHP(calculatedDeduction)}
                  </div>
                </div>
              </div>

              {/* Photo Upload from Device */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-brand-red" /> Photo Evidence from Device (BO / Melted / Damaged)
                </label>
                {formPhotoProof ? (
                  <div className="space-y-1.5">
                    <img src={formPhotoProof} alt="Proof preview" className="w-full h-32 object-cover rounded border" />
                    <div className="flex justify-between">
                      <label className="btn-secondary text-xs py-0.5 px-2 cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Replace Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                      <button type="button" onClick={() => setFormPhotoProof('')} className="text-xs text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer block hover:bg-slate-100">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-brand-red block">Click to upload photo from camera or files</span>
                    <span className="text-[10px] text-slate-400">Shows melted/damaged ice cream</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason & Explanation</label>
                <textarea 
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Explain why the product is missing or melted..."
                  className="input-field resize-none h-14 text-xs"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Adjusted Invoice:</span>
                <span className="text-base font-bold text-brand-red">{formatPHP(calculatedAdjustedInvoice)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
                <button onClick={handleSaveDiscrepancy} className="btn-primary text-xs">Confirm & Save Deduction</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedDiscrepancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase">Field Discrepancy Voucher</span>
              <button onClick={() => setSelectedDiscrepancy(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedDiscrepancy.id}</h2>
                  <p className="text-xs text-slate-500">Delivery: {selectedDiscrepancy.deliveryRef} • {selectedDiscrepancy.date}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  selectedDiscrepancy.type === 'BO / Melted' 
                    ? 'bg-amber-100 text-amber-800 border-amber-200' 
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {selectedDiscrepancy.type}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div><span className="text-slate-400 font-semibold">Store:</span> <strong>{selectedDiscrepancy.customer}</strong></div>
                <div><span className="text-slate-400 font-semibold">Route:</span> {selectedDiscrepancy.route}</div>
                <div><span className="text-slate-400 font-semibold">Recorded By:</span> {selectedDiscrepancy.recordedBy}</div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{selectedDiscrepancy.productName}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({selectedDiscrepancy.category})</span>
                  </div>
                  <span className="font-bold text-red-600">-{formatPHP(selectedDiscrepancy.deductionAmount)}</span>
                </div>
                <div className="text-slate-500 text-[11px] flex justify-between">
                  <span>Quantity Affected: {selectedDiscrepancy.discrepancyQty} units</span>
                  <span>Unit Price: {formatPHP(selectedDiscrepancy.unitPrice)}</span>
                </div>
              </div>

              {selectedDiscrepancy.photoProof && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase">Uploaded Photo Proof</p>
                  <img src={selectedDiscrepancy.photoProof} alt="Proof" className="w-full h-40 object-cover rounded-lg border" />
                </div>
              )}

              {selectedDiscrepancy.reason && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-0.5">Reason:</span>
                  {selectedDiscrepancy.reason}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Voucher
              </button>
              <button onClick={() => setSelectedDiscrepancy(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}