import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { logActivity } from '../utils/activityLogger';

interface ProfileData {
  fullName: string;
  jobTitle: string;
  email: string;
  skills: string[];
}

interface ProfileAccess {
  attempts: number;
  lockedUntil: number | null;
}

const STORAGE_KEYS = {
  SUPER_ADMIN: 'wdu_admin_profile',
  EDITOR: 'wdu_editor_profile',
};

const defaultProfile: ProfileData = {
  fullName: 'Super Admin',
  jobTitle: 'Web Administrator',
  email: '',
  skills: ['Management', 'System Admin', 'Security'],
};

const defaultEditorProfile: ProfileData = {
  fullName: 'Editor Admin',
  jobTitle: 'Editor',
  email: '',
  skills: ['Content Editing', 'CMS', 'Publishing'],
};

const STORAGE_LOCKOUT = 'wdu_profile_lockout';

interface LockoutData {
  [email: string]: ProfileAccess;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

export default function AdminProfile() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<{ id: string; email: string; name: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<'SUPER_ADMIN' | 'EDITOR' | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedProfile, setVerifiedProfile] = useState<'SUPER_ADMIN' | 'EDITOR' | null>(null);
  const [lockoutData, setLockoutData] = useState<LockoutData>({});
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState<ProfileData>(defaultProfile);

  const showToastMsg = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const getEditorEmail = () => {
    const editor = users.find(u => u.role === 'EDITOR');
    return editor?.email || '';
  };

  const getTargetEmail = () => {
    if (selectedProfile === 'EDITOR') {
      return getEditorEmail();
    }
    return currentUser?.email || '';
  };

  const getTargetName = () => {
    if (selectedProfile === 'EDITOR') {
      const editor = users.find(u => u.role === 'EDITOR');
      return editor?.name || 'Editor Admin';
    }
    return currentUser?.name || 'Super Admin';
  };

  const getLockoutKey = () => getTargetEmail();

  const isLocked = () => {
    const key = getLockoutKey();
    const lock = lockoutData[key];
    if (!lock || !lock.lockedUntil) return false;
    return Date.now() < lock.lockedUntil;
  };

  const loadLockoutFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_LOCKOUT);
    if (stored) {
      try {
        setLockoutData(JSON.parse(stored));
      } catch {
        setLockoutData({});
      }
    }
  };

  const saveLockoutToStorage = (data: LockoutData) => {
    localStorage.setItem(STORAGE_LOCKOUT, JSON.stringify(data));
    setLockoutData(data);
  };

  const handleLockout = (email: string) => {
    const lockUntil = Date.now() + 60000;
    const newLockout = {
      ...lockoutData,
      [email]: { attempts: 0, lockedUntil: lockUntil },
    };
    saveLockoutToStorage(newLockout);
    startCountdown();
  };

  const incrementAttempts = (email: string) => {
    const current = lockoutData[email] || { attempts: 0, lockedUntil: null };
    const newAttempts = current.attempts + 1;
    const newLockout = {
      ...lockoutData,
      [email]: { attempts: newAttempts, lockedUntil: current.lockedUntil },
    };
    saveLockoutToStorage(newLockout);
    return newAttempts;
  };

  const resetAttempts = (email: string) => {
    const newLockout = {
      ...lockoutData,
      [email]: { attempts: 0, lockedUntil: null },
    };
    saveLockoutToStorage(newLockout);
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    loadLockoutFromStorage();
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'SUPER_ADMIN') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);

        const stored = localStorage.getItem(STORAGE_KEYS.EDITOR);
        if (!stored) {
          const editor = data.find((u: { role: string }) => u.role === 'EDITOR');
          localStorage.setItem(STORAGE_KEYS.EDITOR, JSON.stringify({ ...defaultEditorProfile, email: editor?.email || '' }));
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSelectProfile = (profile: 'SUPER_ADMIN' | 'EDITOR') => {
    setSelectedProfile(profile);
    setShowPasswordModal(true);
    setPasswordInput('');
  };

  const handleVerifyPassword = async () => {
    const email = getTargetEmail();
    
    if (!email) {
       showToastMsg('error', 'Email not found');
      return;
    }

    if (isLocked()) {
       showToastMsg('error', 'Too many attempts. Please try again later.');
      return;
    }

    try {
      const { data } = await api.post('/users/verify-password', {
        email,
        password: passwordInput,
      });

      if (data.valid) {
        resetAttempts(email);
        setIsVerified(true);
        setVerifiedProfile(selectedProfile);
        setShowPasswordModal(false);
        
        const storageKey = selectedProfile === 'SUPER_ADMIN' ? STORAGE_KEYS.SUPER_ADMIN : STORAGE_KEYS.EDITOR;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setFormData(JSON.parse(stored));
        } else {
          const defaultData = selectedProfile === 'SUPER_ADMIN' ? defaultProfile : defaultEditorProfile;
          const editor = users.find(u => u.role === 'EDITOR');
          setFormData({ ...defaultData, email: selectedProfile === 'EDITOR' ? (editor?.email || '') : (currentUser?.email || '') });
        }
      } else {
        const attempts = incrementAttempts(email);
        if (attempts >= 5) {
          handleLockout(email);
          showToastMsg('error', 'Too many attempts. Lockout for 1 minute.');
        } else {
          showToastMsg('error', `Wrong password. Attempt ${attempts}/5`);
        }
      }
    } catch (err) {
       showToastMsg('error', 'Verification failed. Please try again.');
    }
  };

  const handleSave = () => {
    const storageKey = verifiedProfile === 'SUPER_ADMIN' ? STORAGE_KEYS.SUPER_ADMIN : STORAGE_KEYS.EDITOR;
    localStorage.setItem(storageKey, JSON.stringify(formData));
       showToastMsg('success', 'Changes saved successfully!');
    logActivity({
      action: 'Saving',
      actor: currentUser?.name || currentUser?.email || 'Admin',
      target: `Profile ${verifiedProfile === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor Admin'}`,
      section: 'Admin Profile',
      page: 'Admin Panel',
      type: 'config',
      detail: `Name: ${formData.fullName} | Position: ${formData.jobTitle}`,
    });
  };

  const handleBack = () => {
    setIsVerified(false);
    setVerifiedProfile(null);
    setSelectedProfile(null);
    setFormData(defaultProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest rounded-[3rem] p-16 text-center border border-outline-variant/10 shadow-xl"
        >
          <div className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-5xl">lock_open</span>
          </div>
       <h2 className="text-3xl font-black text-on-surface tracking-tight mb-4">Access Restricted</h2>
       <p className="text-on-surface-variant font-medium max-w-md mx-auto">Global admin profile management page is only available for Super Admin level accounts.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'}`}
          >
            <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isVerified && verifiedProfile ? (
          <motion.div 
            key="profile-edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <motion.button 
                  whileHover={{ x: -4 }}
                  onClick={handleBack} 
                  className="flex items-center gap-2 text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-4 hover:opacity-80 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Main Panel
                </motion.button>
                 <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">
                   Profile: {verifiedProfile === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
                 </h1>
                 <p className="text-on-surface-variant text-sm mt-2 font-medium">
                   This information will be displayed on contributor profiles and system activity logs.
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                      <span className="text-4xl font-black text-primary">
                        {(formData.fullName || 'E').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-sm">verified_user</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-on-surface tracking-tight">{formData.fullName}</h2>
                  <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mt-1">{formData.jobTitle}</p>
                  <div className="mt-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${verifiedProfile === 'SUPER_ADMIN' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
                      {verifiedProfile === 'SUPER_ADMIN' ? 'Super Admin Access' : 'Editor Access'}
                    </span>
                  </div>

                  <div className="mt-10 pt-10 border-t border-outline-variant/10 text-left">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-6">Key Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <motion.span 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                        >
                          {skill}
                        </motion.span>
                      ))}
                       {formData.skills.length === 0 && (
                         <p className="text-on-surface-variant text-xs italic font-medium">No skills defined yet.</p>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl">
                  <h3 className="text-xl font-black text-primary tracking-tight mb-8">Identity Metadata</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-5 py-4 text-sm font-bold shadow-inner transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Functional Title</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-5 py-4 text-sm font-bold shadow-inner transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled={verifiedProfile === 'SUPER_ADMIN'}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-5 py-4 text-sm font-bold shadow-inner transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-xl">
                  <h3 className="text-xl font-black text-primary tracking-tight mb-8">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-3 mb-8">
                    <AnimatePresence>
                      {formData.skills.map((skill, index) => (
                        <motion.span 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-primary/5 text-primary border border-primary/10 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm"
                        >
                          {skill}
                          <button onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })} className="w-5 h-5 rounded-full hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const newSkill = prompt('Masukkan skill baru:');
                      if (newSkill && newSkill.trim()) {
                        setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-outline-variant rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary hover:border-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add New Competency
                  </motion.button>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-xl">verified</span>
                    SIMPAN PERUBAHAN PROFIL
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="profile-selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="text-center md:text-left">
              <span className="text-primary font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Identity Access</span>
              <h1 className="text-5xl font-black font-headline text-on-surface tracking-tight">Administration Profile</h1>
               <p className="text-on-surface-variant text-base mt-4 font-medium max-w-2xl">
                 Select and manage public identity for each admin access level. Security verification required for sensitive data changes.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.button
                variants={itemVariants}
                onClick={() => handleSelectProfile('SUPER_ADMIN')}
                whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)" }}
                className="bg-surface-container-lowest rounded-[3rem] p-12 border-2 border-transparent hover:border-primary transition-all text-left group relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl">admin_panel_settings</span>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors tracking-tight">Super Admin</h3>
                    <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">{currentUser?.email}</p>
                  </div>
                </div>
                 <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                   Manage the highest authority profile in the system. This data will be tied to security logs and critical system activities.
                 </p>
                <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-widest uppercase">
                   Manage Identity <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </motion.button>

              <motion.button
                variants={itemVariants}
                onClick={() => handleSelectProfile('EDITOR')}
                whileHover={{ y: -8, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.15)" }}
                className="bg-surface-container-lowest rounded-[3rem] p-12 border-2 border-transparent hover:border-secondary transition-all text-left group relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-8xl">edit_document</span>
                </div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-secondary/10 text-secondary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">edit_document</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-on-surface group-hover:text-secondary transition-colors tracking-tight">Editor Admin</h3>
                    <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1">{getEditorEmail() || 'Unassigned Role'}</p>
                  </div>
                </div>
                 <p className="text-on-surface-variant font-medium leading-relaxed mb-8">
                   Configure content contributor identity. Useful for author attribution and public media asset management.
                 </p>
                <div className="flex items-center gap-2 text-secondary font-black text-[10px] tracking-widest uppercase">
                   Manage Identity <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && selectedProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-10 py-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Verifikasi Akses</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-10 py-8 space-y-6">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
                 <p className="text-sm font-medium text-on-surface leading-relaxed">
                   Enter the password for account <span className="font-black text-primary">{getTargetName()}</span> to continue {selectedProfile === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'} profile configuration.
                 </p>
                </div>

                {isLocked() ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error/10 border border-error/20 rounded-2xl p-8 text-center"
                  >
                    <div className="w-12 h-12 bg-error text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="material-symbols-outlined">lock_clock</span>
                    </div>
                   <p className="text-error font-black uppercase tracking-widest text-xs">Security Locked</p>
                   <p className="text-error text-sm font-bold mt-2">Try again in {countdown} seconds</p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Password Credentials</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
                        className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-6 py-4 pr-14 text-sm font-bold shadow-inner transition-all"
                        placeholder="••••••••••••"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-2"
                      >
                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-10 py-8 border-t border-outline-variant/10 flex justify-end gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVerifyPassword}
                  disabled={isLocked() || !passwordInput}
                  className="px-8 py-3 text-xs font-black uppercase tracking-[0.2em] bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">verified</span>
                   Verify
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}