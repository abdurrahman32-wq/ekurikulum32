import React, { useState } from 'react';
import { Eye, FileCheck, Calendar, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { PendingModuleCard } from '../components/PendingModuleCard';

export const SupervisiAkademikView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'program' | 'instrumen' | 'jadwal' | 'laporan' | 'tindakLanjut'>('program');

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
        {[
          { key: 'program', label: '1. Program Supervisi Tahunan', icon: FileCheck },
          { key: 'instrumen', label: '2. Instrumen Observasi', icon: CheckSquare },
          { key: 'jadwal', label: '3. Jadwal Supervisi', icon: Calendar },
          { key: 'laporan', label: '4. Laporan Supervisi', icon: BookOpen },
          { key: 'tindakLanjut', label: '5. Tindak Lanjut', icon: Eye },
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

      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Penjaminan Mutu Pembelajaran: Supervisi Akademik Kepala Madrasah & Tim Pengembang Kurikulum
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
          Siklus Supervisi Klinis
        </span>
      </div>

      {/* SUB-MENU 1: PROGRAM SUPERVISI TAHUNAN */}
      {activeTab === 'program' && (
        <PendingModuleCard
          title="Program Supervisi Akademik Tahunan 2026/2027"
          category="Supervisi Akademik #1"
          description="Rancangan program pengawasan klinis yang disusun oleh Kepala Madrasah K. Miftahul Arifin, M.Pd bersama Waka Kurikulum. Bertujuan memantau penerapan Kurikulum Berbasis Cinta (KBC), efektivitas modul ajar, dan metode Deep Learning di ruang kelas."
          expectedDate="Pekan Ke-3 Semester Ganjil (September 2026)"
          regulasiRef="PMA No. 58 Tahun 2017 & Juknis Supervisi Kemenag RI"
          draftFields={[
            "Tujuan & Sasaran Supervisi 54 Dewan Guru",
            "Fokus Supervisi: Diferensiasi & KBC",
            "Pembagian Tim Supervisor & Guru Pamong",
            "Kriteria Penilaian Kinerja Guru (PKG)",
            "Tahapan Pra-Observasi, Kunjungan Kelas, & Pasca-Observasi"
          ]}
        />
      )}

      {/* SUB-MENU 2: INSTRUMEN OBSERVASI */}
      {activeTab === 'instrumen' && (
        <PendingModuleCard
          title="Instrumen Observasi Kelas & Telaah Modul Ajar"
          category="Supervisi Akademik #2"
          description="Rubrik standar penilaian kegiatan pembelajaran mencakup kesiapan perangkat ajar, apersepsi bernafaskan Panca Cinta, interaktivitas santri, penguasaan materi ajar, pemanfaatan laboratorium/media digital, serta asesmen autentik."
          expectedDate="Finalisasi Rubrik oleh Tim Mutu Madrasah"
          regulasiRef="Standar Proses KMA 1503 Tahun 2025"
          draftFields={[
            "Rubrik Telaah Modul Ajar / RPP",
            "Lembar Pengamatan Interaksi Santri di Kelas",
            "Penilaian Pembiasaan Akhlak & Karakter Santri",
            "Instrumen Pemanfaatan Teknologi Informasi",
            "Skor Kuantitatif (1 - 4) & Catatan Kualitatif Supervisor"
          ]}
        />
      )}

      {/* SUB-MENU 3: JADWAL SUPERVISI */}
      {activeTab === 'jadwal' && (
        <PendingModuleCard
          title="Jadwal Pelaksanaan Kunjungan Kelas Supervisi"
          category="Supervisi Akademik #3"
          description="Jadwal rotasi kunjungan kelas semester ganjil dan genap untuk seluruh guru mata pelajaran umum, agama, dan mulok pesantren. Disesuaikan dengan kalender pendidikan dan bebas dari jam sumatif."
          expectedDate="Sinkronisasi Jadwal Tatap Muka KBM"
          regulasiRef="Kalender Pendidikan MTs. Nurul Jadid 2026/2027"
          draftFields={[
            "Jadwal Supervisi Guru Mapel PAI & Bahasa Arab",
            "Jadwal Supervisi Guru Mapel Umum (IPA, MTK, B.Indo)",
            "Penetapan Guru Sasaran & Supervisor Pendamping",
            "Alokasi Waktu Pertemuan Balikan (Post-Conference)"
          ]}
        />
      )}

      {/* SUB-MENU 4: LAPORAN SUPERVISI */}
      {activeTab === 'laporan' && (
        <PendingModuleCard
          title="Laporan Hasil Analisis Supervisi Akademik"
          category="Supervisi Akademik #4"
          description="Rekapitulasi komprehensif data hasil observasi kelas, analisis kekuatan dan area perbaikan metode mengajar, serta pemetaan kompetensi pedagogik 54 guru MTs. Nurul Jadid."
          expectedDate="Akhir Semester Ganjil & Genap"
          regulasiRef="Sistem Penjaminan Mutu Internal (SPMI) Pesantren Nurul Jadid"
          draftFields={[
            "Distribusi Predikat Kinerja Guru (Amat Baik, Baik, Cukup)",
            "Analisis Kendala Pembelajaran di Kelas",
            "Portofolio Bukti Pelaksanaan Supervisi Klinis",
            "Pengesahan oleh Kepala Madrasah & Pengawas Kemenag"
          ]}
        />
      )}

      {/* SUB-MENU 5: TINDAK LANJUT */}
      {activeTab === 'tindakLanjut' && (
        <PendingModuleCard
          title="Rencana Tindak Lanjut (RTL) & Pendampingan Klinis"
          category="Supervisi Akademik #5"
          description="Program pembinaan pasca-supervisi meliputi workshop peningkatan kompetensi, In House Training (IHT), lesson study antar-guru serumpun, serta bimbingan teman sejawat (peer coaching)."
          expectedDate="Pascaterbitnya Laporan Evaluasi Supervisi"
          regulasiRef="Pedoman Pengembangan Keprofesian Berkelanjutan (PKB) Guru"
          draftFields={[
            "Rekomendasi Pelatihan Mandiri Platform Digital",
            "Pengikutsertaan Workshop MGMP & Balai Diklat",
            "Supervisi Ulang bagi Pendidik yang Memerlukan Bimbingan",
            "Pemberian Penghargaan (Reward) bagi Guru Berprestasi"
          ]}
        />
      )}
    </div>
  );
};
