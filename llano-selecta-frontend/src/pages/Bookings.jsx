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
  Store
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Bookings() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [bookings, setBookings] = useState([
    {
      id: 'BK-2026-1001',
      customer: 'Aling Nena Sari-Sari',
      owner: 'Nena Dela Cruz',
      area: 'Valencia City',
      route: 'Valencia -> San Fernando (Mon/Fri)',
      booker: 'Juan Dela Cruz',
      date: '2026-10-09',
      status: 'Submitted',
      remarks: 'Deliver before 2 PM. Call before arrival.',
      items: [
        { id: 'MAG-001', productId: 'MAG-001', name: 'CLASSIC', category: 'MAGNUM', qty: 10, price: 1651.96 },
        { id: 'COR-001', productId: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', qty: 20, price: 484.80 }
      ],
      totalAmount: 26215.60
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  // New Booking Form State
  const [formCustomer, setFormCustomer] = useState('');
  const [formArea, setFormArea] = useState('Valencia City');
  const [formRoute, setFormRoute] = useState('Valencia → San Fernando');
  const [formBooker, setFormBooker] = useState('Juan Dela Cruz');
  const [formRemarks, setFormRemarks] = useState('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState('ALL');
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [formItems, setFormItems] = useState([]);

  // Categories based on the Llano SELECTA inventory sheet
  const categories = ['ALL', ...SELECTA_CATEGORIES];

  // Fetch products and customers from backend API on mount, with catalog fallback
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
      .catch(() => {
        // Fallback already populated from INITIAL_PRODUCTS
      });

    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
        }
      })
      .catch(() => {
        // Fallback already populated from INITIAL_CUSTOMERS
      });
  }, []);

  // Filtered products inside the modal category tabs + search
  const filteredModalProducts = products.filter(p => {
    const matchesCat = modalCategoryFilter === 'ALL' || p.category === modalCategoryFilter;
    const matchesSearch = !modalSearchTerm || 
      p.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(modalSearchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Dynamic price calculation
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
        { productId: prod.id, name: prod.name, category: prod.category, price: Number(prod.unit_price), qty: 1 }
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

  const handleSaveBooking = (status = 'Booked') => {
    if (!formCustomer.trim()) {
      alert('Pangngaasi nga piliin wenno ikabil ti store name!');
      return;
    }
    if (formItems.length === 0) {
      alert('Pangngaasi nga agikabil ti uray maysa a produkto iti order!');
      return;
    }

    const newBooking = {
      id: `BK-2026-${1000 + bookings.length + 1}`,
      customer: formCustomer,
      owner: 'Store Owner',
      area: formArea,
      route: formRoute,
      booker: formBooker,
      date: new Date().toISOString().split('T')[0],
      status: status,
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Booked': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Submitted': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Converted to SELECTA Order': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.booker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Store Bookings</h1>
          <p className="text-sm text-slate-500">Field order capturing & categorized product selection</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Booking
        </button>
      </div>

      {/* Schedule Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-red text-white rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Route Schedule</span>
            <p className="text-sm font-bold text-white">VALENCIA CITY → SAN FERNANDO ROUTE</p>
          </div>
        </div>
        <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
          Catalog Loaded: <span className="text-emerald-400 font-medium">{products.length} Products Available</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search booking ID, store name, or booker..." 
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
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Booked">Booked</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
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
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase text-right">Action</th>
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
                        <MapPin className="w-3 h-3 text-brand-red" /> {b.area}
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
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setViewBooking(b)}
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
                    <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              {/* Store and Booker Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-brand-red" /> Select Store / Customer <span className="text-brand-red">*</span>
                  </label>
                  <select 
                    value={formCustomer} 
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setFormCustomer(selectedName);
                      const matched = customers.find(c => c.store_name === selectedName);
                      if (matched) {
                        if (matched.area) setFormArea(matched.area);
                        if (matched.route) setFormRoute(matched.route);
                      }
                    }} 
                    className="input-field text-xs bg-white"
                  >
                    <option value="">-- Piliin ti Store --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.store_name}>
                        {c.store_name} ({c.area})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Booker</label>
                  <select 
                    value={formBooker} 
                    onChange={(e) => setFormBooker(e.target.value)} 
                    className="input-field text-xs bg-white"
                  >
                    <option>Juan Dela Cruz</option>
                    <option>Pedro Penduko</option>
                    <option>Maria Clara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Route / Area</label>
                  <input 
                    type="text" 
                    value={formArea} 
                    onChange={(e) => setFormArea(e.target.value)} 
                    className="input-field text-xs bg-white" 
                  />
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
                          // Batch add all filtered items that are not yet added
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
                <button onClick={() => handleSaveBooking('Booked')} className="btn-primary text-xs">Submit Booking</button>
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
              <span className="text-xs font-bold text-slate-500">BOOKING REFERENCE DETAILS</span>
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
                </div>
              </div>

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