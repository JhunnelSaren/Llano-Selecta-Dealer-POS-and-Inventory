import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Boxes,
  Building2,
  TrendingUp,
  Settings as SettingsIcon,
  X,
  IceCream
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser, systemSettings } = useAuth();

  // Exactly Five Primary Navigation Items (Section 3 Requirements)
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'LIVE'
    },
    {
      to: '/orders-delivery',
      label: 'Orders & Delivery',
      icon: Layers,
      badge: null
    },
    {
      to: '/inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: null
    },
    {
      to: '/stores-freezers',
      label: 'Stores & Freezers',
      icon: Building2,
      badge: null
    },
    {
      to: '/sales-reports',
      label: 'Sales & Reports',
      icon: TrendingUp,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Container (Fixed w-72 on Desktop) */}
      <aside
        className={`no-print fixed top-0 left-0 z-50 h-screen w-72 bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Dealership Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 bg-slate-950 border-b border-slate-800/80">
          <RouterNavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-2 text-white shadow-lg shadow-red-600/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              {systemSettings?.dealer_logo_url ? (
                <img
                  src={systemSettings.dealer_logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <IceCream className="w-6 h-6" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                LLANO <span className="text-red-500">SELECTA</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
                Dealer POS & Inventory
              </span>
            </div>
          </RouterNavLink>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            aria-label="Close Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation Items (Exactly 5 Items) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Primary Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.to);
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </RouterNavLink>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 my-2"></div>

          {/* Settings and Staff Management (Behind clearly labeled menu or gear icon) */}
          <RouterNavLink
            to="/settings"
            onClick={onClose}
            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
              location.pathname.startsWith('/settings')
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            <span className="flex-1 text-left">Settings & Staff</span>
          </RouterNavLink>
        </div>

        {/* Sidebar Footer with Active Role and Live Database Status */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 font-medium">PostgreSQL 18</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              {currentUser?.role || 'Staff'}
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Authorized User'}</p>
              <p className="text-[10px] text-slate-400 truncate">@{currentUser?.username || 'user'}</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}