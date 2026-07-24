import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { readDB, writeDB } from "../db";

// Initialize Gemini API client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("[Gemini] Client successfully initialized inside devices controller.");
  } catch (error) {
    console.error("[Gemini] Failed to initialize inside devices controller:", error);
  }
}

export const getPerangkat = (req: Request, res: Response) => {
  const { kelas, jenis, tahunPelajaranId } = req.query;
  const db = readDB();
  let list = db.perangkatPembelajarans || [];

  // MULTI TAHUN: Filter by academic year
  if (tahunPelajaranId) {
    list = list.filter((p: any) => p.tahunPelajaranId === tahunPelajaranId);
  } else {
    // Default fallback to active academic year
    const activeYear = (db.years || []).find((y: any) => y.aktif);
    if (activeYear) {
      list = list.filter((p: any) => p.tahunPelajaranId === activeYear.id);
    }
  }

  if (kelas) list = list.filter((p: any) => p.kelas === kelas);
  if (jenis) list = list.filter((p: any) => p.jenis === jenis);

  res.json(list);
};

export const createPerangkat = (req: Request, res: Response) => {
  const { jenis, judul, elemen, kelas, konten, tahunPelajaranId, pembuatId } = req.body;
  if (!jenis || !judul || !elemen || !kelas || !konten || !tahunPelajaranId) {
    return res.status(400).json({ success: false, message: "Semua field wajib diisi." });
  }

  const db = readDB();
  const newItem = {
    id: `doc-${Date.now()}`,
    jenis,
    judul,
    elemen,
    kelas,
    konten,
    tahunPelajaranId,
    pembuatId: pembuatId || "usr-yogi",
    tanggalDibuat: new Date().toISOString().split("T")[0],
  };

  if (!db.perangkatPembelajarans) db.perangkatPembelajarans = [];
  db.perangkatPembelajarans.push(newItem);
  writeDB(db);
  res.json({ success: true, data: newItem });
};

export const updatePerangkat = (req: Request, res: Response) => {
  const { id } = req.params;
  const { judul, konten, elemen, kelas } = req.body;

  const db = readDB();
  const index = (db.perangkatPembelajarans || []).findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.perangkatPembelajarans[index] = {
      ...db.perangkatPembelajarans[index],
      judul: judul || db.perangkatPembelajarans[index].judul,
      konten: konten || db.perangkatPembelajarans[index].konten,
      elemen: elemen || db.perangkatPembelajarans[index].elemen,
      kelas: kelas || db.perangkatPembelajarans[index].kelas,
    };
    writeDB(db);
    return res.json({ success: true, data: db.perangkatPembelajarans[index] });
  }
  res.status(404).json({ success: false, message: "Dokumen tidak ditemukan." });
};

export const deletePerangkat = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const index = (db.perangkatPembelajarans || []).findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.perangkatPembelajarans.splice(index, 1);
    writeDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: "Dokumen tidak ditemukan." });
};

// Generate Perangkat Pembelajaran using Gemini AI or dynamic seed mock fallback
export const generatePerangkat = async (req: Request, res: Response) => {
  const { prompt, jenisDokumen, elemen, kelas } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt tidak boleh kosong." });
  }

  // Petunjuk sistem khusus untuk kurikulum merdeka informatika SMA dengan Kerangka Pembelajaran Mendalam (Deep Learning)
  let systemInstruction = `Anda adalah Asisten AI LMTMS (Learning Management & Teaching Management System) khusus Mata Pelajaran Informatika SMA di Indonesia (Kurikulum Merdeka).
  Tugas Anda adalah merancang dan menyusun draf perangkat pembelajaran yang profesional, mendalam, dan relevan secara akademis menggunakan bahasa Indonesia yang baik, terstruktur, dan formal.
  Jenis dokumen yang diminta: ${jenisDokumen || "Modul Ajar/Materi Pembelajaran"}.
  Elemen Kurikulum: ${elemen || "Berpikir Komputasional (BK)"}.
  Sasaran: SMA Kelas ${kelas || "X"} (Fase ${kelas === "X" ? "E" : "F"}).
  Format output HARUS berupa Markdown murni yang lengkap, profesional, terstruktur rapi (gunakan H1, H2, H3, poin-poin, tabel jika relevan, dan blok kode untuk pemrograman), tanpa komentar atau metadata tambahan di luar Markdown.
  
  ACUAN REGULASI RESMI KURIKULUM WAJIB (KERANGKA REGULASI TERBARU):
  Seluruh penyusunan Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), Modul Ajar, RPP, dan perangkat pembelajaran WAJIB mengacu pada Regulasi Resmi Pemerintah Kementerian Pendidikan Dasar dan Menengah RI terbaru:
  1. Permendikdasmen Nomor 10 Tahun 2025 tentang Standar Kompetensi Lulusan (SKL).
  2. Permendikdasmen Nomor 12 Tahun 2025 tentang Standar Isi.
  3. Permendikdasmen Nomor 13 Tahun 2025 tentang Perubahan Kurikulum Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah.
  4. Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025 tentang Capaian Pembelajaran pada PAUD, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.
  
  PENTING: Sesuaikan perangkat pembelajaran ini dengan Kerangka Pembelajaran Mendalam (Deep Learning) yang berfokus pada pengembangan holistik siswa melalui 4 pilar utama:
  - Praktik pedagogis interaktif (strategi mengajar aktif, interaktif, kolaboratif, eksploratif).
  - Kemitraan belajar (kolaborasi erat guru, siswa, orang tua, dan masyarakat/komunitas).
  - Lingkungan belajar yang fleksibel (ruang fisik & virtual aman, inklusif, mendukung eksplorasi).
  - Pemanfaatan teknologi digital (gawai/aplikasi sebagai alat investigasi dan interaksi kontekstual).
  
  Perangkat pembelajaran harus memadukan intrakurikuler dan kokurikuler untuk membentuk profil siswa yang mandiri dan bernalar kritis.
  
  Terapkan RUMUS 8-3-3-4 dalam penyusunan draf ini:
  1. Delapan (8) Dimensi Profil Lulusan (Berpusat pada karakter & kompetensi):
     - Keimanan dan ketakwaan kepada Tuhan Yang Maha Esa.
     - Kewargaan global dan nasional.
     - Penalaran kritis (kemampuan HOTS).
     - Kreativitas.
     - Kolaborasi.
     - Kemandirian.
     - Kesehatan fisik dan mental.
     - Komunikasi yang efektif.
  2. Tiga (3) Prinsip Pembelajaran (Membangun motivasi intrinsik):
     - Berkesadaran (Mindful): Siswa memahami tujuan belajar & aktif mengatur strateginya.
     - Bermakna (Meaningful): Pengetahuan diterapkan langsung untuk memecahkan masalah nyata.
     - Menggembirakan (Joyful): Suasana belajar positif, menantang, dan memotivasi peserta didik.
  3. Tiga (3) Pengalaman Belajar (Alur siklus kognitif):
     - Pemahaman (Memahami): Mengonstruksi konsep dari berbagai sumber.
     - Penerapan (Menerapkan): Menggunakan ilmu untuk memecahkan masalah.
     - Refleksi (Mengevaluasi): Menilai proses belajar & menerima umpan balik.
  4. Empat (4) Kerangka Pembelajaran (Komponen ekosistem):
     - Praktik Pedagogis, Kemitraan Belajar, Lingkungan Belajar, Pemanfaatan Teknologi Digital.`;

  if (jenisDokumen === "RPP_LENGKAP" || jenisDokumen === "RPP" || jenisDokumen === "MODUL") {
    systemInstruction += `\n\nSANGAT PENTING - FORMAT BAKU MODUL AJAR (DEEP LEARNING):
Dokumen Modul Ajar / RPP HARUS mengikuti struktur baku resmi Kurikulum Merdeka (Deep Learning: Berkesadaran, Bermakna, Menggembirakan) persis berikut ini:

MODUL AJAR INFORMATIKA - DEEP LEARNING
Topik: [Judul Topik Pembelajaran] ([Alokasi JP])

A. Informasi Umum
Satuan Pendidikan : SMA Negeri 2 Ciamis (atau nama sekolah)
Mata Pelajaran : Informatika
Fase / Kelas : [Fase E/F / Kelas X/XI/XII]
Elemen : [Nama Elemen]
Alokasi Waktu : [3 JP x 45 menit (1 pertemuan)]
Pendekatan : Pembelajaran Mendalam (Deep Learning): Berkesadaran, Bermakna, Menggembirakan.
Tahun Penyusunan : 2026

1. Capaian Pembelajaran
[Isi CP resmi mengacu pada Keputusan Kepala BSKAP Kemendikdasmen No. 046/H/KR/2025, Permendikdasmen No. 10/2025 (SKL), No. 12/2025 (Standar Isi), dan No. 13/2025 (Kurikulum) sesuai elemen]

2. Tujuan Pembelajaran
1. [Tujuan 1]
2. [Tujuan 2]
3. [Tujuan 3]

3. Kompetensi Awal
a. [Kompetensi awal 1]
b. [Kompetensi awal 2]

4. Dimensi Profil Lulusan
Pertemuan ini menguatkan dimensi:
a. Penalaran Kritis - [penjelasan]
b. Kreativitas - [penjelasan]
c. Kolaborasi - [penjelasan]
d. Kemandirian - [penjelasan]

5. Tiga Prinsip Pembelajaran Mendalam pada Pertemuan Ini
| Prinsip | Makna | Penerapan pada Pertemuan Ini |
| Berkesadaran (Mindful) | [Makna] | [Penerapan] |
| Bermakna (Meaningful) | [Makna] | [Penerapan] |
| Menggembirakan (Joyful) | [Makna] | [Penerapan] |

6. Kerangka Pembelajaran
| Komponen | Penerapan |
| Praktik Pedagogis | [Penerapan] |
| Kemitraan Pembelajaran | [Penerapan] |
| Lingkungan Pembelajaran | [Penerapan] |
| Pemanfaatan Digital | [Penerapan] |

7. Sarana dan Prasarana
a. [Sarana 1]
b. [Sarana 2]
c. [Sarana 3]

8. Target Peserta Didik
Peserta didik reguler kelas [X/XI/XII], tanpa kesulitan belajar khusus.

B. Komponen Inti
1. Pemahaman Bermakna
[Teks Pemahaman Bermakna]

2. Pertanyaan Pemantik
a. [Pertanyaan 1]
b. [Pertanyaan 2]
c. [Pertanyaan 3]

3. Pengalaman Belajar
| Tahap | Aktivitas Pembelajaran | Waktu |
| Pendahuluan | [Langkah-langkah dengan penanda [Berkesadaran], [Bermakna], atau [Menggembirakan]] | 15 menit |
| Memahami | [Langkah-langkah dengan penanda] | 35 menit |
| Mengaplikasi | [Langkah-langkah dengan penanda] | 50 menit |
| Merefleksi | [Langkah-langkah dengan penanda] | 20 menit |
| Penutup | [Langkah-langkah dengan penanda] | 15 menit |

4. Asesmen
| Jenis | Bentuk dan Waktu Pelaksanaan |
| Assessment as Learning (Awal & sepanjang proses) | [Bentuk] |
| Assessment for Learning (Selama proses) | [Bentuk] |
| Assessment of Learning (Akhir pertemuan) | [Bentuk] |

Rubrik Penilaian Proses (Assessment for Learning)
| Aspek yang Dinilai | Baik Sekali (86-100) | Baik (71-85) | Perlu Bimbingan (<71) |

Soal Evaluasi Individu (Assessment of Learning)
| No | Soal |
Pedoman Penskoran: nomor 1-4 bernilai 20 poin, nomor 5 dinilai berdasarkan kedalaman refleksi.

5. Pengayaan dan Remedial
Pengayaan: [Penjelasan]
Remedial: [Penjelasan]

6. Refleksi Peserta Didik dan Guru
Refleksi Peserta Didik (Assessment as Learning)
a. [Pertanyaan a]
b. [Pertanyaan b]
c. [Pertanyaan c]

Refleksi Guru
a. [Pertanyaan a]
b. [Pertanyaan b]

Lampiran 1: Lembar Kerja Peserta Didik (LKPD)
Lampiran 2: Glosarium
Lampiran 3: Daftar Pustaka
Lampiran 4: DAFTAR PERIKSA (SELF-ASSESSMENT) CAPAIAN BELAJAR PESERTA DIDIK
(Sertakan tabel daftar periksa self-assessment A, B, C, D, dan E)`;
  } else if (jenisDokumen === "ATP") {
    systemInstruction += `\n\nKHUSUS UNTUK ALUR TUJUAN PEMBELAJARAN (ATP): Petakan Capaian Pembelajaran (CP) ke Alur Tujuan Pembelajaran secara logis-kronologis dari materi mendasar ke kompleks, sebutkan alokasi waktu JP, tujuan spesifik, materi pokok, dan indikator penilaian kualitatif.`;
  } else if (jenisDokumen === "SOAL") {
    systemInstruction += `\n\nKHUSUS UNTUK SOAL ASESMEN: Tuliskan butir-butir soal ujian/kuis interaktif yang menantang penalaran kritis (LOTS/HOTS). Sertakan pilihan jawaban (A, B, C, D, E) untuk Pilihan Ganda beserta kunci jawaban yang benar dan penjelasan pembahasan analitis yang mendalam untuk setiap soal.`;
  } else if (jenisDokumen === "RUBRIK") {
    systemInstruction += `\n\nKHUSUS UNTUK RUBRIK PENILAIAN: Rancanglah rubrik evaluasi berupa tabel Markdown yang memuat kriteria penilaian esensial, bobot penilaian, dan kriteria kualitatif penilaian berskala 1 sampai 4 (Sangat Baik, Baik, Cukup, Perlu Bimbingan) atau deskripsi nilai yang sangat rinci.`;
  } else if (jenisDokumen === "REFLEKSI") {
    systemInstruction += `\n\nKHUSUS UNTUK REFLEKSI PEMBELAJARAN: Buatlah instrumen refleksi interaktif berisi daftar pertanyaan terpandu (misalnya model 4P/Gibbs) untuk guru (evaluasi pengajaran) maupun siswa (metakognisi dan perasaan belajar).`;
  } else if (jenisDokumen === "LKPD") {
    systemInstruction += `\n\nKHUSUS UNTUK LEMBAR KERJA PESERTA DIDIK (LKPD): Buatlah LKPD praktikum yang menyenangkan dan kontekstual, memuat judul aktivitas, tujuan, alat & bahan, langkah-langkah praktikum (baik plugged dengan kode Python/aplikasi maupun unplugged), tantangan kasus nyata, dan penilaian mandiri siswa.`;
  }

  // Fallback luring jika API Key tidak ada
  if (!ai) {
    console.log("[Gemini] API is offline. Falling back to dynamic rule-based generation.");
    const mockOutput = generateMockDocument(jenisDokumen, elemen, kelas, prompt);
    return res.json({
      success: true,
      content: mockOutput,
      note: "Dibuat via generator luring karena API Key belum terkonfigurasi"
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Buatkan draf pembelajaran berdasarkan instruksi berikut:
      Instruksi Pengguna: ${prompt}
      Sasaran: Kelas ${kelas}, Elemen Informatika: ${elemen}
      Tipe Dokumen: ${jenisDokumen}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, content: response.text });
  } catch (error: any) {
    console.error("[Gemini] Generation Error:", error);
    const mockOutput = generateMockDocument(jenisDokumen, elemen, kelas, prompt);
    res.json({
      success: true,
      content: mockOutput,
      note: `Terjadi kendala jaringan (${error.message || error}), sistem secara otomatis beralih ke generator luring terintegrasi.`
    });
  }
};

// Generates high-quality offline fallbacks for devices
function generateMockDocument(jenis: string, elemen: string, kelas: string, userPrompt: string) {
  const tgl = new Date().toLocaleDateString("id-ID");
  const fase = kelas === "X" ? "Fase E" : "Fase F";

  if (jenis === "RPP_LENGKAP" || jenis === "RPP" || jenis.toLowerCase().includes("rpp") || jenis === "MODUL") {
    return `MODUL AJAR INFORMATIKA - DEEP LEARNING
Topik: ${userPrompt || "Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)"} (3 JP)

A. Informasi Umum
Satuan Pendidikan : SMA Negeri 2 Ciamis
Mata Pelajaran : Informatika
Fase / Kelas : ${fase} / ${kelas}
Elemen : ${elemen || "Algoritma dan Pemrograman"}
Alokasi Waktu : 3 JP x 45 menit (1 pertemuan)
Pendekatan : Pembelajaran Mendalam (Deep Learning): Berkesadaran, Bermakna, Menggembirakan.
Tahun Penyusunan : 2026

1. Capaian Pembelajaran
Pada akhir ${fase}, peserta didik mampu bergotong-royong dalam mengembangkan solusi komputasional secara modular dan terstruktur, mampu memahami eksekusi program serta memelihara dan menyempurnakannya, serta mampu menerapkan struktur data dan algoritma secara efisien untuk menyelesaikan masalah nyata.

2. Tujuan Pembelajaran
1. Peserta didik mampu merancang solusi modular terkait ${userPrompt || "topik pembelajaran"} untuk memecah persoalan kompleks menjadi bagian-bagian kecil yang terstruktur.
2. Peserta didik mampu mengimplementasikan dan menguji struktur data / skema algoritma sederhana menggunakan bahasa pemrograman tekstual secara logis dan kritis.
3. Peserta didik mampu menelusuri kesalahan (debugging), menyempurnakan kode program, serta mendokumentasikan proses berpikirnya secara mandiri maupun kolaboratif.

3. Kompetensi Awal
a. Peserta didik telah memahami dasar-dasar logika komputasional dan operasi sintaksis pemrograman dasar.
b. Peserta didik telah terbiasa menulis skrip program sederhana menggunakan bahasa pemrograman tekstual (misalnya Python).

4. Dimensi Profil Lulusan
Pertemuan ini menguatkan dimensi:
a. Penalaran Kritis - menganalisis struktur program dan menentukan logika yang tepat untuk suatu persoalan.
b. Kreativitas - merancang solusi yang efisien dan solutif.
c. Kolaborasi - bekerja sama menyelesaikan LKPD dalam kelompok.
d. Kemandirian - menyelesaikan latihan praktikum dan refleksi secara individu.

5. Tiga Prinsip Pembelajaran Mendalam pada Pertemuan Ini
| Prinsip | Makna | Penerapan pada Pertemuan Ini |
| --- | --- | --- |
| Berkesadaran (Mindful) | Peserta didik belajar dengan kesadaran penuh terhadap tujuan dan proses berpikirnya, serta dilibatkan dalam menentukan strategi belajarnya sendiri. | Peserta didik diajak menyadari tujuan belajar di awal pertemuan dan menuliskan refleksi metakognitif atas proses berpikirnya saat merancang solusi. |
| Bermakna (Meaningful) | Materi dikaitkan dengan konteks nyata, relevan, dan dapat diterapkan dalam kehidupan maupun bidang ilmu lain. | Konsep ${userPrompt || "pembelajaran"} dibangun dari studi kasus nyata yang dekat dengan pengalaman peserta didik. |
| Menggembirakan (Joyful) | Suasana belajar yang positif, menyenangkan, aman secara psikologis, dan membangkitkan rasa ingin tahu. | Kegiatan dikemas dengan tantangan memecahkan studi kasus secara berkelompok dan sesi demo karya yang apresiatif tanpa tekanan atas kesalahan. |

6. Kerangka Pembelajaran
| Komponen | Penerapan |
| --- | --- |
| Praktik Pedagogis | Discovery learning dipadukan praktik langsung; peserta didik membangun sendiri pemahaman konsep dari eksplorasi kasus, bukan menerima definisi jadi dari guru. |
| Kemitraan Pembelajaran | Guru berperan sebagai fasilitator yang memandu dengan pertanyaan pemantik; peserta didik bekerja sama dalam kelompok dan terlibat menentukan cara menguji kinerjanya. |
| Lingkungan Pembelajaran | Kelas dikondisikan aman secara psikologis: kesalahan dalam eksplorasi dipandang sebagai bagian dari proses belajar, bukan untuk dinilai negatif. |
| Pemanfaatan Digital | Praktik menggunakan perangkat komputer/IDE dan platform LMS terintegrasi untuk memperkuat pemahaman bermakna. |

7. Sarana dan Prasarana
a. Papan tulis, spidol, LCD proyektor/gawai untuk menampilkan modul & ilustrasi.
b. Lembar Kerja Peserta Didik (LKPD) dan lembar jurnal refleksi.
c. Perangkat komputer/laptop dengan IDE dan gawai siswa.

8. Target Peserta Didik
Peserta didik reguler kelas ${kelas} ${fase}, tanpa kesulitan belajar khusus.

B. Komponen Inti
1. Pemahaman Bermakna
Pemahaman terhadap konsep ${userPrompt || "materi"} membantu peserta didik berpikir secara terstruktur, sistematis, dan efisien dalam memecahkan berbagai persoalan di kehidupan nyata maupun dunia industri digital.

2. Pertanyaan Pemantik
a. Bagaimana teknologi modern mengorganisasi data dan logika dalam skala besar secara cepat dan akurat?
b. Menurutmu, apa yang terjadi jika sebuah program atau sistem dibangun tanpa perencanaan struktur yang rapi?
c. Langkah apa yang paling efektif untuk menemukan letak kesalahan ketika solusi yang kamu rancang belum berjalan sesuai harapan?

3. Pengalaman Belajar
| Tahap | Aktivitas Pembelajaran | Waktu |
| --- | --- | --- |
| Pendahuluan | 1. Guru membuka pembelajaran dengan salam, doa, dan memeriksa kehadiran peserta didik. [Menggembirakan]<br>2. Guru mengajak peserta didik menyadari tujuan belajar hari ini dan mengapa topik ini penting. [Berkesadaran]<br>3. Guru mengajukan pertanyaan pemantik. [Bermakna]<br>4. Guru melakukan asesmen awal (assessment as learning) secara lisan. | 15 menit |
| Memahami | 1. Peserta didik mengamati contoh kasus / program sederhana dan diminta mendiskusikan tantangan yang ditemukan. [Berkesadaran, Bermakna]<br>2. Peserta didik dibagi dalam kelompok kecil (4-5 orang) dan menerima LKPD.<br>3. Melalui pertanyaan pemandu guru, peserta didik membangun sendiri pemahaman tentang konsep utama. [Berkesadaran]<br>4. Peserta didik mendiskusikan perbedaan skema dan alur kerja konsep. [Bermakna] | 35 menit |
| Mengaplikasi | 1. Setiap kelompok menerapkan pemahaman untuk menyelesaikan studi kasus pada LKPD. [Bermakna]<br>2. Kelompok menguji hasil kerjanya, mendemonstrasikan hasil, dan menerima masukan positif. [Menggembirakan]<br>3. Dilakukan tantangan mini-quiz / bug hunt sebagai penguatan yang menyenangkan. [Menggembirakan]<br>4. Guru memberikan penguatan konsep dan meluruskan miskonsepsi. | 50 menit |
| Merefleksi | 1. Peserta didik menuliskan jurnal refleksi metakognitif singkat: apa yang dipahami, proses berpikir, dan bagian yang masih sulit. [Berkesadaran]<br>2. Peserta didik menilai diri sendiri menggunakan daftar periksa (self-assessment).<br>3. Guru memberikan umpan balik konstruktif secara langsung. | 20 menit |
| Penutup | 1. Peserta didik bersama guru menyimpulkan poin penting pembelajaran.<br>2. Guru memberikan apresiasi atas partisipasi peserta didik. [Menggembirakan]<br>3. Peserta didik dilibatkan menentukan agenda pertemuan berikutnya. [Berkesadaran]<br>4. Guru menutup pembelajaran dengan doa dan salam. | 15 menit |

4. Asesmen
| Jenis | Bentuk dan Waktu Pelaksanaan |
| --- | --- |
| Assessment as Learning (Awal & sepanjang proses) | Refleksi metakognitif peserta didik (jurnal singkat) dan daftar periksa penilaian diri pada tahap Merefleksi; peserta didik menilai dan menyadari sendiri proses belajarnya. |
| Assessment for Learning (Selama proses) | Observasi guru terhadap diskusi dan praktik kelompok pada tahap Memahami dan Mengaplikasi menggunakan rubrik penilaian. |
| Assessment of Learning (Akhir pertemuan) | Soal evaluasi individu (5 soal) yang dikerjakan pada tahap akhir untuk mengukur ketercapaian tujuan pembelajaran. |

Rubrik Penilaian Proses (Assessment for Learning)
| Aspek yang Dinilai | Baik Sekali (86-100) | Baik (71-85) | Perlu Bimbingan (<71) |
| --- | --- | --- | --- |
| Pemahaman Konsep | Menganalisis dan merancang fungsi/solusi yang tepat, terstruktur, dan menjelaskan alasannya secara logis. | Merancang fungsi/solusi dengan cukup tepat, penjelasan cukup logis. | Belum tepat dalam merancang fungsi/solusi. |
| Penerapan & Praktik | Mengimplementasikan konsep dengan tepat dan menjelaskan cara kerjanya secara mendalam. | Mengimplementasikan konsep dengan tepat namun penjelasan kurang mendalam. | Belum tepat dalam mengimplementasikan konsep. |
| Pengujian & Debugging | Menguji hasil secara sistematis, menemukan dan memperbaiki kesalahan dengan tepat. | Menguji hasil dengan cukup baik namun ada kesalahan yang belum diperbaiki. | Belum mampu menguji atau memperbaiki kesalahan. |
| Kesadaran Metakognitif | Mampu menjelaskan proses berpikirnya secara jujur, rinci, dan menyadari kekuatan/kelemahannya. | Mampu menuliskan refleksi dengan cukup jelas. | Refleksi belum menggambarkan proses berpikir secara jelas. |
| Kerja Sama & Partisipasi | Aktif berkontribusi, menghargai pendapat teman, dan turut menjaga suasana belajar yang positif. | Berkontribusi cukup aktif dalam kelompok. | Kurang aktif berkontribusi dalam kelompok. |

Soal Evaluasi Individu (Assessment of Learning)
| No | Soal |
| --- | --- |
| 1 | Jelaskan apa yang dimaksud dengan ${userPrompt || "topik materi"} dan sebutkan minimal dua keuntungannya! |
| 2 | Jelaskan perbedaan cara kerja komponen/metode utama beserta contoh penerapannya dalam kehidupan sehari-hari! |
| 3 | Berikan analisis keputusan struktur atau langkah terbaik untuk menangani studi kasus nyata pada LKPD! |
| 4 | Amatilah potongan instruksi/program berikut, telusuri alurnya dan tentukan hasil keluarannya! |
| 5 | Jelaskan dengan bahasamu sendiri bagaimana proses berpikirmu saat menemukan dan memecahkan kendala pada tugas kelompokmu! |

Pedoman Penskoran: nomor 1-4 bernilai 20 poin, nomor 5 dinilai berdasarkan kedalaman refleksi berpikir (skor maksimal 100).

5. Pengayaan dan Remedial
Pengayaan: Peserta didik yang telah mencapai KKTP diberikan soal HOTS dan studi kasus tingkat lanjut.
Remedial: Peserta didik yang belum mencapai KKTP diberikan bimbingan ulang dengan pendekatan konkret dan pendampingan suportif.

6. Refleksi Peserta Didik dan Guru
Refleksi Peserta Didik (Assessment as Learning)
a. Apa yang telah aku pahami tentang materi hari ini?
b. Bagaimana proses berpikirku saat menyelesaikan tantangan yang diberikan?
c. Bagian mana yang masih membingungkan dan perlu kupelajari kembali?

Refleksi Guru
a. Apakah ketiga prinsip (berkesadaran, bermakna, menggembirakan) sudah terasa dalam pembelajaran hari ini?
b. Apakah tujuan pembelajaran telah tercapai? Kendala apa yang ditemui dan bagaimana solusinya?

---

Lampiran 1: Lembar Kerja Peserta Didik (LKPD)
Lampiran 2: Glosarium
Lampiran 3: Daftar Pustaka
Lampiran 4: DAFTAR PERIKSA (SELF-ASSESSMENT) CAPAIAN BELAJAR PESERTA DIDIK`;
  }

  if (jenis === "ATP") {
    return `# ALUR TUJUAN PEMBELAJARAN (ATP) INFORMATIKA KELAS ${kelas}
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

## 1. IDENTITAS ALUR
- **Mata Pelajaran**: Informatika SMA
- **Fase / Sasaran**: ${fase} / Kelas ${kelas}
- **Elemen Pembelajaran**: [${elemen}]
- **Fokus Materi**: ${userPrompt}

## 2. RANCANGAN PETA ALUR BELAJAR (CHRONOLOGICAL PROGRESSION)

| Tahap | Tujuan Pembelajaran (TP) | Alokasi Waktu | Materi Pokok | Indikator Ketercapaian (IKTP) |
|---|---|---|---|---|
| **TP 1** | Mengidentifikasi konsep dasar dan teori esensial ${userPrompt}. | 2 JP | Pengenalan & Definisi | Siswa dapat menjelaskan konsep dasar materi secara runut. |
| **TP 2** | Menganalisis alur logika logika berpikir komputasi dari ${userPrompt}. | 4 JP | Struktur Logika | Siswa dapat memetakan flowchart/pseudocode dengan benar. |
| **TP 3** | Menguji dan merancang solusi praktis (coding/unplugged) terkait materi. | 4 JP | Praktik Implementasi | Siswa terampil menulis skrip/solusi mandiri bebas bug. |
| **TP 4** | Merefleksikan dan menyajikan hasil rancangan solusi kelompok. | 2 JP | Review & Presentasi | Siswa mampu mengomunikasikan karyanya secara kolaboratif. |

## 3. PROFIL PELAJAR PANCASILA (8 DIMENSI LULUSAN)
- **Penalaran Kritis**: Menganalisis kelebihan dan kekurangan solusi yang dibuat.
- **Kemandirian**: Mengatur proses belajar mandiri saat merancang tugas.
- **Kolaborasi**: Bekerja sama dalam menyelesaikan tugas kelompok secara harmonis.`;
  }

  if (jenis === "SOAL") {
    return `# BANK SOAL & ASESMEN FORMATIF INFORMATIKA
*Materi: ${userPrompt} (Elemen: ${elemen}) - Kelas ${kelas}*
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

---

### SOAL 1 (Tingkat Kesulitan: HOTS)
Manakah di antara pernyataan berikut yang paling tepat menggambarkan skenario penerapan optimal konsep **${userPrompt}** dalam penyelesaian masalah nyata di bidang industri teknologi informasi saat ini?

A. Menuliskan baris kode secara sekuensial tanpa memperhatikan efisiensi memori atau waktu eksekusi.
B. Menggunakan algoritma pengurutan terstruktur untuk mempercepat pencarian data pada tumpukan database transaksi raksasa secara dinamis.
C. Menghapus seluruh bug sistem dengan cara memformat ulang media penyimpanan fisik tanpa analisis logis terlebih dahulu.
D. Memanfaatkan teknologi cloud storage hanya sebagai media backup pasif dokumen-dokumen statis berformat PDF.
E. Menyerahkan seluruh perancangan infrastruktur jaringan komputer lokal kepada pihak ketiga tanpa melakukan studi kelayakan elemen.

**Kunci Jawaban: B**
**Pembahasan Analitis:**
Konsep ${userPrompt} pada elemen ${elemen} berfokus pada optimasi sistem dan efisiensi pemecahan masalah (HOTS). Penggunaan algoritma pengurutan/pemrosesan terstruktur untuk database transaksi berskala besar secara dinamis merupakan representasi sempurna dari penalaran kritis dan efisiensi komputasi.

---

### SOAL 2 (Tingkat Kesulitan: MOTS)
Saat menerapkan logika dasar **${userPrompt}**, kendala apa yang paling sering muncul apabila siswa lupa menyertakan penanganan kondisi batas (boundary condition) dalam kode program mereka?

A. Komputer akan mati secara otomatis akibat lonjakan daya listrik.
B. Terjadi perulangan tanpa henti (infinite loop) yang menyebabkan aplikasi hang atau crash.
C. Kecepatan transfer data internet pada jaringan LAN lokal akan menurun drastis.
D. Warna tema antarmuka (UI) sistem akan berubah menjadi kontras secara acak.
E. Lisensi sistem operasi komputer akan langsung hangus seketika.

**Kunci Jawaban: B**
**Pembahasan Analitis:**
Kondisi batas sangat krusial dalam algoritma pemrograman modular (${elemen}). Tanpa kondisi batas yang jelas pada materi ${userPrompt}, alur eksekusi akan terjebak dalam kondisi perulangan tak terbatas (infinite loop) yang menghabiskan memori CPU.

---

### SOAL 3 (Tingkat Kesulitan: LOTS)
Apakah fungsi utama dari dilakukannya tahapan dekomposisi pada awal pemecahan masalah algoritma?

A. Menggabungkan beberapa aplikasi berbeda menjadi satu berkas instalasi tunggal.
B. Memecah masalah besar yang kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola.
C. Mengenkripsi kata sandi pengguna agar aman dari serangan siber luar.
D. Mengunduh pustaka (library) Python tambahan dari repositori publik internet.
E. Mengubah sistem operasi komputer ke mode pengembang (developer mode).

**Kunci Jawaban: B**
**Pembahasan Analitis:**
Dekomposisi adalah bagian dari Berpikir Komputasional (BK) yang memandu pemecahan masalah kompleks dengan cara membagi masalah utama tersebut menjadi sub-masalah kecil yang lebih sederhana dan mandiri.`;
  }

  if (jenis === "RUBRIK") {
    return `# RUBRIK PENILAIAN ASESMEN KINERJA INFORMATIKA KELAS ${kelas}
*Materi: ${userPrompt} (Fase ${fase})*
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

---

## 1. TABEL RUBRIK EVALUASI KINERJA (SKALA 1 - 4)

| Kriteria Penilaian | Sangat Baik (Skor 4) | Baik (Skor 3) | Cukup (Skor 2) | Perlu Bimbingan (Skor 1) | Bobot % |
|---|---|---|---|---|---|
| **Pemahaman Konsep & Logika** | Menunjukkan pemahaman yang sangat mendalam tentang prinsip **${userPrompt}**; seluruh logika program terstruktur dengan sangat tepat dan efisien. | Konsep dasar dipahami dengan baik; alur logika runtut namun terdapat sedikit inefisiensi minor. | Pemahaman konsep cukup memadai; alur logika dasar ada namun masih melompat-lompat atau kurang rapi. | Belum memahami konsep dasar secara benar; alur logika acak-acakan dan tidak terarah. | 40% |
| **Penerapan Teknis & Sintaksis** | Solusi praktis (coding/skema) berjalan dengan sangat sempurna tanpa error; penulisan sintaksis sangat rapi dan mengikuti standar industri. | Solusi berjalan fungsional; terdapat 1-2 kesalahan kecil (sintaksis/konfigurasi) namun dapat diperbaiki secara mandiri oleh siswa. | Solusi sebagian berjalan; siswa membutuhkan banyak bantuan/intervensi guru agar hasil bisa berfungsi dasar. | Kode atau skema tidak dapat berjalan sama sekali; tidak ada upaya penerapan sintaksis yang benar. | 40% |
| **Kolaborasi & Komunikasi** | Sangat proaktif berdiskusi kelompok; mempresentasikan hasil dengan bahasa yang sangat lugas, logis, dan mudah dipahami audiens. | Berkontribusi aktif dalam tim; menyajikan hasil presentasi secara terstruktur namun kurang interaktif bagi audiens. | Kurang aktif berdiskusi; presentasi disajikan terburu-buru, gugup, atau sulit dipahami alurnya. | Pasif selama diskusi kelompok; tidak berkontribusi sama sekali atau menolak melakukan presentasi hasil. | 20% |

---

## 2. PANDUAN PENGHITUNGAN SKOR AKHIR GURU
$$\text{Nilai Akhir} = \left( \frac{\text{Total Skor Diperoleh}}{12} \right) \times 100$$
- **Sangat Baik (A)**: Nilai $\geq 88$
- **Baik (B)**: Nilai $75 - 87$
- **Cukup (C)**: Nilai $60 - 74$
- **Perlu Bimbingan (D)**: Nilai $< 60$
*Batas Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) minimal adalah 75.*`;
  }

  if (jenis === "REFLEKSI") {
    return `# INSTRUMEN REFLEKSI PEMBELAJARAN INFORMATIKA
*Evaluasi Pembelajaran Materi: ${userPrompt} - Kelas ${kelas}*
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

---

## 1. REFLEKSI MANDIRI GURU (EVALUASI KBM)
*Gunakan Model 4P/4F (Peristiwa, Perasaan, Pembelajaran, Penerapan) untuk menilai efektivitas pedagogis:*

1. **Peristiwa (Fact)**:
   - Apakah seluruh skenario pembelajaran tentang **${userPrompt}** berjalan sesuai alokasi waktu yang telah dirancang?
   - Hambatan teknis apa saja yang paling menonjol dialami siswa saat melakukan praktik atau diskusi?
2. **Perasaan (Feeling)**:
   - Bagaimana respons emosional siswa selama sesi KBM berlangsung? Apakah mereka antusias atau merasa tertekan dengan kesulitan materi?
   - Apakah saya merasa puas dengan taktik fasilitasi dan bimbingan yang saya berikan hari ini?
3. **Pembelajaran (Finding)**:
   - Momen belajar (aha-moment) apa yang paling berharga yang ditunjukkan oleh siswa hari ini?
   - Kesalahan persepsi (miskonsepsi) apa yang paling sering saya temukan pada pemahaman siswa mengenai materi ini?
4. **Penerapan (Future)**:
   - Strategi mengajar atau alat digital baru apa yang akan saya gunakan pada pertemuan berikutnya untuk memperbaiki proses belajar siswa?

---

## 2. LEMBAR REFLEKSI MANDIRI SISWA (METAKOGNISI)
*Silakan isi lembar evaluasi diri ini secara jujur untuk membantu perkembangan belajarmu:*

- **Apa yang sudah saya pahami?**
  - [ ] Saya sudah paham definisi dan konsep dasar dari **${userPrompt}**.
  - [ ] Saya sudah paham alur logika dan cara merancang skema penyelesaiannya.
  - [ ] Saya sudah bisa mengimplementasikannya dalam bentuk tugas mandiri secara tuntas.
- **Tantangan Pribadi**:
  *Tuliskan bagian mana dari materi hari ini yang menurutmu paling sulit dipahami dan apa rencanamu untuk memecahkannya:*
  > ...
- **Emoticon Mood Belajar Hari Ini**:
  - [ ] 🌟 Luar biasa paham & sangat gembira
  - [ ] 😊 Cukup paham & senang belajar
  - [ ] 😐 Kurang paham tapi ingin tahu lebih lanjut
  - [ ] 😞 Bingung & memerlukan bimbingan guru secara khusus`;
  }

  if (jenis === "LKPD") {
    return `# LEMBAR KERJA PESERTA DIDIK (LKPD) KELAS ${kelas}
*Topik Praktikum: Eksplorasi Logika ${userPrompt} (Elemen: ${elemen})*
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

---

## 1. TUJUAN AKTIVITAS PRAKTIKUM
1. Peserta didik secara kolaboratif mampu merancang diagram alir atau pseudocode penyelesaian masalah **${userPrompt}** secara sistematis.
2. Peserta didik terampil melakukan debugging, perancangan skema sistem, atau penulisan kode fungsional terkait materi secara saksama.

## 2. ALAT, BAHAN, & BAHAN BACAAN
- Chromebook / Laptop Sekolah dengan akses portal belajar LMTMS.
- Browser modern dan Editor Kode terintegrasi (misal: VS Code / Replit / Compiler Online).
- Buku Referensi Informatika SMK Kelas ${kelas} Bab [${elemen}].

## 3. SKENARIO TANTANGAN KELOMPOK (Dunia Nyata)
**Deskripsi Kasus:**
Bayangkan kelompokmu adalah tim rekayasa perangkat lunak di sebuah perusahaan rintisan logistik. Kalian diminta untuk mengoptimalkan performa pemrosesan antrean paket pengiriman barang yang menumpuk secara acak agar alurnya menjadi lebih efisien menggunakan konsep **${userPrompt}**.

---

## 4. LANGKAH-LANGKAH PENGERJAAN AKTIVITAS
1. **Dekomposisi Masalah**: Diskusikan dalam kelompokmu (3-4 orang) mengenai variabel utama yang perlu dicatat dari kasus di atas. Tuliskan rincian variabel tersebut!
2. **Abstraksi & Algoritma**: Rancang alur logika program dalam bentuk pseudocode sederhana di lembar coretan.
3. **Coding & Pengujian (Plugged)**: Tuliskan skrip kode fungsional Python/JavaScript di laptop kalian, lakukan kompilasi, dan catat apabila terjadi error/bug!
4. **Refleksi Bersama**: Isi tabel kesimpulan hasil pengujian solusi kelompok kalian di bawah ini.

---

## 5. TABEL EVALUASI MANDIRI KELOMPOK
| No | Parameter Hasil Pengujian | Output yang Diharapkan | Output Riil yang Terjadi | Status (Sukses/Error) |
|---|---|---|---|---|
| 1 | Input data uji normal | Solusi memproses data secara berurutan | ... | ... |
| 2 | Input data batas ekstrem | Penanganan error batas berhasil aktif | ... | ... |

*Tugas tambahan: Unggah berkas kode/diagram penyelesaian kelompokmu ke modul Tugas LMS sebelum batas waktu pengumpulan berakhir! Selamat berkolaborasi!*`;
  }

  return `# DRAFT GENERATOR: ${jenis.toUpperCase()} INFORMATIKA
*Diproduksi oleh AI LMTMS pada ${tgl}*

## 1. IDENTITAS DOKUMEN
- **Mata Pelajaran**: Informatika SMA
- **Sasaran**: Kelas ${kelas} / ${fase}
- **Elemen Pembelajaran**: [${elemen}]
- **Fokus Draf**: ${userPrompt}

## 2. PENJELASAN UTAMA & INTISARI MATERI
Konsep **${userPrompt}** pada bidang studi Informatika ${elemen} mengajarkan tentang struktur kerja logis yang melatih penalaran kritis siswa. Dengan menguasai konsep ini, siswa dibekali kompetensi problem solving yang bernilai tinggi guna mempersiapkan karir di industri kreatif digital abad ke-21.

## 3. INDIKATOR CAPAIAN BELAJAR
1. Peserta didik mampu merincikan masalah secara logis-kronologis dari materi ${userPrompt}.
2. Peserta didik terampil merancang skema solusi (pseudocode/coding) yang responsif.
3. Peserta didik mandiri dan kritis dalam mengevaluasi kesalahan (debugging) alur logika.`;
}
