import React, { useState } from 'react';
import { 
  UserCog, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  Key,
  ShieldAlert,
  Power
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

export default function UserManagement() {
  const { 
    users, 
    currentUser, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    approveUser, 
    rejectUser,
    formatLastActive 
  } = useAuth();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [formUsername, setFormUsername] = useState('');
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState(ROLES.STAFF);
  const [formPhone, setFormPhone] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setFormUsername('');
    setFormName('');
    setFormPassword('');
    setFormRole(ROLES.STAFF);
    setFormPhone('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormUsername(user.username || '');
    setFormName(user.name || '');
    setFormPassword('');
    setFormRole(user.role || ROLES.STAFF);
    setFormPhone(user.phone || '');
    setIsAddModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formUsername.trim() || !formName.trim()) {
      alert('Please fill in username and full name.');
      return;
    }

    if (editingUser) {
      await updateUser(editingUser.id, {
        username: formUsername.trim(),
        name: formName.trim(),
        role: formRole,
        phone: formPhone.trim(),
        password: formPassword.trim() || undefined
      });
    } else {
      if (!formPassword.trim()) {
        alert('Please enter a password for the new user.');
        return;
      }
      await addUser({
        username: formUsername.trim(),
        name: formName.trim(),
        role: formRole,
        phone: formPhone.trim(),
        password: formPassword.trim()
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = async (user) => {
    if (user.id === 'USR-ADMIN' || user.username === 'admin') {
      alert('Cannot delete primary Admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user @${user.username}?`)) {
      const res = await deleteUser(user.id);
      if (!res.success) alert(res.message);
    }
  };

  // Filter Active / Regular users
  const activeUsers = users.filter(u => u.status !== 'Pending Approval');
  const pendingUsers = users.filter(u => u.status === 'Pending Approval');

  const filteredUsers = activeUsers.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Accounts & Access Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage system logins, active statuses, employee verification approvals, and access permissions
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2 py-2.5 px-4 shadow-md shadow-brand-red/20 font-bold"
        >
          <Plus className="w-4 h-4" /> Create New User
        </button>
      </div>

      {/* Security & Access Notice */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm flex items-start gap-3 border border-slate-800">
        <ShieldCheck className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-white uppercase tracking-wider block">
            System Security Rules (Admin & Staff Roles Only)
          </span>
          <p className="text-slate-300">
            Access is strictly controlled between <strong>Dealer Admin</strong> (full permissions including Settings & Users) and <strong>Dealer Staff</strong> (operational booking, inventory, and customer access). All employee applications submitted through the login portal must be verified and accepted by the Admin before access is allowed.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'active' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Active System Users ({activeUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'pending' 
              ? 'border-brand-red text-brand-red' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> 
          Pending Employee Registrations
          {pendingUsers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-red text-white">
              {pendingUsers.length} Action Needed
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ACTIVE SYSTEM USERS */}
      {activeTab === 'active' && (
        <div className="card space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by username, full name, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex items-center gap-2 sm:w-48">
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field cursor-pointer text-xs sm:text-sm font-semibold"
              >
                <option value="All">All Roles</option>
                <option value={ROLES.ADMIN}>Admin</option>
                <option value={ROLES.STAFF}>Staff</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">User Account</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role Access</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Active Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date Created</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Access Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const isStopped = u.status === 'Inactive' || u.status === 'Access Stopped';
                    const activeText = formatLastActive(u);
                    const isOnline = activeText.includes('Active now') || activeText.includes('just now');

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs uppercase">
                              {u.username?.charAt(0) || u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{u.name}</div>
                              <div className="text-xs text-brand-red font-mono font-semibold">@{u.username}</div>
                              <div className="text-[11px] text-slate-400">{u.phone || u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                            u.role === ROLES.ADMIN
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}>
                            {u.role === ROLES.ADMIN ? 'Admin' : 'Staff'}
                          </span>
                        </td>

                        {/* Active Status like login 1hr ago */}
                        <td className="py-3 px-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className={`font-semibold ${isOnline ? 'text-emerald-700' : 'text-slate-600'}`}>
                              {activeText}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs text-slate-500">
                          {u.created_at ? formatDate(u.created_at.split('T')[0]) : 'Pre-configured'}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isStopped
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isStopped ? 'Access Stopped' : 'Active'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Access Button */}
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors ${
                                isStopped
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                              }`}
                              title={isStopped ? "Restore login access" : "Stop login access"}
                            >
                              <Power className="w-3 h-3" />
                              {isStopped ? 'Allow Access' : 'Stop Access'}
                            </button>

                            <button
                              onClick={() => openEditModal(u)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                              title="Edit user details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {u.id !== 'USR-ADMIN' && u.username !== 'admin' && (
                              <button
                                onClick={() => handleDelete(u)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING EMPLOYEE REGISTRATIONS (Admin must verify and accept) */}
      {activeTab === 'pending' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Employee Applications Requiring Verification
              </h3>
              <p className="text-xs text-slate-500">
                Staff members who registered through the portal must be allowed by Admin before logging in.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingUsers.length > 0 ? (
              pendingUsers.map(app => (
                <div key={app.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{app.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Pending Verification
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Username: <strong className="text-slate-800">@{app.username}</strong> • Email: {app.email} • Phone: {app.phone || 'N/A'}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Applied: {formatDate(app.created_at ? app.created_at.split('T')[0] : '2026-10-25')}
                    </div>
                    {app.notes && (
                      <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200 mt-2">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveUser(app.id)}
                      className="btn-primary py-2 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept & Allow Access
                    </button>
                    <button
                      onClick={() => rejectUser(app.id)}
                      className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No pending registrations</h4>
                <p className="text-xs text-slate-400 mt-1">All employee account requests have been verified.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-brand-red rounded-xl">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingUser ? 'Edit User Credentials & Access' : 'Create New User Account'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign username, password, and system role
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">@</span>
                  <input 
                    type="text" 
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="e.g. staff_juan"
                    className="input-field pl-7 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  System Role (2 Roles Only) <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="input-field cursor-pointer text-xs font-bold"
                >
                  <option value={ROLES.STAFF}>Staff (Bookings, Deliveries & Warehouse Inventory)</option>
                  <option value={ROLES.ADMIN}>Admin (Full System Control & Settings)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingUser ? 'Change Password (Leave blank to keep existing)' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={editingUser ? "Enter new password..." : "Enter secure password..."}
                    className="input-field pl-8 text-xs font-mono"
                    required={!editingUser}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. 0917-123-4567"
                    className="input-field pl-8 text-xs"
                  />
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs font-bold py-2 px-5">
                  {editingUser ? 'Update User' : 'Save User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
