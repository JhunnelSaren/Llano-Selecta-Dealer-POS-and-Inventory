import React, { useState } from 'react';
import { Bell, Search, User, Menu, IceCream, X, Check, AlertTriangle, Truck, Clock, CheckCircle2 } from 'lucide-react';

export default function Header({ toggleSidebar, user = { name: 'Admin Owner', role: 'OWNER / ADMIN' } }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Backload Logged',
      message: 'Store "Lumbayao Refreshments" was closed during delivery. 2 boxes backloaded.',
      time: '15 mins ago',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: 'Freezer Van Arrived',
      message: 'PO-SEL-9045 arrived at Llano Warehouse. Pending receiving inspection.',
      time: '1 hour ago',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: 'Low Stock Alert',
      message: 'Cornetto Vanilla 110ml is below safety threshold (18 boxes left).',
      time: '3 hours ago',
      type: 'danger',
      unread: true
    },
    {
      id: 4,
      title: 'New Store Registered',
      message: 'Sinabuagan Golden Store added. Pending freezer custody agreement sign-off.',
      time: 'Yesterday',
      type: 'success',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

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

        {/* Global Search Bar */}
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
        {/* Notifications Module */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
            title="System Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">System Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-brand-red text-[10px] font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3.5 flex gap-3 hover:bg-slate-50 transition-colors ${
                        n.unread ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'danger' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {n.type === 'info' && <Truck className="w-4 h-4 text-blue-500" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {n.unread && (
                            <button 
                              onClick={() => markAsRead(n.id)}
                              className="text-[10px] text-blue-600 font-semibold hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                          <button 
                            onClick={() => removeNotification(n.id)}
                            className="text-[10px] text-slate-400 hover:text-red-500"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile */}
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