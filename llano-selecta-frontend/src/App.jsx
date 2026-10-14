import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages / Modules
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Employees from './pages/Employees';
import RoutesPage from './pages/Routes';
import Freezers from './pages/Freezers';
import Bookings from './pages/Bookings';
import SelectaOrders from './pages/SelectaOrders';
import Receiving from './pages/Receiving';
import Inventory from './pages/Inventory';
import Dispatch from './pages/Dispatch';
import Discrepancies from './pages/Discrepancies';
import POS from './pages/POS';
import Payments from './pages/Payments';
import Reconciliation from './pages/Reconciliation';
import Quota from './pages/Quota';
import AuditLogs from './pages/AuditLogs';

// Fallback component for undefined paths
const ComingSoon = ({ title }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800">{title} Module</h2>
    <p className="text-slate-500 mt-2">Currently under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Master Data */}
          <Route path="/master/customers" element={<Customers />} />
          <Route path="/master/products" element={<Products />} />
          <Route path="/master/employees" element={<Employees />} />
          <Route path="/master/routes" element={<RoutesPage />} />
          <Route path="/master/freezers" element={<Freezers />} />
          
          {/* Operations */}
          <Route path="/operations/bookings" element={<Bookings />} />
          <Route path="/operations/selecta-orders" element={<SelectaOrders />} />
          <Route path="/operations/receiving" element={<Receiving />} />
          <Route path="/operations/inventory" element={<Inventory />} />
          
          {/* Delivery */}
          <Route path="/delivery/dispatch" element={<Dispatch />} />
          <Route path="/delivery/discrepancies" element={<Discrepancies />} />
          
          {/* Finance */}
          <Route path="/finance/pos" element={<POS />} />
          <Route path="/finance/payments" element={<Payments />} />
          <Route path="/finance/reconciliation" element={<Reconciliation />} />
          
          {/* Monitoring */}
          <Route path="/monitoring/quota" element={<Quota />} />
          
          {/* Admin & Security */}
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/users" element={<Employees />} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;