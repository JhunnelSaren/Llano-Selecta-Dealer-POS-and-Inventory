-- =========================================================================
-- LLANO SELECTA DEALER POS AND INVENTORY SYSTEM
-- COMPLETE PRODUCTION DATABASE QUERY FOR PGADMIN 4 / POSTGRESQL
-- Database Name: llano_selecta_db
-- Connection: postgresql://postgres:032422@localhost:5432/llano_selecta_db
-- =========================================================================

-- Instructions for pgAdmin 4:
-- 1. Open pgAdmin 4 and connect to your PostgreSQL server.
-- 2. Right-click on Databases -> Create -> Database named "llano_selecta_db" (if not yet created).
-- 3. Click on "llano_selecta_db", then click the "Query Tool" icon on the top toolbar.
-- 4. Copy and paste all the SQL code below into the Query Tool.
-- 5. Press F5 (or click the Play/Execute button) to run the query.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. SYSTEM SETTINGS TABLE (Login homepage photo, captions, description, logo)
-- -------------------------------------------------------------------------
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

INSERT INTO system_settings (id, login_photo_url, login_caption, login_description, dealer_logo_url, dealer_name, contact_number, address)
VALUES (
    'SYSTEM_SETTINGS',
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=2000',
    'Selecta Ice Cream Dealer Operations & Cold-Chain Management',
    'Official distribution portal for store bookings, cold delivery fulfillment, and payment collections across Valencia, Cabanglasan, and San Fernando.',
    '',
    'Llano Selecta Dealer',
    '0917-123-4567',
    'Valencia City, Bukidnon'
)
ON CONFLICT (id) DO UPDATE SET
    login_photo_url = EXCLUDED.login_photo_url,
    login_caption = EXCLUDED.login_caption,
    login_description = EXCLUDED.login_description,
    dealer_name = EXCLUDED.dealer_name,
    contact_number = EXCLUDED.contact_number,
    address = EXCLUDED.address;

-- -------------------------------------------------------------------------
-- 2. USERS & ACCESS MANAGEMENT (2 ROLES ONLY: ADMIN & STAFF)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Staff')),
    access_key VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Access Stopped', 'Pending Approval'
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Exactly 2 Default Users: Admin (admin / admin123) and Staff (staff / staff123)
INSERT INTO users (id, username, name, email, role, access_key, password_hash, phone, status, last_login)
VALUES
('USR-ADMIN', 'admin', 'Dealer Admin', 'admin@selecta.com', 'Admin', 'SELECTA-ADMIN-2026', 'admin123', '0917-000-0001', 'Active', NOW()),
('USR-STAFF', 'staff', 'Dealer Staff', 'staff@selecta.com', 'Staff', 'SELECTA-STAFF-2026', 'staff123', '0917-000-0002', 'Active', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash,
    status = EXCLUDED.status;

-- -------------------------------------------------------------------------
-- 3. EMPLOYEES & STAFF DIRECTORY
-- (Assigned Route & Allowed Capabilities Removed. Includes Date Applied, Birthdate, Picture ID)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    primary_role VARCHAR(100),
    contact VARCHAR(50),
    email VARCHAR(255),
    birthdate DATE,
    date_applied DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (id, name, role, primary_role, contact, email, birthdate, date_applied, photo_url, status)
VALUES
('EMP-001', 'Juan Dela Cruz', 'Driver', 'Driver', '0917-111-2222', 'juan.delacruz@gmail.com', '1992-05-14', '2026-01-10', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'Active'),
('EMP-002', 'Pedro Penduko', 'Booker', 'Booker', '0918-333-4444', 'pedro.penduko@gmail.com', '1995-08-22', '2026-02-15', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Active'),
('EMP-003', 'Maria Clara', 'Cashier', 'Cashier', '0919-555-6666', 'maria.clara@gmail.com', '1998-11-03', '2026-03-01', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', 'Active'),
('EMP-004', 'Roberto Santos', 'Warehouse Staff', 'Warehouse Staff', '0920-777-8888', 'roberto.santos@gmail.com', '1990-03-19', '2026-03-20', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Active')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    contact = EXCLUDED.contact,
    email = EXCLUDED.email,
    birthdate = EXCLUDED.birthdate,
    date_applied = EXCLUDED.date_applied,
    photo_url = EXCLUDED.photo_url,
    status = EXCLUDED.status;

-- -------------------------------------------------------------------------
-- 4. CUSTOMERS & STORES MASTER
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    contact VARCHAR(50),
    area VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (id, store_name, owner_name, contact, area, status)
VALUES
('CUST-001', 'Aling Nena Sari-Sari Store', 'Nena Dela Cruz', '0917-123-4567', 'Valencia City (Batangan)', 'Active'),
('CUST-002', 'San Isidro Mini-Mart', 'Juan Santos', '0918-234-5678', 'Valencia City (San-Isidro)', 'Active'),
('CUST-003', 'Cabanglasan Highland Corner', 'Ramon Santos Jr.', '0919-345-6789', 'Cabanglasan Area', 'Active'),
('CUST-004', 'Kahaponan Grocery Hub', 'Elena Bautista', '0920-456-7890', 'Valencia City (Kahaponan)', 'Active'),
('CUST-005', 'Lumbayao Refreshments', 'Teresa Gomez', '0921-567-8901', 'Valencia City (Lumabayo)', 'Active'),
('CUST-006', 'Halapitan Trading Post', 'Danilo Reyes', '0922-678-9012', 'San Fernando Area', 'Active'),
('CUST-007', 'Sinabuagan Golden Store', 'Lucia Fernandez', '0923-789-0123', 'Valencia City (Sinabuagan)', 'Active')
ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    owner_name = EXCLUDED.owner_name,
    contact = EXCLUDED.contact,
    area = EXCLUDED.area;

-- -------------------------------------------------------------------------
-- 5. FREEZERS ASSET MANAGEMENT & CUSTODY TRACKING
-- (Proof verification & action needed button removed)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS freezers (
    id VARCHAR(50) PRIMARY KEY,
    selecta_number VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    condition VARCHAR(50) DEFAULT 'Good',
    status VARCHAR(50) DEFAULT 'Deployed', -- 'Deployed' or 'Pull Out'
    assigned_store VARCHAR(255),
    payment_details JSONB DEFAULT '{"totalFee": 10000, "status": "Paid"}'::jsonb,
    last_scan JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO freezers (id, selecta_number, barcode, model, condition, status, assigned_store, payment_details)
VALUES
('FRZ-001', 'SEL-FRZ-8821', 'BC-8821-VAL', 'Selecta Glass Top 300L', 'Good', 'Deployed', 'Aling Nena Sari-Sari Store', '{"totalFee": 10000, "status": "Paid"}'::jsonb),
('FRZ-002', 'SEL-FRZ-8822', 'BC-8822-VAL', 'Selecta Chest Freezer 400L', 'Good', 'Deployed', 'San Isidro Mini-Mart', '{"totalFee": 10000, "status": "Paid"}'::jsonb),
('FRZ-003', 'SEL-FRZ-9011', 'BC-9011-CAB', 'Selecta Glass Top 300L', 'Good', 'Deployed', 'Cabanglasan Highland Corner', '{"totalFee": 10000, "status": "Paid"}'::jsonb),
('FRZ-004', 'SEL-FRZ-8825', 'BC-8825-VAL', 'Selecta Double Door 500L', 'Good', 'Deployed', 'Kahaponan Grocery Hub', '{"totalFee": 10000, "status": "Paid"}'::jsonb),
('FRZ-005', 'SEL-FRZ-8800', 'BC-8800-WH', 'Selecta Standby Chest 400L', 'Fair', 'Pull Out', 'Llano Central Warehouse', '{"totalFee": 0, "status": "Warehouse"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    assigned_store = EXCLUDED.assigned_store,
    status = EXCLUDED.status,
    condition = EXCLUDED.condition;

-- -------------------------------------------------------------------------
-- 6. DELIVERY ROUTES MASTER
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS delivery_routes (
    id VARCHAR(50) PRIMARY KEY,
    route_name VARCHAR(255) NOT NULL,
    schedule_days TEXT[],
    coverage_areas TEXT,
    active_stores_count INT DEFAULT 0,
    assigned_driver VARCHAR(255),
    assigned_booker VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active'
);

INSERT INTO delivery_routes (id, route_name, schedule_days, coverage_areas, active_stores_count, assigned_driver, assigned_booker, status)
VALUES
('RTE-001', 'Valencia -> San Fernando Route', ARRAY['Monday', 'Friday'], 'Valencia City Proper, Batangan, Kahaponan, Mailag, Halapitan, San Fernando', 28, 'Juan Dela Cruz', 'Pedro Penduko', 'Active'),
('RTE-002', 'Cabanglasan Area Route', ARRAY['Tuesday', 'Thursday'], 'Cabanglasan Town, Paradise, Capihan, Anlogan, Mandaing', 18, 'Pedro Penduko', 'Pedro Penduko', 'Active'),
('RTE-003', 'Batangan & San Isidro Route', ARRAY['Wednesday'], 'Batangan, San Isidro, Lumabayo, Ventar, Dagatkidavao', 15, 'Juan Dela Cruz', 'Maria Clara', 'Active')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 7. STORE BOOKINGS & DELIVERY ORDERS (INTEGRATED POS & PAYMENTS)
-- (Booked to specific store, Ready for Deliver, Delivered, B.O. deductions, way of payment)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    customer VARCHAR(255),
    owner_name VARCHAR(255),
    area VARCHAR(255) NOT NULL,
    route VARCHAR(255),
    booking_date DATE DEFAULT CURRENT_DATE,
    booking_time VARCHAR(50) DEFAULT '09:00 AM',
    status VARCHAR(50) DEFAULT 'Booked', -- 'Booked', 'Ready for Deliver', 'Delivered', 'Backload'
    items JSONB DEFAULT '[]'::jsonb,
    estimated_total NUMERIC(12, 2) DEFAULT 0.00,
    total_receipt NUMERIC(12, 2) DEFAULT 0.00, -- Gross receipt bill
    bo_deductions NUMERIC(10, 2) DEFAULT 0.00, -- B.O. Bad Order / Melted deductions
    missing_deductions NUMERIC(10, 2) DEFAULT 0.00,
    net_delivered_amount NUMERIC(12, 2) DEFAULT 0.00, -- Net amount after deductions
    payment_method VARCHAR(50) DEFAULT 'Cash', -- 'Cash', 'GCash', 'Bank Check', 'Shortage'
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    shortage_amount NUMERIC(10, 2) DEFAULT 0.00,
    delivered_at TIMESTAMP,
    receipt_ref VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    2284.60, 2284.60, 0.00, 0.00, 2284.60, 'Cash', 0.00, 0.00, NULL, '', 'Packaged in ice box #1; scheduled for morning route'
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
    total_receipt = EXCLUDED.total_receipt,
    bo_deductions = EXCLUDED.bo_deductions,
    net_delivered_amount = EXCLUDED.net_delivered_amount,
    payment_method = EXCLUDED.payment_method;

-- -------------------------------------------------------------------------
-- 8. STOCK RECEIVING & FREEZER VAN ARRIVAL
-- -------------------------------------------------------------------------
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

INSERT INTO stock_receiving (id, po_number, truck_plate, driver_info, arrival_date, arrival_time, receiver, checker, status, remarks, items, total_received_value)
VALUES
(
    'RCV-2026-001', 'PO-SEL-9042', 'KAB-4819', 'SELECTA Bodega Freezer Van #4 (Manolo Fortich)', '2026-10-24', '09:30 AM',
    'Roberto Santos', 'Pedro Checker', 'Delivered to Warehouse', 'Cold chain intact at -18C. Received into Bodega.',
    '[{"productId": "COR-001", "name": "CHOCOLATE (CORNETTO)", "ordered": 200, "received": 200, "damaged": 0, "price": 28.00}, {"productId": "MAG-001", "name": "CLASSIC (MAGNUM)", "ordered": 100, "received": 98, "damaged": 2, "price": 165.20}]'::jsonb,
    21789.60
)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 9. INVENTORY LEDGER & STOCK MOVEMENTS (FIFO AUDIT LOGS)
-- -------------------------------------------------------------------------
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

INSERT INTO inventory_ledger (id, timestamp, product_id, product_name, category, type, change_qty, running_on_hand, reference_no, staff, notes)
VALUES
('LEDG-001', NOW() - INTERVAL '1 day', 'COR-001', 'CHOCOLATE', 'CORNETTO', 'Stock Receiving (Freezer Van)', 200, 250, 'PO-SEL-9042', 'Roberto Santos', 'Inbound freezer van arrival from SELECTA Main Bodega (KAB-4819)'),
('LEDG-002', NOW() - INTERVAL '1 day', 'MAG-001', 'CLASSIC', 'MAGNUM', 'Stock Receiving (Freezer Van)', 98, 140, 'PO-SEL-9042', 'Roberto Santos', 'Received from PO-SEL-9042 (2 damaged tubs rejected)'),
('LEDG-003', NOW() - INTERVAL '6 hours', 'COR-001', 'CHOCOLATE', 'CORNETTO', 'Store Delivery', -20, 230, 'BK-2026-1001', 'Juan Dela Cruz', 'Delivered to Aling Nena Sari-Sari Store'),
('LEDG-004', NOW() - INTERVAL '2 hours', 'COR-002', 'COOKIES & DREAM', 'CORNETTO', 'Store Delivery', -25, 175, 'BK-2026-1003', 'Pedro Penduko', 'Delivered to Cabanglasan Highland Corner')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 10. DISCREPANCIES (MISSING & B.O. MELTED ICE CREAM LOG)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discrepancies (
    id VARCHAR(50) PRIMARY KEY,
    delivery_ref VARCHAR(50),
    customer_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Missing' or 'BO / Melted'
    product_name VARCHAR(255) NOT NULL,
    discrepancy_qty INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    deduction_amount NUMERIC(10, 2) NOT NULL,
    original_invoice NUMERIC(10, 2) DEFAULT 0.00,
    adjusted_invoice NUMERIC(10, 2) DEFAULT 0.00,
    reason TEXT,
    recorded_by VARCHAR(255),
    condition VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE discrepancies ALTER COLUMN original_invoice DROP NOT NULL;
ALTER TABLE discrepancies ALTER COLUMN adjusted_invoice DROP NOT NULL;

INSERT INTO discrepancies (id, delivery_ref, customer_name, type, product_name, discrepancy_qty, unit_price, deduction_amount, original_invoice, adjusted_invoice, reason, recorded_by, condition)
VALUES
('DISC-001', 'DEL-2026-101', 'Aling Nena Sari-Sari Store', 'Missing', 'Cornetto Vanilla 110ml', 2, 28.00, 56.00, 5000.00, 4944.00, 'Missing in delivery box #001', 'Juan Dela Cruz', 'Resolved'),
('DISC-002', 'DEL-2026-101', 'Aling Nena Sari-Sari Store', 'BO / Melted', 'Magnum Classic 80ml', 1, 150.00, 150.00, 5000.00, 4850.00, 'Soft tub upon arrival', 'Juan Dela Cruz', 'Returned to Bodega'),
('DISC-003', 'DEL-2026-102', 'San Isidro Mini-Mart', 'BO / Melted', 'Supreme Rocky Road 1.3L', 1, 174.00, 174.00, 10000.00, 9826.00, 'Melted seal in transit', 'Pedro Penduko', 'Returned to Bodega')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 11. SELECTA MONTHLY SALES QUOTA
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotas (
    id INT PRIMARY KEY,
    month VARCHAR(50) NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL DEFAULT 1000000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO quotas (id, month, target_amount)
VALUES (1, 'October 2026', 1000000.00)
ON CONFLICT (id) DO UPDATE SET target_amount = EXCLUDED.target_amount;

-- =========================================================================
-- VERIFICATION QUERY
-- =========================================================================
SELECT 'users' AS table_name, COUNT(*) AS total_records FROM users
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'freezers', COUNT(*) FROM freezers
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'stock_receiving', COUNT(*) FROM stock_receiving
UNION ALL
SELECT 'inventory_ledger', COUNT(*) FROM inventory_ledger
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'system_settings', COUNT(*) FROM system_settings;
