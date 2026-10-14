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
  ShieldCheck
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Dispatch() {
  // Available Staff for Dynamic Delivery Assignments
  const availableStaff = [
    { name: 'Juan Driver', primary: 'Driver' },
    { name: 'Pedro Loader', primary: 'Loader' },
    { name: 'Roberto Backride', primary: 'Backride' },
    { name: 'Maria Checker', primary: 'Checker' }
  ];

  // Mock Active Dispatch Trips
  const [dispatchTrips, setDispatchTrips] = useState([
    {
      id: 'DISP-2026-101',
      route: 'Valencia -> San Fernando Route',
      vehicle: 'Bongo Truck #1 (KAB-902)',
      dispatchDate: '2026-10-09',
      driver: 'Juan Driver',
      loaders: ['Pedro Loader', 'Roberto Backride'],
      status: 'In Transit',
      remarks: 'Packed 5 ice boxes with thermal tape seals.',
      boxes: [
        {
          boxNumber: 'BOX #001',
          storeName: 'Aling Nena Sari-Sari',
          customerArea: 'Valencia City',
          sealStatus: 'Taped & Sealed',
          items: [
            { name: 'Magnum Classic Almond 80ml', qty: 10 },
            { name: 'Cornetto Vanilla 110ml', qty: 20 },
            { name: 'Big Scoop Chocolate Fudge 1.5L', qty: 15 }
          ]
        },
        {
          boxNumber: 'BOX #002',
          storeName: 'San Isidro Mini-Mart',
          customerArea: 'San Isidro',
          sealStatus: 'Taped & Sealed',
          items: [
            { name: 'SELECTA 3-in-1 Double Dutch 1.3L', qty: 10 },
            { name: 'Cornetto Chocolate 110ml', qty: 30 }
          ]
        }
      ]
    },
    {
      id: 'DISP-2026-100',
      route: 'Cabanglasan Area Route',
      vehicle: 'Bongo Truck #2 (LMN-410)',
      dispatchDate: '2026-10-08',
      driver: 'Juan Driver',
      loaders: ['Pedro Loader'],
      status: 'Completed',
      remarks: 'All 3 boxes delivered successfully.',
      boxes: [
        {
          boxNumber: 'BOX #001',
          storeName: 'Cabanglasan Express',
          customerArea: 'Cabanglasan',
          sealStatus: 'Delivered',
          items: [
            { name: 'Big Scoop Chocolate Fudge 1.5L', qty: 20 },
            { name: 'Cornetto Vanilla 110ml', qty: 50 }
          ]
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedBoxForLabel, setSelectedBoxForLabel] = useState(null);

  // New Dispatch Form State
  const [formRoute, setFormRoute] = useState('Valencia -> San Fernando Route');
  const [formVehicle, setFormVehicle] = useState('Bongo Truck #1 (KAB-902)');
  const [formDriver, setFormDriver] = useState('Juan Driver');
  const [formLoaders, setFormLoaders] = useState(['Pedro Loader', 'Roberto Backride']);
  const [formRemarks, setFormRemarks] = useState('');

  const handleSaveDispatch = () => {
    const newTrip = {
      id: `DISP-2026-${100 + dispatchTrips.length + 1}`,
      route: formRoute,
      vehicle: formVehicle,
      dispatchDate: new Date().toISOString().split('T')[0],
      driver: formDriver,
      loaders: formLoaders,
      status: 'Dispatched',
      remarks: formRemarks || 'Loaded into Bongo ice boxes.',
      boxes: [
        {
          boxNumber: 'BOX #001',
          storeName: 'Batangan Corner Store',
          customerArea: 'Batangan',
          sealStatus: 'Taped & Sealed',
          items: [
            { name: 'Cornetto Chocolate 110ml', qty: 40 },
            { name: 'Magnum Classic Almond 80ml', qty: 20 }
          ]
        }
      ]
    };

    setDispatchTrips([newTrip, ...dispatchTrips]);
    setIsModalOpen(false);
    setFormRemarks('');
  };

  const filteredTrips = dispatchTrips.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispatch & Ice Box Packing</h1>
          <p className="text-sm text-slate-500">Bongo vehicle crew assignments, ice box packaging labels & store dispatch lists</p>
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
            <Box className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ice Boxes Packed Today</p>
            <h3 className="text-lg font-bold text-brand-red">
              {dispatchTrips.reduce((acc, t) => acc + t.boxes.length, 0)} Sealed Boxes
            </h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Delivery Crew</p>
            <h3 className="text-lg font-bold text-slate-900">1 Driver + 2 Loaders</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-purple-500 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Box Label Compliance</p>
            <h3 className="text-lg font-bold text-slate-900">100% Labeled</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Dispatch ID, route name, vehicle, or driver..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        {/* Dispatch Trips Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dispatch Ref / Date</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Route & Destination</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Vehicle & Assigned Crew</th>
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
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-red" /> {trip.route}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-800">{trip.vehicle}</div>
                      <div className="text-xs text-slate-500">
                        <strong>Driver:</strong> {trip.driver} • <strong>Crew:</strong> {trip.loaders.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-brand-red flex items-center gap-1">
                        <Box className="w-4 h-4" /> {trip.boxes.length} Ice Boxes
                      </div>
                      <div className="text-[10px] text-slate-400">Taped & Assigned</div>
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
      </div>

      {/* Schedule Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Schedule Bongo Delivery Dispatch</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Route & Areas <span className="text-brand-red">*</span></label>
                <select 
                  value={formRoute}
                  onChange={(e) => setFormRoute(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option>Valencia → San Fernando Route</option>
                  <option>Cabanglasan Area Route</option>
                  <option>Batangan & San Isidro Route</option>
                  <option>Lumabayo Route</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Bongo Vehicle</label>
                  <select 
                    value={formVehicle}
                    onChange={(e) => setFormVehicle(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Bongo Truck #1 (KAB-902)</option>
                    <option>Bongo Truck #2 (LMN-410)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Driver <span className="text-brand-red">*</span></label>
                  <select 
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option>Juan Driver</option>
                    <option>Pedro Driver</option>
                  </select>
                </div>
              </div>

              {/* Loaders Selection (Rule 6: 2 Staff/Loaders) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Assigned Loaders / Backrides (2 Staff)</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Pedro Loader', 'Roberto Backride', 'Maria Checker'].map(staff => (
                    <label key={staff} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formLoaders.includes(staff)}
                        onChange={() => {
                          if (formLoaders.includes(staff)) {
                            setFormLoaders(formLoaders.filter(s => s !== staff));
                          } else {
                            setFormLoaders([...formLoaders, staff]);
                          }
                        }}
                        className="rounded text-brand-red focus:ring-brand-red" 
                      />
                      <span className="font-medium text-slate-800">{staff}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dispatch Instructions</label>
                <textarea 
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="Notes for driver regarding ice box packing..."
                  className="input-field resize-none h-16"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveDispatch} className="btn-primary text-xs">Create Dispatch & Packing List</button>
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

            {/* Printable Area */}
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

              {/* Crew Assignment Header */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div><span className="text-slate-500 font-semibold">Assigned Driver:</span> <strong className="text-slate-800">{selectedTrip.driver}</strong></div>
                <div><span className="text-slate-500 font-semibold">Assigned Loaders:</span> <strong className="text-slate-800">{selectedTrip.loaders.join(', ')}</strong></div>
              </div>

              {/* Individual Ice Box Packages */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Store Ice Box Breakdown</h3>
                
                {selectedTrip.boxes.map((box, idx) => (
                  <div key={idx} className="border-2 border-slate-900 rounded-lg p-4 bg-white space-y-3 relative">
                    {/* Box Header Badge */}
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

                    {/* Box Items Table */}
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

            {/* Sticker Label Preview */}
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