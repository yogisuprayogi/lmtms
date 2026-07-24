// Definisi tipe data terpadu untuk LMTMS Informatika SMA

export type Role = 'ADMIN' | 'GURU' | 'SISWA';

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  role: Role;
  kelas?: string; // Khusus siswa (misal: "X-1", "XI-IPA-2")
  nisn?: string;  // Khusus siswa
  nip?: string;   // Khusus guru
  foto?: string;  // Base64 data URL atau foto profil
  mfaEnabled?: boolean;
  mfaSecret?: string;
  password?: string;
}

export interface TahunPelajaran {
  id: string;
  tahun: string; // Misal: "2024/2025"
  semester: 'GANJIL' | 'GENAP';
  aktif: boolean;
}

export interface ElemenInformatika {
  kode: string;
  nama: string;
  deskripsi: string;
}

// Elemen Resmi Kurikulum Merdeka Informatika (SK BSKAP Kemendikdasmen No. 046/H/KR/2025)
export const ELEMEN_INFORMATIKA: ElemenInformatika[] = [
  {
    kode: 'BK',
    nama: 'Berpikir Komputasional',
    deskripsi: 'Kemampuan untuk menyelesaikan masalah secara sistematis dan berjenjang melalui pemodelan dan melalui simulasi untuk menghasilkan solusi efektif, efisien, dan optimal yang dapat dijalankan oleh manusia atau mesin meliputi penalaran logis, kritis, dan kreatif berdasarkan data, baik secara mandiri maupun berkolaborasi.'
  },
  {
    kode: 'LD',
    nama: 'Literasi Digital',
    deskripsi: 'Kecakapan bermedia digital, berperilaku etis dan berbudaya di dunia digital, berkemampuan menjaga keamanan diri dan lingkungan, serta memiliki kenyamanan dan keseimbangan hidup di dunia nyata sekaligus dunia maya.'
  },
  {
    kode: 'AD',
    nama: 'Analisis Data',
    deskripsi: 'Kemampuan untuk menstrukturkan, menginput, memproses (antara lain menganalisis, mengambil kesimpulan, membuat keputusan, dan memprediksi), dan menyajikan data dalam berbagai bentuk representasi, seperti teks, audio, gambar, dan video.'
  },
  {
    kode: 'AP',
    nama: 'Algoritma dan Pemrograman',
    deskripsi: 'Mengembangkan solusi dari berbagai persoalan dengan membaca bermakna dan menulis teks algoritmik terstruktur (logis, sistematis, bertahap, konvergen, dan linier) menjadi kumpulan instruksi yang dapat dikerjakan orang lain atau komputer, berdasarkan paradigma pemrograman prosedural dengan ukuran dan kompleksitas program yang menaik secara bertahap dan berjenjang, dapat dikerjakan secara mandiri atau berkolaborasi dengan yang lain.'
  }
];

export interface PerangkatPembelajaran {
  id: string;
  jenis: 'SILABUS' | 'ATP' | 'MODUL_AJAR' | 'PROTA' | 'PROMES';
  judul: string;
  elemen: string; // Kode elemen (misal: "BK", "AP")
  kelas: 'X' | 'XI' | 'XII';
  konten: string; // Markdown format
  tahunPelajaranId: string;
  pembuatId: string;
  tanggalDibuat: string;
}

export interface Materi {
  id: string;
  judul: string;
  deskripsi: string;
  konten: string; // Markdown format
  elemen: string; // Kode elemen
  kelas: 'X' | 'XI' | 'XII';
  lampiranUrl?: string;
  tanggalDibuat: string;
  tipe?: 'TEKS' | 'FILE' | 'LINK';
  fileNama?: string;
  fileTipe?: string;
  fileUkuran?: string;
  fileData?: string; // Base64 data url
}

export interface Tugas {
  id: string;
  judul: string;
  instruksi: string;
  elemen: string;
  kelas: 'X' | 'XI' | 'XII';
  deadline: string;
  totalPoin: number;
  tipe: 'TUGAS_TERULIS' | 'KUIS';
  soalKuis?: SoalKuis[]; // Jika tipenya KUIS
  tahunPelajaranId?: string;

  // FITUR PENUGASAN BERKAS & INPUT TEKS
  modePengumpulan?: 'TEKS' | 'FILE' | 'TEKS_DAN_FILE';
  maxFileSizeMb?: number; // Batas ukuran berkas dalam MB (misal 5, 10, 25, 50, 100)
  allowedFileTypes?: string[]; // Daftar ekstensi yang diizinkan (misal: doc, docx, pdf, xls, xlsx, ppt, pptx, gif, png, jpg, mp3, wav, mp4, webm, zip)
}

export interface SoalKuis {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenar: number; // Index pilihan (0-3)
}

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  siswaId: string;
  siswaNama: string;
  jawabanSiswa: string; // Teks jawaban atau pilihan jawaban kuis (JSON)
  nilai?: number;
  catatanGuru?: string;
  tanggalDikumpul: string;
  status: 'BELUM_DINILAI' | 'SELESAI';

  // UNGGAH BERKAS SISWA
  fileNama?: string;
  fileTipe?: string;
  fileUkuran?: number; // Ukuran dalam bytes
  fileData?: string; // Base64 data URL berkas
}

export interface Absensi {
  id: string;
  tanggal: string; // YYYY-MM-DD
  siswaId: string;
  siswaNama: string;
  kelas: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
  catatan?: string;
}

export interface Analitika {
  kehadiranRataRata: number;
  tugasDiselesaikan: number;
  nilaiRataRata: number;
  distribusiNilai: { rentang: string; jumlah: number }[];
  pencapaianElemen: { elemen: string; nilai: number }[];
}
