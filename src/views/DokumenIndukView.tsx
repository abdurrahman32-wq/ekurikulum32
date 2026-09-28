import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RombelItem, Student, Kelas, Program } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportStudentCardPDF 
} from '../utils/exportUtils';
import { MADRASAH_INFO, KALENDER_DATA } from '../data/initialData';
import { 
  BookOpen, 
  Calendar, 
  Network, 
  GraduationCap, 
  Users, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Filter, 
  FileSpreadsheet, 
  FileCheck, 
  ExternalLink,
  Printer,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  School
} from 'lucide-react';
import { IframeEmbedSection } from '../components/IframeEmbedSection';
import { KurikulumDigitalReader } from '../components/dokumen-induk/KurikulumDigitalReader';
import { KalenderPendidikanInteraktif } from '../components/dokumen-induk/KalenderPendidikanInteraktif';
import { StrukturOrganisasiChart } from '../components/dokumen-induk/StrukturOrganisasiChart';

interface DokumenIndukViewProps {
  initialTab?: 'kurikulum' | 'kalender' | 'struktur' | 'guru' | 'rombel' | 'siswa';
}

export const DokumenIndukView: React.FC<DokumenIndukViewProps> = ({ initialTab = 'kurikulum' }) => {
  const { 
    rombels,
    addRombel,
    updateRombel,
    deleteRombel,
    deleteAllRombel,
    students, 
    teachers, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    deleteAllStudents,
    importStudents,
    canEdit, 
    canExport, 
    iframeUrls, 
    setIframeUrl 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kurikulum' | 'kalender' | 'struktur' | 'guru' | 'rombel' | 'siswa'>(() => {
    return initialTab === 'siswa' ? 'rombel' : initialTab;
  });

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab === 'siswa' ? 'rombel' : initialTab);
    }
  }, [initialTab]);

  // Iframe edit URL states
  const [editingIframe, setEditingIframe] = useState<string | null>(null);
  const [iframeInputVal, setIframeInputVal] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sub-view toggle under Tab 5: 'rombel' (default) or 'siswa-rinci'
  const [viewSubTab, setViewSubTab] = useState<'rombel' | 'siswa-rinci'>('rombel');

  // ========================================================
  // ROMBEL CRUD STATES
  // ========================================================
  const [showRombelModal, setShowRombelModal] = useState(false);
  const [isEditingRombel, setIsEditingRombel] = useState(false);
  const [editingRombelId, setEditingRombelId] = useState<string | null>(null);
  const [rombelForm, setRombelForm] = useState<{
    kelas: Kelas;
    program: Program;
    rombel: string;
    jumlahSiswa: number;
  }>({
    kelas: 'VII',
    program: 'Agama',
    rombel: '1',
    jumlahSiswa: 32
  });

  // In-app modal confirmations (NEVER use window.confirm)
  const [confirmDeleteRombel, setConfirmDeleteRombel] = useState<RombelItem | null>(null);
  const [confirmDeleteAllRombel, setConfirmDeleteAllRombel] = useState(false);

  // Rombel Filters & Search
  const [searchRombel, setSearchRombel] = useState('');
  const [filterKelasRombel, setFilterKelasRombel] = useState<string>('all');
  const [filterProgramRombel, setFilterProgramRombel] = useState<string>('all');
  const [filterPilihanRombel, setFilterPilihanRombel] = useState<string>('all');

  const resetRombelForm = () => {
    setRombelForm({
      kelas: 'VII',
      program: 'Agama',
      rombel: '1',
      jumlahSiswa: 32
    });
    setIsEditingRombel(false);
    setEditingRombelId(null);
  };

  const openEditRombel = (r: RombelItem) => {
    setRombelForm({
      kelas: (['VII', 'VIII', 'IX'].includes(r.kelas) ? r.kelas : 'VII') as Kelas,
      program: (['Agama', 'Tahfidz', 'Reguler'].includes(r.program) ? r.program : 'Agama') as Program,
      rombel: ['1', '2', '3', '4', '5', '6', '7'].includes(r.rombel) ? r.rombel : '1',
      jumlahSiswa: Number(r.jumlahSiswa) || 0
    });
    setIsEditingRombel(true);
    setEditingRombelId(r.id);
    setShowRombelModal(true);
  };

  const handleSaveRombel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rombelForm.kelas || !rombelForm.program || !rombelForm.rombel) return;

    const jumlah = Math.max(0, Number(rombelForm.jumlahSiswa) || 0);

    if (isEditingRombel && editingRombelId) {
      await updateRombel({
        id: editingRombelId,
        kelas: rombelForm.kelas,
        program: rombelForm.program,
        rombel: rombelForm.rombel,
        jumlahSiswa: jumlah
      });
      showToast(`Data rombel Kelas ${rombelForm.kelas} - ${rombelForm.program} (Rombel ${rombelForm.rombel}) berhasil diperbarui.`);
    } else {
      await addRombel({
        kelas: rombelForm.kelas,
        program: rombelForm.program,
        rombel: rombelForm.rombel,
        jumlahSiswa: jumlah
      });
      showToast(`Data rombel Kelas ${rombelForm.kelas} - ${rombelForm.program} (Rombel ${rombelForm.rombel}) berhasil ditambahkan.`);
    }

    setShowRombelModal(false);
    resetRombelForm();
  };

  const executeDeleteRombel = async () => {
    if (!confirmDeleteRombel) return;
    const r = confirmDeleteRombel;
    await deleteRombel(r.id);
    setConfirmDeleteRombel(null);
    showToast(`Data rombel Kelas ${r.kelas} - ${r.program} (Rombel ${r.rombel}) berhasil dihapus.`);
  };

  const executeDeleteAllRombel = async () => {
    await deleteAllRombel();
    setConfirmDeleteAllRombel(false);
    showToast('Seluruh data rombel berhasil dihapus.');
  };

  // Filtered rombels
  const filteredRombels = rombels.filter(r => {
    const matchSearch = 
      r.kelas.toLowerCase().includes(searchRombel.toLowerCase()) ||
      r.program.toLowerCase().includes(searchRombel.toLowerCase()) ||
      `rombel ${r.rombel}`.toLowerCase().includes(searchRombel.toLowerCase()) ||
      r.rombel.includes(searchRombel);
    const matchKelas = filterKelasRombel === 'all' || r.kelas === filterKelasRombel;
    const matchProgram = filterProgramRombel === 'all' || r.program === filterProgramRombel;
    const matchRombel = filterPilihanRombel === 'all' || r.rombel === filterPilihanRombel;
    return matchSearch && matchKelas && matchProgram && matchRombel;
  });

  const totalSiswaRombel = rombels.reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0);
  const avgSiswaPerRombel = rombels.length > 0 ? Math.round(totalSiswaRombel / rombels.length) : 0;
  const countRombelVII = rombels.filter(r => r.kelas === 'VII').length;
  const countRombelVIII = rombels.filter(r => r.kelas === 'VIII').length;
  const countRombelIX = rombels.filter(r => r.kelas === 'IX').length;

  const handleExportRombelsPDF = () => {
    exportTableToPDF({
      title: 'DATA ROMBONGAN BELAJAR (ROMBEL) MTs. NURUL JADID',
      subtitle: `Tahun Ajaran 2026/2027 • Total ${filteredRombels.length} Rombel • Total ${filteredRombels.reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)} Siswa`,
      headers: ['No', 'Tingkat Kelas', 'Program Peminatan', 'Rombel', 'Jumlah Siswa'],
      rows: filteredRombels.map((r, idx) => [
        idx + 1,
        `Kelas ${r.kelas}`,
        r.program,
        `Rombel ${r.rombel}`,
        `${r.jumlahSiswa} Siswa`
      ]),
      fileName: 'Data_Rombel_MTs_Nurul_Jadid'
    });
  };

  const handleExportRombelsExcel = () => {
    const excelData = filteredRombels.map((r, idx) => ({
      No: idx + 1,
      Kelas: r.kelas,
      Program: r.program,
      Rombel: `Rombel ${r.rombel}`,
      'Jumlah Siswa': r.jumlahSiswa
    }));
    exportTableToExcel(excelData, 'Data_Rombel_MTs_Nurul_Jadid', 'Data Rombel');
  };

  // ========================================================
  // STUDENT CRUD STATES & HANDLERS
  // ========================================================
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    nama: '',
    kelas: 'VII' as Kelas,
    program: 'Agama' as Program,
    rombel: '1',
    nisn: '',
    gender: 'L' as 'L' | 'P',
    alamat: ''
  });

  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState<Student | null>(null);
  const [confirmDeleteAllStudent, setConfirmDeleteAllStudent] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  // Student Filters
  const [searchStudent, setSearchStudent] = useState('');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterRombel, setFilterRombel] = useState<string>('all');

  const [searchGuru, setSearchGuru] = useState('');
  const [filterMapelGuru, setFilterMapelGuru] = useState<string>('all');

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.nama.trim()) return;

    if (isEditingStudent && editingStudentId) {
      await updateStudent({
        id: editingStudentId,
        nama: studentForm.nama,
        kelas: studentForm.kelas,
        program: studentForm.program,
        rombel: studentForm.rombel,
        nisn: studentForm.nisn || undefined,
        gender: studentForm.gender,
        alamat: studentForm.alamat || undefined
      });
      showToast(`Data siswa ${studentForm.nama} berhasil diperbarui.`);
    } else {
      await addStudent({
        nama: studentForm.nama,
        kelas: studentForm.kelas,
        program: studentForm.program,
        rombel: studentForm.rombel,
        nisn: studentForm.nisn || undefined,
        gender: studentForm.gender,
        alamat: studentForm.alamat || undefined
      });
      showToast(`Data siswa ${studentForm.nama} berhasil ditambahkan.`);
    }

    setShowStudentModal(false);
    resetStudentForm();
  };

  const resetStudentForm = () => {
    setStudentForm({
      nama: '',
      kelas: 'VII',
      program: 'Agama',
      rombel: '1',
      nisn: '',
      gender: 'L',
      alamat: ''
    });
    setIsEditingStudent(false);
    setEditingStudentId(null);
  };

  const openEditStudent = (s: Student) => {
    setStudentForm({
      nama: s.nama,
      kelas: s.kelas,
      program: s.program,
      rombel: s.rombel,
      nisn: s.nisn || '',
      gender: s.gender || 'L',
      alamat: s.alamat || ''
    });
    setIsEditingStudent(true);
    setEditingStudentId(s.id);
    setShowStudentModal(true);
  };

  const executeDeleteStudent = async () => {
    if (!confirmDeleteStudent) return;
    const s = confirmDeleteStudent;
    await deleteStudent(s.id);
    setConfirmDeleteStudent(null);
    showToast(`Data siswa ${s.nama} berhasil dihapus.`);
  };

  const executeDeleteAllStudent = async () => {
    await deleteAllStudents();
    setConfirmDeleteAllStudent(false);
    showToast('Seluruh data siswa berhasil dihapus.');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const lines = importText.trim().split('\n');
    const parsedStudents: Omit<Student, 'id'>[] = [];

    for (const line of lines) {
      const parts = line.split(/[\t,;]+/).map(p => p.trim());
      if (parts.length >= 4) {
        let nama = '';
        let kelas: Kelas = 'VII';
        let prog: Program = 'Agama';
        let rombel = '1';

        if (!isNaN(Number(parts[0])) && parts.length >= 5) {
          nama = parts[1];
          kelas = (['VII', 'VIII', 'IX'].includes(parts[2].toUpperCase()) ? parts[2].toUpperCase() : 'VII') as Kelas;
          prog = (['Agama', 'Tahfidz', 'Reguler'].includes(parts[3]) ? parts[3] : 'Reguler') as Program;
          rombel = ['1','2','3','4','5','6','7'].includes(parts[4]) ? parts[4] : '1';
        } else {
          nama = parts[0];
          kelas = (['VII', 'VIII', 'IX'].includes(parts[1].toUpperCase()) ? parts[1].toUpperCase() : 'VII') as Kelas;
          prog = (['Agama', 'Tahfidz', 'Reguler'].includes(parts[2]) ? parts[2] : 'Reguler') as Program;
          rombel = ['1','2','3','4','5','6','7'].includes(parts[3]) ? parts[3] : '1';
        }

        if (nama) {
          parsedStudents.push({
            nama,
            kelas,
            program: prog,
            rombel
          });
        }
      }
    }

    if (parsedStudents.length > 0) {
      await importStudents(parsedStudents);
      setShowImportModal(false);
      setImportText('');
      showToast(`Berhasil mengimpor ${parsedStudents.length} data siswa.`);
    } else {
      setImportFeedback('Format data tidak sesuai. Pastikan ada kolom: No, Nama Siswa, Kelas, Program, Rombel');
    }
  };

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(searchStudent.toLowerCase()) || 
                        (s.nisn && s.nisn.includes(searchStudent));
    const matchKelas = filterKelas === 'all' || s.kelas === filterKelas;
    const matchProgram = filterProgram === 'all' || s.program === filterProgram;
    const matchRombel = filterRombel === 'all' || s.rombel === filterRombel;
    return matchSearch && matchKelas && matchProgram && matchRombel;
  });

  // Filtered teachers
  const filteredTeachers = teachers.filter(t => {
    const matchSearch = t.nama.toLowerCase().includes(searchGuru.toLowerCase()) ||
                        t.niup.includes(searchGuru) ||
                        t.mapel.toLowerCase().includes(searchGuru.toLowerCase());
    const matchMapel = filterMapelGuru === 'all' || t.mapel.toLowerCase().includes(filterMapelGuru.toLowerCase());
    return matchSearch && matchMapel;
  });

  // Export handlers
  const handleExportStudentsPDF = () => {
    exportTableToPDF({
      title: 'DATA INDUK PESERTA DIDIK MTs. NURUL JADID',
      subtitle: `Tahun Ajaran 2026/2027 • Total ${filteredStudents.length} Siswa`,
      headers: ['No', 'Nama Lengkap Siswa', 'Kelas', 'Program Peminatan', 'Rombel', 'NISN'],
      rows: filteredStudents.map((s, idx) => [
        idx + 1,
        s.nama,
        s.kelas,
        s.program,
        `Rombel ${s.rombel}`,
        s.nisn || '-'
      ]),
      fileName: 'Data_Siswa_MTs_Nurul_Jadid'
    });
  };

  const handleExportStudentsExcel = () => {
    const excelData = filteredStudents.map((s, idx) => ({
      No: idx + 1,
      'Nama Siswa': s.nama,
      Kelas: s.kelas,
      Program: s.program,
      Rombel: s.rombel,
      NISN: s.nisn || '',
      Gender: s.gender || '',
      Alamat: s.alamat || ''
    }));
    exportTableToExcel(excelData, 'Data_Siswa_MTs_Nurul_Jadid', 'Siswa');
  };

  const handleExportTeachersPDF = () => {
    exportTableToPDF({
      title: 'DAFTAR GURU & BEBAN MENGAJAR MTs. NURUL JADID',
      subtitle: 'Tahun Ajaran 2026/2027 • Berdasarkan SK Pembagian Tugas',
      headers: ['No', 'NIUP', 'Nama Guru Pengampu', 'L/P', 'Jabatan Struktural', 'Mata Pelajaran', 'JP KBM', 'JP Ekuiv', 'Total JP'],
      rows: filteredTeachers.map((t) => [
        t.no,
        t.niup,
        t.nama,
        t.gender,
        t.jabatanStruktural,
        t.mapel,
        t.jpKbm,
        t.jpJab,
        t.totalJp
      ]),
      fileName: 'Data_Guru_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportTeachersExcel = () => {
    const excelData = filteredTeachers.map(t => ({
      No: t.no,
      NIUP: t.niup,
      'Nama Guru': t.nama,
      'L/P': t.gender,
      'Jabatan Struktural': t.jabatanStruktural,
      'Mata Pelajaran': t.mapel,
      'JP KBM': t.jpKbm,
      'JP Jabatan': t.jpJab,
      'Total JP': t.totalJp
    }));
    exportTableToExcel(excelData, 'Data_Guru_MTs_Nurul_Jadid', 'Dewan Guru');
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'kurikulum', label: '1. Dokumen Kurikulum Madrasah', icon: BookOpen },
          { key: 'kalender', label: '2. Kalender Pendidikan', icon: Calendar },
          { key: 'struktur', label: '3. Struktur Organisasi', icon: Network },
          { key: 'guru', label: '4. Data Guru', icon: GraduationCap },
          { key: 'rombel', label: '5. Data Rombel', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key || (tab.key === 'rombel' && activeTab === 'siswa');
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          SUB-MENU 1: DOKUMEN KURIKULUM MADRASAH
      ======================================================== */}
      {activeTab === 'kurikulum' && (
        <IframeEmbedSection
          type="kurikulum"
          title="Kurikulum Madrasah Tsanawiyah Nurul Jadid 2026/2027"
          subtitle="Pendekatan Pembelajaran Mendalam (Deep Learning) & Kurikulum Berbasis Cinta (KBC) Sesuai KMA No. 1503 Tahun 2025"
          badgeText="Dokumen Induk #1"
          nativeLabel="Buku Digital Kurikulum"
          iframeLabel="Iframe Embed Flipbook / Web"
          defaultViewMode="native"
        >
          <KurikulumDigitalReader />
        </IframeEmbedSection>
      )}

      {/* ========================================================
          SUB-MENU 2: KALENDER PENDIDIKAN
      ======================================================== */}
      {activeTab === 'kalender' && (
        <IframeEmbedSection
          type="kalender"
          title="Kalender Pendidikan MTs. Nurul Jadid 2026/2027"
          subtitle="Keputusan Kepala MTs. Nurul Jadid Nomor: NJ-H/15/018/A.III/07.2026 • 211 Hari Efektif KBM"
          badgeText="Dokumen Induk #2"
          nativeLabel="Kalender Akademik Interaktif"
          iframeLabel="Iframe Google Drive / Web"
          defaultViewMode="native"
        >
          <KalenderPendidikanInteraktif />
        </IframeEmbedSection>
      )}

      {/* ========================================================
          SUB-MENU 3: STRUKTUR ORGANISASI
      ======================================================== */}
      {activeTab === 'struktur' && (
        <IframeEmbedSection
          type="struktur"
          title="Struktur Organisasi MTs. Nurul Jadid Paiton"
          subtitle="Tahun Pelajaran 2026/2027 • Bagan Pimpinan Eksekutif, Komite, Waka, TU, UPT & Koordinator"
          badgeText="Dokumen Induk #3"
          nativeLabel="Bagan Struktur Interaktif"
          iframeLabel="Iframe Google Drive / Slides"
          defaultViewMode="native"
        >
          <StrukturOrganisasiChart />
        </IframeEmbedSection>
      )}

      {/* ========================================================
          SUB-MENU 4: DATA GURU (LENGKAP 54 GURU DARI OCR RESMI)
      ======================================================== */}
      {activeTab === 'guru' && (
        <IframeEmbedSection
          type="dataGuru"
          title="Data Dewan Guru & Tenaga Kependidikan"
          subtitle="Daftar resmi 54 Guru pengampu beserta rincian NIUP, Tugas Struktural, dan Beban JP Mengajar"
          badgeText="Dokumen Induk #4"
          nativeLabel="Tabel Database Dewan Guru (54 Guru)"
          iframeLabel="Iframe Google Drive / Sheets"
          defaultViewMode="native"
        >
          <div className="space-y-4">
            {/* Top Toolbar: Exports */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Database Resmi Dewan Guru MTs. Nurul Jadid
                </h4>
                <p className="text-xs text-slate-500">
                  Total 54 Guru Aktif • Terverifikasi Simpatika Kemenag RI
                </p>
              </div>

              {canExport() && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportTeachersPDF}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ekspor PDF
                  </button>
                  <button
                    onClick={handleExportTeachersExcel}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Ekspor Excel
                  </button>
                </div>
              )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari guru berdasarkan nama, NIUP, atau mata pelajaran..."
                  value={searchGuru}
                  onChange={e => setSearchGuru(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:w-60">
                <select
                  value={filterMapelGuru}
                  onChange={e => setFilterMapelGuru(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Semua Rumpun Mapel</option>
                  <option value="Bahasa Arab">Bahasa Arab</option>
                  <option value="Nahwu">Nahwu & Shorrof</option>
                  <option value="IPA">Ilmu Pengetahuan Alam (IPA)</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Fikih">Fikih</option>
                  <option value="Informatika">Informatika</option>
                </select>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">NIUP</th>
                    <th className="px-3.5 py-3">Nama Lengkap Guru</th>
                    <th className="px-2 py-3 text-center">L/P</th>
                    <th className="px-3.5 py-3">Jabatan Struktural</th>
                    <th className="px-3.5 py-3">Mata Pelajaran</th>
                    <th className="px-2.5 py-3 text-center">KBM</th>
                    <th className="px-2.5 py-3 text-center">Ekuiv</th>
                    <th className="px-3 py-3 text-center font-extrabold text-emerald-700 dark:text-emerald-400">Total JP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTeachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-2.5 text-center font-semibold text-slate-400">{t.no}</td>
                      <td className="px-3.5 py-2.5 font-mono text-[11px]">{t.niup}</td>
                      <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">
                        {t.nama}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          t.gender === 'L' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                        }`}>
                          {t.gender}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-700 dark:text-slate-300">
                        {t.jabatanStruktural}
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-emerald-700 dark:text-emerald-400">
                        {t.mapel}
                      </td>
                      <td className="px-2.5 py-2.5 text-center">{t.jpKbm}</td>
                      <td className="px-2.5 py-2.5 text-center">{t.jpJab}</td>
                      <td className="px-3 py-2.5 text-center font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                        {t.totalJp} JP
                      </td>
                    </tr>
                  ))}
                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                        Tidak ada guru yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </IframeEmbedSection>
      )}

      {/* ========================================================
          SUB-MENU 5: DATA ROMBEL (ROMBONGAN BELAJAR) & DATA SISWA
      ======================================================== */}
      {(activeTab === 'rombel' || activeTab === 'siswa') && (
        <IframeEmbedSection
          type="dataRombel"
          title="Data Rombongan Belajar (Rombel) & Siswa"
          subtitle="Distribusi Rombel Kelas VII, VIII, IX, Program Peminatan (Agama, Tahfidz, Reguler) & Basis Data Siswa TP 2026/2027"
          badgeText="Dokumen Induk #5"
          nativeLabel="Database Rombel & Siswa Terpadu"
          iframeLabel="Iframe Google Sheets / EMIS Rombel"
          defaultViewMode="native"
        >
          <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            {/* Header section with title and actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                    Dokumen Induk #5
                  </span>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                    TP 2026/2027
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
                  <School className="w-5 h-5 text-emerald-600" />
                  {viewSubTab === 'rombel' ? 'Data Rombongan Belajar (Rombel)' : 'Data Siswa & Profil Santri'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewSubTab === 'rombel'
                    ? 'Manajemen pembagian rombongan belajar per kelas (VII, VIII, IX), program (Agama, Tahfidz, Reguler), pilihan rombel (1 s.d. 7), dan jumlah siswa'
                    : 'Daftar nama dan identitas rinci siswa/santri terdaftar di MTs. Nurul Jadid Paiton'}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Switcher between Data Rombel & Data Siswa Rinci */}
                <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 mr-1">
                  <button
                    onClick={() => setViewSubTab('rombel')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      viewSubTab === 'rombel'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Data Rombel ({rombels.length})
                  </button>
                  <button
                    onClick={() => setViewSubTab('siswa-rinci')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      viewSubTab === 'siswa-rinci'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Data Siswa Rinci ({students.length})
                  </button>
                </div>

                {viewSubTab === 'rombel' ? (
                  <>
                    {canEdit() && (
                      <>
                        <button
                          onClick={() => {
                            resetRombelForm();
                            setShowRombelModal(true);
                          }}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Data
                        </button>
                        {rombels.length > 0 && (
                          <button
                            onClick={() => setConfirmDeleteAllRombel(true)}
                            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1.5 transition cursor-pointer"
                            title="Hapus Semua Data Rombel"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua Data
                          </button>
                        )}
                      </>
                    )}

                    {canExport() && rombels.length > 0 && (
                      <>
                        <button
                          onClick={handleExportRombelsPDF}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                          title="Ekspor Data Rombel ke PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          PDF
                        </button>
                        <button
                          onClick={handleExportRombelsExcel}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                          title="Ekspor Data Rombel ke Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                          Excel
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {canEdit() && (
                      <>
                        <button
                          onClick={() => {
                            resetStudentForm();
                            setShowStudentModal(true);
                          }}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah Siswa
                        </button>
                        <button
                          onClick={() => {
                            setImportFeedback(null);
                            setShowImportModal(true);
                          }}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Import Data
                        </button>
                        {students.length > 0 && (
                          <button
                            onClick={() => setConfirmDeleteAllStudent(true)}
                            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1.5 transition cursor-pointer"
                            title="Hapus Semua Data Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua Data
                          </button>
                        )}
                      </>
                    )}

                    {canExport() && students.length > 0 && (
                      <>
                        <button
                          onClick={handleExportStudentsPDF}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                          title="Ekspor Seluruh Siswa ke PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600" />
                          PDF
                        </button>
                        <button
                          onClick={handleExportStudentsExcel}
                          className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                          title="Ekspor Seluruh Siswa ke Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                          Excel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ========================================================
                VIEW SUB-TAB: DATA ROMBEL (PRIMARY)
            ======================================================== */}
            {viewSubTab === 'rombel' && (
              <div className="space-y-5">
                {/* 4 Overview Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-800/50">
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      Total Data Rombel
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {rombels.length} <span className="text-xs font-medium text-slate-400">Rombel</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Rombel 1 s.d. 7 Aktif
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-linear-to-br from-teal-500/10 via-teal-500/5 to-transparent border border-teal-200/80 dark:border-teal-800/50">
                    <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                      Total Jumlah Siswa
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {totalSiswaRombel} <span className="text-xs font-medium text-slate-400">Siswa</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Alokasi seluruh rombel
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80 dark:border-blue-800/50">
                    <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                      Rata-Rata Siswa
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {avgSiswaPerRombel} <span className="text-xs font-medium text-slate-400">Siswa/Rombel</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Kapasitas kelas ideal
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 dark:border-amber-800/50">
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      Rombel per Tingkat
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-2 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs">
                        VII: {countRombelVII}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs">
                        VIII: {countRombelVIII}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs">
                        IX: {countRombelIX}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Distribusi kelas madrasah
                    </div>
                  </div>
                </div>

                {/* Filters & Search Row for Rombel */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="relative sm:col-span-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari kelas, program, rombel..."
                      value={searchRombel}
                      onChange={e => setSearchRombel(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <select
                      value={filterKelasRombel}
                      onChange={e => setFilterKelasRombel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Kelas</option>
                      <option value="VII">Kelas VII</option>
                      <option value="VIII">Kelas VIII</option>
                      <option value="IX">Kelas IX</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterProgramRombel}
                      onChange={e => setFilterProgramRombel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Program</option>
                      <option value="Agama">Program Agama</option>
                      <option value="Tahfidz">Program Tahfidz</option>
                      <option value="Reguler">Program Reguler</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterPilihanRombel}
                      onChange={e => setFilterPilihanRombel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Rombel (1 - 7)</option>
                      {['1', '2', '3', '4', '5', '6', '7'].map(r => (
                        <option key={r} value={r}>Rombel {r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Data Rombel */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-center w-14">No</th>
                        <th className="px-4 py-3 text-center">Kelas</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3 text-center">Rombel (Pilihan 1 - 7)</th>
                        <th className="px-4 py-3 text-center">Jumlah Siswa</th>
                        <th className="px-4 py-3 text-center w-28">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredRombels.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 rounded-full font-black text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              Kelas {r.kelas}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              r.program === 'Agama'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : r.program === 'Tahfidz'
                                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            }`}>
                              {r.program}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 rounded-xl font-black text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                              Rombel {r.rombel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                              {r.jumlahSiswa} Siswa
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {canEdit() && (
                                <>
                                  <button
                                    onClick={() => openEditRombel(r)}
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                    title="Edit Data Rombel"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteRombel(r)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                    title="Hapus Data Rombel"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredRombels.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                            <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                            {rombels.length === 0 ? (
                              <div className="space-y-2">
                                <p className="font-semibold text-slate-600 dark:text-slate-300">
                                  Belum ada Data Rombel tersimpan di aplikasi.
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Klik tombol Tambah Data untuk memasukkan rombel baru (Kelas, Program, Rombel 1-7, dan Jumlah Siswa).
                                </p>
                                {canEdit() && (
                                  <button
                                    onClick={() => {
                                      resetRombelForm();
                                      setShowRombelModal(true);
                                    }}
                                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Tambah Data Rombel Sekarang
                                  </button>
                                )}
                              </div>
                            ) : (
                              <p>Tidak ada data rombel yang cocok dengan filter atau kata kunci pencarian.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================
                VIEW SUB-TAB: DATA SISWA RINCI (SECONDARY)
            ======================================================== */}
            {viewSubTab === 'siswa-rinci' && (
              <div className="space-y-4">
                {/* Filters & Search for Students */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="relative sm:col-span-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama siswa atau NISN..."
                      value={searchStudent}
                      onChange={e => setSearchStudent(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <select
                      value={filterKelas}
                      onChange={e => setFilterKelas(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Kelas</option>
                      <option value="VII">Kelas VII</option>
                      <option value="VIII">Kelas VIII</option>
                      <option value="IX">Kelas IX</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterProgram}
                      onChange={e => setFilterProgram(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Program</option>
                      <option value="Agama">Program Agama</option>
                      <option value="Tahfidz">Program Tahfidz</option>
                      <option value="Reguler">Program Reguler</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={filterRombel}
                      onChange={e => setFilterRombel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">Semua Rombel (1 - 7)</option>
                      {['1', '2', '3', '4', '5', '6', '7'].map(r => (
                        <option key={r} value={r}>Rombel {r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-3 text-center w-12">No</th>
                        <th className="px-3.5 py-3">Nama Siswa</th>
                        <th className="px-3.5 py-3 text-center">Kelas</th>
                        <th className="px-3.5 py-3">Program Peminatan</th>
                        <th className="px-3.5 py-3 text-center">Rombel</th>
                        <th className="px-3.5 py-3">NISN</th>
                        <th className="px-3.5 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredStudents.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                          <td className="px-3.5 py-2.5 text-center font-semibold text-slate-400">{idx + 1}</td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">
                            {s.nama}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {s.kelas}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              s.program === 'Agama' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              s.program === 'Tahfidz' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {s.program}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-center font-semibold">
                            Rombel {s.rombel}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500">
                            {s.nisn || '-'}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setViewingStudent(s)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="Lihat Kartu Profil"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {canEdit() && (
                                <>
                                  <button
                                    onClick={() => openEditStudent(s)}
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                    title="Edit Siswa"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteStudent(s)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                    title="Hapus Siswa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                            {students.length === 0 ? 'Belum ada data siswa terdaftar.' : 'Tidak ada data siswa yang cocok dengan filter.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        </IframeEmbedSection>
      )}

      {/* ========================================================
          MODAL: TAMBAH / EDIT DATA ROMBEL
          Field 1: Kelas
          Field 2: Program
          Field 3: Rombel (pilihan 1 - 7)
          Field 4: Jumlah Siswa
      ======================================================== */}
      {showRombelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-600" />
                {isEditingRombel ? 'Edit Data Rombel' : 'Tambah Data Rombel'}
              </h3>
              <button onClick={() => setShowRombelModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRombel} className="mt-4 space-y-4">
              {/* 1. Kolom isian Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  1. Kelas *
                </label>
                <select
                  required
                  value={rombelForm.kelas}
                  onChange={e => setRombelForm({ ...rombelForm, kelas: e.target.value as Kelas })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="VII">Kelas VII (Tujuh)</option>
                  <option value="VIII">Kelas VIII (Delapan)</option>
                  <option value="IX">Kelas IX (Sembilan)</option>
                </select>
              </div>

              {/* 2. Kolom isian Program */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  2. Program *
                </label>
                <select
                  required
                  value={rombelForm.program}
                  onChange={e => setRombelForm({ ...rombelForm, program: e.target.value as Program })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Agama">Program Agama</option>
                  <option value="Tahfidz">Program Tahfidz</option>
                  <option value="Reguler">Program Reguler</option>
                </select>
              </div>

              {/* 3. Kolom isian Rombel (dengan kolom pilihan 1 - 7) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  3. Rombel (Pilihan 1 - 7) *
                </label>
                <select
                  required
                  value={rombelForm.rombel}
                  onChange={e => setRombelForm({ ...rombelForm, rombel: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="1">Rombel 1</option>
                  <option value="2">Rombel 2</option>
                  <option value="3">Rombel 3</option>
                  <option value="4">Rombel 4</option>
                  <option value="5">Rombel 5</option>
                  <option value="6">Rombel 6</option>
                  <option value="7">Rombel 7</option>
                </select>
              </div>

              {/* 4. Kolom isian Jumlah Siswa */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  4. Jumlah Siswa *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  placeholder="Contoh: 32"
                  value={rombelForm.jumlahSiswa || ''}
                  onChange={e => setRombelForm({ ...rombelForm, jumlahSiswa: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Masukkan jumlah total siswa yang dialokasikan di rombel ini.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRombelModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition cursor-pointer"
                >
                  {isEditingRombel ? 'Simpan Perubahan' : 'Simpan Data Rombel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS ROMBEL (SINGLE)
      ======================================================== */}
      {confirmDeleteRombel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Hapus Data Rombel?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-800 dark:text-slate-200">Kelas {confirmDeleteRombel.kelas} - {confirmDeleteRombel.program} (Rombel {confirmDeleteRombel.rombel})</span> dengan jumlah {confirmDeleteRombel.jumlahSiswa} siswa?
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeleteRombel(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteRombel}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                Ya, Hapus Rombel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS SEMUA DATA ROMBEL
      ======================================================== */}
      {confirmDeleteAllRombel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Hapus Semua Data Rombel?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Anda akan menghapus seluruh <span className="font-bold text-rose-600 dark:text-rose-400">{rombels.length} data rombongan belajar</span> secara permanen dari aplikasi. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeleteAllRombel(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteAllRombel}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                Ya, Hapus Semua Rombel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS SISWA (SINGLE)
      ======================================================== */}
      {confirmDeleteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Hapus Data Siswa?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Yakin ingin menghapus data siswa <span className="font-bold text-slate-800 dark:text-slate-200">{confirmDeleteStudent.nama}</span>?
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeleteStudent(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteStudent}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                Ya, Hapus Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KONFIRMASI HAPUS SEMUA DATA SISWA
      ======================================================== */}
      {confirmDeleteAllStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/60 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Hapus Semua Data Siswa?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Anda akan menghapus seluruh <span className="font-bold text-rose-600 dark:text-rose-400">{students.length} data siswa</span> secara permanen dari aplikasi. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDeleteAllStudent(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteAllStudent}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                Ya, Hapus Semua Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH / EDIT SISWA
      ======================================================== */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                {isEditingStudent ? 'Edit Data Siswa' : 'Tambah Data Siswa'}
              </h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  1. Nama Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap santri..."
                  value={studentForm.nama}
                  onChange={e => setStudentForm({ ...studentForm, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  2. Pilihan Kelas *
                </label>
                <select
                  value={studentForm.kelas}
                  onChange={e => setStudentForm({ ...studentForm, kelas: e.target.value as Kelas })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="VII">Kelas VII (Tujuh)</option>
                  <option value="VIII">Kelas VIII (Delapan)</option>
                  <option value="IX">Kelas IX (Sembilan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  3. Pilihan Program *
                </label>
                <select
                  value={studentForm.program}
                  onChange={e => setStudentForm({ ...studentForm, program: e.target.value as Program })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Agama">Program Agama (Kitab Kuning & Nahwu-Shorrof)</option>
                  <option value="Tahfidz">Program Tahfidz (Hafalan Al-Qur'an 30 Juz)</option>
                  <option value="Reguler">Program Reguler (Sains, Bahasa & Teknologi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  4. Pilihan Rombel (1 sampai 7) *
                </label>
                <select
                  value={studentForm.rombel}
                  onChange={e => setStudentForm({ ...studentForm, rombel: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {['1', '2', '3', '4', '5', '6', '7'].map(r => (
                    <option key={r} value={r}>Rombel {r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    NISN (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="00xxxxxxxx"
                    value={studentForm.nisn}
                    onChange={e => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={studentForm.gender}
                    onChange={e => setStudentForm({ ...studentForm, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value="L">Laki-laki (Santri Putra)</option>
                    <option value="P">Perempuan (Santri Putri)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition cursor-pointer"
                >
                  {isEditingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KARTU PROFIL SANTRI
      ======================================================== */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Kartu Profil Santri MTs. Nurul Jadid
              </h3>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl border-2 border-emerald-600 overflow-hidden shadow-lg bg-linear-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <div className="bg-emerald-700 text-white p-3 text-center relative">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                  YAYASAN NURUL JADID PAITON
                </div>
                <div className="text-sm font-extrabold">KARTU TANDA PELAJAR SANTRI</div>
                <div className="text-[10px] text-emerald-100 opacity-90">MTs. NURUL JADID • TP 2026/2027</div>
              </div>
              <div className="h-1 bg-amber-500"></div>

              <div className="p-4 flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center shrink-0 text-slate-400">
                  <Users className="w-8 h-8 text-emerald-600 mb-1" />
                  <span className="text-[9px] font-bold">FOTO 3x4</span>
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <div className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                    {viewingStudent.nama}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    NISN: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{viewingStudent.nisn || '0098712301'}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Kelas: <span className="font-bold text-emerald-700 dark:text-emerald-400">{viewingStudent.kelas} (Rombel {viewingStudent.rombel})</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Program: <span className="font-bold text-teal-700 dark:text-teal-400">{viewingStudent.program}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-1">
                    Domisili: {viewingStudent.alamat || 'Pesantren Nurul Jadid'}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-center border-t border-slate-200 dark:border-slate-700">
                <div className="text-[9px] text-slate-500 dark:text-slate-400">
                  Kepala MTs. Nurul Jadid: <span className="font-bold text-slate-700 dark:text-slate-200">{MADRASAH_INFO.kepalaMadrasah}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => exportStudentCardPDF(viewingStudent)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu Profil (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: IMPORT DATA SISWA
      ======================================================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Import Data Siswa MTs. Nurul Jadid
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Struktur Atribut Import:
              </div>
              <p>1. No. • 2. Nama Siswa • 3. Kelas (VII/VIII/IX) • 4. Program (Agama/Tahfidz/Reguler) • 5. Rombel (1-7)</p>
              <p className="text-[11px] opacity-80">Anda dapat menyalin (copy-paste) langsung dari tabel Excel atau berkas CSV.</p>
            </div>

            {importFeedback && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium">
                {importFeedback}
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tempelkan Baris Data (Copy & Paste):
                </label>
                <textarea
                  required
                  rows={6}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={`Contoh:\n1\tMuhammad Al-Fatih\tVII\tAgama\t1\n2\tAhmad Dahlan\tVIII\tTahfidz\t2\n3\tSiti Maryam\tIX\tReguler\t3`}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition cursor-pointer"
                >
                  Proses & Simpan Data
                </button>
              </div>
            </form>
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
