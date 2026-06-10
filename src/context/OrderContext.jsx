import React, { createContext, useState, useEffect, useContext } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('logitrack_orders');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);

    // Seed initial dummy data for testing
    const now = Date.now();
    return [
      {
        id: "LT-88219",
        customerName: "John Simmons",
        phoneNumber: "+1 555-0100",
        productName: "MacBook Pro M3 Max",
        address: "742 Evergreen Terrace, Springfield",
        orderDate: new Date(now - 86400000 * 2).toISOString(),
        status: "Out for Delivery",
        history: [
          { status: "Order Placed", timestamp: new Date(now - 86400000 * 2).toISOString() },
          { status: "Packed", timestamp: new Date(now - 86400000 * 1.8).toISOString() },
          { status: "Shipped", timestamp: new Date(now - 86400000 * 1.5).toISOString() },
          { status: "Out for Delivery", timestamp: new Date(now - 3600000 * 2).toISOString() }
        ],
        startCoords: [17.3600, 78.4500],
        endCoords: [17.4000, 78.5200]
      },
      {
        id: "LT-88215",
        customerName: "Alice Miller",
        phoneNumber: "+1 555-0101",
        productName: "Sony WH-1000XM5",
        address: "123 Main St, New York, NY",
        orderDate: new Date(now - 86400000 * 3).toISOString(),
        status: "Delivered",
        history: [
          { status: "Order Placed", timestamp: new Date(now - 86400000 * 3).toISOString() },
          { status: "Packed", timestamp: new Date(now - 86400000 * 2.8).toISOString() },
          { status: "Shipped", timestamp: new Date(now - 86400000 * 2.5).toISOString() },
          { status: "Out for Delivery", timestamp: new Date(now - 86400000 * 1.5).toISOString() },
          { status: "Delivered", timestamp: new Date(now - 86400000 * 1).toISOString() }
        ],
        customerMessage: "Received in great condition! Thanks.",
        startCoords: [17.3500, 78.4400],
        endCoords: [17.4100, 78.5000]
      },
      {
        id: "LT-88201",
        customerName: "Robert King",
        phoneNumber: "+1 555-0102",
        productName: "Herman Miller Embody",
        address: "456 Corporate Blvd, San Francisco, CA",
        orderDate: new Date().toISOString(),
        status: "Packed",
        history: [
          { status: "Order Placed", timestamp: new Date(now - 3600000).toISOString() },
          { status: "Packed", timestamp: new Date().toISOString() }
        ],
        startCoords: [17.3700, 78.4600],
        endCoords: [17.3900, 78.4900]
      }
    ];
  });

  const [notifications, setNotifications] = useState([]);
  const [whatsAppIntegration, setWhatsAppIntegration] = useState(() => {
    const saved = localStorage.getItem('logitrack_whatsapp');
    return saved ? JSON.parse(saved) : { connected: false, phoneNumber: '', apiToken: '' };
  });

  useEffect(() => {
    localStorage.setItem('logitrack_whatsapp', JSON.stringify(whatsAppIntegration));
  }, [whatsAppIntegration]);

  const connectWhatsApp = (phoneNumber, apiToken) => {
    setWhatsAppIntegration({
      connected: true,
      phoneNumber,
      apiToken
    });
    addNotification('WhatsApp Business API connected successfully!', 'success');
  };

  const disconnectWhatsApp = () => {
    setWhatsAppIntegration({
      connected: false,
      phoneNumber: '',
      apiToken: ''
    });
    addNotification('WhatsApp Business API disconnected.', 'info');
  };

  useEffect(() => {
    localStorage.setItem('logitrack_orders', JSON.stringify(orders));
  }, [orders]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const createOrder = (orderData) => {
    const newId = `LT-${Math.floor(10000 + Math.random() * 90000)}`;
    const startLat = 17.3500 + Math.random() * 0.03;
    const startLng = 78.4400 + Math.random() * 0.03;
    const endLat = startLat + 0.02 + Math.random() * 0.02;
    const endLng = startLng + 0.02 + Math.random() * 0.02;

    const newOrder = {
      id: newId,
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'Order Placed',
      history: [
        { status: 'Order Placed', timestamp: new Date().toISOString() }
      ],
      startCoords: [startLat, startLng],
      endCoords: [endLat, endLng]
    };
    setOrders(prev => [newOrder, ...prev]);
    addNotification(`Order ${newId} has been created successfully.`, 'success');
    return newId;
  };

  const statusSteps = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const updateOrderStatus = (orderId, newStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const currentIndex = statusSteps.indexOf(orderToUpdate.status);
    const newIndex = statusSteps.indexOf(newStatus);

    if (newIndex <= currentIndex) {
      if (newIndex < currentIndex) {
        addNotification(`Cannot move status backward to ${newStatus}.`, 'info');
      }
      return;
    }

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newHistory = [...order.history];
        const timestamp = new Date().toISOString();

        for (let i = currentIndex + 1; i <= newIndex; i++) {
          if (!newHistory.find(h => h.status === statusSteps[i])) {
            newHistory.push({ status: statusSteps[i], timestamp });
          }
        }

        return {
          ...order,
          status: newStatus,
          history: newHistory
        };
      }
      return order;
    }));
    addNotification(`Order ${orderId} is now ${newStatus}`, 'success');

    // Trigger the customer notification modal
    setPendingCustomerNotification({
      orderId,
      customerName: orderToUpdate.customerName,
      phoneNumber: orderToUpdate.phoneNumber,
      newStatus
    });
  };

  const addCustomerMessage = (orderId, message) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, customerMessage: message };
      }
      return order;
    }));
  };

  const [pendingCustomerNotification, setPendingCustomerNotification] = useState(null);

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      addCustomerMessage,
      notifications,
      addNotification,
      pendingCustomerNotification,
      setPendingCustomerNotification,
      whatsAppIntegration,
      connectWhatsApp,
      disconnectWhatsApp
    }}>
      {children}
    </OrderContext.Provider>
  );
};
