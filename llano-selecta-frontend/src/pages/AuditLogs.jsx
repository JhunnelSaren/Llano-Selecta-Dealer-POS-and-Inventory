import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Shield, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Download, 
  AlertTriangle, 
  Activity, 
  Lock, 
  X,
  IceCream,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function AuditLogs() {
  // Mock Audit Log Records based on Llano SELECTA operational events
  const [logs, setLogs] = useState([
    {
      id: 'AUD-2026-9812',
      timestamp: '2026-10-09T10:32:15',
      user: 'Juan Driver',
      role: 'Driver / Booker',
      action: 'Recorded Missing Products',
      module: 'Discrepancies',
      severity: 'Medium',
      description: 'Juan recorded 2x Cornetto Vanilla (₱56.00 deduction) missing for Aling Nena Sari-Sari on DEL-2026-102.',
      ipAddress: '192.168.1.45',
      details: {
        store: 'Aling Nena Sari-Sari',
        product: 'Cornetto Vanilla 110ml',
        orderedQty: 20,
        deliveredQty: 18,
        missingQty: 2,
        deductionAmount: 56.00,
        reason: 'Forgotten in Bongo Ice Box #001 during packing'
      }
    },
    {
      id: 'AUD-2026-9811',
      timestamp: '2026-10-09T09:45:00',
      user: 'Pedro Warehouse',
      role: 'Warehouse Staff',
      action: 'Stock Receiving Variance',
      module: 'Receiving',
      severity: 'High',
      description: 'Pedro recorded receiving 195/200 Cornetto Vanilla on RCV-2026-001 with 5 damaged items from SELECTA Panel #4.',
      ipAddress: '192.168.1.12',
      details: {
        poReference: 'PO-SEL-9042',
        truckPlate: 'KAB-4819',
        damagedQty: 5,
        missingQty: 0,
        remarks: 'Crushed packaging upon opening truck door'
      }
    },
    {
      id: 'AUD-2026-9810',
      timestamp: '2026-10-09T08:15:30',
      user: 'Maria Cashier',
      role: 'Cashier',
      action: 'Payment Shortage Logged',
      module: 'Finance',
      severity: 'High',
      description: 'Maria recorded cash payment of ₱9,000.00 against ₱9,826.00 net bill for San Isidro Mini-Mart (Shortage: ₱826.00).',
      ipAddress: '192.168.1.18',
      details: {
        saleId: 'SALE-2026-102',
        expectedAmount: 9826.00,
        receivedAmount: 9000.00,
        shortageAmount: 826.00,
        store: 'San Isidro Mini-Mart'
      }
    },
    {
      id: 'AUD-2026-9809',
      timestamp: '2026-10-08T16:20:10',
      user: 'Admin Owner',
      role: 'OWNER / ADMIN',
      action: 'Quota Target Updated',
      module: 'Quota',
      severity: 'Low',
      description: 'Admin Owner updated October 2026 SELECTA Quota target to ₱1,000,000.00.',
      ipAddress: '192.168.1.10',
      details: {
        month: 'October 2026',
        oldTarget: 950000.00,
        newTarget: 1000000.00
      }
    },
    {
      id: 'AUD-2026-9808',
      timestamp: '2026-10-08T14:10:45',
      user: 'Juan Booker',
      role: 'Booker',
      action: 'Created Booking',
      module: 'Bookings',
      severity: 'Low',
      description: 'Juan Booker created digital booking BK-2026-1001 for Aling Nena Sari-Sari (Est. Total: ₱4,065.00).',
      ipAddress: '192.168.1.45',
      details: {
        bookingId: 'BK-2026-1001',
        store: 'Aling Nena Sari-Sari',
        totalItems: 45,
        estimatedTotal: 4065.00
      }
    },
    {
      id: 'AUD-2026-9807',
      timestamp: '2026-10-08T11:05:22',
      user: 'Juan Booker',
      role: 'Booker',
      action: 'Logged Timemark Scan',
      module: 'Freezer',
      severity: 'Low',
      description: 'Juan Booker uploaded monthly Timemark barcode verification photo for SELECTA Freezer SEL-FRZ-8821.',
      ipAddress: '192.168.1.45',
      details: {
        freezerNumber: 'SEL-FRZ-8821',
        timemarkRef: 'TM-908124',
        store: 'Aling Nena Sari-Sari'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    return matchesSearch && matchesModule && matchesSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
          <p className="text-sm text-slate-500">Real-time security log of operational changes, inventory adjustments, and payments</p>
        </div>
        <button className="btn-secondary flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Export Logs (CSV)
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-slate-800 flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Recorded Logs</p>
            <h3 className="text-lg font-bold text-slate-900">{logs.length} Events</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Severity Alerts</p>
            <h3 className="text-lg font-bold text-brand-red">
              {logs.filter(l => l.severity === 'High').length} Discrepancies
            </h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users Today</p>
            <h3 className="text-lg font-bold text-slate-900">4 Staff Active</h3>
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security Engine</p>
            <h3 className="text-lg font-bold text-slate-900">Active (ACID)</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by user, action, description, or log ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select 
              value={moduleFilter} 
              onChange={(e) => setModuleFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-40"
            >
              <option value="All">All Modules</option>
              <option value="Bookings">Bookings</option>
              <option value="Receiving">Stock Receiving</option>
              <option value="Discrepancies">BO (Melted) Log</option>
              <option value="Finance">Finance & POS</option>
              <option value="Freezer">Freezer & Timemark</option>
              <option value="Quota">Quota</option>
            </select>

            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="input-field cursor-pointer sm:w-36"
            >
              <option value="All">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Log Ref / Timestamp</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">User & Role</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Module</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action Description</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Severity</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold font-mono text-slate-800">{log.id}</div>
                      <div className="text-[11px] text-slate-400">{formatDate(log.timestamp)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{log.user}</div>
                      <div className="text-[11px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-700 max-w-md truncate">
                      <strong className="text-slate-900 block font-semibold">{log.action}</strong>
                      {log.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        log.severity === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                        log.severity === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {log.severity}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <History className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No audit logs found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Audit Trail Details</h2>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLog.action}</h3>
                  <p className="text-slate-500">{selectedLog.id} • {formatDate(selectedLog.timestamp)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  selectedLog.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedLog.severity}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">User:</span><span className="font-bold text-slate-800">{selectedLog.user} ({selectedLog.role})</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Module:</span><span className="font-semibold text-slate-800">{selectedLog.module}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">IP Address:</span><span className="font-mono text-slate-800">{selectedLog.ipAddress}</span></div>
              </div>

              <div>
                <p className="font-bold text-slate-700 uppercase mb-1">Full Action Summary</p>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedLog.description}
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <p className="font-bold text-slate-700 uppercase mb-1">Event Payload Data</p>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto font-mono text-[11px]">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button onClick={() => setSelectedLog(null)} className="btn-primary text-xs">Close Audit Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}