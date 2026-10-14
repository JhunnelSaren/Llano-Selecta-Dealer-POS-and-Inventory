import React from 'react';
import { Bell, Search, User, Menu, IceCream } from 'lucide-react';

export default function Header({ toggleSidebar, user = { name: 'Admin Owner', role: 'OWNER / ADMIN' } }) {
  return (
    <header className="no-print bg-white border-b border-slate-200 h-16 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="bg-brand-red p-1.5 rounded-lg text-white">
            <IceCream className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-sm sm:text-base">Llano SELECTA</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-md px-3 py-1.5 w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search stores, products, bookings..."
            className="bg-transparent border-none text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Location Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Valencia City & Cabanglasan Hub</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-light text-brand-red font-bold flex items-center justify-center border border-brand-red/20 text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</div>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}