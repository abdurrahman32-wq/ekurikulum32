import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Database, 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Key, 
  Lock,
  Cpu,
  FileText
} from 'lucide-react';

export const DokumentasiDevView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arsitektur' | 'database' | 'keamanan' | 'api' | 'setup'>('arsitektur');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                Technical Specification v1.0
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                Developer Documentation
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Dokumentasi Teknis Pengembang (Developer Guide)
            </h3>
            <p className="text-xs text-slate-500">
              Spesifikasi arsitektur, skema Firestore, enkripsi data tingkat tinggi, matriks RBAC, dan integrasi API
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'arsitektur', label: '1. Arsitektur & Performa', icon: Cpu },
          { key: 'database', label: '2. Skema Database Firestore', icon: Database },
          { key: 'keamanan', label: '3. Enkripsi & Matriks RBAC', icon: ShieldCheck },
          { key: 'api', label: '4. Spesifikasi RESTful API', icon: Code2 },
          { key: 'setup', label: '5. Panduan Instalasi & Deploy', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ARSITEKTUR & PERFORMA */}
      {activeTab === 'arsitektur' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Arsitektur Sistem & Rekayasa Performa Cepat
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Aplikasi dibangun dengan stack modern berorientasi latensi rendah, offline-first fallback, dan reaktivitas modular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">Frontend Core</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">React 19 & TypeScript 5</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pemanfaatan React 19 Concurrent Mode, strict type safety TypeScript, dynamic code splitting per-view, dan render state teroptimasi tanpa HMR bottleneck.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Styling & UI Kit</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Tailwind CSS v4 & Lucide</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generasi stylesheet terkini `@import "tailwindcss";` tanpa file konfig terpisah. Responsif ponsel/tablet/desktop dengan dark mode instan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-teal-600 dark:text-teal-400">Data Persistence Layer</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">Firebase Firestore + Cache</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sinkronisasi multi-klien real-time dengan fallback otomatis `localStorage`. Memastikan aplikasi tetap berfungsi dengan lancar meski jaringan pesantren mengalami fluktuasi.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-2">
            <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" /> Strategi Optimasi Performa (Low Latency):
            </div>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
              <li><strong>Zero Blocking Network:</strong> Pemuatan font sistem bawaan (`sans-serif`, `system-ui`) mengeliminasi blocking FOUT (Flash of Unstyled Text).</li>
              <li><strong>Dynamic PDF & Excel Streams:</strong> Rendering PDF menggunakan `jspdf` dan `xlsx` dijalankan di browser (client-side worker thread) tanpa membebani server hosting.</li>
              <li><strong>Debounced Real-Time Search:</strong> Pencarian data siswa, guru, dan bank soal disaring dengan efisiensi O(n) memoized di memori lokal.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: SKEMA DATABASE FIRESTORE */}
      {activeTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Struktur Koleksi Firebase Firestore
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Desain skema dokumen NoSQL Firestore untuk integritas data madrasah MTs. Nurul Jadid
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'students',
                desc: 'Menyimpan data induk santri, NISN, NIS, rombel, gender, dan status pondok',
                schema: '{\n  id: string,\n  nisn: string (10 digit),\n  nis: string (8 digit),\n  nama: string,\n  kelas: "VII" | "VIII" | "IX",\n  rombel: string (mis: "VII-1"),\n  jenisKelamin: "L" | "P",\n  program: "Tahfidz" | "Agama" | "Reguler",\n  statusSantri: "Aktif Asrama"\n}'
              },
              {
                name: 'teachers',
                desc: 'Menyimpan identitas dewan guru, NIUP, pendidikan, mapel, dan jabatan',
                schema: '{\n  id: string,\n  nama: string,\n  niup: string,\n  mapel: string,\n  pendidikan: string,\n  statusKepegawaian: "Tetap Yayasan" | "PNS DPK",\n  totalJp: number,\n  jabatanStruktural?: string\n}'
              },
              {
                name: 'announcements',
                desc: 'Pengumuman mendesak (Urgent Announcements) dengan push notifikasi real-time',
                schema: '{\n  id: string,\n  judul: string,\n  isi: string,\n  tanggal: string,\n  level: "Urgent" | "Penting" | "Info",\n  active: boolean,\n  targetAudience: "Semua" | "Guru" | "Siswa"\n}'
              },
              {
                name: 'prota & promes',
                desc: 'Data Program Tahunan dan Program Semester kurikulum KBC',
                schema: '{\n  id: string,\n  bulan: string,\n  mingguKe: string,\n  namaProgram: string,\n  jenisProgram: string,\n  keterangan: "selesai" | "berjalan" | "rencana"\n}'
              }
            ].map((col, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">/{col.name}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(col.schema, col.name)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSnippet === col.name ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    Salin Skema
                  </button>
                </div>
                <p className="text-xs text-slate-500">{col.desc}</p>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  {col.schema}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENKRIPSI & MATRIKS RBAC */}
      {activeTab === 'keamanan' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Tingkat Keamanan Enkripsi Sangat Tinggi & Matriks RBAC
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Perlindungan data sensitif santri dan dewan guru dengan enkripsi berlapis serta pembatasan hak akses berbasis peran
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <Lock className="w-4 h-4" /> Enkripsi Data At-Rest & In-Transit
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li><strong>Transport Layer Security (TLS 1.3):</strong> Seluruh lalu lintas transmisi antara browser pengguna dan cloud terenkripsi SSL 256-bit.</li>
                <li><strong>Storage Encryption (AES-256):</strong> Database Firebase Firestore mengenkripsi setiap blok data tersimpan menggunakan Advanced Encryption Standard 256-bit.</li>
                <li><strong>SHA-256 Tamper Resistance:</strong> Setiap catatan perubahan pada audit trail memvalidasi hash integrity pencegah manipulasi riwayat log.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Default Deny Firestore Rules
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <li><strong>Prinsip Least Privilege:</strong> Hanya pengguna terotentikasi dengan peran yang sesuai yang dapat melakukan operasi WRITE atau DELETE.</li>
                <li><strong>Read-Only Public Modules:</strong> Informasi umum seperti kalender pendidikan dan visi misi dapat dibaca secara publik oleh tamu/wali santri.</li>
              </ul>
            </div>
          </div>

          {/* RBAC Matrix Table */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Matriks Hak Akses Berbasis Peran (RBAC Table)
            </h5>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3">Modul Aplikasi</th>
                    <th className="px-3 py-3 text-center">ADMIN</th>
                    <th className="px-3 py-3 text-center">KEPALA MADRASAH</th>
                    <th className="px-3 py-3 text-center">WAKA KURIKULUM</th>
                    <th className="px-3 py-3 text-center">WAKA KESISWAAN</th>
                    <th className="px-3 py-3 text-center">GURU MAPEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {[
                    { module: 'Dashboard & Visi Misi', admin: 'Full', kepala: 'Full', wakakur: 'Full', wakasis: 'Full', guru: 'View' },
                    { module: 'Dokumen Induk & Data Santri', admin: 'Full', kepala: 'View', wakakur: 'Full', wakasis: 'Full', guru: 'View' },
                    { module: 'Perencanaan Kurikulum (Prota/Promes/ATP)', admin: 'Full', kepala: 'Validate', wakakur: 'Full', wakasis: 'View', guru: 'View/Input' },
                    { module: 'Administrasi Guru (SK Tugas/Jadwal)', admin: 'Full', kepala: 'Validate', wakakur: 'Full', wakasis: 'View', guru: 'View' },
                    { module: 'Penilaian & Asesmen (Bank Soal)', admin: 'Full', kepala: 'View', wakakur: 'Full', wakasis: 'View', guru: 'Full' },
                    { module: 'Supervisi Akademik', admin: 'Full', kepala: 'Full', wakakur: 'Full', wakasis: 'View', guru: 'View Self' },
                    { module: 'Evaluasi & Monitoring KBM', admin: 'Full', kepala: 'Full', wakakur: 'Full', wakasis: 'View', guru: 'Input Form' },
                    { module: 'Prestasi Siswa & Dokumentasi', admin: 'Full', kepala: 'View', wakakur: 'View', wakasis: 'Full', guru: 'Input' },
                    { module: 'Pelatihan Guru (IHT)', admin: 'Full', kepala: 'View', wakakur: 'Full', wakasis: 'View', guru: 'View' },
                    { module: 'RDM Kemenag Portal', admin: 'Full', kepala: 'Full', wakakur: 'Full', wakasis: 'View', guru: 'Input Nilai' },
                    { module: 'Admin Monitoring & Audit Logs', admin: 'Full', kepala: 'View', wakakur: 'No', wakasis: 'No', guru: 'No' },
                    { module: 'Integrasi API & Webhooks', admin: 'Full', kepala: 'No', wakakur: 'Full', wakasis: 'No', guru: 'No' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">{row.module}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-emerald-600">{row.admin}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-blue-600">{row.kepala}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-teal-600">{row.wakakur}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-purple-600">{row.wakasis}</td>
                      <td className="px-3 py-2.5 text-center font-medium text-slate-500">{row.guru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPESIFIKASI RESTful API */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Spesifikasi Endpoint RESTful API v1.0
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Dokumentasi antarmuka pemrograman untuk pertukaran data antar instansi
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-emerald-600 text-white">GET</span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">/api/v1/students</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Mengambil daftar seluruh santri atau menyaring berdasarkan parameter kelas dan rombel.
              </p>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`// Header Request
Authorization: Bearer <API_SECRET_KEY>
Accept: application/json

// Response (200 OK)
{
  "status": "success",
  "total": 420,
  "data": [
    {
      "id": "std-1",
      "nisn": "0098765432",
      "nis": "20260701",
      "nama": "Ahmad Farhan Kamil",
      "kelas": "VII",
      "rombel": "VII-1",
      "jenisKelamin": "L",
      "program": "Tahfidz"
    }
  ]
}`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-blue-600 text-white">POST</span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">/api/v1/announcements</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Mempublikasikan pengumuman mendesak baru ke banner real-time madrasah.
              </p>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`// Request Payload
{
  "judul": "Libur Awal Ramadhan 1448 H",
  "isi": "KBM diliburkan mulai tanggal...",
  "level": "Urgent",
  "active": true
}

// Response (201 Created)
{
  "status": "success",
  "message": "Pengumuman berhasil dipublikasikan secara real-time"
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PANDUAN INSTALASI & DEPLOY */}
      {activeTab === 'setup' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Panduan Instalasi, Konfigurasi Lingkungan, & Deployment
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Petunjuk langkah demi langkah menjalankan proyek secara lokal dan produksi
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white">1. Kloning & Instalasi Paket Dependensi</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
{`git clone https://github.com/mts-nuruljadid/ekurikulum.git
cd ekurikulum
npm install`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white">2. Konfigurasi Variabel Lingkungan (.env)</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-teal-400 font-mono text-xs overflow-x-auto">
{`VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="mts-nuruljadid.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="mts-nuruljadid-dev"
VITE_FIREBASE_STORAGE_BUCKET="mts-nuruljadid.firebasestorage.app"
VITE_FIREBASE_APP_ID="1:..."`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white">3. Memulai Server Pengembangan (Port 3000) & Build</div>
              <pre className="p-3 rounded-xl bg-slate-900 text-amber-400 font-mono text-xs overflow-x-auto">
{`# Jalankan lokal dev server
npm run dev

# Kompilasi & validasi tipe TypeScript
npm run build`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
