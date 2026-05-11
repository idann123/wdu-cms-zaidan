import { useState, useEffect } from 'react';
import {
  User, Settings, Palette, Camera,
  ShieldCheck, EyeOff, MapPin, Bell, Globe, Lock, Smartphone
} from 'lucide-react';

const STORAGE_KEY = 'wdu_admin_settings';

const defaultSettings = {
  fullName: 'Abiyyu Aflah',
  email: 'admin@wdu.co.id',
  twoFactor: false,
  lastPasswordChange: '30 hari lalu',
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
  },
  timezone: '(GMT+07:00) Jakarta, Bangkok',
  language: 'Indonesia (ID)',
  accentColor: 'green',
  smtpHost: 'smtp.mailtrap.io',
  apiEndpoint: 'https://api.v1.com',
  maintenanceMode: false,
  generalSetting: {
    timeline: [
      {
        year: "2024",
        logos: [
          { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png", isActive: true },
          { name: "BPOM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-300x205.png", isActive: true },
          { name: "BKPM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-300x205.png", isActive: true },
          { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png", isActive: true },
          { name: "Paljaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png", isActive: true },
        ]
      },
      {
        year: "2023",
        logos: [
          { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png", isActive: true },
          { name: "STM Yogya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-300x300.png", isActive: true },
          { name: "Transpakuan", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-300x300.png", isActive: true },
          { name: "Paljaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png", isActive: true },
          { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png", isActive: true },
        ]
      },
      {
        year: "2022",
        logos: [
          { name: "BUMN", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-300x300.png", isActive: true },
          { name: "Jakarta", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-300x300.png", isActive: true },
          { name: "KPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png", isActive: true },
          { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png", isActive: true },
          { name: "Perpusnas", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/perpusnas-square-300x300.png", isActive: true },
          { name: "Blora", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/blora-square-300x300.png", isActive: true },
          { name: "Injiniring", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/injiniring-square-300x300.png", isActive: true },
          { name: "Pakuan Jaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-300x300.png", isActive: true },
          { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-300x300.png", isActive: true },
          { name: "BKPM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-300x300.png", isActive: true },
        ]
      },
      {
        year: "2021",
        logos: [
          { name: "BPOM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-300x205.png", isActive: true },
          { name: "Kominfo", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png", isActive: true },
          { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png", isActive: true },
          { name: "KPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png", isActive: true },
          { name: "Kemendes", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png", isActive: true },
          { name: "Pakuan Jaya", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-300x300.png", isActive: true },
          { name: "BKPM", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-300x300.png", isActive: true },
        ]
      },
      {
        year: "2020",
        logos: [
          { name: "BPK", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png", isActive: true },
          { name: "Kemendes", img: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png", isActive: true },
        ]
      },
    ]
  },
  ceoProfile: {
    name: 'Ir. Yudi A. Idrus',
    title: 'Direktur Utama',
    photoUrl: 'https://wahanadata.co.id/wp-content/uploads/2025/02/Pak-Yudi-homepage-2.png',
    description: 'Berpengalaman lebih dari 10 tahun dalam bidang riset dan data, memimpin WDU untuk menjadi penyedia data riset terkemuka di Indonesia.',
    isActive: true,
  },
  heroes: {
    home: {
      badgeText: 'Wahana Data Utama - Since 2006',
      headline: ['Data Terpadu,', 'Solusi Cerdas', 'Hasil Maksimal'],
      description: 'Percayakan kebutuhan riset, analisis data, dan teknologi kepada Wahana Data Utama. Kami mengubah data menjadi wawasan berharga dan solusi praktis yang membantu Anda meraih keunggulan kompetitif di bisnis anda.',
      stats: [
        { value: '25+', label: 'Enterprise Clients' },
        { value: '150+', label: 'Projects Done' },
        { value: '99%', label: 'Uptime Security' },
      ],
      carouselImages: [
        'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg',
        'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-scaled-r0gn5zclhzniq0rcdzfe7k85fdqhwh6ngb7cl7exi8.jpg',
        'https://wahanadata.co.id/wp-content/uploads/2025/01/34695135-c70d-4d76-92d5-10c39eb5390f.jpg',
      ],
      ctaText: 'Mulai Kolaborasi',
      ctaLink: 'https://wa.me/62881012394686?text=Halo%20Wahana%20Data%20Utama,%20saya%20tertarik%20untuk%20berkolaborasi%20mengenai%20layanan%20riset%20dan%20data.',
    },
    about: {
      badgeText: 'Tentang Kami',
      headline: ['Mengubah Data Menjadi', 'Kekuatan Untuk', 'Keputusan Cerdas'],
      description: 'Wahana Data Utama adalah mitra terpercaya dalam bidang riset dan analisis data yang membantu organisasi pemerintah dan swasta di Indonesia.',
      stats: [
        { value: '15+', label: 'Tahun Pengalaman' },
        { value: '500+', label: 'Proyek Selesai' },
        { value: '50+', label: 'Tim Ahli' },
      ],
      carouselImages: [],
      bgImage: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/1384bbe7-3362-446d-b989-77114335e7ea-1-scaled-r09xvdqugccp0qj415ithlfa8gvrifzftmrqwj4fts.jpg',
      ctaText: 'Pelajari Lebih Lanjut',
      ctaLink: '#experience',
    },
    experience: {
      badgeText: 'Pengalaman',
      headline: ['Portofolio', 'Proyek &', 'K成就感'],
      description: 'Kami telah berhasil menyelesaikan berbagai proyek strategis untuk berbagai instansi pemerintah dan perusahaan swasta.',
      stats: [
        { value: '100+', label: 'Klien PNS' },
        { value: '50+', label: 'Klien Swasta' },
        { value: '10+', label: 'Institusi NLRB' },
      ],
      carouselImages: [],
      bgImage: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/bkpm-scaled-r0gn5zclhzniq0rcdzfe7k85fdqhwh6ngb7cl7exi8.jpg',
      ctaText: 'Lihat Semua Proyek',
      ctaLink: '#projects',
    },
    services: {
      badgeText: 'Layanan Kami',
      headline: ['Solusi', 'Terbaik Untuk', 'Kebutuhan Anda'],
      description: 'Kami menyediakan berbagai layanan riset, analisis data, dan konsultasi teknologi yang disesuaikan dengan kebutuhan Anda.',
      stats: [
        { value: '5+', label: 'Jenis Layanan' },
        { value: '24/7', label: 'Dukungan' },
        { value: '100%', label: 'Kepuasan Klien' },
      ],
      carouselImages: [],
      bgImage: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/layanan-header-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg',
      ctaText: 'Konsultasi Gratis',
      ctaLink: '#contact',
    },
    contact: {
      badgeText: 'Hubungi Kami',
      headline: ['Siap', 'Membantu', 'Anda'],
      description: 'Jangan ragu untuk menghubungi kami. Tim profesional kami siap memberikan konsultasi dan menjawab pertanyaan Anda.',
      stats: [
        { value: '24/7', label: 'Dukungan' },
        { value: '< 1 Jam', label: 'Respon Time' },
        { value: '100%', label: 'Professional' },
      ],
      carouselImages: [],
      bgImage: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/kontak-header-r02xh9skmo5ipym1j4rohxyhov5sjnraxkbp516srk.jpg',
      ctaText: 'Hubungi Sekarang',
      ctaLink: 'https://wa.me/62881012394686',
    },
  }
};

const accentColors = [
  { name: 'green', value: '#6ab149', bg: '#6ab149' },
  { name: 'blue', value: '#2563eb', bg: '#2563eb' },
  { name: 'amber', value: '#d97706', bg: '#d97706' },
  { name: 'purple', value: '#7c3aed', bg: '#7c3aed' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'ceo' | 'hero'>('system');
  const [_isResetting, setIsResetting] = useState(false);

  // Timeline Logo Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);


  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Deep merge timeline so new years (2024) are added even if there is old data in localStorage
        const mergedTimeline = [...(defaultSettings.generalSetting?.timeline || [])];
        if (parsed.generalSetting?.timeline) {
          parsed.generalSetting.timeline.forEach((t: any) => {
            const index = mergedTimeline.findIndex(m => m.year === t.year);
            if (index !== -1) {
              mergedTimeline[index] = t;
            } else {
              mergedTimeline.push(t);
            }
          });
        }
        
        const finalSettings = {
          ...defaultSettings,
          ...parsed,
          generalSetting: {
            ...defaultSettings.generalSetting,
            ...(parsed.generalSetting || {}),
            timeline: mergedTimeline.sort((a, b) => b.year.localeCompare(a.year))
          }
        };
        
        setSettings(finalSettings);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleCeoProfileChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      ceoProfile: {
        ...prev.ceoProfile,
        [field]: value,
      },
    }));
  };


  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    showToast('success', 'System settings saved successfully!');
    setIsSaving(false);
  };

  const handleResetToDefault = async () => {
    if (!confirm('Reset seluruh konfigurasi sistem ke default?')) return;
    setIsResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    showToast('success', 'All settings reset to default');
    setIsResetting(false);
  };

  if (!isLoaded) return null;

  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultSettings)));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700 dark:bg-surface-container-low/80 dark:backdrop-blur-sm">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 transition-all animate-in slide-in-from-right ${toast.type === 'success' ? 'bg-primary text-white' : 'bg-red-500 text-white'
          }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.msg}
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-black font-headline text-gray-900 dark:text-white tracking-tight">System Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400 font-body">Manage all platform aspects in one control panel.</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-10 mb-8">
            <div
           onClick={() => setActiveTab('system')}
           role="button"
           tabIndex={0}
           className={`pb-3 font-bold text-lg cursor-pointer transition-colors duration-300 active:bg-transparent ${activeTab === 'system'
             ? 'text-primary border-b-2 border-primary'
             : 'text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-gray-200'
             }`}
           style={{ background: 'transparent' }}
         >
           System Configuration
         </div>
            <div
           onClick={() => setActiveTab('ceo')}
           role="button"
           tabIndex={0}
           className={`pb-3 font-bold text-lg cursor-pointer transition-colors duration-300 active:bg-transparent ${activeTab === 'ceo'
             ? 'text-primary border-b-2 border-primary'
             : 'text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-gray-200'
             }`}
           style={{ background: 'transparent' }}
         >
           CEO Profile
         </div>
        <div
          onClick={() => setActiveTab('hero')}
          role="button"
          tabIndex={0}
          className={`pb-3 font-bold text-lg cursor-pointer transition-colors duration-300 active:bg-transparent ${activeTab === 'hero'
            ? 'text-primary border-b-2 border-primary'
            : 'text-on-surface-variant hover:text-on-surface dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          style={{ background: 'transparent' }}
        >
          Pages
        </div>

</div>

      {/* Grid Layout */}
      {activeTab === 'system' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* SECTION: PROFIL & AKUN */}
         <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant lg:col-span-1 hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-6 text-primary">
             <User size={20} className="stroke-[2.5px]" />
             <h2 className="font-bold text-on-surface tracking-tight">My Profile</h2>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-surface-container border-4 border-surface-container-lowest shadow-sm overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <img src="/guaa.jpeg" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg border-2 border-surface-container-lowest hover:scale-110 active:scale-95 transition-all">
                <Camera size={14} />
              </button>
            </div>
            <div className="w-full space-y-3 mt-2">
               <input
                 type="text"
                 value={settings.fullName}
                 onChange={(e) => handleInputChange('fullName', e.target.value)}
                 className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                 placeholder="Full Name"
               />
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                placeholder="Email"
              />
            </div>
          </div>
        </section>



        {/* SECTION: KEAMANAN (Security) */}
         <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
           <div className="flex items-center gap-3 mb-6 text-primary">
             <ShieldCheck size={20} className="stroke-[2.5px]" />
             <h2 className="font-bold text-on-surface tracking-tight">Security</h2>
          </div>
          <div className="space-y-4">
            <div
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-outline-variant group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary/20 transition-colors"><Lock size={16} /></div>
                <div>
                   <p className="text-sm font-semibold text-on-surface">Change Password</p>
                   <p className="text-[10px] text-on-surface-variant">Last changed: {settings.lastPasswordChange}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
            <div
              onClick={() => handleInputChange('twoFactor', !settings.twoFactor)}
              className="flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-outline-variant group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg group-hover:bg-tertiary/20 transition-colors"><Smartphone size={16} /></div>
                <div>
                   <p className="text-sm font-semibold text-on-surface">Two-Factor (2FA)</p>
                   <p className="text-[10px] text-on-surface-variant">{settings.twoFactor ? 'Active' : 'Not activated'}</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.twoFactor ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${settings.twoFactor ? 'left-6' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: NOTIFIKASI */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 transition-shadow">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Bell size={20} className="stroke-[2.5px]" />
            <h2 className="font-bold text-on-surface tracking-tight">Notifikasi</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email Notifikasi', key: 'emailAlerts' },
              { label: 'Push Notifikasi', key: 'pushNotifications' },
              { label: 'Laporan Mingguan', key: 'weeklyReports' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0">
                <span className="text-sm text-on-surface font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary cursor-pointer"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                  onChange={() => handleNotificationChange(item.key as keyof typeof settings.notifications)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: LOKASI & REGIONAL */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 transition-shadow">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <MapPin size={20} className="stroke-[2.5px]" />
            <h2 className="font-bold text-on-surface tracking-tight">Lokasi & Waktu</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">Zona Waktu</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full p-3 bg-surface-container border-none rounded-xl text-sm outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-primary/30 text-on-surface"
              >
                <option>(GMT+07:00) Jakarta, Bangkok</option>
                <option>(GMT+08:00) Singapore, Makassar</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-1">Bahasa Default</label>
              <div className="flex items-center gap-2 p-3 bg-surface-container rounded-xl">
                <Globe size={14} className="text-on-surface-variant" />
                <span className="text-sm text-on-surface">{settings.language}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: PRIVASI */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 transition-shadow">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <EyeOff size={20} className="stroke-[2.5px]" />
            <h2 className="font-bold text-on-surface tracking-tight">Privasi</h2>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-orange-50/50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/30">
              <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed font-medium">
                Your activity data will be stored for 30 days for system audit purposes.
              </p>
            </div>
            <button
               onClick={() => showToast('success', 'Activity data is being processed for deletion...')}
              className="w-full py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-[0.98]"
            >
              Delete All Activity Data
            </button>
          </div>
        </section>

        {/* SECTION: TAMPILAN & BRANDING */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 transition-shadow">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Palette size={20} className="stroke-[2.5px]" />
            <h2 className="font-bold text-on-surface tracking-tight">Branding</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-on-surface">Main Color</span>
              <div className="flex items-center gap-2 bg-surface-container p-2 rounded-lg border border-outline-variant">
                {accentColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleInputChange('accentColor', color.name)}
                    className={`w-4 h-4 rounded-sm transition-all ${settings.accentColor === color.name ? 'ring-2 ring-offset-1 ring-primary scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                    style={{ backgroundColor: color.bg }}
                  />
                ))}
                <span className="text-[10px] font-mono text-on-surface-variant uppercase ml-1">
                  {accentColors.find(c => c.name === settings.accentColor)?.value}
                </span>
              </div>
            </div>
            <div className="h-20 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center bg-surface-container group hover:border-primary/50 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-1">cloud_upload</span>
              <span className="text-[10px] text-on-surface-variant font-bold group-hover:text-primary transition-colors uppercase tracking-widest">Update Logo</span>
            </div>
          </div>
        </section>

        {/* SECTION: SISTEM & API (Full Width) */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50 transition-shadow md:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Settings size={20} className="stroke-[2.5px]" />
              <h2 className="font-bold text-on-surface tracking-tight">Advanced Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">SMTP Host</label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                className="w-full p-3 bg-surface-container border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/20 text-on-surface"
                placeholder="smtp.mailtrap.io"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">API Endpoint</label>
              <input
                type="text"
                value={settings.apiEndpoint}
                onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                className="w-full p-3 bg-surface-container border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/20 text-on-surface"
                placeholder="https://api.v1.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Maintenance Mode</label>
              <div
                onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                className="flex items-center gap-3 p-2 cursor-pointer group"
              >
                <div className={`w-10 h-5 rounded-full relative transition-all duration-300 ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${settings.maintenanceMode ? 'left-6' : 'left-1'}`}></div>
                </div>
                <span className={`text-[10px] font-bold transition-colors ${settings.maintenanceMode ? 'text-orange-600 dark:text-orange-300' : 'text-on-surface-variant'}`}>
                  {settings.maintenanceMode ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>)}

      {activeTab === 'ceo' && (
        <div className="w-full mt-6">
          {/* SECTION: PROFIL CEO */}
          <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-md border-2 border-outline-variant hover:shadow-lg transition-shadow w-full">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <span className="material-symbols-outlined">badge</span>
              <h2 className="font-bold text-on-surface tracking-tight">CEO/Managing Director Profile</h2>
            </div>
            <div className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
              {/* Photo Preview - Centered */}
              <div className="relative group">
                <div className="w-[500px] h-[500px] rounded-2xl bg-surface-container border-2 border-primary/20 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={settings.ceoProfile.photoUrl}
                    alt="CEO"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e2e3e0" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%2372796e" font-size="12">No Image</text></svg>';
                    }}
                  />
                </div>
              </div>
              {/* Form - Below Photo */}
              <div className="w-full space-y-4">
                {/* Full Name & Position - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={settings.ceoProfile.name}
                      onChange={(e) => handleCeoProfileChange('name', e.target.value)}
                      className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                      placeholder="CEO/Managing Director Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Position</label>
                    <input
                      type="text"
                      value={settings.ceoProfile.title}
                      onChange={(e) => handleCeoProfileChange('title', e.target.value)}
                      className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                      placeholder="Position (e.g: Managing Director)"
                    />
                  </div>
                </div>
                {/* URL Foto */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">URL Foto</label>
                  <input
                    type="text"
                    value={settings.ceoProfile.photoUrl}
                    onChange={(e) => handleCeoProfileChange('photoUrl', e.target.value)}
                    className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                {/* Deskripsi Singkat - Taller Textarea */}
                <div className="space-y-2 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Deskripsi Singkat</label>
                  <textarea
                    value={settings.ceoProfile.description}
                    onChange={(e) => handleCeoProfileChange('description', e.target.value)}
                    rows={6}
                    className="w-full p-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface resize-none"
                    placeholder="Deskripsi singkat tentang CEO..."
                  />
                </div>
                {/* Checkbox: Tampilkan di Halaman Utama */}
                <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-primary/10">
                  <input
                    type="checkbox"
                    checked={settings.ceoProfile.isActive}
                    onChange={(e) => handleCeoProfileChange('isActive', e.target.checked)}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                    id="ceoIsActive"
                  />
                  <label htmlFor="ceoIsActive" className="text-sm font-semibold text-on-surface cursor-pointer">
                    Tampilkan di Halaman Utama
                  </label>
                </div>



              </div>
            </div>
          </section>
        </div>
      )}



{/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center">
              <h3 className="text-xl font-black font-headline text-on-surface">Ganti Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 py-3 pr-12 text-sm font-medium transition-all w-full"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 py-3 text-sm font-medium transition-all"
                   placeholder="Minimum 6 characters"
                />
                <p className="text-[10px] text-on-surface-variant">Minimal 6 karakter</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 py-3 text-sm font-medium transition-all"
                   placeholder="Re-enter new password"
                />
              </div>
            </div>
            <div className="px-8 py-5 border-t border-outline-variant/20 flex justify-end gap-3">
               <button onClick={() => setShowPasswordModal(false)} className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
                 Cancel
               </button>
               <button 
                 onClick={() => { showToast('success', 'Password successfully changed!'); setShowPasswordModal(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                 disabled={!passwordForm.currentPassword || passwordForm.newPassword.length < 6 || passwordForm.newPassword !== passwordForm.confirmPassword}
                 className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
               >
                 Save Password
               </button>
            </div>
          </div>
        </div>
      )}

       <div className="pt-8 flex justify-start">
         <button
           onClick={handleResetToDefault}
           className="text-[10px] font-black text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 group"
         >
           <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-500">restart_alt</span>
           RESET ALL SYSTEM TO DEFAULT
         </button>
       </div>




      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 flex items-center gap-4 z-50 animate-in slide-in-from-bottom duration-500">
        {hasUnsavedChanges && (
          <div className="hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-primary/10 animate-bounce duration-1000">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-gray-500 tracking-tight">Unsaved changes</p>
          </div>
        )}
           <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/30 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              {isSaving ? 'Saving...' : 'SAVE CHANGES'}
           </button>
      </div>
    </div>
  );
}