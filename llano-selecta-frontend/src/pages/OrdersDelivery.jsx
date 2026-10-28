import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ClipboardList, 
  ShoppingCart, 
  ArrowDownToLine, 
  Package, 
  Truck, 
  Scale,
  Layers
} from 'lucide-react';
import Bookings from './Bookings';
import SelectaOrderSummary from './SelectaOrderSummary';
import Receiving from './Receiving';
import DeliveryPacking from './DeliveryPacking';
import ActiveDeliveryRun from '../components/delivery/ActiveDeliveryRun';
import CashReconciliation from './CashReconciliation';

export default function OrdersDelivery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const bookingIdFromUrl = searchParams.get('bookingId');

  // Valid tabs: 'bookings' | 'bodega' | 'receiving' | 'prepare' | 'delivery' | 'reconciliation'
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'bookings');

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
    { id: 'bookings', label: 'Bookings', icon: ClipboardList, desc: 'Store Orders & Booking Schedules' },
    { id: 'bodega', label: 'Bodega Order', icon: ShoppingCart, desc: 'Consolidated Selecta POS Orders' },
    { id: 'receiving', label: 'Stock Receiving', icon: ArrowDownToLine, desc: 'Panel Truck Receiving & Checklist' },
    { id: 'prepare', label: 'Prepare & Load', icon: Package, desc: 'Picking, Box Labels & Crew' },
    { id: 'delivery', label: 'Delivery', icon: Truck, desc: 'Store-by-Store Stop & Collections' },
    { id: 'reconciliation', label: 'Delivery Reconciliation', icon: Scale, desc: 'Route Closing & Cash Counts' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Title Header & Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-red-600" />
              Orders & Delivery Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete cold-chain flow: Store Booking → Selecta Bodega Order → Inbound Receiving → Prepare & Load → Delivery Run → Reconciliation
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
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
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
        {activeTab === 'bookings' && <Bookings />}
        {activeTab === 'bodega' && <SelectaOrderSummary />}
        {activeTab === 'receiving' && <Receiving />}
        {activeTab === 'prepare' && <DeliveryPacking />}
        {activeTab === 'delivery' && <ActiveDeliveryRun initialBookingId={bookingIdFromUrl} />}
        {activeTab === 'reconciliation' && <CashReconciliation />}
      </div>
    </div>
  );
}