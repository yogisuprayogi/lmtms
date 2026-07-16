-- =====================================================================
-- DATABASE ENGINEERING SCHEMA (POSTGRESQL / SUPABASE COMPATIBLE)
-- Sistem Manajemen Pembelajaran & Administrasi Guru Terpadu (LMTMS)
-- Khusus Informatika SMA Kurikulum Merdeka
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENUMS & EXTENSIONS
-- ---------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('ADMIN', 'GURU', 'SISWA');
CREATE TYPE semester_type AS ENUM ('GANJIL', 'GENAP');
CREATE TYPE tugas_tipe AS ENUM ('TUGAS_TERULIS', 'TUGAS_PRAKTIK', 'KUIS');
CREATE TYPE absensi_status AS ENUM ('HADIR', 'SAKIT', 'IZIN', 'ALPA');
CREATE TYPE submission_status AS ENUM ('BELUM_DINILAI', 'SELESAI');
CREATE TYPE perangkat_jenis AS ENUM ('MODUL_AJAR', 'ATP', 'PROTA', 'PROSEM');

-- ---------------------------------------------------------------------
-- 2. TABLES DEFINITIONS
-- ---------------------------------------------------------------------

-- A. Table: tahun_pelajaran (Academic Years)
CREATE TABLE tahun_pelajaran (
    id VARCHAR(50) PRIMARY KEY,
    tahun VARCHAR(20) NOT NULL,
    semester semester_type NOT NULL,
    aktif BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tahun_semester UNIQUE (tahun, semester)
);

-- B. Table: users (Accounts & Profiles)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role user_role NOT NULL,
    nip VARCHAR(30),
    nisn VARCHAR(20),
    kelas VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role_attributes CHECK (
        (role = 'GURU' AND nip IS NOT NULL AND nisn IS NULL AND kelas IS NULL) OR
        (role = 'SISWA' AND nisn IS NOT NULL AND kelas IS NOT NULL AND nip IS NULL) OR
        (role = 'ADMIN' AND nip IS NULL AND nisn IS NULL AND kelas IS NULL)
    )
);

-- C. Table: materis (Learning Materials)
CREATE TABLE materis (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    konten TEXT NOT NULL,
    elemen VARCHAR(10) NOT NULL, -- BK, AP, TIK, SK, JKI, AD, DSI, PLB
    kelas VARCHAR(10) NOT NULL,  -- X, XI, XII
    tahun_pelajaran_id VARCHAR(50) NOT NULL,
    tanggal_dibuat DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materi_tahun_pelajaran FOREIGN KEY (tahun_pelajaran_id) 
        REFERENCES tahun_pelajaran(id) ON DELETE CASCADE
);

-- D. Table: tugases (Assignments & Quizzes)
CREATE TABLE tugases (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    instruksi TEXT NOT NULL,
    elemen VARCHAR(10) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    deadline DATE NOT NULL,
    total_poin INTEGER DEFAULT 100,
    tipe tugas_tipe NOT NULL,
    soal_kuis JSONB, -- Simpan soal jika tipenya KUIS
    tahun_pelajaran_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tugas_tahun_pelajaran FOREIGN KEY (tahun_pelajaran_id) 
        REFERENCES tahun_pelajaran(id) ON DELETE CASCADE
);

-- E. Table: pengumpulan_tugas (Submissions)
CREATE TABLE pengumpulan_tugas (
    id VARCHAR(50) PRIMARY KEY,
    tugas_id VARCHAR(50) NOT NULL,
    siswa_id VARCHAR(50) NOT NULL,
    siswa_nama VARCHAR(150) NOT NULL,
    jawaban_siswa TEXT NOT NULL,
    nilai INTEGER,
    catatan_guru TEXT,
    tanggal_dikumpul TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status submission_status DEFAULT 'BELUM_DINILAI',
    CONSTRAINT fk_pengumpulan_tugas FOREIGN KEY (tugas_id) 
        REFERENCES tugases(id) ON DELETE CASCADE,
    CONSTRAINT fk_pengumpulan_siswa FOREIGN KEY (siswa_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT check_nilai_range CHECK (nilai >= 0 AND nilai <= 100)
);

-- F. Table: absensis (Daily Attendance)
CREATE TABLE absensis (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE NOT NULL,
    siswa_id VARCHAR(50) NOT NULL,
    siswa_nama VARCHAR(150) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    status absensi_status NOT NULL,
    catatan TEXT,
    tahun_pelajaran_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_absensi_siswa FOREIGN KEY (siswa_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_absensi_tahun_pelajaran FOREIGN KEY (tahun_pelajaran_id) 
        REFERENCES tahun_pelajaran(id) ON DELETE CASCADE,
    CONSTRAINT unique_absen_per_siswa_per_hari UNIQUE (tanggal, siswa_id, tahun_pelajaran_id)
);

-- G. Table: perangkat_pembelajaran (Teacher Administration)
CREATE TABLE perangkat_pembelajaran (
    id VARCHAR(50) PRIMARY KEY,
    jenis perangkat_jenis NOT NULL,
    judul VARCHAR(255) NOT NULL,
    elemen VARCHAR(10) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    tahun_pelajaran_id VARCHAR(50) NOT NULL,
    pembuat_id VARCHAR(50) NOT NULL,
    tanggal_dibuat DATE DEFAULT CURRENT_DATE,
    konten TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_perangkat_tahun_pelajaran FOREIGN KEY (tahun_pelajaran_id) 
        REFERENCES tahun_pelajaran(id) ON DELETE CASCADE,
    CONSTRAINT fk_perangkat_pembuat FOREIGN KEY (pembuat_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ---------------------------------------------------------------------
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_materis_tahun_pelajaran ON materis(tahun_pelajaran_id);
CREATE INDEX idx_tugases_tahun_pelajaran ON tugases(tahun_pelajaran_id);
CREATE INDEX idx_pengumpulan_tugas_id ON pengumpulan_tugas(tugas_id);
CREATE INDEX idx_pengumpulan_siswa_id ON pengumpulan_tugas(siswa_id);
CREATE INDEX idx_absensis_tanggal_kelas ON absensis(tanggal, kelas);
CREATE INDEX idx_perangkat_tahun_pel_jenis ON perangkat_pembelajaran(tahun_pelajaran_id, jenis);

-- ---------------------------------------------------------------------
-- 4. AUTOMATIC TRIGGERS & CONSTRAINTS
-- ---------------------------------------------------------------------

-- Trigger: Menjamin Hanya Satu Tahun Pelajaran yang Aktif Sekaligus
CREATE OR REPLACE FUNCTION set_single_active_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.aktif = TRUE THEN
        UPDATE tahun_pelajaran SET aktif = FALSE WHERE id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_active_year
BEFORE INSERT OR UPDATE ON tahun_pelajaran
FOR EACH ROW EXECUTE FUNCTION set_single_active_year();

-- ---------------------------------------------------------------------
-- 5. HIGH-QUALITY SEED DATA (INFORMATIKA SMA MERDEKA)
-- ---------------------------------------------------------------------

-- Seeding Tahun Pelajaran
INSERT INTO tahun_pelajaran (id, tahun, semester, aktif) VALUES
('tp-1', '2024/2025', 'GANJIL', FALSE),
('tp-2', '2024/2025', 'GENAP', TRUE),
('tp-3', '2025/2026', 'GANJIL', FALSE);

-- Seeding Users (Admin, Guru, Siswa)
INSERT INTO users (id, username, nama, email, role, nip, nisn, kelas) VALUES
('usr-admin', 'admin', 'Administrator LMTMS', 'admin@lmtms.sch.id', 'ADMIN', NULL, NULL, NULL),
('usr-yogi', 'yogi', 'Yogi Suprayogi, S.Kom.', 'yogisuprayogi02@guru.smk.belajar.id', 'GURU', '198905202015031002', NULL, NULL),
('usr-ahmad', 'ahmad', 'Ahmad Dhani', 'ahmad@siswa.lmtms.sch.id', 'SISWA', NULL, '0081234561', 'X-1'),
('usr-budi', 'budi', 'Budi Setiawan', 'budi@siswa.lmtms.sch.id', 'SISWA', NULL, '0081234562', 'X-1'),
('usr-citra', 'citra', 'Citra Lestari', 'citra@siswa.lmtms.sch.id', 'SISWA', NULL, '0081234563', 'X-1'),
('usr-dedi', 'dedi', 'Dedi Kurniawan', 'dedi@siswa.lmtms.sch.id', 'SISWA', NULL, '0081234564', 'X-1'),
('usr-elly', 'elly', 'Elly Setyowati', 'elly@siswa.lmtms.sch.id', 'SISWA', NULL, '0081234565', 'X-1');

-- Seeding Materis
INSERT INTO materis (id, judul, deskripsi, konten, elemen, kelas, tahun_pelajaran_id, tanggal_dibuat) VALUES
('mat-1', 'Pengenalan Berpikir Komputasional', 'Materi dasar 4 pilar Berpikir Komputasional untuk Kelas X.', 
'### Berpikir Komputasional (Computational Thinking)
Berpikir Komputasional adalah metode menyelesaikan persoalan dengan menerapkan teknik ilmu komputer. BK mencakup 4 pilar utama:
1. **Dekomposisi**: Memecah masalah kompleks menjadi sub-masalah kecil.
2. **Pengenalan Pola**: Mengidentifikasi kesamaan di dalam masalah.
3. **Abstraksi**: Memfokuskan hanya pada informasi penting.
4. **Algoritma**: Mengembangkan solusi langkah-demi-langkah.', 
'BK', 'X', 'tp-2', '2026-06-10'),

('mat-2', 'Struktur Kontrol Percabangan di Python', 'Materi algoritma percabangan (if-elif-else) dengan contoh studi kasus.', 
'### Percabangan Python (if...elif...else)
Percabangan digunakan untuk mengambil keputusan logis dalam eksekusi kode program.
```python
nilai = 78
if nilai >= 75:
    print("Siswa dinyatakan LULUS (Mencapai KKTP)")
else:
    print("Siswa memerlukan pendampingan remedial")
```', 
'AP', 'X', 'tp-2', '2026-06-15');

-- Seeding Tugases
INSERT INTO tugases (id, judul, instruksi, elemen, kelas, deadline, total_poin, tipe, soal_kuis, tahun_pelajaran_id) VALUES
('tug-1', 'Kuis Diagnostik Berpikir Komputasional', 'Kerjakan kuis pilihan ganda berikut untuk menguji pemahaman awal Anda tentang 4 pilar Berpikir Komputasional.', 'BK', 'X', '2026-07-25', 100, 'KUIS', 
'[
  {"id": "q-1", "pertanyaan": "Metode memecah masalah besar menjadi bagian-bagian kecil disebut...", "pilihan": ["Abstraksi", "Dekomposisi", "Pengenalan Pola", "Algoritma"], "jawabanBenar": 1},
  {"id": "q-2", "pertanyaan": "Ketika memfokuskan perhatian pada aspek penting, kita melakukan...", "pilihan": ["Abstraksi", "Dekomposisi", "Sintesis", "Debugging"], "jawabanBenar": 0}
]', 'tp-2'),
('tug-2', 'Tugas Praktikum Mandiri: Kasir Sederhana', 'Buatlah program Python sederhana yang meminta input nama barang, harga, dan jumlah barang, lalu menampilkan total belanja.', 'AP', 'X', '2026-07-30', 100, 'TUGAS_TERULIS', NULL, 'tp-2');

-- Seeding Pengumpulan Tugas
INSERT INTO pengumpulan_tugas (id, tugas_id, siswa_id, siswa_nama, jawaban_siswa, nilai, catatan_guru, status) VALUES
('peng-1', 'tug-1', 'usr-ahmad', 'Ahmad Dhani', '{"q-1": 1, "q-2": 0}', 100, 'Kuis dinilai otomatis oleh sistem LMTMS.', 'SELESAI'),
('peng-2', 'tug-1', 'usr-budi', 'Budi Setiawan', '{"q-1": 1, "q-2": 1}', 50, 'Pelajari lagi perbedaan abstraksi dan dekomposisi ya budi.', 'SELESAI');

-- Seeding Absensis
INSERT INTO absensis (id, tanggal, siswa_id, siswa_nama, kelas, status, catatan, tahun_pelajaran_id) VALUES
('abs-1', '2026-07-12', 'usr-ahmad', 'Ahmad Dhani', 'X-1', 'HADIR', NULL, 'tp-2'),
('abs-2', '2026-07-12', 'usr-budi', 'Budi Setiawan', 'X-1', 'HADIR', NULL, 'tp-2'),
('abs-3', '2026-07-12', 'usr-citra', 'Citra Lestari', 'X-1', 'HADIR', NULL, 'tp-2'),
('abs-4', '2026-07-12', 'usr-dedi', 'Dedi Kurniawan', 'X-1', 'SAKIT', 'Surat sakit terlampir', 'tp-2'),
('abs-5', '2026-07-12', 'usr-elly', 'Elly Setyowati', 'X-1', 'HADIR', NULL, 'tp-2');

-- Seeding Perangkat Pembelajaran
INSERT INTO perangkat_pembelajaran (id, jenis, judul, elemen, kelas, tahun_pelajaran_id, pembuat_id, tanggal_dibuat, konten) VALUES
('doc-1', 'MODUL_AJAR', 'Modul Ajar Berpikir Komputasional SMA Kelas X', 'BK', 'X', 'tp-2', 'usr-yogi', '2026-07-11', 
'# MODUL AJAR: BERPIKIR KOMPUTASIONAL (BK)
## 1. INFORMASI UMUM
- **Nama Penyusun**: Yogi Suprayogi, S.Kom.
- **Sekolah**: SMA Negeri 1 Informatika
- **Kelas / Fase**: X / Fase E
- **Tahun Ajaran**: 2024/2025 Genap
- **Alokasi Waktu**: 4 JP (2 x Pertemuan)

## 2. KOMPONEN INTI
### Tujuan Pembelajaran:
Siswa mampu memahami konsep Berpikir Komputasional (BK) yang mencakup dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma.');
