import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SKTugasGuruItem } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportInfoCardPDF 
} from '../utils/exportUtils';
import { PendingModuleCard } from '../components/PendingModuleCard';
import { 
  UserCheck, 
  Clock, 
  Calendar, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  CheckCircle2,
  Search,
  FileText
} from 'lucide-react';

export const AdministrasiGuruView: React.FC = () => {
  const { 
    skTugasList, 
    addSKTugas, 
    updateSKTugas, 
    deleteSKTugas, 
    teachers, 
    canEdit, 
    canExport 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sk' | 'jadwal' | 'hadir'>('sk');

  // SK Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSK, setEditingSK] = useState<SKTugasGuruItem | null>(null);
  const [skForm, setSkForm] = useState({
    nomorSk: 'NJ-H/15/019/A.III/07.2026',
    namaGuru: '',
    niup: '',
    jabatan: 'Guru Mata Pelajaran',
    mapelUtama: 'IPA',
    bebanJp: 24,
    rombelBinaan: 'VII-1, VII-2, VII-3'
  });

  // Card view state
  const [viewingCard, setViewingCard] = useState<SKTugasGuruItem | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveSK = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skForm.namaGuru.trim()) return;

    if (editingSK) {
      await updateSKTugas({
        ...editingSK,
        ...skForm
      });
    } else {
      await addSKTugas({
        ...skForm
      });
    }
    setShowModal(false);
    setEditingSK(null);
    setSkForm({
      nomorSk: 'NJ-H/15/019/A.III/07.2026',
      namaGuru: '',
      niup: '',
      jabatan: 'Guru Mata Pelajaran',
      mapelUtama: 'IPA',
      bebanJp: 24,
      rombelBinaan: 'VII-1, VII-2, VII-3'
    });
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'SURAT KEPUTUSAN PEMBAGIAN TUGAS GURU MENGAJAR',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Nomor SK', 'Nama Pendidik', 'NIUP', 'Jabatan / Tugas', 'Mata Pelajaran', 'Beban JP', 'Rombel Binaan'],
      rows: skTugasList.map((s, idx) => [
        idx + 1,
        s.nomorSk || s.nomorSK || 'SK/01/MTsNJ/2026',
        s.namaGuru,
        s.niup || '-',
        s.jabatan || s.jabatanStruktural || 'Guru Mapel',
        s.mapelUtama || s.namaMapel || '-',
        `${s.bebanJp} JP`,
        s.rombelBinaan || '-'
      ]),
      fileName: 'SK_Pembagian_Tugas_Guru_MTsNJ',
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const data = skTugasList.map((s, idx) => ({
      No: idx + 1,
      'Nomor SK': s.nomorSk || s.nomorSK || 'SK/01/MTsNJ/2026',
      'Nama Guru': s.namaGuru,
      NIUP: s.niup || '-',
      Jabatan: s.jabatan || s.jabatanStruktural || 'Guru Mapel',
      'Mapel Utama': s.mapelUtama || s.namaMapel || '-',
      'Beban JP': s.bebanJp,
      'Rombel Binaan': s.rombelBinaan || ''
    }));
    exportTableToExcel(data, 'SK_Pembagian_Tugas_Guru_MTsNJ', 'SK Tugas');
  };

  const filteredSK = skTugasList.filter(s => {
    const nama = s.namaGuru.toLowerCase();
    const mapel = (s.mapelUtama || s.namaMapel || '').toLowerCase();
    const niup = s.niup || '';
    const query = searchQuery.toLowerCase();
    return nama.includes(query) || mapel.includes(query) || niup.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'sk', label: '1. SK Pembagian Tugas Guru', icon: UserCheck },
          { key: 'jadwal', label: '2. Jadwal Pelajaran (Pending)', icon: Calendar },
          { key: 'hadir', label: '3. Daftar Hadir Guru (Pending)', icon: Clock },
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

      {/* SUB-MENU 1: SK PEMBAGIAN TUGAS GURU */}
      {activeTab === 'sk' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Administrasi #1
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  SK Pembagian Tugas Guru MTs. Nurul Jadid
                </h3>
                <p className="text-xs text-slate-500">
                  Keputusan Kepala Madrasah tentang pembagian tugas mengajar dan tugas tambahan tahun pelajaran 2026/2027
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('administrasi-guru') && (
                  <button
                    onClick={() => {
                      setEditingSK(null);
                      setSkForm({
                        nomorSk: 'NJ-H/15/019/A.III/07.2026',
                        namaGuru: '',
                        niup: '',
                        jabatan: 'Guru Mata Pelajaran',
                        mapelUtama: 'IPA',
                        bebanJp: 24,
                        rombelBinaan: 'VII-1, VII-2, VII-3'
                      });
                      setShowModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah SK Pembagian Tugas Guru
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

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari guru, NIUP, atau mata pelajaran SK..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* SK Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Nama Guru</th>
                    <th className="px-3.5 py-3">NIUP</th>
                    <th className="px-3.5 py-3">Jabatan / Tugas</th>
                    <th className="px-3.5 py-3">Mata Pelajaran</th>
                    <th className="px-3.5 py-3 text-center">Beban JP</th>
                    <th className="px-3.5 py-3">Rombel Binaan</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSK.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{s.namaGuru}</td>
                      <td className="px-3.5 py-3 font-mono text-[11px]">{s.niup}</td>
                      <td className="px-3.5 py-3">{s.jabatan}</td>
                      <td className="px-3.5 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{s.mapelUtama}</td>
                      <td className="px-3.5 py-3 text-center font-bold text-slate-900 dark:text-white">{s.bebanJp} JP</td>
                      <td className="px-3.5 py-3 text-slate-500">{s.rombelBinaan || '-'}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingCard(s)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                            title="Lihat & Download Kartu SK"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('administrasi-guru') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingSK(s);
                                  setSkForm({
                                    nomorSk: s.nomorSk || s.nomorSK || '',
                                    namaGuru: s.namaGuru,
                                    niup: s.niup || '',
                                    jabatan: s.jabatan || s.jabatanStruktural || 'Guru Mapel',
                                    mapelUtama: s.mapelUtama || s.namaMapel || '',
                                    bebanJp: Number(s.bebanJp) || 24,
                                    rombelBinaan: s.rombelBinaan || ''
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                title="Edit SK"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus SK untuk guru ${s.namaGuru}?`)) {
                                    deleteSKTugas(s.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                                title="Hapus SK"
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

      {/* SUB-MENU 2: JADWAL PELAJARAN (PENDING) */}
      {activeTab === 'jadwal' && (
        <PendingModuleCard
          title="Jadwal Pelajaran Tatap Muka TP 2026/2027"
          category="Administrasi Guru & KBM"
          description="Modul penjadwalan terpadu untuk 21 Rombongan Belajar (Kelas VII-1 s.d. IX-7) dengan pembagian jam KBM Program Agama, Tahfidz, dan Reguler. Sistem penjadwalan otomatis anti-bentrok sedang dalam tahap sinkronisasi data kesiapan ruang kelas dan laboratorium."
          expectedDate="Menjelang Pekan Pertama Masuk Santri (Agustus 2026)"
          regulasiRef="Biro Pendidikan Yayasan Nurul Jadid & Waka Kurikulum"
          draftFields={[
            "Jadwal Senin s.d. Ahad",
            "Plotting Jam Ke-0 (Tahfidz/Dzikir)",
            "KBM 44 JP Agama, 32 JP Reguler",
            "Jadwal Penggunaan Lab Komputer & IPA",
            "Sistem Ganti Jam & Guru Piket"
          ]}
        />
      )}

      {/* SUB-MENU 3: DAFTAR HADIR GURU (PENDING) */}
      {activeTab === 'hadir' && (
        <PendingModuleCard
          title="Daftar Hadir & Presensi Real-Time Dewan Guru"
          category="Administrasi Kepegawaian & KBM"
          description="Sistem presensi digital finger/geotagging dan monitoring kehadiran kelas harian dewan guru MTs. Nurul Jadid. Modul ini akan terhubung langsung dengan sistem rekap tunjangan kinerja dan monitoring Waka Kurikulum."
          expectedDate="Sinkronisasi Perangkat Biometrik Kampus Pesantren"
          regulasiRef="Standar Operasional Prosedur (SOP) Kedisiplinan Guru MTsNJ"
          draftFields={[
            "Presensi Masuk & Pulang",
            "Jurnal Mengajar Harian di Kelas",
            "Rekapitulasi Kehadiran Bulanan",
            "Pengajuan Izin / Dispensasi Dinas",
            "Tanda Tangan Elektronik Kepala Madrasah"
          ]}
        />
      )}

      {/* MODAL: TAMBAH / EDIT SK TUGAS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingSK ? 'Edit SK Pembagian Tugas' : 'Tambah SK Pembagian Tugas Guru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSK} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Guru dari Data Madrasah</label>
                <select
                  onChange={e => {
                    const found = teachers.find(t => t.nama === e.target.value);
                    if (found) {
                      setSkForm({
                        ...skForm,
                        namaGuru: found.nama,
                        niup: found.niup,
                        mapelUtama: found.mapel,
                        jabatan: found.jabatanStruktural || 'Guru Mata Pelajaran',
                        bebanJp: found.totalJp || 24
                      });
                    } else {
                      setSkForm({ ...skForm, namaGuru: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Pilih Guru atau Ketik Manual --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.nama}>{t.nama} ({t.mapel})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Guru *</label>
                  <input
                    type="text"
                    required
                    value={skForm.namaGuru}
                    onChange={e => setSkForm({ ...skForm, namaGuru: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NIUP *</label>
                  <input
                    type="text"
                    required
                    value={skForm.niup}
                    onChange={e => setSkForm({ ...skForm, niup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran Utama</label>
                  <input
                    type="text"
                    required
                    value={skForm.mapelUtama}
                    onChange={e => setSkForm({ ...skForm, mapelUtama: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Beban JP (Jam/Minggu)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={skForm.bebanJp}
                    onChange={e => setSkForm({ ...skForm, bebanJp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jabatan / Tugas Tambahan</label>
                <input
                  type="text"
                  value={skForm.jabatan}
                  onChange={e => setSkForm({ ...skForm, jabatan: e.target.value })}
                  placeholder="Contoh: Guru Mata Pelajaran / Wali Kelas VII-1 / Kepala Lab"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rombel Binaan</label>
                <input
                  type="text"
                  value={skForm.rombelBinaan}
                  onChange={e => setSkForm({ ...skForm, rombelBinaan: e.target.value })}
                  placeholder="Contoh: VII-1, VII-2, VIII-3"
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
                  Simpan SK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KARTU SK PEMBAGIAN TUGAS (BISA DI-DOWNLOAD PDF) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Kartu SK Tugas Mengajar
              </h3>
              <button onClick={() => setViewingCard(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-600/40 space-y-3">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                {viewingCard.nomorSk}
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {viewingCard.namaGuru}
              </h4>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div>NIUP: <span className="font-mono font-bold text-slate-900 dark:text-white">{viewingCard.niup}</span></div>
                <div>Jabatan: <span className="font-semibold text-slate-900 dark:text-white">{viewingCard.jabatan}</span></div>
                <div>Mapel: <span className="font-bold text-emerald-700 dark:text-emerald-400">{viewingCard.mapelUtama}</span></div>
                <div>Beban Mengajar: <span className="font-bold">{viewingCard.bebanJp} JP / Pekan</span></div>
                <div>Rombel Binaan: <span className="font-medium">{viewingCard.rombelBinaan || '-'}</span></div>
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
                onClick={() => exportInfoCardPDF(`SK Tugas - ${viewingCard.namaGuru}`, {
                  'Nomor SK': viewingCard.nomorSk || viewingCard.nomorSK || '-',
                  'Nama Guru': viewingCard.namaGuru,
                  'NIUP': viewingCard.niup || '-',
                  'Tugas / Jabatan': viewingCard.jabatan || viewingCard.jabatanStruktural || 'Guru Mapel',
                  'Mata Pelajaran': viewingCard.mapelUtama || viewingCard.namaMapel || '-',
                  'Beban Mengajar': `${viewingCard.bebanJp} JP`,
                  'Rombel Binaan': viewingCard.rombelBinaan || '-',
                  'Tahun Pelajaran': '2026/2027'
                })}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu SK (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
