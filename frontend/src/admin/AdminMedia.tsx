import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useAuthStore } from '../store/authStore';
import { logActivity } from '../utils/activityLogger';
import api from '../services/api';

interface MediaItem {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
}

interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

const STORAGE_KEY = 'wdu_admin_media';

const defaultImages = [
  'https://wahanadata.co.id/wp-content/uploads/2025/01/91ff19eb-9bae-41be-bd79-86c09efa26ae.jpg',
  'https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg',
  'https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg',
  'https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg',
  'https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg',
  'https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg',
];

const emptyForm = {
  url: '',
  caption: '',
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
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
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

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const maxSize = 5 * 1024 * 1024;

export default function AdminMedia() {
  const { user } = useAuthStore();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMedia = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMedia(JSON.parse(stored));
    } else {
      const initialData = defaultImages.map((url, index) => ({
        id: `default-${index}`,
        url,
         caption: `Image ${index + 1}`,
        createdAt: new Date().toISOString(),
      }));
      setMedia(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const saveToStorage = (data: MediaItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setMedia(data);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (item: MediaItem) => {
    setEditing(item);
    setForm({
      url: item.url,
      caption: item.caption,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.url.trim()) {
       showToast('error', 'Image URL cannot be empty.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        const updated = media.map((m) =>
          m.id === editing.id ? { ...m, url: form.url, caption: form.caption } : m
        );
        saveToStorage(updated);
         showToast('success', 'Media successfully updated!');
        logActivity({
          action: 'Update',
          actor: user?.name || user?.email || 'Admin',
          target: form.caption || form.url,
          section: 'Media Gallery',
          page: 'Admin Panel',
          type: 'media',
          detail: `URL: ${form.url.slice(0, 60)}`,
        });
      } else {
        const newItem: MediaItem = {
          id: `media-${Date.now()}`,
          url: form.url,
          caption: form.caption,
          createdAt: new Date().toISOString(),
        };
        saveToStorage([newItem, ...media]);
         showToast('success', 'Media successfully added!');
        logActivity({
          action: 'Upload',
          actor: user?.name || user?.email || 'Admin',
          target: form.caption || form.url,
          section: 'Media Gallery',
          page: 'Admin Panel',
          type: 'media',
          detail: `URL: ${form.url.slice(0, 60)}`,
        });
      }
      setShowModal(false);
      setSaving(false);
    }, 300);
  };

  const handleDelete = (id: string) => {
    const target = media.find(m => m.id === id);
    setDeleting(id);
    setTimeout(() => {
      const updated = media.filter((m) => m.id !== id);
      saveToStorage(updated);
         showToast('success', 'Media successfully deleted.');
      logActivity({
         action: 'Delete',
        actor: user?.name || user?.email || 'Admin',
        target: target?.caption || target?.url || id,
        section: 'Media Gallery',
        page: 'Admin Panel',
        type: 'media',
        detail: `URL: ${(target?.url || '').slice(0, 60)}`,
      });
      setDeleting(null);
      setShowDeleteConfirm(null);
    }, 300);
  };

  const openPreview = (url: string) => {
    window.open(url, '_blank');
  };

  const uploadFile = useCallback(async (file: File) => {
    const uploadId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setUploads((prev) => [...prev, { id: uploadId, name: file.name, progress: 0, status: 'uploading' }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: result } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploads((prev) =>
              prev.map((u) => (u.id === uploadId ? { ...u, progress: percent } : u))
            );
          }
        },
      });

      const newItem: MediaItem = {
        id: result.id,
        url: result.url,
        caption: file.name.replace(/\.[^.]+$/, ''),
        createdAt: new Date().toISOString(),
      };
      
      setMedia((prev) => {
        const updated = [newItem, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      
      setUploads((prev) => prev.map((u) => (u.id === uploadId ? { ...u, status: 'success', progress: 100 } : u)));
      
      logActivity({
        action: 'Upload',
        actor: user?.name || user?.email || 'Admin',
        target: file.name,
        section: 'Media Gallery',
        page: 'Admin Panel',
        type: 'media',
        detail: `File: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`,
      });
      
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Upload failed';
      setUploads((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, status: 'error', message } : u))
      );
      return null;
    }
  }, [user]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) => {
      if (!allowedTypes.includes(f.type)) {
        showToast('error', `${f.name} — format tidak didukung`);
        return false;
      }
      if (f.size > maxSize) {
        showToast('error', `${f.name} — melebihi 5MB`);
        return false;
      }
      return true;
    });

    if (files.length === 0) return;

    let successCount = 0;
    for (const file of files) {
      const res = await uploadFile(file);
      if (res) successCount++;
    }

    if (successCount > 0) {
      showToast('success', `${successCount} file berhasil diupload`);
    } else if (files.length > 0) {
      showToast('error', 'Gagal mengupload file');
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const validFiles = files.filter((f) => {
      if (!allowedTypes.includes(f.type)) {
        showToast('error', `${f.name} — format tidak didukung`);
        return false;
      }
      if (f.size > maxSize) {
        showToast('error', `${f.name} — melebihi 5MB`);
        return false;
      }
      return true;
    });

    let successCount = 0;
    for (const file of validFiles) {
      const res = await uploadFile(file);
      if (res) successCount++;
    }

    if (successCount > 0) {
      showToast('success', `${successCount} file berhasil diupload`);
    } else if (validFiles.length > 0) {
      showToast('error', 'Gagal mengupload file');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadFile]);

  const clearUploads = () => {
    setUploads((prev) => prev.filter((u) => u.status === 'uploading'));
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
               <h3 className="text-xl font-black text-on-surface mb-2">Delete Media?</h3>
               <p className="text-sm text-on-surface-variant font-medium mb-8 leading-relaxed">
                 This action cannot be undone. Media will be permanently deleted from gallery.
               </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-2xl border border-outline-variant text-on-surface font-black text-xs uppercase tracking-widest hover:bg-surface-container transition-all"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
                  {editing ? 'Edit Media' : 'Add Media via URL'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="px-8 py-6 space-y-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-medium shadow-inner transition-all"
                  />
                  <AnimatePresence>
                    {form.url && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.9, height: 0 }}
                        className="mt-4 rounded-2xl overflow-hidden bg-white border-2 border-dashed border-outline-variant/30 aspect-video flex items-center justify-center shadow-inner"
                      >
                        <img
                          src={form.url}
                          alt="preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                    placeholder="Brief description..."
                    className="bg-surface-container-low border-2 border-transparent focus:border-primary outline-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner transition-all"
                  />
                </div>
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
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Media'}
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
          <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-3 block">Digital Assets</span>
          <h1 className="text-4xl font-black font-headline text-on-surface tracking-tight">Media Gallery</h1>
          <p className="text-on-surface-variant text-sm mt-2 font-medium max-w-lg">
            Digital visual asset storage hub. Manage all images displayed across the Wahana Data Utama platform.
          </p>
        </div>
        <div className="flex gap-3 self-start md:self-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="bg-surface-container-lowest border-2 border-outline-variant text-on-surface px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:border-primary hover:text-primary transition-all shadow-sm self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[20px]">link</span>
            Add via URL
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            Upload File
          </motion.button>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <motion.div
        ref={dropZoneRef}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative rounded-[2.5rem] border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragging
            ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.01]'
            : 'border-outline-variant/30 bg-surface-container-lowest/50 hover:border-primary/50 hover:bg-primary/[0.02]'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragging
                ? 'bg-primary/10 text-primary shadow-lg shadow-primary/20'
                : 'bg-surface-container-low text-on-surface-variant/50'
            }`}
          >
            <span className="material-symbols-outlined text-3xl">
              {isDragging ? 'file_download' : 'cloud_upload'}
            </span>
          </motion.div>

          <div className="space-y-1">
            <p className={`text-sm font-black uppercase tracking-widest transition-colors duration-300 ${
              isDragging ? 'text-primary' : 'text-on-surface/70'
            }`}>
              {isDragging ? 'Drop Files Here' : 'Drag & Drop Images Here'}
            </p>
            <p className="text-xs text-on-surface-variant/50 font-medium">
              or click to browse — JPG, PNG, WEBP, GIF, SVG (max 5MB)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Upload Progress</h3>
                {uploads.some((u) => u.status !== 'uploading') && (
                  <button
                    onClick={clearUploads}
                    className="text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase tracking-widest transition-colors"
                  >
                    Clear Completed
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      upload.status === 'success' ? 'bg-primary/10 text-primary' :
                      upload.status === 'error' ? 'bg-error/10 text-error' :
                      'bg-surface-container text-on-surface-variant/50'
                    }`}>
                      {upload.status === 'success' ? (
                        <span className="material-symbols-outlined text-lg">check</span>
                      ) : upload.status === 'error' ? (
                        <span className="material-symbols-outlined text-lg">close</span>
                      ) : (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-on-surface truncate">{upload.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full transition-colors ${
                              upload.status === 'error' ? 'bg-error' :
                              upload.status === 'success' ? 'bg-primary' :
                              'bg-primary/60'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${upload.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${
                          upload.status === 'success' ? 'text-primary' :
                          upload.status === 'error' ? 'text-error' :
                          'text-on-surface-variant/60'
                        }`}>
                          {upload.status === 'success' ? 'Done' :
                           upload.status === 'error' ? upload.message || 'Failed' :
                           `${upload.progress}%`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-[2rem] bg-surface-container-low animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <EmptyState onUpload={openCreate} />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {media.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
              className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-surface-container-low cursor-pointer shadow-sm transition-all"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e3e0" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2372796e" font-size="10">No Image</text></svg>';
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-white text-xs font-black uppercase tracking-widest truncate mb-3">
                  {item.caption || 'Untitled Asset'}
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); openPreview(item.url); }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-md transition-all shadow-lg"
                    title="Preview Full"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-md transition-all shadow-lg"
                    title="Edit Metadata"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(item.id); }}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-white backdrop-blur-md transition-all shadow-lg"
                    title="Delete Asset"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
