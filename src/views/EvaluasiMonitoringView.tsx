import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EvaluasiItem } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportInfoCardPDF 
} from '../utils/exportUtils';
import { PendingModuleCard } from '../components/PendingModuleCard';
import { 
  ClipboardCheck, 
  FileCheck, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  Users, 
  TrendingUp,
  Search
} from 'lucide-react';

export const EvaluasiMonitoringView: React.FC = () => {
  const { 
    evaluasiList, 
    addEvaluasi, 
    updateEvaluasi, 
    deleteEvaluasi, 
    canEdit, 
    canExport 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tengah' | 'akhir' | 'rapat' | 'mutu'>('tengah');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEval, setEditingEval] = useState<EvaluasiItem | null>(null);
  const [evalForm, setEvalForm] = useState<{
    tipe: 'Tengah Semester' | 'Akhir Semester';
    semester: 'Ganjil' | 'Genap';
    mataPelajaran: string;
    kelas: string;
    dayaSerap: number;
    kendala: string;
    tindakLanjut: string;
    guruPengampu: string;
  }>({
    tipe: 'Tengah Semester',
    semester: 'Ganjil',
    mataPelajaran: 'IPA',
    kelas: 'VII',
    dayaSerap: 88,
    kendala: 'Santri perlu penguatan pada konsep pembelahan sel mikroskopis',
    tindakLanjut: 'Praktikum ulang di Laboratorium IPA dan tutor sebaya santri tahfidz',
    guruPengampu: 'Najibul Hoer, S.Si, M.Pd'
  });

  // Card view state
  const [viewingCard, setViewingCard] = useState<EvaluasiItem | null>(null);

  // Active items by tab
  const targetTipe = activeTab === 'tengah' ? 'Tengah Semester' : 'Akhir Semester';
  const displayedItems = evaluasiList.filter(e => e.tipe === targetTipe);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalForm.mataPelajaran.trim()) return;

    if (editingEval) {
      await updateEvaluasi({
        ...editingEval,
        ...evalForm
      });
    } else {
      await addEvaluasi({
        ...evalForm,
        tanggalEvaluasi: new Date().toLocaleDateString('id-ID')
      });
    }

    setShowModal(false);
    setEditingEval(null);
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: `LAPORAN EVALUASI ${targetTipe.toUpperCase()}`,
      subtitle: `MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027`,
      headers: ['No', 'Mapel', 'Kelas', 'Semester', 'Daya Serap', 'Kendala Ditemukan', 'Rencana Tindak Lanjut', 'Guru'],
      rows: displayedItems.map((item, idx) => [
        idx + 1,
        item.mataPelajaran || '-',
        item.kelas || '-',
        item.semester || 'Ganjil',
        `${item.dayaSerap || 0}%`,
        item.kendala || '-',
        item.tindakLanjut || '-',
        item.guruPengampu || '-'
      ]),
      fileName: `Evaluasi_${targetTipe.replace(/\s+/g, '_')}_MTsNJ`,
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const data = displayedItems.map((item, idx) => ({
      No: idx + 1,
      'Tipe Evaluasi': item.tipe,
      'Mata Pelajaran': item.mataPelajaran,
      Kelas: item.kelas,
      Semester: item.semester,
      'Daya Serap (%)': item.dayaSerap,
      'Kendala Pembelajaran': item.kendala,
      'Rencana Tindak Lanjut': item.tindakLanjut,
      'Guru Pengampu': item.guruPengampu,
      'Tanggal Evaluasi': item.tanggalEvaluasi || ''
    }));
    exportTableToExcel(data, `Evaluasi_${targetTipe.replace(/\s+/g, '_')}_MTsNJ`, 'Evaluasi');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'tengah', label: '1. Evaluasi Tengah Semester', icon: ClipboardCheck },
          { key: 'akhir', label: '2. Evaluasi Akhir Semester', icon: FileCheck },
          { key: 'rapat', label: '3. Rapat Evaluasi Akademik (Pending)', icon: Users },
          { key: 'mutu', label: '4. Laporan Peningkatan Mutu (Pending)', icon: TrendingUp },
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

      {/* SUB-MENU 1 & 2: EVALUASI TENGAH / AKHIR SEMESTER */}
      {(activeTab === 'tengah' || activeTab === 'akhir') && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Evaluasi & Monitoring
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Evaluasi {targetTipe} Pembelajaran
                </h3>
                <p className="text-xs text-slate-500">
                  Analisis ketuntasan daya serap materi santri, kendala pembelajaran, dan rencana tindak lanjut
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('evaluasi-monitoring') && (
                  <button
                    onClick={() => {
                      setEditingEval(null);
                      setEvalForm({
                        tipe: targetTipe,
                        semester: 'Ganjil',
                        mataPelajaran: 'IPA',
                        kelas: 'VII',
                        dayaSerap: 85,
                        kendala: '',
                        tindakLanjut: '',
                        guruPengampu: 'Najibul Hoer, S.Si, M.Pd'
                      });
                      setShowModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Evaluasi {targetTipe}
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
                    <th className="px-3.5 py-3">Mata Pelajaran</th>
                    <th className="px-3.5 py-3 text-center">Kelas</th>
                    <th className="px-3.5 py-3 text-center">Semester</th>
                    <th className="px-3.5 py-3 text-center font-bold text-emerald-700 dark:text-emerald-400">Daya Serap</th>
                    <th className="px-3.5 py-3">Kendala Lapangan</th>
                    <th className="px-3.5 py-3">Rencana Tindak Lanjut</th>
                    <th className="px-3.5 py-3">Guru Pengampu</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{item.mataPelajaran}</td>
                      <td className="px-3.5 py-3 text-center font-semibold">Kelas {item.kelas}</td>
                      <td className="px-3.5 py-3 text-center">{item.semester}</td>
                      <td className="px-3.5 py-3 text-center font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                        {item.dayaSerap}%
                      </td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 max-w-xs">{item.kendala}</td>
                      <td className="px-3.5 py-3 text-slate-800 dark:text-slate-200 max-w-xs font-medium">{item.tindakLanjut}</td>
                      <td className="px-3.5 py-3 text-slate-500">{item.guruPengampu}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingCard(item)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                            title="Lihat & Download Kartu Evaluasi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('evaluasi-monitoring') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingEval(item);
                                  setEvalForm({
                                    tipe: item.tipe || 'STS',
                                    semester: item.semester || 'Ganjil',
                                    mataPelajaran: item.mataPelajaran || '',
                                    kelas: item.kelas || 'VII',
                                    dayaSerap: Number(item.dayaSerap) || 85,
                                    kendala: item.kendala || '',
                                    tindakLanjut: item.tindakLanjut || '',
                                    guruPengampu: item.guruPengampu || ''
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                title="Edit Evaluasi"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus evaluasi ${item.mataPelajaran}?`)) {
                                    deleteEvaluasi(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                                title="Hapus Evaluasi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedItems.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                        Belum ada rekaman evaluasi {targetTipe}. Klik tombol Tambah untuk membuat baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MENU 3: RAPAT EVALUASI AKADEMIK (PENDING) */}
      {activeTab === 'rapat' && (
        <PendingModuleCard
          title="Notulensi & Hasil Rapat Evaluasi Akademik Bulanan"
          category="Evaluasi & Monitoring #3"
          description="Dokumentasi persidangan dewan guru, presensi rapat berkala, catatan khusus wali kelas, serta arahan strategis Kepala Madrasah dan Pengasuh Pondok Pesantren Nurul Jadid."
          expectedDate="Pekan Terakhir Setiap Bulan Berjalan"
          regulasiRef="Biro Kurikulum & Tata Usaha Madrasah"
          draftFields={[
            "Agenda Rapat: Evaluasi KBM & Kedisiplinan",
            "Daftar Hadir Dewan Guru & Pimpinan",
            "Catatan Perkembangan Karakter Santri",
            "Notulensi Hasil Keputusan Rapat",
            "Dokumentasi Foto Rapat Pleno"
          ]}
        />
      )}

      {/* SUB-MENU 4: LAPORAN PENINGKATAN MUTU (PENDING) */}
      {activeTab === 'mutu' && (
        <PendingModuleCard
          title="Laporan Capaian Peningkatan Mutu Madrasah (RDM & SPMI)"
          category="Evaluasi & Monitoring #4"
          description="Sintesis data agregat nilai rapor digital (RDM), rata-rata indeks kompetensi santri, evaluasi pencapaian 8 Standar Nasional Pendidikan (SNP), dan program akselerasi mutu unggulan."
          expectedDate="Setiap Akhir Semester Ajaran"
          regulasiRef="Badan Akreditasi Nasional & Penjaminan Mutu Internal"
          draftFields={[
            "Tren Peningkatan Nilai Santri per Mapel",
            "Capaian Program Unggulan: Agama & Tahfidz",
            "Indeks Kepuasan Wali Santri",
            "Rencana Anggaran & Sarana Perbaikan Mutu",
            "Pengesahan Komite & Kepala Madrasah"
          ]}
        />
      )}

      {/* MODAL: TAMBAH / EDIT EVALUASI */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingEval ? 'Edit Evaluasi Pembelajaran' : `Tambah Evaluasi ${targetTipe}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    value={evalForm.mataPelajaran}
                    onChange={e => setEvalForm({ ...evalForm, mataPelajaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <select
                    value={evalForm.kelas}
                    onChange={e => setEvalForm({ ...evalForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="VII">Kelas VII</option>
                    <option value="VIII">Kelas VIII</option>
                    <option value="IX">Kelas IX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={evalForm.semester}
                    onChange={e => setEvalForm({ ...evalForm, semester: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Persentase Daya Serap (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={evalForm.dayaSerap}
                    onChange={e => setEvalForm({ ...evalForm, dayaSerap: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kendala yang Ditemukan</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Deskripsikan hambatan belajar siswa..."
                  value={evalForm.kendala}
                  onChange={e => setEvalForm({ ...evalForm, kendala: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rencana Tindak Lanjut (Solusi)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Langkah perbaikan, remedial, atau pengayaan..."
                  value={evalForm.tindakLanjut}
                  onChange={e => setEvalForm({ ...evalForm, tindakLanjut: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guru Pengampu</label>
                <input
                  type="text"
                  required
                  value={evalForm.guruPengampu}
                  onChange={e => setEvalForm({ ...evalForm, guruPengampu: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KARTU EVALUASI (BISA DI-DOWNLOAD PDF) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Kartu Evaluasi {viewingCard.tipe}
              </h3>
              <button onClick={() => setViewingCard(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-600/40 space-y-3">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Evaluasi: {viewingCard.mataPelajaran} • Kelas {viewingCard.kelas} ({viewingCard.semester})
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {viewingCard.dayaSerap}% <span className="text-xs font-semibold text-slate-400">Daya Serap Santri</span>
              </div>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <div><span className="font-bold">Kendala:</span> {viewingCard.kendala}</div>
                <div><span className="font-bold">Tindak Lanjut:</span> {viewingCard.tindakLanjut}</div>
                <div className="text-[11px] text-slate-400 mt-2">Pendidik: {viewingCard.guruPengampu}</div>
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
                onClick={() => exportInfoCardPDF(`Evaluasi ${viewingCard.mataPelajaran || 'Mapel'} Kelas ${viewingCard.kelas || 'Madrasah'}`, {
                  'Mata Pelajaran': viewingCard.mataPelajaran || '-',
                  'Tingkat Kelas': `Kelas ${viewingCard.kelas || '-'}`,
                  'Semester': viewingCard.semester || 'Ganjil',
                  'Tingkat Ketuntasan / Daya Serap': `${viewingCard.dayaSerap || 0}%`,
                  'Kendala Pembelajaran': viewingCard.kendala || '-',
                  'Rencana Tindak Lanjut': viewingCard.tindakLanjut || '-',
                  'Guru Pengampu': viewingCard.guruPengampu || '-',
                  'Tanggal Rekam': viewingCard.tanggalEvaluasi || new Date().toLocaleDateString('id-ID')
                })}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu Evaluasi (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
