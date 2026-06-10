import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, HelpCircle, LogOut } from 'lucide-react';
import SupportModal from '../components/SupportModal';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="no-print" style={{ 
        width: '260px', 
        backgroundColor: 'white', 
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.5rem' }}>LogiTrack</h2>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>Operational Portal</p>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          <NavLink 
            to="/admin/dashboard" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: 'var(--radius-md)', marginBottom: '8px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-main)',
              fontWeight: isActive ? 600 : 500
            })}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: 'var(--radius-md)', marginBottom: '8px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-main)',
              fontWeight: isActive ? 600 : 500
            })}
          >
            <Package size={20} />
            Orders
          </NavLink>

          <NavLink 
            to="/admin/customers" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: 'var(--radius-md)', marginBottom: '8px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-main)',
              fontWeight: isActive ? 600 : 500
            })}
          >
            <Users size={20} /> Customers
          </NavLink>
          <NavLink 
            to="/admin/settings" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
              borderRadius: 'var(--radius-md)', marginBottom: '8px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-main)',
              fontWeight: isActive ? 600 : 500
            })}
          >
            <Settings size={20} /> Settings
          </NavLink>
        </nav>

        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            onClick={() => setIsSupportModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            <HelpCircle size={18} /> Support
          </div>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}>
            <LogOut size={18} /> Exit to Tracking
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
        {/* Topbar */}
        <header className="no-print" style={{ 
          height: '72px', 
          backgroundColor: 'white', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <div></div> {/* Placeholder for search if needed globally */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Admin User</div>
               <div className="text-muted" style={{ fontSize: '0.75rem' }}>Administrator</div>
             </div>
             <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
               A
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
};

export default AdminLayout;
