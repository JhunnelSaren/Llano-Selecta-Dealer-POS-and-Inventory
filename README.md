# Llano Selecta Dealer POS and Inventory System

A dedicated, complete, and functional business-management web application designed for **Llano Selecta Dealer**, distributing Unilever Selecta ice cream products across:
- **Valencia City** (including Batangan, San Isidro, Lumabayo, Kahaponan, and Ventar)
- **Cabanglasan Area** (Highland routes, Paradise, and Poblacion)
- **San Fernando Area** (Halapitan, Little Baguio, and Highway corridors)

The system replaces manual notebooks, scattered spreadsheets, and fragmented records with a single, highly intuitive, and auditable operating system specifically tuned for Philippine cold-chain dealership logistics.

---

## 🏛️ System Architecture: Exactly 5 Primary Navigation Modules

The user interface follows a clean, simple layout designed for non-technical staff members with **exactly five primary navigation items**, plus administrative settings behind a gear icon:

```
├── 1. Dashboard                 (9 Clickable Metric Cards + 2 Compact Operational Tables)
│
├── 2. Orders & Delivery         (Core Operations Lifecycle)
│   ├── Sub-tab 1: Bookings (Store booking entry, customer search, printable booking sheet, Excel import/export)
│   ├── Sub-tab 2: Bodega Order (Consolidated product needs & official Selecta POS order tracking)
│   ├── Sub-tab 3: Stock Receiving (Panel truck arrival checklist, good vs damaged stock, signed receipt photo)
│   ├── Sub-tab 4: Prepare & Load (Picking list, box labels, Bongo vehicle crew assignment)
│   ├── Sub-tab 5: Delivery (Store-by-store mobile/desktop stop entry, actual accepted qty, missing & BO)
│   └── Sub-tab 6: Delivery Reconciliation (Route closing, intact returns, BO quarantine, expected vs actual cash)
│
├── 3. Inventory                 (Dealer Internal Cold Storage Ledger)
│   ├── Sub-tab 1: Stock on Hand (SKU, Selecta name, Category, UOM, SRP, Dealer Cost, Physical, Reserved, Available)
│   ├── Sub-tab 2: Stock Movements (Auditable ledger: receiving, picking, sales, returns, adjustments)
│   ├── Sub-tab 3: Damaged / BO (Quarantined non-saleable stock, disposal & credit notes)
│   └── Sub-tab 4: Low Stock (Safety threshold warnings & suggested reorder quantities)
│
├── 4. Stores & Freezers         (Customer Network & Selecta Asset Custody)
│   ├── Sub-tab 1: Stores (Store directory, routes, contacts, balances & store history profiles)
│   └── Sub-tab 2: Freezers & Monthly Verification (Selecta equipment custody, ₱10,000 fee tracking, Timemark evidence)
│
└── 5. Sales & Reports           (Financial Settlement & Quota Tracking)
    ├── Sub-tab 1: Receipts & Customer Bills (Formula: Billable Qty = Accepted × Price, no double deduction)
    ├── Sub-tab 2: Daily Collection Reconciliation (Cash variance = actual - expected cash; GCash/checks separate)
    ├── Sub-tab 3: Selecta POS Quota (Monthly target progress, manual Selecta POS sales entry history)
    └── Sub-tab 4: Reports & Analytics (9 standard business reports with date/route filters and Excel export)

⚙️ Settings & Staff Management   (Accessed via Gear Icon in Header/Sidebar)
    ├── Dealership Profile & Receipt Header Settings
    ├── Staff Accounts & Role-Based Permissions (Admin vs Staff)
    ├── Delivery Crew Roster (Drivers, Loaders, Checkers, Helpers)
    └── Immutable System Audit Logs
```

---

## 🍦 End-to-End Workflow & Business Rules

### 1. Store Bookings & Weekly Schedule
- **Monday Route:** Valencia – San Fernando Booking Route
- **Tuesday Route:** Cabanglasan Booking Route
- **Wednesday:** Selecta Bodega Stock Arrival & Verification
- **Thursday Route:** Cabanglasan Bongo Delivery Run
- **Friday Route:** Valencia – San Fernando Bongo Delivery Run
*(All routes and schedules are customizable in Settings).*

Bookings feature customer search, product catalog, automatic total calculations, consolidated product summaries across all stores, and printable paper order forms.

### 2. Selecta Bodega Order Tracking
- The system consolidates product demand across confirmed customer bookings.
- Compares required quantities against current warehouse stock.
- The dealer enters the bulk order in Unilever's official Selecta POS and records the official POS reference number, date, and responsible staff.
- Prevents double-counting by maintaining a clear distinction between internal dealer bookings and official external Selecta POS orders.

### 3. Stock Receiving & Cold Inspection
- Checker records truck plate number, driver, receiving staff, and arrival date/time.
- Item-by-item checklist: ordered vs physically received good items vs damaged/melted items.
- **Saleable Inventory:** Only physically received good items enter saleable stock.
- **Damaged Stock:** Damaged or melted tubs are routed to non-saleable quarantine.
- Allows checker to upload a photograph of the signed supplier receipt.

### 4. Prepare & Load (Bongo Refrigerated Van)
- Displays requested quantities against available stock (`Physical − Reserved`).
- Generates consolidated picking lists for the bodega crew.
- Generates printable store box labels (Store Name, Route, Delivery Date, Box Contents).
- Assigns actual personnel: 1 Driver, 2 Loaders, and optional Helpers/Backrides.

### 5. Actual Delivery Settlement & BO Credits
Enforces the mandatory cold-chain accounting rule:
$$\text{Billable Product Amount} = \text{Actual Saleable Quantity Accepted by Store} \times \text{Applicable Unit Selling Price}$$
- Missing or undelivered products are **never charged** to the customer.
- BO (melted/defective) items refused by the store are deducted only once.
- Supports payments via **Cash, GCash, Bank Transfer, and Check**.
- Checks are tracked as *Pending*, *Cleared*, or *Bounced*; pending checks are never counted as cleared cash.

### 6. Route Closing & Cash Reconciliation
Upon the Bongo vehicle's return to the bodega:
$$\text{Cash Variance} = \text{Actual Cash Handed Over} - \text{Expected Cash Collection}$$
- **Important:** Non-cash collections (GCash, Bank Transfers, and Checks) are strictly excluded from expected physical cash.
- Shortages or overages require recorded explanations and owner sign-off before closure.
- Intact returned goods are restored to stock only after physical verification.
- BO returns are sent to non-saleable inventory awaiting disposition.

### 7. Selecta-Owned Freezers & Timemark Verification
- Freezers are tracked as **Selecta-owned assets** (not dealer-owned stock).
- Initial freezer-program fee breakdown:
  - Total: **₱10,000.00**
  - Product allocation: **₱9,000.00**
  - Processing fee: **₱1,000.00**
- Monthly barcode verification: Staff captures photo evidence using their cellphone / Timemark app and logs the verification month, timestamp, scanned serial/barcode, and photo in the system.
- Automatically calculates 30-day next due dates and prevents duplicate period scans without authorization.

### 8. Monthly Selecta POS Quota Tracker
- Monthly target (default: **₱1,000,000.00**, editable by owner).
- Only confirmed entries from Unilever's official Selecta POS count toward quota progress.
- Internal customer store sales are kept strictly separate from official supplier quota figures.

---

## 🔐 User Roles & Permissions

| Role | Access Scope |
| :--- | :--- |
| **Owner / Admin** | Full access: All 5 modules, Settings, Staff Management, Quota overrides, Discrepancy approvals, Audit Logs. |
| **Staff** | Operational access: Dashboard, Orders & Delivery, Inventory, Stores & Freezers, Sales & Reports. Settings are protected. |

### Default Credentials
- **Admin Account:** `username: admin` | `password: admin123`
- **Staff Account:** `username: staff` | `password: staff123`

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React Icons.
- **Backend:** Node.js, Express, PostgreSQL driver (`pg`), CORS, Dotenv.
- **Database:** PostgreSQL (Database: `llano_selecta_db`).
- **Data Validation & Persistence:** Persistent PostgreSQL tables with foreign keys and audit logs.
- **Templates:** Excel / CSV Booking import and export templates (`templates/booking_import_template.csv`).

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14, v16, or v18)

### 2. Database Setup
Ensure PostgreSQL is running locally and create the database:
```sql
CREATE DATABASE llano_selecta_db;
```

Update your `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:032422@localhost:5432/llano_selecta_db
```

Apply database migrations and seed default data:
```bash
node database_migration_v2.js
```

### 3. Install Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
npm --prefix llano-selecta-frontend install
```

### 4. Running the Application
Start both the backend API server and the frontend client:

**Terminal 1 (Backend Server):**
```bash
npm run server
# Server starts at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🧪 Automated Testing

Execute the automated business rules and acceptance test suite:
```bash
npm test
```

### Verified Test Criteria
1. ✓ Booking total calculations
2. ✓ Supplier receiving and inventory updates (good vs damaged quarantine)
3. ✓ Stock availability calculations (`Physical − Reserved`)
4. ✓ Missing-product deductions (never billed)
5. ✓ BO returns and credit adjustments (`Billable = Accepted − Approved BO`)
6. ✓ Prevention of duplicate deductions
7. ✓ Cash shortages and overages (`Actual Cash − Expected Cash`)
8. ✓ Multi-method payments and uncleared check safeguards
9. ✓ Prevention of negative stock without admin authorization
10. ✓ Freezer verification 30-day due dates and duplicate-period controls
11. ✓ Freezer program fee configuration (₱10,000: ₱9,000 product + ₱1,000 fee)
12. ✓ Quota tracker (only confirmed Selecta POS entries)
13. ✓ Role permissions, multi-role trip staff, and audit logging

---

## 📋 Assumptions and Confirmed Business Decisions

1. **Unilever External Selecta POS Integration:** Unilever does not offer an open public API for local dealers; the application tracks Selecta bodega orders and monthly quota through manual confirmation entries and reference numbers.
2. **Timemark App Evidence:** Field staff capture timestamped photos using their Timemark camera app on mobile, then upload or record the photo and barcode verification into the system.
3. **Freezer Ownership:** All retail freezer assets are Selecta-owned equipment in dealer custody, separate from dealer inventory.
4. **Currency & Timezone:** All monetary calculations use Philippine Pesos (`₱`) and standard `Asia/Manila` business hours.
