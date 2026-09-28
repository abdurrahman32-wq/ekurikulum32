import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProtaItem, PromesItem, ATPItem } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportInfoCardPDF 
} from '../utils/exportUtils';
import { 
  CalendarRange, 
  Clock, 
  Compass, 
  Plus, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  Heart, 
  Search,
  Filter,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const PerencanaanKurikulumView: React.FC = () => {
  const { 
    protaList, 
    addProta, 
    updateProta, 
    deleteProta,
    promesList, 
    addPromes, 
    updatePromes, 
    deletePromes, 
    importPromes,
    atpList, 
    addATP, 
    updateATP, 
    deleteATP,
    canEdit, 
    canExport 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'prota' | 'promes' | 'atp'>('prota');

  // PROTA State
  const [showProtaModal, setShowProtaModal] = useState(false);
  const [editingProta, setEditingProta] = useState<ProtaItem | null>(null);
  const [protaForm, setProtaForm] = useState({
    bulan: 'Juli',
    mingguKe: '1 & 2',
    namaProgram: '',
    jenisProgram: 'Akademik',
    penanggungJawab: 'Najibul Hoer, S.Si, M.Pd (Waka Kurikulum)',
    keterangan: 'rencana' as 'selesai' | 'berjalan' | 'rencana'
  });

  // PROMES State
  const [showPromesModal, setShowPromesModal] = useState(false);
  const [editingPromes, setEditingPromes] = useState<PromesItem | null>(null);
  const [promesForm, setPromesForm] = useState({
    semester: 'Ganjil' as 'Ganjil' | 'Genap',
    bulan: 'Juli',
    mingguKe: '1',
    namaProgram: '',
    targetOutput: '',
    pj: 'Najibul Hoer, S.Si, M.Pd',
    status: 'Terjadwal'
  });
  const [showPromesImportModal, setShowPromesImportModal] = useState(false);
  const [promesImportText, setPromesImportText] = useState('');

  // ATP State
  const [showAtpModal, setShowAtpModal] = useState(false);
  const [editingAtp, setEditingAtp] = useState<ATPItem | null>(null);
  const [atpForm, setAtpForm] = useState({
    fase: 'D (Kelas VII, VIII, IX)',
    mataPelajaran: 'IPA',
    elemenCP: 'Pemahaman IPA & Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik memahami konsep sel, sistem organ, ekoteologi, dan keteraturan alam semesta ciptaan Allah SWT.',
    tujuanPembelajaran: 'Menganalisis hubungan antara struktur sel dengan fungsinya melalui mikroskop dan refleksi cinta ciptaan Ilahi.',
    alokasiWaktu: '10 JP (5 Pertemuan)',
    pilarKBC: 'Cinta Allah dan Rasul-Nya, Cinta Ilmu, Cinta Lingkungan'
  });

  // Card View Preview Modal
  const [viewingCard, setViewingCard] = useState<{
    title: string;
    type: 'PROTA' | 'PROMES' | 'ATP';
    data: Record<string, string | number>;
  } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Save Prota
  const handleSaveProta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protaForm.namaProgram.trim()) return;

    if (editingProta) {
      await updateProta({
        ...editingProta,
        ...protaForm
      });
    } else {
      await addProta({
        ...protaForm
      });
    }
    setShowProtaModal(false);
    setEditingProta(null);
    setProtaForm({
      bulan: 'Juli',
      mingguKe: '1 & 2',
      namaProgram: '',
      jenisProgram: 'Akademik',
      penanggungJawab: 'Najibul Hoer, S.Si, M.Pd (Waka Kurikulum)',
      keterangan: 'rencana'
    });
  };

  // Save Promes
  const handleSavePromes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promesForm.namaProgram.trim()) return;

    if (editingPromes) {
      await updatePromes({
        ...editingPromes,
        ...promesForm
      });
    } else {
      await addPromes({
        ...promesForm
      });
    }
    setShowPromesModal(false);
    setEditingPromes(null);
    setPromesForm({
      semester: 'Ganjil',
      bulan: 'Juli',
      mingguKe: '1',
      namaProgram: '',
      targetOutput: '',
      pj: 'Najibul Hoer, S.Si, M.Pd',
      status: 'Terjadwal'
    });
  };

  // Import Promes
  const handleImportPromesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promesImportText.trim()) return;

    const lines = promesImportText.trim().split('\n');
    const items: Omit<PromesItem, 'id'>[] = [];

    for (const line of lines) {
      const parts = line.split(/[\t,;]+/).map(p => p.trim());
      if (parts.length >= 4) {
        // format: Semester | Bulan | Minggu | Nama Program | Target Output
        items.push({
          semester: (parts[0] === 'Genap' ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap',
          bulan: parts[1] || 'Juli',
          mingguKe: parts[2] || '1',
          namaProgram: parts[3],
          targetOutput: parts[4] || 'Dokumen terlaksana',
          pj: parts[5] || 'Waka Kurikulum',
          status: 'Terjadwal'
        });
      }
    }

    if (items.length > 0) {
      await importPromes(items);
      setShowPromesImportModal(false);
      setPromesImportText('');
      alert(`Berhasil mengimpor ${items.length} program semester.`);
    } else {
      alert('Format tidak valid. Pastikan format: Semester | Bulan | Minggu | Nama Program | Target Output');
    }
  };

  // Save ATP
  const handleSaveATP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!atpForm.mataPelajaran.trim() || !atpForm.tujuanPembelajaran.trim()) return;

    if (editingAtp) {
      await updateATP({
        ...editingAtp,
        ...atpForm
      });
    } else {
      await addATP({
        ...atpForm
      });
    }
    setShowAtpModal(false);
    setEditingAtp(null);
  };

  // Export handlers
  const handleExportProtaPDF = () => {
    exportTableToPDF({
      title: 'PROGRAM TAHUNAN KURIKULUM BERBASIS CINTA (KBC)',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Bulan', 'Minggu Ke', 'Nama Program Kerja', 'Jenis', 'Penanggung Jawab', 'Status'],
      rows: protaList.map((p, idx) => [
        idx + 1,
        p.bulan,
        p.mingguKe || '-',
        p.namaProgram,
        p.jenisProgram,
        p.penanggungJawab || 'Waka Kurikulum',
        p.keterangan.toUpperCase()
      ]),
      fileName: 'Program_Tahunan_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportProtaExcel = () => {
    const data = protaList.map((p, idx) => ({
      No: idx + 1,
      Bulan: p.bulan,
      'Minggu Ke': p.mingguKe || '',
      'Nama Program': p.namaProgram,
      'Jenis Program': p.jenisProgram,
      'Penanggung Jawab': p.penanggungJawab || '',
      Status: p.keterangan
    }));
    exportTableToExcel(data, 'Program_Tahunan_MTs_Nurul_Jadid', 'Prota');
  };

  const handleExportPromesPDF = () => {
    exportTableToPDF({
      title: 'PROGRAM SEMESTER KURIKULUM MTs. NURUL JADID',
      subtitle: 'Tahun Ajaran 2026/2027 • Semester Ganjil & Genap',
      headers: ['No', 'Semester', 'Bulan', 'Minggu', 'Nama Kegiatan / Program', 'Target Output', 'Status'],
      rows: promesList.map((p, idx) => [
        idx + 1,
        p.semester || 'Ganjil',
        p.bulan,
        p.mingguKe,
        p.namaProgram,
        p.targetOutput || p.modulAjar || '-',
        p.status || p.keterangan || 'berjalan'
      ]),
      fileName: 'Program_Semester_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportPromesExcel = () => {
    const data = promesList.map((p, idx) => ({
      No: idx + 1,
      Semester: p.semester || 'Ganjil',
      Bulan: p.bulan,
      Minggu: p.mingguKe,
      'Nama Program': p.namaProgram,
      'Target Output': p.targetOutput || p.modulAjar || '-',
      'Penanggung Jawab': p.pj || '',
      Status: p.status || p.keterangan || 'berjalan'
    }));
    exportTableToExcel(data, 'Program_Semester_MTs_Nurul_Jadid', 'Promes');
  };

  const handleExportAtpPDF = () => {
    exportTableToPDF({
      title: 'ALUR TUJUAN PEMBELAJARAN (ATP) KURIKULUM BERBASIS CINTA',
      subtitle: 'MTs. Nurul Jadid Paiton • Fase D (Kelas VII - IX) KMA 1503/2025',
      headers: ['No', 'Fase & Mapel', 'Elemen CP', 'Tujuan Pembelajaran (TP)', 'Alokasi Waktu', 'Integrasi Panca Cinta'],
      rows: atpList.map((a, idx) => [
        idx + 1,
        `${a.fase || a.faseKelas || 'Fase D'}\n${a.mataPelajaran}`,
        a.elemenCP || a.ruangLingkupMateri || '-',
        a.tujuanPembelajaran,
        a.alokasiWaktu || '4 JP',
        a.pilarKBC || 'Panca Cinta'
      ]),
      fileName: 'ATP_KBC_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportAtpExcel = () => {
    const data = atpList.map((a, idx) => ({
      No: idx + 1,
      Fase: a.fase,
      'Mata Pelajaran': a.mataPelajaran,
      'Elemen CP': a.elemenCP,
      'Capaian Pembelajaran (CP)': a.capaianPembelajaran,
      'Tujuan Pembelajaran (TP)': a.tujuanPembelajaran,
      'Alokasi Waktu': a.alokasiWaktu,
      'Pilar KBC': a.pilarKBC || ''
    }));
    exportTableToExcel(data, 'ATP_KBC_MTs_Nurul_Jadid', 'ATP');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'prota', label: '1. Program Tahunan (PROTA)', icon: CalendarRange },
          { key: 'promes', label: '2. Program Semester (PROMES)', icon: Clock },
          { key: 'atp', label: '3. Alur Tujuan Pembelajaran (ATP)', icon: Compass },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
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
          SUB-MENU 1: PROGRAM TAHUNAN (PROTA)
      ======================================================== */}
      {activeTab === 'prota' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Perencanaan #1
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Program Tahunan (PROTA) MTs. Nurul Jadid
                </h3>
                <p className="text-xs text-slate-500">
                  Agenda strategis tahunan pembelajaran, asesmen, pembiasaan karakter santri, dan evaluasi
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('perencanaan-kurikulum') && (
                  <button
                    onClick={() => {
                      setEditingProta(null);
                      setProtaForm({
                        bulan: 'Juli',
                        mingguKe: '1 & 2',
                        namaProgram: '',
                        jenisProgram: 'Akademik',
                        penanggungJawab: 'Najibul Hoer, S.Si, M.Pd (Waka Kurikulum)',
                        keterangan: 'rencana'
                      });
                      setShowProtaModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Program Tahunan
                  </button>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportProtaPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportProtaExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Prota Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Bulan</th>
                    <th className="px-3.5 py-3">Minggu Ke</th>
                    <th className="px-3.5 py-3">Nama Program Kerja</th>
                    <th className="px-3.5 py-3">Jenis Program</th>
                    <th className="px-3.5 py-3">Penanggung Jawab</th>
                    <th className="px-3.5 py-3 text-center">Status</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {protaList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">
                        Belum ada data Program Tahunan (Prota). Silakan klik tombol "Tambah Prota" di atas untuk menambahkan program kerja baru.
                      </td>
                    </tr>
                  ) : protaList.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{p.bulan}</td>
                      <td className="px-3.5 py-3 font-medium">{p.mingguKe || '-'}</td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900 dark:text-white">
                        {p.namaProgram}
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.jenisProgram}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-slate-500">{p.penanggungJawab || 'Waka Kurikulum'}</td>
                      <td className="px-3.5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.keterangan === 'selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          p.keterangan === 'berjalan' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {p.keterangan}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Download & View Card */}
                          <button
                            onClick={() => setViewingCard({
                              title: p.namaProgram,
                              type: 'PROTA',
                              data: {
                                'Bulan': p.bulan,
                                'Minggu Ke': p.mingguKe || '-',
                                'Nama Program': p.namaProgram,
                                'Jenis Program': p.jenisProgram,
                                'Penanggung Jawab': p.penanggungJawab || 'Waka Kurikulum',
                                'Status Pelaksanaan': p.keterangan.toUpperCase(),
                                'Dasar Hukum': 'Kalender Pendidikan MTs. Nurul Jadid 2026/2027'
                              }
                            })}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                            title="Lihat & Download Kartu Program"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('perencanaan-kurikulum') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingProta(p);
                                  setProtaForm({
                                    bulan: p.bulan,
                                    mingguKe: p.mingguKe || '',
                                    namaProgram: p.namaProgram,
                                    jenisProgram: p.jenisProgram,
                                    penanggungJawab: p.penanggungJawab || '',
                                    keterangan: (p.keterangan as any) || 'berjalan'
                                  });
                                  setShowProtaModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                                title="Edit Prota"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus program "${p.namaProgram}"?`)) {
                                    deleteProta(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                                title="Hapus Prota"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-MENU 2: PROGRAM SEMESTER (PROMES)
      ======================================================== */}
      {activeTab === 'promes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Perencanaan #2
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Program Semester (PROMES) Ganjil & Genap
                </h3>
                <p className="text-xs text-slate-500">
                  Penjabaran operasional mingguan per semester mencakup target output dan pelaksana
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('perencanaan-kurikulum') && (
                  <>
                    <button
                      onClick={() => {
                        setEditingPromes(null);
                        setPromesForm({
                          semester: 'Ganjil',
                          bulan: 'Juli',
                          mingguKe: '1',
                          namaProgram: '',
                          targetOutput: '',
                          pj: 'Najibul Hoer, S.Si, M.Pd',
                          status: 'Terjadwal'
                        });
                        setShowPromesModal(true);
                      }}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Program Semester
                    </button>
                    <button
                      onClick={() => setShowPromesImportModal(true)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Import Promes
                    </button>
                  </>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportPromesPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportPromesExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Promes Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Semester</th>
                    <th className="px-3.5 py-3">Bulan & Minggu</th>
                    <th className="px-3.5 py-3">Program Kegiatan</th>
                    <th className="px-3.5 py-3">Target Output</th>
                    <th className="px-3.5 py-3">Penanggung Jawab</th>
                    <th className="px-3.5 py-3 text-center">Status</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {promesList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                        Belum ada data Program Semester (Promes). Silakan klik tombol "Tambah Promes" untuk menambahkan agenda semester.
                      </td>
                    </tr>
                  ) : promesList.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.semester === 'Ganjil' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {p.semester}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900 dark:text-white">
                        {p.bulan} • M-{p.mingguKe}
                      </td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">
                        {p.namaProgram}
                      </td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300">
                        {p.targetOutput}
                      </td>
                      <td className="px-3.5 py-3 text-slate-500">{p.pj || 'Waka Kurikulum'}</td>
                      <td className="px-3.5 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingCard({
                              title: p.namaProgram,
                              type: 'PROMES',
                              data: {
                                'Semester': p.semester || 'Ganjil',
                                'Bulan': p.bulan,
                                'Minggu Pelaksanaan': `Minggu ke-${p.mingguKe}`,
                                'Nama Kegiatan': p.namaProgram,
                                'Target Output': p.targetOutput || p.modulAjar || '-',
                                'Penanggung Jawab': p.pj || 'Waka Kurikulum',
                                'Status': p.status || p.keterangan || 'berjalan'
                              }
                            })}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                            title="Lihat & Download Kartu Promes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('perencanaan-kurikulum') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingPromes(p);
                                  setPromesForm({
                                    semester: p.semester || 'Ganjil',
                                    bulan: p.bulan,
                                    mingguKe: p.mingguKe,
                                    namaProgram: p.namaProgram,
                                    targetOutput: p.targetOutput || p.modulAjar || '',
                                    pj: p.pj || '',
                                    status: (p.status as any) || p.keterangan || 'berjalan'
                                  });
                                  setShowPromesModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                                title="Edit Promes"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus program "${p.namaProgram}"?`)) {
                                    deletePromes(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                                title="Hapus Promes"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-MENU 3: ALUR TUJUAN PEMBELAJARAN (ATP) - KBC INTEGRATION
      ======================================================== */}
      {activeTab === 'atp' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Perencanaan #3
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500" /> Kurikulum Berbasis Cinta (KBC)
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Alur Tujuan Pembelajaran (ATP) Fase D
                </h3>
                <p className="text-xs text-slate-500">
                  Penyelarasan Capaian Pembelajaran (CP) dan Panca Cinta untuk Kelas VII, VIII, dan IX
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('perencanaan-kurikulum') && (
                  <button
                    onClick={() => {
                      setEditingAtp(null);
                      setAtpForm({
                        fase: 'D (Kelas VII, VIII, IX)',
                        mataPelajaran: 'IPA',
                        elemenCP: 'Pemahaman IPA & Keterampilan Proses',
                        capaianPembelajaran: 'Peserta didik memahami konsep keteraturan alam semesta ciptaan Ilahi.',
                        tujuanPembelajaran: '',
                        alokasiWaktu: '8 JP',
                        pilarKBC: 'Cinta Allah dan Rasul-Nya, Cinta Lingkungan'
                      });
                      setShowAtpModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah ATP
                  </button>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportAtpPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportAtpExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ATP Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atpList.length === 0 ? (
                <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-400 dark:text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6">
                  <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  Belum ada dokumen Alur Tujuan Pembelajaran (ATP). Silakan klik tombol "Tambah ATP" di atas untuk menambahkan.
                </div>
              ) : atpList.map((atp) => (
                <div key={atp.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {atp.fase}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                        Mapel: {atp.mataPelajaran}
                      </h4>
                      <div className="text-xs text-slate-500">Elemen: {atp.elemenCP}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingCard({
                          title: `ATP ${atp.mataPelajaran}`,
                          type: 'ATP',
                          data: {
                            'Mata Pelajaran': atp.mataPelajaran,
                            'Fase & Jenjang': atp.fase || atp.faseKelas || 'Fase D',
                            'Elemen CP': atp.elemenCP || atp.ruangLingkupMateri || '-',
                            'Capaian Pembelajaran (CP)': atp.capaianPembelajaran || atp.ruangLingkupMateri || '-',
                            'Tujuan Pembelajaran (TP)': atp.tujuanPembelajaran,
                            'Alokasi Waktu': atp.alokasiWaktu || '4 JP',
                            'Integrasi Panca Cinta (KBC)': atp.pilarKBC || 'Cinta Allah & Ilmu'
                          }
                        })}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-slate-700"
                        title="Lihat & Download Kartu ATP"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canEdit('perencanaan-kurikulum') && (
                        <>
                          <button
                            onClick={() => {
                              setEditingAtp(atp);
                              setAtpForm({
                                fase: atp.fase || atp.faseKelas || 'Fase D (Kelas VII)',
                                mataPelajaran: atp.mataPelajaran,
                                elemenCP: atp.elemenCP || atp.ruangLingkupMateri || '',
                                capaianPembelajaran: atp.capaianPembelajaran || atp.ruangLingkupMateri || '',
                                tujuanPembelajaran: atp.tujuanPembelajaran,
                                alokasiWaktu: atp.alokasiWaktu || '4 JP',
                                pilarKBC: atp.pilarKBC || ''
                              });
                              setShowAtpModal(true);
                            }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700"
                            title="Edit ATP"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ATP mapel ${atp.mataPelajaran}?`)) {
                                deleteATP(atp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-slate-700"
                            title="Hapus ATP"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Tujuan Pembelajaran (TP): </span>
                      <p className="text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">{atp.tujuanPembelajaran}</p>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Alokasi Waktu:</span> {atp.alokasiWaktu}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl border border-rose-200 dark:border-rose-900/40">
                    <Heart className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span className="font-medium truncate">Pilar KBC: {atp.pilarKBC || 'Panca Cinta Nurul Jadid'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH / EDIT PROTA
      ======================================================== */}
      {showProtaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingProta ? 'Edit Program Tahunan' : 'Tambah Program Tahunan'}
              </h3>
              <button onClick={() => setShowProtaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProta} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bulan Pelaksanaan</label>
                  <select
                    value={protaForm.bulan}
                    onChange={e => setProtaForm({ ...protaForm, bulan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Minggu Ke (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1 & 2"
                    value={protaForm.mingguKe}
                    onChange={e => setProtaForm({ ...protaForm, mingguKe: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Program Kerja *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Asesmen Diagnostik Awal & Pembagian Modul Ajar..."
                  value={protaForm.namaProgram}
                  onChange={e => setProtaForm({ ...protaForm, namaProgram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Program</label>
                  <select
                    value={protaForm.jenisProgram}
                    onChange={e => setProtaForm({ ...protaForm, jenisProgram: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Akademik">Akademik & KBM</option>
                    <option value="Asesmen">Asesmen & Ujian</option>
                    <option value="Karakter">Pembinaan Karakter Santri</option>
                    <option value="Pelatihan">Pelatihan Guru (IHT)</option>
                    <option value="Rapat">Rapat Evaluasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Keterangan</label>
                  <select
                    value={protaForm.keterangan}
                    onChange={e => setProtaForm({ ...protaForm, keterangan: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="rencana">Rencana</option>
                    <option value="berjalan">Sedang Berjalan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Najibul Hoer, S.Si, M.Pd"
                  value={protaForm.penanggungJawab}
                  onChange={e => setProtaForm({ ...protaForm, penanggungJawab: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProtaModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Prota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH / EDIT PROMES
      ======================================================== */}
      {showPromesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingPromes ? 'Edit Program Semester' : 'Tambah Program Semester'}
              </h3>
              <button onClick={() => setShowPromesModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromes} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={promesForm.semester}
                    onChange={e => setPromesForm({ ...promesForm, semester: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bulan</label>
                  <select
                    value={promesForm.bulan}
                    onChange={e => setPromesForm({ ...promesForm, bulan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Minggu Ke</label>
                  <select
                    value={promesForm.mingguKe}
                    onChange={e => setPromesForm({ ...promesForm, mingguKe: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    {['1', '2', '3', '4', '5'].map(m => (
                      <option key={m} value={m}>Minggu {m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Kegiatan Promes *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KBM Modul 1 & Pengenalan Asmaul Husna..."
                  value={promesForm.namaProgram}
                  onChange={e => setPromesForm({ ...promesForm, namaProgram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Output Capaian</label>
                <input
                  type="text"
                  placeholder="Contoh: Buku pegangan santri terdistribusi 100%"
                  value={promesForm.targetOutput}
                  onChange={e => setPromesForm({ ...promesForm, targetOutput: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPromesModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Promes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: IMPORT PROGRAM SEMESTER
      ======================================================== */}
      {showPromesImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                Import Program Semester (PROMES)
              </h3>
              <button onClick={() => setShowPromesImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              <div className="font-bold">Format Kolom Promes:</div>
              <p>Semester (Ganjil/Genap) • Bulan • MingguKe • Nama Program • Target Output</p>
            </div>

            <form onSubmit={handleImportPromesSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tempelkan Baris Data:
                </label>
                <textarea
                  required
                  rows={6}
                  value={promesImportText}
                  onChange={e => setPromesImportText(e.target.value)}
                  placeholder={`Contoh:\nGanjil\tJuli\t1\tSosialisasi KBC Panca Cinta\tPemahaman guru 100%\nGanjil\tAgustus\t2\tPelatihan Media Digital\t1 Modul Ajar Digital`}
                  className="w-full px-3 py-2 font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPromesImportModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Impor & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH / EDIT ALUR TUJUAN PEMBELAJARAN (ATP)
      ======================================================== */}
      {showAtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                {editingAtp ? 'Edit Alur Tujuan Pembelajaran' : 'Tambah Alur Tujuan Pembelajaran'}
              </h3>
              <button onClick={() => setShowAtpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveATP} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: IPA, Fikih, Nahwu..."
                    value={atpForm.mataPelajaran}
                    onChange={e => setAtpForm({ ...atpForm, mataPelajaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fase / Kelas</label>
                  <input
                    type="text"
                    value={atpForm.fase}
                    onChange={e => setAtpForm({ ...atpForm, fase: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Elemen CP *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemahaman Sains, Fikih Ibadah..."
                  value={atpForm.elemenCP}
                  onChange={e => setAtpForm({ ...atpForm, elemenCP: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tujuan Pembelajaran (TP) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan tujuan pembelajaran dengan kata kerja operasional (C1 - C6) terintegrasi Panca Cinta..."
                  value={atpForm.tujuanPembelajaran}
                  onChange={e => setAtpForm({ ...atpForm, tujuanPembelajaran: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alokasi Waktu</label>
                  <input
                    type="text"
                    placeholder="Contoh: 8 JP (4 Pertemuan)"
                    value={atpForm.alokasiWaktu}
                    onChange={e => setAtpForm({ ...atpForm, alokasiWaktu: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilar KBC (Integrasi)</label>
                  <input
                    type="text"
                    placeholder="Cinta Allah, Cinta Ilmu..."
                    value={atpForm.pilarKBC}
                    onChange={e => setAtpForm({ ...atpForm, pilarKBC: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAtpModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan ATP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KARTU PROGRAM & INFORMASI (BISA DI-DOWNLOAD PDF)
      ======================================================== */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Kartu Informasi Kurikulum Resmi
              </h3>
              <button onClick={() => setViewingCard(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Card representation */}
            <div className="rounded-2xl border border-emerald-600/50 bg-slate-50 dark:bg-slate-800/80 p-5 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  MTs. NURUL JADID • {viewingCard.type}
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Dokumen Tervalidasi
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                {viewingCard.title}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {Object.entries(viewingCard.data).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">{k}:</span>
                    <span className="font-medium text-right text-slate-800 dark:text-slate-100 max-w-[65%]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center">
                Waka Kurikulum: Najibul Hoer, S.Si, M.Pd • Kepala: K. Miftahul Arifin, M.Pd
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewingCard(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => exportInfoCardPDF(viewingCard.title, viewingCard.data)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
