import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IHTItem } from '../types';
import { 
  exportTableToExcel, 
  exportTableToPDF, 
  exportInfoCardPDF 
} from '../utils/exportUtils';
import { PendingModuleCard } from '../components/PendingModuleCard';
import { 
  BookOpen, 
  Laptop, 
  Video, 
  Award, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  Sparkles, 
  Users, 
  Clock, 
  Calendar 
} from 'lucide-react';

export const PelatihanGuruView: React.FC = () => {
  const { 
    ihtList, 
    addIHT, 
    updateIHT, 
    deleteIHT, 
    canEdit, 
    canExport 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'iht' | 'workshop' | 'webinar' | 'sertifikat'>('iht');

  // IHT Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [editingIHT, setEditingIHT] = useState<IHTItem | null>(null);
  const [ihtForm, setIhtForm] = useState({
    tema: '',
    narasumber: '',
    tanggal: '12 - 14 Juli 2026',
    tempat: 'Aula Utama MTs. Nurul Jadid Paiton',
    jumlahPeserta: 54,
    status: 'Selesai' as 'Selesai' | 'Terjadwal' | 'Persiapan',
    keterangan: 'Peningkatan kompetensi guru dalam merancang modul ajar berdiferensiasi'
  });

  // Card view state
  const [viewingCard, setViewingCard] = useState<IHTItem | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ihtForm.tema.trim()) return;

    if (editingIHT) {
      await updateIHT({
        ...editingIHT,
        ...ihtForm
      });
    } else {
      await addIHT({
        ...ihtForm
      });
    }

    setShowModal(false);
    setEditingIHT(null);
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'DAFTAR IN HOUSE TRAINING (IHT) GURU',
      subtitle: 'MTs. Nurul Jadid Paiton • Tahun Pelajaran 2026/2027',
      headers: ['No', 'Tema Pelatihan IHT', 'Narasumber / Pakar', 'Waktu', 'Tempat', 'Peserta', 'Status'],
      rows: ihtList.map((item, idx) => [
        idx + 1,
        item.tema || item.materiIht || '-',
        item.narasumber || '-',
        item.tanggal || item.tanggalPelaksanaan || '-',
        item.tempat || '-',
        `${item.jumlahPeserta || 54} Guru`,
        item.status || 'Selesai'
      ]),
      fileName: 'IHT_Guru_MTs_Nurul_Jadid',
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const data = ihtList.map((item, idx) => ({
      No: idx + 1,
      'Tema Pelatihan IHT': item.tema,
      'Narasumber / Fasilitator': item.narasumber,
      'Tanggal Pelaksanaan': item.tanggal,
      Tempat: item.tempat,
      'Jumlah Peserta': item.jumlahPeserta,
      Status: item.status,
      Keterangan: item.keterangan || ''
    }));
    exportTableToExcel(data, 'IHT_Guru_MTs_Nurul_Jadid', 'IHT');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'iht', label: '1. In House Training (IHT)', icon: BookOpen },
          { key: 'workshop', label: '2. Workshop Kurikulum (Pending)', icon: Laptop },
          { key: 'webinar', label: '3. Webinar & Diklat Online (Pending)', icon: Video },
          { key: 'sertifikat', label: '4. Sertifikat Pelatihan (Pending)', icon: Award },
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

      {/* SUB-MENU 1: IN HOUSE TRAINING (IHT) */}
      {activeTab === 'iht' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Pengembangan Keprofesian Berkelanjutan
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  In House Training (IHT) MTs. Nurul Jadid
                </h3>
                <p className="text-xs text-slate-500">
                  Agenda pelatihan internal untuk penguatan pedagogik, literasi digital, dan Kurikulum Berbasis Cinta
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canEdit('pelatihan-guru') && (
                  <button
                    onClick={() => {
                      setEditingIHT(null);
                      setIhtForm({
                        tema: '',
                        narasumber: '',
                        tanggal: '12 - 14 Juli 2026',
                        tempat: 'Aula Utama MTs. Nurul Jadid Paiton',
                        jumlahPeserta: 54,
                        status: 'Terjadwal',
                        keterangan: ''
                      });
                      setShowModal(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah IHT
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

            {/* IHT Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3 text-center w-12">No</th>
                    <th className="px-3.5 py-3">Tema Pelatihan IHT</th>
                    <th className="px-3.5 py-3">Narasumber / Pakar</th>
                    <th className="px-3.5 py-3">Waktu & Tempat</th>
                    <th className="px-3.5 py-3 text-center">Peserta</th>
                    <th className="px-3.5 py-3 text-center">Status</th>
                    <th className="px-3.5 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ihtList.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-3 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.tema}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.keterangan}</div>
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{item.narasumber}</td>
                      <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300">
                        <div>{item.tanggal}</div>
                        <div className="text-[11px] text-slate-400">{item.tempat}</div>
                      </td>
                      <td className="px-3.5 py-3 text-center font-bold text-slate-900 dark:text-white">
                        {item.jumlahPeserta} Guru
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          item.status === 'Terjadwal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingCard(item)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                            title="Lihat & Download Kartu IHT"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {canEdit('pelatihan-guru') && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingIHT(item);
                                  setIhtForm({
                                    tema: item.tema || item.materiIht || '',
                                    narasumber: item.narasumber || '',
                                    tanggal: item.tanggal || item.tanggalPelaksanaan || '',
                                    tempat: item.tempat || '',
                                    jumlahPeserta: item.jumlahPeserta || 54,
                                    status: item.status || 'Terjadwal',
                                    keterangan: item.keterangan || item.kesimpulan || ''
                                  });
                                  setShowModal(true);
                                }}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
                                title="Edit IHT"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus pelatihan "${item.tema}"?`)) {
                                    deleteIHT(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                                title="Hapus IHT"
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

      {/* SUB-MENU 2: WORKSHOP (PENDING) */}
      {activeTab === 'workshop' && (
        <PendingModuleCard
          title="Workshop Penyusunan Perangkat Ajar Deep Learning"
          category="Pelatihan Guru #2"
          description="Lokakarya intensif kolaboratif per rumpun mata pelajaran (MIPA, Sosial Humaniora, Bahasa, dan Keagamaan Islam) untuk merumuskan lembar kerja santri terintegrasi Panca Cinta."
          expectedDate="Pekan Ke-4 Semester Ganjil"
          regulasiRef="Divisi Pengembangan SDM Biro Pendidikan Nurul Jadid"
          draftFields={[
            "Rumpun MGMP Madrasah",
            "Target Output: 54 Modul Ajar Tervalidasi",
            "Integrasi Bahan Ajar Kitab Kuning",
            "Peer Teaching & Review Antar Pendidik",
            "Sertifikat 32 JP Kementerian Agama"
          ]}
        />
      )}

      {/* SUB-MENU 3: WEBINAR & DIKLAT ONLINE (PENDING) */}
      {activeTab === 'webinar' && (
        <PendingModuleCard
          title="Webinar Nasional & Diklat MOOC Kemenag Pintar"
          category="Pelatihan Guru #3"
          description="Integrasi pencatatan keikutsertaan guru dalam webinar nasional, seminar daring Kementerian Agama RI, dan MOOC Platform PINTAR (Pusdiklat Tenaga Teknis Pendidikan dan Keagamaan)."
          expectedDate="Berkelanjutan Sepanjang Tahun Ajaran 2026/2027"
          regulasiRef="Platform Pintar Kemenag & Ditjen Pendis"
          draftFields={[
            "Tautan Webinar Zoom / YouTube",
            "Materi Pelatihan Digital (PDF / PPT)",
            "Pencatatan Jam Pelatihan (JP)",
            "Laporan Desiminasi kepada Guru Lain",
            "Sinkronisasi Akun Pintar Kemenag"
          ]}
        />
      )}

      {/* SUB-MENU 4: SERTIFIKAT PELATIHAN (PENDING) */}
      {activeTab === 'sertifikat' && (
        <PendingModuleCard
          title="Repositori E-Sertifikat Pelatihan Dewan Guru"
          category="Pelatihan Guru #4"
          description="Arsip digital sertifikat kelulusan IHT, workshop, dan diklat formal 54 guru MTs. Nurul Jadid. Dokumen ini terhubung dengan portofolio kenaikan pangkat, sertifikasi guru, dan akreditasi madrasah."
          expectedDate="Pascakegiatan IHT & Workshop"
          regulasiRef="Subbag Kepegawaian & Tata Usaha Madrasah"
          draftFields={[
            "Nomor Registrasi Sertifikat Diklat",
            "Jumlah Jam Pelajaran (JP) Terverifikasi",
            "Tanda Tangan Elektronik Narasumber & Kepala",
            "Verifikasi Keaslian QR Code",
            "Unduh Salinan Resolusi Tinggi"
          ]}
        />
      )}

      {/* MODAL: TAMBAH / EDIT IHT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingIHT ? 'Edit Agenda IHT' : 'Tambah In House Training (IHT)'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tema Pelatihan IHT *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Implementasi Kurikulum Berbasis Cinta (KBC)..."
                  value={ihtForm.tema}
                  onChange={e => setIhtForm({ ...ihtForm, tema: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Narasumber / Fasilitator *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. H. M. Hasan, M.Pd (Pakar Kurikulum Nasional)"
                  value={ihtForm.narasumber}
                  onChange={e => setIhtForm({ ...ihtForm, narasumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="text"
                    value={ihtForm.tanggal}
                    onChange={e => setIhtForm({ ...ihtForm, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status Kegiatan</label>
                  <select
                    value={ihtForm.status}
                    onChange={e => setIhtForm({ ...ihtForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Persiapan">Persiapan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tempat Acara</label>
                  <input
                    type="text"
                    value={ihtForm.tempat}
                    onChange={e => setIhtForm({ ...ihtForm, tempat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Jumlah Peserta</label>
                  <input
                    type="number"
                    min={1}
                    value={ihtForm.jumlahPeserta}
                    onChange={e => setIhtForm({ ...ihtForm, jumlahPeserta: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi & Keterangan</label>
                <textarea
                  rows={2}
                  placeholder="Target kompetensi atau materi pokok yang dibahas..."
                  value={ihtForm.keterangan}
                  onChange={e => setIhtForm({ ...ihtForm, keterangan: e.target.value })}
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
                  Simpan IHT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KARTU IHT (BISA DI-DOWNLOAD PDF) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Kartu In House Training (IHT)
              </h3>
              <button onClick={() => setViewingCard(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-600/40 space-y-3">
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                STATUS: {viewingCard.status} • {viewingCard.jumlahPeserta} PENDIDIK
              </div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                {viewingCard.tema}
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div><span className="font-bold">Narasumber:</span> {viewingCard.narasumber}</div>
                <div><span className="font-bold">Waktu:</span> {viewingCard.tanggal}</div>
                <div><span className="font-bold">Tempat:</span> {viewingCard.tempat}</div>
                <div><span className="font-bold">Deskripsi:</span> {viewingCard.keterangan || '-'}</div>
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
                onClick={() => exportInfoCardPDF(`IHT - ${viewingCard.tema || viewingCard.materiIht || 'Pelatihan'}`, {
                  'Tema IHT': viewingCard.tema || viewingCard.materiIht || '-',
                  'Narasumber': viewingCard.narasumber || '-',
                  'Waktu Pelaksanaan': viewingCard.tanggal || viewingCard.tanggalPelaksanaan || '-',
                  'Lokasi / Tempat': viewingCard.tempat || '-',
                  'Jumlah Peserta': `${viewingCard.jumlahPeserta || 54} Dewan Guru`,
                  'Status Kegiatan': viewingCard.status || 'Selesai',
                  'Keterangan Capaian': viewingCard.keterangan || viewingCard.kesimpulan || 'Tercapai 100%'
                })}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu IHT (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
