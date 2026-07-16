# LMTMS (Learning Management & Teacher Management System)
### Informatika SMA - Portal Belajar & Administrasi Guru Terpadu

LMTMS adalah platform portal web pendidikan terpadu kelas dunia yang dirancang khusus untuk memodernisasi kegiatan belajar mengajar, pengelolaan tugas, serta administrasi guru mata pelajaran **Informatika SMA**. Platform ini dilengkapi dengan asisten pintar berbasis **Generative AI** untuk menyusun perangkat pembelajaran kurikulum nasional, serta ketangguhan arsitektur **Offline-First (PWA)** untuk pengisian data luring di dalam kelas tanpa hambatan koneksi internet.

---

## 🚀 Fitur Unggulan Sistem

### 🖥️ 1. LMS (Learning Management System) Terintegrasi
- **Guru**: Merancang tugas/kuis, melacak daftar pengumpulan berkas dari siswa, dan melakukan penilaian interaktif serta umpan balik dinamis.
- **Siswa**: Melihat tenggat waktu tugas kelas secara instan, mengunduh materi digital dari guru, dan mengunggah pengumpulan tugas/kuis berbentuk tautan atau berkas.

### 📋 2. Jurnal Presensi Kelas Mandiri (Siap Luring)
- Lembar jurnal presensi harian interaktif per rombongan belajar.
- Mendukung penyimpanan luring penuh saat berada di wilayah ruang kelas bersinyal buruk. Data disimpan di antrean lokal browser dan diselaraskan secara otomatis ke server utama begitu gawai kembali terhubung ke internet.

### 🧠 3. AI Teaching Assistant (Google Gemini AI)
- Integrasi asisten kecerdasan buatan (Generative AI) untuk menyusun dokumen pendidikan (RPP / Modul Ajar, ATP, Lembar Kerja LKPD) yang selaras dengan Kurikulum Merdeka nasional.
- Mendukung ekspor instan berformat cetak rapi (*print-ready layout PDF*).

### ⚙️ 4. Administrasi Akademik Sekolah (Multi-Sesi & Multi-Semester)
- Manajemen profil data guru dan siswa secara dinamis.
- Pengaturan Semester Aktif global, pengelolaan Rombongan Belajar (Rombel), pemetaan jadwal mingguan terpadu, dan kalender kegiatan akademik sekolah.

### 🎨 5. Personalisasi Tema Visual & Mode Gelap
- Mendukung peralihan ke mode gelap (*Dark Mode*) yang teduh di mata untuk pengerjaan modul ajar di malam hari.
- Pilihan variasi warna aksen sistem (*Classic Indigo*, *Emerald Oasis*, *Amethyst Royal*, *Sunset Flare*, *Amber Glow*) yang tersimpan aman pada setelan lokal pengguna.

---

## 🗂️ Pusat Dokumentasi Teknis & Panduan Pengguna

Untuk kemudahan instalasi, penggunaan, dan pengembangan lebih lanjut, silakan baca dokumentasi terpisah kami di bawah ini:

| Judul Dokumen | Deskripsi Isi | Link Berkas |
| :--- | :--- | :--- |
| 🌐 **Panduan Deployment LNMP** | Panduan instalasi Ubuntu Server, konfigurasi Nginx, PHP-FPM, database MariaDB, dan sertifikat SSL otomatis Let's Encrypt. | [docs/DEPLOYMENT_LNMP.md](docs/DEPLOYMENT_LNMP.md) |
| 📊 **Diagram Arsitektur Sistem** | Diagram UML lengkap (Use Case, Class Diagram, Sequence Diagram) dan Flowchart sinkronisasi antrean offline PWA menggunakan Mermaid. | [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) |
| 🔌 **Dokumentasi API RESTful** | Spesifikasi lengkap seluruh API backend, parameter request body, struktur respons JSON, dan batasan otorisasi peran (RBAC). | [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) |
| 📖 **Panduan Pengguna (User Guide)** | Instruksi praktis langkah-demi-langkah penggunaan portal untuk Administrator, Guru Informatika, dan Siswa. | [docs/USER_GUIDE.md](docs/USER_GUIDE.md) |
| 💻 **Panduan Pengembang (Dev Guide)** | Penjelasan arsitektur kode monorepo, manajemen state global, algoritma offline queue, kustomisasi CSS variables, dan prompting Gemini. | [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) |

---

## 🛠️ Langkah Menjalankan Aplikasi di Lokal (Development)

### 1. Prasyarat Sistem
Pastikan komputer Anda telah terpasang:
- **Node.js** v20 atau versi LTS terbaru
- **npm** (bawaan dari Node.js)

### 2. Inisialisasi Dependensi & Variabel Lingkungan
Salin berkas contoh konfigurasi `.env.example` menjadi `.env` di direktori utama:
```bash
cp .env.example .env
```
Isi konfigurasi kunci Anda di dalam berkas `.env`:
```env
PORT=3000
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
```

### 3. Instalasi Paket Dependensi
Jalankan perintah berikut untuk mengunduh seluruh dependensi frontend dan backend:
```bash
npm install
```

### 4. Jalankan Aplikasi dalam Mode Pengembangan
```bash
npm run dev
```
Aplikasi akan secara otomatis aktif dan dapat diakses melalui browser Anda di alamat: **`http://localhost:3000`**

---

## 📦 Membangun Aplikasi untuk Produksi

Untuk menghasilkan berkas build frontend yang dikompresi penuh (*fully optimized static files*) dan mengompilasi backend Express:
```bash
npm run build
```
Seluruh aset produksi akan ditempatkan di dalam folder `/dist`. Untuk menjalankan aplikasi dalam mode produksi lokal:
```bash
npm start
```
Sistem LMTMS siap melayani kegiatan administrasi sekolah Anda secara andal, cepat, dan modern!
