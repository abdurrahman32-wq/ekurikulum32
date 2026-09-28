import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  School, 
  HeartHandshake, 
  CheckCircle2,
  BookOpen,
  Award
} from 'lucide-react';
import { loginWithGoogle } from '../firebase';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, accounts } = useApp();

  // Login Form States - Empty initial values for manual input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Silakan masukkan username Anda.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const cleanInput = username.trim().toLowerCase();
      const matchedAccount = accounts?.find(a => 
        a.username.toLowerCase() === cleanInput || 
        a.email.toLowerCase() === cleanInput
      );

      if (matchedAccount) {
        if (matchedAccount.status === 'non-aktif') {
          setErrorMessage('Akun ini telah dinonaktifkan oleh Administrator. Hubungi Biro Kurikulum.');
          setIsLoading(false);
          return;
        }

        login(matchedAccount.role, {
          id: matchedAccount.id,
          email: matchedAccount.email,
          displayName: matchedAccount.namaLengkap,
          department: matchedAccount.department
        });
      } else {
        // Dynamic role detection based on username keyword or default to ADMIN
        let matchedRole: UserRole = 'ADMIN';
        if (cleanInput.includes('guru')) matchedRole = 'GURU';
        else if (cleanInput.includes('wakasis') || cleanInput.includes('kesiswaan')) matchedRole = 'WAKASIS';
        else if (cleanInput.includes('humas')) matchedRole = 'HUMAS';
        else if (cleanInput.includes('wakakur') || cleanInput.includes('kurikulum')) matchedRole = 'WAKAKUR';
        else if (cleanInput.includes('kepala') || cleanInput.includes('kamad')) matchedRole = 'KEPALA';

        login(matchedRole, {
          email: username.includes('@') ? username.trim() : `${username.trim()}@mtsnuruljadid.sch.id`,
          displayName: username.trim()
        });
      }

      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      login('ADMIN', {
        email: 'abdurrahman32@admin.sma.belajar.id',
        displayName: 'Administrator eKurikulum (Super Admin)'
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal login via Google. Silakan gunakan form login langsung.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 my-auto">
        {/* Top Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-500/25 mb-4 ring-4 ring-emerald-500/20">
            <School className="w-9 h-9" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Sistem Informasi Manajemen eKurikulum Terintegrasi
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            MTs. Nurul Jadid Paiton
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Portal Administrasi Kurikulum Berbasis Cinta (KBC) • KMA No. 1503 Tahun 2025 & KMA 450 Tahun 2024
          </p>
        </div>

        {/* Main Login Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Information & Guidance (5 cols on lg) */}
          <div className="lg:col-span-5 bg-linear-to-br from-emerald-950/80 via-slate-900 to-slate-900 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Kurikulum Berbasis Cinta (KBC)
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Selamat Datang di Sistem
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Silakan masuk menggunakan akun Anda untuk mengelola perencanaan, administrasi pembelajaran, dan pemantauan kurikulum.
                </p>
              </div>

              {/* Madrasah Profile Highlights */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">KMA 1503 Tahun 2025</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Integrasi kurikulum cinta: Cinta Allah, Rasul, Ilmu, Diri & Semesta.</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/15 text-teal-400 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">Terakreditasi A</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Penyusunan KOSP, Perangkat Ajar, Asesmen & Administrasi Resmi.</div>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10 Modul Kurikulum Resmi Terpadu</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ekspor PDF & Excel Resmi dengan Kop</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sesi tersimpan otomatis saat di-refresh</span>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>NSM: 121235130009</span>
              <span className="text-emerald-400 font-semibold">Tahun 2026/2027</span>
            </div>
          </div>

          {/* Right Panel: Login Form (7 cols on lg) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-white">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan kredensial akun Anda untuk mengakses dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span className="font-bold">Perhatian:</span> {errorMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-xs sm:text-sm outline-hidden transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-xs sm:text-sm outline-hidden transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-800 border-slate-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-300">
                    Ingat sesi aktif (tetap login saat di-refresh)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Memproses Masuk...
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </button>
              </div>

              {/* Google Login Alternative */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-slate-900 px-3 text-slate-500 font-semibold">
                    Atau Masuk Dengan Akun Google
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.3-.8-.5-1.6-.5-2.6z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.7 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <div>
            &copy; 2026 MTs. Nurul Jadid Paiton Probolinggo • Hak Cipta Dilindungi
          </div>
          <div className="text-[11px] text-slate-600">
            Sistem Informasi Manajemen eKurikulum Terintegrasi Pesantren Nurul Jadid
          </div>
        </div>
      </div>
    </div>
  );
};
