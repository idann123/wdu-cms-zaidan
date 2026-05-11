import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function AdminLayout() {
  const { isAuthenticated, user, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wdu_dark_mode');
      if (stored) {
        return JSON.parse(stored);
      }
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const notifRef = useRef<HTMLDivElement>(null);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    
    const applyTheme = () => {
      if (newMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('wdu_dark_mode', JSON.stringify(newMode));
    };

    if (!document.startViewTransition) {
      setDarkMode(newMode);
      applyTheme();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setDarkMode(newMode);
      });
      applyTheme();
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/contact/stats');
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    };

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUser();
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    logout();
    navigate('/admin/login');
  };

  const navItemBase =
    'px-4 py-2.5 flex items-center gap-3 font-semibold tracking-tight transition-all rounded-xl text-slate-600 hover:bg-slate-100/50 hover:text-slate-900';
  const navItemActive =
    'bg-mint text-mint-strong rounded-xl px-4 py-2.5 transition-all flex items-center gap-3 font-bold tracking-tight shadow-sm border border-mint-strong/10';

  return (
    <div className="text-on-surface bg-background min-h-screen relative overflow-hidden">
      {/* Premium Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-secondary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[20%] w-[25%] h-[25%] bg-primary/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <span className="material-symbols-outlined text-primary text-3xl">logout</span>
            </div>
            <h3 className="text-xl font-black font-headline text-on-surface text-center mb-2">Sign out?</h3>
            <p className="text-sm text-on-surface-variant font-body text-center mb-6">
              You will be signed out and will need to login again to access the dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl bg-error text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {loggingOut ? 'Signing out...' : 'Yes, Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-8 px-5 glass-sidebar z-50 transition-all duration-300">
        <div className="mb-10 px-4">
          <h1 className="text-xl font-black text-on-surface dark:text-white font-headline tracking-tight">WDU Admin</h1>
          <p className="text-xs font-headline text-on-surface-variant font-semibold">Wahana Data Utama</p>
        </div>
        <nav className="flex-grow space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/hero"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">view_carousel</span>
            Pages
          </NavLink>
          <NavLink
            to="/admin/services"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Services
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">folder_open</span>
            Projects
          </NavLink>
          <NavLink
            to="/admin/partner-client"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">groups</span>
            Partner/Client
          </NavLink>
          <NavLink
            to="/admin/media"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">perm_media</span>
            Media
          </NavLink>
          <NavLink
            to="/admin/messages"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">mail</span>
                Messages
              </div>
              {unreadCount > 0 && (
                <span className="bg-error/10 text-error text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </NavLink>
          <NavLink
            to="/admin/activity"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">history</span>
            Activity
          </NavLink>
          {user?.role === 'SUPER_ADMIN' && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">people</span>
            Users
          </NavLink>
          )}
          <NavLink
            to="/admin/config"
            className={({ isActive }) => (isActive ? navItemActive : navItemBase)}
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </NavLink>
        </nav>

        {/* User & Logout */}
        <div className="mt-auto px-2 space-y-3">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all font-bold text-sm border border-rose-200/50"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* TopAppBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/70 backdrop-blur-xl h-20 flex justify-between items-center px-10 border-b border-slate-100 transition-colors duration-200">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="w-full bg-slate-50 border border-slate-200 focus:border-mint-strong focus:ring-4 focus:ring-mint/30 text-sm py-2.5 pl-10 pr-4 transition-all rounded-2xl"
              placeholder="Search data, projects, or settings..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-lg transition-all relative flex items-center justify-center ${isNotifOpen ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-[#ebefe3] dark:hover:bg-slate-800'}`}
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-error text-white dark:text-[#121313] !text-[#ffffff] dark:!text-[#121313] text-[9px] font-black rounded-full flex items-center justify-center border-2 border-surface-container-lowest z-10 shadow-[0_0_0_2px_var(--background)]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                  <div className="p-4 bg-primary/5 border-b border-outline-variant flex justify-between items-center">
                    <h4 className="font-headline font-black text-on-surface text-sm">Notifications</h4>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {unreadCount > 0 ? (
                      <div
                        onClick={() => { setIsNotifOpen(false); navigate('/admin/messages'); }}
                        className="p-4 hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
                          <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">New Message</p>
                          <p className="text-xs text-on-surface-variant">You have {unreadCount} unread messages.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_off</span>
                        <p className="text-sm font-medium">No new notifications.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-surface-container-low border-t border-outline-variant text-center">
                    <button
                      onClick={() => { setIsNotifOpen(false); navigate('/admin/messages'); }}
                      className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                    >
                      View All Messages
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 w-[1px] bg-outline-variant/30"></div>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-on-surface-variant hover:bg-[#ebefe3] dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-[#ebefe3] dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-outline-variant/30"></div>
          <div className="flex items-center gap-3 bg-mint/30 px-4 py-2 rounded-2xl border border-mint-strong/10">
            <span className="text-xs font-bold text-mint-strong uppercase tracking-wider">Admin Panel</span>
            <div className="w-8 h-8 rounded-xl bg-mint-strong flex items-center justify-center shadow-lg shadow-mint-strong/20">
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="ml-64 pt-20 flex">
        {/* Sub-Sidebar for Projects */}
        {location.pathname.includes('/projects') && (
          <div className="w-56 min-h-[calc(100vh-5rem)] border-r border-outline-variant/20 py-6 px-3">
            <h4 className="text-[10px] font-black text-primary tracking-widest uppercase mb-4 px-3">Projects</h4>
            <nav className="space-y-1">
              <NavLink
                to="/admin/projects"
                end
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">folder_open</span>
                Portfolio
              </NavLink>
              <NavLink
                to="/admin/projects/timeline"
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">timeline</span>
                Timeline
              </NavLink>
            </nav>
          </div>
        )}

        {/* Sub-Sidebar for Config */}
        {location.pathname.includes('/config') && (
          <div className="w-56 min-h-[calc(100vh-5rem)] border-r border-outline-variant/20 py-6 px-3">
            <h4 className="text-[10px] font-black text-primary tracking-widest uppercase mb-4 px-3">Site Settings</h4>
            <nav className="space-y-1">
              <NavLink
                to="/admin/config/site"
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-[#6ab149] text-white' 
                    : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">language</span>
                Site Configuration
              </NavLink>
              <NavLink
                to="/admin/config/profile"
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-[#6ab149] text-white' 
                    : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Admin Profile
              </NavLink>
              <NavLink
                to="/admin/config/security"
                className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-[#6ab149] text-white' 
                    : 'text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">security</span>
                Security
              </NavLink>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 px-8 pb-12">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
}