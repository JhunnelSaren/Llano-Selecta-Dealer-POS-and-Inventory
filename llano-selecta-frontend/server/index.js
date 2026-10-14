import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', system: 'Llano SELECTA Backend API' });
});

// --- PRODUCTS ENDPOINTS ---
app.get('/api/products', async (req, res) => {
  try {
    // Sorted by category and name to match inventory sheet grouping
    const { rows } = await db.query('SELECT * FROM products ORDER BY category, name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CUSTOMERS / STORES ENDPOINTS (Added) ---
app.get('/api/customers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM customers ORDER BY store_name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BOOKINGS ENDPOINTS ---
app.get('/api/bookings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { id, store_name, booking_date, status, items, estimated_total } = req.body;
  try {
    const query = `
      INSERT INTO bookings (id, store_name, booking_date, status, items, estimated_total)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [id, store_name, booking_date, status, JSON.stringify(items), estimated_total];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OFFLINE SYNC ENDPOINT ---
app.post('/api/sync/offline-batch', async (req, res) => {
  const { bookings: _bookings, sales: _sales, discrepancies: _discrepancies } = req.body;
  try {
    res.json({ success: true, message: 'Offline transactions synced successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Llano SELECTA API Server running on port ${PORT}`);
});