import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Store, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Navigation,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  Package
} from 'lucide-react';

export default function Routes() {
  // All Employees list available for route assignment (Requirement 6)
  const allEmployees = [
    { id: 'EMP-001', name: 'Juan Dela Cruz', role: 'Driver' },
    { id: 'EMP-002', name: 'Pedro Penduko', role: 'Booker' },
    { id: 'EMP-003', name: 'Maria Clara', role: 'Cashier / Coordinator' },
    { id: 'EMP-004', name: 'Pedro Warehouse', role: 'Warehouse Staff / Loader' },
    { id: 'EMP-005', name: 'Roberto Santos', role: 'Backride / Helper' }
  ];

  // Operational Routes in Bukidnon with Delivery & Backload Tracking (Requirement 6)
  const [routes, setRoutes] = useState([
    {
      id: 'RTE-001',
      routeName: 'Valencia -> San Fernando Route',
      scheduleDays: ['Monday', 'Friday'],
      coverageAreas: 'Valencia City Proper, Batangan, Kahaponan, Mailag, Halapitan, San Fernando',
      activeStoresCount: 28,
      assignedDriver: 'Juan Dela Cruz',
      assignedHelper: 'Roberto Santos',
      assignedBooker: 'Pedro Penduko',
      deliveryStatus: 'In Transit', // 'Delivered' | 'In Transit' | 'Scheduled'
      boxesLoaded: 45,
      boxesDelivered: 35,
      backloadBoxes: 2,
      backloadStore: 'Lumbayao Valley Refreshments',
      backloadReason: 'Store closed during delivery arrival (2 boxes backloaded)',
      status: 'Active'
    },
    {
      id: 'RTE-002',
      routeName: 'Cabanglasan Area Route',
      scheduleDays: ['Tuesday', 'Thursday'],
      coverageAreas: 'Cabanglasan Centro, Mandaing, Paradise, Capihan, Anlogan',
      activeStoresCount: 18,
      assignedDriver: 'Juan Dela Cruz',
      assignedHelper: 'Pedro Warehouse',
      assignedBooker: 'Pedro Penduko',
      deliveryStatus: 'Delivered',
      boxesLoaded: 30,
      boxesDelivered: 30,
      backloadBoxes: 0,
      backloadStore: null,
      backloadReason: null,
      status: 'Active'
    },
    {
      id: 'RTE-003',
      routeName: 'Batangan & San Isidro Route',
      scheduleDays: ['Wednesday'],
      coverageAreas: 'Batangan, San Isidro, Ventar, Sinabuagan, Lumbayao',
      activeStoresCount: 15,
      assignedDriver: 'Roberto Santos',
      assignedHelper: 'Pedro Warehouse',
      assignedBooker: 'Maria Clara',
      deliveryStatus: 'Scheduled',
      boxesLoaded: 25,
      boxesDelivered: 0,
      backloadBoxes: 0,
      backloadStore: null,
      backloadReason: null,
      status: 'Active'
    },
    {
      id: 'RTE-004',
      routeName: 'Maramag / South Hub Route',
      scheduleDays: ['Saturday'],
      coverageAreas: 'Maramag, Don Carlos, Musuan',
      activeStoresCount: 12,
      assignedDriver: 'Juan Dela Cruz',
      assignedHelper: 'Roberto Santos',
      assignedBooker: 'Pedro Penduko',
      deliveryStatus: 'Delivered',
      boxesLoaded: 20,
      boxesDelivered: 20,
      backloadBoxes: 0,
      backloadStore: null,
      backloadReason: null,
      status: 'Inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [statusUpdateRoute, setStatusUpdateRoute] = useState(null);

  // Form State for Adding / Editing Route
  const [routeName, setRouteName] = useState('');
  const [scheduleDays, setScheduleDays] = useState(['Monday']);
  const [coverageAreas, setCoverageAreas] = useState('');
  const [assignedDriver, setAssignedDriver] = useState(allEmployees[0].name);
  const [assignedHelper, setAssignedHelper] = useState(allEmployees[4].name);
  const [assignedBooker, setAssignedBooker] = useState(allEmployees[1].name);

  // Quick Status & Backload Update State
  const [updateDeliveryStatus, setUpdateDeliveryStatus] = useState('Delivered');
  const [updateBackloadBoxes, setUpdateBackloadBoxes] = useState('0');
  const [updateBackloadStore, setUpdateBackloadStore] = useState('');
  const [updateBackloadReason, setUpdateBackloadReason] = useState('');

  const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const openAddModal = () => {
    setEditingRoute(null);
    setRouteName('');
    setScheduleDays(['Monday']);
    setCoverageAreas('');
    setAssignedDriver(allEmployees[0].name);
    setAssignedHelper(allEmployees[4].name);
    setAssignedBooker(allEmployees[1].name);
    setIsModalOpen(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setRouteName(route.routeName);
    setScheduleDays(route.scheduleDays);
    setCoverageAreas(route.coverageAreas);
    setAssignedDriver(route.assignedDriver);
    setAssignedHelper(route.assignedHelper || allEmployees[4].name);
    setAssignedBooker(route.assignedBooker);
    setIsModalOpen(true);
  };

  const openStatusModal = (route) => {
    setStatusUpdateRoute(route);
    setUpdateDeliveryStatus(route.deliveryStatus);
    setUpdateBackloadBoxes(route.backloadBoxes.toString());
    setUpdateBackloadStore(route.backloadStore || '');
    setUpdateBackloadReason(route.backloadReason || '');
  };

  const handleSaveStatusUpdate = (e) => {
    e.preventDefault();
    if (!statusUpdateRoute) return;

    const bBoxes = parseInt(updateBackloadBoxes) || 0;

    setRoutes(routes.map(r => {
      if (r.id === statusUpdateRoute.id) {
        return {
          ...r,
          deliveryStatus: updateDeliveryStatus,
          backloadBoxes: bBoxes,
          backloadStore: bBoxes > 0 ? updateBackloadStore : null,
          backloadReason: bBoxes > 0 ? updateBackloadReason : null,
          boxesDelivered: updateDeliveryStatus === 'Delivered' ? (r.boxesLoaded - bBoxes) : r.boxesDelivered
        };
      }
      return r;
    }));

    setStatusUpdateRoute(null);
  };

  const toggleDay = (day) => {
    if (scheduleDays.includes(day)) {
      if (scheduleDays.length === 1) return;
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const handleSaveRoute = () => {
    if (!routeName.trim()) {
      alert('Please enter a Route Name');
      return;
    }

    if (editingRoute) {
      setRoutes(routes.map(r => {
        if (r.id === editingRoute.id) {
          return {
            ...r,
            routeName,
            scheduleDays,
            coverageAreas,
            assignedDriver,
            assignedHelper,
            assignedBooker
          };
        }
        return r;
      }));
    } else {
      const newRoute = {
        id: `RTE-00${routes.length + 1}`,
        routeName,
        scheduleDays,
        coverageAreas,
        activeStoresCount: 10,
        assignedDriver,
        assignedHelper,
        assignedBooker,
        deliveryStatus: 'Scheduled',
        boxesLoaded: 20,
        boxesDelivered: 0,
        backloadBoxes: 0,
        backloadStore: null,
        backloadReason: null,
        status: 'Active'
      };
      setRoutes([...routes, newRoute]);
    }

    setIsModalOpen(false);
  };

  const filteredRoutes = routes.filter(r => {
    const matchesSearch = 
      r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.coverageAreas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.assignedBooker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.deliveryStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery Routes Master</h1>
          <p className="text-sm text-slate-500">Territory delivery logistics, full staff assignment, delivery completion & backload tracking</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" /> Create New Route
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search route name, town/coverage area, driver, or booker..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-60">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer text-xs"
            >
              <option value="All">All Delivery Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Routes Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoutes.map((route) => (
            <div key={route.id} className="border border-slate-200 rounded-xl p-5 hover:border-brand-red transition-all bg-white space-y-4 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-brand-red bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {route.id}
                    </span>
                    <h2 className="text-base font-bold text-slate-800">{route.routeName}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {route.coverageAreas}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEditModal(route)}
                    className="p-1.5 text-slate-400 hover:text-brand-red rounded transition-colors" 
                    title="Edit Route"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delivery Fulfillment & Backload Status Banner (Requirement 6) */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">Delivery Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      route.deliveryStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : route.deliveryStatus === 'In Transit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {route.deliveryStatus}
                    </span>
                  </div>

                  <button
                    onClick={() => openStatusModal(route)}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    Update Delivery / Backload
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Loaded: <strong>{route.boxesLoaded} boxes</strong></span>
                  <span>Delivered: <strong className="text-emerald-700">{route.boxesDelivered} boxes</strong></span>
                  <span>
                    Backload: <strong className={route.backloadBoxes > 0 ? 'text-brand-red' : 'text-slate-500'}>
                      {route.backloadBoxes} boxes
                    </strong>
                  </span>
                </div>

                {route.backloadBoxes > 0 && (
                  <div className="text-[11px] text-brand-red bg-red-50 p-2 rounded border border-red-100 flex items-start gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <strong>Backload Store:</strong> {route.backloadStore}
                      <div className="text-slate-600">{route.backloadReason}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Days */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Schedule</span>
                <div className="flex flex-wrap gap-1">
                  {route.scheduleDays.map((day, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Staff Assignments (Requirement 6: All employees selectable) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Assigned Driver</span>
                  <strong className="text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <Truck className="w-3 h-3 text-slate-400 shrink-0" /> {route.assignedDriver}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Helper / Backride</span>
                  <strong className="text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <UserCheck className="w-3 h-3 text-slate-400 shrink-0" /> {route.assignedHelper || 'Unassigned'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Assigned Booker</span>
                  <strong className="text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <Users className="w-3 h-3 text-slate-400 shrink-0" /> {route.assignedBooker}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add / Edit Route */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-bold text-slate-800">
                  {editingRoute ? 'Edit Route & Personnel' : 'Create Delivery Route'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Route Name <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Valencia -> San Fernando Route" 
                  className="input-field text-xs" 
                />
              </div>

              {/* Weekly Schedule Picker */}
              <div>
                <label className="block font-semibold text-slate-600 mb-1.5">Dispatch Schedule Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableDays.map(day => {
                    const isSelected = scheduleDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-brand-red text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Coverage Areas & Barangays</label>
                <textarea 
                  value={coverageAreas}
                  onChange={(e) => setCoverageAreas(e.target.value)}
                  placeholder="e.g. Batangan, Kahaponan, Ventar, San Fernando..."
                  className="input-field resize-none h-16 text-xs"
                />
              </div>

              {/* Requirement 6: All employees selectable */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Assigned Driver</label>
                  <select 
                    value={assignedDriver}
                    onChange={(e) => setAssignedDriver(e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Helper / Backride</label>
                  <select 
                    value={assignedHelper}
                    onChange={(e) => setAssignedHelper(e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Assigned Booker</label>
                  <select 
                    value={assignedBooker}
                    onChange={(e) => setAssignedBooker(e.target.value)}
                    className="input-field cursor-pointer text-xs"
                  >
                    {allEmployees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveRoute} className="btn-primary text-xs">Save Route</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Delivery Status & Record Backload (Requirement 6) */}
      {statusUpdateRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-bold text-slate-800">Update Route Delivery Status</h2>
              </div>
              <button onClick={() => setStatusUpdateRoute(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">{statusUpdateRoute.routeName}</span>
                <div className="text-[11px] text-slate-500">Total Loaded Boxes: {statusUpdateRoute.boxesLoaded}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fulfillment Status</label>
                <select
                  value={updateDeliveryStatus}
                  onChange={(e) => setUpdateDeliveryStatus(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Delivered">Delivered (Completed)</option>
                  <option value="In Transit">In Transit (Active on Road)</option>
                  <option value="Scheduled">Scheduled (Not yet dispatched)</option>
                </select>
              </div>

              {/* Backload Tracking */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <RotateCcw className="w-3.5 h-3.5 text-brand-red" /> Backload Boxes Check
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Number of Backload Boxes</label>
                  <input 
                    type="number"
                    min="0"
                    value={updateBackloadBoxes}
                    onChange={(e) => setUpdateBackloadBoxes(e.target.value)}
                    className="input-field text-xs"
                    placeholder="0 if none"
                  />
                </div>

                {parseInt(updateBackloadBoxes) > 0 && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Store / Customer with Backload</label>
                      <input 
                        type="text"
                        required
                        value={updateBackloadStore}
                        onChange={(e) => setUpdateBackloadStore(e.target.value)}
                        placeholder="e.g. Lumbayao Refreshments"
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Reason for Failed Delivery / Backload</label>
                      <textarea
                        required
                        value={updateBackloadReason}
                        onChange={(e) => setUpdateBackloadReason(e.target.value)}
                        placeholder="e.g. Store was closed upon delivery; owner unreachable..."
                        className="input-field resize-none h-16 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setStatusUpdateRoute(null)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Delivery Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}