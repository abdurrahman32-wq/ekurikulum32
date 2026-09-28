import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Printer, 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Search, 
  Bookmark, 
  Compass, 
  HeartHandshake, 
  Sparkles,
  Share2
} from 'lucide-react';
import { MADRASAH_INFO } from '../../data/initialData';
import { exportTableToPDF } from '../../utils/exportUtils';

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  sections: {
    title: string;
    content: string[];
    highlights?: string[];
  }[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 'bab1',
    number: 'BAB I',
    title: 'Karakteristik & Profil Satuan Pendidikan',
    subtitle: 'Landasan Religius, Filosofis, Sosio-Kultural, dan Regulasi KMA No. 1503 Tahun 2025',
    sections: [
      {
        title: 'A. Konteks Geografis, Sosial, dan Budaya Pesantren',
        content: [
          'Madrasah Tsanawiyah (MTs) Nurul Jadid berlokasi di lingkungan Pondok Pesantren Nurul Jadid Karanganyar, Paiton, Probolinggo. Posisi strategis ini menempatkan madrasah sebagai episentrum integrasi sains modern dan keilmuan kepesantrenan salafiyah.',
          'Karakteristik santri berasal dari berbagai penjuru Nusantara dengan keragaman budaya dan bahasa yang disatukan dalam bingkai ukhuwah islamiyah dan kedisiplinan asrama pesantren 24 jam.',
          'Penyelenggaraan pendidikan mengintegrasikan Kurikulum Berbasis Cinta (KBC) dan prinsip Pembelajaran Mendalam (Deep Learning) untuk mewujudkan profil lulusan yang berilmu amaliyah dan beramal ilmiah.'
        ],
        highlights: [
          'Trilogi Santri Nurul Jadid: 1. Memperhatikan kewajiban fardlu ain; 2. Mawas diri dengan meninggalkan dosa besar; 3. Berbudi luhur kepada sesama makhluk.',
          'Panca Kesadaran Santri: Kesadaran Beragama, Kesadaran Berilmu, Kesadaran Berbangsa & Bernegara, Kesadaran Bermasyarakat, dan Kesadaran Berorganisasi.'
        ]
      },
      {
        title: 'B. Landasan Hukum & Regulasi Operasional Kurikulum',
        content: [
          'Undang-Undang Republik Indonesia Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.',
          'Keputusan Menteri Agama (KMA) Nomor 1503 Tahun 2025 tentang Pedoman Implementasi Kurikulum Madrasah Berbasis Deep Learning & Cinta.',
          'Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 12 Tahun 2024 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Menengah.',
          'Surat Keputusan Kepala Madrasah Tsanawiyah Nurul Jadid Nomor: NJ-H/15/018/A.III/07.2026 tentang Pemberlakuan Kurikulum Madrasah Tahun Pelajaran 2026/2027.'
        ]
      }
    ]
  },
  {
    id: 'bab2',
    number: 'BAB II',
    title: 'Visi, Misi, dan Tujuan Madrasah',
    subtitle: 'Arah Kebijakan Strategis Jangka Pendek, Menengah, dan Profil Pelajar Rahmatan Lil Alamin',
    sections: [
      {
        title: 'A. Visi Madrasah Tsanawiyah Nurul Jadid',
        content: [
          '"Terwujudnya Generasi Santri yang Saleh, Unggul dalam IPTEK, Berkarakter Berbasis Cinta, serta Berwawasan Global yang Berpijak pada Nilai-Nilai Kepesantrenan."'
        ],
        highlights: [
          'Indikator Utama Visi: Keimanan kokoh, hafalan Al-Qur\'an mutqin, kecakapan literasi numerasi tinggi, penguasaan Bahasa Arab & Inggris aktif, dan kepedulian ekoteologi lingkungan.'
        ]
      },
      {
        title: 'B. Misi Madrasah',
        content: [
          '1. Menyelenggarakan pendidikan keagamaan mendalam (Tafaqquh Fiddin) yang memadukan kitab kuning turats dan kurikulum standar nasional kemenag.',
          '2. Mengembangkan pembelajaran bermakna (meaningful), menyenangkan (joyful), dan berkesadaran penuh (mindful) melalui pendekatan Deep Learning.',
          '3. Menumbuhkan budaya cinta: cinta kepada Allah dan Rasul-Nya, cinta ilmu pengetahuan, cinta sesama manusia, dan cinta kelestarian alam lingkungan.',
          '4. Melaksanakan tata kelola madrasah yang akuntabel, transparan, dan berbasis teknologi digital (eKurikulum & RDM).'
        ]
      },
      {
        title: 'C. Tujuan Satuan Pendidikan Jangka Menengah (2026-2029)',
        content: [
          'Mencapai tingkat kelulusan santri 100% dengan rata-rata nilai Asesmen Madrasah kategori Amat Baik.',
          'Memastikan seluruh lulusan Program Agama menguasai dasar-dasar Nahwu-Shorrof (Kitab Al-Jurumiyah dan Al-Amtsilah At-Tashrifiyah).',
          'Mencetak minimal 80% santri Program Tahfidz tuntas hafalan Al-Qur\'an sesuai target 3 Juz s/d 10 Juz.',
          'Meningkatkan partisipasi dan perolehan medali kompetisi akademik (KSM, OSN, Myres, MQK) di tingkat kabupaten, provinsi, dan nasional.'
        ]
      }
    ]
  },
  {
    id: 'bab3',
    number: 'BAB III',
    title: 'Pengorganisasian Pembelajaran',
    subtitle: 'Struktur Kurikulum, Beban Belajar Peminatan, Muatan Lokal Pesantren, dan Proyek P5RA',
    sections: [
      {
        title: 'A. Struktur Program & Alokasi Waktu Belajar (JP)',
        content: [
          'Pembelajaran diselenggarakan selama 6 hari kerja dengan sistem terintegrasi asrama pesantren. Total alokasi jam pelajaran mencakup mata pelajaran umum kemenag, kepesantrenan, dan muatan lokal unggulan.',
          'Struktur Peminatan Terbagi Menjadi 3 Program Unggulan:',
          '1. Program Agama: Fokus pendalaman Turats, Nahwu, Shorrof, Fikih Sullamut Taufiq, dan Balaghah (44 JP/minggu).',
          '2. Program Tahfidz: Fokus Tahsin qiraah Al-Qur\'an, Ziyadah hafalan Al-Qur\'an terstruktur, Murajaah harian, dan Tajwid Jazariyah (32 JP/minggu + asrama).',
          '3. Program Reguler: Fokus penguatan Sains IPA, Matematika, Informatika, Bahasa Asing, dan Riset Santri Terapan (32 JP/minggu).'
        ],
        highlights: [
          'Muatan Lokal Wajib: Nahwu & Shorrof Terapan, Bahasa Madura/Arab Pegon, dan Ke-Nurul-Jadidan.',
          'Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil Alamin (P5RA): Alokasi 20% dari total JP per tahun dengan tema "Gaya Hidup Berkelanjutan (Santri Hijau)" dan "Kearifan Lokal Pesantren".'
        ]
      },
      {
        title: 'B. Pendekatan Pembelajaran Mendalam (Deep Learning)',
        content: [
          'Kurikulum Berbasis Cinta (KBC) di MTs. Nurul Jadid memposisikan guru sebagai fasilitator cinta yang mendampingi santri melalui 3 pilar Deep Learning:',
          '1. Mindful Learning (Belajar Berkesadaran): Santri diajak menyadari tujuan belajarnya sebagai ibadah, mengikis kecemasan belajar, dan hadir utuh jiwa raga di kelas.',
          '2. Meaningful Learning (Belajar Bermakna): Mengaitkan setiap dalil keagamaan dan konsep sains dengan pengalaman hidup nyata santri di pesantren dan masyarakat.',
          '3. Joyful Learning (Belajar Menyenangkan): Suasana kelas yang hangat, apresiatif, interaktif, kolaboratif tanpa perundungan (zero-bullying).'
        ]
      }
    ]
  },
  {
    id: 'bab4',
    number: 'BAB IV',
    title: 'Perencanaan Pembelajaran & Asesmen',
    subtitle: 'Alur Tujuan Pembelajaran (ATP), Modul Ajar Terintegrasi, dan Sistem Evaluasi Komprehensif',
    sections: [
      {
        title: 'A. Perencanaan Pembelajaran (ATP & Modul Ajar)',
        content: [
          'Setiap guru menyusun dokumen perencanaan pembelajaran berdasarkan Capaian Pembelajaran (CP) terbaru KMA 1503/2025.',
          'Komponen Modul Ajar dirancang ringkas, kontekstual, dan memuat diferensiasi konten, proses, serta produk belajar.',
          'Integrasi nilai-nilai Trilogi Santri dan Ekoteologi tercantum secara eksplisit pada kegiatan inti apersepsi dan refleksi pembelajaran.'
        ]
      },
      {
        title: 'B. Sistem Asesmen & Penilaian Hasil Belajar',
        content: [
          '1. Asesmen Diagnostik (Awal Pembelajaran): Mengidentifikasi kesiapan belajar, gaya belajar, dan pemetaan hafalan santri baru.',
          '2. Asesmen Formatif: Dilaksanakan sepanjang KBM berupa unjuk kerja, observasi keaktifan, kuis interaktif, dan refleksi santri tanpa bobot angka penentu rapor.',
          '3. Asesmen Sumatif Lingkup Materi & Akhir Semester (ASAS): Dilaksanakan berbasis komputer (CBT eKurikulum) dan tes lisan turats/tahfidz.',
          '4. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): Menggunakan interval nilai berbasis rubrik kualitatif dan kuantitatif.'
        ],
        highlights: [
          'Penilaian Sikap Spiritual & Sosial diintegrasikan dengan Sistem Buku Kendali Kedisiplinan Asrama Pesantren Nurul Jadid.'
        ]
      }
    ]
  },
  {
    id: 'bab5',
    number: 'BAB V',
    title: 'Pendampingan, Evaluasi, dan PKB',
    subtitle: 'Supervisi Akademik Berkelanjutan, Pengembangan Keprofesian Berkelanjutan, dan Audit Mutu',
    sections: [
      {
        title: 'A. Pendampingan Klinis & Supervisi Akademik',
        content: [
          'Supervisi akademik dilaksanakan secara berkala oleh Kepala Madrasah, Pengawas Kemenag, dan Guru Senior.',
          'Pendekatan supervisi mengedepankan coaching kolegial dan refleksi perbaikan mutu, bukan sekadar inspeksi administratif.',
          'Jadwal supervisi semester ganjil dan genap dijadwalkan secara transparan melalui menu Supervisi Akademik pada portal eKurikulum.'
        ]
      },
      {
        title: 'B. Pengembangan Keprofesian Berkelanjutan (PKB)',
        content: [
          'Partisipasi aktif dalam kegiatan Musyawarah Guru Mata Pelajaran (MGMP) Kabupaten Probolinggo dan MGMP Internal Yayasan Nurul Jadid.',
          'Pelatihan penulisan karya ilmiah guru, riset tindakan kelas (PTK), dan digitalisasi media ajar berbasis AI Studio dan Canva Edu.',
          'Sertifikasi guru pendidik dan uji kompetensi berkala bagi seluruh dewan guru pamong.'
        ]
      }
    ]
  }
];

export const KurikulumDigitalReader: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('bab1');
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const currentChapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'DOKUMEN KURIKULUM MADRASAH TSANAWIYAH NURUL JADID',
      subtitle: `Tahun Pelajaran 2026/2027 • ${currentChapter.number}: ${currentChapter.title}`,
      headers: ['Bagian', 'Muatan & Regulasi'],
      rows: currentChapter.sections.map(s => [
        s.title,
        s.content.join('\n') + (s.highlights ? '\n\nCatatan Penting:\n' + s.highlights.join('\n') : '')
      ]),
      fileName: `Kurikulum_${currentChapter.number.replace(/\s+/g, '_')}_MTs_Nurul_Jadid`,
      orientation: 'portrait'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Reading Controls & Search */}
      <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ukuran Teks:</span>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                fontSize === 'sm' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('md')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                fontSize === 'md' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Standar
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                fontSize === 'lg' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              A+
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Bab ke PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Chapter Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {CHAPTERS.map(ch => {
          const isSelected = ch.id === selectedChapterId;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChapterId(ch.id)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {ch.number}
                </span>
                <div className="font-extrabold text-xs mt-1.5 line-clamp-1">{ch.title}</div>
              </div>
              <div className={`text-[10px] mt-2 flex items-center gap-1 font-medium ${
                isSelected ? 'text-emerald-100' : 'text-slate-400'
              }`}>
                Baca Bab <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chapter Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Chapter Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg">
              {currentChapter.number}
            </span>
            <span className="text-xs text-slate-400 font-medium">Buku Dokumen Kurikulum Resmi</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {currentChapter.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentChapter.subtitle}
          </p>
        </div>

        {/* Chapter Sections */}
        <div className={`space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed ${
          fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          {currentChapter.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-extrabold text-base text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                {sec.title}
              </h3>
              <div className="space-y-2">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-justify leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {sec.highlights && (
                <div className="mt-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600 dark:border-emerald-500 space-y-1.5">
                  <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Poin Kunci & Nilai Khusus Madrasah:
                  </div>
                  {sec.highlights.map((hl, hlIdx) => (
                    <div key={hlIdx} className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      • {hl}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chapter Footer / Sign-off */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Ditetapkan di Paiton • Kepala MTs. Nurul Jadid: <strong className="text-slate-800 dark:text-slate-200">{MADRASAH_INFO.kepalaMadrasah}</strong>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Telah divalidasi oleh Tim Pengembang Kurikulum Madrasah
          </div>
        </div>
      </div>
    </div>
  );
};
