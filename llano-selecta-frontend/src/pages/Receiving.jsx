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
  IceCream
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Receiving() {
  // Available SELECTA Products for receiving logs
  const catalogProducts = [
    { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', price: 28.00 },
    { id: 'PRD-002', name: 'Cornetto Chocolate 110ml', price: 28.00 },
    { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', price: 58.00 },
    { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', price: 195.00 },
    { id: 'PRD-005', name: 'SELECTA 3-in-1 Double Dutch 1.3L', price: 165.00 }
  ];

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
      status: 'Completed with Variance',
      remarks: '5 Cornettos crushed upon opening truck door. Recorded in delivery voucher.',
      items: [
        { id: 'PRD-001', name: 'Cornetto Vanilla 110ml', ordered: 200, received: 195, damaged: 5, missing: 0, price: 28.00 },
        { id: 'PRD-003', name: 'Magnum Classic Almond 80ml', ordered: 100, received: 100, damaged: 0, missing: 0, price: 58.00 },
        { id: 'PRD-004', name: 'Big Scoop Chocolate Fudge 1.5L', ordered: 50, received: 48, damaged: 0, missing: 2, price: 195.00 }
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
      status: 'Complete & Clean',
      remarks: 'All items received in good condition.',
      items: [
        { id: 'PRD-002', name: 'Cornetto Chocolate 110ml', ordered: 300, received: 300, damaged: 0, missing: 0, price: 28.00 },
        { id: 'PRD-005', name: 'SELECTA 3-in-1 Double Dutch 1.3L', ordered: 80, received: 80, damaged: 0, missing: 0, price: 165.00 }
      ],
      totalReceivedValue: 21600.00
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // New Receiving Form State
  const [formPoNumber, setFormPoNumber] = useState('PO-SEL-9045');
  const [formTruckPlate, setFormTruckPlate] = useState('');
  const [formDriverInfo, setFormDriverInfo] = useState('SELECTA Main Panel');
  const [formArrivalDate, setFormArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [formArrivalTime, setFormArrivalTime] = useState('10:00 AM');
  const [formReceiver, setFormReceiver] = useState('Pedro Warehouse');
  const [formChecker, setFormChecker] = useState('Juan Checker');
  const [formRemarks, setFormRemarks] = useState('');

  const [formItems, setFormItems] = useState([
    { productId: 'PRD-001', name: 'Cornetto Vanilla 110ml', ordered: 100, received: 100, damaged: 0, missing: 0, price: 28.00 },
    { productId: 'PRD-003', name: 'Magnum Classic Almond 80ml', ordered: 50, received: 48, damaged: 2, missing: 0, price: 58.00 }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...formItems];
    const val = Math.max(0, parseInt(value) || 0);
    updated[index][field] = val;

    // Auto calculate missing if ordered > received + damaged
    if (field === 'received' || field === 'damaged') {
      const rec = field === 'received' ? val : updated[index].received;
      const dam = field === 'damaged' ? val : updated[index].damaged;
      updated[index].missing = Math.max(0, updated[index].ordered - (rec + dam));
    }

    setFormItems(updated);
  };

  const handleSaveReceiving = () => {
    if (!formTruckPlate.trim()) {
      alert('Please enter the truck plate number.');
      return;
    }

    const hasDamagedOrMissing = formItems.some(i => i.damaged > 0 || i.missing > 0);
    const totalVal = formItems.reduce((sum, item) => sum + (item.received * item.price), 0);

    const newLog = {
      id: `RCV-2026-${100 + receivingLogs.length + 1}`,
      poNumber: formPoNumber,
      truckPlate: formTruckPlate.toUpperCase(),
      driverInfo: formDriverInfo,
      arrivalDate: formArrivalDate,
      arrivalTime: formArrivalTime,
      receiver: formReceiver,
      checker: formChecker,
      status: hasDamagedOrMissing ? 'Completed with Variance' : 'Complete & Clean',
      remarks: formRemarks,
      items: formItems,
      totalReceivedValue: totalVal
    };

    setReceivingLogs([newLog, ...receivingLogs]);
    setIsModalOpen(false);
    // Reset Form
    setFormTruckPlate('');
    setFormRemarks('');
  };

  // Filter logs
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
          <h1 className="text-2xl font-bold text-slate-900">Stock Receiving & Truck Arrival</h1>
          <p className="text-sm text-slate-500">Inbound SELECTA bodega delivery verification and variance logging</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Receive SELECTA Truck
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Receiving ID, PO reference, or truck plate..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Complete & Clean">Complete & Clean</option>
              <option value="Completed with Variance">With Variance</option>
            </select>
          </div>
        </div>

        {/* Receiving Logs Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Receiving Ref</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">SELECTA PO & Truck</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Arrival Date/Time</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff (Receiver/Checker)</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Received Value</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const totalDamaged = log.items.reduce((sum, i) => sum + i.damaged, 0);
                  const totalMissing = log.items.reduce((sum, i) => sum + i.missing, 0);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-800">{log.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-brand-red">{log.poNumber}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" /> {log.truckPlate} ({log.driverInfo})
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        <div className="font-medium text-slate-800">{log.arrivalDate}</div>
                        <div className="text-xs text-slate-400">{log.arrivalTime}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        <div><span className="text-xs font-semibold text-slate-400">Rec:</span> {log.receiver}</div>
                        <div><span className="text-xs font-semibold text-slate-400">Chk:</span> {log.checker}</div>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">
                        {formatPHP(log.totalReceivedValue)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          log.status === 'Complete & Clean' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {log.status === 'Complete & Clean' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {log.status}
                        </span>
                        {(totalDamaged > 0 || totalMissing > 0) && (
                          <div className="text-[10px] text-red-600 font-semibold mt-1">
                            {totalDamaged > 0 && `${totalDamaged} damaged `}
                            {totalMissing > 0 && `${totalMissing} missing`}
                          </div>
                        )}
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
                    No stock receiving records found matching "{searchTerm}"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Inbound SELECTA Truck Entry</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SELECTA PO Reference</label>
                  <select 
                    value={formPoNumber}
                    onChange={(e) => setFormPoNumber(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option value="PO-SEL-9045">PO-SEL-9045 (Expected Today)</option>
                    <option value="PO-SEL-9046">PO-SEL-9046 (In Transit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Truck Plate Number <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    value={formTruckPlate}
                    onChange={(e) => setFormTruckPlate(e.target.value)}
                    placeholder="e.g. KAB-4819" 
                    className="input-field uppercase" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Truck/Panel Details</label>
                  <input 
                    type="text" 
                    value={formDriverInfo}
                    onChange={(e) => setFormDriverInfo(e.target.value)}
                    className="input-field" 
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
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Arrival Time</label>
                  <input 
                    type="text" 
                    value={formArrivalTime}
                    onChange={(e) => setFormArrivalTime(e.target.value)}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Receiver Staff</label>
                  <input 
                    type="text" 
                    value={formReceiver}
                    onChange={(e) => setFormReceiver(e.target.value)}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Checker Staff</label>
                  <input 
                    type="text" 
                    value={formChecker}
                    onChange={(e) => setFormChecker(e.target.value)}
                    className="input-field" 
                  />
                </div>
              </div>

              {/* Items Verification Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase">Product Inspection & Quantity Check</span>
                  <span className="text-[11px] text-slate-500">Check packaging & ice box condition</span>
                </div>
                <div className="p-3 space-y-3 bg-slate-50">
                  {formItems.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-sm font-bold text-slate-800 flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-xs text-slate-500">Ordered: <strong className="text-slate-800">{item.ordered}</strong></span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-700 uppercase">Good Qty Recv</label>
                          <input 
                            type="number" 
                            value={item.received}
                            onChange={(e) => handleItemChange(index, 'received', e.target.value)}
                            className="input-field text-xs text-center font-bold text-emerald-700 bg-emerald-50/50" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-amber-700 uppercase">Damaged / Melted</label>
                          <input 
                            type="number" 
                            value={item.damaged}
                            onChange={(e) => handleItemChange(index, 'damaged', e.target.value)}
                            className="input-field text-xs text-center font-bold text-amber-700 bg-amber-50/50" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-red-700 uppercase">Missing Qty</label>
                          <input 
                            type="number" 
                            value={item.missing}
                            onChange={(e) => handleItemChange(index, 'missing', e.target.value)}
                            className="input-field text-xs text-center font-bold text-red-700 bg-red-50/50" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Receiving Remarks / Voucher Notes</label>
                <textarea 
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="Record any physical damage, driver notes, or seals info..."
                  className="input-field resize-none h-16"
                ></textarea>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveReceiving} className="btn-primary text-xs">Confirm Stock Receiving & Ledger Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print">
              <span className="text-xs font-bold text-slate-500">RECEIVING VOUCHER REPORT</span>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedLog.id}</h2>
                  <p className="text-xs text-brand-red font-semibold">{selectedLog.poNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{selectedLog.arrivalDate} • {selectedLog.arrivalTime}</p>
                  <p className="text-xs font-semibold text-slate-700">{selectedLog.truckPlate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 text-xs gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div><span className="text-slate-400 font-semibold">Receiver:</span> {selectedLog.receiver}</div>
                <div><span className="text-slate-400 font-semibold">Checker:</span> {selectedLog.checker}</div>
                <div className="col-span-2"><span className="text-slate-400 font-semibold">Truck/Panel:</span> {selectedLog.driverInfo}</div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase">Received Products Inspection</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  {selectedLog.items.map((item, idx) => (
                    <div key={idx} className="p-3 text-xs flex justify-between items-center bg-white">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-500">Ordered: {item.ordered} | Good Recv: <strong className="text-emerald-700">{item.received}</strong></p>
                      </div>
                      <div className="text-right">
                        {item.damaged > 0 && <p className="text-[10px] font-bold text-amber-600">{item.damaged} Damaged</p>}
                        {item.missing > 0 && <p className="text-[10px] font-bold text-red-600">{item.missing} Missing</p>}
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

              {selectedLog.remarks && (
                <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span className="font-bold text-amber-800">Inspection Note:</span> {selectedLog.remarks}
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