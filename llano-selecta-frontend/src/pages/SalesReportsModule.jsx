import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Receipt, 
  Scale, 
  Target, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  BarChart3
} from 'lucide-react';
import SalesReceipts from './SalesReceipts';
import CashReconciliation from './CashReconciliation';
import QuotaTracker from './QuotaTracker';
import Reports from './Reports';

export default function SalesReportsModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // Sub-tabs: 'receipts' | 'collection' | 'quota' | 'reports'
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'receipts');

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
    { id: 'receipts', label: 'Receipts & Customer Bills', icon: Receipt, desc: 'Finalized Invoices & Collections' },
    { id: 'collection', label: 'Daily Collection Reconciliation', icon: Scale, desc: 'Cash Expected vs Counted & Route Closing' },
    { id: 'quota', label: 'Selecta POS Quota', icon: Target, desc: 'Official Monthly Target & Progress' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, desc: 'Sales, Stock, BO & Compliance Exports' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Title Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Sales & Financial Reports
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Accurate customer billing, multi-method collections (Cash/GCash/Check), cash variance closing, and Selecta POS quota tracking
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
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
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
        {activeTab === 'receipts' && <SalesReceipts />}
        {activeTab === 'collection' && <CashReconciliation />}
        {activeTab === 'quota' && <QuotaTracker />}
        {activeTab === 'reports' && <Reports />}
      </div>
    </div>
  );
}