import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  ArrowRightLeft,
  RotateCcw,
  Upload,
  Edit,
  Trash2
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_CUSTOMERS } from '../utils/productCatalog';

export default function Freezers() {
  const currentMonth = 'October 2026';

  const INITIAL_FREEZERS = [
    {
      id: 'FRZ-001',
      serialNumber: 'SEL-FRZ-8821',
      barcode: 'FRZ4800019201',
      model: 'Chest Freezer 300L',
      condition: 'Good',
      status: 'Deployed', // 'Deployed' | 'Pull Out' | 'In Warehouse'
      assignedStore: 'Aling Nena Sari-Sari',
      storeOwner: 'Nena Dela Cruz',
      pastOwner: null,
      area: 'Valencia City (Batangan)',
      assignmentDate: '2026-01-15',
      transferHistory: [],
      pullOutNotes: '',
      pullOutDate: null,
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-01-15',
        receiptRef: 'OR-FRZ-001'
      },
      lastScan: {
        month: 'October 2026',
        scanDateTime: '2026-10-05T14:30',
        staff: 'Juan Booker',
        status: 'Completed',
        photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400'
      }
    },
    {
      id: 'FRZ-002',
      serialNumber: 'SEL-FRZ-8822',
      barcode: 'FRZ4800019202',
      model: 'Glass Top Display 400L',
      condition: 'Good',
      status: 'Deployed',
      assignedStore: 'San Isidro Mini-Mart',
      storeOwner: 'Juan Santos',
      pastOwner: 'Carlos Dalisay (Ventar)',
      area: 'San Isidro',
      assignmentDate: '2026-03-20',
      transferHistory: [
        {
          date: '2026-03-20',
          fromStore: 'Dalisay Mart',
          fromOwner: 'Carlos Dalisay',
          toStore: 'San Isidro Mini-Mart',
          toOwner: 'Juan Santos',
          reason: 'Owner migrated; freezer transferred to new dealer partner'
        }
      ],
      pullOutNotes: '',
      pullOutDate: null,
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-03-20',
        receiptRef: 'OR-FRZ-002'
      },
      lastScan: {
        month: 'October 2026',
        scanDateTime: null,
        staff: null,
        status: 'Pending',
        photoProof: null
      }
    },
    {
      id: 'FRZ-003',
      serialNumber: 'SEL-FRZ-8823',
      barcode: 'FRZ4800019203',
      model: 'Chest Freezer 300L',
      condition: 'Minor Scratch',
      status: 'Pull Out',
      assignedStore: 'Llano Main Warehouse',
      storeOwner: 'Llano Bodega Central',
      pastOwner: 'Maria Gomez (Cabanglasan Express)',
      area: 'Valencia Warehouse Hub',
      assignmentDate: '2026-05-10',
      transferHistory: [],
      pullOutNotes: 'Store permanently closed. Freezer pulled out and returned to Llano Bodega for maintenance.',
      pullOutDate: '2026-09-28',
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-05-10',
        receiptRef: 'OR-FRZ-003'
      },
      lastScan: {
        month: 'September 2026',
        scanDateTime: null,
        staff: null,
        status: 'Missed',
        photoProof: null
      }
    },
    {
      id: 'FRZ-004',
      serialNumber: 'SEL-FRZ-8824',
      barcode: 'FRZ4800019204',
      model: 'Chest Freezer 200L',
      condition: 'Good',
      status: 'In Warehouse',
      assignedStore: 'Unassigned (Llano Warehouse)',
      storeOwner: 'N/A',
      pastOwner: null,
      area: 'Valencia Warehouse',
      assignmentDate: null,
      transferHistory: [],
      pullOutNotes: '',
      pullOutDate: null,
      payment: null,
      lastScan: {
        month: 'October 2026',
        scanDateTime: '2026-10-01T09:00',
        staff: 'Pedro Warehouse',
        status: 'Completed',
        photoProof: null
      }
    },
    {
      id: 'FRZ-005',
      serialNumber: 'SEL-FRZ-9011',
      barcode: 'FRZ4800019205',
      model: 'Glass Top Display 300L',
      condition: 'Good',
      status: 'Deployed',
      assignedStore: 'Cabanglasan Highland Corner',
      storeOwner: 'Ramon Santos',
      pastOwner: null,
      area: 'Cabanglasan',
      assignmentDate: '2026-02-28',
      transferHistory: [],
      pullOutNotes: '',
      pullOutDate: null,
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-02-28',
        receiptRef: 'OR-FRZ-005'
      },
      lastScan: {
        month: 'October 2026',
        scanDateTime: '2026-10-06T11:00',
        staff: 'Juan Booker',
        status: 'Completed',
        photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=400'
      }
    },
    {
      id: 'FRZ-006',
      serialNumber: 'SEL-FRZ-9104',
      barcode: 'FRZ4800019206',
      model: 'Chest Freezer 400L',
      condition: 'Good',
      status: 'Deployed',
      assignedStore: 'Halapitan Trading Post',
      storeOwner: 'Danilo Reyes',
      pastOwner: null,
      area: 'San Fernando',
      assignmentDate: '2026-04-01',
      transferHistory: [],
      pullOutNotes: '',
      pullOutDate: null,
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: '2026-04-01',
        receiptRef: 'OR-FRZ-006'
      },
      lastScan: {
        month: 'October 2026',
        scanDateTime: null,
        staff: null,
        status: 'Pending',
        photoProof: null
      }
    }
  ];

  // Freezers catalog & assignments
  const [freezers, setFreezers] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_freezers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FREEZERS;
  });

  // Fetch freezers from PostgreSQL database on mount
  useEffect(() => {
    const fetchFreezers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/freezers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(f => ({
              id: f.id,
              serialNumber: f.serial_number || f.serialNumber,
              barcode: f.barcode_no || f.barcode,
              model: f.model || 'Chest Freezer 300L',
              condition: f.condition || 'Good',
              status: f.status || 'Deployed',
              assignedStore: f.assigned_store || f.assignedStore || 'Unassigned',
              storeOwner: f.assigned_owner || f.storeOwner || 'Store Client',
              pastOwner: f.pastOwner || null,
              area: f.area || 'Valencia',
              assignmentDate: f.custody_agreement_date ? f.custody_agreement_date.split('T')[0] : f.assignmentDate,
              transferHistory: Array.isArray(f.transferHistory) ? f.transferHistory : [],
              pullOutNotes: f.pullOutNotes || '',
              pullOutDate: f.pullOutDate || null,
              payment: f.payment || {
                productAllocation: 9000.00,
                processingFee: 1000.00,
                totalPaid: Number(f.deployment_fee || 10000.00),
                paymentDate: f.custody_agreement_date ? f.custody_agreement_date.split('T')[0] : '2026-01-15',
                receiptRef: `OR-${f.id}`
              },
              lastScan: f.lastScan || {
                month: currentMonth,
                scanDateTime: f.timemark_verified ? '2026-10-05T14:30' : null,
                staff: 'Juan Booker',
                status: f.timemark_verified ? 'Completed' : 'Pending',
                photoProof: null
              }
            }));
            setFreezers(mapped);
            localStorage.setItem('llano_selecta_freezers', JSON.stringify(mapped));
          }
        }
      } catch (err) {}
    };

    fetchFreezers();
  }, []);

  // Save freezers state
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_freezers', JSON.stringify(freezers));
    } catch (e) {}
  }, [freezers]);

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'timemark'
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchSerial, setSearchSerial] = useState('');
  const [searchStore, setSearchStore] = useState('');
  const [filterArea, setFilterArea] = useState('All'); // 'All' | 'Valencia' | 'Cabanglasan' | 'San Fernando'
  const [filterCustody, setFilterCustody] = useState('All'); // 'All' | 'Deployed' | 'Pull Out' | 'In Warehouse'
  const [filterScanStatus, setFilterScanStatus] = useState('All'); // 'All' | 'Pending' | 'Completed'

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [scanModalFreezer, setScanModalFreezer] = useState(null);
  const [viewDetailsFreezer, setViewDetailsFreezer] = useState(null);
  const [transferModalFreezer, setTransferModalFreezer] = useState(null);
  const [pullOutModalFreezer, setPullOutModalFreezer] = useState(null);

  // New Freezer Assignment Form
  const [formSerialNum, setFormSerialNum] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formStore, setFormStore] = useState('');
  const [formOwner, setFormOwner] = useState('');
  const [formArea, setFormArea] = useState('Valencia City (Batangan)');
  const [formCondition, setFormCondition] = useState('Good');

  // Transfer of Owner Form
  const [transferNewStore, setTransferNewStore] = useState('');
  const [transferNewOwner, setTransferNewOwner] = useState('');
  const [transferNewArea, setTransferNewArea] = useState('Valencia City (Batangan)');
  const [transferReason, setTransferReason] = useState('');

  // Pull Out Modal Form
  const [pullOutReason, setPullOutReason] = useState('Store closed / Low volume sales');
  const [pullOutNotes, setPullOutNotes] = useState('');

  // Timemark Scan Form
  const [scanStaff, setScanStaff] = useState('Juan Booker');
  const [scanDateTime, setScanDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [scanPhotoUrl, setScanPhotoUrl] = useState('');

  // Handle Photo Upload from Device
  const handleScanPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScanPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Assign Freezer Submission with PostgreSQL sync
  const handleSaveAssignment = async () => {
    if (!formSerialNum.trim() || !formStore.trim()) {
      alert('Please fill in the Freezer Serial # and store name.');
      return;
    }

    const newFreezer = {
      id: `FRZ-00${freezers.length + 1}`,
      serialNumber: formSerialNum.toUpperCase(),
      barcode: formBarcode || `FRZ480001920${freezers.length + 1}`,
      model: 'Chest Freezer 300L',
      condition: formCondition,
      status: 'Deployed',
      assignedStore: formStore,
      storeOwner: formOwner || 'Store Client',
      pastOwner: null,
      area: formArea,
      assignmentDate: new Date().toISOString().split('T')[0],
      transferHistory: [],
      pullOutNotes: '',
      pullOutDate: null,
      payment: {
        productAllocation: 9000.00,
        processingFee: 1000.00,
        totalPaid: 10000.00,
        paymentDate: new Date().toISOString().split('T')[0],
        receiptRef: `OR-FRZ-00${freezers.length + 1}`
      },
      lastScan: {
        month: currentMonth,
        scanDateTime: null,
        staff: null,
        status: 'Pending',
        photoProof: null
      }
    };

    try {
      await fetch('http://localhost:5000/api/freezers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newFreezer.id,
          serial_number: newFreezer.serialNumber,
          barcode_no: newFreezer.barcode,
          model: newFreezer.model,
          assigned_store: newFreezer.assignedStore,
          assigned_owner: newFreezer.storeOwner,
          status: newFreezer.status,
          custody_agreement_date: newFreezer.assignmentDate,
          deployment_fee: 10000.00
        })
      });
    } catch (err) {}

    const updated = [newFreezer, ...freezers];
    setFreezers(updated);
    localStorage.setItem('llano_selecta_freezers', JSON.stringify(updated));
    setIsAssignModalOpen(false);
    setFormSerialNum('');
    setFormBarcode('');
    setFormStore('');
    setFormOwner('');
  };

  // Handle Transfer of Owner with PostgreSQL sync
  const handleConfirmTransfer = async () => {
    if (!transferModalFreezer || !transferNewStore.trim()) {
      alert('Please enter the new store name.');
      return;
    }

    const updated = freezers.map(f => {
      if (f.id === transferModalFreezer.id) {
        const transferRecord = {
          date: new Date().toISOString().split('T')[0],
          fromStore: f.assignedStore,
          fromOwner: f.storeOwner,
          toStore: transferNewStore,
          toOwner: transferNewOwner || 'New Owner',
          reason: transferReason || 'Freezer reassignment to new store client'
        };

        return {
          ...f,
          assignedStore: transferNewStore,
          storeOwner: transferNewOwner || 'New Owner',
          pastOwner: `${f.storeOwner} (${f.assignedStore})`,
          area: transferNewArea,
          status: 'Deployed',
          assignmentDate: new Date().toISOString().split('T')[0],
          transferHistory: [transferRecord, ...(f.transferHistory || [])]
        };
      }
      return f;
    });

    try {
      await fetch(`http://localhost:5000/api/freezers/${transferModalFreezer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assigned_store: transferNewStore,
          assigned_owner: transferNewOwner || 'New Owner',
          status: 'Deployed'
        })
      });
    } catch (err) {}

    setFreezers(updated);
    localStorage.setItem('llano_selecta_freezers', JSON.stringify(updated));
    setTransferModalFreezer(null);
    setTransferNewStore('');
    setTransferNewOwner('');
    setTransferReason('');
  };

  // Handle Pull Out Freezer with PostgreSQL sync
  const handleConfirmPullOut = async () => {
    if (!pullOutModalFreezer) return;

    const updated = freezers.map(f => {
      if (f.id === pullOutModalFreezer.id) {
        return {
          ...f,
          status: 'Pull Out',
          pastOwner: `${f.storeOwner} (${f.assignedStore})`,
          assignedStore: 'Llano Main Warehouse',
          storeOwner: 'Llano Bodega Central',
          pullOutDate: new Date().toISOString().split('T')[0],
          pullOutNotes: `${pullOutReason}. ${pullOutNotes}`.trim()
        };
      }
      return f;
    });

    try {
      await fetch(`http://localhost:5000/api/freezers/${pullOutModalFreezer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Pull Out',
          assigned_store: 'Llano Main Warehouse',
          assigned_owner: 'Llano Bodega Central'
        })
      });
    } catch (err) {}

    setFreezers(updated);
    localStorage.setItem('llano_selecta_freezers', JSON.stringify(updated));
    setPullOutModalFreezer(null);
    setPullOutNotes('');
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
            scanDateTime: scanDateTime,
            staff: scanStaff,
            status: 'Completed',
            photoProof: scanPhotoUrl || f.lastScan?.photoProof
          }
        };
      }
      return f;
    });

    setFreezers(updatedFreezers);
    setScanModalFreezer(null);
    setScanPhotoUrl('');
  };

  // Stats
  const totalFreezers = freezers.length;
  const deployedCount = freezers.filter(f => f.status === 'Deployed').length;
  const pullOutCount = freezers.filter(f => f.status === 'Pull Out').length;
  const warehouseCount = freezers.filter(f => f.status === 'In Warehouse').length;
  const completedScans = freezers.filter(f => f.status === 'Deployed' && f.lastScan?.status === 'Completed').length;
  const pendingScans = freezers.filter(f => f.status === 'Deployed' && (f.lastScan?.status === 'Pending' || f.lastScan?.status === 'Missed')).length;

  const getFreezerAreaKey = (f) => {
    const norm = `${f.area || ''} ${f.assignedStore || ''}`.toLowerCase();
    if (norm.includes('caban') || norm.includes('cabal')) return 'Cabanglasan';
    if (norm.includes('fernando') || norm.includes('sanfernando') || norm.includes('halapitan')) return 'San Fernando';
    return 'Valencia';
  };

  const valenciaFreezersCount = freezers.filter(f => getFreezerAreaKey(f) === 'Valencia').length;
  const cabanglasanFreezersCount = freezers.filter(f => getFreezerAreaKey(f) === 'Cabanglasan').length;
  const sanFernandoFreezersCount = freezers.filter(f => getFreezerAreaKey(f) === 'San Fernando').length;

  const filteredFreezers = freezers.filter(f => {
    const matchesBarcode = !searchBarcode.trim() || (f.barcode && f.barcode.toLowerCase().includes(searchBarcode.toLowerCase().trim()));
    const matchesSerial = !searchSerial.trim() || (f.serialNumber && f.serialNumber.toLowerCase().includes(searchSerial.toLowerCase().trim()));
    const matchesStore = !searchStore.trim() || 
      (f.assignedStore && f.assignedStore.toLowerCase().includes(searchStore.toLowerCase().trim())) ||
      (f.storeOwner && f.storeOwner.toLowerCase().includes(searchStore.toLowerCase().trim())) ||
      (f.pastOwner && f.pastOwner.toLowerCase().includes(searchStore.toLowerCase().trim()));

    if (!matchesBarcode || !matchesSerial || !matchesStore) return false;

    if (filterArea !== 'All' && getFreezerAreaKey(f) !== filterArea) return false;

    if (filterCustody !== 'All' && f.status !== filterCustody) return false;

    if (activeTab === 'timemark') {
      if (filterScanStatus === 'Pending') return (f.lastScan?.status === 'Pending' || f.lastScan?.status === 'Missed');
      if (filterScanStatus === 'Completed') return f.lastScan?.status === 'Completed';
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Freezer Asset Management & Custody Tracking</h1>
          <p className="text-sm text-slate-500">Freezer Serial # tracking, owner transfers, Deployed/Pull Out custody & scan verifications</p>
        </div>
        <button 
          onClick={() => setIsAssignModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register & Assign Freezer
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
            <span className="text-[11px] text-slate-400">{warehouseCount} In Warehouse</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deployed to Stores</p>
            <h3 className="text-lg font-bold text-emerald-700">{deployedCount} Active Stores</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Currently earning</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pulled Out (Warehouse)</p>
            <h3 className="text-lg font-bold text-amber-700">{pullOutCount} Units Pulled Out</h3>
            <span className="text-[11px] text-amber-600">Taken back to Llano Bodega</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <Snowflake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deployed Assets</p>
            <h3 className="text-lg font-bold text-slate-900">{deployedCount} Deployed Units</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Active in Partner Stores</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Area Filtering Tabs / Pills */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-brand-red" /> Filter Area:
            </span>
            <button
              type="button"
              onClick={() => setFilterArea('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterArea === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Municipalities ({totalFreezers})
            </button>
            <button
              type="button"
              onClick={() => setFilterArea('Valencia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterArea === 'Valencia'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              Valencia ({valenciaFreezersCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterArea('Cabanglasan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterArea === 'Cabanglasan'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              Cabanglasan ({cabanglasanFreezersCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterArea('San Fernando')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterArea === 'San Fernando'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              San Fernando ({sanFernandoFreezersCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={filterCustody} 
              onChange={(e) => setFilterCustody(e.target.value)}
              className="input-field cursor-pointer py-1.5 text-xs font-semibold bg-white"
            >
              <option value="All">All Custody Statuses</option>
              <option value="Deployed">Deployed (Active Store)</option>
              <option value="Pull Out">Pull Out (Back to Warehouse)</option>
              <option value="In Warehouse">In Warehouse (Unassigned)</option>
            </select>
          </div>
        </div>

        {/* Separated Search Inputs: Barcode, Serial, and Store Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Barcode Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Search by Barcode
            </label>
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. FRZ4800019201" 
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                className="input-field pl-9 text-xs"
              />
              {searchBarcode && (
                <button 
                  onClick={() => setSearchBarcode('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Serial Number Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Search by Serial #
            </label>
            <div className="relative">
              <Snowflake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. SEL-FRZ-8821" 
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                className="input-field pl-9 text-xs uppercase"
              />
              {searchSerial && (
                <button 
                  onClick={() => setSearchSerial('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Store Name Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Search by Store Name / Owner
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="e.g. Aling Nena, San Isidro, etc." 
                value={searchStore}
                onChange={(e) => setSearchStore(e.target.value)}
                className="input-field pl-9 text-xs"
              />
              {searchStore && (
                <button 
                  onClick={() => setSearchStore('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(searchBarcode || searchSerial || searchStore || filterArea !== 'All' || filterCustody !== 'All') && (
          <div className="flex items-center justify-between text-xs bg-red-50/50 p-2 rounded-lg border border-red-100">
            <span className="text-slate-600 font-medium">
              Filters active: Showing <strong>{filteredFreezers.length}</strong> of {totalFreezers} freezers
            </span>
            <button
              onClick={() => {
                setSearchBarcode('');
                setSearchSerial('');
                setSearchStore('');
                setFilterArea('All');
                setFilterCustody('All');
              }}
              className="text-brand-red font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset / Clear All Filters
            </button>
          </div>
        )}

        {/* Catalog Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Freezer Serial #</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Store & Owner</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Custody Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Past Owner / History</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Deposit Paid</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredFreezers.length > 0 ? (
                  filteredFreezers.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900">{f.serialNumber}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                          <Barcode className="w-3.5 h-3.5 text-slate-400" /> {f.barcode}
                        </div>
                        <div className="text-[11px] text-slate-400">{f.model} • {f.condition}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{f.assignedStore}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> Owner: <span className="font-semibold">{f.storeOwner}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            getFreezerAreaKey(f) === 'Cabanglasan' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            getFreezerAreaKey(f) === 'San Fernando' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {getFreezerAreaKey(f)}
                          </span>
                          <span className="text-[11px] text-slate-400">{f.area}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          f.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          f.status === 'Pull Out' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {f.status === 'Deployed' && '● Deployed to Store'}
                          {f.status === 'Pull Out' && '↺ Pulled Out to Warehouse'}
                          {f.status === 'In Warehouse' && '■ In Warehouse'}
                        </span>
                        {f.pullOutDate && (
                          <div className="text-[10px] text-amber-700 mt-1 font-medium">
                            Pulled: {f.pullOutDate}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {f.pastOwner ? (
                          <div>
                            <span className="font-semibold text-slate-700 block">Past Owner:</span>
                            <span className="text-slate-500">{f.pastOwner}</span>
                            {f.transferHistory && f.transferHistory.length > 0 && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded text-[10px]">
                                {f.transferHistory.length} transfer recorded
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Original Owner / First Deployment</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {f.payment ? (
                          <div>
                            <div className="text-sm font-bold text-emerald-700">{formatPHP(f.payment.totalPaid)}</div>
                            <div className="text-[10px] text-slate-500">₱9k Product + ₱1k Fee</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No deposit (Warehouse)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => {
                              setTransferModalFreezer(f);
                              setTransferNewStore('');
                              setTransferNewOwner('');
                              setTransferNewArea(f.area);
                            }}
                            title="Transfer Ownership"
                            className="btn-secondary text-xs py-1 px-2 inline-flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <ArrowRightLeft className="w-3 h-3 text-blue-600" /> Transfer
                          </button>
                          {f.status === 'Deployed' && (
                            <button 
                              onClick={() => setPullOutModalFreezer(f)}
                              title="Pull Out Freezer to Warehouse"
                              className="btn-secondary text-xs py-1 px-2 inline-flex items-center gap-1 hover:bg-amber-50 hover:text-amber-800"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-600" /> Pull Out
                            </button>
                          )}
                          <button 
                            onClick={() => setViewDetailsFreezer(f)}
                            className="btn-secondary text-xs py-1 px-2 inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      <Snowflake className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No freezers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Register / Assign Freezer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Register & Assign Freezer to Store</h2>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Freezer Serial # <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formSerialNum}
                    onChange={(e) => setFormSerialNum(e.target.value)}
                    placeholder="SEL-FRZ-XXXX" 
                    className="input-field uppercase font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Barcode No.</label>
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Owner Name</label>
                  <input 
                    type="text" 
                    value={formOwner}
                    onChange={(e) => setFormOwner(e.target.value)}
                    placeholder="Store owner name" 
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Area / Location</label>
                <select 
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="input-field cursor-pointer text-xs"
                >
                  <option value="Valencia City (Batangan)">Valencia: Batangan</option>
                  <option value="Valencia City (Poblacion)">Valencia: Poblacion</option>
                  <option value="Valencia City (Kahaponan)">Valencia: Kahaponan</option>
                  <option value="Valencia City (San-Isidro)">Valencia: San-Isidro</option>
                  <option value="Valencia City (Sinabuagan)">Valencia: Sinabuagan</option>
                  <option value="Cabanglasan (Poblacion Centro)">Cabanglasan: Poblacion Centro</option>
                  <option value="Cabanglasan (Mandaing)">Cabanglasan: Mandaing</option>
                  <option value="Cabanglasan (Anlogan)">Cabanglasan: Anlogan</option>
                  <option value="San Fernando (Halapitan)">San Fernando: Halapitan</option>
                  <option value="San Fernando (Poblacion)">San Fernando: Poblacion</option>
                </select>
              </div>

              {/* Deposit Payment Breakdown Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Standard SELECTA Freezer Deposit (₱10,000 Total)</span>
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
                  className="input-field cursor-pointer text-xs"
                >
                  <option>Brand New / Perfect Condition</option>
                  <option>Good Working Condition</option>
                  <option>Minor Exterior Scratch</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsAssignModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveAssignment} className="btn-primary text-xs">Assign & Deploy Freezer</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {transferModalFreezer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Transfer Freezer Ownership</h2>
              </div>
              <button onClick={() => setTransferModalFreezer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  Freezer Serial #: <span className="text-brand-red font-mono">{transferModalFreezer.serialNumber}</span>
                </div>
                <div className="text-slate-600">
                  Current Owner: <strong>{transferModalFreezer.storeOwner}</strong> ({transferModalFreezer.assignedStore})
                </div>
                <div className="text-slate-500">Current Area: {transferModalFreezer.area}</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                <span className="font-bold block mb-1">Ownership Transfer Notice:</span>
                This will record <strong>{transferModalFreezer.storeOwner}</strong> as the <em>Past Owner</em> and update custody to the new owner.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">New Store Name <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={transferNewStore}
                    onChange={(e) => setTransferNewStore(e.target.value)}
                    placeholder="e.g. San Isidro Mini-Mart" 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">New Owner Name</label>
                  <input 
                    type="text" 
                    value={transferNewOwner}
                    onChange={(e) => setTransferNewOwner(e.target.value)}
                    placeholder="Full name of new owner" 
                    className="input-field" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">New Area / Route</label>
                <select 
                  value={transferNewArea}
                  onChange={(e) => setTransferNewArea(e.target.value)}
                  className="input-field cursor-pointer text-xs"
                >
                  <option value="Valencia City (Batangan)">Valencia: Batangan</option>
                  <option value="Valencia City (Poblacion)">Valencia: Poblacion</option>
                  <option value="Valencia City (Kahaponan)">Valencia: Kahaponan</option>
                  <option value="Valencia City (San-Isidro)">Valencia: San-Isidro</option>
                  <option value="Valencia City (Sinabuagan)">Valencia: Sinabuagan</option>
                  <option value="Cabanglasan (Poblacion Centro)">Cabanglasan: Poblacion Centro</option>
                  <option value="Cabanglasan (Mandaing)">Cabanglasan: Mandaing</option>
                  <option value="Cabanglasan (Anlogan)">Cabanglasan: Anlogan</option>
                  <option value="San Fernando (Halapitan)">San Fernando: Halapitan</option>
                  <option value="San Fernando (Poblacion)">San Fernando: Poblacion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason for Transfer / Turnover Notes</label>
                <textarea 
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g. Store changed ownership, moved to a new branch, or reallocated..."
                  className="input-field resize-none h-16 text-xs"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setTransferModalFreezer(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleConfirmTransfer} className="btn-primary text-xs">Confirm Ownership Transfer</button>
            </div>
          </div>
        </div>
      )}

      {/* Pull Out Freezer to Warehouse Modal */}
      {pullOutModalFreezer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-bold text-slate-800">Pull Out Freezer to Warehouse</h2>
              </div>
              <button onClick={() => setPullOutModalFreezer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900 text-sm">
                  Freezer Serial #: <span className="text-brand-red font-mono">{pullOutModalFreezer.serialNumber}</span>
                </div>
                <div className="text-slate-700">Store: <strong>{pullOutModalFreezer.assignedStore}</strong></div>
                <div className="text-slate-500">Current Owner: {pullOutModalFreezer.storeOwner}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reason for Pull Out</label>
                <select 
                  value={pullOutReason}
                  onChange={(e) => setPullOutReason(e.target.value)}
                  className="input-field cursor-pointer text-xs"
                >
                  <option value="Store permanently closed / ceased operations">Store permanently closed / ceased operations</option>
                  <option value="Low sales volume / dealer quota not reached">Low sales volume / dealer quota not reached</option>
                  <option value="Freezer requires major warehouse repair / maintenance">Freezer requires major warehouse repair / maintenance</option>
                  <option value="Customer voluntarily surrendered freezer">Customer voluntarily surrendered freezer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Additional Notes</label>
                <textarea 
                  value={pullOutNotes}
                  onChange={(e) => setPullOutNotes(e.target.value)}
                  placeholder="Physical inspection notes, pull out vehicle, technician info..."
                  className="input-field resize-none h-16 text-xs"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setPullOutModalFreezer(null)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleConfirmPullOut} className="btn-primary text-xs bg-amber-600 hover:bg-amber-700">
                Confirm Pull Out to Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details & Photo Proof Viewer Modal */}
      {viewDetailsFreezer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Freezer Serial Record Details</span>
              <button onClick={() => setViewDetailsFreezer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{viewDetailsFreezer.serialNumber}</h2>
                  <p className="font-mono text-slate-500">Barcode: {viewDetailsFreezer.barcode}</p>
                </div>
                <span className={`px-2.5 py-1 font-bold rounded-full text-xs ${
                  viewDetailsFreezer.status === 'Deployed' ? 'bg-emerald-100 text-emerald-800' :
                  viewDetailsFreezer.status === 'Pull Out' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {viewDetailsFreezer.status}
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-700 uppercase tracking-wider">Current Custody Location</p>
                <p className="text-sm font-semibold text-slate-800">{viewDetailsFreezer.assignedStore}</p>
                <p className="text-slate-600">Owner: <strong>{viewDetailsFreezer.storeOwner}</strong></p>
                <p className="text-slate-500">{viewDetailsFreezer.area} • Date Assigned: {viewDetailsFreezer.assignmentDate || 'N/A'}</p>
              </div>

              {/* Past Owner & Transfer History */}
              <div className="space-y-1.5 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-900 uppercase tracking-wider">Ownership Status</p>
                {viewDetailsFreezer.pastOwner ? (
                  <div>
                    <div className="text-slate-700">
                      Past Owner: <strong className="text-slate-900">{viewDetailsFreezer.pastOwner}</strong>
                    </div>
                    <div className="text-emerald-700 font-semibold mt-0.5">
                      Current Owner: {viewDetailsFreezer.storeOwner}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">First-time deployment. No previous owners.</p>
                )}
                {viewDetailsFreezer.transferHistory && viewDetailsFreezer.transferHistory.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200 space-y-1 text-[11px]">
                    <span className="font-bold text-blue-800 block">Transfer Log:</span>
                    {viewDetailsFreezer.transferHistory.map((th, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-blue-100">
                        <div><strong>{th.date}</strong>: {th.fromStore} → {th.toStore}</div>
                        <div className="text-slate-500 text-[10px]">{th.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pull Out Details if Applicable */}
              {viewDetailsFreezer.status === 'Pull Out' && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1 text-amber-900">
                  <p className="font-bold uppercase tracking-wider">Warehouse Pull Out Record</p>
                  <p>Date Pulled Out: <strong>{viewDetailsFreezer.pullOutDate || 'N/A'}</strong></p>
                  <p className="text-slate-700">Notes: {viewDetailsFreezer.pullOutNotes || 'Returned to Llano Central Bodega'}</p>
                </div>
              )}

              {viewDetailsFreezer.payment && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-700 uppercase mb-1">₱10,000 Deposit Breakdown</p>
                  <div className="flex justify-between"><span>Product Allocation:</span><span className="font-bold">{formatPHP(9000)}</span></div>
                  <div className="flex justify-between"><span>Processing Fee:</span><span className="font-bold">{formatPHP(1000)}</span></div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                    <span>Total Deposit Paid:</span><span>{formatPHP(10000)}</span>
                  </div>
                </div>
              )}

              {/* Photo Proof */}
              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase">Barcode Scan Proof</p>
                {viewDetailsFreezer.lastScan?.photoProof ? (
                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <img 
                      src={viewDetailsFreezer.lastScan.photoProof} 
                      alt="Timemark Proof" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2 bg-slate-50 text-[10px] text-slate-500 flex justify-between">
                      <span>Staff: {viewDetailsFreezer.lastScan.staff}</span>
                      <span>{viewDetailsFreezer.lastScan.scanDateTime || viewDetailsFreezer.lastScan.scanDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center text-slate-400">
                    No photo proof uploaded for this freezer.
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