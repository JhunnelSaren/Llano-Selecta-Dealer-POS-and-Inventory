import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Store, 
  Snowflake, 
  CheckCircle2, 
  MapPin, 
  FileText,
  Building2,
  Layers
} from 'lucide-react';
import Customers from './Customers';
import Freezers from './Freezers';

export default function StoresFreezersModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Sub-tabs: 'stores' | 'freezers'
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'stores');

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
    { id: 'stores', label: 'Stores & Customers', icon: Store, desc: 'Store Directory, Delivery Routes & Balance Profiles' },
    { id: 'freezers', label: 'Freezers & Monthly Verification', icon: Snowflake, desc: 'Selecta Assets Custody & Timemark Compliance' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Title Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Stores & Freezers Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer store profiles, route assignments, Selecta-owned freezer custody, and monthly Timemark photo verifications
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
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
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
        {activeTab === 'stores' && <Customers />}
        {activeTab === 'freezers' && <Freezers />}
      </div>
    </div>
  );
}