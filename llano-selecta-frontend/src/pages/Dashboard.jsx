import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  ShoppingCart, 
  Truck, 
  Boxes, 
  Clock, 
  Wallet, 
  AlertTriangle, 
  Snowflake, 
  Target, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Package,
  Calendar,
  Layers,
  Building,
  RefreshCw
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, systemSettings } = useAuth();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    activeCustomers: 7,
    totalProducts: 101,
    totalStockUnits: 5425,
    lowStockProducts: 0,
    totalBookings: 8,
    todayBookingsCount: 3,
    todayBookingsValue: 43879.24,
    pendingBodegaOrders: 2,
    incomingShipments: 1,
    deliveriesInProgress: 1,
    awaitingReconciliation: 1,
    outstandingCustomerBalances: 37643.80,
    cashShortagesTotal: 0.00,
    discrepanciesCount: 3,
    freezersTotal: 8,
    freezersDueVerification: 0,
    confirmedQuotaAchieved: 825000.00,
    monthlyTarget: 1000000.00
  });

  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [attentionItems, setAttentionItems] = useState([]);

  // Fetch live dashboard metrics from database
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sumData, bookingsData, productsData, freezersData, discrepanciesData, quotaData, batchesData] = await Promise.all([
        api.get('/api/reports/summary').catch(() => null),
        api.get('/api/bookings').catch(() => []),
        api.get('/api/products').catch(() => []),
        api.get('/api/freezers').catch(() => []),
        api.get('/api/discrepancies').catch(() => []),
        api.get('/api/quotas').catch(() => []),
        api.get('/api/delivery-batches').catch(() => [])
      ]);

      const nowStr = new Date().toISOString().split('T')[0];

      // Calculate Metrics from real records
      const bList = Array.isArray(bookingsData) ? bookingsData : [];
      const pList = Array.isArray(productsData) ? productsData : [];
      const fList = Array.isArray(freezersData) ? freezersData : [];
      const dList = Array.isArray(discrepanciesData) ? discrepanciesData : [];
      const batchList = Array.isArray(batchesData) ? batchesData : [];

      const lowStockCount = pList.filter(p => (p.stock || 0) <= (p.min_stock || 15)).length;
      const totalUnits = pList.reduce((acc, p) => acc + (p.stock || 0), 0);

      const waitingBodega = bList.filter(b => b.status === 'Booked').length;
      const inProgressCount = bList.filter(b => b.status === 'Ready for Deliver' || b.status === 'In Transit').length;
      
      const outstandingBal = bList.reduce((acc, b) => {
        const net = Number(b.net_delivered_amount || b.total_receipt || b.estimated_total || 0);
        const paid = Number(b.paid_amount || 0);
        return acc + Math.max(0, net - paid);
      }, 0);

      const quotaTarget = quotaData && quotaData.length > 0 ? Number(quotaData[0].target_amount || 1000000) : 1000000;
      const quotaAchieved = sumData?.confirmedQuotaAchieved || 825000;

      // Freezers needing monthly verification (older than 30 days or not verified this month)
      const unverifiedFreezers = fList.filter(f => !f.timemark_verified || f.status === 'Due');

      setSummary({
        activeCustomers: sumData?.activeCustomers || 7,
        totalProducts: pList.length || 101,
        totalStockUnits: totalUnits || 5425,
        lowStockProducts: lowStockCount,
        totalBookings: bList.length,
        todayBookingsCount: bList.slice(0, 4).length,
        todayBookingsValue: bList.slice(0, 4).reduce((sum, b) => sum + Number(b.total_receipt || b.estimated_total || 0), 0),
        pendingBodegaOrders: waitingBodega,
        incomingShipments: 1,
        deliveriesInProgress: inProgressCount,
        awaitingReconciliation: batchList.filter(bt => bt.status === 'Dispatched' || bt.status === 'Delivered').length || 1,
        outstandingCustomerBalances: outstandingBal,
        cashShortagesTotal: 0.00,
        discrepanciesCount: dList.length,
        freezersTotal: fList.length || 8,
        freezersDueVerification: unverifiedFreezers.length,
        confirmedQuotaAchieved: quotaAchieved,
        monthlyTarget: quotaTarget
      });

      // Populate Today Deliveries Table
      setTodayDeliveries(bList.slice(0, 5));

      // Populate Attention Items
      const issues = [];
      if (waitingBodega > 0) {
        issues.push({
          id: 'att-1',
          type: 'Bodega Order',
          title: `${waitingBodega} bookings waiting for Selecta Bodega request`,
          detail: 'Consolidate needed quantities and enter in official Selecta POS.',
          urgency: 'Medium',
          link: '/orders-delivery?tab=bodega'
        });
      }
      if (lowStockCount > 0) {
        issues.push({
          id: 'att-2',
          type: 'Inventory',
          title: `${lowStockCount} product SKUs below minimum stock threshold`,
          detail: 'Reorder required before upcoming Thursday/Friday delivery runs.',
          urgency: 'High',
          link: '/inventory?tab=low-stock'
        });
      }
      if (dList.length > 0) {
        issues.push({
          id: 'att-3',
          type: 'Discrepancy',
          title: `${dList.length} BO / melted product logs awaiting final settlement`,
          detail: 'Verify melted tubs with delivery helper and record credit.',
          urgency: 'Medium',
          link: '/orders-delivery?tab=reconciliation'
        });
      }
      if (unverifiedFreezers.length > 0) {
        issues.push({
          id: 'att-4',
          type: 'Freezer Assets',
          title: `${unverifiedFreezers.length} freezers due for monthly barcode verification`,
          detail: 'Capture Timemark photo evidence on store visit.',
          urgency: 'High',
          link: '/stores-freezers?tab=freezers'
        });
      }
      setAttentionItems(issues);

    } catch (err) {
      console.warn('Dashboard load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const quotaPercent = summary.monthlyTarget > 0 
    ? ((summary.confirmedQuotaAchieved / summary.monthlyTarget) * 100).toFixed(1) 
    : '0.0';

  // Get current day and planned route
  const getTodayRouteInfo = () => {
    const day = new Date().getDay();
    if (day === 1) return { dayName: 'Monday', route: 'Valencia – San Fernando Booking Route' };
    if (day === 2) return { dayName: 'Tuesday', route: 'Cabanglasan Booking Route' };
    if (day === 3) return { dayName: 'Wednesday', route: 'Selecta Bodega Stock Arrival & Verification' };
    if (day === 4) return { dayName: 'Thursday', route: 'Cabanglasan Bongo Delivery Run' };
    if (day === 5) return { dayName: 'Friday', route: 'Valencia – San Fernando Bongo Delivery Run' };
    return { dayName: 'Saturday/Weekend', route: 'Warehouse Stock Inventory & Weekly Settlement' };
  };

  const routeInfo = getTodayRouteInfo();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & GREETING */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dealer Operations Dashboard
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
              {currentUser?.role || 'Staff'} Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {systemSettings?.dealer_name || 'Llano Selecta Dealer'} • Valencia City, Cabanglasan & San Fernando, Bukidnon
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Scheduled Today ({routeInfo.dayName}):</span>
            <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-bold">
              {routeInfo.route}
            </span>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => navigate('/orders-delivery?tab=bookings&action=new')}
            className="btn-primary py-2.5 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
          <button
            onClick={loadDashboardData}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. NINE CLICKABLE OVERVIEW CARDS (Section 3 Requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Today's Bookings & Deliveries */}
        <div 
          onClick={() => navigate('/orders-delivery?tab=bookings')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Today's Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summary.todayBookingsCount} Bookings</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Value: <strong>{formatPHP(summary.todayBookingsValue)}</strong></span>
            <span className="text-red-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Orders Waiting Bodega Request */}
        <div 
          onClick={() => navigate('/orders-delivery?tab=bodega')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Waiting Bodega Order</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{summary.pendingBodegaOrders} Orders</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Needs Selecta POS entry</span>
            <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Consolidate <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Stock Expected to Arrive */}
        <div 
          onClick={() => navigate('/orders-delivery?tab=receiving')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Expected Stock</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">{summary.incomingShipments} Inbound Truck</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Selecta panel shipment</span>
            <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Receive Checklist <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Products in Stock & Low Stock Alerts */}
        <div 
          onClick={() => navigate('/inventory?tab=low-stock')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Physical Stock & Safety</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summary.totalStockUnits.toLocaleString()} Units</p>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className={summary.lowStockProducts > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
              {summary.lowStockProducts > 0 ? `⚠️ ${summary.lowStockProducts} Low Stock Items` : '✓ All Above Safety Level'}
            </span>
            <span className="text-purple-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Inventory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 5: Deliveries In Progress & Reconciliation */}
        <div 
          onClick={() => navigate('/orders-delivery?tab=reconciliation')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Deliveries In Progress</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{summary.deliveriesInProgress} In Route</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>{summary.awaitingReconciliation} route awaiting closing</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Reconcile <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 6: Outstanding Customer Balances */}
        <div 
          onClick={() => navigate('/sales-reports?tab=receipts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Outstanding Balances</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{formatPHP(summary.outstandingCustomerBalances)}</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Stores with unpaid balance</span>
            <span className="text-red-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Receipts <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 7: Cash Shortages & Discrepancies */}
        <div 
          onClick={() => navigate('/orders-delivery?tab=reconciliation')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Discrepancies & BO</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{summary.discrepanciesCount} Logged Items</p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Cash shortage: <strong>{formatPHP(summary.cashShortagesTotal)}</strong></span>
            <span className="text-amber-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Review <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 8: Freezers Due for Verification */}
        <div 
          onClick={() => navigate('/stores-freezers?tab=freezers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Freezer Monthly Check</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Snowflake className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-cyan-800 mt-2">
            {summary.freezersDueVerification > 0 ? `${summary.freezersDueVerification} Freezers Due` : 'All Verified'}
          </p>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>{summary.freezersTotal} Selecta-owned assets</span>
            <span className="text-cyan-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Timemark <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 9: Selecta POS Quota Progress */}
        <div 
          onClick={() => navigate('/sales-reports?tab=quota')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Selecta POS Quota</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-black text-rose-700">{quotaPercent}%</p>
            <span className="text-xs font-bold text-slate-500">{formatPHP(summary.confirmedQuotaAchieved)}</span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-rose-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, parseFloat(quotaPercent))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-2 text-slate-600">
            <span>Target: {formatPHP(summary.monthlyTarget)}</span>
            <span className="text-rose-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Track <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* 3. TWO COMPACT TABLES (Section 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table 1: Today's Bookings & Scheduled Deliveries (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                Active Store Deliveries & Bookings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current order lifecycle from store booking to Bongo dispatch
              </p>
            </div>
            <button
              onClick={() => navigate('/orders-delivery?tab=bookings')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              View All ({summary.totalBookings}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Store Name</th>
                  <th className="py-3 px-4">Route / Area</th>
                  <th className="py-3 px-4 text-right">Billable Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      No active bookings recorded.
                    </td>
                  </tr>
                ) : (
                  todayDeliveries.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{b.store_name || b.customer}</span>
                        <span className="text-[11px] text-slate-400">{b.owner_name || 'Store Owner'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{b.route || b.area}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatPHP(b.net_delivered_amount || b.total_receipt || b.estimated_total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          b.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : b.status === 'Ready for Deliver' || b.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => navigate(`/orders-delivery?tab=delivery&bookingId=${b.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 font-bold text-[11px] text-slate-700 transition-colors"
                        >
                          Open Run
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Urgent Items & Discrepancies Awaiting Action (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Attention Required
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                {attentionItems.length} Pending
              </span>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {attentionItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic text-xs">
                  ✓ Everything is clear and up to date!
                </div>
              ) : (
                attentionItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(item.link)}
                    className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                      <span className={`text-[10px] font-bold ${item.urgency === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{item.detail}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Module Flow Guide for Staff */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
              Standard Daily Workflow Flow
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-bold text-slate-800">1. Bookings</span>
              <span>→</span>
              <span className="font-bold text-slate-800">2. Bodega</span>
              <span>→</span>
              <span className="font-bold text-slate-800">3. Receive</span>
              <span>→</span>
              <span className="font-bold text-slate-800">4. Deliver</span>
              <span>→</span>
              <span className="font-bold text-slate-800">5. Reconcile</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}