import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'EDITOR', label: 'Editor' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.2 }
  }
};

export default function AdminUsers() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'EDITOR',
  });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      showToast('error', 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (!form.email || !form.name || !form.password) {
      showToast('error', 'All fields are required.');
      return;
    }
    setIsSaving(true);
    try {
      const { data } = await api.post('/users', form);
      setUsers((prev) => [data, ...prev]);
      showToast('success', 'User successfully added!');
      setShowAddModal(false);
      setForm({ email: '', name: '', password: '', role: 'EDITOR' });
      logActivity({
        action: 'Create',
        actor: currentUser?.name || currentUser?.email || 'Super Admin',
        target: `User: ${form.name} (${form.email})`,
        section: 'User Management',
        page: 'Admin Panel',
        type: 'admin',
        detail: `Role: ${form.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}`,
      });
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to add user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      const { data } = await api.put(`/users/${selectedUser.id}`, {
        email: form.email,
        name: form.name,
        role: form.role,
      });
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? data : u)));
      showToast('success', 'User successfully updated!');
      setShowEditModal(false);
      setSelectedUser(null);
      logActivity({
        action: 'Update',
        actor: currentUser?.name || currentUser?.email || 'Super Admin',
        target: `User: ${form.name} (${form.email})`,
        section: 'User Management',
        page: 'Admin Panel',
        type: 'admin',
        detail: `Role: ${form.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}`,
      });
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to update user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !form.password) {
      showToast('error', 'Password is required.');
      return;
    }
    if (form.password.length < 6) {
      showToast('error', 'Password must be at least 6 characters.');
      return;
    }
    setIsSaving(true);
    try {
      await api.patch(`/users/${selectedUser.id}/password`, {
        password: form.password,
      });
      showToast('success', 'Password successfully reset!');
      setShowPasswordModal(false);
      logActivity({
        action: 'Update',
        actor: currentUser?.name || currentUser?.email || 'Super Admin',
        target: `Password: ${selectedUser.name} (${selectedUser.email})`,
        section: 'User Management',
        page: 'Admin Panel',
        type: 'config',
        detail: 'Reset password akun admin',
      });
      setSelectedUser(null);
      setForm({ ...form, password: '' });
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const target = users.find(u => u.id === id);
    setIsSaving(true);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('success', 'User successfully deleted.');
      setShowDeleteConfirm(null);
      logActivity({
        action: 'Delete',
        actor: currentUser?.name || currentUser?.email || 'Super Admin',
        target: `User: ${target?.name || id} (${target?.email || ''})`,
        section: 'User Management',
        page: 'Admin Panel',
        type: 'admin',
        detail: `Role: ${target?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}`,
      });
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to delete user.');
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setForm({ email: user.email, name: user.name, password: '', role: user.role });
    setShowEditModal(true);
  };

  const openPassword = (user: User) => {
    setSelectedUser(user);
    setForm({ ...form, password: '' });
    setShowPasswordModal(true);
  };

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-surface-container-lowest p-12 rounded-[3rem] border border-outline-variant/10 shadow-xl"
        >
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">lock</span>
          </div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Access Restricted</h2>
           <p className="text-on-surface-variant mt-3 font-medium max-w-xs">User management page can only be accessed by Super Admin level accounts.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-xl font-black font-headline text-on-surface mb-2">Delete User?</h3>
              <p className="text-sm text-on-surface-variant font-medium mb-8 leading-relaxed">
                This action cannot be undone. User will be permanently deleted from the system.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl border border-outline-variant text-on-surface font-black text-xs uppercase tracking-widest hover:bg-surface-container transition-all"
                >
                  Cancel
                 </button>
                 <button
                   onClick={() => handleDelete(showDeleteConfirm)}
                   disabled={isSaving}
                   className="flex-1 py-3 rounded-2xl bg-error text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-error/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                 >
                   {isSaving ? '...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">
                    {showEditModal ? 'Edit User Profile' : 'Register New User'}
                </h3>
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-8 py-6 space-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                    placeholder="Full Name..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                    placeholder="user@wdu.co.id"
                  />
                </div>
                {!showEditModal && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Initial Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                      placeholder="Min. 6 karakter"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Access Level (Role)</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-all">
                  Cancel
                 </button>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={showEditModal ? handleEdit : handleAdd} 
                   disabled={isSaving} 
                   className="px-8 py-3 text-xs font-black uppercase tracking-[0.2em] bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                 >
                   {isSaving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                   {showEditModal ? 'Save Changes' : 'Register User'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-8 py-6 space-y-6">
                <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-inner">
                  <p className="text-sm font-black text-on-surface">{selectedUser?.name}</p>
                  <p className="text-xs font-bold text-on-surface-variant mt-1">{selectedUser?.email}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 pr-12 text-sm font-bold shadow-inner transition-all w-full"
                      placeholder="Min. 6 characters"
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                     >
                       <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                     </button>
                   </div>
                   <p className="text-[10px] font-bold text-on-surface-variant mt-1 ml-1 uppercase tracking-widest opacity-60">Password must consist of at least 6 characters</p>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button onClick={() => setShowPasswordModal(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-all">
                 Cancel
                 </button>
                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleResetPassword}
                  disabled={isSaving} 
                  className="px-8 py-3 text-xs font-black uppercase tracking-[0.2em] bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isSaving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  Update Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">Administration</span>
          <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">User Management</h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium max-w-lg">
              Admin access control center. Manage access rights, new user registration, and account security in one dashboard.
            </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setForm({ email: '', name: '', password: '', role: 'EDITOR' }); setShowAddModal(true); }}
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
           Add User
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overflow-hidden rounded-[2.5rem] border border-outline-variant/10 bg-white/70 dark:bg-[#121312] backdrop-blur-2xl shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-white dark:from-[#1a1c1a] dark:to-[#121312]">
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">No</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">User Info</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Email</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Access Level</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-outline-variant/10"
            >
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-8 py-10">
                      <div className="h-8 bg-surface-container animate-pulse rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/20">
                      <span className="material-symbols-outlined text-5xl">person_off</span>
                    </div>
                     <h4 className="text-xl font-black text-on-surface tracking-tight">User Database Empty</h4>
                     <p className="text-on-surface-variant mt-2 font-medium">No registered users other than you.</p>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6 text-sm font-bold text-on-surface-variant/40">{idx + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface-variant">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-secondary/10 text-secondary border border-secondary/20'
                      }`}>
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(user)}
                          className="p-2.5 bg-surface-container-high rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Edit User"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openPassword(user)}
                          className="p-2.5 bg-surface-container-high rounded-xl text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
                          title="Reset Password"
                        >
                          <span className="material-symbols-outlined text-lg">lock_reset</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-2.5 bg-error/10 rounded-xl text-error hover:bg-error hover:text-white transition-all shadow-sm"
                           title="Delete User"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}