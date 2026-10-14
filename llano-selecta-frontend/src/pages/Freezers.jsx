import React, { useState } from 'react';
import { 
  Snowflake, 
  Camera, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  X, 
  Eye, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Store, 
  FileText, 
  CheckSquare, 
  Image as ImageIcon,
  User,
  Barcode,
  HelpCircle
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Freezers() {
  // Active Month for Timemark monitoring
  const currentMonth = 'October 2026';

  // Mock Freezers catalog & assignments
  const [freezers, setFreezers] = useState([
    {
      id: 'FRZ-001',
      selectaNumber: 'SEL-FRZ-8821',
      barcode: 'FRZ4800019201',
      model: 'Chest Freezer 300L',
      condition: 'Good',
      status: 'Assigned',
      assignedStore: 'Aling Nena Sari-Sari',
      storeOwner: 'Nena Dela Cruz',
      area: 'Valencia City',
      assignmentDate: '2026-01-15',
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-01-15',
        receiptRef: 'OR-FRZ-001'
      },
      lastScan: {
        month: 'October 2026',
        scanDate: '2026-10-05',
        staff: 'Juan Booker',
        timemarkRef: 'TM-908124',
        status: 'Completed',
        photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400'
      }
    },
    {
      id: 'FRZ-002',
      selectaNumber: 'SEL-FRZ-8822',
      barcode: 'FRZ4800019202',
      model: 'Glass Top Display 400L',
      condition: 'Good',
      status: 'Assigned',
      assignedStore: 'San Isidro Mini-Mart',
      storeOwner: 'Juan Santos',
      area: 'San Isidro',
      assignmentDate: '2026-03-20',
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-03-20',
        receiptRef: 'OR-FRZ-002'
      },
      lastScan: {
        month: 'October 2026',
        scanDate: null,
        staff: null,
        timemarkRef: null,
        status: 'Pending',
        photoProof: null
      }
    },
    {
      id: 'FRZ-003',
      selectaNumber: 'SEL-FRZ-8823',
      barcode: 'FRZ4800019203',
      model: 'Chest Freezer 300L',
      condition: 'Minor Scratch',
      status: 'Assigned',
      assignedStore: 'Cabanglasan Express',
      storeOwner: 'Maria Gomez',
      area: 'Cabanglasan',
      assignmentDate: '2026-05-10',
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-05-10',
        receiptRef: 'OR-FRZ-003'
      },
      lastScan: {
        month: 'September 2026',
        scanDate: null,
        staff: null,
        timemarkRef: null,
        status: 'Missed',
        photoProof: null
      }
    },
    {
      id: 'FRZ-004',
      selectaNumber: 'SEL-FRZ-8824',
      barcode: 'FRZ4800019204',
      model: 'Chest Freezer 200L',
      condition: 'Good',
      status: 'In Bodega',
      assignedStore: 'Unassigned (Llano Bodega)',
      storeOwner: 'N/A',
      area: 'Valencia Hub',
      assignmentDate: null,
      payment: null,
      lastScan: {
        month: 'October 2026',
        scanDate: '2026-10-01',
        staff: 'Pedro Warehouse',
        timemarkRef: 'TM-900112',
        status: 'Completed',
        photoProof: null
      }
    }
  ]);

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'timemark'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [scanModalFreezer, setScanModalFreezer] = useState(null);
  const [viewDetailsFreezer, setViewDetailsFreezer] = useState(null);

  // New Freezer Assignment Form
  const [formSelectaNum, setFormSelectaNum] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formStore, setFormStore] = useState('');
  const [formArea, setFormArea] = useState('Valencia City');
  const [formCondition, setFormCondition] = useState('Good');

  // Scan Entry Form
  const [scanStaff, setScanStaff] = useState('Juan Booker');
  const [scanRef, setScanRef] = useState('');
  const [scanPhotoUrl, setScanPhotoUrl] = useState('');

  // Handle Assign Freezer Submission
  const handleSaveAssignment = () => {
    if (!formSelectaNum.trim() || !formStore.trim()) {
      alert('Please fill in the SELECTA Freezer number and store name.');
      return;
    }

    const newFreezer = {
      id: `FRZ-00${freezers.length + 1}`,
      selectaNumber: formSelectaNum.toUpperCase(),
      barcode: formBarcode || `FRZ480001920${freezers.length + 1}`,
      model: 'Chest Freezer 300L',
      condition: formCondition,
      status: 'Assigned',
      assignedStore: formStore,
      storeOwner: 'Store Client',
      area: formArea,
      assignmentDate: new Date().toISOString().split('T')[0],
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: new Date().toISOString().split('T')[0],
        receiptRef: `OR-FRZ-00${freezers.length + 1}`
      },
      lastScan: {
        month: currentMonth,
        scanDate: null,
        staff: null,
        timemarkRef: null,
        status: 'Pending',
        photoProof: null
      }
    };

    setFreezers([newFreezer, ...freezers]);
    setIsAssignModalOpen(false);
    setFormSelectaNum('');
    setFormBarcode('');
    setFormStore('');
  };

  // Handle Logging Timemark Scan
  const handleSaveScan = () => {
    if (!scanModalFreezer) return;

    const updatedFreezers = freezers.map(f => {
      if (f.id === scanModalFreezer.id) {
        return {
          ...f,
          lastScan: {
            month: currentMonth,
            scanDate: new Date().toISOString().split('T')[0],
            staff: scanStaff,
            timemarkRef: scanRef || `TM-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Completed',
            photoProof: scanPhotoUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400'
          }
        };
      }
      return f;
    });

    setFreezers(updatedFreezers);
    setScanModalFreezer(null);
    setScanRef('');
    setScanPhotoUrl('');
  };

  // Stats
  const totalFreezers = freezers.length;
  const totalAssigned = freezers.filter(f => f.status === 'Assigned').length;
  const completedScans = freezers.filter(f => f.status === 'Assigned' && f.lastScan.status === 'Completed').length;
  const pendingScans = freezers.filter(f => f.status === 'Assigned' && (f.lastScan.status === 'Pending' || f.lastScan.status === 'Missed')).length;

  const filteredFreezers = freezers.filter(f => {
    const matchesSearch = f.selectaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.assignedStore.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'timemark') {
      if (filterStatus === 'Pending') return matchesSearch && (f.lastScan.status === 'Pending' || f.lastScan.status === 'Missed');
      if (filterStatus === 'Completed') return matchesSearch && f.lastScan.status === 'Completed';
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Freezer Management & Timemark Monitoring</h1>
          <p className="text-sm text-slate-500">SELECTA freezer assets, ₱10,000 deposits & monthly barcode scan proof tracking</p>
        </div>
        <button 
          onClick={() => setIsAssignModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Assign SELECTA Freezer
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Snowflake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Dealer Assets</p>
            <h3 className="text-lg font-bold text-slate-900">{totalFreezers} Units</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned to Stores</p>
            <h3 className="text-lg font-bold text-slate-900">{totalAssigned} Stores</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scanned in {currentMonth}</p>
            <h3 className="text-lg font-bold text-emerald-700">{completedScans} Done</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing Timemark Scans</p>
            <h3 className="text-lg font-bold text-brand-red">{pendingScans} Pending</h3>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'catalog' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Snowflake className="w-4 h-4" /> Freezers Catalog & Deposits
        </button>
        <button 
          onClick={() => setActiveTab('timemark')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'timemark' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" /> Timemark Monthly Verification ({pendingScans} Action Needed)
        </button>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search SELECTA freezer #, barcode, or store name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          {activeTab === 'timemark' && (
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer sm:w-48"
            >
              <option value="All">All Timemark Statuses</option>
              <option value="Pending">Pending / Missed Only</option>
              <option value="Completed">Completed Only</option>
            </select>
          )}
        </div>

        {/* Tab 1: Catalog Table */}
        {activeTab === 'catalog' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">SELECTA Freezer #</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Store</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Deposit Breakdown</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Condition</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFreezers.length > 0 ? (
                  filteredFreezers.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900">{f.selectaNumber}</div>
                        <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Barcode className="w-3 h-3" /> {f.barcode}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{f.assignedStore}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-red" /> {f.area}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {f.payment ? (
                          <div>
                            <div className="text-sm font-bold text-emerald-700">{formatPHP(f.payment.totalPaid)}</div>
                            <div className="text-[10px] text-slate-500">
                              ₱9k Products + ₱1k Fee
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No deposit (In Bodega)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-700">{f.condition}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          f.status === 'Assigned' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setViewDetailsFreezer(f)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <Snowflake className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No freezers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Timemark Verification Table */}
        {activeTab === 'timemark' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store & Freezer #</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Scan Month</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timemark Ref / Staff</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Photo Proof</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timemark Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFreezers.filter(f => f.status === 'Assigned').length > 0 ? (
                  filteredFreezers.filter(f => f.status === 'Assigned').map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{f.assignedStore}</div>
                        <div className="text-xs text-brand-red font-mono">{f.selectaNumber} ({f.barcode})</div>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                        {currentMonth}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {f.lastScan.timemarkRef ? (
                          <div>
                            <div className="font-mono text-xs font-bold text-slate-800">{f.lastScan.timemarkRef}</div>
                            <div className="text-[11px] text-slate-400">By {f.lastScan.staff} on {f.lastScan.scanDate}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not scanned yet</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {f.lastScan.photoProof ? (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline cursor-pointer font-medium" onClick={() => setViewDetailsFreezer(f)}>
                            <ImageIcon className="w-3.5 h-3.5" /> Photo Attached
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No Photo</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          f.lastScan.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          f.lastScan.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {f.lastScan.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {f.lastScan.status === 'Completed' ? 'Scan Completed' : 'Pending Scan'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setScanModalFreezer(f)}
                          className="btn-primary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5" /> Log Scan
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <Camera className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No assigned freezers found for Timemark scanning.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Freezer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Assign SELECTA Freezer to Store</h2>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SELECTA Freezer # <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formSelectaNum}
                    onChange={(e) => setFormSelectaNum(e.target.value)}
                    placeholder="SEL-FRZ-XXXX" 
                    className="input-field uppercase font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Barcode</label>
                  <input 
                    type="text" 
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="FRZ48000XXXX" 
                    className="input-field font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Store <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formStore}
                    onChange={(e) => setFormStore(e.target.value)}
                    placeholder="e.g. Aling Nena Sari-Sari" 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Area / Route</label>
                  <select 
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Valencia City</option>
                    <option>San Fernando</option>
                    <option>Cabanglasan</option>
                    <option>Batangan</option>
                    <option>San Isidro</option>
                  </select>
                </div>
              </div>

              {/* Deposit Payment Breakdown Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Standard SELECTA Freezer Payment (₱10,000 Total)</span>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Product Allocation:</span>
                    <span className="font-bold">{formatPHP(9000)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Dealer Processing Fee:</span>
                    <span className="font-bold">{formatPHP(1000)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-800 pt-1 border-t border-emerald-200">
                    <span>Total Deposit Collected:</span>
                    <span>{formatPHP(10000)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Freezer Condition</label>
                <select 
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option>Brand New / Perfect</option>
                  <option>Good Working Condition</option>
                  <option>Minor Exterior Scratch</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsAssignModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveAssignment} className="btn-primary text-xs">Assign & Record ₱10k Deposit</button>
            </div>
          </div>
        </div>
      )}

      {/* Log Timemark Scan Modal */}
      {scanModalFreezer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Record Timemark Scan</h2>
              </div>
              <button onClick={() => setScanModalFreezer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900 text-sm">{scanModalFreezer.assignedStore}</div>
                <div className="text-brand-red font-mono">{scanModalFreezer.selectaNumber} ({scanModalFreezer.barcode})</div>
                <div className="text-slate-500">Monitoring Month: <strong>{currentMonth}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Timemark App Reference #</label>
                <input 
                  type="text" 
                  value={scanRef}
                  onChange={(e) => setScanRef(e.target.value)}
                  placeholder="e.g. TM-908124" 
                  className="input-field font-mono" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Staff Who Performed Scan</label>
                <select 
                  value={scanStaff}
                  onChange={(e) => setScanStaff(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option>Juan Booker</option>
                  <option>Pedro Driver</option>
                  <option>Maria Inspector</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Photo / Proof Image URL (Mockup Upload)</label>
                <input 
                  type="text" 
                  value={scanPhotoUrl}
                  onChange={(e) => setScanPhotoUrl(e.target.value)}
                  placeholder="Paste Timemark photo URL or click confirm..." 
                  className="input-field text-xs" 
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setScanModalFreezer(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveScan} className="btn-primary text-xs">Confirm & Complete Scan</button>
            </div>
          </div>
        </div>
      )}

      {/* Details & Photo Proof Viewer Modal */}
      {viewDetailsFreezer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-500">SELECTA FREEZER RECORD DETAILS</span>
              <button onClick={() => setViewDetailsFreezer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{viewDetailsFreezer.selectaNumber}</h2>
                  <p className="font-mono text-slate-500">{viewDetailsFreezer.barcode}</p>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full">
                  {viewDetailsFreezer.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-slate-700 uppercase">Assigned Location</p>
                <p className="text-sm font-semibold text-slate-800">{viewDetailsFreezer.assignedStore}</p>
                <p className="text-slate-500">{viewDetailsFreezer.area} • Date Assigned: {viewDetailsFreezer.assignmentDate || 'N/A'}</p>
              </div>

              {viewDetailsFreezer.payment && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-700 uppercase mb-1">₱10,000 Deposit Breakdown</p>
                  <div className="flex justify-between"><span>Product Allocation:</span><span className="font-bold">{formatPHP(9000)}</span></div>
                  <div className="flex justify-between"><span>Processing Fee:</span><span className="font-bold">{formatPHP(1000)}</span></div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200"><span>Total Deposit Paid:</span><span>{formatPHP(10000)}</span></div>
                </div>
              )}

              {/* Timemark Photo Proof */}
              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase">Timemark Monthly Photo Proof</p>
                {viewDetailsFreezer.lastScan.photoProof ? (
                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={viewDetailsFreezer.lastScan.photoProof} 
                      alt="Timemark Proof" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-slate-50 text-[10px] text-slate-500 flex justify-between">
                      <span>Ref: {viewDetailsFreezer.lastScan.timemarkRef}</span>
                      <span>{viewDetailsFreezer.lastScan.scanDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center text-slate-400">
                    No photo proof uploaded for {currentMonth}.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button onClick={() => setViewDetailsFreezer(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}