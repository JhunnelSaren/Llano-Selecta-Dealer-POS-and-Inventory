const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:032422@localhost:5432/llano_selecta_db'
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL llano_selecta_db...');

  // 1. SYSTEM SETTINGS TABLE
  await client.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'SYSTEM_SETTINGS',
      login_photo_url TEXT,
      login_caption TEXT,
      login_description TEXT,
      dealer_logo_url TEXT,
      dealer_name VARCHAR(255) DEFAULT 'Llano Selecta Dealer',
      contact_number VARCHAR(50) DEFAULT '0917-123-4567',
      address VARCHAR(255) DEFAULT 'Valencia City, Bukidnon',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    INSERT INTO system_settings (id, login_photo_url, login_caption, login_description, dealer_logo_url, dealer_name)
    VALUES (
      'SYSTEM_SETTINGS',
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=2000',
      'Selecta Ice Cream Dealer Operations & Cold-Chain Management',
      'Official distribution portal for store bookings, cold delivery fulfillment, and payment collections across Valencia, Cabanglasan, and San Fernando.',
      '',
      'Llano Selecta Dealer'
    )
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ system_settings ready');

  // 2. USERS TABLE - ensure username and last_login columns exist
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
  `);

  // Ensure unique constraint on username if not already
  try {
    await client.query(`ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);`);
  } catch (e) {
    // Already exists or duplicate, ignore
  }

  // Update existing users or insert admin and staff
  await client.query(`
    UPDATE users SET username = 'admin' WHERE id = 'USR-ADMIN' AND (username IS NULL OR username = '');
    UPDATE users SET username = 'staff' WHERE id = 'USR-STAFF' AND (username IS NULL OR username = '');
  `);

  await client.query(`
    INSERT INTO users (id, username, name, email, role, access_key, password_hash, phone, status, last_login)
    VALUES 
    ('USR-ADMIN', 'admin', 'Dealer Admin', 'admin@selecta.com', 'Admin', 'SELECTA-ADMIN-2026', 'admin123', '0917-000-0001', 'Active', NOW()),
    ('USR-STAFF', 'staff', 'Dealer Staff', 'staff@selecta.com', 'Staff', 'SELECTA-STAFF-2026', 'staff123', '0917-000-0002', 'Active', NOW() - INTERVAL '1 hour')
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      password_hash = EXCLUDED.password_hash;
  `);
  console.log('✓ users ready with admin and staff');

  // 3. EMPLOYEES TABLE - columns: id, name, role, contact, email, birthdate, date_applied, photo_url, status
  await client.query(`
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS role VARCHAR(100);
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS birthdate DATE;
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_applied DATE DEFAULT CURRENT_DATE;
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS photo_url TEXT;
  `);

  try {
    await client.query(`ALTER TABLE employees ALTER COLUMN primary_role DROP NOT NULL;`);
  } catch (e) {}

  // Copy primary_role to role if role is null
  await client.query(`
    UPDATE employees SET role = primary_role WHERE role IS NULL AND primary_role IS NOT NULL;
  `);

  // Seed initial realistic employees
  await client.query(`
    INSERT INTO employees (id, name, role, primary_role, contact, email, birthdate, date_applied, photo_url, status)
    VALUES
    ('EMP-001', 'Juan Dela Cruz', 'Driver', 'Driver', '0917-111-2222', 'juan.delacruz@gmail.com', '1992-05-14', '2026-01-10', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'Active'),
    ('EMP-002', 'Pedro Penduko', 'Booker', 'Booker', '0918-333-4444', 'pedro.penduko@gmail.com', '1995-08-22', '2026-02-15', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Active'),
    ('EMP-003', 'Maria Clara', 'Cashier', 'Cashier', '0919-555-6666', 'maria.clara@gmail.com', '1998-11-03', '2026-03-01', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', 'Active'),
    ('EMP-004', 'Roberto Santos', 'Warehouse Staff', 'Warehouse Staff', '0920-777-8888', 'roberto.santos@gmail.com', '1990-03-19', '2026-03-20', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Active')
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      primary_role = EXCLUDED.primary_role,
      birthdate = EXCLUDED.birthdate,
      date_applied = EXCLUDED.date_applied,
      photo_url = EXCLUDED.photo_url;
  `);
  console.log('✓ employees ready');

  // 4. BOOKINGS TABLE - add missing columns for delivery and POS settlement
  await client.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS area VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS route VARCHAR(255);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time VARCHAR(50) DEFAULT '09:00 AM';
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_receipt NUMERIC(12, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS bo_deductions NUMERIC(10, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS missing_deductions NUMERIC(10, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS net_delivered_amount NUMERIC(12, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Cash';
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS shortage_amount NUMERIC(10, 2) DEFAULT 0.00;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receipt_ref VARCHAR(100);
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS remarks TEXT;
  `);

  // Ensure store_name and customer are synced
  await client.query(`
    UPDATE bookings SET customer = store_name WHERE (customer IS NULL OR customer = '') AND store_name IS NOT NULL;
    UPDATE bookings SET store_name = customer WHERE (store_name IS NULL OR store_name = '') AND customer IS NOT NULL;
    UPDATE bookings SET area = 'Valencia City' WHERE area IS NULL OR area = '';
    UPDATE bookings SET total_receipt = estimated_total WHERE total_receipt = 0 OR total_receipt IS NULL;
    UPDATE bookings SET net_delivered_amount = estimated_total WHERE net_delivered_amount = 0 OR net_delivered_amount IS NULL;
  `);

  // Seed realistic bookings across Cabanglasan, Valencia, San Fernando
  await client.query(`
    INSERT INTO bookings (
      id, store_name, customer, owner_name, area, route, booking_date, booking_time,
      status, items, estimated_total, total_receipt, bo_deductions, missing_deductions,
      net_delivered_amount, payment_method, paid_amount, shortage_amount, delivered_at, receipt_ref, remarks
    ) VALUES
    (
      'BK-2026-1001', 'Aling Nena Sari-Sari Store', 'Aling Nena Sari-Sari Store', 'Nena Dela Cruz',
      'Valencia City', 'Valencia City Route (Batangan)', '2026-10-24', '08:30 AM',
      'Delivered',
      '[{"productId": "MAG-001", "name": "CLASSIC (MAGNUM)", "qty": 10, "price": 165.20}, {"productId": "COR-001", "name": "CHOCOLATE (CORNETTO)", "qty": 20, "price": 28.00}]'::jsonb,
      2212.00, 2212.00, 150.00, 0.00, 2062.00, 'Cash', 2062.00, 0.00, NOW() - INTERVAL '1 day', 'OR-VAL-1001', 'Paid in full upon delivery'
    ),
    (
      'BK-2026-1002', 'San Isidro Mini-Mart', 'San Isidro Mini-Mart', 'Juan Santos',
      'Valencia City', 'Valencia City Route (San-Isidro)', '2026-10-25', '09:15 AM',
      'Ready for Deliver',
      '[{"productId": "STK-001", "name": "COOKIES & CREAM (STICKS)", "qty": 15, "price": 25.00}, {"productId": "SUP-001", "name": "DOUBLE DUTCH (SUPREME 1.3L)", "qty": 8, "price": 238.70}]'::jsonb,
      2284.60, 2284.60, 0.00, 0.00, 2284.60, 'Cash', 0.00, 0.00, NULL, '', 'Packaged in ice box #1'
    ),
    (
      'BK-2026-1003', 'Cabanglasan Highland Corner', 'Cabanglasan Highland Corner', 'Ramon Santos Jr.',
      'Cabanglasan', 'Cabanglasan Loop', '2026-10-25', '10:00 AM',
      'Delivered',
      '[{"productId": "COR-002", "name": "COOKIES & DREAM (CORNETTO)", "qty": 25, "price": 28.00}, {"productId": "MAG-001", "name": "CLASSIC (MAGNUM)", "qty": 5, "price": 165.20}]'::jsonb,
      1526.00, 1526.00, 56.00, 0.00, 1470.00, 'GCash', 1470.00, 0.00, NOW() - INTERVAL '2 hours', 'GC-CAB-9821', 'Paid via GCash reference 98214431'
    ),
    (
      'BK-2026-1004', 'Cabanglasan Central Grocery', 'Cabanglasan Central Grocery', 'Elena Bautista',
      'Cabanglasan', 'Cabanglasan Loop', '2026-10-25', '11:30 AM',
      'Booked',
      '[{"productId": "SUP-001", "name": "DOUBLE DUTCH (SUPREME 1.3L)", "qty": 10, "price": 238.70}, {"productId": "COR-001", "name": "CHOCOLATE (CORNETTO)", "qty": 30, "price": 28.00}]'::jsonb,
      3227.00, 3227.00, 0.00, 0.00, 3227.00, 'Cash', 0.00, 0.00, NULL, '', 'Booked for Cabanglasan Tuesday run'
    ),
    (
      'BK-2026-1005', 'Halapitan Trading Post', 'Halapitan Trading Post', 'Danilo Reyes',
      'San Fernando', 'Valencia -> San Fernando', '2026-10-24', '01:00 PM',
      'Delivered',
      '[{"productId": "MAG-001", "name": "CLASSIC (MAGNUM)", "qty": 15, "price": 165.20}]'::jsonb,
      2478.00, 2478.00, 165.20, 0.00, 2312.80, 'Cash', 2312.80, 0.00, NOW() - INTERVAL '1 day', 'OR-SFD-401', 'B.O 1 melted Magnum deducted'
    )
    ON CONFLICT (id) DO UPDATE SET
      store_name = EXCLUDED.store_name,
      customer = EXCLUDED.customer,
      owner_name = EXCLUDED.owner_name,
      area = EXCLUDED.area,
      status = EXCLUDED.status,
      booking_time = EXCLUDED.booking_time,
      total_receipt = EXCLUDED.total_receipt,
      bo_deductions = EXCLUDED.bo_deductions,
      net_delivered_amount = EXCLUDED.net_delivered_amount,
      payment_method = EXCLUDED.payment_method;
  `);
  console.log('✓ bookings ready with Cabanglasan, Valencia, and San Fernando');

  // 5. INVENTORY & RECEIVING
  await client.query(`
    CREATE TABLE IF NOT EXISTS stock_receiving (
      id VARCHAR(50) PRIMARY KEY,
      po_number VARCHAR(100) NOT NULL,
      truck_plate VARCHAR(50) NOT NULL,
      driver_info VARCHAR(255),
      arrival_date DATE DEFAULT CURRENT_DATE,
      arrival_time VARCHAR(50),
      receiver VARCHAR(255),
      checker VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Delivered to Warehouse',
      remarks TEXT,
      items JSONB DEFAULT '[]'::jsonb,
      total_received_value NUMERIC(12, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    INSERT INTO stock_receiving (id, po_number, truck_plate, driver_info, arrival_date, arrival_time, receiver, checker, status, remarks, items, total_received_value)
    VALUES
    (
      'RCV-2026-001', 'PO-SEL-9042', 'KAB-4819', 'SELECTA Bodega Freezer Van #4', '2026-10-24', '09:30 AM',
      'Roberto Santos', 'Pedro Checker', 'Delivered to Warehouse', 'Cold chain intact at -18C. Received into Bodega.',
      '[{"productId": "COR-001", "name": "CHOCOLATE (CORNETTO)", "ordered": 200, "received": 200, "damaged": 0, "price": 28.00}, {"productId": "MAG-001", "name": "CLASSIC (MAGNUM)", "ordered": 100, "received": 98, "damaged": 2, "price": 165.20}]'::jsonb,
      21789.60
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS inventory_ledger (
      id VARCHAR(50) PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      product_id VARCHAR(50),
      product_name VARCHAR(255),
      category VARCHAR(100),
      type VARCHAR(100) NOT NULL,
      change_qty INT NOT NULL,
      running_on_hand INT NOT NULL,
      reference_no VARCHAR(100),
      staff VARCHAR(255),
      notes TEXT
    );
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    ALTER TABLE inventory_ledger DROP CONSTRAINT IF EXISTS inventory_ledger_product_id_fkey;
  `);

  await client.query(`
    INSERT INTO inventory_ledger (id, timestamp, product_id, product_name, category, type, change_qty, running_on_hand, reference_no, staff, notes)
    VALUES
    ('LEDG-001', NOW() - INTERVAL '1 day', 'COR-001', 'CHOCOLATE', 'CORNETTO', 'Stock Receiving (Freezer Van)', 200, 250, 'RCV-2026-001', 'Roberto Santos', 'Received from PO-SEL-9042'),
    ('LEDG-002', NOW() - INTERVAL '1 day', 'MAG-001', 'CLASSIC', 'MAGNUM', 'Stock Receiving (Freezer Van)', 98, 140, 'RCV-2026-001', 'Roberto Santos', 'Received from PO-SEL-9042 (2 damaged rejected)'),
    ('LEDG-003', NOW() - INTERVAL '6 hours', 'COR-001', 'CHOCOLATE', 'CORNETTO', 'Store Delivery', -20, 230, 'BK-2026-1001', 'Juan Dela Cruz', 'Delivered to Aling Nena'),
    ('LEDG-004', NOW() - INTERVAL '2 hours', 'COR-002', 'COOKIES & DREAM', 'CORNETTO', 'Store Delivery', -25, 175, 'BK-2026-1003', 'Pedro Penduko', 'Delivered to Cabanglasan Highland')
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ stock_receiving & inventory_ledger ready');

  await client.end();
  console.log('All migrations completed successfully!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
