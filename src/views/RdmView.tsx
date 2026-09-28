import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  RotateCw, 
  Settings, 
  CheckCircle2, 
  Server, 
  BookOpen, 
  Sparkles, 
  X,
  ShieldCheck,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export const RdmView: React.FC = () => {
  const { iframeConfig, updateIframeConfig, canEdit } = useApp();
  const [iframeKey, setIframeKey] = useState(0);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newUrl, setNewUrl] = useState(iframeConfig.rdmUrl);
  const [activeTab, setActiveTab] = useState<'portal' | 'panduan'>('portal');

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    await updateIframeConfig({ rdmUrl: newUrl });
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Kementerian Agama RI
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Server Terhubung
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Rapor Digital Madrasah (RDM) MTs. Nurul Jadid
            </h3>
            <p className="text-xs text-slate-500">
              Sistem penilaian dan pencetakan rapor siswa terintegrasi Kementerian Agama RI
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'portal'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Portal RDM
            </button>
            <button
              onClick={() => setActiveTab('panduan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'panduan'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Petunjuk Teknis
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Refresh Halaman RDM"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <a
            href={iframeConfig.rdmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka di Tab Baru
          </a>

          {canEdit('rdm') && (
            <button
              onClick={() => {
                setNewUrl(iframeConfig.rdmUrl);
                setShowConfigModal(true);
              }}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Ubah URL RDM"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'portal' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          {/* Note about iframe embedding */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Info Integrasi Server RDM Madrasah:</span> Jika server RDM lokal/hosting madrasah membatasi tampilan bingkai (X-Frame-Options), silakan klik tombol <span className="font-bold underline cursor-pointer" onClick={() => window.open(iframeConfig.rdmUrl, '_blank')}>"Buka di Tab Baru"</span> di atas untuk login langsung dengan akun NIK/NIUP Anda.
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
              {iframeConfig.rdmUrl}
            </span>
          </div>

          {/* Iframe Viewport */}
          <div className="relative w-full h-[700px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
            <iframe
              key={iframeKey}
              src={iframeConfig.rdmUrl}
              title="Rapor Digital Madrasah"
              className="w-full h-full border-0"
              allow="clipboard-write; fullscreen"
            />
          </div>
        </div>
      ) : (
        /* PANDUAN PENGGUNAAN RDM */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Petunjuk Teknis Pengisian Rapor Digital Madrasah (RDM)
            </h4>
            <p className="text-xs text-slate-500">
              Panduan alur penginputan nilai bagi Guru Mata Pelajaran dan Wali Kelas MTs. Nurul Jadid
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Alur Guru Mata Pelajaran
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li>Login menggunakan akun <strong>Username (NIUP)</strong> dan password yang diberikan proktor RDM.</li>
                <li>Pilih menu <strong>Bobot Penilaian</strong>: pastikan rasio Formatif (Harian) dan Sumatif (STS/SAS) telah disepakati (misal: 60:40).</li>
                <li>Input <strong>Capaian Pembelajaran (CP)</strong> atau Tujuan Pembelajaran (TP) per mata pelajaran pada semester berjalan.</li>
                <li>Lakukan input nilai harian formatif dan nilai sumatif akhir. Bisa via form langsung atau unduh <em>Template Excel RDM</em> lalu unggah ulang.</li>
                <li>Klik tombol <strong>Kirim Nilai</strong> ke Wali Kelas setelah seluruh data terisi lengkap.</li>
              </ol>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Alur Wali Kelas & Cetak Rapor
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li>Pantau status pengiriman nilai dari seluruh guru mata pelajaran pada tab <strong>Status Nilai Rombel</strong>.</li>
                <li>Input <strong>Absensi Siswa</strong> (Sakit, Izin, Alpa) dan data <strong>Catatan Wali Kelas</strong> untuk santri.</li>
                <li>Input prestasi ekstrakurikuler serta catatan perkembangan sikap spiritual dan sosial santri.</li>
                <li>Lakukan pengecekan preview draf rapor sebelum cetak masal.</li>
                <li>Cetak Rapor Siswa dalam format PDF resmi bertanda tangan Kepala Madrasah dan cap digital madrasah.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIG URL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Ubah Tautan / URL Server RDM
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Portal RDM Madrasah *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://rdm.mtsnuruljadid.sch.id"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tautan ini akan digunakan sebagai embed iframe dan tombol akses cepat staf.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
