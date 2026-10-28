const fs = require('fs');
const path = require('path');

// 1. Patch Customers.jsx
const custPath = path.join(__dirname, 'llano-selecta-frontend', 'src', 'pages', 'Customers.jsx');
let custContent = fs.readFileSync(custPath, 'utf8');

if (!custContent.includes('ExcelImportModal')) {
  // Add import
  custContent = custContent.replace(
    "import { formatDate } from '../utils/helpers';",
    "import { formatDate } from '../utils/helpers';\r\nimport { FileSpreadsheet } from 'lucide-react';\r\nimport ExcelImportModal from '../components/ExcelImportModal';"
  );

  // Add state
  custContent = custContent.replace(
    "const [statusFilter, setStatusFilter] = useState('ALL');",
    "const [statusFilter, setStatusFilter] = useState('ALL');\r\n  const [isImportModalOpen, setIsImportModalOpen] = useState(false);"
  );

  // Add button next to Register New Store
  custContent = custContent.replace(
    `<button \r\n          onClick={() => {\r\n            setFormData({`,
    `<div className="flex items-center gap-2">\r\n          <button\r\n            type="button"\r\n            onClick={() => setIsImportModalOpen(true)}\r\n            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs"\r\n          >\r\n            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import Excel / CSV\r\n          </button>\r\n          <button \r\n          onClick={() => {\r\n            setFormData({`
  );

  custContent = custContent.replace(
    `<Plus className="w-4 h-4" /> Register New Store\r\n        </button>`,
    `<Plus className="w-4 h-4" /> Register New Store\r\n        </button>\r\n        </div>`
  );

  // Add modal before end
  const lastDivIndex = custContent.lastIndexOf('</div>');
  custContent = custContent.slice(0, lastDivIndex) + 
    `  <ExcelImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={() => window.location.reload()} type="customers" />\r\n    </div>` +
    custContent.slice(lastDivIndex + 6);

  fs.writeFileSync(custPath, custContent, 'utf8');
  console.log('✓ Customers.jsx patched with Excel Import Modal');
}

// 2. Patch Products.jsx
const prodPath = path.join(__dirname, 'llano-selecta-frontend', 'src', 'pages', 'Products.jsx');
let prodContent = fs.readFileSync(prodPath, 'utf8');

if (!prodContent.includes('ExcelImportModal')) {
  prodContent = prodContent.replace(
    "import { formatPHP } from '../utils/helpers';",
    "import { formatPHP } from '../utils/helpers';\r\nimport { FileSpreadsheet } from 'lucide-react';\r\nimport ExcelImportModal from '../components/ExcelImportModal';"
  );

  prodContent = prodContent.replace(
    "const [editingProduct, setEditingProduct] = useState(null);",
    "const [editingProduct, setEditingProduct] = useState(null);\r\n  const [isImportModalOpen, setIsImportModalOpen] = useState(false);"
  );

  prodContent = prodContent.replace(
    `<button \r\n          onClick={() => setIsModalOpen(true)}`,
    `<button\r\n            type="button"\r\n            onClick={() => setIsImportModalOpen(true)}\r\n            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs"\r\n          >\r\n            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import Excel / CSV\r\n          </button>\r\n          <button \r\n          onClick={() => setIsModalOpen(true)}`
  );

  const lastDivIndex = prodContent.lastIndexOf('</div>');
  prodContent = prodContent.slice(0, lastDivIndex) + 
    `  <ExcelImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={() => window.location.reload()} type="products" />\r\n    </div>` +
    prodContent.slice(lastDivIndex + 6);

  fs.writeFileSync(prodPath, prodContent, 'utf8');
  console.log('✓ Products.jsx patched with Excel Import Modal');
}
