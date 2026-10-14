import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  X, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  IceCream,
  Box
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with backend API if available, fallback to INITIAL_PRODUCTS
  React.useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            barcode: p.barcode || '480001600000',
            name: p.name,
            category: p.category,
            dealerPrice: Number(p.unit_price || p.dealer_price || 0),
            srp: Number(p.srp || (Number(p.unit_price || 0) * 1.12)),
            unit_price: Number(p.unit_price || 0),
            stock: p.stock !== undefined ? p.stock : 50,
            minStock: p.min_stock || 15,
            unit: p.unit || 'Pcs'
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {
        // Fallback to INITIAL_PRODUCTS silently if backend is offline
      });
  }, []);

  // Filter products by search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate quick stock badge status
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-700 border-red-200' };
    if (stock <= minStock) return { label: 'Low Stock', class: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Healthy', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1>
          <p className="text-sm text-slate-500">SELECTA ice cream inventory master list and pricing</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search and Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by product name, barcode, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Tag className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              {SELECTA_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({products.filter(p => p.category === cat).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ALL ({products.length})
          </button>
          {SELECTA_CATEGORIES.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-brand-red text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Item / Barcode</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dealer Price</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">SRP</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">In Stock</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.minStock);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-light text-brand-red rounded-lg hidden sm:block">
                            <IceCream className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{product.name}</div>
                            <div className="text-xs text-slate-400 font-mono">{product.barcode} • {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 font-medium">{product.category}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-800">{formatPHP(product.dealerPrice)}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-500">{formatPHP(product.srp)}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-800">
                        {product.stock} <span className="text-xs font-normal text-slate-500">{product.unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${stockStatus.class}`}>
                          {product.stock <= product.minStock && product.stock > 0 && <AlertTriangle className="w-3 h-3" />}
                          {product.stock === 0 && <X className="w-3 h-3" />}
                          {product.stock > product.minStock && <CheckCircle2 className="w-3 h-3" />}
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-light rounded transition-colors" title="Edit Product">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Product">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <Box className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No products found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Add New SELECTA Item</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Barcode / EAN <span className="text-brand-red">*</span></label>
                  <input type="text" className="input-field" placeholder="48000161XXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category <span className="text-brand-red">*</span></label>
                  <select className="input-field cursor-pointer">
                    <option>Single Serve</option>
                    <option>Premium Single</option>
                    <option>Tubs & Pints</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name <span className="text-brand-red">*</span></label>
                <input type="text" className="input-field" placeholder="e.g. Magnum Double Chocolate 80ml" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Dealer Buy Price (₱) <span className="text-brand-red">*</span></label>
                  <input type="number" step="0.01" className="input-field" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SRP / Retail Price (₱) <span className="text-brand-red">*</span></label>
                  <input type="number" step="0.01" className="input-field" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Stock</label>
                  <input type="number" className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Alert Min Stock</label>
                  <input type="number" className="input-field" placeholder="20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Type</label>
                  <select className="input-field cursor-pointer">
                    <option>Pcs</option>
                    <option>Tubs</option>
                    <option>Boxes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn-primary"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}