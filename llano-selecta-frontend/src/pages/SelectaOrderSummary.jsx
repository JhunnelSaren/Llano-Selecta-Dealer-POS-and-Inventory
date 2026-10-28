import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Filter, 
  Printer, 
  Calendar, 
  Boxes, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Check, 
  X, 
  Eye, 
  ShoppingCart, 
  ArrowRight,
  TrendingUp,
  Package,
  Store,
  Sparkles,
  Download
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function SelectaOrderSummary() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('consolidation'); // 'consolidation' | 'orders'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Consolidated Bookings & Product Needs
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierOrders, setSupplierOrders] = useState([]);

  // Filter State
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // New Supplier Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDetailModal, setViewDetailModal] = useState(false);

  const [newOrderData, setNewOrderData] = useState({
    selecta_pos_ref: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_arrival_date: '',
    responsible_person: currentUser?.name || 'Dealer Owner',
    status: 'Ready for Ordering',
    notes: '',
    items: []
  });

  // Load data from Backend / API
  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, pData, soData] = await Promise.all([
        api.get('/api/bookings').catch(() => []),
        api.get('/api/products').catch(() => []),
        api.get('/api/supplier-orders').catch(() => [])
      ]);
      setBookings(Array.isArray(bData) ? bData : []);
      setProducts(Array.isArray(pData) ? pData : []);
      setSupplierOrders(Array.isArray(soData) ? soData : []);
    } catch (err) {
      console.error('Failed to load supplier orders data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter confirmed/active bookings (e.g. Booked, Ready for Deliver)
  const activeBookings = bookings.filter(b => {
    const matchesArea = areaFilter === 'ALL' || (b.area && b.area.includes(areaFilter));
    const isPending = b.status === 'Booked' || b.status === 'Ready for Deliver' || b.status === 'Confirmed';
    return isPending && matchesArea;
  });

  // Consolidate required product quantities across all confirmed customer bookings
  const consolidatedMap = {};

  activeBookings.forEach(booking => {
    const items = Array.isArray(booking.items) ? booking.items : [];
    items.forEach(it => {
      const prodId = it.productId || it.id || it.sku || it.name;
      const qty = parseInt(it.qty || it.quantity || 0);

      if (!consolidatedMap[prodId]) {
        // Find product catalog details
        const prodDetail = products.find(p => p.id === prodId || p.name === it.name) || {};
        consolidatedMap[prodId] = {
          productId: prodId,
          productName: it.name || prodDetail.name || prodId,
          category: it.category || prodDetail.category || 'SELECTA',
          unit: prodDetail.unit || 'Pack',
          dealerCost: parseFloat(prodDetail.dealer_price || prodDetail.dealerPrice || it.price || 0),
          srp: parseFloat(prodDetail.srp || it.price || 0),
          totalOrderedQty: 0,
          currentStock: parseInt(prodDetail.stock || 0),
          reservedStock: parseInt(prodDetail.reserved_stock || 0),
          stores: []
        };
      }

      consolidatedMap[prodId].totalOrderedQty += qty;
      consolidatedMap[prodId].stores.push({
        storeName: booking.store_name || booking.customer,
        area: booking.area,
        qty: qty
      });
    });
  });

  const consolidatedList = Object.values(consolidatedMap).map(item => {
    // Available stock = physical stock - reserved stock
    const availableStock = Math.max(0, item.currentStock - item.reservedStock);
    // Needed from Selecta = Total Customer Ordered Qty - Available Stock
    const estimatedNeededFromSelecta = Math.max(0, item.totalOrderedQty - availableStock);

    return {
      ...item,
      availableStock,
      estimatedNeededFromSelecta,
      estimatedPurchaseCost: estimatedNeededFromSelecta * item.dealerCost
    };
  }).filter(item => {
    return item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Open Create Supplier Order prefilled with consolidated quantities
  const handleOpenCreateOrder = () => {
    const itemsToOrder = consolidatedList.map(item => ({
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      neededQty: item.estimatedNeededFromSelecta,
      currentStock: item.currentStock,
      orderedQty: item.estimatedNeededFromSelecta > 0 ? item.estimatedNeededFromSelecta : item.totalOrderedQty,
      unitCost: item.dealerCost,
      totalCost: (item.estimatedNeededFromSelecta > 0 ? item.estimatedNeededFromSelecta : item.totalOrderedQty) * item.dealerCost
    }));

    setNewOrderData({
      selecta_pos_ref: '',
      order_date: new Date().toISOString().split('T')[0],
      expected_arrival_date: '',
      responsible_person: currentUser?.name || 'Dealer Owner',
      status: 'Ready for Ordering',
      notes: `Consolidated from ${activeBookings.length} confirmed customer store bookings.`,
      items: itemsToOrder
    });
    setIsModalOpen(true);
  };

  // Submit supplier order record
  const handleSaveSupplierOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const totalAmount = newOrderData.items.reduce((sum, it) => sum + (parseFloat(it.totalCost) || 0), 0);

    try {
      await api.post('/api/supplier-orders', {
        ...newOrderData,
        supplier_amount: totalAmount,
        related_bookings: activeBookings.map(b => b.id)
      });
      setSuccessMsg('Supplier order saved successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save supplier order');
    }
  };

  // Update Status of existing order
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/supplier-orders/${orderId}`, { status: newStatus });
      setSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
      loadData();
    } catch (err) {
      setErrorMsg('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Selecta Order Summary
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              Supplier Replenishment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consolidate confirmed customer bookings into bulk product quantities for owner ordering via Selecta's POS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Summary
          </button>
          <button
            onClick={handleOpenCreateOrder}
            disabled={consolidatedList.length === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Prepare Supplier PO
          </button>
        </div>
      </div>

      {/* Notifications Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </div>
          <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            {errorMsg}
          </div>
          <button onClick={() => setErrorMsg('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Bookings</span>
            <Store className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeBookings.length} Stores</p>
          <p className="text-[11px] text-slate-400 mt-1">Pending bulk ordering</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Product SKUs Needed</span>
            <Boxes className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{consolidatedList.length} SKUs</p>
          <p className="text-[11px] text-slate-400 mt-1">Distinct Selecta flavors/lines</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Supplier Order</span>
            <ShoppingCart className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {formatPHP(consolidatedList.reduce((sum, item) => sum + item.estimatedPurchaseCost, 0))}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Calculated at wholesale dealer cost</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Supplier Orders</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{supplierOrders.length} Logged</p>
          <p className="text-[11px] text-slate-400 mt-1">Recorded in Selecta POS</p>
        </div>
      </div>

      {/* Tabs Switcher: Consolidated Needs vs Supplier Order History */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('consolidation')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'consolidation'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Product Demand Consolidation ({consolidatedList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Supplier Orders Log ({supplierOrders.length})
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 w-44 sm:w-56"
            />
          </div>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Territories</option>
            <option value="Valencia">Valencia City</option>
            <option value="Cabanglasan">Cabanglasan</option>
            <option value="San Fernando">San Fernando</option>
          </select>
        </div>
      </div>

      {/* TAB 1: CONSOLIDATION VIEW */}
      {activeTab === 'consolidation' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Consolidated Store Demand vs Warehouse Inventory
              </h3>
              <p className="text-[11px] text-slate-500">
                Formula: Estimated Needed = Total Customer Booked Qty − Available Stock (Sellable − Reserved)
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Territories: <strong className="text-slate-900">{areaFilter}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">SKU / Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Customer Req.</th>
                  <th className="py-3 px-3 text-right">Current Stock</th>
                  <th className="py-3 px-3 text-right">Reserved</th>
                  <th className="py-3 px-3 text-right text-emerald-700 font-extrabold">Available</th>
                  <th className="py-3 px-4 text-right bg-red-50/50 text-red-700 font-black">Est. Selecta Need</th>
                  <th className="py-3 px-3 text-right">Dealer Cost</th>
                  <th className="py-3 px-4 text-right">Est. Cost</th>
                  <th className="py-3 px-3 text-center">Stores</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consolidatedList.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-12 text-center text-slate-400">
                      No pending customer booking demand found for this filter.
                    </td>
                  </tr>
                ) : (
                  consolidatedList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.productName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.productId}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">{item.category}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{item.totalOrderedQty} {item.unit}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{item.currentStock}</td>
                      <td className="py-3 px-3 text-right text-amber-600 font-medium">{item.reservedStock}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">{item.availableStock}</td>
                      <td className="py-3 px-4 text-right font-black bg-red-50/40 text-red-600">
                        {item.estimatedNeededFromSelecta > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">
                            +{item.estimatedNeededFromSelecta} {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Sufficient (0)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">{formatPHP(item.dealerCost)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatPHP(item.estimatedPurchaseCost)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span 
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold cursor-help"
                          title={item.stores.map(s => `${s.storeName}: ${s.qty}`).join('\n')}
                        >
                          {item.stores.length} store(s)
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 font-bold text-slate-800 border-t border-slate-200">
                  <td colSpan="2" className="py-3 px-4">Consolidated Total</td>
                  <td className="py-3 px-3 text-right">
                    {consolidatedList.reduce((s, i) => s + i.totalOrderedQty, 0)} units
                  </td>
                  <td colSpan="3"></td>
                  <td className="py-3 px-4 text-right text-red-700 font-black">
                    {consolidatedList.reduce((s, i) => s + i.estimatedNeededFromSelecta, 0)} units
                  </td>
                  <td></td>
                  <td className="py-3 px-4 text-right text-red-700 font-black">
                    {formatPHP(consolidatedList.reduce((s, i) => s + i.estimatedPurchaseCost, 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUPPLIER ORDERS LOG */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Recorded Supplier Orders (Selecta Bodega Orders)
            </h3>
            <span className="text-xs text-slate-500">
              Owner orders manually logged from Selecta's external POS
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {supplierOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No supplier orders recorded yet. Click "Prepare Supplier PO" to log an order.
              </div>
            ) : (
              supplierOrders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs font-semibold text-slate-600">
                          Selecta POS Ref: <strong>{order.selecta_pos_ref || 'Pending Entry'}</strong>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'Fully Received' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Partially Received' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Recorded in Selecta POS' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Ordered Date: {order.order_date ? formatDate(order.order_date) : '--'} • Expected Arrival: {order.expected_arrival_date ? formatDate(order.expected_arrival_date) : 'Pending Confirmation'}
                      </p>
                      <p className="text-xs text-slate-600 italic">
                        "{order.notes || 'Bulk stock order for weekly store deliveries.'}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Wholesale Amount</span>
                        <p className="text-base font-black text-slate-900">{formatPHP(order.supplier_amount)}</p>
                        <p className="text-[10px] text-slate-500">{items.length} line items</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDetailModal(true);
                          }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                          title="View PO Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status transition dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Ready for Ordering">Ready for Ordering</option>
                          <option value="Recorded in Selecta POS">Recorded in Selecta POS</option>
                          <option value="Partially Received">Partially Received</option>
                          <option value="Fully Received">Fully Received</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CREATE SUPPLIER ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-black text-slate-900">Prepare Selecta Supplier Order</h3>
                <p className="text-xs text-slate-500">Record supplier order details placed via Selecta POS</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplierOrder} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selecta POS Reference #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SEL-POS-99412"
                    value={newOrderData.selecta_pos_ref}
                    onChange={(e) => setNewOrderData({ ...newOrderData, selecta_pos_ref: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Receipt or reference number from Selecta's external POS</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Order Status</label>
                  <select
                    value={newOrderData.status}
                    onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Ready for Ordering">Ready for Ordering</option>
                    <option value="Recorded in Selecta POS">Recorded in Selecta POS</option>
                    <option value="Partially Received">Partially Received</option>
                    <option value="Fully Received">Fully Received</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Order Date</label>
                  <input
                    type="date"
                    required
                    value={newOrderData.order_date}
                    onChange={(e) => setNewOrderData({ ...newOrderData, order_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Delivery Arrival</label>
                  <input
                    type="date"
                    value={newOrderData.expected_arrival_date}
                    onChange={(e) => setNewOrderData({ ...newOrderData, expected_arrival_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Responsible Person</label>
                <input
                  type="text"
                  value={newOrderData.responsible_person}
                  onChange={(e) => setNewOrderData({ ...newOrderData, responsible_person: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Items List */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Order Line Items ({newOrderData.items.length})</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 text-right">Qty to Order</th>
                        <th className="p-2.5 text-right">Unit Cost</th>
                        <th className="p-2.5 text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newOrderData.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900">{it.productName}</td>
                          <td className="p-2.5 text-right">
                            <input
                              type="number"
                              min="0"
                              value={it.orderedQty}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 0;
                                const updated = [...newOrderData.items];
                                updated[idx].orderedQty = newQty;
                                updated[idx].totalCost = newQty * updated[idx].unitCost;
                                setNewOrderData({ ...newOrderData, items: updated });
                              }}
                              className="w-16 px-2 py-1 rounded border border-slate-200 text-right text-xs"
                            />
                          </td>
                          <td className="p-2.5 text-right text-slate-600">{formatPHP(it.unitCost)}</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">{formatPHP(it.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Instructions</label>
                <textarea
                  rows="2"
                  value={newOrderData.notes}
                  onChange={(e) => setNewOrderData({ ...newOrderData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Additional order instructions for the Selecta bodega team..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Supplier Total</span>
                  <p className="text-lg font-black text-red-600">
                    {formatPHP(newOrderData.items.reduce((sum, it) => sum + (parseFloat(it.totalCost) || 0), 0))}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                  >
                    Confirm & Save Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ORDER DETAIL MODAL */}
      {viewDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Supplier Order #{selectedOrder.id}</h3>
                <p className="text-xs text-slate-500">Selecta POS Ref: {selectedOrder.selecta_pos_ref || 'Pending'}</p>
              </div>
              <button onClick={() => setViewDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                <p className="font-bold text-slate-900">{selectedOrder.status}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Order Date</span>
                <p className="font-bold text-slate-900">{selectedOrder.order_date}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Expected Arrival</span>
                <p className="font-bold text-slate-900">{selectedOrder.expected_arrival_date || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</span>
                <p className="font-black text-red-600">{formatPHP(selectedOrder.supplier_amount)}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold text-[10px]">
                  <tr>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5 text-right">Ordered Qty</th>
                    <th className="p-2.5 text-right">Unit Cost</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-bold text-slate-900">{it.productName}</td>
                      <td className="p-2.5 text-right">{it.orderedQty || it.qty}</td>
                      <td className="p-2.5 text-right text-slate-600">{formatPHP(it.unitCost || it.price)}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{formatPHP(it.totalCost || (it.orderedQty * it.unitCost))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print PO
              </button>
              <button
                onClick={() => setViewDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
