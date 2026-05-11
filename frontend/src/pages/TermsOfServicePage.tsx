import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function TermsOfServicePage() {
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
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
              Ketentuan <span className="text-primary italic">Layanan</span>
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
              Aturan dan panduan penggunaan layanan PT. Wahana Data Utama untuk kenyamanan bersama.
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
                Selamat datang di situs web <strong>PT. Wahana Data Utama</strong>. Dengan mengakses dan menggunakan situs web ini, Anda dianggap telah membaca, memahami, dan menyetujui untuk terikat oleh Ketentuan Layanan ini.
              </p>
              <p>
                Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan layanan kami. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan apa pun.
              </p>
            </motion.div>

            {/* Section 1 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">1. Syarat Penggunaan</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>Anda setuju untuk menggunakan situs web kami hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar hak orang lain atau membatasi penggunaan mereka atas situs web tersebut.</p>
                <p>Kegiatan yang dilarang meliputi:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Mengirimkan konten yang melanggar hukum, berbahaya, atau menyinggung.</li>
                  <li>Mencoba mendapatkan akses tidak sah ke sistem kami.</li>
                  <li>Menggunakan situs web ini dengan cara yang dapat merusak, melumpuhkan, atau membebani server kami.</li>
                </ul>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">copyright</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">2. Hak Kekayaan Intelektual</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>Seluruh konten yang tersedia di situs web ini, termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, dan perangkat lunak, adalah properti PT. Wahana Data Utama dan dilindungi oleh undang-undang hak cipta Indonesia dan internasional.</p>
                <p>Penggunaan konten tersebut tanpa izin tertulis sebelumnya dari kami sangat dilarang.</p>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">warning</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">3. Batasan Tanggung Jawab</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>
                  PT. Wahana Data Utama tidak bertanggung jawab atas kerugian atau kerusakan apa pun, baik langsung maupun tidak langsung, yang timbul dari penggunaan atau ketidakmampuan Anda untuk menggunakan situs web kami. Kami berusaha menjaga informasi tetap akurat, namun tidak menjamin kelengkapan atau ketepatannya.
                </p>
              </div>
            </motion.div>

            {/* Section 4 */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">balance</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">4. Hukum yang Berlaku</h2>
              </div>
              <div className="pl-16 text-lg text-slate-600 space-y-4">
                <p>
                  Ketentuan Layanan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul sehubungan dengan ketentuan ini akan diselesaikan secara eksklusif dalam yurisdiksi pengadilan di Indonesia.
                </p>
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm text-slate-400 font-medium italic">Terakhir diperbarui: 13 April 2026</p>
                  <Link to="/kontak" className="text-primary font-bold hover:underline flex items-center gap-2">
                    Ada Pertanyaan? <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
          <h3 className="text-2xl font-black text-slate-900 mb-4">Butuh bantuan tentang layanan kami?</h3>
          <p className="text-slate-500 mb-8">Tim dukungan kami siap membantu Anda memahami lebih lanjut tentang ketentuan ini.</p>
          <Link 
            to="/kontak" 
            className="px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-all duration-300 shadow-xl"
          >
            Hubungi Kami Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
