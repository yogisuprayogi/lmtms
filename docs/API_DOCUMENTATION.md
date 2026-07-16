# Dokumentasi API LMTMS (Backend Express)

Dokumen ini mendefinisikan seluruh antarmuka pemrograman aplikasi (API Endpoint) yang dikelola oleh server backend **Express.js** pada sistem LMTMS.

---

## Ketentuan Umum & Keamanan
1. **Root URL**: `/api` (atau versi spesifik seperti `/api/v1` dan `/api/v2`)
2. **Format Data**: JSON (`Content-Type: application/json`)
3. **Multi-Tenancy**: Semua permintaan API wajib menyertakan header `X-School-ID` untuk mengisolasi context data sekolah.
4. **Role-Based Access Control (RBAC)**: Beberapa rute dilindungi oleh middleware keamanan yang mengecek header `X-User-Role` atau sesi aktif.
5. **Headers Keamanan**:
   - `X-School-ID`: `sma1jakarta` | `sma2bandung` (Digunakan untuk isolasi multi-sekolah).
   - `x-user-role`: `ADMIN` | `GURU` | `SISWA` (Digunakan untuk validasi hak akses backend).

---

## API Versioning Policy
- **v1 (Core Baseline)**: Rute-rute standar untuk kompatibilitas mundur. Semua rute di bawah `/api/v1/*` dijamin stabil.
- **v2 (Optimized & Streaming)**: Digunakan untuk fitur lanjutan seperti streaming konten AI generatif, pengunduhan dokumen dinamis dalam format kompresi ZIP, atau query data massal yang dioptimalkan. Dipetakan di bawah `/api/v2/*`.

---

## 1. Modul Otentikasi & Akun Pengguna

### 1.1 Login Pengguna
- **Endpoint**: `POST /api/auth/login`
- **Akses**: Publik
- **Request Body**:
  ```json
  {
    "username": "guru_informatika",
    "password": "PasswordRahasia_1"
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "u1",
      "username": "guru_informatika",
      "nama": "Budi Santoso, S.Kom.",
      "email": "budi@sekolah.sch.id",
      "role": "GURU",
      "mfaEnabled": false
    }
  }
  ```

### 1.2 Ubah Profil Akun
- **Endpoint**: `PUT /api/users/profile`
- **Akses**: Semua Pengguna Terautentikasi
- **Request Body**:
  ```json
  {
    "nama": "Budi Santoso, M.T.",
    "email": "budi.baru@sekolah.sch.id"
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "u1",
      "username": "guru_informatika",
      "nama": "Budi Santoso, M.T.",
      "email": "budi.baru@sekolah.sch.id",
      "role": "GURU"
    }
  }
  ```

### 1.3 Aktivasi Multi-Factor Authentication (MFA)
- **Endpoint**: `PUT /api/users/mfa`
- **Akses**: Semua Pengguna Terautentikasi
- **Request Body**: Tidak ada (Sifatnya toggle switch)
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "mfaEnabled": true,
    "message": "Autentikasi dua faktor berhasil diaktifkan untuk akun Anda."
  }
  ```

---

## 2. Modul Tahun Pelajaran & Akademik

### 2.1 Ambil Semua Tahun Pelajaran
- **Endpoint**: `GET /api/tahun-pelajaran`
- **Akses**: Publik / Semua Pengguna
- **Response (Sukses 200)**:
  ```json
  [
    { "id": "tp1", "tahun": "2025/2026", "semester": "GANJIL", "aktif": true },
    { "id": "tp2", "tahun": "2025/2026", "semester": "GENAP", "aktif": false }
  ]
  ```

### 2.2 Aktifkan Semester Tertentu
- **Endpoint**: `POST /api/tahun-pelajaran/aktifkan`
- **Akses**: **ADMIN** Only
- **Request Body**:
  ```json
  {
    "id": "tp2"
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "message": "Tahun pelajaran 2025/2026 semester GENAP telah diaktifkan secara global."
  }
  ```

---

## 3. Modul Perangkat Pembelajaran (AI Assistant)

### 3.1 Dapatkan Semua Perangkat Pembelajaran
- **Endpoint**: `GET /api/perangkat`
- **Akses**: Semua Pengguna
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "p1",
        "judul": "Modul Algoritma Pemrograman",
        "tipe": "RPP",
        "kontenAi": "Isi modul...",
        "dibuatOleh": "Budi Santoso, M.T.",
        "tanggalDibuat": "2026-07-15T08:00:00Z"
      }
    ]
  }
  ```

### 3.2 Buat Perangkat Pembelajaran Baru
- **Endpoint**: `POST /api/perangkat`
- **Akses**: **GURU**, **ADMIN**
- **Request Body**:
  ```json
  {
    "judul": "RPP Berpikir Komputasional Kelas X",
    "tipe": "RPP",
    "kontenAi": "Rencana pembelajaran mencakup metode problem-based learning..."
  }
  ```
- **Response (Sukses 201)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "p2",
      "judul": "RPP Berpikir Komputasional Kelas X",
      "tipe": "RPP",
      "kontenAi": "...",
      "dibuatOleh": "Budi Santoso, M.T."
    }
  }
  ```

### 3.3 Hasilkan Draft Otomatis Menggunakan Gemini AI
- **Endpoint**: `POST /api/gemini/generate`
- **Akses**: **GURU**, **ADMIN**
- **Request Body**:
  ```json
  {
    "tipe": "RPP",
    "elemen": "Sistem Komputer",
    "fase": "Fase E (Kelas X)",
    "materi": "Komponen Perangkat Keras dan Interaksi Antar Perangkat",
    "alokasiWaktu": "2 JP x 45 Menit",
    "metode": "Inquiry Learning",
    "customPrompt": "Fokuskan pada pameran rakitan komputer mini."
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "content": "### MODUL AJAR (RPP) INFORMATIKA\n\n**A. Identitas**\n* Elemen: Sistem Komputer\n* Fase: E / Kelas X\n* Alokasi: 2 JP\n\n**B. Tujuan Pembelajaran**\nSiswa mampu mengidentifikasi komponen perangkat keras..."
  }
  ```

---

## 4. Modul Tugas, Kuis & Penilaian (LMS)

### 4.1 Kirim Tugas Baru (Guru)
- **Endpoint**: `POST /api/tugas`
- **Akses**: **GURU**, **ADMIN**
- **Request Body**:
  ```json
  {
    "judul": "Kuis Berpikir Komputasional",
    "deskripsi": "Kerjakan kuis logika biner di tautan berikut.",
    "tenggat": "2026-07-25",
    "kelas": "X-1"
  }
  ```

### 4.2 Kumpulkan Jawaban Tugas (Siswa)
- **Endpoint**: `POST /api/tugas/kumpul`
- **Akses**: **SISWA** Only
- **Request Body**:
  ```json
  {
    "tugasId": "t1",
    "siswaId": "s2",
    "siswaNama": "Ahmad Dani",
    "teksSubmission": "Tautan pengerjaan github saya: https://github.com/dani/komputasi-x1",
    "fileUrl": ""
  }
  ```

### 4.3 Berikan Nilai & Catatan Evaluasi (Guru)
- **Endpoint**: `POST /api/tugas/nilai`
- **Akses**: **GURU**, **ADMIN** (Mendukung **Offline Sync Queue**)
- **Request Body**:
  ```json
  {
    "id": "sub_1",
    "nilai": 95,
    "catatanGuru": "Kerja bagus! Struktur algoritma sangat efisien dan terdokumentasi dengan rapi."
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "sub_1",
      "tugasId": "t1",
      "siswaId": "s2",
      "siswaNama": "Ahmad Dani",
      "nilai": 95,
      "catatanGuru": "Kerja bagus! Struktur...",
      "status": "SELESAI"
    }
  }
  ```

---

## 5. Modul Presensi Kelas (Attendance)

### 5.1 Simpan Jurnal Kehadiran Harian
- **Endpoint**: `POST /api/absensi/simpan`
- **Akses**: **GURU**, **ADMIN** (Mendukung **Offline Sync Queue**)
- **Request Body**:
  ```json
  {
    "tanggal": "2026-07-16",
    "kelas": "X-1",
    "dataAbsensi": [
      { "siswaId": "s1", "siswaNama": "Adi Wijaya", "status": "HADIR", "catatan": "" },
      { "siswaId": "s2", "siswaNama": "Ahmad Dani", "status": "SAKIT", "catatan": "Surat dokter terlampir" }
    ]
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "message": "Presensi kelas X-1 tanggal 2026-07-16 berhasil disimpan."
  }
  ```

---

## 6. Modul Sistem Plugin (Plugin System)

### 6.1 Dapatkan Semua Plugin Aktif
- **Endpoint**: `GET /api/v1/plugins`
- **Akses**: **ADMIN**
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "plugins": [
      {
        "id": "lmtms-whatsapp-notification",
        "name": "Sistem Notifikasi WhatsApp Otomatis",
        "version": "1.0.0",
        "description": "Mengirimkan notifikasi ketidakhadiran siswa langsung ke Whatsapp orang tua.",
        "enabled": true
      }
    ]
  }
  ```

### 6.2 Unggah & Instal Plugin Baru
- **Endpoint**: `POST /api/v1/plugins/install`
- **Akses**: **ADMIN**
- **Request Body**: Multipart FormData (Mengirimkan berkas plugin `.zip`)
- **Response (Sukses 201)**:
  ```json
  {
    "success": true,
    "message": "Plugin 'lmtms-whatsapp-notification' berhasil diinstal dan diaktifkan secara global."
  }
  ```

---

## 7. Modul Kontrol Versi Perangkat (Document Version Control)

### 7.1 Ambil Riwayat Versi Dokumen
- **Endpoint**: `GET /api/v1/perangkat/:id/versions`
- **Akses**: **GURU**, **ADMIN**
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "documentId": "p1",
    "versions": [
      {
        "versionNumber": 2,
        "changeSummary": "Penambahan submateri instalasi Linux",
        "modifiedBy": "Budi Santoso, M.T.",
        "createdAt": "2026-07-16T10:30:00Z"
      },
      {
        "versionNumber": 1,
        "changeSummary": "Inisialisasi draf modul ajar sistem komputer",
        "modifiedBy": "Budi Santoso, M.T.",
        "createdAt": "2026-07-15T08:00:00Z"
      }
    ]
  }
  ```

### 7.2 Kembalikan Dokumen ke Versi Tertentu (Rollback)
- **Endpoint**: `POST /api/v1/perangkat/:id/rollback`
- **Akses**: **GURU**, **ADMIN**
- **Request Body**:
  ```json
  {
    "versionNumber": 1
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "message": "Dokumen berhasil dikembalikan ke versi 1.",
    "activeContent": "Draf awal modul ajar..."
  }
  ```

---

## 8. Modul Antrean Tugas Berat (Heavy Task Queue)

### 8.1 Buat Pekerjaan Latar Belakang (Contoh: Backup Database)
- **Endpoint**: `POST /api/v1/queue/jobs`
- **Akses**: **ADMIN**
- **Request Body**:
  ```json
  {
    "type": "BACKUP",
    "payload": {}
  }
  ```
- **Response (Sukses 202 Accepted)**:
  ```json
  {
    "success": true,
    "jobId": "job_987654",
    "status": "PENDING",
    "message": "Pekerjaan backup database telah dimasukkan ke dalam antrean background worker."
  }
  ```

### 8.2 Periksa Status Progress Pekerjaan
- **Endpoint**: `GET /api/v1/queue/jobs/:id`
- **Akses**: **ADMIN**, **GURU**
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "job": {
      "id": "job_987654",
      "type": "BACKUP",
      "status": "PROCESSING",
      "progress": 65,
      "error": null,
      "createdAt": "2026-07-16T12:00:00Z"
    }
  }
  ```

---

## 9. Modul Jejak Audit Keamanan (Audit Trail)

### 9.1 Dapatkan Log Audit Aktivitas Mutasi Data
- **Endpoint**: `GET /api/v1/audit-trail`
- **Akses**: **ADMIN**
- **Query Parameters**: `page=1&limit=50&search=absensi`
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "currentPage": 1,
    "totalPages": 3,
    "data": [
      {
        "id": "log_111",
        "userId": "u1",
        "userNama": "Budi Santoso, M.T.",
        "role": "GURU",
        "aksi": "POST /api/absensi/simpan",
        "details": "{\"tanggal\":\"2026-07-16\",\"kelas\":\"X-1\"}",
        "ipAddress": "192.168.1.15",
        "waktu": "2026-07-16T02:46:12Z"
      }
    ]
  }
  ```

---

## 10. Modul Kustomisasi Prompt AI (Prompt Engine)

### 10.1 Ambil Semua Template Prompt Aktif
- **Endpoint**: `GET /api/v1/prompts`
- **Akses**: **ADMIN**
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "pr_rpp",
        "tipe": "RPP",
        "promptText": "Anda adalah Asisten Pengajar AI khusus mata pelajaran Informatika SMA di Indonesia...",
        "updatedAt": "2026-07-16T01:00:00Z"
      }
    ]
  }
  ```

### 10.2 Perbarui Teks Template Prompt AI
- **Endpoint**: `PUT /api/v1/prompts/:id`
- **Akses**: **ADMIN**
- **Request Body**:
  ```json
  {
    "promptText": "Instruksi Baru: Anda wajib mematuhi standar Kurikulum Merdeka Belajar terbaru revisi 2026..."
  }
  ```
- **Response (Sukses 200)**:
  ```json
  {
    "success": true,
    "message": "Template prompt AI untuk tipe 'RPP' berhasil diperbarui secara instan."
  }
  ```

