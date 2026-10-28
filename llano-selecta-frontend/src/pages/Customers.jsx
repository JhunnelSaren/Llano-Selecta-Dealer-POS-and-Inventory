import React, { useState, useEffect } from 'react';
import { 
  Store, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  X, 
  Eye, 
  Phone, 
  Snowflake, 
  Camera, 
  CheckCircle2, 
  ExternalLink,
  Edit,
  Trash2,
  Building2,
  Image as ImageIcon,
  Barcode,
  Upload,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '../utils/productCatalog';
import { formatDate } from '../utils/helpers';
import { FileSpreadsheet } from 'lucide-react';
import ExcelImportModal from '../components/ExcelImportModal';
import { OFFICIAL_BARANGAYS, COMMON_PUROKS, BUKIDNON_AREAS } from '../utils/areasData';

export default function Customers() {
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CUSTOMERS.map(c => ({
      ...c,
      barcodeNo: c.barcodeNo || `4800019${c.id.replace('CUST-', '')}01`,
      freezerSerial: c.freezerSerial || `SEL-FRZ-88${c.id.replace('CUST-', '')}`,
      status: c.status || 'Active'
    }));
  });

  // Sync from PostgreSQL backend on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(c => ({
              id: c.id,
              store_name: c.store_name,
              owner: c.owner,
              dateJoined: c.date_joined ? c.date_joined.split('T')[0] : c.dateJoined,
              area: c.area,
              subArea: c.sub_area || c.subArea || '',
              purok: c.purok || '',
              contact: c.contact || '',
              freezerSerial: c.freezer_serial || c.freezerSerial || '',
              barcodeNo: c.barcode_no || c.barcodeNo || '',
              status: c.status || 'Active',
              deploymentPaperRef: c.deployment_paper_ref || c.deploymentPaperRef || '',
              deploymentPaperPhoto: c.deploymentPaperPhoto || ''
            }));
            setCustomers(mapped);
            localStorage.setItem('llano_selecta_customers', JSON.stringify(mapped));
          }
        }
      } catch (err) {}
    };

    fetchCustomers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainArea, setSelectedMainArea] = useState('ALL');
  const [selectedSubArea, setSelectedSubArea] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Modals
  const [viewCustomer, setViewCustomer] = useState(null);
  const [viewPaperPhoto, setViewPaperPhoto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form State for Adding / Editing Store
  const [formData, setFormData] = useState({
    store_name: '',
    owner: '',
    dateJoined: new Date().toISOString().split('T')[0],
    area: 'Valencia',
    subArea: 'Batangan',
    purok: '',
    contact: '',
    freezerSerial: '',
    barcodeNo: '',
    status: 'Active',
    deploymentPaperRef: '',
    deploymentPaperPhoto: ''
  });

  const valenciaSubAreas = OFFICIAL_BARANGAYS.Valencia;
  const sanFernandoSubAreas = OFFICIAL_BARANGAYS['San Fernando'];
  const cabanglasanSubAreas = OFFICIAL_BARANGAYS.Cabanglasan;

  // Handle Device Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, deploymentPaperPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit Modal
  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      store_name: cust.store_name,
      owner: cust.owner,
      dateJoined: cust.dateJoined || new Date().toISOString().split('T')[0],
      area: cust.area || 'Valencia',
      subArea: cust.subArea || 'Batangan',
      purok: cust.purok || '',
      contact: cust.contact || '',
      freezerSerial: cust.freezerSerial || '',
      barcodeNo: cust.barcodeNo || '',
      status: cust.status || 'Active',
      deploymentPaperRef: cust.deploymentPaperRef || '',
      deploymentPaperPhoto: cust.deploymentPaperPhoto || ''
    });
  };

  // Save Edit Customer with PostgreSQL sync
  const handleSaveEditCustomer = async (e) => {
    e.preventDefault();
    if (!formData.store_name || !formData.owner) {
      alert('Please fill in Store Name and Owner Name');
      return;
    }

    const updatedCust = {
      ...editingCustomer,
      store_name: formData.store_name,
      owner: formData.owner,
      dateJoined: formData.dateJoined,
      area: formData.area,
      subArea: formData.subArea,
      purok: formData.purok,
      contact: formData.contact,
      freezerSerial: formData.freezerSerial,
      barcodeNo: formData.barcodeNo,
      status: formData.status,
      deploymentPaperRef: formData.deploymentPaperRef,
      deploymentPaperPhoto: formData.deploymentPaperPhoto
    };

    try {
      await fetch(`http://localhost:5000/api/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_name: formData.store_name,
          owner: formData.owner,
          area: formData.area,
          sub_area: formData.subArea,
          purok: formData.purok,
          contact: formData.contact,
          freezer_serial: formData.freezerSerial,
          barcode_no: formData.barcodeNo,
          status: formData.status
        })
      });
    } catch (err) {}

    const updated = customers.map(c => c.id === editingCustomer.id ? updatedCust : c);
    setCustomers(updated);
    localStorage.setItem('llano_selecta_customers', JSON.stringify(updated));
    setEditingCustomer(null);
  };

  // Add New Customer with PostgreSQL sync
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!formData.store_name || !formData.owner) {
      alert('Please fill in Store Name and Owner Name');
      return;
    }

    const newCustomer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      store_name: formData.store_name,
      owner: formData.owner,
      dateJoined: formData.dateJoined,
      area: formData.area,
      subArea: formData.subArea,
      purok: formData.purok || 'Purok 1',
      route: `${formData.area} Route`,
      contact: formData.contact || '09XX-XXX-XXXX',
      freezerSerial: formData.freezerSerial || '',
      barcodeNo: formData.barcodeNo || '',
      status: formData.status || 'Active',
      deploymentPaperPhoto: formData.deploymentPaperPhoto || '',
      deploymentPaperRef: formData.deploymentPaperRef || (formData.deploymentPaperPhoto ? `DP-${formData.area.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}` : 'Pending Paper')
    };

    try {
      await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newCustomer.id,
          store_name: newCustomer.store_name,
          owner: newCustomer.owner,
          area: newCustomer.area,
          sub_area: newCustomer.subArea,
          purok: newCustomer.purok,
          contact: newCustomer.contact,
          freezer_serial: newCustomer.freezerSerial,
          barcode_no: newCustomer.barcodeNo,
          status: newCustomer.status,
          deployment_paper_ref: newCustomer.deploymentPaperRef
        })
      });
    } catch (err) {}

    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem('llano_selecta_customers', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setFormData({
      store_name: '',
      owner: '',
      dateJoined: new Date().toISOString().split('T')[0],
      area: 'Valencia',
      subArea: 'Batangan',
      purok: '',
      contact: '',
      freezerSerial: '',
      barcodeNo: '',
      status: 'Active',
      deploymentPaperRef: '',
      deploymentPaperPhoto: ''
    });
  };

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.purok.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subArea && c.subArea.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.contact && c.contact.includes(searchTerm));

    const matchesMainArea = 
      selectedMainArea === 'ALL' || c.area.toLowerCase().includes(selectedMainArea.toLowerCase());

    const matchesSubArea = 
      selectedSubArea === 'ALL' || c.subArea === selectedSubArea;

    const matchesStatus = 
      statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesMainArea && matchesSubArea && matchesStatus;
  });

  const valenciaCount = customers.filter(c => c.area.toLowerCase().includes('valencia')).length;
  const sanFernandoCount = customers.filter(c => c.area.toLowerCase().includes('san fernando') || c.area.toLowerCase().includes('sanfernando')).length;
  const cabanglasanCount = customers.filter(c => c.area.toLowerCase().includes('cabanglasan')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers & Stores Master</h1>
          <p className="text-sm text-slate-500">
            Registered Selecta dealer stores, editable custody profiles, signed deployment agreements, and Barcode/Serial tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import Excel / CSV
          </button>
          <button 
          onClick={() => {
            setFormData({
              store_name: '',
              owner: '',
              dateJoined: new Date().toISOString().split('T')[0],
              area: 'Valencia',
              subArea: 'Batangan',
              purok: '',
              contact: '',
              freezerSerial: '',
              barcodeNo: '',
              status: 'Active',
              deploymentPaperRef: '',
              deploymentPaperPhoto: ''
            });
            setIsAddModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register New Store
        </button>
        </div>
      </div>

      {/* Area Statistics Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => { setSelectedMainArea('ALL'); setSelectedSubArea('ALL'); }}
          className={`card cursor-pointer transition-all border-l-4 ${
            selectedMainArea === 'ALL' ? 'border-brand-red ring-1 ring-brand-red bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Territories</div>
              <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
            </div>
            <Store className="w-8 h-8 text-slate-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Total registered retail stores</div>
        </div>

        <div 
          onClick={() => { setSelectedMainArea('Valencia'); setSelectedSubArea('ALL'); }}
          className={`card cursor-pointer transition-all border-l-4 ${
            selectedMainArea === 'Valencia' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20' : 'border-blue-300 hover:border-blue-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Valencia City Area</div>
              <div className="text-2xl font-bold text-slate-900">{valenciaCount}</div>
            </div>
            <MapPin className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Batangan, Kahaponan, Ventar, San-Isidro, etc.</div>
        </div>

        <div 
          onClick={() => { setSelectedMainArea('San Fernando'); setSelectedSubArea('ALL'); }}
          className={`card cursor-pointer transition-all border-l-4 ${
            selectedMainArea === 'San Fernando' ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/20' : 'border-emerald-300 hover:border-emerald-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">San Fernando Area</div>
              <div className="text-2xl font-bold text-slate-900">{sanFernandoCount}</div>
            </div>
            <MapPin className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Halapitan, Poblacion & Public Market</div>
        </div>

        <div 
          onClick={() => { setSelectedMainArea('Cabanglasan'); setSelectedSubArea('ALL'); }}
          className={`card cursor-pointer transition-all border-l-4 ${
            selectedMainArea === 'Cabanglasan' ? 'border-purple-600 ring-1 ring-purple-600 bg-purple-50/20' : 'border-purple-300 hover:border-purple-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Cabanglasan Area</div>
              <div className="text-2xl font-bold text-slate-900">{cabanglasanCount}</div>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-[11px] text-slate-500 mt-2">Centro, Mandaing & Highlands</div>
        </div>
      </div>

      {/* Main Filter & Content Card */}
      <div className="card space-y-4">
        {/* Search Bar & Territory Selectors */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search store name, owner, purok, or contact number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div className="flex items-center gap-2 sm:w-60">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={selectedMainArea} 
              onChange={(e) => {
                setSelectedMainArea(e.target.value);
                setSelectedSubArea('ALL');
              }}
              className="input-field cursor-pointer text-xs"
            >
              <option value="ALL">All Main Territories</option>
              <option value="Valencia">Valencia Area ({valenciaCount})</option>
              <option value="San Fernando">San Fernando Area ({sanFernandoCount})</option>
              <option value="Cabanglasan">Cabanglasan Area ({cabanglasanCount})</option>
            </select>
          </div>

          <div className="flex items-center gap-2 sm:w-48">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field cursor-pointer text-xs"
            >
              <option value="ALL">All Store Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Papers">Pending Papers</option>
              <option value="Pending Freezer">Pending Freezer</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Sub-Area Pills for Valencia & Others */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-red" /> 
            <span>Territory Barangay / Sub-Location:</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedSubArea('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubArea === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Barangays ({filteredCustomers.length})
            </button>

            {(selectedMainArea === 'ALL' || selectedMainArea === 'Valencia') && (
              <>
                <span className="self-center text-xs font-semibold text-slate-300 px-1">| Valencia:</span>
                {valenciaSubAreas.map(sub => {
                  const count = customers.filter(c => c.subArea === sub).length;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => { setSelectedMainArea('Valencia'); setSelectedSubArea(sub); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedSubArea === sub
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      {sub} ({count})
                    </button>
                  );
                })}
              </>
            )}

            {(selectedMainArea === 'ALL' || selectedMainArea === 'San Fernando') && (
              <>
                <span className="self-center text-xs font-semibold text-slate-300 px-1">| San Fernando:</span>
                {sanFernandoSubAreas.map(sub => {
                  const count = customers.filter(c => c.subArea === sub).length;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => { setSelectedMainArea('San Fernando'); setSelectedSubArea(sub); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedSubArea === sub
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {sub} ({count})
                    </button>
                  );
                })}
              </>
            )}

            {(selectedMainArea === 'ALL' || selectedMainArea === 'Cabanglasan') && (
              <>
                <span className="self-center text-xs font-semibold text-slate-300 px-1">| Cabanglasan:</span>
                {cabanglasanSubAreas.map(sub => {
                  const count = customers.filter(c => c.subArea === sub).length;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => { setSelectedMainArea('Cabanglasan'); setSelectedSubArea(sub); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedSubArea === sub
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      {sub} ({count})
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Customer / Store Master Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store & Owner</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Territory & Purok</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date Joined</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Freezer Serial & Barcode</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Signed Paper</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                    {/* Store & Owner */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 text-brand-red rounded-lg hidden sm:block border border-red-100">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{cust.store_name}</div>
                          <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Owner: <strong>{cust.owner}</strong></span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Phone className="w-2.5 h-2.5" /> {cust.contact || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location: Territory & Purok */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            cust.area.toLowerCase().includes('valencia') 
                              ? 'bg-blue-100 text-blue-800' 
                              : cust.area.toLowerCase().includes('san fernando')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {cust.area} {cust.subArea && `• ${cust.subArea}`}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-700 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-brand-red shrink-0" />
                          <span>{cust.purok}</span>
                        </div>
                      </div>
                    </td>

                    {/* Date Joined */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(cust.dateJoined)}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">ID #{cust.id}</div>
                    </td>

                    {/* Freezer Serial # beside Barcode No. (Requirement 3) */}
                    <td className="py-3 px-4">
                      {cust.freezerSerial || cust.barcodeNo ? (
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                            <Snowflake className="w-3 h-3 text-blue-500" />
                            <span>SN: {cust.freezerSerial || 'Pending'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Barcode className="w-3 h-3 text-slate-400" />
                            <span>BC: {cust.barcodeNo || 'Pending'}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Freezer Pending
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        cust.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : cust.status === 'Pending Papers'
                          ? 'bg-amber-100 text-amber-800'
                          : cust.status === 'Pending Freezer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* Signed Deployment Paper Photo */}
                    <td className="py-3 px-4 text-center">
                      {cust.deploymentPaperPhoto ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <div 
                            onClick={() => setViewPaperPhoto(cust)}
                            className="relative group cursor-pointer w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:border-brand-red shadow-2xs transition-all"
                            title="Click to view signed deployment agreement paper"
                          >
                            <img 
                              src={cust.deploymentPaperPhoto} 
                              alt="Signed Deployment Paper" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Signed
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Paper Pending
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions: View & Edit (Requirement 3) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openEditModal(cust)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Customer Store & Custody Info"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewCustomer(cust)}
                          className="p-1.5 text-slate-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Store className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No stores found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Deployment Agreement Paper Photo */}
      {viewPaperPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-red" />
                <div>
                  <h3 className="text-base font-bold text-slate-800">Freezer Deployment Agreement Paper</h3>
                  <p className="text-xs text-slate-500">{viewPaperPhoto.store_name} • Ref: {viewPaperPhoto.deploymentPaperRef || 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewPaperPhoto(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Store Name:</span>
                  <strong className="text-slate-900 text-sm">{viewPaperPhoto.store_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Owner / Signee:</span>
                  <strong className="text-slate-900 text-sm">{viewPaperPhoto.owner}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Freezer Serial # & Barcode:</span>
                  <span className="text-slate-800 font-medium">SN: {viewPaperPhoto.freezerSerial || 'None'} • BC: {viewPaperPhoto.barcodeNo || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Customer Joined:</span>
                  <span className="text-slate-800 font-medium">{formatDate(viewPaperPhoto.dateJoined)}</span>
                </div>
              </div>

              {/* Photo Display */}
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-100 max-h-96 flex items-center justify-center">
                <img 
                  src={viewPaperPhoto.deploymentPaperPhoto} 
                  alt="Deployment Paper Document" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Legally Signed & Verified Agreement
                </div>
                <button 
                  onClick={() => window.open(viewPaperPhoto.deploymentPaperPhoto, '_blank')}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Full Store Profile */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-bold text-slate-800">Store Profile Details</h3>
              </div>
              <button onClick={() => setViewCustomer(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 bg-red-100 text-brand-red rounded-xl flex items-center justify-center font-bold text-xl">
                  {viewCustomer.store_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{viewCustomer.store_name}</h2>
                  <p className="text-slate-500 font-medium">Owner: {viewCustomer.owner} • Contact: {viewCustomer.contact || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Main Territory:</span>
                  <span className="font-bold text-slate-800">{viewCustomer.area}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Barangay / Sub-Area:</span>
                  <span className="font-bold text-slate-800">{viewCustomer.subArea || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Purok Exact Address:</span>
                  <span className="font-bold text-slate-800">{viewCustomer.purok}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date Joined:</span>
                  <span className="font-bold text-slate-800">{formatDate(viewCustomer.dateJoined)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Store Status:</span>
                  <span className="font-bold text-emerald-600">{viewCustomer.status}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-blue-500" /> Assigned Selecta Freezer
                </div>
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-slate-700 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Freezer Serial #:</span>
                    <span className="font-bold text-slate-900">{viewCustomer.freezerSerial || 'Not Assigned Yet'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Barcode No.:</span>
                    <span className="font-bold text-slate-900">{viewCustomer.barcodeNo || 'Not Assigned Yet'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => {
                    const target = viewCustomer;
                    setViewCustomer(null);
                    openEditModal(target);
                  }}
                  className="btn-primary text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit This Store Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Customer Store OR Edit Existing Store (Requirement 3) */}
      {(isAddModalOpen || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-bold text-slate-800">
                  {editingCustomer ? 'Edit Customer & Store Details' : 'Register New Customer Store'}
                </h3>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingCustomer ? handleSaveEditCustomer : handleAddCustomer} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Store Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Aling Nena Sari-Sari Store" 
                    value={formData.store_name}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Nena Dela Cruz" 
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Joined *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.dateJoined}
                    onChange={(e) => setFormData({...formData, dateJoined: e.target.value})}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input 
                    type="text" 
                    placeholder="0917-XXX-XXXX" 
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Store Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input-field text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Papers">Pending Papers</option>
                    <option value="Pending Freezer">Pending Freezer</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Territory & Purok Location */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" /> Territory & Purok Location
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Main Municipality / Area *</label>
                    <select 
                      value={formData.area} 
                      onChange={(e) => {
                        const newArea = e.target.value;
                        const defaultSub = newArea === 'Valencia' 
                          ? 'Batangan' 
                          : newArea === 'San Fernando' 
                            ? 'Halapitan (Poblacion)' 
                            : 'Poblacion (Cabanglasan Centro)';
                        setFormData({...formData, area: newArea, subArea: defaultSub});
                      }}
                      className="input-field text-xs bg-white font-bold"
                    >
                      <option value="Valencia">Valencia City</option>
                      <option value="Cabanglasan">Cabanglasan</option>
                      <option value="San Fernando">San Fernando</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Official Barangay *</label>
                    <select 
                      value={formData.subArea} 
                      onChange={(e) => setFormData({...formData, subArea: e.target.value})}
                      className="input-field text-xs bg-white font-bold"
                    >
                      {(formData.area.includes('Valencia') || formData.area === 'Valencia') && valenciaSubAreas.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      {(formData.area.includes('San Fernando') || formData.area === 'San Fernando') && sanFernandoSubAreas.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      {(formData.area.includes('Cabanglasan') || formData.area === 'Cabanglasan') && cabanglasanSubAreas.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Purok & Street Details *</label>
                  <input 
                    type="text" 
                    required 
                    list="common-puroks-datalist"
                    placeholder="e.g. Purok 3 (Near Central Elementary School)" 
                    value={formData.purok}
                    onChange={(e) => setFormData({...formData, purok: e.target.value})}
                    className="input-field text-xs bg-white" 
                  />
                  <datalist id="common-puroks-datalist">
                    {COMMON_PUROKS.map(pk => (
                      <option key={pk} value={pk} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Requirement 3: Barcode No. Instead beside Freezer Serial # */}
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 space-y-3">
                <div className="font-bold text-slate-800 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <Snowflake className="w-3.5 h-3.5 text-blue-500" /> Freezer Custody Details (Editable)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Can be left empty if pending</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Freezer Serial #</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SEL-FRZ-8821" 
                      value={formData.freezerSerial}
                      onChange={(e) => setFormData({...formData, freezerSerial: e.target.value})}
                      className="input-field text-xs bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Barcode No.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 4800019201" 
                      value={formData.barcodeNo}
                      onChange={(e) => setFormData({...formData, barcodeNo: e.target.value})}
                      className="input-field text-xs bg-white font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Requirement 2: Photos from Device */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-slate-700">
                    Signed Deployment Paper Photo (Upload From Device)
                  </label>
                  <span className="text-[10px] text-slate-400">Can attach later if pending</span>
                </div>

                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white hover:file:bg-brand-dark cursor-pointer"
                />

                {formData.deploymentPaperPhoto && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-16 w-24 rounded-lg border border-slate-300 overflow-hidden bg-white">
                      <img src={formData.deploymentPaperPhoto} alt="Paper Preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Photo attached from device
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setIsAddModalOpen(false); setEditingCustomer(null); }} 
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs"
                >
                  {editingCustomer ? 'Update Store Information' : 'Save Customer Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ExcelImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={() => window.location.reload()} type="customers" />
    </div>
  );
}
