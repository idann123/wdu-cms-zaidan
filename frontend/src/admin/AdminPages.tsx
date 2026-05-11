import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Edit2, ExternalLink, Eye, AlertCircle, X,
  XCircle, Save, FolderOpen, 
  LayoutGrid, Layers
} from 'lucide-react';
import api from '../services/api';
import { usePages } from '../context/PageContext';

interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  isPublished: boolean;
  updatedAt: string;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftPage, setDraftPage] = useState<Page | null>(null);
  const { refreshPages } = usePages();

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPages = async () => {
    try {
      const { data } = await api.get('/pages');
      setPages(data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      showToast('error', 'Failed to fetch page data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleUpdatePage = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    try {
      await api.put(`/pages/${editingPage.slug}`, editingPage);
      showToast('success', 'Page updated successfully!');
      fetchPages();
      await refreshPages();
      setEditingPage(null);
    } catch (err) {
      console.error('Failed to update page:', err);
      showToast('error', 'Failed to update page.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      const newStatus = !page.isPublished;
      console.log(`[AdminPages] Toggling ${page.slug} to isPublished=${newStatus}`);
      
      const response = await api.patch(`/pages/${page.slug}/publish`, { isPublished: newStatus });
      console.log('[AdminPages] API Response:', response.data);
      
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, isPublished: newStatus } : p));
      
      await refreshPages();
      
      showToast('success', newStatus ? 'Page published!' : 'Page unpublished!');
    } catch (err: any) {
      console.error('[AdminPages] Failed to toggle publish:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      showToast('error', 'Failed: ' + errorMsg);
      
      fetchPages();
    }
  };

  const handlePreview = async (page: Page) => {
    if (page.isPublished) {
      window.open(`/${page.slug === 'home' ? '' : page.slug}`, '_blank');
    } else {
      setDraftPage(page);
      setShowDraftModal(true);
    }
  };

  const handlePublishAndPreview = async () => {
    if (!draftPage) return;
    try {
      await api.patch(`/pages/${draftPage.slug}/publish`, { isPublished: true });
      setPages(prev => prev.map(p => p.id === draftPage.id ? { ...p, isPublished: true } : p));
      await refreshPages();
      setShowDraftModal(false);
      setDraftPage(null);
      showToast('success', 'Page published successfully!');
      setTimeout(() => window.open(`/${draftPage.slug === 'home' ? '' : draftPage.slug}`, '_blank'), 300);
    } catch (err) {
      console.error('Failed to publish:', err);
      showToast('error', 'Failed to publish page.');
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  ).filter(p => !['system-reminder'].includes(p.slug));

  const PageCard = ({ page }: { page: Page }) => (
    <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group relative shadow-xl shadow-outline-variant/5">
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); handleTogglePublish(page); }}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
            page.isPublished 
              ? 'bg-primary text-white shadow-primary/20' 
              : 'bg-on-surface-variant/40 text-white'
          }`}
        >
          {page.isPublished ? 'Published' : 'Draft'}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handlePreview(page); }}
          className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-secondary text-white hover:opacity-90 transition-all flex items-center gap-1 shadow-sm shadow-secondary/20"
        >
          <Eye size={12} /> Preview
        </button>
      </div>

      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary/10 transition-colors">
          <FileText size={22} className="stroke-[2.5px]" />
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setEditingPage(page)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            title="Edit Metadata"
          >
            <Edit2 size={16} />
          </button>
          <a 
            href={page.slug === 'home' ? '/' : `/${page.slug}`} 
            target="_blank" 
            rel="noreferrer"
            className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
            title="View Live"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div>
        <h3 className="font-black text-on-surface text-base tracking-tight mb-1 group-hover:text-primary transition-colors">
          {page.title}
        </h3>
        <p className="inline-block text-[10px] font-mono text-on-surface-variant group-hover:text-on-surface uppercase tracking-tighter mb-4 bg-surface-container px-2 py-0.5 rounded-full">
          /{page.slug === 'home' ? '' : page.slug}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        <div className="flex items-center gap-1.5">
          {page.isPublished ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span>Published</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-on-surface-variant/50"></div>
              <span>Draft</span>
            </div>
          )}
        </div>
        <span className="text-[9px] text-on-surface-variant/30 font-bold group-hover:text-on-surface-variant transition-colors uppercase">
          {new Date(page.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Toast */}
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

      {/* Draft Preview Modal */}
      <AnimatePresence>
        {showDraftModal && draftPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
              exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
              className="bg-surface-container-lowest rounded-[2.5rem] p-8 max-w-md w-full mx-4 shadow-2xl border border-outline-variant/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="text-amber-600 dark:text-amber-400" size={28} />
                </div>
                <button
                  onClick={() => { setShowDraftModal(false); setDraftPage(null); }}
                  className="p-2 hover:bg-surface-container hover:text-on-surface rounded-xl transition-all text-on-surface-variant"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black text-on-surface tracking-tight mb-2">Page Not Published</h3>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
                The page <strong>{draftPage.title}</strong> is currently in <strong>Draft</strong> status. You need to publish the page first to view it live.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDraftModal(false); setDraftPage(null); }}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-bold text-sm hover:bg-surface-container hover:border-outline-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishAndPreview}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  Publish & View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-primary" />
            <span className="text-primary font-black text-[10px] tracking-widest uppercase">CMS Content Architecture</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Platform Pages</h1>
          <p className="text-on-surface-variant text-sm mt-1 max-w-xl">Manage all static content structure and SEO metadata in one organized panel.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary/50 transition-all font-bold w-full md:w-64 text-on-surface"
            />
          </div>
        </div>
      </motion.div>

      {/* FOLDER: HALAMAN DETAIL */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <FolderOpen size={18} />
          </div>
          <h2 className="text-lg font-black text-on-surface tracking-tight">Detail Pages (Deep Links)</h2>
          <span className="bg-secondary/5 text-secondary px-2 py-0.5 rounded-full text-[10px] font-black uppercase">{filteredPages.length} Pages</span>
        </div>
        
{loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-surface-container animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">inbox</span>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Folder Empty</p>
            </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPages.map(page => <PageCard key={page.id} page={page} />)}
          </motion.div>
        )}
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-end bg-black/30 backdrop-blur-md"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-surface-container-lowest h-full w-full max-w-lg shadow-2xl p-8 flex flex-col"
            >
              <header className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Configuration Metadata</h3>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-1">Ref: {editingPage.slug.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setEditingPage(null)}
                  className="p-2 hover:bg-error/10 hover:text-error rounded-xl transition-all text-on-surface-variant"
                >
                  <XCircle size={24} />
                </button>
              </header>

              <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Display Title</label>
                  <input 
                    type="text" 
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                    className="w-full p-4 bg-surface-container-low hover:bg-surface-container border-2 border-transparent rounded-2xl text-sm font-bold text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t-2 border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid size={14} className="text-primary" />
                    <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">SEO Optimization</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Meta Title Tag</label>
                    <input 
                      type="text" 
                      value={editingPage.metaTitle}
                      onChange={(e) => setEditingPage({...editingPage, metaTitle: e.target.value})}
                      className="w-full p-4 bg-surface-container-low hover:bg-surface-container border-2 border-transparent rounded-2xl text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      placeholder="WDU - Wahana Data Utama"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Meta Description</label>
                    <textarea 
                      value={editingPage.metaDesc}
                      rows={4}
                      onChange={(e) => setEditingPage({...editingPage, metaDesc: e.target.value})}
                      className="w-full p-4 bg-surface-container-low hover:bg-surface-container border-2 border-transparent rounded-2xl text-sm font-medium text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                      placeholder="Deskripsi singkat halaman..."
                    />
                    <div className="flex justify-between px-1">
                      <p className="text-[9px] text-on-surface-variant italic">Disarankan maksimal 160 karakter.</p>
                      <p className={`text-[10px] font-bold ${editingPage.metaDesc.length > 160 ? 'text-error' : 'text-primary'}`}>
                        {editingPage.metaDesc.length}/160
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-outline-variant/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-on-surface uppercase tracking-widest mb-1">Visibility Status</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">Aktifkan untuk menampilkan halaman ke publik.</p>
                  </div>
                  <div 
                    onClick={() => setEditingPage({...editingPage, isPublished: !editingPage.isPublished})}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${editingPage.isPublished ? 'bg-primary' : 'bg-surface-container-high'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${editingPage.isPublished ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <footer className="mt-10 pt-6 border-t-2 border-outline-variant/10 flex gap-4">
                <button 
                  onClick={() => setEditingPage(null)}
                  className="flex-1 py-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-2xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdatePage}
                  disabled={isSaving}
                  className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
                >
                  {isSaving ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      <Save size={18} /> Update Content
                    </>
                  )}
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
