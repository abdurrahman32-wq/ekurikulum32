import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, AppAccount } from '../types';
import { 
  UserPlus, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Lock, 
  Mail, 
  Briefcase, 
  Building, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Download, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertTriangle,
  School,
  KeyRound,
  Filter,
  X,
  Check
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../utils/exportUtils';

interface PengaturanAkunViewProps {
  initialTab?: 'tambah-akun' | 'profil';
}

export const PengaturanAkunView: React.FC<PengaturanAkunViewProps> = ({ initialTab = 'profil' }) => {
  const { 
    currentUser, 
    accounts, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    toggleAccountStatus,
    canAccessTambahAkun,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  // Check if current user has permission for Tambah Akun
  const hasAccessToTambahAkun = canAccessTambahAkun();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'tambah-akun' | 'profil'>(() => {
    if (initialTab === 'tambah-akun' && hasAccessToTambahAkun) {
      return 'tambah-akun';
    }
    return hasAccessToTambahAkun ? 'tambah-akun' : 'profil';
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal / Form States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AppAccount | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    username: '',
    namaLengkap: '',
    email: '',
    password: '',
    role: 'GURU' as UserRole,
    jabatan: '',
    department: '',
    status: 'aktif' as 'aktif' | 'non-aktif'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // In-app interactive Delete Modal States (no window.confirm)
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState<AppAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // In-app interactive Reset Password Modal States (no prompt)
  const [resetPasswordAccount, setResetPasswordAccount] = useState<AppAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // In-app Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Role options with detailed descriptions and badges
  const roleOptions: { role: UserRole; title: string; desc: string; badgeColor: string; iconBg: string }[] = [
    {
      role: 'ADMIN',
      title: 'Administrator (Super Admin)',
      desc: 'Akses penuh ke seluruh 10 modul, audit log, integrasi API & manajemen akun',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      iconBg: 'bg-rose-500/10 text-rose-500'
    },
    {
      role: 'KEPALA',
      title: 'Kepala Madrasah',
      desc: 'Supervisi akademik, monitoring seluruh dokumen perencanaan, kalender & legalitas SK',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      iconBg: 'bg-emerald-500/10 text-emerald-500'
    },
    {
      role: 'WAKAKUR',
      title: 'Waka Kurikulum',
      desc: 'Pengembangan Prota, Promes, ATP, KOSP, pembagian jadwal KBM & manajemen kurikulum',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      iconBg: 'bg-blue-500/10 text-blue-500'
    },
    {
      role: 'WAKASIS',
      title: 'Waka Kesiswaan',
      desc: 'Pengelolaan prestasi santri, ekstrakurikuler, amaliah santri & pembinaan siswa',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      iconBg: 'bg-amber-500/10 text-amber-500'
    },
    {
      role: 'HUMAS',
      title: 'Waka Humas',
      desc: 'Hubungan masyarakat, kemitraan madrasah, publikasi kegiatan & dokumentasi',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      iconBg: 'bg-purple-500/10 text-purple-500'
    },
    {
      role: 'GURU',
      title: 'Dewan Guru Pamong',
      desc: 'Pengelolaan administrasi KBM, bank soal, kisi-kisi, asesmen KBC & input nilai RDM',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800',
      iconBg: 'bg-teal-500/10 text-teal-500'
    }
  ];

  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setFormData({
      username: '',
      namaLengkap: '',
      email: '',
      password: '',
      role: 'GURU',
      jabatan: 'Dewan Guru Pamong',
      department: 'Dewan Guru MTs. Nurul Jadid',
      status: 'aktif'
    });
    setFormError(null);
    setFormSuccess(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (account: AppAccount) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      namaLengkap: account.namaLengkap,
      email: account.email,
      password: '',
      role: account.role,
      jabatan: account.jabatan || '',
      department: account.department || '',
      status: account.status
    });
    setFormError(null);
    setFormSuccess(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.username.trim()) {
      setFormError('Username akun wajib diisi.');
      return;
    }

    if (!formData.namaLengkap.trim()) {
      setFormError('Nama lengkap pengguna wajib diisi.');
      return;
    }

    // Check duplicate username if adding new
    if (!editingAccount) {
      const exists = accounts.some(a => a.username.toLowerCase() === formData.username.trim().toLowerCase());
      if (exists) {
        setFormError(`Username "${formData.username}" sudah digunakan akun lain. Silakan gunakan username lain.`);
        return;
      }
    }

    const emailValue = formData.email.trim() || `${formData.username.trim().toLowerCase()}@mtsnuruljadid.sch.id`;

    try {
      if (editingAccount) {
        await updateAccount({
          ...editingAccount,
          username: formData.username.trim(),
          namaLengkap: formData.namaLengkap.trim(),
          email: emailValue,
          role: formData.role,
          jabatan: formData.jabatan.trim() || 'Staf Madrasah',
          department: formData.department.trim() || 'MTs. Nurul Jadid',
          status: formData.status,
          ...(formData.password ? { password: formData.password } : {})
        });
        setFormSuccess('Akun pengguna berhasil diperbarui.');
      } else {
        await addAccount({
          username: formData.username.trim(),
          namaLengkap: formData.namaLengkap.trim(),
          email: emailValue,
          role: formData.role,
          jabatan: formData.jabatan.trim() || (formData.role === 'GURU' ? 'Dewan Guru Pamong' : 'Staf Struktural'),
          department: formData.department.trim() || 'MTs. Nurul Jadid Paiton',
          status: formData.status,
          password: formData.password || 'admin123'
        });
        setFormSuccess('Akun baru berhasil didaftarkan ke sistem.');
      }

      setTimeout(() => {
        setShowFormModal(false);
        setFormSuccess(null);
      }, 1000);
    } catch (err: any) {
      setFormError(err?.message || 'Terjadi kesalahan saat menyimpan data akun.');
    }
  };

  const openDeleteModal = (account: AppAccount) => {
    if (account.username === 'admin') {
      showToast('Akun Administrator Utama tidak dapat dihapus demi keamanan sistem.');
      return;
    }
    setConfirmDeleteAccount(account);
  };

  const executeDelete = async () => {
    if (!confirmDeleteAccount) return;
    if (confirmDeleteAccount.username === 'admin') {
      showToast('Akun Administrator Utama tidak dapat dihapus.');
      setConfirmDeleteAccount(null);
      return;
    }
    try {
      setIsDeleting(true);
      await deleteAccount(confirmDeleteAccount.id);
      showToast(`Akun "${confirmDeleteAccount.namaLengkap}" (@${confirmDeleteAccount.username}) berhasil dihapus.`);
      setConfirmDeleteAccount(null);
    } catch (err: any) {
      showToast(err?.message || 'Gagal menghapus akun pengguna.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openResetPasswordModal = (account: AppAccount) => {
    setResetPasswordAccount(account);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowResetPassword(false);
    setResetError(null);
  };

  const executeResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetPasswordAccount) return;

    if (!newPassword.trim()) {
      setResetError('Kata sandi baru tidak boleh kosong.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('Konfirmasi kata sandi tidak cocok. Pastikan kedua isian sandi identik.');
      return;
    }

    try {
      setIsResetting(true);
      await updateAccount({
        ...resetPasswordAccount,
        password: newPassword
      });
      showToast(`Kata sandi akun @${resetPasswordAccount.username} berhasil diatur ulang.`);
      setResetPasswordAccount(null);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setResetError(err?.message || 'Gagal mengatur ulang kata sandi akun.');
    } finally {
      setIsResetting(false);
    }
  };

  // Filtered accounts list
  const filteredAccounts = accounts.filter(acc => {
    const matchSearch = 
      acc.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || acc.role === filterRole;
    const matchStatus = filterStatus === 'all' || acc.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'DAFTAR AKUN & HAK AKSES PENGGUNA eKURIKULUM',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Username', 'Nama Lengkap', 'Peran (Role)', 'Jabatan / Unit', 'Email Madrasah', 'Status'],
      rows: filteredAccounts.map((a, idx) => [
        idx + 1,
        a.username,
        a.namaLengkap,
        a.role,
        a.jabatan || a.department,
        a.email,
        a.status.toUpperCase()
      ]),
      fileName: 'Daftar_Akun_Pengguna_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const data = filteredAccounts.map((a, idx) => ({
      No: idx + 1,
      Username: a.username,
      'Nama Lengkap': a.namaLengkap,
      'Peran (Role)': a.role,
      Jabatan: a.jabatan,
      Departemen: a.department,
      Email: a.email,
      Status: a.status.toUpperCase(),
      'Tanggal Dibuat': a.createdAt ? a.createdAt.slice(0, 10) : '-'
    }));
    exportTableToExcel(data, 'Daftar_Akun_Pengguna_MTs_Nurul_Jadid', 'Akun Pengguna');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sistem Manajemen Pengguna & Konfigurasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pengaturan & Akun Pengguna
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pusat pengelolaan akun pengguna, penugasan peran hak akses (RBAC), pengaturan keamanan sesi, dan profil madrasah MTs. Nurul Jadid Paiton.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
              <div className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">Peran Sesi Anda</div>
              <div className="text-base font-extrabold text-white">{currentUser.role}</div>
              <div className="text-[10px] text-slate-300 truncate max-w-[180px]">{currentUser.displayName}</div>
            </div>
          </div>
        </div>

        {/* Sub-menu Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-800/60 overflow-x-auto">
          {hasAccessToTambahAkun && (
            <button
              onClick={() => setActiveTab('tambah-akun')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'tambah-akun'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah & Kelola Akun</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40 text-white font-extrabold">
                {accounts.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('profil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profil'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Saya & Sesi</span>
          </button>
        </div>
      </div>

      {/* Guard Notice: When user with role GURU, WAKASIS, or HUMAS attempts to access Tambah Akun */}
      {!hasAccessToTambahAkun && activeTab === 'tambah-akun' && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                Akses Dibatasi (Hak Akses Terbatas)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Sub-menu <strong>Tambah Akun</strong> hanya dapat diakses oleh Administrator (Super Admin), Waka Kurikulum, dan Pimpinan Madrasah. Akun dengan peran <strong>{currentUser.role}</strong> tidak memiliki otorisasi untuk menambah atau memodifikasi akun pengguna lain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: TAMBAH & KELOLA AKUN (Protected) */}
      {hasAccessToTambahAkun && activeTab === 'tambah-akun' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase">Total Akun</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {accounts.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Terdaftar di sistem</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase">Akun Aktif</span>
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                {accounts.filter(a => a.status === 'aktif').length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Dapat login aktif</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase">Admin & Pimpinan</span>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {accounts.filter(a => a.role === 'ADMIN' || a.role === 'KEPALA' || a.role === 'WAKAKUR').length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hak akses manajemen</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                <span className="text-xs font-bold uppercase">Guru & Staf</span>
                <School className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {accounts.filter(a => a.role === 'GURU' || a.role === 'WAKASIS' || a.role === 'HUMAS').length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pendidik & Kesiswaan</div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari username, nama pengguna, email, atau jabatan..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Role:</span>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Role</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="KEPALA">KEPALA</option>
                  <option value="WAKAKUR">WAKAKUR</option>
                  <option value="WAKASIS">WAKASIS</option>
                  <option value="HUMAS">HUMAS</option>
                  <option value="GURU">GURU</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="non-aktif">Non-Aktif</option>
                </select>
              </div>

              <button
                onClick={handleExportPDF}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Ekspor PDF"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Ekspor Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Excel</span>
              </button>

              {/* Button Tambah Akun Baru */}
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Akun Baru</span>
              </button>
            </div>
          </div>

          {/* Table of Accounts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-3.5 text-center w-12">No</th>
                    <th className="px-4 py-3.5">Pengguna & Username</th>
                    <th className="px-4 py-3.5">Peran (Role)</th>
                    <th className="px-4 py-3.5">Jabatan & Departemen</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                        Tidak ada akun yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((acc, idx) => {
                      const roleConfig = roleOptions.find(r => r.role === acc.role);
                      const isCurrent = currentUser.email === acc.email || currentUser.displayName === acc.namaLengkap;

                      return (
                        <tr key={acc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3.5 text-center font-semibold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {acc.namaLengkap.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <span>{acc.namaLengkap}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span className="font-mono text-emerald-600 dark:text-emerald-400">@{acc.username}</span>
                                  <span>•</span>
                                  <span>{acc.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${roleConfig?.badgeColor || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                              {acc.role}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {acc.jabatan || 'Dewan Guru'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {acc.department || 'MTs. Nurul Jadid'}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              type="button"
                              onClick={() => toggleAccountStatus(acc.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition cursor-pointer ${
                                acc.status === 'aktif'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-slate-500/15 text-slate-500 border border-slate-500/30 hover:bg-slate-500/25'
                              }`}
                              title="Klik untuk mengubah status aktif / non-aktif"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              <span>{acc.status}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(acc)}
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                                title="Edit Akun"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => openResetPasswordModal(acc)}
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
                                title="Atur Ulang Kata Sandi Akun"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>

                              {acc.username !== 'admin' && (
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(acc)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 transition cursor-pointer"
                                  title="Hapus Akun Pengguna"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFIL SAYA & KEAMANAN SESI (Accessible by all) */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Profile Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                {currentUser.displayName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {currentUser.displayName}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentUser.email}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Role Aktif: {currentUser.role}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Unit / Departemen:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.department || 'MTs. Nurul Jadid'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Tahun Pelajaran:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">2026/2027 (KBC)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status Sesi:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span> Aktif & Terverifikasi
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Otorisasi Menu Akun Anda:
              </h4>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
                {currentUser.role === 'ADMIN' && (
                  <div>Akses penuh ke seluruh 10 modul kurikulum, manajemen user, log keamanan, dan integrasi API.</div>
                )}
                {currentUser.role === 'KEPALA' && (
                  <div>Akses monitoring seluruh modul, supervisi akademik guru, legalitas SK, dan ekspor laporan resmi.</div>
                )}
                {currentUser.role === 'WAKAKUR' && (
                  <div>Akses penuh perencanaan (Prota, Promes, ATP, KOSP), administrasi guru, dan jadwal KBM.</div>
                )}
                {currentUser.role === 'WAKASIS' && (
                  <div>Akses pengelolaan prestasi santri, rekap kejuaraan lomba, dan pembinaan kesiswaan.</div>
                )}
                {currentUser.role === 'HUMAS' && (
                  <div>Akses dokumentasi madrasah, publikasi kegiatan, dan hubungan kemitraan.</div>
                )}
                {currentUser.role === 'GURU' && (
                  <div>Akses 9 menu operasional pembelajaran: perencanaan KBM, administrasi mengajar, bank soal, dan nilai RDM.</div>
                )}
              </div>
            </div>
          </div>

          {/* Session & App Settings (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Pengaturan Sesi & Tampilan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kustomisasi preferensi tampilan antarmuka dan pengelolaan keamanan data lokal.
              </p>
            </div>

            <div className="space-y-4">
              {/* Theme switcher option */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Mode Tampilan (Tema)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Beralih antara mode Terang (Light) dan mode Gelap (Dark)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  {isDarkMode ? 'Beralih ke Terang' : 'Beralih ke Gelap'}
                </button>
              </div>

              {/* Session Persistence info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Preservasi Sesi Aktif
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Sesi Anda disimpan secara aman pada penyimpanan peramban lokal. Anda tidak akan terlempar kembali ke layar login saat me-refresh halaman (F5).
                  </div>
                </div>
              </div>

              {/* Reset Password for Current User */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Kata Sandi & Keamanan Akun Anda
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Perbarui atau atur ulang kata sandi login untuk akun sesi aktif Anda ({currentUser.displayName}).
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const myAcc = accounts.find(a => 
                      a.email.toLowerCase() === currentUser.email.toLowerCase() ||
                      a.username.toLowerCase() === currentUser.displayName.toLowerCase()
                    ) || {
                      id: 'acc_current',
                      username: currentUser.email.split('@')[0] || 'pengguna',
                      namaLengkap: currentUser.displayName,
                      email: currentUser.email,
                      role: currentUser.role,
                      jabatan: currentUser.department || 'Staf Madrasah',
                      department: currentUser.department || 'MTs. Nurul Jadid',
                      status: 'aktif',
                      createdAt: new Date().toISOString()
                    };
                    openResetPasswordModal(myAcc);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Ubah Sandi Akun</span>
                </button>
              </div>

              {/* Madrasah Verification info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <School className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Identitas Resmi MTs. Nurul Jadid Paiton
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    NSM: 121235130009 • NPSN: 20584444 • Akreditasi A • Landasan Kurikulum KMA No. 1503 Tahun 2025 & KMA 450 Tahun 2024.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL: TAMBAH / EDIT AKUN DENGAN PILIHAN ROLE */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {editingAccount ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Silakan isi kredensial dan pilih peran hak akses akun
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Username Akun <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                      placeholder="contoh: afauzi"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData(prev => ({ ...prev, namaLengkap: e.target.value }))}
                    placeholder="contoh: Ust. Ahmad Fauzi, M.Pd"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Pengguna
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="nama@mtsnuruljadid.sch.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {editingAccount ? 'Kata Sandi Baru (Kosongkan jika tetap)' : 'Kata Sandi (Password)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={editingAccount ? '••••••••' : 'Masukkan password'}
                      required={!editingAccount}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* PILIHAN ROLE HAK AKSES AKUN (CORE REQUIREMENT) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Pilihan Role Akun (Hak Akses): <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {roleOptions.map((opt) => {
                    const isSelected = formData.role === opt.role;
                    return (
                      <div
                        key={opt.role}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          role: opt.role,
                          jabatan: prev.jabatan || opt.title
                        }))}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                            {opt.role}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {opt.title}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jabatan */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Jabatan Struktural / Tugas
                  </label>
                  <input
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                    placeholder="contoh: Guru Pamong Fikih / Staf Kurikulum"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Status Akun */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'aktif' | 'non-aktif' }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                  >
                    <option value="aktif">Aktif (Dapat Login ke Sistem)</option>
                    <option value="non-aktif">Non-Aktif (Akses Dinonaktifkan)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingAccount ? 'Simpan Perubahan Akun' : 'Simpan & Daftarkan Akun'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 1: KONFIRMASI HAPUS AKUN (IN-APP DIALOG, BEBAS WINDOW.CONFIRM) */}
      {confirmDeleteAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Konfirmasi Hapus Akun
                  </h3>
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                    Tindakan Permanen
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDeleteAccount(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/40 space-y-2">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun pengguna berikut dari sistem eKurikulum?
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{confirmDeleteAccount.namaLengkap}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase">
                    {confirmDeleteAccount.role}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                  Username: @{confirmDeleteAccount.username}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Email: {confirmDeleteAccount.email}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Jabatan: {confirmDeleteAccount.jabatan || confirmDeleteAccount.department}
                </div>
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                Peringatan: Akun ini tidak akan dapat login lagi ke sistem dan hak aksesnya akan dicabut seketika.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteAccount(null)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDelete}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Akun</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ATUR ULANG KATA SANDI (IN-APP DIALOG, BEBAS PROMPT) */}
      {resetPasswordAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Atur Ulang Kata Sandi
                  </h3>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    Keamanan Akun Pengguna
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetPasswordAccount(null);
                  setResetError(null);
                  setNewPassword('');
                  setConfirmNewPassword('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Account Info Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                {resetPasswordAccount.namaLengkap.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {resetPasswordAccount.namaLengkap}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  @{resetPasswordAccount.username} • <span className="uppercase font-bold text-emerald-600 dark:text-emerald-400">{resetPasswordAccount.role}</span>
                </div>
              </div>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={executeResetPassword} className="space-y-3.5">
              {/* Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan sandi baru (min. 6 karakter)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Rekomendasi Pintas Sandi */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold mr-1">Pilihan Cepat:</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewPassword('admin123');
                    setConfirmNewPassword('admin123');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  admin123
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewPassword('madrasah123');
                    setConfirmNewPassword('madrasah123');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  madrasah123
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = `NJ@${Math.floor(1000 + Math.random() * 9000)}`;
                    setNewPassword(rnd);
                    setConfirmNewPassword(rnd);
                  }}
                  className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[10px] font-mono text-amber-700 dark:text-amber-300 border border-amber-300/40 transition cursor-pointer"
                >
                  Acak Sandi Kuat
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordAccount(null);
                    setResetError(null);
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Simpan Kata Sandi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
