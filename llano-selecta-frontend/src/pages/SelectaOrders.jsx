import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  Eye, 
  FileText, 
  IceCream, 
  Package, 
  ArrowRight,
  Printer,
  ChevronRight,
  FileCheck,
  Upload,
  AlertTriangle,
  Camera,
  DollarSign
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function SelectaOrders() {
  // Mock SELECTA Dealer POs strictly using statuses: 'Submitted', 'Received', 'Completed'
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2026-042',
      poReference: 'PO-SEL-9045',
      bookingRef: 'BK-2026-1001',
      orderDate: '2026-10-08',
      arrivalDate: null,
      status: 'Submitted', // 'Submitted' | 'Received' | 'Completed'
      receiptPhoto: 'https://images.unsplash.com/photo-1554415707-9e49fe830836?auto=format&fit=crop&q=80&w=600',
      damageNotes: 'Freezer van en route from Selecta Main Bodega.',
      damageAmount: 0.00,
      totalAmount: 25440.00,
      items: [
        { id: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', qtyOrdered: 20, unitPrice: 484.80 },
        { id: 'MAG-001', name: 'CLASSIC', category: 'MAGNUM', qtyOrdered: 10, unitPrice: 1651.96 }
      ]
    },
    {
      id: 'ORD-2026-041',
      poReference: 'PO-SEL-9042',
      bookingRef: 'BK-2026-0998',
      orderDate: '2026-10-05',
      arrivalDate: '2026-10-06',
      status: 'Received',
      receiptPhoto: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
      damageNotes: '2 boxes of Magnum Almond had damaged cartons from van transport. Deducted from bodega receipt.',
      damageAmount: 3303.92, // 2 x 1651.96
      totalAmount: 35000.00,
      items: [
        { id: 'MAG-002', name: 'ALMOND', category: 'MAGNUM', qtyOrdered: 15, unitPrice: 1651.96 },
        { id: 'SUP-001', name: 'DOUBLE DUTCH', category: 'SUPREME 1.3L', qtyOrdered: 8, unitPrice: 1477.58 }
      ]
    },
    {
      id: 'ORD-2026-040',
      poReference: 'PO-SEL-9038',
      bookingRef: 'BK-2026-0992',
      orderDate: '2026-10-02',
      arrivalDate: '2026-10-03',
      status: 'Completed',
      receiptPhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
      damageNotes: 'Arrived clean. All quantities verified and stocked into warehouse ledger.',
      damageAmount: 0.00,
      totalAmount: 21600.00,
      items: [
        { id: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', qtyOrdered: 30, unitPrice: 484.80 },
        { id: 'STK-001', name: 'COOKIES & CREAM', category: 'STICKS', qtyOrdered: 25, unitPrice: 248.20 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusChangeOrder, setStatusChangeOrder] = useState(null);

  // New PO Form State
  const [formPoReference, setFormPoReference] = useState('');
  const [formBookingRef, setFormBookingRef] = useState('BK-2026-1002');
  const [formReceiptPhoto, setFormReceiptPhoto] = useState('');
  const [formDamageNotes, setFormDamageNotes] = useState('');
  const [formDamageAmount, setFormDamageAmount] = useState(0);

  // Line Items selection using full catalog categories
  const [selectedCategory, setSelectedCategory] = useState(SELECTA_CATEGORIES[0]);
  const [formItems, setFormItems] = useState([
    { productId: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', qtyOrdered: 10, unitPrice: 484.80 }
  ]);

  // Handle Photo Upload from Device
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormReceiptPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Products filtered by selected category in the add-item form
  const categoryProducts = INITIAL_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddItemFromCatalog = (product) => {
    const existingIndex = formItems.findIndex(i => i.productId === product.id);
    if (existingIndex > -1) {
      const updated = [...formItems];
      updated[existingIndex].qtyOrdered += 1;
      setFormItems(updated);
    } else {
      setFormItems([
        ...formItems,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          qtyOrdered: 1,
          unitPrice: Number(product.dealerPrice || product.unit_price)
        }
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...formItems];
    updated[index].qtyOrdered = Math.max(1, parseInt(qty) || 1);
    setFormItems(updated);
  };

  // Allow updating prices to match Selecta Main Bodega!
  const handlePriceChange = (index, price) => {
    const updated = [...formItems];
    updated[index].unitPrice = Math.max(0, parseFloat(price) || 0);
    setFormItems(updated);
  };

  const grossTotal = formItems.reduce((sum, item) => sum + (item.qtyOrdered * item.unitPrice), 0);
  const netPayable = Math.max(0, grossTotal - Number(formDamageAmount || 0));

  const handleSaveOrder = (initialStatus = 'Submitted') => {
    if (!formPoReference.trim()) {
      alert('Please enter the official SELECTA PO Reference.');
      return;
    }
    if (formItems.length === 0) {
      alert('Please add at least one product SKU to the purchase order.');
      return;
    }

    const newOrder = {
      id: `ORD-2026-0${orders.length + 43}`,
      poReference: formPoReference.toUpperCase(),
      bookingRef: formBookingRef,
      orderDate: new Date().toISOString().split('T')[0],
      arrivalDate: initialStatus === 'Received' || initialStatus === 'Completed' ? new Date().toISOString().split('T')[0] : null,
      status: initialStatus,
      receiptPhoto: formReceiptPhoto,
      damageNotes: formDamageNotes,
      damageAmount: Number(formDamageAmount || 0),
      totalAmount: grossTotal,
      items: formItems
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setFormPoReference('');
    setFormReceiptPhoto('');
    setFormDamageNotes('');
    setFormDamageAmount(0);
    setFormItems([]);
  };

  // Direct Status Update Handler ('Submitted' | 'Received' | 'Completed')
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          arrivalDate: newStatus === 'Received' || newStatus === 'Completed' 
            ? (o.arrivalDate || new Date().toISOString().split('T')[0]) 
            : o.arrivalDate
        };
      }
      return o;
    });
    setOrders(updated);
    setStatusChangeOrder(null);
  };

  // Strictly 3 statuses helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Received':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.poReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SELECTA Purchase Orders (POs)</h1>
          <p className="text-sm text-slate-500">Order placement to Selecta Main Bodega, receipt uploads & arrival damage tracking</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormItems([]);
            setFormReceiptPhoto('');
            setFormDamageAmount(0);
            setFormDamageNotes('');
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Log SELECTA Dealer Order
        </button>
      </div>

      {/* Status Metric Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Submitted to Bodega</span>
            <span className="text-2xl font-bold text-blue-700">{orders.filter(o => o.status === 'Submitted').length}</span>
            <span className="text-[11px] text-slate-400 block">Awaiting van arrival</span>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Received at Dealer</span>
            <span className="text-2xl font-bold text-amber-700">{orders.filter(o => o.status === 'Received').length}</span>
            <span className="text-[11px] text-amber-600 font-medium block">Arrived at Llano Selecta Dealer</span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-bold text-emerald-700">{orders.filter(o => o.status === 'Completed').length}</span>
            <span className="text-[11px] text-emerald-600 block">Fully stocked & ledger balanced</span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Internal ID, SELECTA PO Reference, or Booking Ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-60">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer text-xs font-semibold"
            >
              <option value="All">All Order Statuses</option>
              <option value="Submitted">Submitted Only</option>
              <option value="Received">Received Only</option>
              <option value="Completed">Completed Only</option>
            </select>
          </div>
        </div>

        {/* PO Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Internal ID / PO Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Linked Booking</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Date / Arrival</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Gross PO Total</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Van Damage Deduction</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{ord.id}</div>
                      <div className="text-xs font-bold text-brand-red font-mono">{ord.poReference}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-700">{ord.bookingRef}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div><span className="text-slate-400 font-semibold">Ordered:</span> {ord.orderDate}</div>
                      <div>
                        <span className="text-slate-400 font-semibold">Arrived:</span>{' '}
                        {ord.arrivalDate ? <strong className="text-slate-800">{ord.arrivalDate}</strong> : <span className="text-amber-600 italic">In Transit</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">{formatPHP(ord.totalAmount)}</td>
                    <td className="py-3 px-4 text-xs">
                      {ord.damageAmount > 0 ? (
                        <div>
                          <span className="text-red-700 font-bold block">-{formatPHP(ord.damageAmount)}</span>
                          <span className="text-[10px] text-slate-500">Deducted from van</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setStatusChangeOrder(ord)}
                          className="btn-secondary text-xs py-1 px-2 font-semibold hover:bg-slate-100"
                          title="Change Order Status"
                        >
                          Status
                        </button>
                        <button 
                          onClick={() => setSelectedOrder(ord)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View PO
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No SELECTA orders found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Status Modal ('Submitted', 'Received', 'Completed') */}
      {statusChangeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-600 uppercase">Update PO Status</span>
              <button onClick={() => setStatusChangeOrder(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-xs text-slate-600 mb-2">
                Select status for <strong className="text-brand-red font-mono">{statusChangeOrder.poReference}</strong>:
              </div>
              {['Submitted', 'Received', 'Completed'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleUpdateOrderStatus(statusChangeOrder.id, st)}
                  className={`w-full p-3 rounded-lg border text-left font-bold text-xs flex justify-between items-center transition-all ${
                    statusChangeOrder.status === st
                      ? 'bg-brand-light border-brand-red text-brand-red'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{st} {st === 'Received' ? '(Arrived at Llano Selecta Dealer)' : ''}</span>
                  {statusChangeOrder.status === st && <span>✓ Current</span>}
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button onClick={() => setStatusChangeOrder(null)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Log New PO Modal with Full Catalog Categories & Editable Prices */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Log Dealer SELECTA Order (To Main Bodega)</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Official SELECTA PO Reference <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formPoReference} 
                    onChange={(e) => setFormPoReference(e.target.value)} 
                    placeholder="e.g. PO-SEL-9048" 
                    className="input-field font-mono uppercase text-xs font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Linked Store Booking</label>
                  <select 
                    value={formBookingRef} 
                    onChange={(e) => setFormBookingRef(e.target.value)} 
                    className="input-field cursor-pointer text-xs"
                  >
                    <option value="BK-2026-1001">BK-2026-1001 (Aling Nena Sari-Sari Store)</option>
                    <option value="BK-2026-1002">BK-2026-1002 (San Isidro Mini-Mart)</option>
                    <option value="BK-2026-1003">BK-2026-1003 (Cabanglasan Highland Corner)</option>
                    <option value="BK-2026-1004">BK-2026-1004 (Kahaponan Grocery Hub)</option>
                  </select>
                </div>
              </div>

              {/* Category Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  1. Select Product Category:
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {SELECTA_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat 
                          ? 'bg-brand-red text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Flavors in Selected Category */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex justify-between">
                  <span>2. Click Flavors to Add under {selectedCategory}:</span>
                  <span className="text-[11px] text-slate-400 font-normal">{categoryProducts.length} flavors</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {categoryProducts.map(p => {
                    const isAdded = formItems.some(i => i.productId === p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddItemFromCatalog(p)}
                        className={`p-2 rounded-md border text-left text-xs transition-all flex flex-col justify-between ${
                          isAdded 
                            ? 'bg-red-50/60 border-brand-red/60' 
                            : 'bg-white border-slate-200 hover:border-brand-red'
                        }`}
                      >
                        <span className="font-semibold text-slate-800 line-clamp-1">{p.name}</span>
                        <div className="flex justify-between items-center mt-1 text-[11px]">
                          <span className="text-slate-500 font-bold">{formatPHP(p.dealerPrice || p.unit_price)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isAdded ? 'bg-brand-red text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isAdded ? '✓ Added' : '+ Add'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order SKUs Table with Editable Quantities and Editable Bodega Unit Prices */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. Order SKUs & Editable Prices (Match to Selecta Main Bodega):
                  </h3>
                  <span className="text-[11px] text-slate-500">{formItems.length} SKUs selected</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formItems.length > 0 ? (
                    formItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 rounded-md border border-slate-200 text-xs">
                        <div className="flex-1">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({item.category})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Qty:</span>
                            <input 
                              type="number" 
                              min="1" 
                              value={item.qtyOrdered} 
                              onChange={(e) => handleQtyChange(index, e.target.value)}
                              className="input-field text-xs w-16 text-center font-bold py-1" 
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Price ₱:</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0"
                              value={item.unitPrice} 
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                              className="input-field text-xs w-24 text-right font-bold py-1 text-slate-800" 
                              title="Update price to match Selecta Main Bodega"
                            />
                          </div>
                          <div className="text-xs font-bold text-slate-900 w-24 text-right">
                            {formatPHP(item.unitPrice * item.qtyOrdered)}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(index)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400 italic">No SKUs added yet. Click flavors above to add.</div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Gross PO Amount:</span>
                  <span className="text-base font-bold text-slate-800">{formatPHP(grossTotal)}</span>
                </div>
              </div>

              {/* Photo of Receipt Upload from Device & Van Damage Tracking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Upload */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-brand-red" /> Upload Photo of Bodega Receipt (From Device)
                  </label>
                  {formReceiptPhoto ? (
                    <div className="space-y-1.5">
                      <img src={formReceiptPhoto} alt="Receipt preview" className="w-full h-32 object-cover rounded border" />
                      <div className="flex justify-between">
                        <label className="btn-secondary text-xs py-0.5 px-2 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Change Photo
                          <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                        </label>
                        <button type="button" onClick={() => setFormReceiptPhoto('')} className="text-xs text-red-600 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer block hover:bg-slate-100">
                      <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-brand-red block">Click to upload receipt image</span>
                      <span className="text-[10px] text-slate-400">Photos taken from camera or device files</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                    </label>
                  )}
                </div>

                {/* Freezer Van Damage & Exact Price Deduction */}
                <div className="border border-slate-200 rounded-lg p-3 bg-red-50/50 space-y-2 text-xs">
                  <label className="block text-xs font-bold text-red-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Damage Not Received from Freezer Van
                  </label>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Damage Deduction Amount (₱):</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={formDamageAmount} 
                      onChange={(e) => setFormDamageAmount(parseFloat(e.target.value) || 0)} 
                      placeholder="0.00"
                      className="input-field text-xs font-bold text-red-700 bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Damage Notes / Melted Van SKUs:</label>
                    <textarea 
                      value={formDamageNotes}
                      onChange={(e) => setFormDamageNotes(e.target.value)}
                      placeholder="Specify broken boxes, melted items, or unfulfilled cartons..."
                      className="input-field resize-none h-14 text-xs bg-white"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Final Calculated Net Total */}
              <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Net Payable to Selecta Bodega:</span>
                  {Number(formDamageAmount) > 0 && (
                    <span className="text-[11px] text-red-600">Deducted {formatPHP(formDamageAmount)} for damages</span>
                  )}
                </div>
                <span className="text-xl font-bold text-brand-red">{formatPHP(netPayable)}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => handleSaveOrder('Received')} 
                  className="btn-secondary text-xs hover:bg-amber-50 hover:text-amber-800"
                >
                  Save as Received (Arrived)
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSaveOrder('Submitted')} 
                  className="btn-primary text-xs"
                >
                  Save & Submit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal with Receipt Photo and Damage Summary */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase">SELECTA PO Summary & Receipt</span>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedOrder.poReference}</h2>
                  <p className="text-xs text-slate-500">Internal Ref: {selectedOrder.id} • Booking: {selectedOrder.bookingRef}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 text-xs gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div><span className="text-slate-400 font-semibold">Order Date:</span> {selectedOrder.orderDate}</div>
                <div><span className="text-slate-400 font-semibold">Arrival Date:</span> {selectedOrder.arrivalDate || 'In Transit'}</div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Ordered Products</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 text-xs flex justify-between items-center bg-white">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.category} • {item.qtyOrdered} units @ {formatPHP(item.unitPrice)}</p>
                      </div>
                      <p className="font-bold text-slate-900">{formatPHP(item.qtyOrdered * item.unitPrice)}</p>
                    </div>
                  ))}
                  <div className="p-2.5 bg-slate-50 flex justify-between text-xs font-bold border-t border-slate-200">
                    <span>Gross Total:</span>
                    <span>{formatPHP(selectedOrder.totalAmount)}</span>
                  </div>
                  {selectedOrder.damageAmount > 0 && (
                    <div className="p-2.5 bg-red-50 flex justify-between text-xs font-bold text-red-700 border-t border-red-100">
                      <span>Deducted Van Damage:</span>
                      <span>-{formatPHP(selectedOrder.damageAmount)}</span>
                    </div>
                  )}
                  <div className="p-2.5 bg-emerald-50 flex justify-between text-sm font-bold text-emerald-800 border-t border-emerald-200">
                    <span>Net Amount Payable:</span>
                    <span>{formatPHP(Math.max(0, selectedOrder.totalAmount - selectedOrder.damageAmount))}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Photo */}
              {selectedOrder.receiptPhoto && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase">Bodega Delivery Receipt Photo</p>
                  <img 
                    src={selectedOrder.receiptPhoto} 
                    alt="Receipt" 
                    className="w-full h-44 object-cover rounded-lg border border-slate-200 shadow-2xs" 
                  />
                </div>
              )}

              {/* Damage Notes */}
              {selectedOrder.damageNotes && (
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span className="font-bold text-amber-800">Bodega & Damage Notes:</span> {selectedOrder.damageNotes}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Summary
              </button>
              <button onClick={() => setSelectedOrder(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}