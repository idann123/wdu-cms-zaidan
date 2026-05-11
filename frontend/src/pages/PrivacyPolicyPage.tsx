import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
              Kebijakan <span className="text-primary italic">Privasi</span>
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
              Komitmen kami untuk melindungi data dan privasi Anda dengan standar keamanan tertinggi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-16"
          >
            {/* Intro */}
            <motion.div variants={fadeInUp} className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
              <p>
                Terima kasih telah mempercayai <strong>PT. Wahana Data Utama</strong>. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindunginya melalui kepatuhan kami terhadap kebijakan ini.
              </p>
              <p>
                Kebijakan ini menjelaskan jenis informasi yang mungkin kami kumpulkan dari Anda atau yang mungkin Anda berikan saat Anda mengunjungi situs web kami dan praktik kami untuk mengumpulkan, menggunakan, memelihara, melindungi, dan mengungkapkan informasi tersebut.
              </p>
            </motion.div>

            {/* Section 1 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">data_usage</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">1. Informasi yang Kami Kumpulkan</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>Kami mengumpulkan beberapa jenis informasi dari dan tentang pengguna situs web kami, termasuk informasi:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Yang mengidentifikasi Anda secara pribadi, seperti nama, alamat email, atau nomor telepon ("informasi pribadi").</li>
                  <li>Tentang koneksi internet Anda, peralatan yang Anda gunakan untuk mengakses situs web kami, dan detail penggunaan.</li>
                </ul>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">security</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>Kami menggunakan informasi yang kami kumpulkan tentang Anda atau yang Anda berikan kepada kami, termasuk informasi pribadi apa pun:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Untuk menyajikan situs web kami dan isinya kepada Anda.</li>
                  <li>Untuk memberi Anda informasi, produk, atau layanan yang Anda minta dari kami.</li>
                  <li>Untuk memenuhi tujuan lain apa pun yang Anda berikan.</li>
                  <li>Untuk memberi tahu Anda tentang perubahan pada situs web kami atau produk atau layanan apa pun yang kami tawarkan atau sediakan melalui itu.</li>
                </ul>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">shield_person</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">3. Keamanan Data</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>
                  Kami telah menerapkan langkah-langkah yang dirancang untuk mengamankan informasi pribadi Anda dari kehilangan yang tidak disengaja dan dari akses, penggunaan, perubahan, dan pengungkapan yang tidak sah. Semua informasi yang Anda berikan kepada kami disimpan di server aman kami di balik firewall.
                </p>
              </div>
            </motion.div>

            {/* Section 4 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">4. Perubahan pada Kebijakan Privasi Kami</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>
                  Adalah kebijakan kami untuk memposting perubahan apa pun yang kami buat pada kebijakan privasi kami di halaman ini. Jika kami membuat perubahan materi pada cara kami menangani informasi pribadi pengguna kami, kami akan memberi tahu Anda melalui email atau melalui pemberitahuan di beranda situs web.
                </p>
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm text-slate-400 font-medium italic">Terakhir diperbarui: 13 April 2026</p>
                  <Link to="/kontak" className="text-primary font-bold hover:underline flex items-center gap-2">
                    Hubungi Kami <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-black text-slate-900 mb-4">Punya pertanyaan tentang privasi Anda?</h3>
          <p className="text-slate-500 mb-8">Tim kami siap membantu menjelaskan bagaimana kami menjaga kerahasiaan data Anda.</p>
          <Link 
            to="/kontak" 
            className="px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-all duration-300 shadow-xl"
          >
            Hubungi Tim Keamanan Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
