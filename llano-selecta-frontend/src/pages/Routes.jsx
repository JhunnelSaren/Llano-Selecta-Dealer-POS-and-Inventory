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
  Navigation
} from 'lucide-react';

export default function Routes() {
  // Mock Active Operational Routes in Bukidnon
  const [routes, setRoutes] = useState([
    {
      id: 'RTE-001',
      routeName: 'Valencia -> San Fernando Route',
      scheduleDays: ['Monday', 'Friday'],
      coverageAreas: 'Valencia City Proper, Mailag, Halapitan, San Fernando',
      activeStoresCount: 28,
      assignedDriver: 'Juan Driver',
      assignedBooker: 'Juan Dela Cruz',
      status: 'Active'
    },
    {
      id: 'RTE-002',
      routeName: 'Cabanglasan Area Route',
      scheduleDays: ['Tuesday', 'Thursday'],
      coverageAreas: 'Cabanglasan Town, Paradise, Capihan, Anlogan',
      activeStoresCount: 18,
      assignedDriver: 'Pedro Driver',
      assignedBooker: 'Pedro Penduko',
      status: 'Active'
    },
    {
      id: 'RTE-003',
      routeName: 'Batangan & San Isidro Route',
      scheduleDays: ['Wednesday'],
      coverageAreas: 'Batangan, San Isidro, Lumabayo, Dagatkidavao',
      activeStoresCount: 15,
      assignedDriver: 'Juan Driver',
      assignedBooker: 'Maria Clara',
      status: 'Active'
    },
    {
      id: 'RTE-004',
      routeName: 'Maramag / South Hub Route',
      scheduleDays: ['Saturday'],
      coverageAreas: 'Maramag, Don Carlos, Musuan',
      activeStoresCount: 12,
      assignedDriver: 'Pedro Driver',
      assignedBooker: 'Juan Dela Cruz',
      status: 'Inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  // Form State
  const [routeName, setRouteName] = useState('');
  const [scheduleDays, setScheduleDays] = useState(['Monday']);
  const [coverageAreas, setCoverageAreas] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('Juan Driver');
  const [assignedBooker, setAssignedBooker] = useState('Juan Dela Cruz');

  const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const openAddModal = () => {
    setEditingRoute(null);
    setRouteName('');
    setScheduleDays(['Monday']);
    setCoverageAreas('');
    setAssignedDriver('Juan Driver');
    setAssignedBooker('Juan Dela Cruz');
    setIsModalOpen(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setRouteName(route.routeName);
    setScheduleDays(route.scheduleDays);
    setCoverageAreas(route.coverageAreas);
    setAssignedDriver(route.assignedDriver);
    setAssignedBooker(route.assignedBooker);
    setIsModalOpen(true);
  };

  const toggleDay = (day) => {
    if (scheduleDays.includes(day)) {
      if (scheduleDays.length === 1) return; // Maintain at least one day
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const handleSaveRoute = () => {
    if (!routeName.trim()) {
      alert('Please enter a route name.');
      return;
    }

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? {
        ...r,
        routeName,
        scheduleDays,
        coverageAreas,
        assignedDriver,
        assignedBooker
      } : r));
    } else {
      const newRoute = {
        id: `RTE-00${routes.length + 1}`,
        routeName,
        scheduleDays,
        coverageAreas: coverageAreas || 'Valencia Area',
        activeStoresCount: 0,
        assignedDriver,
        assignedBooker,
        status: 'Active'
      };
      setRoutes([...routes, newRoute]);
    }

    setIsModalOpen(false);
  };

  const filteredRoutes = routes.filter(r => 
    r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.coverageAreas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStoresServiced = routes.reduce((acc, r) => acc + r.activeStoresCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery Routes & Area Schedules</h1>
          <p className="text-sm text-slate-500">Manage geographic route coverage, weekly booking days & driver assignments</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Delivery Route
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Routes</p>
            <h3 className="text-lg font-bold text-slate-900">{routes.filter(r => r.status === 'Active').length} Operational Routes</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Serviced Client Stores</p>
            <h3 className="text-lg font-bold text-slate-900">{totalStoresServiced} Assigned Stores</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Schedule</p>
            <h3 className="text-lg font-bold text-slate-900">Mon – Sat Dispatch</h3>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by route name, town/coverage area, or route ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        {/* Routes Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Route ID & Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Weekly Schedule</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Coverage Towns / Areas</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Crew</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Active Stores</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{r.routeName}</div>
                      <div className="text-xs text-slate-400 font-mono">{r.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {r.scheduleDays.map((day, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {day.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-xs">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                        <span className="truncate">{r.coverageAreas}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div><strong className="text-slate-700">Driver:</strong> {r.assignedDriver}</div>
                      <div><strong className="text-slate-700">Booker:</strong> {r.assignedBooker}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">
                      {r.activeStoresCount} <span className="text-xs font-normal text-slate-500">stores</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => openEditModal(r)}
                        className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-light rounded transition-colors"
                        title="Edit Route"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <Navigation className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No delivery routes found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">
                  {editingRoute ? 'Edit Route & Schedule' : 'Create New Delivery Route'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Route Name <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Valencia -> San Fernando Route" 
                  className="input-field" 
                />
              </div>

              {/* Weekly Schedule Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dispatch Schedule Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableDays.map(day => {
                    const isSelected = scheduleDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-brand-red text-white shadow-sm' 
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Towns & Areas Covered</label>
                <textarea 
                  value={coverageAreas}
                  onChange={(e) => setCoverageAreas(e.target.value)}
                  placeholder="e.g. Valencia City, Mailag, San Fernando..."
                  className="input-field resize-none h-16"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Default Driver</label>
                  <select 
                    value={assignedDriver}
                    onChange={(e) => setAssignedDriver(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Juan Driver</option>
                    <option>Pedro Driver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Default Booker</label>
                  <select 
                    value={assignedBooker}
                    onChange={(e) => setAssignedBooker(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Juan Dela Cruz</option>
                    <option>Pedro Penduko</option>
                    <option>Maria Clara</option>
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
    </div>
  );
}