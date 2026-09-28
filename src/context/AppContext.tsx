import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  AppAccount,
  RombelItem,
  Student, 
  Teacher, 
  ProtaItem, 
  PromesItem, 
  ATPItem, 
  SKTugasGuruItem, 
  KisiKisiItem, 
  BankSoalItem, 
  EvaluasiItem, 
  PrestasiItem, 
  DokumentasiItem, 
  MateriIHTItem, 
  TemplateNilaiItem,
  AnnouncementItem,
  ActivityLogItem 
} from '../types';
import { 
  INITIAL_ROMBEL,
  INITIAL_TEACHERS, 
  INITIAL_STUDENTS, 
  INITIAL_PROTA, 
  INITIAL_PROMES, 
  INITIAL_ATP, 
  INITIAL_SK_TUGAS, 
  INITIAL_KISI_KISI, 
  INITIAL_BANK_SOAL, 
  INITIAL_EVALUASI, 
  INITIAL_PRESTASI, 
  INITIAL_DOKUMENTASI, 
  INITIAL_IHT, 
  INITIAL_NILAI, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_LOGS 
} from '../data/initialData';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AppContextType {
  currentUser: UserProfile;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  login: (role?: UserRole, customUser?: Partial<UserProfile>) => void;
  logout: () => void;
  setCurrentRole: (role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isConnectedToFirebase: boolean;

  // Data Collections
  rombels: RombelItem[];
  students: Student[];
  teachers: Teacher[];
  protaList: ProtaItem[];
  promesList: PromesItem[];
  atpList: ATPItem[];
  skTugasList: SKTugasGuruItem[];
  kisiKisiList: KisiKisiItem[];
  bankSoalList: BankSoalItem[];
  evaluasiList: EvaluasiItem[];
  prestasiList: PrestasiItem[];
  dokumentasiList: DokumentasiItem[];
  ihtList: MateriIHTItem[];
  nilaiList: TemplateNilaiItem[];
  announcements: AnnouncementItem[];
  activityLogs: ActivityLogItem[];
  accounts: AppAccount[];

  // Account Management Actions
  addAccount: (account: Omit<AppAccount, 'id' | 'createdAt'>) => Promise<void>;
  updateAccount: (account: AppAccount) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  toggleAccountStatus: (id: string) => Promise<void>;
  canAccessTambahAkun: () => boolean;

  // Rombel Actions
  addRombel: (rombel: Omit<RombelItem, 'id'>) => Promise<void>;
  updateRombel: (rombel: RombelItem) => Promise<void>;
  deleteRombel: (id: string) => Promise<void>;
  deleteAllRombel: () => Promise<void>;
  importRombels: (rombels: Omit<RombelItem, 'id'>[]) => Promise<void>;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  deleteAllStudents: () => Promise<void>;
  importStudents: (students: Omit<Student, 'id'>[]) => Promise<void>;

  // Prota Actions
  addProta: (item: Omit<ProtaItem, 'id'>) => Promise<void>;
  updateProta: (item: ProtaItem) => Promise<void>;
  deleteProta: (id: string) => Promise<void>;

  // Promes Actions
  addPromes: (item: Omit<PromesItem, 'id'>) => Promise<void>;
  updatePromes: (item: PromesItem) => Promise<void>;
  deletePromes: (id: string) => Promise<void>;
  importPromes: (items: Omit<PromesItem, 'id'>[]) => Promise<void>;

  // ATP Actions
  addATP: (item: Omit<ATPItem, 'id'>) => Promise<void>;
  updateATP: (item: ATPItem) => Promise<void>;
  deleteATP: (id: string) => Promise<void>;

  // SK Tugas Actions
  addSKTugas: (item: Omit<SKTugasGuruItem, 'id'>) => Promise<void>;
  updateSKTugas: (item: SKTugasGuruItem) => Promise<void>;
  deleteSKTugas: (id: string) => Promise<void>;

  // Kisi-Kisi Actions
  addKisiKisi: (item: Omit<KisiKisiItem, 'id'>) => Promise<void>;
  updateKisiKisi: (item: KisiKisiItem) => Promise<void>;
  deleteKisiKisi: (id: string) => Promise<void>;

  // Bank Soal Actions
  addBankSoal: (item: Omit<BankSoalItem, 'id'>) => Promise<void>;
  updateBankSoal: (item: BankSoalItem) => Promise<void>;
  deleteBankSoal: (id: string) => Promise<void>;

  // Evaluasi Actions
  addEvaluasi: (item: Omit<EvaluasiItem, 'id'>) => Promise<void>;
  updateEvaluasi: (item: EvaluasiItem) => Promise<void>;
  deleteEvaluasi: (id: string) => Promise<void>;

  // Prestasi Actions
  addPrestasi: (item: Omit<PrestasiItem, 'id'>) => Promise<void>;
  updatePrestasi: (item: PrestasiItem) => Promise<void>;
  deletePrestasi: (id: string) => Promise<void>;

  // Dokumentasi Actions
  addDokumentasi: (item: Omit<DokumentasiItem, 'id'>) => Promise<void>;
  deleteDokumentasi: (id: string) => Promise<void>;

  // IHT Actions
  addIHT: (item: Omit<MateriIHTItem, 'id'>) => Promise<void>;
  updateIHT: (item: MateriIHTItem) => Promise<void>;
  deleteIHT: (id: string) => Promise<void>;

  // Nilai Actions
  addNilai: (item: Omit<TemplateNilaiItem, 'id'>) => Promise<void>;
  updateNilai: (item: TemplateNilaiItem) => Promise<void>;
  deleteNilai: (id: string) => Promise<void>;

  // Announcement Actions
  addAnnouncement: (item: Omit<AnnouncementItem, 'id'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Role permissions checking helpers
  canEdit: (menuKey?: string) => boolean;
  canExport: () => boolean;
  canAccessMenu: (menuKey: string) => boolean;

  // Audit Logs alias
  auditLogs: ActivityLogItem[];

  // Navigation callback
  onNavigateMenu: (menuKey: string) => void;

  // Iframe Links Configuration
  iframeUrls: {
    kurikulum: string;
    kalender: string;
    struktur: string;
    dataGuru: string;
    dataRombel: string;
  };
  setIframeUrl: (key: 'kurikulum' | 'kalender' | 'struktur' | 'dataGuru' | 'dataRombel', url: string) => void;
  resetIframeUrl: (key: 'kurikulum' | 'kalender' | 'struktur' | 'dataGuru' | 'dataRombel') => void;
  iframeConfig: {
    rdmUrl: string;
  };
  updateIframeConfig: (config: Partial<{ rdmUrl: string }>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Purge legacy dummy data from localStorage once so the app starts with clean state
if (typeof window !== 'undefined') {
  const CLEAN_KEY = 'ekurikulum_clean_data_v5';
  if (localStorage.getItem(CLEAN_KEY) !== 'true') {
    const dummyKeys = [
      'ek_rombels', 'ek_students', 'ek_teachers', 'ek_prota', 'ek_promes', 'ek_atp', 
      'ek_sk_tugas', 'ek_kisikisi', 'ek_banksoal', 'ek_evaluasi', 
      'ek_prestasi', 'ek_dokumentasi', 'ek_iht', 'ek_nilai', 
      'ek_announcements', 'ek_logs'
    ];
    dummyKeys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem(CLEAN_KEY, 'true');
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ekurikulum_theme') === 'dark';
  });

  // Authentication State - Persisted so refresh does NOT redirect to login page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ekurikulum_is_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('ekurikulum_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // Fallback
      }
    }
    const savedRole = (localStorage.getItem('ekurikulum_role') as UserRole) || 'ADMIN';
    return {
      id: 'usr_admin',
      email: 'admin@mtsnuruljadid.sch.id',
      displayName: 'Administrator eKurikulum (Super Admin)',
      role: savedRole,
      department: 'Biro Kurikulum & SIM MTs. Nurul Jadid'
    };
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isConnectedToFirebase, setIsConnectedToFirebase] = useState<boolean>(false);

  // States with initial data - starts completely empty/clean
  const [rombels, setRombels] = useState<RombelItem[]>(() => {
    const saved = localStorage.getItem('ek_rombels');
    return saved ? JSON.parse(saved) : INITIAL_ROMBEL;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ek_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('ek_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [protaList, setProtaList] = useState<ProtaItem[]>(() => {
    const saved = localStorage.getItem('ek_prota');
    return saved ? JSON.parse(saved) : INITIAL_PROTA;
  });

  const [promesList, setPromesList] = useState<PromesItem[]>(() => {
    const saved = localStorage.getItem('ek_promes');
    return saved ? JSON.parse(saved) : INITIAL_PROMES;
  });

  const [atpList, setAtpList] = useState<ATPItem[]>(() => {
    const saved = localStorage.getItem('ek_atp');
    return saved ? JSON.parse(saved) : INITIAL_ATP;
  });

  const [skTugasList, setSkTugasList] = useState<SKTugasGuruItem[]>(() => {
    const saved = localStorage.getItem('ek_sk_tugas');
    return saved ? JSON.parse(saved) : INITIAL_SK_TUGAS;
  });

  const [kisiKisiList, setKisiKisiList] = useState<KisiKisiItem[]>(() => {
    const saved = localStorage.getItem('ek_kisikisi');
    return saved ? JSON.parse(saved) : INITIAL_KISI_KISI;
  });

  const [bankSoalList, setBankSoalList] = useState<BankSoalItem[]>(() => {
    const saved = localStorage.getItem('ek_banksoal');
    return saved ? JSON.parse(saved) : INITIAL_BANK_SOAL;
  });

  const [evaluasiList, setEvaluasiList] = useState<EvaluasiItem[]>(() => {
    const saved = localStorage.getItem('ek_evaluasi');
    return saved ? JSON.parse(saved) : INITIAL_EVALUASI;
  });

  const [prestasiList, setPrestasiList] = useState<PrestasiItem[]>(() => {
    const saved = localStorage.getItem('ek_prestasi');
    return saved ? JSON.parse(saved) : INITIAL_PRESTASI;
  });

  const [dokumentasiList, setDokumentasiList] = useState<DokumentasiItem[]>(() => {
    const saved = localStorage.getItem('ek_dokumentasi');
    return saved ? JSON.parse(saved) : INITIAL_DOKUMENTASI;
  });

  const [ihtList, setIhtList] = useState<MateriIHTItem[]>(() => {
    const saved = localStorage.getItem('ek_iht');
    return saved ? JSON.parse(saved) : INITIAL_IHT;
  });

  const [nilaiList, setNilaiList] = useState<TemplateNilaiItem[]>(() => {
    const saved = localStorage.getItem('ek_nilai');
    return saved ? JSON.parse(saved) : INITIAL_NILAI;
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('ek_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('ek_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const INITIAL_ACCOUNTS: AppAccount[] = [
    {
      id: 'acc_admin',
      username: 'admin',
      namaLengkap: 'Administrator eKurikulum (Super Admin)',
      email: 'admin@mtsnuruljadid.sch.id',
      role: 'ADMIN',
      jabatan: 'Kepala Biro SIM & IT Kurikulum',
      department: 'Biro Kurikulum & SIM MTs. Nurul Jadid',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-22 10:30'
    },
    {
      id: 'acc_kepala',
      username: 'kepala',
      namaLengkap: 'K. Miftahul Arifin, M.Pd',
      email: 'kepala@mtsnuruljadid.sch.id',
      role: 'KEPALA',
      jabatan: 'Kepala Madrasah Tsanawiyah',
      department: 'Pimpinan Madrasah Tsanawiyah',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-21 14:15'
    },
    {
      id: 'acc_wakakur',
      username: 'wakakur',
      namaLengkap: 'Najibul Hoer, S.Si, M.Pd',
      email: 'wakakur@mtsnuruljadid.sch.id',
      role: 'WAKAKUR',
      jabatan: 'Waka Kurikulum & Pengajaran',
      department: 'Bidang Pengembangan Kurikulum',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-22 09:00'
    },
    {
      id: 'acc_wakasis',
      username: 'wakasis',
      namaLengkap: 'Muh. Utsman, S.Pd',
      email: 'wakasis@mtsnuruljadid.sch.id',
      role: 'WAKASIS',
      jabatan: 'Waka Kesiswaan & Prestasi',
      department: 'Bidang Kesiswaan & Prestasi Santri',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-20 11:20'
    },
    {
      id: 'acc_humas',
      username: 'humas',
      namaLengkap: 'H. Zainullah, M.Pd',
      email: 'humas@mtsnuruljadid.sch.id',
      role: 'HUMAS',
      jabatan: 'Waka Hubungan Masyarakat & Publikasi',
      department: 'Bidang Hubungan Masyarakat & Kemitraan',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-19 16:45'
    },
    {
      id: 'acc_guru',
      username: 'guru',
      namaLengkap: 'Ust. Abd. Qzafur, S.HI, M.Pd.I',
      email: 'guru@mtsnuruljadid.sch.id',
      role: 'GURU',
      jabatan: 'Guru Pamong Fikih & Keagamaan',
      department: 'Dewan Guru MTs. Nurul Jadid',
      status: 'aktif',
      createdAt: '2026-07-15T08:00:00Z',
      lastLogin: '2026-09-22 07:45'
    }
  ];

  const [accounts, setAccounts] = useState<AppAccount[]>(() => {
    const saved = localStorage.getItem('ek_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  // Initial and Default Iframe URLs (Official Google Drive Preview format)
  const DEFAULT_IFRAME_URLS = {
    kurikulum: "https://online.fliphtml5.com/demo/kurikulum",
    kalender: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
    struktur: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
    dataGuru: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
    dataRombel: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-rombel/pubhtml?widget=true&headers=false"
  };

  const [iframeUrls, setIframeUrls] = useState<{
    kurikulum: string;
    kalender: string;
    struktur: string;
    dataGuru: string;
    dataRombel: string;
  }>(() => {
    const saved = localStorage.getItem('ek_iframe_urls');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_IFRAME_URLS, ...parsed };
        // Migrate legacy URLs to official Google Drive preview format if they still have old non-drive defaults
        if (merged.kalender?.includes('calendar.google.com')) {
          merged.kalender = DEFAULT_IFRAME_URLS.kalender;
        }
        if (merged.struktur?.includes('docs.google.com/presentation')) {
          merged.struktur = DEFAULT_IFRAME_URLS.struktur;
        }
        if (merged.dataGuru?.includes('docs.google.com/spreadsheets/d/e/2PACX-1vT')) {
          merged.dataGuru = DEFAULT_IFRAME_URLS.dataGuru;
        }
        localStorage.setItem('ek_iframe_urls', JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('Failed to parse saved iframe URLs:', e);
      }
    }
    return DEFAULT_IFRAME_URLS;
  });

  const [iframeConfig, setIframeConfig] = useState<{ rdmUrl: string }>(() => {
    const saved = localStorage.getItem('ek_rdm_url');
    return { rdmUrl: saved || 'https://rdm.mtsnuruljadid.sch.id' };
  });

  const updateIframeConfig = async (config: Partial<{ rdmUrl: string }>) => {
    if (config.rdmUrl) {
      setIframeConfig(prev => ({ ...prev, rdmUrl: config.rdmUrl! }));
      localStorage.setItem('ek_rdm_url', config.rdmUrl);
      logAction('Update URL Portal RDM', 'RDM', `URL diubah ke ${config.rdmUrl}`);
    }
  };

  const onNavigateMenu = (menuKey: string) => {
    logAction('Navigasi Menu', menuKey, `Akses tampilan ${menuKey}`);
  };

  const setIframeUrl = (key: 'kurikulum' | 'kalender' | 'struktur' | 'dataGuru' | 'dataRombel', url: string) => {
    setIframeUrls(prev => {
      const updated = { ...prev, [key]: url };
      localStorage.setItem('ek_iframe_urls', JSON.stringify(updated));
      return updated;
    });
    logAction('Update URL Iframe', key, `URL iframe ${key} diperbarui`);
  };

  const resetIframeUrl = (key: 'kurikulum' | 'kalender' | 'struktur' | 'dataGuru' | 'dataRombel') => {
    setIframeUrls(prev => {
      const updated = { ...prev, [key]: DEFAULT_IFRAME_URLS[key] };
      localStorage.setItem('ek_iframe_urls', JSON.stringify(updated));
      return updated;
    });
    logAction('Reset URL Iframe', key, `URL iframe ${key} dikembalikan ke nilai awal`);
  };

  // Sync dark mode with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ekurikulum_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ekurikulum_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Switch role helper
  const setCurrentRole = (role: UserRole) => {
    let name = "Staf Madrasah";
    let dept = "MTs. Nurul Jadid";

    switch(role) {
      case 'ADMIN':
        name = "Administrator eKurikulum (Super Admin)";
        dept = "Biro Kurikulum & SIM MTs. Nurul Jadid";
        break;
      case 'KEPALA':
        name = "K. Miftahul Arifin, M.Pd (Kepala Madrasah)";
        dept = "Pimpinan Madrasah Tsanawiyah";
        break;
      case 'WAKAKUR':
        name = "Najibul Hoer, S.Si, M.Pd (Waka Kurikulum)";
        dept = "Bidang Pengembangan Kurikulum";
        break;
      case 'WAKASIS':
        name = "Muh. Utsman, S.Pd (Waka Kesiswaan)";
        dept = "Bidang Kesiswaan & Prestasi";
        break;
      case 'HUMAS':
        name = "H. Zainullah, M.Pd (Waka Humas)";
        dept = "Bidang Hubungan Masyarakat & Publikasi";
        break;
      case 'GURU':
        name = "Ust. Abd. Qzafur, S.HI, M.Pd.I (Guru Pamong)";
        dept = "Dewan Guru MTs. Nurul Jadid";
        break;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      role,
      displayName: name,
      department: dept
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('ekurikulum_role', role);
    logAction('Ganti Peran Pengguna', 'Sistem Autentikasi', `Beralih ke peran hak akses: ${role}`);
  };

  const login = (role: UserRole = 'ADMIN', customUser?: Partial<UserProfile>) => {
    let name = "Administrator eKurikulum (Super Admin)";
    let dept = "Biro Kurikulum & SIM MTs. Nurul Jadid";

    switch(role) {
      case 'ADMIN':
        name = "Administrator eKurikulum (Super Admin)";
        dept = "Biro Kurikulum & SIM MTs. Nurul Jadid";
        break;
      case 'KEPALA':
        name = "K. Miftahul Arifin, M.Pd (Kepala Madrasah)";
        dept = "Pimpinan Madrasah Tsanawiyah";
        break;
      case 'WAKAKUR':
        name = "Najibul Hoer, S.Si, M.Pd (Waka Kurikulum)";
        dept = "Bidang Pengembangan Kurikulum";
        break;
      case 'WAKASIS':
        name = "Muh. Utsman, S.Pd (Waka Kesiswaan)";
        dept = "Bidang Kesiswaan & Prestasi";
        break;
      case 'HUMAS':
        name = "H. Zainullah, M.Pd (Waka Humas)";
        dept = "Bidang Hubungan Masyarakat & Publikasi";
        break;
      case 'GURU':
        name = "Dewan Guru MTs. Nurul Jadid";
        dept = "Dewan Guru MTs. Nurul Jadid";
        break;
    }

    const user: UserProfile = {
      id: customUser?.id || `usr_${Date.now()}`,
      email: customUser?.email || (role === 'ADMIN' ? 'admin@mtsnuruljadid.sch.id' : `${role.toLowerCase()}@mtsnuruljadid.sch.id`),
      displayName: customUser?.displayName || name,
      role,
      department: customUser?.department || dept
    };

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('ekurikulum_is_authenticated', 'true');
    localStorage.setItem('ekurikulum_role', role);
    localStorage.setItem('ekurikulum_auth_user', JSON.stringify(user));
    localStorage.setItem('ekurikulum_active_menu', 'dashboard');
    logAction('Login Berhasil', 'Autentikasi', `Pengguna ${user.displayName} berhasil login sebagai ${role}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ekurikulum_is_authenticated');
    localStorage.removeItem('ekurikulum_active_menu');
    logAction('Logout Pengguna', 'Autentikasi', `Pengguna ${currentUser.displayName} keluar dari sesi`);
  };

  // Test Firebase connection & listen to Auth
  useEffect(() => {
    testConnection().then(connected => {
      setIsConnectedToFirebase(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsConnectedToFirebase(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper to log user activity
  const logAction = async (action: string, module: string, details: string) => {
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userRole: currentUser.role,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    setActivityLogs(prev => {
      const updated = [newLog, ...prev.slice(0, 49)];
      localStorage.setItem('ek_logs', JSON.stringify(updated));
      return updated;
    });

    // Optional firestore sync
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'activityLogs', newLog.id), newLog);
      }
    } catch {
      // Keep resilient
    }
  };

  // Helper for role permissions
  const canEdit = (menuKey?: string): boolean => {
    const { role } = currentUser;
    if (role === 'ADMIN' || role === 'WAKAKUR') return true;
    if (role === 'KEPALA') return false; // Kepala only monitors & exports
    if (role === 'WAKASIS') {
      return menuKey === 'prestasi-siswa';
    }
    if (role === 'GURU') {
      const allowedGuruEdit = ['perencanaan-kurikulum', 'administrasi-guru', 'penilaian-asesmen', 'evaluasi-monitoring', 'prestasi-siswa', 'pelatihan-guru', 'rdm-nilai'];
      return menuKey ? allowedGuruEdit.includes(menuKey) : true;
    }
    return false;
  };

  const canExport = (): boolean => {
    // All roles can export reports, especially KEPALA, ADMIN, WAKAKUR, GURU
    return true;
  };

  const canAccessTambahAkun = (): boolean => {
    const { role } = currentUser;
    // Blokir akses bagi Guru, Waka Kesiswaan, dan Waka Humas
    return role !== 'GURU' && role !== 'WAKASIS' && role !== 'HUMAS';
  };

  const addAccount = async (accountData: Omit<AppAccount, 'id' | 'createdAt'>) => {
    const newAccount: AppAccount = {
      ...accountData,
      id: `acc_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newAccount, ...accounts];
    setAccounts(updated);
    localStorage.setItem('ek_accounts', JSON.stringify(updated));
    await logAction('Tambah Akun', 'Manajemen Pengguna', `Menambahkan akun baru: ${newAccount.namaLengkap} (@${newAccount.username}) dengan role ${newAccount.role}`);
  };

  const updateAccount = async (item: AppAccount) => {
    const updated = accounts.map(a => a.id === item.id ? item : a);
    setAccounts(updated);
    localStorage.setItem('ek_accounts', JSON.stringify(updated));
    await logAction('Ubah Akun', 'Manajemen Pengguna', `Memperbarui akun: ${item.namaLengkap} (@${item.username})`);
  };

  const deleteAccount = async (id: string) => {
    const target = accounts.find(a => a.id === id);
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    localStorage.setItem('ek_accounts', JSON.stringify(updated));
    if (target) {
      await logAction('Hapus Akun', 'Manajemen Pengguna', `Menghapus akun: ${target.namaLengkap} (@${target.username})`);
    }
  };

  const toggleAccountStatus = async (id: string) => {
    const target = accounts.find(a => a.id === id);
    if (!target) return;
    const newStatus: 'aktif' | 'non-aktif' = target.status === 'aktif' ? 'non-aktif' : 'aktif';
    const updated = accounts.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setAccounts(updated);
    localStorage.setItem('ek_accounts', JSON.stringify(updated));
    await logAction('Ubah Status Akun', 'Manajemen Pengguna', `Status akun ${target.namaLengkap} diubah menjadi ${newStatus}`);
  };

  const canAccessMenu = (menuKey: string): boolean => {
    const { role } = currentUser;

    // Sub-menu Tambah Akun khusus diproteksi: Blokir Guru, Waka Kesiswaan, dan Waka Humas
    if (menuKey === 'tambah-akun') {
      return role !== 'GURU' && role !== 'WAKASIS' && role !== 'HUMAS';
    }

    // Sub-menu Dokumen Induk mewarisi hak akses dokumen-induk
    if ([
      'dokumen-kurikulum',
      'kalender-pendidikan',
      'struktur-organisasi',
      'data-guru',
      'data-siswa',
      'data-rombel'
    ].includes(menuKey)) {
      return canAccessMenu('dokumen-induk');
    }

    if (role === 'ADMIN' || role === 'KEPALA' || role === 'WAKAKUR') return true;
    if (role === 'WAKASIS') {
      return ['dashboard', 'prestasi-siswa', 'pengaturan', 'pengaturan-profil', 'dokumentasi-dev'].includes(menuKey);
    }
    if (role === 'HUMAS') {
      return ['dashboard', 'pengaturan', 'pengaturan-profil', 'dokumentasi-dev'].includes(menuKey);
    }
    if (role === 'GURU') {
      const guruMenus = [
        'dashboard',
        'dokumen-induk',
        'perencanaan-kurikulum',
        'administrasi-guru',
        'penilaian-asesmen',
        'supervisi-akademik',
        'evaluasi-monitoring',
        'prestasi-siswa',
        'pelatihan-guru',
        'rdm-nilai',
        'pengaturan',
        'pengaturan-profil',
        'dokumentasi-dev'
      ];
      return guruMenus.includes(menuKey);
    }
    return true;
  };

  // Rombel methods
  const addRombel = async (rombelData: Omit<RombelItem, 'id'>) => {
    const newRombel: RombelItem = {
      ...rombelData,
      id: `rombel_${Date.now()}`,
      no: rombels.length + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newRombel, ...rombels];
    setRombels(updated);
    localStorage.setItem('ek_rombels', JSON.stringify(updated));
    await logAction('Tambah Rombel', 'Data Rombel', `Menambahkan rombel: Kelas ${newRombel.kelas} - ${newRombel.program} (Rombel ${newRombel.rombel}) - ${newRombel.jumlahSiswa} Siswa`);

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'rombels', newRombel.id), newRombel);
      }
    } catch (e) {
      console.warn('Firestore sync rombel:', e);
    }
  };

  const updateRombel = async (rombel: RombelItem) => {
    const updated = rombels.map(r => r.id === rombel.id ? { ...rombel, updatedAt: new Date().toISOString() } : r);
    setRombels(updated);
    localStorage.setItem('ek_rombels', JSON.stringify(updated));
    await logAction('Ubah Rombel', 'Data Rombel', `Memperbarui rombel: Kelas ${rombel.kelas} - ${rombel.program} (Rombel ${rombel.rombel})`);

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'rombels', rombel.id), rombel);
      }
    } catch (e) {
      console.warn('Firestore sync rombel:', e);
    }
  };

  const deleteRombel = async (id: string) => {
    const target = rombels.find(r => r.id === id);
    const updated = rombels.filter(r => r.id !== id);
    setRombels(updated);
    localStorage.setItem('ek_rombels', JSON.stringify(updated));
    await logAction('Hapus Rombel', 'Data Rombel', `Menghapus rombel: ${target ? `Kelas ${target.kelas} - Rombel ${target.rombel}` : id}`);

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'rombels', id));
      }
    } catch (e) {
      console.warn('Firestore delete rombel:', e);
    }
  };

  const deleteAllRombel = async () => {
    const count = rombels.length;
    setRombels([]);
    localStorage.removeItem('ek_rombels');
    await logAction('Hapus Semua Rombel', 'Data Rombel', `Menghapus seluruh (${count}) data rombel`);
  };

  const importRombels = async (newRombels: Omit<RombelItem, 'id'>[]) => {
    const formatted: RombelItem[] = newRombels.map((r, idx) => ({
      ...r,
      id: `rombel_imp_${Date.now()}_${idx}`,
      no: rombels.length + idx + 1,
      createdAt: new Date().toISOString()
    }));
    const updated = [...formatted, ...rombels];
    setRombels(updated);
    localStorage.setItem('ek_rombels', JSON.stringify(updated));
    await logAction('Import Rombel', 'Data Rombel', `Mengimpor ${formatted.length} data rombel baru`);
  };

  // Student methods
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `s_${Date.now()}`,
      no: students.length + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    localStorage.setItem('ek_students', JSON.stringify(updated));
    await logAction('Tambah Siswa', 'Data Siswa', `Menambahkan siswa: ${newStudent.nama} (${newStudent.kelas}-${newStudent.program}-${newStudent.rombel})`);

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'students', newStudent.id), newStudent);
      }
    } catch (e) {
      console.warn('Firestore sync student:', e);
    }
  };

  const updateStudent = async (student: Student) => {
    const updated = students.map(s => s.id === student.id ? student : s);
    setStudents(updated);
    localStorage.setItem('ek_students', JSON.stringify(updated));
    await logAction('Ubah Siswa', 'Data Siswa', `Memperbarui data siswa: ${student.nama}`);

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'students', student.id), student);
      }
    } catch (e) {
      console.warn('Firestore sync student:', e);
    }
  };

  const deleteStudent = async (id: string) => {
    const target = students.find(s => s.id === id);
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('ek_students', JSON.stringify(updated));
    await logAction('Hapus Siswa', 'Data Siswa', `Menghapus siswa: ${target?.nama || id}`);

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'students', id));
      }
    } catch (e) {
      console.warn('Firestore delete student:', e);
    }
  };

  const deleteAllStudents = async () => {
    const count = students.length;
    setStudents([]);
    localStorage.removeItem('ek_students');
    await logAction('Hapus Semua Siswa', 'Data Siswa', `Menghapus seluruh (${count}) data siswa`);
  };

  const importStudents = async (newStudents: Omit<Student, 'id'>[]) => {
    const formatted: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `s_imp_${Date.now()}_${idx}`,
      no: students.length + idx + 1,
      createdAt: new Date().toISOString()
    }));
    const updated = [...formatted, ...students];
    setStudents(updated);
    localStorage.setItem('ek_students', JSON.stringify(updated));
    await logAction('Import Siswa', 'Data Siswa', `Mengimpor ${formatted.length} siswa baru`);
  };

  // Prota methods
  const addProta = async (item: Omit<ProtaItem, 'id'>) => {
    const newItem: ProtaItem = { ...item, id: `prota_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...protaList];
    setProtaList(updated);
    localStorage.setItem('ek_prota', JSON.stringify(updated));
    await logAction('Tambah Prota', 'Program Tahunan', `Menambah program: ${item.namaProgram}`);
  };

  const updateProta = async (item: ProtaItem) => {
    const updated = protaList.map(p => p.id === item.id ? item : p);
    setProtaList(updated);
    localStorage.setItem('ek_prota', JSON.stringify(updated));
    await logAction('Ubah Prota', 'Program Tahunan', `Memperbarui program: ${item.namaProgram}`);
  };

  const deleteProta = async (id: string) => {
    const updated = protaList.filter(p => p.id !== id);
    setProtaList(updated);
    localStorage.setItem('ek_prota', JSON.stringify(updated));
    await logAction('Hapus Prota', 'Program Tahunan', `Menghapus program ID: ${id}`);
  };

  // Promes methods
  const addPromes = async (item: Omit<PromesItem, 'id'>) => {
    const newItem: PromesItem = { ...item, id: `promes_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...promesList];
    setPromesList(updated);
    localStorage.setItem('ek_promes', JSON.stringify(updated));
    await logAction('Tambah Promes', 'Program Semester', `Menambah: ${item.namaProgram}`);
  };

  const updatePromes = async (item: PromesItem) => {
    const updated = promesList.map(p => p.id === item.id ? item : p);
    setPromesList(updated);
    localStorage.setItem('ek_promes', JSON.stringify(updated));
    await logAction('Ubah Promes', 'Program Semester', `Memperbarui: ${item.namaProgram}`);
  };

  const deletePromes = async (id: string) => {
    const updated = promesList.filter(p => p.id !== id);
    setPromesList(updated);
    localStorage.setItem('ek_promes', JSON.stringify(updated));
    await logAction('Hapus Promes', 'Program Semester', `Menghapus ID: ${id}`);
  };

  const importPromes = async (items: Omit<PromesItem, 'id'>[]) => {
    const formatted: PromesItem[] = items.map((it, idx) => ({
      ...it,
      id: `promes_imp_${Date.now()}_${idx}`,
      createdAt: new Date().toISOString()
    }));
    const updated = [...formatted, ...promesList];
    setPromesList(updated);
    localStorage.setItem('ek_promes', JSON.stringify(updated));
    await logAction('Import Promes', 'Program Semester', `Mengimpor ${formatted.length} program semester`);
  };

  // ATP methods
  const addATP = async (item: Omit<ATPItem, 'id'>) => {
    const newItem: ATPItem = { ...item, id: `atp_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...atpList];
    setAtpList(updated);
    localStorage.setItem('ek_atp', JSON.stringify(updated));
    await logAction('Tambah ATP', 'Alur Tujuan Pembelajaran', `Menambah ATP Mapel: ${item.mataPelajaran}`);
  };

  const updateATP = async (item: ATPItem) => {
    const updated = atpList.map(a => a.id === item.id ? item : a);
    setAtpList(updated);
    localStorage.setItem('ek_atp', JSON.stringify(updated));
    await logAction('Ubah ATP', 'Alur Tujuan Pembelajaran', `Memperbarui ATP: ${item.mataPelajaran}`);
  };

  const deleteATP = async (id: string) => {
    const updated = atpList.filter(a => a.id !== id);
    setAtpList(updated);
    localStorage.setItem('ek_atp', JSON.stringify(updated));
    await logAction('Hapus ATP', 'Alur Tujuan Pembelajaran', `Menghapus ATP ID: ${id}`);
  };

  // SK Tugas methods
  const addSKTugas = async (item: Omit<SKTugasGuruItem, 'id'>) => {
    const newItem: SKTugasGuruItem = { ...item, id: `sk_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...skTugasList];
    setSkTugasList(updated);
    localStorage.setItem('ek_sk_tugas', JSON.stringify(updated));
    await logAction('Tambah SK Tugas Guru', 'Administrasi Guru', `Menambah tugas: ${item.namaGuru}`);
  };

  const updateSKTugas = async (item: SKTugasGuruItem) => {
    const updated = skTugasList.map(s => s.id === item.id ? item : s);
    setSkTugasList(updated);
    localStorage.setItem('ek_sk_tugas', JSON.stringify(updated));
    await logAction('Ubah SK Tugas Guru', 'Administrasi Guru', `Memperbarui tugas: ${item.namaGuru}`);
  };

  const deleteSKTugas = async (id: string) => {
    const updated = skTugasList.filter(s => s.id !== id);
    setSkTugasList(updated);
    localStorage.setItem('ek_sk_tugas', JSON.stringify(updated));
    await logAction('Hapus SK Tugas Guru', 'Administrasi Guru', `Menghapus SK tugas ID: ${id}`);
  };

  // Kisi-kisi methods
  const addKisiKisi = async (item: Omit<KisiKisiItem, 'id'>) => {
    const newItem: KisiKisiItem = { ...item, id: `kisi_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...kisiKisiList];
    setKisiKisiList(updated);
    localStorage.setItem('ek_kisikisi', JSON.stringify(updated));
    await logAction('Tambah Kisi-Kisi', 'Penilaian & Asesmen', `Menambah kisi-kisi: ${item.mapel}`);
  };

  const updateKisiKisi = async (item: KisiKisiItem) => {
    const updated = kisiKisiList.map(k => k.id === item.id ? item : k);
    setKisiKisiList(updated);
    localStorage.setItem('ek_kisikisi', JSON.stringify(updated));
    await logAction('Ubah Kisi-Kisi', 'Penilaian & Asesmen', `Memperbarui kisi-kisi: ${item.mapel}`);
  };

  const deleteKisiKisi = async (id: string) => {
    const updated = kisiKisiList.filter(k => k.id !== id);
    setKisiKisiList(updated);
    localStorage.setItem('ek_kisikisi', JSON.stringify(updated));
    await logAction('Hapus Kisi-Kisi', 'Penilaian & Asesmen', `Menghapus kisi-kisi ID: ${id}`);
  };

  // Bank Soal methods
  const addBankSoal = async (item: Omit<BankSoalItem, 'id'>) => {
    const newItem: BankSoalItem = { ...item, id: `soal_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...bankSoalList];
    setBankSoalList(updated);
    localStorage.setItem('ek_banksoal', JSON.stringify(updated));
    await logAction('Unggah Bank Soal', 'Penilaian & Asesmen', `Mengunggah berkas soal: ${item.judul}`);
  };

  const updateBankSoal = async (item: BankSoalItem) => {
    const updated = bankSoalList.map(b => b.id === item.id ? item : b);
    setBankSoalList(updated);
    localStorage.setItem('ek_banksoal', JSON.stringify(updated));
    await logAction('Ubah Bank Soal', 'Penilaian & Asesmen', `Memperbarui soal: ${item.judul}`);
  };

  const deleteBankSoal = async (id: string) => {
    const updated = bankSoalList.filter(b => b.id !== id);
    setBankSoalList(updated);
    localStorage.setItem('ek_banksoal', JSON.stringify(updated));
    await logAction('Hapus Bank Soal', 'Penilaian & Asesmen', `Menghapus soal ID: ${id}`);
  };

  // Evaluasi methods
  const addEvaluasi = async (item: Omit<EvaluasiItem, 'id'>) => {
    const newItem: EvaluasiItem = { ...item, id: `eval_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...evaluasiList];
    setEvaluasiList(updated);
    localStorage.setItem('ek_evaluasi', JSON.stringify(updated));
    await logAction('Tambah Evaluasi', 'Evaluasi & Monitoring', `Menambah evaluasi: ${item.tipe}`);
  };

  const updateEvaluasi = async (item: EvaluasiItem) => {
    const updated = evaluasiList.map(e => e.id === item.id ? item : e);
    setEvaluasiList(updated);
    localStorage.setItem('ek_evaluasi', JSON.stringify(updated));
    await logAction('Ubah Evaluasi', 'Evaluasi & Monitoring', `Memperbarui evaluasi: ${item.tipe}`);
  };

  const deleteEvaluasi = async (id: string) => {
    const updated = evaluasiList.filter(e => e.id !== id);
    setEvaluasiList(updated);
    localStorage.setItem('ek_evaluasi', JSON.stringify(updated));
    await logAction('Hapus Evaluasi', 'Evaluasi & Monitoring', `Menghapus evaluasi ID: ${id}`);
  };

  // Prestasi methods
  const addPrestasi = async (item: Omit<PrestasiItem, 'id'>) => {
    const newItem: PrestasiItem = { ...item, id: `pres_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...prestasiList];
    setPrestasiList(updated);
    localStorage.setItem('ek_prestasi', JSON.stringify(updated));
    await logAction('Tambah Prestasi', 'Prestasi Siswa', `Menambah prestasi: ${item.namaLomba} (Juara ${item.keteranganJuara})`);
  };

  const updatePrestasi = async (item: PrestasiItem) => {
    const updated = prestasiList.map(p => p.id === item.id ? item : p);
    setPrestasiList(updated);
    localStorage.setItem('ek_prestasi', JSON.stringify(updated));
    await logAction('Ubah Prestasi', 'Prestasi Siswa', `Memperbarui prestasi: ${item.namaLomba}`);
  };

  const deletePrestasi = async (id: string) => {
    const updated = prestasiList.filter(p => p.id !== id);
    setPrestasiList(updated);
    localStorage.setItem('ek_prestasi', JSON.stringify(updated));
    await logAction('Hapus Prestasi', 'Prestasi Siswa', `Menghapus prestasi ID: ${id}`);
  };

  // Dokumentasi methods
  const addDokumentasi = async (item: Omit<DokumentasiItem, 'id'>) => {
    const newItem: DokumentasiItem = { ...item, id: `dok_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...dokumentasiList];
    setDokumentasiList(updated);
    localStorage.setItem('ek_dokumentasi', JSON.stringify(updated));
    await logAction('Unggah Dokumentasi', 'Prestasi Siswa', `Menambah dokumentasi: ${item.keterangan.slice(0, 30)}...`);
  };

  const deleteDokumentasi = async (id: string) => {
    const updated = dokumentasiList.filter(d => d.id !== id);
    setDokumentasiList(updated);
    localStorage.setItem('ek_dokumentasi', JSON.stringify(updated));
    await logAction('Hapus Dokumentasi', 'Prestasi Siswa', `Menghapus dokumentasi ID: ${id}`);
  };

  // IHT methods
  const addIHT = async (item: Omit<MateriIHTItem, 'id'>) => {
    const newItem: MateriIHTItem = { ...item, id: `iht_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...ihtList];
    setIhtList(updated);
    localStorage.setItem('ek_iht', JSON.stringify(updated));
    await logAction('Tambah Materi IHT', 'Pelatihan Guru', `Menambah IHT: ${item.materiIht}`);
  };

  const updateIHT = async (item: MateriIHTItem) => {
    const updated = ihtList.map(i => i.id === item.id ? item : i);
    setIhtList(updated);
    localStorage.setItem('ek_iht', JSON.stringify(updated));
    await logAction('Ubah Materi IHT', 'Pelatihan Guru', `Memperbarui IHT: ${item.materiIht}`);
  };

  const deleteIHT = async (id: string) => {
    const updated = ihtList.filter(i => i.id !== id);
    setIhtList(updated);
    localStorage.setItem('ek_iht', JSON.stringify(updated));
    await logAction('Hapus Materi IHT', 'Pelatihan Guru', `Menghapus IHT ID: ${id}`);
  };

  // Nilai methods
  const addNilai = async (item: Omit<TemplateNilaiItem, 'id'>) => {
    const newItem: TemplateNilaiItem = { ...item, id: `nil_${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [newItem, ...nilaiList];
    setNilaiList(updated);
    localStorage.setItem('ek_nilai', JSON.stringify(updated));
    await logAction('Tambah Nilai Standar', 'RDM & Database Nilai', `Menambah nilai siswa: ${item.namaSiswa}`);
  };

  const updateNilai = async (item: TemplateNilaiItem) => {
    const updated = nilaiList.map(n => n.id === item.id ? item : n);
    setNilaiList(updated);
    localStorage.setItem('ek_nilai', JSON.stringify(updated));
    await logAction('Ubah Nilai Standar', 'RDM & Database Nilai', `Memperbarui nilai: ${item.namaSiswa}`);
  };

  const deleteNilai = async (id: string) => {
    const updated = nilaiList.filter(n => n.id !== id);
    setNilaiList(updated);
    localStorage.setItem('ek_nilai', JSON.stringify(updated));
    await logAction('Hapus Nilai Standar', 'RDM & Database Nilai', `Menghapus data nilai ID: ${id}`);
  };

  // Announcement methods
  const addAnnouncement = async (item: Omit<AnnouncementItem, 'id'>) => {
    const newItem: AnnouncementItem = { ...item, id: `ann_${Date.now()}` };
    const updated = [newItem, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('ek_announcements', JSON.stringify(updated));
    await logAction('Kirim Pengumuman', 'Notifikasi Mendesak', `Mempublikasikan pengumuman: ${item.title}`);
  };

  const deleteAnnouncement = async (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('ek_announcements', JSON.stringify(updated));
    await logAction('Hapus Pengumuman', 'Notifikasi Mendesak', `Menghapus pengumuman ID: ${id}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated,
        login,
        logout,
        setCurrentRole,
        isDarkMode,
        toggleDarkMode,
        isConnectedToFirebase,

        rombels,
        students,
        teachers,
        protaList,
        promesList,
        atpList,
        skTugasList,
        kisiKisiList,
        bankSoalList,
        evaluasiList,
        prestasiList,
        dokumentasiList,
        ihtList,
        nilaiList,
        announcements,
        activityLogs,
        accounts,

        addAccount,
        updateAccount,
        deleteAccount,
        toggleAccountStatus,
        canAccessTambahAkun,

        addRombel,
        updateRombel,
        deleteRombel,
        deleteAllRombel,
        importRombels,

        addStudent,
        updateStudent,
        deleteStudent,
        deleteAllStudents,
        importStudents,

        addProta,
        updateProta,
        deleteProta,

        addPromes,
        updatePromes,
        deletePromes,
        importPromes,

        addATP,
        updateATP,
        deleteATP,

        addSKTugas,
        updateSKTugas,
        deleteSKTugas,

        addKisiKisi,
        updateKisiKisi,
        deleteKisiKisi,

        addBankSoal,
        updateBankSoal,
        deleteBankSoal,

        addEvaluasi,
        updateEvaluasi,
        deleteEvaluasi,

        addPrestasi,
        updatePrestasi,
        deletePrestasi,

        addDokumentasi,
        deleteDokumentasi,

        addIHT,
        updateIHT,
        deleteIHT,

        addNilai,
        updateNilai,
        deleteNilai,

        addAnnouncement,
        deleteAnnouncement,

        canEdit,
        canExport,
        canAccessMenu,

        auditLogs: activityLogs,
        onNavigateMenu,

        iframeUrls,
        setIframeUrl,
        resetIframeUrl,
        iframeConfig,
        updateIframeConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
