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

  if (jenisDokumen === "RPP_LENGKAP" || jenisDokumen === "RPP") {
    systemInstruction += `\n\nKHUSUS UNTUK RPP LENGKAP: Dokumen yang Anda buat HARUS memuat komponen utama berikut secara sangat detail dan terstruktur dengan mengintegrasikan rumus 8-3-3-4 di atas:
    1. **Identitas Sekolah & Elemen**: Mencakup alokasi waktu dan fokus materi.
    2. **Tujuan Pembelajaran (TP) Holistik**: Menjabarkan TP kognitif, psikomotorik, dan afektif yang selaras dengan 8 Dimensi Profil Lulusan (terutama Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Komunikasi Efektif).
    3. **Tiga (3) Prinsip Pembelajaran Terintegrasi**: Deskripsikan bagaimana sesi ini dirancang agar Mindful (Berkesadaran), Meaningful (Bermakna), dan Joyful (Menggembirakan).
    4. **Langkah-langkah Kegiatan Pembelajaran Berbasis Tiga (3) Pengalaman Belajar**:
       - Sesi Pendahuluan (Orientasi & Apersepsi untuk membangun Pemahaman).
       - Sesi Inti (Aplikasi PBL/PjBL menggunakan Praktik Pedagogis interaktif dan Teknologi Digital sebagai alat investigasi - Penerapan).
       - Sesi Penutup (Penilaian mandiri, kesimpulan, dan umpan balik - Refleksi).
     5. **Empat (4) Kerangka Pembelajaran & Dukungan Ekosistem**: Penjelasan singkat mengenai Praktik Pedagogis yang dipakai, Kemitraan Belajar yang dilibatkan, Lingkungan Belajar yang dimanfaatkan, serta Teknologi Digital yang digunakan.
    6. **Asesmen Formatif (Penilaian Proses)**: Rubrik penilaian sikap (8 Dimensi Profil Lulusan) dan rubrik kinerja kelompok/praktikum secara lengkap (berupa tabel kriteria skor 1-4).`;
  } else if (jenisDokumen === "MODUL") {
    systemInstruction += `\n\nKHUSUS UNTUK MODUL AJAR: Buatlah Modul Ajar Kurikulum Merdeka yang lengkap dengan komponen: Identitas, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup) mengintegrasikan model pembelajaran yang relevan, serta instrumen refleksi dan asesmen.`;
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
    return `# MODUL AJAR INFORMATIKA: ${elemen} - KELAS ${kelas}
*Rekomendasi Kurikulum Berbasis Kerangka Pembelajaran Mendalam (Deep Learning) - Rumus 8-3-3-4*
*Dibuat otomatis menggunakan Asisten AI LMTMS pada ${tgl}*

## 1. IDENTITAS SEKOLAH & ELEMEN
- **Mata Pelajaran**: Informatika SMA
- **Kelas / Semester**: Kelas ${kelas} / ${kelas === "X" ? "Fase E (Ganjil/Genap)" : "Fase F (Ganjil/Genap)"}
- **Elemen Capaian**: ${elemen}
- **Materi Fokus**: ${userPrompt}
- **Alokasi Waktu**: 2 JP (2 x 45 Menit)

---

## 2. TUJUAN PEMBELAJARAN (TP) HOLISTIK
Melalui pendekatan Pembelajaran Mendalam and model pembelajaran aktif, peserta didik diharapkan mampu:
1. **[Pemahaman]** Mengonstruksi pemahaman konsep dasar mengenai ${userPrompt} pada elemen ${elemen} secara mendalam dan terstruktur.
2. **[Penerapan]** Merancang, menerapkan, and menguji skema algoritma atau solusi teknis pemecahan masalah terkait ${userPrompt} dengan memanfaatkan teknologi digital secara adaptif.
3. **[Refleksi]** Mengevaluasi alur logika berpikir mandiri and menginternalisasi nilai-nilai kolaborasi, penalaran kritis, dan ketangguhan mental dalam memecahkan masalah.

---

## 3. LANGKAH-LANGKAH KEGIATAN PEMBELAJARAN
### A. Sesi Pendahuluan (15 Menit) — Fase Pemahaman (Memahami)
1. **Orientasi Berkesadaran (Mindful)**: Guru membuka kelas dengan salam hangat, berdoa bersama, and mengajak siswa melakukan latihan pernapasan sejenak (mindfulness).
2. **Apersepsi Bermakna (Meaningful)**: Guru mengajukan pertanyaan pemantik kontekstual mengenai penerapan materi ${userPrompt} di dunia nyata.

### B. Sesi Inti (60 Menit) — Fase Penerapan (Menerapkan)
*Menggunakan model Problem-Based Learning (PBL) berbasis Praktik Pedagogis Interaktif:*
1. **Fase 1**: Siswa mengamati sebuah studi kasus riil yang salah/rusak di portal belajar digital.
2. **Fase 2**: Siswa berkelompok secara heterogen (3-4 anggota) untuk mendiskusikan rancangan solusi.
3. **Fase 3**: Kelompok melakukan investigasi terbimbing dibantu gawai masing-masing untuk mengeksplorasi modul LMTMS tepercaya.
4. **Fase 4**: Perwakilan kelompok mempresentasikan hasil karyanya secara interaktif menggunakan papan tulis digital.

### C. Sesi Penutup (15 Menit) — Fase Refleksi (Mengevaluasi)
1. **Refleksi Berkesadaran**: Siswa mengisi jurnal refleksi diri singkat mengenai apa yang telah dipelajari.
2. **Asesmen Formatif**: Guru memberikan kuis instan formatif interaktif (2-3 soal penalaran konseptual).

---

## 4. INTEGRASI KERANGKA PEMBELAJARAN MENDALAM (DEEP LEARNING)
1. **Praktik Pedagogis**: Penerapan PBL mendorong eksplorasi aktif dan tanya jawab kritis.
2. **Kemitraan Belajar**: Hubungan belajar harmonis antar guru (sebagai fasilitator) dan sesama rekan siswa (kolaborasi).
3. **Lingkungan Belajar**: Pengaturan ruang diskusi kelas fleksibel dipadukan dengan LMS virtual aman.
4. **Pemanfaatan Teknologi**: Penggunaan Chromebook/gawai untuk eksplorasi, visualisasi, dan asesmen reflektif langsung.`;
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
