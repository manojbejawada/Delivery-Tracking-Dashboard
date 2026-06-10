import React, { useState } from 'react';
import { X, Package, MapPin, User, Phone, Home } from 'lucide-react';

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
  // Dynamic fallback: generate near Kakinada with a small offset
  const lat = 16.9890 + (Math.random() - 0.5) * 0.06;
  const lng = 82.2470 + (Math.random() - 0.5) * 0.06;
  return [lat, lng];
};

const CustomerOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    items: '',
    startHub: HUBS[0].name,
    customHubName: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
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

    // Set endCoords relative to the start coordinates for a better map visualization
    const endLat = startCoords[0] + (Math.random() > 0.5 ? 0.015 : -0.015) + (Math.random() - 0.5) * 0.01;
    const endLng = startCoords[1] + (Math.random() > 0.5 ? 0.015 : -0.015) + (Math.random() - 0.5) * 0.01;

    onSubmit({
      customerName: formData.customerName,
      phoneNumber: formData.customerPhone,
      address: formData.address,
      productName: formData.items,
      items: [{ name: formData.items, quantity: 1, price: 0 }], // Simplified for prototype
      startCoords,
      endCoords: [endLat, endLng],
      startHubName
    });
    setFormData({ 
      customerName: '', 
      customerPhone: '', 
      address: '', 
      items: '', 
      startHub: HUBS[0].name,
      customHubName: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Place New Order</h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="input-control"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="input-control"
              placeholder="e.g. 9876543210"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={16} /> Product Name
            </label>
            <input
              type="text"
              name="items"
              value={formData.items}
              onChange={handleChange}
              className="input-control"
              placeholder="e.g. iPhone 15 Pro"
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Home size={16} /> Dispatch Origin (Start Hub)
            </label>
            <select
              name="startHub"
              value={formData.startHub}
              onChange={handleChange}
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
                  name="customHubName" 
                  value={formData.customHubName} 
                  onChange={handleChange} 
                  className="input-control" 
                  placeholder="e.g. Kakinada, Samalkot, Rajahmundry" 
                  required 
                />
              </div>
            </div>
          )}

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> Delivery Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-control"
              placeholder="Full delivery address..."
              rows="3"
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerOrderModal;
