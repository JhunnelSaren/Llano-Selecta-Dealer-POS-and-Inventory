import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Store, 
  AlertTriangle, 
  Plus, 
  X, 
  Printer, 
  Eye, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Wallet,
  Smartphone,
  Check,
  Receipt,
  MessageSquare,
  MessageSquarePlus,
  Trash2,
  Minus,
  MapPin,
  IceCream,
  Package,
  ShoppingCart,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Bookings() {
  const [activeView, setActiveView] = useState('orders'); // 'orders' | 'daily' | 'monthly' | 'history'

  // Pre-seeded realistic bookings with customer suggestions & wants
  const INITIAL_BOOKINGS = [
    {
      id: 'BK-2026-1001',
      store_name: 'Aling Nena Sari-Sari Store',
      customer: 'Aling Nena Sari-Sari Store',
      owner_name: 'Nena Dela Cruz',
      area: 'Valencia City',
      route: 'Valencia City Route (Batangan)',
      booking_date: '2026-10-24',
      booking_time: '08:30 AM',
      status: 'Delivered', // 'Booked' | 'Ready for Deliver' | 'Delivered' | 'Backload'
      total_receipt: 2212.00,
      bo_deductions: 150.00,
      missing_deductions: 0.00,
      net_delivered_amount: 2062.00,
      payment_method: 'Cash',
      paid_amount: 2062.00,
      shortage_amount: 0.00,
      delivered_at: '2026-10-24T14:15:00',
      receipt_ref: 'OR-VAL-1001',
      remarks: 'Paid in full upon delivery',
      customer_suggestions: 'Requested additional Cornetto promo posters and prefers delivery before 10:00 AM.',
      items: [
        { id: 'MAG-001', name: 'CLASSIC (MAGNUM)', category: 'MAGNUM', qty: 10, price: 165.20 },
        { id: 'COR-001', name: 'CHOCOLATE (CORNETTO)', category: 'CORNETTO', qty: 20, price: 28.00 }
      ]
    },
    {
      id: 'BK-2026-1002',
      store_name: 'San Isidro Mini-Mart',
      customer: 'San Isidro Mini-Mart',
      owner_name: 'Juan Santos',
      area: 'Valencia City',
      route: 'Valencia City Route (San-Isidro)',
      booking_date: '2026-10-25',
      booking_time: '09:15 AM',
      status: 'Ready for Deliver',
      total_receipt: 2284.60,
      bo_deductions: 0.00,
      missing_deductions: 0.00,
      net_delivered_amount: 2284.60,
      payment_method: 'Cash',
      paid_amount: 0.00,
      shortage_amount: 0.00,
      delivered_at: null,
      receipt_ref: '',
      remarks: 'Packaged in ice box #1; scheduled for morning route',
      customer_suggestions: 'Wants freezer door seal checked and requested 10 extra Double Dutch tubs next delivery.',
      items: [
        { id: 'STK-001', name: 'COOKIES & CREAM (STICKS)', category: 'STICKS', qty: 15, price: 25.00 },
        { id: 'SUP-001', name: 'DOUBLE DUTCH (SUPREME 1.3L)', category: 'SUPREME 1.3L', qty: 8, price: 238.70 }
      ]
    },
    {
      id: 'BK-2026-1003',
      store_name: 'Cabanglasan Highland Corner',
      customer: 'Cabanglasan Highland Corner',
      owner_name: 'Ramon Santos Jr.',
      area: 'Cabanglasan',
      route: 'Cabanglasan Loop',
      booking_date: '2026-10-25',
      booking_time: '10:00 AM',
      status: 'Delivered',
      total_receipt: 1526.00,
      bo_deductions: 56.00,
      missing_deductions: 0.00,
      net_delivered_amount: 1470.00,
      payment_method: 'GCash',
      paid_amount: 1470.00,
      shortage_amount: 0.00,
      delivered_at: '2026-10-25T11:45:00',
      receipt_ref: 'GC-CAB-9821',
      remarks: 'Paid via GCash reference 98214431',
      customer_suggestions: 'Store owner suggested adding more Hershey\'s 1.3L tubs and new Magnum variants.',
      items: [
        { id: 'COR-003', name: 'COOKIES & DREAM (CORNETTO)', category: 'CORNETTO', qty: 25, price: 28.00 },
        { id: 'MAG-001', name: 'CLASSIC (MAGNUM)', category: 'MAGNUM', qty: 5, price: 165.20 }
      ]
    },
    {
      id: 'BK-2026-1004',
      store_name: 'Cabanglasan Central Grocery',
      customer: 'Cabanglasan Central Grocery',
      owner_name: 'Elena Bautista',
      area: 'Cabanglasan',
      route: 'Cabanglasan Loop',
      booking_date: '2026-10-25',
      booking_time: '11:30 AM',
      status: 'Booked',
      total_receipt: 3227.00,
      bo_deductions: 0.00,
      missing_deductions: 0.00,
      net_delivered_amount: 3227.00,
      payment_method: 'Cash',
      paid_amount: 0.00,
      shortage_amount: 0.00,
      delivered_at: null,
      receipt_ref: '',
      remarks: 'Booked for Cabanglasan Tuesday run',
      customer_suggestions: 'Requested delivery crew call 30 minutes before arrival in Cabanglasan Centro.',
      items: [
        { id: 'SUP-001', name: 'DOUBLE DUTCH (SUPREME 1.3L)', category: 'SUPREME 1.3L', qty: 10, price: 238.70 },
        { id: 'COR-001', name: 'CHOCOLATE (CORNETTO)', category: 'CORNETTO', qty: 30, price: 28.00 }
      ]
    },
    {
      id: 'BK-2026-1005',
      store_name: 'Halapitan Trading Post',
      customer: 'Halapitan Trading Post',
      owner_name: 'Danilo Reyes',
      area: 'San Fernando',
      route: 'Valencia -> San Fernando',
      booking_date: '2026-10-24',
      booking_time: '01:00 PM',
      status: 'Delivered',
      total_receipt: 2478.00,
      bo_deductions: 165.20,
      missing_deductions: 0.00,
      net_delivered_amount: 2312.80,
      payment_method: 'Cash',
      paid_amount: 2312.80,
      shortage_amount: 0.00,
      delivered_at: '2026-10-24T15:30:00',
      receipt_ref: 'OR-SFD-401',
      remarks: 'B.O 1 melted Magnum deducted',
      customer_suggestions: 'Owner requested Selecta price tag stickers for freezer glass lid.',
      items: [
        { id: 'MAG-001', name: 'CLASSIC (MAGNUM)', category: 'MAGNUM', qty: 15, price: 165.20 }
      ]
    }
  ];

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Synced Customers Master Data
  const [customersList, setCustomersList] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Synced Products Master Data
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [categoriesList, setCategoriesList] = useState(SELECTA_CATEGORIES);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('All'); // 'All' | 'Cabanglasan' | 'Valencia' | 'San Fernando'
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal States
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [settlementBooking, setSettlementBooking] = useState(null);
  const [viewReceiptBooking, setViewReceiptBooking] = useState(null);

  // Settlement Form State with Itemized BO & Missing Deductions
  const [settleBoDeduction, setSettleBoDeduction] = useState(0);
  const [settleMissingDeduction, setSettleMissingDeduction] = useState(0);
  const [settleBoItems, setSettleBoItems] = useState([]);
  const [settleMissingItems, setSettleMissingItems] = useState([]);
  const [settlePaymentMethod, setSettlePaymentMethod] = useState('Cash');
  const [settlePaidAmount, setSettlePaidAmount] = useState(0);
  const [settleReceiptRef, setSettleReceiptRef] = useState('');
  const [settleRemarks, setSettleRemarks] = useState('');

  // History and Date / Month Filters
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterDeliveryDate, setFilterDeliveryDate] = useState('');

  // NEW BOOKING FORM STATE (Comprehensive Store Booking)
  const [bookingArea, setBookingArea] = useState('Valencia'); // 'Valencia' | 'Cabanglasan' | 'San Fernando'
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [bookingStoreName, setBookingStoreName] = useState('Aling Nena Sari-Sari Store');
  const [bookingOwnerName, setBookingOwnerName] = useState('Nena Dela Cruz');
  const [bookingContact, setBookingContact] = useState('0917-111-2222');
  const [bookingSubArea, setBookingSubArea] = useState('Batangan');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('09:30 AM');
  const [customerSuggestions, setCustomerSuggestions] = useState('');

  // Products selection in booking
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('All');
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [selectedOrderItems, setSelectedOrderItems] = useState([
    { id: 'COR-001', name: 'CHOCOLATE (CORNETTO)', category: 'CORNETTO', price: 28.00, qty: 20 },
    { id: 'MAG-001', name: 'CLASSIC (MAGNUM)', category: 'MAGNUM', price: 165.20, qty: 10 }
  ]);

  // Load live data from PostgreSQL backend on mount
  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Fetch Bookings
      try {
        const res = await fetch('http://localhost:5000/api/bookings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map(b => ({
              id: b.id,
              store_name: b.store_name || b.customer,
              customer: b.customer || b.store_name,
              owner_name: b.owner_name || '',
              area: b.area || 'Valencia City',
              route: b.route || 'Standard Route',
              booking_date: b.booking_date ? b.booking_date.split('T')[0] : b.booking_date,
              booking_time: b.booking_time || '09:00 AM',
              status: b.status || 'Booked',
              total_receipt: Number(b.total_receipt || b.estimated_total || 0),
              bo_deductions: Number(b.bo_deductions || 0),
              missing_deductions: Number(b.missing_deductions || 0),
              net_delivered_amount: Number(b.net_delivered_amount || b.total_receipt || 0),
              payment_method: b.payment_method || 'Cash',
              paid_amount: Number(b.paid_amount || 0),
              shortage_amount: Number(b.shortage_amount || 0),
              delivered_at: b.delivered_at,
              receipt_ref: b.receipt_ref || '',
              remarks: b.remarks || '',
              customer_suggestions: b.customer_suggestions || b.remarks || '',
              items: Array.isArray(b.items) ? b.items : []
            }));
            setBookings(formatted);
            localStorage.setItem('llano_selecta_bookings', JSON.stringify(formatted));
          }
        }
      } catch (err) {}

      // 2. Fetch Customers
      try {
        const resCust = await fetch('http://localhost:5000/api/customers');
        if (resCust.ok) {
          const custData = await resCust.json();
          if (Array.isArray(custData) && custData.length > 0) {
            setCustomersList(custData);
            localStorage.setItem('llano_selecta_customers', JSON.stringify(custData));
          }
        }
      } catch (err) {}

      // 3. Fetch Products
      try {
        const resProd = await fetch('http://localhost:5000/api/products');
        if (resProd.ok) {
          const prodData = await resProd.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            const mapped = prodData.map(p => ({
              id: p.id,
              barcode: p.barcode || '480001600000',
              name: p.name,
              category: p.category,
              dealerPrice: Number(p.unit_price || p.dealer_price || 0),
              srp: Number(p.srp || (Number(p.unit_price || 0) * 1.12)),
              unit_price: Number(p.unit_price || 0),
              stock: p.stock !== undefined ? p.stock : 50,
              unit: p.unit || 'Pack/Tub'
            }));
            setProductsList(mapped);
            localStorage.setItem('llano_selecta_products', JSON.stringify(mapped));
            const uniqueCats = Array.from(new Set([...SELECTA_CATEGORIES, ...prodData.map(p => p.category)]));
            setCategoriesList(uniqueCats);
          }
        }
      } catch (err) {}
    };

    fetchAllData();
  }, []);

  // Persist bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_bookings', JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

  // Workflow Action 1: Click "Ready for Deliver"
  const handleMarkReadyForDeliver = async (booking) => {
    const updated = {
      ...booking,
      status: 'Ready for Deliver'
    };

    try {
      await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ready for Deliver' })
      });
    } catch (err) {}

    setBookings(prev => prev.map(b => b.id === booking.id ? updated : b));
  };

  // Workflow Action 2: Open Delivery & POS Settlement Modal
  const openDeliverySettlementModal = (booking) => {
    setSettlementBooking(booking);
    const gross = Number(booking.total_receipt || 0);
    setSettleBoItems([]);
    setSettleMissingItems([]);
    setSettleBoDeduction(0);
    setSettleMissingDeduction(0);
    setSettlePaymentMethod('Cash');
    setSettlePaidAmount(gross);
    setSettleReceiptRef(`OR-${Date.now().toString().slice(-4)}`);
    setSettleRemarks('');
  };

  // Add Item Line for B.O Deductions (Melted / Bad Order)
  const addSettleBoItem = () => {
    const defaultProd = productsList[0] || { id: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', dealerPrice: 28.00 };
    setSettleBoItems(prev => [
      ...prev,
      {
        id: `BO-${Date.now().toString().slice(-4)}-${prev.length + 1}`,
        category: defaultProd.category || 'CORNETTO',
        productId: defaultProd.id,
        name: defaultProd.name,
        price: Number(defaultProd.dealerPrice || defaultProd.unit_price || 28),
        qty: 1
      }
    ]);
  };

  const removeSettleBoItem = (index) => {
    setSettleBoItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSettleBoCategoryChange = (index, newCat) => {
    const prodsInCat = productsList.filter(p => p.category === newCat);
    const first = prodsInCat[0] || productsList[0];
    setSettleBoItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          category: newCat,
          productId: first ? first.id : item.productId,
          name: first ? first.name : item.name,
          price: first ? Number(first.dealerPrice || first.unit_price || 28) : item.price
        };
      }
      return item;
    }));
  };

  const handleSettleBoProductChange = (index, prodId) => {
    const found = productsList.find(p => p.id === prodId);
    if (!found) return;
    setSettleBoItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          productId: found.id,
          name: found.name,
          category: found.category,
          price: Number(found.dealerPrice || found.unit_price || 28)
        };
      }
      return item;
    }));
  };

  const handleSettleBoQtyChange = (index, qty) => {
    const val = Math.max(0, parseInt(qty) || 0);
    setSettleBoItems(prev => prev.map((item, i) => i === index ? { ...item, qty: val } : item));
  };

  // Add Item Line for Missing Deductions
  const addSettleMissingItem = () => {
    const defaultProd = productsList[0] || { id: 'COR-001', name: 'CHOCOLATE', category: 'CORNETTO', dealerPrice: 28.00 };
    setSettleMissingItems(prev => [
      ...prev,
      {
        id: `MIS-${Date.now().toString().slice(-4)}-${prev.length + 1}`,
        category: defaultProd.category || 'CORNETTO',
        productId: defaultProd.id,
        name: defaultProd.name,
        price: Number(defaultProd.dealerPrice || defaultProd.unit_price || 28),
        qty: 1
      }
    ]);
  };

  const removeSettleMissingItem = (index) => {
    setSettleMissingItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSettleMissingCategoryChange = (index, newCat) => {
    const prodsInCat = productsList.filter(p => p.category === newCat);
    const first = prodsInCat[0] || productsList[0];
    setSettleMissingItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          category: newCat,
          productId: first ? first.id : item.productId,
          name: first ? first.name : item.name,
          price: first ? Number(first.dealerPrice || first.unit_price || 28) : item.price
        };
      }
      return item;
    }));
  };

  const handleSettleMissingProductChange = (index, prodId) => {
    const found = productsList.find(p => p.id === prodId);
    if (!found) return;
    setSettleMissingItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          productId: found.id,
          name: found.name,
          category: found.category,
          price: Number(found.dealerPrice || found.unit_price || 28)
        };
      }
      return item;
    }));
  };

  const handleSettleMissingQtyChange = (index, qty) => {
    const val = Math.max(0, parseInt(qty) || 0);
    setSettleMissingItems(prev => prev.map((item, i) => i === index ? { ...item, qty: val } : item));
  };

  // Itemized totals & effective deductions
  const totalItemizedBo = settleBoItems.reduce((acc, it) => acc + (it.qty * it.price), 0);
  const totalItemizedMissing = settleMissingItems.reduce((acc, it) => acc + (it.qty * it.price), 0);

  const effectiveBoDeduction = totalItemizedBo > 0 ? totalItemizedBo : Number(settleBoDeduction || 0);
  const effectiveMissingDeduction = totalItemizedMissing > 0 ? totalItemizedMissing : Number(settleMissingDeduction || 0);

  // Computed net amount inside settlement modal
  const grossAmount = settlementBooking ? Number(settlementBooking.total_receipt || 0) : 0;
  const computedNet = Math.max(0, grossAmount - effectiveBoDeduction - effectiveMissingDeduction);
  const paidVal = Number(settlePaidAmount || 0);
  const computedChange = Math.max(0, paidVal - computedNet);
  const computedShortage = Math.max(0, computedNet - paidVal);

  // Confirm Delivery & Settlement with Exact Delivered Date and Time
  const handleConfirmDelivery = async () => {
    if (!settlementBooking) return;

    const now = new Date();
    const formattedDeliveredAt = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const isoDeliveredAt = now.toISOString();

    const payload = {
      status: 'Delivered',
      total_receipt: grossAmount,
      bo_deductions: effectiveBoDeduction,
      missing_deductions: effectiveMissingDeduction,
      net_delivered_amount: computedNet,
      payment_method: settlePaymentMethod,
      paid_amount: paidVal,
      shortage_amount: computedShortage,
      change_amount: computedChange,
      delivered_at: isoDeliveredAt,
      delivered_time: formattedDeliveredAt,
      receipt_ref: settleReceiptRef,
      remarks: settleRemarks,
      bo_items: settleBoItems,
      missing_items: settleMissingItems
    };

    try {
      await fetch(`http://localhost:5000/api/bookings/${settlementBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}

    const updatedBooking = {
      ...settlementBooking,
      ...payload
    };

    setBookings(prev => prev.map(b => b.id === settlementBooking.id ? updatedBooking : b));
    setSettlementBooking(null);
    alert(`Success! Order for ${updatedBooking.store_name} labeled as DELIVERED on ${formattedDeliveredAt}. Customer Change: ${formatPHP(computedChange)}.`);
  };

  // Get stores matching the chosen area
  const getStoresForArea = (areaName) => {
    const norm = (areaName || '').toLowerCase();
    return customersList.filter(c => {
      const cArea = (c.area || '').toLowerCase();
      const cSub = (c.subArea || '').toLowerCase();
      const cPurok = (c.purok || '').toLowerCase();
      const cName = (c.store_name || c.name || '').toLowerCase();

      if (norm.includes('caban') || norm.includes('cabal')) {
        return cArea.includes('caban') || cArea.includes('cabal') || cSub.includes('caban') || cSub.includes('cabal') || cSub.includes('mandaing') || cSub.includes('centro') || cName.includes('cabanglasan');
      }
      if (norm.includes('fernando') || norm.includes('sanfernando')) {
        return cArea.includes('fernando') || cArea.includes('sanfernando') || cSub.includes('halapitan') || cSub.includes('poblacion') || cName.includes('fernando') || cName.includes('halapitan');
      }
      // Valencia
      return cArea.includes('valencia') || cSub.includes('batangan') || cSub.includes('kahaponan') || cSub.includes('ventar') || cSub.includes('san-isidro') || cSub.includes('sinabuagan') || cSub.includes('lumbayao') || cName.includes('valencia');
    });
  };

  const cabanglasanStores = getStoresForArea('Cabanglasan');
  const valenciaStores = getStoresForArea('Valencia');
  const sanFernandoStores = getStoresForArea('San Fernando');

  // Handle Area Selection in Modal (Cabalangasan, Valencia, or San Fernando)
  const handleSelectArea = (targetArea) => {
    setBookingArea(targetArea);
    const areaStores = getStoresForArea(targetArea);
    if (areaStores.length > 0) {
      const first = areaStores[0];
      setSelectedStoreId(first.id || first.store_name);
      setBookingStoreName(first.store_name || first.name || '');
      setBookingOwnerName(first.owner || first.owner_name || '');
      setBookingContact(first.contact || '');
      setBookingSubArea(first.subArea || first.purok || '');
    } else {
      setSelectedStoreId('custom');
      setBookingStoreName('');
      setBookingOwnerName('');
      setBookingContact('');
      setBookingSubArea('');
    }
  };

  // Handle Specific Store Selection in Modal
  const handleSelectStore = (storeId) => {
    setSelectedStoreId(storeId);
    if (storeId === 'custom') {
      setBookingStoreName('');
      setBookingOwnerName('');
      setBookingContact('');
      setBookingSubArea('');
      return;
    }
    const found = customersList.find(c => (c.id === storeId || c.store_name === storeId));
    if (found) {
      setBookingStoreName(found.store_name || found.name || '');
      setBookingOwnerName(found.owner || found.owner_name || '');
      setBookingContact(found.contact || '');
      setBookingSubArea(found.subArea || found.purok || '');
    }
  };

  const openNewBookingModal = () => {
    setIsNewBookingModalOpen(true);
    const now = new Date();
    setBookingDate(now.toISOString().split('T')[0]);
    setBookingTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    const areaStores = getStoresForArea(bookingArea);
    if (areaStores.length > 0) {
      const match = areaStores.find(s => (s.id === selectedStoreId || s.store_name === bookingStoreName)) || areaStores[0];
      setSelectedStoreId(match.id || match.store_name);
      setBookingStoreName(match.store_name || match.name || '');
      setBookingOwnerName(match.owner || match.owner_name || '');
      setBookingContact(match.contact || '');
      setBookingSubArea(match.subArea || match.purok || '');
    }
  };

  // Product Selection Handlers
  const handleAddProduct = (prod) => {
    const existing = selectedOrderItems.find(it => it.id === prod.id || it.name === prod.name);
    const price = Number(prod.dealerPrice || prod.unit_price || 0);
    if (existing) {
      setSelectedOrderItems(prev => prev.map(it => 
        (it.id === prod.id || it.name === prod.name) ? { ...it, qty: it.qty + 1 } : it
      ));
    } else {
      setSelectedOrderItems(prev => [
        ...prev,
        {
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: price,
          qty: 1,
          unit: prod.unit || 'Pack/Tub'
        }
      ]);
    }
  };

  const handleDecrementProduct = (prod) => {
    const existing = selectedOrderItems.find(it => it.id === prod.id || it.name === prod.name);
    if (!existing) return;
    if (existing.qty <= 1) {
      setSelectedOrderItems(prev => prev.filter(it => it.id !== prod.id && it.name !== prod.name));
    } else {
      setSelectedOrderItems(prev => prev.map(it => 
        (it.id === prod.id || it.name === prod.name) ? { ...it, qty: it.qty - 1 } : it
      ));
    }
  };

  const handleUpdateItemQty = (index, qty) => {
    const val = parseInt(qty);
    if (isNaN(val) || val <= 0) {
      setSelectedOrderItems(prev => prev.filter((_, idx) => idx !== index));
    } else {
      setSelectedOrderItems(prev => prev.map((it, idx) => idx === index ? { ...it, qty: val } : it));
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedOrderItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Live order calculations
  const totalOrderPieces = selectedOrderItems.reduce((acc, it) => acc + Number(it.qty || 0), 0);
  const totalOrderAmount = selectedOrderItems.reduce((acc, it) => acc + (Number(it.qty || 0) * Number(it.price || 0)), 0);

  // Filter Catalog Products inside modal (Identical categories and filter to Products module)
  const filteredCatalogProducts = productsList.filter(prod => {
    const matchesCat = catalogCategoryFilter === 'All' || prod.category === catalogCategoryFilter;
    const matchesSearch = !catalogSearchTerm || 
      prod.name?.toLowerCase().includes(catalogSearchTerm.toLowerCase()) ||
      (prod.barcode && prod.barcode.includes(catalogSearchTerm)) ||
      (prod.id && prod.id.toLowerCase().includes(catalogSearchTerm.toLowerCase())) ||
      (prod.category && prod.category.toLowerCase().includes(catalogSearchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Create New Store Booking
  const handleCreateBooking = async () => {
    if (!bookingStoreName.trim()) {
      alert('Please specify a Target Store Name for this booking.');
      return;
    }
    if (selectedOrderItems.length === 0) {
      alert('Please add at least one product from the Products Catalog to book.');
      return;
    }

    const now = new Date();
    const autoTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const autoDate = bookingDate || now.toISOString().split('T')[0];

    const newId = `BK-${Date.now().toString().slice(-6)}`;
    const newBooking = {
      id: newId,
      store_name: bookingStoreName.trim(),
      customer: bookingStoreName.trim(),
      owner_name: bookingOwnerName.trim() || 'N/A',
      area: bookingArea,
      route: `${bookingArea} Delivery Route`,
      booking_date: autoDate,
      booking_time: autoTime,
      status: 'Booked',
      total_receipt: totalOrderAmount,
      bo_deductions: 0,
      missing_deductions: 0,
      net_delivered_amount: totalOrderAmount,
      payment_method: 'Cash',
      paid_amount: 0,
      shortage_amount: 0,
      customer_suggestions: customerSuggestions.trim(),
      remarks: customerSuggestions.trim() || 'Store booking placed',
      items: selectedOrderItems
    };

    try {
      await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
    } catch (err) {}

    setBookings(prev => [newBooking, ...prev]);
    setIsNewBookingModalOpen(false);
    setCustomerSuggestions('');
    alert(`Success! Store order for ${newBooking.store_name} in ${newBooking.area} has been booked.`);
  };

  // Dynamically extract all available months
  const allMonths = Array.from(
    new Set([
      '2026-10',
      '2026-11',
      '2026-12',
      '2026-09',
      ...bookings.map(b => (b.delivered_at ? b.delivered_at.slice(0, 7) : (b.booking_date ? b.booking_date.slice(0, 7) : ''))).filter(Boolean)
    ])
  ).sort().reverse();

  // Filter Bookings across Workflow (All matching criteria)
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receipt_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customer_suggestions && b.customer_suggestions.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesArea = filterArea === 'All' || 
      (b.area && b.area.toLowerCase().includes(filterArea.toLowerCase())) ||
      (filterArea === 'Cabanglasan' && b.area && (b.area.toLowerCase().includes('cabal') || b.area.toLowerCase().includes('caban'))) ||
      (filterArea === 'San Fernando' && b.area && (b.area.toLowerCase().includes('fernando') || b.area.toLowerCase().includes('sanfernando')));

    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;

    const targetDate = b.delivered_at ? b.delivered_at.slice(0, 10) : b.booking_date;
    const matchesDeliveryDate = !filterDeliveryDate || targetDate === filterDeliveryDate;
    const matchesMonth = filterMonth === 'All' || (targetDate && targetDate.slice(0, 7) === filterMonth);

    return matchesSearch && matchesArea && matchesStatus && matchesDeliveryDate && matchesMonth;
  });

  // ACTIVE DELIVERIES: Undelivered workflow queue (Automatically excludes 'Delivered' orders)
  const filteredActiveBookings = filteredBookings.filter(b => b.status !== 'Delivered');

  // KPI Calculations
  const deliveredBookings = bookings.filter(b => b.status === 'Delivered');

  // Filtered Delivered Bookings for History Archive
  const filteredDeliveredBookings = deliveredBookings.filter(b => {
    const matchesSearch = 
      b.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receipt_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customer_suggestions && b.customer_suggestions.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesArea = filterArea === 'All' || 
      (b.area && b.area.toLowerCase().includes(filterArea.toLowerCase())) ||
      (filterArea === 'Cabanglasan' && b.area && (b.area.toLowerCase().includes('cabal') || b.area.toLowerCase().includes('caban'))) ||
      (filterArea === 'San Fernando' && b.area && (b.area.toLowerCase().includes('fernando') || b.area.toLowerCase().includes('sanfernando')));

    const targetDate = b.delivered_at ? b.delivered_at.slice(0, 10) : b.booking_date;
    const matchesDeliveryDate = !filterDeliveryDate || targetDate === filterDeliveryDate;
    const matchesMonth = filterMonth === 'All' || (targetDate && targetDate.slice(0, 7) === filterMonth);

    return matchesSearch && matchesArea && matchesDeliveryDate && matchesMonth;
  });

  const historyGrossTotal = filteredDeliveredBookings.reduce((acc, b) => acc + Number(b.total_receipt || 0), 0);
  const historyBoTotal = filteredDeliveredBookings.reduce((acc, b) => acc + Number(b.bo_deductions || 0), 0);
  const historyNetTotal = filteredDeliveredBookings.reduce((acc, b) => acc + Number(b.net_delivered_amount || 0), 0);
  const historyChangeTotal = filteredDeliveredBookings.reduce((acc, b) => acc + Number(b.change_amount || 0), 0);

  const allTotalDeliveredAmount = deliveredBookings.reduce((acc, b) => acc + Number(b.net_delivered_amount || 0), 0);
  const totalDeliveredStoresCount = deliveredBookings.length;
  const readyForDeliverCount = bookings.filter(b => b.status === 'Ready for Deliver').length;
  const bookedCount = bookings.filter(b => b.status === 'Booked').length;
  const totalBoDeductionsAll = deliveredBookings.reduce((acc, b) => acc + Number(b.bo_deductions || 0), 0);

  // Helper to compute week start (Monday) and end (Sunday)
  const getWeekDetails = (dateStr) => {
    if (!dateStr) return { key: 'Undated', label: 'Undated / Pending Route', orderVal: 0 };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { key: 'Undated', label: 'Undated / Pending Route', orderVal: 0 };
    
    const day = d.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const monStr = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const sunStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const key = monday.toISOString().slice(0, 10);

    return {
      key,
      label: `${monStr} — ${sunStr}`,
      orderVal: monday.getTime()
    };
  };

  // Group Bookings by Week and by specific Area (Cabanglasan, San Fernando, Valencia)
  const weeklyAreaGroups = bookings.reduce((groups, b) => {
    const targetDate = b.booking_date || (b.delivered_at ? b.delivered_at.slice(0, 10) : '');
    const { key, label, orderVal } = getWeekDetails(targetDate);

    if (!groups[key]) {
      groups[key] = {
        key,
        label,
        orderVal,
        areas: {
          'Cabanglasan': [],
          'San Fernando': [],
          'Valencia': []
        }
      };
    }

    const normArea = (b.area || '').toLowerCase();
    let areaKey = 'Valencia';
    if (normArea.includes('caban') || normArea.includes('cabal') || normArea.includes('mandaing')) {
      areaKey = 'Cabanglasan';
    } else if (normArea.includes('fernando') || normArea.includes('sanfernando') || normArea.includes('halapitan')) {
      areaKey = 'San Fernando';
    } else {
      areaKey = 'Valencia';
    }

    groups[key].areas[areaKey].push(b);
    return groups;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Store Bookings & Delivery Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store-specific bookings, delivery fulfillment, B.O deductions & integrated POS payment collection
          </p>
        </div>
        <button 
          onClick={openNewBookingModal}
          className="btn-primary flex items-center justify-center gap-2 py-2.5 px-4 shadow-md shadow-brand-red/20 font-bold"
        >
          <Plus className="w-4 h-4" /> Book Order for Store
        </button>
      </div>

      {/* PROMINENT SUMMARY BANNER: ALL TOTAL DELIVERED AMOUNT OF ALL STORES */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-red-900/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Hero Highlight: All Total Amount Delivered */}
          <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Grand Total
              </span>
              <span className="text-xs text-slate-400 font-medium">All Partner Stores</span>
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              All Total Delivered Amount of All Stores
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formatPHP(allTotalDeliveredAmount)}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Net collected and verified from <strong>{totalDeliveredStoresCount}</strong> delivered stores</span>
            </p>
          </div>

          {/* Sub-Metrics Cards */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivered Stores</span>
              <span className="text-xl font-black text-emerald-400 block mt-1">{totalDeliveredStoresCount}</span>
              <span className="text-[10px] text-slate-500">Receipts settled</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ready For Deliver</span>
              <span className="text-xl font-black text-blue-400 block mt-1">{readyForDeliverCount}</span>
              <span className="text-[10px] text-slate-500">Packaged in vans</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booked Stores</span>
              <span className="text-xl font-black text-amber-400 block mt-1">{bookedCount}</span>
              <span className="text-[10px] text-slate-500">Orders placed</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">B.O. Deductions</span>
              <span className="text-xl font-black text-red-400 block mt-1">{formatPHP(totalBoDeductionsAll)}</span>
              <span className="text-[10px] text-slate-500">Melted / damaged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation View Selector: Active Orders vs Weekly Territory Books vs History Archive */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveView('orders')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeView === 'orders' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4" /> Store Deliveries & Workflow ({filteredActiveBookings.length})
        </button>
        <button 
          onClick={() => setActiveView('weekly')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeView === 'weekly' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Weekly Territory Books ({Object.keys(weeklyAreaGroups).length} Weeks)
        </button>
        <button 
          onClick={() => setActiveView('history')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeView === 'history' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" /> Delivered History Archive ({filteredDeliveredBookings.length})
        </button>
      </div>

      {/* COMPREHENSIVE FILTER BAR: SEARCH, SPECIFIC AREA, STATUS, MONTH OF DELIVERED & SPECIFIC DATE */}
      <div className="card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Term */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search store name, owner, booking ID, or receipt ref..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs sm:text-sm"
            />
          </div>

          {/* Specific Area Filter (Cabanglasan, Valencia, San Fernando) */}
          <div className="md:col-span-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-400 shrink-0" />
            <select 
              value={filterArea} 
              onChange={(e) => setFilterArea(e.target.value)}
              className="input-field cursor-pointer text-xs sm:text-sm font-bold text-slate-800"
            >
              <option value="All">All Delivery Areas</option>
              <option value="Cabanglasan">📍 Cabanglasan bookings / delivery</option>
              <option value="Valencia">📍 Valencia City bookings / delivery</option>
              <option value="San Fernando">📍 San Fernando bookings / delivery</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field cursor-pointer text-xs sm:text-sm font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Ready for Deliver">Ready for Deliver</option>
              <option value="Delivered">Delivered</option>
              <option value="Backload">Backload</option>
            </select>
          </div>
        </div>

        {/* Second Filter Row: Delivered Month, Specific Delivered Date, and Reset Button */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100 items-center">
          {/* Delivered Month Filter */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-red shrink-0" />
            <div className="w-full">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Filter by Month:</span>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="input-field cursor-pointer text-xs font-semibold py-1.5"
              >
                <option value="All">All Recorded Months</option>
                {allMonths.map(m => (
                  <option key={m} value={m}>
                    🗓️ {m === '2026-10' ? 'October 2026' : m === '2026-11' ? 'November 2026' : m === '2026-12' ? 'December 2026' : m === '2026-09' ? 'September 2026' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Delivered Date Filter */}
          <div className="sm:col-span-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-red shrink-0" />
            <div className="w-full">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">Filter Specific Delivered Date:</span>
              <input
                type="date"
                value={filterDeliveryDate}
                onChange={(e) => setFilterDeliveryDate(e.target.value)}
                className="input-field text-xs py-1.5 cursor-pointer font-medium"
              />
            </div>
          </div>

          {/* Reset Filters Action */}
          <div className="sm:col-span-3 flex justify-end items-end h-full">
            {(searchTerm || filterArea !== 'All' || filterStatus !== 'All' || filterMonth !== 'All' || filterDeliveryDate) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterArea('All');
                  setFilterStatus('All');
                  setFilterMonth('All');
                  setFilterDeliveryDate('');
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-brand-red bg-slate-100 hover:bg-red-50 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <X className="w-3.5 h-3.5" /> Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: Store Deliveries Workflow Table */}
      {activeView === 'orders' && (
        <div className="card space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Store & Owner</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Booked Date & Time</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Delivery Area</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Total Receipt</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">B.O Deductions</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Net Amount</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Delivery Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredActiveBookings.length > 0 ? (
                  filteredActiveBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      {/* Specific Store Name & Owner */}
                      <td className="py-3 px-4">
                        <div className="text-sm font-bold text-slate-900">{b.store_name}</div>
                        <div className="text-xs text-slate-500 font-medium">Owner: {b.owner_name || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ID: {b.id} • {b.items?.length || 0} varieties ({b.items?.reduce((acc, it) => acc + Number(it.qty || 0), 0)} units)
                        </div>
                        {b.customer_suggestions && (
                          <div className="mt-1.5 p-1.5 bg-amber-50/90 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-start gap-1.5 shadow-2xs">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-bold text-amber-950">Wants/Suggestions: </span>
                              <span className="italic">{b.customer_suggestions}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Booked Date & Time for each store */}
                      <td className="py-3 px-4 text-xs">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-red" /> {formatDate(b.booking_date)}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {b.booking_time}
                        </div>
                      </td>

                      {/* Delivery Area */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          b.area?.includes('Cabanglasan') || b.area?.includes('Cabalangasan') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          b.area?.includes('Valencia') ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {b.area}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.route}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                          b.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          b.status === 'Ready for Deliver' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          b.status === 'Booked' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {b.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                          {b.status === 'Ready for Deliver' && <Truck className="w-3 h-3" />}
                          {b.status === 'Booked' && <Clock className="w-3 h-3" />}
                          {b.status}
                        </span>
                      </td>

                      {/* Total Receipt (Gross Amount) */}
                      <td className="py-3 px-4 text-sm font-bold text-slate-800 text-right">
                        {formatPHP(b.total_receipt)}
                      </td>

                      {/* B.O. Deductions */}
                      <td className="py-3 px-4 text-sm font-semibold text-red-600 text-right">
                        {b.bo_deductions > 0 ? `-${formatPHP(b.bo_deductions)}` : '₱0.00'}
                      </td>

                      {/* Net Delivered Amount */}
                      <td className="py-3 px-4 text-sm font-black text-emerald-700 text-right">
                        {formatPHP(b.net_delivered_amount)}
                      </td>

                      {/* Delivery Actions */}
                      <td className="py-3 px-4 text-right">
                        {b.status === 'Booked' && (
                          <button
                            onClick={() => handleMarkReadyForDeliver(b)}
                            className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 ml-auto shadow-2xs transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" /> Ready for Deliver
                          </button>
                        )}

                        {b.status === 'Ready for Deliver' && (
                          <button
                            onClick={() => openDeliverySettlementModal(b)}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 ml-auto shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Deliver & Settle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-slate-400 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                        <span className="font-bold text-slate-600 text-sm">No Pending Deliveries in Active Queue</span>
                        <span className="text-slate-400 max-w-sm">All confirmed deliveries are automatically moved to the Delivered History Archive.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: Weekly Territory Books (Separated by Cabanglasan, San Fernando, Valencia by Week) */}
      {activeView === 'weekly' && (
        <div className="space-y-8">
          {Object.values(weeklyAreaGroups)
            .sort((a, b) => b.orderVal - a.orderVal)
            .map(week => {
              const allWeekBookings = [
                ...week.areas.Cabanglasan,
                ...week.areas['San Fernando'],
                ...week.areas.Valencia
              ];

              const weekDelivered = allWeekBookings.filter(o => o.status === 'Delivered');
              const weekGrossTotal = allWeekBookings.reduce((sum, o) => sum + Number(o.total_receipt || 0), 0);
              const weekBoTotal = weekDelivered.reduce((sum, o) => sum + Number(o.bo_deductions || 0), 0);
              const weekNetTotal = weekDelivered.reduce((sum, o) => sum + Number(o.net_delivered_amount || 0), 0);

              const territories = [
                {
                  name: 'Cabanglasan',
                  title: 'Cabanglasan Territory (Loop & Uplands)',
                  badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
                  accentBg: 'bg-purple-50/50',
                  accentBorder: 'border-purple-200',
                  items: week.areas.Cabanglasan
                },
                {
                  name: 'San Fernando',
                  title: 'San Fernando Territory (Loop & Halapitan)',
                  badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
                  accentBg: 'bg-amber-50/50',
                  accentBorder: 'border-amber-200',
                  items: week.areas['San Fernando']
                },
                {
                  name: 'Valencia',
                  title: 'Valencia City Territory (Poblacion & Central Routes)',
                  badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
                  accentBg: 'bg-blue-50/50',
                  accentBorder: 'border-blue-200',
                  items: week.areas.Valencia
                }
              ];

              return (
                <div key={week.key} className="card p-6 border border-slate-200 shadow-sm space-y-6">
                  {/* Week Banner Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-50 text-brand-red rounded-2xl border border-red-100 shadow-2xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-red text-white">
                            Weekly Ledger
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Week starting {week.key}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-0.5">
                          {week.label}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Territory dispatch for Cabanglasan, San Fernando, and Valencia
                        </p>
                      </div>
                    </div>

                    {/* Overall Week Rollup */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-right">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Booked Stores</span>
                        <span className="text-sm font-black text-slate-800">{allWeekBookings.length} Stores</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Delivered & Paid</span>
                        <span className="text-sm font-black text-emerald-600">{weekDelivered.length} Completed</span>
                      </div>
                      <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 text-center">
                        <span className="text-[9px] text-red-500 font-bold uppercase block">B.O Deductions</span>
                        <span className="text-sm font-black text-red-600">-{formatPHP(weekBoTotal)}</span>
                      </div>
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 text-center">
                        <span className="text-[9px] text-emerald-700 font-bold uppercase block">Net Remitted</span>
                        <span className="text-sm font-black text-emerald-800">{formatPHP(weekNetTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 SPECIFIC TERRITORIES BREAKDOWN (Cabanglasan, San Fernando, Valencia) */}
                  <div className="space-y-6">
                    {territories.map(terr => {
                      const terrDelivered = terr.items.filter(o => o.status === 'Delivered');
                      const terrGross = terr.items.reduce((sum, o) => sum + Number(o.total_receipt || 0), 0);
                      const terrBo = terrDelivered.reduce((sum, o) => sum + Number(o.bo_deductions || 0), 0);
                      const terrNet = terrDelivered.reduce((sum, o) => sum + Number(o.net_delivered_amount || 0), 0);

                      return (
                        <div key={terr.name} className={`rounded-xl border ${terr.accentBorder} overflow-hidden bg-white shadow-2xs`}>
                          {/* Area Header Bar */}
                          <div className={`p-3.5 ${terr.accentBg} border-b ${terr.accentBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-600 shrink-0" />
                              <div>
                                <h4 className="text-sm font-black text-slate-900">{terr.title}</h4>
                                <span className="text-[11px] text-slate-500">
                                  {terr.items.length} Bookings scheduled • {terrDelivered.length} Delivered
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-right">
                              <div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Area B.O.</span>
                                <span className="text-xs font-bold text-red-600">
                                  {terrBo > 0 ? `-${formatPHP(terrBo)}` : '₱0.00'}
                                </span>
                              </div>
                              <div className="pl-3 border-l border-slate-200">
                                <span className="text-[9px] text-slate-400 font-bold uppercase block">Territory Net Delivered</span>
                                <span className="text-sm font-black text-emerald-700">{formatPHP(terrNet)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Area Store Orders Table */}
                          {terr.items.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                                    <th className="py-2.5 px-3">Store Name & Owner</th>
                                    <th className="py-2.5 px-3">Booked Date/Time</th>
                                    <th className="py-2.5 px-3">Status</th>
                                    <th className="py-2.5 px-3 text-right">Gross Receipt</th>
                                    <th className="py-2.5 px-3 text-right">B.O. Deductions</th>
                                    <th className="py-2.5 px-3 text-right">Net Delivered</th>
                                    <th className="py-2.5 px-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                  {terr.items.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                                      <td className="py-2.5 px-3">
                                        <div className="font-bold text-slate-900">{o.store_name}</div>
                                        <div className="text-[10px] text-slate-400">Owner: {o.owner_name || 'N/A'}</div>
                                        {o.customer_suggestions && (
                                          <div className="text-[10px] text-amber-800 italic mt-0.5 flex items-center gap-1">
                                            <MessageSquare className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                            <span className="line-clamp-1">{o.customer_suggestions}</span>
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-2.5 px-3 text-slate-600">
                                        <div className="font-semibold">{formatDate(o.booking_date)}</div>
                                        <div className="text-[10px] text-slate-400">{o.booking_time}</div>
                                      </td>
                                      <td className="py-2.5 px-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                                          o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                          o.status === 'Ready for Deliver' ? 'bg-blue-100 text-blue-800' :
                                          'bg-amber-100 text-amber-800'
                                        }`}>
                                          {o.status === 'Delivered' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                          {o.status}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                                        {formatPHP(o.total_receipt)}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-red-600 font-semibold">
                                        {o.bo_deductions > 0 ? `-${formatPHP(o.bo_deductions)}` : '₱0.00'}
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                                        {formatPHP(o.net_delivered_amount)}
                                      </td>
                                      <td className="py-2.5 px-3 text-right">
                                        {o.status === 'Booked' && (
                                          <button
                                            onClick={() => handleMarkReadyForDeliver(o)}
                                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg inline-flex items-center gap-1 shadow-2xs"
                                          >
                                            <Truck className="w-3 h-3" /> Ready
                                          </button>
                                        )}
                                        {o.status === 'Ready for Deliver' && (
                                          <button
                                            onClick={() => openDeliverySettlementModal(o)}
                                            className="btn-primary text-[11px] py-1 px-2.5 inline-flex items-center gap-1 shadow-2xs"
                                          >
                                            <CheckCircle2 className="w-3 h-3" /> Deliver & Settle
                                          </button>
                                        )}
                                        {o.status === 'Delivered' && (
                                          <button
                                            onClick={() => setViewReceiptBooking(o)}
                                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 transition-colors"
                                          >
                                            <Receipt className="w-3 h-3" /> Receipt
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="py-6 px-4 text-center text-slate-400 text-xs">
                              No store bookings recorded for {terr.name} in this week.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW 4: Delivered Receipts Archive (A Perfect HISTORY) */}
      {activeView === 'history' && (
        <div className="card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Delivered Store Receipts & Official Fulfillment History
              </h3>
              <p className="text-xs text-slate-500">
                Audited fulfillment history with exact delivery timestamps, itemized B.O. deductions, payment methods & customer change returned
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black">
              {filteredDeliveredBookings.length} Delivered Orders
            </span>
          </div>

          {/* History Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivered Stores</span>
              <span className="text-xl font-black text-slate-800">{filteredDeliveredBookings.length}</span>
              <span className="text-[10px] text-slate-500">In filtered period</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Gross Billed</span>
              <span className="text-xl font-black text-slate-800">{formatPHP(historyGrossTotal)}</span>
              <span className="text-[10px] text-slate-500">Total receipt value</span>
            </div>
            <div className="bg-red-50/50 p-3 rounded-xl border border-red-200">
              <span className="text-[10px] text-red-500 font-bold uppercase block">B.O. Deductions</span>
              <span className="text-xl font-black text-red-600">-{formatPHP(historyBoTotal)}</span>
              <span className="text-[10px] text-red-400">Melted / damaged</span>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Net Sales Collected</span>
              <span className="text-xl font-black text-emerald-700">{formatPHP(historyNetTotal)}</span>
              <span className="text-[10px] text-emerald-500">Official remittance</span>
            </div>
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-blue-500 font-bold uppercase block">Customer Exchanged</span>
              <span className="text-xl font-black text-blue-700">{formatPHP(historyChangeTotal)}</span>
              <span className="text-[10px] text-blue-400">Total sukli returned</span>
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Receipt Ref</th>
                  <th className="py-3 px-4">Store & Owner</th>
                  <th className="py-3 px-4">Delivered Date & Time</th>
                  <th className="py-3 px-4">Area Territory</th>
                  <th className="py-3 px-4">Way of Payment</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4 text-right">B.O Deductions</th>
                  <th className="py-3 px-4 text-right">Net Delivered</th>
                  <th className="py-3 px-4 text-right">Paid & Exchanged</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredDeliveredBookings.length > 0 ? (
                  filteredDeliveredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand-red">
                        {b.receipt_ref || b.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{b.store_name}</div>
                        <div className="text-[11px] text-slate-500">Owner: {b.owner_name || 'N/A'}</div>
                        {b.customer_suggestions && (
                          <div className="text-[10px] text-amber-800 italic mt-0.5 flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                            <span className="line-clamp-1">{b.customer_suggestions}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>
                            {b.delivered_time || (b.delivered_at ? b.delivered_at.replace('T', ' ').slice(0, 16) : `${b.booking_date} ${b.booking_time}`)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Booked: {formatDate(b.booking_date)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.area?.includes('Cabanglasan') ? 'bg-purple-100 text-purple-800' :
                          b.area?.includes('Valencia') ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {b.area}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {b.payment_method || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-700">
                        {formatPHP(b.total_receipt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {b.bo_deductions > 0 ? (
                          <div>
                            <span className="font-bold text-red-600">-{formatPHP(b.bo_deductions)}</span>
                            {b.bo_items?.length > 0 && (
                              <div className="text-[9px] text-red-500 mt-0.5 font-medium">
                                ({b.bo_items.length} BO SKU itemized)
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">₱0.00</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                        {formatPHP(b.net_delivered_amount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-bold text-slate-800">Paid: {formatPHP(b.paid_amount || b.net_delivered_amount)}</div>
                        {b.change_amount > 0 ? (
                          <div className="text-[10px] font-bold text-emerald-600">
                            Sukli: +{formatPHP(b.change_amount)}
                          </div>
                        ) : b.shortage_amount > 0 ? (
                          <div className="text-[10px] font-bold text-amber-600">
                            Short: -{formatPHP(b.shortage_amount)}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Delivered
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setViewReceiptBooking(b)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-slate-700 inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3" /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="py-8 text-center text-slate-400 text-xs">
                      No delivered orders found matching the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POS DELIVERY SETTLEMENT MODAL (Triggered when clicking Delivered) */}
      {settlementBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Settle Delivery & POS Payment Collection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Itemize B.O deductions by product & flavor, calculate customer exchanged change, and stamp delivery
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSettlementBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* Store & Schedule Info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase">Store Destination</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 text-[10px]">{settlementBooking.area}</span>
                </div>
                <div className="text-sm font-black text-slate-900">{settlementBooking.store_name}</div>
                <div className="text-slate-500">Owner: {settlementBooking.owner_name || 'N/A'}</div>
                <div className="text-slate-600 flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-brand-red" />
                  <span>Booked: <strong>{formatDate(settlementBooking.booking_date)}</strong> at <strong>{settlementBooking.booking_time}</strong></span>
                </div>
              </div>

              {/* Customer Wants & Suggestions Display */}
              {settlementBooking.customer_suggestions && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Customer Wants & Special Suggestions:</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed italic pl-5">
                    "{settlementBooking.customer_suggestions}"
                  </p>
                </div>
              )}

              {/* Total Receipt (Gross Amount) */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase block">Total Receipt (Gross Bill)</span>
                  <span className="text-[10px] text-slate-400">Sum of all booked ice cream units delivered</span>
                </div>
                <span className="text-xl font-black text-slate-900">{formatPHP(grossAmount)}</span>
              </div>

              {/* ITEMIZE B.O. DEDUCTIONS (MELTED / BAD ORDER ICE CREAM) */}
              <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        B.O Deductions (Melted / Bad Order)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Select specific category and flavor of damaged or melted ice cream
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-red-600 text-xs">
                      Total: -{formatPHP(effectiveBoDeduction)}
                    </span>
                    <button
                      type="button"
                      onClick={addSettleBoItem}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add B.O. SKU
                    </button>
                  </div>
                </div>

                {settleBoItems.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {settleBoItems.map((item, idx) => {
                      const prodsForCat = productsList.filter(p => p.category === item.category);
                      return (
                        <div key={item.id || idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-red-100">
                          {/* Category Dropdown */}
                          <div className="col-span-4">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Category</span>
                            <select
                              value={item.category}
                              onChange={(e) => handleSettleBoCategoryChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 cursor-pointer font-bold text-slate-800"
                            >
                              {SELECTA_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Specific Product / Flavor Dropdown */}
                          <div className="col-span-4">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Flavor / Product</span>
                            <select
                              value={item.productId}
                              onChange={(e) => handleSettleBoProductChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 cursor-pointer font-medium text-slate-800"
                            >
                              {prodsForCat.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({formatPHP(p.dealerPrice || p.unit_price || 28)})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Qty</span>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleSettleBoQtyChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 text-center font-bold text-red-600"
                            />
                          </div>

                          {/* Line Total & Remove Button */}
                          <div className="col-span-2 flex items-center justify-between pl-1">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Deduction</span>
                              <span className="text-[11px] font-black text-red-600">
                                -{formatPHP(item.qty * item.price)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSettleBoItem(idx)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-slate-400 text-[11px]">No B.O. items itemized. Or enter direct lump deduction:</span>
                    <div className="relative w-36 ml-auto">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-red-500">₱</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={settleBoDeduction}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setSettleBoDeduction(val);
                          setSettlePaidAmount(Math.max(0, grossAmount - val - effectiveMissingDeduction));
                        }}
                        className="input-field pl-6 text-xs font-bold text-red-600 py-1"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ITEMIZE MISSING / OTHER DEDUCTIONS */}
              <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      Missing / Other Deductions
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Unloaded items missing or unfulfilled
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-600 text-xs">
                      Total: -{formatPHP(effectiveMissingDeduction)}
                    </span>
                    <button
                      type="button"
                      onClick={addSettleMissingItem}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Missing SKU
                    </button>
                  </div>
                </div>

                {settleMissingItems.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {settleMissingItems.map((item, idx) => {
                      const prodsForCat = productsList.filter(p => p.category === item.category);
                      return (
                        <div key={item.id || idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-amber-100">
                          {/* Category Dropdown */}
                          <div className="col-span-4">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Category</span>
                            <select
                              value={item.category}
                              onChange={(e) => handleSettleMissingCategoryChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 cursor-pointer font-bold text-slate-800"
                            >
                              {SELECTA_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Specific Product / Flavor Dropdown */}
                          <div className="col-span-4">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Flavor / Product</span>
                            <select
                              value={item.productId}
                              onChange={(e) => handleSettleMissingProductChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 cursor-pointer font-medium text-slate-800"
                            >
                              {prodsForCat.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({formatPHP(p.dealerPrice || p.unit_price || 28)})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 block font-semibold uppercase">Qty</span>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleSettleMissingQtyChange(idx, e.target.value)}
                              className="input-field text-[11px] py-1 text-center font-bold text-amber-600"
                            />
                          </div>

                          {/* Line Total & Remove Button */}
                          <div className="col-span-2 flex items-center justify-between pl-1">
                            <div>
                              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Deduction</span>
                              <span className="text-[11px] font-black text-amber-600">
                                -{formatPHP(item.qty * item.price)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSettleMissingItem(idx)}
                              className="text-slate-400 hover:text-amber-600 p-1 rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-slate-400 text-[11px]">No missing items itemized. Or enter direct lump deduction:</span>
                    <div className="relative w-36 ml-auto">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-amber-500">₱</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={settleMissingDeduction}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setSettleMissingDeduction(val);
                          setSettlePaidAmount(Math.max(0, grossAmount - effectiveBoDeduction - val));
                        }}
                        className="input-field pl-6 text-xs font-bold text-amber-600 py-1"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Payable / Net Delivered Receipt */}
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-900 font-black uppercase block">Net Amount to Collect</span>
                  <span className="text-[10px] text-emerald-700">Gross receipt minus B.O. ({formatPHP(effectiveBoDeduction)}) and missing deductions</span>
                </div>
                <span className="text-2xl font-black text-emerald-800">{formatPHP(computedNet)}</span>
              </div>

              {/* Way of Payments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Way of Payment
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Cash', 'GCash', 'Bank Check', 'Shortage'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSettlePaymentMethod(method)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                        settlePaymentMethod === method
                          ? 'bg-brand-red text-white border-brand-red shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Paid & Receipt Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Actual Amount Paid by Store
                    </label>
                    <button
                      type="button"
                      onClick={() => setSettlePaidAmount(computedNet)}
                      className="text-[10px] text-brand-red font-bold hover:underline"
                    >
                      Exact Net
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₱</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={settlePaidAmount}
                      onChange={(e) => setSettlePaidAmount(parseFloat(e.target.value) || 0)}
                      className="input-field pl-7 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receipt / Reference #
                  </label>
                  <input 
                    type="text" 
                    value={settleReceiptRef}
                    onChange={(e) => setSettleReceiptRef(e.target.value)}
                    placeholder="e.g. OR-9921 or GCash Ref"
                    className="input-field text-xs font-medium"
                  />
                </div>
              </div>

              {/* CUSTOMER EXCHANGED (SUKLI / CHANGE TO RETURN) DISPLAY */}
              {computedChange > 0 && (
                <div className="p-3 bg-emerald-100/80 border-2 border-emerald-400 rounded-xl flex items-center justify-between text-xs text-emerald-950 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wide block text-[11px] text-emerald-900">
                        Customer Exchanged (Sukli / Change to Return)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        Paid {formatPHP(paidVal)} - Net {formatPHP(computedNet)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-black text-emerald-900">
                    +{formatPHP(computedChange)}
                  </span>
                </div>
              )}

              {/* Shortage Warning if paid < net */}
              {computedShortage > 0 && (
                <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wide block text-[11px] text-amber-900">
                        Unsettled Store Shortage Amount
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">
                        Store underpaid by {formatPHP(computedShortage)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-black text-amber-950">
                    -{formatPHP(computedShortage)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Remarks / Settlement Notes
                </label>
                <textarea 
                  value={settleRemarks}
                  onChange={(e) => setSettleRemarks(e.target.value)}
                  placeholder="e.g. Paid in cash upon Bongo unloading. 1 soft tub returned."
                  rows={2}
                  className="input-field text-xs resize-none"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-red" />
                Will be labeled DELIVERED with current date & time
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSettlementBooking(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelivery}
                  className="btn-primary py-2 px-5 text-xs font-black shadow-md shadow-brand-red/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Confirm Delivered & Settle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW RECEIPT MODAL */}
      {viewReceiptBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-red" />
                <h3 className="font-bold text-slate-900 text-sm">Official Delivery Receipt</h3>
              </div>
              <button onClick={() => setViewReceiptBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="text-center pb-2 border-b border-slate-100">
                <h4 className="font-black text-slate-900 text-base">LLANO SELECTA DEALER</h4>
                <p className="text-[10px] text-slate-400">Bukidnon Cold-Chain Ice Cream Distribution</p>
                <p className="text-xs font-mono font-bold text-brand-red mt-1">
                  Receipt: {viewReceiptBooking.receipt_ref || viewReceiptBooking.id}
                </p>
              </div>

              <div className="space-y-1 text-slate-600">
                <div><span className="text-slate-400">Delivered Store:</span> <strong className="text-slate-800">{viewReceiptBooking.store_name}</strong></div>
                <div><span className="text-slate-400">Owner:</span> <span className="text-slate-800">{viewReceiptBooking.owner_name}</span></div>
                <div><span className="text-slate-400">Area:</span> <span className="text-slate-800">{viewReceiptBooking.area}</span></div>
                <div><span className="text-slate-400">Booked Schedule:</span> <span className="text-slate-800">{formatDate(viewReceiptBooking.booking_date)} • {viewReceiptBooking.booking_time}</span></div>
                {viewReceiptBooking.status === 'Delivered' && (
                  <div className="pt-1 text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivered At: {viewReceiptBooking.delivered_time || (viewReceiptBooking.delivered_at ? viewReceiptBooking.delivered_at.replace('T', ' ').slice(0, 16) : 'Confirmed')}</span>
                  </div>
                )}
              </div>

              {/* Customer Wants & Suggestions Display on Receipt */}
              {viewReceiptBooking.customer_suggestions && (
                <div className="p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Store Wants & Suggestions:</span>
                  </div>
                  <p className="text-amber-800 text-[11px] italic pl-5 leading-relaxed">
                    "{viewReceiptBooking.customer_suggestions}"
                  </p>
                </div>
              )}

              {/* Items List */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {viewReceiptBooking.items?.map((it, i) => (
                  <div key={i} className="p-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{it.name}</div>
                      <div className="text-[10px] text-slate-400">{it.qty} × {formatPHP(it.price)}</div>
                    </div>
                    <div className="font-bold text-slate-900">{formatPHP(Number(it.qty) * Number(it.price))}</div>
                  </div>
                ))}
              </div>

              {/* Financial Deductions Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Total Receipt:</span>
                  <span className="font-bold text-slate-800">{formatPHP(viewReceiptBooking.total_receipt)}</span>
                </div>
                {viewReceiptBooking.bo_deductions > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>B.O. Deductions (Melted):</span>
                    <span className="font-bold">-{formatPHP(viewReceiptBooking.bo_deductions)}</span>
                  </div>
                )}
                {viewReceiptBooking.missing_deductions > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Missing Deductions:</span>
                    <span className="font-bold">-{formatPHP(viewReceiptBooking.missing_deductions)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-emerald-800 pt-1 border-t border-slate-200">
                  <span>Net Collected:</span>
                  <span>{formatPHP(viewReceiptBooking.net_delivered_amount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Way of Payment:</span>
                  <span className="font-bold text-slate-700">{viewReceiptBooking.payment_method || 'Cash'}</span>
                </div>
                {viewReceiptBooking.paid_amount > 0 && (
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Actual Paid:</span>
                    <span className="font-bold text-slate-800">{formatPHP(viewReceiptBooking.paid_amount)}</span>
                  </div>
                )}
                {viewReceiptBooking.change_amount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-700 font-bold">
                    <span>Customer Change (Sukli):</span>
                    <span>+{formatPHP(viewReceiptBooking.change_amount)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button 
                onClick={() => window.print()}
                className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STORE BOOKING MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 my-6 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-brand-red to-red-700 text-white rounded-2xl shadow-md shadow-brand-red/30">
                  <IceCream className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                    Book Order for Store
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select target area, specific store, pick ice cream products from catalog, and log store wants
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewBookingModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* STEP 1: SELECT SPECIFIC AREA (Cabanglasan / Cabalangasan, Valencia, San Fernando) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    1. Select Specific Delivery Area
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Choose territory to filter stores</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Area 1: Cabanglasan / Cabalangasan */}
                  <button
                    type="button"
                    onClick={() => handleSelectArea('Cabanglasan')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      bookingArea === 'Cabanglasan'
                        ? 'bg-gradient-to-br from-brand-red to-red-700 text-white shadow-lg shadow-brand-red/25 border-brand-red scale-[1.01]'
                        : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        bookingArea === 'Cabanglasan' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
                      }`}>
                        Cabanglasan
                      </span>
                      <MapPin className={`w-4 h-4 ${bookingArea === 'Cabanglasan' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="mt-2">
                      <div className="font-black text-sm">Cabanglasan / Cabalangasan</div>
                      <div className={`text-[11px] mt-0.5 ${bookingArea === 'Cabanglasan' ? 'text-white/80' : 'text-slate-500'}`}>
                        {cabanglasanStores.length} Registered Partner Stores
                      </div>
                    </div>
                  </button>

                  {/* Area 2: Valencia City */}
                  <button
                    type="button"
                    onClick={() => handleSelectArea('Valencia')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      bookingArea === 'Valencia'
                        ? 'bg-gradient-to-br from-brand-red to-red-700 text-white shadow-lg shadow-brand-red/25 border-brand-red scale-[1.01]'
                        : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        bookingArea === 'Valencia' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Valencia
                      </span>
                      <MapPin className={`w-4 h-4 ${bookingArea === 'Valencia' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="mt-2">
                      <div className="font-black text-sm">Valencia City</div>
                      <div className={`text-[11px] mt-0.5 ${bookingArea === 'Valencia' ? 'text-white/80' : 'text-slate-500'}`}>
                        {valenciaStores.length} Registered Partner Stores
                      </div>
                    </div>
                  </button>

                  {/* Area 3: San Fernando */}
                  <button
                    type="button"
                    onClick={() => handleSelectArea('San Fernando')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      bookingArea === 'San Fernando'
                        ? 'bg-gradient-to-br from-brand-red to-red-700 text-white shadow-lg shadow-brand-red/25 border-brand-red scale-[1.01]'
                        : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        bookingArea === 'San Fernando' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        San Fernando
                      </span>
                      <MapPin className={`w-4 h-4 ${bookingArea === 'San Fernando' ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div className="mt-2">
                      <div className="font-black text-sm">San Fernando</div>
                      <div className={`text-[11px] mt-0.5 ${bookingArea === 'San Fernando' ? 'text-white/80' : 'text-slate-500'}`}>
                        {sanFernandoStores.length} Registered Partner Stores
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* STEP 2: CHOOSE SPECIFIC STORE & SCHEDULE */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-brand-red" />
                    2. Choose Specific Store ({bookingArea})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Filtered specifically for <strong>{bookingArea}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Store Picker
                    </label>
                    <select
                      value={selectedStoreId}
                      onChange={(e) => handleSelectStore(e.target.value)}
                      className="input-field font-bold text-xs cursor-pointer"
                    >
                      {getStoresForArea(bookingArea).map(s => (
                        <option key={s.id || s.store_name} value={s.id || s.store_name}>
                          {s.store_name} — {s.owner || s.owner_name} ({s.subArea || s.purok || bookingArea})
                        </option>
                      ))}
                      <option value="custom">+ Enter Custom / Walk-in Store</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Store Name
                    </label>
                    <input 
                      type="text" 
                      value={bookingStoreName} 
                      onChange={(e) => setBookingStoreName(e.target.value)}
                      placeholder="e.g. Aling Nena Sari-Sari Store"
                      className="input-field text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Owner / Store Contact Person</label>
                    <input 
                      type="text" 
                      value={bookingOwnerName} 
                      onChange={(e) => setBookingOwnerName(e.target.value)}
                      placeholder="e.g. Nena Dela Cruz"
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input 
                      type="text" 
                      value={bookingContact} 
                      onChange={(e) => setBookingContact(e.target.value)}
                      placeholder="e.g. 0917-111-2222"
                      className="input-field text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Area / Purok</label>
                    <input 
                      type="text" 
                      value={bookingSubArea} 
                      onChange={(e) => setBookingSubArea(e.target.value)}
                      placeholder="e.g. Batangan / Purok 3"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Booking Date</label>
                    <input 
                      type="date" 
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="input-field text-xs cursor-pointer font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Booking Time</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ⚡ Automatic on Save
                      </span>
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={bookingTime} 
                        onChange={(e) => setBookingTime(e.target.value)}
                        placeholder="Current time auto-stamped on save"
                        className="input-field text-xs pl-8 font-semibold bg-slate-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: PRODUCTS CATALOG SELECTION & FILTERING */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-red" />
                    3. Pick Products From Catalog (Filtered by Category)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Showing {filteredCatalogProducts.length} ice cream products available
                  </span>
                </div>

                {/* Category Filter Pills (Identical to Products Catalog Module) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => setCatalogCategoryFilter('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      catalogCategoryFilter === 'All'
                        ? 'bg-brand-red text-white shadow-sm shadow-brand-red/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    All Categories ({productsList.length})
                  </button>
                  {categoriesList.map(cat => {
                    const count = productsList.filter(p => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCatalogCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          catalogCategoryFilter === cat
                            ? 'bg-brand-red text-white shadow-sm shadow-brand-red/30'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat} {count > 0 ? `(${count})` : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Product Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={catalogSearchTerm}
                    onChange={(e) => setCatalogSearchTerm(e.target.value)}
                    placeholder="Search ice cream name, flavor, barcode, or SKU..."
                    className="input-field pl-10 text-xs"
                  />
                  {catalogSearchTerm && (
                    <button 
                      type="button" 
                      onClick={() => setCatalogSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Products Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 bg-slate-50/70 rounded-2xl border border-slate-200/80">
                  {filteredCatalogProducts.length > 0 ? (
                    filteredCatalogProducts.map(prod => {
                      const inCart = selectedOrderItems.find(it => it.id === prod.id || it.name === prod.name);
                      return (
                        <div 
                          key={prod.id || prod.name} 
                          className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                            inCart 
                              ? 'bg-emerald-50/80 border-emerald-300 shadow-xs' 
                              : 'bg-white hover:border-red-200 border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {prod.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Stock: {prod.stock || 50}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-slate-900 mt-1 line-clamp-1" title={prod.name}>
                              {prod.name}
                            </div>
                            <div className="text-xs font-black text-brand-red mt-0.5">
                              {formatPHP(prod.dealerPrice || prod.unit_price)}
                              <span className="text-[10px] font-normal text-slate-400 ml-1">/ {prod.unit || 'unit'}</span>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                            {inCart ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[11px] font-bold text-emerald-800">
                                  In Order: <strong>{inCart.qty}</strong>
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDecrementProduct(prod)}
                                    className="w-6 h-6 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs"
                                    title="Decrease"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center font-black text-xs text-emerald-900">
                                    {inCart.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddProduct(prod)}
                                    className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs"
                                    title="Increase"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddProduct(prod)}
                                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-brand-red text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add to Booking
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                      No ice cream products match "{catalogSearchTerm}" in {catalogCategoryFilter} category.
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 4: SELECTED ORDER ITEMS & TOTAL OF THE PRODUCTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-brand-red" />
                    4. Selected Order Items & Quantities ({selectedOrderItems.length} varieties)
                  </label>
                  <span className="text-xs font-bold text-slate-600">
                    Total Units: <strong className="text-slate-900">{totalOrderPieces} packs/tubs</strong>
                  </span>
                </div>

                {/* Items List Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {selectedOrderItems.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                      {selectedOrderItems.map((it, idx) => (
                        <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{it.name}</span>
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold uppercase">
                                {it.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Price: {formatPHP(it.price)} each
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            {/* Quantity Editor */}
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => handleUpdateItemQty(idx, it.qty - 1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input 
                                type="number" 
                                min="1"
                                value={it.qty}
                                onChange={(e) => handleUpdateItemQty(idx, e.target.value)}
                                className="w-12 text-center text-xs font-black bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateItemQty(idx, it.qty + 1)}
                                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="w-24 text-right">
                              <div className="font-black text-sm text-slate-900">
                                {formatPHP(it.qty * it.price)}
                              </div>
                              <div className="text-[10px] text-slate-400">Subtotal</div>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                              title="Remove product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No products added yet. Click <strong>+ Add to Booking</strong> on any ice cream in the catalog above.
                    </div>
                  )}
                </div>

                {/* PROMINENT LIVE TOTAL OF THE PRODUCTS SUMMARY */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">
                        Live Calculation
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        {selectedOrderItems.length} Product Varieties • {totalOrderPieces} Total Items
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Total gross amount for this store delivery order
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Total of the Products
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                      {formatPHP(totalOrderAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 5: DESCRIPTION OF CUSTOMERS / STORE ADDITIONAL WANTS OR SUGGESTIONS */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <MessageSquarePlus className="w-4 h-4 text-amber-600" />
                    5. Description of Customer / Store Additional Wants or Suggestions
                  </label>
                  <span className="text-[11px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                    Special Requests & Notes
                  </span>
                </div>

                <textarea
                  value={customerSuggestions}
                  onChange={(e) => setCustomerSuggestions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Store owner requested early morning delivery before 9:00 AM; wants extra Cornetto promotional posters; asked for freezer door gasket check; requests more Chocolate & Ube flavors in next week's booking..."
                  className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />

                <p className="text-[11px] text-amber-800">
                  💡 This description will be attached to the store's delivery order, displayed on the operations register, and printed on the official delivery receipt for the driver and customer.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Destination: <strong className="text-slate-800">{bookingStoreName || 'Unspecified'}</strong> ({bookingArea})
              </div>

              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)} 
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleCreateBooking} 
                  disabled={selectedOrderItems.length === 0 || !bookingStoreName.trim()}
                  className="btn-primary text-xs py-2 px-6 flex items-center gap-2 shadow-lg shadow-brand-red/30 disabled:opacity-50 disabled:cursor-not-allowed font-black"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Store Booking ({formatPHP(totalOrderAmount)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
