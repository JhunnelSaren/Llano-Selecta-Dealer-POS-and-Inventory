import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Boxes, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  X, 
  Eye, 
  User, 
  FileText,
  Layers,
  History,
  TrendingUp,
  Download,
  Trash2,
  Upload,
  Receipt,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('balances'); // 'balances' | 'receiving' | 'ledger'

  // Products Stock Master loaded from catalog & database
  const [stockBalances, setStockBalances] = useState(
    INITIAL_PRODUCTS.map((p) => ({
      id: p.id,
      barcode: p.barcode,
      name: p.name,
      category: p.category,
      unitPrice: Number(p.dealerPrice || p.unit_price || 28),
      onHand: p.stock || 50,
      minStock: p.minStock || 20,
      unit: p.unit || 'Pack/Tub'
    }))
  );

  // FIFO Stock Ledger Logs
  const [ledgerLogs, setLedgerLogs] = useState([
    {
      id: 'LEDG-001',
      timestamp: '2026-10-24T09:30:00',
      productId: 'COR-001',
      productName: 'CHOCOLATE',
      category: 'CORNETTO',
      type: 'Stock Receiving (Freezer Van)',
      changeQty: 200,
      runningOnHand: 250,
      referenceNo: 'PO-SEL-9042',
      staff: 'Roberto Santos',
      notes: 'Inbound freezer van arrival from SELECTA Main Bodega (KAB-4819)'
    },
    {
      id: 'LEDG-002',
      timestamp: '2026-10-24T09:30:00',
      productId: 'MAG-001',
      productName: 'CLASSIC',
      category: 'MAGNUM',
      type: 'Stock Receiving (Freezer Van)',
      changeQty: 98,
      runningOnHand: 140,
      referenceNo: 'PO-SEL-9042',
      staff: 'Roberto Santos',
      notes: 'Received from PO-SEL-9042 (2 damaged tubs rejected)'
    },
    {
      id: 'LEDG-003',
      timestamp: '2026-10-24T14:15:00',
      productId: 'COR-001',
      productName: 'CHOCOLATE',
      category: 'CORNETTO',
      type: 'Store Delivery',
      changeQty: -20,
      runningOnHand: 230,
      referenceNo: 'BK-2026-1001',
      staff: 'Juan Dela Cruz',
      notes: 'Delivered to Aling Nena Sari-Sari Store'
    },
    {
      id: 'LEDG-004',
      timestamp: '2026-10-25T10:00:00',
      productId: 'COR-002',
      productName: 'COOKIES & DREAM',
      category: 'CORNETTO',
      type: 'Store Delivery',
      changeQty: -25,
      runningOnHand: 175,
      referenceNo: 'BK-2026-1003',
      staff: 'Pedro Penduko',
      notes: 'Delivered to Cabanglasan Highland Corner'
    }
  ]);

  // Stock Receiving (Freezer Van Arrivals)
  const [receivingLogs, setReceivingLogs] = useState([
    {
      id: 'RCV-2026-001',
      poNumber: 'PO-SEL-9042',
      truckPlate: 'KAB-4819',
      driverInfo: 'SELECTA Bodega Freezer Van #4 (Manolo Fortich)',
      arrivalDate: '2026-10-24',
      arrivalTime: '09:30 AM',
      receiver: 'Roberto Santos',
      checker: 'Pedro Checker',
      status: 'Delivered to Warehouse',
      remarks: 'Cold chain verified at -18°C. Quantities added to inventory ledger.',
      totalReceivedValue: 21789.60,
      items: [
        { name: 'CHOCOLATE (CORNETTO)', ordered: 200, received: 200, damaged: 0, price: 28.00 },
        { name: 'CLASSIC (MAGNUM)', ordered: 100, received: 98, damaged: 2, price: 165.20 }
      ]
    },
    {
      id: 'RCV-2026-002',
      poNumber: 'PO-SEL-9038',
      truckPlate: 'LMN-3021',
      driverInfo: 'SELECTA Express Panel #2',
      arrivalDate: '2026-10-20',
      arrivalTime: '02:15 PM',
      receiver: 'Roberto Santos',
      checker: 'Juan Dela Cruz',
      status: 'Delivered to Warehouse',
      remarks: 'Clean delivery. All items received in good condition.',
      totalReceivedValue: 10640.00,
      items: [
        { name: 'COOKIES & CREAM (STICKS)', ordered: 300, received: 300, damaged: 0, price: 28.00 },
        { name: 'COOKIES & DREAM (CORNETTO)', ordered: 80, received: 80, damaged: 0, price: 28.00 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedReceivingLog, setSelectedReceivingLog] = useState(null);

  // New Inbound Van Receiving Form State
  const [formPoNumber, setFormPoNumber] = useState(`PO-SEL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [formTruckPlate, setFormTruckPlate] = useState('KAB-4819');
  const [formDriverInfo, setFormDriverInfo] = useState('SELECTA Main Cold Van');
  const [formArrivalDate, setFormArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [formArrivalTime, setFormArrivalTime] = useState('09:30 AM');
  const [formReceiver, setFormReceiver] = useState('Roberto Santos');
  const [formChecker, setFormChecker] = useState('Pedro Checker');
  const [formRemarks, setFormRemarks] = useState('Cold chain temp verified. Seals checked.');
  const [formReceiptPhoto, setFormReceiptPhoto] = useState('');
  
  // Helper to get products by category
  const getProductsForCategory = (cat) => {
    return stockBalances.filter(p => p.category === cat);
  };

  // Helper to create product item
  const createProductItem = (category = 'CORNETTO') => {
    const inCat = stockBalances.filter(p => p.category === category);
    const prod = inCat[0] || stockBalances[0];
    return {
      category: prod ? prod.category : category,
      productId: prod ? prod.id : 'GEN-01',
      name: prod ? prod.name : 'Ice Cream Product',
      received: 50,
      price: prod ? Number(prod.unitPrice || 28) : 28.00
    };
  };

  // Products selected in receive modal
  const [formItems, setFormItems] = useState([
    { productId: 'COR-001', name: 'CHOCOLATE (CORNETTO)', category: 'CORNETTO', received: 100, price: 28.00 },
    { productId: 'MAG-001', name: 'CLASSIC (MAGNUM)', category: 'MAGNUM', received: 50, price: 165.20 }
  ]);

  // Handle Receipt Photo Upload from laptop
  const handleReceiptPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormReceiptPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Category Change for an item in receive modal
  const handleItemCategoryChange = (index, newCat) => {
    const prods = getProductsForCategory(newCat);
    const first = prods[0] || stockBalances[0];
    setFormItems(prev => prev.map((it, i) => {
      if (i === index) {
        return {
          ...it,
          category: newCat,
          productId: first ? first.id : 'GEN',
          name: first ? first.name : 'Select Product',
          price: first ? Number(first.unitPrice || 28) : 28.00
        };
      }
      return it;
    }));
  };

  // Handle Product Change for an item in receive modal
  const handleItemProductChange = (index, prodId) => {
    const found = stockBalances.find(p => p.id === prodId);
    if (!found) return;
    setFormItems(prev => prev.map((it, i) => {
      if (i === index) {
        return {
          ...it,
          productId: found.id,
          name: found.name,
          category: found.category,
          price: Number(found.unitPrice || 28)
        };
      }
      return it;
    }));
  };

  const handleQtyChangeForItem = (index, qty) => {
    const val = parseInt(qty);
    setFormItems(prev => prev.map((it, i) => i === index ? { ...it, received: isNaN(val) ? 0 : val } : it));
  };

  const handleItemPriceChange = (index, price) => {
    const val = parseFloat(price);
    setFormItems(prev => prev.map((it, i) => i === index ? { ...it, price: isNaN(val) ? 0 : val } : it));
  };

  const addItemToReceive = () => {
    setFormItems(prev => [...prev, createProductItem('STICKS')]);
  };

  const removeItemFromReceive = (index) => {
    if (formItems.length <= 1) {
      alert('You must have at least one product line in the receiving receipt.');
      return;
    }
    setFormItems(prev => prev.filter((_, i) => i !== index));
  };

  // Totals calculation
  const totalReceivedUnits = formItems.reduce((acc, it) => acc + Number(it.received || 0), 0);
  const totalReceivedAmount = formItems.reduce((acc, it) => acc + (Number(it.received || 0) * Number(it.price || 0)), 0);

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setStockBalances(data.products.map(p => ({
              id: p.id,
              barcode: p.barcode,
              name: p.name,
              category: p.category,
              unitPrice: Number(p.dealer_price || p.unit_price || 28),
              onHand: p.stock || 50,
              minStock: p.min_stock || 20,
              unit: p.unit || 'Pack/Tub'
            })));
          }
          if (data.ledger && data.ledger.length > 0) {
            setLedgerLogs(data.ledger);
          }
        }
      } catch (err) {}

      try {
        const resRcv = await fetch('http://localhost:5000/api/receiving');
        if (resRcv.ok) {
          const rcvData = await resRcv.json();
          if (Array.isArray(rcvData) && rcvData.length > 0) {
            setReceivingLogs(rcvData.map(r => ({
              id: r.id,
              poNumber: r.po_number,
              truckPlate: r.truck_plate,
              driverInfo: r.driver_info,
              arrivalDate: r.arrival_date ? r.arrival_date.split('T')[0] : r.arrival_date,
              arrivalTime: r.arrival_time,
              receiver: r.receiver,
              checker: r.checker,
              status: r.status,
              remarks: r.remarks,
              totalReceivedValue: Number(r.total_received_value || 0),
              items: Array.isArray(r.items) ? r.items : []
            })));
          }
        }
      } catch (err) {}
    };

    fetchInventoryData();
  }, []);

  // Submit Inbound Van Stock Receiving
  const handleConfirmReceiving = async () => {
    if (!formPoNumber.trim() || !formTruckPlate.trim()) {
      alert('Please enter PO Number and Truck Plate.');
      return;
    }

    const payload = {
      po_number: formPoNumber,
      truck_plate: formTruckPlate,
      driver_info: formDriverInfo,
      arrival_date: formArrivalDate,
      arrival_time: formArrivalTime,
      receiver: formReceiver,
      checker: formChecker,
      remarks: formRemarks,
      receipt_photo: formReceiptPhoto,
      items: formItems
    };

    const newReceiving = {
      id: `RCV-${Date.now().toString().slice(-6)}`,
      poNumber: formPoNumber,
      truckPlate: formTruckPlate,
      driverInfo: formDriverInfo,
      arrivalDate: formArrivalDate,
      arrivalTime: formArrivalTime,
      receiver: formReceiver,
      checker: formChecker,
      status: 'Delivered to Warehouse',
      remarks: formRemarks,
      receiptPhoto: formReceiptPhoto,
      totalReceivedValue: totalReceivedAmount,
      items: formItems
    };

    // Send to backend
    try {
      await fetch('http://localhost:5000/api/inventory/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}

    // Update frontend state
    setReceivingLogs(prev => [newReceiving, ...prev]);

    // Update stock balances and write to ledger logs
    const newLedgerEntries = [];
    setStockBalances(prev => prev.map(prod => {
      const matched = formItems.find(it => it.name.toLowerCase().includes(prod.name.toLowerCase()) || it.productId === prod.id);
      if (matched) {
        const addQty = parseInt(matched.received) || 0;
        const newBalance = prod.onHand + addQty;
        newLedgerEntries.push({
          id: `LEDG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`,
          timestamp: new Date().toISOString(),
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          type: 'Stock Receiving (Freezer Van)',
          changeQty: addQty,
          runningOnHand: newBalance,
          referenceNo: formPoNumber,
          staff: formReceiver,
          notes: `Inbound van delivery: ${formTruckPlate}`
        });
        return { ...prod, onHand: newBalance };
      }
      return prod;
    }));

    if (newLedgerEntries.length > 0) {
      setLedgerLogs(prev => [...newLedgerEntries, ...prev]);
    }

    setIsReceiveModalOpen(false);
    alert('Stock successfully received! Warehouse inventory ledger and receipt updated.');
  };

  // Filter stock balances
  const filteredBalances = stockBalances.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.barcode && item.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalStockUnits = stockBalances.reduce((acc, p) => acc + p.onHand, 0);
  const lowStockCount = stockBalances.filter(p => p.onHand <= p.minStock).length;
  const totalReceivedValueAll = receivingLogs.reduce((acc, r) => acc + Number(r.totalReceivedValue || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory Ledger & Stock Movements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Warehouse cold-chain stock levels, supplier van arrivals, and FIFO movement audit logs
          </p>
        </div>
        <button 
          onClick={() => setIsReceiveModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 py-2.5 px-4 shadow-md shadow-brand-red/20 font-bold"
        >
          <Truck className="w-4 h-4" /> Receive Freezer Van Stock
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-brand-red flex items-center gap-3">
          <div className="p-3 bg-red-50 text-brand-red rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total SKUs in Catalog</p>
            <h3 className="text-lg font-black text-slate-900">{stockBalances.length} Products</h3>
            <span className="text-[11px] text-slate-400">Official Selecta range</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stock On Hand</p>
            <h3 className="text-lg font-black text-slate-900">{totalStockUnits.toLocaleString()} Units</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Active in Llano Bodega</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Warnings</p>
            <h3 className="text-lg font-black text-slate-900">{lowStockCount} Products Due</h3>
            <span className="text-[11px] text-amber-600 font-semibold">Below safety threshold</span>
          </div>
        </div>

        <div className="card border-l-4 border-l-blue-500 flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Van Deliveries Received</p>
            <h3 className="text-lg font-black text-slate-900">{formatPHP(totalReceivedValueAll)}</h3>
            <span className="text-[11px] text-blue-600 font-semibold">{receivingLogs.length} Completed POs</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('balances')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'balances' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Warehouse Stock Balances ({stockBalances.length})
        </button>
        <button 
          onClick={() => setActiveTab('receiving')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'receiving' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" /> Freezer Van Arrivals & POs ({receivingLogs.length})
        </button>
        <button 
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ledger' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" /> Movements Audit Ledger ({ledgerLogs.length})
        </button>
      </div>

      {/* TAB 1: Stock Balances Table */}
      {activeTab === 'balances' && (
        <div className="card space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by product name, barcode, or SKU ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-60">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field cursor-pointer text-xs sm:text-sm font-medium"
              >
                <option value="All">All Categories</option>
                {SELECTA_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product Name & Barcode</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Dealer Price</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">On Hand</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Safety Level</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredBalances.length > 0 ? (
                  filteredBalances.map((item) => {
                    const isLow = item.onHand <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <span>ID: {item.id}</span>
                            {item.barcode && <span>• BC: {item.barcode}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-800 text-right">
                          {formatPHP(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm font-black text-slate-900">{item.onHand}</span>
                          <span className="text-[10px] text-slate-400 block">{item.unit}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-slate-500">
                          Min: {item.minStock}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No products match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Freezer Van Arrivals & Stock Receiving */}
      {activeTab === 'receiving' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Supplier Freezer Van Inbound Shipments
            </h3>
            <button 
              onClick={() => setIsReceiveModalOpen(true)}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log New Inbound Van PO
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">PO # & Van Plate</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Arrival Date & Time</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Receiver & Checker</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Remarks</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Total Received Value</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {receivingLogs.length > 0 ? (
                  receivingLogs.map((rcv) => (
                    <tr key={rcv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900">{rcv.poNumber}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" /> Plate: <span className="font-semibold">{rcv.truckPlate}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{rcv.driverInfo}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-800">
                        <div>{formatDate(rcv.arrivalDate)}</div>
                        <div className="text-slate-400 font-normal">{rcv.arrivalTime}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700">
                        <div><span className="text-slate-400">Rec:</span> {rcv.receiver}</div>
                        <div><span className="text-slate-400">Chk:</span> {rcv.checker}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {rcv.remarks || 'None'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-black text-emerald-700">
                          {formatPHP(rcv.totalReceivedValue)}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {rcv.items?.length || 0} product lines
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceivingLog(rcv)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3 h-3" /> View Items
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No inbound van shipments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Stock Movements Audit Ledger */}
      {activeTab === 'ledger' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              FIFO Stock Movements Audit Trail
            </h3>
            <span className="text-xs text-slate-500">Live movement history</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Movement Type</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Change Qty</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Running Balance</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference & Staff</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {ledgerLogs.length > 0 ? (
                  ledgerLogs.map((log) => {
                    const isPositive = log.changeQty > 0;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-xs text-slate-600 font-mono">
                          {log.timestamp ? log.timestamp.replace('T', ' ').slice(0, 16) : 'Just now'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-slate-900">{log.productName || log.productId}</div>
                          <div className="text-[11px] text-slate-400">{log.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            log.type?.includes('Receiving') ? 'bg-emerald-100 text-emerald-800' :
                            log.type?.includes('Delivery') ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-sm font-black flex items-center justify-center gap-0.5 ${
                            isPositive ? 'text-emerald-600' : 'text-brand-red'
                          }`}>
                            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {isPositive ? `+${log.changeQty}` : log.changeQty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 text-sm">
                          {log.runningOnHand}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-700">
                          <div className="font-semibold text-slate-800">{log.referenceNo || 'N/A'}</div>
                          <div className="text-slate-400">{log.staff}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">
                          {log.notes}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receive Inbound Freezer Van Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-brand-red rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Receive Inbound Freezer Van Stock
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log arriving supplier delivery from Selecta Bodega directly into Warehouse Inventory
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsReceiveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PO Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formPoNumber}
                    onChange={(e) => setFormPoNumber(e.target.value)}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Freezer Van Truck Plate <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formTruckPlate}
                    onChange={(e) => setFormTruckPlate(e.target.value)}
                    className="input-field" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Date</label>
                  <input 
                    type="date" 
                    value={formArrivalDate}
                    onChange={(e) => setFormArrivalDate(e.target.value)}
                    className="input-field cursor-pointer" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Time</label>
                  <input 
                    type="text" 
                    value={formArrivalTime}
                    onChange={(e) => setFormArrivalTime(e.target.value)}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receiver</label>
                  <input 
                    type="text" 
                    value={formReceiver}
                    onChange={(e) => setFormReceiver(e.target.value)}
                    className="input-field" 
                  />
                </div>
              </div>

              {/* Products & Quantities Received */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div>
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                      Products & Quantities Received
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Select category (e.g. Cornetto), select product/flavor, and enter received quantity
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={addItemToReceive}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5 text-brand-red border-brand-red/30 hover:bg-red-50"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product Line
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {formItems.map((item, idx) => {
                    const productsInThisCategory = stockBalances.filter(p => p.category === item.category);
                    const lineSubtotal = (Number(item.received) || 0) * (Number(item.price) || 0);

                    return (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          {/* Dropdown 1: Category (Like Cornetto) */}
                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                              Product Category
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => handleItemCategoryChange(idx, e.target.value)}
                              className="input-field text-xs py-1.5 font-bold cursor-pointer bg-white"
                            >
                              {SELECTA_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Dropdown 2: What is that product / Flavor (Like Chocolate) */}
                          <div className="sm:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                              Product Name / Flavor
                            </label>
                            <select
                              value={item.productId}
                              onChange={(e) => handleItemProductChange(idx, e.target.value)}
                              className="input-field text-xs py-1.5 font-semibold cursor-pointer bg-white"
                            >
                              {productsInThisCategory.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                  {prod.name} ({formatPHP(prod.unitPrice)})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Qty Received */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-emerald-700 uppercase mb-0.5">
                              Qty Received
                            </label>
                            <input 
                              type="number" 
                              min="0"
                              value={item.received}
                              onChange={(e) => handleQtyChangeForItem(idx, e.target.value)}
                              className="input-field text-xs py-1.5 font-bold text-center text-emerald-700 bg-emerald-50/50"
                            />
                          </div>

                          {/* Subtotal & Delete */}
                          <div className="sm:col-span-2 flex items-center justify-between gap-1 pt-3 sm:pt-4">
                            <div className="text-right flex-1">
                              <span className="text-[10px] text-slate-400 block leading-none">Subtotal</span>
                              <span className="text-xs font-extrabold text-slate-900">{formatPHP(lineSubtotal)}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeItemFromReceive(idx)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors ml-1"
                              title="Remove item line"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Total of Products */}
                <div className="p-3 bg-gradient-to-r from-red-50 via-slate-50 to-emerald-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-red text-white rounded-lg shadow-xs">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Overall Total of Products Received
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Total Quantity: <strong className="text-emerald-700">{totalReceivedUnits.toLocaleString()} units</strong> across {formItems.length} lines
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Grand Total</span>
                    <span className="text-lg font-black text-brand-red">{formatPHP(totalReceivedAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Attach Photo of Receipt from Laptop */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-brand-red" />
                    Attached Photo of Receipt (From Laptop / Device)
                  </label>
                  {formReceiptPhoto && (
                    <button 
                      type="button"
                      onClick={() => setFormReceiptPhoto('')}
                      className="text-[11px] text-red-600 font-bold hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {formReceiptPhoto ? (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <img 
                      src={formReceiptPhoto} 
                      alt="Receipt attached from laptop" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-xs" 
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-bold text-emerald-700 block flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Attached Successfully
                      </span>
                      <span className="text-[11px] text-slate-400">Ready to save with receiving ledger log</span>
                    </div>
                    <label className="btn-secondary text-xs py-1 px-2.5 cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Change Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleReceiptPhotoUpload} 
                      />
                    </label>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-red rounded-xl p-4 text-center cursor-pointer block bg-white hover:bg-red-50/20 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-brand-red block">Click to attach photo of receipt from laptop</span>
                    <span className="text-[11px] text-slate-400">JPG, PNG, or screenshot from delivery document</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleReceiptPhotoUpload} 
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inspection Remarks / Cold Chain Status
                </label>
                <textarea 
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="e.g. Cold chain temp intact at -18°C. Seals in order."
                  rows={2}
                  className="input-field resize-none text-xs"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsReceiveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReceiving}
                className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-brand-red/20"
              >
                Confirm Receiving & Update Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Receiving Log Detail Modal */}
      {selectedReceivingLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Freezer Van Delivery Details</h3>
                <p className="text-xs text-brand-red font-mono font-bold">{selectedReceivingLog.poNumber}</p>
              </div>
              <button onClick={() => setSelectedReceivingLog(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div><span className="text-slate-400">Truck Plate:</span> <span className="font-bold text-slate-800">{selectedReceivingLog.truckPlate}</span></div>
                <div><span className="text-slate-400">Arrival:</span> <span className="font-semibold text-slate-800">{formatDate(selectedReceivingLog.arrivalDate)} • {selectedReceivingLog.arrivalTime}</span></div>
                <div><span className="text-slate-400">Receiver:</span> <span className="font-semibold text-slate-800">{selectedReceivingLog.receiver}</span></div>
                <div><span className="text-slate-400">Remarks:</span> <span className="text-slate-600">{selectedReceivingLog.remarks}</span></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-1">Delivered Product Lines:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedReceivingLog.items?.map((it, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between bg-white text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{it.name}</div>
                        <div className="text-[10px] text-slate-400">Ordered: {it.ordered || it.received} • Damaged: {it.damaged || 0}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900">{it.received || it.qty} units</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{formatPHP((it.received || it.qty || 0) * (it.price || 28))}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-sm font-bold border-t border-slate-100">
                <span>Total Received Value:</span>
                <span className="text-emerald-700 font-black">{formatPHP(selectedReceivingLog.totalReceivedValue)}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button 
                onClick={() => setSelectedReceivingLog(null)}
                className="btn-secondary text-xs py-1.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
