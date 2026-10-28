import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Search, 
  Plus, 
  Printer, 
  X, 
  Eye, 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  IceCream, 
  FileText, 
  Barcode, 
  Tag, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  ClipboardList, 
  Store, 
  Layers,
  AlertCircle,
  Check,
  Box
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function DeliveryPacking() {
  const { currentUser } = useAuth();
  const [batches, setBatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedStoreBox, setSelectedStoreBox] = useState(null);
  const [printBoxLabelModal, setPrintBoxLabelModal] = useState(false);

  // Form State for New Delivery Batch
  const [formData, setFormData] = useState({
    batch_number: `BATCH-${Date.now().toString().slice(-4)}`,
    delivery_date: new Date().toISOString().split('T')[0],
    area: 'Valencia City',
    route: 'Valencia City Route (Batangan & San Isidro)',
    driver_name: 'Juan Santos',
    helper1_name: 'Roberto Backride',
    helper2_name: 'Carlos Helper',
    booker_name: 'Nena Booker',
    checker_name: 'Maria Checker',
    vehicle_info: 'Bongo Refrigerated Van (Plate KAB-4819)',
    status: 'Preparing',
    notes: 'Morning trip dispatched 07:00 AM. Ensure icebox blocks are frozen solid.'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [bData, bkData, empData] = await Promise.all([
        api.get('/api/delivery-batches').catch(() => []),
        api.get('/api/bookings').catch(() => []),
        api.get('/api/employees').catch(() => [])
      ]);
      setBatches(Array.isArray(bData) ? bData : []);
      setBookings(Array.isArray(bkData) ? bkData : []);
      setEmployees(Array.isArray(empData) ? empData : []);
    } catch (err) {
      console.error('Failed to load delivery batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter pending bookings ready for delivery
  const readyBookings = bookings.filter(b => b.status === 'Ready for Deliver' || b.status === 'Booked');

  // Create new delivery batch with picking lists per store
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Build store picking list
    const storesList = readyBookings
      .filter(b => areaFilter === 'ALL' || (b.area && b.area.includes(areaFilter)))
      .map((b, idx) => ({
        bookingId: b.id,
        storeId: b.customer_id || `CUST-00${idx + 1}`,
        storeName: b.store_name || b.customer,
        area: b.area,
        boxId: `ICEBOX-${formData.area.slice(0, 3).toUpperCase()}-0${idx + 1}`,
        packedStatus: 'Packed',
        checkedBy: formData.checker_name || 'Maria Checker',
        deliveryStatus: 'Pending',
        items: (b.items || []).map(it => ({
          name: it.name,
          category: it.category || 'SELECTA',
          qty: it.qty || 1,
          packedQty: it.qty || 1,
          price: it.price || 0
        }))
      }));

    try {
      await api.post('/api/delivery-batches', {
        ...formData,
        stores: storesList
      });

      setSuccessMsg('Delivery batch and store picking lists created successfully.');
      setIsNewBatchModalOpen(false);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create delivery batch');
    }
  };

  // Update batch status (e.g. Dispatched, Delivered)
  const handleUpdateBatchStatus = async (batchId, newStatus) => {
    try {
      await api.put(`/api/delivery-batches/${batchId}`, { status: newStatus });
      setSuccessMsg(`Delivery batch marked as ${newStatus}.`);
      loadData();
    } catch (err) {
      setErrorMsg('Failed to update status');
    }
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = (b.route && b.route.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.driver_name && b.driver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.batch_number && b.batch_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = areaFilter === 'ALL' || (b.area && b.area.includes(areaFilter));
    return matchesSearch && matchesArea;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Delivery Planning & Store Packing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Cold Chain Logistics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize Bongo delivery batches, assign drivers and helpers, prepare store iceboxes, and print box labels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Manifest
          </button>
          <button
            onClick={() => setIsNewBatchModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30"
          >
            <Plus className="w-4 h-4" /> Create Delivery Batch
          </button>
        </div>
      </div>

      {/* Alert Banners */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Batches</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{batches.length} Batches</p>
          <p className="text-[11px] text-slate-400 mt-1">Planned & dispatched routes</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Stores Awaiting Packing</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{readyBookings.length} Stores</p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for icebox packing</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Vehicle Assigned</span>
            <Box className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">Bongo Refrig. Van</p>
          <p className="text-[11px] text-slate-400 mt-1">Plate: KAB-4819 (Active)</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Logistics Crew</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{employees.length || 4} Available</p>
          <p className="text-[11px] text-slate-400 mt-1">Drivers, backrides & checkers</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search batch, route, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-red-500 w-52 sm:w-64"
            />
          </div>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Areas</option>
            <option value="Valencia">Valencia City</option>
            <option value="Cabanglasan">Cabanglasan</option>
            <option value="San Fernando">San Fernando</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredBatches.length}</strong> batch(es)
        </span>
      </div>

      {/* Batches Cards & Store Picking Lists */}
      <div className="space-y-4">
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No delivery batches found. Click "Create Delivery Batch" to schedule a trip.
          </div>
        ) : (
          filteredBatches.map((batch) => {
            const stores = Array.isArray(batch.stores) ? batch.stores : [];
            return (
              <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Batch Header Strip */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">{batch.batch_number || batch.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-xs text-slate-700">{batch.route}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        batch.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        batch.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                        batch.status === 'Ready for Dispatch' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Date: <strong className="text-slate-700">{batch.delivery_date}</strong></span>
                      <span>Driver: <strong className="text-slate-700">{batch.driver_name}</strong></span>
                      <span>Helpers: <strong className="text-slate-700">{batch.helper1_name || 'None'}, {batch.helper2_name || ''}</strong></span>
                      <span>Vehicle: <strong className="text-slate-700">{batch.vehicle_info}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={batch.status}
                      onChange={(e) => handleUpdateBatchStatus(batch.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                    >
                      <option value="Planned">Planned</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready for Dispatch">Ready for Dispatch</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Reconciled">Reconciled</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedBatch(batch);
                        window.print();
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      title="Print Manifest"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stores Picking List inside Batch */}
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    Store Icebox Picking Lists ({stores.length} customer destinations)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stores.map((st, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 truncate">{st.storeName}</span>
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">
                            {st.boxId}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          <span>Checker: {st.checkedBy || 'Maria Checker'}</span>
                          <div className="font-semibold text-slate-700 mt-1">
                            {(st.items || []).length} product flavors packed
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Status: <strong className="text-emerald-700">{st.packedStatus || 'Packed'}</strong>
                          </span>
                          <button
                            onClick={() => {
                              setSelectedStoreBox({ ...st, batchRoute: batch.route, batchDate: batch.delivery_date });
                              setPrintBoxLabelModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3 text-red-600" /> Print Box Label
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE DELIVERY BATCH MODAL */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <h3 className="text-base font-black text-slate-900">Prepare Delivery Batch & Packing</h3>
                <p className="text-xs text-slate-500">Assign vehicle, driver, helpers, and generate store icebox lists</p>
              </div>
              <button onClick={() => setIsNewBatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Territory / Area</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({
                      ...formData,
                      area: e.target.value,
                      route: `${e.target.value} Route`
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="Valencia City">Valencia City (Batangan, San Isidro, Lumabayo)</option>
                    <option value="Cabanglasan">Cabanglasan Area</option>
                    <option value="San Fernando">San Fernando Area</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Route</label>
                  <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    required
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Helper / Backride 1</label>
                  <input
                    type="text"
                    value={formData.helper1_name}
                    onChange={(e) => setFormData({ ...formData, helper1_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Helper / Backride 2</label>
                  <input
                    type="text"
                    value={formData.helper2_name}
                    onChange={(e) => setFormData({ ...formData, helper2_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Checker / Inspection Staff</label>
                  <input
                    type="text"
                    value={formData.checker_name}
                    onChange={(e) => setFormData({ ...formData, checker_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Vehicle Information</label>
                <input
                  type="text"
                  value={formData.vehicle_info}
                  onChange={(e) => setFormData({ ...formData, vehicle_info: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dispatch Notes & Icebox Protocol</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Includes {readyBookings.length} confirmed store orders ready for packing.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewBatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                  >
                    Confirm & Generate Picking Lists
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE BOX LABEL MODAL */}
      {printBoxLabelModal && selectedStoreBox && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Print Store Icebox Label</h3>
              <button onClick={() => setPrintBoxLabelModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Label Box */}
            <div className="p-5 border-2 border-dashed border-red-500 rounded-2xl bg-red-50/20 text-center space-y-3">
              <div className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
                LLANO SELECTA DEALER — COLD DELIVERY
              </div>
              <div className="py-2 border-y border-red-200">
                <h2 className="text-xl font-black text-slate-900">{selectedStoreBox.storeName}</h2>
                <p className="text-xs text-slate-600">{selectedStoreBox.area}</p>
              </div>
              <div className="bg-slate-900 text-white p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned Icebox</span>
                <p className="text-2xl font-black font-mono tracking-wider">{selectedStoreBox.boxId}</p>
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                <span>Date: {selectedStoreBox.batchDate}</span>
                <span>Checked By: {selectedStoreBox.checkedBy}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintBoxLabelModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/30"
              >
                <Printer className="w-4 h-4" /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
