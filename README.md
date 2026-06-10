# LogiTrack - Premium Delivery Tracking Dashboard

**A state-of-the-art logistics management and real-time delivery tracking application.**

---

## 🌟 Key Features

### 1. 🚚 Real-time Live GPS Tracking
* Interactive maps using **Leaflet** and **React-Leaflet**.
* **Driver Broadcast Simulator** (in the Agent Portal) which computes routing steps dynamically from start coordinates to end coordinates.
* Live truck marker movement matching the driver's real-time position.
* Auto-bounding to zoom and center the map view dynamically.

### 2. 💬 Direct WhatsApp Business API Integration
* **API Credentials Panel** in Admin Settings.
* **Autofill Demo button** to pre-populate presentation credentials (`+1 (555) 019-9283` and access token).
* **Instant API Dispatch Console** inside the notification modal showing exact JSON request payloads (`"to": "[customer_phone]"`) and matching response values.
* **Auto-link launch**: Once the simulated API console confirms transmission, it opens the real pre-filled WhatsApp web interface in the background.

### 3. 🏭 Region-Based Start & End Routing
* Focused pre-defined shipping hubs around the **Kakinada region** (Andhra Pradesh):
  * *Kakinada Port Hub*
  * *Rajahmundry Cargo Center*
  * *Samalkot Sorting Hub*
  * *Peddapuram Delivery Hub*
* **Custom City Geocoding**: Users can type *any* city name (e.g. *Kakinada*, *Samalkot*, *Vizag*, *Hyderabad*) instead of manual latitude/longitude values. The system automatically geocodes it to real coordinates for the map.

### 4. 👑 Premium UI/UX Design
* Clean HSL tailored typography and custom layout templates.
* Status badges (Order Placed, Packed, Shipped, Out for Delivery, Delivered) with corresponding colors.
* Smooth micro-animations and pulsing status indicators.

---

## 🚀 Getting Started

### 🛠️ Prerequisites
* **Node.js** (v18 or higher recommended)

### 📦 Installation
```bash
# 1. Clone the project
git clone <repository-url>
cd "Delivery Tracking Dashboard"

# 2. Install packages
npm install
```

### 🏃‍♂️ Running the Application
The application includes a Vite frontend and a lightweight Express backend for coordinates. You can start both simultaneously:

```bash
# Launch Dev Server and Coordinates Server
npm run dev
```

* **Frontend**: http://localhost:5173
* **Agent Dispatch Portal**: http://localhost:5173/agent
* **Admin Management Portal**: http://localhost:5173/admin/dashboard
* **Coordinates Server**: http://localhost:5000

---

## 📂 Project Structure
```
Delivery Tracking Dashboard/
├── backend/
│   └── server.js            # In-memory agent GPS coordinate server
├── src/
│   ├── components/          # Reusable UI modules (TrackingMap, SupportModal)
│   ├── context/             # OrderContext (State, Notifications, WhatsApp API)
│   ├── pages/
│   │   ├── admin/           # Dashboard, Orders lists, Settings
│   │   ├── agent/           # AgentPortal driving simulators
│   │   └── customer/        # Customer tracking dashboard
│   ├── App.jsx              # Main routing hub
│   ├── index.css            # Stylesheets
│   └── main.jsx             # React entry point
```

---
*Created with 💙 by Antigravity.*
