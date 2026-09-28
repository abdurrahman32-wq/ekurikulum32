import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Printer, 
  Download, 
  Users, 
  Briefcase, 
  Award, 
  FileText, 
  X, 
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { MADRASAH_INFO } from '../../data/initialData';
import { exportTableToPDF } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';

export interface PersonDetail {
  id: string;
  role: string;
  category: 'pimpinan' | 'tu' | 'waka' | 'upt';
  name: string;
  niup?: string;
  tupoksi: string[];
  department: string;
  phone?: string;
  email?: string;
}

const INITIAL_ORG_PERSONNEL: PersonDetail[] = [
  // Pimpinan & Komite
  {
    id: 'km',
    role: 'Kepala Madrasah',
    category: 'pimpinan',
    name: MADRASAH_INFO.kepalaMadrasah,
    niup: MADRASAH_INFO.niupKepala,
    department: 'Manajemen Eksekutif',
    tupoksi: [
      'Menetapkan kebijakan umum dan rencana strategis madrasah.',
      'Bertanggung jawab penuh atas pengelolaan edukasi, manajerial, dan kepegawaian.',
      'Membangun sinergi dengan Pengasuh Pondok Pesantren Nurul Jadid dan Kementerian Agama.'
    ]
  },
  {
    id: 'komite',
    role: 'Komite Madrasah',
    category: 'pimpinan',
    name: MADRASAH_INFO.komiteMadrasah,
    department: 'Dewan Pertimbangan & Akuntabilitas',
    tupoksi: [
      'Memberikan pertimbangan dalam penentuan kebijakan madrasah.',
      'Mendukung peningkatan mutu layanan dan sarana pendidikan.',
      'Mengawasi akuntabilitas dan transparansi pengelolaan madrasah.'
    ]
  },

  // Tata Usaha
  {
    id: 'ktu',
    role: 'Kepala Tata Usaha',
    category: 'tu',
    name: 'Mohammad Rifqi Buchari, S.EI',
    department: 'Administrasi & Kepegawaian',
    tupoksi: [
      'Mengkoordinasikan seluruh layanan tata persuratan, arsip, dan kepegawaian.',
      'Memfasilitasi kebutuhan administrasi KBM dan pelaporan berkala.'
    ]
  },
  {
    id: 'keuangan',
    role: 'Staf Keuangan',
    category: 'tu',
    name: 'Rifqi Hasan, S.E',
    department: 'Tata Usaha',
    tupoksi: ['Pengelolaan kas masuk/keluar, pelaporan dana BOS dan iuran santri.']
  },
  {
    id: 'operator',
    role: 'Staf Operator Madrasah',
    category: 'tu',
    name: 'Didit Ahkam Alallah, S.Kom.I',
    department: 'Tata Usaha / IT',
    tupoksi: ['Pengelolaan EMIS 4.0, Simpatika, dan sinkronisasi data santri/guru.']
  },
  {
    id: 'staf_tu',
    role: 'Staf Administrasi Umum',
    category: 'tu',
    name: 'Anithil Marmubil, S.Pd',
    department: 'Tata Usaha',
    tupoksi: ['Pelayanan legalisir ijazah, surat keterangan siswa, dan arsip dokumen induk.']
  },

  // WAKA
  {
    id: 'wakakur',
    role: 'Waka Kurikulum',
    category: 'waka',
    name: 'Najibul Hoer, S.Si, M.Pd',
    niup: 'NJ-2015-081',
    department: 'Biro Akademik',
    tupoksi: [
      'Menyusun Dokumen Kurikulum Madrasah (KBC & Deep Learning).',
      'Mengatur pembagian tugas mengajar 54 dewan guru dan jadwal KBM.',
      'Mengkoordinasikan pelaksanaan asesmen (ASTS, ASAS, AM) dan RDM.'
    ]
  },
  {
    id: 'wakasis',
    role: 'Waka Kesiswaan',
    category: 'waka',
    name: 'Muh. Utsman, S.Pd',
    niup: 'NJ-2014-045',
    department: 'Biro Kesiswaan',
    tupoksi: [
      'Membina kedisiplinan dan akhlak santri bekerjasama dengan pengurus pesantren.',
      'Mengkoordinasikan kegiatan ekstrakurikuler, OSIM, dan pembinaan prestasi lomba.'
    ]
  },
  {
    id: 'wakasarpras',
    role: 'Waka Sarana & Prasarana',
    category: 'waka',
    name: 'Muzammil, S.Si, M.Si',
    niup: 'NJ-2012-033',
    department: 'Biro Sarpras & Ekoteologi',
    tupoksi: [
      'Pemeliharaan gedung kelas, laboratorium komputer, IPA, dan perpustakaan.',
      'Penerapan program Madrasah Hijau (Pesantren Asri Berkelanjutan).'
    ]
  },
  {
    id: 'wakahumas',
    role: 'Waka Humas & Mutu',
    category: 'waka',
    name: 'Supandi, S.HI',
    niup: 'NJ-2016-092',
    department: 'Biro Humas & Hubungan Alumni',
    tupoksi: [
      'Publikasi media informasi madrasah dan kerjasama lintas instansi/wali santri.',
      'Pengendalian sistem penjaminan mutu internal (SPMI).'
    ]
  },

  // UPT & Koordinator
  {
    id: 'upt_agama',
    role: 'Koordinator Keagamaan',
    category: 'upt',
    name: 'M. Mahmudi, S.Ag, M.Pd',
    department: 'UPT Keagamaan',
    tupoksi: ['Pengawasan shalat berjamaah, pembacaan ratib, dan muatan kepesantrenan.']
  },
  {
    id: 'upt_tahfidz',
    role: 'Koordinator Tahfidz Al-Qur\'an',
    category: 'upt',
    name: 'Moh. Hasyim, S.S',
    department: 'UPT Tahfidz',
    tupoksi: ['Pengujian hafalan ziyadah dan murajaah berkala santri tahfidz.']
  },
  {
    id: 'upt_osim_pa',
    role: 'Pembina OSIM Putra',
    category: 'upt',
    name: 'Amir Mahmud, S.Pd.I',
    department: 'Kesiswaan',
    tupoksi: ['Pendampingan organisasi santri putra dan kepemimpinan kader.']
  },
  {
    id: 'upt_osim_pi',
    role: 'Pembina OSIM Putri',
    category: 'upt',
    name: 'Susi Itawati, S.Pd',
    department: 'Kesiswaan',
    tupoksi: ['Pendampingan organisasi santri putri dan pembinaan minat bakat.']
  },
  {
    id: 'upt_lab_komp',
    role: 'Kepala Lab Komputer',
    category: 'upt',
    name: 'Sulaiman, S.Pd.I',
    department: 'Laboratorium',
    tupoksi: ['Pengelolaan server CBT asesmen madrasah dan perangkat praktikum komputer.']
  },
  {
    id: 'upt_lab_ipa',
    role: 'Kepala Lab IPA',
    category: 'upt',
    name: 'Sri Mutmainnah, S.Pd',
    department: 'Laboratorium',
    tupoksi: ['Pengelolaan alat peraga fisika, biologi, kimia, dan jadwal praktikum sains.']
  },
  {
    id: 'upt_perpus',
    role: 'Kepala Perpustakaan',
    category: 'upt',
    name: 'Franco Leo, S.Pd',
    department: 'Perpustakaan',
    tupoksi: ['Pengadaan buku teks kurikulum KBC dan sirkulasi literasi digital santri.']
  },
  {
    id: 'upt_bk',
    role: 'Koordinator Bimbingan Konseling (BK)',
    category: 'upt',
    name: 'Holil Hasyim Asy\'ari, S.Pd',
    department: 'Layanan Siswa',
    tupoksi: ['Layanan konseling pribadi, adaptasi santri baru, dan studi lanjut.']
  },
  {
    id: 'upt_madin',
    role: 'Koordinator Madrasah Diniyah (MADIN)',
    category: 'upt',
    name: 'Khoirul Anam, S.Kom',
    department: 'Kepesantrenan',
    tupoksi: ['Sinkronisasi kurikulum madin pesantren sore/malam dengan kurikulum pagi.']
  }
];

export const StrukturOrganisasiChart: React.FC = () => {
  const { canEdit, canExport } = useApp();

  // Personnel persistent state
  const [personnel, setPersonnel] = useState<PersonDetail[]>(() => {
    const saved = localStorage.getItem('ek_org_personnel');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved org personnel:', e);
      }
    }
    return INITIAL_ORG_PERSONNEL;
  });

  const savePersonnel = (updated: PersonDetail[]) => {
    setPersonnel(updated);
    localStorage.setItem('ek_org_personnel', JSON.stringify(updated));
  };

  // Filters & display mode
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'pimpinan' | 'tu' | 'waka' | 'upt'>('all');
  const [viewStyle, setViewStyle] = useState<'tree' | 'table'>('tree');

  // Modals state
  const [viewingPerson, setViewingPerson] = useState<PersonDetail | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [confirmDeletePerson, setConfirmDeletePerson] = useState<PersonDetail | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form State
  const [formData, setFormData] = useState<{
    role: string;
    category: 'pimpinan' | 'tu' | 'waka' | 'upt';
    name: string;
    niup: string;
    department: string;
    tupoksiText: string;
    phone: string;
    email: string;
  }>({
    role: '',
    category: 'waka',
    name: '',
    niup: '',
    department: '',
    tupoksiText: '',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormData({
      role: '',
      category: 'waka',
      name: '',
      niup: '',
      department: '',
      tupoksiText: '',
      phone: '',
      email: ''
    });
    setEditingPersonId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (p: PersonDetail) => {
    setFormData({
      role: p.role,
      category: p.category,
      name: p.name,
      niup: p.niup || '',
      department: p.department,
      tupoksiText: p.tupoksi.join('\n'),
      phone: p.phone || '',
      email: p.email || ''
    });
    setEditingPersonId(p.id);
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    const tupoksiArray = formData.tupoksiText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingPersonId) {
      // Update existing
      const updated = personnel.map(item => {
        if (item.id === editingPersonId) {
          return {
            ...item,
            role: formData.role.trim(),
            category: formData.category,
            name: formData.name.trim(),
            niup: formData.niup.trim() || undefined,
            department: formData.department.trim() || 'MTs. Nurul Jadid',
            tupoksi: tupoksiArray.length > 0 ? tupoksiArray : ['Melaksanakan tugas dan fungsi struktural sesuai instruksi pimpinan.'],
            phone: formData.phone.trim() || undefined,
            email: formData.email.trim() || undefined
          };
        }
        return item;
      });
      savePersonnel(updated);
      showToast(`Data pejabat "${formData.name}" berhasil diperbarui.`);
    } else {
      // Create new
      const newPerson: PersonDetail = {
        id: `person_${Date.now()}`,
        role: formData.role.trim(),
        category: formData.category,
        name: formData.name.trim(),
        niup: formData.niup.trim() || undefined,
        department: formData.department.trim() || 'MTs. Nurul Jadid',
        tupoksi: tupoksiArray.length > 0 ? tupoksiArray : ['Melaksanakan tugas dan fungsi struktural sesuai instruksi pimpinan.'],
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined
      };
      savePersonnel([...personnel, newPerson]);
      showToast(`Pejabat baru "${formData.name}" berhasil ditambahkan ke struktur organisasi.`);
    }

    setIsFormModalOpen(false);
    resetForm();
  };

  const executeDeletePerson = () => {
    if (!confirmDeletePerson) return;
    const deletedName = confirmDeletePerson.name;
    const updated = personnel.filter(p => p.id !== confirmDeletePerson.id);
    savePersonnel(updated);
    setConfirmDeletePerson(null);
    if (viewingPerson?.id === confirmDeletePerson.id) {
      setViewingPerson(null);
    }
    showToast(`Data pejabat "${deletedName}" berhasil dihapus.`);
  };

  const handleResetToDefault = () => {
    savePersonnel(INITIAL_ORG_PERSONNEL);
    setShowResetConfirm(false);
    showToast('Struktur organisasi berhasil dikembalikan ke data resmi awal.');
  };

  // Filtered personnel
  const filtered = personnel.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.niup && p.niup.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'STRUKTUR ORGANISASI & TUPOKSI MTs. NURUL JADID',
      subtitle: 'Tahun Pelajaran 2026/2027 • SK Kepala MTs. Nurul Jadid Paiton',
      headers: ['Jabatan Struktural', 'Nama Pejabat', 'Tingkat / Kategori', 'Departemen', 'Tugas Pokok & Fungsi'],
      rows: filtered.map(p => [
        p.role,
        p.name + (p.niup ? `\n(NIUP. ${p.niup})` : ''),
        p.category === 'pimpinan' ? 'Level 1: Pimpinan' :
        p.category === 'tu' ? 'Level 2: Tata Usaha' :
        p.category === 'waka' ? 'Level 3: Waka' : 'Level 4: UPT',
        p.department,
        p.tupoksi.join(' ')
      ]),
      fileName: 'Struktur_Organisasi_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'pimpinan':
        return { label: 'Level 1: Pimpinan & Komite', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
      case 'tu':
        return { label: 'Level 2: Tata Usaha & IT', color: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' };
      case 'waka':
        return { label: 'Level 3: Waka Madrasah', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800' };
      default:
        return { label: 'Level 4: UPT & Koordinator', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Search, Category, View Switcher & Action Buttons */}
      <div className="bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pejabat, jabatan, NIUP, atau unit kerja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* View Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tree vs Table Toggle */}
            <div className="flex rounded-xl p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewStyle('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewStyle === 'tree'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Tampilan Bagan Visual Hierarki"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Bagan Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setViewStyle('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewStyle === 'table'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Tampilan Tabel Basis Data"
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabel Data ({personnel.length})</span>
              </button>
            </div>

            {/* Tambah Pejabat Button */}
            {canEdit() && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pejabat</span>
              </button>
            )}

            {/* Export & Print */}
            {canExport() && (
              <>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  title="Ekspor struktur ke PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  title="Cetak struktur"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </>
            )}

            {/* Reset to Default */}
            {canEdit() && (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Kembalikan ke susunan awal resmi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Filter Tingkat:</span>
          {[
            { key: 'all', label: `Semua Pejabat (${personnel.length})` },
            { key: 'pimpinan', label: `Level 1: Pimpinan (${personnel.filter(p => p.category === 'pimpinan').length})` },
            { key: 'tu', label: `Level 2: Tata Usaha (${personnel.filter(p => p.category === 'tu').length})` },
            { key: 'waka', label: `Level 3: WAKA (${personnel.filter(p => p.category === 'waka').length})` },
            { key: 'upt', label: `Level 4: UPT & Koordinator (${personnel.filter(p => p.category === 'upt').length})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                categoryFilter === f.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          VIEW MODE 1: BAGAN VISUAL HIERARKI (TREE CARDS)
      ======================================================== */}
      {viewStyle === 'tree' && (
        <div className="space-y-8">
          {/* LEVEL 1: PIMPINAN PUNCAK & KOMITE */}
          {(categoryFilter === 'all' || categoryFilter === 'pimpinan') && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                  LEVEL 1 • PIMPINAN PUNCAK & KOMITE MADRASAH
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                {filtered.filter(p => p.category === 'pimpinan').map(p => (
                  <div
                    key={p.id}
                    className="w-80 p-5 rounded-3xl bg-linear-to-b from-emerald-800 to-teal-900 text-white text-center shadow-lg border border-emerald-700 hover:scale-[1.01] transition relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-black text-lg mb-3 shadow-inner border border-white/20">
                        {p.role.includes('Kepala') ? 'KM' : 'KOM'}
                      </div>
                      <div className="text-xs font-bold uppercase text-emerald-200 tracking-wide">{p.role}</div>
                      <div className="font-black text-base mt-0.5">{p.name}</div>
                      {p.niup && <div className="text-xs text-emerald-300 mt-1 font-mono">NIUP. {p.niup}</div>}
                      <div className="text-[11px] text-emerald-100/80 mt-1">{p.department}</div>
                    </div>

                    {/* Action Buttons: Lihat, Edit, Hapus */}
                    <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingPerson(p)}
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Lihat Rincian Pejabat & Tupoksi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                      {canEdit() && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Edit Data Pejabat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePerson(p)}
                            className="p-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 text-xs transition cursor-pointer"
                            title="Hapus Pejabat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: TATA USAHA & KEUANGAN */}
          {(categoryFilter === 'all' || categoryFilter === 'tu') && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                  LEVEL 2 • TATA USAHA, KEUANGAN & OPERATOR DATA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto pt-1">
                {filtered.filter(p => p.category === 'tu').map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-center transition shadow-xs hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{p.role}</div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 line-clamp-2">{p.name}</div>
                      {p.niup && <div className="text-[10px] font-mono text-slate-400 mt-0.5">NIUP. {p.niup}</div>}
                      <div className="text-[10px] text-slate-500 mt-1">{p.department}</div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingPerson(p)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                        title="Lihat Detail & Tupoksi"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat</span>
                      </button>
                      {canEdit() && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1 hover:bg-slate-200 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePerson(p)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3: WAKIL KEPALA MADRASAH (4 BIDANG) */}
          {(categoryFilter === 'all' || categoryFilter === 'waka') && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                  LEVEL 3 • WAKIL KEPALA MADRASAH (WAKA)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-1">
                {filtered.filter(p => p.category === 'waka').map(p => (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 hover:border-emerald-500 text-center transition shadow-xs hover:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs mb-2 border border-emerald-200 dark:border-emerald-800">
                        WAKA
                      </div>
                      <div className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">{p.role}</div>
                      <div className="font-black text-sm text-slate-900 dark:text-white mt-1">{p.name}</div>
                      {p.niup && <div className="text-[10px] text-slate-500 mt-0.5 font-mono">NIUP. {p.niup}</div>}
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.department}</div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingPerson(p)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                        title="Lihat Tupoksi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat</span>
                      </button>
                      {canEdit() && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 hover:bg-slate-200 transition cursor-pointer"
                            title="Edit Pejabat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePerson(p)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 4: UNIT PELAYANAN TEKNIS (UPT) & KOORDINATOR */}
          {(categoryFilter === 'all' || categoryFilter === 'upt') && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700">
                  LEVEL 4 • UNIT PELAYANAN TEKNIS (UPT), KEPALA LAB & KOORDINATOR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto pt-1">
                {filtered.filter(p => p.category === 'upt').map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase truncate">{p.role}</div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white mt-0.5">{p.name}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{p.department}</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setViewingPerson(p)}
                        className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lihat Detail</span>
                      </button>

                      {canEdit() && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeletePerson(p)}
                            className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Tidak ada data pejabat</h4>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang berbeda atau reset filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          VIEW MODE 2: TABEL BASIS DATA STRUKTUR ORGANISASI
      ======================================================== */}
      {viewStyle === 'table' && (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">Jabatan Struktural</th>
                <th className="px-4 py-3">Nama Lengkap Pejabat</th>
                <th className="px-3 py-3">NIUP</th>
                <th className="px-3 py-3">Tingkat / Hierarki</th>
                <th className="px-4 py-3">Departemen / Biro</th>
                <th className="px-4 py-3 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p, idx) => {
                const badge = getCategoryBadge(p.category);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white">
                      {p.role}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                      {p.name}
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                      {p.niup || '-'}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                        {p.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {p.department}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingPerson(p)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition cursor-pointer"
                          title="Lihat Detail & Tupoksi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {canEdit() && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                              title="Edit Pejabat"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePerson(p)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                              title="Hapus Pejabat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    Tidak ada pejabat yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================
          MODAL 1: LIHAT RINCIAN PEJABAT & TUPOKSI
      ======================================================== */}
      {viewingPerson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(viewingPerson.category).color}`}>
                  {getCategoryBadge(viewingPerson.category).label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingPerson(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {viewingPerson.role}
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                  {viewingPerson.name}
                </h4>
                {viewingPerson.niup && (
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    NIUP. {viewingPerson.niup}
                  </div>
                )}
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Unit / Departemen: <span className="font-bold text-slate-800 dark:text-slate-200">{viewingPerson.department}</span>
                </div>
              </div>
            </div>

            {/* Tupoksi List */}
            <div className="space-y-2">
              <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Rincian Tugas Pokok & Fungsi (Tupoksi):
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 max-h-48 overflow-y-auto">
                <ul className="space-y-2 text-xs">
                  {viewingPerson.tupoksi.map((t, i) => (
                    <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {canEdit() && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const target = viewingPerson;
                        setViewingPerson(null);
                        handleOpenEdit(target);
                      }}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit Pejabat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = viewingPerson;
                        setViewingPerson(null);
                        setConfirmDeletePerson(target);
                      }}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingPerson(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: FORM TAMBAH / EDIT PEJABAT STRUKTURAL
      ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {editingPersonId ? 'Edit Pejabat' : 'Tambah Pejabat Baru'}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {editingPersonId ? 'Ubah Data Pejabat Struktural' : 'Tambahkan Pejabat ke Struktur Organisasi'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFormModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Najibul Hoer, S.Si, M.Pd"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Jabatan Struktural */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Jabatan Struktural *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Waka Kurikulum, Kepala Tata Usaha, Koordinator Keagamaan"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Tingkat / Level Kategori & NIUP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tingkat / Hierarki *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="pimpinan">Level 1: Pimpinan & Komite</option>
                    <option value="tu">Level 2: Tata Usaha & IT</option>
                    <option value="waka">Level 3: WAKA Madrasah</option>
                    <option value="upt">Level 4: UPT & Koordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    NIUP (Nomor Induk Yayasan)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: NJ-2015-081"
                    value={formData.niup}
                    onChange={e => setFormData({ ...formData, niup: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Departemen / Biro */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Unit Kerja / Departemen / Biro
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Biro Akademik, Tata Usaha, UPT Keagamaan"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Tupoksi Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tugas Pokok & Fungsi (Tupoksi)
                </label>
                <textarea
                  rows={4}
                  placeholder={`Tulis setiap tugas pada baris baru (tekan Enter untuk poin baru):\nContoh:\nMenyusun Dokumen Kurikulum Madrasah\nMengatur pembagian jadwal KBM 54 Guru\nMengkoordinasikan Asesmen Madrasah`}
                  value={formData.tupoksiText}
                  onChange={e => setFormData({ ...formData, tupoksiText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Setiap baris baru akan otomatis ditampilkan sebagai satu poin tugas terpisah.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {editingPersonId ? 'Simpan Perubahan' : 'Tambahkan Pejabat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: KONFIRMASI HAPUS PEJABAT STRUKTURAL
      ======================================================== */}
      {confirmDeletePerson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Hapus Pejabat Struktural?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-800 dark:text-slate-200">{confirmDeletePerson.name}</span> dari jabatan <span className="font-bold text-emerald-600 dark:text-emerald-400">{confirmDeletePerson.role}</span>?
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeletePerson(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeletePerson}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer"
              >
                Ya, Hapus Pejabat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: KONFIRMASI RESET KE DATA AWAL
      ======================================================== */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 dark:border-amber-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Reset Susunan Struktur Organisasi?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh daftar pejabat dan tupoksi ke susunan data resmi awal madrasah ({INITIAL_ORG_PERSONNEL.length} pejabat). Seluruh penyesuaian khusus yang telah dibuat akan diganti.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer"
              >
                Ya, Reset ke Data Awal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TOAST FEEDBACK NOTIFICATION BANNER
      ======================================================== */}
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
