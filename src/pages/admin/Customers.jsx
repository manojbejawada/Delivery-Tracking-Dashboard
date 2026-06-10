import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { Users, Phone, MapPin } from 'lucide-react';

const Customers = () => {
  const { orders } = useOrders();

  // Extract unique customers based on name and phone
  const customersMap = new Map();
  orders.forEach(order => {
    const key = `${order.customerName}-${order.phoneNumber}`;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: order.customerName,
        phone: order.phoneNumber,
        address: order.address,
        orderCount: 1,
        lastOrderDate: order.orderDate
      });
    } else {
      const existing = customersMap.get(key);
      existing.orderCount += 1;
      if (new Date(order.orderDate) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.orderDate;
      }
    }
  });

  const uniqueCustomers = Array.from(customersMap.values());

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.75rem' }}>Customer Directory</h1>
        <p className="text-muted" style={{ margin: 0 }}>Manage and view your customer base.</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Primary Address</th>
                <th>Total Orders</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {uniqueCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No customers found. Create orders to see customers here.
                  </td>
                </tr>
              ) : (
                uniqueCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="fw-500">{customer.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Phone size={14} /> {customer.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <MapPin size={14} /> {customer.address.length > 30 ? customer.address.substring(0, 30) + '...' : customer.address}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-main)' }}>
                        {customer.orderCount} Orders
                      </span>
                    </td>
                    <td className="text-muted">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
