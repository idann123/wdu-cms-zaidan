import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function ContactPage() {
  const heroRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [heroData, setHeroData] = useState({
    badgeText: 'Hubungi Kami',
    headline: ['Siap', 'Membantu', 'Anda'],
    description: 'Jangan ragu untuk menghubungi kami. Tim profesional kami siap memberikan konsultasi dan menjawab pertanyaan Anda.',
    stats: [
      { value: '24/7', label: 'Dukungan' },
      { value: '< 1 Jam', label: 'Respon Time' },
      { value: '100%', label: 'Professional' },
    ],
    ctaText: 'Hubungi Sekarang',
    ctaLink: 'https://wa.me/62881012394686'
  });

  useEffect(() => {
    const stored = localStorage.getItem('wdu_admin_settings');
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.heroes?.contact) {
          setHeroData({ ...heroData, ...settings.heroes.contact });
        }
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const contactInfo = [
    {
      title: "Alamat Kantor",
      icon: "location_on",
      content: "Blok AE No. 01, Jl. Terapi Raya, RT 03/19, Menteng. Kec. Bogor Barat, Kota Bogor, Jawa Barat 1611",
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      title: "Email Resmi",
      icon: "alternate_email",
      content: "wahanadata@yahoo.com\nit.support@wahanadata.co.id",
      color: "bg-primary/20 text-primary"
    },
    {
      title: "Layanan Telepon",
      icon: "headset_mic",
      content: "(0251) 7564 109\n+62 812 8740 8806",
      color: "bg-orange-500/20 text-orange-400"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen overflow-hidden">
      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img
            alt="Kontak Header"
            className="w-full h-full object-cover scale-110"
            src="https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kontak-header-r02xh9skmo5ipym1j4rohxyhov5sjnraxkbp516srk.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-50"></div>
        </motion.div>

        <div className="relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4"
          >
            <span className="text-white text-xs font-black uppercase tracking-[0.4em]">{heroData.badgeText}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl"
          >
            {heroData.headline.join(' ')}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1.5 bg-primary mx-auto rounded-full"
          />
        </div>
      </section>

      {/* Main Content: Split Layout */}
      <section className="relative z-20 -mt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left: Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div variants={itemVariants} className="space-y-4 mb-12">
                <h2 className="text-6xl font-black text-slate-900 leading-tight">
                  Hubungi <span className="text-primary italic">Kami</span>
                </h2>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  Dapatkan segala informasi dengan menghubungi kami!
                </p>
              </motion.div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="p-8 bg-white/70 backdrop-blur-xl border border-white rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        <span className="material-symbols-outlined text-3xl">{info.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{info.title}</h3>
                        <p className="text-lg font-bold text-slate-900 whitespace-pre-line leading-snug">{info.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative Image Card */}
              <motion.div variants={itemVariants} className="relative rounded-[40px] overflow-hidden aspect-video shadow-2xl mt-12 group">
                <img
                  src="https://wahanadata.co.id/wp-content/uploads/2025/01/kontak-modified-768x474.png"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Contact Rep"
                />
                <div className="absolute inset-0 bg-primary/20 transition-opacity duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <span className="px-6 py-2 bg-white/90 backdrop-blur rounded-full text-primary font-black text-xs uppercase tracking-widest">Our Team</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Glass Form */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[60px] shadow-2xl border border-white relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full" />

              <div className="relative space-y-10">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                      className="text-center py-16"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-6xl text-primary">check_circle</span>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black text-slate-900 mb-4"
                      >
                        Pesan Terkirim!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-500 text-lg mb-8 max-w-md mx-auto"
                      >
                        Terima kasih sudah menghubungi kami. Tim kami akan menghubungi Anda segera.
                      </motion.p>
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setIsSubmitted(false)}
                        className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 flex items-center justify-center gap-3 mx-auto"
                      >
                        <span className="material-symbols-outlined">send</span>
                        Kirim Pesan Baru
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="space-y-2">
                        <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Send Message</span>
                        <h3 className="text-2xl font-black text-slate-900">Kami dengan senang hati siap membahas kebutuhan Anda. Silakan hubungi kami melalui informasi kontak di bawah ini.</h3>
                      </div>

                      <form className="space-y-8" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          name: formData.get('name'),
                          email: formData.get('email'),
                          phone: formData.get('phone'),
                          subject: formData.get('subject'),
                          message: formData.get('message'),
                        };

                        const button = e.currentTarget.querySelector('button');
                        if (button) {
                          button.disabled = true;
                          button.innerText = 'Mengirim...';
                        }

                        try {
                          const res = await fetch('/api/v1/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data),
                          });
                          if (res.ok) {
                            setIsSubmitted(true);
                          } else {
                            alert('Gagal mengirim pesan. Silakan coba lagi.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Terjadi kesalahan koneksi.');
                        } finally {
                          if (button) {
                            button.disabled = false;
                            button.innerHTML = 'Kirim Pesan Sekarang <span class="material-symbols-outlined">send</span>';
                          }
                        }
                      }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                              name="name"
                              type="text"
                              required
                              placeholder="Ex: John Doe"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                              name="email"
                              type="email"
                              required
                              placeholder="john@example.com"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input
                            name="phone"
                            type="tel"
                            placeholder="+62 812 3456 7890"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject / Project</label>
                          <input
                            name="subject"
                            type="text"
                            placeholder="Organization Name or Topic"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-900"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                          <textarea
                            name="message"
                            required
                            rows={4}
                            placeholder="Write your inquiry here..."
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-slate-900 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-primary hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3"
                        >
                          Kirim Pesan Sekarang
                          <span className="material-symbols-outlined">send</span>
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-32 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-4">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic">Kunjungi <span className="text-primary italic">Kami.</span></h3>
              <p className="text-slate-500 text-xl font-light">Kami berlokasi di pusat strategis Bogor Barat.</p>
            </div>

            <div className="w-full relative group rounded-[60px] overflow-hidden shadow-3xl border-[40px] border-white ring-1 ring-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.325583333333!2d106.7764606!3d-6.5776568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c45a76630bef%3A0xcc4ae8ae1ccf277f!2sPT.%20Wahana%20Data%20Utama!5e0!3m2!1sen!2sid!4v1700000000000"
                width="100%"
                height="750"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
              />
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-xl px-10 py-6 rounded-[32px] shadow-2xl border border-white/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 block opacity-60">HQ Location</span>
                <h4 className="text-2xl font-black italic">Bogor Barat</h4>
              </div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://maps.google.com/?q=Wahana+Data+Utama+Bogor"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 left-0 right-0 mx-auto w-fit bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-primary shadow-2xl shadow-slate-900/50 transition-all"
              >
                Buka Navigasi
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}