import React, { useState } from 'react';
import { 
  Truck, 
  Box, 
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
  Layers
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_CUSTOMERS } from '../utils/productCatalog';

// Available employees organized by their exact roles / positions
export const EMPLOYEES_BY_POSITION = {
  Drivers: [
    { id: 'EMP-001', name: 'Juan Driver', position: 'Driver', contact: '0917-123-4567' },
    { id: 'EMP-002', name: 'Pedro Driver', position: 'Driver', contact: '0918-234-5678' },
    { id: 'EMP-003', name: 'Ricardo Driver', position: 'Driver', contact: '0920-345-6789' }
  ],
  HelpersBackrides: [
    { id: 'EMP-004', name: 'Roberto Backride', position: 'Backride / Helper', contact: '0919-456-7890' },
    { id: 'EMP-005', name: 'Carlos Helper', position: 'Backride / Helper', contact: '0921-567-8901' },
    { id: 'EMP-006', name: 'Mateo Backride', position: 'Backride / Helper', contact: '0922-678-9012' }
  ],
  Loaders: [
    { id: 'EMP-007', name: 'Pedro Loader', position: 'Loader', contact: '0923-789-0123' },
    { id: 'EMP-008', name: 'Joel Loader', position: 'Loader', contact: '0924-890-1234' },
    { id: 'EMP-009', name: 'Allan Loader', position: 'Loader', contact: '0925-901-2345' }
  ],
  Checkers: [
    { id: 'EMP-010', name: 'Maria Checker', position: 'Checker', contact: '0926-012-3456' },
    { id: 'EMP-011', name: 'Grace Checker', position: 'Checker', contact: '0927-123-4567' }
  ],
  WarehouseStaff: [
    { id: 'EMP-012', name: 'Pedro Warehouse', position: 'Warehouse Staff', contact: '0928-234-5678' },
    { id: 'EMP-013', name: 'Rey Warehouse', position: 'Warehouse Staff', contact: '0929-345-6789' }
  ]
};

export default function Dispatch() {
  // Master list of all bookings that need to be in dispatch & packing
  const [activeBookings, setActiveBookings] = useState([
    {
      id: 'BK-2026-1001',
      customer: 'Aling Nena Sari-Sari Store',
      area: 'Valencia City: Batangan',
      route: 'Valencia City Route (Batangan)',
      totalAmount: 26215.60,
      dispatchStatus: 'Packed into Box #001',
      items: [
        { name: 'CLASSIC', category: 'MAGNUM', qty: 10, price: 1651.96 },
        { name: 'CHOCOLATE', category: 'CORNETTO', qty: 20, price: 484.80 }
      ]
    },
    {
      id: 'BK-2026-1002',
      customer: 'San Isidro Mini-Mart',
      area: 'Valencia City: San-Isidro',
      route: 'Valencia City Route (San-Isidro)',
      totalAmount: 15543.64,
      dispatchStatus: 'Packed into Box #002',
      items: [
        { name: 'COOKIES & CREAM', category: 'STICKS', qty: 15, price: 248.20 },
        { name: 'DOUBLE DUTCH', category: 'SUPREME 1.3L', qty: 8, price: 1477.58 }
      ]
    },
    {
      id: 'BK-2026-1003',
      customer: 'Cabanglasan Highland Corner',
      area: 'Cabanglasan Area',
      route: 'Cabanglasan Loop',
      totalAmount: 12120.00,
      dispatchStatus: 'Pending Packing',
      items: [
        { name: 'COOKIES & DREAM', category: 'CORNETTO', qty: 25, price: 484.80 }
      ]
    },
    {
      id: 'BK-2026-1004',
      customer: 'Kahaponan Grocery Hub',
      area: 'Valencia City: Kahaponan',
      route: 'Valencia City Route (Kahaponan)',
      totalAmount: 8259.80,
      dispatchStatus: 'Pending Packing',
      items: [
        { name: 'ALMOND', category: 'MAGNUM', qty: 5, price: 1651.96 }
      ]
    }
  ]);

  // Mock Active Dispatch Trips
  const [dispatchTrips, setDispatchTrips] = useState([
    {
      id: 'DISP-2026-101',
      route: 'Valencia -> San Fernando Route',
      vehicle: 'Bongo Truck #1 (KAB-902)',
      dispatchDate: '2026-10-09',
      driver: 'Juan Driver',
      backride: 'Roberto Backride',
      loader: 'Pedro Loader',
      checker: 'Maria Checker',
      status: 'In Transit',
      remarks: 'Packed 5 ice boxes with thermal tape seals.',
      linkedBookings: ['BK-2026-1001', 'BK-2026-1002'],
      boxes: [
        {
          boxNumber: 'BOX #001',
          bookingRef: 'BK-2026-1001',
          storeName: 'Aling Nena Sari-Sari Store',
          customerArea: 'Valencia City: Batangan',
          sealStatus: 'Taped & Sealed',
          items: [
            { name: 'CLASSIC (MAGNUM)', qty: 10 },
            { name: 'CHOCOLATE (CORNETTO)', qty: 20 }
          ]
        },
        {
          boxNumber: 'BOX #002',
          bookingRef: 'BK-2026-1002',
          storeName: 'San Isidro Mini-Mart',
          customerArea: 'Valencia City: San-Isidro',
          sealStatus: 'Taped & Sealed',
          items: [
            { name: 'COOKIES & CREAM (STICKS)', qty: 15 },
            { name: 'DOUBLE DUTCH (SUPREME 1.3L)', qty: 8 }
          ]
        }
      ]
    },
    {
      id: 'DISP-2026-100',
      route: 'Cabanglasan Area Route',
      vehicle: 'Bongo Truck #2 (LMN-410)',
      dispatchDate: '2026-10-08',
      driver: 'Pedro Driver',
      backride: 'Carlos Helper',
      loader: 'Joel Loader',
      checker: 'Grace Checker',
      status: 'Completed',
      remarks: 'All boxes delivered successfully.',
      linkedBookings: ['BK-2026-1003'],
      boxes: [
        {
          boxNumber: 'BOX #001',
          bookingRef: 'BK-2026-1003',
          storeName: 'Cabanglasan Highland Corner',
          customerArea: 'Cabanglasan Area',
          sealStatus: 'Delivered',
          items: [
            { name: 'COOKIES & DREAM (CORNETTO)', qty: 25 }
          ]
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('trips'); // 'trips' | 'allBookings'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedBoxForLabel, setSelectedBoxForLabel] = useState(null);

  // New Dispatch Form State with Position-Specific Employees
  const [formRoute, setFormRoute] = useState('Valencia -> San Fernando Route');
  const [formVehicle, setFormVehicle] = useState('Bongo Truck #1 (KAB-902)');
  const [formDriver, setFormDriver] = useState(EMPLOYEES_BY_POSITION.Drivers[0].name);
  const [formBackride, setFormBackride] = useState(EMPLOYEES_BY_POSITION.HelpersBackrides[0].name);
  const [formLoader, setFormLoader] = useState(EMPLOYEES_BY_POSITION.Loaders[0].name);
  const [formChecker, setFormChecker] = useState(EMPLOYEES_BY_POSITION.Checkers[0].name);
  const [formRemarks, setFormRemarks] = useState('');
  const [selectedBookingIds, setSelectedBookingIds] = useState(['BK-2026-1003', 'BK-2026-1004']);

  const handleToggleBookingSelection = (bId) => {
    if (selectedBookingIds.includes(bId)) {
      setSelectedBookingIds(selectedBookingIds.filter(id => id !== bId));
    } else {
      setSelectedBookingIds([...selectedBookingIds, bId]);
    }
  };

  const handleSaveDispatch = () => {
    if (!formDriver) {
      alert('Please assign a Driver for this Bongo trip.');
      return;
    }
    if (selectedBookingIds.length === 0) {
      alert('Please select at least one booking to include in this dispatch packing list.');
      return;
    }

    const packedBoxes = selectedBookingIds.map((bId, idx) => {
      const b = activeBookings.find(item => item.id === bId);
      return {
        boxNumber: `BOX #${String(idx + 1).padStart(3, '0')}`,
        bookingRef: bId,
        storeName: b ? b.customer : 'Store Customer',
        customerArea: b ? b.area : 'Valencia Route',
        sealStatus: 'Taped & Sealed',
        items: b ? b.items.map(i => ({ name: `${i.name} (${i.category})`, qty: i.qty })) : []
      };
    });

    const newTrip = {
      id: `DISP-2026-${100 + dispatchTrips.length + 1}`,
      route: formRoute,
      vehicle: formVehicle,
      dispatchDate: new Date().toISOString().split('T')[0],
      driver: formDriver,
      backride: formBackride,
      loader: formLoader,
      checker: formChecker,
      status: 'Dispatched',
      remarks: formRemarks || 'Loaded into Bongo thermal ice boxes.',
      linkedBookings: selectedBookingIds,
      boxes: packedBoxes
    };

    setDispatchTrips([newTrip, ...dispatchTrips]);

    // Update active bookings status
    const updatedBookings = activeBookings.map(b => {
      if (selectedBookingIds.includes(b.id)) {
        return { ...b, dispatchStatus: `Packed in ${newTrip.id}` };
      }
      return b;
    });
    setActiveBookings(updatedBookings);

    setIsModalOpen(false);
    setFormRemarks('');
  };

  const filteredTrips = dispatchTrips.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = activeBookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispatch & Ice Box Packing</h1>
          <p className="text-sm text-slate-500">Bongo vehicle scheduling, position-based employee assignment & store booking packing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Schedule Bongo Dispatch
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Bongo Dispatches</p>
            <h3 className="text-lg font-bold text-slate-900">{dispatchTrips.filter(t => t.status !== 'Completed').length} Trips</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings in System</p>
            <h3 className="text-lg font-bold text-brand-red">{activeBookings.length} Store Bookings</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Ice Boxes Packed</p>
            <h3 className="text-lg font-bold text-emerald-800">
              {dispatchTrips.reduce((acc, t) => acc + t.boxes.length, 0)} Sealed Boxes
            </h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-purple-500 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery Crew Positions</p>
            <h3 className="text-lg font-bold text-slate-900">4 Distinct Roles</h3>
            <span className="text-[10px] text-slate-400">Driver, Backride, Loader, Checker</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('trips')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'trips' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" /> Bongo Dispatch Trips ({dispatchTrips.length})
        </button>
        <button 
          onClick={() => setActiveTab('allBookings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'allBookings' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> All Bookings for Packing ({activeBookings.length})
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'trips' ? "Search dispatch ID, route, vehicle, or driver..." : "Search booking ID, store name, area..."} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
        </div>

        {/* Tab 1: Dispatch Trips Table */}
        {activeTab === 'trips' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dispatch Ref / Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Route & Destination</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Crew by Position</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Packed Ice Boxes</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{trip.id}</div>
                        <div className="text-[11px] text-slate-400">{trip.dispatchDate}</div>
                        <div className="text-[11px] font-bold text-brand-red">{trip.vehicle}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-red" /> {trip.route}
                        </div>
                        <div className="text-xs text-slate-500">
                          {trip.linkedBookings?.length || trip.boxes.length} store bookings included
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs space-y-0.5">
                        <div><strong className="text-slate-500">Driver:</strong> <span className="font-bold text-slate-800">{trip.driver}</span></div>
                        <div><strong className="text-slate-500">Backride:</strong> <span className="text-slate-700">{trip.backride || 'Assigned'}</span></div>
                        <div><strong className="text-slate-500">Loader:</strong> <span className="text-slate-700">{trip.loader || 'Pedro Loader'}</span></div>
                        <div><strong className="text-slate-500">Checker:</strong> <span className="text-slate-700">{trip.checker || 'Maria Checker'}</span></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-brand-red flex items-center gap-1">
                          <Box className="w-4 h-4" /> {trip.boxes.length} Ice Boxes
                        </div>
                        <div className="text-[10px] text-slate-400">Taped & Sealed</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setSelectedTrip(trip)}
                          className="btn-primary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Packing List
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <Truck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No dispatch trips found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: All Bookings for Packing Table */}
        {activeTab === 'allBookings' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Booking Ref</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer Store & Area</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Route</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Booked SKUs</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Value</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dispatch / Packing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-xs">{b.id}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900">{b.customer}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-red" /> {b.area}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">{b.route}</td>
                      <td className="py-3 px-4 text-xs">
                        <span className="font-bold text-slate-800">{b.items.reduce((sum, i) => sum + i.qty, 0)} units</span>
                        <span className="text-slate-400"> ({b.items.length} SKUs)</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">{formatPHP(b.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          b.dispatchStatus.includes('Packed') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.dispatchStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <ClipboardList className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Dispatch Modal with Position-based Employee Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Schedule Bongo Delivery & Assign Crew by Position</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Target Route & Areas <span className="text-brand-red">*</span></label>
                  <select 
                    value={formRoute}
                    onChange={(e) => setFormRoute(e.target.value)}
                    className="input-field cursor-pointer text-xs font-medium"
                  >
                    <option>Valencia → San Fernando Route</option>
                    <option>Cabanglasan Area Route</option>
                    <option>Valencia City (Batangan & San Isidro)</option>
                    <option>Valencia City (Kahaponan & Lumbayao)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Bongo Vehicle</label>
                  <select 
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="input-field cursor-pointer text-xs font-medium"
                  >
                    <option>Bongo Truck #1 (KAB-902)</option>
                    <option>Bongo Truck #2 (LMN-410)</option>
                    <option>Bongo Truck #3 (VAL-382)</option>
                  </select>
                </div>
              </div>

              {/* Position-Based Employee Selection */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Delivery Personnel (Selected by Positions)
                  </span>
                  <span className="text-[10px] text-slate-400">Strictly mapped to employee roles</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Position 1: Driver */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <label className="block text-[11px] font-bold text-blue-800 uppercase mb-1">
                      1. Driver Position <span className="text-brand-red">*</span>
                    </label>
                    <select 
                      value={formDriver} 
                      onChange={(e) => setFormDriver(e.target.value)}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      {EMPLOYEES_BY_POSITION.Drivers.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.position})</option>
                      ))}
                    </select>
                  </div>

                  {/* Position 2: Backride / Helper */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <label className="block text-[11px] font-bold text-emerald-800 uppercase mb-1">
                      2. Backride / Helper Position <span className="text-brand-red">*</span>
                    </label>
                    <select 
                      value={formBackride} 
                      onChange={(e) => setFormBackride(e.target.value)}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      {EMPLOYEES_BY_POSITION.HelpersBackrides.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.position})</option>
                      ))}
                    </select>
                  </div>

                  {/* Position 3: Loader */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <label className="block text-[11px] font-bold text-amber-800 uppercase mb-1">
                      3. Loader Position
                    </label>
                    <select 
                      value={formLoader} 
                      onChange={(e) => setFormLoader(e.target.value)}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      {EMPLOYEES_BY_POSITION.Loaders.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.position})</option>
                      ))}
                    </select>
                  </div>

                  {/* Position 4: Checker */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <label className="block text-[11px] font-bold text-purple-800 uppercase mb-1">
                      4. Warehouse Checker
                    </label>
                    <select 
                      value={formChecker} 
                      onChange={(e) => setFormChecker(e.target.value)}
                      className="input-field text-xs bg-white cursor-pointer"
                    >
                      {EMPLOYEES_BY_POSITION.Checkers.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name} ({emp.position})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bookings Included in this Dispatch Trip */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Store Bookings to Pack into Ice Boxes ({selectedBookingIds.length} Selected)
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeBookings.map(b => (
                    <label key={b.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 cursor-pointer text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedBookingIds.includes(b.id)}
                          onChange={() => handleToggleBookingSelection(b.id)}
                          className="rounded text-brand-red focus:ring-brand-red" 
                        />
                        <div>
                          <span className="font-bold text-slate-800">{b.customer}</span>
                          <span className="text-slate-400 ml-1 font-mono text-[11px]">({b.id})</span>
                          <div className="text-[10px] text-slate-500">{b.area}</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800">{formatPHP(b.totalAmount)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dispatch Instructions & Tape Sealing Notes</label>
                <textarea 
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="Notes for driver & loader regarding packing priority..."
                  className="input-field resize-none h-14 text-xs"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveDispatch} className="btn-primary text-xs">
                Schedule Bongo & Create Ice Box Packing List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Dispatch & Ice Box Packing List Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Dispatch & Packing List Report</h2>
              </div>
              <button onClick={() => setSelectedTrip(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl font-extrabold uppercase text-slate-900">LLANO SELECTA DEALER DISPATCH LIST</h1>
                  <p className="text-xs text-slate-500">{selectedTrip.route} • Date: {selectedTrip.dispatchDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-red">{selectedTrip.id}</span>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{selectedTrip.vehicle}</p>
                </div>
              </div>

              {/* Crew Assignment Header by Position */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div><span className="text-slate-500 font-semibold">Driver:</span> <strong className="text-slate-800">{selectedTrip.driver}</strong></div>
                <div><span className="text-slate-500 font-semibold">Backride/Helper:</span> <strong className="text-slate-800">{selectedTrip.backride}</strong></div>
                <div><span className="text-slate-500 font-semibold">Loader:</span> <strong className="text-slate-800">{selectedTrip.loader}</strong></div>
                <div><span className="text-slate-500 font-semibold">Checker:</span> <strong className="text-slate-800">{selectedTrip.checker}</strong></div>
              </div>

              {/* Individual Ice Box Packages */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Store Ice Box Breakdown</h3>
                
                {selectedTrip.boxes.map((box, idx) => (
                  <div key={idx} className="border-2 border-slate-900 rounded-lg p-4 bg-white space-y-3 relative">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-white font-extrabold px-2.5 py-1 text-xs rounded">
                          {box.boxNumber}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{box.storeName}</p>
                          <p className="text-[10px] text-slate-500">{box.customerArea}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        ✓ {box.sealStatus}
                      </span>
                    </div>

                    <div className="text-xs divide-y divide-slate-100">
                      {box.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="py-1 flex justify-between">
                          <span className="text-slate-800 font-medium">{item.name}</span>
                          <span className="font-bold text-slate-900">{item.qty} units</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Checker Sign: ___________________</span>
                      <button 
                        onClick={() => setSelectedBoxForLabel(box)}
                        className="no-print text-brand-red font-bold text-xs hover:underline flex items-center gap-1"
                      >
                        <Tag className="w-3.5 h-3.5" /> Print Box Sticker Label
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Full Dispatch List
              </button>
              <button onClick={() => setSelectedTrip(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Box Sticker Label Modal */}
      {selectedBoxForLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border-4 border-slate-900">
            <div className="flex items-center justify-between p-3 bg-slate-900 text-white no-print">
              <span className="text-xs font-bold">ICE BOX STICKER LABEL</span>
              <button onClick={() => setSelectedBoxForLabel(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 font-sans text-slate-900">
              <div className="text-center border-b-2 border-slate-900 pb-2">
                <h1 className="text-2xl font-black tracking-tight">{selectedBoxForLabel.boxNumber}</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">LLANO SELECTA DEALER ICE BOX</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">DESTINATION STORE:</p>
                <p className="text-lg font-black text-slate-900 leading-tight">{selectedBoxForLabel.storeName}</p>
                <p className="text-xs font-bold text-slate-600">{selectedBoxForLabel.customerArea}</p>
              </div>

              <div className="border-t border-b border-slate-300 py-2 space-y-1 text-xs font-semibold">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">BOX CONTENTS:</p>
                {selectedBoxForLabel.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.name}</span>
                    <span className="font-extrabold">{i.qty}x</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <Barcode className="w-48 h-10 mx-auto text-slate-800" />
                <p className="text-[9px] font-mono text-slate-500 mt-1">SEALED & TAPED BEFORE DISPATCH</p>
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between no-print">
              <button onClick={() => window.print()} className="btn-primary text-xs w-full flex items-center justify-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Box Sticker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}