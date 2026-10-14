import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ClipboardList, 
  Calendar, 
  MapPin, 
  X, 
  Printer, 
  Eye, 
  Filter, 
  FileText,
  Trash2,
  Store,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Truck,
  Edit,
  Clock
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export const AREA_CHOICES = [
  'Valencia City: Batangan',
  'Valencia City: Kahaponan',
  'Valencia City: Ventar',
  'Valencia City: San-Isidro',
  'Valencia City: Sinabuagan',
  'Valencia City: Lumbayao',
  'San Fernando Area',
  'Cabanglasan Area'
];

export default function Bookings() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  
  // Bookings list strictly using statuses: 'Booked', 'Draft', 'Delivered', 'Backload'
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-1001',
      customer: 'Aling Nena Sari-Sari Store',
      owner: 'Nena Dela Cruz',
      area: 'Valencia City: Batangan',
      route: 'Valencia City Route (Batangan)',
      booker: 'Juan Dela Cruz',
      date: '2026-10-09',
      status: 'Delivered', // 'Booked' | 'Draft' | 'Delivered' | 'Backload'
      backloadReason: '',
      remarks: 'Deliver before 2 PM. Call before arrival.',
      items: [
        { id: 'MAG-001', productId: 'MAG-001', name: 'CLASSIC', category: 'MAGNUM', qty: 10, price: 1651.96 },
        { id: 'COR-001', productId: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', qty: 20, price: 484.80 }
      ],
      totalAmount: 26215.60
    },
    {
      id: 'BK-2026-1002',
      customer: 'San Isidro Mini-Mart',
      owner: 'Juan Santos',
      area: 'Valencia City: San-Isidro',
      route: 'Valencia City Route (San-Isidro)',
      booker: 'Pedro Booker',
      date: '2026-10-09',
      status: 'Booked',
      backloadReason: '',
      remarks: 'Needs morning delivery schedule.',
      items: [
        { id: 'STK-001', productId: 'STK-001', name: 'COOKIES & CREAM', category: 'STICKS', qty: 15, price: 248.20 },
        { id: 'SUP-001', productId: 'SUP-001', name: 'DOUBLE DUTCH', category: 'SUPREME 1.3L', qty: 8, price: 1477.58 }
      ],
      totalAmount: 15543.64
    },
    {
      id: 'BK-2026-1003',
      customer: 'Cabanglasan Highland Corner',
      owner: 'Ramon Santos Jr.',
      area: 'Cabanglasan Area',
      route: 'Cabanglasan Loop',
      booker: 'Maria Clara',
      date: '2026-10-08',
      status: 'Backload',
      backloadReason: 'Store closed upon arrival; owner was unreachable via phone.',
      remarks: 'Attempted delivery at 3:15 PM.',
      items: [
        { id: 'COR-002', productId: 'COR-002', name: 'COOKIES & DREAM', category: 'CORNETTO', qty: 25, price: 484.80 }
      ],
      totalAmount: 12120.00
    },
    {
      id: 'BK-2026-1004',
      customer: 'Kahaponan Grocery Hub',
      owner: 'Teresita Bautista',
      area: 'Valencia City: Kahaponan',
      route: 'Valencia City Route (Kahaponan)',
      booker: 'Juan Dela Cruz',
      date: '2026-10-09',
      status: 'Draft',
      backloadReason: '',
      remarks: 'Draft pending final SKU quantity confirmation.',
      items: [
        { id: 'MAG-002', productId: 'MAG-002', name: 'ALMOND', category: 'MAGNUM', qty: 5, price: 1651.96 }
      ],
      totalAmount: 8259.80
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  // Status Change Modal
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newSelectedStatus, setNewSelectedStatus] = useState('Delivered');
  const [backloadReasonInput, setBackloadReasonInput] = useState('');

  // New Booking Form State
  const [formArea, setFormArea] = useState('Valencia City: Batangan');
  const [formCustomer, setFormCustomer] = useState('');
  const [formRoute, setFormRoute] = useState('Valencia City Route (Batangan)');
  const [formBooker, setFormBooker] = useState('Juan Dela Cruz');
  const [formRemarks, setFormRemarks] = useState('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState('ALL');
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [formItems, setFormItems] = useState([]);

  const categories = ['ALL', ...SELECTA_CATEGORIES];

  // Fetch backend API on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            dealerPrice: Number(p.unit_price || p.dealer_price || 0),
            unit_price: Number(p.unit_price || p.dealer_price || 0),
            stock: p.stock || 50
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {});

    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      })
      .catch(() => {});
  }, []);

  // Filter customers by selected formArea
  const availableStoresForArea = customers.filter(c => {
    if (!formArea) return true;
    const normFormArea = formArea.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCustArea = (c.area || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCustSub = (c.subArea || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    return normCustArea.includes(normFormArea) || 
           normFormArea.includes(normCustArea) || 
           normFormArea.includes(normCustSub);
  });

  // Filtered products inside modal
  const filteredModalProducts = products.filter(p => {
    const matchesCat = modalCategoryFilter === 'ALL' || p.category === modalCategoryFilter;
    const matchesSearch = !modalSearchTerm || 
      p.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(modalSearchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const calculatedTotal = formItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleAddItem = (prod) => {
    const existingIndex = formItems.findIndex(item => item.productId === prod.id);
    if (existingIndex > -1) {
      const updated = [...formItems];
      updated[existingIndex].qty += 1;
      setFormItems(updated);
    } else {
      setFormItems([
        ...formItems,
        { productId: prod.id, name: prod.name, category: prod.category, price: Number(prod.unit_price || prod.dealerPrice), qty: 1 }
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...formItems];
    updated[index].qty = Math.max(1, parseInt(qty) || 1);
    setFormItems(updated);
  };

  // Create Booking strictly as 'Booked' or 'Draft'
  const handleSaveBooking = (status = 'Booked') => {
    if (!formCustomer.trim()) {
      alert('Please select a customer store for this booking!');
      return;
    }
    if (formItems.length === 0) {
      alert('Please add at least one product item to the order!');
      return;
    }

    const matchedStore = customers.find(c => c.store_name === formCustomer);

    const newBooking = {
      id: `BK-2026-${1000 + bookings.length + 1}`,
      customer: formCustomer,
      owner: matchedStore?.owner || 'Store Owner',
      area: formArea,
      route: formRoute,
      booker: formBooker,
      date: new Date().toISOString().split('T')[0],
      status: status, // strictly 'Booked' or 'Draft'
      backloadReason: '',
      remarks: formRemarks,
      items: formItems,
      totalAmount: calculatedTotal
    };

    setBookings([newBooking, ...bookings]);
    setIsModalOpen(false);
    setFormCustomer('');
    setFormRemarks('');
    setFormItems([]);
  };

  // Handle Delivery Status Change (Booked, Draft, Delivered, Backload)
  const handleUpdateDeliveryStatus = () => {
    if (!statusModalBooking) return;
    if (newSelectedStatus === 'Backload' && !backloadReasonInput.trim()) {
      alert('Please provide a reason for the Backload (failed delivery or store closed).');
      return;
    }

    const updated = bookings.map(b => {
      if (b.id === statusModalBooking.id) {
        return {
          ...b,
          status: newSelectedStatus,
          backloadReason: newSelectedStatus === 'Backload' ? backloadReasonInput : ''
        };
      }
      return b;
    });

    setBookings(updated);
    setStatusModalBooking(null);
    setBackloadReasonInput('');
  };

  // Strictly 4 statuses helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Backload':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.booker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesArea = areaFilter === 'All' || b.area.toLowerCase().includes(areaFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesArea;
  });

  // Status Metrics
  const bookedCount = bookings.filter(b => b.status === 'Booked').length;
  const draftCount = bookings.filter(b => b.status === 'Draft').length;
  const deliveredCount = bookings.filter(b => b.status === 'Delivered').length;
  const backloadCount = bookings.filter(b => b.status === 'Backload').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Bookings & Delivery Orders</h1>
          <p className="text-sm text-slate-500">Field order capturing, area-filtered store selection & real-time delivery status</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormArea('Valencia City: Batangan');
            setFormCustomer('');
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Booking
        </button>
      </div>

      {/* Delivery Status Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Booked</span>
            <span className="text-2xl font-bold text-blue-700">{bookedCount}</span>
            <span className="text-[11px] text-slate-400 block">Ready for packing</span>
          </div>
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="card border-l-4 border-l-slate-400 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Draft</span>
            <span className="text-2xl font-bold text-slate-700">{draftCount}</span>
            <span className="text-[11px] text-slate-400 block">Unsubmitted bookings</span>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Delivered</span>
            <span className="text-2xl font-bold text-emerald-700">{deliveredCount}</span>
            <span className="text-[11px] text-emerald-600 block">Successfully received</span>
          </div>
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="card border-l-4 border-l-red-500 flex items-center justify-between p-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Backload</span>
            <span className="text-2xl font-bold text-red-700">{backloadCount}</span>
            <span className="text-[11px] text-red-600 font-semibold block">Store closed / Failed</span>
          </div>
          <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search booking ref, store name, area, or booker..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer text-xs font-semibold sm:w-44"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Draft">Draft</option>
              <option value="Delivered">Delivered</option>
              <option value="Backload">Backload</option>
            </select>

            <select 
              value={areaFilter} 
              onChange={(e) => setAreaFilter(e.target.value)}
              className="input-field cursor-pointer text-xs sm:w-48"
            >
              <option value="All">All Areas</option>
              {AREA_CHOICES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Booking Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Store & Area</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Booker</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Items</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Est. Total</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Delivery Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{b.id}</div>
                      <div className="text-[11px] text-slate-400">{b.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{b.customer}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-red shrink-0" /> {b.area}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{b.booker}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 font-medium">
                      {b.items.reduce((acc, i) => acc + i.qty, 0)} units ({b.items.length} SKUs)
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">{formatPHP(b.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                      {b.status === 'Backload' && b.backloadReason && (
                        <div className="text-[11px] text-red-600 font-medium mt-1 max-w-xs truncate" title={b.backloadReason}>
                          Reason: {b.backloadReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewSelectedStatus(b.status);
                            setBackloadReasonInput(b.backloadReason || '');
                          }}
                          title="Update Delivery Status"
                          className="btn-secondary text-xs py-1 px-2 inline-flex items-center gap-1 hover:bg-slate-100 font-semibold"
                        >
                          <Truck className="w-3.5 h-3.5 text-slate-600" /> Status
                        </button>
                        <button 
                          onClick={() => setViewBooking(b)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No bookings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Delivery Status Modal (Booked, Draft, Delivered, Backload) */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Update Delivery Status</h2>
              </div>
              <button onClick={() => setStatusModalBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{statusModalBooking.customer}</div>
                <div className="text-slate-500">Booking: <span className="font-mono font-bold text-slate-800">{statusModalBooking.id}</span></div>
                <div className="text-slate-500">Area: {statusModalBooking.area}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Delivery Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Delivered', 'Backload', 'Booked', 'Draft'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewSelectedStatus(st)}
                      className={`p-3 rounded-lg font-bold text-xs border text-left flex items-center justify-between transition-all ${
                        newSelectedStatus === st 
                          ? st === 'Delivered' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                            : st === 'Backload' ? 'bg-red-50 border-red-500 text-red-800 shadow-2xs'
                            : st === 'Booked' ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-2xs'
                            : 'bg-slate-100 border-slate-400 text-slate-800 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{st}</span>
                      {newSelectedStatus === st && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backload Reason Field */}
              {newSelectedStatus === 'Backload' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-red-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Backload Reason (Delivery Failed / Store Closed) *
                  </label>
                  <select 
                    value={backloadReasonInput}
                    onChange={(e) => setBackloadReasonInput(e.target.value)}
                    className="input-field text-xs bg-white cursor-pointer"
                  >
                    <option value="">-- Select or Type Reason Below --</option>
                    <option value="Store was closed upon delivery attempt">Store was closed upon delivery attempt</option>
                    <option value="Customer unreachable via phone/call">Customer unreachable via phone/call</option>
                    <option value="Customer had insufficient payment/cash">Customer had insufficient payment/cash</option>
                    <option value="Customer refused delivery / requested reschedule">Customer refused delivery / requested reschedule</option>
                    <option value="Freezer power outage / store freezer full">Freezer power outage / store freezer full</option>
                  </select>
                  <textarea 
                    value={backloadReasonInput}
                    onChange={(e) => setBackloadReasonInput(e.target.value)}
                    placeholder="Enter specific notes for this backload delivery..."
                    className="input-field resize-none h-16 text-xs bg-white"
                  ></textarea>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setStatusModalBooking(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleUpdateDeliveryStatus} className="btn-primary text-xs">Save Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Booking Modal with Categorized Product Filter */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Create Digital Booking & Inventory Order</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Route/Area Dropdown and Area-Filtered Store Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-red" /> Route / Area Dropdown <span className="text-brand-red">*</span>
                  </label>
                  <select 
                    value={formArea}
                    onChange={(e) => {
                      const newArea = e.target.value;
                      setFormArea(newArea);
                      setFormRoute(`${newArea} Route`);
                      setFormCustomer(''); // Reset customer selection to enforce filtered choice
                    }}
                    className="input-field text-xs bg-white cursor-pointer font-semibold"
                  >
                    {AREA_CHOICES.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-brand-red" /> Select Store (Filtered to {formArea.split(':')[1] || formArea}) <span className="text-brand-red">*</span>
                  </label>
                  <select 
                    value={formCustomer} 
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setFormCustomer(selectedName);
                    }} 
                    className="input-field text-xs bg-white cursor-pointer font-medium"
                  >
                    <option value="">-- Piliin ti Store ({availableStoresForArea.length} available) --</option>
                    {availableStoresForArea.map(c => (
                      <option key={c.id} value={c.store_name}>
                        {c.store_name} ({c.owner || 'Owner'} • {c.purok || c.area})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Booker</label>
                  <select 
                    value={formBooker} 
                    onChange={(e) => setFormBooker(e.target.value)} 
                    className="input-field text-xs bg-white cursor-pointer"
                  >
                    <option>Juan Dela Cruz</option>
                    <option>Pedro Booker</option>
                    <option>Maria Clara</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Tabs & Search */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Filter Products by Category ({filteredModalProducts.length} items)
                  </label>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="text" 
                      placeholder="Search flavour / flavor..." 
                      value={modalSearchTerm} 
                      onChange={(e) => setModalSearchTerm(e.target.value)} 
                      className="input-field text-xs py-1 px-2.5 w-full sm:w-48 bg-white"
                    />
                    {modalCategoryFilter !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [...formItems];
                          filteredModalProducts.forEach(prod => {
                            const idx = newItems.findIndex(i => i.productId === prod.id);
                            if (idx === -1) {
                              newItems.push({
                                productId: prod.id,
                                name: prod.name,
                                category: prod.category,
                                price: Number(prod.unit_price || prod.dealerPrice),
                                qty: 1
                              });
                            }
                          });
                          setFormItems(newItems);
                        }}
                        className="btn-secondary text-[11px] py-1 px-2.5 whitespace-nowrap bg-brand-light text-brand-red border-brand-red/30 hover:bg-brand-red hover:text-white"
                      >
                        + Select All {modalCategoryFilter}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  {categories.map((cat) => {
                    const count = cat === 'ALL' 
                      ? products.length 
                      : products.filter(p => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setModalCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          modalCategoryFilter === cat 
                            ? 'bg-brand-red text-white shadow-md' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Quick Selector Grid */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-56 overflow-y-auto">
                <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex justify-between items-center">
                  <span>Click Product to Add to Order:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Showing {filteredModalProducts.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {filteredModalProducts.map((prod) => {
                    const isSelected = formItems.some(i => i.productId === prod.id);
                    return (
                      <div 
                        key={prod.id} 
                        onClick={() => handleAddItem(prod)}
                        className={`bg-white p-2.5 rounded-lg border cursor-pointer transition-all shadow-2xs flex justify-between items-center group ${
                          isSelected ? 'border-brand-red/60 bg-red-50/30' : 'border-slate-200 hover:border-brand-red'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-brand-red uppercase">{prod.category}</span>
                          <div className="text-xs font-semibold text-slate-800 line-clamp-1">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">₱{Number(prod.unit_price || prod.dealerPrice).toFixed(2)}</div>
                        </div>
                        <span className={`p-1.5 rounded-md text-xs font-bold transition-colors ${
                          isSelected ? 'bg-brand-red text-white' : 'bg-slate-100 group-hover:bg-brand-red group-hover:text-white'
                        }`}>
                          {isSelected ? '✓' : '+'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Order Line Items */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Selected Order Line Items ({formItems.length})</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white max-h-48 overflow-y-auto">
                  {formItems.length > 0 ? (
                    formItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 hover:bg-slate-50">
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-800">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.category} • {formatPHP(item.price)} each</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty} 
                            onChange={(e) => handleQtyChange(index, e.target.value)}
                            className="input-field text-xs w-16 text-center py-1" 
                          />
                          <div className="text-xs font-bold text-slate-900 w-24 text-right">
                            {formatPHP(item.price * item.qty)}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItem(index)}
                            className="text-slate-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">No items selected yet. Click products above to add them.</div>
                  )}
                </div>

                <div className="flex justify-between items-center px-2 pt-2 border-t border-slate-200">
                  <span className="text-sm font-semibold text-slate-600">Estimated Order Total:</span>
                  <span className="text-xl font-bold text-brand-red">{formatPHP(calculatedTotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks / Delivery Notes</label>
                <textarea 
                  value={formRemarks} 
                  onChange={(e) => setFormRemarks(e.target.value)} 
                  className="input-field resize-none h-16 text-xs" 
                  placeholder="e.g. Call store owner first before delivery..."
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <button 
                onClick={() => handleSaveBooking('Draft')}
                className="btn-secondary text-xs"
              >
                Save as Draft
              </button>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
                <button onClick={() => handleSaveBooking('Booked')} className="btn-primary text-xs">Submit as Booked</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details / Printable Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Reference Details</span>
              <button onClick={() => setViewBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{viewBooking.customer}</h2>
                  <p className="text-xs text-slate-500">{viewBooking.area} • {viewBooking.route}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-red">{viewBooking.id}</p>
                  <p className="text-[11px] text-slate-400">{viewBooking.date}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(viewBooking.status)}`}>
                    {viewBooking.status}
                  </span>
                </div>
              </div>

              {viewBooking.status === 'Backload' && viewBooking.backloadReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                  <span className="font-bold block mb-1">Reason for Backload / Failed Delivery:</span>
                  {viewBooking.backloadReason}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Booked Items</p>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg p-3 bg-slate-50">
                  {viewBooking.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between text-xs">
                      <span className="text-slate-800">{item.qty}x {item.name} <span className="text-slate-400">({item.category})</span></span>
                      <span className="font-bold text-slate-700">{formatPHP(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between text-sm font-bold border-t border-slate-200">
                    <span>Estimated Total:</span>
                    <span className="text-brand-red">{formatPHP(viewBooking.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {viewBooking.remarks && (
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span className="font-bold text-amber-800">Remarks:</span> {viewBooking.remarks}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Booking
              </button>
              <button onClick={() => setViewBooking(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}