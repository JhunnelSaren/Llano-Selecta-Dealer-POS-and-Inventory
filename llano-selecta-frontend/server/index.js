import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', system: 'Llano SELECTA Backend API', time: new Date().toISOString() });
});

// ==========================================
// 1. AUTH & USERS MANAGEMENT (Admin & Staff)
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, username, name, email, role, phone, status, last_login, created_at 
      FROM users 
      ORDER BY created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Please enter username/email and password.' });
    }

    const { rows } = await db.query(`
      SELECT * FROM users 
      WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1);
    `, [usernameOrEmail.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found. Check username or email.' });
    }

    const user = rows[0];

    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
    }

    if (user.status === 'Pending Approval') {
      return res.status(403).json({ 
        error: 'Registration pending verification. Please wait for the Dealer Admin to approve your account.' 
      });
    }

    if (user.status === 'Inactive' || user.status === 'Access Stopped') {
      return res.status(403).json({ 
        error: 'Your account access has been stopped. Please contact Dealer Administrator.' 
      });
    }

    // Update last_login
    await db.query(`UPDATE users SET last_login = NOW() WHERE id = $1;`, [user.id]);

    const safeUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      last_login: new Date()
    };

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, name, email, role, password, phone, status } = req.body;
  try {
    const id = `USR-${Date.now().toString().slice(-6)}`;
    const userRole = role === 'Admin' ? 'Admin' : 'Staff';
    const userStatus = status || 'Active';
    const accessKey = `SELECTA-${userRole.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const query = `
      INSERT INTO users (id, username, name, email, role, access_key, password_hash, phone, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id, username, name, email, role, phone, status, created_at;
    `;
    const values = [id, username.trim(), name.trim(), email?.trim() || `${username.trim()}@selecta.com`, userRole, accessKey, password || 'selecta123', phone || '', userStatus];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, password, phone, status, username } = req.body;
  try {
    let query = `
      UPDATE users SET 
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        phone = COALESCE($3, phone),
        status = COALESCE($4, status),
        username = COALESCE($5, username)
    `;
    const params = [name, role, phone, status, username];

    if (password && password.trim()) {
      params.push(password.trim());
      query += `, password_hash = $${params.length}`;
    }

    params.push(id);
    query += ` WHERE id = $${params.length} RETURNING id, username, name, email, role, phone, status, last_login, created_at;`;

    const { rows } = await db.query(query, params);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/:id/toggle-access', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: current } = await db.query('SELECT status FROM users WHERE id = $1', [id]);
    if (current.length === 0) return res.status(404).json({ error: 'User not found' });

    const newStatus = current[0].status === 'Active' ? 'Access Stopped' : 'Active';
    const { rows } = await db.query(`
      UPDATE users SET status = $1 WHERE id = $2 
      RETURNING id, username, name, email, role, phone, status, last_login, created_at;
    `, [newStatus, id]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      UPDATE users SET status = 'Active' WHERE id = $1 
      RETURNING id, username, name, email, role, phone, status, last_login, created_at;
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Protect primary admin from deletion
    if (id === 'USR-ADMIN') {
      return res.status(400).json({ error: 'Cannot delete primary Admin account.' });
    }
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. EMPLOYEES & CREW
// ==========================================
app.get('/api/employees', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, name, role, contact, email, birthdate, date_applied, photo_url, status, created_at
      FROM employees 
      ORDER BY date_applied DESC, name ASC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { id, name, role, contact, email, birthdate, date_applied, photo_url, status } = req.body;
  try {
    const empId = id || `EMP-${Date.now().toString().slice(-4)}`;
    const query = `
      INSERT INTO employees (id, name, role, primary_role, contact, email, birthdate, date_applied, photo_url, status, created_at)
      VALUES ($1, $2, $3, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;
    const values = [
      empId,
      name.trim(),
      role || 'Driver',
      contact || '',
      email || null,
      birthdate || null,
      date_applied || new Date().toISOString().split('T')[0],
      photo_url || '',
      status || 'Active'
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, contact, email, birthdate, date_applied, photo_url, status } = req.body;
  try {
    const query = `
      UPDATE employees SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        primary_role = COALESCE($2, primary_role),
        contact = COALESCE($3, contact),
        email = COALESCE($4, email),
        birthdate = COALESCE($5, birthdate),
        date_applied = COALESCE($6, date_applied),
        photo_url = COALESCE($7, photo_url),
        status = COALESCE($8, status)
      WHERE id = $9
      RETURNING *;
    `;
    const values = [name, role, contact, email, birthdate, date_applied, photo_url, status, id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ success: true, message: 'Employee removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. STORE BOOKINGS & DELIVERY ORDERS (POS Merged)
// ==========================================
app.get('/api/bookings', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        id, 
        COALESCE(store_name, customer) as store_name,
        COALESCE(customer, store_name) as customer,
        owner_name,
        area,
        route,
        booking_date,
        booking_time,
        status,
        items,
        estimated_total,
        total_receipt,
        bo_deductions,
        missing_deductions,
        net_delivered_amount,
        payment_method,
        paid_amount,
        shortage_amount,
        delivered_at,
        receipt_ref,
        remarks,
        customer_suggestions,
        created_at
      FROM bookings 
      ORDER BY booking_date DESC, created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const {
    id, store_name, owner_name, area, route, booking_date, booking_time,
    status, items, estimated_total, total_receipt, remarks, customer_suggestions
  } = req.body;
  try {
    const bookingId = id || `BK-${Date.now().toString().slice(-6)}`;
    const calcTotal = total_receipt || estimated_total || 0;
    const query = `
      INSERT INTO bookings (
        id, store_name, customer, owner_name, area, route, booking_date, booking_time,
        status, items, estimated_total, total_receipt, net_delivered_amount, remarks, customer_suggestions, created_at
      )
      VALUES ($1, $2, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $10, $11, $12, NOW())
      RETURNING *;
    `;
    const values = [
      bookingId,
      store_name,
      owner_name || '',
      area || 'Valencia City',
      route || `${area} Route`,
      booking_date || new Date().toISOString().split('T')[0],
      booking_time || '09:00 AM',
      status || 'Booked',
      JSON.stringify(items || []),
      calcTotal,
      remarks || '',
      customer_suggestions || ''
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status or settle delivery & payment
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const {
    status,
    total_receipt,
    bo_deductions,
    missing_deductions,
    net_delivered_amount,
    payment_method,
    paid_amount,
    shortage_amount,
    change_amount,
    delivered_time,
    receipt_ref,
    remarks,
    bo_items,
    missing_items
  } = req.body;
  try {
    const isDelivered = status === 'Delivered';
    const query = `
      UPDATE bookings SET
        status = COALESCE($1, status),
        total_receipt = COALESCE($2, total_receipt),
        bo_deductions = COALESCE($3, bo_deductions),
        missing_deductions = COALESCE($4, missing_deductions),
        net_delivered_amount = COALESCE($5, net_delivered_amount),
        payment_method = COALESCE($6, payment_method),
        paid_amount = COALESCE($7, paid_amount),
        shortage_amount = COALESCE($8, shortage_amount),
        receipt_ref = COALESCE($9, receipt_ref),
        remarks = COALESCE($10, remarks),
        delivered_at = CASE WHEN $1 = 'Delivered' THEN COALESCE(delivered_at, NOW()) ELSE delivered_at END,
        delivered_time = COALESCE($12, delivered_time),
        change_amount = COALESCE($13, change_amount),
        bo_items = COALESCE($14, bo_items),
        missing_items = COALESCE($15, missing_items)
      WHERE id = $11
      RETURNING *;
    `;
    const values = [
      status,
      total_receipt,
      bo_deductions,
      missing_deductions,
      net_delivered_amount,
      payment_method,
      paid_amount,
      shortage_amount,
      receipt_ref,
      remarks,
      id,
      delivered_time || null,
      change_amount || 0,
      bo_items ? JSON.stringify(bo_items) : null,
      missing_items ? JSON.stringify(missing_items) : null
    ];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. PRODUCTS & INVENTORY
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY category, name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const { rows: ledger } = await db.query(`
      SELECT * FROM inventory_ledger ORDER BY timestamp DESC LIMIT 200;
    `);
    const { rows: products } = await db.query(`
      SELECT * FROM products ORDER BY category, name ASC;
    `);
    res.json({ ledger, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Receive inbound van stock
app.post('/api/inventory/receive', async (req, res) => {
  const { po_number, truck_plate, driver_info, arrival_date, arrival_time, receiver, checker, remarks, items } = req.body;
  try {
    const rcvId = `RCV-${Date.now().toString().slice(-6)}`;
    let totalValue = 0;

    // Calculate total value
    if (Array.isArray(items)) {
      items.forEach(it => {
        const qty = parseInt(it.received || it.qty || 0);
        const price = parseFloat(it.price || it.unit_price || 0);
        totalValue += qty * price;
      });
    }

    // Insert stock receiving record
    await db.query(`
      INSERT INTO stock_receiving (id, po_number, truck_plate, driver_info, arrival_date, arrival_time, receiver, checker, status, remarks, items, total_received_value, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Delivered to Warehouse', $9, $10, $11, NOW());
    `, [rcvId, po_number, truck_plate, driver_info || '', arrival_date, arrival_time || '10:00 AM', receiver || 'Warehouse Staff', checker || '', remarks || '', JSON.stringify(items || []), totalValue]);

    // Insert ledger movement for each item
    if (Array.isArray(items)) {
      for (const it of items) {
        const qty = parseInt(it.received || it.qty || 0);
        if (qty > 0) {
          const ledgId = `LEDG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
          await db.query(`
            INSERT INTO inventory_ledger (id, timestamp, product_id, product_name, category, type, change_qty, running_on_hand, reference_no, staff, notes)
            VALUES ($1, NOW(), $2, $3, $4, 'Stock Receiving (Freezer Van)', $5, 100, $6, $7, $8);
          `, [ledgId, it.productId || it.id || 'GEN', it.name || 'Product', it.category || 'SELECTA', qty, po_number, receiver || 'Warehouse Staff', `Received from Van ${truck_plate}`]);
        }
      }
    }

    res.status(201).json({ success: true, message: 'Stock received and inventory ledger updated!', rcvId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/receiving', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM stock_receiving ORDER BY arrival_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. CUSTOMERS & STORES MASTER
// ==========================================
app.get('/api/customers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM customers ORDER BY store_name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const {
    id, store_name, name, owner, area, sub_area, subArea, purok, contact, phone,
    freezer_serial, freezerSerial, barcode_no, barcode, status, deployment_paper_ref
  } = req.body;
  try {
    const custId = id || `CUST-${Date.now().toString().slice(-5)}`;
    const finalStore = store_name || name;
    const finalOwner = owner || '';
    const finalArea = area || 'Valencia';
    const finalSubArea = sub_area || subArea || '';
    const finalPurok = purok || '';
    const finalContact = contact || phone || '';
    const finalSerial = freezer_serial || freezerSerial || '';
    const finalBarcode = barcode_no || barcode || '';

    const query = `
      INSERT INTO customers (
        id, store_name, owner, date_joined, area, sub_area, purok, route,
        contact, freezer_serial, barcode_no, status, deployment_paper_ref, created_at
      )
      VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (id) DO UPDATE SET
        store_name = EXCLUDED.store_name,
        owner = EXCLUDED.owner,
        area = EXCLUDED.area,
        sub_area = EXCLUDED.sub_area,
        purok = EXCLUDED.purok,
        route = EXCLUDED.route,
        contact = EXCLUDED.contact,
        freezer_serial = EXCLUDED.freezer_serial,
        barcode_no = EXCLUDED.barcode_no,
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      custId, finalStore, finalOwner, finalArea, finalSubArea, finalPurok,
      `${finalArea} Delivery Route`, finalContact, finalSerial, finalBarcode,
      status || 'Active', deployment_paper_ref || ''
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { store_name, owner, area, sub_area, purok, contact, freezer_serial, barcode_no, status } = req.body;
  try {
    const query = `
      UPDATE customers SET
        store_name = COALESCE($1, store_name),
        owner = COALESCE($2, owner),
        area = COALESCE($3, area),
        sub_area = COALESCE($4, sub_area),
        purok = COALESCE($5, purok),
        contact = COALESCE($6, contact),
        freezer_serial = COALESCE($7, freezer_serial),
        barcode_no = COALESCE($8, barcode_no),
        status = COALESCE($9, status)
      WHERE id = $10
      RETURNING *;
    `;
    const values = [store_name, owner, area, sub_area, purok, contact, freezer_serial, barcode_no, status, id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. FREEZERS ASSET MANAGEMENT & CUSTODY
// ==========================================
app.get('/api/freezers', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM freezers ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/freezers', async (req, res) => {
  const {
    id, serial_number, barcode_no, model, assigned_store, assigned_owner,
    status, custody_agreement_date, deployment_fee, timemark_verified
  } = req.body;
  try {
    const frzId = id || `FRZ-${Date.now().toString().slice(-4)}`;
    const query = `
      INSERT INTO freezers (
        id, serial_number, barcode_no, model, assigned_store, assigned_owner,
        status, custody_agreement_date, deployment_fee, timemark_verified, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (id) DO UPDATE SET
        serial_number = EXCLUDED.serial_number,
        barcode_no = EXCLUDED.barcode_no,
        model = EXCLUDED.model,
        assigned_store = EXCLUDED.assigned_store,
        assigned_owner = EXCLUDED.assigned_owner,
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      frzId, serial_number, barcode_no, model || 'Selecta Glass Top 300L',
      assigned_store || '', assigned_owner || '', status || 'Deployed',
      custody_agreement_date || new Date().toISOString().split('T')[0],
      deployment_fee || 10000.00, timemark_verified !== false
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/freezers/:id', async (req, res) => {
  const { id } = req.params;
  const { serial_number, barcode_no, model, assigned_store, assigned_owner, status } = req.body;
  try {
    const query = `
      UPDATE freezers SET
        serial_number = COALESCE($1, serial_number),
        barcode_no = COALESCE($2, barcode_no),
        model = COALESCE($3, model),
        assigned_store = COALESCE($4, assigned_store),
        assigned_owner = COALESCE($5, assigned_owner),
        status = COALESCE($6, status)
      WHERE id = $7
      RETURNING *;
    `;
    const values = [serial_number, barcode_no, model, assigned_store, assigned_owner, status, id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Freezer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. BO (MELTED) LOG & DISCREPANCIES WITH REFUND WORKFLOW
// ==========================================
app.get('/api/discrepancies', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM discrepancies 
      ORDER BY date DESC, created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/discrepancies', async (req, res) => {
  const {
    id, delivery_ref, area, store_name, date, product_name, category, flavor,
    type, quantity, deduction_amount, reported_by, status, notes,
    refund_status, refund_amount, refund_method, refund_ref, refund_notes
  } = req.body;
  try {
    const discId = id || `BO-${Date.now().toString().slice(-6)}`;
    const query = `
      INSERT INTO discrepancies (
        id, delivery_ref, area, store_name, customer_name, date, product_name, category, flavor,
        type, quantity, deduction_amount, reported_by, status, notes,
        refund_status, refund_amount, refund_method, refund_ref, refund_notes, created_at
      )
      VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
      RETURNING *;
    `;
    const values = [
      discId,
      delivery_ref || '',
      area || 'Valencia',
      store_name,
      date || new Date().toISOString().split('T')[0],
      product_name,
      category || 'SELECTA',
      flavor || '',
      type || 'BO / Melted',
      quantity || 1,
      deduction_amount || 0,
      reported_by || 'Field Logistics Staff',
      status || 'Logged',
      notes || '',
      refund_status || 'Refund Requested',
      refund_amount || deduction_amount || 0,
      refund_method || 'Cash Refund',
      refund_ref || '',
      refund_notes || ''
    ];
    const { rows } = await db.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/discrepancies/:id', async (req, res) => {
  const { id } = req.params;
  const {
    status,
    refund_status,
    refund_amount,
    refund_method,
    refund_ref,
    refund_notes,
    notes
  } = req.body;
  try {
    const isRefunded = refund_status === 'Refunded';
    const query = `
      UPDATE discrepancies SET
        status = COALESCE($1, status),
        refund_status = COALESCE($2, refund_status),
        refund_amount = COALESCE($3, refund_amount),
        refund_method = COALESCE($4, refund_method),
        refund_ref = COALESCE($5, refund_ref),
        refund_notes = COALESCE($6, refund_notes),
        notes = COALESCE($7, notes),
        refunded_at = CASE WHEN $2 = 'Refunded' THEN NOW() ELSE refunded_at END
      WHERE id = $8
      RETURNING *;
    `;
    const values = [status, refund_status, refund_amount, refund_method, refund_ref, refund_notes, notes, id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Discrepancy record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. SYSTEM SETTINGS (Login photo, logo, captions)
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM system_settings WHERE id = $1', ['SYSTEM_SETTINGS']);
    if (rows.length === 0) {
      return res.json({
        id: 'SYSTEM_SETTINGS',
        login_photo_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=2000',
        login_caption: 'Selecta Ice Cream Dealer Operations & Cold-Chain Management',
        login_description: 'Official distribution portal for store bookings, cold delivery fulfillment, and payment collections across Valencia, Cabanglasan, and San Fernando.',
        dealer_logo_url: '',
        dealer_name: 'Llano Selecta Dealer',
        contact_number: '0917-123-4567',
        address: 'Valencia City, Bukidnon'
      });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  const { login_photo_url, login_caption, login_description, dealer_logo_url, dealer_name, contact_number, address } = req.body;
  try {
    const query = `
      INSERT INTO system_settings (id, login_photo_url, login_caption, login_description, dealer_logo_url, dealer_name, contact_number, address, updated_at)
      VALUES ('SYSTEM_SETTINGS', $1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (id) DO UPDATE SET
        login_photo_url = COALESCE($1, system_settings.login_photo_url),
        login_caption = COALESCE($2, system_settings.login_caption),
        login_description = COALESCE($3, system_settings.login_description),
        dealer_logo_url = COALESCE($4, system_settings.dealer_logo_url),
        dealer_name = COALESCE($5, system_settings.dealer_name),
        contact_number = COALESCE($6, system_settings.contact_number),
        address = COALESCE($7, system_settings.address),
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [login_photo_url, login_caption, login_description, dealer_logo_url, dealer_name, contact_number, address];
    const { rows } = await db.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. AUDIT LOGGING HELPER & ENDPOINTS
// ==========================================
async function logAudit(userName = 'System', role = 'Staff', action = 'INFO', module = 'General', description = '', details = null, severity = 'info') {
  try {
    const id = `LOG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    await db.query(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, module, severity, description, details)
      VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8);
    `, [id, userName, role, action, module, severity, description, details ? JSON.stringify(details) : null]);
  } catch (e) {
    console.error('Audit log error:', e.message);
  }
}

app.get('/api/audit-logs', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 300;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/audit-logs', async (req, res) => {
  const { user_name, role, action, module, description, details, severity } = req.body;
  try {
    await logAudit(user_name, role, action, module, description, details, severity);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. SUPPLIER ORDERS (SELECTA ORDER SUMMARY)
// ==========================================
app.get('/api/supplier-orders', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM supplier_orders ORDER BY order_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/supplier-orders', async (req, res) => {
  const {
    id, selecta_pos_ref, order_date, expected_arrival_date,
    related_bookings, items, supplier_amount, responsible_person, notes, status
  } = req.body;
  try {
    const orderId = id || `SO-${Date.now().toString().slice(-6)}`;
    const query = `
      INSERT INTO supplier_orders (
        id, selecta_pos_ref, order_date, expected_arrival_date,
        related_bookings, items, supplier_amount, responsible_person, notes, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      orderId,
      selecta_pos_ref || '',
      order_date || new Date().toISOString().split('T')[0],
      expected_arrival_date || null,
      JSON.stringify(related_bookings || []),
      JSON.stringify(items || []),
      parseFloat(supplier_amount || 0),
      responsible_person || 'Dealer Owner',
      notes || '',
      status || 'Draft'
    ];
    const { rows } = await db.query(query, values);
    
    await logAudit(responsible_person || 'Dealer Owner', 'Admin', 'CREATE_SUPPLIER_ORDER', 'Selecta Order Summary', 
      `Created supplier order ${orderId} (${rows[0].status}) for ${items?.length || 0} product lines.`, rows[0]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/supplier-orders/:id', async (req, res) => {
  const { id } = req.params;
  const {
    selecta_pos_ref, order_date, expected_arrival_date,
    related_bookings, items, supplier_amount, responsible_person, notes, status
  } = req.body;
  try {
    const query = `
      UPDATE supplier_orders SET
        selecta_pos_ref = COALESCE($1, selecta_pos_ref),
        order_date = COALESCE($2, order_date),
        expected_arrival_date = COALESCE($3, expected_arrival_date),
        related_bookings = CASE WHEN $4::text IS NOT NULL THEN $4::jsonb ELSE related_bookings END,
        items = CASE WHEN $5::text IS NOT NULL THEN $5::jsonb ELSE items END,
        supplier_amount = COALESCE($6, supplier_amount),
        responsible_person = COALESCE($7, responsible_person),
        notes = COALESCE($8, notes),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *;
    `;
    const values = [
      selecta_pos_ref,
      order_date,
      expected_arrival_date,
      related_bookings ? JSON.stringify(related_bookings) : null,
      items ? JSON.stringify(items) : null,
      supplier_amount !== undefined ? parseFloat(supplier_amount) : null,
      responsible_person,
      notes,
      status,
      id
    ];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Supplier order not found' });

    await logAudit(responsible_person || 'User', 'Admin', 'UPDATE_SUPPLIER_ORDER', 'Selecta Order Summary',
      `Updated supplier order ${id} status to ${rows[0].status}`, rows[0]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/supplier-orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM supplier_orders WHERE id = $1', [id]);
    await logAudit('Admin', 'Admin', 'DELETE_SUPPLIER_ORDER', 'Selecta Order Summary', `Deleted supplier order ${id}`);
    res.json({ success: true, message: 'Supplier order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. DELIVERY BATCHES & PACKING
// ==========================================
app.get('/api/delivery-batches', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM delivery_batches ORDER BY delivery_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/delivery-batches', async (req, res) => {
  const {
    id, batch_number, delivery_date, area, route, driver_id, driver_name,
    helper1_name, helper2_name, booker_name, checker_name, vehicle_info, status, stores, notes
  } = req.body;
  try {
    const batchId = id || `DB-${Date.now().toString().slice(-6)}`;
    const query = `
      INSERT INTO delivery_batches (
        id, batch_number, delivery_date, area, route, driver_id, driver_name,
        helper1_name, helper2_name, booker_name, checker_name, vehicle_info, status, stores, notes, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      batchId,
      batch_number || `BATCH-${Date.now().toString().slice(-4)}`,
      delivery_date || new Date().toISOString().split('T')[0],
      area || 'Valencia City',
      route || `${area || 'Valencia'} Delivery Route`,
      driver_id || '',
      driver_name || 'Assigned Driver',
      helper1_name || '',
      helper2_name || '',
      booker_name || '',
      checker_name || '',
      vehicle_info || 'Bongo Refrigerated Van',
      status || 'Planned',
      JSON.stringify(stores || []),
      notes || ''
    ];
    const { rows } = await db.query(query, values);

    await logAudit(checker_name || driver_name || 'Admin', 'Staff', 'CREATE_DELIVERY_BATCH', 'Delivery & Packing',
      `Created delivery batch ${batchId} for route ${rows[0].route} with ${stores?.length || 0} stores`, rows[0]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/delivery-batches/:id', async (req, res) => {
  const { id } = req.params;
  const {
    batch_number, delivery_date, area, route, driver_id, driver_name,
    helper1_name, helper2_name, booker_name, checker_name, vehicle_info, status, stores, notes
  } = req.body;
  try {
    const query = `
      UPDATE delivery_batches SET
        batch_number = COALESCE($1, batch_number),
        delivery_date = COALESCE($2, delivery_date),
        area = COALESCE($3, area),
        route = COALESCE($4, route),
        driver_id = COALESCE($5, driver_id),
        driver_name = COALESCE($6, driver_name),
        helper1_name = COALESCE($7, helper1_name),
        helper2_name = COALESCE($8, helper2_name),
        booker_name = COALESCE($9, booker_name),
        checker_name = COALESCE($10, checker_name),
        vehicle_info = COALESCE($11, vehicle_info),
        status = COALESCE($12, status),
        stores = CASE WHEN $13::text IS NOT NULL THEN $13::jsonb ELSE stores END,
        notes = COALESCE($14, notes),
        updated_at = NOW()
      WHERE id = $15
      RETURNING *;
    `;
    const values = [
      batch_number, delivery_date, area, route, driver_id, driver_name,
      helper1_name, helper2_name, booker_name, checker_name, vehicle_info,
      status, stores ? JSON.stringify(stores) : null, notes, id
    ];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Delivery batch not found' });

    await logAudit(driver_name || checker_name || 'Staff', 'Staff', 'UPDATE_DELIVERY_BATCH', 'Delivery & Packing',
      `Updated delivery batch ${id} status to ${rows[0].status}`, rows[0]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/delivery-batches/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM delivery_batches WHERE id = $1', [id]);
    await logAudit('Admin', 'Admin', 'DELETE_DELIVERY_BATCH', 'Delivery & Packing', `Deleted delivery batch ${id}`);
    res.json({ success: true, message: 'Delivery batch deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 11. CASH RECONCILIATIONS (ROUTE CLOSING)
// ==========================================
app.get('/api/cash-reconciliations', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM cash_reconciliations ORDER BY reconciliation_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cash-reconciliations', async (req, res) => {
  const {
    id, delivery_batch_id, reconciliation_date, area, route, driver_name, collection_handler,
    expected_cash, actual_cash, gcash_total, check_total, other_total, total_collected,
    cash_variance, explanation, status, reviewed_by, receipts_summary
  } = req.body;
  try {
    const recId = id || `CR-${Date.now().toString().slice(-6)}`;
    const expCash = parseFloat(expected_cash || 0);
    const actCash = parseFloat(actual_cash || 0);
    const variance = cash_variance !== undefined ? parseFloat(cash_variance) : (actCash - expCash);

    const query = `
      INSERT INTO cash_reconciliations (
        id, delivery_batch_id, reconciliation_date, area, route, driver_name, collection_handler,
        expected_cash, actual_cash, gcash_total, check_total, other_total, total_collected,
        cash_variance, explanation, status, reviewed_by, receipts_summary, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      recId,
      delivery_batch_id || '',
      reconciliation_date || new Date().toISOString().split('T')[0],
      area || 'Valencia City',
      route || '',
      driver_name || '',
      collection_handler || '',
      expCash,
      actCash,
      parseFloat(gcash_total || 0),
      parseFloat(check_total || 0),
      parseFloat(other_total || 0),
      parseFloat(total_collected || 0),
      variance,
      explanation || '',
      status || (variance === 0 ? 'Resolved' : 'Pending Review'),
      reviewed_by || null,
      JSON.stringify(receipts_summary || [])
    ];
    const { rows } = await db.query(query, values);

    await logAudit(collection_handler || 'Staff', 'Staff', 'RECORD_CASH_RECONCILIATION', 'Cash Reconciliation',
      `Recorded route cash reconciliation ${recId} (Variance: ₱${variance.toFixed(2)}, Status: ${rows[0].status})`, rows[0],
      variance !== 0 ? 'warning' : 'info');

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cash-reconciliations/:id', async (req, res) => {
  const { id } = req.params;
  const { explanation, status, reviewed_by, actual_cash, expected_cash, cash_variance } = req.body;
  try {
    const isResolving = status === 'Resolved';
    const query = `
      UPDATE cash_reconciliations SET
        explanation = COALESCE($1, explanation),
        status = COALESCE($2, status),
        reviewed_by = COALESCE($3, reviewed_by),
        reviewed_at = CASE WHEN $2 = 'Resolved' THEN NOW() ELSE reviewed_at END,
        actual_cash = COALESCE($4, actual_cash),
        expected_cash = COALESCE($5, expected_cash),
        cash_variance = COALESCE($6, cash_variance),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      explanation,
      status,
      reviewed_by,
      actual_cash !== undefined ? parseFloat(actual_cash) : null,
      expected_cash !== undefined ? parseFloat(expected_cash) : null,
      cash_variance !== undefined ? parseFloat(cash_variance) : null,
      id
    ];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Reconciliation record not found' });

    await logAudit(reviewed_by || 'Admin', 'Admin', 'REVIEW_CASH_RECONCILIATION', 'Cash Reconciliation',
      `Reconciliation ${id} updated to ${rows[0].status} by ${reviewed_by || 'Admin'}`, rows[0]);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 12. PAYMENTS & COLLECTIONS
// ==========================================
app.get('/api/payments', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM payments ORDER BY payment_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments', async (req, res) => {
  const {
    id, receipt_id, booking_id, customer_id, store_name,
    amount, payment_method, reference_no, payment_date, received_by, notes
  } = req.body;
  try {
    const payId = id || `PAY-${Date.now().toString().slice(-6)}`;
    const parsedAmount = parseFloat(amount || 0);

    if (parsedAmount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be greater than zero.' });
    }

    const query = `
      INSERT INTO payments (
        id, receipt_id, booking_id, customer_id, store_name,
        amount, payment_method, reference_no, payment_date, received_by, notes, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Active', NOW())
      RETURNING *;
    `;
    const values = [
      payId,
      receipt_id || '',
      booking_id || '',
      customer_id || '',
      store_name || 'Customer Store',
      parsedAmount,
      payment_method || 'Cash',
      reference_no || '',
      payment_date || new Date().toISOString().split('T')[0],
      received_by || 'Staff',
      notes || ''
    ];
    const { rows } = await db.query(query, values);

    // If linked to a booking, update paid_amount and status
    if (booking_id) {
      await db.query(`
        UPDATE bookings SET 
          paid_amount = COALESCE(paid_amount, 0) + $1,
          payment_method = $2
        WHERE id = $3;
      `, [parsedAmount, payment_method, booking_id]);
    }

    await logAudit(received_by || 'Staff', 'Staff', 'RECORD_PAYMENT', 'Sales & Payments',
      `Recorded payment ${payId} of ₱${parsedAmount.toFixed(2)} via ${payment_method} for ${store_name}`, rows[0]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/payments/:id/reverse', async (req, res) => {
  const { id } = req.params;
  const { reason, reversed_by } = req.body;
  try {
    const { rows: existing } = await db.query('SELECT * FROM payments WHERE id = $1', [id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Payment record not found' });
    if (existing[0].status === 'Reversed') return res.status(400).json({ error: 'Payment has already been reversed' });

    const pay = existing[0];
    const query = `
      UPDATE payments SET
        status = 'Reversed',
        reversed_reason = $1,
        reversed_by = $2,
        reversed_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await db.query(query, [reason || 'Reversed by Authorized Staff', reversed_by || 'Admin', id]);

    // Reverse payment amount from booking if linked
    if (pay.booking_id) {
      await db.query(`
        UPDATE bookings SET 
          paid_amount = GREATEST(0, COALESCE(paid_amount, 0) - $1)
        WHERE id = $2;
      `, [pay.amount, pay.booking_id]);
    }

    await logAudit(reversed_by || 'Admin', 'Admin', 'REVERSE_PAYMENT', 'Sales & Payments',
      `Reversed payment ${id} (₱${pay.amount}): ${reason}`, rows[0], 'warning');

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 13. MONTHLY TIMEMARK FREEZER SCANS
// ==========================================
app.get('/api/freezer-scans', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM freezer_scans ORDER BY scan_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/freezer-scans', async (req, res) => {
  const {
    id, freezer_id, store_id, store_name, freezer_code, reporting_month,
    scan_date, staff_name, photo_url, notes, verification_status
  } = req.body;
  try {
    const scanId = id || `FS-${Date.now().toString().slice(-6)}`;
    const currMonth = reporting_month || new Date().toISOString().slice(0, 7);

    const query = `
      INSERT INTO freezer_scans (
        id, freezer_id, store_id, store_name, freezer_code, reporting_month,
        scan_date, staff_name, photo_url, notes, verification_status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *;
    `;
    const values = [
      scanId,
      freezer_id || '',
      store_id || '',
      store_name || '',
      freezer_code || '',
      currMonth,
      scan_date || new Date().toISOString(),
      staff_name || 'Staff Scanner',
      photo_url || '',
      notes || '',
      verification_status || 'Verified'
    ];
    const { rows } = await db.query(query, values);

    // Update freezer record with last scan info
    if (freezer_id) {
      await db.query(`
        UPDATE freezers SET
          last_timemark_scan = NOW(),
          timemark_verified = true,
          scan_photo = COALESCE($1, scan_photo)
        WHERE id = $2 OR selecta_number = $2 OR serial_number = $2;
      `, [photo_url || null, freezer_id]);
    }

    await logAudit(staff_name || 'Staff', 'Staff', 'RECORD_FREEZER_SCAN', 'Monthly Timemark Scans',
      `Uploaded Timemark scan ${scanId} for freezer ${freezer_code} at ${store_name} (Month: ${currMonth})`, rows[0]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/freezer-scans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM freezer_scans WHERE id = $1', [id]);
    await logAudit('Admin', 'Admin', 'DELETE_FREEZER_SCAN', 'Monthly Timemark Scans', `Deleted freezer scan ${id}`);
    res.json({ success: true, message: 'Freezer scan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 14. SELECTA POS QUOTA & ENTRIES
// ==========================================
app.get('/api/quota-entries', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM quota_entries ORDER BY entry_date DESC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/quota-entries', async (req, res) => {
  const {
    id, month, entry_date, reference_no, supplier_order_ref, amount, status, confirmed_by, notes
  } = req.body;
  try {
    const entryId = id || `QE-${Date.now().toString().slice(-6)}`;
    const parsedAmount = parseFloat(amount || 0);

    const query = `
      INSERT INTO quota_entries (
        id, month, entry_date, reference_no, supplier_order_ref, amount, status, confirmed_by, notes, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;
    const values = [
      entryId,
      month || new Date().toISOString().slice(0, 7),
      entry_date || new Date().toISOString().split('T')[0],
      reference_no || '',
      supplier_order_ref || '',
      parsedAmount,
      status || 'Confirmed',
      confirmed_by || 'Dealer Owner',
      notes || ''
    ];
    const { rows } = await db.query(query, values);

    await logAudit(confirmed_by || 'Dealer Owner', 'Admin', 'RECORD_QUOTA_ENTRY', 'Selecta POS Quota',
      `Recorded confirmed Selecta POS entry ${reference_no} for ₱${parsedAmount.toFixed(2)} (Month: ${month})`, rows[0]);

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/quota-entries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM quota_entries WHERE id = $1', [id]);
    await logAudit('Admin', 'Admin', 'DELETE_QUOTA_ENTRY', 'Selecta POS Quota', `Deleted quota entry ${id}`);
    res.json({ success: true, message: 'Quota entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quotas', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM quotas ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/quotas', async (req, res) => {
  const { target_amount, month, notes } = req.body;
  try {
    const query = `
      INSERT INTO quotas (id, month, target_amount, notes, updated_at)
      VALUES (1, $1, $2, $3, NOW())
      ON CONFLICT (id) DO UPDATE SET
        month = EXCLUDED.month,
        target_amount = EXCLUDED.target_amount,
        notes = EXCLUDED.notes,
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [month || 'Current Month', parseFloat(target_amount || 1000000), notes || ''];
    const { rows } = await db.query(query, values);

    await logAudit('Admin', 'Admin', 'SET_QUOTA_TARGET', 'Selecta POS Quota',
      `Set monthly target to ₱${parseFloat(target_amount).toLocaleString()} for ${month}`);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 15. INVENTORY ADJUSTMENTS
// ==========================================
app.post('/api/inventory/adjust', async (req, res) => {
  const { product_id, stock_type, change_qty, reason, user_name, reference_no } = req.body;
  try {
    const qty = parseInt(change_qty || 0);
    if (!product_id || qty === 0) {
      return res.status(400).json({ error: 'Valid product and non-zero quantity required' });
    }

    // Determine target column
    let column = 'stock';
    if (stock_type === 'reserved') column = 'reserved_stock';
    else if (stock_type === 'damaged') column = 'damaged_stock';
    else if (stock_type === 'bo_returned') column = 'bo_returned_stock';

    const { rows: prodRows } = await db.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
    if (prodRows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const product = prodRows[0];

    await db.query(`
      UPDATE products SET 
        ${column} = GREATEST(0, COALESCE(${column}, 0) + $1),
        updated_at = NOW()
      WHERE id = $2;
    `, [qty, product_id]);

    const ledgId = `LEDG-${Date.now().toString().slice(-6)}`;
    await db.query(`
      INSERT INTO inventory_ledger (id, timestamp, product_id, product_name, category, type, change_qty, running_on_hand, reference_no, staff, notes)
      VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `, [
      ledgId,
      product.id,
      product.name,
      product.category,
      `Inventory Adjustment (${stock_type})`,
      qty,
      (product.stock || 0) + (stock_type === 'sellable' ? qty : 0),
      reference_no || 'ADJ-MANUAL',
      user_name || 'Admin',
      reason || 'Physical inventory reconciliation'
    ]);

    await logAudit(user_name || 'Admin', 'Admin', 'INVENTORY_ADJUSTMENT', 'Inventory Management',
      `Adjusted ${product.name} ${stock_type} stock by ${qty > 0 ? '+' : ''}${qty} units. Reason: ${reason}`);

    res.json({ success: true, message: 'Inventory adjusted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 16. COMPREHENSIVE REPORTS AGGREGATION
// ==========================================
app.get('/api/reports/summary', async (req, res) => {
  try {
    const [
      customersCount, productsCount, bookingsCount, salesSummary,
      freezersCount, pendingReconciliation, quotaAchieved
    ] = await Promise.all([
      db.query('SELECT COUNT(*) FROM customers WHERE status = \'Active\''),
      db.query('SELECT COUNT(*), SUM(stock) as total_stock, COUNT(*) FILTER (WHERE stock <= min_stock) as low_stock FROM products'),
      db.query('SELECT COUNT(*), SUM(estimated_total) as total_booked, COUNT(*) FILTER (WHERE status = \'Booked\' OR status = \'Ready for Deliver\') as pending_delivery FROM bookings'),
      db.query('SELECT SUM(net_delivered_amount) as total_sales, SUM(paid_amount) as total_paid, SUM(shortage_amount) as total_shortages, SUM(bo_deductions) as total_bo, SUM(missing_deductions) as total_missing FROM bookings WHERE status = \'Delivered\''),
      db.query('SELECT COUNT(*), COUNT(*) FILTER (WHERE timemark_verified = true) as verified_count FROM freezers'),
      db.query('SELECT COUNT(*) as pending_count, SUM(cash_variance) as total_variance FROM cash_reconciliations WHERE status = \'Pending Review\''),
      db.query('SELECT SUM(amount) as confirmed_quota FROM quota_entries WHERE status = \'Confirmed\'')
    ]);

    res.json({
      activeCustomers: parseInt(customersCount.rows[0].count || 0),
      totalProducts: parseInt(productsCount.rows[0].count || 0),
      totalStockUnits: parseInt(productsCount.rows[0].total_stock || 0),
      lowStockProducts: parseInt(productsCount.rows[0].low_stock || 0),
      totalBookings: parseInt(bookingsCount.rows[0].count || 0),
      pendingDeliveries: parseInt(bookingsCount.rows[0].pending_delivery || 0),
      deliveredSales: parseFloat(salesSummary.rows[0].total_sales || 0),
      totalPaid: parseFloat(salesSummary.rows[0].total_paid || 0),
      totalShortages: parseFloat(salesSummary.rows[0].total_shortages || 0),
      totalBODeductions: parseFloat(salesSummary.rows[0].total_bo || 0),
      totalMissingDeductions: parseFloat(salesSummary.rows[0].total_missing || 0),
      totalFreezers: parseInt(freezersCount.rows[0].count || 0),
      verifiedFreezers: parseInt(freezersCount.rows[0].verified_count || 0),
      pendingReconciliations: parseInt(pendingReconciliation.rows[0].pending_count || 0),
      reconciliationVariance: parseFloat(pendingReconciliation.rows[0].total_variance || 0),
      confirmedQuotaAchieved: parseFloat(quotaAchieved.rows[0].confirmed_quota || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Llano SELECTA API Server running on port ${PORT}`);
});
