import React, { useState } from 'react';
import { X, Mail, MessageSquare, Phone } from 'lucide-react';

const SupportModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} /> Contact Support
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--success)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
            <h4 style={{ margin: '0 0 8px 0' }}>Message Sent!</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Our team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--secondary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Phone size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>1-800-LOGITRACK</span>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--secondary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <Mail size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>help@logitrak.com</span>
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>How can we help you?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-control"
                placeholder="Describe your issue..."
                rows="4"
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupportModal;
