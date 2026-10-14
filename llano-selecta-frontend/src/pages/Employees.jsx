import React, { useState } from 'react';
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
  MapPin, 
  Phone, 
  UserPlus,
  BadgeCheck,
  Tag
} from 'lucide-react';

export default function Employees() {
  // Available Dynamic Roles in the System (Rule 12)
  const availableRoles = [
    'Booker',
    'Driver',
    'Backride',
    'Loader',
    'Checker',
    'Warehouse Staff',
    'Cashier',
    'Manager',
    'Owner / Admin'
  ];

  // Mock Employees List with Dynamic Capabilities
  const [employees, setEmployees] = useState([
    {
      id: 'EMP-001',
      name: 'Juan Dela Cruz',
      contact: '0917-111-2222',
      primaryRole: 'Driver',
      secondaryRoles: ['Booker', 'Loader'],
      status: 'Active',
      assignedArea: 'Valencia -> San Fernando Route'
    },
    {
      id: 'EMP-002',
      name: 'Pedro Penduko',
      contact: '0918-333-4444',
      primaryRole: 'Booker',
      secondaryRoles: ['Loader', 'Checker'],
      status: 'Active',
      assignedArea: 'Cabanglasan Area'
    },
    {
      id: 'EMP-003',
      name: 'Maria Clara',
      contact: '0919-555-6666',
      primaryRole: 'Cashier',
      secondaryRoles: ['Manager'],
      status: 'Active',
      assignedArea: 'Valencia Hub'
    },
    {
      id: 'EMP-004',
      name: 'Pedro Warehouse',
      contact: '0920-777-8888',
      primaryRole: 'Warehouse Staff',
      secondaryRoles: ['Checker', 'Loader'],
      status: 'Active',
      assignedArea: 'Bodega Central'
    },
    {
      id: 'EMP-005',
      name: 'Roberto Santos',
      contact: '0921-999-0000',
      primaryRole: 'Backride',
      secondaryRoles: ['Loader', 'Driver'],
      status: 'Inactive',
      assignedArea: 'Unassigned'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formPrimaryRole, setFormPrimaryRole] = useState('Driver');
  const [formSecondaryRoles, setFormSecondaryRoles] = useState(['Loader']);
  const [formArea, setFormArea] = useState('Valencia Hub');

  const openAddModal = () => {
    setEditingEmp(null);
    setFormName('');
    setFormContact('');
    setFormPrimaryRole('Driver');
    setFormSecondaryRoles(['Loader']);
    setFormArea('Valencia Hub');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setFormName(emp.name);
    setFormContact(emp.contact);
    setFormPrimaryRole(emp.primaryRole);
    setFormSecondaryRoles(emp.secondaryRoles);
    setFormArea(emp.assignedArea);
    setIsModalOpen(true);
  };

  const toggleSecondaryRole = (role) => {
    if (role === formPrimaryRole) return; // Primary role shouldn't be secondary
    if (formSecondaryRoles.includes(role)) {
      setFormSecondaryRoles(formSecondaryRoles.filter(r => r !== role));
    } else {
      setFormSecondaryRoles([...formSecondaryRoles, role]);
    }
  };

  const handleSaveEmployee = () => {
    if (!formName.trim()) {
      alert('Please enter employee full name.');
      return;
    }

    if (editingEmp) {
      setEmployees(employees.map(e => e.id === editingEmp.id ? {
        ...e,
        name: formName,
        contact: formContact,
        primaryRole: formPrimaryRole,
        secondaryRoles: formSecondaryRoles,
        assignedArea: formArea
      } : e));
    } else {
      const newEmp = {
        id: `EMP-00${employees.length + 1}`,
        name: formName,
        contact: formContact,
        primaryRole: formPrimaryRole,
        secondaryRoles: formSecondaryRoles,
        status: 'Active',
        assignedArea: formArea
      };
      setEmployees([newEmp, ...employees]);
    }

    setIsModalOpen(false);
  };

  // Filter Employees
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.contact.includes(searchTerm);
    const matchesRole = roleFilter === 'All' || 
                        e.primaryRole === roleFilter || 
                        e.secondaryRoles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees & Dynamic Roles</h1>
          <p className="text-sm text-slate-500">Flexible staff assignments, contact info & secondary capabilities</p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Info Banner on Business Rule 12 */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex items-start gap-3">
        <BadgeCheck className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white uppercase tracking-wider block">Rule 12 — Flexible Staff Assignments</span>
          <p className="text-slate-300">
            Employees are not permanently locked to one position. Staff assigned as Drivers can also fulfill Booker or Loader duties for specific dispatch routes based on daily availability.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by employee name, ID, or contact number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-64">
            <Briefcase className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Roles & Capabilities</option>
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee ID</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name & Contact</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Primary Role</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Allowed Capabilities</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned Route</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-bold text-slate-800">{emp.id}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-slate-900">{emp.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {emp.contact}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-light text-brand-red border border-brand-red/20">
                        {emp.primaryRole}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.secondaryRoles.map((role, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            + {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-brand-red" /> {emp.assignedArea}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-light rounded transition-colors" 
                        title="Edit Roles"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No employees found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">
                  {editingEmp ? 'Edit Employee & Capabilities' : 'Add New Staff Record'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz" 
                  className="input-field" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Number</label>
                  <input 
                    type="text" 
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="09XX-XXX-XXXX" 
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Role <span className="text-brand-red">*</span></label>
                  <select 
                    value={formPrimaryRole}
                    onChange={(e) => {
                      setFormPrimaryRole(e.target.value);
                      setFormSecondaryRoles(formSecondaryRoles.filter(r => r !== e.target.value));
                    }}
                    className="input-field cursor-pointer"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Secondary Allowed Roles Selector */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Allowed Secondary Roles</span>
                <p className="text-[11px] text-slate-500">Select additional tasks this staff member can perform during operations:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableRoles.filter(r => r !== formPrimaryRole).map(role => {
                    const isSelected = formSecondaryRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleSecondaryRole(role)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                          isSelected 
                            ? 'bg-brand-red text-white shadow-sm' 
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Default Route Assignment</label>
                <select 
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option>Valencia → San Fernando Route</option>
                  <option>Cabanglasan Area</option>
                  <option>Batangan Route</option>
                  <option>Valencia Hub</option>
                  <option>Bodega Central</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleSaveEmployee} className="btn-primary text-xs">Save Employee Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}