import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const buttonRef = useRef<HTMLDivElement>(null);

  const serviceDetailPages = ['/riset-pasar', '/analisis-data', '/konsultasi-it', '/riset-data', '/event-organizer', '/survei'];
  const shouldHideNavbar = serviceDetailPages.includes(location.pathname);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      x.set((clientX - centerX) * 0.35);
      y.set((clientY - centerY) * 0.35);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Beranda', path: '/', slug: 'home' },
    { title: 'Tentang Kami', path: '/tentang-kami', slug: 'tentang-kami' },
    { title: 'Layanan', path: '/layanan', slug: 'layanan' },
    { title: 'Pengalaman', path: '/portfolio', slug: 'portfolio' },
    { title: 'SIS-WDU', path: '/sis-wdu', slug: 'sis-wdu' },
    { title: 'Kontak', path: '/kontak', slug: 'kontak' },
  ];

  if (shouldHideNavbar) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white py-4 ${isScrolled ? 'glass-header shadow-lg' : ''
        }`}
    >
      <div className="w-full px-4 md:px-8 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="h-14 md:h-16 w-auto overflow-hidden">
            <img
              src="/public/image copy.png"
              alt="Wahana Data Utama Logo"
              className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-bold transition-all relative ${location.pathname === link.path
                ? 'text-primary'
                : 'text-slate-600 hover:text-primary'
                }`}
            >
              {link.title}
              {location.pathname === link.path && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <motion.div
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
          >
            <Link
              to="/sis-wdu"
              className="relative px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl overflow-hidden group flex items-center gap-3 shadow-xl hover:shadow-primary/20 transition-all duration-500"
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-10"
              />
              <span className="relative z-20">Download Company Profile</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="material-symbols-outlined text-sm relative z-20 font-black text-primary"
              >
                download
              </motion.span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-700 focus:outline-none">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </nav>
  );
}
