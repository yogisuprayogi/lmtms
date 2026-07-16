import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Brain,
  FileText,
  FileCode,
  Award,
  RefreshCw,
  Copy,
  Download,
  CheckCircle,
  HelpCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Send,
  Save,
  Check,
  Edit2,
  ListOrdered,
  Eye,
  Settings,
  AlertTriangle,
  Info,
  Layers,
  Code
} from "lucide-react";

interface AiTeachingAssistantViewProps {
  user: {
    id: string;
    username: string;
    nama: string;
    email: string;
    role: "ADMIN" | "GURU" | "SISWA";
    kelas?: string;
  };
}

type AssistantType = "generator" | "modul" | "atp" | "soal" | "rubrik" | "refleksi" | "lkpd";

export const AiTeachingAssistantView: React.FC<AiTeachingAssistantViewProps> = ({ user }) => {
  const [activeType, setActiveType] = useState<AssistantType>("generator");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [aiStatus, setAiStatus] = useState<"online" | "offline" | "checking">("checking");

  // Specific Form Parameters
  const [commonParams, setCommonParams] = useState({
    topic: "",
    elemen: "AP", // Algoritma dan Pemrograman
    kelas: "X",
    prompt: ""
  });

  // Extra Parameters for specific tools
  const [generatorParams, setGeneratorParams] = useState({
    format: "Markdown"
  });

  const [modulParams, setModulParams] = useState({
    modelPembelajaran: "Problem-Based Learning (PBL)",
    alokasiWaktu: "2 JP (2 x 45 Menit)"
  });

  const [atpParams, setAtpParams] = useState({
    jpTotal: "12 JP",
    targetKompetensi: "Peserta didik mampu merancang algoritma perulangan dan percabangan dengan Python."
  });

  const [soalParams, setSoalParams] = useState({
    jumlahSoal: "5",
    tipeSoal: "Pilihan Ganda",
    kesulitan: "HOTS (Higher Order Thinking Skills)"
  });

  const [rubrikParams, setRubrikParams] = useState({
    scale: "1 - 4 (Sangat Baik - Perlu Bimbingan)",
    kriteriaUtama: "Logika Program, Sintaksis Kode, Dokumentasi/Refleksi"
  });

  const [refleksiParams, setRefleksiParams] = useState({
    sasaran: "Refleksi Guru (Evaluasi KBM)",
    model: "Model 4P/4F (Peristiwa, Perasaan, Pembelajaran, Penerapan)"
  });

  const [lkpdParams, setLkpdParams] = useState({
    metode: "Plugged (Praktik dengan Komputer)",
    skenario: "Membuat aplikasi antrean rumah sakit sederhana menggunakan Python list/queue."
  });

  // Reassuring messages during generation
  const loadingMessages = [
    "Menganalisis Kurikulum Merdeka Fase E/F...",
    "Merumuskan pilar-pilar Kerangka Pembelajaran Mendalam (Deep Learning)...",
    "Menyusun struktur dokumen yang rapi dan terstandardisasi...",
    "Mengintegrasikan Delapan (8) Dimensi Profil Pelajar Pancasila...",
    "Menerapkan Rumus Pembelajaran 8-3-3-4 secara kontekstual...",
    "Memformulasikan pertanyaan pemantik dan aktivitas interaktif...",
    "Menghaluskan draf materi agar siap digunakan di kelas..."
  ];

  // Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check Gemini API status upon mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/perangkat", { method: "GET" });
        if (response.ok) {
          setAiStatus("online");
        } else {
          setAiStatus("offline");
        }
      } catch (e) {
        setAiStatus("offline");
      }
    };
    checkStatus();
  }, []);

  // Cycle loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[idx]);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Format Helper to render Markdown cleanly in a high-contrast elegant view
  const renderMarkdownToHtml = (md: string) => {
    if (!md) return <p className="text-slate-400 italic text-xs">Belum ada draf yang dihasilkan. Silakan isi parameter di sebelah kiri dan klik Generate.</p>;

    const lines = md.split("\n");
    let insideCode = false;

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Check if it's a code block toggle
      if (trimmed.startsWith("```")) {
        insideCode = !insideCode;
        return null; // Skip rendering the ``` line
      }

      // If we are inside a code block, render as monospaced line
      if (insideCode) {
        return (
          <div key={idx} className="font-mono text-xs text-teal-400 bg-slate-900 px-4 py-0.5 whitespace-pre border-x border-slate-800">
            {line}
          </div>
        );
      }

      // Headers
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl md:text-2xl font-display font-extrabold text-slate-900 border-b border-slate-200 pb-2 mt-6 mb-3">
            {trimmed.substring(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-base md:text-lg font-display font-bold text-slate-800 mt-5 mb-2.5 flex items-center gap-2 border-l-4 border-emerald-500 pl-2.5">
            {trimmed.substring(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-sm font-bold text-slate-700 mt-4 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      }

      // Horizontal line
      if (trimmed === "---") {
        return <hr key={idx} className="my-5 border-t border-slate-200" />;
      }

      // Table Row
      if (trimmed.startsWith("|")) {
        if (trimmed.includes("---") || trimmed.includes("-:-")) {
          return null; // Skip separator line
        }
        const parts = trimmed.split("|").map(p => p.trim()).filter(p => p !== "");
        return (
          <div key={idx} className="grid grid-cols-4 gap-2 text-xs border-b border-slate-100 py-2 font-mono text-slate-700 bg-slate-50/50 px-3 rounded my-1">
            {parts.map((cell, cIdx) => (
              <span key={cIdx} className="font-medium">{cell}</span>
            ))}
          </div>
        );
      }

      // List Items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs text-slate-600 my-1 leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-xs text-slate-600 my-1 leading-relaxed">
            {trimmed.replace(/^\d+\.\s/, "")}
          </li>
        );
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className="bg-slate-50 border-l-4 border-slate-300 p-3 my-3 text-xs text-slate-500 rounded-r-xl italic">
            {trimmed.substring(2)}
          </blockquote>
        );
      }

      // Empty Line
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }

      // Regular Paragraph
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2.5">
          {trimmed}
        </p>
      );
    });
  };

  // Generate Handler calling Backend Endpoint
  const handleGenerate = async () => {
    if (!commonParams.topic.trim()) {
      showToast("Harap masukkan topik pembelajaran terlebih dahulu.", "error");
      return;
    }

    setLoading(true);
    setGeneratedContent("");

    // Assemble prompt based on selected AI assistant type
    let promptText = "";
    let systemTask = "";

    switch (activeType) {
      case "generator":
        systemTask = "AI Generator Umum";
        promptText = `Tulis draf penjelasan materi komparatif dan studi kasus mengenai: ${commonParams.topic}. 
        Format output yang diinginkan: ${generatorParams.format}. 
        Catatan tambahan: ${commonParams.prompt || "Tidak ada."}`;
        break;

      case "modul":
        systemTask = "Draf Modul Ajar Kurikulum Merdeka";
        promptText = `Susun Modul Ajar Informatika Fase ${commonParams.kelas === "X" ? "E" : "F"} (Kelas ${commonParams.kelas}) untuk Elemen [${commonParams.elemen}] dengan fokus topik utama: ${commonParams.topic}. 
        Gunakan Model Pembelajaran: ${modulParams.modelPembelajaran}. Alokasi waktu: ${modulParams.alokasiWaktu}. 
        Detail tambahan: ${commonParams.prompt || "Tidak ada."}`;
        break;

      case "atp":
        systemTask = "Draf Alur Tujuan Pembelajaran (ATP)";
        promptText = `Rancang Alur Tujuan Pembelajaran (ATP) terstruktur dan logis untuk SMK Informatika Kelas ${commonParams.kelas} pada Elemen [${commonParams.elemen}] dengan fokus bahasan: ${commonParams.topic}. 
        Total Alokasi Waktu: ${atpParams.jpTotal}. 
        Target Kompetensi Dasar: ${atpParams.targetKompetensi}.`;
        break;

      case "soal":
        systemTask = "Draf Kuis & Soal Asesmen";
        promptText = `Buatkan draf bank soal asesmen Informatika kelas ${commonParams.kelas} untuk materi: ${commonParams.topic} (Elemen: ${commonParams.elemen}). 
        Jumlah Soal: ${soalParams.jumlahSoal} soal. 
        Tipe Soal: ${soalParams.tipeSoal}. 
        Tingkat Kesulitan Kognitif: ${soalParams.kesulitan}. 
        Sertakan kunci jawaban lengkap dengan analisis pembahasan di setiap soalnya.`;
        break;

      case "rubrik":
        systemTask = "Draf Rubrik Asesmen Pembelajaran";
        promptText = `Susun draf Rubrik Penilaian Kinerja / Praktikum Informatika Kelas ${commonParams.kelas} untuk materi: ${commonParams.topic}. 
        Skala Penilaian: ${rubrikParams.scale}. 
        Kriteria Utama yang wajib dicakup: ${rubrikParams.kriteriaUtama}.`;
        break;

      case "refleksi":
        systemTask = "Draf Refleksi Pembelajaran";
        promptText = `Buatkan draf instrumen refleksi interaktif kelas ${commonParams.kelas} untuk materi: ${commonParams.topic}. 
        Tipe Refleksi: ${refleksiParams.sasaran}. 
        Gunakan Model Analisis Reflektif: ${refleksiParams.model}.`;
        break;

      case "lkpd":
        systemTask = "Lembar Kerja Peserta Didik (LKPD)";
        promptText = `Rancang Lembar Kerja Peserta Didik (LKPD) mandiri/kelompok untuk kelas ${commonParams.kelas} Elemen [${commonParams.elemen}] dengan fokus topik: ${commonParams.topic}. 
        Metode Pembelajaran Praktik: ${lkpdParams.metode}. 
        Skenario Tantangan Praktik: ${lkpdParams.skenario}.`;
        break;
    }

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({
          prompt: promptText,
          jenisDokumen: activeType.toUpperCase(),
          elemen: commonParams.elemen,
          kelas: commonParams.kelas
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.content);
        showToast("Draf asisten pengajar sukses dibuat!");
      } else {
        showToast(data.message || "Gagal menghasilkan draf pembelajaran.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Koneksi bermasalah. Mengaktifkan mesin draf offline...", "error");
    } finally {
      setLoading(false);
    }
  };

  // Save the generated document into local storage devices to integrate it directly with the other tabs!
  const handleSaveToDocuments = () => {
    if (!generatedContent) return;

    try {
      const savedDocs = JSON.parse(localStorage.getItem("lmtms_custom_docs") || "[]");
      const mappingTypes: Record<AssistantType, string> = {
        generator: "AI_GENERATOR",
        modul: "MODUL_AJAR",
        atp: "ATP",
        soal: "BANK_SOAL",
        rubrik: "RUBRIK_PENILAIAN",
        refleksi: "REFLEKSI",
        lkpd: "LKPD"
      };

      const mappingNames: Record<AssistantType, string> = {
        generator: "AI Generator Helper",
        modul: "AI Modul Ajar",
        atp: "AI Alur Tujuan Pembelajaran",
        soal: "AI Bank Soal & Kuis",
        rubrik: "AI Rubrik Asesmen",
        refleksi: "AI Refleksi KBM",
        lkpd: "AI Lembar Kerja Siswa"
      };

      const newDoc = {
        id: `doc-custom-${Date.now()}`,
        jenis: mappingTypes[activeType],
        judul: `${mappingNames[activeType]}: ${commonParams.topic} (Kelas ${commonParams.kelas})`,
        elemen: commonParams.elemen,
        kelas: commonParams.kelas,
        konten: generatedContent,
        tanggalDibuat: new Date().toISOString().split("T")[0],
        pembuatId: user.id
      };

      // Also push to teaching_assignments if it's a "soal" or "lkpd" so teachers can immediately use it as assignments!
      if (activeType === "soal" || activeType === "lkpd") {
        const savedAssignments = JSON.parse(localStorage.getItem("teaching_assignments") || "[]");
        savedAssignments.unshift({
          id: `asg-ai-${Date.now()}`,
          judul: `${mappingNames[activeType]}: ${commonParams.topic}`,
          instruksi: `Selesaikan lembar kerja tugas berikut secara saksama.\n\n${generatedContent}`,
          elemen: commonParams.elemen,
          kelas: commonParams.kelas + "-1",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 week deadline
          totalPoin: 100,
          tipe: activeType === "soal" ? "KUIS" : "LKPD"
        });
        localStorage.setItem("teaching_assignments", JSON.stringify(savedAssignments));
      }

      // Also save to generic LMTMS perangkat list inside local storage so it synchronizes
      const db = JSON.parse(localStorage.getItem("lmtms_perangkats") || "[]");
      db.unshift(newDoc);
      localStorage.setItem("lmtms_perangkats", JSON.stringify(db));

      savedDocs.unshift(newDoc);
      localStorage.setItem("lmtms_custom_docs", JSON.stringify(savedDocs));

      showToast("Berhasil disimpan dan terintegrasi dengan Perangkat & Penugasan LMS!", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal menyimpan dokumen.", "error");
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    showToast("Salin ke papan klip berhasil!");
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `AI_Draft_${activeType}_${commonParams.topic.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("Berkas berhasil diunduh.");
  };

  // Sidebar assistants catalog config
  const assistantsCatalog = [
    {
      id: "generator",
      title: "AI Generator",
      desc: "Asisten umum pembuat draf penjelasan, studi kasus, & kode pemrograman.",
      icon: Sparkles,
      color: "text-amber-500 bg-amber-50 border-amber-200"
    },
    {
      id: "modul",
      title: "AI Modul",
      desc: "Perancang Modul Ajar Kurikulum Merdeka terintegrasi Pembelajaran Mendalam.",
      icon: BookOpen,
      color: "text-blue-500 bg-blue-50 border-blue-200"
    },
    {
      id: "atp",
      title: "AI ATP",
      desc: "Penyusun Alur Tujuan Pembelajaran dengan pembagian JP yang ideal.",
      icon: ListOrdered,
      color: "text-indigo-500 bg-indigo-50 border-indigo-200"
    },
    {
      id: "soal",
      title: "AI Soal",
      desc: "Generator butir soal kuis (LOTS/HOTS) lengkap kunci & pembahasan.",
      icon: FileCode,
      color: "text-rose-500 bg-rose-50 border-rose-200"
    },
    {
      id: "rubrik",
      title: "AI Rubrik",
      desc: "Pembuat rubrik asesmen kinerja, kognitif, & sikap pancasila dalam tabel.",
      icon: Award,
      color: "text-emerald-500 bg-emerald-50 border-emerald-200"
    },
    {
      id: "refleksi",
      title: "AI Refleksi",
      desc: "Formulator instrumen refleksi umpan balik bagi pendidik & peserta didik.",
      icon: Brain,
      color: "text-purple-500 bg-purple-50 border-purple-200"
    },
    {
      id: "lkpd",
      title: "AI LKPD",
      desc: "Rancangan Lembar Kerja Peserta Didik mandiri/kelompok berbasis aktivitas.",
      icon: FileText,
      color: "text-teal-500 bg-teal-50 border-teal-200"
    }
  ];

  return (
    <div className="space-y-6" id="ai-teaching-assistant-container">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-15 flex items-center justify-center">
          <Bot className="h-44 w-44 text-blue-400" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Bot className="h-3.5 w-3.5" />
            <span>AI Studio Smart Agent</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            AI Teaching Assistant
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Asisten cerdas berbasis model bahasa besar (Large Language Model) untuk mendampingi persiapan administrasi & kreativitas guru SMK Informatika. Ketik topik, pilih instrumen, dan hasilkan draf instan yang terintegrasi langsung dengan database LMS Anda.
          </p>
        </div>
      </div>

      {/* Toast Alert Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-xl text-white transition-all transform scale-100 ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: catalog selection & parameters */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assistants Selection Catalog Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-500" />
              <span>Daftar Asisten Pengajar AI</span>
            </h2>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {assistantsCatalog.map((catalog) => {
                const Icon = catalog.icon;
                const isActive = activeType === catalog.id;
                return (
                  <button
                    key={catalog.id}
                    onClick={() => {
                      setActiveType(catalog.id as AssistantType);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3.5 ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/50 shadow-xs"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                    id={`assistant-catalog-${catalog.id}`}
                  >
                    <div className={`h-10 w-10 rounded-xl border shrink-0 flex items-center justify-center ${catalog.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-xs text-slate-800 leading-none">{catalog.title}</h3>
                        {isActive && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">{catalog.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Parameters Form Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-600" />
              <span>Parameter Desain Pembelajaran</span>
            </h2>

            <div className="space-y-4">
              {/* Topic / Fokus Utama */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                  Topik Utama / Kompetensi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bubble Sort, Topologi LAN, Database MySql..."
                  value={commonParams.topic}
                  onChange={(e) => setCommonParams({ ...commonParams, topic: e.target.value })}
                  className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                />
              </div>

              {/* Grid: Kelas & Elemen */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Elemen Informatika
                  </label>
                  <select
                    value={commonParams.elemen}
                    onChange={(e) => setCommonParams({ ...commonParams, elemen: e.target.value })}
                    className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-bold focus:outline-indigo-500"
                  >
                    <option value="BK">BK (Berpikir Komputasional)</option>
                    <option value="TIK">TIK (Teknologi Info & Kom)</option>
                    <option value="SK">SK (Sistem Komputer)</option>
                    <option value="JKI">JKI (Jaringan Komputer)</option>
                    <option value="AD">AD (Analisis Data)</option>
                    <option value="AP">AP (Algoritma Pemrograman)</option>
                    <option value="DSI">DSI (Dampak Sosial Info)</option>
                    <option value="PLB">PLB (Praktik Lintas Bidang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Fase / Kelas
                  </label>
                  <select
                    value={commonParams.kelas}
                    onChange={(e) => setCommonParams({ ...commonParams, kelas: e.target.value })}
                    className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-bold focus:outline-indigo-500"
                  >
                    <option value="X">Fase E (Kelas X)</option>
                    <option value="XI">Fase F (Kelas XI)</option>
                    <option value="XII">Fase F (Kelas XII)</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC SUB-INSTRUMENT CONTROLS */}
              {activeType === "generator" && (
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Format Output
                  </label>
                  <select
                    value={generatorParams.format}
                    onChange={(e) => setGeneratorParams({ format: e.target.value })}
                    className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-bold focus:outline-indigo-500"
                  >
                    <option value="Markdown Lengkap">Markdown Lengkap</option>
                    <option value="Rangkuman Singkat">Rangkuman Singkat (Point-Form)</option>
                    <option value="Studi Kasus & Pembahasan Kode">Studi Kasus & Pembahasan Kode</option>
                    <option value="Peta Pikiran Deskriptif">Peta Pikiran Deskriptif</option>
                  </select>
                </div>
              )}

              {activeType === "modul" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Model Pembelajaran
                    </label>
                    <select
                      value={modulParams.modelPembelajaran}
                      onChange={(e) => setModulParams({ ...modulParams, modelPembelajaran: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2 rounded-xl text-[11px] font-bold focus:outline-indigo-500"
                    >
                      <option value="Problem-Based Learning (PBL)">Problem-Based Learning</option>
                      <option value="Project-Based Learning (PjBL)">Project-Based Learning</option>
                      <option value="Inquiry/Discovery Learning">Inquiry / Discovery</option>
                      <option value="Peer Tutoring (Tutor Sebaya)">Tutor Sebaya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Alokasi JP
                    </label>
                    <input
                      type="text"
                      value={modulParams.alokasiWaktu}
                      onChange={(e) => setModulParams({ ...modulParams, alokasiWaktu: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2 rounded-xl text-[11px] font-medium focus:outline-indigo-500"
                    />
                  </div>
                </div>
              )}

              {activeType === "atp" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Alokasi Total Jam Pelajaran
                    </label>
                    <input
                      type="text"
                      value={atpParams.jpTotal}
                      onChange={(e) => setAtpParams({ ...atpParams, jpTotal: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Target Kompetensi Kelulusan
                    </label>
                    <textarea
                      rows={2}
                      value={atpParams.targetKompetensi}
                      onChange={(e) => setAtpParams({ ...atpParams, targetKompetensi: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                    />
                  </div>
                </div>
              )}

              {activeType === "soal" && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Jumlah
                    </label>
                    <select
                      value={soalParams.jumlahSoal}
                      onChange={(e) => setSoalParams({ ...soalParams, jumlahSoal: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-1.5 rounded-lg text-[10px] font-bold"
                    >
                      <option value="5">5 Soal</option>
                      <option value="10">10 Soal</option>
                      <option value="15">15 Soal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Tipe
                    </label>
                    <select
                      value={soalParams.tipeSoal}
                      onChange={(e) => setSoalParams({ ...soalParams, tipeSoal: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-1.5 rounded-lg text-[10px] font-bold"
                    >
                      <option value="Pilihan Ganda">Pilihan Ganda</option>
                      <option value="Essay Teoretis">Essay</option>
                      <option value="Analisis Kode Program">Analisis Kode</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Kesulitan
                    </label>
                    <select
                      value={soalParams.kesulitan}
                      onChange={(e) => setSoalParams({ ...soalParams, kesulitan: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-1.5 rounded-lg text-[10px] font-bold"
                    >
                      <option value="LOTS (C1-C2)">LOTS (Mudah)</option>
                      <option value="MOTS (C3-C4)">MOTS (Sedang)</option>
                      <option value="HOTS (C5-C6)">HOTS (Tinggi)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeType === "rubrik" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Skala Kriteria Skor
                    </label>
                    <select
                      value={rubrikParams.scale}
                      onChange={(e) => setRubrikParams({ ...rubrikParams, scale: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-bold focus:outline-indigo-500"
                    >
                      <option value="1 - 4 (Sangat Baik - Perlu Bimbingan)">1 - 4 (Standard Kurikulum Merdeka)</option>
                      <option value="1 - 5 (Sangat Bagus - Kurang Sekali)">1 - 5 (Skala Detail)</option>
                      <option value="Nilai Angka (70 - 100)">Nilai Kualitatif Angka (70 - 100)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Kriteria Penilaian Esensial
                    </label>
                    <input
                      type="text"
                      value={rubrikParams.kriteriaUtama}
                      onChange={(e) => setRubrikParams({ ...rubrikParams, kriteriaUtama: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                    />
                  </div>
                </div>
              )}

              {activeType === "refleksi" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Sasaran
                    </label>
                    <select
                      value={refleksiParams.sasaran}
                      onChange={(e) => setRefleksiParams({ ...refleksiParams, sasaran: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2 rounded-xl text-[10px] font-bold focus:outline-indigo-500"
                    >
                      <option value="Refleksi Guru (Evaluasi KBM)">Refleksi Guru (Pendidik)</option>
                      <option value="Refleksi Siswa Mandiri">Refleksi Siswa (Peserta Didik)</option>
                      <option value="Refleksi Bersama Guru & Siswa">Refleksi Bersama</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Metodologi Reflektif
                    </label>
                    <select
                      value={refleksiParams.model}
                      onChange={(e) => setRefleksiParams({ ...refleksiParams, model: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2 rounded-xl text-[10px] font-bold focus:outline-indigo-500"
                    >
                      <option value="Model 4P/4F (Peristiwa, Perasaan, Pembelajaran, Penerapan)">Model 4P/4F</option>
                      <option value="Siklus Reflektif Gibbs (Gibbs Reflective Cycle)">Siklus Gibbs</option>
                      <option value="Teknik KWL (Know, Want to Know, Learned)">Teknik KWL</option>
                    </select>
                  </div>
                </div>
              )}

              {activeType === "lkpd" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Metode Lembar Kerja
                    </label>
                    <select
                      value={lkpdParams.metode}
                      onChange={(e) => setLkpdParams({ ...lkpdParams, metode: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-bold focus:outline-indigo-500"
                    >
                      <option value="Plugged (Praktik dengan Komputer)">Plugged (Menggunakan Komputer/Coding)</option>
                      <option value="Unplugged (Kerja Berpikir Komputasional kertas/kartu)">Unplugged (Tanpa Komputer/Logika)</option>
                      <option value="Eksperimen Kelompok Terpandu">Eksperimen Kelompok Terpandu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                      Instruksi Kasus / Skenario Praktik
                    </label>
                    <textarea
                      rows={2}
                      value={lkpdParams.skenario}
                      onChange={(e) => setLkpdParams({ ...lkpdParams, skenario: e.target.value })}
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Detail Instruksi Tambahan (Opsional) */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                  Petunjuk Tambahan Guru (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Beri fokus detail, contoh: 'fokuskan pada kode python pemrograman modular', atau 'gunakan studi kasus toko buku online'."
                  value={commonParams.prompt}
                  onChange={(e) => setCommonParams({ ...commonParams, prompt: e.target.value })}
                  className="w-full border border-slate-200 bg-white p-2.5 rounded-xl text-xs font-medium focus:outline-indigo-500"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                <Sparkles className={`h-4.5 w-4.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Menyusun Draf..." : "Hasilkan Draf Pembelajaran AI"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Formatted preview / Raw Markdown output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col flex-1 h-[600px] overflow-hidden">
            
            {/* Preview Toolbar */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[10px]">
                  {generatedContent ? "✓" : "i"}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-800 leading-none">Draf Hasil Asisten AI</h3>
                  <span className="text-[9px] text-slate-400 font-medium">Format: Markdown Kompatibel</span>
                </div>
              </div>

              {/* Mode Toggle & Copy Actions */}
              {generatedContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-700 transition"
                  >
                    {isEditing ? <Eye className="h-3.5 w-3.5 text-indigo-500" /> : <Edit2 className="h-3.5 w-3.5 text-slate-500" />}
                    <span>{isEditing ? "Pratinjau Rapi" : "Surgical Edit"}</span>
                  </button>

                  <button
                    onClick={handleCopyClipboard}
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition text-slate-500 hover:text-slate-900"
                    title="Salin ke papan klip"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition text-slate-500 hover:text-slate-900"
                    title="Unduh Berkas Markdown"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleSaveToDocuments}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition shadow-xs"
                    title="Integrasikan dengan LMS"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Integrasikan</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-5 select-text relative">
              {loading ? (
                /* Glowing Loading Screen */
                <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="relative h-14 w-14 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/15 animate-ping"></div>
                    <div className="relative h-10 w-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest animate-pulse">Menghasilkan Konten AI...</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs">{loadingMessage}</p>
                  </div>
                </div>
              ) : null}

              {isEditing ? (
                /* Code/Markdown Textarea Editor */
                <textarea
                  className="w-full h-full p-4 font-mono text-xs text-slate-700 border-0 outline-0 focus:ring-0 bg-slate-50/50 rounded-xl"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  placeholder="Isi konten Markdown..."
                />
              ) : (
                /* Formatted Render Panel */
                <div className="prose prose-slate max-w-none prose-xs select-text">
                  {renderMarkdownToHtml(generatedContent)}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Info Tip Box */}
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex gap-3">
            <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 leading-none">Pedoman Integrasi Otomatis</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Menyimpan hasil draf dengan mengklik tombol <b>Integrasikan</b> akan secara otomatis mendaftarkan berkas tersebut ke repositori utama Anda di LMS. Khusus dokumen bertipe <b>AI Soal</b> atau <b>AI LKPD</b> akan langsung diterbitkan sebagai draf Penugasan aktif Kelas X-1 agar bisa langsung dikerjakan oleh siswa di portal belajar mereka.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
