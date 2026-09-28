import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UrgentAnnouncementBanner } from './components/UrgentAnnouncementBanner';

// Views
import { DashboardView } from './views/DashboardView';
import { DokumenIndukView } from './views/DokumenIndukView';
import { PerencanaanKurikulumView } from './views/PerencanaanKurikulumView';
import { AdministrasiGuruView } from './views/AdministrasiGuruView';
import { PenilaianAsesmenView } from './views/PenilaianAsesmenView';
import { SupervisiAkademikView } from './views/SupervisiAkademikView';
import { EvaluasiMonitoringView } from './views/EvaluasiMonitoringView';
import { PrestasiSiswaView } from './views/PrestasiSiswaView';
import { PelatihanGuruView } from './views/PelatihanGuruView';
import { RdmView } from './views/RdmView';
import { AdminMonitoringView } from './views/AdminMonitoringView';
import { IntegrasiApiView } from './views/IntegrasiApiView';
import { DokumentasiDevView } from './views/DokumentasiDevView';
import { PengaturanAkunView } from './views/PengaturanAkunView';
import { LoginView } from './views/LoginView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, onNavigateMenu, currentUser } = useApp();
  const [activeMenu, setActiveMenu] = useState<string>(() => {
    return localStorage.getItem('ekurikulum_active_menu') || 'dashboard';
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleSelectMenu = (menuKey: string) => {
    setActiveMenu(menuKey);
    localStorage.setItem('ekurikulum_active_menu', menuKey);
    onNavigateMenu(menuKey);
  };

  // If user is not yet logged in, show LoginView which redirects to Dashboard
  if (!isAuthenticated) {
    return (
      <LoginView 
        onLoginSuccess={() => {
          setActiveMenu('dashboard');
          localStorage.setItem('ekurikulum_active_menu', 'dashboard');
        }} 
      />
    );
  }

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView onNavigate={handleSelectMenu} />;
      case 'dokumen-induk':
        return <DokumenIndukView initialTab="kurikulum" />;
      case 'dokumen-kurikulum':
        return <DokumenIndukView initialTab="kurikulum" />;
      case 'kalender-pendidikan':
        return <DokumenIndukView initialTab="kalender" />;
      case 'struktur-organisasi':
        return <DokumenIndukView initialTab="struktur" />;
      case 'data-guru':
        return <DokumenIndukView initialTab="guru" />;
      case 'data-rombel':
      case 'data-siswa':
        return <DokumenIndukView initialTab="rombel" />;
      case 'perencanaan-kurikulum':
        return <PerencanaanKurikulumView />;
      case 'administrasi-guru':
        return <AdministrasiGuruView />;
      case 'penilaian-asesmen':
        return <PenilaianAsesmenView />;
      case 'supervisi-akademik':
        return <SupervisiAkademikView />;
      case 'evaluasi-monitoring':
        return <EvaluasiMonitoringView />;
      case 'prestasi-siswa':
        return <PrestasiSiswaView />;
      case 'pelatihan-guru':
        return <PelatihanGuruView />;
      case 'rdm':
      case 'rdm-nilai':
        return <RdmView />;
      case 'admin-monitoring':
        return <AdminMonitoringView />;
      case 'integrasi-api':
        return <IntegrasiApiView />;
      case 'dokumentasi-dev':
        return <DokumentasiDevView />;
      case 'pengaturan':
      case 'pengaturan-profil':
        return <PengaturanAkunView initialTab="profil" />;
      case 'tambah-akun':
        return <PengaturanAkunView initialTab="tambah-akun" />;
      default:
        return <DashboardView onNavigate={handleSelectMenu} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={handleSelectMenu}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
          {/* Urgent Announcement Real-Time Broadcast Banner */}
          <UrgentAnnouncementBanner />

          {/* Page Body Viewport */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs py-6 px-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white">
                  eKurikulum MTs. Nurul Jadid Paiton Probolinggo
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  NSM: 121235130009 • NPSN: 20582845 • Akreditasi A (Unggul) • Kemenag RI
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
                <button
                  onClick={() => handleSelectMenu('dokumentasi-dev')}
                  className="hover:text-emerald-600 transition"
                >
                  Dokumentasi Teknis
                </button>
                <span>•</span>
                <button
                  onClick={() => handleSelectMenu('integrasi-api')}
                  className="hover:text-emerald-600 transition"
                >
                  Integrasi API
                </button>
                <span>•</span>
                <button
                  onClick={() => handleSelectMenu('admin-monitoring')}
                  className="hover:text-emerald-600 transition"
                >
                  Audit Keamanan
                </button>
                <span>•</span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  KBC & Deep Learning 2026/2027
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
