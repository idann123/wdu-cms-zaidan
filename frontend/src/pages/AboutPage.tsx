import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function AboutPage() {
  const heroRef = useRef(null);
  const [ceoProfile, setCeoProfile] = useState({
    name: "Ir. Yudi A. Idrus",
    title: "direktur utama",
    photoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/02/Pak-Yudi-homepage-2.png",
    isActive: true
  });
const [heroData, setHeroData] = useState({
    badgeText: 'Tentang Kami',
    headline: ['Mengubah Data Menjadi', 'Kekuatan Untuk', 'Keputusan Cerdas'],
    description: 'Wahana Data Utama adalah mitra terpercaya dalam bidang riset dan analisis data yang membantu organisasi pemerintah dan swasta di Indonesia.',
    stats: [
      { value: '15+', label: 'Tahun Pengalaman' },
      { value: '500+', label: 'Proyek Selesai' },
      { value: '50+', label: 'Tim Ahli' },
    ],
    bgImage: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/1384bbe7-3362-446d-b989-77114335e7ea-1-scaled-r09xvdqugccp0qj415ithlfa8gvrifzftmrqwj4fts.jpg',
    ctaText: 'Pelajari Lebih Lanjut',
    ctaLink: '#experience'
  });

  useEffect(() => {
    const stored = localStorage.getItem('wdu_admin_settings');
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.ceoProfile) {
          setCeoProfile(settings.ceoProfile);
        }
        if (settings.heroes?.about) {
          setHeroData({ ...heroData, ...settings.heroes.about });
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const revealLeft = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1] as const }
    }
  };

  const imageScale = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Clean & Bright Hero Background */}
      <section ref={heroRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img
            alt="Bright Corporate Background"
            className="w-full h-full object-cover opacity-90"
            src={heroData.bgImage || "https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/1384bbe7-3362-446d-b989-77114335e7ea-1-scaled-r09xvdqugccp0qj415ithlfa8gvrifzftmrqwj4fts.jpg"}
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
        </motion.div>
      </section>

      {/* Tentang Kami Section with Advanced Reveal */}
      <section className="pt-24 pb-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
              {/* Frame effects */}
              <div className="absolute -inset-4 bg-primary/10 rounded-[80px] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute -inset-1 rounded-[70px] border-2 border-transparent group-hover:border-primary/40 group-hover:shadow-primary/20 shadow-xl transition-all duration-300" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl z-10"
              >
                <motion.div
                  variants={revealLeft}
                  className="absolute inset-0 bg-primary z-20"
                ></motion.div>
                <motion.img
                  variants={imageScale}
                  alt="Architectural Excellence"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://sis.wahanadata.co.id/img/wdu-building.jpg"
                />
              </motion.div>
              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -left-10 w-40 h-40 border-2 border-primary/20 rounded-full border-dashed z-0"
              ></motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-10"
            >
<motion.h3 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-black text-slate-900 leading-tight">
                <br />
                <span className="gradient-text">{heroData.badgeText}</span>
              </motion.h3>

              <motion.div variants={fadeInUp} className="space-y-6 text-xl text-slate-600 font-light leading-relaxed">
                <p>{heroData.description}</p>
                <p>
                  Berkantor di Graha Nurul Menteng, Bogor, kami mengintegrasikan inovasi digital dalam riset sosial-politik, lingkungan hidup, ekonomi pembangunan, hingga manajemen pemasaran, serta menawarkan solusi berbasis cloud yang cepat dan akurat untuk berbagai kebutuhan, termasuk koperasi dan UKM, agribisnis, serta periklanan digital. Melalui penerapan teknologi mutakhir seperti <span className="text-slate-900 font-medium">machine learning</span> untuk analisis prediktif, kami mendukung klien dalam menghadapi tantangan bisnis modern dan menciptakan keunggulan kompetitif yang berkelanjutan.

                </p>
              </motion.div>


            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section with Staggered Text */}
      <section className="relative py-40 flex items-center justify-center bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.1, scale: 1.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h2 className="text-[20rem] font-black text-white whitespace-nowrap">MISSION</h2>
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-primary font-bold tracking-[0.4em] uppercase mb-8 block">Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white italic leading-tight">
              "Data bukan hanya angka bagi kami, tapi fondasi untuk menciptakan solusi terbaik yang membantu pertumbuhan dan inovasi."
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Garda Terdepan Section with Geometric Decoration */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="bg-white py-32 border-t border-slate-100 relative overflow-hidden"
        id="about-section"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Kolon Kiri: Konten Teks */}
            <div className="lg:col-span-7">
              {/* Section Header */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
                <div className="w-12 h-1 bg-[#4CAF50]"></div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-black uppercase tracking-tight">
                  Garda Terdepan Profesional Berpengalaman
                </h1>
              </motion.div>

              {/* Section Content dengan Border */}
              <motion.div
                variants={fadeInUp}
                className="p-8 lg:p-10 border-2 border-slate-100 rounded-[32px] bg-slate-50/50 space-y-6 text-slate-800 text-lg leading-relaxed text-justify font-light relative overflow-hidden"
              >
                {/* Aksen dekoratif di dalam border (opsional) */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#4CAF50]/20"></div>

                <p>
                  Didirikan oleh para profesional berpengalaman dengan spesialisasi lebih dari satu dekade, kami membangun fondasi perusahaan yang kokoh dalam setiap aspek operasional, mulai dari perencanaan, pelaksanaan, pengawasan, hingga evaluasi, dengan pendekatan metodologi berbasis teknologi modern. Tenaga ahli kami yang terlatih dan bersertifikasi terus meningkatkan kompetensi melalui pendidikan dan pelatihan berbasis digital, termasuk riset dan penggunaan software analitik canggih.
                </p>
                <p>
                  Sebagai mitra strategis bagi instansi pemerintah maupun swasta, kami telah membuktikan kapabilitas dengan menyelesaikan berbagai proyek konsultasi yang kompleks dan multidimensi, mencakup riset tren pasar global, pelatihan profesional berbasis teknologi, hingga <i>event organizing</i> yang didukung <i>platform</i> digital. Dengan integrasi solusi berkelanjutan untuk menghadapi tantangan global, transformasi digital, dan ketahanan ekonomi, kami memanfaatkan data sebagai aset strategis untuk mendukung pembangunan nasional dan internasional. Di tahun 2025, kami terus berkomitmen untuk menjadi mitra terpercaya yang menghadirkan inovasi dan perubahan signifikan dalam ekosistem <i>data-driven</i> yang berorientasi pada masa depan.
                </p>
              </motion.div>
            </div>

            {/* Kolom Kanan: Gambar */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-5 relative group"
            >
              {/* Frame Dekoratif di belakang gambar */}
              <div className="absolute -inset-4 bg-green-100 rounded-[40px] transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>

              {/* Kontainer Gambar */}
              <div className="relative overflow-hidden rounded-[32px] shadow-2xl h-[450px] sm:h-[500px] lg:h-[650px] w-full">
                <img
                  src="https://sis.wahanadata.co.id/img/wdu-building.jpg"
                  alt="Tim Profesional"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay gradasi agar gambar lebih menyatu */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* Redesigned Visi & Misi Section with Modern Glassmorphism & Glowing Orbs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative py-32 overflow-hidden bg-slate-50"
        id="visi-misi-section"
      >
        {/* Animated Background Glowing Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-teal-200/30 rounded-full mix-blend-multiply filter blur-[150px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 px-6 mx-auto max-w-7xl">
          {/* VISI SECTION */}
          <div className="mb-32">
            <motion.div variants={fadeInUp} className="flex flex-col items-center mb-12">
              <span className="px-4 py-1 mb-6 text-sm font-bold tracking-widest text-green-700 uppercase bg-green-100 rounded-full">
                Tujuan Utama
              </span>
              <h2 className="text-5xl font-black tracking-tight text-slate-900 lg:text-6xl">
                Visi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Kami</span>
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.02, transition: { duration: 0.4, ease: "easeOut" } }}
              className="relative max-w-5xl mx-auto overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[3rem] p-12 lg:p-20 text-center group"
            >
              <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center w-24 h-24 mb-8 transition-transform duration-500 shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl shadow-green-500/20 group-hover:rotate-12">
                  <span className="text-5xl text-white material-symbols-outlined font-extralight">language</span>
                </div>
                <h3 className="text-3xl font-medium leading-relaxed tracking-wide text-slate-800 lg:text-4xl">
                  "Menjadi perusahaan penyedia data <br className="hidden lg:block" />
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">riset & survei global</span> terdepan."
                </h3>
              </div>
            </motion.div>
          </div>

          {/* MISI SECTION */}
          <div>
            <motion.div variants={fadeInUp} className="flex flex-col items-center mb-16">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">
                Misi <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Kami</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-6"></div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  text: "Melakukan riset, survei dan kajian yang kredibel sesuai kaidah ilmiah untuk menghasilkan data yang akurat, presisi, dan andal (reliable data).",
                  icon: "biotech",
                  num: "01"
                },
                {
                  text: "Mengorganisir sebuah kegiatan dengan akurat, presisi dan andal untuk kepentingan publik secara profesional.",
                  icon: "event_available",
                  num: "02"
                },
                {
                  text: "Menjadi perusahaan kreatif yang penuh inovasi, solusi dan gagasan cemerlang untuk menyongsong masa depan.",
                  icon: "psychology",
                  num: "03"
                }
              ].map((misi, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                  className="relative p-10 overflow-hidden text-left transition-all duration-300 bg-white/50 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-[2.5rem] group"
                >
                  {/* Watermark Number */}
                  <div className="absolute font-black transition-transform duration-500 select-none top-4 right-6 text-8xl text-slate-900/[0.03] group-hover:scale-110 group-hover:-translate-y-2 group-hover:text-green-900/[0.05]">
                    {misi.num}
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-center w-16 h-16 mb-8 transition-colors duration-300 bg-white shadow-sm rounded-2xl text-slate-700 group-hover:bg-green-500 group-hover:text-white">
                      <span className="text-3xl material-symbols-outlined font-light">{misi.icon}</span>
                    </div>

                    <p className="flex-grow text-lg leading-relaxed text-slate-600">
                      {misi.text}
                    </p>

                    {/* Decorative Bottom Line */}
                    <div className="w-0 h-1 mt-8 transition-all duration-300 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:w-full"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Direksi Section with Filter Animations */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-24"
          >
            <h3 className="text-5xl font-display font-black text-slate-900 mb-6">
              jajaran <span className="text-primary italic">Direksi</span>
            </h3>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            <p className="text-xl text-slate-500 font-light">

            </p>
          </motion.div>

          {/* Barisan Pertama: 2 Orang */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto mb-20">
            {[
              ceoProfile.isActive ? {
                name: ceoProfile.name,
                role: ceoProfile.title,
                img: ceoProfile.photoUrl,
              } : null,
              { name: "Dr. Ir. Erviani M.Si", role: "Komisaris Utama", img: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-erfi_scaled-1024x841.png", pos: "left center" },
            ].filter((x): x is NonNullable<typeof x> => x != null).map((leader, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-[60px] aspect-[10/13] bg-slate-100 shadow-2xl transition-all duration-700">
                  <motion.img
                    src={leader.img}
                    alt={leader.name}
                    style={{ objectPosition: (leader as any).pos || 'center' }}
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                    >
                      <h4 className="text-3xl font-black text-white mb-2">{leader.name}</h4>
                      <p className="text-primary font-bold text-sm uppercase tracking-widest">{leader.role}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Barisan Kedua: 3 Orang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { name: "M. Fadhlan Fadilah, S.E", role: "Direktur", img: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_pak-adlan_fixed.png", pos: "right center" },
              { name: "M. Hafiz Abdillah, S.T ", role: "Direktur", img: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_bu-hafiz_fixed.png", pos: "right center" },
              { name: "Nurul Athia R, S.Bns", role: "Direktur", img: "https://wahanadata.co.id/wp-content/uploads/2025/02/direksi_mba-nia_fixed.png", pos: "right center" }
            ].map((leader, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-[60px] aspect-[10/13] bg-slate-100 shadow-2xl transition-all duration-700">
                  <motion.img
                    src={leader.img}
                    alt={leader.name}
                    style={{ objectPosition: (leader as any).pos || 'center' }}
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                    >
                      <h4 className="text-3xl font-black text-white mb-2">{leader.name}</h4>
                      <p className="text-primary font-bold text-sm uppercase tracking-widest">{leader.role}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


