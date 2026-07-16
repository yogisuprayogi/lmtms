# Arsitektur Sistem LMTMS (UML & Flowchart)

Dokumen ini menjelaskan rancangan sistem terpadu **LMTMS (Informatika SMA)** melalui diagram UML (*Unified Modeling Language*) dan Alur Kerja (*Flowchart*) interaktif berbasis Mermaid.

---

## 1. Diagram UML (Unified Modeling Language)

### 1.1 Use Case Diagram
Diagram use case berikut mendefinisikan batasan peran (Role-Based Access Control) antara aktor: **Administrator**, **Guru**, dan **Siswa** di dalam Portal LMTMS.

```mermaid
usecaseDiagram
    actor Administrator as "Administrator (Tata Usaha)"
    actor Guru as "Guru Informatika"
    actor Siswa as "Siswa"

    %% Administrator Use Cases
    Administrator --> (Login & Autentikasi Keamanan)
    Administrator --> (Kelola Akun Guru & Siswa)
    Administrator --> (Kelola Tahun Pelajaran & Semester)
    Administrator --> (Kelola Rombongan Belajar / Kelas)
    Administrator --> (Kelola Kalender Akademik Sekolah)
    Administrator --> (Pantau Log Aktivitas Server)

    %% Guru Use Cases
    Guru --> (Login & Autentikasi Keamanan)
    Guru --> (Buat Rencana Pembelajaran / Perangkat)
    Guru --> (Gunakan AI Assistant & Draft Otomatis)
    Guru --> (Terbitkan Materi Pembelajaran)
    Guru --> (Kelola Presensi Kehadiran Kelas)
    Guru --> (Buat & Berikan Penilaian Tugas)
    Guru --> (Lihat Analitika & Grafik Statistik)

    %% Siswa Use Cases
    Siswa --> (Login & Autentikasi Keamanan)
    Siswa --> (Lihat Jadwal Pelajaran & Kalender)
    Siswa --> (Akses Materi Pembelajaran Mandiri)
    Siswa --> (Unggah Pengumpulan Tugas / Kuis)
    Siswa --> (Lihat Hasil Rekap Penilaian)
    Siswa --> (Presensi secara Otomatis)
```

---

### 1.2 Class Diagram (UML)
Class diagram di bawah menggambarkan struktur entitas data utama di sistem LMTMS serta relasi asosiasi satu dengan lainnya.

```mermaid
classDiagram
    class User {
        +String id
        +String schoolId
        +String username
        +String nama
        +String email
        +String password
        +String role
        +String kelas
        +Boolean mfaEnabled
        +login() Boolean
        +updateProfile() Boolean
    }

    class TahunPelajaran {
        +String id
        +String schoolId
        +String tahun
        +String semester
        +Boolean aktif
        +aktifkan()
    }

    class PerangkatPembelajaran {
        +String id
        +String schoolId
        +String judul
        +String tipe
        +String fileUrl
        +String kontenAi
        +String dibuatOleh
        +Number currentVersion
        +Date tanggalDibuat
        +generateWithGemini() String
    }

    class DocumentVersion {
        +String id
        +String documentId
        +Number versionNumber
        +String contentSnapshot
        +String changeSummary
        +String modifiedBy
        +Date createdAt
        +rollback()
    }

    class PromptTemplate {
        +String id
        +String schoolId
        +String tipe
        +String promptText
        +Date updatedAt
    }

    class QueueJob {
        +String id
        +String schoolId
        +String type
        +Object payload
        +String status
        +Number progress
        +String error
        +Date createdAt
        +execute()
    }

    class Materi {
        +String id
        +String schoolId
        +String judul
        +String deskripsi
        +String tipe
        +String linkUrl
        +Date tanggalDibuat
    }

    class Tugas {
        +String id
        +String schoolId
        +String judul
        +String deskripsi
        +String tenggat
        +String kelas
        +Date tanggalDibuat
    }

    class Submission {
        +String id
        +String tugasId
        +String siswaId
        +String siswaNama
        +String fileUrl
        +String teksSubmission
        +Number nilai
        +String catatanGuru
        +String status
        +grade(nilai, catatan)
    }

    class Absensi {
        +String id
        +String schoolId
        +Date tanggal
        +String kelas
        +Object dataGrid
        +simpan() Boolean
    }

    class RombonganBelajar {
        +String id
        +String schoolId
        +String nama
        +String waliKelas
        +Number kapasitas
    }

    class ActivityLog {
        +String id
        +String schoolId
        +String userId
        +String userNama
        +String role
        +String aksi
        +String rincian
        +String ipAddress
        +String waktu
    }

    User "1" --> "*" PerangkatPembelajaran : "membuat"
    PerangkatPembelajaran "1" --> "*" DocumentVersion : "memiliki riwayat"
    User "1" --> "*" Submission : "mengumpulkan"
    User "1" --> "*" Absensi : "mencatat"
    Tugas "1" --> "*" Submission : "memiliki"
    RombonganBelajar "1" --> "*" User : "berisi"
    RombonganBelajar "1" --> "*" Tugas : "menerima"
    User "1" --> "*" ActivityLog : "menghasilkan log"
    QueueJob "*" <-- "1" User : "memicu"
```

---

### 1.3 Sequence Diagram (Proses Sinkronisasi Absensi Offline)
Sequence diagram berikut memvisualisasikan interaksi komponen ketika Guru mengisi lembar presensi dalam keadaan tanpa koneksi internet (Offline), dan bagaimana data disinkronkan kembali saat terhubung ke server.

```mermaid
sequenceDiagram
    autonumber
    actor Guru as Guru (Client Browser)
    participant APP as LMTMS React Frontend
    participant LS as LocalStorage (Cache Queue)
    participant API as Express API Server
    participant DB as MariaDB / Firestore Database

    Guru->>APP: Simpan Absensi Kelas X-1
    APP->>APP: Deteksi Status Jaringan (isOnline === false)
    
    note over APP, LS: Skenario Offline Diaktifkan
    APP->>LS: Simpan Payload ke Queue ("lmtms_offline_queue")
    LS-->>APP: Data Antrean Tersimpan
    APP-->>Guru: Tampilkan Toast "Offline: Tersimpan Lokal"
    
    note over Guru, API: Waktu Berlalu... Internet Kembali Tersedia
    APP->>APP: Deteksi Event "online" / Klik Sinkronisasi
    
    APP->>LS: Ambil Seluruh Antrean Pending
    LS-->>APP: Kembalikan Array Antrean
    
    loop Untuk Setiap Item dalam Antrean
        APP->>API: HTTP POST /api/absensi/simpan (Payload)
        API->>DB: INSERT / UPDATE Data Presensi
        DB-->>API: Konfirmasi Simpan Sukses
        API-->>APP: Response 200 OK (success: true)
    end
    
    APP->>LS: Kosongkan Antrean ("lmtms_offline_queue" -> [])
    APP-->>Guru: Tampilkan Toast "Sinkronisasi Berhasil!" & Tambah Notifikasi
```

---

## 2. Alur Kerja (Flowchart)

### 2.1 Alur Deteksi Jaringan & Pengambilan Tindakan PWA
Flowchart ini mengilustrasikan logika internal aplikasi LMTMS dalam mengambil keputusan penyimpanan data berdasarkan status ketersediaan koneksi internet.

```mermaid
graph TD
    A[Mulai Tindakan Guru/Siswa] --> B{Apakah Internet Tersedia?}
    
    %% Cabang Online (Ya)
    B -- Ya (Online) --> C[Kirim Permintaan ke Server Express API]
    C --> D{Apakah Server Merespons?}
    D -- Ya --> E[Data Tersimpan Langsung di Database]
    E --> F[Tampilkan Notifikasi Sukses Instan]
    E --> G[Perbarui Analitika Dashboard Utama]
    
    %% Cabang Offline / Server Mati (Tidak)
    B -- Tidak (Offline) --> H[Enkapsulasi Data ke JSON Payload]
    D -- Tidak (Server Down) --> H
    H --> I[Simpan ke dalam Antrean lmtms_offline_queue di LocalStorage]
    I --> J[Tampilkan Toast Peringatan Sifat Lokal & Offline Mode]
    J --> K[Tampilkan Angka Antrean Tertunda pada Menu Setelan]
    
    %% Proses Pemulihan (Sinkronisasi)
    K --> L[Deteksi Konektivitas Pulih / Event 'online' Terpicu]
    L --> M[Jalankan Fungsi processOfflineQueue]
    M --> N[Kirim Seluruh Item dalam Antrean Secara Sekuensial]
    N --> O[Server Memperbarui Database Utama]
    O --> P[Bersihkan Antrean di LocalStorage]
    P --> Q[Tampilkan Riwayat Notifikasi Sinkronisasi Berhasil]
    Q --> R[Selesai]
```

---

### 2.2 Alur Pemrosesan Tugas pada Sistem Antrean (Heavy Task Queue Flow)
Alur ini menjelaskan bagaimana proses kompilasi PDF besar, backup database otomatis, dan generate modul ajar diproses secara asinkron di background thread.

```mermaid
graph TD
    A[Pengguna Memicu Aksi Berat: Cetak/Backup/AI] --> B[Controller Mengemas Payload Tugas]
    B --> C[Controller Memasukkan Tugas ke dalam Antrean: TaskQueue.addJob]
    C --> D[Simpan Pekerjaan ke Database dengan Status: PENDING]
    D --> E[Controller Mengembalikan Respons Instan: JobID & Status 202 Accepted]
    E --> F[Pengguna Melihat Progress Bar di UI Settings / Dashboard]
    
    %% Siklus Pekerjaan Background Worker
    D --> G[Background Worker Thread Mendeteksi Pekerjaan Baru]
    G --> H[Worker Mengubah Status Pekerjaan: PROCESSING]
    H --> I[Eksekusi Komputasi Berat di Latar Belakang]
    I --> J{Apakah Proses Sukses?}
    J -- Ya --> K[Simpan Hasil Output ke Penyimpanan Sifat Awan]
    K --> L[Worker Mengubah Status Pekerjaan: COMPLETED dengan Progress 100%]
    J -- Tidak --> M[Catat Pesan Kesalahan / Error Log]
    M --> N[Worker Mengubah Status Pekerjaan: FAILED]
    
    %% Sinkronisasi ke UI
    L --> O[Sistem Mengirimkan Push Notification / Toast Sinkronisasi]
    N --> O
    O --> P[Selesai]
```

---

### 2.3 Alur Mekanisme Ekstensi Plugin (Plugin Hooks Flow)
Bagan ini menunjukkan bagaimana plugin pihak ketiga memodifikasi atau memperluas alur bisnis aplikasi LMTMS melalui Hook Registry.

```mermaid
graph TD
    A[Sistem Memulai Booting Server] --> B[Plugin Engine Membaca Folder /plugins]
    B --> C[Parsing Berkas manifest.json dari Setiap Folder Plugin]
    C --> D[Daftarkan Callback Fungsi ke Hook Registry sesuai Target Hooks]
    D --> E[Server Siap Melayani Permintaan]
    
    %% Alur Trigger Hook di Runtime
    F[Siswa Mengumpulkan Tugas] --> G[Core LMTMS Menyimpan Jawaban ke Database]
    G --> H[Core LMTMS Memanggil PluginEngine.triggerHook 'after:submission:submit']
    H --> I{Apakah Hook Tersebut Memiliki Callback Terdaftar?}
    I -- Tidak --> J[Selesaikan Siklus Request seperti Biasa]
    I -- Ya --> K[Jalankan Fungsi Callback Plugin secara Sekuensial]
    K --> L[Contoh Plugin WA: Mengirim Notifikasi ke Nomor Wali Kelas]
    L --> M[Selesaikan Siklus Request dan Berikan Respons]
```

---

### 2.4 Struktur Batasan Clean Architecture (Clean Architecture Boundaries)
Representasi aliran ketergantungan arah dalam (*inside dependency rule*) pada implementasi LMTMS.

```mermaid
graph TD
    subgraph Infrastruktur [Lingkaran 4: INFRASTRUCTURE]
        DB[(Database: MariaDB/Firestore)]
        Cron[Cron Job Scheduler]
        Plugin[Sistem Plugins]
        DocGen[PDF/Excel Generator]
    end

    subgraph InterfaceAdapters [Lingkaran 3: INTERFACE ADAPTERS]
        Controllers[API Controllers]
        Middlewares[Multi-Tenant & Audit Log Middlewares]
        Repos[Repositories Implementation]
    end

    subgraph UseCases [Lingkaran 2: APPLICATION BUSINESS RULES]
        UC1[SimpanPresensiUseCase]
        UC2[GenerateModulAjarUseCase]
        UC3[ProcessOfflineQueueUseCase]
    end

    subgraph Entities [Lingkaran 1: ENTERPRISE BUSINESS RULES]
        User[Entity: User]
        Perangkat[Entity: PerangkatPembelajaran]
        Log[Entity: AuditLog]
    end

    %% Hubungan Dependensi Hanya Boleh Masuk Ke Dalam
    Infrastruktur --> InterfaceAdapters
    InterfaceAdapters --> UseCases
    UseCases --> Entities
```

