import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Truck, 
  Camera, 
  AlertCircle, 
  PackageSearch, 
  DollarSign, 
  IceCream,
  ArrowRight
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Dashboard() {
  // Mock Data based on Llano SELECTA Business Rules
  const metrics = {
    todaySales: 45500,
    pendingDeliveries: 4,
    missingScans: 12,
    shortages: 1500
  };

  const quota = {
    target: 1000000,
    current: 735500,
  };
  const quotaPercentage = ((quota.current / quota.target) * 100).toFixed(2);

  const alerts = [
    { id: 1, type: 'missing', title: 'Missing Products', desc: 'Store ABC: 2x Cornetto missing', time: '1 hour ago' },
    { id: 2, type: 'bo', title: 'BO / Melted Logged', desc: 'Store XYZ: 3x Magnum melted on arrival', time: '2 hours ago' },
    { id: 3, type: 'shortage', title: 'Payment Shortage', desc: 'Driver Juan: ₱1,000 short from ₱10k receipt', time: '3 hours ago' },
  ];

  const lowStock = [
    { id: 1, name: 'Big Scoop Chocolate 1.5L', stock: 5, status: 'Critical' },
    { id: 2, name: 'Magnum Almond Classic', stock: 12, status: 'Low' },
    { id: 3, name: 'Cornetto Vanilla', stock: 18, status: 'Low' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Dashboard</h1>
          <p className="text-sm text-slate-500">October 2026 Overview • Llano SELECTA Dealer</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <IceCream className="w-4 h-4" /> New Booking
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Net Sales</p>
            <h3 className="text-xl font-bold text-slate-800">{formatPHP(metrics.todaySales)}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-brand-red">
          <div className="p-3 bg-brand-light text-brand-red rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Today's Shortages</p>
            <h3 className="text-xl font-bold text-brand-red">{formatPHP(metrics.shortages)}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Deliveries</p>
            <h3 className="text-xl font-bold text-slate-800">{metrics.pendingDeliveries} Routes</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Missing Timemark Scans</p>
            <h3 className="text-xl font-bold text-slate-800">{metrics.missingScans} Freezers</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quota Progress (Takes up 2 columns) */}
        <div className="card lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Monthly SELECTA Quota</h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">October</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Current Sales</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatPHP(quota.current)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Remaining Amount</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{formatPHP(quota.target - quota.current)}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-brand-red">{quotaPercentage}% Achieved</span>
              <span className="text-slate-500 font-medium">Target: {formatPHP(quota.target)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-brand-red h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${quotaPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Needed Alerts */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Action Required</h2>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex gap-3 items-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  alert.type === 'missing' ? 'bg-brand-red' : 
                  alert.type === 'bo' ? 'bg-amber-500' : 'bg-slate-800'
                }`} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-brand-red font-semibold flex items-center justify-center gap-1 hover:text-brand-dark transition-colors">
            View Discrepancy Log <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inventory Alerts Table */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <PackageSearch className="w-5 h-5 text-brand-red" />
          <h2 className="text-lg font-bold text-slate-800">Low Stock Alerts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Product</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Current Stock</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStock.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{item.stock} boxes</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      item.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-brand-red hover:text-brand-dark text-sm font-medium">Add to PO</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}