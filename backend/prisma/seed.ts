import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const servicesData = [
  {
    slug: "riset-pasar",
    icon: "search",
    title: "Riset Pasar",
    shortDescription: "Analisis mendalam mengenai tren industri, perilaku konsumen, dan lanskap kompetitif untuk strategi bisnis yang unggul.",
    fullDescription: "Riset Pasar adalah layanan komprehensif yang membantu Anda memahami dinamika pasar dan perilaku konsumen. Dengan metodologi yang teruji dan tim analis berpengalaman, kami memberikan wawasan strategis yang actionable untuk pengambilan keputusan bisnis.\n\nLayanan ini mencakup analisis tren industri, perilaku konsumen, analisis kompetitor, dan proyeksi pasar. Hasil riset kami telah membantu ratusan klien membuat keputusan strategis yang tepat.",
    features: ["Analisis Tren", "Perilaku Konsumen", "Profil Kompetitor", "Proyeksi Pasar"],
    benefits: [
      "Pemahaman mendalam tentang pasar target",
      "Identifikasi peluang dan ancaman",
      "Data-driven decision making",
      "Laporan komprehensif dengan rekomendasi",
      "Pendampingan konsultasi pasca-riset"
    ],
    process: [
      { step: 1, title: "Briefing & Perencanaan", description: "Memahami kebutuhan klien dan merancang metodologi riset." },
      { step: 2, title: "Pengumpulan Data", description: "Mengumpulkan data primer dan sekunder dari berbagai sumber." },
      { step: 3, title: "Analisis Data", description: "Menganalisis data menggunakan metode statistik avanzada." },
      { step: 4, title: "Wawasan & Interpretasi", description: "Menginterpretasi temuan dan menghasilkan wawasan strategis." },
      { step: 5, title: "Penyusunan Laporan", description: "Menyusun laporan komprehensif dengan rekomendasi actionable." },
      { step: 6, title: "Presentasi", description: "Mempresentasikan temuan dan rekomendasi kepada klien." }
    ],
    technologies: [
      { name: "SPSS" },
      { name: "Python" },
      { name: "Tableau" },
      { name: "PowerBI" },
      { name: "Qualtrics" }
    ],
    pricing: [
      {
        name: "Basic",
        price: "Rp 25.000.000",
        description: "Untuk skala small business",
        features: ["Analisis Pasar Dasar", "5 Kompetitor", "Laporan Written", "1x Presentasi"]
      },
      {
        name: "Professional",
        price: "Rp 75.000.000",
        description: "Untuk scale-up bisnis",
        features: ["Analisis Komprehensif", "15 Kompetitor", "Survei Konsumen", "Pendampingan Strategi"],
        isPopular: true
      },
      {
        name: "Enterprise",
        price: "Hubungi Kami",
        description: "Untuk korporasi besar",
        features: ["Full Research", "Unlimited Kompetitor", "Panel Diskusi", "Dedicated Analyst"]
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
    ],
    faqs: [
      { question: "Berapa lama waktu pengerjaan?", answer: "Rata-rata 2-4 minggu tergantung kompleksitas." },
      { question: "Apakah termasuk survei konsumen?", answer: "Tergantung paket. Basic tidak termasuk, Professional dan Enterprise sudah termasuk." },
      { question: "Bisakah minta tema spesifik?", answer: "Ya, kami lakukan riset sesuai kebutuhan spesifik klien." }
    ],
    order: 0,
    isActive: true
  },
  {
    slug: "analisis-data",
    icon: "analytics",
    title: "Analisis Data",
    shortDescription: "Transformasi data mentah menjai wawasan yang dapat ditindaklanjuti dengan teknik analisis tingkat lanjut.",
    fullDescription: "Layanan Analisis Data kami membantu Anda mengekstrak nilai dari data perusahaan. Menggunakan teknik analisis tingkat lanjut dan alat bantu modern, kami mengubah data mentah menjai wawasan yang dapat ditindaklanjuti.\n\nKami menangani analisis prediktif, segmentasi pelanggan, analisis tren, dan pengujian hipotesis. Tim ahli kami siap membantu Anda mengambil keputusan berbasis data.",
    features: ["Analisis Prediktif", "Segmentasi", "Data Visualization", "Machine Learning"],
    benefits: [
      "Wawasan berbasis data yang akurat",
      "Identifikasi pola dan tren",
      "Prediksi tren masa depan",
      "Optimalisasi operasional"
    ],
    process: [
      { step: 1, title: "Pengumpulan Data", description: "Mengumpulkan dan memvalidasi data dari berbagai sumber." },
      { step: 2, title: "Pembersihan Data", description: "Membersihkan dan mempersiapkan data untuk analisis." },
      { step: 3, title: "Analisis", description: "Menganalisis data menggunakan algoritma tingkat lanjut." },
      { step: 4, title: "Visualisasi", description: "Membuat dasbor dan laporan visual yang informatif." }
    ],
    technologies: [
      { name: "Python" },
      { name: "R" },
      { name: "SQL" },
      { name: "TensorFlow" }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Rp 15.000.000",
        description: "Untuk perusahaan pemula",
        features: ["Basic Analytics", "5 Data Sources", "Laporan Dasar"]
      },
      {
        name: "Business",
        price: "Rp 45.000.000",
        description: "Untuk perusahaan menengah",
        features: ["Advanced Analytics", "20 Data Sources", "Custom Dashboards"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
    ],
    faqs: [
      { question: "Format data apa yang diterima?", answer: "Kami menerima berbagai format: Excel, CSV, SQL database, hingga API." },
      { question: "Berapa lama prose?", answer: "Tergantung kompleksitas, rata-rata 1-3 minggu." }
    ],
    order: 1,
    isActive: true
  },
  {
    slug: "keamanan-siber",
    icon: "security",
    title: "Keamanan Siber",
    shortDescription: "Proteksi komprehensif untuk infrastruktur digital perusahaan Anda dari ancaman siber terkini.",
    fullDescription: "Layanan Keamanan Siber kami menyediakan proteksi komprehensif untuk infrastruktur digital. Dengan pendekatan berlapis dan monitoring 24/7, kami memastikan data dan sistem perusahaan Anda terlindungi dari ancaman siber.\n\nLayanan mencakup penetrasi testing, audit keamanan, implementasi firewall, hingga incident response. Tim ahli kami bersertifikasi internasional dalam keamanan siber.",
    features: ["Penetrasi Testing", "Audit Keamanan", "Firewall Management", "24/7 Monitoring"],
    benefits: [
      "Proteksi maksimal dari ancaman",
      "Kepatuhan terhadap regulasi",
      "Monitoring real-time",
      "Dukungan insiden respons cepat"
    ],
    process: [
      { step: 1, title: "Assessment", description: "Mengevaluasi postur keamanan saat ini." },
      { step: 2, title: "Implementasi", description: "Menerapkan solusi keamanan yang diperlukan." },
      { step: 3, title: "Monitoring", description: "Memantau sistem secara berkelanjutan." }
    ],
    technologies: [
      { name: "Nmap" },
      { name: "Metasploit" },
      { name: "Wireshark" },
      { name: "Snort" }
    ],
    pricing: [
      {
        name: "Basic",
        price: "Rp 30.000.000",
        description: "Untuk UKM",
        features: ["Basic Protection", "Monthly Scan", "Email Support"]
      },
      {
        name: "Enterprise",
        price: "Hubungi Kami",
        description: "Untuk korporasi besar",
        features: ["Full Protection", "24/7 Monitoring", "Dedicated SOC"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-155075144-6c2ba0e42b32?w=800",
      "https://images.unsplash.com/photo-1563013541-6e6471e1b58?w=800"
    ],
    faqs: [
      { question: "Apakah termasuk pelatihan staf?", answer: "Ya, semua paket termasuk pelatihan keamanan untuk staf IT." },
      { question: "Berapa lama kontrak?", answer: "Minimum 1 tahun, bisa disesuaikan dengan kebutuhan." }
    ],
    order: 2,
    isActive: true
  },
  {
    slug: "pengembangan-software",
    icon: "code",
    title: "Pengembangan Software",
    shortDescription: "Pembuatan aplikasi kustom yang skalabel dan andal untuk memenuhi kebutuhan bisnis yang unik.",
    fullDescription: "Layanan Pengembangan Software kami menghadirkan solusi kustom yang dirancang khusus untuk kebutuhan bisnis Anda. Tim pengembang berpengalaman kami menggunakan teknologi terkini untuk membangun aplikasi yang skalabel, aman, dan user-friendly.\n\nKami menangani pengembangan web, mobile, hingga sistem enterprise. Setiap proyek didukung dengan metodologi Agile untuk memastikan fleksibilitas dan kualitas terbaik.",
    features: ["Web Development", "Mobile Apps", "Enterprise Systems", "API Integration"],
    benefits: [
      "Solusi kustom sesuai kebutuhan",
      "Skalabilitas sistem",
      "Keamanan terjamin",
      "Dukungan purna jual"
    ],
    process: [
      { step: 1, title: "Requirement Gathering", description: "Memahami kebutuhan software secara mendalam." },
      { step: 2, title: "Design", description: "Membuat desain UI/UX dan arsitektur sistem." },
      { step: 3, title: "Development", description: "Mengkode aplikasi dengan standar tinggi." },
      { step: 4, title: "Testing & Deployment", description: "Menguji dan meluncurkan aplikasi." }
    ],
    technologies: [
      { name: "React" },
      { name: "Node.js" },
      { name: "PostgreSQL" },
      { name: "Docker" }
    ],
    pricing: [
      {
        name: "MVP",
        price: "Rp 50.000.000",
        description: "Untuk proyek percobaan",
        features: ["Basic Features", "1 Platform", "3 Bulan Support"]
      },
      {
        name: "Full Product",
        price: "Rp 150.000.000",
        description: "Untuk produk lengkap",
        features: ["All Features", "Multi-platform", "1 Tahun Support"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551653611-6e1a9e6e2c7?w=800",
      "https://images.unsplash.com/photo-1555067073-3a8d8a9fd2?w=800"
    ],
    faqs: [
      { question: "Berapa lama waktu pengembangan?", answer: "MVP: 1-2 bulan, Full Product: 3-6 bulan." },
      { question: "Apakah bisa revisi?", answer: "Ya, revisi termasuk dalam paket pengembangan." }
    ],
    order: 3,
    isActive: true
  },
  {
    slug: "konsultasi-it",
    icon: "support_agent",
    title: "Konsultasi IT",
    shortDescription: "Panduan ahli dalam merencanakan dan mengimplementasikan strategi teknologi informasi untuk bisnis Anda.",
    fullDescription: "Layanan Konsultasi IT kami menyediakan panduan ahli untuk membantu perusahaan Anda merencanakan dan mengimplementasikan strategi teknologi informasi. Tim konsultan kami memiliki pengalaman luas dalam transformasi digital.\n\nKami membantu mengevaluasi infrastruktur IT, merancang arsitektur sistem, hingga memilih teknologi yang tepat. Hasilnya adalah ekosistem IT yang efisien, aman, dan mendukung pertumbuhan bisnis.",
    features: ["IT Strategy", "Architecture Design", "Digital Transformation", "Technology Selection"],
    benefits: [
      "Strategi IT yang selaras bisnis",
      "Efisiensi biaya operasional",
      "Reduksi risiko teknologi",
      "Akselerasi inovasi"
    ],
    process: [
      { step: 1, title: "Assessment", description: "Mengevaluasi kondisi IT saat ini." },
      { step: 2, title: "Strategy", description: "Merancang strategi IT jangka panjang." },
      { step: 3, title: "Roadmap", description: "Membuat peta jalan implementasi." }
    ],
    technologies: [
      { name: "Enterprise Architecture" },
      { name: "TOGAF" },
      { name: "ITIL" }
    ],
    pricing: [
      {
        name: "Basic",
        price: "Rp 20.000.000",
        description: "Untuk pemula",
        features: ["IT Assessment", "Basic Strategy", "3 Bulan Support"]
      },
      {
        name: "Enterprise",
        price: "Hubungi Kami",
        description: "Untuk korporasi",
        features: ["Full Strategy", "Complete Roadmap", "Dedicated Consultant"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1497366213366-27a2f3f53a4?w=800",
      "https://images.unsplash.com/photo-1519384636198-1a58262f13c7?w=800"
    ],
    faqs: [
      { question: "Apakah termasuk implementasi?", answer: "Konsultasi fokus pada perencanaan, implementasi dikenakan biaya terpisah." },
      { question: "Berapa lama engagement?", answer: "Tergantung skala, 1-6 bulan." }
    ],
    order: 4,
    isActive: true
  },
  {
    slug: "infrastruktur-cloud",
    icon: "cloud",
    title: "Infrastruktur Cloud",
    shortDescription: "Migrasi dan pengelolaan infrastruktur cloud yang aman, skalabel, dan efisien biaya.",
    fullDescription: "Layanan Infrastruktur Cloud kami membantu perusahaan bermigrasi ke cloud dan mengelola infrastruktur secara efisien. Dengan pengalaman dalam berbagai platform cloud, kami memastikan transisi yang mulus dan operasional yang optimal.\n\nLayanan mencakup migrasi cloud, containerization, CI/CD pipeline, hingga monitoring dan optimasi biaya. Kami bekerja dengan AWS, Google Cloud Platform, dan Microsoft Azure.",
    features: ["Cloud Migration", "DevOps", "Containerization", "Cost Optimization"],
    benefits: [
      "Skalabilitas sesuai kebutuhan",
      "Reduksi biaya infrastruktur",
      "Ketersediaan tinggi (high availability)",
      "Keamanan terintegrasi"
    ],
    process: [
      { step: 1, title: "Assessment", description: "Mengevaluasi kesiapan migrasi cloud." },
      { step: 2, title: "Migration", description: "Memigrasikan aplikasi dan data ke cloud." },
      { step: 3, title: "Optimization", description: "Mengoptimasi performa dan biaya." }
    ],
    technologies: [
      { name: "AWS" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Terraform" }
    ],
    pricing: [
      {
        name: "Starter",
        price: "Rp 35.000.000",
        description: "Untuk migrasi sederhana",
        features: ["Basic Migration", "1 Cloud Provider", "Monitoring"]
      },
      {
        name: "Enterprise",
        price: "Hubungi Kami",
        description: "Untuk migrasi kompleks",
        features: ["Complex Migration", "Multi-cloud", "24/7 Support"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1451187580454-e65d3f1e2?w=800",
      "https://images.unsplash.com/photo-1504639305580-babf9972a70?w=800"
    ],
    faqs: [
      { question: "Platform cloud apa yang didukung?", answer: "AWS, Google Cloud Platform, dan Microsoft Azure." },
      { question: "Apakah termasuk pelatihan tim?", answer: "Ya, pelatihan termasuk dalam paket Enterprise." }
    ],
    order: 5,
    isActive: true
  },
  {
    slug: "manajemen-proyek",
    icon: "task_alt",
    title: "Manajemen Proyek",
    shortDescription: "Pengelolaan proyek IT yang terstruktur dengan metodologi Agile untuk hasil maksimal dan tepat waktu.",
    fullDescription: "Layanan Manajemen Proyek kami memastikan proyek IT Anda berjalan dengan lancar, tepat waktu, dan sesuai anggaran. Menggunakan metodologi Agile dan alat manajemen proyek modern, kami mengoordinasikan tim dan sumber daya untuk hasil maksimal.\n\nKami menangani perencanaan proyek, pengaturan tim, pengawasan progres, hingga serah terima. Setiap proyek dimonitor dengan metrik kinerja yang transparan.",
    features: ["Agile Project Management", "Scrum/Kanban", "Resource Planning", "Risk Management"],
    benefits: [
      "Proyek selesai tepat waktu",
      "Transparansi progres",
      "Optimalisasi sumber daya",
      "Reduksi risiko proyek"
    ],
    process: [
      { step: 1, title: "Initiation", description: "Mendefinisikan ruang lingkup dan tujuan proyek." },
      { step: 2, title: "Planning", description: "Membuat rencana proyek detail." },
      { step: 3, title: "Execution", description: "Mengeksekusi proyek dengan monitoring ketat." },
      { step: 4, title: "Closure", description: "Menyelesaikan proyek dan serah terima." }
    ],
    technologies: [
      { name: "Jira" },
      { name: "Trello" },
      { name: "Asana" },
      { name: "MS Project" }
    ],
    pricing: [
      {
        name: "Small",
        price: "Rp 30.000.000",
        description: "Untuk proyek kecil",
        features: ["1 Project Manager", "Basic Tools", "3 Bulan Duration"]
      },
      {
        name: "Large",
        price: "Hubungi Kami",
        description: "Untuk proyek kompleks",
        features: ["Dedicated Team", "Advanced Tools", "Flexible Duration"],
        isPopular: true
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1499750311576-3b34a7d29b9?w=800",
      "https://images.unsplash.com/photo-1553870524976-3b34a7d29b9?w=800"
    ],
    faqs: [
      { question: "Metodologi apa yang dipakai?", answer: "Kami menggunakan Agile/Scrum, bisa disesuaikan dengan kebutuhan klien." },
      { question: "Bisakah mengelola proyek existing?", answer: "Ya, kami bisa mengambil alih dan mengelola proyek yang sudah berjalan." }
    ],
    order: 6,
    isActive: true
  }
];

const pagesData = [
  {
    slug: "/",
    title: "Beranda",
    metaTitle: "Wahana Data Utama - Solusi Data Inovatif",
    metaDesc: "Mentransformasi data menjadi solusi strategis.",
    isPublished: true,
    sections: {}
  },
  {
    slug: "/AboutPage",
    title: "Tentang Kami",
    metaTitle: "Tentang Wahana Data Utama",
    metaDesc: "Profil perusahaan Wahana Data Utama.",
    isPublished: true,
    sections: {}
  },
  {
    slug: "/ServicePage",
    title: "Layanan",
    metaTitle: "Layanan Kami",
    metaDesc: "Layanan profesional dari Wahana Data Utama.",
    isPublished: true,
    sections: {}
  },
  {
    slug: "/ExperiencePage",
    title: "Pengalaman",
    metaTitle: "Pengalaman & Proyek",
    metaDesc: "Pengalaman dan portofolio proyek Wahana Data Utama.",
    isPublished: true,
    sections: {}
  },
  {
    slug: "/Sis-WduPage",
    title: "SIS-WDU",
    metaTitle: "Sistem Informasi Wahana Data Utama",
    metaDesc: "Platform sistem informasi WDU.",
    isPublished: true,
    sections: {}
  },
  {
    slug: "/ContactPage",
    title: "Kontak",
    metaTitle: "Hubungi Kami",
    metaDesc: "Kontak dan lokasi kantor Wahana Data Utama.",
    isPublished: true,
    sections: {}
  }
];

// 29 partners from ExperiencePage (years 2024-2020) with background images
const partnersData = [
  // 2024 - 5 partners (with background images)
  { name: 'BPK RI', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg', year: '2024', isActive: true },
  { name: 'BPOM', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-300x205.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/a3f30e87-3b43-418b-b4ba-4529ed4e895a.jpg', year: '2024', isActive: true },
  { name: 'BKPM', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-300x205.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/1384bbe7-3362-446d-b989-77114335e7ea-scaled.jpg', year: '2024', isActive: true },
  { name: 'KOMINFO', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593-251x300.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/91ff19eb-9bae-41be-bd79-86c09efa26ae.jpg', year: '2024', isActive: true },
  { name: 'PALJAYA', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/feac7c05-7818-4564-951d-893e14f37bfe-scaled.jpg', year: '2024', isActive: true },
  
  // 2023 - 5 partners
  { name: 'PALJAYA', category: 'Network', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2023', isActive: true },
  { name: 'KOMINFO', category: 'Finance', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/header-layanan-r0d1p013xjdauuqbpgua94u7h5oe3zp0dnk4ku7wdc.jpg', year: '2023', isActive: true },
  { name: 'BPK', category: 'Education', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2023', isActive: true },
  { name: 'STM Yogyakarta', category: 'Education', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2023', isActive: true },
  { name: 'Universitas Pakuan', category: 'Education', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/transpakuan-square-resized-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2023', isActive: true },
  
  // 2022 - 10 partners
  { name: 'BUMN', category: 'Security', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2022', isActive: true },
  { name: 'KOMINFO', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/header-layanan-r0d1p013xjdauuqbpgua94u7h5oe3zp0dnk4ku7wdc.jpg', year: '2022', isActive: true },
  { name: 'Jakarta Square', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'Perpusnas', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/perpusnas-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'Kabupaten Blora', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/blora-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'PEPI', category: 'Education', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/injiniring-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'Pasar Pakuan Jaya', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'Kemendes', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2022', isActive: true },
  { name: 'BPK', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2022', isActive: true },
  { name: 'BPK', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2022', isActive: true },
  
  // 2021 - 7 partners
  { name: 'BPOM', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2021', isActive: true },
  { name: 'BKPM', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2021', isActive: true },
  { name: 'KPK', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2021', isActive: true },
  { name: 'Kemendes', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2021', isActive: true },
  { name: 'BPK RI', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/2025/01/433319d2-e1de-4c4f-9a80-b83df6470507-scaled.jpg', year: '2021', isActive: true },
  { name: 'KPK', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2021', isActive: true },
  { name: 'PALJAYA', category: 'Government', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2021', isActive: true },
  
  // 2020 - 2 partners
  { name: 'BPK', category: 'Finance', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-2-scaled-qzz41v3uq1iw5ezxx3694wk5veazbnw3q62nnmrcww.jpg', year: '2020', isActive: true },
  { name: 'Kemendes', category: 'Finance', logo: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-150x150.png', image: 'https://wahanadata.co.id/wp-content/uploads/elementor/thumbs/wdu-header-scaled-qzz45b6js68qpxzpskt0a190a9bfjpko786r05ne3k.jpg', year: '2020', isActive: true },
];

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@wdu.co.id' },
    update: {},
    create: {
      email: 'admin@wdu.co.id',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin user created: admin@wdu.co.id / admin123');

  // Seed services
  for (const service of servicesData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`Seeded ${servicesData.length} services`);

  // Seed pages
  for (const page of pagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  console.log(`Seeded ${pagesData.length} pages`);

  // Seed partners from ExperiencePage (29 partners)
  // First, delete existing partners
  await prisma.partner.deleteMany({});
  console.log('Cleared existing partners');

  for (const partner of partnersData) {
    await prisma.partner.create({
      data: partner,
    });
  }

  console.log(`Seeded ${partnersData.length} partners`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
