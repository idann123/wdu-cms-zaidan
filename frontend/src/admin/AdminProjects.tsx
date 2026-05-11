import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Download } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  description: string | null;
  imageUrl: string | null;
  isHighlight: boolean;
  order: number;
  updatedAt: string;
}

const CATEGORIES = ['All', 'IT', 'Riset', 'EO', 'Analytics'];

const emptyForm = {
  title: '',
  client: '',
  category: 'IT',
  year: new Date().getFullYear(),
  description: '',
  imageUrl: '',
  isHighlight: false,
};

const categoryBadgeColor: Record<string, string> = {
  IT: 'bg-primary/10 text-primary',
  Riset: 'bg-secondary/10 text-secondary',
  EO: 'bg-tertiary/10 text-tertiary',
  Analytics: 'bg-blue-50 text-blue-700',
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

const exportToCSV = (data: Project[], filename: string) => {
  const headers = ['Title', 'Client', 'Category', 'Year', 'Description', 'Highlight', 'Updated At'];
  const rows = data.map(p => [
    p.title,
    p.client,
    p.category,
    p.year.toString(),
    p.description || '',
    p.isHighlight ? 'Yes' : 'No',
    new Date(p.updatedAt).toLocaleDateString('id-ID')
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default function AdminProjects() {
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'reorder'>('grid');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch {
      showToast('error', 'Failed to load project data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = activeFilter === 'Semua' ? projects : projects.filter((p) => p.category === activeFilter);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      client: project.client,
      category: project.category,
      year: project.year,
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      isHighlight: project.isHighlight,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/projects/${editing.id}`, form);
        showToast('success', 'Project updated successfully!');
        logActivity({
          action: 'Updating',
          actor: user?.name || user?.email || 'Admin',
          target: form.title,
          section: 'Projects',
          page: 'Admin Panel',
          type: 'admin',
          detail: `Client: ${form.client}`,
        });
      } else {
        await api.post('/projects', form);
        showToast('success', 'Project added successfully!');
        logActivity({
          action: 'Membuat',
          actor: user?.name || user?.email || 'Admin',
          target: form.title,
          section: 'Projects',
          page: 'Admin Panel',
          type: 'admin',
          detail: `Client: ${form.client} — ${form.category} ${form.year}`,
        });
      }
      setShowModal(false);
      fetchProjects();
    } catch {
      showToast('error', 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const target = projects.find(p => p.id === id);
    setDeleting(id);
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('success', 'Project deleted successfully.');
      logActivity({
        action: 'Menghapus',
        actor: user?.name || user?.email || 'Admin',
        target: target?.title || id,
        section: 'Projects',
        page: 'Admin Panel',
        type: 'admin',
      });
    } catch {
      showToast('error', 'Failed to delete project.');
    } finally {
      setDeleting(null);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-error text-white'}`}
          >
            <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
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
              className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
              </div>
              <h3 className="text-lg font-black font-headline text-on-surface mb-2">Delete Project?</h3>
              <p className="text-sm text-on-surface-variant font-body mb-6">This action cannot be undone. Project data will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors">Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} disabled={!!deleting} className="flex-1 py-2.5 rounded-xl bg-error text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
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
              className="bg-surface-container-lowest rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-xl font-black font-headline text-on-surface">{editing ? 'Edit Project' : 'Add New Project'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-8 py-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Project Name *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name..." className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-bold transition-all shadow-inner" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Client *</label>
                    <input type="text" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client name..." className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-bold transition-all shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-bold transition-all shadow-inner">
                      {CATEGORIES.filter(c => c !== 'Semua').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Year</label>
                    <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-bold transition-all shadow-inner" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Description</label>
                    <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Project description..." className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-medium transition-all resize-none shadow-inner" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Image URL</label>
                  <input type="text" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-3.5 text-sm font-medium transition-all shadow-inner" />
                </div>
                <label className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl cursor-pointer hover:bg-surface-container transition-colors shadow-inner">
                  <input type="checkbox" checked={form.isHighlight} onChange={(e) => setForm({ ...form, isHighlight: e.target.checked })} className="w-5 h-5 accent-primary rounded border-none" />
                  <span className="text-xs font-black uppercase tracking-wider text-on-surface">Show on Homepage</span>
                </label>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave} 
                  disabled={saving || !form.title || !form.client} 
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Add Project')}
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
            <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">Projects Portfolio</h1>
            <p className="text-on-surface-variant text-sm mt-1 max-w-lg">Manage project portfolio and strategic achievements of WDU.</p>
        </div>
        <div className="flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportToCSV(projects, 'projects')} 
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl font-bold text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/10"
          >
            <Download size={14} /> Export CSV
          </motion.button>
          {viewMode === 'grid' && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreate} 
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/30"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Project
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode(viewMode === 'grid' ? 'reorder' : 'grid')} 
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${viewMode === 'reorder' ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined text-lg">{viewMode === 'grid' ? 'reorder' : 'grid_view'}</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex gap-2 flex-wrap"
      >
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveFilter(cat)} 
            className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${
              activeFilter === cat 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-surface-container-low border-transparent text-on-surface-variant hover:border-primary/20 hover:text-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${activeFilter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-surface-container-low rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/50">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">folder_open</span>
              </div>
              <h3 className="text-lg font-black text-on-surface mb-2">No Projects Yet</h3>
              <p className="text-sm text-on-surface-variant mb-6">Add your first project to get started.</p>
              <button onClick={openCreate} className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                + Add Project
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project) => (
                <motion.div 
                  key={project.id} 
                  variants={itemVariants}
                  layoutId={`proj-${project.id}`}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                  className="group bg-surface-container-lowest rounded-[32px] overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all flex flex-col h-full"
                >
                  <div className="h-44 bg-surface-container relative overflow-hidden">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                        <span className="material-symbols-outlined text-6xl">image</span>
                      </div>
                    )}
                    {project.isHighlight && (
                      <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <span className="material-symbols-outlined text-xs">star</span>
                        Highlight
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${categoryBadgeColor[project.category] || 'bg-surface-container text-on-surface-variant'}`}>
                        {project.category}
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant">{project.year}</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-on-surface font-headline group-hover:text-primary transition-colors mb-2 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">{project.client}</p>
                    {project.description && <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 font-medium leading-relaxed">{project.description}</p>}
                    <div className="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">
                        {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(project)} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDeleteConfirm(project.id)} className="p-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm"
            >
              <DragDropContext onDragEnd={(result) => {
                if (!result.destination) return;
                const items = Array.from(filtered);
                const [moved] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, moved);
                
                // Update projects list preserving other categories
                const newProjects = [...projects];
                const oldIndex = newProjects.findIndex(p => p.id === moved.id);
                newProjects.splice(oldIndex, 1);
                
                const targetItem = filtered[result.destination.index];
                const targetIndex = newProjects.findIndex(p => p.id === targetItem.id);
                newProjects.splice(targetIndex, 0, moved);

                setProjects(newProjects);
              }}>
                <Droppable droppableId="projects">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {filtered.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps} 
                              className={`flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border-2 transition-all ${
                                snapshot.isDragging ? 'shadow-xl border-primary bg-surface-container scale-[1.02]' : 'border-transparent'
                              }`}
                            >
                              <span className="material-symbols-outlined text-on-surface-variant/40">drag_indicator</span>
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-black text-xs">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-on-surface text-sm truncate">{project.title}</h4>
                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{project.client}</p>
                              </div>
                              <div className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${categoryBadgeColor[project.category]}`}>
                                {project.category}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}