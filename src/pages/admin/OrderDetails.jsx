import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { ArrowLeft, Package, MapPin, Phone, User, CheckCircle, ChevronDown } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) {
      setOrder(found);
    } else {
      navigate('/admin/orders');
    }
  }, [id, orders, navigate]);

  if (!order) return null;

  const statusSteps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStatusBadge = (status) => {
    const cls = status.toLowerCase().replace(/ /g, '-');
    return <span className={`badge badge-${cls}`}>{status.toUpperCase()}</span>;
  };

  const handleStatusUpdate = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button className="btn btn-outline no-print" onClick={() => navigate('/admin/orders')} style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Order #{order.id}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
            {getStatusBadge(order.status)}
            <span className="text-muted">Placed on {new Date(order.orderDate).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-outline no-print" style={{ fontSize: '0.875rem', padding: '8px 16px' }} onClick={() => window.print()}>
            Print Invoice
          </button>
          <div style={{ position: 'relative' }} className="no-print">
            <button className="btn btn-primary" onClick={() => setIsUpdating(!isUpdating)}>
              Update Status <ChevronDown size={16} />
            </button>
            {isUpdating && (
            <div className="dropdown-menu">
              {statusSteps.map((step, index) => {
                const currentIndex = statusSteps.indexOf(order.status);
                const isPast = index <= currentIndex;
                const isActive = order.status === step;
                
                return (
                  <div 
                    key={step}
                    onClick={() => !isPast && handleStatusUpdate(step)}
                    className={`dropdown-item ${isActive ? 'active' : ''}`}
                    style={{ 
                      opacity: isPast && !isActive ? 0.5 : 1, 
                      cursor: isPast ? 'not-allowed' : 'pointer',
                      pointerEvents: isPast ? 'none' : 'auto'
                    }}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} className="text-muted" /> Ordered Product
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p className="fw-600" style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{order.productName}</p>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Qty: 1</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} className="text-muted" /> Shipping Address
              </h3>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{order.address}</p>
            </div>
            <div className="card">
              <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} className="text-muted" /> Customer Info
              </h3>
              <p style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }} className="fw-500">
                <User size={16} className="text-muted" /> {order.customerName}
              </p>
              <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }} className="text-muted">
                <Phone size={16} /> {order.phoneNumber}
              </p>
            </div>
          </div>

          {order.customerMessage && (
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>Delivery Feedback</h3>
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.5' }}>{order.customerMessage}</p>
            </div>
          )}
        </div>

        {/* Right Column (Timeline) */}
        <div className="card">
          <h3 style={{ margin: '0 0 24px 0' }}>Tracking Timeline</h3>
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {statusSteps.map((step, index) => {
              const historyItem = order.history.find(h => h.status === step);
              const isCompleted = !!historyItem;
              const isCurrent = order.status === step;
              
              return (
                <div key={step} style={{ position: 'relative', marginBottom: index === statusSteps.length - 1 ? 0 : '32px' }}>
                  {/* Line */}
                  {index < statusSteps.length - 1 && (
                    <div style={{ 
                      position: 'absolute', left: '-15px', top: '24px', bottom: '-32px', 
                      width: '2px', backgroundColor: isCompleted ? 'var(--primary)' : 'var(--secondary)',
                      zIndex: 1
                    }} />
                  )}
                  
                  {/* Circle */}
                  <div style={{
                    position: 'absolute', left: '-24px', top: '0', 
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: isCurrent ? 'white' : (isCompleted ? 'var(--primary)' : 'var(--secondary)'),
                    border: isCurrent ? '4px solid var(--primary)' : 'none',
                    zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} />

                  <div>
                    <span style={{ fontWeight: isCurrent ? 600 : 500, color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>{step}</span>
                    {historyItem ? (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </p>
                    ) : (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

// End of file
