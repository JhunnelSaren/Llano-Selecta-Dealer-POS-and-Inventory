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
  Box,
  FolderPlus
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';
import { INITIAL_PRODUCTS, SELECTA_CATEGORIES } from '../utils/productCatalog';

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(SELECTA_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form State
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    category: SELECTA_CATEGORIES[0],
    dealerPrice: '',
    srp: '',
    stock: '50',
    minStock: '15',
    unit: 'Tub'
  });

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
          
          // Also collect any custom categories from DB
          const uniqueCats = Array.from(new Set([...SELECTA_CATEGORIES, ...data.map(p => p.category)]));
          setCategories(uniqueCats);
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
      (product.barcode && product.barcode.includes(searchTerm)) ||
      (product.id && product.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate quick stock badge status
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-700 border-red-200' };
    if (stock <= minStock) return { label: 'Low Stock', class: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Healthy', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  // Add New Category (e.g. HRI 3.8L) - Requirement 4
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim().toUpperCase();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setSelectedCategory(trimmed);
      setFormData(prev => ({ ...prev, category: trimmed }));
    }
    setNewCategoryName('');
    setIsCategoryModalOpen(false);
  };

  // Open Edit Product Modal
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      barcode: prod.barcode || '',
      name: prod.name,
      category: prod.category,
      dealerPrice: prod.dealerPrice.toString(),
      srp: prod.srp.toString(),
      stock: prod.stock.toString(),
      minStock: prod.minStock.toString(),
      unit: prod.unit || 'Pcs'
    });
    setIsModalOpen(true);
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      barcode: `4800016${Math.floor(10000 + Math.random() * 90000)}`,
      name: '',
      category: selectedCategory !== 'All' ? selectedCategory : categories[0],
      dealerPrice: '',
      srp: '',
      stock: '50',
      minStock: '15',
      unit: 'Tub'
    });
    setIsModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dealerPrice) {
      alert('Please provide Product Name and Dealer Buy Price');
      return;
    }

    const dealerP = parseFloat(formData.dealerPrice) || 0;
    const srpP = parseFloat(formData.srp) || (dealerP * 1.15);

    if (editingProduct) {
      setProducts(products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            barcode: formData.barcode,
            name: formData.name.toUpperCase(),
            category: formData.category,
            dealerPrice: dealerP,
            unit_price: dealerP,
            srp: srpP,
            stock: parseInt(formData.stock) || 0,
            minStock: parseInt(formData.minStock) || 15,
            unit: formData.unit
          };
        }
        return p;
      }));
    } else {
      const newProd = {
        id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
        barcode: formData.barcode || `4800016${Math.floor(10000 + Math.random() * 90000)}`,
        name: formData.name.toUpperCase(),
        category: formData.category,
        dealerPrice: dealerP,
        unit_price: dealerP,
        srp: srpP,
        stock: parseInt(formData.stock) || 0,
        minStock: parseInt(formData.minStock) || 15,
        unit: formData.unit
      };
      setProducts([newProd, ...products]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products Catalog</h1>
          <p className="text-sm text-slate-500">SELECTA ice cream inventory master list, categories & dealer pricing</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Requirement 4: Button to add category like HRI 3.8L */}
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn-secondary flex items-center justify-center gap-1.5 text-xs"
            title="Add a new category like HRI 3.8L"
          >
            <FolderPlus className="w-4 h-4 text-brand-red" /> + Add Category
          </button>
          <button 
            onClick={openAddModal}
            className="btn-primary flex items-center justify-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search and Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by flavor name, barcode, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9 text-xs"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-72">
            <Tag className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field cursor-pointer text-xs"
            >
              <option value="All">All Categories ({products.length} SKUs)</option>
              {categories.map(cat => (
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
          {categories.map(cat => {
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
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dealer Buy Price</th>
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
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-800">{formatPHP(product.dealerPrice)}</td>
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-light rounded transition-colors" 
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Box className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No products found matching "{searchTerm}" in {selectedCategory}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Category Modal (Requirement 4: add category like HRI 3.8L) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-bold text-slate-800">Add New Category</h2>
              </div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category Name (e.g. HRI 3.8L) <span className="text-brand-red">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. HRI 3.8L" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="input-field text-xs uppercase"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Once created, you can add flavors and products under this category.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-bold text-slate-800">
                  {editingProduct ? 'Edit SELECTA Product' : 'Add New SELECTA Item'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Barcode / EAN <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="input-field text-xs font-mono" 
                    placeholder="48000161XXXX" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    Category <span className="text-brand-red">*</span>
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field cursor-pointer text-xs"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Product / Flavor Name <span className="text-brand-red">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs uppercase" 
                  placeholder="e.g. VANILLA, COOKIES & CREAM, CHOCO FUDGE" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Dealer Buy Price (₱) <span className="text-brand-red">*</span></label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required
                    value={formData.dealerPrice}
                    onChange={(e) => setFormData({ ...formData, dealerPrice: e.target.value })}
                    className="input-field text-xs" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">SRP / Retail Price (₱)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.srp}
                    onChange={(e) => setFormData({ ...formData, srp: e.target.value })}
                    className="input-field text-xs" 
                    placeholder="Auto 15% markup if empty" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Initial Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field text-xs" 
                    placeholder="50" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Min Alert Stock</label>
                  <input 
                    type="number" 
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="input-field text-xs" 
                    placeholder="15" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Unit Type</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-field cursor-pointer text-xs"
                  >
                    <option value="Tub">Tub</option>
                    <option value="Pint">Pint</option>
                    <option value="Pack">Pack</option>
                    <option value="Bundle/Pack">Bundle/Pack</option>
                    <option value="Box/Pack">Box/Pack</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary text-xs"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}