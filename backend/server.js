import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for locations
// keys will be orderId, values will be { lat, lng }
const locations = {};

// Default dummy starting position (center of a city)
const DEFAULT_LAT = 17.3850;
const DEFAULT_LNG = 78.4867;

// Get location
app.get("/location/:id", (req, res) => {
  const { id } = req.params;
  const loc = locations[id];
  if (loc) {
    res.json(loc);
  } else {
    res.status(404).json({ error: "Location not found" });
  }
});

// Update location
app.post("/location/:id", (req, res) => {
  const { id } = req.params;
  const { lat, lng } = req.body;
  
  if (lat == null || lng == null) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  locations[id] = { lat, lng };
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
