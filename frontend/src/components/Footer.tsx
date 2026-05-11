import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePages } from '../context/PageContext';
import { ChevronUp } from 'lucide-react';

interface SiteConfig {
  email: string;
  telepon: string;
  alamat: string;
  companyProfile: string;
  footerCopyright: string;
  socialYoutube: string;
  socialInstagram: string;
}

const defaultConfig: SiteConfig = {
  email: 'info@wahanadata.co.id',
  telepon: '+62 21 1234 5678',
  alamat: '',
  companyProfile: '',
  footerCopyright: '© 2025 Wahana Data Utama. All Rights Reserved.',
  socialYoutube: 'https://www.youtube.com/@wahanadatautama9110',
  socialInstagram: 'https://www.instagram.com/wahanadatautama',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

const stats = [
  { value: '25+', label: 'Klien' },
  { value: '150+', label: 'Proyek' },
  { value: '18+', label: 'Tahun' },
];

export default function Footer() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  usePages();

  useEffect(() => {
    const stored = localStorage.getItem('wdu_site_config');
    if (stored) {
      try {
        setConfig({ ...defaultConfig, ...JSON.parse(stored) });
      } catch (e) {
        setConfig(defaultConfig);
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#123b1b] text-white/70 py-24 relative overflow-hidden">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#123b1b] via-transparent to-[#123b1b]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6ffb85]/30 to-transparent" />
      </div>

      {/* Animated Ambient Circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#6ffb85] rounded-full blur-[120px] opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 -right-20 w-80 h-80 bg-[#006e28] rounded-full blur-[120px] opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6ffb85] rounded-full blur-[120px] opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-[#6ffb85]/5 backdrop-blur-xl border border-[#6ffb85]/10 rounded-2xl p-8 md:p-10 mb-20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Ada proyek riset atau analisis data?</h3>
            <p className="text-white/60 text-sm">Mari diskusikan kebutuhan Anda bersama tim profesional kami.</p>
          </div>
          <a
            href="https://wa.me/62881012394686?text=Halo%20Wahana%20Data%20Utama"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#6ffb85] text-[#002107] px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[#53e16f] transition-all shadow-xl shadow-[#6ffb85]/20 flex items-center gap-3 group"
          >
            Hubungi Kami
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-20"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                PT. WAHANA <span className="text-[#6ffb85]">DATA</span> UTAMA
              </h3>
            </div>
            <p className="text-[#6ffb85]/80 text-sm font-bold uppercase tracking-[0.15em] mb-6">
              Trusted Data & Research Partner Since 2006
            </p>
            <p className="text-white/60 leading-relaxed mb-8 max-w-md">
              {config.footerCopyright || '© 2025 Wahana Data Utama. All Rights Reserved'}
            </p>

            {/* Stat Badges */}
            <div className="flex gap-3 mb-10">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#123b1b]/80 border border-[#6ffb85]/10 rounded-xl px-4 py-3 text-center flex-1"
                >
                  <div className="text-white font-black text-lg">{stat.value}</div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                {
                  name: 'youtube',
                  url: config.socialYoutube || 'https://www.youtube.com/@wahanadatautama9110',
                  path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
                },
                {
                  name: 'instagram',
                  url: config.socialInstagram || 'https://www.instagram.com/wahanadatautama',
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl bg-[#123b1b]/80 border border-[#6ffb85]/10 flex items-center justify-center hover:bg-[#6ffb85]/20 hover:border-[#6ffb85]/30 transition-all duration-300 group"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="transition-all duration-300 group-hover:fill-[#6ffb85] group-hover:scale-110"
                  >
                    <path d={social.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Ekosistem Column */}
          <motion.div variants={itemVariants} className="md:col-span-2 md:col-start-7">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3">
              <span className="w-6 h-px bg-[#6ffb85]/40" />
              NAVIGASI
            </h4>
            <ul className="space-y-5">
              {[
                { name: 'Beranda', path: '/' },
                { name: 'Layanan', path: '/layanan' },
                { name: 'Tentang Kami', path: '/tentang-kami' },
                { name: 'Pengalaman', path: '/portfolio' },
                { name: 'SIS-WDU', path: '/sis-wdu' },
                { name: 'kontak', path: '/kontak' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="group flex items-center gap-3 hover:text-[#6ffb85] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#6ffb85] text-sm opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                      chevron_right
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Layanan Column */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3">
              <span className="w-6 h-px bg-[#6ffb85]/40" />
              Layanan
            </h4>
            <ul className="space-y-5">
              {[
                { name: 'Riset Pasar', path: '/riset-pasar' },
                { name: 'Analisis Data', path: '/analisis-data' },
                { name: 'Konsultasi IT', path: '/konsultasi-it' },
                { name: 'Riset Data', path: '/riset-data' },
                { name: 'Event Organizer', path: '/event-organizer' },
                { name: 'Survei', path: '/survei' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="group flex items-center gap-3 hover:text-[#6ffb85] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[#6ffb85] text-sm opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                      chevron_right
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Kontak Column */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3">
              <span className="w-6 h-px bg-[#6ffb85]/40" />
              Kontak
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#6ffb85] text-sm mt-0.5">location_on</span>
                <p className="text-sm leading-relaxed">
                  {config.alamat || 'Kota Bogor\nBlok AE No. 01, Jl. Terapi Raya, RT 03/19, Menteng\nKec. Bogor Barat, Kota Bogor, Jawa Barat 16111'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6ffb85] text-sm">mail</span>
                <a href={`mailto:${config.email || 'info@wahanadata.co.id'}`} className="text-sm hover:text-[#6ffb85] transition-colors">
                  {config.email || 'info@wahanadata.co.id'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6ffb85] text-sm">call</span>
                <a href={`tel:${config.telepon?.replace(/\s/g, '') || '+622517552099'}`} className="text-sm hover:text-[#6ffb85] transition-colors">
                  {config.telepon || '(0251) 755 2099'}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-10 border-t border-[#6ffb85]/10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {config.footerCopyright || '© 2025 WAHANA DATA UTAMA. ALL RIGHTS RESERVED.'}
          </p>
          <div className="flex items-center gap-8">
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Link to="/privacy-policy" className="text-white/40 hover:text-[#6ffb85] transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-white/40 hover:text-[#6ffb85] transition-colors">Terms of Service</Link>
            </div>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#123b1b]/80 border border-[#6ffb85]/10 flex items-center justify-center hover:bg-[#6ffb85]/20 hover:border-[#6ffb85]/30 transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4 text-white/60" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
