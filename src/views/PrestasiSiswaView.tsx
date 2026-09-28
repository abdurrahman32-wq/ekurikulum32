import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PrestasiItem, DokumentasiItem, TingkatKejuaraan } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportPrestasiCardPDF 
} from '../utils/exportUtils';
import { 
  Trophy, 
  Award, 
  FolderArchive, 
  Image as ImageIcon, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Upload,
  Calendar,
  Medal,
  CheckCircle2
} from 'lucide-react';

export const PrestasiSiswaView: React.FC = () => {
  const { 
    prestasiList, 
    addPrestasi, 
    updatePrestasi, 
    deletePrestasi,
    dokumentasiList, 
    addDokumentasi, 
    deleteDokumentasi,
    canEdit, 
    canExport, 
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'akademik' | 'nonakademik' | 'sertifikat' | 'dokumentasi'>('akademik');

  // Prestasi Form State
  const [showPrestasiModal, setShowPrestasiModal] = useState(false);
  const [editingPrestasi, setEditingPrestasi] = useState<PrestasiItem | null>(null);
  const [prestasiForm, setPrestasiForm] = useState<{
    jenis: 'Akademik' | 'Non-Akademik';
    namaLomba: string;
    tingkat: TingkatKejuaraan;
    keteranganJuara: string;
    namaSiswa: string;
    kelas: string;
    cabang: string;
    pembina: string;
    tahun: string;
  }>({
    jenis: 'Akademik',
    namaLomba: '',
    tingkat: 'Kabupaten',
    keteranganJuara: '1',
    namaSiswa: '',
    kelas: 'VIII',
    cabang: 'KSM IPA Terintegrasi',
    pembina: 'Najibul Hoer, S.Si, M.Pd',
    tahun: '2026'
  });

  // Dokumentasi Modal
  const [showDokModal, setShowDokModal] = useState(false);
  const [dokForm, setDokForm] = useState({
    judul: '',
    keterangan: '',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    tanggal: new Date().toLocaleDateString('id-ID')
  });

  // Certificate Carousel state
  const [activeCertIndex, setActiveCertIndex] = useState(0);

  // Active items by tab
  const isAkademikTab = activeTab === 'akademik';
  const displayedPrestasi = prestasiList.filter(p => isAkademikTab ? p.jenis === 'Akademik' : p.jenis === 'Non-Akademik');

  // Save Prestasi
  const handleSavePrestasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestasiForm.namaLomba.trim() || !prestasiForm.namaSiswa.trim()) return;

    if (editingPrestasi) {
      await updatePrestasi({ ...editingPrestasi, ...prestasiForm });
    } else {
      await addPrestasi(prestasiForm);
    }
    setShowPrestasiModal(false);
    setEditingPrestasi(null);
  };

  // Save Dokumentasi
  const handleSaveDok = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dokForm.judul.trim()) return;

    await addDokumentasi({
      judul: dokForm.judul,
      keterangan: dokForm.keterangan,
      gambarUrl: dokForm.imageUrl,
      imageUrl: dokForm.imageUrl,
      tanggal: dokForm.tanggal
    });
    setShowDokModal(false);
    setDokForm({
      judul: '',
      keterangan: '',
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      tanggal: new Date().toLocaleDateString('id-ID')
    });
  };

  // Export Table PDF
  const handleExportPDF = () => {
    const titleType = isAkademikTab ? 'AKADEMIK' : 'NON-AKADEMIK';
    exportTableToPDF({
      title: `REKAPITULASI PRESTASI SANTRI ${titleType}`,
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Nama Lomba / Event', 'Tingkat', 'Peringkat Juara', 'Nama Santri Berprestasi', 'Kelas', 'Cabang', 'Pembina'],
      rows: displayedPrestasi.map((p, idx) => [
        idx + 1,
        p.namaLomba,
        p.tingkat,
        `Juara ${p.keteranganJuara}`,
        p.namaSiswa,
        `Kelas ${p.kelas || '-'}`,
        p.cabang || '-',
        p.pembina || '-'
      ]),
      fileName: `Prestasi_${titleType}_MTsNJ`,
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const titleType = isAkademikTab ? 'AKADEMIK' : 'NON-AKADEMIK';
    const data = displayedPrestasi.map((p, idx) => ({
      No: idx + 1,
      'Nama Lomba': p.namaLomba,
      Tingkat: p.tingkat,
      Juara: p.keteranganJuara,
      'Nama Santri': p.namaSiswa,
      Kelas: p.kelas || '',
      Cabang: p.cabang || '',
      Pembina: p.pembina || '',
      Tahun: p.tahun
    }));
    exportTableToExcel(data, `Prestasi_${titleType}_MTsNJ`, 'Prestasi');
  };

  // Can this role edit Prestasi? WAKASIS, ADMIN, WAKAKUR, GURU
  const userCanEdit = canEdit('prestasi-siswa');

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'akademik', label: '1. Data Lomba Akademik', icon: Trophy },
          { key: 'nonakademik', label: '2. Data Lomba Non-Akademik', icon: Medal },
          { key: 'sertifikat', label: '3. Sertifikat (Drive & Slide)', icon: FolderArchive },
          { key: 'dokumentasi', label: '4. Galeri Dokumentasi Kegiatan', icon: ImageIcon },
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

      {/* SUB-MENU 1 & 2: DATA LOMBA AKADEMIK / NON-AKADEMIK */}
      {(activeTab === 'akademik' || activeTab === 'nonakademik') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Prestasi Santri MTs. Nurul Jadid
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Data Prestasi Lomba {isAkademikTab ? 'Akademik (KSM, MQK, Olimpiade)' : 'Non-Akademik (Porseni, Silat, Hadrah)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Daftar torehan juara santri membanggakan almamater pesantren di tingkat lokal hingga nasional
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {userCanEdit && (
                  <button
                    onClick={() => {
                      setEditingPrestasi(null);
                      setPrestasiForm({
                        jenis: isAkademikTab ? 'Akademik' : 'Non-Akademik',
                        namaLomba: '',
                        tingkat: 'Kabupaten',
                        keteranganJuara: '1',
                        namaSiswa: '',
                        kelas: 'VIII',
                        cabang: isAkademikTab ? 'KSM Sains' : 'Pencak Silat',
                        pembina: 'Muh. Utsman, S.Pd',
                        tahun: '2026'
                      });
                      setShowPrestasiModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Prestasi {isAkademikTab ? 'Akademik' : 'Non-Akademik'}
                  </button>
                )}

                {canExport() && (
                  <>
                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      PDF
                    </button>
                    <button
                      onClick={handleExportExcel}
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Nama Ajang Lomba</th>
                    <th className="px-3.5 py-3">Tingkat</th>
                    <th className="px-3.5 py-3 text-center font-bold text-amber-600">Peringkat</th>
                    <th className="px-3.5 py-3">Santri Berprestasi</th>
                    <th className="px-3.5 py-3 text-center">Kelas</th>
                    <th className="px-3.5 py-3">Cabang / Bidang</th>
                    <th className="px-3.5 py-3">Guru Pembina</th>
                    <th className="px-3.5 py-3 text-center">Aksi / Piagam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedPrestasi.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{p.namaLomba}</td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {p.tingkat}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shadow-xs">
                          Juara {p.keteranganJuara}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{p.namaSiswa}</td>
                      <td className="px-3.5 py-3 text-center font-semibold">Kelas {p.kelas || '-'}</td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300">{p.cabang || '-'}</td>
                      <td className="px-3.5 py-3 text-slate-500">{p.pembina || '-'}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Download Piagam Penghargaan PDF Resmi */}
                          <button
                            onClick={() => exportPrestasiCardPDF({
                              namaLomba: p.namaLomba,
                              tingkat: p.tingkat,
                              keteranganJuara: p.keteranganJuara,
                              namaSiswa: p.namaSiswa,
                              tahun: p.tahun,
                              cabang: p.cabang
                            })}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1 transition"
                            title="Unduh Piagam Penghargaan PDF"
                          >
                            <Download className="w-3 h-3" />
                            Piagam PDF
                          </button>

                          {userCanEdit && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingPrestasi(p);
                                  setPrestasiForm({
                                    jenis: p.jenis,
                                    namaLomba: p.namaLomba,
                                    tingkat: p.tingkat,
                                    keteranganJuara: p.keteranganJuara,
                                    namaSiswa: p.namaSiswa,
                                    kelas: p.kelas || 'VIII',
                                    cabang: p.cabang || '',
                                    pembina: p.pembina || '',
                                    tahun: p.tahun
                                  });
                                  setShowPrestasiModal(true);
                                }}
                                className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-800"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus data prestasi ${p.namaLomba}?`)) {
                                    deletePrestasi(p.id);
                                  }
                                }}
                                className="p-1 rounded text-rose-600 hover:bg-rose-100 dark:hover:bg-slate-800"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

      {/* SUB-MENU 3: SERTIFIKAT (GOOGLE DRIVE & SLIDE CAROUSEL) */}
      {activeTab === 'sertifikat' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                  Pusat Piagam Digital
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Arsip Sertifikat & Piagam Kejuaraan Santri
                </h3>
                <p className="text-xs text-slate-500">
                  Slide interaktif dan tautan repositori Google Drive piagam penghargaan resmi madrasah
                </p>
              </div>

              <a
                href="https://drive.google.com/drive/folders/17l96y2vXJvM9lA8B5j3C1D0E4F5G6H7I"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2 transition"
              >
                <FolderArchive className="w-4 h-4" />
                Buka Google Drive Sertifikat
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Slide Carousel Viewer */}
            <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {prestasiList.length > 0 ? (
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                  {/* Certificate Frame Preview */}
                  <div className="border-4 border-amber-400/80 rounded-2xl p-6 sm:p-8 bg-linear-to-b from-slate-900 to-slate-950 text-center shadow-2xl relative">
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                      YAYASAN NURUL JADID • MTs. NURUL JADID PAITON
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 mt-2">
                      PIAGAM PENGHARGAAN JUARA {prestasiList[activeCertIndex].keteranganJuara}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      TINGKAT {prestasiList[activeCertIndex].tingkat.toUpperCase()}
                    </div>

                    <div className="my-6 border-y border-slate-800 py-4">
                      <div className="text-xs text-slate-400">Diberikan dengan bangga kepada santri:</div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {prestasiList[activeCertIndex].namaSiswa}
                      </div>
                      <div className="text-xs text-emerald-400 mt-1">
                        Kelas {prestasiList[activeCertIndex].kelas || 'VIII'} • Program {prestasiList[activeCertIndex].cabang || 'MTs. Nurul Jadid'}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-200">
                      Atas prestasi memenangkan ajang: <span className="text-amber-300 font-bold">{prestasiList[activeCertIndex].namaLomba}</span>
                    </div>

                    <div className="mt-8 flex justify-between items-end text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                      <div className="text-left">
                        <div>Waka Kesiswaan:</div>
                        <div className="font-bold text-slate-200 mt-3">Muh. Utsman, S.Pd</div>
                      </div>
                      <div className="text-right">
                        <div>Kepala Madrasah:</div>
                        <div className="font-bold text-slate-200 mt-3">K. Miftahul Arifin, M.Pd</div>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveCertIndex(prev => prev > 0 ? prev - 1 : prestasiList.length - 1)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 text-xs font-bold transition"
                    >
                      <ChevronLeft className="w-4 h-4" /> Slide Sebelumnya
                    </button>

                    <div className="text-xs font-bold text-slate-400">
                      Sertifikat {activeCertIndex + 1} dari {prestasiList.length}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportPrestasiCardPDF({
                          namaLomba: prestasiList[activeCertIndex].namaLomba,
                          tingkat: prestasiList[activeCertIndex].tingkat,
                          keteranganJuara: prestasiList[activeCertIndex].keteranganJuara,
                          namaSiswa: prestasiList[activeCertIndex].namaSiswa,
                          tahun: prestasiList[activeCertIndex].tahun,
                          cabang: prestasiList[activeCertIndex].cabang
                        })}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-4 h-4" />
                        Unduh Piagam Ini (PDF)
                      </button>

                      <button
                        onClick={() => setActiveCertIndex(prev => prev < prestasiList.length - 1 ? prev + 1 : 0)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 text-xs font-bold transition"
                      >
                        Slide Berikutnya <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Belum ada data prestasi untuk ditampilkan di slide.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 4: GALERI DOKUMENTASI KEGIATAN */}
      {activeTab === 'dokumentasi' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Dokumentasi & Galeri
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Galeri Foto Prestasi & Kegiatan Santri
                </h3>
                <p className="text-xs text-slate-500">
                  Dokumentasi visual penyerahan medali, pembinaan ekstrakurikuler, dan kegiatan santri berprestasi
                </p>
              </div>

              {userCanEdit && (
                <button
                  onClick={() => setShowDokModal(true)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload Foto Kegiatan
                </button>
              )}
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dokumentasiList.map((dok) => (
                <div key={dok.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/60 shadow-xs group flex flex-col justify-between">
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                    <img
                      src={dok.imageUrl || dok.gambarUrl}
                      alt={dok.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dok.tanggal || 'Agustus 2026'}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 flex-1">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                      {dok.judul}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dok.keterangan}
                    </p>
                  </div>

                  {userCanEdit && (
                    <div className="p-3 bg-white/60 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus foto "${dok.judul}"?`)) {
                            deleteDokumentasi(dok.id);
                          }
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT PRESTASI */}
      {showPrestasiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                {editingPrestasi ? 'Edit Prestasi' : 'Tambah Rekam Prestasi'}
              </h3>
              <button onClick={() => setShowPrestasiModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrestasi} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Ajang Lomba *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KSM Matematika Terintegrasi Tingkat Provinsi..."
                  value={prestasiForm.namaLomba}
                  onChange={e => setPrestasiForm({ ...prestasiForm, namaLomba: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Lomba</label>
                  <select
                    value={prestasiForm.jenis}
                    onChange={e => setPrestasiForm({ ...prestasiForm, jenis: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tingkat Ajang</label>
                  <select
                    value={prestasiForm.tingkat}
                    onChange={e => setPrestasiForm({ ...prestasiForm, tingkat: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Karesidenan">Karesidenan</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Peringkat Juara</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1, 2, 3, Harapan 1..."
                    value={prestasiForm.keteranganJuara}
                    onChange={e => setPrestasiForm({ ...prestasiForm, keteranganJuara: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas Santri</label>
                  <select
                    value={prestasiForm.kelas}
                    onChange={e => setPrestasiForm({ ...prestasiForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Santri Berprestasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap santri..."
                  value={prestasiForm.namaSiswa}
                  onChange={e => setPrestasiForm({ ...prestasiForm, namaSiswa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cabang / Bidang</label>
                  <input
                    type="text"
                    value={prestasiForm.cabang}
                    onChange={e => setPrestasiForm({ ...prestasiForm, cabang: e.target.value })}
                    placeholder="Contoh: Kimia Terpadu / Seni Beladiri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guru Pembina</label>
                  <input
                    type="text"
                    value={prestasiForm.pembina}
                    onChange={e => setPrestasiForm({ ...prestasiForm, pembina: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPrestasiModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD DOKUMENTASI */}
      {showDokModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Upload Foto Dokumentasi Kegiatan
              </h3>
              <button onClick={() => setShowDokModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDok} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Dokumentasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyerahan Piala Juara 1 KSM..."
                  value={dokForm.judul}
                  onChange={e => setDokForm({ ...dokForm, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Keterangan Foto</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deskripsi kegiatan, waktu, dan santri yang terlibat..."
                  value={dokForm.keterangan}
                  onChange={e => setDokForm({ ...dokForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tautan / URL Gambar</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={dokForm.imageUrl}
                  onChange={e => setDokForm({ ...dokForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDokModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Publikasikan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
