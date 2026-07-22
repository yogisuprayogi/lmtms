export function getBakuModulAjarTemplate(
  topik = "Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)",
  alokasi = "3 JP x 45 menit (1 pertemuan)",
  satuanPendidikan = "SMA Negeri 2 Ciamis",
  mataPelajaran = "Informatika",
  faseKelas = "F / XII",
  elemen = "Algoritma dan Pemrograman",
  tahun = "2026"
) {
  return `MODUL AJAR INFORMATIKA - DEEP LEARNING
Topik: ${topik} (${alokasi})

A. Informasi Umum
Satuan Pendidikan : ${satuanPendidikan}
Mata Pelajaran : ${mataPelajaran}
Fase / Kelas : ${faseKelas}
Elemen : ${elemen}
Alokasi Waktu : ${alokasi}
Pendekatan : Pembelajaran Mendalam (Deep Learning): Berkesadaran, Bermakna, Menggembirakan.
Tahun Penyusunan : ${tahun}

1. Capaian Pembelajaran
Pada akhir fase F, peserta didik mampu bergotong-royong dalam mengembangkan program modular yang berukuran besar menggunakan bahasa pemrograman yang ditentukan, mampu memahami struktur program (aspek statik) dan eksekusi (aspek dinamik) suatu program sumber (source code) serta memelihara dan menyempurnakannya, mampu mengenal algoritma standar dan strategi efisiensinya, mampu merancang dan mengimplementasikan struktur data abstrak yang kompleks seperti beberapa library standar termasuk library untuk kecerdasan buatan (Artificial Intelligence) dan pengolahan data bervolume besar, serta mampu menerjemahkan sebuah program dalam satu bahasa yang sudah dikenalnya ke bahasa lain berdasarkan kaidah translasi yang diberikan.

2. Tujuan Pembelajaran
1. Peserta didik mampu merancang program modular (menggunakan fungsi/prosedur) untuk memecah persoalan kompleks menjadi bagian-bagian kecil yang terstruktur melalui praktik pemrograman langsung.
2. Peserta didik mampu mengimplementasikan struktur data abstrak sederhana (stack dan queue) menggunakan bahasa pemrograman tekstual untuk menyelesaikan persoalan nyata secara logis dan kritis.
3. Peserta didik mampu menguji, menelusuri kesalahan (debugging), dan menyempurnakan kode program secara mandiri maupun kolaboratif, serta mendokumentasikan aspek statik dan dinamik programnya.

3. Kompetensi Awal
a. Peserta didik telah memahami sintaks dasar pemrograman prosedural (variabel, percabangan, dan perulangan) dari pembelajaran sebelumnya.
b. Peserta didik telah terbiasa menulis dan menjalankan program sederhana menggunakan salah satu bahasa pemrograman tekstual (misalnya Python).

4. Dimensi Profil Lulusan
Pertemuan ini menguatkan dimensi:
a. Penalaran Kritis - menganalisis struktur program dan menentukan struktur data yang tepat untuk suatu persoalan.
b. Kreativitas - merancang solusi modular yang efisien untuk persoalan yang diberikan.
c. Kolaborasi - bekerja sama menyelesaikan LKPD pemrograman dalam kelompok.
d. Kemandirian - menyelesaikan latihan debugging dan refleksi secara individu.

5. Tiga Prinsip Pembelajaran Mendalam pada Pertemuan Ini
| Prinsip | Makna | Penerapan pada Pertemuan Ini |
| --- | --- | --- |
| Berkesadaran (Mindful) | Peserta didik belajar dengan kesadaran penuh terhadap tujuan dan proses berpikirnya, serta dilibatkan dalam menentukan strategi belajarnya sendiri. | Peserta didik diajak menyadari tujuan belajar di awal pertemuan dan menuliskan refleksi metakognitif atas proses berpikirnya saat merancang fungsi dan struktur data. |
| Bermakna (Meaningful) | Materi dikaitkan dengan konteks nyata, relevan, dan dapat diterapkan dalam kehidupan maupun bidang ilmu lain. | Konsep modularisasi dan struktur data abstrak dibangun dari studi kasus nyata (fitur undo, antrean cetak dokumen) yang dekat dengan pengalaman peserta didik. |
| Menggembirakan (Joyful) | Suasana belajar yang positif, menyenangkan, aman secara psikologis, dan membangkitkan rasa ingin tahu. | Kegiatan coding dikemas dengan tantangan menyelesaikan bug secara berkelompok ('bug hunt') dan sesi demo program yang apresiatif, tanpa tekanan atas kesalahan. |

6. Kerangka Pembelajaran
| Komponen | Penerapan |
| --- | --- |
| Praktik Pedagogis | Discovery learning dipadukan praktik pemrograman langsung; peserta didik membangun sendiri pemahaman konsep modular dan struktur data dari eksplorasi kode, bukan menerima definisi jadi dari guru. |
| Kemitraan Pembelajaran | Guru berperan sebagai fasilitator yang memandu dengan pertanyaan pemantik; peserta didik bekerja sama dalam kelompok dan terlibat menentukan cara menguji programnya. |
| Lingkungan Pembelajaran | Kelas dikondisikan aman secara psikologis: kesalahan (bug) dalam program dipandang sebagai bagian dari proses belajar, bukan untuk dinilai negatif. |
| Pemanfaatan Digital | Praktik pemrograman menggunakan IDE/text editor (mis. VS Code atau Replit) dan bahasa pemrograman tekstual pilihan sekolah untuk memperkuat pemahaman bermakna. |

7. Sarana dan Prasarana
a. Papan tulis, spidol, LCD proyektor/gawai untuk menampilkan contoh kode dan ilustrasi struktur data.
b. Lembar Kerja Peserta Didik (LKPD) dan lembar jurnal refleksi.
c. Perangkat komputer/laptop dengan IDE/text editor dan bahasa pemrograman tekstual (mis. Python) terpasang.

8. Target Peserta Didik
Peserta didik reguler kelas XII Fase F, tanpa kesulitan belajar khusus.

B. Komponen Inti
1. Pemahaman Bermakna
Aplikasi-aplikasi besar yang kita gunakan sehari-hari, seperti media sosial atau aplikasi kasir digital, dibangun oleh banyak programmer secara bersama-sama. Hal ini dimungkinkan karena program dipecah menjadi bagian-bagian kecil (modul/fungsi) yang saling terhubung dan dapat dikerjakan, diuji, serta diperbaiki secara terpisah. Selain itu, banyak fitur yang kita anggap sederhana - seperti tombol 'Undo' atau antrean cetak dokumen - sebenarnya menggunakan struktur data khusus di baliknya. Memahami cara merancang program modular dan struktur data abstrak membantu kita membangun program yang rapi, mudah dipelihara, dan efisien.

2. Pertanyaan Pemantik
a. Bagaimana aplikasi besar seperti media sosial dapat dibangun oleh ratusan programmer tanpa saling tumpang tindih kode satu sama lain?
b. Pernahkah kalian menekan tombol 'Undo' saat mengetik dokumen? Menurutmu, bagaimana program bisa tahu urutan aksi mana yang harus dibatalkan lebih dulu?
c. Jika kalian mengantre mencetak dokumen di printer sekolah bersama teman-teman, dokumen siapa yang akan tercetak lebih dulu? Mengapa demikian?

3. Pengalaman Belajar
| Tahap | Aktivitas Pembelajaran | Waktu |
| --- | --- | --- |
| Pendahuluan | 1. Guru membuka pembelajaran dengan salam, doa, dan memeriksa kehadiran peserta didik. [Menggembirakan]<br>2. Guru mengajak peserta didik menyadari tujuan belajar hari ini dan mengapa topik pemrograman modular dan struktur data penting dipelajari. [Berkesadaran]<br>3. Guru mengajukan pertanyaan pemantik. [Bermakna]<br>4. Guru melakukan asesmen awal (assessment as learning) secara lisan untuk mengecek kesiapan peserta didik terkait dasar pemrograman yang sudah mereka kenal. | 15 menit |
| Memahami | 1. Peserta didik mengamati sebuah program tekstual sederhana yang belum modular (semua kode dalam satu blok panjang) dan diminta menuliskan kesulitan yang mereka temukan saat membacanya. [Berkesadaran, Bermakna]<br>2. Peserta didik dibagi dalam kelompok kecil (4-5 orang) dan menerima LKPD untuk memandu proses penemuan konsep.<br>3. Melalui pertanyaan pemandu guru ("Bagian kode mana yang berulang?", "Bagaimana jika bagian ini dipisah menjadi fungsi tersendiri?"), peserta didik membangun sendiri pemahaman tentang konsep modularisasi dan struktur data stack/queue. [Berkesadaran]<br>4. Peserta didik mengubah program menjadi bentuk modular menggunakan fungsi, serta menjelaskan dengan bahasa sendiri perbedaan cara kerja stack (LIFO) dan queue (FIFO). [Bermakna] | 35 menit |
| Mengaplikasi | 1. Setiap kelompok menerapkan pemahaman yang ditemukan untuk menyelesaikan studi kasus pada LKPD (membuat program modular yang mengimplementasikan stack atau queue untuk kasus antrean atau riwayat aksi). [Bermakna]<br>2. Kelompok menguji programnya, melakukan debugging bersama, lalu mendemonstrasikan hasil kerja secara singkat; kelas memberi apresiasi dan tanggapan dengan suasana terbuka dan positif. [Menggembirakan]<br>3. Sebagai penutup kegiatan mengaplikasi, dilakukan sesi 'bug hunt' berkelompok (menemukan dan memperbaiki kesalahan pada potongan kode) sebagai penguatan yang menyenangkan. [Menggembirakan]<br>4. Guru memberikan penguatan konsep dan meluruskan miskonsepsi yang muncul selama presentasi. | 50 menit |
| Merefleksi | 1. Peserta didik menuliskan jurnal refleksi metakognitif singkat: apa yang telah dipahami, bagaimana proses berpikir mereka saat merancang program modular, dan bagian mana yang masih sulit. [Berkesadaran]<br>2. Peserta didik menilai diri sendiri menggunakan daftar periksa (self-assessment) capaian belajar hari ini.<br>3. Guru memberikan umpan balik konstruktif secara langsung terhadap beberapa refleksi peserta didik. | 20 menit |
| Penutup | 1. Peserta didik bersama guru menyimpulkan konsep pemrograman modular, struktur data abstrak, dan strategi debugging.<br>2. Guru memberikan apresiasi atas partisipasi peserta didik selama pembelajaran. [Menggembirakan]<br>3. Peserta didik dilibatkan menentukan agenda/kesiapan pertemuan berikutnya. [Berkesadaran]<br>4. Guru menutup pembelajaran dengan doa dan salam. | 15 menit |

4. Asesmen
Jenis | Bentuk dan Waktu Pelaksanaan
- Assessment as Learning (Awal & sepanjang proses): Refleksi metakognitif peserta didik (jurnal singkat) dan daftar periksa penilaian diri pada tahap Merefleksi; peserta didik menilai dan menyadari sendiri proses belajarnya.
- Assessment for Learning (Selama proses): Observasi guru terhadap diskusi dan praktik pemrograman kelompok pada tahap Memahami dan Mengaplikasi menggunakan rubrik penilaian, serta umpan balik lisan langsung untuk memperbaiki pemahaman peserta didik.
- Assessment of Learning (Akhir pertemuan): Soal evaluasi individu (5 soal) yang dikerjakan pada tahap akhir kegiatan Mengaplikasi/Merefleksi untuk mengukur ketercapaian tujuan pembelajaran.

Rubrik Penilaian Proses (Assessment for Learning)
| Aspek yang Dinilai | Baik Sekali (86-100) | Baik (71-85) | Perlu Bimbingan (<71) |
| --- | --- | --- | --- |
| Modularisasi program | Merancang program modular dengan fungsi yang tepat, terstruktur, dan menjelaskan alasannya secara logis dan sadar proses berpikirnya. | Merancang program modular dengan fungsi yang cukup tepat, penjelasan cukup logis. | Belum tepat dalam merancang program modular. |
| Implementasi struktur data abstrak | Mengimplementasikan stack/queue dengan tepat dan menjelaskan cara kerjanya secara mendalam. | Mengimplementasikan stack/queue dengan tepat namun penjelasan kurang mendalam. | Belum tepat dalam mengimplementasikan struktur data abstrak. |
| Pengujian dan debugging | Menguji program secara sistematis, menemukan dan memperbaiki kesalahan dengan tepat. | Menguji program dengan cukup baik namun ada kesalahan yang belum diperbaiki. | Belum mampu menguji atau memperbaiki kesalahan program. |
| Kesadaran metakognitif (refleksi) | Mampu menjelaskan proses berpikirnya secara jujur, rinci, dan menyadari kekuatan/kelemahan pemahamannya. | Mampu menuliskan refleksi dengan cukup jelas. | Refleksi belum menggambarkan proses berpikir secara jelas. |
| Kerja sama & partisipasi | Aktif berkontribusi, menghargai pendapat teman, dan turut menjaga suasana belajar yang positif. | Berkontribusi cukup aktif dalam kelompok. | Kurang aktif berkontribusi dalam kelompok. |

Soal Evaluasi Individu (Assessment of Learning)
| No | Soal |
| --- | --- |
| 1 | Jelaskan apa yang dimaksud dengan pemrograman modular dan sebutkan minimal dua keuntungannya dibandingkan menulis program dalam satu blok panjang! |
| 2 | Jelaskan perbedaan cara kerja struktur data Stack (LIFO) dan Queue (FIFO) beserta satu contoh penerapannya masing-masing dalam kehidupan sehari-hari! |
| 3 | Sebuah aplikasi kasir digital membutuhkan fitur untuk mencatat antrean pelanggan yang menunggu dilayani. Struktur data apa yang paling tepat digunakan? Jelaskan alasanmu! |
| 4 | Perhatikan potongan program modular berikut (disediakan guru pada lembar soal). Telusuri alur eksekusinya dan tentukan hasil keluarannya! |
| 5 | Jelaskan dengan bahasamu sendiri bagaimana proses berpikirmu saat menemukan dan memperbaiki kesalahan (bug) pada program kelompokmu. Menurutmu, mengapa kemampuan debugging penting bagi seorang programmer? |

Pedoman Penskoran: nomor 1-4 bernilai 20 poin, nomor 5 dinilai berdasarkan kedalaman refleksi berpikir (skor maksimal 100).

5. Pengayaan dan Remedial
Pengayaan:
Peserta didik yang telah mencapai KKTP diberikan soal HOTS, misalnya merancang program modular yang mengombinasikan stack dan queue untuk kasus yang lebih kompleks serta diminta merefleksikan strategi efisiensi program yang dirancang.

Remedial:
Peserta didik yang belum mencapai KKTP diberikan bimbingan ulang dengan pendekatan konkret (menggunakan ilustrasi visual/simulasi manual tumpukan buku untuk stack dan antrean orang untuk queue) dalam suasana yang tetap suportif dan tidak menghakimi, sesuai prinsip menggembirakan.

6. Refleksi Peserta Didik dan Guru
Refleksi Peserta Didik (Assessment as Learning)
a. Apa yang telah aku pahami tentang pemrograman modular dan struktur data abstrak hari ini?
b. Bagaimana proses berpikirku saat merancang fungsi dan memilih struktur data yang tepat?
c. Bagian mana yang masih membingungkan dan perlu kupelajari kembali?

Refleksi Guru
a. Apakah ketiga prinsip (berkesadaran, bermakna, menggembirakan) sudah terasa dalam pembelajaran hari ini?
b. Apakah tujuan pembelajaran telah tercapai? Kendala apa yang ditemui dan bagaimana solusinya untuk pertemuan berikutnya?

---

Lampiran 1: Lembar Kerja Peserta Didik (LKPD)
LKPD: MERANCANG PROGRAM MODULAR DAN STRUKTUR DATA
Nama Kelompok : .....................................................
Anggota:
1. .....................
2. .....................
3. .....................
4. .....................
5. .....................
Kelas : ${faseKelas}
Alokasi Waktu : 50 menit (tahap Memahami-Mengaplikasi)

Tujuan: Melalui eksplorasi kode program dan diskusi kelompok, kalian akan membangun sendiri pemahaman tentang cara merancang program modular dan mengimplementasikan struktur data abstrak (stack dan queue).

Kegiatan 1 - Memahami: Mengubah Program Menjadi Modular
| No | Bagian Kode | Nama Fungsi Usulan | Tugas Fungsi Tersebut |
| --- | --- | --- | --- |
| 1 | ........................... | ........................... | ........................... |
| 2 | ........................... | ........................... | ........................... |
| 3 | ........................... | ........................... | ........................... |

Kegiatan 2 - Memahami: Stack vs Queue
| Aspek | Stack (LIFO) | Queue (FIFO) |
| --- | --- | --- |
| Cara kerja | ........................... | ........................... |
| Contoh penerapan nyata | ........................... | ........................... |
| Operasi utama | ........................... | ........................... |

Menurut kelompokmu, mengapa fitur 'Undo' pada aplikasi pengolah kata menggunakan Stack, bukan Queue? Jelaskan!
.....................................................................................................................

Kegiatan 3 - Mengaplikasi: Studi Kasus Sistem Antrean Kasir Digital
Toko "Kreatif Digital Store" membutuhkan program sederhana untuk mengelola antrean pelanggan yang menunggu dilayani kasir, dengan pelanggan yang datang lebih dulu harus dilayani lebih dulu.
Struktur data apa yang paling tepat digunakan untuk kasus ini? Jelaskan alasanmu!
.....................................................................................................................
Rancang program modular (minimal 3 fungsi) untuk mengelola antrean tersebut (misalnya fungsi tambah_antrean, layani_pelanggan, dan tampilkan_antrean)! Tuliskan kerangka kodenya.
.....................................................................................................................

Kegiatan 4 - Merefleksi
Apa yang telah aku pahami dari kegiatan hari ini?
.....................................................................................................................
Bagaimana proses berpikirku saat merancang fungsi dan menentukan struktur data yang tepat? Langkah apa yang paling membantu?
.....................................................................................................................
Bagian mana yang masih membingungkan bagiku?
.....................................................................................................................

Lampiran 2: Glosarium
a. Program Modular: program yang dipecah menjadi beberapa bagian (modul/fungsi) yang masing-masing menjalankan tugas tertentu dan dapat dikembangkan secara terpisah.
b. Fungsi/Prosedur: blok kode yang dapat dipanggil berulang kali untuk menjalankan suatu tugas tertentu dalam program.
c. Struktur Data Abstrak: cara pengorganisasian data yang mendefinisikan kumpulan operasi tanpa terikat pada detail implementasinya.
d. Stack (Tumpukan): struktur data dengan prinsip LIFO (Last In First Out), di mana data yang terakhir dimasukkan adalah yang pertama dikeluarkan.
e. Queue (Antrean): struktur data dengan prinsip FIFO (First In First Out), di mana data yang pertama dimasukkan adalah yang pertama dikeluarkan.
f. Debugging: proses menelusuri, menemukan, dan memperbaiki kesalahan (bug) pada suatu program.
g. Source Code (Kode Sumber): kumpulan instruksi program yang ditulis dalam bahasa pemrograman tertentu sebelum dijalankan oleh komputer.
h. Pembelajaran Mendalam: pendekatan belajar yang berlandaskan tiga prinsip berkesadaran, bermakna, dan menggembirakan, dengan pengalaman belajar memahami-mengaplikasi-merefleksi.

Lampiran 3: Daftar Pustaka
a. Kementerian Pendidikan Dasar dan Menengah. Naskah Akademik Pembelajaran Mendalam: Menuju Pendidikan Bermutu untuk Semua. Jakarta: Pusat Kurikulum dan Pembelajaran, 2025.
b. Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Buku Panduan Guru Informatika untuk SMA/SMK Kelas XII. Jakarta: Pusat Perbukuan.
c. Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). Capaian Pembelajaran Mata Pelajaran Informatika Fase F, Keputusan No. 032/H/KR/2024.
d. Sumber referensi lain yang relevan dan mutakhir sesuai kebijakan satuan pendidikan.

Lampiran 4: DAFTAR PERIKSA (SELF-ASSESSMENT) CAPAIAN BELAJAR PESERTA DIDIK
Topik: ${topik}
Fase ${faseKelas} - Pembelajaran Mendalam (Berkesadaran, Bermakna, Menggembirakan)
Nama : .....................................................
Kelas : .....................................................
Kelompok : .....................................................
Tanggal : .....................................................

A. Pemahaman Konsep Pemrograman Modular
| No | Pernyataan Capaian Belajar | Sudah Paham | Cukup Paham | Belum Paham |
| --- | --- | --- | --- | --- |
| 1 | Saya dapat menjelaskan dengan kata-kata sendiri apa yang dimaksud dengan program modular dan fungsi. | [ ] | [ ] | [ ] |
| 2 | Saya dapat membedakan struktur data Stack dan Queue secara jelas. | [ ] | [ ] | [ ] |
| 3 | Saya dapat menjelaskan prinsip kerja LIFO dan FIFO. | [ ] | [ ] | [ ] |
| 4 | Saya memahami langkah-langkah dasar dalam melakukan debugging program. | [ ] | [ ] | [ ] |

B. Analisis dan Penerapan
| No | Pernyataan Capaian Belajar | Sudah Paham | Cukup Paham | Belum Paham |
| --- | --- | --- | --- | --- |
| 1 | Saya dapat merancang program modular untuk suatu persoalan sederhana. | [ ] | [ ] | [ ] |
| 2 | Saya dapat menentukan struktur data yang tepat (Stack/Queue) untuk suatu kasus. | [ ] | [ ] | [ ] |
| 3 | Saya dapat menguji dan memperbaiki kesalahan pada program yang saya buat. | [ ] | [ ] | [ ] |

C. Kesadaran Metakognitif (Proses Berpikir)
| No | Pernyataan Capaian Belajar | Sudah Paham | Cukup Paham | Belum Paham |
| --- | --- | --- | --- | --- |
| 1 | Saya menyadari langkah-langkah berpikir saya sendiri saat merancang fungsi dan struktur data. | [ ] | [ ] | [ ] |
| 2 | Saya dapat menjelaskan mengapa suatu struktur data saya pilih, bukan sekadar menebak. | [ ] | [ ] | [ ] |
| 3 | Saya jujur mengenali bagian mana dari materi hari ini yang masih membingungkan bagi saya. | [ ] | [ ] | [ ] |

D. Kerja Sama dan Partisipasi
| No | Pernyataan Capaian Belajar | Sudah Paham | Cukup Paham | Belum Paham |
| --- | --- | --- | --- | --- |
| 1 | Saya aktif berkontribusi dan menyampaikan pendapat dalam diskusi kelompok. | [ ] | [ ] | [ ] |
| 2 | Saya menghargai pendapat teman sekelompok selama diskusi berlangsung. | [ ] | [ ] | [ ] |
| 3 | Saya turut menjaga suasana belajar kelompok tetap positif dan nyaman. | [ ] | [ ] | [ ] |

E. Refleksi Singkat
1. Bagian yang paling saya pahami dari pembelajaran hari ini adalah ...
2. Bagian yang masih perlu saya pelajari kembali adalah ...
3. Langkah yang akan saya lakukan untuk mengatasi bagian yang masih sulit tersebut adalah ...

Tanda tangan: ________________________________`;
}

export function getBakuModulAjarDataAnalisisTemplate() {
  return `MODUL AJAR INFORMATIKA - DEEP LEARNING
Topik: Pengolahan dan Analisis Data Bervolume Besar untuk Pengambilan Keputusan (3 JP)

A. Informasi Umum
Satuan Pendidikan : SMA Negeri 2 Ciamis
Mata Pelajaran : Informatika
Fase / Kelas : F / XII
Elemen : Analisis Data (terintegrasi dalam Praktik Lintas Bidang)
Alokasi Waktu : 3 JP x 45 menit (1 pertemuan)
Pendekatan : Pembelajaran Mendalam (Deep Learning): Berkesadaran, Bermakna, Menggembirakan.
Tahun Penyusunan : 2026

1. Capaian Pembelajaran
Pada akhir fase F, peserta didik mampu mengumpulkan, menstrukturkan, mengolah, dan menganalisis data bervolume besar secara efisien dan sistematis dengan memanfaatkan perkakas serta pustaka (library) standar pengolahan data, untuk menginterpretasi, menyimpulkan, memprediksi, dan menyajikan hasil analisis dalam berbagai bentuk representasi (teks, grafik, dan visualisasi lain) guna mendukung pengambilan keputusan pada persoalan nyata. Capaian ini merupakan penjabaran elemen Analisis Data yang pada Fase F terintegrasi dalam elemen Praktik Lintas Bidang, mengacu pada Capaian Pembelajaran Mata Pelajaran Informatika Fase F (SK BSKAP No. 032/H/KR/2024).

2. Tujuan Pembelajaran
1. Peserta didik mampu mengumpulkan dan menstrukturkan data bervolume besar dari suatu dataset melalui eksplorasi perkakas pengolah data dengan sistematis.
2. Peserta didik mampu menganalisis data menggunakan statistik deskriptif (rata-rata, median, modus, dan sebaran data) untuk menemukan pola, tren, dan anomali melalui diskusi kelompok secara kritis.
3. Peserta didik mampu menyajikan hasil analisis data dalam bentuk visualisasi (grafik) dan memberikan rekomendasi keputusan berdasarkan temuan data pada suatu studi kasus nyata.

3. Kompetensi Awal
a. Peserta didik telah memahami pengoperasian dasar aplikasi lembar kerja (spreadsheet) seperti Microsoft Excel atau Google Sheets.
b. Peserta didik telah mengenal istilah dasar statistika seperti rata-rata, median, dan modus dari pembelajaran matematika.

4. Dimensi Profil Lulusan
Pertemuan ini menguatkan dimensi:
a. Penalaran Kritis - menganalisis pola dan tren pada data untuk mengambil kesimpulan yang logis.
b. Kreativitas - merancang bentuk visualisasi data yang komunikatif dan sesuai konteks.
c. Kolaborasi - bekerja sama menyelesaikan LKPD pengolahan data dalam kelompok.
d. Kemandirian - menyelesaikan latihan analisis dan refleksi secara individu.

5. Tiga Prinsip Pembelajaran Mendalam pada Pertemuan Ini
| Prinsip | Makna | Penerapan pada Pertemuan Ini |
| --- | --- | --- |
| Berkesadaran (Mindful) | Peserta didik belajar dengan kesadaran penuh terhadap tujuan dan proses berpikirnya, serta dilibatkan dalam menentukan strategi belajarnya sendiri. | Peserta didik diajak menyadari tujuan belajar di awal pertemuan dan menuliskan refleksi metakognitif atas proses berpikirnya saat menafsirkan hasil analisis data. |
| Bermakna (Meaningful) | Materi dikaitkan dengan konteks nyata, relevan, dan dapat diterapkan dalam kehidupan maupun bidang ilmu lain. | Konsep analisis data dibangun dari studi kasus nyata (data penjualan toko, data nilai sekolah, atau data survei) yang dekat dengan pengalaman peserta didik. |
| Menggembirakan (Joyful) | Suasana belajar yang positif, menyenangkan, aman secara psikologis, dan membangkitkan rasa ingin tahu. | Kegiatan eksplorasi data dikemas dengan tantangan menemukan pola tersembunyi ("detektif data") dan sesi berbagi temuan yang apresiatif, tanpa tekanan atas kesalahan. |

6. Kerangka Pembelajaran
| Komponen | Penerapan |
| --- | --- |
| Praktik Pedagogis | Discovery learning dipadukan praktik langsung mengolah data; peserta didik membangun sendiri pemahaman teknik analisis dari eksplorasi dataset, bukan menerima definisi jadi dari guru. |
| Kemitraan Pembelajaran | Guru berperan sebagai fasilitator yang memandu dengan pertanyaan pemantik; peserta didik bekerja sama dalam kelompok dan terlibat menentukan cara menyajikan hasil analisinya. |
| Lingkungan Pembelajaran | Kelas dikondisikan aman secara psikologis: kesalahan dalam mengolah atau menafsirkan data dipandang sebagai bagian dari proses belajar, bukan untuk dinilai negatif. |
| Pemanfaatan Digital | Pengolahan dan visualisasi data menggunakan aplikasi spreadsheet (Google Sheets/Ms Excel) atau perkakas visualisasi sederhana untuk memperkuat pemahaman bermakna. |

7. Sarana dan Prasarana
a. Papan tulis, spidol, LCD proyektor/gawai untuk menampilkan dataset dan contoh visualisasi.
b. Lembar Kerja Peserta Didik (LKPD) dan lembar jurnal refleksi.
c. Perangkat komputer/laptop dengan aplikasi pengolah lembar kerja (Google Sheets/Ms Excel) untuk eksplorasi data.

8. Target Peserta Didik
Peserta didik reguler kelas XII Fase F, tanpa kesulitan belajar khusus.

B. Komponen Inti
1. Pemahaman Bermakna
Dalam kehidupan sehari-hari, keputusan besar maupun kecil semakin sering didasarkan pada data - mulai dari rekomendasi tontonan, prediksi cuaca, hingga strategi bisnis suatu perusahaan. Data mentah yang jumlahnya sangat besar tidak akan bermakna apa-apa jika tidak diolah dan dianalisis dengan tepat. Memahami cara menstrukturkan, mengolah, dan menafsirkan data membantu kita mengambil keputusan yang lebih rasional dan berbasis bukti, bukan sekadar asumsi.

2. Pertanyaan Pemantik
a. Pernahkah kalian melihat rekomendasi produk di aplikasi belanja daring yang seolah 'tahu' apa yang kalian butuhkan? Bagaimana hal itu bisa terjadi?
b. Bagaimana sebuah perusahaan bisa mengambil keputusan bisnis yang penting hanya dari kumpulan angka-angka yang tampak biasa saja?
c. Jika kalian memiliki data penjualan sebuah toko selama satu tahun, bagaimana cara mengetahui bulan mana yang penjualannya paling tinggi?

3. Pengalaman Belajar
| Tahap | Aktivitas Pembelajaran | Waktu |
| --- | --- | --- |
| Pendahuluan | 1. Guru membuka pembelajaran dengan salam, doa, dan memeriksa kehadiran peserta didik. [Menggembirakan]<br>2. Guru mengajak peserta didik menyadari tujuan belajar hari ini dan mengapa topik analisis data penting dipelajari. [Berkesadaran]<br>3. Guru mengajukan pertanyaan pemantik. [Bermakna]<br>4. Guru melakukan asesmen awal lisan. | 15 menit |
| Memahami | 1. Peserta didik mengamati dataset sederhana dan diminta menuliskan hal yang diperhatikan. [Berkesadaran, Bermakna]<br>2. Peserta didik dibagi dalam kelompok kecil (4-5 orang) dan menerima LKPD.<br>3. Melalui pertanyaan pemandu guru, peserta didik membangun sendiri pemahaman teknik statistik deskriptif dan anomali data. [Berkesadaran]<br>4. Peserta didik menghitung rata-rata, median, modus dan menjelaskan maknanya. [Bermakna] | 35 menit |
| Mengaplikasi | 1. Setiap kelompok menyelesaikan studi kasus pada LKPD (mengolah dataset penjualan, visualisasi, dan rekomendasi). [Bermakna]<br>2. Kelompok menyajikan hasil kerja secara singkat dan saling memberi tanggapan positif. [Menggembirakan]<br>3. Kuis cepat berkelompok ('detektif data': menebak pola grafik). [Menggembirakan]<br>4. Guru memberikan penguatan konsep. | 50 menit |
| Merefleksi | 1. Peserta didik menuliskan jurnal refleksi metakognitif singkat. [Berkesadaran]<br>2. Peserta didik menilai diri sendiri menggunakan daftar periksa (self-assessment).<br>3. Guru memberikan umpan balik konstruktif langsung. | 20 menit |
| Penutup | 1. Menyimpulkan konsep pengolahan data dan visualisasi.<br>2. Guru memberikan apresiasi. [Menggembirakan]<br>3. Peserta didik dilibatkan menentukan agenda pertemuan berikutnya. [Berkesadaran]<br>4. Doa dan salam. | 15 menit |

4. Asesmen
| Jenis | Bentuk dan Waktu Pelaksanaan |
| --- | --- |
| Assessment as Learning (Awal & sepanjang proses) | Refleksi metakognitif peserta didik (jurnal singkat) dan daftar periksa penilaian diri pada tahap Merefleksi; peserta didik menilai dan menyadari sendiri proses belajarnya. |
| Assessment for Learning (Selama proses) | Observasi guru terhadap diskusi kelompok pada tahap Memahami dan Mengaplikasi menggunakan rubrik penilaian. |
| Assessment of Learning (Akhir pertemuan) | Soal evaluasi individu (5 soal) yang dikerjakan pada tahap akhir untuk mengukur ketercapaian tujuan pembelajaran. |

Rubrik Penilaian Proses (Assessment for Learning)
| Aspek yang Dinilai | Baik Sekali (86-100) | Baik (71-85) | Perlu Bimbingan (<71) |
| --- | --- | --- | --- |
| Pengolahan data | Mengumpulkan dan menstrukturkan data dengan tepat, sistematis, dan menjelaskan alasannya secara logis. | Mengumpulkan dan menstrukturkan sebagian besar data dengan tepat, penjelasan cukup logis. | Belum tepat dalam mengumpulkan atau menstrukturkan data. |
| Analisis statistik deskriptif | Menghitung dan menafsirkan ukuran statistik dengan tepat dan memberikan interpretasi mendalam. | Menghitung ukuran statistik dengan tepat namun interpretasi kurang mendalam. | Belum tepat dalam menghitung atau menafsirkan ukuran statistik. |
| Visualisasi dan rekomendasi | Menyajikan visualisasi yang komunikatif dan memberikan rekomendasi keputusan yang logis. | Menyajikan visualisasi dengan tepat namun rekomendasi kurang lengkap. | Belum tepat dalam menyajikan visualisasi atau memberikan rekomendasi. |
| Kesadaran metakognitif (refleksi) | Mampu menjelaskan proses berpikirnya secara jujur, rinci, dan menyadari kekuatan/kelemahannya. | Mampu menuliskan refleksi dengan cukup jelas. | Refleksi belum menggambarkan proses berpikir secara jelas. |
| Kerja sama & partisipasi | Aktif berkontribusi, menghargai pendapat teman, dan turut menjaga suasana belajar positif. | Berkontribusi cukup aktif dalam kelompok. | Kurang aktif berkontribusi dalam kelompok. |

Soal Evaluasi Individu (Assessment of Learning)
| No | Soal |
| --- | --- |
| 1 | Jelaskan perbedaan antara rata-rata (mean), median, dan modus, serta kapan sebaiknya masing-masing ukuran tersebut digunakan! |
| 2 | Apa yang dimaksud dengan anomali (outlier) pada suatu data? Berikan satu contoh penyebab munculnya anomali dalam data penjualan! |
| 3 | Sebuah sekolah memiliki data nilai ujian 200 siswa. Jelaskan langkah-langkah yang akan kamu lakukan untuk mengolah data tersebut hingga menghasilkan kesimpulan tentang tingkat pemahaman siswa! |
| 4 | Mengapa visualisasi data (grafik) dianggap lebih efektif dibandingkan menyajikan data dalam bentuk angka mentah saja? Jelaskan dengan contoh! |
| 5 | Jelaskan dengan bahasamu sendiri bagaimana proses berpikirmu saat menentukan rekomendasi keputusan dari hasil analisis data pada studi kasus LKPD! |

Pedoman Penskoran: nomor 1-4 bernilai 20 poin, nomor 5 dinilai berdasarkan kedalaman refleksi berpikir (skor maksimal 100).

5. Pengayaan dan Remedial
Pengayaan: Menganalisis dataset berskala lebih besar menggunakan PivotTable atau statistik lanjutan.
Remedial: Bimbingan ulang dengan pendekatan konkret menggunakan dataset sederhana & infografis.

6. Refleksi Peserta Didik dan Guru
Refleksi Peserta Didik:
a. Apa yang telah aku pahami tentang pengolahan dan analisis data hari ini?
b. Bagaimana proses berpikirku saat menafsirkan pola dari data yang kuolah?
c. Bagian mana yang masih membingungkan dan perlu kupelajari kembali?

Refleksi Guru:
a. Apakah ketiga prinsip (berkesadaran, bermakna, menggembirakan) sudah terasa dalam pembelajaran hari ini?
b. Apakah tujuan pembelajaran telah tercapai? Kendala apa yang ditemui dan bagaimana solusinya?

---

Lampiran 1: Lembar Kerja Peserta Didik (LKPD)
Lampiran 2: Glosarium
Lampiran 3: Daftar Pustaka
Lampiran 4: DAFTAR PERIKSA (SELF-ASSESSMENT) CAPAIAN BELAJAR PESERTA DIDIK`;
}
