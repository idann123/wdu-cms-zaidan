import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultHero = {
  badgeText: 'Enterprise Data Intelligence',
  headline: 'Transforming Complex Information into Strategic Advantage.',
  description: 'Wahana Data Utama delivers precise IT consulting and deep-dive research for B2B leaders. We bridge the gap between raw data and actionable organizational intelligence.',
  carouselImages: [
    'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg',
    'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-scaled-r0gn5zclhzniq0rcdzfe7k85fdqhwh6ngb7cl7exi8.jpg',
    'https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg',
  ],
  ctaText: 'Explore Solutions',
  ctaLink: '#',
  secondaryCtaText: 'View Research Lab',
  secondaryCtaLink: '#'
};

export default function Hero() {
  const [heroData, setHeroData] = useState(defaultHero);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const stored = localStorage.getItem('wdu_admin_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.heroes?.home) {
          const h = parsed.heroes.home;
          setHeroData({
            ...defaultHero,
            badgeText: h.badgeText || defaultHero.badgeText,
            headline: Array.isArray(h.headline) ? h.headline.join(' ') : (h.headline || defaultHero.headline),
            description: h.description || defaultHero.description,
            carouselImages: h.carouselImages?.length ? h.carouselImages : defaultHero.carouselImages,
            ctaText: h.ctaText || defaultHero.ctaText,
            ctaLink: h.ctaLink || defaultHero.ctaLink
          });
        }
      } catch (e) {
        console.error("Failed to parse hero settings", e);
      }
    }
  }, []);

  const clearInterval_ = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const startInterval = () => {
    clearInterval_();
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroData.carouselImages.length);
    }, 6000);
  };

  useEffect(() => {
    if (heroData.carouselImages.length <= 1 || isPaused) {
      clearInterval_();
      return;
    }
    startInterval();
    return clearInterval_;
  }, [heroData.carouselImages.length, isPaused]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    if (!isPaused) startInterval();
  };

  return (
    <section
      className="relative min-h-[800px] lg:min-h-[921px] flex items-center overflow-hidden bg-[#123b1b]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Carousel with Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            alt=""
            className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
            src={heroData.carouselImages[currentSlide]}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#123b1b]/80 via-[#123b1b]/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-10 xl:col-span-8 flex flex-col justify-center"
        >
          {/* Precise Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6ffb85]/10 border border-[#6ffb85]/30 rounded-full w-fit mb-10 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[18px] text-[#6ffb85]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
            <span className="font-label-bold text-[12px] text-[#6ffb85] uppercase tracking-[0.2em] font-bold">
              {heroData.badgeText}
            </span>
          </div>

          {/* Bold Headline */}
          <h1 className="font-headline-xl text-5xl md:text-7xl lg:text-8xl text-white mb-8 max-w-4xl font-extrabold leading-[1.1] tracking-tight">
            {heroData.headline}
          </h1>

          {/* Refined Description */}
          <p className="font-body-lg text-lg md:text-xl text-white/70 mb-12 max-w-2xl leading-relaxed">
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#6ffb85] text-[#002107] px-10 py-5 font-bold uppercase tracking-wider text-sm hover:bg-[#53e16f] transition-all flex items-center gap-3 shadow-xl shadow-[#6ffb85]/20 group">
              {heroData.ctaText}
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <button className="border border-white/30 text-white hover:bg-white/10 px-10 py-5 font-bold uppercase tracking-wider text-sm transition-all backdrop-blur-sm">
              {heroData.secondaryCtaText}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      {heroData.carouselImages.length > 1 && (
        <>
          <motion.button
            onClick={() => handleDotClick((currentSlide - 1 + heroData.carouselImages.length) % heroData.carouselImages.length)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-2xl"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            onClick={() => handleDotClick((currentSlide + 1) % heroData.carouselImages.length)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-2xl"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </>
      )}

      {/* Dot Indicators */}
      {heroData.carouselImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {heroData.carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                ? 'bg-[#6ffb85] w-3 h-3 shadow-lg shadow-[#6ffb85]/30'
                : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative Light Streak */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#6ffb85]/5 to-transparent pointer-events-none"></div>
    </section>
  );
}
