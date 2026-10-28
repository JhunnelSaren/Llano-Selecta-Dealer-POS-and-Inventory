const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:032422@localhost:5432/llano_selecta_db'
});

async function runMigration() {
  await client.connect();
  console.log('Connected to llano_selecta_db. Applying schema upgrades...');

  // 1. Supplier Orders table (Selecta Order Summary)
  await client.query(`
    CREATE TABLE IF NOT EXISTS supplier_orders (
      id VARCHAR(50) PRIMARY KEY,
      selecta_pos_ref VARCHAR(100),
      order_date DATE DEFAULT CURRENT_DATE,
      expected_arrival_date DATE,
      related_bookings JSONB DEFAULT '[]'::jsonb,
      items JSONB DEFAULT '[]'::jsonb,
      supplier_amount NUMERIC(12, 2) DEFAULT 0,
      responsible_person VARCHAR(100),
      notes TEXT,
      status VARCHAR(50) DEFAULT 'Draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ supplier_orders table ready');

  // 2. Delivery Batches table (Delivery Planning & Packing)
  await client.query(`
    CREATE TABLE IF NOT EXISTS delivery_batches (
      id VARCHAR(50) PRIMARY KEY,
      batch_number VARCHAR(100),
      delivery_date DATE DEFAULT CURRENT_DATE,
      area VARCHAR(100),
      route VARCHAR(255),
      driver_id VARCHAR(50),
      driver_name VARCHAR(100),
      helper1_name VARCHAR(100),
      helper2_name VARCHAR(100),
      booker_name VARCHAR(100),
      checker_name VARCHAR(100),
      vehicle_info VARCHAR(100) DEFAULT 'Bongo Refrigerated Van',
      status VARCHAR(50) DEFAULT 'Planned',
      stores JSONB DEFAULT '[]'::jsonb,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ delivery_batches table ready');

  // 3. Cash Reconciliations table (Route Closing)
  await client.query(`
    CREATE TABLE IF NOT EXISTS cash_reconciliations (
      id VARCHAR(50) PRIMARY KEY,
      delivery_batch_id VARCHAR(50),
      reconciliation_date DATE DEFAULT CURRENT_DATE,
      area VARCHAR(100),
      route VARCHAR(255),
      driver_name VARCHAR(100),
      collection_handler VARCHAR(100),
      expected_cash NUMERIC(12, 2) DEFAULT 0,
      actual_cash NUMERIC(12, 2) DEFAULT 0,
      gcash_total NUMERIC(12, 2) DEFAULT 0,
      check_total NUMERIC(12, 2) DEFAULT 0,
      other_total NUMERIC(12, 2) DEFAULT 0,
      total_collected NUMERIC(12, 2) DEFAULT 0,
      cash_variance NUMERIC(12, 2) DEFAULT 0,
      explanation TEXT,
      status VARCHAR(50) DEFAULT 'Pending Review',
      reviewed_by VARCHAR(100),
      reviewed_at TIMESTAMP,
      receipts_summary JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ cash_reconciliations table ready');

  // 4. Payments table
  await client.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id VARCHAR(50) PRIMARY KEY,
      receipt_id VARCHAR(50),
      booking_id VARCHAR(50),
      customer_id VARCHAR(50),
      store_name VARCHAR(255),
      amount NUMERIC(12, 2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      reference_no VARCHAR(100),
      payment_date DATE DEFAULT CURRENT_DATE,
      received_by VARCHAR(100),
      notes TEXT,
      status VARCHAR(50) DEFAULT 'Active',
      reversed_reason TEXT,
      reversed_by VARCHAR(100),
      reversed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ payments table ready');

  // 5. Freezer Scans table
  await client.query(`
    CREATE TABLE IF NOT EXISTS freezer_scans (
      id VARCHAR(50) PRIMARY KEY,
      freezer_id VARCHAR(50),
      store_id VARCHAR(50),
      store_name VARCHAR(255),
      freezer_code VARCHAR(100),
      reporting_month VARCHAR(20),
      scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      staff_name VARCHAR(100),
      photo_url TEXT,
      notes TEXT,
      verification_status VARCHAR(50) DEFAULT 'Verified',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ freezer_scans table ready');

  // 6. Quota Entries table
  await client.query(`
    CREATE TABLE IF NOT EXISTS quota_entries (
      id VARCHAR(50) PRIMARY KEY,
      month VARCHAR(20) NOT NULL,
      entry_date DATE DEFAULT CURRENT_DATE,
      reference_no VARCHAR(100),
      supplier_order_ref VARCHAR(100),
      amount NUMERIC(12, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'Confirmed',
      confirmed_by VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ quota_entries table ready');

  // 7. Ensure quotas table has month unique constraint & columns
  await client.query(`
    ALTER TABLE quotas ADD COLUMN IF NOT EXISTS target_amount NUMERIC(12, 2) DEFAULT 1000000.00;
    ALTER TABLE quotas ADD COLUMN IF NOT EXISTS notes TEXT;
    ALTER TABLE quotas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);

  // 8. Ensure inventory_ledger has required columns
  await client.query(`
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS product_id VARCHAR(50);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS category VARCHAR(100);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS change_qty INT;
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS running_on_hand INT;
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS type VARCHAR(100);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS reference_no VARCHAR(100);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS staff VARCHAR(100);
    ALTER TABLE inventory_ledger ADD COLUMN IF NOT EXISTS notes TEXT;
  `);

  // 9. Ensure products table has damaged_stock and reserved_stock columns
  await client.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS reserved_stock INT DEFAULT 0;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS damaged_stock INT DEFAULT 0;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS bo_returned_stock INT DEFAULT 0;
  `);

  // 10. Audit logs table check
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(50) PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_name VARCHAR(100),
      role VARCHAR(50),
      action VARCHAR(100),
      module VARCHAR(100),
      severity VARCHAR(50) DEFAULT 'info',
      description TEXT,
      ip_address VARCHAR(50),
      details JSONB
    );
  `);

  // Seed sample supplier orders if empty
  const soCount = await client.query('SELECT COUNT(*) FROM supplier_orders;');
  if (parseInt(soCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO supplier_orders (id, selecta_pos_ref, order_date, expected_arrival_date, related_bookings, items, supplier_amount, responsible_person, notes, status)
      VALUES (
        'SO-202610-001',
        'SEL-POS-99412',
        '2026-10-20',
        '2026-10-22',
        '["BK-2026-1001", "BK-2026-1002"]'::jsonb,
        '[
          {"productId": "COR-001", "productName": "CHOCOLATE (CORNETTO)", "category": "CORNETTO", "neededQty": 200, "currentStock": 150, "orderedQty": 200, "unitCost": 22.40, "totalCost": 4480.00},
          {"productId": "MAG-001", "productName": "CLASSIC (MAGNUM)", "category": "MAGNUM", "neededQty": 100, "currentStock": 80, "orderedQty": 100, "unitCost": 52.00, "totalCost": 5200.00},
          {"productId": "SUP-001", "productName": "DOUBLE DUTCH 1.3L", "category": "SUPREME 1.3L", "neededQty": 50, "currentStock": 45, "orderedQty": 50, "unitCost": 208.00, "totalCost": 10400.00}
        ]'::jsonb,
        20080.00,
        'Dealer Owner',
        'Bulk replenishment for Valencia and Cabanglasan routes',
        'Fully Received'
      );
    `);
    console.log('✓ Sample supplier_orders seeded.');
  }

  // Seed sample quota entries if empty
  const qeCount = await client.query('SELECT COUNT(*) FROM quota_entries;');
  if (parseInt(qeCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO quota_entries (id, month, entry_date, reference_no, supplier_order_ref, amount, status, confirmed_by, notes)
      VALUES
      ('QE-202610-001', '2026-10', '2026-10-05', 'SEL-INV-00184', 'SO-202610-001', 350000.00, 'Confirmed', 'Dealer Owner', 'Batch 1 bulk order entered in Selecta POS'),
      ('QE-202610-002', '2026-10', '2026-10-15', 'SEL-INV-00219', 'SO-202610-002', 280000.00, 'Confirmed', 'Dealer Owner', 'Batch 2 weekend stock replenishment'),
      ('QE-202610-003', '2026-10', '2026-10-25', 'SEL-INV-00305', 'SO-202610-003', 195000.00, 'Confirmed', 'Dealer Owner', 'Batch 3 Cabanglasan & San Fernando pre-orders');
    `);
    console.log('✓ Sample quota_entries seeded.');
  }

  // Seed sample freezer scans if empty
  const fsCount = await client.query('SELECT COUNT(*) FROM freezer_scans;');
  if (parseInt(fsCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO freezer_scans (id, freezer_id, store_id, store_name, freezer_code, reporting_month, scan_date, staff_name, photo_url, notes, verification_status)
      VALUES
      ('FS-202610-001', 'FRZ-001', 'CUST-001', 'Aling Nena Sari-Sari Store', 'SEL-FRZ-8821', '2026-10', '2026-10-10 10:15:00', 'Dealer Staff', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600', 'Timemark verified clean scan. Temperatures at -18°C.', 'Verified'),
      ('FS-202610-002', 'FRZ-002', 'CUST-002', 'San Isidro Mini-Mart', 'SEL-FRZ-8822', '2026-10', '2026-10-11 11:30:00', 'Dealer Staff', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600', 'Timemark timestamp matching physical sticker.', 'Verified');
    `);
    console.log('✓ Sample freezer_scans seeded.');
  }

  // Seed sample delivery batch if empty
  const dbCount = await client.query('SELECT COUNT(*) FROM delivery_batches;');
  if (parseInt(dbCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO delivery_batches (id, batch_number, delivery_date, area, route, driver_id, driver_name, helper1_name, helper2_name, booker_name, checker_name, vehicle_info, status, stores, notes)
      VALUES (
        'DB-202610-001',
        'BATCH-VAL-1024',
        '2026-10-24',
        'Valencia City',
        'Valencia City Route (Batangan & San Isidro)',
        'EMP-001',
        'Juan Santos',
        'Pedro Cruz',
        'Mark Reyes',
        'Nena Booker',
        'Maria Checker',
        'Bongo Refrigerated Van (KAB-4819)',
        'Delivered',
        '[
          {
            "bookingId": "BK-2026-1001",
            "storeId": "CUST-001",
            "storeName": "Aling Nena Sari-Sari Store",
            "boxId": "ICEBOX-VAL-01",
            "packedStatus": "Packed",
            "checkedBy": "Maria Checker",
            "deliveryStatus": "Delivered",
            "items": [
              {"name": "CLASSIC (MAGNUM)", "qty": 10, "price": 165.20, "packedQty": 10, "acceptedQty": 10, "missingQty": 0, "boQty": 0},
              {"name": "CHOCOLATE (CORNETTO)", "qty": 20, "price": 28.00, "packedQty": 20, "acceptedQty": 20, "missingQty": 0, "boQty": 0}
            ]
          }
        ]'::jsonb,
        'Morning route dispatched 07:00 AM, arrived safely, all boxes cooled with ice blocks.'
      );
    `);
    console.log('✓ Sample delivery_batches seeded.');
  }

  // Seed initial audit log if empty
  const alCount = await client.query('SELECT COUNT(*) FROM audit_logs;');
  if (parseInt(alCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO audit_logs (id, timestamp, user_name, role, action, module, severity, description, details)
      VALUES (
        'LOG-202610-001',
        NOW(),
        'Dealer Admin',
        'Admin',
        'SYSTEM_MIGRATION',
        'Database & Core Systems',
        'info',
        'Database schema synchronized with comprehensive 6-module architecture for Llano Selecta Dealer.',
        '{"status": "Success", "modules": ["Dashboard", "Operations", "Sales & Payments", "Customers & Products", "Freezers & Quota", "Reports"]}'::jsonb
      );
    `);
    console.log('✓ Initial audit_logs seeded.');
  }

  console.log('======================================================');
  console.log('ALL SCHEMA UPGRADES COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
  await client.end();
}

runMigration().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
