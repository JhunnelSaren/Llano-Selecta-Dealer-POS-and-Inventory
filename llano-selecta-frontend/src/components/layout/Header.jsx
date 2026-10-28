import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  IceCream, 
  X, 
  CheckCircle2, 
  LogOut, 
  ChevronDown, 
  Settings as SettingsIcon,
  ShieldCheck,
  Layers,
  Boxes,
  Building2,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, systemSettings } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Dynamic Page Title & Icon
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/orders-delivery')) {
      return { title: 'Orders & Delivery', desc: 'Booking, Bodega Orders, Receiving, Delivery & Reconciliation', icon: Layers };
    }
    if (path.startsWith('/inventory')) {
      return { title: 'Dealer Inventory', desc: 'Physical Stock, Movements Ledger, Damaged/BO & Low Stock Alerts', icon: Boxes };
    }
    if (path.startsWith('/stores-freezers')) {
      return { title: 'Stores & Freezers', desc: 'Store Directory, Route Assignments & Timemark Freezers', icon: Building2 };
    }
    if (path.startsWith('/sales-reports')) {
      return { title: 'Sales & Reports', desc: 'Customer Receipts, Cash Reconciliation, POS Quota & Business Reports', icon: TrendingUp };
    }
    if (path.startsWith('/settings')) {
      return { title: 'Settings & Staff Management', desc: 'Dealership Configuration, Staff Accounts, Crew Roster & Audit Logs', icon: SettingsIcon };
    }
    return { title: 'Dashboard Overview', desc: 'Llano Selecta Dealer Operations • Real-time Metrics & Actions', icon: LayoutDashboard };
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Database Online',
      message: 'All daily Selecta dealer operations and database systems are synchronized.',
      time: 'Live Sync',
      type: 'success'
    }
  ];

  return (
    <header className="no-print h-20 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Mobile Drawer Toggle & Dynamic Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-10 h-10 rounded-xl bg-red-50 text-red-600 items-center justify-center font-bold">
            <PageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
              {pageInfo.title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {pageInfo.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Settings Gear Icon, Notifications & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Settings Gear Icon Shortcut */}
        <button
          onClick={() => navigate('/settings')}
          title="Settings & Staff Management"
          className={`p-2 rounded-xl transition-colors ${
            location.pathname.startsWith('/settings')
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile & Sign Out Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white font-black flex items-center justify-center text-sm shadow-md shadow-red-600/20 uppercase">
              {currentUser?.username?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || currentUser?.username || 'User'}
              </div>
              <div className="flex items-center gap-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${currentUser?.role === ROLES.ADMIN ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentUser?.role === ROLES.ADMIN ? 'Dealer Admin' : 'Dealer Staff'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500">@{currentUser?.username || 'user'}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    currentUser?.role === ROLES.ADMIN 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {currentUser?.role || 'Staff'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {currentUser?.phone || ''}
                  </span>
                </div>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors mb-1"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Settings & Staff</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}