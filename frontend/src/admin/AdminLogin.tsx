import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';
import logoWdu from '../img/logo.png';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const backgroundImage = 'https://sis.wahanadata.co.id/img/wdu-building.jpg'
export default function AdminLogin() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setAuth(res.data.user, res.data.accessToken);
      logActivity({
        action: 'Login',
        actor: res.data.user?.name || res.data.user?.email || data.email,
        target: 'Admin Panel',
        section: 'Authentication',
        page: 'Admin Panel',
        type: 'system',
        detail: `Role: ${res.data.user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'} — ${data.email}`,
      });
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center selection:bg-primary-fixed relative overflow-hidden">
      {/* Background Static */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Login Background"
          className="w-full h-full object-cover"
        />
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>

        {/* Green Shadow Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="w-full max-w-[460px] px-6 py-12 flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden pt-16 pb-12 px-10 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]"></div>

          <div className="flex flex-col items-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <img src={logoWdu} alt="WDU Logo" className="h-32 w-auto object-contain drop-shadow-2xl" />
            </motion.div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight text-center">WDU Admin Login</h1>
            <p className="text-white/40 text-xs font-bold mt-2 uppercase tracking-[0.3em]">Precision Infrastructure</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl mb-8 text-sm text-center font-medium backdrop-blur-xl"
            >
              {error}
            </motion.div>
          )}

          <form className="flex flex-col space-y-7" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-3 group">
              <label className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase pl-2" htmlFor="email">Node Identifier</label>
              <div className="relative">
                <input
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-white/10 font-medium focus:bg-black/30 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                  id="email"
                  placeholder="admin@wdu.co.id"
                  type="email"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-red-400/80 text-[10px] font-bold mt-1 pl-2 uppercase tracking-wider">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col space-y-3 group">
              <div className="flex justify-between items-center pl-2 pr-2">
                <label className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase" htmlFor="password">Security Key</label>
                <a className="text-primary/60 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">Recovery</a>
              </div>
              <div className="relative flex items-center">
                <input
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-5 pr-14 text-white placeholder:text-white/10 font-medium focus:bg-black/30 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 p-1 text-white/20 hover:text-white transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.password && <p className="text-red-400/80 text-[10px] font-bold mt-1 pl-2 uppercase tracking-wider">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-3 pl-2 pt-1">
              <div className="relative flex items-center">
                <input
                  className="w-5 h-5 rounded-lg border-white/10 bg-black/20 text-primary focus:ring-primary/20 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary border-2"
                  id="remember"
                  type="checkbox"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white opacity-0 peer-checked:opacity-100">
                  <span className="material-symbols-outlined text-xs font-bold">check</span>
                </div>
              </div>
              <label className="text-white/40 text-xs font-bold cursor-pointer select-none" htmlFor="remember">Keep session active</label>
            </div>

            <button
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-black tracking-[0.2em] uppercase text-xs shadow-2xl shadow-primary/30 transform transition-all hover:scale-[1.02] hover:shadow-primary/50 active:scale-[0.98] disabled:opacity-50 mt-6"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : 'Establish Connection'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center">
            <p className="text-white/40 text-sm mb-4">New to the precision network?</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              Request Credentials
            </button>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center space-x-2 text-white/50">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Secured Enterprise Node</span>
        </div>
      </main>

      {/* Request Access Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20 overflow-hidden"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-8 text-primary shadow-inner">
                  <span className="material-symbols-outlined text-4xl">contact_support</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Access Credentials</h3>
                <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed">
                  To access the PT. Wahana Data Utama ecosystem, please verify your identity with the IT Security Department or request node access.
                </p>

                <div className="flex flex-col w-full gap-4">
                  <button
                    onClick={() => navigate('/kontak')}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold tracking-widest uppercase text-xs shadow-lg shadow-primary/30 hover:bg-primary-light transition-all active:scale-[0.98]"
                  >
                    Contact Security
                  </button>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="w-full py-4 bg-white/5 text-white/70 rounded-2xl font-bold tracking-widest uppercase text-xs border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Back to Terminal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 py-6 bg-transparent absolute bottom-0 z-10">
        <div className="text-white/70 text-xs font-medium tracking-wide">
          © 2026 PT. Wahana Data Utama. All rights reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a className="text-white/60 text-xs font-medium tracking-wide hover:text-white transition-opacity" href="#">Privacy Policy</a>
          <a className="text-white/60 text-xs font-medium tracking-wide hover:text-white transition-opacity" href="#">Terms of Service</a>
          <a className="text-white/60 text-xs font-medium tracking-wide hover:text-white transition-opacity" href="#">Security</a>
        </div>
      </footer>

    </div>
  );
}