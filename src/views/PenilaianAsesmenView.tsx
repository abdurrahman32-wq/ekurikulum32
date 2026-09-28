import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KisiKisiItem, BankSoalItem } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportInfoCardPDF 
} from '../utils/exportUtils';
import { PendingModuleCard } from '../components/PendingModuleCard';
import { 
  GraduationCap, 
  FileSpreadsheet, 
  FileText, 
  Plus, 
  Upload, 
  Download, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  Search,
  Filter,
  BarChart3,
  Stethoscope
} from 'lucide-react';

export const PenilaianAsesmenView: React.FC = () => {
  const { 
    kisiKisiList, 
    addKisiKisi, 
    updateKisiKisi, 
    deleteKisiKisi,
    bankSoalList, 
    addBankSoal, 
    updateBankSoal, 
    deleteBankSoal,
    canEdit, 
    canExport 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kisi' | 'bank' | 'analisis' | 'diagnostik'>('kisi');

  // Kisi-Kisi Modal & State
  const [showKisiModal, setShowKisiModal] = useState(false);
  const [editingKisi, setEditingKisi] = useState<KisiKisiItem | null>(null);
  const [kisiForm, setKisiForm] = useState({
    mapel: 'IPA',
    kelas: 'VII',
    semester: 'Ganjil',
    bentukSoal: 'Pilihan Ganda & Uraian',
    jumlahSoal: 40,
    penyusun: 'Najibul Hoer, S.Si, M.Pd'
  });

  // Bank Soal Modal & State
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankSoalItem | null>(null);
  const [bankForm, setBankForm] = useState({
    judul: 'Naskah Asesmen Sumatif Tengah Semester (STS) IPA Fase D',
    mapel: 'IPA',
    kelas: 'VII',
    tipeUjian: 'STS',
    fileUrl: 'https://drive.google.com/drive/folders/demo_soal_mtsnj',
    pengunggah: 'Najibul Hoer, S.Si, M.Pd'
  });

  // Card View State
  const [viewingCard, setViewingCard] = useState<{
    title: string;
    type: string;
    data: Record<string, string | number>;
  } | null>(null);

  // Save Kisi-kisi
  const handleSaveKisi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kisiForm.mapel.trim()) return;

    if (editingKisi) {
      await updateKisiKisi({ ...editingKisi, ...kisiForm });
    } else {
      await addKisiKisi(kisiForm);
    }
    setShowKisiModal(false);
    setEditingKisi(null);
  };

  // Save Bank Soal
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.judul.trim()) return;

    if (editingBank) {
      await updateBankSoal({ ...editingBank, ...bankForm });
    } else {
      await addBankSoal({
        ...bankForm,
        tanggalUpload: new Date().toLocaleDateString('id-ID')
      });
    }
    setShowBankModal(false);
    setEditingBank(null);
  };

  // Export handlers
  const handleExportKisiPDF = () => {
    exportTableToPDF({
      title: 'KISI-KISI ASESMEN SUMATIF & FORMATIF MADRASAH',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Mata Pelajaran', 'Kelas', 'Semester', 'Bentuk Soal', 'Jumlah Soal', 'Penyusun'],
      rows: kisiKisiList.map((k, idx) => [
        idx + 1,
        k.mapel,
        k.kelas,
        k.semester || 'Ganjil',
        k.bentukSoal || 'Pilihan Ganda & Uraian',
        `${k.jumlahSoal} Butir`,
        k.penyusun || '-'
      ]),
      fileName: 'Kisi_Kisi_Asesmen_MTsNJ'
    });
  };

  const handleExportKisiExcel = () => {
    const data = kisiKisiList.map((k, idx) => ({
      No: idx + 1,
      Mapel: k.mapel,
      Kelas: k.kelas,
      Semester: k.semester || 'Ganjil',
      'Bentuk Soal': k.bentukSoal || 'Pilihan Ganda',
      'Jumlah Soal': k.jumlahSoal,
      Penyusun: k.penyusun || '-'
    }));
    exportTableToExcel(data, 'Kisi_Kisi_Asesmen_MTsNJ', 'Kisi-Kisi');
  };

  const handleExportBankPDF = () => {
    exportTableToPDF({
      title: 'BANK SOAL ASESMEN STANDAR MADRASAH',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Judul Naskah Soal', 'Mapel', 'Kelas', 'Tipe Ujian', 'Tanggal Upload', 'Pengunggah'],
      rows: bankSoalList.map((b, idx) => [
        idx + 1,
        b.judul,
        b.mapel,
        b.kelas,
        b.tipeUjian || b.jenisUjian || 'Sumatif',
        b.tanggalUpload || b.tanggalUnggah || '-',
        b.pengunggah || b.pembuat || 'Guru Pengampu'
      ]),
      fileName: 'Bank_Soal_MTsNJ'
    });
  };

  const handleExportBankExcel = () => {
    const data = bankSoalList.map((b, idx) => ({
      No: idx + 1,
      Judul: b.judul,
      Mapel: b.mapel,
      Kelas: b.kelas,
      'Tipe Ujian': b.tipeUjian,
      'Tanggal Upload': b.tanggalUpload,
      Pengunggah: b.pengunggah,
      'Tautan Dokumen': b.fileUrl || ''
    }));
    exportTableToExcel(data, 'Bank_Soal_MTsNJ', 'Bank Soal');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'kisi', label: '1. Kisi-kisi Asesmen', icon: FileSpreadsheet },
          { key: 'bank', label: '2. Bank Soal', icon: FileText },
          { key: 'analisis', label: '3. Analisis Butir Soal (Pending)', icon: BarChart3 },
          { key: 'diagnostik', label: '4. Asesmen Diagnostik (Pending)', icon: Stethoscope },
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

      {/* SUB-MENU 1: KISI-KISI */}
      {activeTab === 'kisi' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Penilaian #1
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Kisi-kisi Asesmen MTs. Nurul Jadid
                </h3>
                <p className="text-xs text-slate-500">
                  Matriks kisi-kisi penyusunan soal sumatif (STS & SAS) dan asesmen formatif pembelajaran
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('penilaian-asesmen') && (
                  <button
                    onClick={() => {
                      setEditingKisi(null);
                      setKisiForm({
                        mapel: 'IPA',
                        kelas: 'VII',
                        semester: 'Ganjil',
                        bentukSoal: 'Pilihan Ganda & Uraian',
                        jumlahSoal: 40,
                        penyusun: 'Najibul Hoer, S.Si, M.Pd'
                      });
                      setShowKisiModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kisi-kisi
                  </button>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportKisiPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportKisiExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Kisi-Kisi Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Mata Pelajaran</th>
                    <th className="px-3.5 py-3 text-center">Kelas</th>
                    <th className="px-3.5 py-3 text-center">Semester</th>
                    <th className="px-3.5 py-3">Bentuk Soal</th>
                    <th className="px-3.5 py-3 text-center">Jumlah Soal</th>
                    <th className="px-3.5 py-3">Guru Penyusun</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {kisiKisiList.map((k, idx) => (
                    <tr key={k.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{k.mapel}</td>
                      <td className="px-3.5 py-3 text-center font-semibold">Kelas {k.kelas}</td>
                      <td className="px-3.5 py-3 text-center">{k.semester}</td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300">{k.bentukSoal}</td>
                      <td className="px-3.5 py-3 text-center font-bold text-emerald-700 dark:text-emerald-400">{k.jumlahSoal} Butir</td>
                      <td className="px-3.5 py-3 text-slate-500">{k.penyusun}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingCard({
                              title: `Kisi-Kisi ${k.mapel} Kelas ${k.kelas}`,
                              type: 'KISI-KISI ASESMEN',
                              data: {
                                'Mata Pelajaran': k.mapel,
                                'Tingkat Kelas': `Kelas ${k.kelas}`,
                                'Semester': k.semester || 'Ganjil',
                                'Bentuk Soal': k.bentukSoal || 'Pilihan Ganda & Uraian',
                                'Jumlah Butir Soal': `${k.jumlahSoal} Butir`,
                                'Penyusun / Guru Pengampu': k.penyusun || '-',
                                'Status Validasi': 'Telah Diverifikasi Waka Kurikulum'
                              }
                            })}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                            title="Lihat & Download Kartu Kisi-Kisi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('penilaian-asesmen') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingKisi(k);
                                  setKisiForm({
                                    mapel: k.mapel,
                                    kelas: k.kelas,
                                    semester: k.semester || 'Ganjil',
                                    bentukSoal: k.bentukSoal || 'Pilihan Ganda',
                                    jumlahSoal: Number(k.jumlahSoal) || 40,
                                    penyusun: k.penyusun || ''
                                  });
                                  setShowKisiModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                title="Edit Kisi-kisi"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus kisi-kisi mapel ${k.mapel}?`)) {
                                    deleteKisiKisi(k.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                                title="Hapus Kisi-kisi"
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

      {/* SUB-MENU 2: BANK SOAL */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Penilaian #2
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Bank Soal Asesmen Terpadu
                </h3>
                <p className="text-xs text-slate-500">
                  Arsip terenkripsi naskah soal asesmen formatif, sumatif tengah semester (STS), dan sumatif akhir semester (SAS)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('penilaian-asesmen') && (
                  <button
                    onClick={() => {
                      setEditingBank(null);
                      setBankForm({
                        judul: '',
                        mapel: 'IPA',
                        kelas: 'VII',
                        tipeUjian: 'STS',
                        fileUrl: '',
                        pengunggah: 'Najibul Hoer, S.Si, M.Pd'
                      });
                      setShowBankModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Bank Soal
                  </button>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportBankPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportBankExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bank Soal List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankSoalList.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {b.tipeUjian} • Kelas {b.kelas}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {b.tanggalUpload || '10 Okt 2026'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2 leading-snug">
                      {b.judul}
                    </h4>
                    <div className="text-xs text-slate-500 mt-1">
                      Mata Pelajaran: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{b.mapel}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Pengunggah: {b.pengunggah || 'Guru Pamong'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => setViewingCard({
                        title: b.judul,
                        type: 'BANK SOAL RESMI',
                        data: {
                          'Judul Berkas': b.judul,
                          'Mata Pelajaran': b.mapel,
                          'Tingkat Kelas': `Kelas ${b.kelas}`,
                          'Tipe Ujian': b.tipeUjian || b.jenisUjian || 'Sumatif',
                          'Tanggal Upload': b.tanggalUpload || b.tanggalUnggah || '-',
                          'Pengunggah': b.pengunggah || b.pembuat || 'Guru Pamong',
                          'Tautan Dokumen': b.fileUrl || 'Tersimpan di Cloud Storage Madrasah'
                        }
                      })}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat & Unduh Kartu
                    </button>

                    {canEdit('penilaian-asesmen') && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingBank(b);
                            setBankForm({
                              judul: b.judul,
                              mapel: b.mapel,
                              kelas: b.kelas,
                              tipeUjian: b.tipeUjian || b.jenisUjian || 'STS Gasal',
                              fileUrl: b.fileUrl || '',
                              pengunggah: b.pengunggah || b.pembuat || ''
                            });
                            setShowBankModal(true);
                          }}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus soal "${b.judul}"?`)) {
                              deleteBankSoal(b.id);
                            }
                          }}
                          className="p-1 rounded text-rose-600 hover:bg-rose-100 dark:hover:bg-slate-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 3: ANALISIS SOAL (PENDING) */}
      {activeTab === 'analisis' && (
        <PendingModuleCard
          title="Analisis Kuantitatif & Kualitatif Butir Soal"
          category="Penilaian & Asesmen"
          description="Modul komputasi otomatis tingkat kesukaran soal, daya pembeda butir soal, efektivitas pengecoh (distraktor), dan uji reliabilitas KR-20. Menunggu hasil input jawaban peserta tes setelah STS dan SAS diselenggarakan."
          expectedDate="Pascaujian STS Ganjil (Oktober 2026)"
          regulasiRef="Pedoman Penilaian KMA 1503 Tahun 2025"
          draftFields={[
            "Tingkat Kesukaran (P-Value)",
            "Daya Pembeda (D-Index)",
            "Efektivitas Pengecoh Opsi A, B, C, D",
            "Uji Validitas & Reliabilitas",
            "Rekomendasi Revisi Butir Soal"
          ]}
        />
      )}

      {/* SUB-MENU 4: ASESMEN DIAGNOSTIK (PENDING) */}
      {activeTab === 'diagnostik' && (
        <PendingModuleCard
          title="Asesmen Diagnostik Kognitif & Non-Kognitif Santri"
          category="Penilaian Awal Pembelajaran"
          description="Instrumen pemetaan gaya belajar (visual, auditori, kinestetik), kesiapan baca kitab kuning, dan tahsin Al-Qur'an bagi santri baru Kelas VII. Digunakan sebagai dasar diferensiasi proses belajar dalam Kurikulum Berbasis Cinta (KBC)."
          expectedDate="Awal Masa Matsama / Orientasi Santri Baru"
          regulasiRef="Panduan Pembelajaran Terdiferensiasi KBC Nurul Jadid"
          draftFields={[
            "Pemetaan Minat & Bakat Santri",
            "Tes Kesiapan Baca Kitab (Nahwu Dasar)",
            "Uji Tahsin & Hafalan Al-Qur'an Awal",
            "Identifikasi Hambatan Emosional & Adaptasi Pondok",
            "Profil Gaya Belajar Santri Per Rombel"
          ]}
        />
      )}

      {/* MODAL: TAMBAH / EDIT KISI-KISI */}
      {showKisiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingKisi ? 'Edit Kisi-kisi' : 'Tambah Kisi-kisi Asesmen'}
              </h3>
              <button onClick={() => setShowKisiModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKisi} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: IPA, Nahwu, Matematika..."
                  value={kisiForm.mapel}
                  onChange={e => setKisiForm({ ...kisiForm, mapel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <select
                    value={kisiForm.kelas}
                    onChange={e => setKisiForm({ ...kisiForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={kisiForm.semester}
                    onChange={e => setKisiForm({ ...kisiForm, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bentuk Soal</label>
                  <input
                    type="text"
                    value={kisiForm.bentukSoal}
                    onChange={e => setKisiForm({ ...kisiForm, bentukSoal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Butir Soal</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={kisiForm.jumlahSoal}
                    onChange={e => setKisiForm({ ...kisiForm, jumlahSoal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guru Penyusun</label>
                <input
                  type="text"
                  value={kisiForm.penyusun}
                  onChange={e => setKisiForm({ ...kisiForm, penyusun: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowKisiModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Kisi-Kisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD BANK SOAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                {editingBank ? 'Edit Bank Soal' : 'Upload Naskah Bank Soal'}
              </h3>
              <button onClick={() => setShowBankModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Naskah Soal *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Naskah Soal STS Semester Ganjil Mapel Nahwu..."
                  value={bankForm.judul}
                  onChange={e => setBankForm({ ...bankForm, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mapel</label>
                  <input
                    type="text"
                    required
                    value={bankForm.mapel}
                    onChange={e => setBankForm({ ...bankForm, mapel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <select
                    value={bankForm.kelas}
                    onChange={e => setBankForm({ ...bankForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipe</label>
                  <select
                    value={bankForm.tipeUjian}
                    onChange={e => setBankForm({ ...bankForm, tipeUjian: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="STS">STS</option>
                    <option value="SAS">SAS</option>
                    <option value="Formatif">Formatif</option>
                    <option value="TryOut">Try Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tautan / Link File Drive Soal</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={bankForm.fileUrl}
                  onChange={e => setBankForm({ ...bankForm, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guru Pengunggah</label>
                <input
                  type="text"
                  value={bankForm.pengunggah}
                  onChange={e => setBankForm({ ...bankForm, pengunggah: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KARTU LIHAT & DOWNLOAD (PDF) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                {viewingCard.type}
              </h3>
              <button onClick={() => setViewingCard(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-600/40 space-y-3">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {viewingCard.title}
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {Object.entries(viewingCard.data).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/60">
                    <span className="font-semibold text-slate-500">{k}:</span>
                    <span className="font-medium text-right text-slate-900 dark:text-white max-w-[65%]">{v}</span>
                  </div>
                ))}
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
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
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
