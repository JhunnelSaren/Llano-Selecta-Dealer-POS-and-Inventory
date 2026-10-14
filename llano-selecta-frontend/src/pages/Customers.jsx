import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import { INITIAL_CUSTOMERS } from '../utils/productCatalog';
import { formatDate } from '../utils/helpers';

export default function Customers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainArea, setSelectedMainArea] = useState('ALL');
  const [selectedSubArea, setSelectedSubArea] = useState('ALL');
  
  // Modals
  const [viewCustomer, setViewCustomer] = useState(null);
  const [viewPaperPhoto, setViewPaperPhoto] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding New Store
  const [formData, setFormData] = useState({
    store_name: '',
    owner: '',
    dateJoined: new Date().toISOString().split('T')[0],
    area: 'Valencia',
    subArea: 'Batangan',
    purok: '',
    contact: '',
    freezerModel: 'Chest Freezer 300L',
    freezerSerial: '',
    deploymentPaperRef: '',
    deploymentPaperPhoto: ''
  });

  const valenciaSubAreas = ['Batangan', 'Kahaponan', 'Ventar', 'San-Isidro', 'Sinabuagan', 'Lumbayao'];
  const sanFernandoSubAreas = ['San Fernando Poblacion', 'Halapitan'];
  const cabanglasanSubAreas = ['Cabanglasan Centro', 'Mandaing'];

  // Sync with Backend API if available
  React.useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // If server returns DB rows, augment with defaults if necessary
          setCustomers(data.map((c, i) => ({
            ...INITIAL_CUSTOMERS[i % INITIAL_CUSTOMERS.length],
            ...c
          })));
        }
      })
      .catch(() => {
        // Fallback already populated from INITIAL_CUSTOMERS
      });
  }, []);

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    // Search filter: Store name, owner, purok, or contact
    const matchesSearch = 
      c.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.purok.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subArea && c.subArea.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.contact && c.contact.includes(searchTerm));

    // Area filter
    const matchesMainArea = 
      selectedMainArea === 'ALL' || c.area.toLowerCase().includes(selectedMainArea.toLowerCase());

    // SubArea filter
    const matchesSubArea = 
      selectedSubArea === 'ALL' || c.subArea === selectedSubArea;

    return matchesSearch && matchesMainArea && matchesSubArea;
  });

  // Calculate dynamic counts
  const valenciaCount = customers.filter(c => c.area.toLowerCase().includes('valencia')).length;
  const sanFernandoCount = customers.filter(c => c.area.toLowerCase().includes('san fernando') || c.area.toLowerCase().includes('sanfernando')).length;
  const cabanglasanCount = customers.filter(c => c.area.toLowerCase().includes('cabanglasan')).length;

  const handleAddCustomer = (e) => {
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
      freezerModel: formData.freezerModel,
      freezerSerial: formData.freezerSerial || `SEL-FRZ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      deploymentPaperPhoto: formData.deploymentPaperPhoto || 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=700',
      deploymentPaperRef: formData.deploymentPaperRef || `DP-${formData.area.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    setFormData({
      store_name: '',
      owner: '',
      dateJoined: new Date().toISOString().split('T')[0],
      area: 'Valencia',
      subArea: 'Batangan',
      purok: '',
      contact: '',
      freezerModel: 'Chest Freezer 300L',
      freezerSerial: '',
      deploymentPaperRef: '',
      deploymentPaperPhoto: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers & Stores Master</h1>
          <p className="text-sm text-slate-500">
            Registered Selecta dealer store accounts, verified freezer deployment agreements, and territorial purok locations
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register New Store
        </button>
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
          <div className="text-[11px] text-slate-500 mt-2">Total registered retail partners</div>
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
          <div className="text-[11px] text-slate-500 mt-2">Halapitan, Poblacion & Market</div>
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

          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={selectedMainArea} 
              onChange={(e) => {
                setSelectedMainArea(e.target.value);
                setSelectedSubArea('ALL');
              }}
              className="input-field cursor-pointer"
            >
              <option value="ALL">All Main Territories</option>
              <option value="Valencia">Valencia Area ({valenciaCount})</option>
              <option value="San Fernando">San Fernando Area ({sanFernandoCount})</option>
              <option value="Cabanglasan">Cabanglasan Area ({cabanglasanCount})</option>
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
              All Barangays / Sub-Areas ({filteredCustomers.length})
            </button>

            {/* If Valencia or ALL is selected, show Valencia Barangays */}
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

            {/* San Fernando Sub-areas */}
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

            {/* Cabanglasan Sub-areas */}
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
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Freezer</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Deployment Paper</th>
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
                            <Phone className="w-2.5 h-2.5" /> {cust.contact}
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
                      <div className="text-[11px] text-slate-400">Customer #{cust.id}</div>
                    </td>

                    {/* Assigned Freezer */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                          <Snowflake className="w-3 h-3 text-blue-500" />
                          <span>{cust.freezerModel}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          SN: {cust.freezerSerial}
                        </div>
                      </div>
                    </td>

                    {/* Signed Deployment Paper Photo */}
                    <td className="py-3 px-4 text-center">
                      {cust.deploymentPaperPhoto ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <div 
                            onClick={() => setViewPaperPhoto(cust)}
                            className="relative group cursor-pointer w-14 h-14 rounded-lg overflow-hidden border border-slate-200 hover:border-brand-red shadow-xs transition-all"
                            title="Click to view signed deployment agreement paper"
                          >
                            <img 
                              src={cust.deploymentPaperPhoto} 
                              alt="Signed Deployment Paper" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Signed Paper
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No paper uploaded</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setViewCustomer(cust)}
                          className="p-1.5 text-slate-500 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                          title="View Full Profile & Deployment Paper"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setViewPaperPhoto(cust)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Inspect Deployment Paper Photo"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Store className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">No stores found matching your filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try selecting a different territory or clearing the search box</p>
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
                  <p className="text-xs text-slate-500">{viewPaperPhoto.store_name} • Ref: {viewPaperPhoto.deploymentPaperRef}</p>
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
                  <span className="text-slate-500 block">Purok & Territory:</span>
                  <span className="text-slate-800 font-medium">{viewPaperPhoto.purok}, {viewPaperPhoto.subArea}, {viewPaperPhoto.area}</span>
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
                  <CheckCircle2 className="w-4 h-4" /> Legally Acknowledged & Signed Agreement
                </div>
                <button 
                  onClick={() => window.open(viewPaperPhoto.deploymentPaperPhoto, '_blank')}
                  className="btn-secondary text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution Photo
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
              <button 
                onClick={() => setViewCustomer(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
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
                  <p className="text-slate-500 font-medium">Owner: {viewCustomer.owner} • Contact: {viewCustomer.contact}</p>
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
                  <span className="text-slate-400 block text-[11px]">Customer Status:</span>
                  <span className="font-bold text-emerald-600">{viewCustomer.status}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-blue-500" /> Assigned Selecta Freezer
                </div>
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-slate-700">
                  <div className="font-bold">{viewCustomer.freezerModel}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">Serial: {viewCustomer.freezerSerial}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-red" /> Signed Deployment Agreement Paper
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{viewCustomer.deploymentPaperRef}</span>
                </div>
                <div 
                  onClick={() => { setViewPaperPhoto(viewCustomer); setViewCustomer(null); }}
                  className="cursor-pointer group relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center"
                >
                  <img src={viewCustomer.deploymentPaperPhoto} alt="Paper" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white font-semibold text-xs gap-1 group-hover:bg-slate-900/60 transition-colors">
                    <Eye className="w-4 h-4" /> Click to Inspect Signed Document
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Customer Store */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-bold text-slate-800">Register New Customer Store</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 space-y-4 text-xs">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              {/* Territory & Purok Location */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" /> Territory & Purok Location
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Main Area *</label>
                    <select 
                      value={formData.area} 
                      onChange={(e) => {
                        const newArea = e.target.value;
                        const defaultSub = newArea === 'Valencia' ? 'Batangan' : newArea === 'San Fernando Area' ? 'San Fernando Poblacion' : 'Cabanglasan Centro';
                        setFormData({...formData, area: newArea, subArea: defaultSub});
                      }}
                      className="input-field text-xs bg-white"
                    >
                      <option value="Valencia">Valencia</option>
                      <option value="San Fernando Area">San Fernando Area</option>
                      <option value="Cabanglasan Area">Cabanglasan Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Barangay / Sub-Location *</label>
                    <select 
                      value={formData.subArea} 
                      onChange={(e) => setFormData({...formData, subArea: e.target.value})}
                      className="input-field text-xs bg-white"
                    >
                      {formData.area === 'Valencia' && valenciaSubAreas.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      {formData.area === 'San Fernando Area' && sanFernandoSubAreas.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      {formData.area === 'Cabanglasan Area' && cabanglasanSubAreas.map(sub => (
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
                    placeholder="e.g. Purok 3 (Near Central Elementary School)" 
                    value={formData.purok}
                    onChange={(e) => setFormData({...formData, purok: e.target.value})}
                    className="input-field text-xs bg-white" 
                  />
                </div>
              </div>

              {/* Freezer & Deployment Paper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Freezer Model</label>
                  <select 
                    value={formData.freezerModel} 
                    onChange={(e) => setFormData({...formData, freezerModel: e.target.value})}
                    className="input-field text-xs"
                  >
                    <option value="Chest Freezer 200L">Chest Freezer 200L</option>
                    <option value="Chest Freezer 300L">Chest Freezer 300L</option>
                    <option value="Glass Top Freezer 400L">Glass Top Freezer 400L</option>
                    <option value="Double Lid Chest Freezer 500L">Double Lid Chest Freezer 500L</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Freezer Serial #</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SEL-FRZ-8821" 
                    value={formData.freezerSerial}
                    onChange={(e) => setFormData({...formData, freezerSerial: e.target.value})}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Photo of Signed Deployment Paper (URL or Upload Proof)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://... or photo proof URL" 
                    value={formData.deploymentPaperPhoto}
                    onChange={(e) => setFormData({...formData, deploymentPaperPhoto: e.target.value})}
                    className="input-field text-xs flex-1" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setFormData({
                      ...formData, 
                      deploymentPaperPhoto: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=700'
                    })}
                    className="btn-secondary text-xs whitespace-nowrap"
                  >
                    Use Sample Doc
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Photo copy of the signed Selecta Freezer Deployment & Custody Paper</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary text-xs"
                >
                  Save Store Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
