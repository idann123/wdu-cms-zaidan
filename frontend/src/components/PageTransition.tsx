import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
    exit: {
    opacity: 0,
    y: -30,
    scale: 1.02,
    filter: 'blur(8px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setPrevPath(pathname);
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  const direction = pathname > prevPath ? 1 : -1;

  return (
    <>
      {/* Premium Loading Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
          >
            <div className="h-full bg-gradient-to-r from-primary via-green-400 to-primary relative overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.8, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curtain Overlay Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={direction}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Elegant Bottom Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none z-50"
      />

      {/* Corner Accent */}
      <motion.div
        initial={{ opacity: 0, x: 100, y: -100 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="fixed top-0 right-0 w-32 h-32 pointer-events-none z-40"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent" />
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-xs font-mono text-primary/60"
        >
          {pathname}
        </motion.div>
      </motion.div>
    </>
  );
}
