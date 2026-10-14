import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Truck, 
  Snowflake, 
  AlertCircle, 
  PackageSearch, 
  DollarSign, 
  IceCream,
  ArrowRight,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BarChart3,
  Plus
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('week'); // 'today' | 'week' | 'month'

  // Dynamic Metrics based on Time Filter
  const metricsData = {
    today: {
      sales: 45500,
      shortages: 1500,
      pendingDeliveries: 4,
      freezersDeployed: 48,
      salesTrend: [
        { label: '8 AM', value: 4500 },
        { label: '10 AM', value: 8900 },
        { label: '12 PM', value: 14200 },
        { label: '2 PM', value: 11000 },
        { label: '4 PM', value: 6900 }
      ]
    },
    week: {
      sales: 312800,
      shortages: 4200,
      pendingDeliveries: 12,
      freezersDeployed: 48,
      salesTrend: [
        { label: 'Mon', value: 42000 },
        { label: 'Tue', value: 54000 },
        { label: 'Wed', value: 38000 },
        { label: 'Thu', value: 61000 },
        { label: 'Fri', value: 72000 },
        { label: 'Sat', value: 45800 }
      ]
    },
    month: {
      sales: 735500,
      shortages: 8950,
      pendingDeliveries: 18,
      freezersDeployed: 48,
      salesTrend: [
        { label: 'Week 1', value: 180000 },
        { label: 'Week 2', value: 215000 },
        { label: 'Week 3', value: 195000 },
        { label: 'Week 4', value: 145500 }
      ]
    }
  };

  const currentMetrics = metricsData[timeFilter];

  const quota = {
    target: 1000000,
    current: 735500,
  };
  const quotaPercentage = ((quota.current / quota.target) * 100).toFixed(1);

  // Delivery Status breakdown as required in Requirement 8
  const deliveryStatusSummary = {
    total: 38,
    delivered: 24,
    booked: 9,
    backload: 3,
    draft: 2
  };

  const alerts = [
    { id: 1, type: 'backload', title: 'Backload Alert', desc: 'Store "Lumbayao Refreshments" was closed during delivery (2 boxes)', time: '15 mins ago', link: '/operations/bookings' },
    { id: 2, type: 'missing', title: 'Missing Discrepancy', desc: 'Batangan Route: 2x Cornetto missing in ice box #001', time: '1 hour ago', link: '/delivery/discrepancies' },
    { id: 3, type: 'bo', title: 'BO / Melted Logged', desc: 'San Isidro Mini-Mart: 3x Magnum soft on arrival', time: '2 hours ago', link: '/delivery/discrepancies' },
    { id: 4, type: 'shortage', title: 'Payment Shortage', desc: 'San Isidro Mini-Mart: ₱826 unpaid balance pending next trip', time: '3 hours ago', link: '/finance/payments' },
  ];

  const lowStock = [
    { id: 1, name: 'Big Scoop Chocolate 1.5L', stock: 5, status: 'Critical' },
    { id: 2, name: 'Magnum Almond Classic', stock: 12, status: 'Low' },
    { id: 3, name: 'Cornetto Vanilla 110ml', stock: 18, status: 'Low' },
  ];

  // Maximum value for SVG scaling
  const maxSalesTrend = Math.max(...currentMetrics.salesTrend.map(d => d.value));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Dashboard</h1>
          <p className="text-sm text-slate-500">
            Real-time operations, delivery status, and Selecta inventory metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeFilter === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              This Month
            </button>
          </div>

          <button 
            onClick={() => navigate('/operations/bookings')}
            className="btn-primary flex items-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" /> Create New Booking
          </button>
        </div>
      </div>

      {/* Top KPI Cards (All Clickable!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/finance/pos')}
          className="card cursor-pointer hover:shadow-md transition-all flex items-center gap-4 border-l-4 border-l-emerald-500 group"
        >
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Net Sales ({timeFilter})</p>
            <h3 className="text-xl font-bold text-slate-800">{formatPHP(currentMetrics.sales)}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Click to view POS Invoices →</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/finance/payments')}
          className="card cursor-pointer hover:shadow-md transition-all flex items-center gap-4 border-l-4 border-l-brand-red group"
        >
          <div className="p-3 bg-red-100 text-brand-red rounded-lg group-hover:scale-105 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Shortages ({timeFilter})</p>
            <h3 className="text-xl font-bold text-brand-red">{formatPHP(currentMetrics.shortages)}</h3>
            <span className="text-[11px] text-brand-red font-medium">Click to view Remittances →</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/delivery/dispatch')}
          className="card cursor-pointer hover:shadow-md transition-all flex items-center gap-4 border-l-4 border-l-blue-500 group"
        >
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Pending Bongo Dispatch</p>
            <h3 className="text-xl font-bold text-slate-800">{currentMetrics.pendingDeliveries} Trips</h3>
            <span className="text-[11px] text-blue-600 font-medium">Click to view Dispatch & Packing →</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/master/freezers')}
          className="card cursor-pointer hover:shadow-md transition-all flex items-center gap-4 border-l-4 border-l-amber-500 group"
        >
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-105 transition-transform">
            <Snowflake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Active Deployed Freezers</p>
            <h3 className="text-xl font-bold text-slate-800">{currentMetrics.freezersDeployed} Units</h3>
            <span className="text-[11px] text-amber-600 font-medium">Click to view Freezer Catalog →</span>
          </div>
        </div>
      </div>

      {/* Delivery Status Overview Section (Requirement 8) */}
      <div className="card space-y-4 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-red" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Store Delivery Status Overview</h2>
              <p className="text-xs text-slate-500">Live fulfillment status of today's store orders</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/operations/bookings')}
            className="text-xs font-semibold text-brand-red hover:underline flex items-center gap-1"
          >
            Manage All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Delivered */}
          <div 
            onClick={() => navigate('/operations/bookings')}
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered
              </span>
              <span className="text-xl font-extrabold text-emerald-700">{deliveryStatusSummary.delivered}</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full" 
                style={{ width: `${(deliveryStatusSummary.delivered / deliveryStatusSummary.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">Successfully fulfilled</span>
          </div>

          {/* Booked / In Transit */}
          <div 
            onClick={() => navigate('/operations/bookings')}
            className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Booked
              </span>
              <span className="text-xl font-extrabold text-blue-700">{deliveryStatusSummary.booked}</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${(deliveryStatusSummary.booked / deliveryStatusSummary.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-blue-600 font-medium block mt-1">In transit / scheduled</span>
          </div>

          {/* Backload (Failed / Customer Closed) */}
          <div 
            onClick={() => navigate('/operations/bookings')}
            className="p-3.5 rounded-xl bg-red-50 border border-red-100 cursor-pointer hover:border-red-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-brand-red" /> Backload
              </span>
              <span className="text-xl font-extrabold text-brand-red">{deliveryStatusSummary.backload}</span>
            </div>
            <div className="w-full bg-red-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-brand-red h-1.5 rounded-full" 
                style={{ width: `${(deliveryStatusSummary.backload / deliveryStatusSummary.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-brand-red font-medium block mt-1">Store closed / failed delivery</span>
          </div>

          {/* Draft */}
          <div 
            onClick={() => navigate('/operations/bookings')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Draft
              </span>
              <span className="text-xl font-extrabold text-slate-800">{deliveryStatusSummary.draft}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-slate-500 h-1.5 rounded-full" 
                style={{ width: `${(deliveryStatusSummary.draft / deliveryStatusSummary.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Unconfirmed orders</span>
          </div>
        </div>
      </div>

      {/* Main Graphs & Quota Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Sales Chart */}
        <div className="card lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-red" />
              <div>
                <h2 className="text-base font-bold text-slate-800">Sales Trend & Volume</h2>
                <p className="text-xs text-slate-500">Recorded dealer revenues ({timeFilter})</p>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-800">{formatPHP(currentMetrics.sales)}</span>
          </div>

          {/* Functional Graph Display */}
          <div className="h-48 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
            {currentMetrics.salesTrend.map((point, index) => {
              const heightPercent = Math.max(15, (point.value / maxSalesTrend) * 100);
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 mb-1">
                    {formatPHP(point.value)}
                  </div>
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-red to-red-400 group-hover:from-red-600 group-hover:to-red-500 transition-all duration-300 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate max-w-full">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>Peak Period: {currentMetrics.salesTrend.reduce((p, c) => c.value > p.value ? c : p).label}</span>
            <span className="font-semibold text-brand-red">Average: {formatPHP(currentMetrics.sales / currentMetrics.salesTrend.length)}</span>
          </div>
        </div>

        {/* Action Needed Alerts */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800">Action Required</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {alerts.length} alerts
            </span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                onClick={() => navigate(alert.link)}
                className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  alert.type === 'missing' ? 'bg-brand-red' : 
                  alert.type === 'bo' ? 'bg-amber-500' : 
                  alert.type === 'backload' ? 'bg-red-600' : 'bg-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800">{alert.title}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-tight">{alert.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/delivery/discrepancies')}
            className="w-full pt-2 text-xs text-brand-red font-semibold flex items-center justify-center gap-1 hover:underline"
          >
            Go to Discrepancy & BO Log <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quota Progress & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Quota Gauge */}
        <div className="card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-bold text-slate-800">Monthly SELECTA Quota</h2>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">October 2026</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Current Sales</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{formatPHP(quota.current)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Remaining Target</p>
                <p className="text-lg font-bold text-brand-red mt-1">{formatPHP(quota.target - quota.current)}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-bold text-brand-red">{quotaPercentage}% Achieved</span>
              <span className="text-slate-500 font-medium">Target: {formatPHP(quota.target)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-brand-red h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${quotaPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="card lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-brand-red" />
              <div>
                <h2 className="text-base font-bold text-slate-800">Low Stock Inventory Alerts</h2>
                <p className="text-xs text-slate-500">Products requiring replenishment from SELECTA bodega</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/operations/selecta-orders')}
              className="text-xs font-semibold text-brand-red hover:underline flex items-center gap-1"
            >
              Create SELECTA PO <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase">Current Stock</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="py-2.5 px-3 text-xs font-semibold text-slate-600 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStock.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-xs font-bold text-slate-800">{item.name}</td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 font-semibold">{item.stock} boxes</td>
                    <td className="py-2.5 px-3 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button 
                        onClick={() => navigate('/operations/selecta-orders')}
                        className="btn-secondary text-[11px] py-1 px-2.5 text-brand-red hover:bg-red-50"
                      >
                        + Add to PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}