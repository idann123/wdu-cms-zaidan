import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { staggerContainer, fadeInUp } from '../utils/animations';

const services = [
  {
    title: "Konsultasi IT",
    desc: "Arsitektur infrastruktur digital yang skalabel dan selaras dengan visi strategis jangka panjang perusahaan Anda. Kami menjembatani teknologi sebagai akselerator pertumbuhan bisnis.",
    icon: "settings_suggest",
    iconBg: "bg-green-100/50",
    iconBorder: "border-green-200/50",
    iconText: "text-green-600",
    path: "/konsultasi-it",
    isFeatured: false
  },
  {
    title: "Riset Pasar",
    desc: "Analisis mendalam terhadap tren industri vertikal untuk mengidentifikasi peluang kompetitif yang belum terjamah melalui metodologi riset yang presisi.",
    icon: "analytics",
    iconBg: "bg-blue-100/50",
    iconBorder: "border-blue-200/50",
    iconText: "text-blue-700",
    path: "/riset-pasar",
    isFeatured: false
  },
  {
    title: "Riset Data",
    desc: "Transformasi data mentah menjadi wawasan prediktif menggunakan model machine learning tingkat lanjut untuk pengambilan keputusan strategis yang akurat.",
    icon: "database",
    iconBg: "bg-[#6ffb85]/20",
    iconBorder: "border-[#6ffb85]/30",
    iconText: "text-[#6ffb85]",
    path: "/riset-data",
    isFeatured: true
  },
  {
    title: "Integrasi Sistem",
    desc: "Menyatukan silo data yang terfragmentasi menjadi satu sumber kebenaran tunggal bagi seluruh entitas perusahaan untuk efisiensi operasional.",
    icon: "hub",
    iconBg: "bg-tertiary-fixed/40",
    iconBorder: "border-tertiary-fixed/60",
    iconText: "text-tertiary",
    path: "/integrasi-sistem",
    isFeatured: false
  },
  {
    title: "Analisis Data",
    desc: "Ambil langkah cerdas dengan analisis data akurat yang memberikan panduan untuk keputusan strategis yang lebih baik.",
    icon: "query_stats",
    iconBg: "bg-cyan-100/50",
    iconBorder: "border-cyan-200/50",
    iconText: "text-cyan-600",
    path: "/analisis-data",
    isFeatured: false
  },
  {
    title: "Event Organizer",
    desc: "Manajemen acara profesional dengan pendekatan berbasis data untuk hasil yang maksimal.",
    icon: "calendar_month",
    iconBg: "bg-rose-100/50",
    iconBorder: "border-rose-200/50",
    iconText: "text-rose-600",
    path: "/event-organizer",
    isFeatured: false
  }
];

export default function Services() {
  const [draftSlugs, setDraftSlugs] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/pages').then((res) => {
      const drafted = res.data.filter((p: any) => !p.isPublished).map((p: any) => p.slug);
      setDraftSlugs(drafted);
    }).catch(console.error);
  }, []);

  const activeServices = services.filter(service => {
    const slug = service.path.replace('/', '');
    return !draftSlugs.includes(slug);
  });

  useEffect(() => {
    if (activeServices.length === 0) return;
    const isDesktop = window.innerWidth >= 768;
    setTotalPages(Math.ceil(activeServices.length / (isDesktop ? 3 : 1)));
  }, [activeServices.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || activeServices.length === 0) return;

    const handleScroll = () => {
      if (el.clientWidth === 0) return;
      const page = Math.round(el.scrollLeft / el.clientWidth);
      const isDesktop = window.innerWidth >= 768;
      const max = Math.ceil(activeServices.length / (isDesktop ? 3 : 1)) - 1;
      setActivePage(Math.min(page, Math.max(max, 0)));
    };

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setTotalPages(Math.ceil(activeServices.length / (isDesktop ? 3 : 1)));
    };

    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeServices.length]);

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollTo = (page: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: page * carouselRef.current.clientWidth, behavior: 'smooth' });
      setActivePage(page);
    }
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="layanan">
      {/* Ambient Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="text-left">
            {/* Glass Pill Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6ffb85]/10 border border-[#6ffb85]/30 rounded-full w-fit mb-6 backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6ffb85]" style={{ fontVariationSettings: "'FILL' 1" }}>
                grid_view
              </span>
              <span className="font-label-bold text-[12px] text-[#6ffb85] uppercase tracking-[0.2em] font-bold">
                Kapabilitas Utama
              </span>
            </motion.div>

            {/* Heading with Gradient Accent */}
            <motion.h2
              variants={fadeInUp}
              className="font-headline-lg text-headline-lg text-slate-900 md:text-5xl"
            >
              Layanan <span className="gradient-text">Unggulan</span> Kami
            </motion.h2>

            {/* Animated Accent Line */}
            <motion.div
              className="w-24 h-1 bg-secondary rounded-full mt-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ originX: 0 }}
            />
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="flex items-center gap-6">
          {/* Previous Button */}
          <motion.button
            onClick={scrollPrev}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full items-center justify-center bg-primary text-white hover:bg-primary-container transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Cards Scroll Container */}
          <motion.div
            ref={carouselRef}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory gap-gutter no-scrollbar pb-8 scroll-smooth"
          >
            {activeServices.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`snap-center shrink-0 w-[85vw] md:w-[calc((100%-48px)/3)] group relative overflow-hidden rounded-2xl p-10 flex flex-col justify-between border transition-all duration-500 ${
                  service.isFeatured
                  ? 'bg-gradient-to-br from-primary to-primary-container border-primary/20 shadow-xl hover:shadow-2xl'
                  : 'bg-white border-slate-100 shadow-lg hover:shadow-xl hover:border-primary/20'
                }`}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
              >
                {/* Background Blur Decor */}
                <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full blur-3xl transition-all duration-500 ${
                  service.isFeatured ? 'bg-secondary-fixed/10' : 'bg-primary/5 group-hover:bg-primary/10'
                }`} />

                {/* Featured Premium Badge */}
                {service.isFeatured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <div className="bg-[#6ffb85] text-[#002107] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        stars
                      </span>
                      Layanan Premium
                    </div>
                  </motion.div>
                )}

                <div className="relative z-10">
                  {/* Glass Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-sm border ${
                      service.isFeatured
                      ? 'bg-[#6ffb85]/20 border-[#6ffb85]/30 shadow-lg shadow-[#6ffb85]/10'
                      : `${service.iconBg} ${service.iconBorder}`
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${
                      service.isFeatured ? 'text-[#6ffb85]' : service.iconText
                    }`}>
                      {service.icon}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h3 className={`font-headline-md text-2xl mb-4 ${
                    service.isFeatured ? 'text-white' : 'text-slate-900'
                  }`}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className={`font-body-md leading-relaxed ${
                    service.isFeatured ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {service.desc}
                  </p>
                </div>

                {/* CTA Link */}
                <div className="relative z-10 mt-10">
                  <a
                    href={service.path}
                    className={`relative font-label-bold flex items-center gap-2 group/link w-fit ${
                      service.isFeatured ? 'text-[#6ffb85]' : 'text-primary'
                    }`}
                  >
                    Pelajari Selengkapnya
                    <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-current transition-all duration-300 group-hover/link:w-full" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Next Button */}
          <motion.button
            onClick={scrollNext}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full items-center justify-center bg-primary text-white hover:bg-primary-container transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => scrollTo(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activePage
                  ? 'bg-primary w-3 h-3'
                  : 'bg-primary/30 w-2 h-2 hover:bg-primary/60'
                }`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.8 }}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
