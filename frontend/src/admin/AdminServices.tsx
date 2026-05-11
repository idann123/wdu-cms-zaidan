import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  updatedAt: string;
}

interface Page {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  isPublished: boolean;
  updatedAt: string;
}

const iconOptions = [
  'terminal', 'query_stats', 'insights', 'celebration', 'folder_open',
  'cloud', 'analytics', 'campaign', 'support_agent', 'groups',
  'bar_chart', 'inventory_2', 'settings', 'shield', 'hub',
];

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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function AdminServices() {
  const user = useAuthStore((state) => state.user);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'inventory_2' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'reorder' | 'detail'>('grid');
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Pages state for Detail Services tab
  const [pages, setPages] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isSavingPage, setIsSavingPage] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services');
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      setPagesLoading(true);
      const { data } = await api.get('/pages');
      setPages(data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setPagesLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (viewMode === 'detail') {
      fetchPages();
    }
  }, [viewMode]);

  const handleToggleActive = async (svc: Service) => {
    const newStatus = !svc.isActive;
    try {
      const { data } = await api.put(`/services/${svc.id}`, {
        ...svc,
        isActive: newStatus,
      });
      setServices((prev) => prev.map((s) => (s.id === svc.id ? data : s)));
      if (selected?.id === svc.id) setSelected(data);
      showToast('success', `Service ${newStatus ? 'enabled' : 'disabled'}!`);
      logActivity({
        action: newStatus ? 'Mengaktifkan' : 'Menonaktifkan',
        actor: user?.name || user?.email || 'Admin',
        target: svc.title,
        section: 'Services',
        page: 'Admin Panel',
        type: 'admin',
      });
    } catch {
      showToast('error', 'Failed to change service status.');
    }
  };

  const handleCreateNew = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showToast('error', 'Nama dan deskripsi layanan wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post('/services', form);
      setServices((prev) => [...prev, data]);
      setIsCreating(false);
      setForm({ title: '', description: '', icon: 'inventory_2' });
      showToast('success', 'Service created successfully!');
      logActivity({
        action: 'Membuat',
        actor: user?.name || user?.email || 'Admin',
        target: form.title,
        section: 'Services',
        page: 'Admin Panel',
        type: 'admin',
        detail: form.description?.slice(0, 60),
      });
    } catch {
      showToast('error', 'Failed to create service.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/services/${selected.id}`, selected);
      setServices((prev) => prev.map((s) => (s.id === selected.id ? data : s)));
      setSelected(null);
      showToast('success', 'Service updated successfully!');
      logActivity({
        action: 'Updating',
        actor: user?.name || user?.email || 'Admin',
        target: selected.title,
        section: 'Services',
        page: 'Admin Panel',
        type: 'admin',
      });
    } catch {
      showToast('error', 'Failed to update service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const target = services.find(s => s.id === id);
    setDeleting(id);
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setShowDeleteConfirm(null);
      if (selected?.id === id) setSelected(null);
      showToast('success', 'Service deleted successfully!');
      logActivity({
        action: 'Menghapus',
        actor: user?.name || user?.email || 'Admin',
        target: target?.title || id,
        section: 'Services',
        page: 'Admin Panel',
        type: 'admin',
      });
    } catch {
      showToast('error', 'Failed to delete service.');
    } finally {
      setDeleting(null);
    }
  };

  const handleReorderServices = async (serviceToRemove: Service | null) => {
    if (serviceToRemove) {
      setServices((prev) => prev.filter((s) => s.id !== serviceToRemove.id));
    }
    setReordering(true);
    try {
      const payload = { orders: services.map((s, idx) => ({ id: s.id, order: idx })) };
      await api.put('/services/reorder', payload);
      showToast('success', 'Service order saved!');
    } catch {
      showToast('error', 'Failed to save order.');
      fetchServices();
    } finally {
      setReordering(false);
    }
  };

  const handleUpdatePage = async () => {
    if (!editingPage) return;
    setIsSavingPage(true);
    try {
      await api.put(`/pages/${editingPage.slug}`, editingPage);
      showToast('success', 'Halaman berhasil diperbarui!');
      fetchPages();
      setEditingPage(null);
    } catch (err) {
      showToast('error', 'Failed to update page.');
    } finally {
      setIsSavingPage(false);
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      const newStatus = !page.isPublished;
      await api.patch(`/pages/${page.slug}/publish`, { isPublished: newStatus });
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, isPublished: newStatus } : p));
      showToast('success', newStatus ? 'Halaman sudah di-publish!' : 'Halaman di-unpublish!');
    } catch (err) {
      showToast('error', 'Failed to change status.');
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 ${
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

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Services Inventory</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-body max-w-lg">
            Manage WDU's core services. Each entry represents a key operational pillar of the company.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/30"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Service
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 bg-surface-container-low rounded-xl p-1 w-fit"
      >
        {(['grid', 'detail', 'reorder'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              viewMode === mode 
                ? 'bg-primary text-white shadow-md' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {mode === 'grid' ? 'Inventory' : mode === 'detail' ? 'Detail Services' : 'Urutkan'}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'grid' && (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-48 bg-surface-container-low rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-3xl">inventory_2</span>
                </div>
                <h3 className="text-lg font-black text-on-surface mb-2">No Services Yet</h3>
                <p className="text-sm text-on-surface-variant mb-6">Add your first service to get started.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
                >
                  + Add Service
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={itemVariants}
                    layoutId={`svc-${service.id}`}
                    onClick={() => setSelected(service)}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                    className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-transparent hover:border-primary cursor-pointer transition-all group relative"
                  >
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="absolute top-4 right-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(service); }}
                        className="p-1.5 bg-white rounded-lg shadow-md hover:bg-primary hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(service); }}
                        className={`p-1.5 rounded-lg shadow-md transition-all ${service.isActive ? 'hover:bg-orange-100 hover:text-orange-600' : 'hover:bg-green-100 hover:text-green-600'}`}
                      >
                        <span className="material-symbols-outlined text-lg">{service.isActive ? 'pause' : 'play_arrow'}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(service.id); }}
                        className="p-1.5 bg-white rounded-lg shadow-md hover:bg-error hover:text-white transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {service.icon || 'business'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{service.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {service.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {new Date(service.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}

          {viewMode === 'reorder' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 shadow-sm"
            >
              <div className="flex items-center justify-end mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReorderServices(null)}
                  disabled={reordering}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-lg">{reordering ? 'sync' : 'save'}</span>
                  {reordering ? 'Saving...' : 'Save Order'}
                </motion.button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-surface-container-low rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <DragDropContext onDragEnd={(result) => {
                  if (!result.destination) return;
                  const items = Array.from(services);
                  const [reordered] = items.splice(result.source.index, 1);
                  items.splice(result.destination.index, 0, reordered);
                  setServices(items);
                }}>
                  <Droppable droppableId="services">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {services.map((service, index) => (
                          <Draggable key={service.id} draggableId={service.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border-2 transition-all ${
                                  snapshot.isDragging ? 'shadow-xl border-primary bg-surface-container' : 'border-transparent'
                                }`}
                              >
                                <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary text-xs font-black">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-on-surface text-sm">{service.title}</h4>
                                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{service.description}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </motion.div>
          )}

          {viewMode === 'detail' && (
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative max-w-md"
              >
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input 
                  type="text" 
                  placeholder="Search detail pages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm w-full shadow-sm"
                />
              </motion.div>

              {pagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-48 bg-surface-container-low rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/50">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">description</span>
                  <h3 className="text-lg font-black text-on-surface mt-4">No Pages Found</h3>
                  <p className="text-sm text-on-surface-variant">Detail pages not found.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPages.map((page) => (
                    <motion.div 
                      key={page.id} 
                      variants={itemVariants}
                      className="bg-surface-container-lowest rounded-[28px] border border-outline-variant/10 p-6 hover:border-primary/30 hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTogglePublish(page)}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            page.isPublished 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {page.isPublished ? 'Published' : 'Draft'}
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-surface-container-low text-primary rounded-2xl group-hover:rotate-12 transition-transform">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-on-surface truncate group-hover:text-primary transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-tighter">
                            /{page.slug === 'home' ? '' : page.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                           Update: {new Date(page.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <motion.button 
                          whileHover={{ scale: 1.1, x: 2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingPage(page)}
                          className="flex items-center gap-1 text-primary font-black text-[10px] uppercase tracking-wider"
                        >
                          Metadata
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals with AnimatePresence */}
      <AnimatePresence>
        {editingPage && (
          <motion.div 
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
          >
            <motion.div variants={backdropVariants} className="absolute inset-0" onClick={() => setEditingPage(null)} />
            <motion.div variants={modalVariants} className="bg-surface-container-lowest rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Page Metadata</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{editingPage.title}</p>
                </div>
                <button onClick={() => setEditingPage(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-5">
                {[
                   { label: 'Page Title', key: 'title', type: 'text' },
                   { label: 'Slug / URL', key: 'slug', type: 'text' },
                   { label: 'Meta SEO Title', key: 'metaTitle', type: 'text' },
                   { label: 'Meta SEO Description', key: 'metaDesc', type: 'textarea' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2 ml-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={(editingPage as any)[field.key] || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, [field.key]: e.target.value })}
                        className="w-full p-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm font-medium transition-all"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={(editingPage as any)[field.key] || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, [field.key]: e.target.value })}
                        className="w-full p-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm font-bold transition-all"
                      />
                    )}
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdatePage}
                  disabled={isSavingPage}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
                >
                    {isSavingPage ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {(isCreating || selected) && (
          <motion.div 
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
          >
            <motion.div variants={backdropVariants} className="absolute inset-0" onClick={() => { setIsCreating(false); setSelected(null); }} />
            <motion.div variants={modalVariants} className="bg-surface-container-lowest rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">
                    {isCreating ? 'Add Service' : 'Edit Service'}
                  </h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">
                      Business Pillar Information
                    </p>
                </div>
                <button onClick={() => { setIsCreating(false); setSelected(null); }} className="p-2 hover:bg-surface-container rounded-full">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Service Name</label>
                  <input
                    type="text"
                    value={selected ? selected.title : form.title}
                    onChange={(e) => selected ? setSelected({ ...selected, title: e.target.value }) : setForm({ ...form, title: e.target.value })}
                    className="w-full p-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-on-surface shadow-inner"
                    placeholder="Example: Digital Marketing"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea
                    value={selected ? selected.description : form.description}
                    onChange={(e) => selected ? setSelected({ ...selected, description: e.target.value }) : setForm({ ...form, description: e.target.value })}
                    className="w-full p-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none text-sm font-medium shadow-inner"
                    rows={4}
                    placeholder="Explain the service value proposition..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4 ml-1">Select Icon</label>
                  <div className="grid grid-cols-5 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {iconOptions.map((icon) => {
                      const isActive = (selected ? selected.icon : form.icon) === icon;
                      return (
                        <motion.button
                          key={icon}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => selected ? setSelected({ ...selected, icon }) : setForm({ ...form, icon })}
                          className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-center ${
                            isActive ? 'border-primary bg-primary text-on-primary shadow-lg shadow-primary/20' : 'border-transparent bg-surface-container-low text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>{icon}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {!isCreating && selected && (
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(224, 46, 46, 0.1)" }}
                      onClick={() => setShowDeleteConfirm(selected.id)}
                      className="px-6 py-4 rounded-2xl border-2 border-error/20 text-error font-black text-xs uppercase tracking-widest"
                    >
                      Delete
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isCreating ? handleCreateNew : handleUpdate}
                    disabled={saving}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 disabled:opacity-50"
                  >
                    {saving ? 'Processing...' : isCreating ? 'Create Service' : 'Save Changes'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirm && (
          <motion.div 
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div variants={backdropVariants} className="absolute inset-0" onClick={() => setShowDeleteConfirm(null)} />
            <motion.div variants={modalVariants} className="bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
              <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-2">Delete Service?</h3>
              <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                This action is permanent. Make sure you have backed up the data if needed.
              </p>
              <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-surface-container font-bold text-sm text-on-surface transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} disabled={!!deleting} className="flex-1 py-3 rounded-xl bg-error text-white font-bold text-sm hover:bg-red-600 transition-colors">
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}