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
  RotateCcw
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';

export default function Inventory() {
  // Mock Products Stock Balance Master
  const [stockBalances, setStockBalances] = useState([
    {
      id: 'PRD-001',
      barcode: '480001612345',
      name: 'Cornetto Vanilla 110ml',
      category: 'Single Serve',
      unitPrice: 28.00,
      onHand: 180,
      reserved: 30, // Allocated to active Bongo dispatch
      minStock: 50,
      unit: 'Pcs'
    },
    {
      id: 'PRD-002',
      barcode: '480001612346',
      name: 'Cornetto Chocolate 110ml',
      category: 'Single Serve',
      unitPrice: 28.00,
      onHand: 18, // Low Stock Alert
      reserved: 0,
      minStock: 50,
      unit: 'Pcs'
    },
    {
      id: 'PRD-003',
      barcode: '480001612347',
      name: 'Magnum Classic Almond 80ml',
      category: 'Premium Single',
      unitPrice: 58.00,
      onHand: 112,
      reserved: 10,
      minStock: 30,
      unit: 'Pcs'
    },
    {
      id: 'PRD-004',
      barcode: '480001612348',
      name: 'Big Scoop Chocolate Fudge 1.5L',
      category: 'Tubs & Pints',
      unitPrice: 195.00,
      onHand: 5, // Critical Stock Alert
      reserved: 2,
      minStock: 20,
      unit: 'Tubs'
    },
    {
      id: 'PRD-005',
      barcode: '480001612349',
      name: 'SELECTA 3-in-1 Double Dutch 1.3L',
      category: 'Tubs & Pints',
      unitPrice: 165.00,
      onHand: 45,
      reserved: 10,
      minStock: 15,
      unit: 'Tubs'
    }
  ]);

  // FIFO Stock Ledger Logs
  const [ledgerLogs, setLedgerLogs] = useState([
    {
      id: 'LEDG-2026-901',
      timestamp: '2026-10-09T09:30:00',
      productId: 'PRD-001',
      productName: 'Cornetto Vanilla 110ml',
      type: 'Stock Receiving', // Inbound
      changeQty: 195,
      runningOnHand: 180,
      referenceNo: 'RCV-2026-001',
      staff: 'Pedro Warehouse',
      notes: 'Inbound truck delivery from SELECTA Bodega Panel #4'
    },
    {
      id: 'LEDG-2026-902',
      timestamp: '2026-10-09T08:15:00',
      productId: 'PRD-001',
      productName: 'Cornetto Vanilla 110ml',
      type: 'Dispatch Allocation', // Outbound
      changeQty: -30,
      runningOnHand: 180,
      referenceNo: 'DISP-2026-101',
      staff: 'Juan Driver',
      notes: 'Reserved for Bongo Truck #1 (Valencia -> San Fernando)'
    },
    {
      id: 'LEDG-2026-903',
      timestamp: '2026-10-09T07:45:00',
      productId: 'PRD-003',
      productName: 'Magnum Classic Almond 80ml',
      type: 'BO / Melted Return', // Adjustment
      changeQty: -3,
      runningOnHand: 112,
      referenceNo: 'DISC-2026-002',
      staff: 'Pedro Loader',
      notes: 'Melted during delivery transition - store deduction applied'
    },
    {
      id: 'LEDG-2026-904',
      timestamp: '2026-10-08T14:20:00',
      productId: 'PRD-005',
      productName: 'SELECTA 3-in-1 Double Dutch 1.3L',
      type: 'Stock Receiving',
      changeQty: 80,
      runningOnHand: 45,
      referenceNo: 'RCV-2026-002',
      staff: 'Pedro Warehouse',
      notes: 'Inbound truck delivery from SELECTA Bodega Panel #2'
    }
  ]);

  const [activeTab, setActiveTab] = useState('balances'); // 'balances' | 'fifo'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Manual Adjustment Modal
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);
  const [adjProduct, setAdjProduct] = useState('PRD-001');
  const [adjType, setAdjType] = useState('Inbound Receiving');
  const [adjQty, setAdjQty] = useState(10);
  const [adjNotes, setAdjNotes] = useState('');

  // Total valuation metrics
  const totalValuation = stockBalances.reduce((sum, p) => sum + (p.onHand * p.unitPrice), 0);
  const totalOnHandUnits = stockBalances.reduce((sum, p) => sum + p.onHand, 0);
  const lowStockCount = stockBalances.filter(p => p.onHand <= p.minStock).length;

  const handleSaveAdjustment = () => {
    const prod = stockBalances.find(p => p.id === adjProduct);
    if (!prod) return;

    const qtyNumber = parseInt(adjQty) || 0;
    const isOutbound = adjType === 'Dispatch Allocation' || adjType === 'BO / Melted Return';
    const netChange = isOutbound ? -Math.abs(qtyNumber) : Math.abs(qtyNumber);

    const newOnHand = Math.max(0, prod.onHand + netChange);

    // Update Product Balance
    setStockBalances(stockBalances.map(p => p.id === adjProduct ? { ...p, onHand: newOnHand } : p));

    // Append FIFO Ledger Entry
    const newLedgerEntry = {
      id: `LEDG-2026-${900 + ledgerLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      productId: prod.id,
      productName: prod.name,
      type: adjType,
      changeQty: netChange,
      runningOnHand: newOnHand,
      referenceNo: 'MANUAL-ADJ',
      staff: 'Admin Owner',
      notes: adjNotes || 'Manual inventory adjustment.'
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
          <p className="text-sm text-slate-500">Real-time stock balances, FIFO transaction logs & warehouse valuations</p>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Warehouse Stock Value</p>
            <h3 className="text-lg font-bold text-emerald-800">{formatPHP(totalValuation)}</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Units On Hand</p>
            <h3 className="text-lg font-bold text-slate-900">{totalOnHandUnits} Units</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Alert Items</p>
            <h3 className="text-lg font-bold text-brand-red">{lowStockCount} SKUs Low/Critical</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-purple-500 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ledger Movement Rule</p>
            <h3 className="text-lg font-bold text-slate-900">Strict FIFO</h3>
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
          <Package className="w-4 h-4" /> Stock Balances & Valuation
        </button>
        <button 
          onClick={() => setActiveTab('fifo')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'fifo' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" /> FIFO Movement Ledger ({ledgerLogs.length})
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
              placeholder="Search by product name, barcode, ID, or transaction ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          {activeTab === 'balances' ? (
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-48"
            >
              <option value="All">All Categories</option>
              <option value="Single Serve">Single Serve</option>
              <option value="Premium Single">Premium Single</option>
              <option value="Tubs & Pints">Tubs & Pints</option>
            </select>
          ) : (
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-52"
            >
              <option value="All">All Movement Types</option>
              <option value="Stock Receiving">Stock Receiving (+)</option>
              <option value="Dispatch Allocation">Dispatch (-)</option>
              <option value="BO / Melted Return">BO Return (-)</option>
            </select>
          )}
        </div>

        {/* Tab 1: Stock Balances Table */}
        {activeTab === 'balances' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product SKU / Barcode</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dealer Buy Price</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Physical On-Hand</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reserved for Trips</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Net Available</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => {
                    const available = Math.max(0, p.onHand - p.reserved);
                    const totalVal = p.onHand * p.unitPrice;
                    const isLow = p.onHand <= p.minStock;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-800">{p.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.barcode} • {p.id}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 font-medium">{p.category}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-800">{formatPHP(p.unitPrice)}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-900">{p.onHand} <span className="text-xs font-normal text-slate-500">{p.unit}</span></div>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-red">
                              <AlertTriangle className="w-3 h-3" /> Min Stock Alert ({p.minStock})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-amber-700">
                          {p.reserved} {p.unit}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-emerald-700">
                          {available} {p.unit}
                        </td>
                        <td className="py-3 px-4 text-sm font-extrabold text-slate-900">
                          {formatPHP(totalVal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: FIFO Movements Ledger Table */}
        {activeTab === 'fifo' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Log Ref / Timestamp</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Movement Type</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity Delta</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Running On-Hand</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference & Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-xs font-bold font-mono text-slate-800">{l.id}</div>
                        <div className="text-[11px] text-slate-400">{formatDate(l.timestamp)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{l.productName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          l.changeQty > 0 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {l.changeQty > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {l.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-extrabold ${l.changeQty > 0 ? 'text-emerald-700' : 'text-brand-red'}`}>
                        {l.changeQty > 0 ? `+${l.changeQty}` : l.changeQty}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">
                        {l.runningOnHand}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="font-bold text-slate-800 font-mono">{l.referenceNo}</div>
                        <div className="text-[11px] text-slate-500">By {l.staff} • {l.notes}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No inventory movements found.
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
                <RotateCcw className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Manual Inventory Adjustment</h2>
              </div>
              <button onClick={() => setIsAdjModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select SKU Product <span className="text-brand-red">*</span></label>
                <select 
                  value={adjProduct}
                  onChange={(e) => setAdjProduct(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {stockBalances.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (On Hand: {p.onHand})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Movement Type</label>
                  <select 
                    value={adjType}
                    onChange={(e) => setAdjType(e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    <option value="Stock Receiving">Stock Receiving (+)</option>
                    <option value="Dispatch Allocation">Dispatch (-)</option>
                    <option value="BO / Melted Return">BO / Melted Return (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity Delta <span className="text-brand-red">*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    value={adjQty}
                    onChange={(e) => setAdjQty(e.target.value)}
                    className="input-field font-bold text-center" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Audit Reason / Remarks</label>
                <textarea 
                  value={adjNotes}
                  onChange={(e) => setAdjNotes(e.target.value)}
                  placeholder="Explain why this inventory count was updated..."
                  className="input-field resize-none h-20"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsAdjModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveAdjustment} className="btn-primary text-xs">Confirm & Commit Ledger Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}