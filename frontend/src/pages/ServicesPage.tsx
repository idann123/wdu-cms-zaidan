import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    badgeText: 'Layanan Kami',
    headline: ['Solusi', 'Terbaik Untuk', 'Kebutuhan Anda'],
    description: 'Kami menyediakan berbagai layanan riset, analisis data, dan konsultasi teknologi yang disesuaikan dengan kebutuhan Anda.',
    stats: [
      { value: '5+', label: 'Jenis Layanan' },
      { value: '24/7', label: 'Dukungan' },
      { value: '100%', label: 'Kepuasan Klien' },
    ],
    ctaText: 'Konsultasi Gratis',
    ctaLink: '#contact'
  });

  useEffect(() => {
    const stored = localStorage.getItem('wdu_admin_settings');
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.heroes?.services) {
          setHeroData({ ...heroData, ...settings.heroes.services });
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === "#layanan") {
      setTimeout(() => {
        const element = document.getElementById("layanan");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.filter((s: Service) => s.isActive).sort((a: Service, b: Service) => a.order - b.order));
      } catch (e) {
        console.error("Failed to fetch services", e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  const descRef = useRef(null);
  const descInView = useInView(descRef, { once: true, margin: "-100px" });

  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <main>
      <motion.section
        className="relative min-h-[60vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src="https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/header-layanan-r0d1p013xjdauuqbpgua94u7h5oe3zp0dnk4ku7wdc.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/30"></div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-center">
            <motion.h1
              className="font-headline text-5xl md:text-7xl font-extrabold text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Layanan <span className="text-primary">Kami</span>
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg mt-4 font-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Solusi terbaik untuk bisnis Anda
            </motion.p>
          </div>
        </motion.div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 flex flex-col md:flex-row justify-between items-start gap-12" id="layanan">
        <motion.div
          ref={headerRef}
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={headerInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-24 h-1.5 bg-primary mb-6"
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ originX: 0 }}
          />
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface">
            {heroData.badgeText}
          </h1>
        </motion.div>
        <motion.div
          ref={descRef}
          className="flex-1 max-w-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={descInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {heroData.description}
          </p>
        </motion.div>
      </section>

      <motion.section
        ref={servicesRef}
        className="max-w-7xl mx-auto px-8 pb-32"
        variants={containerVariants}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-xl animate-pulse h-64">
                <div className="w-12 h-12 bg-surface-container rounded-xl mb-6"></div>
                <div className="h-6 bg-surface-container rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-surface-container rounded w-full"></div>
              </div>
            ))
          ) : services.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant">inventory_2</span>
              <p className="text-on-surface-variant mt-4">Layanan tidak tersedia</p>
            </div>
          ) : (
            services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="bg-surface-container-lowest p-8 relative overflow-hidden group border-t-4 border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-on-surface/5"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
              <motion.div
                className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <motion.span
                className="material-symbols-outlined text-primary text-4xl mb-6 block relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {service.icon}
              </motion.span>
              <h3 className="font-headline text-2xl font-bold mb-4 relative z-10 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed relative z-10">
                  {service.description}
                </p>
                <Link
                  to={`/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mt-6 inline-flex items-center gap-2 text-primary font-bold relative z-10 group/link"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
                <motion.span
                  className="material-symbols-outlined absolute bottom-[-20px] right-[-10px] text-9xl watermark-icon select-none opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                  initial={{ scale: 1, opacity: 0.05 }}
                  whileHover={{ scale: 1.1, opacity: 0.15 }}
                >
                  {service.icon || 'inventory_2'}
                </motion.span>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      <motion.section
        className="relative h-[600px] flex items-center overflow-hidden"
        id="visi"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ duration: 0.5 }}
        />
        <motion.img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5RBKpoKOweh7oewDuSplkr02yMIykWHdlgaw0pQbKXaJGpiQb2q8P0TpjUzGZtM6A0NJji6CZiVBYHqrct5-bse_f5lqmn58uaV3ywxGK9VEMlHow6A6lCrktK7jHBxfAF6oBH0soe_AJ92ecTcMJVRPmRn6o474kgUZLw8DlplpIoJJ40yVd5-7wUDZCtqWh4mSezx6bTKvSkLEJFqYAHTb1LUNQ6qj4MXzzO8DuAWLR8ds5E9zIDN4sbnjKFTguYa3D7oLy2lpx"
          alt=""
          className="absolute inset-0 w-full h-full object-cover grayscale"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div
            className="flex items-center gap-6 mb-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-1 bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ originX: 0 }}
            />
            <span className="text-primary font-label tracking-[0.2em] uppercase text-sm font-bold">

            </span>
          </motion.div>
          <motion.h2
            className="font-headline text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            DATA IS OUR <br />
            <span className="text-primary">BUSINESS</span>
          </motion.h2>
          <motion.p
            className="text-white/80 text-xl md:text-2xl font-body max-w-2xl leading-relaxed italic border-l-2 border-primary/40 pl-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            "Data bukan hanya angka bagi kami, tapi fondasi untuk menciptakan solusi terbaik. Dengan keahlian dan teknologi, kami menghadirkan wawasan yang mendorong pertumbuhan dan inovasi."
          </motion.p>
        </div>
      </motion.section>
    </main>
  );
}