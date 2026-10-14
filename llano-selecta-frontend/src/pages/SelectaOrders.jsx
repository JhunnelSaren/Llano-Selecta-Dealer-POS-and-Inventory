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
  FileCheck
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function SelectaOrders() {
  // Available SELECTA Products for PO line items
  const catalogProducts = [
    { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', price: 28.00 },
    { id: 'PRD-002', name: 'Cornetto Chocolate 110ml', price: 28.00 },
    { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', price: 58.00 },
    { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', price: 195.00 },
    { id: 'PRD-005', name: 'SELECTA 3-in-1 Double Dutch 1.3L', price: 165.00 }
  ];

  // Mock SELECTA Dealer POs
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2026-042',
      poReference: 'PO-SEL-9045',
      bookingRef: 'BK-2026-1001',
      orderDate: '2026-10-08',
      expectedArrival: '2026-10-09',
      actualArrival: null,
      status: 'In Transit',
      remarks: 'Official SELECTA Bodega order placed via SELECTA POS. Panel truck in transit.',
      totalAmount: 25440.00,
      items: [
        { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', qtyOrdered: 200, unitPrice: 28.00 },
        { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', qtyOrdered: 100, unitPrice: 58.00 },
        { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', qtyOrdered: 72, unitPrice: 195.00 }
      ]
    },
    {
      id: 'ORD-2026-041',
      poReference: 'PO-SEL-9042',
      bookingRef: 'BK-2026-0998',
      orderDate: '2026-10-05',
      expectedArrival: '2026-10-06',
      actualArrival: '2026-10-06',
      status: 'Completed',
      remarks: 'Received clean at Valencia Hub. Inventory added to ledger.',
      totalAmount: 20760.00,
      items: [
        { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', qtyOrdered: 200, unitPrice: 28.00 },
        { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', qtyOrdered: 100, unitPrice: 58.00 },
        { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', qtyOrdered: 48, unitPrice: 195.00 }
      ]
    },
    {
      id: 'ORD-2026-040',
      poReference: 'PO-SEL-9038',
      bookingRef: 'BK-2026-0992',
      orderDate: '2026-10-02',
      expectedArrival: '2026-10-03',
      actualArrival: '2026-10-03',
      status: 'Completed',
      remarks: 'Full order delivered by SELECTA Bodega Panel #2.',
      totalAmount: 21600.00,
      items: [
        { id: 'PRD-002', name: 'Cornetto Chocolate 110ml', qtyOrdered: 300, unitPrice: 28.00 },
        { id: 'PRD-005', name: 'SELECTA 3-in-1 Double Dutch 1.3L', qtyOrdered: 80, unitPrice: 165.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [formPoReference, setFormPoReference] = useState('');
  const [formBookingRef, setFormBookingRef] = useState('BK-2026-1002');
  const [formExpectedArrival, setFormExpectedArrival] = useState(new Date().toISOString().split('T')[0]);
  const [formRemarks, setFormRemarks] = useState('');
  const [formItems, setFormItems] = useState([
    { productId: 'PRD-001', name: 'Cornetto Vanilla 110ml', qtyOrdered: 100, unitPrice: 28.00 },
    { productId: 'PRD-003', name: 'Magnum Classic Almond 80ml', qtyOrdered: 50, unitPrice: 58.00 }
  ]);

  const calculatedTotal = formItems.reduce((sum, item) => sum + (item.qtyOrdered * item.unitPrice), 0);

  const handleAddItem = () => {
    setFormItems([
      ...formItems,
      { productId: 'PRD-001', name: 'Cornetto Vanilla 110ml', qtyOrdered: 50, unitPrice: 28.00 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, pId) => {
    const p = catalogProducts.find(item => item.id === pId);
    if (!p) return;
    const updated = [...formItems];
    updated[index] = { ...updated[index], productId: p.id, name: p.name, unitPrice: p.price };
    setFormItems(updated);
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...formItems];
    updated[index].qtyOrdered = Math.max(1, parseInt(qty) || 1);
    setFormItems(updated);
  };

  const handleSaveOrder = () => {
    if (!formPoReference.trim()) {
      alert('Please enter the SELECTA PO Reference from official SELECTA POS.');
      return;
    }

    const newOrder = {
      id: `ORD-2026-0${orders.length + 43}`,
      poReference: formPoReference.toUpperCase(),
      bookingRef: formBookingRef,
      orderDate: new Date().toISOString().split('T')[0],
      expectedArrival: formExpectedArrival,
      actualArrival: null,
      status: 'Submitted to SELECTA',
      remarks: formRemarks || 'Logged dealer-side SELECTA purchase order.',
      totalAmount: calculatedTotal,
      items: formItems
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setFormPoReference('');
    setFormRemarks('');
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Submitted to SELECTA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Transit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Arrived':
      case 'Received':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Filtered Orders
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
          <p className="text-sm text-slate-500">Dealer-side tracking for product orders requested via official SELECTA POS</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Log SELECTA Order
        </button>
      </div>

      {/* Workflow Rule Notice Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex items-start gap-3">
        <FileCheck className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white uppercase tracking-wider block">Rule 1 — SELECTA POS Integration Note</span>
          <p className="text-slate-300">
            This system does not replace the official SELECTA POS used by the dealer owner to request stock from the SELECTA Bodega. It records dealer-side PO numbers, linked bookings, and ETA tracking for complete warehouse coordination.
          </p>
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
              placeholder="Search by Internal ID, SELECTA PO Reference, or Booking Ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Order Statuses</option>
              <option value="Submitted to SELECTA">Submitted</option>
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* PO Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Internal ID / PO Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Booking Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Expected Arrival</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Total</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
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
                    <td className="py-3 px-4 text-sm text-slate-600">{ord.orderDate}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        {ord.expectedArrival}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">{formatPHP(ord.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View PO
                      </button>
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

      {/* Log New PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Log Dealer SELECTA Order</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SELECTA Official PO Reference <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formPoReference} 
                    onChange={(e) => setFormPoReference(e.target.value)} 
                    placeholder="e.g. PO-SEL-9048" 
                    className="input-field font-mono uppercase" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Linked Booking Reference</label>
                  <select 
                    value={formBookingRef} 
                    onChange={(e) => setFormBookingRef(e.target.value)} 
                    className="input-field cursor-pointer"
                  >
                    <option value="BK-2026-1001">BK-2026-1001 (Aling Nena Sari-Sari)</option>
                    <option value="BK-2026-1002">BK-2026-1002 (Cabanglasan Express)</option>
                    <option value="BK-2026-1003">BK-2026-1003 (San Isidro Mini-Mart)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Bodega Arrival Date</label>
                  <input 
                    type="date" 
                    value={formExpectedArrival} 
                    onChange={(e) => setFormExpectedArrival(e.target.value)} 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Status</label>
                  <input 
                    type="text" 
                    disabled 
                    value="Submitted to SELECTA" 
                    className="input-field bg-slate-100 font-bold text-blue-800" 
                  />
                </div>
              </div>

              {/* Order Items List */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered SKUs</h3>
                  <button 
                    onClick={handleAddItem}
                    type="button" 
                    className="text-xs text-brand-red hover:text-brand-dark font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add SKU
                  </button>
                </div>

                {formItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white p-2.5 rounded-md border border-slate-200">
                    <select 
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="input-field text-xs flex-1 cursor-pointer"
                    >
                      {catalogProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({formatPHP(p.price)})</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.qtyOrdered} 
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                      className="input-field text-xs w-24 text-center font-bold" 
                      placeholder="Qty"
                    />
                    <div className="text-xs font-bold text-slate-800 w-24 text-right">
                      {formatPHP(item.unitPrice * item.qtyOrdered)}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs font-semibold text-slate-500">Calculated PO Total:</span>
                  <span className="text-lg font-bold text-brand-red">{formatPHP(calculatedTotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks / Bodega Notes</label>
                <textarea 
                  value={formRemarks} 
                  onChange={(e) => setFormRemarks(e.target.value)} 
                  className="input-field resize-none h-16" 
                  placeholder="Notes from official SELECTA POS submission..."
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveOrder} className="btn-primary text-xs">Save SELECTA Purchase Order</button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500">SELECTA PURCHASE ORDER SUMMARY</span>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedOrder.poReference}</h2>
                  <p className="text-xs text-slate-500">Internal Ref: {selectedOrder.id} • Linked Booking: {selectedOrder.bookingRef}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 text-xs gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div><span className="text-slate-400 font-semibold">Order Date:</span> {selectedOrder.orderDate}</div>
                <div><span className="text-slate-400 font-semibold">Expected Arrival:</span> {selectedOrder.expectedArrival}</div>
                <div className="col-span-2"><span className="text-slate-400 font-semibold">Actual Arrival:</span> {selectedOrder.actualArrival || 'In Transit'}</div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Ordered Ice Cream Line Items</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 text-xs flex justify-between items-center bg-white">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-500">{item.qtyOrdered} units @ {formatPHP(item.unitPrice)}</p>
                      </div>
                      <p className="font-bold text-slate-900">{formatPHP(item.qtyOrdered * item.unitPrice)}</p>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex justify-between text-sm font-bold border-t border-slate-200">
                    <span>Total Purchase Order Value:</span>
                    <span className="text-brand-red">{formatPHP(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.remarks && (
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span className="font-bold text-amber-800">PO Notes:</span> {selectedOrder.remarks}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Order Summary
              </button>
              <button onClick={() => setSelectedOrder(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}