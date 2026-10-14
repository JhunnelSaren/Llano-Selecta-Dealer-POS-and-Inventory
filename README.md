# Llano Selecta Dealer POS and Inventory System

This system is designed for **Llano Selecta Dealer** internal use for Point of Sale (POS), field bookings, inventory tracking, freezer management, and dealer logistics.

---

## 🚀 Key Modules & Features

- **Field Bookings & Order Taking:** Quick order entry with full Selecta catalog categorized by flavor/SKU matching dealer sheets.
- **Customers & Stores Master:** Store profiles, owner information, date joined, purok locations (Valencia: Batangan, Kahaponan, Ventar, San-Isidro, Sinabuagan, Lumbayao; San Fernando; Cabanglasan), and digital storage/inspection of signed freezer custody agreements.
- **Product Catalog & Inventory Ledger:** Real-time stock counts, dealer pricing vs. SRP, and batch receiving.
- **Freezer Custody & Timemark Inspection:** Serial tracking, store assignment, and audit photo logs.
- **POS & Remittance Management:** Delivery receipts, Bad Orders (B.O.) / Shortage tracking, and daily cash reconciliation.
- **Offline Resilient Architecture:** Local offline cache and batch synchronization when network connectivity is limited.

---

## 🛠️ Project Structure

```
├── index.js                     # Root backend entry point
├── package.json                 # Root dependencies
├── server/                      # Secondary backend configs
└── llano-selecta-frontend/      # Vite + React Frontend Application
    ├── server/                  # Express API Server & PostgreSQL database connection
    │   ├── index.js             # API routes & endpoints
    │   ├── db.js                # pg pool database client
    │   ├── schema.sql           # Database schema & initial product/store seed data
    │   └── .env.example         # Environment configuration template
    ├── src/
    │   ├── pages/               # Module pages (Bookings, Customers, Products, etc.)
    │   ├── components/          # Reusable UI components & layouts
    │   └── utils/               # Catalog helpers & utilities
    └── package.json             # Frontend dependencies
```

---

## 💻 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/JhunnelSaren/Llano-Selecta-Dealer-POS-and-Inventory.git
cd Llano-Selecta-Dealer-POS-and-Inventory

# Install root dependencies
npm install

# Install frontend dependencies
cd llano-selecta-frontend
npm install
```

### 3. Environment Setup
In `llano-selecta-frontend/server/`, copy `.env.example` to `.env`:
```bash
cp server/.env.example server/.env
```
Update the `DATABASE_URL` with your PostgreSQL credentials. Run `schema.sql` to initialize tables and standard Selecta products/stores.

### 4. Running the Application

**Start the Backend API Server (Port 5000):**
```bash
node index.js
```

**Start the Frontend Dev Server (Port 5173):**
```bash
cd llano-selecta-frontend
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.
