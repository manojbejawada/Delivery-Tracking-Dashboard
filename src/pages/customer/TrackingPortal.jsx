import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, Plus } from 'lucide-react';
import TrackingMap from '../../components/TrackingMap';
import CustomerOrderModal from '../../components/CustomerOrderModal';
import SupportModal from '../../components/SupportModal';

const TrackingPortal = () => {
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [error, setError] = useState('');
  const [liveLocation, setLiveLocation] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const pollIntervalRef = useRef(null);
  const { orders, addCustomerMessage, createOrder } = useOrders();
  const navigate = useNavigate();

  // Stop polling when component unmounts or order changes
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [trackedOrder]);

  // Start polling if Out for Delivery
  useEffect(() => {
    if (trackedOrder?.status === 'Out for Delivery') {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:5000/location/${trackedOrder.id}`);
          if (res.ok) {
            const data = await res.json();
            setLiveLocation([data.lat, data.lng]);
          }
        } catch (err) {
          console.error("Failed to fetch live location", err);
        }
      }, 3000);
    } else {
      setLiveLocation(null);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
  }, [trackedOrder]);

  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const idParam = query.get('id');
    if (idParam) {
      setSearchId(idParam);
      const found = orders.find(o => o.id.toLowerCase() === idParam.toLowerCase());
      if (found) {
        setTrackedOrder(found);
        setError('');
      } else {
        setTrackedOrder(null);
        setError('Order not found. Please check the Order ID and try again.');
      }
    }
  }, [orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    const found = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setTrackedOrder(found);
      setError('');
    } else {
      setTrackedOrder(null);
      setError('Order not found. Please check the Order ID and try again.');
    }
  };

  const statusSteps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStepIcon = (step) => {
    switch (step) {
      case 'Order Placed': return <Clock size={20} />;
      case 'Packed': return <Package size={20} />;
      case 'Shipped': return <Truck size={20} />;
      case 'Out for Delivery': return <MapPin size={20} />;
      case 'Delivered': return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const handlePlaceOrder = (orderData) => {
    const newId = createOrder(orderData);
    setIsOrderModalOpen(false);
    
    // Automatically track the new order
    setSearchId(newId);
    
    // Wait for context to update
    setTimeout(() => {
      navigate(`/?id=${newId}`);
    }, 100);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Navbar */}
      <header style={{ padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={24} /> LogiTrack
        </h1>
        <div style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsSupportModalOpen(true)}>Support</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => alert('FAQ coming soon!')}>FAQ</span>
          <button className="btn btn-primary" onClick={() => setIsOrderModalOpen(true)} style={{ padding: '8px 16px' }}>
            <Plus size={16} /> Place Order
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/admin/dashboard')} style={{ padding: '8px 16px' }}>Admin Login</button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#111827' }}>Track Your Delivery</h2>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Enter your order ID below to see the real-time status and estimated arrival of your shipment.</p>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-control" 
                placeholder="Enter Order ID (e.g. LT-12345)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px', height: '48px', fontSize: '1rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 32px', fontSize: '1rem' }}>TRACK</button>
          </form>
          {error && <p style={{ color: 'var(--danger)', marginTop: '12px', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
        </div>

        {trackedOrder && (
          <div className="card" style={{ width: '100%', maxWidth: '800px', marginTop: '32px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>Order {trackedOrder.id}</h3>
                <p className="text-muted" style={{ margin: 0 }}>Placed on {new Date(trackedOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="fw-600" style={{ margin: '0 0 4px 0' }}>{trackedOrder.productName}</p>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>{trackedOrder.customerName}</p>
              </div>
            </div>

            {/* Route Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', backgroundColor: 'var(--bg-main)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '32px', border: '1px solid var(--border)' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start Location (Origin Hub)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'orange' }} />
                  <span className="fw-500" style={{ fontSize: '0.9rem' }}>LogiTrack Hub, Hyderabad</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginTop: '4px', paddingLeft: '16px' }}>
                  Lat/Lng: {trackedOrder.startCoords ? `${trackedOrder.startCoords[0].toFixed(4)}, ${trackedOrder.startCoords[1].toFixed(4)}` : '17.3600, 78.4500'}
                </span>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>End Location (Delivery Destination)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red' }} />
                  <span className="fw-500" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>{trackedOrder.address}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginTop: '4px', paddingLeft: '16px' }}>
                  Lat/Lng: {trackedOrder.endCoords ? `${trackedOrder.endCoords[0].toFixed(4)}, ${trackedOrder.endCoords[1].toFixed(4)}` : '17.4000, 78.5200'}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px 0' }}>
              <h4 style={{ marginBottom: '24px', color: 'var(--text-main)' }}>Tracking Timeline</h4>
              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {statusSteps.map((step, index) => {
                  const historyItem = trackedOrder.history.find(h => h.status === step);
                  const isCompleted = !!historyItem;
                  const isCurrent = trackedOrder.status === step;
                  
                  return (
                    <div key={step} style={{ position: 'relative', marginBottom: index === statusSteps.length - 1 ? 0 : '32px' }}>
                      {/* Line connecting steps */}
                      {index < statusSteps.length - 1 && (
                        <div style={{ 
                          position: 'absolute', left: '-15px', top: '24px', bottom: '-32px', 
                          width: '2px', backgroundColor: isCompleted ? 'var(--primary)' : 'var(--secondary)',
                          zIndex: 1
                        }} />
                      )}
                      
                      {/* Step Circle */}
                      <div style={{
                        position: 'absolute', left: '-24px', top: '0', 
                        width: '20px', height: '20px', borderRadius: '50%',
                        backgroundColor: isCurrent ? 'white' : (isCompleted ? 'var(--primary)' : 'var(--secondary)'),
                        border: isCurrent ? '4px solid var(--primary)' : 'none',
                        zIndex: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }} />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: isCurrent ? 700 : 500, color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>{step}</span>
                        </div>
                        {historyItem && (
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {new Date(historyItem.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map — always visible */}
            <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Delivery Location</h4>
              <TrackingMap
                livePosition={liveLocation}
                destinationLabel={trackedOrder.address}
                isLive={trackedOrder.status === 'Out for Delivery' && !!liveLocation}
                startCoords={trackedOrder.startCoords}
                endCoords={trackedOrder.endCoords}
              />
            </div>


            {trackedOrder.status === 'Delivered' && (
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Delivery Feedback</h4>
                {trackedOrder.customerMessage ? (
                  <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-main)' }}>"{trackedOrder.customerMessage}"</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Message sent.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const msg = e.target.message.value;
                    addCustomerMessage(trackedOrder.id, msg);
                    setTrackedOrder({ ...trackedOrder, customerMessage: msg });
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea 
                      name="message" 
                      required 
                      className="input-control" 
                      rows="3" 
                      placeholder="Confirm you received the package or leave a note for the seller..."
                      style={{ resize: 'vertical' }}
                    ></textarea>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px 40px', backgroundColor: 'white', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={16} /> LogiTrack</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
        <div>© 2024 LogiTrack Logistics Inc.</div>
      </footer>

      <CustomerOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onSubmit={handlePlaceOrder} 
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  );
};

export default TrackingPortal;
