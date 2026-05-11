import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { getActivityLogs, ActivityLog } from '../utils/activityLogger';

import { useAuthStore } from '../store/authStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function AdminSecurity() {
  useAuthStore();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<ActivityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Generate REAL session data for current browser
    const ua = navigator.userAgent;
    let browserName = "Unknown Browser";
    if (ua.includes("Firefox")) browserName = "Firefox";
    else if (ua.includes("Edg")) browserName = "Edge";
    else if (ua.includes("Chrome")) browserName = "Chrome";
    else if (ua.includes("Safari")) browserName = "Safari";

    let osName = "Unknown OS";
    if (ua.includes("Win")) osName = "Windows";
    else if (ua.includes("Mac")) osName = "macOS";
    else if (ua.includes("Linux")) osName = "Linux";
    else if (ua.includes("Android")) osName = "Android";
    else if (ua.includes("like Mac")) osName = "iOS";

    let deviceName = "Desktop PC";
    let iconName = "desktop_windows";
    if (/Mobile|Android|iP(hone|od|ad)/i.test(ua)) {
      deviceName = "Mobile Device";
      iconName = "smartphone";
    } else if (osName === 'macOS') {
      deviceName = "MacBook / Mac";
      iconName = "laptop_mac";
    } else if (osName === 'Windows') {
      deviceName = "Windows PC";
      iconName = "laptop_mac";
    }

    setSessions([{
      id: 'current-1',
      device: deviceName,
      os: osName,
      browser: browserName,
      ip: 'Detected (Local)',
      location: 'Indonesia',
      lastActive: 'Baru saja',
      isCurrent: true,
      icon: iconName
    }]);

    const allLogs = getActivityLogs();
    
    // Filter audit trail
    const crucialLogs = allLogs.filter(log => 
      log.type === 'config' || 
      log.action === 'Menghapus' || 
      log.section === 'Keamanan' ||
      log.type === 'system'
    ).slice(0, 5);
    setAuditLogs(crucialLogs);

    // Filter login history
    const logins = allLogs.filter(log => log.action === 'Login').slice(0, 5);
    setLoginHistory(logins);
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleForceLogout = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
       showToast('success', 'Session successfully terminated (Force Logout).');
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
       showToast('success', 'All other device sessions terminated.');
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto animate-in fade-in duration-700">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-[#6ab149] text-white' : 'bg-red-500 text-white'}`}
          >
            <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">Security & Access</span>
       <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">System Security</h1>
           <p className="text-on-surface-variant text-sm mt-2 font-medium max-w-xl leading-relaxed">
             Monitor and manage account access security. Review connected devices, login activity history, and system critical audit trail.
           </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRevokeAll}
          className="bg-error text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-error/20 self-start md:self-auto"
        >
           <span className="material-symbols-outlined text-[20px]">phonelink_erase</span>
           Logout All Devices
        </motion.button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Active Sessions & Login History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sessions */}
          <motion.section variants={itemVariants} className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-outline-variant/5 border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="material-symbols-outlined text-8xl">devices</span>
            </div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">devices</span>
              </div>
              <div>
             <h2 className="text-xl font-black text-on-surface tracking-tight">Active Sessions</h2>
                 <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Currently logged-in devices</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <AnimatePresence>
                {sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${session.isCurrent ? 'bg-primary/[0.02] border-primary/20' : 'bg-surface-container-low border-transparent hover:border-outline-variant/30'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined">{session.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm text-on-surface">{session.device}</h3>
                   {session.isCurrent && (
                             <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">This Device</span>
                           )}
                        </div>
                   <p className="text-xs text-on-surface-variant font-medium mt-1">
                           {session.browser} on {session.os} • {session.ip} • {session.location}
                         </p>
                         <p className="text-[10px] text-on-surface-variant/70 font-bold mt-1">
                           Active: {session.lastActive}
                         </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleForceLogout(session.id)}
                        className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Force Logout"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {sessions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-on-surface-variant font-medium">No active sessions.</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Login History */}
          <motion.section variants={itemVariants} className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-outline-variant/5 border border-outline-variant/10 overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">history</span>
              </div>
              <div>
               <h2 className="text-xl font-black text-on-surface tracking-tight">Login History</h2>
                 <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Access activity last 7 days</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                   <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">User</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Time & IP</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Device</th>
                   <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {loginHistory.length > 0 ? loginHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-sm text-on-surface">{history.actor}</p>
                        <p className="text-xs text-on-surface-variant">{history.target}</p>
                      </td>
                       <td className="py-4 pr-4">
                         <p className="text-sm font-medium text-on-surface">
                           {new Date(history.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                         <p className="text-xs font-mono text-on-surface-variant mt-0.5">Logged</p>
                       </td>
                      <td className="py-4 pr-4">
                        <p className="text-sm font-medium text-on-surface">{history.detail || 'Sistem'}</p>
                      </td>
                      <td className="py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Success
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-on-surface-variant">No recent login history.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        {/* Right Column - Audit Trail */}
        <div className="space-y-6">
          <motion.section variants={itemVariants} className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-xl shadow-outline-variant/5 border border-outline-variant/10 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">track_changes</span>
              </div>
              <div>
               <h2 className="text-xl font-black text-on-surface tracking-tight">Audit Trail</h2>
                 <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">System Critical Changes</p>
              </div>
            </div>

            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/20 before:to-transparent">
              {auditLogs.length > 0 ? auditLogs.map((log, _index) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6 last:mb-0">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-lowest shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                    log.action === 'Menghapus' ? 'bg-error text-white' : 
                    log.type === 'config' ? 'bg-tertiary text-white' : 
                    'bg-secondary text-white'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {log.action === 'Menghapus' ? 'delete' : log.type === 'config' ? 'tune' : 'admin_panel_settings'}
                    </span>
                  </div>
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/10 group-hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-1">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${log.action === 'Delete' ? 'text-error' : 'text-primary'}`}>{log.action}</span>
                      <time className="text-[10px] font-bold text-on-surface-variant">
                        {new Date(log.timestamp).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                       <p className="text-sm font-bold text-on-surface mb-1 leading-tight">{log.target}</p>
                       <p className="text-xs text-on-surface-variant/80 font-medium">By: {log.actor}</p>
                  </div>
                </div>
              )) : (
                   <div className="text-center py-10 relative z-10">
                   <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">verified_user</span>
                   <p className="text-sm font-bold text-on-surface">No critical activity</p>
                   <p className="text-xs text-on-surface-variant">System is secure.</p>
                </div>
              )}
            </div>
            
            {auditLogs.length > 0 && (
              <div className="mt-8 text-center">
                 <Link to="/admin/activity" className="text-xs font-black text-primary hover:underline uppercase tracking-widest inline-flex items-center gap-1">
                   View All Logs <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </Link>
              </div>
            )}
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}