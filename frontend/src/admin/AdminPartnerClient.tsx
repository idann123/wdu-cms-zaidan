import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'wdu_admin_partners';
const defaultPartners: Partner[] = [
  { id: 'default-1', name: 'Kementerian ESDM', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/esdm-qzsnluwm095tgkmzgmxqlw3rrz56acfjho7xuw2dq4.png', website: 'https://esdm.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-2', name: 'Kemenperin', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenperin-qzsnlynyrlayr0hiuok8vv5m5imn54ugu6tvrzwt18.png', website: 'https://kemenperin.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-3', name: 'BUMN', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bumn-qzsn7zsb786k7mrzf56ubw20cdh9r2e2l1t40ymfi4.png', website: 'https://bumn.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-4', name: 'BPJS', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bps-qzsmwqnvdmrz7p4g4s2mz8acbay2liprdcmu6pb3zw.png', website: 'https://bpjs-kesehatan.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-5', name: 'Badan POM', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bpom-qzsmvfnxvwzn370pr7raik5am1dpwnj6iw0k6v8sn0.png', website: 'https://pom.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-6', name: 'BKPM', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-qzsmr5ier34m758mrd4h5n1p6uhiuaj79p0xhhlczg.png', website: 'https://bkpm.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-7', name: 'Bank Indonesia', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bank-indonesia-qzsmr4kkk93bvj9zwupul5a8lgm5mlfgxkdg07mr5o.png', website: 'https://bi.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-8', name: 'Pemkab Bangka Selatan', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bangka-selatan-1-qzsmd5owzvyxc5kghbcg166msbgs8iz2ofco96cdmk.png', website: '', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-9', name: 'KOMDIGI', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/komdigi-qzsnm1hhc3etpudfe7s4lcfzxo8qs85nuksc7tsmik.png', website: 'https://kominfo.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-10', name: 'OJK', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/ojk-qzsnm4azwliooo9bxr00atqdptuufbguuyqsnnofzw.png', website: 'https://ojk.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-11', name: 'KPK', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kpk-qzsnm3d5prhed2ap38ldqbyx4fzh7md4iu3b6dpu64.png', website: 'https://kpk.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-12', name: 'Pemkot Bogor', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kota-bogor-qzsnm2fbixg41gc28q6r5u7gj243zx9e6pftp3r8cc.png', website: 'https://bogorkota.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-13', name: 'KLHK', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/klh-qzsnm0jn59dje8esjpdi0uojcaddkj1xig4uqju0os.png', website: 'https://klhk.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-14', name: 'RISTEK', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenristek-qzsnlzlsyfc92mg5p6yvgcx2qwi0cty76bhd99vev0.png', website: 'https://ristek.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-15', name: 'KEMENKOPUKM', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kemenkopukm-qzsnlxq4kr9ofeiw065mbde5k4r9xfqqi26eapy77g.png', website: 'https://kemenkopukm.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-16', name: 'Provinsi DKI Jakarta', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/jakarta-qzsnlwsadx8e3sk95nqzqvmoyqvwpqn05xiwtfzldo.png', website: 'https://jakarta.go.id', isActive: true, createdAt: new Date().toISOString() },
  { id: 'default-17', name: 'Kementerian PUPR', logoUrl: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/pupr-qzsnm58u3fjz0a7ys9emvbhub7q7n0kl73ea4xn1to.png', website: 'https://pu.go.id', isActive: true, createdAt: new Date().toISOString() },
];

const emptyForm = {
  name: '',
  logoUrl: '',
  website: '',
  isActive: true,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
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

export default function AdminPartnerClient() {
  const { user } = useAuthStore();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadPartners = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPartners(JSON.parse(stored));
    } else {
      setPartners(defaultPartners);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPartners));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const saveToStorage = (data: Partner[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPartners(data);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (item: Partner) => {
    setEditing(item);
    setForm({
      name: item.name,
      logoUrl: item.logoUrl,
      website: item.website || '',
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.logoUrl.trim()) {
      showToast('error', 'Name and logo URL are required.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        const updated = partners.map((p) =>
          p.id === editing.id
            ? { ...p, name: form.name, logoUrl: form.logoUrl, website: form.website, isActive: form.isActive }
            : p
        );
        saveToStorage(updated);
        showToast('success', 'Partner successfully updated!');
        logActivity({
          action: 'Updating',
          actor: user?.name || user?.email || 'Admin',
          target: `Partner: ${form.name}`,
          section: 'Partner & Client',
          page: 'Admin Panel',
          type: 'public',
          detail: form.website ? `Website: ${form.website}` : undefined,
        });
      } else {
        const newItem: Partner = {
          id: `partner-${Date.now()}`,
          name: form.name,
          logoUrl: form.logoUrl,
          website: form.website,
          isActive: form.isActive,
          createdAt: new Date().toISOString(),
        };
        saveToStorage([...partners, newItem]);
        showToast('success', 'Partner successfully added!');
        logActivity({
          action: 'Membuat',
          actor: user?.name || user?.email || 'Admin',
          target: `Partner: ${form.name}`,
          section: 'Partner & Client',
          page: 'Admin Panel',
          type: 'public',
          detail: form.website ? `Website: ${form.website}` : undefined,
        });
      }
      setShowModal(false);
      setSaving(false);
    }, 300);
  };

  const handleDelete = (id: string) => {
    const target = partners.find(p => p.id === id);
    setDeleting(id);
    setTimeout(() => {
      const updated = partners.filter((p) => p.id !== id);
      saveToStorage(updated);
      showToast('success', 'Partner successfully deleted.');
      logActivity({
        action: 'Menghapus',
        actor: user?.name || user?.email || 'Admin',
        target: `Partner: ${target?.name || id}`,
        section: 'Partner & Client',
        page: 'Admin Panel',
        type: 'public',
      });
      setDeleting(null);
      setShowDeleteConfirm(null);
    }, 300);
  };

  const toggleStatus = (id: string) => {
    const target = partners.find(p => p.id === id);
    const newStatus = !target?.isActive;
    const updated = partners.map((p) =>
      p.id === id ? { ...p, isActive: newStatus } : p
    );
    saveToStorage(updated);
    showToast('success', 'Partner status successfully changed!');
    logActivity({
      action: newStatus ? 'Activate' : 'Deactivate',
      actor: user?.name || user?.email || 'Admin',
      target: `Partner: ${target?.name || id}`,
      section: 'Partner & Client',
      page: 'Admin Panel',
      type: 'public',
      detail: newStatus ? 'Status: Active' : 'Status: Inactive',
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-2">Delete Partner?</h3>
              <p className="text-sm text-on-surface-variant font-medium mb-8 leading-relaxed">
                This action cannot be undone. Partner data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl border border-outline-variant text-on-surface font-black text-xs uppercase tracking-widest hover:bg-surface-container transition-colors"
                >
                  Cancel
                 </button>
                 <button
                   onClick={() => handleDelete(showDeleteConfirm)}
                   disabled={!!deleting}
                   className="flex-1 py-3 rounded-2xl bg-error text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-error/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
                 >
                   {deleting ? '...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-surface-container-lowest rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">
                  {editing ? 'Edit Partner' : 'Add New Partner'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-8 py-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Nama Partner *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Partner/client name..."
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    URL Logo *
                  </label>
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-medium shadow-inner transition-all"
                  />
                  {form.logoUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-outline-variant/30 h-32 flex items-center justify-center p-4 shadow-inner"
                    >
                      <img
                        src={form.logoUrl}
                        alt="preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-medium shadow-inner transition-all"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl cursor-pointer hover:bg-surface-container transition-all shadow-inner">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface">Active Partner</span>
                </label>
              </div>
              <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 text-xs font-black uppercase tracking-[0.2em] bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                   {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Partner'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">Global Network</span>
          <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Partner & Client</h1>
           <p className="text-on-surface-variant text-sm mt-2 font-medium max-w-lg">
             Management of logos and profiles of strategic partners who have trusted their solutions to Wahana Data Utama.
           </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreate}
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add_business</span>
           Add Partner
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-[2rem] bg-surface-container-low animate-pulse" />
          ))}
        </div>
      ) : partners.length === 0 ? (
        <EmptyState onUpload={openCreate} />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {partners.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
              className={`group relative rounded-[2.5rem] overflow-hidden bg-surface-container-lowest border-2 transition-all p-6 flex flex-col h-full ${item.isActive ? 'border-transparent hover:border-primary/20' : 'border-error/10 opacity-60'}`}
            >
              <div className="flex flex-col items-center gap-6 mb-6 flex-1">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-inner flex items-center justify-center p-4 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e3e0" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2372796e" font-size="10">No Logo</text></svg>';
                    }}
                  />
                </div>
                <div className="text-center min-w-0 w-full">
                  <div className="flex flex-col items-center gap-2">
                    <h4 className="text-lg font-black font-headline text-on-surface truncate w-full leading-tight">{item.name}</h4>
                    {item.isActive ? (
                      <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                         Active
                      </span>
                    ) : (
                      <span className="bg-error/10 text-error text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                         Inactive
                      </span>
                    )}
                  </div>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-primary hover:underline truncate block mt-3 opacity-60 hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEdit(item)}
                  className="p-3 rounded-2xl bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-white transition-all shadow-sm"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleStatus(item.id)}
                  className={`p-3 rounded-2xl transition-all shadow-sm ${
                    item.isActive
                      ? 'bg-error/10 text-error hover:bg-error hover:text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  }`}
                  title={item.isActive ? 'Deactivate' : 'Activate'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.isActive ? 'visibility_off' : 'visibility'}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteConfirm(item.id)}
                  className="p-3 rounded-2xl bg-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
