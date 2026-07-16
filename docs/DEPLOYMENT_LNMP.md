# Panduan Deployment Sistem LMTMS (Ubuntu, Nginx, PHP, MariaDB, SSL)

Dokumen ini berisi panduan teknis langkah-demi-langkah untuk melakukan deployment **LMTMS (Informatika SMA)** pada server produksi berbasis Linux (**Ubuntu Server**) menggunakan stack terpadu: **Nginx** (sebagai Reverse Proxy & Web Server), **PHP-FPM** (untuk script penunjang/microservices), **MariaDB** (sebagai database utama), dan enkripsi aman **SSL/TLS** menggunakan Let's Encrypt.

---

## 1. Persiapan Server & Keamanan Awal

### 1.1 Update Paket Sistem
Sebelum memulai instalasi, pastikan seluruh paket OS dalam keadaan terbaru:
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Konfigurasi Firewall (UFW)
Amankan server dengan membatasi port akses hanya untuk SSH, HTTP, dan HTTPS:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
Periksa status firewall dengan perintah:
```bash
sudo ufw status
```

---

## 2. Instalasi & Konfigurasi MariaDB

MariaDB digunakan sebagai pangkalan data relasional untuk menyimpan data pengguna, rombel, jadwal, materi, presensi, dan log sistem.

### 2.1 Instalasi Server MariaDB
```bash
sudo apt install mariadb-server mariadb-client -y
```

### 2.2 Mengamankan Pemasangan MariaDB
Jalankan skrip keamanan interaktif bawaan untuk menghapus database testing, membatasi akses root jarak jauh, dan memperkuat otentikasi:
```bash
sudo mysql_secure_installation
```
*Rekomendasi jawaban saat interaksi:*
- *Switch to unix_socket authentication?* **N**
- *Change the root password?* **Y** (Tentukan password root yang sangat kuat)
- *Remove anonymous users?* **Y**
- *Disallow root login remotely?* **Y**
- *Remove test database and access to it?* **Y**
- *Reload privilege tables now?* **Y**

### 2.3 Pembuatan Database & Akun Pengguna LMTMS
Masuk ke prompt MariaDB sebagai root:
```bash
sudo mysql -u root -p
```
Jalankan perintah SQL berikut untuk membuat database dan memberikan hak akses penuh kepada pengguna khusus:
```sql
CREATE DATABASE lmtms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'lmtms_user'@'localhost' IDENTIFIED BY 'PasswordSangatKuat_123!';

GRANT ALL PRIVILEGES ON lmtms_db.* TO 'lmtms_user'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

---

## 3. Instalasi & Konfigurasi PHP-FPM

Walaupun aplikasi utama LMTMS berjalan di atas Node.js (Express), stack PHP-FPM dipasang untuk memfasilitasi integrasi laporan otomatis, script penunjang manajemen data sekolah, atau portal lama sekolah yang terintegrasi.

### 3.1 Instalasi PHP 8.3 & Ekstensi Umum
```bash
sudo apt install php8.3-fpm php8.3-mysql php8.3-common php8.3-cli php8.3-mbstring php8.3-xml php8.3-curl -y
```

### 3.2 Optimasi Pengaturan PHP
Edit file konfigurasi PHP untuk menyesuaikan batas memori dan batas ukuran unggah berkas (sangat krusial untuk guru mengunggah materi pembelajaran berbentuk video atau PDF besar):
```bash
sudo nano /etc/php/8.3/fpm/php.ini
```
Sesuaikan nilai-nilai berikut:
```ini
memory_limit = 256M
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
date.timezone = Asia/Jakarta
```

### 3.3 Mulai & Aktifkan Service PHP-FPM
```bash
sudo systemctl restart php8.3-fpm
sudo systemctl enable php8.3-fpm
```

---

## 4. Konfigurasi Node.js & Runtime Aplikasi LMTMS

Aplikasi LMTMS dikemas sebagai aplikasi full-stack Node.js (Vite + Express).

### 4.1 Instalasi Node.js (LTS Version)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4.2 Pemasangan PM2 (Process Manager)
PM2 digunakan untuk menjaga proses server Express tetap berjalan di latar belakang (background process) dan otomatis melakukan *restart* jika terjadi crash atau ketika server reboot.
```bash
sudo npm install -y -g pm2
```

### 4.3 Menjalankan Aplikasi di Server Produksi
Salin berkas aplikasi ke `/var/www/lmtms`. Edit berkas `.env` untuk mengatur konfigurasi produksi:
```env
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=AIzaSy... (API Key Anda)
DB_HOST=127.0.0.1
DB_USER=lmtms_user
DB_PASS=PasswordSangatKuat_123!
DB_NAME=lmtms_db
```
Lakukan kompilasi aset frontend dan jalankan server Express menggunakan PM2:
```bash
cd /var/www/lmtms
npm install
npm run build
pm2 start dist/server.cjs --name "lmtms-app"
pm2 save
pm2 startup
```

---

## 5. Instalasi & Konfigurasi Nginx

Nginx bertindak sebagai gerbang terdepan (Reverse Proxy) yang menerima permintaan klien di port 80/443, mengarahkan lalu lintas API dan halaman dinamis ke aplikasi Node.js (Port 3000), sekaligus menangani skrip PHP melalui FastCGI.

### 5.1 Instalasi Nginx
```bash
sudo apt install nginx -y
```

### 5.2 Pembuatan Berkas Virtual Host LMTMS
Buat konfigurasi situs baru di direktori konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/lmtms.conf
```
Gunakan konfigurasi standard produksi di bawah ini:
```nginx
server {
    listen 80;
    server_name lmtms.sch.id www.lmtms.sch.id;

    # Folder root statis untuk penunjang PHP atau landing page opsional
    root /var/www/lmtms/public;
    index index.html index.htm index.php;

    charset utf-8;

    # Keamanan Header Tambahan
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "no-referrer-when-downgrade";

    # Kompresi Gzip untuk Kecepatan Akses Mobile
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml application/json;

    # 1. Alihkan permintaan API dan Halaman Utama ke Node.js (Express Port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Penanganan khusus untuk upload file besar (tugas siswa & materi guru)
        client_max_body_size 64M;
    }

    # 2. Penanganan Eksekusi Script PHP opsional
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # 3. Penanganan Berkas Statis / Aset Media
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log /var/log/nginx/lmtms_access.log;
    error_log /var/log/nginx/lmtms_error.log;
}
```

### 5.3 Aktivasi Situs & Verifikasi Konfigurasi
Aktifkan Virtual Host baru dengan membuat *symlink* ke folder `sites-enabled`:
```bash
sudo ln -s /etc/nginx/sites-available/lmtms.conf /etc/nginx/sites-enabled/
```
Uji apakah sintaks konfigurasi Nginx sudah benar tanpa kesalahan:
```bash
sudo nginx -t
```
Jika tidak ada kendala (`syntax is ok`), lakukan reload konfigurasi Nginx:
```bash
sudo systemctl reload nginx
```

---

## 6. Pemasangan SSL/TLS (Certbot Let's Encrypt)

Untuk memenuhi standar keamanan web modern, enkripsi HTTPS wajib diaktifkan guna melindungi data pribadi guru/siswa, berkas ujian, dan sesi otentikasi.

### 6.1 Instalasi Certbot untuk Nginx
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Memperoleh & Memasang Sertifikat SSL Otomatis
Jalankan Certbot dengan parameter plugin Nginx. Certbot akan menganalisis berkas konfigurasi virtual host dan secara otomatis mendaftarkan, memasang, dan mengonfigurasi pengalihan lalu lintas HTTP ke HTTPS:
```bash
sudo certbot --nginx -d lmtms.sch.id -d www.lmtms.sch.id
```
*Catatan saat interaksi:*
- Masukkan alamat email penanggung jawab sistem (untuk notifikasi kedaluwarsa sertifikat).
- Setujui syarat dan ketentuan layanan Let's Encrypt (**A**).
- Pilih opsi **Redirect** untuk memaksa semua lalu lintas berpindah secara aman ke HTTPS.

### 6.3 Verifikasi Pembaruan Otomatis SSL (Auto-Renewal)
Let's Encrypt berlaku selama 90 hari. Certbot secara otomatis menjadwalkan pembaharuan sertifikat setiap hari di background. Pastikan proses pembaruan otomatis berfungsi dengan baik menggunakan tes simulasi:
```bash
sudo certbot renew --dry-run
```
Jika simulasi sukses (`dry run successful`), sistem SSL server Anda telah mandiri dan terkonfigurasi secara sempurna untuk jangka panjang.
