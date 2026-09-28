import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Sun, 
  Moon, 
  ShieldCheck, 
  Database, 
  Users, 
  LogOut, 
  LogIn, 
  Menu, 
  ChevronDown, 
  Sparkles,
  School
} from 'lucide-react';
import { loginWithGoogle, logoutUser } from '../firebase';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    setCurrentRole, 
    isDarkMode, 
    toggleDarkMode, 
    isConnectedToFirebase, 
    firebaseUser,
    logout 
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'ADMIN', label: 'ADMINISTRATOR', desc: 'Akses penuh seluruh modul, kelola user & API', color: 'bg-rose-500' },
    { role: 'KEPALA', label: 'KEPALA MADRASAH', desc: 'Monitoring data & ekspor laporan seluruh modul', color: 'bg-emerald-600' },
    { role: 'WAKAKUR', label: 'WAKA KURIKULUM', desc: 'Akses penuh input, lihat, edit & hapus', color: 'bg-blue-600' },
    { role: 'WAKASIS', label: 'WAKA KESISWAAN', desc: 'Akses input & kelola prestasi siswa', color: 'bg-amber-600' },
    { role: 'HUMAS', label: 'WAKA HUMAS', desc: 'Akses publikasi & kemitraan madrasah', color: 'bg-purple-600' },
    { role: 'GURU', label: 'DEWAN GURU', desc: 'Akses menu operasional pembelajaran', color: 'bg-teal-600' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setShowRoleDropdown(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Handled
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Handled
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0 font-bold text-lg">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white leading-tight">
                  eKurikulum <span className="text-emerald-600 dark:text-emerald-400">MTs. Nurul Jadid</span>
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  TP 2026/2027
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-md">
                Paiton Probolinggo • Kurikulum Berbasis Cinta (KBC) & Deep Learning
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Role Selector & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Database Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700" title="Status Koneksi Cloud Firestore">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden xl:inline">Firebase:</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tersambung</span>
          </div>

          {/* Role Switcher Dropdown - Hanya tampil untuk ADMIN & WAKAKUR */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'WAKAKUR') && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-400 font-normal uppercase leading-none">Role Aktif</div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">{currentUser.role}</div>
                </div>
                <span className="sm:hidden font-bold">{currentUser.role}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      Simulasi Hak Akses Pengguna
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pilih peran untuk menguji batasan akses modul sistem
                    </p>
                  </div>
                  <div className="space-y-1">
                    {roles.map(r => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleChange(r.role)}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                          currentUser.role === r.role
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${r.color}`}></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {r.label}
                            </span>
                            {currentUser.role === r.role && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Aktif</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Account / Google Login Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {firebaseUser?.displayName ? firebaseUser.displayName.charAt(0) : 'A'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {firebaseUser?.displayName || currentUser.displayName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {firebaseUser?.email || currentUser.email}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Sparkles className="w-3 h-3" /> Peran: {currentUser.role}
                  </div>
                </div>

                <div className="pt-2 space-y-1">
                  {!firebaseUser && (
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg text-left transition"
                    >
                      <LogIn className="w-4 h-4 text-emerald-600" />
                      Hubungkan Akun Google
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (firebaseUser) {
                        handleGoogleLogout();
                      }
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg text-left transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    Keluar dari Sesi (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
