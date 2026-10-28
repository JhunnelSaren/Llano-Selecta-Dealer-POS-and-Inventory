import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Shield, 
  Briefcase, 
  CheckCircle2, 
  Phone, 
  Mail,
  Calendar,
  Image as ImageIcon,
  Upload,
  User,
  BadgeCheck,
  UserPlus
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function Employees() {
  const availableRoles = [
    'Driver',
    'Booker',
    'Cashier',
    'Warehouse Staff',
    'Loader',
    'Checker',
    'Manager'
  ];

  // Initial fallback employees
  const INITIAL_EMPLOYEES = [
    {
      id: 'EMP-001',
      name: 'Juan Dela Cruz',
      role: 'Driver',
      contact: '0917-111-2222',
      email: 'juan.delacruz@gmail.com',
      birthdate: '1992-05-14',
      date_applied: '2026-01-10',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'Active'
    },
    {
      id: 'EMP-002',
      name: 'Pedro Penduko',
      role: 'Booker',
      contact: '0918-333-4444',
      email: 'pedro.penduko@gmail.com',
      birthdate: '1995-08-22',
      date_applied: '2026-02-15',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      status: 'Active'
    },
    {
      id: 'EMP-003',
      name: 'Maria Clara',
      role: 'Cashier',
      contact: '0919-555-6666',
      email: 'maria.clara@gmail.com',
      birthdate: '1998-11-03',
      date_applied: '2026-03-01',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      status: 'Active'
    },
    {
      id: 'EMP-004',
      name: 'Roberto Santos',
      role: 'Warehouse Staff',
      contact: '0920-777-8888',
      email: 'roberto.santos@gmail.com',
      birthdate: '1990-03-19',
      date_applied: '2026-03-20',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      status: 'Active'
    }
  ];

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  // Form State (Assigned Route and Allowed Capabilities REMOVED)
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Driver');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBirthdate, setFormBirthdate] = useState('1995-01-01');
  const [formDateApplied, setFormDateApplied] = useState(new Date().toISOString().split('T')[0]);
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  // Load from backend API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEmployees(data);
            localStorage.setItem('llano_selecta_employees', JSON.stringify(data));
          }
        }
      } catch (err) {
        // Fallback to local state
      }
    };
    fetchEmployees();
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_employees', JSON.stringify(employees));
    } catch (e) {}
  }, [employees]);

  // Handle Photo Upload from file
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingEmp(null);
    setFormName('');
    setFormRole('Driver');
    setFormContact('');
    setFormEmail('');
    setFormBirthdate('1995-01-01');
    setFormDateApplied(new Date().toISOString().split('T')[0]);
    setFormPhotoUrl('');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setFormName(emp.name || '');
    setFormRole(emp.role || emp.primary_role || 'Driver');
    setFormContact(emp.contact || '');
    setFormEmail(emp.email || '');
    setFormBirthdate(emp.birthdate ? emp.birthdate.split('T')[0] : '1995-01-01');
    setFormDateApplied(emp.date_applied ? emp.date_applied.split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormPhotoUrl(emp.photo_url || '');
    setFormStatus(emp.status || 'Active');
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async () => {
    if (!formName.trim()) {
      alert('Please enter employee full name.');
      return;
    }

    const payload = {
      name: formName.trim(),
      role: formRole,
      contact: formContact.trim(),
      email: formEmail.trim() || null,
      birthdate: formBirthdate,
      date_applied: formDateApplied,
      photo_url: formPhotoUrl,
      status: formStatus
    };

    if (editingEmp) {
      // Update existing
      try {
        await fetch(`http://localhost:5000/api/employees/${editingEmp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {}

      setEmployees(prev => prev.map(e => e.id === editingEmp.id ? { ...e, ...payload } : e));
    } else {
      // Create new
      const newId = `EMP-${Date.now().toString().slice(-4)}`;
      const newEmp = { id: newId, ...payload, created_at: new Date().toISOString() };

      try {
        const res = await fetch('http://localhost:5000/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmp)
        });
        if (res.ok) {
          const saved = await res.json();
          setEmployees(prev => [saved, ...prev]);
          setIsModalOpen(false);
          return;
        }
      } catch (err) {}

      setEmployees(prev => [newEmp, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteEmployee = async (empId) => {
    if (!window.confirm('Are you sure you want to remove this employee record?')) return;
    try {
      await fetch(`http://localhost:5000/api/employees/${empId}`, { method: 'DELETE' });
    } catch (err) {}
    setEmployees(prev => prev.filter(e => e.id !== empId));
  };

  const toggleStatus = async (emp) => {
    const nextStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await fetch(`http://localhost:5000/api/employees/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (err) {}
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: nextStatus } : e));
  };

  // Filter Employees
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      (e.name && e.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.id && e.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.contact && e.contact.includes(searchTerm)) ||
      (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'All' || (e.role || e.primary_role) === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employees & Staff Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official dealership team profiles, picture IDs, birthdates & application dates
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2 shadow-md shadow-brand-red/20 py-2.5 px-4"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by employee name, ID, phone, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Briefcase className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field cursor-pointer font-medium text-xs sm:text-sm"
            >
              <option value="All">All Roles ({employees.length})</option>
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid with requested layout: Left Side = Information, Right Side = Picture ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div 
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              {/* Card Split Layout */}
              <div className="flex items-start justify-between gap-4">
                {/* LEFT SIDE: Full Informations */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                      {emp.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-50 text-brand-red border border-red-200">
                      {emp.role || emp.primary_role || 'Staff'}
                    </span>
                    <button
                      onClick={() => toggleStatus(emp)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {emp.status || 'Active'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {emp.name}
                  </h3>

                  {/* Information Details */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold">{emp.contact || 'No phone set'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.email || <span className="text-slate-400 italic">No email (Optional)</span>}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      <span>
                        <span className="text-slate-400">Date Applied:</span>{' '}
                        <span className="font-semibold text-slate-800">
                          {emp.date_applied ? formatDate(emp.date_applied.split('T')[0]) : 'Not specified'}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        <span className="text-slate-400">Birthdate:</span>{' '}
                        <span className="font-semibold text-slate-800">
                          {emp.birthdate ? formatDate(emp.birthdate.split('T')[0]) : 'Not specified'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Picture ID Photo & Actions */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl border-2 border-slate-200 bg-slate-100 overflow-hidden shadow-xs flex items-center justify-center">
                      {emp.photo_url ? (
                        <img 
                          src={emp.photo_url} 
                          alt={`${emp.name} ID`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-slate-400 text-center">
                          <User className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-bold">No Photo</span>
                        </div>
                      )}
                    </div>
                    <span className="block text-center mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Picture ID
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(emp)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(emp.id)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
                  title="Remove employee"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No employees found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or role filter.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Employee Modal - Matched: No Assigned Route, No Allowed Capabilities */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-light text-brand-red rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingEmp ? 'Edit Employee Profile' : 'Add New Employee'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter basic information, birthdate, applied date, and Picture ID
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Picture ID Upload & Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Picture ID / Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-xl border border-slate-300 bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                    {formPhotoUrl ? (
                      <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-300">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-[9px]">Preview</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Choose Photo from Device
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                    <input 
                      type="text" 
                      placeholder="Or paste photo image URL..."
                      value={formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Juan Dela Cruz" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designated Role <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formRole} 
                    onChange={(e) => setFormRole(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    {availableRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0917-123-4567" 
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. employee@gmail.com" 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Date Applied & Birthdate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date Employee Applied
                  </label>
                  <input 
                    type="date" 
                    value={formDateApplied}
                    onChange={(e) => setFormDateApplied(e.target.value)}
                    className="input-field cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Birthdate
                  </label>
                  <input 
                    type="date" 
                    value={formBirthdate}
                    onChange={(e) => setFormBirthdate(e.target.value)}
                    className="input-field cursor-pointer"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employment Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Active" 
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="accent-brand-red"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input 
                      type="radio" 
                      name="status" 
                      value="Inactive" 
                      checked={formStatus === 'Inactive'}
                      onChange={() => setFormStatus('Inactive')}
                      className="accent-brand-red"
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEmployee}
                className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-brand-red/20"
              >
                {editingEmp ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
