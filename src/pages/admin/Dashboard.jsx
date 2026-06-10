import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Order Placed' || o.status === 'Packed').length;
  const inTransit = orders.filter(o => o.status === 'Shipped' || o.status === 'Out for Delivery').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);

  const getStatusBadge = (status) => {
    const cls = status.toLowerCase().replace(/ /g, '-');
    return <span className={`badge badge-${cls}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem' }}>Dashboard Overview</h1>
          <p className="text-muted" style={{ margin: 0 }}>Real-time logistics monitoring and shipment tracking.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/orders')}>+ New Dispatch</button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--primary)' }}>
            <Package size={24} />
          </div>
          <p className="text-muted fw-600" style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.5px' }}>TOTAL ORDERS</p>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>{total}</h2>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <p className="text-muted fw-600" style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.5px' }}>DELIVERED</p>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>{delivered}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--info)' }}>
            <Truck size={24} />
          </div>
          <p className="text-muted fw-600" style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.5px' }}>IN TRANSIT</p>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>{inTransit}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <p className="text-muted fw-600" style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.5px' }}>PENDING</p>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>{pending}</h2>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No orders found. Create one to get started.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="fw-500" style={{ color: 'var(--primary)' }}>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.productName}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span 
                        style={{ color: 'var(--primary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View Details
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin/orders')} style={{ width: '100%' }}>View All Shipments</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
