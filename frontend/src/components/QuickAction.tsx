import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickActionProps {
  onNewProject?: () => void;
  onNewService?: () => void;
  onUploadMedia?: () => void;
}

const menuItems = [
  { label: 'New Project', icon: 'add_circle', action: 'onNewProject' },
  { label: 'New Service', icon: 'miscellaneous_services', action: 'onNewService' },
  { label: 'Upload Media', icon: 'cloud_upload', action: 'onUploadMedia' },
];

export default function QuickAction({ onNewProject, onNewService, onUploadMedia }: QuickActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'onNewProject':
        onNewProject?.();
        break;
      case 'onNewService':
        onNewService?.();
        break;
      case 'onUploadMedia':
        onUploadMedia?.();
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 mb-4"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                onClick={() => handleAction(item.action)}
                className="group flex items-center gap-3 bg-primary/10 backdrop-blur-xl rounded-full pl-4 pr-5 py-3 shadow-xl border border-primary/20 hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-xl text-primary">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold text-black whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 20px 25px -5px rgba(106, 177, 73, 0.4)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center overflow-hidden border-2 border-white"
        aria-label="Quick actions"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-white text-2xl">
            add
          </span>
        </motion.div>
      </motion.button>
    </div>
  );
}