import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

// The Five Primary Navigation Modules (Section 3 Requirements)
import Dashboard from './pages/Dashboard';
import OrdersDelivery from './pages/OrdersDelivery';
import InventoryModule from './pages/InventoryModule';
import StoresFreezersModule from './pages/StoresFreezersModule';
import SalesReportsModule from './pages/SalesReportsModule';

// Settings & Staff Management (Behind Gear Icon)
import SettingsModule from './pages/SettingsModule';

// Fallback component
const ComingSoon = ({ title }) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center space-y-2">
    <h2 className="text-xl font-bold text-slate-800">{title} Module</h2>
    <p className="text-slate-500 text-sm">This page requires higher administrative permissions.</p>
  </div>
);

// Protected App Content with Role Access Control
function AppContent() {
  const { currentUser, canAccess } = useAuth();

  // If unauthenticated, show the Login/Registration portal (Never altered)
  if (!currentUser) {
    return <Login />;
  }

  return (
    <MainLayout>
      <Routes>
        {/* Default Redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* ========================================================= */}
        {/* EXACTLY FIVE PRIMARY NAVIGATION MODULES (Section 3)      */}
        {/* ========================================================= */}
        
        {/* 1. Dashboard Overview */}
        <Route 
          path="/dashboard" 
          element={canAccess('/dashboard') ? <Dashboard /> : <Navigate to="/" replace />} 
        />
        
        {/* 2. Orders & Delivery (Bookings, Bodega, Receiving, Prepare/Load, Delivery, Reconciliation) */}
        <Route 
          path="/orders-delivery" 
          element={canAccess('/orders-delivery') ? <OrdersDelivery /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* 3. Inventory (Stock on Hand, Movements, Damaged/BO, Low Stock) */}
        <Route 
          path="/inventory" 
          element={canAccess('/inventory') ? <InventoryModule /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* 4. Stores & Freezers (Customer Directory, Freezers Asset Custody & Timemark) */}
        <Route 
          path="/stores-freezers" 
          element={canAccess('/stores-freezers') ? <StoresFreezersModule /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* 5. Sales & Reports (Receipts, Daily Collection Closing, Selecta Quota, Reports) */}
        <Route 
          path="/sales-reports" 
          element={canAccess('/sales-reports') ? <SalesReportsModule /> : <Navigate to="/dashboard" replace />} 
        />

        {/* ========================================================= */}
        {/* SETTINGS & STAFF MANAGEMENT (Behind Gear Icon)            */}
        {/* ========================================================= */}
        <Route 
          path="/settings" 
          element={canAccess('/settings') ? <SettingsModule /> : <Navigate to="/dashboard" replace />} 
        />

        {/* ========================================================= */}
        {/* BACKWARD COMPATIBILITY REDIRECTS FOR LEGACY URL PATHS     */}
        {/* ========================================================= */}
        <Route path="/operations/bookings" element={<Navigate to="/orders-delivery?tab=bookings" replace />} />
        <Route path="/operations/selecta-orders" element={<Navigate to="/orders-delivery?tab=bodega" replace />} />
        <Route path="/operations/receiving" element={<Navigate to="/orders-delivery?tab=receiving" replace />} />
        <Route path="/operations/delivery-packing" element={<Navigate to="/orders-delivery?tab=prepare" replace />} />
        <Route path="/operations/dispatch" element={<Navigate to="/orders-delivery?tab=prepare" replace />} />
        
        <Route path="/operations/inventory" element={<Navigate to="/inventory?tab=stock" replace />} />
        <Route path="/master/products" element={<Navigate to="/inventory?tab=stock" replace />} />
        
        <Route path="/master/customers" element={<Navigate to="/stores-freezers?tab=stores" replace />} />
        <Route path="/freezers/registry" element={<Navigate to="/stores-freezers?tab=freezers" replace />} />
        <Route path="/freezers/timemark-scans" element={<Navigate to="/stores-freezers?tab=freezers" replace />} />
        <Route path="/master/freezers" element={<Navigate to="/stores-freezers?tab=freezers" replace />} />
        
        <Route path="/sales/receipts" element={<Navigate to="/sales-reports?tab=receipts" replace />} />
        <Route path="/sales/payments" element={<Navigate to="/sales-reports?tab=receipts" replace />} />
        <Route path="/sales/cash-reconciliation" element={<Navigate to="/sales-reports?tab=collection" replace />} />
        <Route path="/pos" element={<Navigate to="/sales-reports?tab=receipts" replace />} />
        <Route path="/quota/tracker" element={<Navigate to="/sales-reports?tab=quota" replace />} />
        <Route path="/monitoring/quota" element={<Navigate to="/sales-reports?tab=quota" replace />} />
        <Route path="/reports" element={<Navigate to="/sales-reports?tab=reports" replace />} />
        
        <Route path="/management/settings" element={<Navigate to="/settings?tab=general" replace />} />
        <Route path="/management/users" element={<Navigate to="/settings?tab=users" replace />} />
        <Route path="/master/employees" element={<Navigate to="/settings?tab=crew" replace />} />
        <Route path="/management/audit" element={<Navigate to="/settings?tab=audit" replace />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}