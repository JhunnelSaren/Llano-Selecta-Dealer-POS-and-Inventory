import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Building, 
  Clock, 
  KeyRound
} from 'lucide-react';
import Settings from './Settings';
import UserManagement from './UserManagement';
import Employees from './Employees';
import AuditLogs from './AuditLogs';

export default function SettingsModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Sub-tabs: 'general' | 'users' | 'crew' | 'audit'
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'general');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const tabs = [
    { id: 'general', label: 'Company & Receipt Settings', icon: Building, desc: 'Branding, Receipt Header & Dealer Details' },
    { id: 'users', label: 'Staff Accounts & Permissions', icon: Users, desc: 'Admin vs Staff Access, Roles & Credentials' },
    { id: 'crew', label: 'Delivery Crew Roster', icon: UserCheck, desc: 'Drivers, Loaders, Checkers & Helpers' },
    { id: 'audit', label: 'System Audit Logs', icon: Clock, desc: 'Immutable Log of Critical Dealer Actions' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Title Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-slate-700" />
              Settings & Staff Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              System configuration, staff account permissions, delivery crew roster, and transaction audit trails
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Contents */}
      <div>
        {activeTab === 'general' && <Settings />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'crew' && <Employees />}
        {activeTab === 'audit' && <AuditLogs />}
      </div>
    </div>
  );
}