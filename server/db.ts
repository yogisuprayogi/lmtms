import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
}

// Initialize Supabase Client securely with Service Role
export let supabase: any = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    console.log("[DB] Supabase Client successfully initialized with Cloud Storage Sync!");
  } catch (error) {
    console.error("[DB] Failed to initialize Supabase Client:", error);
  }
} else {
  console.warn("[DB] Supabase credentials not fully configured. Cloud storage sync will be disabled.");
}

// High-quality high school informatics initial seed data
export function getInitialSeeds() {
  const years = [
    { id: "tp-1", tahun: "2024/2025", semester: "GANJIL", aktif: false },
    { id: "tp-2", tahun: "2024/2025", semester: "GENAP", aktif: true },
    { id: "tp-3", tahun: "2025/2026", semester: "GANJIL", aktif: false },
  ];

  const users = [
    { id: "usr-admin", username: "admin", nama: "Administrator LMTMS", email: "admin@lmtms.sch.id", role: "ADMIN", password: "admin123", mfaEnabled: false, mfaSecret: "JBSWY3DPEHPK3PXP" },
    { id: "usr-yogi", username: "yogi", nama: "Yogi Suprayogi, S.Kom.", email: "yogisuprayogi02@guru.smk.belajar.id", role: "GURU", nip: "198905202015031002", password: "yogi123", mfaEnabled: false, mfaSecret: "OBQXG43XN5ZGI42K" },
    { id: "usr-ahmad", username: "ahmad", nama: "Ahmad Dhani", email: "ahmad@siswa.lmtms.sch.id", role: "SISWA", kelas: "X-1", nisn: "0081234561", password: "ahmad123", mfaEnabled: false, mfaSecret: "MFRGGZDFMZTWQ2LK" },
    { id: "usr-budi", username: "budi", nama: "Budi Setiawan", email: "budi@siswa.lmtms.sch.id", role: "SISWA", kelas: "X-1", nisn: "0081234562", password: "budi123", mfaEnabled: false, mfaSecret: "ONSWG4TFOQWW2L3M" },
    { id: "usr-citra", username: "citra", nama: "Citra Lestari", email: "citra@siswa.lmtms.sch.id", role: "SISWA", kelas: "X-1", nisn: "0081234563", password: "citra123", mfaEnabled: false, mfaSecret: "NFSG22LPNRQX22LP" },
    { id: "usr-dedi", username: "dedi", nama: "Dedi Kurniawan", email: "dedi@siswa.lmtms.sch.id", role: "SISWA", kelas: "X-1", nisn: "0081234564", password: "dedi123", mfaEnabled: false, mfaSecret: "MVXGGZDFMFTX22LP" },
    { id: "usr-elly", username: "elly", nama: "Elly Setyowati", email: "elly@siswa.lmtms.sch.id", role: "SISWA", kelas: "X-1", nisn: "0081234565", password: "elly123", mfaEnabled: false, mfaSecret: "OJXGGZDFMFTX22LP" },
  ];

  const materis = [
    {
      id: "mat-1",
      judul: "Pengenalan Berpikir Komputasional",
      deskripsi: "Materi dasar 4 pilar Berpikir Komputasional untuk Kelas X.",
      elemen: "BK",
      kelas: "X",
      tahunPelajaranId: "tp-2",
      tanggalDibuat: "2026-06-10",
      konten: `### Berpikir Komputasional (Computational Thinking)

Berpikir Komputasional (BK) adalah metode menyelesaikan persoalan dengan menerapkan teknik ilmu komputer. BK mencakup 4 pilar utama:

1. **Dekomposisi (Decomposition)**: Memecah masalah kompleks menjadi sub-masalah yang lebih kecil agar lebih mudah dikelola.
2. **Pengenalan Pola (Pattern Recognition)**: Mengidentifikasi kesamaan atau pola di antara dan di dalam masalah.
3. **Abstraksi (Abstraction)**: Memfokuskan hanya pada informasi penting dan mengabaikan detail yang kurang relevan.
4. **Algoritma (Algorithm)**: Mengembangkan solusi langkah-demi-langkah atau instruksi teratur untuk memecahkan persoalan.`
    },
    {
      id: "mat-2",
      judul: "Struktur Kontrol Percabangan di Python",
      deskripsi: "Materi algoritma percabangan (if-elif-else) dengan contoh studi kasus.",
      elemen: "AP",
      kelas: "X",
      tahunPelajaranId: "tp-2",
      tanggalDibuat: "2026-06-15",
      konten: `### Percabangan Python (if...elif...else)

Percabangan digunakan untuk mengambil keputusan logis dalam eksekusi kode program.

\`\`\`python
# Contoh penentuan kelulusan berdasarkan nilai kriteria
nilai = 78
if nilai >= 75:
    print("Siswa dinyatakan LULUS (Mencapai KKTP)")
else:
    print("Siswa memerlukan pendampingan remedial")
\`\`\`

#### Operator Perbandingan:
- \`==\` : Sama dengan
- \`!=\` : Tidak sama dengan
- \`>\` : Lebih besar dari
- \`<\` : Lebih kecil dari
- \`>=\` : Lebih besar dari atau sama dengan
- \`<=\` : Lebih kecil dari atau sama dengan`
    }
  ];

  const tugases = [
    {
      id: "tug-1",
      judul: "Kuis Diagnostik Berpikir Komputasional",
      instruksi: "Kerjakan kuis pilihan ganda berikut untuk menguji pemahaman awal Anda tentang 4 pilar Berpikir Komputasional.",
      elemen: "BK",
      kelas: "X",
      deadline: "2026-07-25",
      totalPoin: 100,
      tahunPelajaranId: "tp-2",
      tipe: "KUIS",
      soalKuis: [
        {
          id: "q-1",
          pertanyaan: "Metode memecah masalah besar menjadi bagian-bagian kecil yang lebih mudah dikelola disebut...",
          pilihan: ["Abstraksi", "Dekomposisi", "Pengenalan Pola", "Perancangan Algoritma"],
          jawabanBenar: 1
        },
        {
          id: "q-2",
          pertanyaan: "Ketika memfokuskan perhatian pada aspek penting dari suatu masalah dan mengabaikan yang tidak penting, kita melakukan...",
          pilihan: ["Abstraksi", "Dekomposisi", "Sintesis", "Debugging"],
          jawabanBenar: 0
        },
        {
          id: "q-3",
          pertanyaan: "Langkah-langkah terstruktur dan logis untuk menyelesaikan sebuah permasalahan disebut...",
          pilihan: ["Pola", "Abstraksi", "Algoritma", "Pseudocode"],
          jawabanBenar: 2
        }
      ]
    },
    {
      id: "tug-2",
      judul: "Tugas Praktikum Mandiri: Algoritma Kasir Sederhana",
      instruksi: "Buatlah program Python sederhana yang meminta input nama barang, harga, dan jumlah barang, lalu menampilkan total belanja siswa dengan output rapi.",
      elemen: "AP",
      kelas: "X",
      deadline: "2026-07-30",
      totalPoin: 100,
      tahunPelajaranId: "tp-2",
      tipe: "TUGAS_TERULIS"
    }
  ];

  const pengumpulanTugases = [
    {
      id: "peng-1",
      tugasId: "tug-1",
      siswaId: "usr-ahmad",
      siswaNama: "Ahmad Dhani",
      jawabanSiswa: JSON.stringify({ "q-1": 1, "q-2": 0, "q-3": 2 }), // Benar semua
      nilai: 100,
      catatanGuru: "Kuis dinilai otomatis oleh sistem LMTMS.",
      tanggalDikumpul: "2026-07-10T14:30:00Z",
      status: "SELESAI"
    },
    {
      id: "peng-2",
      tugasId: "tug-1",
      siswaId: "usr-budi",
      siswaNama: "Budi Setiawan",
      jawabanSiswa: JSON.stringify({ "q-1": 1, "q-2": 1, "q-3": 2 }), // Benar 2
      nilai: 67,
      catatanGuru: "Pelajari lagi perbedaan abstraksi dan dekomposisi ya budi.",
      tanggalDikumpul: "2026-07-11T09:15:00Z",
      status: "SELESAI"
    },
    {
      id: "peng-3",
      tugasId: "tug-2",
      siswaId: "usr-ahmad",
      siswaNama: "Ahmad Dhani",
      jawabanSiswa: `\`\`\`python
nama_barang = input("Masukkan nama barang: ")
harga = float(input("Masukkan harga: "))
jumlah = int(input("Masukkan jumlah: "))

total = harga * jumlah
print(f"Total belanja {nama_barang}: Rp {total:,.2f}")
\`\`\``,
      nilai: 95,
      catatanGuru: "Kode berjalan sempurna dengan formatting rupiah yang rapi. Mantap!",
      tanggalDikumpul: "2026-07-12T16:22:00Z",
      status: "SELESAI"
    }
  ];

  const absensis = [
    { id: "abs-1", tanggal: "2026-07-12", siswaId: "usr-ahmad", siswaNama: "Ahmad Dhani", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-2", tanggal: "2026-07-12", siswaId: "usr-budi", siswaNama: "Budi Setiawan", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-3", tanggal: "2026-07-12", siswaId: "usr-citra", siswaNama: "Citra Lestari", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-4", tanggal: "2026-07-12", siswaId: "usr-dedi", siswaNama: "Dedi Kurniawan", kelas: "X-1", status: "SAKIT", catatan: "Surat sakit terlampir", tahunPelajaranId: "tp-2" },
    { id: "abs-5", tanggal: "2026-07-12", siswaId: "usr-elly", siswaNama: "Elly Setyowati", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-6", tanggal: "2026-07-13", siswaId: "usr-ahmad", siswaNama: "Ahmad Dhani", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-7", tanggal: "2026-07-13", siswaId: "usr-budi", siswaNama: "Budi Setiawan", kelas: "X-1", status: "IZIN", catatan: "Acara keluarga", tahunPelajaranId: "tp-2" },
    { id: "abs-8", tanggal: "2026-07-13", siswaId: "usr-citra", siswaNama: "Citra Lestari", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-9", tanggal: "2026-07-13", siswaId: "usr-dedi", siswaNama: "Dedi Kurniawan", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-10", tanggal: "2026-07-13", siswaId: "usr-elly", siswaNama: "Elly Setyowati", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-11", tanggal: "2026-07-14", siswaId: "usr-ahmad", siswaNama: "Ahmad Dhani", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-12", tanggal: "2026-07-14", siswaId: "usr-budi", siswaNama: "Budi Setiawan", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-13", tanggal: "2026-07-14", siswaId: "usr-citra", siswaNama: "Citra Lestari", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-14", tanggal: "2026-07-14", siswaId: "usr-dedi", siswaNama: "Dedi Kurniawan", kelas: "X-1", status: "HADIR", tahunPelajaranId: "tp-2" },
    { id: "abs-15", tanggal: "2026-07-14", siswaId: "usr-elly", siswaNama: "Elly Setyowati", kelas: "X-1", status: "ALPA", tahunPelajaranId: "tp-2" },
  ];

  const perangkatPembelajarans = [
    {
      id: "doc-1",
      jenis: "MODUL_AJAR",
      judul: "Modul Ajar Berpikir Komputasional SMA Kelas X",
      elemen: "BK",
      kelas: "X",
      tahunPelajaranId: "tp-2",
      pembuatId: "usr-yogi",
      tanggalDibuat: "2026-07-11",
      konten: `# MODUL AJAR: BERPIKIR KOMPUTASIONAL (BK)

## 1. INFORMASI UMUM
- **Nama Penyusun**: Yogi Suprayogi, S.Kom.
- **Sekolah**: SMA Negeri 1 Informatika
- **Kelas / Fase**: X / Fase E
- **Tahun Ajaran**: 2024/2025 Genap
- **Alokasi Waktu**: 4 JP (2 x Pertemuan)

## 2. KOMPONEN INTI
### Tujuan Pembelajaran:
Siswa mampu memahami konsep Berpikir Komputasional (BK) yang mencakup dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma serta menerapkannya untuk merumuskan solusi atas berbagai masalah sehari-hari dengan kritis dan berkolaborasi.

### Pertanyaan Pemantik:
Bagaimana cara sistem navigasi peta di HP Anda merekomendasikan rute tercepat di sela-sela kemacetan secara real-time?

### Kegiatan Pembelajaran:
1. **Pertemuan 1**: Eksplorasi konsep 4 pilar BK menggunakan aktivitas un-plugged (studi kasus penyortiran logistik).
2. **Pertemuan 2**: Diskusi kelompok menerapkan BK untuk merancang langkah efisiensi pemanfaatan ruang perpustakaan sekolah.`
    },
    {
      id: "doc-2",
      jenis: "ATP",
      judul: "Alur Tujuan Pembelajaran Informatika Fase E",
      elemen: "AP",
      kelas: "X",
      tahunPelajaranId: "tp-2",
      pembuatId: "usr-yogi",
      tanggalDibuat: "2026-07-10",
      konten: `# ALUR TUJUAN PEMBELAJARAN (ATP)
## Mata Pelajaran: Informatika (Fase E - Kelas X)

### Alur Pencapaian Pembelajaran per Elemen:
1. **Eksplorasi BK**: Mempelajari cara mengabstraksikan sistem komputasi berukuran besar dan menengah.
2. **Implementasi AP (Algoritma & Pemrograman)**:
   - **Materi AP.1**: Memahami sintaks dasar, variabel, ekspresi, dan eksekusi sekuensial.
   - **Materi AP.2**: Menerapkan struktur kontrol keputusan (Conditional/If-Else).
   - **Materi AP.3**: Menerapkan struktur kontrol perulangan (For/While loops) untuk menyelesaikan deret matematika sederhana.
   - **Materi AP.4**: Mendeklarasikan dan memanggil fungsi buatan sendiri untuk memodulasi program.`
    }
  ];

  const activityLogs = [
    {
      id: "log-1",
      userId: "usr-yogi",
      nama: "Yogi Suprayogi, S.Kom.",
      role: "GURU",
      action: "LOGIN",
      details: "Berhasil masuk sistem menggunakan otentikasi kata sandi.",
      timestamp: "2026-07-15T08:30:00Z",
      ip: "127.0.0.1"
    },
    {
      id: "log-2",
      userId: "usr-yogi",
      nama: "Yogi Suprayogi, S.Kom.",
      role: "GURU",
      action: "CREATE_PERANGKAT",
      details: "Menyusun perangkat pembelajaran MODUL_AJAR Berpikir Komputasional SMA Kelas X.",
      timestamp: "2026-07-15T09:15:00Z",
      ip: "127.0.0.1"
    },
    {
      id: "log-3",
      userId: "usr-ahmad",
      nama: "Ahmad Dhani",
      role: "SISWA",
      action: "LOGIN",
      details: "Otentikasi berhasil via Portal Belajar Mandiri.",
      timestamp: "2026-07-15T11:00:00Z",
      ip: "192.168.1.50"
    }
  ];

  const rombels = [
    { id: "rom-1", nama: "X-1", tingkat: "X", waliKelasId: "usr-yogi" },
    { id: "rom-2", nama: "XI-1", tingkat: "XI", waliKelasId: "" },
    { id: "rom-3", nama: "XII-1", tingkat: "XII", waliKelasId: "" }
  ];
  const jadwals = [
    { id: "jad-1", hari: "Senin", jam: "08:00 - 09:30", kelas: "X-1", mapel: "Informatika (BK)", guruId: "usr-yogi" },
    { id: "jad-2", hari: "Selasa", jam: "10:00 - 11:30", kelas: "XI-1", mapel: "Informatika (AP)", guruId: "usr-yogi" }
  ];
  const calendarEvents = [
    { id: "cal-1", tanggal: "2026-07-20", judul: "Awal Semester Ganjil 2026/2027", jenis: "AKADEMIK" },
    { id: "cal-2", tanggal: "2026-08-17", judul: "HUT Kemerdekaan RI (Libur Nasional)", jenis: "LIBUR" },
    { id: "cal-3", tanggal: "2026-09-15", judul: "Penilaian Tengah Semester (PTS)", jenis: "UJIAN" }
  ];
  const guruMappings = [
    { id: "gmap-1", guruId: "usr-yogi", kelas: "X-1", elemen: "BK" },
    { id: "gmap-2", guruId: "usr-yogi", kelas: "X-1", elemen: "AP" }
  ];

  return {
    years,
    users,
    materis,
    tugases,
    pengumpulanTugases,
    absensis,
    perangkatPembelajarans,
    activityLogs,
    rombels,
    jadwals,
    calendarEvents,
    guruMappings,
  };
}

export function addActivityLog(userId: string, nama: string, role: string, action: string, details: string, ip?: string) {
  const db = readDB();
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    nama,
    role,
    action,
    details,
    timestamp: new Date().toISOString(),
    ip: ip || "127.0.0.1"
  };
  if (!db.activityLogs) {
    db.activityLogs = [];
  }
  db.activityLogs.unshift(newLog); // prepend to see latest first
  writeDB(db);
  return newLog;
}

// Read JSON database file
export function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      let changed = false;

      // Ensure all academic management arrays are initialized
      if (!parsed.rombels) {
        parsed.rombels = [
          { id: "rom-1", nama: "X-1", tingkat: "X", waliKelasId: "usr-yogi" },
          { id: "rom-2", nama: "XI-1", tingkat: "XI", waliKelasId: "" },
          { id: "rom-3", nama: "XII-1", tingkat: "XII", waliKelasId: "" }
        ];
        changed = true;
      }
      if (!parsed.jadwals) {
        parsed.jadwals = [
          { id: "jad-1", hari: "Senin", jam: "08:00 - 09:30", kelas: "X-1", mapel: "Informatika (BK)", guruId: "usr-yogi" },
          { id: "jad-2", hari: "Selasa", jam: "10:00 - 11:30", kelas: "XI-1", mapel: "Informatika (AP)", guruId: "usr-yogi" }
        ];
        changed = true;
      }
      if (!parsed.calendarEvents) {
        parsed.calendarEvents = [
          { id: "cal-1", tanggal: "2026-07-20", judul: "Awal Semester Ganjil 2026/2027", jenis: "AKADEMIK" },
          { id: "cal-2", tanggal: "2026-08-17", judul: "HUT Kemerdekaan RI (Libur Nasional)", jenis: "LIBUR" },
          { id: "cal-3", tanggal: "2026-09-15", judul: "Penilaian Tengah Semester (PTS)", jenis: "UJIAN" }
        ];
        changed = true;
      }
      if (!parsed.guruMappings) {
        parsed.guruMappings = [
          { id: "gmap-1", guruId: "usr-yogi", kelas: "X-1", elemen: "BK" },
          { id: "gmap-2", guruId: "usr-yogi", kelas: "X-1", elemen: "AP" }
        ];
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      }
      return parsed;
    }
  } catch (err) {
    console.error("[DB] Error reading db file, returning seeds:", err);
  }
  
  const seeds: any = getInitialSeeds();
  return seeds;
}

// Write to JSON database and trigger Supabase Upload
export function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    if (supabase) {
      syncToSupabase(data).catch((err) => {
        console.error("[DB] Async Supabase upload error:", err);
      });
    }
  } catch (err) {
    console.error("[DB] Error writing db file:", err);
  }
}

// Direct sync to Supabase Cloud
export async function syncToSupabase(dbData: any) {
  if (!supabase) return;
  try {
    const fileBody = JSON.stringify(dbData, null, 2);
    const { error } = await supabase.storage
      .from("lmtms")
      .upload("db.json", Buffer.from(fileBody), {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("[DB] Failed to upload to Supabase:", error);
    } else {
      console.log("[DB] Sync completed successfully to Supabase!");
    }
  } catch (err) {
    console.error("[DB] Unexpected error syncing to Supabase:", err);
  }
}

// Direct sync from Supabase Cloud
export async function syncFromSupabase() {
  if (!supabase) return;
  try {
    console.log("[DB] Fetching db.json from Supabase storage...");
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b: any) => b.name === "lmtms");
    if (!bucketExists) {
      await supabase.storage.createBucket("lmtms", { public: false });
    }

    const { data, error } = await supabase.storage
      .from("lmtms")
      .download("db.json");

    if (error) {
      if (error.message.includes("Object not found") || (error as any).status === 404) {
        console.log("[DB] No db.json found on cloud. Initializing with seed...");
        writeDB(getInitialSeeds());
      } else {
        console.error("[DB] Download error from Supabase:", error);
      }
    } else if (data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      console.log("[DB] Synced data successfully from Supabase storage!");
    }
  } catch (err) {
    console.error("[DB] Sync failed:", err);
  }
}
