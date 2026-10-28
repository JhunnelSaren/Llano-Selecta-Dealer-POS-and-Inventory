import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  History, 
  AlertTriangle, 
  TrendingDown, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  FileSpreadsheet,
  X,
  Edit,
  ShoppingCart
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Discrepancies from './Discrepancies';

export default function InventoryModule() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Sub-tabs: 'stock' | 'movements' | 'damaged' | 'low-stock'
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'stock');

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Physical Count Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustData, setAdjustData] = useState({
    newCount: '',
    reason: '',
    movementType: 'Physical Count Adjustment',
    authorizedBy: currentUser?.name || 'Authorized Staff'
  });

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Fetch products & inventory ledger from database
  const loadInventory = async () => {
    setLoading(true);
    try {
      const [prodRes, movRes] = await Promise.all([
        api.get('/api/products').catch(() => []),
        api.get('/api/inventory').catch(() => [])
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(movRes)) setMovements(movRes);
    } catch (err) {
      console.warn('Inventory fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.barcode || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Low stock products
  const lowStockProducts = products.filter(p => (p.stock || 0) <= (p.min_stock || 15));

  // Total inventory valuation
  const totalValuation = products.reduce((sum, p) => sum + ((p.stock || 0) * Number(p.dealer_price || p.unit_price || 0)), 0);
  const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // Categories list
  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Open Adjust Modal
  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustData({
      newCount: String(product.stock || 0),
      reason: 'Regular weekly physical stock verification',
      movementType: 'Physical Count Adjustment',
      authorizedBy: currentUser?.name || 'Warehouse Staff'
    });
    setErrorMsg('');
    setSuccessMsg('');
    setIsAdjustModalOpen(true);
  };

  // Submit Physical Count Adjustment
  const handleSaveAdjustment = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const newQty = parseInt(adjustData.newCount, 10);
    if (isNaN(newQty)) {
      setErrorMsg('Please enter a valid count.');
      return;
    }

    if (newQty < 0) {
      if (currentUser?.role !== 'Admin') {
        setErrorMsg('Negative stock is prevented. Only Dealer Admin can authorize negative count adjustments.');
        return;
      }
    }

    if (!adjustData.reason.trim()) {
      setErrorMsg('A documented reason is required for inventory adjustments.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/inventory/adjust', {
        productId: selectedProduct.id,
        newStock: newQty,
        reason: adjustData.reason,
        staff: adjustData.authorizedBy,
        type: adjustData.movementType
      });

      setSuccessMsg(`Stock for ${selectedProduct.name} updated to ${newQty} units.`);
      setIsAdjustModalOpen(false);
      loadInventory();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to adjust stock count.');
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Product ID / SKU', 'Barcode', 'Product Name', 'Category', 'Unit', 'Selling Price (SRP)', 'Dealer Cost', 'Physical Stock', 'Min Safety Level', 'Valuation'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.barcode || '',
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.unit || 'Pack',
      Number(p.srp || p.unit_price || 0).toFixed(2),
      Number(p.dealer_price || p.unit_price || 0).toFixed(2),
      p.stock || 0,
      p.min_stock || 15,
      ((p.stock || 0) * Number(p.dealer_price || p.unit_price || 0)).toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Selecta_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'stock', label: 'Stock on Hand', icon: Boxes, count: products.length },
    { id: 'movements', label: 'Stock Movements', icon: History, count: movements.length },
    { id: 'damaged', label: 'Damaged / BO', icon: AlertTriangle, count: null },
    { id: 'low-stock', label: 'Low Stock Alerts', icon: TrendingDown, count: lowStockProducts.length, alert: lowStockProducts.length > 0 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner & Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Boxes className="w-6 h-6 text-purple-600" />
              Dealer Internal Inventory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly auditable cold-storage stock ledger • Saleable stock separate from damaged/BO stock
            </p>
          </div>

          {/* Quick Valuation Stats */}
          <div className="flex items-center gap-4 text-xs font-semibold bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Total Sellable Stock</span>
              <strong className="text-slate-900">{totalUnits.toLocaleString()} Units</strong>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="text-slate-400 block text-[10px]">Inventory Valuation</span>
              <strong className="text-emerald-700">{formatPHP(totalValuation)}</strong>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : tab.alert 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: STOCK ON HAND */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
            {/* Search & Category Filter */}
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search SKU, Selecta product name or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4" /> Export Excel
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">SKU / ID</th>
                  <th className="py-3 px-4">Selecta Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3 text-right">Selling Price</th>
                  <th className="py-3 px-3 text-right">Dealer Cost</th>
                  <th className="py-3 px-3 text-center">In Stock</th>
                  <th className="py-3 px-3 text-center">Min Level</th>
                  <th className="py-3 px-3 text-right">Valuation</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 italic">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLow = (p.stock || 0) <= (p.min_stock || 15);
                    const valuation = (p.stock || 0) * Number(p.dealer_price || p.unit_price || 0);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.barcode || 'No barcode'}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.category}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {formatPHP(p.srp || p.unit_price)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {formatPHP(p.dealer_price || p.unit_price)}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-slate-900">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs ${
                            isLow ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {p.stock || 0} {p.unit || 'Units'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500 font-medium">
                          {p.min_stock || 15}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700">
                          {formatPHP(valuation)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isLow ? 'Low Stock' : 'Good Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => openAdjustModal(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                          >
                            Adjust Count
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STOCK MOVEMENTS LEDGER */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Auditable Stock Movement Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every entry from receiving, dispatch, customer sales, intact returns, BO returns, and adjustments
              </p>
            </div>
            <button
              onClick={loadInventory}
              className="text-xs font-bold text-purple-600 hover:text-purple-700"
            >
              Refresh Ledger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-3 text-center">Change Qty</th>
                  <th className="py-3 px-3 text-center">Running Stock</th>
                  <th className="py-3 px-4">Reference #</th>
                  <th className="py-3 px-4">Staff</th>
                  <th className="py-3 px-4">Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                      No stock movement entries recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((m, idx) => {
                    const isPositive = Number(m.change_qty) > 0;
                    return (
                      <tr key={m.id || idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {formatDate(m.timestamp || m.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{m.product_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{m.product_id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                            {m.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={isPositive ? 'text-emerald-700' : 'text-red-600'}>
                            {isPositive ? `+${m.change_qty}` : m.change_qty}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                          {m.running_on_hand || m.stock_after || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{m.reference_no || '—'}</td>
                        <td className="py-3 px-4 text-slate-700">{m.staff || 'System'}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{m.notes || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DAMAGED / BO TRACKER */}
      {activeTab === 'damaged' && (
        <Discrepancies />
      )}

      {/* SUB-TAB 4: LOW STOCK ALERTS */}
      {activeTab === 'low-stock' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-red-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Products Below Minimum Safety Threshold ({lowStockProducts.length})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Action required: Reorder immediately from Selecta Bodega to prevent stockouts on upcoming routes
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/orders-delivery?tab=bodega')}
              className="btn-primary py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" /> Create Bodega Order
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3 text-center">Current Stock</th>
                  <th className="py-3 px-3 text-center">Safety Minimum</th>
                  <th className="py-3 px-3 text-center text-red-700">Shortage Gap</th>
                  <th className="py-3 px-4 text-right">Suggested Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-emerald-700 font-semibold">
                      ✓ All product SKUs are well stocked above their safety minimum levels!
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map((p) => {
                    const gap = Math.max(0, (p.min_stock || 15) - (p.stock || 0));
                    const suggested = gap + 30; // Suggested buffer
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                        <td className="py-3 px-4 text-slate-600">{p.category}</td>
                        <td className="py-3 px-3 text-center font-mono font-black text-red-600">
                          {p.stock || 0}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                          {p.min_stock || 15}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-red-700">
                          −{gap} units
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            +{suggested} {p.unit || 'Units'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHYSICAL COUNT ADJUSTMENT MODAL */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Adjust Physical Stock Count</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedProduct.name} ({selectedProduct.id})</p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Recorded System Stock:</span>
                <span className="font-mono font-black text-slate-900">{selectedProduct.stock || 0} Units</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Actual Physical Count Verified <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={adjustData.newCount}
                  onChange={(e) => setAdjustData({ ...adjustData, newCount: e.target.value })}
                  className="input-field text-sm font-bold font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Documented Reason for Adjustment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="input-field resize-none text-xs"
                  placeholder="e.g. Discrepancy found during monthly freezer warehouse count"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Staff / User
                </label>
                <input
                  type="text"
                  value={adjustData.authorizedBy}
                  onChange={(e) => setAdjustData({ ...adjustData, authorizedBy: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-2 px-5 rounded-xl font-black shadow-sm"
                >
                  {loading ? 'Saving...' : 'Confirm Count Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}