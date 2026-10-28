const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:032422@localhost:5432/llano_selecta_db'
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL (llano_selecta_db)...');

  // 1. Create Users Table (for the 2 users: Admin & Staff with Access Keys)
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Staff')),
      access_key VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed the 2 Users with their Access Keys
  await client.query(`
    INSERT INTO users (id, name, email, role, access_key, password_hash, phone, status) VALUES
    ('USR-ADMIN', 'Dealer Admin', 'admin@selecta.com', 'Admin', 'SELECTA-ADMIN-2026', 'admin123', '0917-000-0001', 'Active'),
    ('USR-STAFF', 'Dealer Staff', 'staff@selecta.com', 'Staff', 'SELECTA-STAFF-2026', 'staff123', '0917-000-0002', 'Active')
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      access_key = EXCLUDED.access_key,
      password_hash = EXCLUDED.password_hash;
  `);
  console.log('✓ Users table created and seeded with Admin and Staff access keys.');

  // 2. Seed Customers
  await client.query(`
    INSERT INTO customers (id, store_name, owner_name, contact, area, status) VALUES
    ('CUST-001', 'Aling Nena Sari-Sari Store', 'Nena Dela Cruz', '0917-123-4567', 'Valencia City (Batangan)', 'Active'),
    ('CUST-002', 'San Isidro Mini-Mart', 'Maria Clara', '0918-234-5678', 'Valencia City (San-Isidro)', 'Active'),
    ('CUST-003', 'Cabanglasan Highland Corner', 'Ramon Santos', '0919-345-6789', 'Cabanglasan Area', 'Active'),
    ('CUST-004', 'Kahaponan Grocery Hub', 'Elena Bautista', '0920-456-7890', 'Valencia City (Kahaponan)', 'Active'),
    ('CUST-005', 'Lumbayao Refreshments', 'Teresa Gomez', '0921-567-8901', 'Valencia City (Lumabayo)', 'Active'),
    ('CUST-006', 'Halapitan Trading Post', 'Danilo Reyes', '0922-678-9012', 'San Fernando Area', 'Active'),
    ('CUST-007', 'Sinabuagan Golden Store', 'Lucia Fernandez', '0923-789-0123', 'Valencia City (Sinabuagan)', 'Active')
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Customers seeded.');

  // 3. Seed Freezers
  await client.query(`
    INSERT INTO freezers (id, selecta_number, barcode, model, condition, status, assigned_store, payment_details, last_scan) VALUES
    ('FRZ-001', 'SEL-FRZ-8821', 'BC-8821-VAL', 'Selecta Glass Top 300L', 'Good', 'Deployed', 'Aling Nena Sari-Sari Store', '{"totalFee": 10000, "status": "Paid"}'::jsonb, '{"date": "2026-10-10", "timemark": "TM-8821"}'::jsonb),
    ('FRZ-002', 'SEL-FRZ-8822', 'BC-8822-VAL', 'Selecta Chest Freezer 400L', 'Good', 'Deployed', 'San Isidro Mini-Mart', '{"totalFee": 10000, "status": "Paid"}'::jsonb, '{"date": "2026-10-11", "timemark": "TM-8822"}'::jsonb),
    ('FRZ-003', 'SEL-FRZ-9011', 'BC-9011-CAB', 'Selecta Glass Top 300L', 'Good', 'Deployed', 'Cabanglasan Highland Corner', '{"totalFee": 10000, "status": "Paid"}'::jsonb, '{"date": "2026-10-12", "timemark": "TM-9011"}'::jsonb),
    ('FRZ-004', 'SEL-FRZ-8825', 'BC-8825-VAL', 'Selecta Double Door 500L', 'Good', 'Deployed', 'Kahaponan Grocery Hub', '{"totalFee": 10000, "status": "Paid"}'::jsonb, '{"date": "2026-10-12", "timemark": "TM-8825"}'::jsonb),
    ('FRZ-005', 'SEL-FRZ-8800', 'BC-8800-WH', 'Selecta Standby Chest 400L', 'Fair', 'Pull Out', 'Llano Central Warehouse', '{"totalFee": 0, "status": "Warehouse"}'::jsonb, '{"date": "2026-10-01", "timemark": "TM-8800"}'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Freezers seeded.');

  // 4. Seed Bookings
  await client.query(`
    INSERT INTO bookings (id, store_name, booking_date, status, items, estimated_total) VALUES
    ('BK-2026-1001', 'Aling Nena Sari-Sari Store', '2026-10-14', 'Delivered', '[{"name": "CLASSIC (MAGNUM)", "qty": 10, "price": 165.20}, {"name": "CHOCOLATE (CORNETTO)", "qty": 20, "price": 28.00}]'::jsonb, 2212.00),
    ('BK-2026-1002', 'San Isidro Mini-Mart', '2026-10-14', 'Booked', '[{"name": "COOKIES & CREAM (STICKS)", "qty": 15, "price": 25.00}, {"name": "DOUBLE DUTCH (SUPREME 1.3L)", "qty": 8, "price": 238.70}]'::jsonb, 2284.60),
    ('BK-2026-1003', 'Cabanglasan Highland Corner', '2026-10-15', 'Booked', '[{"name": "COOKIES & DREAM (CORNETTO)", "qty": 25, "price": 28.00}]'::jsonb, 700.00),
    ('BK-2026-1004', 'Lumbayao Refreshments', '2026-10-15', 'Backload', '[{"name": "ALMOND (MAGNUM)", "qty": 5, "price": 165.20}]'::jsonb, 826.00)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Bookings seeded.');

  // 5. Seed Quotas
  await client.query(`
    INSERT INTO quotas (id, month, target_amount) VALUES
    (1, 'October 2026', 1000000.00)
    ON CONFLICT (id) DO UPDATE SET target_amount = EXCLUDED.target_amount;
  `);
  console.log('✓ Quotas seeded.');

  // 6. Seed POS Sales
  await client.query(`
    INSERT INTO pos_sales (id, delivery_ref, customer_name, gross_amount, bo_deduction, missing_deduction, net_bill_amount, paid_amount, shortage_amount, payment_method, status, payment_details, items) VALUES
    ('SALE-2026-101', 'DEL-2026-101', 'Aling Nena Sari-Sari Store', 5000.00, 150.00, 56.00, 4794.00, 4794.00, 0.00, 'Cash', 'Paid', '{"method": "Cash", "receipt": "OR-101"}'::jsonb, '[{"name": "Cornetto Vanilla", "qty": 20, "price": 28.00}]'::jsonb),
    ('SALE-2026-102', 'DEL-2026-102', 'San Isidro Mini-Mart', 10000.00, 174.00, 0.00, 9826.00, 9000.00, 826.00, 'Cash', 'Shortage', '{"method": "Cash", "receipt": "OR-102"}'::jsonb, '[{"name": "Magnum Classic", "qty": 10, "price": 58.00}]'::jsonb)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ POS Sales seeded.');

  // 7. Seed Discrepancies
  await client.query(`
    INSERT INTO discrepancies (id, delivery_ref, customer_name, type, product_name, discrepancy_qty, unit_price, deduction_amount, reason, recorded_by, condition) VALUES
    ('DISC-001', 'DEL-2026-101', 'Aling Nena Sari-Sari Store', 'Missing', 'Cornetto Vanilla 110ml', 2, 28.00, 56.00, 'Forgotten in ice box #001', 'Juan Driver', 'Resolved'),
    ('DISC-002', 'DEL-2026-101', 'Aling Nena Sari-Sari Store', 'BO / Melted', 'Magnum Classic 80ml', 1, 150.00, 150.00, 'Melted in transit (high ambient temp)', 'Juan Driver', 'Returned to Warehouse'),
    ('DISC-003', 'DEL-2026-102', 'San Isidro Mini-Mart', 'BO / Melted', 'Supreme Rocky Road 1.3L', 1, 174.00, 174.00, 'Soft tub on arrival', 'Pedro Driver', 'Returned to Warehouse')
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Discrepancies seeded.');

  // 8. Seed Stock Receiving
  await client.query(`
    INSERT INTO stock_receiving (id, po_number, truck_plate, driver_info, arrival_date, arrival_time, receiver, checker, status, remarks, items, total_received_value) VALUES
    ('RCV-2026-001', 'PO-SEL-9042', 'KAB-4819', 'Selecta Delivery Crew', '2026-10-14', '09:30 AM', 'Pedro Warehouse', 'Maria Checker', 'Completed', 'Received full bulk ice cream van without damages.', '[{"sku": "COR-001", "name": "Cornetto Chocolate", "boxes": 50}]'::jsonb, 184500.00)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Stock receiving seeded.');

  // Summary
  console.log('\n======================================================');
  console.log('LIVE DATABASE TABLES & RECORD COUNTS IN PGADMIN 4:');
  console.log('======================================================');
  const allTables = ['users', 'products', 'customers', 'freezers', 'bookings', 'pos_sales', 'discrepancies', 'quotas', 'stock_receiving'];
  for (const t of allTables) {
    const res = await client.query(`SELECT COUNT(*) FROM "${t}";`);
    console.log(`• Table "${t}": ${res.rows[0].count} rows`);
  }

  const usersRes = await client.query('SELECT name, email, role, access_key, status FROM users ORDER BY role ASC;');
  console.log('\n======================================================');
  console.log('2 CONFIGURED USERS & ACCESS KEYS:');
  console.log('======================================================');
  console.table(usersRes.rows);

  await client.end();
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
