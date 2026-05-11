import { Routes, Route, Navigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import PublicLayout from "./components/PublicLayout";
import PageGuard from "./components/PageGuard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ExperiencePage from "./pages/ExperiencePage";
import ContactPage from "./pages/ContactPage";
import MarketResearchPage from "./pages/MarketResearchPage";
import DataAnalysisPage from "./pages/DataAnalysisPage";
import ItConsultingPage from "./pages/ItConsultingPage";
import DataResearchPage from "./pages/DataResearchPage";
import EventOrganizerPage from "./pages/EventOrganizerPage";
import SurveyPage from "./pages/SurveyPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./admin/AdminDashboard";
import AdminServices from "./admin/AdminServices";
import AdminProjects from "./admin/AdminProjects";
import AdminTimeline from "./admin/AdminTimeline";
import AdminMessages from "./admin/AdminMessages";
import AdminProfile from "./admin/AdminProfile";
import AdminMedia from "./admin/AdminMedia";
import AdminPages from "./admin/AdminPages";
import AdminHero from "./admin/AdminHero";
import AdminSettings from "./admin/AdminSettings";
import AdminPartnerClient from "./admin/AdminPartnerClient";
import AdminUsers from "./admin/AdminUsers";
import AdminSiteConfig from "./admin/AdminSiteConfig";
import AdminSecurity from "./admin/AdminSecurity";
import AdminIntegration from "./admin/AdminIntegration";
import AdminActivityLog from "./admin/AdminActivityLog";

const pageVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PageGuard slug="home"><HomePage /></PageGuard>} />
          <Route path="/tentang-kami" element={<PageGuard slug="tentang-kami"><AboutPage /></PageGuard>} />
          <Route path="/layanan" element={<PageGuard slug="layanan"><ServicesPage /></PageGuard>} />
          <Route path="/portfolio" element={<PageGuard slug="portfolio"><ExperiencePage /></PageGuard>} />
          <Route path="/kontak" element={<PageGuard slug="kontak"><ContactPage /></PageGuard>} />
          <Route path="/riset-pasar" element={<PageGuard slug="riset-pasar"><MarketResearchPage /></PageGuard>} />
          <Route path="/analisis-data" element={<PageGuard slug="analisis-data"><DataAnalysisPage /></PageGuard>} />
          <Route path="/konsultasi-it" element={<PageGuard slug="konsultasi-it"><ItConsultingPage /></PageGuard>} />
          <Route path="/riset-data" element={<PageGuard slug="riset-data"><DataResearchPage /></PageGuard>} />
          <Route path="/event-organizer" element={<PageGuard slug="event-organizer"><EventOrganizerPage /></PageGuard>} />
          <Route path="/survei" element={<PageGuard slug="survei"><SurveyPage /></PageGuard>} />
          <Route path="/sis-wdu" element={<PageGuard slug="sis-wdu"><ComingSoonPage /></PageGuard>} />
          <Route path="/privacy-policy" element={<PageGuard slug="privacy-policy"><PrivacyPolicyPage /></PageGuard>} />
          <Route path="/terms-of-service" element={<PageGuard slug="terms-of-service"><TermsOfServicePage /></PageGuard>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
          <Route path="projects" element={<AnimatedPage><AdminProjects /></AnimatedPage>} />
          <Route path="projects/timeline" element={<AnimatedPage><AdminTimeline /></AnimatedPage>} />
          <Route path="services" element={<AnimatedPage><AdminServices /></AnimatedPage>} />
          <Route path="partner-client" element={<AnimatedPage><AdminPartnerClient /></AnimatedPage>} />
          <Route path="pages" element={<AnimatedPage><AdminPages /></AnimatedPage>} />
          <Route path="hero" element={<AnimatedPage><AdminHero /></AnimatedPage>} />
          <Route path="messages" element={<AnimatedPage><AdminMessages /></AnimatedPage>} />
          <Route path="profile" element={<AnimatedPage><AdminProfile /></AnimatedPage>} />
          <Route path="media" element={<AnimatedPage><AdminMedia /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><AdminSettings /></AnimatedPage>} />
          <Route path="users" element={<AnimatedPage><AdminUsers /></AnimatedPage>} />
          <Route path="config" element={<Navigate to="/admin/config/site" replace />} />
          <Route path="config/site" element={<AnimatedPage><AdminSiteConfig /></AnimatedPage>} />
          <Route path="config/profile" element={<AnimatedPage><AdminProfile /></AnimatedPage>} />
          <Route path="config/security" element={<AnimatedPage><AdminSecurity /></AnimatedPage>} />
          <Route path="config/integration" element={<AnimatedPage><AdminIntegration /></AnimatedPage>} />
          <Route path="activity" element={<AnimatedPage><AdminActivityLog /></AnimatedPage>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
