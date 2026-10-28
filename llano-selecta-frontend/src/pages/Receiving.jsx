import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Boxes, 
  Truck, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Printer, 
  Eye, 
  Filter, 
  PackageCheck, 
  Clock, 
  FileText,
  AlertOctagon,
  IceCream,
  Camera,
  Upload,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Receiving() {
  // Mock Receiving Records
  const [receivingLogs, setReceivingLogs] = useState([
    {
      id: 'RCV-2026-001',
      poNumber: 'PO-SEL-9042',
      truckPlate: 'KAB-4819',
      driverInfo: 'SELECTA Bodega Panel #4 (Manolo Fortich)',
      arrivalDate: '2026-10-09',
      arrivalTime: '09:30 AM',
      receiver: 'Pedro Warehouse',
      checker: 'Juan Checker',
      receiptPhoto: 'https://images.unsplash.com/photo-1554415707-9e49fe830836?auto=format&fit=crop&q=80&w=600',
      status: 'Delivered to Warehouse', // marked as delivered/received
      damageNotes: '5 Cornettos crushed upon opening van door.',
      damageDeduction: 140.00,
      remarks: 'Delivered into Llano Bodega. Quantities added to stock ledger.',
      items: [
        { id: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', ordered: 200, received: 195, damaged: 5, missing: 0, price: 28.00 },
        { id: 'MAG-001', name: 'CLASSIC', category: 'MAGNUM', ordered: 100, received: 100, damaged: 0, missing: 0, price: 58.00 },
        { id: 'SUP-001', name: 'DOUBLE DUTCH', category: 'SUPREME 1.3L', ordered: 50, received: 48, damaged: 0, missing: 2, price: 165.00 }
      ],
      totalReceivedValue: 20760.00
    },
    {
      id: 'RCV-2026-002',
      poNumber: 'PO-SEL-9038',
      truckPlate: 'LMN-3021',
      driverInfo: 'SELECTA Express Panel #2',
      arrivalDate: '2026-10-06',
      arrivalTime: '02:15 PM',
      receiver: 'Pedro Warehouse',
      checker: 'Juan Checker',
      receiptPhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
      status: 'Delivered to Warehouse',
      damageNotes: 'None. Clean delivery.',
      damageDeduction: 0.00,
      remarks: 'All items received in good condition.',
      items: [
        { id: 'STK-001', name: 'COOKIES & CREAM', category: 'STICKS', ordered: 300, received: 300, damaged: 0, missing: 0, price: 28.00 },
        { id: 'COR-002', name: 'COOKIES & DREAM', category: 'CORNETTO', ordered: 80, received: 80, damaged: 0, missing: 0, price: 28.00 }
      ],
      totalReceivedValue: 10640.00
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // New Receiving Form State
  const [formPoNumber, setFormPoNumber] = useState('PO-SEL-9045');
  const [formTruckPlate, setFormTruckPlate] = useState('');
  const [formDriverInfo, setFormDriverInfo] = useState('SELECTA Main Freezer Van');
  const [formArrivalDate, setFormArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [formArrivalTime, setFormArrivalTime] = useState('10:00 AM');
  const [formReceiver, setFormReceiver] = useState('Pedro Warehouse');
  const [formChecker, setFormChecker] = useState('Juan Checker');
  const [formReceiptPhoto, setFormReceiptPhoto] = useState('');
  const [formRemarks, setFormRemarks] = useState('');
  const [formDamageNotes, setFormDamageNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SELECTA_CATEGORIES[0]);

  // Items to receive
  const [formItems, setFormItems] = useState([
    { productId: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', ordered: 100, received: 100, damaged: 0, missing: 0, price: 28.00 },
    { productId: 'MAG-001', name: 'CLASSIC', category: 'MAGNUM', ordered: 50, received: 48, damaged: 2, missing: 0, price: 58.00 }
  ]);

  // Handle Photo Upload from Device
  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormReceiptPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formItems];
    const val = Math.max(0, parseInt(value) || 0);
    updated[index][field] = val;

    if (field === 'received' || field === 'damaged') {
      const rec = field === 'received' ? val : updated[index].received;
      const dam = field === 'damaged' ? val : updated[index].damaged;
      updated[index].missing = Math.max(0, updated[index].ordered - (rec + dam));
    }

    setFormItems(updated);
  };

  const handleAddItemFromCategory = (prod) => {
    const existing = formItems.find(i => i.productId === prod.id);
    if (existing) return;

    setFormItems([
      ...formItems,
      {
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        ordered: 50,
        received: 50,
        damaged: 0,
        missing: 0,
        price: Number(prod.dealerPrice || prod.unit_price)
      }
    ]);
  };

  const handleRemoveFormItem = (idx) => {
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  // Calculations
  const totalDamagedCost = formItems.reduce((sum, item) => sum + (item.damaged * item.price), 0);
  const totalReceivedGross = formItems.reduce((sum, item) => sum + (item.received * item.price), 0);
  const netReceivedValue = Math.max(0, totalReceivedGross - totalDamagedCost);
  const totalUnitsAdded = formItems.reduce((sum, item) => sum + item.received, 0);

  const handleSaveReceiving = () => {
    if (!formTruckPlate.trim()) {
      alert('Please enter the freezer van truck plate number.');
      return;
    }
    if (formItems.length === 0) {
      alert('Please select at least one product being received from the freezer van.');
      return;
    }

    const newLog = {
      id: `RCV-2026-${100 + receivingLogs.length + 1}`,
      poNumber: formPoNumber,
      truckPlate: formTruckPlate.toUpperCase(),
      driverInfo: formDriverInfo,
      arrivalDate: formArrivalDate,
      arrivalTime: formArrivalTime,
      receiver: formReceiver,
      checker: formChecker,
      receiptPhoto: formReceiptPhoto,
      status: 'Delivered to Warehouse', // marked as delivered
      damageNotes: formDamageNotes || (totalDamagedCost > 0 ? `Van damage deducted: ${formatPHP(totalDamagedCost)}` : 'Delivered clean.'),
      damageDeduction: totalDamagedCost,
      remarks: formRemarks || `${totalUnitsAdded} product units successfully received from freezer van and added to inventory ledger.`,
      items: formItems,
      totalReceivedValue: netReceivedValue
    };

    setReceivingLogs([newLog, ...receivingLogs]);
    setIsModalOpen(false);
    setFormTruckPlate('');
    setFormReceiptPhoto('');
    setFormRemarks('');
    setFormDamageNotes('');
  };

  const filteredLogs = receivingLogs.filter(log => {
    const matchesSearch = log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.truckPlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Receiving & Freezer Van Arrival</h1>
          <p className="text-sm text-slate-500">Inbound freezer van receiving, receipt photo upload, damage deduction & automated stock increments</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setFormReceiptPhoto('');
            setFormDamageNotes('');
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Receive Freezer Van Delivery
        </button>
      </div>

      {/* Live Stock Increment Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-400/30">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">Automatic Stock Integration</span>
            <p className="text-sm font-bold text-white">All products marked as Delivered from freezer van automatically increment product stock counts.</p>
          </div>
        </div>
        <div className="text-xs bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg text-emerald-200">
          Total Inbound Recorded: <span className="font-bold text-white">{receivingLogs.length} Van Shipments</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Receiving ID, PO reference, or truck plate..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer text-xs font-semibold"
            >
              <option value="All">All Inbound Logs</option>
              <option value="Delivered to Warehouse">Delivered to Warehouse</option>
            </select>
          </div>
        </div>

        {/* Receiving Logs Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Receiving Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">SELECTA PO & Van</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Arrival Date/Time</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock Added</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Van Damage Deducted</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const totalUnits = log.items.reduce((sum, i) => sum + i.received, 0);
                  const totalDamaged = log.items.reduce((sum, i) => sum + i.damaged, 0);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{log.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-brand-red">{log.poNumber}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-slate-400" /> {log.truckPlate} ({log.driverInfo})
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="font-bold text-slate-800">{log.arrivalDate}</div>
                        <div className="text-slate-400">{log.arrivalTime}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="font-bold text-emerald-700 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> +{totalUnits} units added
                        </div>
                        <div className="text-slate-500">{formatPHP(log.totalReceivedValue)}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {log.damageDeduction > 0 ? (
                          <div>
                            <span className="text-red-700 font-bold block">-{formatPHP(log.damageDeduction)}</span>
                            <span className="text-[10px] text-red-600 font-medium">{totalDamaged} damaged items deducted</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">None (Full delivery)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <Boxes className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No receiving records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Receive Freezer Van Delivery & Stock Increment</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SELECTA PO Reference</label>
                  <select 
                    value={formPoNumber}
                    onChange={(e) => setFormPoNumber(e.target.value)}
                    className="input-field cursor-pointer font-bold text-xs"
                  >
                    <option value="PO-SEL-9045">PO-SEL-9045 (Expected Van Today)</option>
                    <option value="PO-SEL-9046">PO-SEL-9046 (In Transit Van)</option>
                    <option value="PO-SEL-9047">PO-SEL-9047 (Express Delivery)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Freezer Van Plate No. <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formTruckPlate}
                    onChange={(e) => setFormTruckPlate(e.target.value)}
                    placeholder="e.g. KAB-4819" 
                    className="input-field uppercase font-bold text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Van Driver / Bodega Origin</label>
                  <input 
                    type="text" 
                    value={formDriverInfo}
                    onChange={(e) => setFormDriverInfo(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival Date</label>
                  <input 
                    type="date" 
                    value={formArrivalDate}
                    onChange={(e) => setFormArrivalDate(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival Time</label>
                  <input 
                    type="text" 
                    value={formArrivalTime}
                    onChange={(e) => setFormArrivalTime(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Receiver Staff</label>
                  <input 
                    type="text" 
                    value={formReceiver}
                    onChange={(e) => setFormReceiver(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Checker Staff</label>
                  <input 
                    type="text" 
                    value={formChecker}
                    onChange={(e) => setFormChecker(e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>

              {/* Add Categories and Flavors to Receiving */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Products & Quantities Received (Category & Flavor Selection)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-field text-xs font-bold bg-white"
                    >
                      {SELECTA_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Product / Flavor</label>
                    <select
                      id="selecta-flavor-picker"
                      className="input-field text-xs font-bold bg-white"
                      defaultValue=""
                      onChange={(e) => {
                        const prod = INITIAL_PRODUCTS.find(p => p.id === e.target.value);
                        if (prod) {
                          handleAddItemFromCategory(prod);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">-- Choose {selectedCategory} Product to Add --</option>
                      {INITIAL_PRODUCTS.filter(p => p.category === selectedCategory).map(prod => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} ({formatPHP(prod.dealerPrice || prod.unit_price)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2 pt-4">
                    <span className="text-[10px] text-slate-400 font-semibold block text-center">
                      Auto-adds to list below
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Verification Table with Van Damage Tracking and Price Deductions */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase">Product Inspection & Quantity Check</span>
                  <span className="text-[11px] text-emerald-700 font-bold">Total Good Units to Add: {totalUnitsAdded}</span>
                </div>
                <div className="p-3 space-y-3 bg-slate-50 max-h-56 overflow-y-auto">
                  {formItems.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-sm font-bold text-slate-800 flex justify-between items-center">
                        <div>
                          <span>{item.name}</span>
                          <span className="text-xs text-slate-400 font-normal ml-2">({item.category} • {formatPHP(item.price)}/unit)</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveFormItem(index)} className="text-slate-400 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-700 uppercase">Good Qty Recv (Adds to Stock)</label>
                          <input 
                            type="number" 
                            value={item.received}
                            onChange={(e) => handleItemChange(index, 'received', e.target.value)}
                            className="input-field text-xs text-center font-bold text-emerald-700 bg-emerald-50/50" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-red-700 uppercase">Damaged / Melted (Deducted)</label>
                          <input 
                            type="number" 
                            value={item.damaged}
                            onChange={(e) => handleItemChange(index, 'damaged', e.target.value)}
                            className="input-field text-xs text-center font-bold text-red-700 bg-red-50/50" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Missing from Van</label>
                          <input 
                            type="number" 
                            value={item.missing}
                            onChange={(e) => handleItemChange(index, 'missing', e.target.value)}
                            className="input-field text-xs text-center font-bold text-slate-600 bg-slate-50" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Receipt Upload & Van Damage Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-brand-red" /> Photo of Van Delivery Receipt (From Device)
                  </label>
                  {formReceiptPhoto ? (
                    <div className="space-y-1.5">
                      <img src={formReceiptPhoto} alt="Receipt preview" className="w-full h-32 object-cover rounded border" />
                      <div className="flex justify-between">
                        <label className="btn-secondary text-xs py-0.5 px-2 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" /> Change Photo
                          <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                        </label>
                        <button type="button" onClick={() => setFormReceiptPhoto('')} className="text-xs text-red-600 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer block hover:bg-slate-100">
                      <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-brand-red block">Click to upload receipt photo</span>
                      <span className="text-[10px] text-slate-400">Capture with camera or choose file</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} />
                    </label>
                  )}
                </div>

                <div className="border border-red-200 rounded-lg p-3 bg-red-50/40 space-y-2">
                  <label className="block text-xs font-bold text-red-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Damage Deduction Summary
                  </label>
                  <div className="space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span>Total Damage Cost Deducted:</span>
                      <span className="font-bold text-red-700">-{formatPHP(totalDamagedCost)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-200">
                      <span>Net Value Added to Bodega:</span>
                      <span>{formatPHP(netReceivedValue)}</span>
                    </div>
                  </div>
                  <textarea 
                    value={formDamageNotes}
                    onChange={(e) => setFormDamageNotes(e.target.value)}
                    placeholder="Enter notes on broken seals, melted cartons, or unreceived SKUs..."
                    className="input-field resize-none h-14 text-xs bg-white"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs text-slate-500 font-medium">
                {totalUnitsAdded} product units will be marked as Delivered & incremented in inventory.
              </span>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
                <button onClick={handleSaveReceiving} className="btn-primary text-xs">
                  Confirm Delivery & Add to Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase">Receiving Delivery Voucher</span>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedLog.id}</h2>
                  <p className="text-xs text-brand-red font-semibold">{selectedLog.poNumber}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedLog.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div><span className="text-slate-400 font-semibold">Arrival:</span> {selectedLog.arrivalDate} • {selectedLog.arrivalTime}</div>
                <div><span className="text-slate-400 font-semibold">Truck Plate:</span> {selectedLog.truckPlate}</div>
                <div><span className="text-slate-400 font-semibold">Receiver:</span> {selectedLog.receiver}</div>
                <div><span className="text-slate-400 font-semibold">Checker:</span> {selectedLog.checker}</div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Received Products Inspection</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  {selectedLog.items.map((item, idx) => (
                    <div key={idx} className="p-3 text-xs flex justify-between items-center bg-white">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Ordered: {item.ordered} | <strong className="text-emerald-700">Good Recv: {item.received}</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        {item.damaged > 0 && <p className="text-[10px] font-bold text-red-600">-{item.damaged} Damaged</p>}
                        <p className="font-bold text-slate-900 mt-0.5">{formatPHP(item.received * item.price)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 flex justify-between text-sm font-bold border-t border-slate-200">
                    <span>Total Added Stock Value:</span>
                    <span className="text-emerald-700">{formatPHP(selectedLog.totalReceivedValue)}</span>
                  </div>
                </div>
              </div>

              {selectedLog.receiptPhoto && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700 uppercase">Delivery Van Receipt Photo</p>
                  <img src={selectedLog.receiptPhoto} alt="Receipt proof" className="w-full h-44 object-cover rounded-lg border" />
                </div>
              )}

              {selectedLog.damageNotes && (
                <div className="text-xs text-slate-600 bg-red-50 p-3 rounded-md border border-red-200">
                  <span className="font-bold text-red-800">Damage Notes:</span> {selectedLog.damageNotes}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Print Voucher
              </button>
              <button onClick={() => setSelectedLog(null)} className="btn-primary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}