import React from 'react';
import { Save, Bell, Shield, Smartphone } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const Settings = () => {
  const { addNotification, whatsAppIntegration, connectWhatsApp, disconnectWhatsApp } = useOrders();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    addNotification('Settings saved successfully.', 'success');
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 24px 0', fontSize: '1.5rem' }}>Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
        
        {/* General Settings */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} className="text-muted" /> General Settings
          </h2>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Store Name</label>
              <input type="text" className="input-control" defaultValue="LogiTrack Logistics" style={{ width: '100%', maxWidth: '400px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Support Email</label>
              <input type="email" className="input-control" defaultValue="support@logitrack.com" style={{ width: '100%', maxWidth: '400px' }} />
            </div>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Changes
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} className="text-muted" /> Notifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Email notifications for new orders</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>In-app alerts for status updates</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>Daily summary reports</span>
            </label>
          </div>
        </div>

        {/* Integrations */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={20} className="text-muted" /> Integrations
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>WhatsApp Business API</h3>
                {whatsAppIntegration.connected ? (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.75rem', 
                    color: '#0f5132', 
                    backgroundColor: '#d1e7dd', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontWeight: 600 
                  }}>
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#198754',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    Connected
                  </span>
                ) : (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    fontSize: '0.75rem', 
                    color: '#6c757d', 
                    backgroundColor: '#e9ecef', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    fontWeight: 600 
                  }}>
                    Disconnected
                  </span>
                )}
              </div>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                {whatsAppIntegration.connected 
                  ? `Active on ${whatsAppIntegration.phoneNumber}. Messages are sent directly via API.` 
                  : 'Connect your WhatsApp account for automated messaging.'}
              </p>
            </div>
            {whatsAppIntegration.connected ? (
              <button onClick={disconnectWhatsApp} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                Disconnect
              </button>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Connect</button>
            )}
          </div>
        </div>

      </div>

      <WhatsAppConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={connectWhatsApp} 
      />
    </div>
  );
};

// Beautiful WhatsApp Connection Modal
const WhatsAppConnectModal = ({ isOpen, onClose, onConnect }) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [apiToken, setApiToken] = React.useState('');
  const [step, setStep] = React.useState('form'); // 'form' | 'connecting' | 'success'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('connecting');
    
    // Simulate API connection & token verification
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConnect(phoneNumber, apiToken);
        // Reset states
        setStep('form');
        setPhoneNumber('');
        setApiToken('');
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '28px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        {step !== 'connecting' && (
          <button 
            onClick={() => { setStep('form'); onClose(); }} 
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingRight: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Connect WhatsApp</h3>
              <button 
                type="button"
                onClick={() => {
                  setPhoneNumber('+1 (555) 019-9283');
                  setApiToken('EAAGxx_DEMO_TOKEN_PRESENTATION');
                }}
                style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, border: '1px solid var(--primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                Autofill Demo
              </button>
            </div>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
              Link your Meta developer credentials to send automated updates directly.
            </p>

            <div className="input-group">
              <label>WhatsApp Phone Number</label>
              <input 
                type="text" 
                required 
                className="input-control" 
                placeholder="+1 (555) 000-0000" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Permanent Access Token</label>
              <input 
                type="password" 
                required 
                className="input-control" 
                placeholder="EAAGxx..." 
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', fontSize: '0.95rem' }}>
              Verify & Connect
            </button>
          </form>
        )}

        {step === 'connecting' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--secondary)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 20px auto',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h4 style={{ margin: '0 0 8px 0' }}>Linking Account</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Verifying Meta developer token & credentials...</p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--success)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--success)' }}>Connection Success!</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your WhatsApp Business API is now active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
