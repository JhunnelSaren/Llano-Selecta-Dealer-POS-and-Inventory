import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Check, 
  X, 
  Save, 
  Printer, 
  User, 
  Calendar, 
  IceCream,
  Search,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  CreditCard,
  Building,
  RotateCcw
} from 'lucide-react';
import { formatPHP, formatDate } from '../../utils/helpers';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ActiveDeliveryRun({ initialBookingId }) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Delivery entry state for selected store
  const [deliveryData, setDeliveryData] = useState({
    bookingId: '',
    storeName: '',
    recipientName: '',
    deliveryStaff: currentUser?.name || 'Driver & Loader Crew',
    items: [],
    paymentMethod: 'Cash',
    paidAmount: '',
    notes: '',
    discrepancyReason: ''
  });

  // Fetch bookings
  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/bookings');
      if (Array.isArray(data)) {
        setBookings(data);
        if (initialBookingId) {
          const match = data.find(b => b.id === initialBookingId);
          if (match) selectStoreForDelivery(match);
        } else if (data.length > 0 && !selectedBooking) {
          // Select first pending delivery if available
          const pending = data.find(b => b.status === 'Ready for Deliver' || b.status === 'Booked') || data[0];
          selectStoreForDelivery(pending);
        }
      }
    } catch (err) {
      console.warn('Error fetching deliveries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [initialBookingId]);

  // Select store to deliver
  const selectStoreForDelivery = (booking) => {
    setSelectedBooking(booking);
    
    // Parse items
    const rawItems = Array.isArray(booking.items) 
      ? booking.items 
      : (typeof booking.items === 'string' ? JSON.parse(booking.items || '[]') : []);

    const initializedItems = rawItems.map(item => {
      const ordered = Number(item.qty || item.quantity || 1);
      const price = Number(item.price || item.unit_price || 28.00);
      return {
        id: item.id || item.productId || 'SKU',
        name: item.name || item.product_name || 'Selecta Product',
        category: item.category || 'SELECTA',
        price: price,
        orderedQty: ordered,
        loadedQty: ordered,
        acceptedQty: item.acceptedQty !== undefined ? Number(item.acceptedQty) : ordered,
        missingQty: Number(item.missingQty || 0),
        boQty: Number(item.boQty || 0),
        lineTotal: price * (item.acceptedQty !== undefined ? Number(item.acceptedQty) : ordered)
      };
    });

    const netAmount = Number(booking.net_delivered_amount || booking.total_receipt || booking.estimated_total || 0);

    setDeliveryData({
      bookingId: booking.id,
      storeName: booking.store_name || booking.customer,
      recipientName: booking.owner_name || 'Store Attendant',
      deliveryStaff: currentUser?.name || 'Bongo Delivery Crew',
      items: initializedItems,
      paymentMethod: booking.payment_method || 'Cash',
      paidAmount: booking.paid_amount ? String(booking.paid_amount) : String(netAmount),
      notes: booking.remarks || '',
      discrepancyReason: ''
    });
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Update item counts (accepted, missing, bo)
  const handleItemCountChange = (index, field, value) => {
    const val = Math.max(0, parseInt(value, 10) || 0);
    const updated = [...deliveryData.items];
    const item = { ...updated[index] };

    if (field === 'acceptedQty') {
      item.acceptedQty = Math.min(item.loadedQty, val);
      // If accepted is reduced, difference becomes missing unless BO
      if (item.acceptedQty + item.missingQty + item.boQty > item.loadedQty) {
        item.missingQty = Math.max(0, item.loadedQty - item.acceptedQty - item.boQty);
      }
    } else if (field === 'missingQty') {
      item.missingQty = val;
      item.acceptedQty = Math.max(0, item.loadedQty - item.missingQty - item.boQty);
    } else if (field === 'boQty') {
      item.boQty = val;
      item.acceptedQty = Math.max(0, item.loadedQty - item.missingQty - item.boQty);
    }

    // Billable amount = acceptedQty * unit price (No double-deduction!)
    item.lineTotal = item.acceptedQty * item.price;
    updated[index] = item;

    // Recalculate total billable
    const newTotalBill = updated.reduce((sum, it) => sum + it.lineTotal, 0);

    setDeliveryData({
      ...deliveryData,
      items: updated,
      paidAmount: String(newTotalBill)
    });
  };

  // Calculate bill summary
  const totalOrderedAmount = deliveryData.items.reduce((sum, it) => sum + (it.orderedQty * it.price), 0);
  const totalMissingAmount = deliveryData.items.reduce((sum, it) => sum + (it.missingQty * it.price), 0);
  const totalBOAmount = deliveryData.items.reduce((sum, it) => sum + (it.boQty * it.price), 0);
  const finalBillableAmount = deliveryData.items.reduce((sum, it) => sum + it.lineTotal, 0);

  const amountPaidNum = parseFloat(deliveryData.paidAmount) || 0;
  const outstandingBalance = Math.max(0, finalBillableAmount - amountPaidNum);
  const changeDue = Math.max(0, amountPaidNum - finalBillableAmount);

  // Save Store Delivery Result
  const handleSaveStoreDelivery = async (markComplete = false) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (deliveryData.items.length === 0) {
      setErrorMsg('No items in this delivery order.');
      return;
    }

    // Safeguard check: If there are missing or BO items, require discrepancy reason/notes
    const hasDiscrepancy = totalMissingAmount > 0 || totalBOAmount > 0;
    if (hasDiscrepancy && !deliveryData.notes.trim() && !deliveryData.discrepancyReason.trim()) {
      setErrorMsg('Discrepancy detected (Missing items or BO returned). Please record an explanation in Notes.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status: markComplete ? 'Delivered' : 'Ready for Deliver',
        net_delivered_amount: finalBillableAmount,
        total_receipt: totalOrderedAmount,
        bo_deductions: totalBOAmount,
        missing_deductions: totalMissingAmount,
        payment_method: deliveryData.paymentMethod,
        paid_amount: amountPaidNum,
        change_amount: changeDue,
        remarks: `${deliveryData.notes || ''} ${deliveryData.discrepancyReason ? `[Discrepancy: ${deliveryData.discrepancyReason}]` : ''}`.trim(),
        delivered_at: markComplete ? new Date().toISOString() : null,
        delivered_time: markComplete ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        items: deliveryData.items.map(it => ({
          id: it.id,
          name: it.name,
          category: it.category,
          price: it.price,
          qty: it.orderedQty,
          acceptedQty: it.acceptedQty,
          missingQty: it.missingQty,
          boQty: it.boQty,
          lineTotal: it.lineTotal
        }))
      };

      await api.put(`/api/bookings/${deliveryData.bookingId}`, payload);

      // If there are BO or missing items, log discrepancy into ledger
      if (hasDiscrepancy) {
        for (const it of deliveryData.items) {
          if (it.boQty > 0) {
            await api.post('/api/discrepancies', {
              delivery_ref: `DEL-${deliveryData.bookingId}`,
              area: selectedBooking.area || 'Valencia',
              store_name: deliveryData.storeName,
              customer_name: selectedBooking.owner_name || deliveryData.recipientName,
              product_name: it.name,
              category: it.category,
              type: 'BO / Melted',
              quantity: it.boQty,
              unit_price: it.price,
              deduction_amount: it.boQty * it.price,
              reason: deliveryData.discrepancyReason || 'Store rejected melted tub/cone',
              reported_by: deliveryData.deliveryStaff,
              status: 'Logged',
              refund_status: 'Deducted from Invoice',
              refund_amount: it.boQty * it.price,
              notes: 'Deducted immediately on customer bill (Formula Section 13)'
            }).catch(() => {});
          }
        }
      }

      setSuccessMsg(markComplete 
        ? `Delivery for ${deliveryData.storeName} marked as DELIVERED successfully!` 
        : `Progress saved for ${deliveryData.storeName}.`
      );

      // Refresh list
      loadDeliveries();

    } catch (err) {
      setErrorMsg(err.message || 'Failed to save delivery result.');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.store_name || b.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute = routeFilter === 'ALL' || (b.route || b.area || '').includes(routeFilter);
    return matchesSearch && matchesRoute;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Route Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-600" />
            Active Delivery Run (Store-by-Store)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record actual delivered & accepted stock, deduct BO / missing items, and collect payment at each stop.
          </p>
        </div>

        {/* Route Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Active Route:</span>
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="input-field text-xs font-bold py-1.5 px-3"
          >
            <option value="ALL">All Delivery Routes</option>
            <option value="Valencia">Valencia City Route (Batangan & San Isidro)</option>
            <option value="Cabanglasan">Cabanglasan Delivery Route</option>
            <option value="San Fernando">Valencia -&gt; San Fernando Route</option>
          </select>
        </div>
      </div>

      {/* Grid: Left Store Stops List (4 cols) | Right Store Actual Delivery Form (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Delivery Stops List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search store or booking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mt-2">
              <span>{filteredBookings.length} Stops on Run</span>
              <span className="text-emerald-700">
                {filteredBookings.filter(b => b.status === 'Delivered').length} Completed
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                No stores found for this route.
              </div>
            ) : (
              filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                const isDelivered = b.status === 'Delivered';
                return (
                  <div
                    key={b.id}
                    onClick={() => selectStoreForDelivery(b)}
                    className={`p-3.5 cursor-pointer transition-colors text-xs flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-red-50/80 border-l-4 border-red-600' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 truncate block">
                          {b.store_name || b.customer}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{b.area} • #{b.id}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 block">
                        {formatPHP(b.net_delivered_amount || b.total_receipt || b.estimated_total)}
                      </span>
                      <span className={`inline-block px-2 py-0.2 rounded text-[10px] font-bold ${
                        isDelivered 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'Ready for Deliver'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Actual Delivery Entry Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          {!selectedBooking ? (
            <div className="py-24 text-center text-slate-400 italic text-sm">
              Select a store from the list on the left to record actual delivery.
            </div>
          ) : (
            <>
              {/* Store Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      {deliveryData.storeName}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                      {selectedBooking.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBooking.route || selectedBooking.area} • Attendant: <strong>{selectedBooking.owner_name || 'Owner'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedBooking.status === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Success / Error Messages */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Delivery Staff & Recipient Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Recipient / Acknowledger
                  </label>
                  <input
                    type="text"
                    value={deliveryData.recipientName}
                    onChange={(e) => setDeliveryData({ ...deliveryData, recipientName: e.target.value })}
                    className="input-field text-xs"
                    placeholder="e.g. Aling Nena"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Driver / Staff
                  </label>
                  <input
                    type="text"
                    value={deliveryData.deliveryStaff}
                    onChange={(e) => setDeliveryData({ ...deliveryData, deliveryStaff: e.target.value })}
                    className="input-field text-xs"
                    placeholder="e.g. Juan Driver + Loader"
                  />
                </div>
              </div>

              {/* Item-by-item Actual Delivery Checklist Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Delivered Products & Inspection Checklist
                  </label>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Formula: Billable Qty = Accepted Qty × Selling Price
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-2 text-right">Price</th>
                        <th className="py-2.5 px-2 text-center">Ordered</th>
                        <th className="py-2.5 px-2 text-center">Accepted</th>
                        <th className="py-2.5 px-2 text-center text-amber-700">Missing</th>
                        <th className="py-2.5 px-2 text-center text-red-700">BO Melted</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {deliveryData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">{item.category}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                            {formatPHP(item.price)}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-600">
                            {item.orderedQty}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.loadedQty}
                              value={item.acceptedQty}
                              onChange={(e) => handleItemCountChange(idx, 'acceptedQty', e.target.value)}
                              className="w-16 py-1 px-2 border border-slate-200 rounded-lg text-center font-bold text-slate-900 focus:border-red-500"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.loadedQty}
                              value={item.missingQty}
                              onChange={(e) => handleItemCountChange(idx, 'missingQty', e.target.value)}
                              className="w-14 py-1 px-1 border border-amber-300 bg-amber-50 rounded-lg text-center font-bold text-amber-900 focus:border-amber-500"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={item.loadedQty}
                              value={item.boQty}
                              onChange={(e) => handleItemCountChange(idx, 'boQty', e.target.value)}
                              className="w-14 py-1 px-1 border border-red-300 bg-red-50 rounded-lg text-center font-bold text-red-900 focus:border-red-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatPHP(item.lineTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bill & Discrepancy Breakdown Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Original Ordered Total:</span>
                    <span className="font-mono font-semibold">{formatPHP(totalOrderedAmount)}</span>
                  </div>
                  {totalMissingAmount > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span>− Missing / Not Delivered:</span>
                      <span className="font-mono">− {formatPHP(totalMissingAmount)}</span>
                    </div>
                  )}
                  {totalBOAmount > 0 && (
                    <div className="flex justify-between text-red-700 font-semibold">
                      <span>− Refused BO / Melted Tubs:</span>
                      <span className="font-mono">− {formatPHP(totalBOAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Final Net Amount Due:</span>
                    <span className="font-mono text-red-600">{formatPHP(finalBillableAmount)}</span>
                  </div>
                </div>

                {/* Payment Entry Form */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Payment Method</label>
                      <select
                        value={deliveryData.paymentMethod}
                        onChange={(e) => setDeliveryData({ ...deliveryData, paymentMethod: e.target.value })}
                        className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        <option value="Cash">Cash</option>
                        <option value="GCash">GCash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Check">Check</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Amount Paid (₱)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={deliveryData.paidAmount}
                        onChange={(e) => setDeliveryData({ ...deliveryData, paidAmount: e.target.value })}
                        className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] font-semibold pt-1">
                    <span className="text-slate-500">Remaining Balance:</span>
                    <span className={outstandingBalance > 0 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                      {formatPHP(outstandingBalance)}
                    </span>
                  </div>
                  {changeDue > 0 && (
                    <div className="flex justify-between text-[11px] font-semibold text-emerald-700">
                      <span>Change to Customer:</span>
                      <span className="font-bold">{formatPHP(changeDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Notes & Discrepancy Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Notes / Discrepancy Reason <span className="text-slate-400 font-normal">(Required if any missing/BO)</span>
                </label>
                <input
                  type="text"
                  value={deliveryData.notes}
                  onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })}
                  placeholder="e.g. 1 tub soft melted returned, customer paid exact cash"
                  className="input-field text-xs"
                />
              </div>

              {/* Action Buttons: Save Progress vs Mark Delivered */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => selectStoreForDelivery(selectedBooking)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Reset Form
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSaveStoreDelivery(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs"
                  >
                    Save Store Result
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSaveStoreDelivery(true)}
                    className="btn-primary py-2.5 px-5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Mark Store Delivered
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}