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
  ArrowLeftRight,
  Pencil,
  X,
  Settings,
  Sliders,
  Calculator,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  Link2,
  Play,
  Eye,
  File,
  Film,
  Image,
  FileCode,
  CheckCircle2,
  Share2,
  Paperclip,
  Upload,
  Copy,
  Printer
} from "lucide-react";
import { ELEMEN_INFORMATIKA } from "../types";
import { WysiwygEditor } from "./WysiwygEditor";
import { getBakuModulAjarTemplate, getBakuModulAjarDataAnalisisTemplate } from "../utils/modulAjarTemplate";

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
    judul: "Modul Ajar Informatika - Deep Learning: Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)",
    elemen: "AP",
    kelas: "XII",
    pertemuan: "Pertemuan 1",
    metode: "Pembelajaran Mendalam (Deep Learning)",
    alokasi: "3 JP x 45 menit",
    isi: getBakuModulAjarTemplate("Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)", "AP", "XII", "F"),
    penulis: "Yogi Suprayogi, S.Kom.",
    sedangDieditBy: null
  },
  {
    id: "mod-2",
    judul: "Modul Ajar Informatika - Deep Learning: Pengolahan dan Analisis Data Bervolume Besar untuk Pengambilan Keputusan",
    elemen: "AD",
    kelas: "XII",
    pertemuan: "Pertemuan 2",
    metode: "Pembelajaran Mendalam (Deep Learning)",
    alokasi: "3 JP x 45 menit",
    isi: getBakuModulAjarDataAnalisisTemplate(),
    penulis: "Dra. Hj. Nurhayati, M.Pd.",
    sedangDieditBy: {
      nama: "Dra. Hj. Nurhayati, M.Pd.",
      role: "Guru MGMP Informatika",
      waktu: "3 menit yang lalu"
    }
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

export interface MateriItem {
  id: string;
  judul: string;
  kelas: "X" | "XI" | "XII";
  elemen: string;
  bab: string;
  deskripsi: string;
  tipeFormat: "dokumen" | "spreadsheet" | "presentasi" | "animasi" | "audio" | "video" | "tautan";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  embedUrl?: string;
  tanggalDibuat: string;
  pembuat: string;
  status: "Publik" | "Draf";
  tags?: string[];
}

const MOCK_MATERI: MateriItem[] = [
  {
    id: "mat-1",
    judul: "Panduan Dasar Pemrograman Python & Variable",
    kelas: "X",
    elemen: "AP",
    bab: "Sintaksis & Variable Python",
    deskripsi: "Modul ringkas interaktif pengenalan tipe data integer, string, boolean, serta contoh program input-output.",
    tipeFormat: "dokumen",
    fileName: "Panduan_Python_Dasar_FaseE.pdf",
    fileSize: "2.4 MB",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tanggalDibuat: "2026-07-15",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Python", "Sintaksis", "Variable"]
  },
  {
    id: "mat-2",
    judul: "Spreadsheet Laporan Analisis Data Penjualan Toko",
    kelas: "XI",
    elemen: "AD",
    bab: "Pengolahan & Clean Data",
    deskripsi: "Lembar kerja dataset komprehensif berisi contoh perhitungan statistik deskriptif, VLOOKUP, dan Pivot Table.",
    tipeFormat: "spreadsheet",
    fileName: "Dataset_Analisis_Data_Kelas11.xlsx",
    fileSize: "1.8 MB",
    fileUrl: "#",
    tanggalDibuat: "2026-07-16",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Excel", "PivotTable", "Pandas"]
  },
  {
    id: "mat-3",
    judul: "Slide Presentasi Arsitektur Sistem Komputer & OS",
    kelas: "X",
    elemen: "SK",
    bab: "Hardware, Software & OS",
    deskripsi: "Presentasi interaktif dengan diagram siklus von Neumann, hierarki memori, dan fungsi Kernel Sistem Operasi.",
    tipeFormat: "presentasi",
    fileName: "Slide_Sistem_Komputer_FaseE.pptx",
    fileSize: "8.5 MB",
    fileUrl: "#",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQ/embed",
    tanggalDibuat: "2026-07-17",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Hardware", "Kernel", "OS"]
  },
  {
    id: "mat-4",
    judul: "Animasi Interaktif Visualisasi Algoritma Bubble & Quick Sort",
    kelas: "X",
    elemen: "BK",
    bab: "Algoritma Pengurutan (Sorting)",
    deskripsi: "Animasi visual interaktif pergerakan elemen dalam array untuk memahami perbandingan waktu Bubble Sort vs Quick Sort.",
    tipeFormat: "animasi",
    fileName: "Visualizer_Sorting_Animation.gif",
    fileSize: "3.2 MB",
    fileUrl: "#",
    tanggalDibuat: "2026-07-18",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Sorting", "Animasi", "Visualizer"]
  },
  {
    id: "mat-5",
    judul: "Video Tutorial Konfigurasi Subnetting & IP Address LAN",
    kelas: "XI",
    elemen: "JKI",
    bab: "Pengalamatan IP & Subnetting",
    deskripsi: "Video panduan praktikum langkah demi langkah merancang IP Address Class C, Netmask, dan Gateway.",
    tipeFormat: "video",
    fileName: "Tutorial_Subnetting_LAN.mp4",
    fileSize: "45.0 MB",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tanggalDibuat: "2026-07-19",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Networking", "Subnetting", "IPAddress"]
  },
  {
    id: "mat-6",
    judul: "Podcast Edukasi Dampak Etis AI & Keamanan Data Pribadi",
    kelas: "XII",
    elemen: "DSI",
    bab: "Etika Teknologi & Privacy",
    deskripsi: "Rekaman audio diskusi mendalam mengenai Undang-Undang PDP, etika generative AI, dan perlindungan privasi digital.",
    tipeFormat: "audio",
    fileName: "Podcast_Etika_AI_Kelas12.mp3",
    fileSize: "12.4 MB",
    fileUrl: "#",
    tanggalDibuat: "2026-07-20",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Podcast", "EtikaAI", "CyberSecurity"]
  },
  {
    id: "mat-7",
    judul: "Tautan Interaktif Simulator Python Compiler Online (Replit)",
    kelas: "X",
    elemen: "AP",
    bab: "Praktikum Coding Mandiri",
    deskripsi: "Pranala luar langsung menuju IDE Python online cloud untuk menguji coba snippet kode siswa tanpa instalasi.",
    tipeFormat: "tautan",
    fileUrl: "https://replit.com/~",
    tanggalDibuat: "2026-07-21",
    pembuat: "Yogi Suprayogi, S.Kom.",
    status: "Publik",
    tags: ["Replit", "IDE", "Cloud"]
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
  { id: "pro-1", semester: "1 (GANJIL)", materi: "Berpikir Komputasional (Dekomposisi, Abstraksi, Pola)", jp: "18 JP", minggu: "Minggu 1 - 6", keterangan: "Alokasi 6 Pertemuan @ 3 JP" },
  { id: "pro-2", semester: "1 (GANJIL)", materi: "Teknologi Informasi dan Komunikasi (Integrasi Konten Office)", jp: "12 JP", minggu: "Minggu 7 - 10", keterangan: "Alokasi 4 Pertemuan @ 3 JP" },
  { id: "pro-3", semester: "1 (GANJIL)", materi: "Sistem Komputer (Hardware, Software, OS)", jp: "18 JP", minggu: "Minggu 11 - 16", keterangan: "Alokasi 6 Pertemuan @ 3 JP" },
  { id: "pro-4", semester: "2 (GENAP)", materi: "Jaringan Komputer dan Internet (Konfigurasi & IP)", jp: "12 JP", minggu: "Minggu 1 - 4", keterangan: "Alokasi 4 Pertemuan @ 3 JP" },
  { id: "pro-5", semester: "2 (GENAP)", materi: "Algoritma dan Pemrograman Python Prosedural", jp: "24 JP", minggu: "Minggu 5 - 12", keterangan: "Alokasi 8 Pertemuan @ 3 JP" },
  { id: "pro-6", semester: "2 (GENAP)", materi: "Dampak Sosial Informatika & Praktik Lintas Bidang", jp: "12 JP", minggu: "Minggu 13 - 16", keterangan: "Alokasi 4 Pertemuan @ 3 JP" }
];

const MOCK_PROMES = [
  {
    id: "prm-1",
    semester: "1 (GANJIL)",
    materi: "1. Berpikir Komputasional (BK)",
    jp: "18 JP",
    weeks: [true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    keterangan: "6 Pertemuan @ 3 JP (M1-M6)"
  },
  {
    id: "prm-2",
    semester: "1 (GANJIL)",
    materi: "2. Teknologi Informasi dan Komunikasi (TIK)",
    jp: "12 JP",
    weeks: [false, false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false],
    keterangan: "4 Pertemuan @ 3 JP (M7-M10)"
  },
  {
    id: "prm-3",
    semester: "1 (GANJIL)",
    materi: "3. Sistem Komputer (SK)",
    jp: "18 JP",
    weeks: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, false],
    keterangan: "6 Pertemuan @ 3 JP (M11-M16)"
  },
  {
    id: "prm-4",
    semester: "2 (GENAP)",
    materi: "4. Jaringan Komputer dan Internet (JKI)",
    jp: "12 JP",
    weeks: [true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    keterangan: "4 Pertemuan @ 3 JP (M1-M4)"
  },
  {
    id: "prm-5",
    semester: "2 (GENAP)",
    materi: "5. Algoritma dan Pemrograman (AP)",
    jp: "24 JP",
    weeks: [false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false],
    keterangan: "8 Pertemuan @ 3 JP (M5-M12)"
  },
  {
    id: "prm-6",
    semester: "2 (GENAP)",
    materi: "6. Dampak Sosial Informatika (DSI) & PLB",
    jp: "12 JP",
    weeks: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, false, false, false, false],
    keterangan: "4 Pertemuan @ 3 JP (M13-M16)"
  }
];

interface LmsViewProps {
  user: any;
}

export const LmsView: React.FC<LmsViewProps> = ({ user }) => {
  // Navigation tabs (11 elements)
  const allTabs = [
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

  const tabs = React.useMemo(() => {
    if (user?.role === "SISWA") {
      return allTabs.filter((t) => ["materi", "buku", "repository", "cp", "atp"].includes(t.id));
    }
    return allTabs;
  }, [user]);

  const [activeTab, setActiveTab] = useState<string>(() => {
    return user?.role === "SISWA" ? "materi" : "deep_learning";
  });

  // State Management for individual sub-views
  const [atpList, setAtpList] = useState(() => {
    const saved = localStorage.getItem("lms_atp_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_ATP;
  });

  const [modulList, setModulList] = useState(() => {
    const saved = localStorage.getItem("lms_modul_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_MODUL;
  });

  const [kktpList, setKktpList] = useState(() => {
    const saved = localStorage.getItem("lms_kktp_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_KKTP;
  });

  const [protaList, setProtaList] = useState(() => {
    const saved = localStorage.getItem("lms_prota_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_PROTA;
  });

  const [promesList, setPromesList] = useState(() => {
    const saved = localStorage.getItem("lms_promes_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_PROMES;
  });

  const [mingguEfektifConfig, setMingguEfektifConfig] = useState(() => {
    const saved = localStorage.getItem("lms_minggu_efektif_config");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      ganjil: { totalMinggu: 22, tidakEfektif: 4, jpPerMinggu: 3 },
      genap: { totalMinggu: 20, tidakEfektif: 4, jpPerMinggu: 3 }
    };
  });

  // Prota Modal & Form State
  const [isProtaModalOpen, setIsProtaModalOpen] = useState(false);
  const [editingProtaId, setEditingProtaId] = useState<string | null>(null);
  const [protaForm, setProtaForm] = useState({
    semester: "1 (GANJIL)",
    materi: "",
    jp: "18 JP",
    minggu: "Minggu 1 - 6",
    keterangan: "Alokasi Sesuai Kalender Pendidikan"
  });

  // Promes Modal & Form State
  const [isPromesModalOpen, setIsPromesModalOpen] = useState(false);
  const [editingPromesId, setEditingPromesId] = useState<string | null>(null);
  const [promesFilter, setPromesFilter] = useState<string>("ALL");
  const [promesForm, setPromesForm] = useState({
    semester: "1 (GANJIL)",
    materi: "",
    jp: "18 JP",
    weeks: Array(20).fill(false),
    keterangan: "Pertemuan Mingguan Efektif"
  });

  // Kalender Config Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configForm, setConfigForm] = useState(mingguEfektifConfig);

  const [versions, setVersions] = useState(() => {
    const saved = localStorage.getItem("lms_versions");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_VERSIONING;
  });

  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);

  // CP Management States & Actions
  const [cpList, setCpList] = useState<any[]>(() => {
    const saved = localStorage.getItem("lms_cp_list");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return MOCK_CP.map((cp, idx) => ({ ...cp, id: `cp-${idx + 1}` }));
  });

  // Persist modifications to localStorage to guarantee data survival on refresh
  useEffect(() => {
    localStorage.setItem("lms_atp_list", JSON.stringify(atpList));
  }, [atpList]);

  useEffect(() => {
    localStorage.setItem("lms_modul_list", JSON.stringify(modulList));
  }, [modulList]);

  // Sync calendar scheduled dates automatically
  useEffect(() => {
    const handleScheduleUpdate = (e: any) => {
      if (e.detail) {
        setModulList(e.detail);
      }
    };
    window.addEventListener("lms_schedule_updated", handleScheduleUpdate);
    return () => window.removeEventListener("lms_schedule_updated", handleScheduleUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem("lms_kktp_list", JSON.stringify(kktpList));
  }, [kktpList]);

  useEffect(() => {
    localStorage.setItem("lms_prota_list", JSON.stringify(protaList));
  }, [protaList]);

  useEffect(() => {
    localStorage.setItem("lms_promes_list", JSON.stringify(promesList));
  }, [promesList]);

  useEffect(() => {
    localStorage.setItem("lms_minggu_efektif_config", JSON.stringify(mingguEfektifConfig));
  }, [mingguEfektifConfig]);

  // Helper calculations for Kalender Pendidikan & Minggu Efektif
  const parseJpNumber = (jpStr: string): number => {
    if (!jpStr) return 0;
    const match = jpStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const smt1Efektif = (mingguEfektifConfig?.ganjil?.totalMinggu || 22) - (mingguEfektifConfig?.ganjil?.tidakEfektif || 4);
  const smt1TotalJp = smt1Efektif * (mingguEfektifConfig?.ganjil?.jpPerMinggu || 3);

  const smt2Efektif = (mingguEfektifConfig?.genap?.totalMinggu || 20) - (mingguEfektifConfig?.genap?.tidakEfektif || 4);
  const smt2TotalJp = smt2Efektif * (mingguEfektifConfig?.genap?.jpPerMinggu || 3);

  const protaSmt1AllocatedJp = protaList
    .filter((p: any) => p.semester.includes("1") || p.semester.toUpperCase().includes("GANJIL"))
    .reduce((acc: number, item: any) => acc + parseJpNumber(item.jp), 0);

  const protaSmt2AllocatedJp = protaList
    .filter((p: any) => p.semester.includes("2") || p.semester.toUpperCase().includes("GENAP"))
    .reduce((acc: number, item: any) => acc + parseJpNumber(item.jp), 0);

  const promesSmt1AllocatedJp = promesList
    .filter((p: any) => p.semester.includes("1") || p.semester.toUpperCase().includes("GANJIL"))
    .reduce((acc: number, item: any) => acc + parseJpNumber(item.jp), 0);

  const promesSmt2AllocatedJp = promesList
    .filter((p: any) => p.semester.includes("2") || p.semester.toUpperCase().includes("GENAP"))
    .reduce((acc: number, item: any) => acc + parseJpNumber(item.jp), 0);

  // Prota CRUD Handlers
  const handleOpenAddProta = () => {
    setEditingProtaId(null);
    setProtaForm({
      semester: "1 (GANJIL)",
      materi: "",
      jp: "18 JP",
      minggu: "Minggu 1 - 6",
      keterangan: "Alokasi Sesuai Kalender Pendidikan"
    });
    setIsProtaModalOpen(true);
  };

  const handleOpenEditProta = (item: any) => {
    setEditingProtaId(item.id);
    setProtaForm({
      semester: item.semester,
      materi: item.materi,
      jp: item.jp,
      minggu: item.minggu,
      keterangan: item.keterangan || "Alokasi Sesuai Kalender Pendidikan"
    });
    setIsProtaModalOpen(true);
  };

  const handleSaveProta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protaForm.materi.trim()) return;

    if (editingProtaId) {
      setProtaList(protaList.map((p: any) => p.id === editingProtaId ? { ...p, ...protaForm } : p));
    } else {
      const newItem = {
        id: `pro-${Date.now()}`,
        ...protaForm
      };
      setProtaList([...protaList, newItem]);
    }
    setIsProtaModalOpen(false);
  };

  const handleDeleteProta = (id: string) => {
    if (window.confirm("Hapus baris Program Tahunan ini?")) {
      setProtaList(protaList.filter((p: any) => p.id !== id));
    }
  };

  // Promes CRUD Handlers
  const handleOpenAddPromes = () => {
    setEditingPromesId(null);
    setPromesForm({
      semester: "1 (GANJIL)",
      materi: "",
      jp: "18 JP",
      weeks: [true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      keterangan: "Pertemuan Mingguan Efektif"
    });
    setIsPromesModalOpen(true);
  };

  const handleOpenEditPromes = (item: any) => {
    setEditingPromesId(item.id);
    setPromesForm({
      semester: item.semester,
      materi: item.materi,
      jp: item.jp,
      weeks: item.weeks || Array(20).fill(false),
      keterangan: item.keterangan || ""
    });
    setIsPromesModalOpen(true);
  };

  const handleSavePromes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promesForm.materi.trim()) return;

    if (editingPromesId) {
      setPromesList(promesList.map((p: any) => p.id === editingPromesId ? { ...p, ...promesForm } : p));
    } else {
      const newItem = {
        id: `prm-${Date.now()}`,
        ...promesForm
      };
      setPromesList([...promesList, newItem]);
    }
    setIsPromesModalOpen(false);
  };

  const handleDeletePromes = (id: string) => {
    if (window.confirm("Hapus baris Program Semester ini?")) {
      setPromesList(promesList.filter((p: any) => p.id !== id));
    }
  };

  const handleTogglePromesWeek = (promesId: string, weekIdx: number) => {
    setPromesList(promesList.map((p: any) => {
      if (p.id !== promesId) return p;
      const currentWeeks = p.weeks ? [...p.weeks] : Array(20).fill(false);
      currentWeeks[weekIdx] = !currentWeeks[weekIdx];
      return { ...p, weeks: currentWeeks };
    }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setMingguEfektifConfig(configForm);
    setIsConfigModalOpen(false);
  };

  useEffect(() => {
    localStorage.setItem("lms_versions", JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem("lms_cp_list", JSON.stringify(cpList));
  }, [cpList]);

  const [isEditingCpId, setIsEditingCpId] = useState<string | null>(null);
  const [isAddingCp, setIsAddingCp] = useState(false);
  const [cpForm, setCpForm] = useState({
    id: "",
    fase: "E",
    kelas: "X",
    elemen: "BK",
    namaElemen: "Berpikir Komputasional",
    deskripsi: ""
  });

  const handleEditCpClick = (cp: any) => {
    setIsEditingCpId(cp.id);
    setIsAddingCp(false);
    setCpForm({
      id: cp.id,
      fase: cp.fase,
      kelas: cp.kelas,
      elemen: cp.elemen,
      namaElemen: cp.namaElemen,
      deskripsi: cp.deskripsi
    });
  };

  const handleAddCpClick = () => {
    setIsAddingCp(true);
    setIsEditingCpId(null);
    setCpForm({
      id: "",
      fase: "E",
      kelas: "X",
      elemen: "BK",
      namaElemen: "Berpikir Komputasional",
      deskripsi: ""
    });
  };

  const handleElemenChange = (elCode: string) => {
    const el = ELEMEN_INFORMATIKA.find(e => e.kode === elCode);
    setCpForm(prev => ({
      ...prev,
      elemen: elCode,
      namaElemen: el ? el.nama : prev.namaElemen
    }));
  };

  const handleSaveCp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpForm.namaElemen || !cpForm.deskripsi) return;

    if (isAddingCp) {
      const newCp = {
        id: `cp-${Date.now()}`,
        fase: cpForm.fase,
        kelas: cpForm.kelas,
        elemen: cpForm.elemen,
        namaElemen: cpForm.namaElemen,
        deskripsi: cpForm.deskripsi
      };
      setCpList([...cpList, newCp]);
      logVersion(newCp.id, `CP (${newCp.namaElemen})`, `Menambahkan Capaian Pembelajaran Elemen ${newCp.elemen}`);
      setIsAddingCp(false);
    } else if (isEditingCpId) {
      setCpList(cpList.map(cp => cp.id === isEditingCpId ? { ...cp, ...cpForm } : cp));
      logVersion(isEditingCpId, `CP (${cpForm.namaElemen})`, `Memperbarui Capaian Pembelajaran Elemen ${cpForm.elemen}`);
      setIsEditingCpId(null);
    }

    setCpForm({
      id: "",
      fase: "E",
      kelas: "X",
      elemen: "BK",
      namaElemen: "Berpikir Komputasional",
      deskripsi: ""
    });
  };

  const handleDeleteCp = (id: string, namaElemen: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Capaian Pembelajaran untuk elemen "${namaElemen}"?`)) {
      setCpList(cpList.filter(cp => cp.id !== id));
      logVersion(id, `CP (${namaElemen})`, `Menghapus Capaian Pembelajaran`);
      if (isEditingCpId === id) {
        setIsEditingCpId(null);
      }
    }
  };

  // Form states
  const [atpForm, setAtpForm] = useState({ kode: "", elemen: "BK", kelas: "X", tujuan: "", alokasi: "4 JP" });
  
  // Modul Ajar Management States
  const [modulSearch, setModulSearch] = useState("");
  const [modulFilterKelas, setModulFilterKelas] = useState("Semua");
  const [modulFilterElemen, setModulFilterElemen] = useState("Semua");
  const [modulFilterStatus, setModulFilterStatus] = useState("Semua");
  const [isModulModalOpen, setIsModulModalOpen] = useState(false);
  const [editingModulId, setEditingModulId] = useState<string | null>(null);
  const [previewModulItem, setPreviewModulItem] = useState<any | null>(null);
  const [openCardExportId, setOpenCardExportId] = useState<string | null>(null);

  // School Template Configuration State for Custom Document Exports
  const [schoolTemplate, setSchoolTemplate] = useState(() => {
    const saved = localStorage.getItem("lms_school_template");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      namaSekolah: "SMA NEGERI 2 CIAMIS",
      provinsiDinas: "PEMERINTAH PROVINSI JAWA BARAT - DINAS PENDIDIKAN",
      alamatSekolah: "Jl. Ir. H. Juanda No. 177 Ciamis",
      teleponEmail: "Telp: (0265) 771032 • Email: info@sman2ciamis.sch.id",
      namaKepalaSekolah: "Dr. Hj. Rahmawati, M.Pd.",
      nipKepalaSekolah: "19780312 200312 2 001",
      namaGuru: user?.nama || user?.name || "Yogi Suprayogi, S.Kom.",
      nipGuru: "19850615 201001 1 012",
      kotaKabupaten: "Ciamis",
      tahunPelajaran: "2025/2026"
    };
  });

  const [isSchoolTemplateModalOpen, setIsSchoolTemplateModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lms_school_template", JSON.stringify(schoolTemplate));
  }, [schoolTemplate]);

  const [modForm, setModForm] = useState<{
    judul: string;
    elemen: string;
    kelas: string;
    pertemuan: string;
    metode: string;
    alokasi: string;
    tanggalPertemuan: string;
    isi: string;
    lampiran: Array<{ id: string; nama: string; ukuran: string; tipe: string; url?: string }>;
  }>({
    judul: "",
    elemen: "AP",
    kelas: "XII",
    pertemuan: "Pertemuan 1",
    metode: "Pembelajaran Mendalam (Deep Learning)",
    alokasi: "3 JP x 45 menit",
    tanggalPertemuan: new Date().toISOString().split("T")[0],
    isi: getBakuModulAjarTemplate("Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)", "AP", "XII", "F"),
    lampiran: []
  });

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

  // Materi Belajar States & Management
  const [materiList, setMateriList] = useState<MateriItem[]>(() => {
    const saved = localStorage.getItem("lms_materi_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return MOCK_MATERI;
  });

  useEffect(() => {
    localStorage.setItem("lms_materi_list", JSON.stringify(materiList));
  }, [materiList]);

  const [isMateriModalOpen, setIsMateriModalOpen] = useState(false);
  const [editingMateriId, setEditingMateriId] = useState<string | null>(null);
  const [previewMateri, setPreviewMateri] = useState<MateriItem | null>(null);

  const [materiSearch, setMateriSearch] = useState("");
  const [materiFilterKelas, setMateriFilterKelas] = useState("Semua");
  const [materiFilterFormat, setMateriFilterFormat] = useState("Semua");
  const [materiFilterElemen, setMateriFilterElemen] = useState("Semua");

  const [materiForm, setMateriForm] = useState<Partial<MateriItem>>({
    judul: "",
    kelas: "X",
    elemen: "AP",
    bab: "",
    deskripsi: "",
    tipeFormat: "dokumen",
    fileName: "",
    fileSize: "",
    fileUrl: "",
    embedUrl: "",
    status: "Publik",
    tags: []
  });

  const handleOpenAddMateri = () => {
    setEditingMateriId(null);
    setMateriForm({
      judul: "",
      kelas: "X",
      elemen: "AP",
      bab: "",
      deskripsi: "",
      tipeFormat: "dokumen",
      fileName: "",
      fileSize: "",
      fileUrl: "",
      embedUrl: "",
      status: "Publik",
      tags: []
    });
    setIsMateriModalOpen(true);
  };

  const handleOpenEditMateri = (item: MateriItem) => {
    setEditingMateriId(item.id);
    setMateriForm({ ...item });
    setIsMateriModalOpen(true);
  };

  const handleSaveMateri = () => {
    if (!materiForm.judul?.trim()) {
      alert("Judul materi wajib diisi!");
      return;
    }
    const guruName = user?.nama || user?.name || "Yogi Suprayogi, S.Kom.";
    const dateStr = new Date().toISOString().split("T")[0];

    if (editingMateriId) {
      setMateriList(prev => prev.map(m => m.id === editingMateriId ? {
        ...m,
        ...materiForm,
        judul: materiForm.judul || m.judul,
        pembuat: m.pembuat || guruName
      } as MateriItem : m));
      logVersion(editingMateriId, `Materi (${materiForm.judul})`, `Memperbarui materi belajar format ${materiForm.tipeFormat}`);
    } else {
      const newId = `mat-${Date.now()}`;
      const newItem: MateriItem = {
        id: newId,
        judul: materiForm.judul || "Materi Baru",
        kelas: (materiForm.kelas as any) || "X",
        elemen: materiForm.elemen || "AP",
        bab: materiForm.bab || "Bab General",
        deskripsi: materiForm.deskripsi || "",
        tipeFormat: (materiForm.tipeFormat as any) || "dokumen",
        fileName: materiForm.fileName || (materiForm.tipeFormat === "tautan" ? undefined : "Berkas_Materi.pdf"),
        fileSize: materiForm.fileSize || (materiForm.tipeFormat === "tautan" ? undefined : "1.5 MB"),
        fileUrl: materiForm.fileUrl || "#",
        embedUrl: materiForm.embedUrl || "",
        tanggalDibuat: dateStr,
        pembuat: guruName,
        status: (materiForm.status as any) || "Publik",
        tags: materiForm.tags || []
      };
      setMateriList(prev => [newItem, ...prev]);
      logVersion(newId, `Materi (${newItem.judul})`, `Menambahkan materi belajar baru format ${newItem.tipeFormat}`);
    }

    setIsMateriModalOpen(false);
  };

  const handleDeleteMateri = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus materi "${judul}"?`)) {
      setMateriList(prev => prev.filter(m => m.id !== id));
      logVersion(id, `Materi (${judul})`, `Menghapus materi belajar siswa`);
      if (previewMateri?.id === id) {
        setPreviewMateri(null);
      }
    }
  };

  const handleMateriFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const objectUrl = URL.createObjectURL(file);
      setMateriForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeMB,
        fileUrl: objectUrl
      }));
    }
  };

  const getFormatBadge = (type: string) => {
    switch (type) {
      case "dokumen":
        return { label: "Dokumen (PDF/Word)", icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "spreadsheet":
        return { label: "Spreadsheet (Excel)", icon: FileSpreadsheet, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "presentasi":
        return { label: "Presentasi (PPT/Slides)", icon: Presentation, color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "animasi":
        return { label: "Animasi / Simulasi", icon: Sparkles, color: "bg-purple-50 text-purple-700 border-purple-200" };
      case "video":
        return { label: "Video Pembelajaran", icon: Video, color: "bg-rose-50 text-rose-700 border-rose-200" };
      case "audio":
        return { label: "Audio / Podcast", icon: Music, color: "bg-cyan-50 text-cyan-700 border-cyan-200" };
      case "tautan":
        return { label: "Tautan Web / IDE", icon: Link2, color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      default:
        return { label: "Dokumen", icon: File, color: "bg-slate-50 text-slate-700 border-slate-200" };
    }
  };

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

  // Modul Ajar CRUD & File Upload Handlers
  const handleOpenAddModul = () => {
    setEditingModulId(null);
    setModForm({
      judul: "",
      elemen: "AP",
      kelas: "XII",
      pertemuan: "Pertemuan 1",
      metode: "Pembelajaran Mendalam (Deep Learning)",
      alokasi: "3 JP x 45 menit",
      tanggalPertemuan: new Date().toISOString().split("T")[0],
      isi: getBakuModulAjarTemplate("Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)", "AP", "XII", "F"),
      lampiran: []
    });
    setIsModulModalOpen(true);
  };

  const handleOpenEditModul = (mod: any) => {
    const guruName = user?.nama || user?.name || "Yogi Suprayogi, S.Kom.";
    setEditingModulId(mod.id);

    // Set indicator sedangDieditBy when opened for editing
    setModulList((prev: any[]) => prev.map(m => m.id === mod.id ? {
      ...m,
      sedangDieditBy: {
        nama: guruName,
        role: "Guru MGMP Informatika",
        waktu: "Sedang Aktif Mengedit"
      }
    } : m));

    setModForm({
      judul: mod.judul || "",
      elemen: mod.elemen || "AP",
      kelas: mod.kelas || "XII",
      pertemuan: mod.pertemuan || "Pertemuan 1",
      metode: mod.metode || "Pembelajaran Mendalam (Deep Learning)",
      alokasi: mod.alokasi || "3 JP x 45 menit",
      tanggalPertemuan: mod.tanggalPertemuan || "",
      isi: mod.isi || "",
      lampiran: mod.lampiran || []
    });
    setIsModulModalOpen(true);
  };

  const handleToggleEditLock = (modulId: string) => {
    const guruName = user?.nama || user?.name || "Yogi Suprayogi, S.Kom.";
    setModulList((prev: any[]) => prev.map(m => {
      if (m.id !== modulId) return m;
      if (m.sedangDieditBy) {
        logVersion(modulId, `Modul Ajar (${m.judul})`, "Melepas indikator sedang mengedit");
        return { ...m, sedangDieditBy: null };
      } else {
        logVersion(modulId, `Modul Ajar (${m.judul})`, `Menandai sedang disesuaikan oleh ${guruName}`);
        return {
          ...m,
          sedangDieditBy: {
            nama: guruName,
            role: "Guru MGMP Informatika",
            waktu: "Sedang Aktif (Baru Saja)"
          }
        };
      }
    }));
  };

  const handleSaveModul = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!modForm.judul.trim() || !modForm.isi.trim()) {
      alert("Judul Modul dan Isi Modul wajib diisi!");
      return;
    }

    const guruName = user?.nama || user?.name || "Yogi Suprayogi, S.Kom.";
    const dateStr = new Date().toISOString().split("T")[0];

    if (editingModulId) {
      setModulList((prev: any[]) => prev.map(m => m.id === editingModulId ? {
        ...m,
        ...modForm,
        sedangDieditBy: null, // Released after saving changes
        penulis: m.penulis || guruName
      } : m));
      logVersion(editingModulId, `Modul Ajar (${modForm.judul})`, "Memperbarui isi dan berkas dokumen modul ajar");
    } else {
      const newId = `mod-${Date.now()}`;
      const newItem = {
        id: newId,
        ...modForm,
        penulis: guruName,
        tanggalDibuat: dateStr,
        sedangDieditBy: null
      };
      setModulList((prev: any[]) => [newItem, ...prev]);
      logVersion(newId, `Modul Ajar (${newItem.judul})`, "Menambahkan modul ajar Kurikulum Merdeka baru");
    }

    setIsModulModalOpen(false);
  };

  const handleDeleteModul = (id: string, judul: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Modul Ajar "${judul}"?`)) {
      setModulList((prev: any[]) => prev.filter(m => m.id !== id));
      logVersion(id, `Modul Ajar (${judul})`, "Menghapus modul ajar");
      if (previewModulItem?.id === id) {
        setPreviewModulItem(null);
      }
    }
  };

  const handleDuplicateModul = (mod: any) => {
    const newId = `mod-${Date.now()}`;
    const duplicatedItem = {
      ...mod,
      id: newId,
      judul: `${mod.judul} (Salinan)`,
      tanggalDibuat: new Date().toISOString().split("T")[0]
    };
    setModulList((prev: any[]) => [duplicatedItem, ...prev]);
    logVersion(newId, `Modul Ajar (${duplicatedItem.judul})`, "Menduplikasi modul ajar");
  };

  const handleModulFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const newAttachments = fileList.map((file: File, idx: number) => {
      const sizeMB = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";
      return {
        id: `att-${Date.now()}-${idx}`,
        nama: file.name,
        ukuran: sizeMB,
        tipe: ext,
        url: URL.createObjectURL(file)
      };
    });

    setModForm(prev => ({
      ...prev,
      lampiran: [...(prev.lampiran || []), ...newAttachments]
    }));
  };

  const handleRemoveModulLampiran = (fileId: string) => {
    setModForm(prev => ({
      ...prev,
      lampiran: (prev.lampiran || []).filter(f => f.id !== fileId)
    }));
  };

  const handleDirectUploadToModulCard = (modulId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const newAttachments = fileList.map((file: File, idx: number) => {
      const sizeMB = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";
      return {
        id: `att-${Date.now()}-${idx}`,
        nama: file.name,
        ukuran: sizeMB,
        tipe: ext,
        url: URL.createObjectURL(file)
      };
    });

    setModulList((prev: any[]) => prev.map(m => {
      if (m.id !== modulId) return m;
      return {
        ...m,
        lampiran: [...(m.lampiran || []), ...newAttachments]
      };
    }));

    logVersion(modulId, "Lampiran Modul", "Mengunggah lampiran berkas dokumen modul baru");
  };

  const handleRemoveLampiranFromCard = (modulId: string, fileId: string) => {
    setModulList((prev: any[]) => prev.map(m => {
      if (m.id !== modulId) return m;
      return {
        ...m,
        lampiran: (m.lampiran || []).filter((f: any) => f.id !== fileId)
      };
    }));
  };

  const filteredModulList = modulList.filter((m: any) => {
    const query = modulSearch.toLowerCase().trim();
    const matchSearch = !query || 
      (m.judul || "").toLowerCase().includes(query) ||
      (m.isi || "").toLowerCase().includes(query) ||
      (m.elemen || "").toLowerCase().includes(query) ||
      (m.metode || "").toLowerCase().includes(query) ||
      (m.sedangDieditBy?.nama || "").toLowerCase().includes(query);
    
    const matchKelas = modulFilterKelas === "Semua" || m.kelas === modulFilterKelas;
    const matchElemen = modulFilterElemen === "Semua" || m.elemen === modulFilterElemen;
    const matchStatus = modulFilterStatus === "Semua" ||
      (modulFilterStatus === "Sedang Diedit" && !!m.sedangDieditBy) ||
      (modulFilterStatus === "Siap" && !m.sedangDieditBy);

    return matchSearch && matchKelas && matchElemen && matchStatus;
  });

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
    return getBakuModulAjarTemplate(topic || "Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)");
  };

  // Helper to generate formatted document HTML with Kop Surat, Metadata, Content, and Signatures
  const getExportDocumentHtml = (tabId: string, customItem?: any) => {
    const guruName = customItem?.penulis || user?.nama || user?.name || schoolTemplate.namaGuru || "Yogi Suprayogi, S.Kom.";
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let title = "DOKUMEN KURIKULUM MERDEKA";
    let bodyHtml = "";

    const kopHtml = `
      <div style="text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 20px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0; font-size: 11pt; font-weight: bold; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">${schoolTemplate.provinsiDinas}</h3>
        <h2 style="margin: 3px 0; font-size: 16pt; font-weight: bold; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">${schoolTemplate.namaSekolah}</h2>
        <p style="margin: 0; font-size: 9pt; color: #475569; font-style: italic;">
          ${schoolTemplate.alamatSekolah} • ${schoolTemplate.teleponEmail}
        </p>
      </div>
    `;

    const metaHtml = `
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 9.5pt;">
        <table style="width: 100%; border-collapse: collapse; border: none;">
          <tr>
            <td style="width: 20%; font-weight: bold; color: #334155; padding: 3px 0; border:none;">Mata Pelajaran</td>
            <td style="width: 30%; color: #0f172a; padding: 3px 0; border:none;">: Informatika</td>
            <td style="width: 20%; font-weight: bold; color: #334155; padding: 3px 0; border:none;">Tahun Pelajaran</td>
            <td style="width: 30%; color: #0f172a; padding: 3px 0; border:none;">: ${schoolTemplate.tahunPelajaran}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #334155; padding: 3px 0; border:none;">Guru Pengampu</td>
            <td style="color: #0f172a; padding: 3px 0; border:none;">: ${guruName}</td>
            <td style="font-weight: bold; color: #334155; padding: 3px 0; border:none;">Tanggal Disesuaikan</td>
            <td style="color: #0f172a; padding: 3px 0; border:none;">: ${dateStr}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #334155; padding: 3px 0; border:none;">Fase / Kelas</td>
            <td style="color: #0f172a; padding: 3px 0; border:none;">: Fase E & F (Kelas X - XII)</td>
            <td style="font-weight: bold; color: #334155; padding: 3px 0; border:none;">Status Validasi</td>
            <td style="color: #059669; font-weight: bold; padding: 3px 0; border:none;">: TERVERIFIKASI KURIKULUM MERDEKA</td>
          </tr>
        </table>
      </div>
    `;

    const signatureHtml = `
      <div style="margin-top: 40px; font-family: Arial, sans-serif; font-size: 10pt; page-break-inside: avoid;">
        <div style="text-align: right; margin-bottom: 12px; color: #334155; font-size: 9.5pt;">
          ${schoolTemplate.kotaKabupaten}, ${dateStr}
        </div>
        <table style="width: 100%; border: none;">
          <tr>
            <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
              <p style="margin-bottom: 60px; color: #334155;">Mengetahui,<br><strong>Kepala ${schoolTemplate.namaSekolah}</strong></p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline; color: #0f172a;">${schoolTemplate.namaKepalaSekolah}</p>
              <p style="margin: 2px 0 0 0; font-size: 8.5pt; color: #64748b;">NIP. ${schoolTemplate.nipKepalaSekolah}</p>
            </td>
            <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0;">
              <p style="margin-bottom: 60px; color: #334155;">Disusun Oleh,<br><strong>Guru Mata Pelajaran Informatika</strong></p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline; color: #0f172a;">${guruName}</p>
              <p style="margin: 2px 0 0 0; font-size: 8.5pt; color: #64748b;">NIP. ${schoolTemplate.nipGuru}</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    if (tabId === "cp") {
      title = customItem ? `CAPAIAN PEMBELAJARAN ELEMEN ${customItem.elemen}` : "DOKUMEN CAPAIAN PEMBELAJARAN (CP) INFORMATIKA";
      const itemsToExport = customItem ? [customItem] : cpList;
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 12%;">Kelas / Fase</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 25%;">Elemen & Nama Elemen</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Deskripsi Capaian Pembelajaran (CP)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsToExport.map((cp, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">Kelas ${cp.kelas}<br>(Fase ${cp.fase})</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>[${cp.elemen}]</strong><br>${cp.namaElemen}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; line-height: 1.5;">${cp.deskripsi}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "atp") {
      title = customItem ? `ALUR TUJUAN PEMBELAJARAN - ${customItem.kode}` : "DOKUMEN ALUR TUJUAN PEMBELAJARAN (ATP) INFORMATIKA";
      const itemsToExport = customItem ? [customItem] : atpList;
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 10%;">Kode</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 10%;">Elemen</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Tujuan Pembelajaran</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 8%;">JP</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 22%;">Profil Pelajar Pancasila</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 15%;">Asesmen</th>
            </tr>
          </thead>
          <tbody>
            ${itemsToExport.map((item, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${item.kode}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${item.elemen}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${item.tujuan}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${item.jp}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${item.profil}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${item.asesmen}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "modul") {
      title = customItem ? `MODUL AJAR: ${customItem.judul}` : "DOKUMEN PERANGKAT MODUL AJAR (KURIKULUM MERDEKA)";
      const itemsToExport = customItem ? [customItem] : modulList;
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 13pt; text-transform: uppercase; color: #0f172a;">${title}</h3>
        ${itemsToExport.map((m: any, i: number) => {
          const kelas = m.kelas || "XII";
          const fase = (kelas === "X" || kelas === "10") ? "Fase E" : "Fase F";
          const elemenCode = m.elemen || "AP";
          const elemenObj = ELEMEN_INFORMATIKA.find(e => e.kode === elemenCode);
          const namaElemen = elemenObj ? `${elemenCode} - ${elemenObj.nama}` : elemenCode;
          const alokasi = m.alokasi || m.durasi || "3 JP x 45 menit";
          const metode = m.metode || m.model || "Pembelajaran Mendalam (Deep Learning) - Mindful, Meaningful, Joyful";
          const pertemuan = m.pertemuan || "Pertemuan 1";
          const tglPertemuan = m.tanggalPertemuan || new Date().toISOString().split("T")[0];
          const penyusun = m.penulis || guruName;

          return `
            <div style="border: 1px solid #cbd5e1; padding: 18px; margin-bottom: 24px; border-radius: 8px; font-family: Arial, sans-serif; font-size: 9.5pt; background-color: #ffffff;">
              <!-- Header Badges -->
              <div style="background-color: #1e40af; color: #ffffff; padding: 8px 14px; font-weight: bold; border-radius: 6px; font-size: 11pt; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
                <span>MODUL AJAR ${i + 1}: ${m.judul.toUpperCase()}</span>
                <span style="font-size: 9.5pt; background-color: #3b82f6; padding: 2px 8px; border-radius: 4px;">KELAS ${kelas} (${fase})</span>
              </div>

              <!-- Metadata Table -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                <table style="width: 100%; border-collapse: collapse; border: none; font-size: 9.5pt;">
                  <tr>
                    <td style="width: 22%; font-weight: bold; color: #334155; padding: 4px 0; border:none;">Judul Modul Ajar</td>
                    <td style="width: 78%; font-weight: bold; color: #0f172a; padding: 4px 0; border:none;" colspan="3">: ${m.judul}</td>
                  </tr>
                  <tr>
                    <td style="width: 22%; font-weight: bold; color: #334155; padding: 4px 0; border:none;">Satuan Pendidikan</td>
                    <td style="width: 28%; color: #0f172a; padding: 4px 0; border:none;">: ${schoolTemplate.namaSekolah}</td>
                    <td style="width: 22%; font-weight: bold; color: #334155; padding: 4px 0; border:none;">Mata Pelajaran</td>
                    <td style="width: 28%; color: #0f172a; padding: 4px 0; border:none;">: Informatika</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Fase / Kelas</td>
                    <td style="color: #0f172a; font-weight: bold; padding: 4px 0; border:none;">: ${fase} / Kelas ${kelas}</td>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Elemen CP</td>
                    <td style="color: #1d4ed8; font-weight: bold; padding: 4px 0; border:none;">: ${namaElemen}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Alokasi Waktu</td>
                    <td style="color: #0f172a; padding: 4px 0; border:none;">: ${alokasi}</td>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Pendekatan Belajar</td>
                    <td style="color: #0f172a; padding: 4px 0; border:none;">: ${metode}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Jadwal / Sesi</td>
                    <td style="color: #0f172a; padding: 4px 0; border:none;">: ${pertemuan} (${tglPertemuan})</td>
                    <td style="font-weight: bold; color: #334155; padding: 4px 0; border:none;">Guru Penyusun</td>
                    <td style="color: #0f172a; font-weight: bold; padding: 4px 0; border:none;">: ${penyusun}</td>
                  </tr>
                </table>
              </div>

              <!-- Main Content Body -->
              <div style="line-height: 1.6; color: #0f172a; font-size: 9.5pt;">
                ${m.isi || getBakuModulAjarTemplate(m.judul, alokasi, schoolTemplate.namaSekolah, "Informatika", `${fase} / Kelas ${kelas}`, namaElemen)}
              </div>

              <!-- Lampiran List if any -->
              ${m.lampiran && m.lampiran.length > 0 ? `
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #cbd5e1; background-color: #f1f5f9; padding: 10px; border-radius: 6px;">
                  <strong style="color: #1e293b; font-size: 9.5pt;">📎 BERKAS LAMPIRAN DOKUMEN MODUL (${m.lampiran.length} Berkas):</strong>
                  <ul style="margin: 6px 0 0 18px; padding: 0; color: #334155; font-size: 9pt;">
                    ${m.lampiran.map((f: any) => `<li><strong>${f.nama}</strong> (${f.tipe} - ${f.ukuran})</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      `;
    } else if (tabId === "deep_learning") {
      title = "DESAIN PEMBELAJARAN MENDALAM (DEEP LEARNING) INFORMATIKA";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-family: Arial; font-size: 9.5pt;">
          <strong>PROMPT KERANGKA SINTESIS AI:</strong><br>
          <em>"${deepPrompt || 'Desain Pembelajaran Mendalam Informatika'}"</em>
        </div>
        <div style="font-family: Arial; font-size: 10pt; line-height: 1.6; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; white-space: pre-wrap;">
          ${aiResponse || "Belum ada respon AI yang dihasilkan."}
        </div>
      `;
    } else if (tabId === "kktp") {
      title = customItem ? `RUBRIK KKTP: ${customItem.tp}` : "DOKUMEN KRITERIA KETUNTASAN TUJUAN PEMBELAJARAN (KKTP) & RUBRIK";
      const itemsToExport = customItem ? [customItem] : kktpList;
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 8.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; width: 4%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 22%;">Tujuan Pembelajaran</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 18%;">Kriteria Ketuntasan</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 14%;">Perlu Bimbingan (0-60)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 14%;">Cukup (61-75)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 14%;">Baik (76-88)</th>
              <th style="border: 1px solid #cbd5e1; padding: 6px; text-align: left; width: 14%;">Sangat Baik (89-100)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsToExport.map((k, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${k.tp}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px;">${k.kriteria}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #fef2f2;">${k.perluBimbingan || '-'}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #fffbebf;">${k.cukup || '-'}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #f0fdf4;">${k.baik || '-'}</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px; background-color: #eff6ff;">${k.sangatBaik || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "prota") {
      title = "DOKUMEN PROGRAM TAHUNAN (PROTA) INFORMATIKA";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        
        <div style="background-color: #ecfeff; border: 1px solid #a5f3fc; padding: 10px; border-radius: 6px; margin-bottom: 16px; font-family: Arial; font-size: 9pt;">
          <strong>REKAPITULASI MINGGU EFEKTIF:</strong><br>
          • Semester 1 (Ganjil): ${smt1Efektif} Minggu Efektif x ${mingguEfektifConfig?.ganjil?.jpPerMinggu || 3} JP = <strong>${smt1TotalJp} JP Total Efektif</strong> (Dialokasikan: ${protaSmt1AllocatedJp} JP)<br>
          • Semester 2 (Genap): ${smt2Efektif} Minggu Efektif x ${mingguEfektifConfig?.genap?.jpPerMinggu || 3} JP = <strong>${smt2TotalJp} JP Total Efektif</strong> (Dialokasikan: ${protaSmt2AllocatedJp} JP)
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 15%;">Semester</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Materi Pokok / Elemen</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 12%;">Alokasi Waktu</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 18%;">Distribusi Minggu</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 20%;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${protaList.map((p, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${p.semester}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${p.materi}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${p.jp}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${p.minggu}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${p.keterangan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "promes") {
      title = "DOKUMEN PROGRAM SEMESTER (PROMES) INFORMATIKA";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 8pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;" rowspan="2">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;" rowspan="2">Smt</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px; text-align: left;" rowspan="2">Materi Pokok / Elemen</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;" rowspan="2">JP</th>
              <th style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;" colspan="20">Bulan & Minggu Efektif Semester (M1 - M20)</th>
            </tr>
            <tr style="background-color: #f8fafc;">
              ${Array.from({ length: 20 }, (_, w) => `<th style="border: 1px solid #cbd5e1; padding: 3px; text-align: center;">M${w + 1}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${promesList.map((p, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${p.semester.includes('1') ? 'I' : 'II'}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${p.materi}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-weight: bold;">${p.jp}</td>
                ${(p.weeks || Array(20).fill(false)).map((w: boolean) => `
                  <td style="border: 1px solid #cbd5e1; padding: 3px; text-align: center; background-color: ${w ? '#0d9488' : '#ffffff'}; color: ${w ? '#ffffff' : '#cbd5e1'}; font-weight: bold;">
                    ${w ? '✓' : ''}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "materi") {
      title = customItem ? `MATERI PEMBELAJARAN: ${customItem.judul}` : "DOKUMEN DAFTAR MATERI & BAHAN AJAR SISWA";
      const itemsToExport = customItem ? [customItem] : materiList;
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 4%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 8%;">Kelas</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 8%;">Elemen</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 22%;">Judul Materi</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 14%;">Format Media</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 18%;">Bab / Pokok Bahasan</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Deskripsi & File Info</th>
            </tr>
          </thead>
          <tbody>
            ${itemsToExport.map((m, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">Kelas ${m.kelas}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">[${m.elemen}]</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${m.judul}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; text-transform: uppercase; font-weight: bold; color: #2563eb;">${m.tipeFormat}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${m.bab}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                  <div>${m.deskripsi}</div>
                  ${m.fileName ? `<div style="font-size: 8.5pt; color: #64748b; margin-top: 4px;">📎 Berkas: ${m.fileName} (${m.fileSize || 'N/A'})</div>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "buku") {
      title = "DOKUMEN KATALOG BUKU DIGITAL & REFERENSI AJAR";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 35%;">Judul Buku Digital</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 15%;">Penerbit & Tahun</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Daftar Bab / Topik Utama</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_BUKU.map((b, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${b.judul}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Kemendikbudristek (${b.tahun})</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                  <ul style="margin: 0; padding-left: 18px;">
                    ${b.bab.map(ch => `<li>${ch}</li>`).join('')}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "repository") {
      title = "DOKUMEN REPOSITORI BERKAS ADMINISTRASI GURU";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Nama File Berkas</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 12%;">Tipe</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 12%;">Ukuran</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 15%;">Tanggal Unggah</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 20%;">Pengunggah</th>
            </tr>
          </thead>
          <tbody>
            ${repoFiles.map((f, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${f.nama}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${f.tipe}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${f.ukuran}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${f.tanggal}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${f.pengunggah}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (tabId === "versioning") {
      title = "DOKUMEN RIWAYAT AUDIT LOG & KONTROL VERSI KURIKULUM";
      bodyHtml = `
        <h3 style="text-align: center; margin-bottom: 16px; font-family: Arial; font-size: 12pt; text-transform: uppercase;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: Arial; font-size: 9.5pt;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 5%;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 10%;">Versi</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 25%;">Nama Dokumen</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 15%;">Tanggal</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 18%;">Pengubah / Editor</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Catatan Perubahan</th>
            </tr>
          </thead>
          <tbody>
            ${versions.map((v, i) => `
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-weight: bold;">${v.versi}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${v.docTitle}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${v.tanggal}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${v.pembuat}</td>
                <td style="border: 1px solid #cbd5e1; padding: 8px;">${v.keterangan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    return `
      ${kopHtml}
      ${metaHtml}
      ${bodyHtml}
      ${signatureHtml}
    `;
  };

  const handleDownloadDocument = (tabId: string, format: 'doc' | 'print', customItem?: any) => {
    const tabInfo = tabs.find(t => t.id === tabId);
    const label = tabInfo ? tabInfo.label.replace(/[^a-zA-Z0-9_]/g, '_') : tabId;
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `Dokumen_${label}_${user?.nama?.replace(/\s+/g, '_') || user?.name?.replace(/\s+/g, '_') || 'Guru'}_${dateStr}`;

    if (tabId === "modul" && customItem) {
      const cleanTitle = (customItem.judul || "Modul_Ajar").replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
      filename = `Modul_Ajar_${cleanTitle}_Kelas_${customItem.kelas || 'XII'}_${dateStr}`;
    }

    const htmlContent = getExportDocumentHtml(tabId, customItem);

    if (format === 'doc') {
      const header = `xmlns:v="urn:schemas-microsoft-com:vml"\nxmlns:o="urn:schemas-microsoft-com:office:office"\nxmlns:w="urn:schemas-microsoft-com:office:word"\nxmlns="http://www.w3.org/TR/REC-html40"`;
      const html = `<html ${header}><head><meta charset="utf-8"><title>${filename}</title>
<style>
  @page WordSection1 { size:210mm 297mm; margin:20mm 20mm 20mm 20mm; }
  div.WordSection1 { page:WordSection1; }
  body { font-family: 'Arial', 'Calibri', sans-serif; font-size: 10.5pt; color: #0f172a; line-height: 1.5; padding: 10px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left; font-size: 9.5pt; }
  th { background-color: #f1f5f9; font-weight: bold; }
  h1, h2, h3, h4 { color: #0f172a; }
</style>
</head><body><div class="WordSection1">${htmlContent}</div></body></html>`;

      const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const printWindow = window.open('', '_blank', 'width=950,height=800');
      if (!printWindow) {
        alert("Mohon izinkan pop-up browser untuk mencetak atau menyimpan PDF.");
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <style>
              @page { size: A4; margin: 12mm; }
              body { font-family: Arial, sans-serif; font-size: 10pt; color: #0f172a; line-height: 1.5; margin: 0; padding: 15px; }
              table { border-collapse: collapse; width: 100%; margin: 12px 0; }
              th, td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; font-size: 9.5pt; }
              th { background-color: #f1f5f9; font-weight: bold; }
              @media print {
                body { padding: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const SubmenuDownloadHeaderButton = ({ tabId, title }: { tabId: string; title: string }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative inline-block text-left shrink-0">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer select-none"
          title={`Download Dokumen ${title}`}
        >
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Download Dokumen</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {open && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white border border-slate-200 z-50 overflow-hidden animate-fade-in"
            onMouseLeave={() => setOpen(false)}
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Opsi Export Dokumen</span>
              <span className="text-xs font-bold text-slate-800 block truncate">{title}</span>
            </div>
            <div className="p-1.5 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleDownloadDocument(tabId, 'doc');
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold block">Download Word (.doc)</span>
                  <span className="text-[10px] text-slate-400 block">Format Microsoft Word / Docs</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleDownloadDocument(tabId, 'print');
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Cetak / Simpan PDF</span>
                  <span className="text-[10px] text-slate-400 block">Buka Tampilan Print & PDF</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded">CP Kurikulum</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Daftar Capaian Pembelajaran (CP) Informatika SMA</h2>
                <p className="text-slate-500 text-xs">Capaian Pembelajaran (Fase E & Fase F) yang ditetapkan resmi oleh Kemendikbudristek untuk bidang Informatika.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SubmenuDownloadHeaderButton tabId="cp" title="Capaian Pembelajaran (CP)" />
                {(user.role === "GURU" || user.role === "ADMIN") && !isAddingCp && !isEditingCpId && (
                  <button
                    onClick={handleAddCpClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah CP Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* CP GRID & FORM CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CP Form (only visible during active edit or add for Guru/Admin) */}
              {(isAddingCp || isEditingCpId) && (user.role === "GURU" || user.role === "ADMIN") && (
                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h3 className="font-display font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                      {isAddingCp ? "Tambah CP Baru" : "Edit CP"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCp(false);
                        setIsEditingCpId(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveCp} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Kelas</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: X, XI, XII"
                          value={cpForm.kelas}
                          onChange={(e) => setCpForm({...cpForm, kelas: e.target.value})}
                          className="w-full text-xs border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Fase</label>
                        <select
                          value={cpForm.fase}
                          onChange={(e) => setCpForm({...cpForm, fase: e.target.value})}
                          className="w-full text-xs border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                        >
                          <option value="E">Fase E</option>
                          <option value="F">Fase F</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Elemen</label>
                      <select
                        value={cpForm.elemen}
                        onChange={(e) => handleElemenChange(e.target.value)}
                        className="w-full text-xs border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
                      >
                        {ELEMEN_INFORMATIKA.map((el) => (
                          <option key={el.kode} value={el.kode}>
                            {el.kode} ({el.nama})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Nama Elemen</label>
                      <input
                        type="text"
                        required
                        placeholder="Misal: Berpikir Komputasional"
                        value={cpForm.namaElemen}
                        onChange={(e) => setCpForm({...cpForm, namaElemen: e.target.value})}
                        className="w-full text-xs border border-slate-200 dark:border-slate-700 p-2 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Isi Capaian Pembelajaran (CP)</label>
                      <WysiwygEditor
                        id="lms-cp-deskripsi-editor"
                        value={cpForm.deskripsi}
                        onChange={(val) => setCpForm({...cpForm, deskripsi: val})}
                        placeholder="Tuliskan deskripsi lengkap Capaian Pembelajaran..."
                        heightClass="min-h-[160px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded shadow transition flex items-center justify-center gap-1.5"
                      >
                        <span>{isAddingCp ? "Tambah CP" : "Simpan CP"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCp(false);
                          setIsEditingCpId(null);
                        }}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-bold transition"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CP Cards List */}
              <div className={`${isAddingCp || isEditingCpId ? "lg:col-span-8" : "lg:col-span-12"} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                {cpList.map((cp) => (
                  <div
                    key={cp.id}
                    className={`bg-slate-50/50 dark:bg-slate-900/30 border rounded-xl p-5 hover:border-rose-200 dark:hover:border-rose-900/40 transition space-y-3 flex flex-col justify-between ${
                      isEditingCpId === cp.id
                        ? "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-600 dark:ring-rose-600/30"
                        : "border-slate-200/80 dark:border-slate-800/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 font-mono font-bold px-2 py-0.5 rounded uppercase">
                          Kelas {cp.kelas} (Fase {cp.fase})
                        </span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{cp.elemen}</span>
                      </div>
                      <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">{cp.namaElemen}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded border border-slate-100 dark:border-slate-800">
                        "{cp.deskripsi}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100/60 dark:border-slate-800/40 flex justify-between items-center">
                      <button
                        onClick={() => {
                          setDeepPrompt(`Rancang RPP dari Capaian Pembelajaran Elemen ${cp.elemen} (${cp.namaElemen}): ${cp.deskripsi}`);
                          setActiveTab("deep_learning");
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                      >
                        <span>Gunakan Sebagai Draf AI</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>

                      {(user.role === "GURU" || user.role === "ADMIN") && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEditCpClick(cp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                            title="Edit Capaian"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCp(cp.id, cp.namaElemen)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Hapus Capaian"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {cpList.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-slate-400 text-xs">Belum ada Capaian Pembelajaran yang ditambahkan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 2: ALUR TUJUAN PEMBELAJARAN (ATP) */}
        {/* ======================================= */}
        {activeTab === "atp" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">ATP Sequence</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Alur Tujuan Pembelajaran (ATP)</h2>
                <p className="text-slate-500 text-xs">Urutan logis capaian kompetensi per elemen yang disusun sistematis menuju penguasaan akhir.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="atp" title="Alur Tujuan Pembelajaran (ATP)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input ATP */}
              {(user?.role === "GURU" || user?.role === "ADMIN") && (
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
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Rumusan Tujuan Pembelajaran</label>
                      <WysiwygEditor
                        id="lms-atp-tujuan-editor"
                        value={atpForm.tujuan}
                        onChange={(val) => setAtpForm({...atpForm, tujuan: val})}
                        placeholder="Rumuskan tujuan pembelajaran..."
                        heightClass="min-h-[140px]"
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
              )}

              {/* Timeline ATP */}
              <div className={user?.role === "SISWA" ? "lg:col-span-12 space-y-3" : "lg:col-span-8 space-y-3"}>
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
                        {(user?.role === "GURU" || user?.role === "ADMIN") && (
                          <button
                            onClick={() => {
                              setAtpList(atpList.filter(a => a.id !== item.id));
                              logVersion("atp-list", "ATP (Alur Tujuan Pembelajaran)", `Menghapus item ${item.kode}`);
                            }}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
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
          <div className="p-6 space-y-6 text-left">
            {/* Header Title */}
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Modul Ajar</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Penyusunan Modul Ajar (RPP Kurikulum Merdeka)</h2>
                <p className="text-slate-500 text-xs">Kelola, sunting, unggah berkas lampiran, dan cetak modul ajar pembelajaran interaktif secara bebas.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddModul}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Tambah Modul Ajar Baru</span>
                </button>
                <SubmenuDownloadHeaderButton tabId="modul" title="Modul Ajar (RPP)" />
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul modul, materi, elemen..."
                  value={modulSearch}
                  onChange={(e) => setModulSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {modulSearch && (
                  <button
                    onClick={() => setModulSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={modulFilterKelas}
                  onChange={(e) => setModulFilterKelas(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white font-medium text-slate-700"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="X">Kelas X (Fase E)</option>
                  <option value="XI">Kelas XI (Fase F)</option>
                  <option value="XII">Kelas XII (Fase F)</option>
                </select>

                <select
                  value={modulFilterElemen}
                  onChange={(e) => setModulFilterElemen(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white font-bold text-slate-700"
                >
                  <option value="Semua">Semua Elemen</option>
                  {ELEMEN_INFORMATIKA.map(el => (
                    <option key={el.kode} value={el.kode}>{el.kode} - {el.nama}</option>
                  ))}
                </select>

                <select
                  value={modulFilterStatus}
                  onChange={(e) => setModulFilterStatus(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white font-bold text-slate-700"
                >
                  <option value="Semua">Semua Status Edit</option>
                  <option value="Sedang Diedit">🟡 Sedang Diedit Guru</option>
                  <option value="Siap">🟢 Bebas / Siap</option>
                </select>

                <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-white border border-slate-200 rounded-lg">
                  Total: <strong className="text-blue-600">{filteredModulList.length}</strong> Modul
                </div>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-blue-900">Draf Baku Kurikulum Merdeka (Deep Learning)</h4>
                  <p className="text-[11px] text-blue-700">Muat template resmi sesuai regulasi terbaru untuk disunting atau disesuaikan.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingModulId(null);
                    setModForm({
                      judul: "Modul Ajar Informatika - Deep Learning: Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)",
                      elemen: "AP",
                      kelas: "XII",
                      pertemuan: "Pertemuan 1",
                      metode: "Pembelajaran Mendalam (Deep Learning)",
                      alokasi: "3 JP x 45 menit",
                      tanggalPertemuan: new Date().toISOString().split("T")[0],
                      isi: getBakuModulAjarTemplate("Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)", "AP", "XII", "F"),
                      lampiran: []
                    });
                    setIsModulModalOpen(true);
                  }}
                  className="text-xs font-bold bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📋 Sample 1: Program Modular</span>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingModulId(null);
                    setModForm({
                      judul: "Modul Ajar Informatika - Deep Learning: Pengolahan dan Analisis Data Bervolume Besar untuk Pengambilan Keputusan",
                      elemen: "AD",
                      kelas: "XII",
                      pertemuan: "Pertemuan 2",
                      metode: "Pembelajaran Mendalam (Deep Learning)",
                      alokasi: "3 JP x 45 menit",
                      tanggalPertemuan: new Date().toISOString().split("T")[0],
                      isi: getBakuModulAjarDataAnalisisTemplate(),
                      lampiran: []
                    });
                    setIsModulModalOpen(true);
                  }}
                  className="text-xs font-bold bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📊 Sample 2: Analisis Data</span>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Modul List Cards Grid */}
            {filteredModulList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredModulList.map((mod: any) => (
                  <div
                    key={mod.id}
                    className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 relative hover:border-blue-300 transition flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Live Status Indikator: Sedang Mengedit / Disesuaikan */}
                      {mod.sedangDieditBy ? (
                        <div className="bg-amber-50/95 border border-amber-300 text-amber-900 rounded-xl p-2.5 px-3 flex items-center justify-between gap-2 shadow-xs">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                            <div className="truncate">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[11px] text-amber-900 leading-tight">Sedang Mengedit</span>
                                <span className="bg-amber-200 text-amber-900 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase">LIVE</span>
                              </div>
                              <span className="text-[10px] text-amber-800 truncate block">
                                Oleh: <strong>{mod.sedangDieditBy.nama}</strong> ({mod.sedangDieditBy.waktu})
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEditLock(mod.id);
                            }}
                            className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-2 py-1 rounded-lg transition shrink-0 cursor-pointer shadow-2xs"
                            title="Klik untuk melepas status 'Sedang Mengedit'"
                          >
                            Selesai Edit
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-100 pb-1.5">
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            <span>Penulis: <strong>{mod.penulis || "Guru Informatika"}</strong></span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEditLock(mod.id);
                            }}
                            className="hover:text-amber-700 hover:bg-amber-50 px-2 py-0.5 rounded-md transition flex items-center gap-1 font-bold text-slate-400 hover:border hover:border-amber-200 cursor-pointer"
                            title="Tandai bahwa Anda sedang mengedit/menyesuaikan dokumen modul ini agar diketahui rekan guru lain"
                          >
                            <Pencil className="h-3 w-3 text-amber-500" />
                            <span>Tandai Sedang Mengedit</span>
                          </button>
                        </div>
                      )}

                      {/* Badge Header Row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold font-mono">
                            {mod.elemen} • Kelas {mod.kelas}
                          </span>
                          {mod.pertemuan && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] font-medium">
                              {mod.pertemuan}
                            </span>
                          )}
                        </div>

                        {/* Top Action Menu */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModul(mod)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Modul Ajar ini"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicateModul(mod)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Duplikat Modul"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteModul(mod.id, mod.judul)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Modul"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => setPreviewModulItem(mod)}
                        className="font-display font-bold text-slate-800 text-sm leading-snug cursor-pointer hover:text-blue-600 transition line-clamp-2"
                      >
                        {mod.judul}
                      </h4>

                      {/* Date / KBM Schedule */}
                      {mod.tanggalPertemuan && (
                        <div className="bg-indigo-50/80 border border-indigo-100 p-2 rounded-xl flex items-center justify-between text-[10px] text-indigo-900 font-bold">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Jadwal KBM: {mod.tanggalPertemuan}</span>
                          </span>
                          <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px] font-mono">
                            Kalender Efektif
                          </span>
                        </div>
                      )}

                      {/* Text Excerpt */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {(mod.isi || "").replace(/<[^>]*>?/gm, "")}
                      </p>

                      {/* Lampiran / Uploaded Files Section on Card */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-1 text-slate-600">
                            <Paperclip className="h-3 w-3 text-blue-500" />
                            <span>Dokumen Lampiran ({mod.lampiran?.length || 0})</span>
                          </span>

                          <label className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 font-bold">
                            <Plus className="h-3 w-3" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.zip"
                              onChange={(e) => handleDirectUploadToModulCard(mod.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {mod.lampiran && mod.lampiran.length > 0 ? (
                          <div className="space-y-1.5">
                            {mod.lampiran.map((file: any) => (
                              <div
                                key={file.id}
                                className="bg-slate-50 border border-slate-200 p-1.5 px-2 rounded-lg flex items-center justify-between text-[11px]"
                              >
                                <div className="flex items-center gap-1.5 truncate pr-1">
                                  <File className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                  <span className="font-medium text-slate-700 truncate">{file.nama}</span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] text-slate-400 font-mono">{file.ukuran}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLampiranFromCard(mod.id, file.id)}
                                    className="text-slate-400 hover:text-red-500 p-0.5 ml-1"
                                    title="Hapus berkas"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">Belum ada berkas lampiran diunggah.</p>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <span className="text-[10px] text-slate-400 truncate">
                        Metode: {mod.metode || "Deep Learning"}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Download Dropdown */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenCardExportId(openCardExportId === mod.id ? null : mod.id);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Unduh Modul Ajar Format Word (.doc) / PDF"
                          >
                            <Download className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Unduh</span>
                            <ChevronDown className="h-3 w-3 text-emerald-500" />
                          </button>

                          {openCardExportId === mod.id && (
                            <div
                              className="origin-top-right absolute right-0 bottom-full mb-2 w-56 rounded-xl shadow-xl bg-white border border-slate-200 z-30 overflow-hidden p-1 animate-fade-in"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-2.5 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Ekspor Modul Ajar
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardExportId(null);
                                  handleDownloadDocument("modul", "doc", mod);
                                }}
                                className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center gap-2 transition cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                                <div>
                                  <span className="font-bold block text-slate-800">Download Word (.doc)</span>
                                  <span className="text-[10px] text-slate-400 block">Kop, Metadata & TTD Sekolah</span>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardExportId(null);
                                  handleDownloadDocument("modul", "print", mod);
                                }}
                                className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg flex items-center gap-2 transition cursor-pointer"
                              >
                                <Printer className="h-4 w-4 text-indigo-600 shrink-0" />
                                <div>
                                  <span className="font-bold block text-slate-800">Cetak / Simpan PDF</span>
                                  <span className="text-[10px] text-slate-400 block">Format A4 Standar Cetak</span>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardExportId(null);
                                  setIsSchoolTemplateModalOpen(true);
                                }}
                                className="w-full text-left px-2.5 py-2 text-xs font-medium text-amber-800 hover:bg-amber-50 rounded-lg flex items-center gap-2 transition cursor-pointer border-t border-slate-100 mt-1"
                              >
                                <Settings className="h-4 w-4 text-amber-600 shrink-0" />
                                <div>
                                  <span className="font-bold block">Kustom Template Sekolah</span>
                                  <span className="text-[10px] text-amber-600 block">Atur Nama Sekolah, NIP & Kop</span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setPreviewModulItem(mod)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModul(mod)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-3">
                <FileText className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">Tidak Ada Modul Ajar Ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau filter kelas/elemen, atau klik tombol di bawah untuk membuat modul ajar baru.
                </p>
                <button
                  onClick={handleOpenAddModul}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Modul Ajar Baru</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 4: DEEP LEARNING (AI SANDBOX)    */}
        {/* ======================================= */}
        {activeTab === "deep_learning" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Deep Learning (AI)</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Drafter Rencana Pembelajaran Mendalam (Deep Learning)</h2>
                <p className="text-slate-500 text-xs">Penyusunan RPP Kurikulum Merdeka cerdas menggunakan model integratif 8-3-3-4 dengan agen kecerdasan buatan.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="deep_learning" title="Desain Deep Learning" />
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">KKTP Rubrik</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</h2>
                <p className="text-slate-500 text-xs">Menentukan kriteria ketuntasan siswa berdasarkan interval nilai, predikat, dan tindak lanjut remedial.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="kktp" title="KKTP & Rubrik" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input KKTP */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tambah Rubrik KKTP</h3>
                <form onSubmit={handleAddKktp} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tujuan Pembelajaran (TP) Terkait</label>
                    <WysiwygEditor
                      id="lms-kktp-tujuan-editor"
                      value={kktpForm.tujuanBelajar}
                      onChange={(val) => setKktpForm({...kktpForm, tujuanBelajar: val})}
                      placeholder="Contoh: Siswa mampu mendeteksi IP Address dan subnet mask pada jaringan LAN."
                      heightClass="min-h-[140px]"
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded">Prota</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Program Tahunan (Prota) Informatika SMA</h2>
                <p className="text-slate-500 text-xs">Distribusi alokasi waktu jam pelajaran (JP) selama 1 tahun pelajaran penuh disesuaikan kalender pendidikan.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SubmenuDownloadHeaderButton tabId="prota" title="Program Tahunan (Prota)" />
                <button
                  onClick={() => {
                    setConfigForm(mingguEfektifConfig);
                    setIsConfigModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-600" />
                  <span>Kalender & Minggu Efektif</span>
                </button>
                <button
                  onClick={handleOpenAddProta}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Program Tahunan</span>
                </button>
              </div>
            </div>

            {/* Analysis & Kalender Education Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Semester 1 Card */}
              <div className="bg-cyan-50/60 border border-cyan-150 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider bg-cyan-100 px-2 py-0.5 rounded-md">Semester 1 (Ganjil)</span>
                  <span className="text-xs font-bold text-cyan-800 font-mono">{smt1Efektif} Minggu Efektif</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Jam Mengajar Efektif</span>
                    <span className="text-lg font-bold font-mono text-slate-800">{smt1TotalJp} JP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Teralokasi di Prota</span>
                    <span className={`text-sm font-bold font-mono ${protaSmt1AllocatedJp === smt1TotalJp ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {protaSmt1AllocatedJp} JP
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-cyan-200/50 flex justify-between">
                  <span>Total Kalender: {mingguEfektifConfig.ganjil.totalMinggu} Mgg</span>
                  <span>Tidak Efektif: {mingguEfektifConfig.ganjil.tidakEfektif} Mgg</span>
                </div>
              </div>

              {/* Semester 2 Card */}
              <div className="bg-teal-50/60 border border-teal-150 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded-md">Semester 2 (Genap)</span>
                  <span className="text-xs font-bold text-teal-800 font-mono">{smt2Efektif} Minggu Efektif</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Jam Mengajar Efektif</span>
                    <span className="text-lg font-bold font-mono text-slate-800">{smt2TotalJp} JP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Teralokasi di Prota</span>
                    <span className={`text-sm font-bold font-mono ${protaSmt2AllocatedJp === smt2TotalJp ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {protaSmt2AllocatedJp} JP
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-teal-200/50 flex justify-between">
                  <span>Total Kalender: {mingguEfektifConfig.genap.totalMinggu} Mgg</span>
                  <span>Tidak Efektif: {mingguEfektifConfig.genap.tidakEfektif} Mgg</span>
                </div>
              </div>

              {/* Annual Summary Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Tahun Pelajaran Full</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-bold">Terintegrasi LMS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Minggu Efektif</span>
                      <span className="text-base font-bold font-mono text-white">{smt1Efektif + smt2Efektif} Mgg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target JP Efektif</span>
                      <span className="text-base font-bold font-mono text-cyan-400">{smt1TotalJp + smt2TotalJp} JP</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>Beban Jam: {mingguEfektifConfig.ganjil.jpPerMinggu} JP / Minggu</span>
                  <span className="text-emerald-400 font-bold">✓ Sinkron Kalender</span>
                </div>
              </div>
            </div>

            {/* Prota Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-700 font-bold font-display border-b border-slate-200">
                    <th className="p-3.5 border-r border-slate-200 w-36">Semester</th>
                    <th className="p-3.5 border-r border-slate-200">Materi Pokok / Elemen</th>
                    <th className="p-3.5 border-r border-slate-200 text-center w-28">Alokasi JP</th>
                    <th className="p-3.5 border-r border-slate-200 text-center w-40">Distribusi Minggu</th>
                    <th className="p-3.5 border-r border-slate-200 w-48">Catatan Kalender</th>
                    <th className="p-3.5 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-700 bg-white">
                  {protaList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Belum ada data Program Tahunan. Klik "Tambah Program Tahunan" untuk menambah program.
                      </td>
                    </tr>
                  ) : (
                    protaList.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-700 border-r border-slate-200">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.semester.includes("1") ? "bg-cyan-50 text-cyan-700 border border-cyan-200" : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}>
                            {p.semester}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium border-r border-slate-200 text-slate-800">{p.materi}</td>
                        <td className="p-3.5 text-center font-bold font-mono text-cyan-700 border-r border-slate-200 bg-cyan-50/30">
                          {p.jp}
                        </td>
                        <td className="p-3.5 text-center font-medium text-slate-600 border-r border-slate-200">{p.minggu}</td>
                        <td className="p-3.5 text-slate-500 text-[11px] border-r border-slate-200">{p.keterangan || "-"}</td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditProta(p)}
                              className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
                              title="Edit Program Tahunan"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProta(p.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-500 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Promes</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Program Semester (Promes) Pembelajaran</h2>
                <p className="text-slate-500 text-xs">Penjabaran mingguan materi pembelajaran per semester sesuai alokasi minggu efektif kalender pendidikan.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SubmenuDownloadHeaderButton tabId="promes" title="Program Semester (Promes)" />
                <button
                  onClick={() => {
                    setConfigForm(mingguEfektifConfig);
                    setIsConfigModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200 cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-600" />
                  <span>Kalender & Minggu Efektif</span>
                </button>
                <button
                  onClick={handleOpenAddPromes}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Program Semester</span>
                </button>
              </div>
            </div>

            {/* Filters & Quick Analytics Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setPromesFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    promesFilter === "ALL" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Semua Semester
                </button>
                <button
                  onClick={() => setPromesFilter("1 (GANJIL)")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    promesFilter === "1 (GANJIL)" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Semester 1 (Ganjil)
                </button>
                <button
                  onClick={() => setPromesFilter("2 (GENAP)")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    promesFilter === "2 (GENAP)" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Semester 2 (Genap)
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span>Centang (✔) = Minggu Efektif KBM (Klik sel untuk ubah)</span>
                </div>
              </div>
            </div>

            {/* Promes Interactive Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full border-collapse border-spacing-0 text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-600 font-bold border-b border-slate-200 uppercase">
                    <th className="p-3 border-r border-slate-200 w-28">Semester</th>
                    <th className="p-3 border-r border-slate-200 min-w-[200px]">Materi Pokok / Elemen</th>
                    <th className="p-3 border-r border-slate-200 text-center w-16">JP</th>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((w) => (
                      <th key={w} className="p-1 border-r border-slate-200 text-center text-[9px] w-8 bg-slate-100/50">
                        M{w}
                      </th>
                    ))}
                    <th className="p-3 border-r border-slate-200 w-40">Catatan</th>
                    <th className="p-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-[11px] text-slate-700 bg-white">
                  {promesList
                    .filter((p: any) => promesFilter === "ALL" || p.semester === promesFilter)
                    .length === 0 ? (
                    <tr>
                      <td colSpan={25} className="p-8 text-center text-slate-400 italic">
                        Belum ada data Program Semester untuk filter ini. Klik "Tambah Program Semester" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    promesList
                      .filter((p: any) => promesFilter === "ALL" || p.semester === promesFilter)
                      .map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 border-r border-slate-200 font-bold">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              p.semester.includes("1") ? "bg-cyan-50 text-cyan-700" : "bg-teal-50 text-teal-700"
                            }`}>
                              {p.semester}
                            </span>
                          </td>
                          <td className="p-3 border-r border-slate-200 font-medium text-slate-800">{p.materi}</td>
                          <td className="p-3 border-r border-slate-200 text-center font-bold font-mono text-teal-700 bg-teal-50/20">
                            {p.jp}
                          </td>
                          {Array.from({ length: 20 }, (_, i) => i).map((wIdx) => {
                            const isChecked = p.weeks && p.weeks[wIdx];
                            return (
                              <td
                                key={wIdx}
                                onClick={() => handleTogglePromesWeek(p.id, wIdx)}
                                title={`Klik untuk ${isChecked ? "membatalkan" : "menandai"} Minggu ${wIdx + 1}`}
                                className={`p-1 border-r border-slate-200 text-center cursor-pointer select-none transition ${
                                  isChecked
                                    ? "bg-teal-100/80 text-teal-800 font-bold hover:bg-teal-200"
                                    : "text-slate-300 hover:bg-slate-100"
                                }`}
                              >
                                {isChecked ? "✔" : "-"}
                              </td>
                            );
                          })}
                          <td className="p-3 border-r border-slate-200 text-slate-500 text-[10px]">{p.keterangan || "-"}</td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEditPromes(p)}
                                className="p-1 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded transition cursor-pointer"
                                title="Edit Baris Promes"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePromes(p.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                  Materi Pembelajaran
                </span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Daftar & Pengelolaan Materi Belajar Siswa</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Guru memiliki keleluasaan penuh untuk menambah, mengedit, mengunggah media (Dokumen, Spreadsheet, Presentasi, Animasi, Video, Audio, Tautan), dan mengelola materi siswa.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SubmenuDownloadHeaderButton tabId="materi" title="Materi Pembelajaran" />
                {(user.role === "GURU" || user.role === "ADMIN") && (
                  <button
                    onClick={handleOpenAddMateri}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Materi Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter, Search & Media Stats Bar */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {/* Search Box */}
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari judul, bab, kata kunci..."
                    value={materiSearch}
                    onChange={(e) => setMateriSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                  {materiSearch && (
                    <button
                      onClick={() => setMateriSearch("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Format */}
                <div className="md:col-span-3">
                  <select
                    value={materiFilterFormat}
                    onChange={(e) => setMateriFilterFormat(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Semua">Semua Format File / Media</option>
                    <option value="dokumen">📄 Dokumen (PDF, Word)</option>
                    <option value="spreadsheet">📊 Spreadsheet (Excel, CSV)</option>
                    <option value="presentasi">📊 Presentasi (PPT, Slides)</option>
                    <option value="animasi">🎨 Animasi / Visualizer</option>
                    <option value="video">🎥 Video Pembelajaran</option>
                    <option value="audio">🎙️ Audio / Podcast</option>
                    <option value="tautan">🔗 Tautan Web / IDE</option>
                  </select>
                </div>

                {/* Filter Kelas */}
                <div className="md:col-span-2">
                  <select
                    value={materiFilterKelas}
                    onChange={(e) => setMateriFilterKelas(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                {/* Filter Elemen */}
                <div className="md:col-span-3">
                  <select
                    value={materiFilterElemen}
                    onChange={(e) => setMateriFilterElemen(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Semua">Semua Elemen CP</option>
                    {ELEMEN_INFORMATIKA.map((el) => (
                      <option key={el.kode} value={el.kode}>
                        [{el.kode}] {el.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format Count Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Ringkasan Media:</span>
                <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  Total: {materiList.length} Materi
                </span>
                <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-100">
                  📄 Dokumen ({materiList.filter(m => m.tipeFormat === "dokumen").length})
                </span>
                <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-100">
                  📊 Spreadsheet ({materiList.filter(m => m.tipeFormat === "spreadsheet").length})
                </span>
                <span className="bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-100">
                  📊 Slide ({materiList.filter(m => m.tipeFormat === "presentasi").length})
                </span>
                <span className="bg-purple-50 text-purple-700 font-medium px-2 py-0.5 rounded-full border border-purple-100">
                  🎨 Animasi ({materiList.filter(m => m.tipeFormat === "animasi").length})
                </span>
                <span className="bg-rose-50 text-rose-700 font-medium px-2 py-0.5 rounded-full border border-rose-100">
                  🎥 Video ({materiList.filter(m => m.tipeFormat === "video").length})
                </span>
                <span className="bg-cyan-50 text-cyan-700 font-medium px-2 py-0.5 rounded-full border border-cyan-100">
                  🎙️ Audio ({materiList.filter(m => m.tipeFormat === "audio").length})
                </span>
                <span className="bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full border border-indigo-100">
                  🔗 Tautan ({materiList.filter(m => m.tipeFormat === "tautan").length})
                </span>
              </div>
            </div>

            {/* MATERI CARDS GRID */}
            {(() => {
              const filtered = materiList.filter(m => {
                const matchSearch =
                  materiSearch === "" ||
                  m.judul.toLowerCase().includes(materiSearch.toLowerCase()) ||
                  m.bab.toLowerCase().includes(materiSearch.toLowerCase()) ||
                  m.deskripsi.toLowerCase().includes(materiSearch.toLowerCase()) ||
                  (m.tags && m.tags.some(t => t.toLowerCase().includes(materiSearch.toLowerCase())));

                const matchKelas = materiFilterKelas === "Semua" || m.kelas === materiFilterKelas;
                const matchFormat = materiFilterFormat === "Semua" || m.tipeFormat === materiFilterFormat;
                const matchElemen = materiFilterElemen === "Semua" || m.elemen === materiFilterElemen;

                return matchSearch && matchKelas && matchFormat && matchElemen;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">Tidak ada materi belajar ditemukan</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Coba sesuaikan kata kunci pencarian atau ubah filter format file/kelas di atas.
                    </p>
                    {(user.role === "GURU" || user.role === "ADMIN") && (
                      <button
                        onClick={handleOpenAddMateri}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Materi Baru</span>
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((m) => {
                    const badge = getFormatBadge(m.tipeFormat);
                    const FormatIcon = badge.icon;
                    return (
                      <div
                        key={m.id}
                        className="bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md transition rounded-2xl p-5 space-y-4 flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${badge.color}`}>
                              <FormatIcon className="h-3 w-3" />
                              <span>{badge.label}</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-bold uppercase">
                                [{m.elemen}]
                              </span>
                              <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md font-bold">
                                Kelas {m.kelas}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  m.status === "Publik"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {m.status}
                              </span>
                            </div>
                          </div>

                          {/* Title & Bab */}
                          <div>
                            <h4 className="font-display font-bold text-slate-800 text-sm leading-snug group-hover:text-orange-600 transition">
                              {m.judul}
                            </h4>
                            <span className="block text-[10px] text-orange-800 font-bold uppercase tracking-wider mt-1">
                              {m.bab}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {m.deskripsi}
                          </p>

                          {/* File Attachment / Media Info Box */}
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="text-slate-700 font-medium truncate text-[11px]">
                                {m.fileName || (m.tipeFormat === "tautan" ? "Pranala Luar / Link Web" : "Berkas Media Ajar")}
                              </span>
                            </div>
                            {m.fileSize && (
                              <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                                {m.fileSize}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {m.tags && m.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {m.tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-400">
                            {m.pembuat} • {m.tanggalDibuat}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setPreviewMateri(m)}
                              className="px-2.5 py-1 text-xs font-bold text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Buka / Pratinjau Media"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Buka</span>
                            </button>
                            {(user.role === "GURU" || user.role === "ADMIN") && (
                              <>
                                <button
                                  onClick={() => handleOpenEditMateri(m)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="Edit Materi"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMateri(m.id, m.judul)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Hapus Materi"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================= */}
        {/* SUBTAB 9: BUKU DIGITAL                  */}
        {/* ======================================= */}
        {activeTab === "buku" && (
          <div className="p-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-violet-500 uppercase tracking-widest bg-violet-50 px-2 py-1 rounded">Buku Teks</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Buku Teks Utama Informatika (Kurikulum Merdeka)</h2>
                <p className="text-slate-500 text-xs">Pustaka digital materi pokok resmi yang didesain interaktif untuk pegangan Guru dan Siswa.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="buku" title="Katalog Buku Digital" />
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest bg-fuchsia-50 px-2 py-1 rounded">Repository</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Repository File Perangkat Pembelajaran</h2>
                <p className="text-slate-500 text-xs">Penyimpanan sentral dokumen, RPP, dan aset ajar. Anda dapat mengunggah file materi baru di sini.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="repository" title="Repository File" />
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Versioning</span>
                <h2 className="text-lg font-display font-bold text-slate-800 mt-2">Kontrol Versi Dokumen Kurikulum (Revision Control)</h2>
                <p className="text-slate-500 text-xs">Pantau perubahan dokumen, bandingkan draf lama vs baru, dan kembalikan ke revisi sebelumnya secara aman.</p>
              </div>
              <SubmenuDownloadHeaderButton tabId="versioning" title="History Versioning" />
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

        {/* ======================================= */}
        {/* MODAL 1: EDIT / TAMBAH PROTA           */}
        {/* ======================================= */}
        {isProtaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded uppercase">Form Prota</span>
                  <h3 className="font-display font-bold text-slate-800 text-base mt-1">
                    {editingProtaId ? "Edit Baris Program Tahunan" : "Tambah Program Tahunan Baru"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsProtaModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProta} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Semester</label>
                    <select
                      value={protaForm.semester}
                      onChange={(e) => setProtaForm({ ...protaForm, semester: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="1 (GANJIL)">1 (GANJIL)</option>
                      <option value="2 (GENAP)">2 (GENAP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Alokasi Waktu (JP)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 18 JP"
                      value={protaForm.jp}
                      onChange={(e) => setProtaForm({ ...protaForm, jp: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Materi Pokok / Elemen CP</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Berpikir Komputasional (Dekomposisi, Algoritma)"
                    value={protaForm.materi}
                    onChange={(e) => setProtaForm({ ...protaForm, materi: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Distribusi Minggu Efektif</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Minggu 1 - 6"
                    value={protaForm.minggu}
                    onChange={(e) => setProtaForm({ ...protaForm, minggu: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Catatan Kalender / Keterangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Alokasi 6 Pertemuan @ 3 JP"
                    value={protaForm.keterangan}
                    onChange={(e) => setProtaForm({ ...protaForm, keterangan: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsProtaModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white transition shadow-xs cursor-pointer"
                  >
                    Simpan Prota
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* MODAL 2: EDIT / TAMBAH PROMES          */}
        {/* ======================================= */}
        {isPromesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">Form Promes</span>
                  <h3 className="font-display font-bold text-slate-800 text-base mt-1">
                    {editingPromesId ? "Edit Baris Program Semester" : "Tambah Program Semester Baru"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPromesModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePromes} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Semester</label>
                    <select
                      value={promesForm.semester}
                      onChange={(e) => setPromesForm({ ...promesForm, semester: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="1 (GANJIL)">1 (GANJIL)</option>
                      <option value="2 (GENAP)">2 (GENAP)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Alokasi Waktu (JP)</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 18 JP"
                      value={promesForm.jp}
                      onChange={(e) => setPromesForm({ ...promesForm, jp: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Materi Pokok / Elemen</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1. Berpikir Komputasional (BK)"
                    value={promesForm.materi}
                    onChange={(e) => setPromesForm({ ...promesForm, materi: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase">Centang Minggu Pelaksanaan (M1 - M20)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPromesForm({ ...promesForm, weeks: Array(20).fill(true) })}
                        className="text-[10px] text-teal-600 hover:underline font-bold cursor-pointer"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromesForm({ ...promesForm, weeks: Array(20).fill(false) })}
                        className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {Array.from({ length: 20 }, (_, i) => i).map((wIdx) => {
                      const active = promesForm.weeks && promesForm.weeks[wIdx];
                      return (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={() => {
                            const newWeeks = [...promesForm.weeks];
                            newWeeks[wIdx] = !newWeeks[wIdx];
                            setPromesForm({ ...promesForm, weeks: newWeeks });
                          }}
                          className={`p-2 text-center rounded-lg border text-xs font-bold transition cursor-pointer ${
                            active
                              ? "bg-teal-600 text-white border-teal-700 shadow-xs"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          M{wIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Catatan / Keterangan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 6 Pertemuan @ 3 JP"
                    value={promesForm.keterangan}
                    onChange={(e) => setPromesForm({ ...promesForm, keterangan: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsPromesModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
                  >
                    Simpan Promes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* MODAL 3: PENGATURAN MINGGU EFEKTIF & KALENDER */}
        {/* ======================================= */}
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">Kalender Pendidikan</span>
                  <h3 className="font-display font-bold text-slate-800 text-base mt-1">
                    Pengaturan Alokasi Minggu Efektif & JP
                  </h3>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                {/* Semester 1 Section */}
                <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-cyan-800 block">Semester 1 (Ganjil)</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Total Minggu Kalender</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={configForm.ganjil.totalMinggu}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          ganjil: { ...configForm.ganjil, totalMinggu: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Minggu Tidak Efektif</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={configForm.ganjil.tidakEfektif}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          ganjil: { ...configForm.ganjil, tidakEfektif: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">JP Mengajar / Minggu</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configForm.ganjil.jpPerMinggu}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          ganjil: { ...configForm.ganjil, jpPerMinggu: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold text-cyan-700"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-cyan-900 font-medium">
                    Hasil: ({configForm.ganjil.totalMinggu} - {configForm.ganjil.tidakEfektif}) = <strong>{configForm.ganjil.totalMinggu - configForm.ganjil.tidakEfektif} Minggu Efektif</strong> x {configForm.ganjil.jpPerMinggu} JP = <strong>{(configForm.ganjil.totalMinggu - configForm.ganjil.tidakEfektif) * configForm.ganjil.jpPerMinggu} JP Efektif</strong>.
                  </p>
                </div>

                {/* Semester 2 Section */}
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-teal-800 block">Semester 2 (Genap)</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Total Minggu Kalender</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={configForm.genap.totalMinggu}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          genap: { ...configForm.genap, totalMinggu: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Minggu Tidak Efektif</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={configForm.genap.tidakEfektif}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          genap: { ...configForm.genap, tidakEfektif: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">JP Mengajar / Minggu</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configForm.genap.jpPerMinggu}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          genap: { ...configForm.genap, jpPerMinggu: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white font-bold text-teal-700"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-teal-900 font-medium">
                    Hasil: ({configForm.genap.totalMinggu} - {configForm.genap.tidakEfektif}) = <strong>{configForm.genap.totalMinggu - configForm.genap.tidakEfektif} Minggu Efektif</strong> x {configForm.genap.jpPerMinggu} JP = <strong>{(configForm.genap.totalMinggu - configForm.genap.tidakEfektif) * configForm.genap.jpPerMinggu} JP Efektif</strong>.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition shadow-xs cursor-pointer"
                  >
                    Simpan Pengaturan Kalender
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* MODAL: TAMBAH / EDIT MATERI BELAJAR     */}
        {/* ======================================= */}
        {isMateriModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded uppercase border border-orange-100">
                    Materi Belajar Siswa
                  </span>
                  <h3 className="font-display font-bold text-slate-800 text-base mt-1">
                    {editingMateriId ? "Edit Materi Belajar" : "Tambah Materi Belajar Baru"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsMateriModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Format Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">
                    Pilih Format Media / Berkas Materi <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: "dokumen", label: "Dokumen", sub: "PDF, Word, TXT", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-200" },
                      { type: "spreadsheet", label: "Spreadsheet", sub: "Excel, CSV, Sheet", icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                      { type: "presentasi", label: "Presentasi", sub: "PPT, Slides, Canva", icon: Presentation, color: "text-amber-600 bg-amber-50 border-amber-200" },
                      { type: "animasi", label: "Animasi", sub: "GIF, Lottie, Sim", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-200" },
                      { type: "video", label: "Video", sub: "MP4, YouTube", icon: Video, color: "text-rose-600 bg-rose-50 border-rose-200" },
                      { type: "audio", label: "Audio", sub: "MP3, Podcast", icon: Music, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
                      { type: "tautan", label: "Tautan Web", sub: "IDE, Link, Drive", icon: Link2, color: "text-indigo-600 bg-indigo-50 border-indigo-200" }
                    ].map((f) => {
                      const IconComp = f.icon;
                      const isSelected = materiForm.tipeFormat === f.type;
                      return (
                        <button
                          key={f.type}
                          type="button"
                          onClick={() => setMateriForm({ ...materiForm, tipeFormat: f.type as any })}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                            isSelected
                              ? `ring-2 ring-orange-500 border-orange-500 bg-orange-50/50 shadow-xs`
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComp className={`h-4 w-4 ${f.color.split(' ')[0]}`} />
                            {isSelected && <Check className="h-3.5 w-3.5 text-orange-600" />}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-800">{f.label}</span>
                            <span className="block text-[9px] text-slate-400">{f.sub}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Judul Materi */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Judul Materi Belajar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemrograman Python & Struktur Data List"
                    value={materiForm.judul || ""}
                    onChange={(e) => setMateriForm({ ...materiForm, judul: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* 3. Kelas, Elemen, Bab */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Kelas Target</label>
                    <select
                      value={materiForm.kelas || "X"}
                      onChange={(e) => setMateriForm({ ...materiForm, kelas: e.target.value as any })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="X">Kelas X (Fase E)</option>
                      <option value="XI">Kelas XI (Fase F)</option>
                      <option value="XII">Kelas XII (Fase F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Elemen CP</label>
                    <select
                      value={materiForm.elemen || "AP"}
                      onChange={(e) => setMateriForm({ ...materiForm, elemen: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    >
                      {ELEMEN_INFORMATIKA.map((el) => (
                        <option key={el.kode} value={el.kode}>
                          [{el.kode}] {el.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Bab / Topik Bahasan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bab 2 - Sintaksis & Variable"
                      value={materiForm.bab || ""}
                      onChange={(e) => setMateriForm({ ...materiForm, bab: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* 4. Unggah Berkas & Link Input */}
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase">
                    Unggah Berkas atau Tautan Media
                  </span>

                  {/* File Upload Zone */}
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-orange-400 bg-white rounded-xl p-4 text-center transition cursor-pointer">
                    <input
                      type="file"
                      onChange={handleMateriFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <span className="block text-xs font-bold text-slate-700">
                      Klik untuk pilih berkas atau seret file ke sini
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      Mendukung PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), GIF, MP4, MP3, CSV, Zip, dll.
                    </span>
                  </div>

                  {/* Uploaded File Info Banner */}
                  {materiForm.fileName && (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-900 truncate">{materiForm.fileName}</span>
                        {materiForm.fileSize && (
                          <span className="text-[10px] text-emerald-700 font-mono">({materiForm.fileSize})</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setMateriForm({ ...materiForm, fileName: "", fileSize: "", fileUrl: "" })}
                        className="text-emerald-700 hover:text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  )}

                  {/* Embed / External URL */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Tautan URL External / Embed (Opsional)
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        placeholder="Contoh: https://youtube.com/embed/... atau link Canva, Google Slides, Replit IDE"
                        value={materiForm.embedUrl || materiForm.fileUrl || ""}
                        onChange={(e) => setMateriForm({ ...materiForm, embedUrl: e.target.value, fileUrl: e.target.value })}
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Deskripsi Ringkas */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Deskripsi Ringkas & Catatan Guru
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan gambaran singkat materi, instruksi praktikum, atau panduan belajar untuk siswa..."
                    value={materiForm.deskripsi || ""}
                    onChange={(e) => setMateriForm({ ...materiForm, deskripsi: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* 6. Status & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Status Publikasi</label>
                    <select
                      value={materiForm.status || "Publik"}
                      onChange={(e) => setMateriForm({ ...materiForm, status: e.target.value as any })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Publik">🟢 Publik (Dapat diakses siswa)</option>
                      <option value="Draf">🟡 Draf (Hanya terlihat oleh Guru)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tags / Kata Kunci (Pisahkan Koma)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Python, Variable, Algorithm"
                      value={materiForm.tags ? materiForm.tags.join(", ") : ""}
                      onChange={(e) =>
                        setMateriForm({
                          ...materiForm,
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                        })
                      }
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsMateriModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMateri}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Simpan Materi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* MODAL: PRATINJAU / PREVIEW MATERI       */}
        {/* ======================================= */}
        {previewMateri && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const badge = getFormatBadge(previewMateri.tipeFormat);
                      const FormatIcon = badge.icon;
                      return (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                          <FormatIcon className="h-3 w-3" />
                          <span>{badge.label}</span>
                        </span>
                      );
                    })()}
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                      Kelas {previewMateri.kelas} • [{previewMateri.elemen}]
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-lg leading-snug">
                    {previewMateri.judul}
                  </h3>
                  <span className="text-xs font-bold text-orange-700 block uppercase tracking-wider">
                    {previewMateri.bab}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewMateri(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* MEDIA PREVIEW PLAYER CONTAINER */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 overflow-hidden shadow-inner space-y-3">
                {/* 1. VIDEO PREVIEW */}
                {previewMateri.tipeFormat === "video" && (
                  <div className="space-y-3 text-center">
                    {previewMateri.embedUrl && previewMateri.embedUrl.includes("youtube") ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                        <iframe
                          src={previewMateri.embedUrl}
                          title={previewMateri.judul}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 space-y-3 relative group">
                        <div className="w-16 h-16 bg-rose-600/90 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer">
                          <Play className="h-8 w-8 ml-1" />
                        </div>
                        <p className="text-xs font-bold text-slate-200">{previewMateri.fileName || "Video_Pembelajaran_Informatika.mp4"}</p>
                        <div className="w-full max-w-md bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full w-1/3 rounded-full" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">03:45 / 12:30 (Pemutar Video MP4 Interaktif)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. AUDIO PREVIEW */}
                {previewMateri.tipeFormat === "audio" && (
                  <div className="p-5 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-800/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-600/30 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/40 shrink-0">
                        <Music className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-cyan-100">{previewMateri.fileName || "Podcast_Edukasi.mp3"}</h4>
                        <span className="text-[11px] text-cyan-300/70 font-mono">Audio Podcast / Penjelasan Suara Guru</span>
                      </div>
                    </div>
                    {/* Audio Wave Visualizer Simulation */}
                    <div className="flex items-end justify-between gap-1 h-10 px-2 py-1 bg-slate-950/60 rounded-lg border border-cyan-900/40">
                      {[30, 60, 45, 80, 100, 70, 40, 90, 65, 85, 50, 95, 75, 30, 85, 90, 60, 40, 70, 80, 100, 60, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className={`w-1 rounded-full transition-all ${i < 10 ? "bg-cyan-400" : "bg-slate-700"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-cyan-300/80 font-mono pt-1">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-cyan-500 text-slate-950 rounded-full font-bold hover:bg-cyan-400 cursor-pointer">
                          <Play className="h-4 w-4 ml-0.5" />
                        </button>
                        <span>01:24 / 08:45</span>
                      </div>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                        128 kbps stereo
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. SPREADSHEET PREVIEW */}
                {previewMateri.tipeFormat === "spreadsheet" && (
                  <div className="p-4 bg-slate-950 border border-emerald-900/50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-emerald-900/50 pb-2">
                      <span className="flex items-center gap-1.5">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        <span>Visualizer Spreadsheet Data ({previewMateri.fileName})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Excel / CSV Reader</span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-left font-mono text-xs text-slate-300">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <th className="p-2 border-r border-slate-800 text-center w-8">#</th>
                            <th className="p-2 border-r border-slate-800">A (ID Siswa)</th>
                            <th className="p-2 border-r border-slate-800">B (Nilai Pretest)</th>
                            <th className="p-2 border-r border-slate-800">C (Nilai Posttest)</th>
                            <th className="p-2">D (Peningkatan %)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: "SIS-001", pre: 65, post: 90, inc: "+38.4%" },
                            { id: "SIS-002", pre: 70, post: 95, inc: "+35.7%" },
                            { id: "SIS-003", pre: 55, post: 85, inc: "+54.5%" },
                            { id: "SIS-004", pre: 80, post: 100, inc: "+25.0%" }
                          ].map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-900/50">
                              <td className="p-2 border-r border-slate-800 text-center text-slate-500">{idx + 1}</td>
                              <td className="p-2 border-r border-slate-800 font-bold text-emerald-400">{row.id}</td>
                              <td className="p-2 border-r border-slate-800">{row.pre}</td>
                              <td className="p-2 border-r border-slate-800 font-bold text-white">{row.post}</td>
                              <td className="p-2 text-emerald-400 font-bold">{row.inc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. PRESENTASI SLIDE PREVIEW */}
                {previewMateri.tipeFormat === "presentasi" && (
                  <div className="p-4 bg-slate-950 border border-amber-900/50 rounded-xl space-y-3">
                    <div className="aspect-video bg-gradient-to-br from-slate-900 to-amber-950 rounded-xl border border-amber-800/40 p-6 flex flex-col justify-between relative shadow-lg">
                      <div className="flex justify-between items-center text-amber-400 text-xs font-bold border-b border-amber-800/30 pb-2">
                        <span>SLIDE 1 / 12 — {previewMateri.judul}</span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                          PPTX Presentation
                        </span>
                      </div>
                      <div className="space-y-2 text-center my-auto">
                        <h2 className="font-display font-bold text-lg text-white">{previewMateri.judul}</h2>
                        <p className="text-xs text-amber-200/80 max-w-md mx-auto">{previewMateri.deskripsi}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-amber-400/60 pt-2 border-t border-amber-800/30">
                        <span>Penyusun: {previewMateri.pembuat}</span>
                        <span>Informatika Kurikulum Merdeka</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ANIMASI PREVIEW */}
                {previewMateri.tipeFormat === "animasi" && (
                  <div className="p-5 bg-slate-950 border border-purple-900/50 rounded-xl text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-600/30 text-purple-400 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/40 animate-pulse">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-sm text-purple-100">{previewMateri.judul}</h4>
                    <p className="text-xs text-purple-300/70 max-w-md mx-auto">
                      Visualizer simulasi animasi interaktif algoritma. Pergerakan elemen array dan pengurutan dinamis secara otomatis.
                    </p>
                  </div>
                )}

                {/* 6. DOKUMEN & TAUTAN PREVIEW */}
                {(previewMateri.tipeFormat === "dokumen" || previewMateri.tipeFormat === "tautan") && (
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600/30 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/40 shrink-0">
                        {previewMateri.tipeFormat === "tautan" ? <Link2 className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100">{previewMateri.fileName || previewMateri.judul}</h4>
                        <span className="text-xs text-slate-400 block mt-0.5">{previewMateri.deskripsi}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DETAILS SUMMARY */}
              <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Penyusun:</span>
                    <span className="font-bold text-slate-800">{previewMateri.pembuat}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Tanggal Dibuat:</span>
                    <span className="font-bold text-slate-800">{previewMateri.tanggalDibuat}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Status Akses:</span>
                    <span className="font-bold text-emerald-700">{previewMateri.status}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase text-[9px]">Ukuran Berkas:</span>
                    <span className="font-mono text-slate-800">{previewMateri.fileSize || "N/A"}</span>
                  </div>
                </div>

                {previewMateri.deskripsi && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Uraian / Ringkasan Materi:</span>
                    <p className="text-slate-600 leading-relaxed text-xs">{previewMateri.deskripsi}</p>
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleDownloadDocument("materi", "print", previewMateri)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-600" />
                  <span>Cetak Dokumen PDF</span>
                </button>

                <div className="flex items-center gap-2">
                  {(previewMateri.fileUrl || previewMateri.embedUrl) && (
                    <a
                      href={previewMateri.embedUrl || previewMateri.fileUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka Link / Unduh Media</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewMateri(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT / TAMBAH MODUL AJAR */}
        {isModulModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-auto">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-base">
                      {editingModulId ? "Edit Modul Ajar (RPP Kurikulum Merdeka)" : "Tambah Modul Ajar Baru"}
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {editingModulId ? "Perbarui informasi, langkah kegiatan, dan berkas lampiran" : "Kelola desain modul pembelajaran interaktif lengkap"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModulModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Mengedit Live Broadcast Banner */}
              <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-6 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span>
                    Indikator Realtime: Status <strong>"Sedang Mengedit oleh {user?.nama || user?.name || "Yogi Suprayogi, S.Kom."}"</strong> disiarkan ke seluruh guru rekan sejawat dalam sekolah.
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                  STATUS: SEDANG MENGEDIT
                </span>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveModul} className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
                {/* Preset Template buttons */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Muat Template Baku Kurikulum Merdeka (Deep Learning 8-3-3-4)</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Pilih salah satu contoh draf ber-format baku pemerintah untuk langsung mengisi formulir di bawah ini:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModForm(prev => ({
                          ...prev,
                          judul: "Modul Ajar Informatika - Deep Learning: Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)",
                          elemen: "AP",
                          kelas: "XII",
                          metode: "Pembelajaran Mendalam (Deep Learning)",
                          alokasi: "3 JP x 45 menit",
                          isi: getBakuModulAjarTemplate("Pengembangan Program Modular dan Struktur Data Abstrak (Stack dan Queue)", "AP", "XII", "F")
                        }));
                      }}
                      className="text-left text-xs bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 font-medium px-3 py-2 rounded-lg flex items-center justify-between transition shadow-xs"
                    >
                      <span className="truncate pr-1">📋 Sample 1: Program Modular & Stack/Queue</span>
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModForm(prev => ({
                          ...prev,
                          judul: "Modul Ajar Informatika - Deep Learning: Pengolahan dan Analisis Data Bervolume Besar untuk Pengambilan Keputusan",
                          elemen: "AD",
                          kelas: "XII",
                          metode: "Pembelajaran Mendalam (Deep Learning)",
                          alokasi: "3 JP x 45 menit",
                          isi: getBakuModulAjarDataAnalisisTemplate()
                        }));
                      }}
                      className="text-left text-xs bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 font-medium px-3 py-2 rounded-lg flex items-center justify-between transition shadow-xs"
                    >
                      <span className="truncate pr-1">📊 Sample 2: Analisis Data Bervolume Besar</span>
                      <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Judul */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Judul Modul Ajar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Modul Ajar Informatika - Algoritma Pemrograman & Stack Queue..."
                    value={modForm.judul}
                    onChange={(e) => setModForm({ ...modForm, judul: e.target.value })}
                    className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Elemen CP</label>
                    <select
                      value={modForm.elemen}
                      onChange={(e) => setModForm({ ...modForm, elemen: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white font-bold"
                    >
                      {ELEMEN_INFORMATIKA.map(el => (
                        <option key={el.kode} value={el.kode}>{el.kode} - {el.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Kelas</label>
                    <select
                      value={modForm.kelas}
                      onChange={(e) => setModForm({ ...modForm, kelas: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white font-medium"
                    >
                      <option value="X">Kelas X (Fase E)</option>
                      <option value="XI">Kelas XI (Fase F)</option>
                      <option value="XII">Kelas XII (Fase F)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Pertemuan Ke-</label>
                    <input
                      type="text"
                      placeholder="Pertemuan 1 - 2"
                      value={modForm.pertemuan}
                      onChange={(e) => setModForm({ ...modForm, pertemuan: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Jadwal Pertemuan (KBM)</label>
                    <input
                      type="date"
                      value={modForm.tanggalPertemuan}
                      onChange={(e) => setModForm({ ...modForm, tanggalPertemuan: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Metode / Model Pembelajaran</label>
                    <input
                      type="text"
                      placeholder="Pembelajaran Mendalam (Deep Learning) / PBL"
                      value={modForm.metode}
                      onChange={(e) => setModForm({ ...modForm, metode: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Alokasi Waktu</label>
                    <input
                      type="text"
                      placeholder="3 JP x 45 menit"
                      value={modForm.alokasi}
                      onChange={(e) => setModForm({ ...modForm, alokasi: e.target.value })}
                      className="w-full text-xs border border-slate-300 p-2.5 rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Upload Dokumen / Attachment Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="h-4 w-4 text-blue-600" />
                        <span>Lampiran Berkas Dokumen Modul</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Unggah berkas PDF, Word (.docx), Excel (.xlsx), Slide (.pptx), atau Lembar Kerja Siswa (LKS).
                      </p>
                    </div>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Berkas</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.zip"
                        onChange={handleModulFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {modForm.lampiran && modForm.lampiran.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {modForm.lampiran.map((file) => (
                        <div
                          key={file.id}
                          className="bg-white border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <File className="h-4 w-4 text-blue-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold text-slate-800 block truncate">{file.nama}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{file.tipe} • {file.ukuran}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveModulLampiran(file.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1 shrink-0 ml-1"
                            title="Hapus lampiran ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs">
                      Belum ada berkas lampiran diunggah. Klik tombol "Upload Berkas" untuk melampirkan dokumen pendukung.
                    </div>
                  )}
                </div>

                {/* Editor Content */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-600">
                    Langkah Sesi Kegiatan, Pembelajaran Mendalam & Asesmen <span className="text-red-500">*</span>
                  </label>
                  <WysiwygEditor
                    id="lms-modul-isi-modal-editor"
                    value={modForm.isi}
                    onChange={(val) => setModForm({ ...modForm, isi: val })}
                    placeholder="Tuliskan rincian kegiatan guru, aktivitas siswa, dan teknik asesmen..."
                    heightClass="min-h-[220px]"
                  />
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModulModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingModulId ? "Simpan Perubahan Modul" : "Simpan & Publikasikan Modul"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PREVIEW DETAIL MODUL AJAR */}
        {previewModulItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-auto overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                    {previewModulItem.elemen} - Kelas {previewModulItem.kelas}
                  </span>
                  <h3 className="font-display font-bold text-slate-800 text-sm truncate max-w-md">
                    {previewModulItem.judul}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadDocument("modul", "print", previewModulItem)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                  <button
                    onClick={() => setPreviewModulItem(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Banner Indikator Sedang Mengedit pada Preview */}
              {previewModulItem.sedangDieditBy && (
                <div className="bg-amber-50 border-b border-amber-200 p-3 px-6 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <div>
                      <strong>Informasi Kolaborasi:</strong> Dokumen Modul Ajar ini sedang disesuaikan/diedit oleh{" "}
                      <strong className="underline">{previewModulItem.sedangDieditBy.nama}</strong> ({previewModulItem.sedangDieditBy.waktu}).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleEditLock(previewModulItem.id)}
                    className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Lepas Status Edit
                  </button>
                </div>
              )}

              {/* Document Preview Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-left flex-1 bg-white">
                {/* Kop Surat Header */}
                <div className="text-center border-b-2 border-slate-800 pb-3 font-sans">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">PEMERINTAH PROVINSI JAWA BARAT</h4>
                  <h3 className="text-base font-bold text-slate-900 uppercase">SMA NEGERI 2 CIAMIS</h3>
                  <p className="text-[10px] text-slate-500 italic">
                    Jl. Ir. H. Juanda No. 177 Ciamis • Telp: (0265) 771032 • Email: info@sman2ciamis.sch.id
                  </p>
                </div>

                {/* Metadata Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Mata Pelajaran</span>
                      <span className="font-bold text-slate-800">Informatika</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Fase / Kelas</span>
                      <span className="font-bold text-slate-800">Kelas {previewModulItem.kelas}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Elemen CP</span>
                      <span className="font-bold text-blue-700">{previewModulItem.elemen}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Alokasi Waktu</span>
                      <span className="font-bold text-slate-800">{previewModulItem.alokasi || "3 JP x 45 menit"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 pt-2 border-t border-slate-200">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Metode Belajar</span>
                      <span className="font-medium text-slate-700">{previewModulItem.metode || "Deep Learning"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Jadwal KBM</span>
                      <span className="font-mono text-slate-800">{previewModulItem.tanggalPertemuan || "Sesuai Jadwal"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Penyusun</span>
                      <span className="font-bold text-slate-800">{previewModulItem.penulis || user?.nama || "Guru Pengampu"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Status</span>
                      <span className="font-bold text-emerald-600">TERVERIFIKASI GURU</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: previewModulItem.isi }} />
                </div>

                {/* Attached Lampiran Section */}
                {previewModulItem.lampiran && previewModulItem.lampiran.length > 0 && (
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Paperclip className="h-4 w-4 text-blue-600" />
                      <span>Berkas Lampiran Dokumen ({previewModulItem.lampiran.length} Berkas):</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewModulItem.lampiran.map((f: any) => (
                        <div key={f.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <File className="h-4 w-4 text-blue-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-bold text-slate-800 block truncate">{f.nama}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{f.tipe} • {f.ukuran}</span>
                            </div>
                          </div>
                          {f.url && (
                            <a
                              href={f.url}
                              download={f.nama}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-bold text-[11px] px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition shrink-0 flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              <span>Unduh</span>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    const itemToEdit = previewModulItem;
                    setPreviewModulItem(null);
                    handleOpenEditModul(itemToEdit);
                  }}
                  className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Modul Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModulItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: KUSTUMISASI TEMPLATE SEKOLAH & KOP SURAT */}
        {isSchoolTemplateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 my-auto overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-600" />
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Pengaturan Template Standar Sekolah</h3>
                    <p className="text-[11px] text-slate-500">Sesuaikan metadata Kop Surat & Penandatangan untuk Ekspor Modul Ajar</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSchoolTemplateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                {/* Header Instansi / Dinas */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Header Dinas / Instansi</label>
                  <input
                    type="text"
                    value={schoolTemplate.provinsiDinas}
                    onChange={(e) => setSchoolTemplate({ ...schoolTemplate, provinsiDinas: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500"
                    placeholder="Contoh: PEMERINTAH PROVINSI JAWA BARAT - DINAS PENDIDIKAN"
                  />
                </div>

                {/* Nama Sekolah & Alamat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nama Satuan Pendidikan (Sekolah)</label>
                    <input
                      type="text"
                      value={schoolTemplate.namaSekolah}
                      onChange={(e) => setSchoolTemplate({ ...schoolTemplate, namaSekolah: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 font-bold focus:outline-blue-500"
                      placeholder="SMA NEGERI 2 CIAMIS"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Kota / Kabupaten</label>
                    <input
                      type="text"
                      value={schoolTemplate.kotaKabupaten}
                      onChange={(e) => setSchoolTemplate({ ...schoolTemplate, kotaKabupaten: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500"
                      placeholder="Ciamis"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Alamat Lengkap Sekolah</label>
                  <input
                    type="text"
                    value={schoolTemplate.alamatSekolah}
                    onChange={(e) => setSchoolTemplate({ ...schoolTemplate, alamatSekolah: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500"
                    placeholder="Jl. Ir. H. Juanda No. 177 Ciamis"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Kontak (Telepon & Email)</label>
                    <input
                      type="text"
                      value={schoolTemplate.teleponEmail}
                      onChange={(e) => setSchoolTemplate({ ...schoolTemplate, teleponEmail: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500"
                      placeholder="Telp: (0265) 771032 • Email: info@sman2ciamis.sch.id"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Tahun Pelajaran</label>
                    <input
                      type="text"
                      value={schoolTemplate.tahunPelajaran}
                      onChange={(e) => setSchoolTemplate({ ...schoolTemplate, tahunPelajaran: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500 font-mono font-bold"
                      placeholder="2025/2026"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <h4 className="font-bold text-slate-800 text-xs mb-3">Informasi Penandatangan Dokumen</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase">Kepala Sekolah</span>
                      <div>
                        <label className="block text-[10px] text-slate-500">Nama & Gelar</label>
                        <input
                          type="text"
                          value={schoolTemplate.namaKepalaSekolah}
                          onChange={(e) => setSchoolTemplate({ ...schoolTemplate, namaKepalaSekolah: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">NIP Kepala Sekolah</label>
                        <input
                          type="text"
                          value={schoolTemplate.nipKepalaSekolah}
                          onChange={(e) => setSchoolTemplate({ ...schoolTemplate, nipKepalaSekolah: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono focus:outline-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase">Guru Mata Pelajaran</span>
                      <div>
                        <label className="block text-[10px] text-slate-500">Nama Guru Pengampu</label>
                        <input
                          type="text"
                          value={schoolTemplate.namaGuru}
                          onChange={(e) => setSchoolTemplate({ ...schoolTemplate, namaGuru: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">NIP Guru</label>
                        <input
                          type="text"
                          value={schoolTemplate.nipGuru}
                          onChange={(e) => setSchoolTemplate({ ...schoolTemplate, nipGuru: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono focus:outline-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                <span className="text-[11px] text-emerald-700 font-medium">✓ Tersimpan otomatis untuk seluruh dokumen</span>
                <button
                  type="button"
                  onClick={() => setIsSchoolTemplateModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Selesai & Simpan Template
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
