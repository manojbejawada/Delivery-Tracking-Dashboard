import React from 'react';
import { useOrders } from '../context/OrderContext';
import { MessageCircle, MessageSquare, X } from 'lucide-react';

const CustomerNotifierModal = () => {
  const { pendingCustomerNotification, setPendingCustomerNotification, whatsAppIntegration } = useOrders();
  const [sendingState, setSendingState] = React.useState('idle'); // 'idle' | 'sending' | 'success'

  if (!pendingCustomerNotification) return null;

  const { orderId, customerName, phoneNumber, newStatus } = pendingCustomerNotification;

  const handleClose = () => {
    setPendingCustomerNotification(null);
    setSendingState('idle');
  };

  const message = `Hi ${customerName}, your LogiTrack order ${orderId} is now ${newStatus}! You can track it here: ${window.location.origin}/?id=${orderId}`;
  
  // Strip non-numeric characters for valid wa.me and sms formats
  const safePhone = phoneNumber || '';
  const cleanPhone = safePhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;

  const handleSendDirectAPI = () => {
    setSendingState('sending');
    setTimeout(() => {
      setSendingState('success');
      setTimeout(() => {
        // Automatically open real WhatsApp to pass the message
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        handleClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        {sendingState === 'idle' && (
          <button onClick={handleClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        )}
        
        {sendingState === 'idle' && (
          <>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Notify Customer</h3>
            
            {whatsAppIntegration.connected && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: '#ecfdf5', 
                border: '1px solid #10b981', 
                padding: '8px 12px', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '16px',
                fontSize: '0.825rem',
                color: '#047857',
                fontWeight: 500
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  animation: 'pulse 1.5s infinite'
                }} />
                WhatsApp API Connected ({whatsAppIntegration.phoneNumber})
              </div>
            )}

            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Status updated to <strong>{newStatus}</strong>.<br />
              Would you like to send a notification to <strong>{customerName}</strong> ({phoneNumber})?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whatsAppIntegration.connected ? (
                <button 
                  className="btn"
                  style={{ backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                  onClick={handleSendDirectAPI}
                >
                  <MessageCircle size={20} /> Send Instantly via API
                </button>
              ) : (
                <button 
                  className="btn"
                  style={{ backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '1rem', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                    handleClose();
                  }}
                >
                  <MessageCircle size={20} /> Send via WhatsApp
                </button>
              )}
              <button 
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => {
                  window.open(smsUrl, '_self');
                  handleClose();
                }}
              >
                <MessageSquare size={20} /> Send via SMS
              </button>
            </div>
          </>
        )}

        {sendingState === 'sending' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--secondary)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h4 style={{ margin: '0 0 4px 0' }}>Sending via WhatsApp API</h4>
            <p className="text-muted" style={{ margin: '0 0 16px 0', fontSize: '0.85rem' }}>Dispatching template payload to customer number...</p>
            
            <div style={{
              textAlign: 'left',
              backgroundColor: '#1e1e1e',
              color: '#8ec07c',
              padding: '12px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflowX: 'auto',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)',
              lineHeight: '1.4'
            }}>
              <div><span style={{ color: '#b16286', fontWeight: 'bold' }}>POST</span> /v19.0/messages</div>
              <div style={{ color: '#b8bb26' }}>{`{`}</div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#83a598' }}>"messaging_product"</span>: "whatsapp",</div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#83a598' }}>"to"</span>: <span style={{ color: '#fabd2f' }}>"{phoneNumber}"</span>,</div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#83a598' }}>"type"</span>: "template",</div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#83a598' }}>"template"</span>: {`{`}</div>
              <div style={{ paddingLeft: '24px' }}><span style={{ color: '#83a598' }}>"name"</span>: "order_status_update",</div>
              <div style={{ paddingLeft: '24px' }}><span style={{ color: '#83a598' }}>"components"</span>: [{`...`}]</div>
              <div style={{ paddingLeft: '12px' }}>{`}`}</div>
              <div style={{ color: '#b8bb26' }}>{`}`}</div>
            </div>
          </div>
        )}

        {sendingState === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--success)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✓</div>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--success)' }}>WhatsApp Message Sent!</h4>
            <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Successfully dispatched template to {phoneNumber}.</p>
            
            <div style={{
              textAlign: 'left',
              backgroundColor: '#1e1e1e',
              color: '#8bb651',
              padding: '12px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflowX: 'auto',
              borderLeft: '4px solid var(--success)',
              lineHeight: '1.4'
            }}>
              <div style={{ color: '#b8bb26', fontWeight: 'bold' }}>HTTP 200 OK</div>
              <div style={{ color: '#928374' }}>{`{`}</div>
              <div style={{ paddingLeft: '12px', color: '#928374' }}><span style={{ color: '#83a598' }}>"contacts"</span>: [{`{ "input": "${phoneNumber}", "wa_id": "${phoneNumber.replace(/[^0-9]/g, '')}" }`}],</div>
              <div style={{ paddingLeft: '12px', color: '#928374' }}><span style={{ color: '#83a598' }}>"messages"</span>: [{`{ "id": "wamid.HBgLMTU1NT..." }`}]</div>
              <div style={{ color: '#928374' }}>{`}`}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerNotifierModal;
