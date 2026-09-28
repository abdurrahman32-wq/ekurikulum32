import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MADRASAH_INFO, KALENDER_DATA, EKSTRAKURIKULER_LIST } from '../data/initialData';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Compass, 
  Award, 
  Clock, 
  Activity, 
  ChevronRight, 
  TrendingUp, 
  Heart, 
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (menuKey: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    rombels,
    students, 
    teachers, 
    prestasiList, 
    activityLogs, 
    ihtList, 
    atpList, 
    protaList,
    currentUser 
  } = useApp();

  const [activeCalSemester, setActiveCalSemester] = useState<'ganjil' | 'genap'>('ganjil');

  // Stats calculation
  const totalRombel = rombels.length;
  const totalSiswaRombel = rombels.reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0);
  const totalStudents = students.length;
  const effectiveTotalStudents = totalSiswaRombel > 0 ? totalSiswaRombel : totalStudents;

  const countAgama = totalSiswaRombel > 0
    ? rombels.filter(r => r.program === 'Agama').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.program === 'Agama').length;

  const countTahfidz = totalSiswaRombel > 0
    ? rombels.filter(r => r.program === 'Tahfidz').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.program === 'Tahfidz').length;

  const countReguler = totalSiswaRombel > 0
    ? rombels.filter(r => r.program === 'Reguler').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.program === 'Reguler').length;

  const countVII = totalSiswaRombel > 0
    ? rombels.filter(r => r.kelas === 'VII').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.kelas === 'VII').length;

  const countVIII = totalSiswaRombel > 0
    ? rombels.filter(r => r.kelas === 'VIII').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.kelas === 'VIII').length;

  const countIX = totalSiswaRombel > 0
    ? rombels.filter(r => r.kelas === 'IX').reduce((acc, r) => acc + (Number(r.jumlahSiswa) || 0), 0)
    : students.filter(s => s.kelas === 'IX').length;

  const rombelVII = rombels.filter(r => r.kelas === 'VII').length;
  const rombelVIII = rombels.filter(r => r.kelas === 'VIII').length;
  const rombelIX = rombels.filter(r => r.kelas === 'IX').length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 md:p-8 shadow-xl overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Informasi Manajemen Kurikulum Berbasis Cinta (KBC)
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang di eKurikulum <br className="hidden sm:inline" />
              <span className="text-emerald-400">MTs. Nurul Jadid Paiton</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mewujudkan generasi santri beriman, bertaqwa, berakhlaqul karimah, berilmu, dan berwawasan luas melalui integrasi Kurikulum Merdeka KMA 1503 Tahun 2025 dan tradisi luhur Pesantren Nurul Jadid.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('dokumen-induk')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Buku Kurikulum 2026/2027
            </button>
            <button
              onClick={() => onNavigate('perencanaan-kurikulum')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 backdrop-blur-xs transition border border-white/20 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Perencanaan ATP & Prota
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('data-rombel')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition group"
          title="Klik untuk membuka menu Data Rombel"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Layers className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400 uppercase truncate">Total Data Rombel</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1.5">
              <span>{totalRombel}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Rombel</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
              {totalSiswaRombel > 0 ? `${totalSiswaRombel} Total Siswa Rombel` : 'Rombel 1 s.d. 7 Aktif'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Guru & Tenaga Pendidik</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{teachers.length}</div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">Dewan Guru & Tendik</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Prestasi Juara</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{prestasiList.length}</div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Regional & Nasional</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase">Hari Efektif KBM</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">211</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Ganjil 116 • Genap 95 Hari</div>
          </div>
        </div>
      </div>

      {/* Row 1: Visi Misi & Kurikulum Berbasis Cinta (KBC) Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visi & Misi */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                <Heart className="w-5 h-5 text-emerald-600" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Visi & Misi MTs. Nurul Jadid
                </h3>
                <p className="text-xs text-slate-500">Pondasi Filosofis Kurikulum Madrasah TP 2026/2027</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {MADRASAH_INFO.branding}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-l-4 border-emerald-600 dark:border-emerald-500">
            <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              VISI MADRASAH
            </div>
            <blockquote className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 italic leading-snug">
              &ldquo;{MADRASAH_INFO.visi}&rdquo;
            </blockquote>
          </div>

          <div>
            <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              MISI STRATEGIS MADRASAH:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MADRASAH_INFO.misi.map((m, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kurikulum Berbasis Cinta (Panca Cinta) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  5 Pilar Panca Cinta (KBC)
                </h3>
                <p className="text-xs text-slate-500">KMA No. 1503 Tahun 2025</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {[
                { title: "Cinta Allah dan Rasul-Nya", desc: "Keimanan, Asmaul Husna & keteladanan akhlak nabawi", color: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30" },
                { title: "Cinta Ilmu", desc: "Membuka tabir keagungan kauniyah & qauliyah, literasi & sains", color: "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30" },
                { title: "Cinta Lingkungan", desc: "Ekoteologi rahmatan lil 'alamin, Kamis Bersih & Hijau", color: "border-teal-500 bg-teal-50/50 dark:bg-teal-950/30" },
                { title: "Cinta Diri dan Sesama", desc: "Self-compassion, ukhuwah islamiyah & persaudaraan manusia", color: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/30" },
                { title: "Cinta Tanah Air", desc: "Hubbul wathan minal iman, toleransi & wawasan kebangsaan", color: "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30" }
              ].map((p, i) => (
                <div key={i} className={`p-2.5 rounded-xl border-l-3 ${p.color} text-xs`}>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{i+1}. {p.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('perencanaan-kurikulum')}
            className="mt-4 w-full py-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            Lihat Alur Tujuan Pembelajaran <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Grafik Kelas, Distribusi Program, & Program Per Bulan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Distribusi Program & Kelas */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Grafik Kelas & Komposisi Program Santri
              </h3>
              <p className="text-xs text-slate-500">Statistik real-time rombel dan siswa per tingkat kelas dan program peminatan</p>
            </div>
            <button
              onClick={() => onNavigate('data-rombel')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              Kelola Data Rombel <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Visualizer for Program */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Program Agama (Nahwu, Shorrof & Fikih Kitab)
                </span>
                <span className="font-bold">{countAgama} Siswa ({effectiveTotalStudents ? Math.round((countAgama/effectiveTotalStudents)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-500" 
                  style={{ width: `${effectiveTotalStudents ? (countAgama/effectiveTotalStudents)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  Program Tahfidz Al-Qur'an (Muraja'ah & Fashohah)
                </span>
                <span className="font-bold">{countTahfidz} Siswa ({effectiveTotalStudents ? Math.round((countTahfidz/effectiveTotalStudents)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500" 
                  style={{ width: `${effectiveTotalStudents ? (countTahfidz/effectiveTotalStudents)*100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Program Reguler (Sains, Bahasa & Teknologi)
                </span>
                <span className="font-bold">{countReguler} Siswa ({effectiveTotalStudents ? Math.round((countReguler/effectiveTotalStudents)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${effectiveTotalStudents ? (countReguler/effectiveTotalStudents)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Breakdown per Tingkat Kelas Cards */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 text-center">
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Kelas VII</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{countVII} <span className="text-xs font-normal text-slate-400">Siswa</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{rombelVII > 0 ? `${rombelVII} Rombel Aktif` : 'Rombel 1 s.d. 7'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 text-center">
              <div className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase">Kelas VIII</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{countVIII} <span className="text-xs font-normal text-slate-400">Siswa</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{rombelVIII > 0 ? `${rombelVIII} Rombel Aktif` : 'Rombel 1 s.d. 7'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-center">
              <div className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase">Kelas IX</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{countIX} <span className="text-xs font-normal text-slate-400">Siswa</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{rombelIX > 0 ? `${rombelIX} Rombel Aktif` : 'Rombel 1 s.d. 7'}</div>
            </div>
          </div>
        </div>

        {/* Program Per Bulan (Jadwal Semester) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Program Perbulan
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                TP 2026/2027
              </span>
            </div>

            <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {protaList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  Belum ada data program kegiatan tersimpan. Silakan tambahkan program baru pada menu Perencanaan Kurikulum.
                </div>
              ) : (
                protaList.slice(0, 6).map((prog) => (
                  <div key={prog.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                      {prog.bulan}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {prog.namaProgram}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span>{prog.jenisProgram}</span>
                        <span className={`px-1.5 py-0.2 rounded capitalize ${
                          prog.keterangan === 'selesai' ? 'bg-emerald-100 text-emerald-700' :
                          prog.keterangan === 'berjalan' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>{prog.keterangan}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('perencanaan-kurikulum')}
            className="mt-4 w-full py-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            Lihat Seluruh Prota & Promes <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 3: Kalender Pendidikan Resmi & Struktur Organisasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kalender Pendidikan Interaktif */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Kalender Pendidikan MTs. Nurul Jadid
              </h3>
              <p className="text-xs text-slate-500">SK Penetapan No: NJ-H/15/018/A.III/07.2026</p>
            </div>
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setActiveCalSemester('ganjil')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeCalSemester === 'ganjil' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semester Ganjil (116 Hari)
              </button>
              <button
                onClick={() => setActiveCalSemester('genap')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  activeCalSemester === 'genap' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semester Genap (95 Hari)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {(activeCalSemester === 'ganjil' ? KALENDER_DATA.semesterGanjil.bulan : KALENDER_DATA.semesterGenap.bulan).map((bln, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 w-28 shrink-0">{bln.nama}</span>
                  <span className="text-slate-500 dark:text-slate-400 hidden sm:inline truncate max-w-xs">{bln.keterangan}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {bln.hariEfektif} Hari Efektif
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Agenda Terdekat: </span>
              <span>Sumatif Tengah Semester (STS) Ganjil: 3 - 9 Oktober 2026</span>
            </div>
            <button
              onClick={() => onNavigate('dokumen-induk')}
              className="text-xs font-bold text-emerald-600 hover:underline shrink-0 ml-2"
            >
              Lihat Detail
            </button>
          </div>
        </div>

        {/* Struktur Organisasi Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                Struktur Organisasi MTs. Nurul Jadid
              </h3>
              <p className="text-xs text-slate-500">Pimpinan, Waka, Tata Usaha & Koordinator UPT</p>
            </div>
            <button
              onClick={() => onNavigate('dokumen-induk')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              Bagan Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Org Diagram Hierarchy Preview */}
          <div className="space-y-3">
            {/* Pimpinan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-linear-to-br from-emerald-800 to-teal-800 text-white shadow-xs">
                <div className="text-[10px] uppercase font-bold text-emerald-200">Kepala Madrasah</div>
                <div className="font-extrabold text-sm">{MADRASAH_INFO.kepalaMadrasah}</div>
                <div className="text-[10px] text-emerald-300 mt-0.5">NIUP. {MADRASAH_INFO.niupKepala}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">Komite Madrasah</div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">{MADRASAH_INFO.komiteMadrasah}</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Kemitraan & Mutu</div>
              </div>
            </div>

            {/* Waka Madrasah */}
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Wakil Kepala Madrasah (WAKA):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Waka Kurikulum</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Najibul Hoer, S.Si, M.Pd</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Waka Kesiswaan</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Muh. Utsman, S.Pd</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Waka Sarpras</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Muzammil, M.Si</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-center border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Waka Humas-Mutu</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Supandi, S.HI</div>
              </div>
            </div>

            {/* TU & Koordinator */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Kepala Tata Usaha: </span>
                <span className="font-bold text-slate-900 dark:text-white">Mohammad Rifqi Buchari, S.EI</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">11 UPT & Koordinator Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Prestasi Siswa & Materi IHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prestasi Siswa Highlight */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Informasi Prestasi Santri MTs. Nurul Jadid
              </h3>
              <p className="text-xs text-slate-500">Pencapaian ajang lomba akademik dan non-akademik terbaru</p>
            </div>
            <button
              onClick={() => onNavigate('prestasi-siswa')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {prestasiList.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                    J-{item.keteranganJuara}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{item.namaLomba}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Santri: <span className="font-medium text-slate-700 dark:text-slate-300">{item.namaSiswa}</span> • Tingkat {item.tingkat}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                  item.jenis === 'Akademik' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {item.jenis}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Materi In House Training (IHT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Materi IHT (In House Training) Guru
              </h3>
              <p className="text-xs text-slate-500">Peningkatan kompetensi pedagogik & digital madrasah</p>
            </div>
            <button
              onClick={() => onNavigate('pelatihan-guru')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              Lihat Materi <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {ihtList.map((iht) => (
              <div key={iht.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Pelaksanaan: {iht.tanggalPelaksanaan}
                  </span>
                  <span className="text-[10px] text-slate-400">{iht.peserta || '54 Pendidik'}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {iht.materiIht}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {iht.kesimpulan}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Log Aktivitas Real-time & Jadwal Pelajaran Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Aktivitas Real-Time */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Log Aktivitas Sistem Terkini
              </h3>
              <p className="text-xs text-slate-500">Audit trail pengguna eKurikulum MTs. Nurul Jadid</p>
            </div>
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onNavigate('admin-monitoring')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Panel Monitoring Penuh
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {log.userName} • <span className="font-medium text-emerald-600 dark:text-emerald-400">{log.action}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{log.module}: {log.details}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 shrink-0 ml-3">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 17 Ekstrakurikuler Madrasah */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600" />
                17 Ekstrakurikuler Panca Cinta
              </h3>
              <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 px-2 py-0.5 rounded">
                Selasa Sore
              </span>
            </div>

            <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {EKSTRAKURIKULER_LIST.map((eks) => (
                <div key={eks.no} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-400 w-4">{eks.no}.</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{eks.nama}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{eks.pembina.split(',')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            Terintegrasi Pembinaan Karakter KMA 1503 Tahun 2025
          </div>
        </div>
      </div>
    </div>
  );
};
