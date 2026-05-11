import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary relative"
        >
          <span className="material-symbols-outlined text-[80px]">error</span>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
          />
        </motion.div>
        
        <h1 className="text-8xl font-black text-primary font-headline mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-on-surface mb-6 tracking-tight">
          Halaman Not Found
        </h2>
        
        <p className="text-on-surface-variant font-medium text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          Maaf, halaman utama sedang tidak aktif atau rute yang Anda cari tidak dapat ditemukan di sistem kami.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/"
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Kembali ke Beranda
          </Link>
          <Link 
            to="/kontak"
            className="px-8 py-4 bg-surface-container-high text-on-surface rounded-xl font-bold tracking-wide hover:bg-surface-container transition-all active:scale-[0.98] flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            Hubungi Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
