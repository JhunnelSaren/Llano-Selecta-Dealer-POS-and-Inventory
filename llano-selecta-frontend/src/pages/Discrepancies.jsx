import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  Filter, 
  DollarSign, 
  X, 
  Printer, 
  Eye, 
  FileText, 
  IceCream, 
  TrendingDown, 
  Truck, 
  Store, 
  PackageX,
  Camera, 
  CheckCircle2, 
  Upload, 
  Layers,
  MapPin,
  RotateCcw,
  Check,
  Clock,
  Calendar,
  Receipt,
  User,
  Phone,
  FileCheck,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { formatPHP, formatDate } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES, INITIAL_CUSTOMERS } from '../utils/productCatalog';
import { useAuth, ROLES } from '../context/AuthContext';

export default function Discrepancies() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === ROLES.ADMIN || !currentUser;

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

  // Helper to extract Municipality / Area Territory
  const getCustomerAreaKey = (custNameOrObj) => {
    let text = '';
    if (typeof custNameOrObj === 'string') {
      const match = customersList.find(c => c.store_name === custNameOrObj || c.name === custNameOrObj);
      text = match ? `${match.area || ''} ${match.subArea || match.sub_area || ''}` : custNameOrObj;
    } else if (custNameOrObj) {
      text = `${custNameOrObj.area || ''} ${custNameOrObj.subArea || custNameOrObj.sub_area || ''}`;
    }
    const norm = text.toLowerCase();
    if (norm.includes('caban') || norm.includes('cabal')) return 'Cabanglasan';
    if (norm.includes('fernando') || norm.includes('sanfernando') || norm.includes('halapitan')) return 'San Fernando';
    return 'Valencia';
  };

  // Initial Seed BO / Melted Incident Logs
  const INITIAL_BO_LOGS = [
    {
      id: 'BO-2026-001',
      deliveryRef: 'DEL-VAL-8821',
      customer: 'Aling Nena Sari-Sari Store',
      ownerName: 'Nena Dela Cruz',
      contact: '0917-123-4567',
      area: 'Valencia',
      subArea: 'Batangan',
      route: 'Valencia City Route (Batangan)',
      date: '2026-10-24',
      type: 'BO / Melted',
      category: 'CORNETTO',
      productName: 'CHOCOLATE (CORNETTO)',
      productId: 'COR-001',
      orderedQty: 30,
      deliveredQty: 25,
      discrepancyQty: 5,
      unitPrice: 28.00,
      deductionAmount: 140.00,
      refundAmount: 140.00,
      refundStatus: 'Refund Requested',
      refundedAt: null,
      refundMethod: null,
      refundRef: null,
      refundNotes: null,
      originalInvoiceAmount: 26215.60,
      adjustedInvoiceAmount: 26075.60,
      reason: 'Cones softened and deformed due to local power outage affecting store chest freezer.',
      recordedBy: 'Juan Driver',
      condition: 'Soft / Melted Ice Cream - Returned to Bodega',
      photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'BO-2026-002',
      deliveryRef: 'DEL-CAB-9011',
      customer: 'Cabanglasan Highland Corner',
      ownerName: 'Ramon Santos',
      contact: '0919-345-6789',
      area: 'Cabanglasan',
      subArea: 'Poblacion',
      route: 'Cabanglasan Delivery Route',
      date: '2026-10-24',
      type: 'BO / Melted',
      category: 'SUPREME 1.3L',
      productName: 'DOUBLE DUTCH 1.3L',
      productId: 'SUP-001',
      orderedQty: 8,
      deliveredQty: 7,
      discrepancyQty: 1,
      unitPrice: 260.00,
      deductionAmount: 260.00,
      refundAmount: 260.00,
      refundStatus: 'Refunded',
      refundedAt: '2026-10-25 10:30 AM',
      refundMethod: 'Deduction / Credit on Next Delivery',
      refundRef: 'REF-CAB-881',
      refundNotes: 'Approved by Dealer Admin. Tub lid was cracked and ice cream leaked during rough road transport.',
      originalInvoiceAmount: 12120.00,
      adjustedInvoiceAmount: 11860.00,
      reason: 'Damaged tub rim and cracked seal during bumpy unpaved road transport to Cabanglasan.',
      recordedBy: 'Pedro Loader',
      condition: 'Cracked Tub / Lid Damaged',
      photoProof: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'BO-2026-003',
      deliveryRef: 'DEL-SFD-401',
      customer: 'Halapitan Trading Post',
      ownerName: 'Danilo Reyes',
      contact: '0922-678-9012',
      area: 'San Fernando',
      subArea: 'Halapitan',
      route: 'Valencia -> San Fernando Route',
      date: '2026-10-25',
      type: 'BO / Melted',
      category: 'MAGNUM',
      productName: 'CLASSIC (MAGNUM)',
      productId: 'MAG-001',
      orderedQty: 15,
      deliveredQty: 13,
      discrepancyQty: 2,
      unitPrice: 65.00,
      deductionAmount: 130.00,
      refundAmount: 130.00,
      refundStatus: 'Refund Requested',
      refundedAt: null,
      refundMethod: null,
      refundRef: null,
      refundNotes: null,
      originalInvoiceAmount: 2478.00,
      adjustedInvoiceAmount: 2348.00,
      reason: 'Magnum sticks softened during hot midday transit. Customer requested refund.',
      recordedBy: 'Juan Driver',
      condition: 'Soft / Melted Ice Cream',
      photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'BO-2026-004',
      deliveryRef: 'DEL-SFD-408',
      customer: 'Little Baguio Hillside Store',
      ownerName: 'Anita Mendoza',
      contact: '0935-777-4321',
      area: 'San Fernando',
      subArea: 'Little Baguio',
      route: 'Valencia -> San Fernando Route',
      date: '2026-10-25',
      type: 'BO / Melted',
      category: 'CORNETTO',
      productName: 'VANILLA (CORNETTO)',
      productId: 'COR-002',
      orderedQty: 20,
      deliveredQty: 17,
      discrepancyQty: 3,
      unitPrice: 28.00,
      deductionAmount: 84.00,
      refundAmount: 84.00,
      refundStatus: 'Refunded',
      refundedAt: '2026-10-26 09:15 AM',
      refundMethod: 'Direct Cash Refund',
      refundRef: 'REF-SFD-902',
      refundNotes: 'Disbursed in cash to owner Anita Mendoza upon van arrival.',
      originalInvoiceAmount: 5600.00,
      adjustedInvoiceAmount: 5516.00,
      reason: 'Freezer ice box seal failure on mountain route.',
      recordedBy: 'Juan Driver',
      condition: 'Soft / Melted Ice Cream',
      photoProof: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const [discrepancyLogs, setDiscrepancyLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_discrepancies');
      return saved ? JSON.parse(saved) : INITIAL_BO_LOGS;
    } catch {
      return INITIAL_BO_LOGS;
    }
  });

  // Load from backend API if available
  useEffect(() => {
    const fetchDiscrepancies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/discrepancies');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(d => ({
              id: d.id,
              deliveryRef: d.delivery_ref || d.deliveryRef || 'DEL-2026',
              customer: d.store_name || d.customer_name || d.customer || 'Store',
              ownerName: d.owner_name || d.owner || '',
              contact: d.contact || '',
              area: d.area || 'Valencia',
              subArea: d.sub_area || d.subArea || '',
              route: d.route || `${d.area || 'Valencia'} Delivery Route`,
              date: d.date ? (d.date.includes('T') ? d.date.split('T')[0] : d.date) : '2026-10-24',
              type: d.type || 'BO / Melted',
              category: d.category || 'CORNETTO',
              productName: d.product_name || d.productName || 'Ice Cream SKU',
              productId: d.product_id || d.productId || '',
              discrepancyQty: Number(d.quantity || d.discrepancy_qty || d.discrepancyQty || 1),
              unitPrice: Number(d.unit_price || d.unitPrice || 28.00),
              deductionAmount: Number(d.deduction_amount || d.deductionAmount || 0),
              refundAmount: Number(d.refund_amount || d.refundAmount || d.deduction_amount || 0),
              refundStatus: d.refund_status || d.refundStatus || 'Refund Requested',
              refundedAt: d.refunded_at || d.refundedAt || null,
              refundMethod: d.refund_method || d.refundMethod || null,
              refundRef: d.refund_ref || d.refundRef || null,
              refundNotes: d.refund_notes || d.refundNotes || null,
              reason: d.notes || d.reason || 'Melted / Bad Order reported upon store delivery',
              recordedBy: d.reported_by || d.recordedBy || 'Field Logistics Staff',
              condition: d.condition || 'Soft / Melted Ice Cream',
              photoProof: d.photo_proof || d.photoProof || ''
            }));
            setDiscrepancyLogs(mapped);
          }
        }
      } catch (err) {}
    };
    fetchDiscrepancies();
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_discrepancies', JSON.stringify(discrepancyLogs));
    } catch {}
  }, [discrepancyLogs]);

  // Main Page Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('All'); // 'All' | 'Valencia' | 'Cabanglasan' | 'San Fernando'
  const [filterRefundStatus, setFilterRefundStatus] = useState('All'); // 'All' | 'Refund Requested' | 'Refunded'
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Modal Dialog States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState(null);

  // Refund Settlement Modal State (Admin)
  const [refundModalItem, setRefundModalItem] = useState(null);
  const [refundMethod, setRefundMethod] = useState('Direct Cash Refund');
  const [refundRefInput, setRefundRefInput] = useState('');
  const [refundNotesInput, setRefundNotesInput] = useState('');

  // Form State for Logging BO (Melted)
  const [formArea, setFormArea] = useState('Valencia'); // 'Valencia' | 'Cabanglasan' | 'San Fernando' | 'All'
  const [formCustomer, setFormCustomer] = useState(customersList[0]?.store_name || 'Aling Nena Sari-Sari Store');
  const [formDeliveryRef, setFormDeliveryRef] = useState('DEL-VAL-8821');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState(SELECTA_CATEGORIES[0] || 'CORNETTO');
  const [formProductId, setFormProductId] = useState(productsList[0]?.id || 'COR-001');
  const [formDiscrepancyQty, setFormDiscrepancyQty] = useState(2);
  const [formUnitPrice, setFormUnitPrice] = useState(Number(productsList[0]?.dealerPrice || productsList[0]?.unit_price || 28.00));
  const [formOriginalInvoice, setFormOriginalInvoice] = useState(5000.00);
  const [formCondition, setFormCondition] = useState('Soft / Melted Ice Cream');
  const [formReason, setFormReason] = useState('Brownout at store chest freezer caused softened ice cream cones.');
  const [formRecordedBy, setFormRecordedBy] = useState(currentUser?.name || 'Juan Driver');
  const [formPhotoProof, setFormPhotoProof] = useState('');

  // Products filtered by selected Category
  const categoryProducts = productsList.filter(p => p.category === selectedCategory);

  // Handle Category Change in Form
  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    const prodsInCat = productsList.filter(p => p.category === newCat);
    const firstProd = prodsInCat[0] || productsList[0];
    if (firstProd) {
      setFormProductId(firstProd.id);
      setFormUnitPrice(Number(firstProd.dealerPrice || firstProd.unit_price || 28.00));
    }
  };

  // Handle Flavor / Product SKU Change
  const handleFlavorChange = (prodId) => {
    const prod = productsList.find(p => p.id === prodId);
    if (!prod) return;
    setFormProductId(prod.id);
    setFormUnitPrice(Number(prod.dealerPrice || prod.unit_price || 28.00));
  };

  // Filtered stores strictly based on selected Form Area
  const filteredFormStores = customersList.filter(c => {
    if (formArea === 'All') return true;
    return getCustomerAreaKey(c) === formArea;
  });

  // Handle Form Area Change
  const handleFormAreaChange = (newArea) => {
    setFormArea(newArea);
    const matching = customersList.filter(c => newArea === 'All' || getCustomerAreaKey(c) === newArea);
    if (matching.length > 0) {
      setFormCustomer(matching[0].store_name);
      setFormDeliveryRef(`DEL-${newArea.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    }
  };

  // Handle Photo Upload from Device
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormPhotoProof(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculations for live form
  const calculatedDeduction = formDiscrepancyQty * formUnitPrice;
  const calculatedAdjustedInvoice = Math.max(0, formOriginalInvoice - calculatedDeduction);

  const handleQtyChange = (qty) => {
    const val = Math.max(1, parseInt(qty) || 1);
    setFormDiscrepancyQty(val);
  };

  // Process Refund by Dealer Admin
  const handleProcessRefund = async () => {
    if (!refundModalItem) return;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    const refNumber = refundRefInput.trim() || `REF-${Date.now().toString().slice(-4)}`;
    const adminNotes = refundNotesInput.trim() || 'Refund approved and disbursed to store owner.';
    const refundVal = Number(refundModalItem.refundAmount || refundModalItem.deductionAmount || 0);

    // Call PostgreSQL Backend
    try {
      await fetch(`http://localhost:5000/api/discrepancies/${refundModalItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Refunded',
          refund_status: 'Refunded',
          refund_amount: refundVal,
          refund_method: refundMethod,
          refund_ref: refNumber,
          refund_notes: adminNotes
        })
      });
    } catch (err) {}

    // Update Local State
    setDiscrepancyLogs(prev => prev.map(item => {
      if (item.id === refundModalItem.id) {
        return {
          ...item,
          refundStatus: 'Refunded',
          refundedAt: formattedDate,
          refundMethod: refundMethod,
          refundRef: refNumber,
          refundNotes: adminNotes
        };
      }
      return item;
    }));

    setRefundModalItem(null);
    setRefundRefInput('');
    setRefundNotesInput('');
    alert(`Success! Store refund of ${formatPHP(refundVal)} for ${refundModalItem.customer} marked as REFUNDED.`);
  };

  // Submit Refund Request (Staff or Admin)
  const handleRequestRefund = async (item) => {
    try {
      await fetch(`http://localhost:5000/api/discrepancies/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refund_status: 'Refund Requested',
          refund_amount: Number(item.refundAmount || item.deductionAmount || 0)
        })
      });
    } catch (err) {}

    setDiscrepancyLogs(prev => prev.map(it => {
      if (it.id === item.id) {
        return { ...it, refundStatus: 'Refund Requested' };
      }
      return it;
    }));
    alert(`Store refund request of ${formatPHP(item.refundAmount || item.deductionAmount)} submitted successfully to Admin.`);
  };

  // Open Log Modal with intelligent initial values
  const openLogModal = () => {
    const defaultArea = 'Valencia';
    const storesInDefault = customersList.filter(c => getCustomerAreaKey(c) === defaultArea);
    const chosenStore = storesInDefault[0] || customersList[0];

    setFormArea(defaultArea);
    setFormCustomer(chosenStore ? chosenStore.store_name : 'Aling Nena Sari-Sari Store');
    setFormDeliveryRef(`DEL-${defaultArea.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
    setFormDate(new Date().toISOString().split('T')[0]);
    setSelectedCategory(SELECTA_CATEGORIES[0] || 'CORNETTO');
    const firstP = productsList[0];
    if (firstP) {
      setFormProductId(firstP.id);
      setFormUnitPrice(Number(firstP.dealerPrice || firstP.unit_price || 28.00));
    }
    setFormDiscrepancyQty(2);
    setFormOriginalInvoice(5000.00);
    setFormReason('Softened ice cream cones reported due to power outage in store territory.');
    setFormCondition('Soft / Melted Ice Cream');
    setFormPhotoProof('');
    setIsModalOpen(true);
  };

  // Save new BO Log
  const handleSaveDiscrepancy = async () => {
    if (!formCustomer.trim()) {
      alert('Please select a store customer.');
      return;
    }

    const selectedProduct = productsList.find(p => p.id === formProductId) || { name: 'Ice Cream SKU', category: selectedCategory };
    const matchedCustomer = customersList.find(c => c.store_name === formCustomer);
    const storeArea = formArea !== 'All' ? formArea : getCustomerAreaKey(matchedCustomer || formCustomer);

    const newRecord = {
      id: `BO-${Date.now().toString().slice(-6)}`,
      deliveryRef: formDeliveryRef.trim() || `DEL-${Date.now().toString().slice(-4)}`,
      customer: formCustomer,
      ownerName: matchedCustomer?.owner || matchedCustomer?.owner_name || 'N/A',
      contact: matchedCustomer?.contact || 'N/A',
      area: storeArea,
      subArea: matchedCustomer?.subArea || matchedCustomer?.sub_area || '',
      route: matchedCustomer?.route || `${storeArea} Delivery Route`,
      date: formDate || new Date().toISOString().split('T')[0],
      type: 'BO / Melted',
      category: selectedCategory,
      productName: selectedProduct.name,
      productId: selectedProduct.id || formProductId,
      discrepancyQty: formDiscrepancyQty,
      unitPrice: formUnitPrice,
      deductionAmount: calculatedDeduction,
      refundAmount: calculatedDeduction,
      refundStatus: 'Refund Requested',
      refundedAt: null,
      refundMethod: null,
      refundRef: null,
      refundNotes: null,
      originalInvoiceAmount: formOriginalInvoice,
      adjustedInvoiceAmount: calculatedAdjustedInvoice,
      reason: formReason.trim() || 'Melted / Bad Order reported upon store delivery',
      recordedBy: formRecordedBy.trim() || currentUser?.name || 'Field Logistics Staff',
      condition: formCondition,
      photoProof: formPhotoProof
    };

    // Save to PostgreSQL backend
    try {
      await fetch('http://localhost:5000/api/discrepancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newRecord.id,
          delivery_ref: newRecord.deliveryRef,
          area: newRecord.area,
          store_name: newRecord.customer,
          date: newRecord.date,
          product_name: newRecord.productName,
          category: newRecord.category,
          flavor: selectedProduct.name,
          type: 'BO / Melted',
          quantity: newRecord.discrepancyQty,
          unit_price: newRecord.unitPrice,
          deduction_amount: newRecord.deductionAmount,
          reported_by: newRecord.recordedBy,
          status: 'Logged',
          notes: newRecord.reason,
          refund_status: 'Refund Requested',
          refund_amount: newRecord.refundAmount
        })
      });
    } catch (err) {}

    setDiscrepancyLogs(prev => [newRecord, ...prev]);
    setIsModalOpen(false);
    setFormPhotoProof('');
    setFormReason('');
    alert(`Success! BO (Melted) log saved for ${formCustomer}. A refund request of ${formatPHP(calculatedDeduction)} has been submitted to Admin.`);
  };

  // Metrics summary
  const totalBODeductions = discrepancyLogs.reduce((sum, d) => sum + Number(d.deductionAmount || 0), 0);
  const totalRefundRequested = discrepancyLogs
    .filter(d => d.refundStatus === 'Refund Requested' || !d.refundStatus)
    .reduce((sum, d) => sum + Number(d.refundAmount || d.deductionAmount || 0), 0);
  const totalRefundedSettled = discrepancyLogs
    .filter(d => d.refundStatus === 'Refunded')
    .reduce((sum, d) => sum + Number(d.refundAmount || d.deductionAmount || 0), 0);

  // Extract unique recorded months
  const allRecordedMonths = Array.from(
    new Set([
      '2026-10',
      '2026-09',
      '2026-11',
      ...discrepancyLogs.map(d => d.date ? d.date.slice(0, 7) : '').filter(Boolean)
    ])
  ).sort().reverse();

  // Filtered Logs
  const filteredLogs = discrepancyLogs.filter(d => {
    const matchesSearch = 
      d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.deliveryRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.refundRef && d.refundRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.reason && d.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.category && d.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = filterArea === 'All' || getCustomerAreaKey(d.customer) === filterArea;
    const matchesRefund = filterRefundStatus === 'All' || d.refundStatus === filterRefundStatus;

    const targetDate = d.date ? (d.date.includes('T') ? d.date.split('T')[0] : d.date) : '';
    const matchesDate = !filterDate || targetDate === filterDate;
    const matchesMonth = filterMonth === 'All' || (targetDate && targetDate.slice(0, 7) === filterMonth);

    return matchesSearch && matchesArea && matchesRefund && matchesDate && matchesMonth;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wide">
              Cold Chain Returns & Settlements
            </span>
            <span className="text-xs text-slate-400 font-medium">Valencia • Cabanglasan • San Fernando</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">BO (Melted) Log</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log bad order (B.O.) & melted products, submit store refund requests, and manage dealer refund settlements
          </p>
        </div>
        <button 
          onClick={openLogModal}
          className="btn-primary flex items-center justify-center gap-2 font-bold py-2.5 px-4 shadow-md shadow-brand-red/20"
        >
          <Plus className="w-4 h-4" /> Log BO (Melted) Discrepancy
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500 shadow-xs">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <IceCream className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total BO / Melted Losses</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{formatPHP(totalBODeductions)}</h3>
            <span className="text-[11px] text-amber-700 font-semibold">{discrepancyLogs.length} total recorded incidents</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-orange-500 shadow-xs">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refunds Requested (Pending)</p>
            <h3 className="text-2xl font-black text-orange-600 mt-0.5">{formatPHP(totalRefundRequested)}</h3>
            <span className="text-[11px] text-orange-600 font-semibold">Awaiting Admin Settlement</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-l-4 border-l-emerald-600 shadow-xs">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refunded to Stores (Settled)</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{formatPHP(totalRefundedSettled)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Admin approved & credited</span>
          </div>
        </div>
      </div>

      {/* Main Content Card with Comprehensive Filter Bar */}
      <div className="card space-y-4">
        <div className="space-y-3">
          {/* Row 1: Municipality Pills & Refund Status Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {/* Municipality Area Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mr-1">
                <MapPin className="w-3.5 h-3.5 text-brand-red" /> Territory:
              </span>
              {['All', 'Valencia', 'Cabanglasan', 'San Fernando'].map(area => {
                const count = area === 'All' 
                  ? discrepancyLogs.length 
                  : discrepancyLogs.filter(d => getCustomerAreaKey(d.customer) === area).length;
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setFilterArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      filterArea === area 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{area === 'All' ? 'All Territories' : area}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filterArea === area ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Refund Status Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterRefundStatus}
                onChange={(e) => setFilterRefundStatus(e.target.value)}
                className="input-field cursor-pointer text-xs font-bold py-1.5 bg-white sm:w-52"
              >
                <option value="All">All Refund Statuses</option>
                <option value="Refund Requested">Refund Requested (Pending)</option>
                <option value="Refunded">Refunded (Settled)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Search Input, Month & Date Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="relative sm:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by BO ID, Store Customer, Product flavor, or Category..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 text-xs py-2"
              />
            </div>

            {/* Month Filter */}
            <div className="sm:col-span-3">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="input-field cursor-pointer text-xs font-semibold py-2"
              >
                <option value="All">All Recorded Months</option>
                {allRecordedMonths.map(m => (
                  <option key={m} value={m}>
                    🗓️ {m === '2026-10' ? 'October 2026' : m === '2026-09' ? 'September 2026' : m === '2026-11' ? 'November 2026' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Date Filter */}
            <div className="sm:col-span-3">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input-field text-xs py-1.5 cursor-pointer font-medium"
              />
            </div>

            {/* Reset Filters */}
            <div className="sm:col-span-1 flex justify-end">
              {(searchTerm || filterArea !== 'All' || filterRefundStatus !== 'All' || filterMonth !== 'All' || filterDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterArea('All');
                    setFilterRefundStatus('All');
                    setFilterMonth('All');
                    setFilterDate('');
                  }}
                  className="p-2 text-xs text-slate-500 hover:text-brand-red bg-slate-100 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                  title="Reset all filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Discrepancy Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Log Ref / Date</th>
                <th className="py-3 px-4">Store Customer & Territory</th>
                <th className="py-3 px-4">Category & Flavor SKU</th>
                <th className="py-3 px-4">Melted Qty</th>
                <th className="py-3 px-4 text-right">BO Value</th>
                <th className="py-3 px-4 text-center">Refund Status</th>
                <th className="py-3 px-4 text-center">Photo Proof</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const areaKey = getCustomerAreaKey(log.customer);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      {/* Log Ref & Date */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono">{log.id}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-sans">
                          <Calendar className="w-3 h-3 text-brand-red" />
                          <span>{formatDate(log.date)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {log.deliveryRef}
                        </div>
                      </td>

                      {/* Store Customer & Territory */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{log.customer}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                            areaKey === 'Cabanglasan' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            areaKey === 'San Fernando' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {areaKey}
                          </span>
                          <span className="text-[11px] text-slate-500">{log.route}</span>
                        </div>
                        {log.ownerName && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Owner: {log.ownerName}
                          </div>
                        )}
                      </td>

                      {/* Category & Flavor */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{log.productName}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {log.category || 'SELECTA SKU'}
                        </span>
                      </td>

                      {/* Melted Qty */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-red-100 text-red-800 border-red-200">
                          {log.discrepancyQty} units
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          @ {formatPHP(log.unitPrice)}
                        </div>
                      </td>

                      {/* BO Value */}
                      <td className="py-3 px-4 text-right">
                        <div className="text-sm font-black text-red-600">
                          -{formatPHP(log.deductionAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Refund: {formatPHP(log.refundAmount || log.deductionAmount)}
                        </div>
                      </td>

                      {/* Refund Status & Admin Action */}
                      <td className="py-3 px-4 text-center">
                        {log.refundStatus === 'Refunded' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Refunded
                            </span>
                            <div className="text-[10px] text-emerald-700 font-medium">
                              {log.refundedAt ? log.refundedAt.slice(0, 16) : 'Settled'}
                            </div>
                            {log.refundMethod && (
                              <div className="text-[9px] text-slate-500 font-semibold">
                                via {log.refundMethod}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Refund Requested
                            </span>
                            {isAdmin && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRefundModalItem(log);
                                    setRefundRefInput(`REF-${areaKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`);
                                  }}
                                  className="mx-auto px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <Check className="w-3 h-3" /> Mark as Refunded
                                </button>
                              </div>
                            )}
                            {!isAdmin && (
                              <div className="text-[10px] text-slate-400">
                                Pending Admin Approval
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Photo Proof */}
                      <td className="py-3 px-4 text-center">
                        {log.photoProof ? (
                          <div 
                            className="inline-flex items-center gap-1.5 cursor-pointer group" 
                            onClick={() => setSelectedDiscrepancy(log)}
                            title="Click to view full photo evidence"
                          >
                            <img src={log.photoProof} alt="Proof" className="w-9 h-9 object-cover rounded-lg border group-hover:scale-105 transition-transform" />
                            <span className="text-[11px] text-brand-red font-bold hover:underline">View</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No photo</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setSelectedDiscrepancy(log)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Voucher
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400 text-xs">
                    <AlertTriangle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No BO (Melted) records found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Log BO (Melted) & Request Refund with Area & Store Filtering */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 my-6">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 text-brand-red rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Log BO (Melted) & Request Store Refund
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filter area & store, select category & flavor SKU, and file refund request
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* STEP 1: SPECIFIC AREA & STORE FILTERING */}
              <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/80 space-y-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  1. Filter Specific Territory & Store Customer:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-red" />
                      Specific Municipality / Area <span className="text-brand-red">*</span>
                    </label>
                    <select 
                      value={formArea}
                      onChange={(e) => handleFormAreaChange(e.target.value)}
                      className="input-field cursor-pointer text-xs font-bold bg-white"
                    >
                      <option value="Valencia">📍 Valencia City</option>
                      <option value="Cabanglasan">📍 Cabanglasan</option>
                      <option value="San Fernando">📍 San Fernando</option>
                      <option value="All">All Municipalities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-brand-red" />
                      Filtered Store Name <span className="text-brand-red">*</span>
                    </label>
                    <select 
                      value={formCustomer}
                      onChange={(e) => setFormCustomer(e.target.value)}
                      className="input-field cursor-pointer text-xs font-black text-slate-900 bg-white"
                    >
                      {filteredFormStores.map(c => (
                        <option key={c.id} value={c.store_name}>
                          {c.store_name} ({c.subArea || c.sub_area || c.area})
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                      Showing {filteredFormStores.length} stores in {formArea === 'All' ? 'all areas' : formArea}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-red-200/60">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Delivery Reference #</label>
                    <input
                      type="text"
                      value={formDeliveryRef}
                      onChange={(e) => setFormDeliveryRef(e.target.value)}
                      className="input-field text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Incident Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: CATEGORY & FLAVOR SELECTION */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  2. Select Product Category & Flavor SKU:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Selecta Category</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input-field cursor-pointer text-xs font-black text-brand-red bg-white"
                    >
                      {SELECTA_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Specific Flavor / Product</label>
                    <select 
                      value={formProductId}
                      onChange={(e) => handleFlavorChange(e.target.value)}
                      className="input-field cursor-pointer text-xs font-semibold bg-white"
                    >
                      {categoryProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPHP(p.dealerPrice || p.unit_price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Dealer Cost Unit Price:</span>
                  <span className="font-black text-slate-900">{formatPHP(formUnitPrice)}</span>
                </div>
              </div>

              {/* STEP 3: QUANTITY & AUTO REFUND AMOUNT */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Melted / BO Qty</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={formDiscrepancyQty} 
                    onChange={(e) => handleQtyChange(e.target.value)}
                    className="input-field text-xs text-center font-black text-red-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Invoice (₱)</label>
                  <input 
                    type="number" 
                    value={formOriginalInvoice} 
                    onChange={(e) => setFormOriginalInvoice(parseFloat(e.target.value) || 0)}
                    className="input-field text-xs text-center font-semibold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total BO Refund</label>
                  <div className="input-field bg-red-100/70 border-red-300 text-red-700 font-black text-center text-xs flex items-center justify-center">
                    -{formatPHP(calculatedDeduction)}
                  </div>
                </div>
              </div>

              {/* STEP 4: CONDITION & REASON */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Melted / Bad Order Physical Condition
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    className="input-field text-xs font-semibold bg-white"
                  >
                    <option value="Soft / Melted Ice Cream">Soft / Melted Ice Cream</option>
                    <option value="Defective Ice Box Seal">Defective Ice Box Seal during Transport</option>
                    <option value="Cracked Tub / Lid Damaged">Cracked Tub / Lid Broken Seal</option>
                    <option value="Broken Cones / Squashed Packaging">Broken Cones / Squashed Packaging</option>
                    <option value="Freezer Temperature Brownout Failure">Freezer Temperature Brownout Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason & Explanation</label>
                  <textarea 
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="Provide root cause (e.g. brownout, rough road, broken packaging)..."
                    className="input-field resize-none h-14 text-xs"
                  />
                </div>
              </div>

              {/* STEP 5: PHOTO EVIDENCE FROM LAPTOP/DEVICE */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2">
                <label className="block text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-red" /> Attach Photo Evidence from Laptop/Device
                </label>
                {formPhotoProof ? (
                  <div className="space-y-2">
                    <img src={formPhotoProof} alt="Proof preview" className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-2xs" />
                    <div className="flex justify-between items-center">
                      <label className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg text-xs cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Replace Photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                      <button type="button" onClick={() => setFormPhotoProof('')} className="text-xs font-bold text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer block hover:bg-slate-100/80 transition-colors">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-brand-red block">Click to upload photo of melted ice cream</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG supported from camera or disk</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Store Refund to Request:</span>
                <span className="text-base font-black text-red-600">{formatPHP(calculatedDeduction)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveDiscrepancy} className="btn-primary text-xs py-2 px-4 font-black shadow-md shadow-brand-red/20">
                  Save BO & Submit Refund Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Printable Official BO Refund Voucher */}
      {selectedDiscrepancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 my-6">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 no-print shrink-0">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-brand-red" /> Official BO (Melted) Return Voucher
              </span>
              <button onClick={() => setSelectedDiscrepancy(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Official Voucher Header */}
              <div className="text-center pb-3 border-b border-slate-200">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">LLANO SELECTA DEALER</h2>
                <p className="text-[10px] text-slate-500 font-medium">Bukidnon Cold-Chain Ice Cream Operations</p>
                <p className="text-[10px] text-slate-400">Valencia City • Cabanglasan • San Fernando</p>
                <div className="mt-2 inline-block px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-mono font-black text-brand-red">
                  VOUCHER: {selectedDiscrepancy.id}
                </div>
              </div>

              {/* Store & Schedule Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Store Customer:</span>
                  <strong className="text-slate-900">{selectedDiscrepancy.customer}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Territory Area:</span>
                  <strong className="text-slate-800">{selectedDiscrepancy.area} ({selectedDiscrepancy.route})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Ref / Date:</span>
                  <span className="font-mono text-slate-700">{selectedDiscrepancy.deliveryRef} • {formatDate(selectedDiscrepancy.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recorded By:</span>
                  <span className="text-slate-700">{selectedDiscrepancy.recordedBy}</span>
                </div>
              </div>

              {/* Product SKU & Financial Refund Breakdown */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-black text-slate-900 text-sm">{selectedDiscrepancy.productName}</span>
                    <span className="text-slate-400 text-[10px] block">{selectedDiscrepancy.category}</span>
                  </div>
                  <span className="text-base font-black text-red-600">
                    -{formatPHP(selectedDiscrepancy.deductionAmount)}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] flex justify-between pt-1 border-t border-slate-100">
                  <span>Melted Units: <strong>{selectedDiscrepancy.discrepancyQty} units</strong></span>
                  <span>Unit Price: <strong>{formatPHP(selectedDiscrepancy.unitPrice)}</strong></span>
                </div>
              </div>

              {/* Condition & Cause */}
              <div className="space-y-1">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Condition & Root Cause:</div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <div><strong>Condition:</strong> {selectedDiscrepancy.condition}</div>
                  <div className="mt-0.5"><strong>Reason:</strong> {selectedDiscrepancy.reason}</div>
                </div>
              </div>

              {/* Attached Photo Evidence */}
              {selectedDiscrepancy.photoProof && (
                <div className="space-y-1">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Attached Photo Evidence:</div>
                  <img src={selectedDiscrepancy.photoProof} alt="Proof" className="w-full h-36 object-cover rounded-xl border border-slate-200 shadow-2xs" />
                </div>
              )}

              {/* Refund Settlement Audit */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                selectedDiscrepancy.refundStatus === 'Refunded'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-extrabold uppercase text-[10px]">Store Refund Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                    selectedDiscrepancy.refundStatus === 'Refunded'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}>
                    {selectedDiscrepancy.refundStatus === 'Refunded' ? '✓ Refund Settled' : '⏱ Refund Requested'}
                  </span>
                </div>

                {selectedDiscrepancy.refundStatus === 'Refunded' ? (
                  <div className="text-[11px] space-y-0.5 pt-1.5 border-t border-emerald-200/80">
                    <div>Settled Timestamp: <strong>{selectedDiscrepancy.refundedAt}</strong></div>
                    <div>Method: <strong>{selectedDiscrepancy.refundMethod || 'Direct Cash Refund'}</strong></div>
                    <div>Voucher Ref #: <code>{selectedDiscrepancy.refundRef}</code></div>
                    {selectedDiscrepancy.refundNotes && (
                      <div className="italic text-emerald-800 mt-1">"{selectedDiscrepancy.refundNotes}"</div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] pt-1.5 border-t border-amber-200/80 flex items-center justify-between">
                    <span>Refund amount of <strong>{formatPHP(selectedDiscrepancy.refundAmount || selectedDiscrepancy.deductionAmount)}</strong> is pending Dealer Admin disbursement.</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          const item = selectedDiscrepancy;
                          setSelectedDiscrepancy(null);
                          setRefundModalItem(item);
                          setRefundRefInput(`REF-${item.area?.slice(0, 3).toUpperCase() || 'VAL'}-${Date.now().toString().slice(-4)}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                      >
                        Process Refund
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Signatures Section for Official Printing */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
                <div>
                  <div className="border-b border-slate-300 pb-6 mb-1"></div>
                  <span className="font-bold block text-slate-700">Delivered Crew / Reporter</span>
                  <span>Signature over Printed Name</span>
                </div>
                <div>
                  <div className="border-b border-slate-300 pb-6 mb-1"></div>
                  <span className="font-bold block text-slate-700">Store Owner / Dealer Admin</span>
                  <span>Acknowledgment & Approval</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between bg-slate-50 no-print shrink-0">
              <button onClick={() => window.print()} className="btn-secondary text-xs flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Print Official Voucher
              </button>
              <button onClick={() => setSelectedDiscrepancy(null)} className="btn-primary text-xs py-1.5 px-4 font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Admin Process Refund to Store */}
      {refundModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-6">
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Process Store Refund (Admin)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Settle customer refund for B.O. melted ice cream items
                  </p>
                </div>
              </div>
              <button onClick={() => setRefundModalItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Store:</span>
                  <strong className="text-slate-900">{refundModalItem.customer}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Territory Area:</span>
                  <span className="font-bold text-slate-800">{refundModalItem.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Melted Product:</span>
                  <span className="font-bold text-slate-800">{refundModalItem.productName} ({refundModalItem.discrepancyQty} units)</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200">
                  <span className="text-slate-600 font-bold uppercase">Total Refund to Pay:</span>
                  <strong className="text-base text-emerald-700 font-black">
                    {formatPHP(refundModalItem.refundAmount || refundModalItem.deductionAmount)}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Refund Settlement Method
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="input-field text-xs font-bold bg-white"
                >
                  <option value="Direct Cash Refund">Direct Cash Refund to Store Owner</option>
                  <option value="Deduction / Credit on Next Delivery">Deduction / Credit from Next Store Delivery</option>
                  <option value="GCash Electronic Refund">GCash Electronic Refund Transfer</option>
                  <option value="Freezer Van Product Replacement">Freezer Van Product Replacement SKU</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Refund Voucher / Reference #
                </label>
                <input 
                  type="text" 
                  value={refundRefInput} 
                  onChange={(e) => setRefundRefInput(e.target.value)}
                  placeholder="e.g. REF-VAL-4021 or Cash Receipt #"
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Settlement Remarks / Notes
                </label>
                <textarea 
                  value={refundNotesInput} 
                  onChange={(e) => setRefundNotesInput(e.target.value)}
                  placeholder="e.g. Approved and cash refunded directly to store owner upon delivery route."
                  rows={2}
                  className="input-field text-xs resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setRefundModalItem(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleProcessRefund} 
                className="btn-primary text-xs py-2 px-5 font-black flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" /> Confirm & Mark as Refunded
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
