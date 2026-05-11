import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';

const defaultTimeline = [
  { year: "2024", logos: [
    { name: 'Kementerian ESDM', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/esdm-qzsnluwm095tgkmzgmxqlw3rrz56acfjho7xuw2dq4.png', isActive: true },
    { name: 'Kemenperin', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenperin-qzsnlynyrlayr0hiuok8vv5m5imn54ugu6tvrzwt18.png', isActive: true },
    { name: 'BUMN', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bumn-qzsn7zsb786k7mrzf56ubw20cdh9r2e2l1t40ymfi4.png', isActive: true },
    { name: 'BPJS', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bps-qzsmwqnvdmrz7p4g4s2mz8acbay2liprdcmu6pb3zw.png', isActive: true },
    { name: 'Badan POM', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpom-qzsmvfnxvwzn370pr7raik5am1dpwnj6iw0k6v8sn0.png', isActive: true },
    { name: 'BKPM', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-qzsmr5ier34m758mrd4h5n1p6uhiuaj79p0xhhlczg.png', isActive: true },
    { name: 'Bank Indonesia', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bank-indonesia-qzsmr4kkk93bvj9zwupul5a8lgm5mlfgxkdg07mr5o.png', isActive: true },
    { name: 'Pemkab Bangka Selatan', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bangka-selatan-1-qzsmd5owzvyxc5kghbcg166msbgs8iz2ofco96cdmk.png', isActive: true },
    { name: 'KOMDIGI', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/komdigi-qzsnm1hhc3etpudfe7s4lcfzxo8qs85nuksc7tsmik.png', isActive: true },
    { name: 'OJK', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png', isActive: true },
    { name: 'KPK', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png', isActive: true },
    { name: 'Pemkot Bogor', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png', isActive: true },
    { name: 'KLHK', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png', isActive: true },
    { name: 'RISTEK', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png', isActive: true },
    { name: 'KEMENKOPUKM', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png', isActive: true },
    { name: 'Provinsi DKI Jakarta', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png', isActive: true },
    { name: 'Kementerian PUPR', img: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/pupr-qzsnm58u3fjz0a7ys9emvbhub7q7n0kl73ea4xn1to.png', isActive: true },
  ]},
  { year: "2023", logos: [
    { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png", isActive: true },
    { name: "STM Yogya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-300x300.png", isActive: true },
    { name: "Transpakuan", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-300x300.png", isActive: true },
    { name: "Paljaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png", isActive: true },
    { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png", isActive: true },
  ]},
  { year: "2022", logos: [
    { name: "BUMN", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-300x300.png", isActive: true },
    { name: "Jakarta", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-300x300.png", isActive: true },
    { name: "KPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png", isActive: true },
    { name: "Perpusnas", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/perpusnas-square-300x300.png", isActive: true },
    { name: "Blora", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/blora-square-300x300.png", isActive: true },
    { name: "Injiniring", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/injiniring-square-300x300.png", isActive: true },
    { name: "Pakuan Jaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-300x300.png", isActive: true },
    { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-300x300.png", isActive: true },
    { name: "BKPM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-300x300.png", isActive: true },
  ]},
  { year: "2021", logos: [
    { name: "BPOM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-300x205.png", isActive: true },
    { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png", isActive: true },
    { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png", isActive: true },
    { name: "KPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png", isActive: true },
    { name: "Kemendes", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png", isActive: true },
    { name: "Pakuan Jaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-300x300.png", isActive: true },
    { name: "BKPM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-300x300.png", isActive: true },
  ]},
  { year: "2020", logos: [
    { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png", isActive: true },
    { name: "Kemendes", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png", isActive: true },
  ]},
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.2 }
  }
};

export default function AdminTimeline() {
  const { user } = useAuthStore();
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [editingLogo, setEditingLogo] = useState<{yearIndex: number, logoIndex: number} | null>(null);
  const [logoForm, setLogoForm] = useState({ name: '', img: '', isActive: true });
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{yearIndex: number, logoIndex: number, name: string} | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const saveTimeline = (data: any[]) => {
    let parsed: any = {};
    const stored = localStorage.getItem('wdu_admin_settings');
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch (e) {
        parsed = {};
      }
    }
    parsed.generalSetting = parsed.generalSetting || {};
    parsed.generalSetting.timeline = data;
    localStorage.setItem('wdu_admin_settings', JSON.stringify(parsed));
  };

  useEffect(() => {
    const stored = localStorage.getItem('wdu_admin_settings');
    let finalTimeline = defaultTimeline;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const storedTimeline = parsed.generalSetting?.timeline;
        
        if (storedTimeline && storedTimeline.length > 0) {
          const storedYears = storedTimeline.map((t: any) => t.year);
          const missingYears = defaultTimeline.filter(d => !storedYears.includes(d.year));
          
          if (missingYears.length > 0) {
            finalTimeline = [...missingYears, ...storedTimeline].sort((a, b) => b.year.localeCompare(a.year));
            saveTimeline(finalTimeline);
          } else {
            finalTimeline = storedTimeline;
          }
        } else {
          saveTimeline(defaultTimeline);
        }
      } catch (e) {
        saveTimeline(defaultTimeline);
      }
    } else {
      saveTimeline(defaultTimeline);
    }
    
    setTimelineData(finalTimeline);
    setIsLoaded(true);
  }, []);

  const addTimelineYear = () => {
    const newData = [{ year: new Date().getFullYear().toString(), logos: [] }, ...timelineData];
    setTimelineData(newData);
    saveTimeline(newData);
    showToast('success', 'Year added.');
    logActivity({
      action: 'Create',
      actor: user?.name || user?.email || 'Admin',
      target: `Timeline — Year ${new Date().getFullYear()}`,
      section: 'Timeline',
      page: 'Admin Panel',
      type: 'public',
    });
  };

  const syncFromPartners = () => {
    const storedPartners = localStorage.getItem('wdu_admin_partners');
    let partnersData = [];
    if (storedPartners) {
      try {
        partnersData = JSON.parse(storedPartners);
      } catch (e) {
        partnersData = [];
      }
    }
    
    if (partnersData.length === 0) {
      showToast('error', 'No partner data saved yet.');
      return;
    }

    const activePartners = partnersData.filter((p: any) => p.isActive).map((p: any) => ({
      name: p.name,
      img: p.logoUrl,
      isActive: true
    }));

    if (activePartners.length === 0) {
      showToast('error', 'No active partners to synchronize.');
      return;
    }

    const currentYear = new Date().getFullYear().toString();
    let newData = [...timelineData];
    const yearIndex = newData.findIndex(t => t.year === currentYear);
    
    if (yearIndex >= 0) {
      const existingNames = newData[yearIndex].logos.map((l: any) => l.name);
      const newLogos = activePartners.filter((p: any) => !existingNames.includes(p.name));
      newData[yearIndex].logos = [...newLogos, ...newData[yearIndex].logos];
    } else {
      newData = [{ year: currentYear, logos: activePartners }, ...newData];
    }
    
    setTimelineData(newData);
    saveTimeline(newData);
    showToast('success', `Successfully synchronized ${activePartners.length} partners to year ${currentYear}.`);
    logActivity({
      action: 'Synchronize',
      actor: user?.name || user?.email || 'Admin',
      target: `Timeline ${currentYear} dengan Partner`,
      section: 'Timeline',
      page: 'Admin Panel',
      type: 'system',
    });
  };

  const removeTimelineYear = (index: number) => {
    const year = timelineData[index]?.year;
    const newData = timelineData.filter((_: any, i: number) => i !== index);
    setTimelineData(newData);
    saveTimeline(newData);
    showToast('success', 'Year deleted.');
    logActivity({
      action: 'Deleting',
      actor: user?.name || user?.email || 'Admin',
      target: `Timeline — Year ${year}`,
      section: 'Timeline',
      page: 'Admin Panel',
      type: 'public',
    });
  };

  const updateTimelineYear = (index: number, value: string) => {
    const newData = timelineData.map((item: any, i: number) =>
      i === index ? { ...item, year: value } : item
    );
    setTimelineData(newData);
    saveTimeline(newData);
  };

  const addTimelineLogo = (yearIndex: number) => {
    const newData = timelineData.map((item: any, i: number) =>
      i === yearIndex ? { ...item, logos: [{ name: "New Client", img: "", isActive: true }, ...item.logos] } : item
    );
    setTimelineData(newData);
    saveTimeline(newData);
      showToast('success', 'Logo added.');
  };

  const toggleTimelineLogo = (yearIndex: number, logoIndex: number) => {
    const newData = timelineData.map((item: any, i: number) =>
      i === yearIndex ? {
        ...item,
        logos: item.logos.map((logo: any, j: number) =>
          j === logoIndex ? { ...logo, isActive: !logo.isActive } : logo
        )
      } : item
    );
    setTimelineData(newData);
    saveTimeline(newData);
  };

  const openEditLogo = (yearIndex: number, logoIndex: number) => {
    const logo = timelineData[yearIndex]?.logos?.[logoIndex];
    if (!logo) return;
    setEditingLogo({ yearIndex, logoIndex });
    setLogoForm({ name: logo.name || '', img: logo.img || '', isActive: logo.isActive !== false });
    setShowLogoModal(true);
  };

  const handleSaveLogo = () => {
    if (!editingLogo) return;
    const { yearIndex, logoIndex } = editingLogo;
    const year = timelineData[yearIndex]?.year;
    const newData = timelineData.map((item: any, i: number) =>
      i === yearIndex ? {
        ...item,
        logos: item.logos.map((logo: any, j: number) =>
          j === logoIndex ? { name: logoForm.name, img: logoForm.img, isActive: logoForm.isActive } : logo
        )
      } : item
    );
    setTimelineData(newData);
    saveTimeline(newData);
    setShowLogoModal(false);
    setEditingLogo(null);
    showToast('success', 'Logo saved.');
    logActivity({
      action: 'Update',
      actor: user?.name || user?.email || 'Admin',
      target: `Timeline Logo: ${logoForm.name}`,
      section: 'Timeline',
      page: 'Admin Panel',
      type: 'public',
      detail: `Year ${year} | Status: ${logoForm.isActive ? 'Active' : 'Inactive'}`,
    });
  };

  const removeLogo = (yearIndex: number, logoIndex: number, name: string) => {
    setDeleteConfirm({ yearIndex, logoIndex, name });
  };

  const handleDeleteLogo = () => {
    if (!deleteConfirm) return;
    const { yearIndex, logoIndex, name } = deleteConfirm;
    const year = timelineData[yearIndex]?.year;
    const newData = timelineData.map((item: any, i: number) =>
      i === yearIndex ? { ...item, logos: item.logos.filter((_: any, j: number) => j !== logoIndex) } : item
    );
    setTimelineData(newData);
    saveTimeline(newData);
    setDeleteConfirm(null);
    showToast('success', 'Logo deleted.');
    logActivity({
      action: 'Delete',
      actor: user?.name || user?.email || 'Admin',
      target: `Timeline Logo: ${name}`,
      section: 'Timeline',
      page: 'Admin Panel',
      type: 'public',
      detail: `Year ${year}`,
    });
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-surface-container rounded-xl"></div>
        <div className="h-48 bg-surface-container rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">route</span>
          </div>
          <div>
            <h2 className="font-black text-on-surface tracking-tight text-2xl">Our Journey (Timeline)</h2>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-0.5">History & Achievement Management</p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={syncFromPartners} 
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-base">sync</span>
            Sync Partners
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTimelineYear} 
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add Year
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'}`}
          >
            <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-2">Delete Logo?</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed font-medium">Delete "{deleteConfirm.name}" from timeline?</p>
              <div className="flex gap-3">
                 <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-2xl bg-surface-container font-black text-xs uppercase tracking-widest text-on-surface">Cancel</button>
                 <button onClick={handleDeleteLogo} className="flex-1 py-3 rounded-2xl bg-error text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-error/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-on-surface tracking-tight">Edit Client Logo</h3>
                <button onClick={() => setShowLogoModal(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block ml-1">Client Name</label>
                  <input type="text" value={logoForm.name} onChange={(e) => setLogoForm({...logoForm, name: e.target.value})} className="w-full px-4 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm font-bold shadow-inner"                   placeholder="Client name" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2 block ml-1">Image URL</label>
                  <input type="text" value={logoForm.img} onChange={(e) => setLogoForm({...logoForm, img: e.target.value})} className="w-full px-4 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm font-medium shadow-inner" placeholder="https://..." />
                  {logoForm.img && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-surface-container-low rounded-2xl flex items-center justify-center border-2 border-dashed border-outline-variant/30 shadow-inner"
                    >
                      <img src={logoForm.img} alt="Preview" className="h-20 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </motion.div>
                  )}
                </div>
                <label className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl cursor-pointer hover:bg-surface-container transition-all shadow-inner">
                  <input type="checkbox" checked={logoForm.isActive} onChange={(e) => setLogoForm({...logoForm, isActive: e.target.checked})} className="w-5 h-5 accent-primary rounded" />
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface">Show on website</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                 <button onClick={() => setShowLogoModal(false)} className="flex-1 py-4 rounded-2xl border-2 border-outline-variant font-black text-xs uppercase tracking-widest text-on-surface">Cancel</button>
                 <button onClick={handleSaveLogo} className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {timelineData.map((yearData: any, yearIndex: number) => (
          <motion.section 
            key={yearIndex} 
            variants={itemVariants}
            layout
            className="bg-surface-container-lowest rounded-[40px] p-8 shadow-sm border border-outline-variant/10 hover:shadow-xl hover:shadow-on-surface/5 transition-all relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={yearData.year} 
                      onChange={(e) => updateTimelineYear(yearIndex, e.target.value)} 
                      className="font-black text-on-surface text-3xl bg-transparent border-none outline-none focus:text-primary transition-colors w-24 p-0 tracking-tighter" 
                      placeholder="2024" 
                    />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{yearData.logos?.length || 0} Clients</span>
                    {yearData.year === "2024" && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20">Featured Experience</span>
                    )}
                  </div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(224, 46, 46, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeTimelineYear(yearIndex)} 
                className="p-3 text-error rounded-2xl transition-colors" 
                 title="Delete Year"
              >
                <span className="material-symbols-outlined">delete</span>
              </motion.button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Client Directory</h4>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addTimelineLogo(yearIndex)} 
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                   Add Logo
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {(yearData.logos || []).map((logo: any, logoIndex: number) => (
                    <motion.div 
                      key={`${yearIndex}-${logoIndex}`} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className={`group relative rounded-[32px] overflow-hidden bg-surface-container-low/50 border-2 transition-all p-6 ${logo.isActive ? 'border-transparent hover:border-primary/20 hover:bg-primary/5 hover:shadow-lg' : 'border-error/20 opacity-60'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-surface-container-lowest shadow-inner flex items-center justify-center p-3 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          <img src={logo.img} alt={logo.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e3e0" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2372796e" font-size="10">No Logo</text></svg>'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-black text-on-surface truncate group-hover:text-primary transition-colors">{logo.name}</h5>
                          <div className="mt-2 flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${logo.isActive ? 'bg-primary' : 'bg-error'}`} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${logo.isActive ? 'text-primary' : 'text-error'}`}>
                               {logo.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => openEditLogo(yearIndex, logoIndex)} 
                          className="flex-1 py-2.5 bg-surface-container-highest rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleTimelineLogo(yearIndex, logoIndex)} 
                          className={`p-2.5 rounded-xl transition-all ${logo.isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-error/10 text-error hover:bg-error/20'}`}
                          title={logo.isActive ? 'Sembunyikan' : 'Tampilkan'}
                        >
                          <span className="material-symbols-outlined text-lg">{logo.isActive ? 'visibility' : 'visibility_off'}</span>
                        </button>
                        <button 
                          onClick={() => removeLogo(yearIndex, logoIndex, logo.name)} 
                          className="p-2.5 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {(yearData.logos || []).length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant/20 rounded-[32px] bg-surface-container-low/30"
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant/20">
                    <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">No logos registered yet</p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase tracking-tighter">Click "Add Logo" to start</p>
                </motion.div>
              )}
            </div>
          </motion.section>
        ))}
      </motion.div>

      {timelineData.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-outline-variant/20 rounded-[40px] bg-surface-container-low/30"
        >
          <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 text-on-surface-variant/10">
            <span className="material-symbols-outlined text-7xl">timeline</span>
          </div>
          <h3 className="text-2xl font-black text-on-surface mb-2 tracking-tight">Empty Timeline</h3>
          <p className="text-on-surface-variant text-sm font-medium mb-8 max-w-xs">Your business journey data has not been initialized. Start now!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTimelineYear} 
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30"
          >
            <span className="material-symbols-outlined">add</span>
            Inisialisasi Timeline
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}