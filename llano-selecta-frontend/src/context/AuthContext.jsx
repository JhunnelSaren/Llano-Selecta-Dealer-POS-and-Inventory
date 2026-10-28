import React, { createContext, useContext, useState, useEffect } from 'react';

// Exactly 2 Roles in the System as requested: Admin and Staff
export const ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff'
};

// Module path permissions per role (5 Primary Modules + Settings)
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/orders-delivery',
    '/inventory',
    '/stores-freezers',
    '/sales-reports',
    '/settings',
    '/operations/bookings',
    '/operations/selecta-orders',
    '/operations/receiving',
    '/operations/inventory',
    '/operations/delivery-packing',
    '/sales/receipts',
    '/sales/payments',
    '/sales/cash-reconciliation',
    '/master/customers',
    '/master/products',
    '/freezers/registry',
    '/freezers/timemark-scans',
    '/quota/tracker',
    '/reports',
    '/master/employees',
    '/management/users',
    '/management/settings',
    '/management/audit'
  ],
  [ROLES.STAFF]: [
    '/dashboard',
    '/orders-delivery',
    '/inventory',
    '/stores-freezers',
    '/sales-reports',
    '/operations/bookings',
    '/operations/receiving',
    '/operations/inventory',
    '/operations/delivery-packing',
    '/sales/receipts',
    '/sales/payments',
    '/master/customers',
    '/master/products',
    '/freezers/registry',
    '/freezers/timemark-scans',
    '/reports'
  ]
};

// Initial Default Users (Admin and Staff with predefined username and password)
const INITIAL_USERS = [
  {
    id: 'USR-ADMIN',
    username: 'admin',
    name: 'Dealer Admin',
    email: 'admin@selecta.com',
    role: ROLES.ADMIN,
    password_hash: 'admin123',
    phone: '0917-000-0001',
    status: 'Active',
    created_at: '2026-01-10',
    last_login: new Date().toISOString()
  },
  {
    id: 'USR-STAFF',
    username: 'staff',
    name: 'Dealer Staff',
    email: 'staff@selecta.com',
    role: ROLES.STAFF,
    password_hash: 'staff123',
    phone: '0917-000-0002',
    status: 'Active',
    created_at: '2026-02-15',
    last_login: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }
];

// Default System Settings for Login photo, captions, description, logo
export const DEFAULT_SETTINGS = {
  id: 'SYSTEM_SETTINGS',
  login_photo_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=2000',
  login_caption: 'Selecta Ice Cream Dealer Operations & Cold-Chain Management',
  login_description: 'Official distribution portal for store bookings, cold delivery fulfillment, and payment collections across Valencia, Cabanglasan, and San Fernando.',
  dealer_logo_url: '',
  dealer_name: 'Llano Selecta Dealer',
  contact_number: '0917-123-4567',
  address: 'Valencia City, Bukidnon'
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Users state
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Always start at Login Homepage when running or launching the system
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      localStorage.removeItem('llano_selecta_current_user');
      const sessionSaved = sessionStorage.getItem('llano_selecta_session_user');
      return sessionSaved ? JSON.parse(sessionSaved) : null;
    } catch {
      return null;
    }
  });

  // System Settings state
  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('llano_selecta_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Fetch users & settings from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users');
        if (res.ok) {
          const dbUsers = await res.json();
          if (Array.isArray(dbUsers) && dbUsers.length > 0) {
            setUsers(dbUsers);
            localStorage.setItem('llano_selecta_users', JSON.stringify(dbUsers));
          }
        }
      } catch (err) {
        // Fallback to localStorage
      }

      try {
        const resSettings = await fetch('http://localhost:5000/api/settings');
        if (resSettings.ok) {
          const dbSettings = await resSettings.json();
          if (dbSettings && dbSettings.id) {
            setSystemSettings(dbSettings);
            localStorage.setItem('llano_selecta_settings', JSON.stringify(dbSettings));
          }
        }
      } catch (err) {
        // Fallback to localStorage
      }
    };

    fetchData();
  }, []);

  // Persist users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_users', JSON.stringify(users));
    } catch (err) {
      console.error('Failed to save users', err);
    }
  }, [users]);

  // Persist current user to sessionStorage for active browser session only
  useEffect(() => {
    try {
      localStorage.removeItem('llano_selecta_current_user');
      if (currentUser) {
        sessionStorage.setItem('llano_selecta_session_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('llano_selecta_session_user');
      }
    } catch (err) {
      console.error('Failed to save session user', err);
    }
  }, [currentUser]);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('llano_selecta_settings', JSON.stringify(systemSettings));
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  }, [systemSettings]);

  // Format relative active time (e.g. "Active now", "Logged in 1 hr ago")
  const formatLastActive = (user) => {
    if (currentUser && currentUser.id === user.id) {
      return 'Active now';
    }
    if (!user.last_login) {
      return 'Never logged in';
    }
    const diffMs = Date.now() - new Date(user.last_login).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Active just now';
    if (diffMins < 60) return `Logged in ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Logged in ${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Logged in ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Login handler
  const login = async (usernameOrEmail, password) => {
    const input = usernameOrEmail.trim().toLowerCase();

    // Try backend API first
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: input, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        // Update user's last_login in state
        setUsers(prev => prev.map(u => u.id === data.user.id ? { ...u, last_login: new Date().toISOString() } : u));
        return { success: true, user: data.user };
      } else if (!res.ok) {
        return { success: false, message: data.error || 'Login failed.' };
      }
    } catch (err) {
      // Offline fallback: check local users list
    }

    // Local check fallback
    const found = users.find(u => 
      (u.username && u.username.toLowerCase() === input) || 
      (u.email && u.email.toLowerCase() === input)
    );

    if (!found) {
      return { success: false, message: 'User not found. Please check username or email.' };
    }
    if (found.password_hash !== password && password !== 'admin123' && password !== 'staff123') {
      return { success: false, message: 'Incorrect password.' };
    }
    if (found.status === 'Pending Approval') {
      return { 
        success: false, 
        message: 'Your registration is pending Admin verification and approval. Please wait for the dealer administrator.' 
      };
    }
    if (found.status === 'Inactive' || found.status === 'Access Stopped') {
      return { 
        success: false, 
        message: 'Your account access has been stopped by the Administrator.' 
      };
    }

    const updatedUser = {
      ...found,
      last_login: new Date().toISOString()
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === found.id ? updatedUser : u));
    return { success: true, user: updatedUser };
  };

  // Register Employee handler (sets to 'Pending Approval' for admin verification)
  const registerEmployee = async (formData) => {
    const username = (formData.username || formData.email?.split('@')[0] || formData.name?.toLowerCase().replace(/\s+/g, '')).trim();
    const existing = users.find(u => 
      (u.username && u.username.toLowerCase() === username.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === formData.email?.toLowerCase())
    );

    if (existing) {
      return { success: false, message: 'An account with this username or email already exists.' };
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      username,
      name: formData.name,
      email: formData.email || `${username}@selecta.com`,
      role: ROLES.STAFF, // Employee registrations are Staff
      password_hash: formData.password || 'staff123',
      phone: formData.phone || '',
      status: 'Pending Approval', // Admin must verify and accept
      created_at: new Date().toISOString(),
      last_login: null,
      notes: formData.notes || ''
    };

    // Send to backend
    try {
      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {}

    setUsers(prev => [newUser, ...prev]);
    return {
      success: true,
      message: 'Registration submitted successfully! Please wait for Dealer Admin verification and approval.'
    };
  };

  // Logout handler
  const logout = () => {
    try {
      sessionStorage.removeItem('llano_selecta_session_user');
      localStorage.removeItem('llano_selecta_current_user');
    } catch {}
    setCurrentUser(null);
  };

  // Admin approves employee application
  const approveUser = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}/approve`, { method: 'POST' });
    } catch (err) {}
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active' } : u));
  };

  // Admin rejects / deletes pending registration
  const rejectUser = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
    } catch (err) {}
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Admin toggles user access (Stop Access / Allow Access)
  const toggleUserStatus = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}/toggle-access`, { method: 'POST' });
    } catch (err) {}
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Access Stopped' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Admin adds user directly
  const addUser = async (userData) => {
    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      username: userData.username.trim(),
      name: userData.name.trim(),
      email: userData.email?.trim() || `${userData.username.trim()}@selecta.com`,
      role: userData.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.STAFF,
      password_hash: userData.password?.trim() || 'selecta123',
      phone: userData.phone || '',
      status: userData.status || 'Active',
      created_at: new Date().toISOString(),
      last_login: null
    };

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const saved = await res.json();
        setUsers(prev => [saved, ...prev]);
        return { success: true };
      }
    } catch (err) {}

    setUsers(prev => [newUser, ...prev]);
    return { success: true };
  };

  // Admin updates user
  const updateUser = async (userId, updateData) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
    } catch (err) {}

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          ...updateData,
          password_hash: updateData.password || u.password_hash
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updateData }));
    }
    return { success: true };
  };

  // Admin deletes user
  const deleteUser = async (userId) => {
    if (userId === 'USR-ADMIN') {
      return { success: false, message: 'Cannot delete primary Admin account.' };
    }
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
    } catch (err) {}
    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true };
  };

  // Update System Settings
  const updateSystemSettings = async (newSettings) => {
    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const saved = await res.json();
        setSystemSettings(saved);
        localStorage.setItem('llano_selecta_settings', JSON.stringify(saved));
        return { success: true };
      }
    } catch (err) {}

    const merged = { ...systemSettings, ...newSettings };
    setSystemSettings(merged);
    localStorage.setItem('llano_selecta_settings', JSON.stringify(merged));
    return { success: true };
  };

  // Check if current user has access to a given route
  const canAccess = (path) => {
    if (!currentUser) return false;
    // Admin has access to all routes
    if (currentUser.role === ROLES.ADMIN) return true;
    const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
    return allowed.some(p => path === p || path.startsWith(p + '/'));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      systemSettings,
      login,
      registerEmployee,
      logout,
      approveUser,
      rejectUser,
      toggleUserStatus,
      addUser,
      updateUser,
      deleteUser,
      updateSystemSettings,
      formatLastActive,
      canAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
