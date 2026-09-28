import { 
  Student, 
  RombelItem,
  Teacher, 
  ProtaItem, 
  PromesItem, 
  ATPItem, 
  SKTugasGuruItem, 
  KisiKisiItem, 
  BankSoalItem, 
  EvaluasiItem, 
  PrestasiItem, 
  DokumentasiItem, 
  MateriIHTItem, 
  TemplateNilaiItem,
  AnnouncementItem,
  ActivityLogItem 
} from '../types';

export const MADRASAH_INFO = {
  name: "MTs. Nurul Jadid",
  yayasan: "Yayasan Nurul Jadid Paiton",
  biro: "Biro Pendidikan Nurul Jadid",
  nsm: "121235130004",
  npsn: "20581994",
  statusAkreditasi: "Terakreditasi A",
  alamat: "Jl. KH. Zaini Mun’im, Desa Karanganyar, Kec. Paiton, Kab. Probolinggo 67291",
  telepon: "(0335) 771731",
  website: "https://mtsnj.sch.id",
  tahunAjaran: "2026/2027",
  kepalaMadrasah: "K. Miftahul Arifin, M.Pd",
  niupKepala: "31820101786",
  komiteMadrasah: "Supandi, S.HI",
  wakaKurikulum: "Najibul Hoer, S.Si, M.Pd",
  visi: "TERBENTUKNYA MANUSIA BERIMAN, BERTAQWA, BERAKHLAQUL KARIMAH, BERILMU, BERWAWASAN LUAS, TERAMPIL DAN BERTANGGUNGJAWAB DALAM SOSIAL KEMASYARAKATAN",
  misi: [
    "Penanaman keilmuan yang mendalam dan aplikatif",
    "Pembinaan akhlaqul karimah berlandaskan nilai pesantren",
    "Mengembangkan kreatifitas dan inovasi murid",
    "Mengembangkan tradisi berpikir ilmiah dan kritis",
    "Mengembangkan pola pengajaran pakem, aktif, dan inovatif",
    "Mengembangkan sikap disiplin dan bertanggungjawab dalam bermasyarakat"
  ],
  branding: "Madrasah Religius-Globalis, Literasi, Saintis, dan Hijau",
  driveLinks: {
    sertifikat: "https://drive.google.com/drive/folders/137Lb0vjNoHeNilPbbRmCHzkpXiQgNOCT?usp=sharing",
    templateNilai: "https://drive.google.com/drive/folders/1T3PPcCoNA0LZ5fFlqPpR5H4r6xQ2kJrD?usp=sharing",
    rekapNilaiSmt1: "https://drive.google.com/drive/folders/1kRQrQs0Uy0bpkPAItHUqe28TXTwJ5B7g?usp=sharing",
    rekapNilaiSmt2: "https://drive.google.com/drive/folders/1kRQrQs0Uy0bpkPAItHUqe28TXTwJ5B7g?usp=sharing"
  }
};

// Clean initial data collections (Semua data dummy telah dihapus sesuai instruksi)
export const INITIAL_ROMBEL: RombelItem[] = [];
export const INITIAL_TEACHERS: Teacher[] = [];
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_PROTA: ProtaItem[] = [];
export const INITIAL_PROMES: PromesItem[] = [];
export const INITIAL_ATP: ATPItem[] = [];
export const INITIAL_SK_TUGAS: SKTugasGuruItem[] = [];
export const INITIAL_KISI_KISI: KisiKisiItem[] = [];
export const INITIAL_BANK_SOAL: BankSoalItem[] = [];
export const INITIAL_EVALUASI: EvaluasiItem[] = [];
export const INITIAL_PRESTASI: PrestasiItem[] = [];
export const INITIAL_DOKUMENTASI: DokumentasiItem[] = [];
export const INITIAL_IHT: MateriIHTItem[] = [];
export const INITIAL_NILAI: TemplateNilaiItem[] = [];
export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [];
export const INITIAL_LOGS: ActivityLogItem[] = [];

export const EKSTRAKURIKULER_LIST = [
  { no: 1, nama: "Pramuka", jadwal: "07.00 – 09.00", pembina: "Tim Pramuka NJ", status: "GTY", topik: "Cinta Tanah Air, Lingkungan, Allah", target: "Kepanduan & Kedisiplinan" },
  { no: 2, nama: "Mathematic and Science Club (MSC)", jadwal: "12.30 – 13.40", pembina: "Pembina MSC", status: "GTY", topik: "Cinta Ilmu", target: "Olimpiade & Penalaran Kritis" },
  { no: 3, nama: "Tahsin Al-Qur'an", jadwal: "12.30 – 13.40", pembina: "Pembina Tahsin", status: "GTY", topik: "Cinta Allah & Rasul", target: "Kaidah Tajwid & Makharijul Huruf" },
  { no: 4, nama: "Tilawatil Qur'an", jadwal: "12.30 – 13.40", pembina: "Pembina Tilawah", status: "GTY", topik: "Cinta Allah & Rasul", target: "Nagham & Seni Baca Qur'an" },
  { no: 5, nama: "Tahfidz Al-Qur'an", jadwal: "12.30 – 13.40", pembina: "Pembina Tahfidz", status: "GTY", topik: "Cinta Allah & Rasul", target: "Hafalan 30 Juz & Mutqin" },
  { no: 6, nama: "Pendalaman Kitab Kuning", jadwal: "12.30 – 13.40", pembina: "Pembina Madin", status: "GTY", topik: "Cinta Ilmu & Rasul", target: "Baca Kitab Gundul" },
  { no: 7, nama: "Bulu Tangkis", jadwal: "12.30 – 13.40", pembina: "Pembina Olahraga", status: "GTY", topik: "Cinta Diri & Sesama", target: "Kebugaran & Sportivitas" },
  { no: 8, nama: "Tenis Meja", jadwal: "12.30 – 13.40", pembina: "Pembina Olahraga", status: "GTY", topik: "Cinta Diri & Sesama", target: "Agilitas & Refleks" },
  { no: 9, nama: "Bola Voli", jadwal: "12.30 – 13.40", pembina: "Pembina Olahraga", status: "GTY", topik: "Cinta Diri & Sesama", target: "Kerjasama Tim & Sportivitas" },
  { no: 10, nama: "Pencak Silat (IPSI)", jadwal: "12.30 – 13.40", pembina: "Tim Silat NJ", status: "GTY", topik: "Cinta Diri & Sesama", target: "Seni Bela Diri & Karakter" },
  { no: 11, nama: "Hadrah Al-Banjari", jadwal: "12.30 – 13.40", pembina: "Pembina Seni Islami", status: "GTT", topik: "Cinta Allah & Rasul", target: "Pukulan Rebana & Vokal Sholawat" },
  { no: 12, nama: "Kaligrafi & Seni Islam", jadwal: "12.30 – 13.40", pembina: "Pembina Kaligrafi", status: "GTY", topik: "Cinta Ilmu & Seni", target: "Khat Naskhi, Diwani & Pameran" },
  { no: 13, nama: "Pidato Bahasa Inggris", jadwal: "12.30 – 13.40", pembina: "Pembina Bahasa", status: "GTY", topik: "Cinta Ilmu", target: "Public Speaking & Wawasan Global" },
  { no: 14, nama: "Pidato Bahasa Arab", jadwal: "12.30 – 13.40", pembina: "Pembina Bahasa", status: "GTY", topik: "Cinta Ilmu", target: "Fasahah Lughah & Khutbah" },
  { no: 15, nama: "Tata Boga", jadwal: "12.30 – 13.40", pembina: "Pembina Keterampilan", status: "GTY", topik: "Cinta Ilmu & Kemandirian", target: "Kewirausahaan Kuliner Halal" },
  { no: 16, nama: "Desain Grafis & Multimedia", jadwal: "12.30 – 13.40", pembina: "Tim IT Madrasah", status: "GTY", topik: "Cinta Ilmu & Digital", target: "Kreativitas Visual, Poster & Video" },
  { no: 17, nama: "Keterampilan Kreatif", jadwal: "12.30 – 13.40", pembina: "Pembina Seni", status: "GTT", topik: "Cinta Lingkungan", target: "Daur Ulang Sampah & Seni Kerajinan" }
];

export const KALENDER_DATA = {
  semesterGanjil: {
    totalHari: 116,
    bulan: [
      { nama: "Juli 2026", hariEfektif: 17, keterangan: "Awal Tahun Ajaran Baru (13 Juli 2026), Matsama" },
      { nama: "Agustus 2026", hariEfektif: 20, keterangan: "Proklamasi Kemerdekaan RI (17 Ags), Libur Maulid" },
      { nama: "September 2026", hariEfektif: 22, keterangan: "Maulid Nabi Muhammad SAW (12 Sept)" },
      { nama: "Oktober 2026", hariEfektif: 21, keterangan: "Sumatif Tengah Semester Ganjil (3-9 Okt), Hari Santri (22 Okt)" },
      { nama: "November 2026", hariEfektif: 21, keterangan: "Hari Guru (25 Nov), Pesta Demokrasi OSIM (21 Nov)" },
      { nama: "Desember 2026", hariEfektif: 15, keterangan: "Penilaian Madin, Sumatif Akhir Semester (SAS), Class Meeting" }
    ]
  },
  semesterGenap: {
    totalHari: 95,
    bulan: [
      { nama: "Januari 2027", hariEfektif: 20, keterangan: "Awal KBM Genap, Harlah & Haul Masyayikh PPNJ" },
      { nama: "Februari 2027", hariEfektif: 16, keterangan: "Kegiatan Ramadhan Intensif (6 - 22 Feb 2027)" },
      { nama: "Maret 2027", hariEfektif: 8, keterangan: "Libur Ramadhan & Hari Raya Idul Fitri 1448 H (23 Feb - 21 Mar), STS Genap" },
      { nama: "April 2027", hariEfektif: 21, keterangan: "Tes Kemampuan Akademik (TKA) Kelas IX" },
      { nama: "Mei 2027", hariEfektif: 18, keterangan: "Ujian Madrasah (UM) Kelas IX (4 - 22 Mei), Idul Adha 1448 H" },
      { nama: "Juni 2027", hariEfektif: 12, keterangan: "Sumatif Akhir Tahun, Tahun Baru Islam 1449 H, Rapor & Wisuda" }
    ]
  }
};
