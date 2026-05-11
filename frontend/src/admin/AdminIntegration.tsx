import { useState } from 'react';

export default function AdminIntegration() {
  const [toast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      {toast && (
        <div className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-[#6ab149] text-white' : 'bg-red-500 text-white'}`}>
          <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-on-surface">Integrasi</h1>
        <p className="text-on-surface-variant text-sm mt-1">Pengaturan integrasi dengan layanan pihak ketiga</p>
      </div>

      <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-8xl text-outline-variant/20 mb-4">extension</span>
          <h2 className="text-2xl font-black text-on-surface mb-2">Coming Soon</h2>
          <p className="text-on-surface-variant max-w-md">Fitur integrasi sedang dalam pengembangan. Stay tuned untuk update selanjutnya!</p>
        </div>
      </section>
    </div>
  );
}