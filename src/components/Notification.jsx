import React from 'react';
import { useOrders } from '../context/OrderContext';
import { CheckCircle, Info } from 'lucide-react';

const Notification = () => {
  const { notifications } = useOrders();

  return (
    <div className="notifications-container">
      {notifications.map(note => (
        <div key={note.id} className={`toast ${note.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {note.type === 'success' ? <CheckCircle size={20} color="var(--success)" /> : <Info size={20} color="var(--primary)" />}
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{note.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
