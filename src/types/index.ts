export type UserRole = 'ADMIN' | 'KEPALA' | 'WAKAKUR' | 'WAKASIS' | 'HUMAS' | 'GURU';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
}

export interface AppAccount {
  id: string;
  username: string;
  namaLengkap: string;
  email: string;
  role: UserRole;
  jabatan: string;
  department: string;
  password?: string;
  status: 'aktif' | 'non-aktif';
  createdAt: string;
  lastLogin?: string;
}

export type Kelas = 'VII' | 'VIII' | 'IX';
export type Program = 'Agama' | 'Tahfidz' | 'Reguler';
export type StatusKeterangan = 'diajukan' | 'berjalan' | 'selesai' | 'rencana';
export type TingkatKejuaraan = 'Lokal' | 'Kecamatan' | 'Kabupaten' | 'Regional' | 'Karesidenan' | 'Provinsi' | 'Nasional' | 'Internasional';
export type KeteranganJuara = '1' | '2' | '3' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'Harapan I' | 'Harapan II' | string;

export interface RombelItem {
  id: string;
  no?: number;
  kelas: Kelas | string;
  program: Program | string;
  rombel: string; // '1' - '7'
  jumlahSiswa: number;
  keterangan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  no?: number;
  nama: string;
  kelas: Kelas;
  program: Program;
  rombel: string; // '1' - '7'
  nisn?: string;
  gender?: 'L' | 'P';
  alamat?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: string;
  no: number;
  niup: string;
  nama: string;
  gender: 'L' | 'P';
  kode: number;
  jabatanStruktural: string;
  walas?: string;
  mapel: string;
  jpKbm: number;
  jpJab: number;
  jpKeg?: number;
  totalJp: number;
}

export interface ProtaItem {
  id: string;
  semester?: 'Ganjil' | 'Genap';
  bulan: string;
  mingguKe?: string;
  jenisProgram: string;
  namaProgram: string;
  alokasiWaktu?: string;
  penanggungJawab?: string;
  keterangan: StatusKeterangan;
  createdAt?: string;
}

export interface PromesItem {
  id: string;
  semester?: 'Ganjil' | 'Genap';
  mingguKe: string;
  bulan: string;
  jenisProgram?: string;
  namaProgram: string;
  modulAjar?: string;
  targetOutput?: string;
  pj?: string;
  status?: string;
  keterangan?: StatusKeterangan;
  createdAt?: string;
}

export interface ATPItem {
  id: string;
  namaSatuanPendidikan?: string;
  mataPelajaran: string;
  fase?: string;
  faseKelas?: string;
  semester?: 'Ganjil' | 'Genap';
  tahunPelajaran?: string;
  penyusun?: string;
  ruangLingkupMateri?: string;
  elemenCP?: string;
  capaianPembelajaran?: string;
  tujuanPembelajaran: string;
  alokasiWaktu?: string;
  pilarKBC?: string;
  createdAt?: string;
}

export interface SKTugasGuruItem {
  id: string;
  namaGuru: string;
  niup?: string;
  nomorSk?: string;
  nomorSK?: string;
  jabatan?: string;
  jabatanStruktural?: string;
  mapelUtama?: string;
  kategoriMapel?: string;
  namaMapel?: string;
  rombelBinaan?: string;
  ekuivalensi?: string;
  bebanJp: number | string;
  keterangan?: string;
  createdAt?: string;
}

export interface KisiKisiItem {
  id: string;
  namaLembaga?: string;
  kelas: Kelas | string;
  program?: Program;
  mapel: string;
  semester?: string;
  bentukSoal?: string;
  jumlahSoal: number | string;
  kompetensiDasar?: string;
  uraianMateri?: string;
  indikatorSoal?: string;
  bobotSoal?: string;
  penyusun?: string;
  createdAt?: string;
}

export interface BankSoalItem {
  id: string;
  judul: string;
  mapel: string;
  kelas: Kelas | string;
  tipeUjian?: string;
  fileUrl?: string;
  pengunggah?: string;
  tanggalUpload?: string;
  fileName?: string;
  fileSize?: string;
  fileData?: string; // base64 or link
  tanggalUnggah?: string;
  pembuat?: string;
  jenisUjian?: string;
  createdAt?: string;
}

export interface EvaluasiItem {
  id: string;
  tipe: 'Tengah Semester' | 'Akhir Semester';
  semester?: 'Ganjil' | 'Genap';
  mataPelajaran?: string;
  kelas?: string;
  dayaSerap?: number;
  kendala?: string;
  tindakLanjut?: string;
  guruPengampu?: string;
  tanggalEvaluasi?: string;
  temuanLapangan?: string;
  evaluasi?: string;
  solusi?: string;
  keterangan?: StatusKeterangan;
  tahun?: string;
  createdAt?: string;
}

export interface PrestasiItem {
  id: string;
  jenis: 'Akademik' | 'Non-Akademik';
  namaLomba: string;
  tingkat: TingkatKejuaraan;
  keteranganJuara: KeteranganJuara;
  namaSiswa: string;
  kelas?: string;
  tahun: string;
  dokumentasiJuara?: string; // image url or base64
  cabang?: string;
  pembina?: string;
  createdAt?: string;
}

export interface DokumentasiItem {
  id: string;
  judul: string;
  keterangan: string;
  gambarUrl?: string;
  imageUrl?: string;
  tanggal: string;
  kategori?: string;
  createdAt?: string;
}

export interface MateriIHTItem {
  id: string;
  tema?: string;
  tanggal?: string;
  tempat?: string;
  jumlahPeserta?: number;
  status?: 'Selesai' | 'Terjadwal' | 'Persiapan';
  keterangan?: string;
  tanggalPelaksanaan?: string;
  materiIht?: string;
  kesimpulan?: string;
  tindakLanjut?: string;
  narasumber?: string;
  peserta?: string;
  createdAt?: string;
}

// Alias for IHTItem
export type IHTItem = MateriIHTItem;

export interface TemplateNilaiItem {
  id: string;
  namaSiswa: string;
  kelasProgram: string;
  jenisMapel: string;
  namaMapel: string;
  nilaiPengetahuan: string;
  nilaiKeterampilan: string;
  deskripsi: string;
  semester?: 'Ganjil' | 'Genap';
  createdAt?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  isUrgent: boolean;
  author: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  userId?: string;
  userName: string;
  userRole?: string;
  role?: string;
  action: string;
  targetModule?: string;
  module?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}
