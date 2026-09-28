import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Download, 
  Printer, 
  Tag, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { KALENDER_DATA } from '../../data/initialData';
import { exportTableToPDF } from '../../utils/exportUtils';

interface CalendarEvent {
  date: string;
  title: string;
  category: 'libur-nasional' | 'libur-pesantren' | 'agenda-madrasah' | 'asesmen';
  description?: string;
}

const KALENDER_EVENTS: CalendarEvent[] = [
  // Semester Ganjil 2026
  { date: "2026-07-13", title: "Awal Tahun Ajaran Baru 2026/2027 & Masuk Pesantren", category: "agenda-madrasah" },
  { date: "2026-07-14 s/d 16", title: "MATSAMA (Masa Ta'aruf Santri Madrasah)", category: "agenda-madrasah" },
  { date: "2026-07-17", title: "Tahun Baru Islam 1448 Hijriah", category: "libur-nasional" },
  { date: "2026-08-17", title: "HUT Kemerdekaan Republik Indonesia Ke-81", category: "libur-nasional" },
  { date: "2026-09-25", title: "Maulid Nabi Muhammad SAW 1448 H", category: "libur-nasional" },
  { date: "2026-09-28 s/d 10-03", title: "Asesmen Sumatif Tengah Semester (ASTS) Ganjil", category: "asesmen" },
  { date: "2026-10-22", title: "Hari Santri Nasional (Upacara Akbar di Pesantren)", category: "agenda-madrasah" },
  { date: "2026-11-25", title: "Hari Guru Nasional & Apresiasi Dewan Guru", category: "agenda-madrasah" },
  { date: "2026-11-30 s/d 12-10", title: "Asesmen Sumatif Akhir Semester (ASAS) Ganjil", category: "asesmen" },
  { date: "2026-12-18", title: "Pembagian Rapor Semester Ganjil", category: "agenda-madrasah" },
  { date: "2026-12-21 s/d 31", title: "Libur Semester Ganjil & Libur Akhir Tahun", category: "libur-pesantren" },

  // Semester Genap 2027
  { date: "2027-01-04", title: "Awal Masuk KBM Semester Genap 2026/2027", category: "agenda-madrasah" },
  { date: "2027-02-05", title: "Isra Mi'raj Nabi Muhammad SAW 1448 H", category: "libur-nasional" },
  { date: "2027-02-09 s/d 10", title: "Tahun Baru Imlek 2578 Kongzili", category: "libur-nasional" },
  { date: "2027-02-18 s/d 03-24", title: "Bulan Suci Ramadhan 1448 H (KBM Khusus & Pengajian Kitab)", category: "agenda-madrasah" },
  { date: "2027-03-01 s/d 06", title: "Asesmen Sumatif Tengah Semester (ASTS) Genap", category: "asesmen" },
  { date: "2027-03-25 s/d 04-06", title: "Hari Raya Idul Fitri 1448 H & Cuti Bersama", category: "libur-nasional" },
  { date: "2027-04-12 s/d 20", title: "Asesmen Madrasah (AM) Tingkat Akhir Kelas IX", category: "asesmen" },
  { date: "2027-05-01", title: "Hari Buruh Internasional", category: "libur-nasional" },
  { date: "2027-05-06", title: "Kenaikan Isa Almasih", category: "libur-nasional" },
  { date: "2027-05-17", title: "Hari Raya Idul Adha 1448 H", category: "libur-nasional" },
  { date: "2027-05-31 s/d 06-10", title: "Asesmen Sumatif Akhir Tahun (ASAT) Genap", category: "asesmen" },
  { date: "2027-06-18", title: "Pembagian Rapor Semester Genap & Kenaikan Kelas", category: "agenda-madrasah" },
  { date: "2027-06-21 s/d 07-10", title: "Libur Akhir Tahun Pelajaran 2026/2027", category: "libur-pesantren" }
];

export const KalenderPendidikanInteraktif: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'ganjil' | 'genap'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredEvents = KALENDER_EVENTS.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    return true;
  });

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'KALENDER PENDIDIKAN & AGENDA MADRASAH TSANAWIYAH NURUL JADID',
      subtitle: 'Tahun Pelajaran 2026/2027 • SK Kepala Madrasah No. NJ-H/15/018/A.III/07.2026',
      headers: ['Tanggal / Rentang', 'Nama Agenda / Hari Libur', 'Kategori'],
      rows: filteredEvents.map(e => [
        e.date,
        e.title,
        e.category === 'libur-nasional' ? 'Hari Libur Nasional & Islam' :
        e.category === 'libur-pesantren' ? 'Libur Pesantren / Semester' :
        e.category === 'asesmen' ? 'Asesmen / Ujian Madrasah' : 'Agenda Resmi Madrasah'
      ]),
      fileName: 'Kalender_Pendidikan_MTs_Nurul_Jadid_2026_2027',
      orientation: 'portrait'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Summary: Hari Efektif Belajar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            Total Hari Efektif KBM (1 Tahun)
          </div>
          <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
            211 Hari Efektif
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
            Berdasarkan SK Kalender Pendidikan Jawa Timur & Kemenag
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
          <div className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            Semester Ganjil 2026
          </div>
          <div className="text-2xl font-black text-blue-900 dark:text-blue-200 mt-1">
            116 Hari Belajar
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">
            Juli s/d Desember 2026 • 19 Pekan Efektif
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
          <div className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
            Semester Genap 2027
          </div>
          <div className="text-2xl font-black text-teal-900 dark:text-teal-200 mt-1">
            95 Hari Belajar
          </div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">
            Januari s/d Juni 2027 • 17 Pekan Efektif
          </div>
        </div>
      </div>

      {/* Rincian Tabel 3.25 Pekan & Hari Efektif Belajar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Tabel 3.25 Rincian Pekan Efektif Belajar per Bulan (Buku Kurikulum)
            </h4>
            <p className="text-xs text-slate-500">
              Distribusi jumlah hari dan jam belajar efektif Semester Ganjil dan Genap
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Kalender PDF</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Semester Ganjil */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800">
              <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-300 uppercase">
                Semester Ganjil (Juli - Desember 2026)
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                116 Hari Efektif
              </span>
            </div>
            <div className="divide-y divide-emerald-100 dark:divide-emerald-900/40 text-xs">
              {KALENDER_DATA.semesterGanjil.bulan.map((b, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{b.nama}</span>
                    <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">({b.keterangan})</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0">
                    {b.hariEfektif} Hari
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Semester Genap */}
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-800">
              <span className="font-extrabold text-xs text-blue-900 dark:text-blue-300 uppercase">
                Semester Genap (Januari - Juni 2027)
              </span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                95 Hari Efektif
              </span>
            </div>
            <div className="divide-y divide-blue-100 dark:divide-blue-900/40 text-xs">
              {KALENDER_DATA.semesterGenap.bulan.map((b, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{b.nama}</span>
                    <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">({b.keterangan})</span>
                  </div>
                  <span className="font-extrabold text-blue-700 dark:text-blue-400 shrink-0">
                    {b.hariEfektif} Hari
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Agenda & Hari Libur List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              Daftar Agenda Pembelajaran, Asesmen & Hari Libur 2026/2027
            </h4>
            <p className="text-xs text-slate-500">
              Agenda resmi madrasah, jadwal ASTS, ASAS, dan libur keagamaan
            </p>
          </div>

          {/* Filter category */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Kategori</option>
              <option value="agenda-madrasah">Agenda Resmi Madrasah</option>
              <option value="asesmen">Asesmen & Ujian</option>
              <option value="libur-nasional">Hari Libur Nasional & Islam</option>
              <option value="libur-pesantren">Libur Pesantren</option>
            </select>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="space-y-2.5">
          {filteredEvents.map((evt, idx) => {
            const badgeClass = 
              evt.category === 'asesmen'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                : evt.category === 'libur-nasional'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                : evt.category === 'libur-pesantren'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';

            const badgeLabel = 
              evt.category === 'asesmen' ? 'Asesmen' :
              evt.category === 'libur-nasional' ? 'Libur Nasional' :
              evt.category === 'libur-pesantren' ? 'Libur Pesantren' : 'Agenda Madrasah';

            return (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-28 shrink-0 font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-center">
                    {evt.date}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {evt.title}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${badgeClass}`}>
                    {badgeLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
