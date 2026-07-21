import React, { useState } from "react";
import {
  GraduationCap,
  UserCheck,
  CheckSquare,
  Award,
  Activity,
  Layers,
  BookMarked,
  Download,
  Upload,
  Search,
  AlertTriangle,
  TrendingUp,
  Bot,
  Loader2,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Clock,
  ArrowRight,
  UserPlus,
  ChevronRight,
  Info,
  CheckCircle,
  TrendingDown,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Analitika, ELEMEN_INFORMATIKA, User } from "../types";

// Enriched analytics structure reflecting our updated backend response
interface EnrichedAnalitika extends Analitika {
  studentsPerformance?: {
    id: string;
    nama: string;
    nisn: string;
    kelas: string;
    avgScore: number;
    completedTasks: number;
    attendanceRate: number;
  }[];
  remediationList?: {
    id: string;
    nama: string;
    nisn: string;
    kelas: string;
    avgScore: number;
    completedTasks: number;
    attendanceRate: number;
  }[];
  riskList?: {
    id: string;
    nama: string;
    nisn: string;
    kelas: string;
    avgScore: number;
    completedTasks: number;
    attendanceRate: number;
  }[];
  recentSubmissions?: {
    id: string;
    siswaNama: string;
    tugasJudul: string;
    nilai?: number;
    tanggal: string;
    status: string;
  }[];
  totalStudents?: number;
  totalAssignments?: number;
  totalMateris?: number;
}

interface AnalitikaViewProps {
  user: User;
  analitika: EnrichedAnalitika;
  onRefresh?: () => void;
}

export const AnalitikaView: React.FC<AnalitikaViewProps> = ({ user, analitika, onRefresh }) => {
  // Navigation for Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<"ringkasan" | "monitoring" | "analitik" | "ekspor" | "impor">("ringkasan");

  // Selected Student Profile Modal
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any | null>(null);

  // Monitoring States
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("SEMUA");

  // Import States
  const [importType, setImportType] = useState<"siswa" | "nilai" | "presensi">("siswa");
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  // AI Analytics Advisor States
  const [aiReport, setAiReport] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  // Safely destruct stats with backend fallbacks
  const studentsPerformance = analitika.studentsPerformance || [];
  const remediationList = analitika.remediationList || [];
  const riskList = analitika.riskList || [];
  const recentSubmissions = analitika.recentSubmissions || [];
  const totalStudents = analitika.totalStudents || studentsPerformance.length || 5;
  const totalAssignments = analitika.totalAssignments || 2;
  const totalMateris = analitika.totalMateris || 2;

  // Render simple markdown headers, bold text, and bullet lists
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      let content = line.trim();
      if (!content) return <div key={idx} className="h-2"></div>;

      if (content.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 flex items-center gap-2 border-b border-slate-100 pb-1">{content.replace("### ", "")}</h4>;
      }
      if (content.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-bold text-indigo-950 mt-5 mb-2.5">{content.replace("## ", "")}</h3>;
      }
      if (content.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-extrabold text-indigo-950 mt-6 mb-3 border-l-4 border-indigo-600 pl-3">{content.replace("# ", "")}</h2>;
      }
      if (content.startsWith("- ") || content.startsWith("* ")) {
        return <li key={idx} className="text-xs text-slate-600 ml-5 list-disc my-1 leading-relaxed">{content.substring(2)}</li>;
      }

      // Format inline bold text **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-800">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      return <p key={idx} className="text-xs text-slate-600 leading-relaxed my-1.5">{parts.length > 0 ? parts : content}</p>;
    });
  };

  // Generate Sample templates for importers
  const handleLoadTemplate = () => {
    if (importType === "siswa") {
      setImportText(`nama,kelas,nisn,email\n"Aditya Saputra","X-1","0082233401","aditya@siswa.lmtms.sch.id"\n"Farhan Maulana","X-1","0082233402","farhan@siswa.lmtms.sch.id"\n"Siti Aminah","X-1","0082233403","siti@siswa.lmtms.sch.id"`);
    } else if (importType === "nilai") {
      setImportText(`siswaNama,tugasJudul,nilai,elemen,catatanGuru\n"Ahmad Dhani","Tugas Praktikum Mandiri: Algoritma Kasir Sederhana",90,AP,"Kreatif dengan percabangan bertingkat"\n"Budi Setiawan","Tugas Praktikum Mandiri: Algoritma Kasir Sederhana",82,AP,"Algoritma berjalan lancar"\n"Citra Lestari","Kuis Diagnostik Berpikir Komputasional",95,BK,"Sangat teliti menjawab"`);
    } else if (importType === "presensi") {
      setImportText(`siswaNama,tanggal,status,catatan\n"Ahmad Dhani","2026-07-15","HADIR","Siswa sangat antusias"\n"Dedi Kurniawan","2026-07-15","ALPA","Tanpa keterangan"\n"Elly Setyowati","2026-07-15","IZIN","Surat izin kegiatan pramuka"`);
    }
  };

  // CSV Simple Parser Utility
  const parseCSVData = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, "").trim());
    return lines.slice(1).map(line => {
      // split commas ignoring commas inside quotes
      const values: string[] = [];
      let currentVal = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim());
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());
      
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        let val = values[index] || "";
        val = val.replace(/^["']|["']$/g, ""); // strip quotes
        obj[header] = val;
      });
      return obj;
    });
  };

  // Submit Import Payload to API
  const handleImportData = async () => {
    if (!importText.trim()) {
      setImportStatus({ success: false, message: "Teks data impor masih kosong." });
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      let parsedData: any[] = [];
      if (importText.trim().startsWith("[")) {
        parsedData = JSON.parse(importText);
      } else {
        parsedData = parseCSVData(importText);
      }

      if (parsedData.length === 0) {
        throw new Error("Gagal mengurai baris CSV. Pastikan tajuk kolom terisi dengan benar.");
      }

      const res = await fetch("/api/analitika/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role,
        },
        body: JSON.stringify({
          type: importType,
          data: parsedData,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setImportStatus({ success: true, message: result.message || "Data berhasil diimpor!" });
        setImportText("");
        if (onRefresh) onRefresh();
      } else {
        setImportStatus({ success: false, message: result.message || "Gagal mengimpor data." });
      }
    } catch (err: any) {
      setImportStatus({ success: false, message: err.message || "Gagal mengurai teks data. Periksa format CSV/JSON Anda." });
    } finally {
      setIsImporting(false);
    }
  };

  // Direct client-side CSV downloads
  const handleExportData = (type: "performa" | "remedial" | "presensi") => {
    let headers: string[] = [];
    let rows: any[] = [];
    let filename = "";

    if (type === "performa") {
      filename = "laporan_kinerja_siswa.csv";
      headers = ["Nama Siswa", "NISN", "Kelas", "Rata-Rata Nilai", "Tugas Diselesaikan", "Rasio Kehadiran (%)"];
      rows = studentsPerformance.map(s => [
        `"${s.nama}"`,
        `"${s.nisn}"`,
        `"${s.kelas}"`,
        s.avgScore,
        s.completedTasks,
        s.attendanceRate
      ]);
    } else if (type === "remedial") {
      filename = "daftar_remedial_kktp.csv";
      headers = ["Nama Siswa", "NISN", "Kelas", "Rata-Rata Nilai", "Status"];
      rows = remediationList.map(s => [
        `"${s.nama}"`,
        `"${s.nisn}"`,
        `"${s.kelas}"`,
        s.avgScore,
        "\"PERLU REMEDIAL < 75 KKTP\""
      ]);
    } else if (type === "presensi") {
      filename = "laporan_kehadiran_kumulatif.csv";
      headers = ["Nama Siswa", "Kelas", "NISN", "Persentase Kehadiran (%)", "Kategori"];
      rows = studentsPerformance.map(s => [
        `"${s.nama}"`,
        `"${s.kelas}"`,
        `"${s.nisn}"`,
        s.attendanceRate,
        s.attendanceRate < 80 ? "\"RISIKO TINGGI < 80%\"" : "\"BAIK\""
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Request AI Evaluation report from Gemini API
  const handleRequestAiAdvice = async () => {
    setIsGeneratingAi(true);
    setAiError("");
    setAiReport("");

    const elementsSummary = analitika.pencapaianElemen?.map(e => `${e.elemen}: ${e.nilai}`).join(", ") || "BK: 90, AP: 82";

    const aiPrompt = `Lakukan audit performa kurikulum, analisis ketuntasan, dan diagnosis pedagogis berbasis data riil LMS Kelas X-1 Informatika berikut:
- Persentase Presensi Kumulatif: ${analitika.kehadiranRataRata}%
- Rasio Pengumpulan Tugas: ${analitika.tugasDiselesaikan}%
- Nilai Kognitif Rata-Rata Kelas: ${analitika.nilaiRataRata}/100
- Jumlah Siswa Remedial (di bawah 75 KKTP): ${remediationList.length} dari ${totalStudents} siswa
- Jumlah Siswa Berisiko Absensi Rendah (<80%): ${riskList.length} siswa
- Skor Rata-Rata per Elemen Informatika: ${elementsSummary}

Susunlah dokumen Analisis Refleksi Guru Terpadu menggunakan rumus 8-3-3-4 dengan poin-poin terstruktur:
1. ### Audit Pencapaian Kompetensi Elemen Kurikulum (BK, AP, TIK, SK, JKI, AD, DSI, PLB)
2. ### Diagnosis Siswa Berisiko Rendah & Rencana Intervensi Remedial Taktis
3. ### Strategi Pembelajaran Bermakna (Meaningful) & Diferensiasi Konten
4. ### Program Tindak Lanjut Pemulihan Keaktifan Belajar Siswa LMTMS`;

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role,
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          jenisDokumen: "REFLEKSI",
          elemen: "BK",
          kelas: "X"
        }),
      });

      const result = await res.json();
      if (result.success) {
        setAiReport(result.content);
      } else {
        setAiError(result.message || "Gagal mendapatkan saran AI.");
      }
    } catch (err: any) {
      setAiError("Terjadi kesalahan koneksi atau konfigurasi kunci API server.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filter students for display
  const filteredStudents = studentsPerformance.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm);
    const matchesClass = classFilter === "SEMUA" || s.kelas === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6" id="dashboard-reporting-view">
      {/* Jumbotron Selamat Datang */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-md border border-slate-800" id="welcome-jumbotron">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
          <GraduationCap className="h-72 w-72" />
        </div>
        <div className="max-w-3xl relative z-10 space-y-2">
          <span className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase">
            Analisis Evaluasi & Reporting Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mt-2 mb-1 tracking-tight">
            Dashboard & Laporan Kinerja Akademik
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
            Sistem evaluasi komprehensif Kurikulum Merdeka LMTMS. Kelola pelaporan, monitoring keaktifan siswa luring, ekspor draf rapor, audit kesenjangan materi, dan impor lembar penilaian fisik secara instan.
          </p>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4" id="kpi-stats-grid">
        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between" id="kpi-card-presensi">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kehadiran Kelas</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-2xl font-display font-black text-indigo-600">{analitika.kehadiranRataRata}%</h3>
            <span className="text-[10px] text-emerald-600 font-medium font-mono">Target &gt;90%</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
            <span>Kondisi Stabil</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between" id="kpi-card-tugas">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kepatuhan Tugas</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-2xl font-display font-black text-teal-600">{analitika.tugasDiselesaikan}%</h3>
            <span className="text-[10px] text-indigo-600 font-medium font-mono">Tepat Waktu</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <CheckSquare className="h-3.5 w-3.5 text-teal-500" />
            <span>Evaluasi Berjalan</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between" id="kpi-card-nilai">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rerata Kognitif</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-2xl font-display font-black text-rose-600">{analitika.nilaiRataRata}</h3>
            <span className="text-[10px] text-slate-400 font-mono">/100</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <Award className="h-3.5 w-3.5 text-rose-500" />
            <span>KKTP: 75</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Siswa Aktif</span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-2xl font-display font-black text-slate-800">{totalStudents}</h3>
            <span className="text-[10px] text-slate-400">orang</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <UserPlus className="h-3.5 w-3.5 text-slate-500" />
            <span>Fase E / Kelas X</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tugas</span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-2xl font-display font-black text-slate-800">{totalAssignments}</h3>
            <span className="text-[10px] text-slate-400">kuis & tugas</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Diterbitkan</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modul Pembelajaran</span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className="text-2xl font-display font-black text-slate-800">{totalMateris}</h3>
            <span className="text-[10px] text-slate-400">materi</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
            <BookMarked className="h-3.5 w-3.5 text-slate-500" />
            <span>8 Elemen Terisi</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION BAR */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 whitespace-nowrap scrollbar-none" id="analitika-subtabs">
        <button
          onClick={() => setActiveSubTab("ringkasan")}
          className={`px-4 py-3 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeSubTab === "ringkasan"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
          id="tab-ringkasan"
        >
          <Activity className="h-4 w-4" />
          <span>Grafik & Statistik</span>
        </button>
        <button
          onClick={() => setActiveSubTab("monitoring")}
          className={`px-4 py-3 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeSubTab === "monitoring"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
          id="tab-monitoring"
        >
          <Clock className="h-4 w-4" />
          <span>Monitoring Real-Time</span>
        </button>
        <button
          onClick={() => setActiveSubTab("analitik")}
          className={`px-4 py-3 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeSubTab === "analitik"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
          id="tab-analitik"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Analitik Diagnostik & AI</span>
        </button>
        <button
          onClick={() => setActiveSubTab("ekspor")}
          className={`px-4 py-3 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeSubTab === "ekspor"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
          id="tab-ekspor"
        >
          <Download className="h-4 w-4" />
          <span>Ekspor Laporan</span>
        </button>
        <button
          onClick={() => setActiveSubTab("impor")}
          className={`px-4 py-3 font-display font-bold text-xs border-b-2 transition flex items-center gap-2 ${
            activeSubTab === "impor"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
          id="tab-impor"
        >
          <Upload className="h-4 w-4" />
          <span>Impor Data Mandiri</span>
        </button>
      </div>

      {/* TAB CONTENT VIEWS */}
      
      {/* 1. GRAFIK & RINGKASAN */}
      {activeSubTab === "ringkasan" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="analytics-charts-grid">
            {/* Chart 1: Distribusi Nilai */}
            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs" id="chart-distribusi-nilai">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Distribusi Capaian Nilai Siswa</span>
                </h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">LMTMS Kognitif</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analitika.distribusiNilai}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="rentang" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px" }} />
                    <Bar dataKey="jumlah" name="Jumlah Siswa" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Capaian per Elemen Informatika */}
            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs" id="chart-capaian-elemen">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-teal-600" />
                  <span>Kinerja Rata-Rata per Elemen Informatika</span>
                </h3>
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full font-bold">Radar Kurikulum</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analitika.pencapaianElemen?.map(e => ({ ...e, target: 75 })) || []}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="elemen" tick={{ fontSize: 11, fontWeight: "bold", fill: "#334155" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                    <Radar name="Target KKTP (75)" dataKey="target" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.02} strokeDasharray="4 4" />
                    <Radar name="Rerata Kelas" dataKey="nilai" stroke="#0d9488" fill="#0d9488" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px", pt: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Elemen Kurikulum Merdeka Card & Deskripsi */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs" id="elemen-pembelajaran-card">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookMarked className="h-4.5 w-4.5 text-indigo-600" />
              <span>8 Elemen Capaian Pembelajaran Informatika SMA (Kurikulum Merdeka)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="elemen-cards-grid">
              {ELEMEN_INFORMATIKA.map((el) => {
                const avgScore = analitika.pencapaianElemen?.find(e => e.elemen === el.kode)?.nilai || 0;
                
                // Determine Badge/Lencana Capaian & Target Status
                let lencanaText = "💤 Belum Ada Data";
                let lencanaStyle = "bg-slate-50 text-slate-500 border-slate-200";
                let targetStatusText = "Menunggu";
                let targetStatusStyle = "bg-slate-100 text-slate-600 border-slate-200";
                let isTuntas = false;

                if (avgScore >= 80) {
                  lencanaText = "🎓 Sangat Baik";
                  lencanaStyle = "bg-blue-50 text-blue-800 border-blue-200 font-bold shadow-2xs";
                  targetStatusText = "Sudah matang";
                  targetStatusStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
                  isTuntas = true;
                } else if (avgScore >= 75) {
                  lencanaText = "📈 Baik";
                  lencanaStyle = "bg-teal-50 text-teal-800 border-teal-200 font-bold shadow-2xs";
                  targetStatusText = "Cukup";
                  targetStatusStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  isTuntas = true;
                } else if (avgScore >= 70) {
                  lencanaText = "📋 Cukup";
                  lencanaStyle = "bg-amber-50 text-amber-800 border-amber-200 font-bold shadow-2xs";
                  targetStatusText = "Cukup";
                  targetStatusStyle = "bg-amber-50 text-amber-700 border-amber-200 font-bold";
                  isTuntas = true;
                } else if (avgScore > 0) {
                  lencanaText = "⚠️ Perlu Intervensi";
                  lencanaStyle = "bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse";
                  targetStatusText = "Lanjutkan";
                  targetStatusStyle = "bg-rose-50 text-rose-700 border-rose-200 font-bold";
                  isTuntas = false;
                }

                return (
                  <div key={el.kode} className="p-4 border border-slate-200 bg-white hover:border-slate-300 rounded-xl transition shadow-2xs flex flex-col justify-between group h-full" id={`elemen-card-${el.kode}`}>
                    <div className="space-y-2.5">
                      {/* Card Header with Badges */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-bold font-mono">
                          {el.kode}
                        </span>
                        
                        {/* Target Achieved Pill */}
                        {avgScore > 0 && (
                          <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full border ${targetStatusStyle}`}>
                            {avgScore >= 75 ? (
                              <CheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />
                            )}
                            <span>{targetStatusText}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition leading-snug">{el.nama}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{el.deskripsi}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      {/* Achievement Badge (Lencana) */}
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-medium">Lencana Capaian:</span>
                        <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider ${lencanaStyle}`}>
                          {lencanaText}
                        </span>
                      </div>

                      {/* Visual score gauge */}
                      {avgScore > 0 ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Skor Rerata:</span>
                            <span className={`font-bold ${isTuntas ? 'text-emerald-600' : 'text-rose-600'}`}>{avgScore} / 100</span>
                          </div>
                          
                          {/* Beautiful Dual-Mark Progress Bar */}
                          <div className="relative w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            {/* Target threshold line mark (at 75%) */}
                            <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-slate-300 z-10" title="Kriteria Kelulusan KKTP (75)" />
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isTuntas 
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                                  : "bg-gradient-to-r from-rose-500 to-amber-500"
                              }`}
                              style={{ width: `${avgScore}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[8px] text-slate-400">
                            <span>0</span>
                            <span className="font-bold text-slate-500">KKTP: 75</span>
                            <span>100</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2.5 bg-slate-50 rounded-lg border border-dashed border-slate-150">
                          <span className="text-[10px] text-slate-400 font-medium">Belum ada evaluasi nilai</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. MONITORING REAL-TIME */}
      {activeSubTab === "monitoring" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Submissions Feed */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Log Monitoring Tugas & Absensi</span>
              </h3>
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub: any) => (
                    <div key={sub.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl transition flex flex-col gap-1 text-[11px] relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{sub.siswaNama}</span>
                        <span className="text-[9px] text-slate-400">{new Date(sub.tanggal).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <span className="text-slate-500 leading-tight">Mengerjakan: <b className="text-slate-700">{sub.tugasJudul}</b></span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded text-[9px]">Selesai</span>
                        {sub.nilai !== undefined && sub.nilai !== null ? (
                          <span className="text-xs font-mono font-bold text-indigo-600">Skor: {sub.nilai}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Belum Dinilai</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">Belum ada pengumpulan aktivitas terbaru hari ini.</div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Streaming Aktif</span>
              <button onClick={() => onRefresh && onRefresh()} className="hover:text-indigo-600 flex items-center gap-1 transition">
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>
          </div>

          {/* Interactive Students Performance Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span>Daftar Presensi & Nilai Evaluasi Siswa</span>
                </h3>
                
                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 w-36 sm:w-48"
                    />
                  </div>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-indigo-500"
                  >
                    <option value="SEMUA">Semua Kelas</option>
                    <option value="X-1">Kelas X-1</option>
                    <option value="XI-1">Kelas XI-1</option>
                  </select>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Rombel</th>
                      <th className="p-3 text-center">Kehadiran (%)</th>
                      <th className="p-3 text-center">Tugas Selesai</th>
                      <th className="p-3 text-center">Rata-Rata Nilai</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((s) => {
                        const hasRemedial = s.avgScore > 0 && s.avgScore < 75;
                        const hasAbsentWarning = s.attendanceRate < 80;
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-3 font-semibold text-slate-800">
                              <button
                                onClick={() => setSelectedStudentProfile(s)}
                                className="hover:text-indigo-600 hover:underline text-left font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded transition"
                                title="Klik untuk melihat detail profil kemajuan belajar siswa"
                              >
                                {s.nama}
                              </button>
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[10px]">{s.nisn}</td>
                            <td className="p-3">{s.kelas}</td>
                            <td className="p-3 text-center font-mono font-medium">
                              <span className={hasAbsentWarning ? "text-rose-600 font-bold" : "text-slate-700"}>
                                {s.attendanceRate}%
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono">{s.completedTasks} tugas</td>
                            <td className="p-3 text-center font-mono font-bold">
                              {s.avgScore > 0 ? (
                                <span className={hasRemedial ? "text-rose-600" : "text-teal-600"}>
                                  {s.avgScore}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              {hasRemedial ? (
                                <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[9px] font-bold">
                                  Remedial
                                </span>
                              ) : hasAbsentWarning ? (
                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold">
                                  Absensi &lt;80%
                                </span>
                              ) : s.avgScore >= 75 ? (
                                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-bold">
                                  Tuntas KKTP
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px]">
                                  Belum Ada Nilai
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">Tidak ada data siswa ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-slate-400 text-left">
              * KKTP (Kriteria Ketercapaian Tujuan Pembelajaran) bernilai minimal <b>75</b> untuk mata pelajaran Informatika SMA.
            </div>
          </div>
        </div>
      )}

      {/* 3. ANALITIK DIAGNOSTIK & AI ADVISOR */}
      {activeSubTab === "analitik" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attention Tracker 1: Remedial */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between" id="panel-prioritas-remedial">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                    <span>Panel Prioritas Remedial</span>
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[9px] font-bold">
                    Target Pencapaian (KKTP): 75
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
                  Daftar siswa di bawah kriteria kelengkapan materi, diurutkan berdasarkan prioritas pendampingan kritis (skor terendah).
                </p>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {remediationList.length > 0 ? (
                    [...remediationList]
                      .sort((a, b) => (a.avgScore || 0) - (b.avgScore || 0))
                      .map((s) => {
                        const isCritical = (s.avgScore || 0) < 60;
                        return (
                          <div
                            key={s.id}
                            onClick={() => setSelectedStudentProfile(s)}
                            className="p-2.5 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors group"
                            title="Klik untuk melihat detail capaian & rekomendasi belajar"
                          >
                            <div>
                              <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                                <span>{s.nama}</span>
                                <ChevronRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">Kelas {s.kelas} • NISN {s.nisn}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-rose-600">{s.avgScore}</span>
                                <span className={`text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wide ${
                                  isCritical ? "bg-rose-600 text-white animate-pulse" : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}>
                                  {isCritical ? "Kritis" : "Sedang"}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 italic">Rekomendasi: {isCritical ? "Diferensiasi Penuh" : "Tugas Penguatan"}</span>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs font-medium">Luar Biasa! Semua siswa mencapai target kelulusan KKTP (75).</div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 leading-normal border-t border-slate-100 pt-3">
                💡 <b>Rekomendasi Belajar Berikutnya:</b> Berikan pendampingan kelompok kecil bagi siswa berstatus <b>Kritis</b>, dan tugas berbasis modul mandiri untuk status <b>Sedang</b>.
              </div>
            </div>

            {/* Attention Tracker 2: Attendance Risk */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-amber-600">
                  <TrendingDown className="h-4.5 w-4.5" />
                  <span>Siswa Risiko Absensi Tinggi</span>
                </h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {riskList.length > 0 ? (
                    riskList.map((s) => (
                      <div key={s.id} className="p-2.5 bg-amber-50/50 border border-amber-100/60 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{s.nama}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Kelas {s.kelas} • Kehadiran {s.attendanceRate}%</p>
                        </div>
                        <span className="font-mono font-bold text-amber-600 text-right bg-amber-100/40 px-2 py-0.5 rounded">
                          Sakit / Alpa
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs font-medium">Bagus! Seluruh siswa memiliki tingkat kehadiran stabil di atas 80%.</div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 leading-normal">
                Rasio kehadiran di bawah 80% dapat menyebabkan hilangnya hak kelayakan ujian akhir semester luring sesuai regulasi.
              </div>
            </div>

            {/* Curriculum Gaps */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Kesenjangan Capaian Kurikulum</span>
                </h4>
                <div className="space-y-3">
                  {analitika.pencapaianElemen && analitika.pencapaianElemen.length > 0 ? (
                    analitika.pencapaianElemen.map((e) => {
                      const percentage = e.nilai;
                      let barColor = "bg-rose-500";
                      if (percentage >= 85) barColor = "bg-teal-500";
                      else if (percentage >= 75) barColor = "bg-indigo-500";
                      
                      return (
                        <div key={e.elemen} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700">{e.elemen} - {ELEMEN_INFORMATIKA.find(el => el.kode === e.elemen)?.nama || "Elemen"}</span>
                            <span className="font-mono font-bold text-slate-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-400 text-xs py-8 text-center">Menghitung matriks gap...</div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 leading-normal">
                Nilai capaian per elemen dihitung kumulatif dari pengumpulan kuis, ujian luring, serta tugas terstruktur di semester berjalan.
              </div>
            </div>
          </div>

          {/* AI ADVISORY GENERATOR CARD */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-indigo-100 p-6 rounded-2xl shadow-xs">
            <div className="flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Konsultasi AI Pedagogis</span>
                </div>
                <h3 className="text-base font-bold text-indigo-950">Analisis Diagnostic AI (Gemini Agent)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan model AI Gemini untuk melakukan audit otomatis kesenjangan materi, pencarian solusi diferensiasi, serta rekomendasi rancangan remedial taktis untuk guru informatika berdasarkan status nilai kelas saat ini secara instan.
                </p>
              </div>
              <button
                disabled={isGeneratingAi}
                onClick={handleRequestAiAdvice}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Minta Analisis AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Response Display Area */}
            {aiReport && (
              <div className="bg-white border border-indigo-100/70 p-5 rounded-2xl shadow-2xs mt-5 select-text relative">
                <div className="absolute right-4 top-4 text-[9px] text-indigo-500 font-semibold uppercase tracking-wider flex items-center gap-1 bg-indigo-50/60 border border-indigo-100/40 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" /> Rekomendasi Guru AI
                </div>
                <div className="prose prose-xs max-w-none">
                  {renderMarkdown(aiReport)}
                </div>
              </div>
            )}

            {aiError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                <span>{aiError} (Gemini fallback luring/offline diaktifkan jika kunci API belum terisi)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. EKSPOR LAPORAN */}
      {activeSubTab === "ekspor" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Download className="h-4.5 w-4.5 text-indigo-600" />
              <span>Ekspor Lembar Pelaporan & Rapor Kelas</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-normal max-w-3xl">
              Unduh kompilasi data presensi harian, nilai evaluasi, kuis kognitif, serta tingkat pencapaian elemen dalam format standar CSV/JSON untuk diunggah langsung ke platform e-Rapor resmi Kemendikbudristek RI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="p-5 border border-slate-200 bg-slate-50 hover:bg-white rounded-xl transition shadow-2xs flex flex-col justify-between h-48">
                <div>
                  <span className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FileSpreadsheet className="h-5 w-5" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 mt-3">Laporan Kinerja Belajar (CSV)</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Berisi kompilasi nama siswa, NISN, rombel, rata-rata nilai, dan persentase kehadiran lengkap.
                  </p>
                </div>
                <button
                  onClick={() => handleExportData("performa")}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Lembar Kinerja</span>
                </button>
              </div>

              {/* Card 2 */}
              <div className="p-5 border border-slate-200 bg-slate-50 hover:bg-white rounded-xl transition shadow-2xs flex flex-col justify-between h-48">
                <div>
                  <span className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-50 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 mt-3">Daftar Remedial Siswa (CSV)</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Daftar terperinci siswa yang tidak memenuhi kriteria kelayakan KKTP 75 untuk tindak lanjut cepat.
                  </p>
                </div>
                <button
                  onClick={() => handleExportData("remedial")}
                  className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Daftar Remedial</span>
                </button>
              </div>

              {/* Card 3 */}
              <div className="p-5 border border-slate-200 bg-slate-50 hover:bg-white rounded-xl transition shadow-2xs flex flex-col justify-between h-48">
                <div>
                  <span className="inline-flex items-center justify-center p-2 rounded-lg bg-teal-50 text-teal-600">
                    <UserCheck className="h-5 w-5" />
                  </span>
                  <h4 className="font-bold text-xs text-slate-800 mt-3">Laporan Presensi Kumulatif (CSV)</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Berisi log akumulasi kehadiran presensi harian siswa untuk evaluasi keaktifan luring semester genap.
                  </p>
                </div>
                <button
                  onClick={() => handleExportData("presensi")}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Rekap Presensi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Printable Report Card Preview Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative" id="report-print-preview">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Printer className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Lembar Rapor Preview & Cetak Luring</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Versi Cetak Kertas A4 Standar LMTMS Luring</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak / Print PDF</span>
              </button>
            </div>

            {/* Simulated School Report Paper */}
            <div className="border border-slate-300 p-6 bg-slate-50/30 rounded-xl space-y-6 max-w-2xl mx-auto print:border-0 print:p-0 select-text" id="school-rapor-printable">
              {/* Header Surat */}
              <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-4">
                <h2 className="text-base font-black text-slate-800 uppercase tracking-tight">PEMERINTAH PROVINSI PORTAL BELAJAR</h2>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">SMA NEGERI INFORMATIKA INDONESIA</h3>
                <p className="text-[10px] text-slate-500 font-mono">Jl. Raya Siber Pendidikan Mandiri, No. 102 Email: info@lmtms.sch.id</p>
              </div>

              {/* metadata */}
              <div className="grid grid-cols-2 text-[11px] text-slate-600 leading-relaxed gap-2 border-b border-slate-200 pb-3">
                <div>
                  <p><b>Mata Pelajaran</b> : Informatika (Kurikulum Merdeka)</p>
                  <p><b>Fase / Sasaran Kelas</b> : Fase E / Kelas X-1</p>
                  <p><b>Tahun Pelajaran</b> : 2024/2025 Genap</p>
                </div>
                <div className="text-right">
                  <p><b>Pendidik Utama</b> : Yogi Suprayogi, S.Kom.</p>
                  <p><b>NIP</b> : 198905202015031002</p>
                  <p><b>Tanggal Dokumen</b> : {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
                </div>
              </div>

              {/* Rapor Stats List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Rekapitulasi Kinerja Kognitif & Afektif Siswa</h4>
                <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                      <th className="p-2 border-r border-slate-300">Nama Siswa</th>
                      <th className="p-2 border-r border-slate-300 text-center">NISN</th>
                      <th className="p-2 border-r border-slate-300 text-center">Presensi (%)</th>
                      <th className="p-2 border-r border-slate-300 text-center">Nilai Rata-Rata</th>
                      <th className="p-2 text-right">Kelayakan KKTP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentsPerformance.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-2 border-r border-slate-300 font-medium text-slate-800">{s.nama}</td>
                        <td className="p-2 border-r border-slate-300 font-mono text-center">{s.nisn}</td>
                        <td className="p-2 border-r border-slate-300 text-center">{s.attendanceRate}%</td>
                        <td className="p-2 border-r border-slate-300 text-center font-bold">{s.avgScore > 0 ? s.avgScore : "N/A"}</td>
                        <td className="p-2 text-right font-semibold">
                          {s.avgScore >= 75 ? (
                            <span className="text-emerald-700">TUNTAS</span>
                          ) : s.avgScore > 0 ? (
                            <span className="text-rose-700">REMEDIAL</span>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 text-xs text-slate-700 text-center">
                <div className="space-y-12">
                  <p>Mengetahui,<br />Kepala Sekolah SMAN Informatika</p>
                  <p className="underline font-bold">Drs. Belajar Mandiri, M.Pd.<br /><span className="text-[10px] font-mono text-slate-400 font-normal">NIP. 197208151998031001</span></p>
                </div>
                <div className="space-y-12">
                  <p>Guru Mata Pelajaran,<br />Informatika SMA</p>
                  <p className="underline font-bold">Yogi Suprayogi, S.Kom.<br /><span className="text-[10px] font-mono text-slate-400 font-normal">NIP. 198905202015031002</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. IMPOR DATA MANDIRI */}
      {activeSubTab === "impor" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Upload className="h-4.5 w-4.5 text-indigo-600" />
              <span>Impor Data Evaluasi Luring / Eksternal</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-normal max-w-3xl">
              Memasukkan data siswa, rekap presensi fisik, maupun lembar nilai kuis cetak secara langsung ke server JSON LMTMS. Anda dapat menyalin data tabel dari program Excel, lalu menempelkannya di bawah ini menggunakan format CSV.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Configuration panel */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Pilih Tipe Impor Dokumen
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImportType("siswa");
                          setImportText("");
                          setImportStatus(null);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          importType === "siswa"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-3xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50/80"
                        }`}
                      >
                        <span>Impor Daftar Siswa Baru</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImportType("nilai");
                          setImportText("");
                          setImportStatus(null);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          importType === "nilai"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-3xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50/80"
                        }`}
                      >
                        <span>Impor Rekap Nilai Evaluasi</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setImportType("presensi");
                          setImportText("");
                          setImportStatus(null);
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          importType === "presensi"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-3xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50/80"
                        }`}
                      >
                        <span>Impor Lembar Presensi Kelas</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={handleLoadTemplate}
                      className="w-full py-2 border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Muat Contoh Templat CSV</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex gap-3">
                  <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[10px] text-slate-500 leading-relaxed">
                    <p className="font-bold text-slate-700 leading-none mb-1">Panduan Impor Kolom</p>
                    {importType === "siswa" && (
                      <p>Sediakan tajuk kolom wajib: <b>nama</b>, <b>kelas</b>, <b>nisn</b>, <b>email</b>. Baris di bawahnya berisi data terpisah menggunakan tanda koma (CSV).</p>
                    )}
                    {importType === "nilai" && (
                      <p>Sediakan tajuk kolom wajib: <b>siswaNama</b>, <b>tugasJudul</b>, <b>nilai</b>, <b>elemen</b>. Baris di bawahnya diurai otomatis ke tugas terkait.</p>
                    )}
                    {importType === "presensi" && (
                      <p>Sediakan tajuk kolom wajib: <b>siswaNama</b>, <b>tanggal</b> (format YYYY-MM-DD), <b>status</b> (HADIR/IZIN/SAKIT/ALPA), dan <b>catatan</b>.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Data entry text panel */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <textarea
                  rows={10}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`Tempel baris teks CSV di sini...\n\nContoh:\nnama,kelas,nisn,email\n"Ahmad","X-1","001","ahmad@email.com"`}
                  className="w-full p-4 font-mono text-xs text-slate-700 border border-slate-200 rounded-2xl outline-0 bg-slate-50/20 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
                />

                <div className="flex items-center justify-end gap-3">
                  <button
                    disabled={isImporting}
                    onClick={handleImportData}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Mengimpor...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Impor Data Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

                {importStatus && (
                  <div className={`p-4 border rounded-xl flex items-start gap-3 text-xs ${
                    importStatus.success
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-rose-50 border-rose-100 text-rose-800"
                  }`}>
                    {importStatus.success ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold leading-none mb-1">{importStatus.success ? "Impor Berhasil!" : "Gagal Mengimpor Data"}</h4>
                      <p className="leading-relaxed opacity-90">{importStatus.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Student Profile Modal */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col" id="student-profile-modal">
            {/* Modal Header - Official School Report Style */}
            <div className="p-6 border-b-2 border-slate-300 bg-slate-50 rounded-t-2xl relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-900 text-white rounded-xl shadow-md shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                      Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
                    </span>
                    <h3 className="text-lg font-bold text-indigo-950 tracking-tight">
                      RAPOR CAPAIAN KOMPETENSI DIAGNOSTIK
                    </h3>
                    <p className="text-xs text-slate-600 font-mono">
                      Mata Pelajaran: Informatika (Fase E) • SMK Negeri 1 Guru Belajar
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                    title="Cetak Laporan Rapor"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Cetak</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudentProfile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Administrative Student Metadata Grid */}
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                <div>
                  <span className="text-slate-400 block font-medium">Nama Peserta Didik:</span>
                  <span className="font-bold text-slate-800">{selectedStudentProfile.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nomor Induk Siswa (NISN):</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedStudentProfile.nisn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fase / Rombel / Kelas:</span>
                  <span className="font-bold text-slate-800">Fase E / Kelas {selectedStudentProfile.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Tahun Ajaran / Semester:</span>
                  <span className="font-bold text-slate-800">2026/2027 (Ganjil)</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rerata Nilai Tugas</span>
                    <span className="text-2xl font-mono font-bold text-indigo-950">{selectedStudentProfile.avgScore || "-"}</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">KKTP Kelulusan: 75</p>
                  </div>
                  <Award className="h-8 w-8 text-indigo-900/10" />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Persentase Kehadiran</span>
                    <span className="text-2xl font-mono font-bold text-emerald-950">{selectedStudentProfile.attendanceRate}%</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Kehadiran Kelas Fisik</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-emerald-900/10" />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tugas Diselesaikan</span>
                    <span className="text-2xl font-mono font-bold text-sky-950">{selectedStudentProfile.completedTasks} Tugas</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Tugas & Kuis Portofolio</p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-sky-900/10" />
                </div>

                {(() => {
                  const hasPassed = (selectedStudentProfile.avgScore || 0) >= 75;
                  return (
                    <div className={`p-4 rounded-xl border flex items-center justify-between shadow-3xs ${
                      hasPassed 
                        ? "bg-emerald-50 border-emerald-200" 
                        : "bg-rose-50 border-rose-200"
                    }`}>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${hasPassed ? "text-emerald-800" : "text-rose-800"}`}>
                          Predikat Kelulusan
                        </span>
                        <span className={`text-2xl font-mono font-bold block mt-0.5 ${hasPassed ? "text-emerald-950" : "text-rose-950"}`}>
                          {hasPassed ? "TUNTAS KKTP" : "BELUM TUNTAS"}
                        </span>
                        <div className="mt-1">
                          {hasPassed ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[9px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-300">
                              🎯 Layak Pengayaan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-[9px] text-rose-800 bg-white/80 px-2 py-0.5 rounded border border-rose-300 animate-pulse">
                              ⚠️ Wajib Remedial
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle className={`h-8 w-8 ${hasPassed ? "text-emerald-300/40" : "text-rose-300/40"}`} />
                    </div>
                  );
                })()}
              </div>

              {/* Capaian Visual & Laporan Deskripsi Ringkas (2-Column Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Radar Chart */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-3xs">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <Activity className="h-4 w-4 text-indigo-900" />
                      <span>Grafik Radar Capaian Kompetensi</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pemetaan kekuatan & area pengembangan dari 8 elemen informatika.</p>
                  </div>
                  <div className="h-[210px] w-full flex items-center justify-center mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedStudentProfile.elementProgress?.map((e: any) => ({ ...e, target: 75 })) || []}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="elemen" tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                        <Radar name="Target KKTP (75)" dataKey="target" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.01} strokeDasharray="4 4" />
                        <Radar name="Skor Akademik" dataKey="score" stroke="#1e3a8a" fill="#1d4ed8" fillOpacity={0.25} />
                        <Radar name="Penyelesaian (%)" dataKey="completion" stroke="#0ea5e9" fill="#38bdf8" fillOpacity={0.15} />
                        <Tooltip formatter={(value, name) => [value, name === "completion" ? "Penyelesaian (%)" : name === "target" ? "Target KKTP" : "Skor Akademik"]} />
                        <Legend wrapperStyle={{ fontSize: "9px" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ringkasan & Catatan Guru Resmi */}
                {(() => {
                  const elemList = selectedStudentProfile.elementProgress || [];
                  const highestElem = [...elemList].sort((a: any, b: any) => b.score - a.score)[0];
                  const lowestElem = [...elemList].sort((a: any, b: any) => a.score - b.score)[0];
                  
                  const highName = highestElem ? (ELEMEN_INFORMATIKA.find(e => e.kode === highestElem.elemen)?.nama || highestElem.elemen) : "-";
                  const lowName = lowestElem ? (ELEMEN_INFORMATIKA.find(e => e.kode === lowestElem.elemen)?.nama || lowestElem.elemen) : "-";
                  const lowScore = lowestElem ? lowestElem.score : 0;
                  const highScore = highestElem ? highestElem.score : 0;
                  
                  return (
                    <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-3xs flex flex-col justify-between" id="laporan-guru-ringkasan">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <BookMarked className="h-4.5 w-4.5 text-indigo-900" />
                          <span>RINGKASAN DESKRIPSI CAPAIAN KOMPETENSI</span>
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono italic">Kurikulum Merdeka</span>
                      </div>
                      
                      <div className="space-y-3 text-slate-700 text-xs leading-relaxed">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white p-3 border border-slate-150 rounded-xl space-y-1">
                            <span className="text-[8px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                              ✓ Kompetensi Tertinggi
                            </span>
                            <p className="font-bold text-slate-800 mt-1 text-[11px] truncate">{highName}</p>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              Ananda menunjukkan kematangan konseptual serta keterampilan praktis yang sangat luar biasa (Skor: {highScore}/100).
                            </p>
                          </div>

                          <div className="bg-white p-3 border border-slate-150 rounded-xl space-y-1">
                            <span className="text-[8px] font-bold text-rose-800 uppercase tracking-wider bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                              ⚠ Perlu Peningkatan
                            </span>
                            <p className="font-bold text-slate-800 mt-1 text-[11px] truncate">{lowName}</p>
                            <p className="text-[10px] text-slate-500 leading-snug">
                              Ananda masih memerlukan pendampingan remedial intensif untuk memperkuat pemahaman mendasar (Skor: {lowScore}/100).
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <p className="italic text-slate-600 text-[11px] flex items-start gap-1.5 bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-indigo-600 shrink-0 text-base mt-[-2px]">💡</span>
                            <span>
                              <b>Catatan Guru Resmi:</b> Siswa memiliki antusiasme belajar yang baik. Peningkatan kedisiplinan pengumpulan tugas mandiri serta partisipasi aktif di kelas akan membantu peningkatan capaian belajar secara signifikan pada masa mendatang.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* MAJESTIC TABLE: BUKU RAPOR HASIL BELAJAR RESMI */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers className="h-4.5 w-4.5 text-indigo-900" />
                    <span>TABEL CAPAIAN KOMPETENSI INDIVIDUAL (KURIKULUM MERDEKA)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono italic">
                    Data autentik kuis, tugas portofolio & evaluasi berbasis elemen
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-xs bg-white">
                  <table className="min-w-full divide-y divide-slate-300 text-xs">
                    <thead className="bg-slate-50">
                      <tr className="divide-x divide-slate-200">
                        <th scope="col" className="px-3 py-3 text-center font-bold text-slate-700 uppercase tracking-wider w-12">
                          No
                        </th>
                        <th scope="col" className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider w-1/4">
                          Elemen Pembelajaran
                        </th>
                        <th scope="col" className="px-3 py-3 text-center font-bold text-slate-700 uppercase tracking-wider w-16">
                          KKTP
                        </th>
                        <th scope="col" className="px-3 py-3 text-center font-bold text-slate-700 uppercase tracking-wider w-24">
                          Nilai Capaian
                        </th>
                        <th scope="col" className="px-3 py-3 text-center font-bold text-slate-700 uppercase tracking-wider w-28">
                          Predikat
                        </th>
                        <th scope="col" className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                          Catatan Guru Resmi & Rekomendasi Remedial / Pengayaan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {(() => {
                        const elementRecs: Record<string, { rec: string; act: string }> = {
                          "BK": {
                            rec: "Fokus pada latihan dekomposisi masalah kompleks dan pengenalan pola algoritma sederhana. Cobalah latihan flowchart logika.",
                            act: "Tugas Penguatan Berpikir Komputasional"
                          },
                          "TIK": {
                            rec: "Latih integrasi dinamis antar-dokumen perkantoran (mail merge) serta teknik pencarian data kredibel di mesin pencari.",
                            act: "Praktik Pembuatan Dokumen Terintegrasi"
                          },
                          "SK": {
                            rec: "Ulas kembali interaksi hardware-software-brainware, fungsi penting sistem operasi (OS), dan representasi data biner.",
                            act: "Review Arsitektur Komputer & OS"
                          },
                          "JKI": {
                            rec: "Pelajari lagi konsep arsitektur jaringan lokal/internet, cara kerja alamat IP, dan pentingnya enkripsi keamanan Wi-Fi.",
                            act: "Latihan Konfigurasi Jaringan Sederhana"
                          },
                          "AD": {
                            rec: "Gunakan spreadsheet untuk menyaring data, mengelompokkan data (pivot), serta berlatih membuat visualisasi grafik yang tepat.",
                            act: "Tugas Pengolahan Spreadsheet"
                          },
                          "AP": {
                            rec: "Tingkatkan latihan logika pemrograman dasar (variabel, kondisi if-else, looping) menggunakan Scratch, Blockly, atau Python.",
                            act: "Proyek Mini Pemrograman Logis"
                          },
                          "DSI": {
                            rec: "Baca studi kasus tentang pentingnya perlindungan privasi data pribadi online, hak cipta (HAKI), serta etika bersosial media.",
                            act: "Analisis Dampak Sosial Informatika"
                          },
                          "PLB": {
                            rec: "Berpartisipasi lebih aktif dalam kelompok proyek praktikal untuk merancang solusi informatika sederhana dari awal hingga rilis.",
                            act: "Review Peran Kolaborasi Proyek"
                          }
                        };

                        return selectedStudentProfile.elementProgress?.map((item: any, index: number) => {
                          const elInfo = ELEMEN_INFORMATIKA.find(e => e.kode === item.elemen);
                          const score = item.score;
                          const isPassed = score >= 75;
                          
                          // 1. Predikat
                          let predikatLetter = "D";
                          let predikatName = "Perlu Bimbingan";
                          let predikatStyle = "bg-rose-50 text-rose-800 border-rose-300";
                          if (score >= 85) {
                            predikatLetter = "A";
                            predikatName = "Sangat Baik";
                            predikatStyle = "bg-indigo-50 text-indigo-900 border-indigo-300 font-bold";
                          } else if (score >= 75) {
                            predikatLetter = "B";
                            predikatName = "Baik";
                            predikatStyle = "bg-teal-50 text-teal-900 border-teal-300 font-bold";
                          } else if (score >= 65) {
                            predikatLetter = "C";
                            predikatName = "Cukup";
                            predikatStyle = "bg-amber-50 text-amber-900 border-amber-300 font-bold";
                          }

                          // 2. Catatan Guru Resmi (Deskripsi Capaian)
                          let deskripsiCapaian = "";
                          if (score >= 85) {
                            deskripsiCapaian = `Sangat baik menguasai elemen ${elInfo?.nama || item.elemen}. Mampu memecahkan studi kasus tingkat tinggi secara mandiri.`;
                          } else if (score >= 75) {
                            deskripsiCapaian = `Menunjukkan pemahaman yang baik pada elemen ${elInfo?.nama || item.elemen}. Kompeten menyelesaikan penugasan wajib.`;
                          } else if (score >= 65) {
                            deskripsiCapaian = `Menunjukkan penguasaan cukup pada elemen ${elInfo?.nama || item.elemen}. Memerlukan bimbingan di beberapa konsep esensial.`;
                          } else {
                            deskripsiCapaian = `Belum memenuhi ketuntasan dasar pada elemen ${elInfo?.nama || item.elemen}. Direkomendasikan remedial intensif.`;
                          }

                          // 3. Rekomendasi Tindak Lanjut / Remedial
                          let rekomendasiTindakLanjut = "";
                          if (!isPassed) {
                            rekomendasiTindakLanjut = `${elementRecs[item.elemen]?.rec || "Pelajari materi esensial kembali."} Tugas wajib: [${elementRecs[item.elemen]?.act || "Latihan Mandiri"}].`;
                          } else {
                            rekomendasiTindakLanjut = `Diberikan program pengayaan mandiri berbasis eksplorasi proyek praktikal lanjutan untuk mengoptimalkan potensi.`;
                          }

                          return (
                            <tr key={item.elemen} className="divide-x divide-slate-200 hover:bg-slate-50/50 transition">
                              <td className="px-3 py-3 text-center font-mono font-bold text-slate-400">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[9px] border border-slate-300">
                                    {item.elemen}
                                  </span>
                                  <span>{elInfo?.nama || item.elemen}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  Tingkat Penyelesaian: {item.completion}%
                                </p>
                              </td>
                              <td className="px-3 py-3 text-center font-mono font-bold text-slate-500 bg-slate-50/30">
                                75
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`font-mono font-bold text-sm ${isPassed ? "text-indigo-950" : "text-rose-600 font-black"}`}>
                                  {score}
                                </span>
                                <span className="text-[9px] text-slate-400 block">/ 100</span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <div className={`inline-flex flex-col items-center px-2 py-1 rounded border text-[9px] font-extrabold w-24 ${predikatStyle}`}>
                                  <span className="text-sm font-black leading-none">{predikatLetter}</span>
                                  <span className="text-[7.5px] uppercase tracking-wide leading-none mt-0.5">{predikatName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 space-y-1.5">
                                <div className="text-[11px] text-slate-700 leading-relaxed">
                                  <span className="font-bold text-slate-800">Catatan Guru: </span>
                                  {deskripsiCapaian}
                                </div>
                                <div className={`p-2 rounded text-[10px] leading-relaxed border ${
                                  isPassed 
                                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" 
                                    : "bg-amber-50/70 border-amber-300 text-amber-900"
                                }`}>
                                  <span className="font-bold uppercase tracking-wider text-[8px] mr-1 px-1.5 py-0.2 rounded bg-white border">
                                    {isPassed ? "🚀 Pengayaan" : "⚠️ Remedial"}
                                  </span>
                                  {rekomendasiTindakLanjut}
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DEDICATED PANEL KHUSUS REKOMENDASI REMEDIAL (SANGAT FORMAL & STANDOUT) */}
              {(() => {
                const elementProgressList = selectedStudentProfile.elementProgress || [];
                const weakElems = elementProgressList.filter((item: any) => item.score < 75);
                const sortedWeak = [...weakElems].sort((a: any, b: any) => a.score - b.score);
                
                return (
                  <div className="bg-amber-50/40 border-2 border-amber-300 rounded-2xl p-5 space-y-4" id="panel-rekomendasi-remedial-khusus">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-amber-200">
                      <div>
                        <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                          <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                            <AlertTriangle className="h-4.5 w-4.5" />
                          </span>
                          <span>PANEL TINDAK LANJUT AKADEMIK & PROGRAM REMEDIAL</span>
                        </h4>
                        <p className="text-[11px] text-indigo-900/80 mt-1">
                          Sistem intervensi Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) bagi siswa yang membutuhkan bimbingan khusus.
                        </p>
                      </div>
                      <span className="text-[9px] bg-indigo-900 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                        KKTP TARGET: 75
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      {/* Priority Remedial Table List */}
                      <div className="md:col-span-6 space-y-3">
                        <span className="text-[10px] font-bold text-indigo-900/80 uppercase tracking-wider block">
                          📋 DAFTAR MATERI REMEDIAL (BERDASARKAN SKOR TERENDAH)
                        </span>

                        {sortedWeak.length > 0 ? (
                          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                            {sortedWeak.map((item: any) => {
                              const isCritical = item.score < 60;
                              return (
                                <div key={item.elemen} className="p-3 bg-white border border-amber-200 rounded-xl flex items-center justify-between text-xs shadow-3xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">{item.elemen}</span>
                                    <div>
                                      <p className="font-bold text-slate-800 text-[10px] leading-tight">
                                        {ELEMEN_INFORMATIKA.find(e => e.kode === item.elemen)?.nama || item.elemen}
                                      </p>
                                      <p className="text-[9px] text-slate-500">
                                        Nilai Saat Ini: <span className="font-mono font-bold text-rose-600">{item.score}</span> / 100
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[8px] px-2 py-0.5 rounded font-extrabold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                                    {isCritical ? "Kritis (<60)" : "Sedang (<75)"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-white border border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center space-y-1">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-800">BEBAS REMEDIAL!</span>
                            <span className="text-[10px] text-slate-500">Semua materi telah memenuhi ketuntasan minimum.</span>
                          </div>
                        )}
                      </div>

                      {/* Explicit Actionable Learning Recommendations Panel */}
                      <div className="md:col-span-6 space-y-3 bg-white p-4 border border-amber-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-900/80 uppercase tracking-wider block mb-2.5">
                            ⚡ PROSEDUR REMEDIAL & INSTRUKSI BELAJAR
                          </span>
                          
                          <div className="space-y-3 text-xs text-slate-700">
                            {sortedWeak.length > 0 ? (
                              <div className="space-y-2.5">
                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Langkah Tindak Lanjut Siswa:</span>
                                  <ul className="space-y-1.5 text-[10px] text-slate-600">
                                    <li className="flex items-start gap-1">
                                      <span className="text-amber-500">✏</span>
                                      <span>Mendatangi Guru Pengampu untuk melakukan asistensi/konsultasi pengerjaan penugasan mandiri elemen di atas.</span>
                                    </li>
                                    <li className="flex items-start gap-1">
                                      <span className="text-amber-500">✏</span>
                                      <span>Mengerjakan lembar latihan remedial atau uji keterampilan ulang hingga memperoleh status tuntas (&gt;= 75).</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="leading-relaxed">
                                  Peserta didik didorong untuk mengikuti <b>Program Pengayaan Mandiri</b> untuk merangsang potensi optimal melalui tantangan proyek interaktif berbasis AI.
                                </p>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                  🚀 Proyek Pengayaan: Pemrograman Aplikasi Sederhana Menggunakan Python
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-[9.5px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                          ⚠️ <i>Batas waktu penyerahan berkas perbaikan nilai adalah sebelum pelaksanaan Penilaian Akhir Semester (PAS).</i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* FORMAL SIGNATURE BLOCK (TANDA TANGAN RESMI GURU) */}
              <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-700">
                <div className="text-center sm:text-left space-y-1">
                  <p>Orang Tua / Wali Murid,</p>
                  <div className="h-16 flex items-center justify-center sm:justify-start">
                    <span className="text-slate-300 border-b border-dashed border-slate-300 w-36 inline-block pt-12"></span>
                  </div>
                  <p className="font-bold text-slate-800">( ................................................. )</p>
                </div>

                <div className="text-center space-y-1">
                  <p>Mengetahui,</p>
                  <p className="font-bold text-slate-800">Kepala Sekolah SMK Negeri 1</p>
                  <div className="h-16 flex items-center justify-center">
                    <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-800 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
                      TERTANDA DIGITAL & SAH
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">Drs. H. Mulyono, M.Pd.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19741210 200312 1 001</p>
                </div>

                <div className="text-center sm:text-right space-y-1">
                  <p>Jakarta, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-bold text-slate-800">Guru Pengampu Mata Pelajaran,</p>
                  <div className="h-16 flex items-center justify-center sm:justify-end">
                    <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
                      VERIFIED ACADEMIC
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">Yogi Suprayogi, S.Pd., M.T.</p>
                  <p className="text-[10px] text-slate-500">NIP. 19920815 202607 1 002</p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-2 rounded-b-2xl">
              <button
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Rapor Capaian</span>
              </button>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
