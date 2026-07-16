# Panduan Pengguna Sistem LMTMS (User Guide)

Selamat datang di Portal **LMTMS Informatika SMA**. Sistem ini dirancang untuk mengintegrasikan kegiatan belajar mengajar (LMS), penyusunan berkas administrasi guru (RPP/Modul Ajar), manajemen absensi kelas, dan analisis data akademik dalam satu kesatuan platform yang modern, responsif, dan siap offline (PWA).

---

## 📌 1. Panduan untuk Administrator Sekolah

Sebagai Administrator, Anda bertanggung jawab atas kelancaran infrastruktur data sekolah dan keamanan hak akses sistem.

### 1.1 Manajemen Akun (Guru & Siswa)
1. Buka menu **Manajemen Akademik** di bilah navigasi kiri.
2. Di tab **Data Pengguna**, Anda dapat melihat seluruh daftar akun aktif.
3. Untuk menambahkan pengguna baru:
   - Klik tombol **Tambah Pengguna Baru**.
   - Isi form nama lengkap, email, username, peran (`GURU` atau `SISWA`), serta rombongan belajar jika perannya adalah siswa.
4. Anda dapat mengedit data pengguna atau menghapus akun siswa yang telah lulus.

### 1.2 Konfigurasi Tahun Pelajaran & Semester
Sistem LMTMS membatasi visibilitas aktivitas berdasarkan semester aktif demi kerapian data:
1. Akses menu **Manajemen Akademik** > tab **Tahun Pelajaran**.
2. Anda dapat melihat daftar semester ganjil/genap.
3. Untuk mengubah semester aktif sekolah secara global, klik tombol **Aktifkan** pada baris tahun pelajaran yang diinginkan.
4. Semua aktivitas absensi dan tugas baru akan otomatis dikelompokkan ke dalam semester aktif tersebut.

### 1.3 Pengaturan Rombongan Belajar (Rombel) & Jadwal
1. Di bawah tab **Manajemen Rombel**, daftarkan daftar kelas yang ada (misal: `X-1`, `X-2`, `XI-MIPA-1`).
2. Masuk ke tab **Jadwal Pelajaran** untuk memetakan hari, jam mulai/selesai, nama guru, dan mata pelajaran ke setiap rombel agar jadwal tampil otomatis di halaman siswa yang bersangkutan.

---

## 📝 2. Panduan untuk Guru Informatika

Guru dibekali alat bantu otomatisasi berbasis AI Generatif serta kemampuan pencatatan luring di dalam kelas.

### 2.1 Pembuatan RPP / Modul Ajar Menggunakan AI Assistant
LMTMS mengintegrasikan **Google Gemini AI** untuk memangkas waktu pengerjaan administrasi guru:
1. Klik menu **AI Teaching Assistant** di sidebar kiri.
2. Tentukan kriteria modul ajar yang ingin dibuat:
   - **Tipe Perangkat**: Rencana Pelaksanaan Pembelajaran (RPP), Alur Tujuan Pembelajaran (ATP), atau Lembar Kerja Peserta Didik (LKPD).
   - **Elemen Informatika**: Pilih elemen yang sesuai (Berpikir Komputasional, Teknologi Informasi dan Komunikasi, Sistem Komputer, Jaringan Komputer, Analisis Data, Algoritma Pemrograman, Dampak Sosial Informatika, atau Praktik Lintas Bidang).
   - **Metode Pembelajaran**: *Inquiry Learning*, *Project Based Learning*, *Problem Based Learning*, dll.
   - **Instruksi Khusus (Custom Prompt)**: Tambahkan instruksi spesifik (misal: *"Gunakan analogi tentang lalu lintas jalan raya untuk menjelaskan paket data"*).
3. Klik **Hasilkan Draft Otomatis (Gemini)**. AI akan merancang modul ajar lengkap berstandar nasional Kurikulum Merdeka dalam hitungan detik.
4. Anda dapat menyesuaikan tulisan tersebut secara langsung di editor, lalu mengeklik **Simpan Perangkat** untuk diarsipkan atau klik **Cetak Dokumen** untuk mengunduhnya dalam bentuk PDF resmi berpola cetak rapi (*print layout*).

### 2.2 Pencatatan Presensi Kelas (Mendukung Mode Offline)
Saat masuk kelas dengan jangkauan internet yang buruk, Anda dapat merekam kehadiran siswa tanpa hambatan:
1. Navigasi ke menu **Presensi Kelas**.
2. Pilih kelas dan tanggal pertemuan hari ini.
3. Tandai kehadiran setiap siswa (`Hadir`, `Sakit`, `Izin`, `Alfa`).
4. Klik **Simpan Presensi Hari Ini**.
5. **Jika koneksi offline**: Sistem otomatis menyimpan seluruh rekam presensi tersebut dalam antrean *LocalStorage* lokal browser Anda. Anda akan menerima notifikasi *"Presensi disimpan secara lokal (Offline Mode)"*. Saat Anda kembali ke ruang guru atau terhubung ke Wi-Fi sekolah, data tersebut akan otomatis diselaraskan ke database utama server.

### 2.3 Penilaian Tugas & Pengumpulan Kuis
1. Buka menu **Tugas & Kuis** > pilih tab **Daftar Pengumpulan Tugas**.
2. Anda akan melihat nama siswa yang telah mengumpulkan berkas beserta lampirannya.
3. Klik tombol **Berikan Nilai** pada siswa yang ingin dievaluasi.
4. Masukkan skor (skala 0 - 100) dan berikan catatan umpan balik yang membangun.
5. Klik **Simpan Penilaian**. Status tugas siswa akan berubah menjadi `SELESAI` dan nilainya dapat langsung dilihat oleh siswa bersangkutan di portal mereka.

---

## 🎓 3. Panduan untuk Siswa

Siswa mendapatkan portal mandiri yang interaktif untuk mengikuti program belajar mengajar.

### 3.1 Mengakses Materi Pembelajaran
1. Buka menu **Materi Pembelajaran**.
2. Di sini, Anda dapat mengunduh modul, presentasi slide, atau menonton tautan video pembelajaran Informatika yang dibagikan oleh guru.

### 3.2 Mengumpulkan Tugas / Evaluasi Kuis
1. Klik menu **Tugas & Kuis**.
2. Lihat daftar tugas yang ditugaskan kepada kelas Anda beserta tenggat waktunya.
3. Pilih tugas yang belum dikerjakan, lalu isi bagian **Teks Jawaban** (misal: melampirkan tautan Google Drive / GitHub Anda) atau unggah berkas PDF/Gambar jawaban Anda.
4. Klik **Kumpulkan Tugas**.

### 3.3 Melihat Hasil Evaluasi & Jadwal Harian
1. Pada **Dashboard Analitika**, Anda dapat melihat persentase kehadiran Anda sepanjang semester serta grafik kemajuan nilai rata-rata Anda.
2. Di halaman **Profil & Keamanan**, Anda dapat mengaktifkan **MFA (Multi-Factor Authentication)** untuk melindungi akun Anda agar tidak disalahgunakan orang lain saat ujian.

---

## 🎨 4. Kustomisasi Tema & Tampilan Visual (Personalisasi)

Sistem LMTMS mendukung kustomisasi tema visual agar Anda merasa nyaman selama beraktivitas di depan layar:
1. Masuk ke halaman **Profil & Keamanan** > scroll ke bagian **Tema Visual & Personalisasi Antarmuka**.
2. Anda dapat mengubah **Mode Pencahayaan**:
   - **Mode Terang**: Tampilan bersih, kontras tinggi, ideal untuk ruang kelas bersinar terang.
   - **Mode Gelap (Malam)**: Mengubah seluruh latar menjadi warna gelap arang (*Cosmic Slate Theme*) untuk mereduksi kelelahan mata di malam hari.
3. Anda juga dapat memilih **Aksen Warna Utama** sistem (mempengaruhi tombol, warna aktif sidebar, garis tepi, dan badge status):
   - *Classic Indigo* (Biru Tua Klasik)
   - *Emerald Oasis* (Hijau Teduh)
   - *Amethyst Royal* (Ungu Mewah)
   - *Sunset Flare* (Merah Muda Merona)
   - *Amber Glow* (Oranye Hangat)
4. Setelan warna dan mode gelap ini akan otomatis melekat pada profil lokal Anda meskipun Anda me-refresh halaman web.
