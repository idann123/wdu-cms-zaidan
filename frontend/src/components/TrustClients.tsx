import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultPartners = [
  { name: 'Kementerian ESDM', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/esdm-qzsnluwm095tgkmzgmxqlw3rrz56acfjho7xuw2dq4.png' },
  { name: 'Kemenperin', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenperin-qzsnlynyrlayr0hiuok8vv5m5imn54ugu6tvrzwt18.png' },
  { name: 'BUMN', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bumn-qzsn7zsb786k7mrzf56ubw20cdh9r2e2l1t40ymfi4.png' },
  { name: 'BPJS', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bps-qzsmwqnvdmrz7p4g4s2mz8acbay2liprdcmu6pb3zw.png' },
  { name: 'Badan POM', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpom-qzsmvfnxvwzn370pr7raik5am1dpwnj6iw0k6v8sn0.png' },
  { name: 'BKPM', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-qzsmr5ier34m758mrd4h5n1p6uhiuaj79p0xhhlczg.png' },
  { name: 'Bank Indonesia', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bank-indonesia-qzsmr4kkk93bvj9zwupul5a8lgm5mlfgxkdg07mr5o.png' },
  { name: 'Pemkab Bangka Selatan', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bangka-selatan-1-qzsmd5owzvyxc5kghbcg166msbgs8iz2ofco96cdmk.png' },
  { name: 'KOMDIGI', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/komdigi-qzsnm1hhc3etpudfe7s4lcfzxo8qs85nuksc7tsmik.png' },
  { name: 'OJK', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png' },
  { name: 'KPK', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png' },
  { name: 'Pemkot Bogor', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png' },
  { name: 'KLHK', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png' },
  { name: 'RISTEK', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png' },
  { name: 'KEMENKOPUKM', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png' },
  { name: 'Provinsi DKI Jakarta', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png' },
  { name: 'Kementerian PUPR', url: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/pupr-qzsnm58u3fjz0a7ys9emvbhub7q7n0kl73ea4xn1to.png' },
];

const STORAGE_KEY = 'wdu_admin_partners';

function loadPartners() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const partners = JSON.parse(stored);
      // Filter hanya partner yang aktif
      return partners
        .filter((p: any) => p.isActive !== false)
        .map((p: any) => ({ name: p.name, url: p.logoUrl }));
    } catch (e) {
      return defaultPartners;
    }
  }
  return defaultPartners;
}

const titleVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

export default function TrustClients() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [logos, setLogos] = useState(() => loadPartners());

  useEffect(() => {
    const handleStorageChange = () => {
      setLogos(loadPartners());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const doubledLogos = [...logos, ...logos];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-[650px] flex flex-col justify-center py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://wahanadata.co.id/wp-content/uploads/2025/01/91ff19eb-9bae-41be-bd79-86c09efa26ae.jpg"
          alt=""
          className="w-full h-full object-cover brightness-[0.25]"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-primary/5 to-slate-900/90" />
        
        {/* Animated Overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-1.5 bg-primary rounded-full"
          />
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
            Kepercayaan Klien{' '}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-primary italic"
            >
              Terhadap Kami
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed"
          >
            Dengan pengalaman selama 18 tahun, kami membangun kolaborasi strategis untuk organisasi pemerintah dan juga sektor swasta.
          </motion.p>
        </motion.div>
      </div>

      <div className="relative z-20 mt-20 w-full">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Navigation Buttons */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('left')}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll('right')}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-2xl"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Logo Marquee Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-[40px] border border-white/5 bg-white shadow-2xl"
          >
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth py-12 px-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                animate={isPaused ? {} : { x: [0, -3200] }}
                transition={{
                  duration: 50,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex items-center gap-12"
              >
                {doubledLogos.map((logo, index) => (
                  <motion.div
                    key={index}
                    variants={logoVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex-shrink-0 w-40 h-24 flex items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer border border-slate-100"
                  >
                    <img
                      src={logo.url}
                      alt={logo.name}
                      title={logo.name}
                      className="max-w-full max-h-full object-contain transition-all duration-500"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
