import React, { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, BookOpen, AlertCircle, PenTool, Globe, FileText, FileSpreadsheet, Presentation, Video, Music, Image, File, Search, X, SlidersHorizontal, Bold, Italic, List } from "lucide-react";
import { User, Materi, ELEMEN_INFORMATIKA } from "../types";
import { WysiwygEditor } from "./WysiwygEditor";

export const getMateriIcon = (m: Materi) => {
  if (m.tipe === "LINK") {
    return {
      Icon: Globe,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      label: "Tautan Link",
    };
  }
  if (m.tipe === "TEKS" || !m.tipe) {
    return {
      Icon: PenTool,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      label: "Teks Manual",
    };
  }

  // File type checks
  const fileTipe = m.fileTipe || "";
  const fileNama = (m.fileNama || "").toLowerCase();

  if (fileTipe.startsWith("image/") || fileNama.endsWith(".png") || fileNama.endsWith(".jpg") || fileNama.endsWith(".jpeg") || fileNama.endsWith(".gif") || fileNama.endsWith(".webp") || fileNama.endsWith(".svg")) {
    return {
      Icon: Image,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      label: "Gambar",
    };
  }

  if (fileTipe.startsWith("video/") || fileNama.endsWith(".mp4") || fileNama.endsWith(".mkv") || fileNama.endsWith(".avi") || fileNama.endsWith(".mov") || fileNama.endsWith(".webm")) {
    return {
      Icon: Video,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/20",
      borderColor: "border-rose-200 dark:border-rose-800",
      label: "Video",
    };
  }

  if (fileTipe.startsWith("audio/") || fileNama.endsWith(".mp3") || fileNama.endsWith(".wav") || fileNama.endsWith(".ogg") || fileNama.endsWith(".m4a") || fileNama.endsWith(".flac")) {
    return {
      Icon: Music,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      label: "Audio",
    };
  }

  if (fileTipe === "application/pdf" || fileNama.endsWith(".pdf")) {
    return {
      Icon: FileText,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800",
      label: "PDF",
    };
  }

  // Spreadsheet
  if (
    fileTipe.includes("sheet") ||
    fileTipe.includes("excel") ||
    fileNama.endsWith(".xls") ||
    fileNama.endsWith(".xlsx") ||
    fileNama.endsWith(".csv") ||
    fileNama.endsWith(".ods")
  ) {
    return {
      Icon: FileSpreadsheet,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      label: "Spreadsheet",
    };
  }

  // Presentation
  if (
    fileTipe.includes("presentation") ||
    fileTipe.includes("powerpoint") ||
    fileNama.endsWith(".ppt") ||
    fileNama.endsWith(".pptx") ||
    fileNama.endsWith(".odp")
  ) {
    return {
      Icon: Presentation,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      label: "Presentasi",
    };
  }

  // Word/Docs
  if (
    fileTipe.includes("word") ||
    fileTipe.includes("document") ||
    fileNama.endsWith(".doc") ||
    fileNama.endsWith(".docx") ||
    fileNama.endsWith(".odt") ||
    fileNama.endsWith(".txt")
  ) {
    return {
      Icon: FileText,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-950/20",
      borderColor: "border-sky-200 dark:border-sky-800",
      label: "Dokumen",
    };
  }

  // Default File
  return {
    Icon: File,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-800/30",
    borderColor: "border-slate-200 dark:border-slate-800",
    label: "File",
  };
};

interface MateriViewProps {
  user: User;
  materiList: Materi[];
  onAddMateri: (materi: Materi) => void;
  onDeleteMateri: (id: string) => void;
}

export const MateriView: React.FC<MateriViewProps> = ({
  user,
  materiList,
  onAddMateri,
  onDeleteMateri,
}) => {
  const [isCreatingMateri, setIsCreatingMateri] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [materiForm, setMateriForm] = useState({
    judul: "",
    deskripsi: "",
    elemen: "BK",
    kelas: "X" as "X" | "XI" | "XII",
    konten: "",
    tipe: "TEKS" as "TEKS" | "FILE" | "LINK",
    lampiranUrl: "",
    fileNama: "",
    fileTipe: "",
    fileUkuran: "",
    fileData: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFormatText = (
    elementId: string,
    type: "bold" | "italic" | "bullet",
    currentValue: string,
    setValueCallback: (val: string) => void
  ) => {
    const textarea = document.getElementById(elementId) as HTMLTextAreaElement | null;
    if (!textarea) {
      if (type === "bold") setValueCallback(currentValue + " **teks tebal**");
      else if (type === "italic") setValueCallback(currentValue + " *teks miring*");
      else if (type === "bullet") setValueCallback(currentValue + "\n- butir baru");
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentValue.substring(start, end);

    let formatted = "";
    let cursorOffset = 0;

    if (type === "bold") {
      formatted = `**${selectedText || "teks tebal"}**`;
      cursorOffset = selectedText ? formatted.length : 2;
    } else if (type === "italic") {
      formatted = `*${selectedText || "teks miring"}*`;
      cursorOffset = selectedText ? formatted.length : 1;
    } else if (type === "bullet") {
      if (selectedText.includes("\n")) {
        formatted = selectedText
          .split("\n")
          .map((line) => (line.trim().startsWith("-") ? line : `- ${line}`))
          .join("\n");
        cursorOffset = formatted.length;
      } else {
        formatted = `\n- ${selectedText || "butir baru"}`;
        cursorOffset = selectedText ? formatted.length : 3;
      }
    }

    const newValue = currentValue.substring(0, start) + formatted + currentValue.substring(end);
    setValueCallback(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + formatted.length);
      } else {
        const selectionPos = start + cursorOffset;
        const textToSelectLength = type === "bold" ? 10 : type === "italic" ? 11 : 10;
        textarea.setSelectionRange(selectionPos, selectionPos + textToSelectLength);
      }
    }, 50);
  };

  // States for filtering
  const [filterElemen, setFilterElemen] = useState<string>("SEMUA");
  const [filterKelas, setFilterKelas] = useState<string>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredMateriList = materiList.filter((m) => {
    const matchElemen = filterElemen === "SEMUA" || m.elemen === filterElemen;
    const matchKelas = filterKelas === "SEMUA" || m.kelas === filterKelas;
    const matchSearch =
      searchQuery.trim() === "" ||
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchElemen && matchKelas && matchSearch;
  });

  const selectedMeta = selectedMateri ? getMateriIcon(selectedMateri) : null;
  const SelectedIcon = selectedMeta ? selectedMeta.Icon : BookOpen;

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      
      let sizeStr = "";
      if (file.size < 1024) sizeStr = `${file.size} B`;
      else if (file.size < 1024 * 1024) sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      else sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setMateriForm((prev) => ({
        ...prev,
        fileNama: file.name,
        fileTipe: file.type,
        fileUkuran: sizeStr,
        fileData: base64Data,
        konten: `Materi Berupa File Lampiran: ${file.name}`,
      }));
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg("Gagal membaca file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (materiForm.tipe === "FILE" && !materiForm.fileData) {
      setErrorMsg("Silakan unggah file materi terlebih dahulu.");
      return;
    }
    if (materiForm.tipe === "LINK" && !materiForm.lampiranUrl) {
      setErrorMsg("Silakan isi tautan URL link terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materiForm),
      });
      const data = await res.json();
      if (data.success) {
        onAddMateri(data.data);
        setIsCreatingMateri(false);
        setSelectedMateri(data.data);
        setMateriForm({
          judul: "",
          deskripsi: "",
          elemen: "BK",
          kelas: "X",
          konten: "",
          tipe: "TEKS",
          lampiranUrl: "",
          fileNama: "",
          fileTipe: "",
          fileUkuran: "",
          fileData: "",
        });
      } else {
        setErrorMsg(data.message || "Gagal menerbitkan materi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menghubungi server.");
    }
  };

  const handleDeleteMateri = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
    try {
      const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onDeleteMateri(id);
        if (selectedMateri?.id === id) setSelectedMateri(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      // H1
      if (line.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6 mb-4"
          >
            {line.replace("# ", "")}
          </h1>
        );
      }
      // H2
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl font-display font-semibold text-slate-800 dark:text-slate-200 mt-5 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // H3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-display font-medium text-slate-800 dark:text-slate-300 mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Code Block
      if (line.startsWith("```")) {
        return null; // Skip wrapper line, just do raw formatting
      }
      // List
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-slate-600 dark:text-slate-300 my-1">
            {line.substring(2)}
          </li>
        );
      }
      // Number List
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-slate-600 dark:text-slate-300 my-1">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      // Table rows (Simpel)
      if (line.startsWith("|")) {
        return (
          <div
            key={idx}
            className="grid grid-cols-4 gap-2 text-xs border-b border-slate-100 dark:border-slate-800 py-1 font-mono text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 px-2 rounded"
          >
            {line
              .split("|")
              .filter((x) => x.trim() !== "")
              .map((col, cIdx) => (
                <span key={cIdx}>{col.trim()}</span>
              ))}
          </div>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-indigo-500 pl-4 py-1 my-3 text-slate-500 dark:text-slate-400 italic"
          >
            {line.substring(2)}
          </blockquote>
        );
      }
      // Bold syntax helper
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="materi-view-root">
      {/* Header Tab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Modul Belajar Informatika SMA</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Eksplorasi materi kurikulum merdeka berdasarkan elemen informatika.</p>
        </div>
        {user.role === "GURU" && (
          <button
            onClick={() => {
              setIsCreatingMateri(true);
              setSelectedMateri(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Unggah Materi Baru</span>
          </button>
        )}
      </div>

      {isCreatingMateri ? (
        // Form input materi baru
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Buat Modul Pembelajaran Baru</h3>
          <form onSubmit={handleCreateMateri} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Elemen Informatika</label>
                <select
                  value={materiForm.elemen}
                  onChange={(e) => setMateriForm({ ...materiForm, elemen: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {ELEMEN_INFORMATIKA.map((el) => (
                    <option key={el.kode} value={el.kode}>
                      {el.kode} - {el.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tingkat Kelas</label>
                <select
                  value={materiForm.kelas}
                  onChange={(e) => setMateriForm({ ...materiForm, kelas: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="X">Kelas X (Fase E)</option>
                  <option value="XI">Kelas XI (Fase F)</option>
                  <option value="XII">Kelas XII (Fase F)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Judul Materi</label>
              <input
                type="text"
                required
                value={materiForm.judul}
                onChange={(e) => setMateriForm({ ...materiForm, judul: e.target.value })}
                placeholder="Contoh: Algoritma Pencarian Binary Search"
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                required
                value={materiForm.deskripsi}
                onChange={(e) => setMateriForm({ ...materiForm, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat modul belajar untuk daftar siswa..."
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Selector Tipe Materi */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metode Input Materi</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMateriForm({ ...materiForm, tipe: "TEKS", lampiranUrl: "", fileNama: "", fileTipe: "", fileUkuran: "", fileData: "", konten: "" })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    materiForm.tipe === "TEKS"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Tulis Manual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMateriForm({ ...materiForm, tipe: "FILE", lampiranUrl: "", fileNama: "", fileTipe: "", fileUkuran: "", fileData: "", konten: "" })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    materiForm.tipe === "FILE"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Unggah File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMateriForm({ ...materiForm, tipe: "LINK", lampiranUrl: "", fileNama: "", fileTipe: "", fileUkuran: "", fileData: "", konten: "" })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    materiForm.tipe === "LINK"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Tautan Link</span>
                </button>
              </div>
            </div>

            {/* Form Fields depend on selected Tipe */}
            {materiForm.tipe === "TEKS" && (
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Isi Materi Pembelajaran (Editor WYSIWYG / Markdown)</label>
                <WysiwygEditor
                  id="materi-content-textarea"
                  value={materiForm.konten}
                  onChange={(val) => setMateriForm({ ...materiForm, konten: val })}
                  placeholder="Tulis materi lengkap di sini..."
                  heightClass="min-h-[320px]"
                />
              </div>
            )}

            {materiForm.tipe === "FILE" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilih atau Unggah File Materi</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  }`}
                  onClick={() => document.getElementById("file-materi-input")?.click()}
                >
                  <input
                    type="file"
                    id="file-materi-input"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processFile(file);
                    }}
                  />
                  <BookOpen className="h-10 w-10 text-indigo-500/80 mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Seret & Lepas file ke sini, atau <span className="text-indigo-600 dark:text-indigo-400 underline font-bold">pilih file</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Mendukung file dokumen, spreadsheet, presentasi, animasi, audio, video, gambar, dll.
                  </p>
                </div>

                {/* File Upload Info */}
                {materiForm.fileNama && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-150 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{materiForm.fileNama}</p>
                        <p className="text-xs text-slate-400 font-medium">Ukuran: {materiForm.fileUkuran} • Tipe: {materiForm.fileTipe || "File"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMateriForm(prev => ({ ...prev, fileNama: "", fileTipe: "", fileUkuran: "", fileData: "", konten: "" }))}
                      className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition p-1"
                    >
                      Hapus
                    </button>
                  </div>
                )}
                {isUploading && (
                  <p className="text-xs text-slate-400 animate-pulse font-medium">Membaca file...</p>
                )}
              </div>
            )}

            {materiForm.tipe === "LINK" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tautan URL Link Materi</label>
                  <input
                    type="url"
                    required
                    value={materiForm.lampiranUrl}
                    onChange={(e) => setMateriForm({ ...materiForm, lampiranUrl: e.target.value, konten: `Materi Berupa Tautan Link: ${e.target.value}` })}
                    placeholder="https://contoh-link.com/materi-pembelajaran"
                    className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Sematkan tautan materi eksternal seperti link Google Drive, YouTube, presentasi, website, dsb.</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingMateri(false)}
                className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Terbitkan Materi
              </button>
            </div>
          </form>
        </div>
      ) : selectedMateri ? (
        // Detail view Materi
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => setSelectedMateri(null)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold mb-4 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Materi</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
              {selectedMateri.elemen}
            </span>
            {selectedMeta && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border flex items-center gap-1 ${selectedMeta.bgColor} ${selectedMeta.color} ${selectedMeta.borderColor}`}>
                <SelectedIcon className="h-3 w-3 shrink-0" />
                <span>{selectedMeta.label}</span>
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">Kelas {selectedMateri.kelas}</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
            {selectedMateri.judul}
          </h2>

          <div className="space-y-6">
            {/* Deskripsi */}
            {selectedMateri.deskripsi && (
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 italic">
                {selectedMateri.deskripsi}
              </p>
            )}

            {/* Render sesuai tipe */}
            {selectedMateri.tipe === "FILE" ? (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
                {selectedMeta && (
                  <div className={`inline-flex p-4 rounded-full border ${selectedMeta.bgColor} ${selectedMeta.color} ${selectedMeta.borderColor}`}>
                    <SelectedIcon className="h-10 w-10" />
                  </div>
                )}
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">{selectedMateri.fileNama}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Ukuran: {selectedMateri.fileUkuran || "N/A"} • Format: {selectedMateri.fileTipe || "File"}
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <a
                    href={selectedMateri.fileData}
                    download={selectedMateri.fileNama}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Unduh / Simpan File Materi</span>
                  </a>
                </div>

                {/* Media Preview inside the app */}
                {selectedMateri.fileData && (
                  <div className="mt-6 pt-6 border-t border-slate-150 dark:border-slate-800 text-left">
                    {/* Image Preview */}
                    {selectedMateri.fileTipe?.startsWith("image/") && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pratinjau Gambar:</p>
                        <img
                          src={selectedMateri.fileData}
                          alt={selectedMateri.fileNama}
                          className="max-h-96 w-auto mx-auto rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
                        />
                      </div>
                    )}
                    {/* Audio Preview */}
                    {selectedMateri.fileTipe?.startsWith("audio/") && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pratinjau Audio:</p>
                        <audio src={selectedMateri.fileData} controls className="w-full" />
                      </div>
                    )}
                    {/* Video Preview */}
                    {selectedMateri.fileTipe?.startsWith("video/") && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pratinjau Video:</p>
                        <video src={selectedMateri.fileData} controls className="max-h-96 w-full rounded-xl bg-black" />
                      </div>
                    )}
                    {/* PDF Preview */}
                    {selectedMateri.fileTipe === "application/pdf" && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pratinjau PDF:</p>
                        <iframe
                          src={selectedMateri.fileData}
                          title={selectedMateri.fileNama}
                          className="w-full h-[500px] rounded-xl border border-slate-150 dark:border-slate-800 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedMateri.tipe === "LINK" ? (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4 max-w-2xl mx-auto">
                {selectedMeta && (
                  <div className={`inline-flex p-4 rounded-full border ${selectedMeta.bgColor} ${selectedMeta.color} ${selectedMeta.borderColor}`}>
                    <SelectedIcon className="h-10 w-10" />
                  </div>
                )}
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Tautan Materi Pembelajaran</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-mono break-all font-semibold">
                    {selectedMateri.lampiranUrl}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedMateri.lampiranUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <span>Buka Tautan Eksternal</span>
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formatMarkdown(selectedMateri.konten)}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Daftar materi dengan filter
        <div className="space-y-6">
          {/* Menu Filter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari materi berdasarkan judul atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdowns / Buttons for Kelas & Reset */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Filter Kelas */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Kelas:</span>
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    {["SEMUA", "X", "XI", "XII"].map((kls) => (
                      <button
                        key={kls}
                        type="button"
                        onClick={() => setFilterKelas(kls)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          filterKelas === kls
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {kls === "SEMUA" ? "Semua" : `Kelas ${kls}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filter Button */}
                {(filterElemen !== "SEMUA" || filterKelas !== "SEMUA" || searchQuery !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterElemen("SEMUA");
                      setFilterKelas("SEMUA");
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Hapus Filter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Elemen Informatika (Quick Badges) */}
            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elemen Kurikulum Merdeka:</span>
                {filterElemen !== "SEMUA" && (
                  <button
                    onClick={() => setFilterElemen("SEMUA")}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Tampilkan Semua Elemen
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterElemen("SEMUA")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    filterElemen === "SEMUA"
                      ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400"
                      : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  Semua Elemen
                </button>
                {ELEMEN_INFORMATIKA.map((el) => {
                  const isActive = filterElemen === el.kode;
                  const countInElemen = materiList.filter((m) => m.elemen === el.kode).length;
                  return (
                    <button
                      key={el.kode}
                      type="button"
                      onClick={() => setFilterElemen(el.kode)}
                      title={`${el.kode} - ${el.nama}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        isActive
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-mono ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                        {el.kode}
                      </span>
                      <span>{el.nama}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                        {countInElemen}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result statistics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-semibold px-1">
            <div>
              Menampilkan <span className="text-slate-700 dark:text-slate-300 font-bold">{filteredMateriList.length}</span> dari <span className="text-slate-700 dark:text-slate-300 font-bold">{materiList.length}</span> materi pembelajaran
            </div>
            {(filterElemen !== "SEMUA" || filterKelas !== "SEMUA" || searchQuery !== "") && (
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span>
                  Filter aktif: {[
                    filterElemen !== "SEMUA" ? `Elemen ${filterElemen}` : null,
                    filterKelas !== "SEMUA" ? `Kelas ${filterKelas}` : null,
                    searchQuery ? `Kata kunci "${searchQuery}"` : null
                  ].filter(Boolean).join(" + ")}
                </span>
              </div>
            )}
          </div>

          {/* Grid daftar materi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMateriList.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[250px]">
                <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">Tidak ada materi yang cocok</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm">Coba atur ulang filter elemen, tingkat kelas, atau kata kunci pencarian Anda untuk melihat modul belajar lainnya.</p>
                <button
                  onClick={() => {
                    setFilterElemen("SEMUA");
                    setFilterKelas("SEMUA");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Atur Ulang Filter
                </button>
              </div>
            ) : (
              filteredMateriList.map((m) => {
                const meta = getMateriIcon(m);
                const IconComp = meta.Icon;
                return (
                  <div
                    key={m.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
                          {m.elemen}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${meta.bgColor} ${meta.color} ${meta.borderColor}`}>
                            <IconComp className="h-3 w-3 shrink-0" />
                            <span>{meta.label}</span>
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">Kelas {m.kelas}</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mt-4">
                        <div className={`p-2.5 rounded-xl shrink-0 border ${meta.bgColor} ${meta.color} ${meta.borderColor} shadow-sm`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug" title={m.judul}>
                            {m.judul}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                            {m.deskripsi}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => setSelectedMateri(m)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-0.5 transition"
                      >
                        <span>Buka Materi</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      {user.role === "GURU" && (
                        <button
                          onClick={() => handleDeleteMateri(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                          title="Hapus Materi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
