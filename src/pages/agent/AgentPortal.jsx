import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, ChevronRight, Play, Square } from 'lucide-react';

const AgentPortal = () => {
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [error, setError] = useState('');
  const { orders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  const statusSteps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const locationIntervalRef = useRef(null);

  // Stop broadcasting if unmounted or if tracking changes
  useEffect(() => {
    return () => stopBroadcast();
  }, [trackedOrder]);

  const stopBroadcast = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    setIsBroadcasting(false);
  };

  const startBroadcast = () => {
    if (!trackedOrder) return;
    setIsBroadcasting(true);
    
    const start = trackedOrder.startCoords || [17.3600, 78.4500];
    const end = trackedOrder.endCoords || [17.4000, 78.5200];

    let currentLat = start[0];
    let currentLng = start[1];

    // Send initial location
    fetch(`http://localhost:5000/location/${trackedOrder.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: currentLat, lng: currentLng })
    }).catch(err => console.error("Broadcast failed", err));

    const steps = 30;
    const latStep = (end[0] - start[0]) / steps;
    const lngStep = (end[1] - start[1]) / steps;
    let currentStep = 0;

    locationIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        stopBroadcast();
        return;
      }
      currentLat += latStep;
      currentLng += lngStep;
      currentStep++;
      
      fetch(`http://localhost:5000/location/${trackedOrder.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: currentLat, lng: currentLng })
      }).catch(err => console.error("Broadcast failed", err));
    }, 3000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    stopBroadcast();
    if (!searchId.trim()) return;
    
    const found = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setTrackedOrder(found);
      setError('');
    } else {
      setTrackedOrder(null);
      setError('Order not found. Please check the Order ID.');
    }
  };

  const handleUpdateNextStatus = () => {
    if (!trackedOrder) return;
    const currentIndex = statusSteps.indexOf(trackedOrder.status);
    if (currentIndex >= 0 && currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1];
      updateOrderStatus(trackedOrder.id, nextStatus);
      // Update local state to reflect the change immediately
      setTrackedOrder({ ...trackedOrder, status: nextStatus });
    }
  };

  const getStatusBadge = (status) => {
    const cls = status.toLowerCase().replace(/ /g, '-');
    return <span className={`badge badge-${cls}`}>{status.toUpperCase()}</span>;
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'Order Placed': return <Clock size={24} />;
      case 'Packed': return <Package size={24} />;
      case 'Shipped': return <Truck size={24} />;
      case 'Out for Delivery': return <MapPin size={24} />;
      case 'Delivered': return <CheckCircle size={24} />;
      default: return <Clock size={24} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Navbar */}
      <header style={{ padding: '16px 24px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} /> LogiTrack Agent
        </h1>
        <button onClick={() => navigate('/')} style={{ color: 'white', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 'var(--radius-sm)' }}>
          Exit
        </button>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px 16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#111827' }}>Update Delivery</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Scan or enter an Order ID to update its status.</p>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-control" 
                placeholder="Order ID (e.g. LT-12345)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{ width: '100%', paddingLeft: '40px', height: '48px', fontSize: '1rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '48px', fontSize: '1rem' }}>Find Order</button>
          </form>
          {error && <p style={{ color: 'var(--danger)', marginTop: '12px', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
        </div>

        {/* Pending Orders Queue */}
        {!trackedOrder && (
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Pending Orders Queue</h3>
            {orders.filter(o => o.status === 'Order Placed').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-md)' }}>
                No pending orders right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.filter(o => o.status === 'Order Placed').map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      setTrackedOrder(order);
                      setSearchId(order.id);
                      setError('');
                    }}
                    style={{ 
                      padding: '16px', 
                      border: '1px solid var(--border)', 
                      borderRadius: 'var(--radius-md)', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary)' }}>{order.id}</h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>{order.address}</p>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {trackedOrder && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{trackedOrder.id}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>{trackedOrder.customerName}</p>
              </div>
              {getStatusBadge(trackedOrder.status)}
            </div>
            
            <div style={{ padding: '16px', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={16} className="text-muted" />
                <span className="fw-500" style={{ fontSize: '0.875rem' }}>Delivery Address</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-main)' }}>{trackedOrder.address}</p>
            </div>

            {trackedOrder.status === 'Out for Delivery' && (
              <div style={{ padding: '16px', backgroundColor: isBroadcasting ? '#ecfdf5' : 'var(--secondary)', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: isBroadcasting ? '1px solid #10b981' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: isBroadcasting ? '#047857' : 'inherit' }}>Live GPS Broadcast</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{isBroadcasting ? 'Simulating agent movement...' : 'Broadcast location to customer'}</p>
                  </div>
                  {isBroadcasting ? (
                    <button className="btn btn-outline" onClick={stopBroadcast} style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '8px 16px' }}>
                      <Square size={16} /> Stop
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={startBroadcast} style={{ padding: '8px 16px' }}>
                      <Play size={16} /> Start
                    </button>
                  )}
                </div>
              </div>
            )}

            {(() => {
              const currentIndex = statusSteps.indexOf(trackedOrder.status);
              const isDelivered = currentIndex === statusSteps.length - 1;
              const nextStatus = !isDelivered ? statusSteps[currentIndex + 1] : null;

              if (isDelivered) {
                return (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--success)' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 16px auto' }} />
                    <h3 style={{ margin: 0 }}>Successfully Delivered</h3>
                  </div>
                );
              }

              return (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '64px', fontSize: '1.1rem', justifyContent: 'space-between', padding: '0 24px' }}
                  onClick={handleUpdateNextStatus}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getStepIcon(nextStatus)}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>UPDATE TO</div>
                      <div>{nextStatus}</div>
                    </div>
                  </div>
                  <ChevronRight size={24} />
                </button>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentPortal;
