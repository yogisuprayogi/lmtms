import React, { useState, useEffect } from "react";
import {
  Award,
  Milestone,
  FileText,
  Brain,
  CheckSquare,
  CalendarDays,
  Table,
  BookOpen,
  Book,
  FolderOpen,
  History,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Download,
  UploadCloud,
  ChevronRight,
  GitCommit,
  Check,
  RefreshCw,
  AlertCircle,
  Clock,
  User,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  ArrowLeftRight
} from "lucide-react";
import { ELEMEN_INFORMATIKA } from "../types";

// ==========================================
// PRE-SEEDED MOCK DATA FOR INDONESIAN LMS
// ==========================================

const MOCK_CP = [
  {
    fase: "E",
    kelas: "X",
    elemen: "BK",
    namaElemen: "Berpikir Komputasional",
    deskripsi: "Siswa mampu menerapkan berpikir komputasional untuk memecahkan masalah sehari-hari yang melibatkan data besar, struktur data bertipe daftar/list, tumpukan/stack, dan antrean/queue, serta merancang algoritma pencarian dan pengurutan secara logis."
  },
  {
    fase: "E",
    kelas: "X",
    elemen: "AP",
    namaElemen: "Algoritma dan Pemrograman",
    deskripsi: "Siswa mampu membaca, menerjemahkan, dan menulis kode program prosedural dalam bahasa Python, menggunakan tipe data variabel, operasi logika, percabangan kondisional, perulangan, dan fungsi sederhana untuk menyelesaikan persoalan."
  },
  {
    fase: "F",
    kelas: "XI/XII",
    elemen: "AD",
    namaElemen: "Analisis Data",
    deskripsi: "Siswa mampu memproses data kuantitatif dalam jumlah besar secara efisien, melakukan pemodelan data, visualisasi interaktif, dan menerapkan teknik penambangan data sederhana untuk memprediksi tren masa depan."
  },
  {
    fase: "F",
    kelas: "XI/XII",
    elemen: "JKI",
    namaElemen: "Jaringan Komputer dan Internet",
    deskripsi: "Siswa mampu mengonfigurasi arsitektur jaringan LAN/WAN, mengamankan transmisi data nirkabel, memahami enkripsi SSL/TLS, serta mendeteksi ancaman intrusi pada infrastruktur internet modern."
  }
];

const MOCK_ATP = [
  {
    id: "atp-1",
    kode: "ATP-10.1",
    elemen: "BK",
    kelas: "X",
    tujuan: "Menganalisis berbagai masalah kehidupan sehari-hari dan merumuskan dekomposisi serta pengenalan pola dalam struktur antrean (queue) dan tumpukan (stack).",
    alokasi: "8 JP"
  },
  {
    id: "atp-2",
    kode: "ATP-10.2",
    elemen: "AP",
    kelas: "X",
    tujuan: "Merancang algoritma pemrograman modular menggunakan fungsi berparameter untuk memproses data input pengguna dalam bahasa Python.",
    alokasi: "12 JP"
  },
  {
    id: "atp-3",
    kode: "ATP-11.1",
    elemen: "AD",
    kelas: "XI",
    tujuan: "Melakukan pengolahan data tabular menggunakan library Pandas Python untuk menyaring nilai kosong dan memvisualisasikan tren grafik.",
    alokasi: "10 JP"
  }
];

const MOCK_MODUL = [
  {
    id: "mod-1",
    judul: "Modul Ajar: Abstraksi dan Logika Algoritma",
    elemen: "BK",
    kelas: "X",
    pertemuan: "Pertemuan 1-2",
    metode: "Project Based Learning (PBL)",
    alokasi: "4 JP",
    isi: "Modul ini membahas tentang cara memilah informasi penting (abstraksi) dari permasalahan kemacetan jalan raya dan menyusun representasi graf untuk merancang rute terpendek secara mandiri."
  },
  {
    id: "mod-2",
    judul: "Modul Ajar: Percabangan dan Perulangan Python",
    elemen: "AP",
    kelas: "X",
    pertemuan: "Pertemuan 3-6",
    metode: "Contextual Teaching",
    alokasi: "8 JP",
    isi: "Siswa diajak membuat program simulasi kasir otomatis dan lampu lalu lintas menggunakan logika percabangan 'if-elif-else' dan pengulangan 'while' di editor Python."
  }
];

const MOCK_BUKU = [
  {
    id: "buk-1",
    judul: "Informatika SMA Kelas X - Buku Siswa",
    penulis: "Kementerian Pendidikan dan Kebudayaan R.I.",
    tahun: "2021",
    bab: ["Bab 1: Pengantar Informatika", "Bab 2: Berpikir Komputasional", "Bab 3: Teknologi Informasi", "Bab 4: Sistem Komputer"],
    url: "#"
  },
  {
    id: "buk-2",
    judul: "Panduan Guru Informatika SMA Kelas X",
    penulis: "Pusat Kurikulum dan Perbukuan Kemendikbud",
    tahun: "2021",
    bab: ["Bab 1: Strategi Pedagogi", "Bab 2: Asesmen Kurikulum Merdeka", "Bab 3: Rubrikasi Capaian"],
    url: "#"
  },
  {
    id: "buk-3",
    judul: "Algoritma dan Struktur Data dengan Python",
    penulis: "Dr. Suprayogi, M.T.",
    tahun: "2024",
    bab: ["Bab 1: Sintaksis Python", "Bab 2: Stack & Queue", "Bab 3: Rekursi & Dynamic Programming"],
    url: "#"
  }
];

const MOCK_KKTP = [
  {
    id: "kktp-1",
    tujuanBelajar: "Siswa mampu mengimplementasikan struktur data Antrean (Queue) dalam Python.",
    intervalNilai: [
      { rentang: "0 - 40%", predikat: "Belum Mencapai", tindakan: "Remedial di seluruh bagian" },
      { rentang: "41 - 70%", predikat: "Belum Mencapai", tindakan: "Remedial di bagian yang kurang" },
      { rentang: "71 - 85%", predikat: "Sudah Mencapai", tindakan: "Tanpa remedial, lanjut pengayaan" },
      { rentang: "86 - 100%", predikat: "Sangat Baik", tindakan: "Diberikan pengayaan/menjadi tutor sebaya" }
    ]
  }
];

const MOCK_VERSIONING = [
  {
    id: "ver-1",
    docId: "doc-1",
    docTitle: "Modul Ajar Berpikir Komputasional",
    versi: "v2.1",
    tanggal: "2026-07-14 15:30",
    pembuat: "Yogi Suprayogi, S.Kom.",
    keterangan: "Pembaruan rubrik penilaian formatif berbasis Deep Learning 4-Pillar",
    kontenSebelum: "Modul Ajar awal dengan fokus kognitif standar dan latihan teoretis mandiri saja.",
    kontenSesudah: "Modul Ajar terintegrasi dengan 4-Pillar Deep Learning: Praktik Pedagogis interaktif, Kemitraan Belajar (tutor sebaya), Lingkungan Fleksibel (virtual canvas), dan Pemanfaatan Teknologi Digital (Python Online Compiler)."
  },
  {
    id: "ver-2",
    docId: "doc-1",
    docTitle: "Modul Ajar Berpikir Komputasional",
    versi: "v2.0",
    tanggal: "2026-07-12 09:12",
    pembuat: "Yogi Suprayogi, S.Kom.",
    keterangan: "Inisiasi draf modul ajar Kurikulum Merdeka Fase E",
    kontenSebelum: "Belum ada draf modul.",
    kontenSesudah: "Draf dasar Modul Ajar Berpikir Komputasional SMA Kelas X untuk materi Stack dan Queue."
  }
];

const MOCK_PROTA = [
  { id: "pro-1", semester: "1 (GANJIL)", materi: "Berpikir Komputasional (Dekomposisi, Abstraksi, Pola)", jp: "18 JP", minggu: "Minggu 1 - 6" },
  { id: "pro-2", semester: "1 (GANJIL)", materi: "Teknologi Informasi dan Komunikasi (Integrasi Konten Aplikasi Office)", jp: "12 JP", minggu: "Minggu 7 - 10" },
  { id: "pro-3", semester: "1 (GANJIL)", materi: "Sistem Komputer (Hardware, Software, OS)", jp: "18 JP", minggu: "Minggu 11 - 17" },
  { id: "pro-4", semester: "2 (GENAP)", materi: "Jaringan Komputer dan Internet (Konfigurasi Jaringan & IP Address)", jp: "12 JP", minggu: "Minggu 1 - 4" },
  { id: "pro-5", semester: "2 (GENAP)", materi: "Algoritma dan Pemrograman Python Prosedural", jp: "24 JP", minggu: "Minggu 5 - 13" },
  { id: "pro-6", semester: "2 (GENAP)", materi: "Dampak Sosial Informatika & Praktik Lintas Bidang", jp: "12 JP", minggu: "Minggu 14 - 18" }
];

interface LmsViewProps {
  user: any;
}

export const LmsView: React.FC<LmsViewProps> = ({ user }) => {
  // Navigation tabs (11 elements)
  const tabs = [
    { id: "cp", label: "CP (Capaian)", icon: Award, color: "text-rose-500 bg-rose-50" },
    { id: "atp", label: "ATP (Alur)", icon: Milestone, color: "text-amber-500 bg-amber-50" },
    { id: "modul", label: "Modul Ajar", icon: FileText, color: "text-blue-500 bg-blue-50" },
    { id: "deep_learning", label: "Deep Learning (AI)", icon: Brain, color: "text-indigo-500 bg-indigo-50" },
    { id: "kktp", label: "KKTP Rubrik", icon: CheckSquare, color: "text-emerald-500 bg-emerald-50" },
    { id: "prota", label: "Prota", icon: CalendarDays, color: "text-cyan-500 bg-cyan-50" },
    { id: "promes", label: "Promes", icon: Table, color: "text-teal-500 bg-teal-50" },
    { id: "materi", label: "Materi Belajar", icon: BookOpen, color: "text-orange-500 bg-orange-50" },
    { id: "buku", label: "Buku Digital", icon: Book, color: "text-violet-500 bg-violet-50" },
    { id: "repository", label: "Repository", icon: FolderOpen, color: "text-fuchsia-500 bg-fuchsia-50" },
    { id: "versioning", label: "Versioning", icon: History, color: "text-slate-500 bg-slate-50" }
  ];

  const [activeTab, setActiveTab] = useState<string>("deep_learning");

  // State Management for individual sub-views
  const [atpList, setAtpList] = useState(MOCK_ATP);
  const [modulList, setModulList] = useState(MOCK_MODUL);
  const [kktpList, setKktpList] = useState(MOCK_KKTP);
  const [protaList, setProtaList] = useState(MOCK_PROTA);
  const [versions, setVersions] = useState(MOCK_VERSIONING);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);

  // Form states
  const [atpForm, setAtpForm] = useState({ kode: "", elemen: "BK", kelas: "X", tujuan: "", alokasi: "4 JP" });
  const [modForm, setModForm] = useState({ judul: "", elemen: "BK", kelas: "X", pertemuan: "", metode: "", alokasi: "4 JP", isi: "" });
  const [kktpForm, setKktpForm] = useState({ tujuanBelajar: "", k1: "75%", k2: "85%", k3: "95%" });

  // Deep Learning AI Sandbox States
  const [deepPrompt, setDeepPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [deepActivePillar, setDeepActivePillar] = useState<number>(0);

  // Repository states
  const [repoFiles, setRepoFiles] = useState<any[]>([
    { id: "rep-1", nama: "Silabus_Informatika_Fase_E.pdf", ukuran: "1.2 MB", tipe: "PDF", pengunggah: "Yogi Suprayogi", tanggal: "2026-07-10" },
    { id: "rep-2", nama: "Modul_Algoritma_Python.docx", ukuran: "4.5 MB", tipe: "DOCX", pengunggah: "Yogi Suprayogi", tanggal: "2026-07-12" },
    { id: "rep-3", nama: "Rubrik_Penilaian_BK_HOTS.xlsx", ukuran: "850 KB", tipe: "XLSX", pengunggah: "Yogi Suprayogi", tanggal: "2026-07-14" }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);

  // Prompt helper suggestions for Deep Learning
  const deepSuggestions = [
    "Rancang aktivitas bermakna pembelajaran modular python berbasis proyek lingkungan",
    "Buat kerangka kemitraan belajar (tutor sebaya) untuk elemen Jaringan Komputer",
    "Susun draf rubrik asesmen berpikir komputasional dengan kriteria HOTS dan refleksi"
  ];

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      
      const newFile = {
        id: `rep-${Date.now()}`,
        nama: file.name,
        ukuran: sizeStr,
        tipe: file.name.split(".").pop()?.toUpperCase() || "BIN",
        pengunggah: user.nama,
        tanggal: new Date().toISOString().split("T")[0]
      };
      setRepoFiles([newFile, ...repoFiles]);
      setUploadedFile(newFile);
      setTimeout(() => setUploadedFile(null), 3000);
    }
  };

  // Create new ATP objective
  const handleAddAtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!atpForm.tujuan || !atpForm.kode) return;
    const newItem = {
      id: `atp-${Date.now()}`,
      kode: atpForm.kode,
      elemen: atpForm.elemen,
      kelas: atpForm.kelas,
      tujuan: atpForm.tujuan,
      alokasi: atpForm.alokasi
    };
    setAtpList([...atpList, newItem]);
    // Save version history log
    logVersion("atp-list", "ATP (Alur Tujuan Pembelajaran)", `Menambah item baru ${atpForm.kode}`);
    setAtpForm({ kode: "", elemen: "BK", kelas: "X", tujuan: "", alokasi: "4 JP" });
  };

  // Create new Modul Ajar
  const handleAddModul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modForm.judul || !modForm.isi) return;
    const newItem = {
      id: `mod-${Date.now()}`,
      judul: modForm.judul,
      elemen: modForm.elemen,
      kelas: modForm.kelas,
      pertemuan: modForm.pertemuan || "Umum",
      metode: modForm.metode || "Pembelajaran Aktif",
      alokasi: modForm.alokasi,
      isi: modForm.isi
    };
    setModulList([...modulList, newItem]);
    logVersion(`mod-${Date.now()}`, modForm.judul, "Inisiasi draf modul ajar baru");
    setModForm({ judul: "", elemen: "BK", kelas: "X", pertemuan: "", metode: "", alokasi: "4 JP", isi: "" });
  };

  // Create new KKTP Rubrik
  const handleAddKktp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kktpForm.tujuanBelajar) return;
    const newItem = {
      id: `kktp-${Date.now()}`,
      tujuanBelajar: kktpForm.tujuanBelajar,
      intervalNilai: [
        { rentang: "0 - 40%", predikat: "Belum Mencapai", tindakan: "Remedial komprehensif" },
        { rentang: `41 - ${kktpForm.k1}`, predikat: "Belum Mencapai", tindakan: "Remedial parsial" },
        { rentang: `${parseInt(kktpForm.k1) + 1}% - ${kktpForm.k2}`, predikat: "Sudah Mencapai", tindakan: "Latihan pemantapan" },
        { rentang: `${parseInt(kktpForm.k2) + 1}% - 100%`, predikat: "Sangat Baik", tindakan: "Menjadi tutor sebaya / Pengayaan" }
      ]
    };
    setKktpList([...kktpList, newItem]);
    logVersion(`kktp-${Date.now()}`, "KKTP Rubrik", "Penyusunan kriteria ketercapaian baru");
    setKktpForm({ tujuanBelajar: "", k1: "70%", k2: "85%", k3: "95%" });
  };

  // Save revision version logs helper
  const logVersion = (docId: string, title: string, comment: string) => {
    const newVersion = {
      id: `ver-${Date.now()}`,
      docId,
      docTitle: title,
      versi: `v1.${versions.filter(v => v.docId === docId).length + 1}`,
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 16),
      pembuat: user.nama,
      keterangan: comment,
      kontenSebelum: "Draf atau versi sebelumnya dalam sistem.",
      kontenSesudah: `Versi termutakhir diunggah secara otomatis ke database LMTMS pada tab LMS.`
    };
    setVersions([newVersion, ...versions]);
  };

  // Deep Learning AI Engine query handler
  const handleDeepLearningQuery = async (p?: string) => {
    const promptToUse = p || deepPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingAi(true);
    setAiResponse("");

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Rancang pembelajaran berbasis Kerangka Pembelajaran Mendalam (Deep Learning) Kurikulum Merdeka SMA dengan prinsip 8-3-3-4. Topik: ${promptToUse}`,
          jenisDokumen: "RPP_LENGKAP",
          elemen: "BK",
          kelas: "X"
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResponse(data.content);
        // Log to history versioning automatically!
        logVersion("deep-learning-draft", `Desain Pembelajaran: ${promptToUse.substring(0, 30)}...`, "Draf AI Deep Learning dibuat");
      } else {
        setAiResponse("Koneksi gagal atau API Key tidak dikonfigurasi. Menampilkan template draf lokal:\n\n" + getFallbackDeepLearning(promptToUse));
      }
    } catch (err) {
      setAiResponse("Beralih ke draf respons cerdas lokal:\n\n" + getFallbackDeepLearning(promptToUse));
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getFallbackDeepLearning = (topic: string) => {
    return `# DESAIN PEMBELAJARAN MENDALAM (DEEP LEARNING)
## Topik: ${topic}
## Kerangka 8-3-3-4 Kurikulum Merdeka

### 1. PILLAR UTAMA (4 Kerangka)
* **Praktik Pedagogis**: Menggunakan kolaborasi interaktif & Inquiry-Based Learning. Siswa didorong memilah data secara logis.
* **Kemitraan Belajar**: Siswa berkolaborasi dalam tim (3 orang) untuk memecahkan masalah nyata, dengan bimbingan fasilitatif dari guru.
* **Lingkungan Belajar**: Memanfaatkan virtual whiteboard dan laboratorium komputer yang fleksibel.
* **Teknologi Digital**: Menggunakan simulator Python online, Visualizer Algoritma, dan repositori LMTMS.

### 2. PRINSIP PEMBELAJARAN (3 Prinsip)
* **Mindful (Berkesadaran)**: Siswa merefleksikan mengapa pembelajaran ini penting bagi masa depan mereka.
* **Meaningful (Bermakna)**: Studi kasus diambil dari kehidupan sehari-hari siswa (contoh: antrean kantin sekolah).
* **Joyful (Menggembirakan)**: Pembelajaran diselingi gamifikasi interaktif berhadiah bintang keaktifan.

### 3. SIKLUS PENGALAMAN (3 Siklus)
* **Pemahaman**: Konstruksi konsep dasar melalui analisis video ilustrasi.
* **Penerapan**: Menuliskan rancangan algoritma dan memprogram simulasi sederhana.
* **Refleksi**: Mengisi jurnal harian digital terkait tantangan yang dihadapi.`;
  };

  return (
    <div className="space-y-6" id="learning-management-system-root">
      {/* Visual Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Brain className="h-64 w-64 text-blue-400 animate-pulse" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 animate-bounce" />
            <span>Sistem LMS Terintegrasi (11 Komponen Utama)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
            Learning Management System & Perangkat Kurikulum
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola, susun, dan pelihara seluruh administrasi pembelajaran berbasis Kurikulum Merdeka Informatika SMA secara cerdas, otomatis, dan berlandaskan model Pembelajaran Mendalam (Deep Learning).
          </p>
        </div>
      </div>

      {/* Grid Menu Navigasi 11 Komponen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-2 no-print" id="lms-11-elements-nav">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition focus:outline-none ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-102"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
              title={tab.label}
              id={`lms-nav-btn-${tab.id}`}
            >
              <div className={`p-1.5 rounded-lg mb-1.5 ${isActive ? "bg-white/20 text-white" : tab.color}`}>
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-bold tracking-tight leading-tight line-clamp-2">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE SCREEN CONTROLLER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[500px]" id="lms-active-screen-panel">
        
        {/* ======================================= */}
        {/* SUBTAB 1: CAPAIAN PEMBELAJARAN (CP)     */}
        {/* ======================================= */}
        {activeTab === "cp" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">CP Kurikulum</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Daftar Capaian Pembelajaran (CP) Informatika SMA</h2>
              <p className="text-slate-500 text-xs">Capaian Pembelajaran (Fase E & Fase F) yang ditetapkan resmi oleh Kemendikbudristek untuk bidang Informatika.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_CP.map((cp, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-5 hover:border-rose-200 transition space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 font-mono font-bold px-2 py-0.5 rounded uppercase">
                      Kelas {cp.kelas} (Fase {cp.fase})
                    </span>
                    <span className="text-xs font-bold text-slate-400">{cp.elemen}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">{cp.namaElemen}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded border border-slate-100">
                    "{cp.deskripsi}"
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setDeepPrompt(`Rancang RPP dari Capaian Pembelajaran Elemen ${cp.elemen} (${cp.namaElemen}): ${cp.deskripsi}`);
                        setActiveTab("deep_learning");
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
                    >
                      <span>Gunakan Sebagai Draf AI</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 2: ALUR TUJUAN PEMBELAJARAN (ATP) */}
        {/* ======================================= */}
        {activeTab === "atp" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">ATP Sequence</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Alur Tujuan Pembelajaran (ATP)</h2>
                <p className="text-slate-500 text-xs">Urutan logis capaian kompetensi per elemen yang disusun sistematis menuju penguasaan akhir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input ATP */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tambah Alur (ATP) Baru</h3>
                <form onSubmit={handleAddAtp} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kode ATP</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: ATP-10.1"
                      value={atpForm.kode}
                      onChange={(e) => setAtpForm({...atpForm, kode: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Elemen</label>
                      <select
                        value={atpForm.elemen}
                        onChange={(e) => setAtpForm({...atpForm, elemen: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white font-semibold"
                      >
                        <option value="BK">BK (Berpikir Komputasional)</option>
                        <option value="AP">AP (Algoritma Pemrograman)</option>
                        <option value="AD">AD (Analisis Data)</option>
                        <option value="JKI">JKI (Jaringan Komputer)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kelas</label>
                      <select
                        value={atpForm.kelas}
                        onChange={(e) => setAtpForm({...atpForm, kelas: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                      >
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Alokasi Waktu</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: 8 JP"
                      value={atpForm.alokasi}
                      onChange={(e) => setAtpForm({...atpForm, alokasi: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Rumusan Tujuan Pembelajaran</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Rumuskan tujuan pembelajaran..."
                      value={atpForm.tujuan}
                      onChange={(e) => setAtpForm({...atpForm, tujuan: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded text-xs transition"
                  >
                    + Daftarkan Alur ATP
                  </button>
                </form>
              </div>

              {/* Timeline ATP */}
              <div className="lg:col-span-8 space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-sm">Alur Berjalan (Fase E & F)</h3>
                <div className="space-y-3 relative border-l border-amber-200 pl-4 ml-2">
                  {atpList.map((item) => (
                    <div key={item.id} className="relative bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2 hover:shadow-sm transition">
                      <div className="absolute -left-[23px] top-4 bg-amber-500 text-white p-1 rounded-full border border-white">
                        <Milestone className="h-2.5 w-2.5" />
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold text-xs text-amber-700">{item.kode}</span>
                        <div className="flex gap-2">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">
                            {item.elemen}
                          </span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono">
                            {item.alokasi}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.tujuan}</p>
                      <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400">
                        <span>Sasaran: Kelas {item.kelas}</span>
                        <button
                          onClick={() => {
                            setAtpList(atpList.filter(a => a.id !== item.id));
                            logVersion("atp-list", "ATP (Alur Tujuan Pembelajaran)", `Menghapus item ${item.kode}`);
                          }}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 3: MODUL AJAR (RPP)              */}
        {/* ======================================= */}
        {activeTab === "modul" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Modul Ajar</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Penyusunan Modul Ajar (RPP Kurikulum Merdeka)</h2>
              <p className="text-slate-500 text-xs">Modul ajar memuat rencana pembelajaran lengkap dengan rincian langkah kegiatan interaktif.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Input Modul */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Desain Modul Baru</h3>
                <form onSubmit={handleAddModul} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Judul Modul</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Modul..."
                      value={modForm.judul}
                      onChange={(e) => setModForm({...modForm, judul: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Elemen</label>
                      <select
                        value={modForm.elemen}
                        onChange={(e) => setModForm({...modForm, elemen: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white font-semibold"
                      >
                        <option value="BK">BK</option>
                        <option value="AP">AP</option>
                        <option value="AD">AD</option>
                        <option value="JKI">JKI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kelas</label>
                      <select
                        value={modForm.kelas}
                        onChange={(e) => setModForm({...modForm, kelas: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                      >
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Metode & Alokasi</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Project Based"
                        value={modForm.metode}
                        onChange={(e) => setModForm({...modForm, metode: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="JP"
                        value={modForm.alokasi}
                        onChange={(e) => setModForm({...modForm, alokasi: e.target.value})}
                        className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Langkah Sesi Inti & Asesmen</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tuliskan aktivitas utama guru dan siswa..."
                      value={modForm.isi}
                      onChange={(e) => setModForm({...modForm, isi: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition"
                  >
                    + Simpan & Publikasikan
                  </button>
                </form>
              </div>

              {/* View Modul List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-sm">Modul Terdaftar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modulList.map((mod) => (
                    <div key={mod.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 relative hover:border-blue-300 transition">
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[9px] uppercase font-bold font-mono">
                          {mod.elemen} - Kelas {mod.kelas}
                        </span>
                        <button
                          onClick={() => {
                            setModulList(modulList.filter(m => m.id !== mod.id));
                            logVersion(mod.id, mod.judul, "Penghapusan modul");
                          }}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="font-display font-bold text-slate-800 text-sm leading-snug">{mod.judul}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{mod.isi}</p>
                      <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                        <span>Metode: {mod.metode}</span>
                        <span>{mod.alokasi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 4: DEEP LEARNING (AI SANDBOX)    */}
        {/* ======================================= */}
        {activeTab === "deep_learning" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Deep Learning (AI)</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Drafter Rencana Pembelajaran Mendalam (Deep Learning)</h2>
              <p className="text-slate-500 text-xs">Penyusunan RPP Kurikulum Merdeka cerdas menggunakan model integratif 8-3-3-4 dengan agen kecerdasan buatan.</p>
            </div>

            {/* AI Sandbox Playground */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Pillar Visualizer */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Kerangka 8-3-3-4 Deep Learning</span>
                </h3>
                
                <div className="space-y-2">
                  {[
                    { id: 0, title: "4 Pilar Pembelajaran", desc: "Praktik Pedagogis, Kemitraan Belajar, Lingkungan Belajar, Teknologi Digital." },
                    { id: 1, title: "8 Dimensi Profil Lulusan", desc: "Keimanan, Kewargaan Global, Penalaran Kritis (HOTS), Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi Efektif." },
                    { id: 2, title: "3 Prinsip Pembelajaran", desc: "Mindful (Berkesadaran), Meaningful (Bermakna), dan Joyful (Menggembirakan)." },
                    { id: 3, title: "3 Siklus Pengalaman", desc: "Pemahaman (Memahami), Penerapan (Menerapkan), dan Refleksi (Mengevaluasi)." }
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setDeepActivePillar(p.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition text-left ${
                        deepActivePillar === p.id 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs" 
                          : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <h4 className="text-xs font-bold flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {p.id + 1}
                        </span>
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Interface with AI */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-slate-800 text-sm">Asisten AI Penyusun Administrasi Guru</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ajukan draf pengajaran, kuis harian, atau studi kasus praktis. AI akan menerapkan kerangka kognitif 8-3-3-4 secara komprehensif.
                  </p>
                </div>

                {/* Suggestions Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {deepSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setDeepPrompt(s); handleDeepLearningQuery(s); }}
                      className="bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] px-2.5 py-1 rounded-full text-left transition font-medium"
                    >
                      💡 {s}
                    </button>
                  ))}
                </div>

                {/* Response Display Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 h-[280px] overflow-y-auto">
                  {isGeneratingAi ? (
                    <div className="h-full flex flex-col justify-center items-center text-slate-400 space-y-3">
                      <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
                      <p className="text-xs font-semibold animate-pulse">Menghubungkan ke Gemini-3.5-flash...</p>
                      <span className="text-[10px] text-slate-400">Merumuskan prinsip 8-3-3-4 Indonesia</span>
                    </div>
                  ) : aiResponse ? (
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-mono select-text">
                      {aiResponse}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-center items-center text-slate-400 text-center py-12">
                      <Brain className="h-10 w-10 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold">Belum ada draf rancangan yang dibuat.</p>
                      <span className="text-[10px] text-slate-400 max-w-sm">Tulis topik di kolom input di bawah atau pilih salah satu rekomendasi cepat.</span>
                    </div>
                  )}
                </div>

                {/* Prompt input field */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deepPrompt}
                    onChange={(e) => setDeepPrompt(e.target.value)}
                    placeholder="Contoh: Pengenalan Stack dan Queue Kelas X dengan Visualisator..."
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-indigo-500 bg-white"
                  />
                  <button
                    onClick={() => handleDeepLearningQuery()}
                    disabled={isGeneratingAi || !deepPrompt.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold px-4 py-2 rounded-lg text-xs transition shrink-0"
                  >
                    Rancang Cerdas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 5: KKTP RUBRIK                   */}
        {/* ======================================= */}
        {activeTab === "kktp" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">KKTP Rubrik</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h2>
              <p className="text-slate-500 text-xs">Menentukan kriteria ketuntasan siswa berdasarkan interval nilai, predikat, dan tindak lanjut remedial.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input KKTP */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tambah Rubrik KKTP</h3>
                <form onSubmit={handleAddKktp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tujuan Pembelajaran (TP) Terkait</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Contoh: Siswa mampu mendeteksi IP Address dan subnet mask pada jaringan LAN."
                      value={kktpForm.tujuanBelajar}
                      onChange={(e) => setKktpForm({...kktpForm, tujuanBelajar: e.target.value})}
                      className="w-full text-xs border border-slate-200 p-2 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Batas Interval Nilai</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Batas Bawah Remedial Parsial:</span>
                        <input
                          type="text"
                          required
                          value={kktpForm.k1}
                          onChange={(e) => setKktpForm({...kktpForm, k1: e.target.value})}
                          className="w-12 text-center p-1 border border-slate-200 rounded font-bold"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Batas Bawah Ketuntasan Cukup:</span>
                        <input
                          type="text"
                          required
                          value={kktpForm.k2}
                          onChange={(e) => setKktpForm({...kktpForm, k2: e.target.value})}
                          className="w-12 text-center p-1 border border-slate-200 rounded font-bold"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition"
                  >
                    + Daftarkan Rubrik KKTP
                  </button>
                </form>
              </div>

              {/* View KKTP List */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-sm">Daftar Kriteria KKTP Terdaftar</h3>
                <div className="space-y-4">
                  {kktpList.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs relative">
                      <div className="absolute right-4 top-4">
                        <button
                          onClick={() => {
                            setKktpList(kktpList.filter(k => k.id !== item.id));
                            logVersion("kktp-list", "KKTP Rubrik", "Penghapusan KKTP");
                          }}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase">KKTP Teraktif</span>
                        <h4 className="font-display font-bold text-slate-800 text-sm mt-1.5 leading-snug">{item.tujuanBelajar}</h4>
                      </div>

                      {/* Interval Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                        {item.intervalNilai.map((val, idx) => (
                          <div key={idx} className="border border-slate-100 bg-slate-50/50 p-3 rounded-lg space-y-1">
                            <span className="font-mono font-bold text-emerald-700 block">{val.rentang}</span>
                            <span className="font-bold text-slate-800 block text-[11px]">{val.predikat}</span>
                            <p className="text-[10px] text-slate-500 leading-tight">{val.tindakan}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 6: PROGRAM TAHUNAN (PROTA)       */}
        {/* ======================================= */}
        {activeTab === "prota" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded">Prota</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Program Tahunan (Prota) Informatika SMA</h2>
              <p className="text-slate-500 text-xs">Distribusi pembagian alokasi waktu JP mengajar selama 1 tahun pelajaran penuh (Semester 1 & 2).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-600 font-bold font-display border-b border-slate-200">
                    <th className="p-3.5 border-r border-slate-200">Semester</th>
                    <th className="p-3.5 border-r border-slate-200">Materi Pokok / Elemen</th>
                    <th className="p-3.5 border-r border-slate-200 text-center">Alokasi (JP)</th>
                    <th className="p-3.5 text-center">Distribusi Minggu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {protaList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-600 border-r border-slate-200">{p.semester}</td>
                      <td className="p-3.5 font-medium border-r border-slate-200">{p.materi}</td>
                      <td className="p-3.5 text-center font-bold font-mono text-cyan-700 border-r border-slate-200">{p.jp}</td>
                      <td className="p-3.5 text-center font-medium text-slate-500">{p.minggu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 7: PROGRAM SEMESTER (PROMES)     */}
        {/* ======================================= */}
        {activeTab === "promes" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-teal-500 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Promes</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Program Semester (Promes) Pembelajaran</h2>
              <p className="text-slate-500 text-xs">Penjabaran program tahunan secara detail dalam kalender mingguan pelaksanaan materi per elemen.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200 w-44">Materi / Elemen</th>
                    <th className="p-3 border-r border-slate-200 text-center w-12">JP</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((w) => (
                      <th key={w} className="p-1 border-r border-slate-200 text-center text-[9px] w-8">M{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 font-bold">1. Berpikir Komputasional</td>
                    <td className="p-3 border-r border-slate-200 text-center font-bold">18 JP</td>
                    {[1, 1, 1, 1, 1, 1].map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center bg-teal-50 text-teal-600 font-bold">✔</td>
                    ))}
                    {Array.from({ length: 14 }).map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 font-bold">2. TIK (Integrasi Office)</td>
                    <td className="p-3 border-r border-slate-200 text-center font-bold">12 JP</td>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center text-slate-300">-</td>
                    ))}
                    {[1, 1, 1, 1].map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center bg-teal-50 text-teal-600 font-bold">✔</td>
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 border-r border-slate-200 font-bold">3. Jaringan Komputer</td>
                    <td className="p-3 border-r border-slate-200 text-center font-bold">12 JP</td>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center text-slate-300">-</td>
                    ))}
                    {[1, 1, 1, 1].map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center bg-teal-50 text-teal-600 font-bold">✔</td>
                    ))}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <td key={i} className="p-1 border-r border-slate-200 text-center text-slate-300">-</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 8: MATERI PEMBELAJARAN           */}
        {/* ======================================= */}
        {activeTab === "materi" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded">Materi Pembelajaran</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Daftar Materi Belajar Siswa</h2>
              <p className="text-slate-500 text-xs">Materi bacaan interaktif, kode visualizer, dan lembar materi terstruktur untuk pengajaran.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { judul: "Pemrograman Python Dasar", kelas: "X", elemen: "AP", bab: "Sintaksis & Variable", desk: "Mengenal tipe data integer, string, boolean, dan dasar print serta input." },
                { judul: "Dasar Struktur Data List & Stack", kelas: "X", elemen: "BK", bab: "LIFO & FIFO", desk: "Memahami struktur tumpukan piring (stack) dan antrean loket (queue) un-plugged." },
                { judul: "Visualisasi Grafik Pandas", kelas: "XI", elemen: "AD", bab: "Data Cleaning", desk: "Menggunakan Python library Pandas untuk plotting tren bar chart & scatter plot." }
              ].map((m, idx) => (
                <div key={idx} className="bg-slate-50/40 border border-slate-200 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full font-bold uppercase">{m.elemen}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Kelas {m.kelas}</span>
                    </div>
                    <h4 className="font-display font-bold text-slate-800 text-sm leading-snug">{m.judul}</h4>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.bab}</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{m.desk}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition">
                      <span>Buka Materi</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 9: BUKU DIGITAL                  */}
        {/* ======================================= */}
        {activeTab === "buku" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-violet-500 uppercase tracking-widest bg-violet-50 px-2 py-1 rounded">Buku Teks</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Buku Teks Utama Informatika (Kurikulum Merdeka)</h2>
              <p className="text-slate-500 text-xs">Pustaka digital materi pokok resmi yang didesain interaktif untuk pegangan Guru dan Siswa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_BUKU.map((b) => (
                <div key={b.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-violet-300 transition">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-100 text-violet-700 p-2.5 rounded-xl">
                        <Book className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-sm leading-tight">{b.judul}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">Kemendikbudristek • {b.tahun}</p>
                      </div>
                    </div>
                    
                    {/* Chapter list preview */}
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daftar Bab Preview</span>
                      {b.bab.map((ch, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-400 italic">E-Book Digital</span>
                    <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition">
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 10: REPOSITORY & DRAG DROP       */}
        {/* ======================================= */}
        {activeTab === "repository" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest bg-fuchsia-50 px-2 py-1 rounded">Repository</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Repository File Perangkat Pembelajaran</h2>
              <p className="text-slate-500 text-xs">Penyimpanan sentral dokumen, RPP, dan aset ajar. Anda dapat mengunggah file materi baru di sini.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Drag and Drop Zone */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Unggah Aset Ajar</h3>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col justify-center items-center h-[250px] space-y-4 ${
                    isDragging
                      ? "border-fuchsia-500 bg-fuchsia-50/50"
                      : "border-slate-300 hover:border-fuchsia-400 bg-slate-50/50"
                  }`}
                >
                  <div className="bg-fuchsia-100 text-fuchsia-700 p-3 rounded-full">
                    <UploadCloud className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Tarik & Lepaskan File di Sini</p>
                    <p className="text-[10px] text-slate-400 mt-1">Mendukung PDF, DOCX, XLSX, atau ZIP (Maks 10MB)</p>
                  </div>
                  <label className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-1.5 px-4 rounded text-xs transition cursor-pointer">
                    Pilih File Manual
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const sizeStr = file.size > 1024 * 1024 
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                            : `${(file.size / 1024).toFixed(0)} KB`;
                          
                          const newFile = {
                            id: `rep-${Date.now()}`,
                            nama: file.name,
                            ukuran: sizeStr,
                            tipe: file.name.split(".").pop()?.toUpperCase() || "BIN",
                            pengunggah: user.nama,
                            tanggal: new Date().toISOString().split("T")[0]
                          };
                          setRepoFiles([newFile, ...repoFiles]);
                          setUploadedFile(newFile);
                          setTimeout(() => setUploadedFile(null), 3000);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Upload notification feedback toast */}
                {uploadedFile && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center gap-2 animate-fade-in">
                    <Check className="h-4 w-4 bg-emerald-500 text-white rounded-full p-0.5 shrink-0" />
                    <div>
                      <span className="font-bold block">File berhasil diunggah!</span>
                      <span className="font-mono text-[10px] text-emerald-600">{uploadedFile.nama} ({uploadedFile.ukuran})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Explorer List */}
              <div className="lg:col-span-8 space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-sm">File Penyimpanan</h3>
                <div className="divide-y divide-slate-150 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {repoFiles.map((file) => (
                    <div key={file.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-50/50 transition">
                      <div className="flex items-center gap-3">
                        <span className={`h-8 w-10 font-bold flex items-center justify-center text-[10px] rounded uppercase font-mono border ${
                          file.tipe === "PDF" ? "bg-rose-50 text-rose-700 border-rose-200"
                            : file.tipe === "DOCX" ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {file.tipe}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-800 block truncate max-w-sm">{file.nama}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Diunggah: {file.tanggal} • {file.ukuran} • Pengunggah: {file.pengunggah}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="text-slate-400 hover:text-blue-600 transition p-1.5 hover:bg-slate-100 rounded-lg" title="Unduh File">
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setRepoFiles(repoFiles.filter(rf => rf.id !== file.id))}
                          className="text-slate-400 hover:text-red-500 transition p-1.5 hover:bg-slate-100 rounded-lg"
                          title="Hapus File"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 11: VERSIONING & DIFF COMPARISON */}
        {/* ======================================= */}
        {activeTab === "versioning" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Versioning</span>
              <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Kontrol Versi Dokumen Kurikulum (Revision Control)</h2>
              <p className="text-slate-500 text-xs">Pantau perubahan dokumen, bandingkan draf lama vs baru, dan kembalikan ke revisi sebelumnya secara aman.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Revision Logs */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Log Riwayat Modifikasi</h3>
                <div className="space-y-2 max-h-[450px] overflow-y-auto">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVersion(v)}
                      className={`p-3.5 rounded-xl border cursor-pointer text-left transition ${
                        selectedVersion?.id === v.id
                          ? "bg-blue-50 border-blue-200 shadow-xs text-blue-950"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase">
                          {v.versi}
                        </span>
                        <span className="text-slate-400">{v.tanggal}</span>
                      </div>
                      <h4 className="font-display font-bold text-xs text-slate-800 mt-2 truncate">{v.docTitle}</h4>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1 line-clamp-2">{v.keterangan}</p>
                      <span className="block text-[10px] text-slate-400 mt-2 text-right">Oleh: {v.pembuat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Diff Viewer */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                {selectedVersion ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase">
                          Perbandingan Versi {selectedVersion.versi}
                        </span>
                        <h4 className="font-display font-bold text-slate-800 text-sm mt-1">{selectedVersion.docTitle}</h4>
                      </div>
                      <button
                        onClick={() => {
                          alert(`Dokumen "${selectedVersion.docTitle}" berhasil dikembalikan ke versi ${selectedVersion.versi}!`);
                          logVersion(selectedVersion.docId, selectedVersion.docTitle, `Mengembalikan dokumen ke revisi ${selectedVersion.versi}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 transition select-none"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Pulihkan Versi Ini</span>
                      </button>
                    </div>

                    {/* Side-by-side diff comparison cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Before content (deleted/modified) */}
                      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-2">
                        <span className="block text-[9px] font-bold text-rose-700 uppercase tracking-widest bg-rose-50 w-fit px-1.5 py-0.5 rounded">
                          SEBELUM PERUBAHAN
                        </span>
                        <p className="text-xs text-rose-800 leading-relaxed font-mono whitespace-pre-wrap select-text">
                          {selectedVersion.kontenSebelum}
                        </p>
                      </div>

                      {/* After content (added) */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                        <span className="block text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 w-fit px-1.5 py-0.5 rounded">
                          SESUDAH PERUBAHAN
                        </span>
                        <p className="text-xs text-emerald-800 leading-relaxed font-mono whitespace-pre-wrap select-text">
                          {selectedVersion.kontenSesudah}
                        </p>
                      </div>

                    </div>

                    <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-150 leading-relaxed flex items-center gap-2">
                      <Info className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                      <span>
                        Penyimpanan didukung enkripsi metadata log dan enkapsulasi file. Seluruh versi dilacak otomatis.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-slate-400 py-24 text-center">
                    <ArrowLeftRight className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">Pilih salah satu log revisi di sebelah kiri</p>
                    <span className="text-[10px] text-slate-400 max-w-sm">untuk melihat perbandingan perbedaan teks kode (diff comparison) dan pemulihan data instan.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
