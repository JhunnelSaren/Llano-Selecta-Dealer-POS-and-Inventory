import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Layers, 
  IceCream, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  TrendingUp, 
  FileText, 
  Download, 
  X, 
  Eye,
  Plus,
  Boxes,
  RotateCcw,
  Truck
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Inventory() {
  // Products Stock Master loaded from catalog with calculated reserves
  const [stockBalances, setStockBalances] = useState(
    INITIAL_PRODUCTS.map((p, index) => ({
      id: p.id,
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      unitPrice: Number(p.dealerPrice || p.unit_price),
      onHand: p.stock || 50,
      reserved: index % 3 === 0 ? 10 : 0, // Allocated to active Bongo dispatch
      minStock: p.minStock || 20,
      unit: p.unit || 'Pack/Tub'
    }))
  );

  // FIFO Stock Ledger Logs reflecting system movements
  const [ledgerLogs, setLedgerLogs] = useState([
    {
      id: 'LEDG-2026-901',
      timestamp: '2026-10-09T09:30:00',
      productId: 'COR-001',
      productName: 'CHOCOLATE',
      category: 'CORNETTO',
      type: 'Stock Receiving (Freezer Van)',
      changeQty: 195,
      runningOnHand: 180,
      referenceNo: 'RCV-2026-001',
      staff: 'Pedro Warehouse',
      notes: 'Inbound freezer van arrival from SELECTA Bodega Panel #4 (KAB-4819)'
    },
    {
      id: 'LEDG-2026-902',
      timestamp: '2026-10-09T08:15:00',
      productId: 'MAG-001',
      productName: 'CLASSIC',
      category: 'MAGNUM',
      type: 'Dispatch Allocation (Bongo)',
      changeQty: -20,
      runningOnHand: 112,
      referenceNo: 'DISP-2026-101',
      staff: 'Juan Driver',
      notes: 'Reserved & loaded into Bongo Truck #1 (Valencia -> San Fernando)'
    },
    {
      id: 'LEDG-2026-903',
      timestamp: '2026-10-09T07:45:00',
      productId: 'STK-001',
      productName: 'COOKIES & CREAM',
      category: 'STICKS',
      type: 'Backload Return (Store Closed)',
      changeQty: 15,
      runningOnHand: 135,
      referenceNo: 'BK-2026-1003',
      staff: 'Roberto Backride',
      notes: 'Returned from Cabanglasan loop; store closed upon arrival'
    },
    {
      id: 'LEDG-2026-904',
      timestamp: '2026-10-08T14:20:00',
      productId: 'SUP-001',
      productName: 'DOUBLE DUTCH',
      category: 'SUPREME 1.3L',
      type: 'BO / Melted Deduction',
      changeQty: -2,
      runningOnHand: 43,
      referenceNo: 'DISC-2026-002',
      staff: 'Pedro Loader',
      notes: 'Tub seal crushed during freezer van transport transition'
    },
    {
      id: 'LEDG-2026-905',
      timestamp: '2026-10-08T11:00:00',
      productId: 'COR-002',
      productName: 'COOKIES & DREAM',
      category: 'CORNETTO',
      type: 'POS Walk-in Sale',
      changeQty: -5,
      runningOnHand: 90,
      referenceNo: 'POS-2026-4401',
      staff: 'Cashier Staff',
      notes: 'Over-the-counter retail purchase'
    }
  ]);

  const [activeTab, setActiveTab] = useState('balances'); // 'balances' | 'fifo'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Manual Adjustment Modal
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);
  const [adjProduct, setAdjProduct] = useState(stockBalances[0]?.id || 'COR-001');
  const [adjType, setAdjType] = useState('Stock Receiving (Freezer Van)');
  const [adjQty, setAdjQty] = useState(10);
  const [adjNotes, setAdjNotes] = useState('');

  // Total valuation metrics
  const totalValuation = stockBalances.reduce((sum, p) => sum + (p.onHand * p.unitPrice), 0);
  const totalOnHandUnits = stockBalances.reduce((sum, p) => sum + p.onHand, 0);
  const totalReservedUnits = stockBalances.reduce((sum, p) => sum + p.reserved, 0);
  const lowStockCount = stockBalances.filter(p => p.onHand <= p.minStock).length;

  const handleSaveAdjustment = () => {
    const prod = stockBalances.find(p => p.id === adjProduct);
    if (!prod) return;

    const qtyNumber = parseInt(adjQty) || 0;
    const isOutbound = adjType === 'Dispatch Allocation (Bongo)' || adjType === 'BO / Melted Deduction' || adjType === 'POS Walk-in Sale';
    const netChange = isOutbound ? -Math.abs(qtyNumber) : Math.abs(qtyNumber);
    const newOnHand = Math.max(0, prod.onHand + netChange);

    setStockBalances(stockBalances.map(p => p.id === adjProduct ? { ...p, onHand: newOnHand } : p));

    const newLedgerEntry = {
      id: `LEDG-2026-${900 + ledgerLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      type: adjType,
      changeQty: netChange,
      runningOnHand: newOnHand,
      referenceNo: 'MANUAL-ADJ',
      staff: 'Warehouse Admin',
      notes: adjNotes || 'Manual stock adjustment logged.'
    };

    setLedgerLogs([newLedgerEntry, ...ledgerLogs]);
    setIsAdjModalOpen(false);
    setAdjNotes('');
  };

  const filteredProducts = stockBalances.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.barcode.includes(searchTerm) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredLedger = ledgerLogs.filter(l => {
    const matchesSearch = l.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || l.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Ledger & Stock Movements</h1>
          <p className="text-sm text-slate-500">Real-time balances across categories, FIFO transaction ledger & warehouse valuation</p>
        </div>
        <button 
          onClick={() => setIsAdjModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Manual Stock Adjustment
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Warehouse Valuation</p>
            <h3 className="text-lg font-bold text-emerald-800">{formatPHP(totalValuation)}</h3>
            <span className="text-[11px] text-slate-400">At Dealer Cost Price</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available On Hand</p>
            <h3 className="text-lg font-bold text-slate-900">{totalOnHandUnits} Units</h3>
            <span className="text-[11px] text-blue-600 font-medium">{totalReservedUnits} Reserved for Bongo</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock SKUs</p>
            <h3 className="text-lg font-bold text-brand-red">{lowStockCount} Items</h3>
            <span className="text-[11px] text-brand-red font-medium">Reorder from Main Bodega</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-purple-500 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ledger Movement Rule</p>
            <h3 className="text-lg font-bold text-slate-900">FIFO Compliant</h3>
            <span className="text-[11px] text-purple-700 font-medium">Auto-tracks van receipts</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('balances')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'balances' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Stock Balances & Valuation ({filteredProducts.length})
        </button>
        <button 
          onClick={() => setActiveTab('fifo')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'fifo' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" /> FIFO Movement Ledger ({filteredLedger.length})
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search product name, barcode, ID, or reference..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          {activeTab === 'balances' ? (
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-60 text-xs font-semibold"
            >
              <option value="All">All Categories</option>
              {SELECTA_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          ) : (
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-64 text-xs font-semibold"
            >
              <option value="All">All Movement Types</option>
              <option value="Stock Receiving (Freezer Van)">Stock Receiving (Freezer Van)</option>
              <option value="Dispatch Allocation (Bongo)">Dispatch Allocation (Bongo)</option>
              <option value="Backload Return (Store Closed)">Backload Return</option>
              <option value="BO / Melted Deduction">BO / Melted Deduction</option>
              <option value="POS Walk-in Sale">POS Walk-in Sale</option>
            </select>
          )}
        </div>

        {/* Tab 1: Stock Balances Table */}
        {activeTab === 'balances' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product SKU & Barcode</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dealer Cost</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">On Hand</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Bongo Reserved</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Available</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock Valuation</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const availableQty = Math.max(0, p.onHand - p.reserved);
                    const isLow = p.onHand <= p.minStock;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.id} • {p.barcode}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-800">
                          {formatPHP(p.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-900">
                          {p.onHand} <span className="text-[11px] font-normal text-slate-400">{p.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                          {p.reserved}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-emerald-700">
                          {availableQty}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-900">
                          {formatPHP(p.onHand * p.unitPrice)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            isLow ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isLow ? 'Low Stock' : 'Optimal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No products found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: FIFO Movement Ledger */}
        {activeTab === 'fifo' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product & Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Movement Type</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity Change</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Running Balance</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference No.</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((log) => {
                    const isInbound = log.changeQty > 0;

                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <div className="font-bold text-slate-800">{formatDate(log.timestamp)}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-900">{log.productName}</div>
                          <div className="text-[11px] text-brand-red font-medium">{log.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isInbound ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isInbound ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold">
                          <span className={isInbound ? 'text-emerald-700' : 'text-red-600'}>
                            {isInbound ? `+${log.changeQty}` : log.changeQty} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-900">
                          {log.runningOnHand} units
                        </td>
                        <td className="py-3 px-4 text-xs font-mono font-bold text-slate-700">
                          {log.referenceNo}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <div className="font-semibold text-slate-800">{log.staff}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs" title={log.notes}>
                            {log.notes}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No ledger transactions found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Stock Adjustment Modal */}
      {isAdjModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Manual Inventory Adjustment</h2>
              </div>
              <button onClick={() => setIsAdjModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Product SKU</label>
                <select 
                  value={adjProduct} 
                  onChange={(e) => setAdjProduct(e.target.value)} 
                  className="input-field cursor-pointer text-xs font-medium"
                >
                  {stockBalances.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category}) - On Hand: {p.onHand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Movement Type</label>
                <select 
                  value={adjType} 
                  onChange={(e) => setAdjType(e.target.value)} 
                  className="input-field cursor-pointer text-xs"
                >
                  <option value="Stock Receiving (Freezer Van)">Stock Receiving (Freezer Van) - Inbound (+)</option>
                  <option value="Backload Return (Store Closed)">Backload Return (Store Closed) - Inbound (+)</option>
                  <option value="Dispatch Allocation (Bongo)">Dispatch Allocation (Bongo) - Outbound (-)</option>
                  <option value="BO / Melted Deduction">BO / Melted Deduction - Outbound (-)</option>
                  <option value="POS Walk-in Sale">POS Walk-in Sale - Outbound (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Adjustment Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={adjQty} 
                  onChange={(e) => setAdjQty(e.target.value)} 
                  className="input-field text-xs font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Ledger Notes</label>
                <textarea 
                  value={adjNotes} 
                  onChange={(e) => setAdjNotes(e.target.value)} 
                  placeholder="Explain why this adjustment is needed..."
                  className="input-field resize-none h-16 text-xs" 
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsAdjModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveAdjustment} className="btn-primary text-xs">Post Ledger Adjustment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}