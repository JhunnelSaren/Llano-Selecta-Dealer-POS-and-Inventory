import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  MapPin,
  Snowflake,
  ClipboardList,
  ShoppingCart,
  Truck,
  Boxes,
  AlertTriangle,
  Receipt,
  CreditCard,
  Scale,
  Camera,
  Target,
  BarChart3,
  Shield,
  History,
  X,
  IceCream
} from 'lucide-react';

const navigationGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'MASTER DATA',
    items: [
      { name: 'Customers / Stores', path: '/master/customers', icon: Users },
      { name: 'Products', path: '/master/products', icon: Package },
      { name: 'Employees', path: '/master/employees', icon: UserCheck },
      { name: 'Areas & Routes', path: '/master/routes', icon: MapPin },
      { name: 'Freezers Catalog', path: '/master/freezers', icon: Snowflake }
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Bookings', path: '/operations/bookings', icon: ClipboardList },
      { name: 'SELECTA POs', path: '/operations/selecta-orders', icon: ShoppingCart },
      { name: 'Stock Receiving', path: '/operations/receiving', icon: Boxes },
      { name: 'Inventory Ledger', path: '/operations/inventory', icon: Package }
    ]
  },
  {
    title: 'DELIVERY & DISCREPANCIES',
    items: [
      { name: 'Dispatch & Packing', path: '/delivery/dispatch', icon: Truck },
      { name: 'Missing & BO Log', path: '/delivery/discrepancies', icon: AlertTriangle }
    ]
  },
  {
    title: 'SALES & FINANCE',
    items: [
      { name: 'POS / Sales', path: '/finance/pos', icon: Receipt },
      { name: 'Payments Collection', path: '/finance/payments', icon: CreditCard },
      { name: 'Cash Reconciliation', path: '/finance/reconciliation', icon: Scale }
    ]
  },
  {
    title: 'MONITORING',
    items: [
      { name: 'Freezer Timemark', path: '/monitoring/timemark', icon: Camera },
      { name: 'SELECTA Quota', path: '/monitoring/quota', icon: Target }
    ]
  },
  {
    title: 'SYSTEM & REPORTS',
    items: [
      { name: 'Reports Center', path: '/reports', icon: BarChart3 },
      { name: 'User Management', path: '/admin/users', icon: Shield },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: History }
    ]
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`no-print fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-brand-red p-2 rounded-lg text-white shadow-md shadow-brand-red/20">
              <IceCream className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-none tracking-tight">Llano SELECTA</h1>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Dealer POS & Inventory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

                  return (
                    <RouterNavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-brand-red text-white shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </RouterNavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>v1.0.0 Stable</span>
          <span className="text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
      </aside>
    </>
  );
}