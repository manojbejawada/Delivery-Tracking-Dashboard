import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, X } from 'lucide-react';

const HUBS = [
  { name: 'Kakinada Port Hub', lat: 16.9890, lng: 82.2570 },
  { name: 'Rajahmundry Cargo Center', lat: 17.0005, lng: 81.8040 },
  { name: 'Samalkot Sorting Hub', lat: 17.0500, lng: 82.1667 },
  { name: 'Peddapuram Delivery Hub', lat: 17.0800, lng: 82.1300 }
];

const CITY_COORDS = {
  kakinada: [16.9890, 82.2470],
  rajahmundry: [17.0005, 81.8040],
  samalkot: [17.0500, 82.1667],
  peddapuram: [17.0800, 82.1300],
  anaparthi: [16.9300, 81.9700],
  vizag: [17.6868, 83.2185],
  visakhapatnam: [17.6868, 83.2185],
  vijayawada: [16.5062, 80.6480],
  hyderabad: [17.3850, 78.4867]
};

const getCoordsForCity = (cityName) => {
  const clean = cityName.trim().toLowerCase();
  if (CITY_COORDS[clean]) {
    return CITY_COORDS[clean];
  }
  const lat = 16.9890 + (Math.random() - 0.5) * 0.06;
  const lng = 82.2470 + (Math.random() - 0.5) * 0.06;
  return [lat, lng];
};

const Orders = () => {
  const { orders, createOrder } = useOrders();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Order Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    productName: '',
    address: '',
    startHub: HUBS[0].name,
    customHubName: ''
  });

  const statuses = ['All', 'Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    let startCoords;
    let startHubName;

    if (formData.startHub === 'CUSTOM') {
      startHubName = formData.customHubName || 'Custom Location';
      startCoords = getCoordsForCity(startHubName);
    } else {
      const selectedHub = HUBS.find(h => h.name === formData.startHub) || HUBS[0];
      startCoords = [selectedHub.lat, selectedHub.lng];
      startHubName = selectedHub.name;
    }

    const endLat = startCoords[0] + (Math.random() > 0.5 ? 0.015 : -0.015) + (Math.random() - 0.5) * 0.01;
    const endLng = startCoords[1] + (Math.random() > 0.5 ? 0.015 : -0.015) + (Math.random() - 0.5) * 0.01;

    createOrder({
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      productName: formData.productName,
      address: formData.address,
      startCoords,
      endCoords: [endLat, endLng],
      startHubName
    });
    setIsModalOpen(false);
    setFormData({ 
      customerName: '', 
      phoneNumber: '', 
      productName: '', 
      address: '', 
      startHub: HUBS[0].name,
      customHubName: ''
    });
  };

  const getStatusBadge = (status) => {
    const cls = status.toLowerCase().replace(/ /g, '-');
    return <span className={`badge badge-${cls}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem' }}>Order Management</h1>
          <p className="text-muted" style={{ margin: 0 }}>Real-time oversight of all logistics operations and dispatches.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Order
        </button>
      </div>

      <div className="card">
        {/* Filters and Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-control" 
              placeholder="Search Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {statuses.map(status => (
              <button 
                key={status}
                className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 16px', fontSize: '0.875rem', borderRadius: '20px' }}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="fw-600" style={{ color: 'var(--primary)' }}>#{order.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {order.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        {order.customerName}
                      </div>
                    </td>
                    <td>{order.productName}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span 
                          style={{ color: 'var(--primary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          Update Status
                        </span>
                        <Eye size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate(`/admin/orders/${order.id}`)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Create New Order</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Customer Name</label>
                <input required type="text" className="input-control" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Phone Number</label>
                <input required type="text" className="input-control" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Product Name</label>
                <input required type="text" className="input-control" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Dispatch Origin (Start Hub)</label>
                <select
                  value={formData.startHub}
                  onChange={e => setFormData({...formData, startHub: e.target.value})}
                  className="input-control"
                  style={{ width: '100%', height: '40px', backgroundColor: 'white' }}
                  required
                >
                  {HUBS.map(hub => (
                    <option key={hub.name} value={hub.name}>
                      {hub.name}
                    </option>
                  ))}
                  <option value="CUSTOM">✨ Custom City...</option>
                </select>
              </div>

              {formData.startHub === 'CUSTOM' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '3px solid var(--primary)', paddingLeft: '12px', marginTop: '4px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem' }}>Custom City Name</label>
                    <input 
                      type="text" 
                      value={formData.customHubName} 
                      onChange={e => setFormData({...formData, customHubName: e.target.value})} 
                      className="input-control" 
                      placeholder="e.g. Kakinada, Samalkot, Rajahmundry" 
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Delivery Address</label>
                <textarea required className="input-control" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
