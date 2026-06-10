import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import TrackingPortal from './pages/customer/TrackingPortal';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetails from './pages/admin/OrderDetails';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import AgentPortal from './pages/agent/AgentPortal';
import Notification from './components/Notification';
import CustomerNotifierModal from './components/CustomerNotifierModal';

function App() {
  return (
    <Router>
      <Notification />
      <CustomerNotifierModal />
      <Routes>
        <Route path="/" element={<TrackingPortal />} />
        <Route path="/agent" element={<AgentPortal />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
