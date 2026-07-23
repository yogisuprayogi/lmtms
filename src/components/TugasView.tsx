import React, { useState, useRef } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  CheckCircle,
  Users,
  Edit2,
  Trash2,
  BookOpen,
  AlertCircle,
  Upload,
  FileText,
  File,
  Video,
  Music,
  Image as ImageIcon,
  Archive,
  Download,
  Paperclip,
  X,
  FileCode,
  Film,
  Check,
  Info,
  ShieldAlert,
  HardDrive
} from "lucide-react";
import { User, Tugas, PengumpulanTugas, ELEMEN_INFORMATIKA } from "../types";
import { WysiwygEditor } from "./WysiwygEditor";

interface TugasViewProps {
  user: User;
  tugasList: Tugas[];
  submissions: PengumpulanTugas[];
  isOnline: boolean;
  offlineQueue: any[];
  setOfflineQueue: (q: any[]) => void;
  onAddTugas: (tugas: Tugas) => void;
  onAddSubmission: (sub: PengumpulanTugas) => void;
  onUpdateSubmission: (sub: PengumpulanTugas) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  onAddNotification: (title: string, msg: string, type: "info" | "alert") => void;
  fetchAnalitika: () => void;
}

// Preset Ekstensi File
const PRESET_FILE_TYPES = [
  { group: "Dokumen & PDF", types: ["pdf", "doc", "docx", "txt"] },
  { group: "Spreadsheet / Tabel", types: ["xls", "xlsx", "csv"] },
  { group: "Presentasi / Slide", types: ["ppt", "pptx"] },
  { group: "Video & Animasi", types: ["mp4", "webm", "gif", "avi"] },
  { group: "Audio & Suara", types: ["mp3", "wav", "ogg", "m4a"] },
  { group: "Gambar & Grafik", types: ["png", "jpg", "jpeg", "svg"] },
  { group: "Arsip & Skrip Kode", types: ["zip", "rar", "py", "cpp", "html"] },
];

const ALL_DEFAULT_TYPES = [
  "doc", "docx", "pdf", "txt", "xls", "xlsx", "csv", "ppt", "pptx",
  "gif", "png", "jpg", "jpeg", "mp3", "wav", "mp4", "webm", "zip", "rar", "py", "cpp"
];

// Helper Format Ukuran Berkas
const formatBytes = (bytes?: number) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Helper Ikon Berkas
const renderFileIcon = (fileName?: string) => {
  const ext = (fileName || "").split(".").pop()?.toLowerCase() || "";
  if (["mp4", "webm", "avi", "mov", "mkv", "gif"].includes(ext)) {
    return <Film className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />;
  }
  if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) {
    return <Music className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  }
  if (["png", "jpg", "jpeg", "svg", "webp"].includes(ext)) {
    return <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />;
  }
  if (["pdf"].includes(ext)) {
    return <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />;
  }
  if (["doc", "docx", "txt", "rtf"].includes(ext)) {
    return <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />;
  }
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-300 shrink-0" />;
  }
  if (["ppt", "pptx"].includes(ext)) {
    return <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />;
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return <Archive className="h-5 w-5 text-amber-700 dark:text-amber-300 shrink-0" />;
  }
  if (["py", "cpp", "js", "ts", "html", "css"].includes(ext)) {
    return <FileCode className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />;
  }
  return <File className="h-5 w-5 text-slate-600 dark:text-slate-400 shrink-0" />;
};

export const TugasView: React.FC<TugasViewProps> = ({
  user,
  tugasList,
  submissions,
  isOnline,
  offlineQueue,
  setOfflineQueue,
  onAddTugas,
  onAddSubmission,
  onUpdateSubmission,
  showToast,
  onAddNotification,
  fetchAnalitika
}) => {
  const [isCreatingTugas, setIsCreatingTugas] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form Guru Membuat Evaluasi
  const [tugasForm, setTugasForm] = useState({
    judul: "",
    instruksi: "",
    elemen: "BK",
    kelas: "X" as "X" | "XI" | "XII",
    deadline: "",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS" as "TUGAS_TERULIS" | "KUIS",
    soalKuis: [] as any[],
    modePengumpulan: "TEKS_DAN_FILE" as "TEKS" | "FILE" | "TEKS_DAN_FILE",
    maxFileSizeMb: 10,
    allowedFileTypes: ALL_DEFAULT_TYPES,
  });

  const [newQuestion, setNewQuestion] = useState({
    pertanyaan: "",
    pilihan: ["", "", "", ""],
    jawabanBenar: 0,
  });

  // State Pengerjaan Siswa
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScoreResult, setQuizScoreResult] = useState<number | null>(null);
  const [submissionJawabanText, setSubmissionJawabanText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    fileNama: string;
    fileTipe: string;
    fileUkuran: number;
    fileData: string;
  } | null>(null);

  const [isEditingSubmission, setIsEditingSubmission] = useState(false);
  const [fileValidationError, setFileValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Penilaian Guru
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<any | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(100);
  const [gradingComment, setGradingComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddQuestionToForm = () => {
    if (!newQuestion.pertanyaan.trim()) return;
    const currentQuestions = tugasForm.soalKuis || [];
    setTugasForm({
      ...tugasForm,
      soalKuis: [...currentQuestions, { ...newQuestion, id: `q-${Date.now()}` }]
    });
    setNewQuestion({
      pertanyaan: "",
      pilihan: ["", "", "", ""],
      jawabanBenar: 0,
    });
  };

  const handleToggleFileType = (type: string) => {
    const current = tugasForm.allowedFileTypes || [];
    if (current.includes(type)) {
      setTugasForm({
        ...tugasForm,
        allowedFileTypes: current.filter((t) => t !== type)
      });
    } else {
      setTugasForm({
        ...tugasForm,
        allowedFileTypes: [...current, type]
      });
    }
  };

  const handleSelectAllTypes = () => {
    setTugasForm({ ...tugasForm, allowedFileTypes: ALL_DEFAULT_TYPES });
  };

  const handleCreateTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Set active academic year id if available in local context
    const storedYears = localStorage.getItem("lmtms_years");
    let activeYearId = "tp-2";
    if (storedYears) {
      try {
        const parsedYears = JSON.parse(storedYears);
        const activeY = parsedYears.find((y: any) => y.aktif);
        if (activeY) activeYearId = activeY.id;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const payload = {
        ...tugasForm,
        tahunPelajaranId: activeYearId,
      };

      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onAddTugas(data.data);
        setIsCreatingTugas(false);
        setSelectedTugas(data.data);
        showToast("Tugas/Kuis berhasil diterbitkan!", "success");
        setTugasForm({
          judul: "",
          instruksi: "",
          elemen: "BK",
          kelas: "X",
          deadline: "",
          totalPoin: 100,
          tipe: "TUGAS_TERULIS",
          soalKuis: [],
          modePengumpulan: "TEKS_DAN_FILE",
          maxFileSizeMb: 10,
          allowedFileTypes: ALL_DEFAULT_TYPES,
        });
      } else {
        setErrorMsg(data.message || "Gagal menerbitkan evaluasi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menghubungi server.");
    }
  };

  // Handler Pilihan File oleh Siswa
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileValidationError("");
    const file = e.target.files?.[0];
    if (!file || !selectedTugas) return;

    // 1. Validasi Batas Ukuran File
    const maxMb = selectedTugas.maxFileSizeMb || 10;
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileValidationError(
        `Ukuran file (${formatBytes(file.size)}) melebihi batasan maksimal ${maxMb} MB yang ditentukan oleh guru.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Validasi Format/Ekstensi File
    const allowed = selectedTugas.allowedFileTypes || ALL_DEFAULT_TYPES;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isAllowed = allowed.map((a) => a.toLowerCase().replace(".", "")).includes(ext);

    if (!isAllowed) {
      setFileValidationError(
        `Ekstensi .${ext} tidak diizinkan. Format yang diperbolehkan guru: ${allowed.join(", ")}.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Baca file sebagai Data URL base64
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        fileNama: file.name,
        fileTipe: file.type || "application/octet-stream",
        fileUkuran: file.size,
        fileData: reader.result as string,
      });
      showToast(`Berkas "${file.name}" siap diunggah!`, "info");
    };
    reader.onerror = () => {
      setFileValidationError("Gagal membaca berkas file yang dipilih.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFile(null);
    setFileValidationError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handler Pengumpulan Tugas Siswa
  const handleSubmissionSubmit = async () => {
    if (!selectedTugas || !user) return;
    setFileValidationError("");

    let jawabanPayload = "";
    if (selectedTugas.tipe === "KUIS") {
      jawabanPayload = JSON.stringify(quizAnswers);
    } else {
      jawabanPayload = submissionJawabanText;
      const mode = selectedTugas.modePengumpulan || "TEKS_DAN_FILE";

      if (mode === "TEKS" && !submissionJawabanText.trim()) {
        setFileValidationError("Guru mewajibkan jawaban berupa teks langsung. Silakan tulis tanggapan Anda!");
        return;
      }

      if (mode === "FILE" && !uploadedFile) {
        setFileValidationError("Guru mewajibkan unggah berkas tugas. Silakan pilih berkas file Anda!");
        return;
      }

      if (mode === "TEKS_DAN_FILE" && !submissionJawabanText.trim() && !uploadedFile) {
        setFileValidationError("Silakan isi tanggapan teks atau unggah berkas tugas Anda sebelum mengirim.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tugas/kumpul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tugasId: selectedTugas.id,
          siswaId: user.id,
          siswaNama: user.nama,
          jawabanSiswa: jawabanPayload,
          fileNama: uploadedFile?.fileNama,
          fileTipe: uploadedFile?.fileTipe,
          fileUkuran: uploadedFile?.fileUkuran,
          fileData: uploadedFile?.fileData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAddSubmission(data.data);
        if (selectedTugas.tipe === "KUIS") {
          setQuizScoreResult(data.data.nilai);
        } else {
          showToast("Tugas berhasil dikirim ke guru!", "success");
          setSubmissionJawabanText("");
          setUploadedFile(null);
          setIsEditingSubmission(false);
        }
        fetchAnalitika();
      } else {
        setFileValidationError(data.message || "Gagal mengumpulkan tugas.");
      }
    } catch (err) {
      console.error(err);
      setFileValidationError("Koneksi gagal saat mengumpulkan tugas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmissionForGrading || !selectedTugas) return;

    if (!isOnline) {
      const queueItem = {
        id: Math.random().toString(36).substr(2, 9),
        action: "grade_submission",
        payload: {
          id: selectedSubmissionForGrading.id,
          nilai: gradingScore,
          catatan: gradingComment
        },
        title: `Nilai Siswa: ${selectedSubmissionForGrading.siswaNama}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };

      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("lmtms_offline_queue", JSON.stringify(updatedQueue));

      const updatedSubmission = {
        ...selectedSubmissionForGrading,
        nilai: gradingScore,
        catatanGuru: gradingComment,
        status: "SELESAI" as const
      };
      onUpdateSubmission(updatedSubmission);
      setSelectedSubmissionForGrading(null);

      showToast("Offline Mode: Penilaian disimpan dalam antrean lokal!", "success");
      onAddNotification(
        "🗃️ Penilaian Disimpan Offline",
        `Hasil evaluasi siswa ${selectedSubmissionForGrading.siswaNama} dicatat dalam antrean sinkronisasi lokal.`,
        "info"
      );
      return;
    }

    try {
      const res = await fetch("/api/tugas/nilai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSubmissionForGrading.id,
          nilai: gradingScore,
          catatanGuru: gradingComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSubmission(data.data);
        setSelectedSubmissionForGrading(null);
        showToast("Penilaian berhasil disimpan ke server!", "success");
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
      showToast("Koneksi gagal. Tidak dapat mengirim nilai.", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="tugas-view-root">
      {/* Header Tab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Workspace Tugas & Kuis Informatika</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Kegiatan belajar harian, pengumpulan tugas praktik (teks & dokumen/media), serta evaluasi kuis.</p>
        </div>
        {user.role === "GURU" && (
          <button
            onClick={() => {
              setIsCreatingTugas(true);
              setSelectedTugas(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Evaluasi Baru</span>
          </button>
        )}
      </div>

      {isCreatingTugas ? (
        // Form membuat tugas / kuis
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Buat Lembar Evaluasi / Penugasan Baru</h3>
          <form onSubmit={handleCreateTugas} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tipe Evaluasi</label>
                <select
                  value={tugasForm.tipe}
                  onChange={(e) => setTugasForm({ ...tugasForm, tipe: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="TUGAS_TERULIS">Tugas Praktik / Tertulis / Berkas</option>
                  <option value="KUIS">Kuis Pilihan Ganda (Otomatis Dinilai)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Elemen</label>
                <select
                  value={tugasForm.elemen}
                  onChange={(e) => setTugasForm({ ...tugasForm, elemen: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {ELEMEN_INFORMATIKA.map((el) => (
                    <option key={el.kode} value={el.kode}>
                      {el.kode}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kelas</label>
                <select
                  value={tugasForm.kelas}
                  onChange={(e) => setTugasForm({ ...tugasForm, kelas: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Batas Pengumpulan (Deadline)</label>
                <input
                  type="date"
                  required
                  value={tugasForm.deadline}
                  onChange={(e) => setTugasForm({ ...tugasForm, deadline: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Poin Maksimal</label>
                <input
                  type="number"
                  required
                  value={tugasForm.totalPoin}
                  onChange={(e) => setTugasForm({ ...tugasForm, totalPoin: Number(e.target.value) })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Judul Evaluasi / Penugasan</label>
              <input
                type="text"
                required
                value={tugasForm.judul}
                onChange={(e) => setTugasForm({ ...tugasForm, judul: e.target.value })}
                placeholder="Contoh: Praktik Pemrograman Python atau Laporan Analisis Data"
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Instruksi & Petunjuk Pengerjaan</label>
              <WysiwygEditor
                id="tugas-instruksi-editor"
                value={tugasForm.instruksi}
                onChange={(val) => setTugasForm({ ...tugasForm, instruksi: val })}
                placeholder="Instruksi pengerjaan detail untuk tugas atau kuis..."
                heightClass="min-h-[160px]"
              />
            </div>

            {/* PENGATURAN MODE PENGUMPULAN & LIMITASI BERKAS KHUSUS TUGAS TERULIS */}
            {tugasForm.tipe === "TUGAS_TERULIS" && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <HardDrive className="h-4 w-4" />
                  <span>Pengaturan Mode Pengumpulan & Limitasi Berkas</span>
                </div>

                {/* Mode Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    Mode Pengumpulan Siswa:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: "TEKS_DAN_FILE",
                        label: "Teks & Unggah Berkas",
                        desc: "Siswa dapat mengetik teks atau mengunggah berkas file",
                      },
                      {
                        id: "FILE",
                        label: "Hanya Unggah Berkas",
                        desc: "Wajib mengunggah berkas (doc, pdf, video, dll)",
                      },
                      {
                        id: "TEKS",
                        label: "Hanya Teks Langsung",
                        desc: "Wajib mengetik di editor web aplikasi ini",
                      },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setTugasForm({ ...tugasForm, modePengumpulan: m.id as any })}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          tugasForm.modePengumpulan === m.id
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="font-bold text-xs">{m.label}</span>
                        <span className={`text-[10px] mt-1 ${tugasForm.modePengumpulan === m.id ? "text-indigo-100" : "text-slate-400"}`}>
                          {m.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limitasi Ukuran & Format Berkas jika mode mengizinkan file */}
                {tugasForm.modePengumpulan !== "TEKS" && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Batas Ukuran Maksimal Berkas (Per Siswa):
                      </label>
                      <select
                        value={tugasForm.maxFileSizeMb}
                        onChange={(e) => setTugasForm({ ...tugasForm, maxFileSizeMb: Number(e.target.value) })}
                        className="block w-full sm:w-48 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-bold focus:outline-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      >
                        <option value={2}>2 MB</option>
                        <option value={5}>5 MB</option>
                        <option value={10}>10 MB (Standar)</option>
                        <option value={25}>25 MB</option>
                        <option value={50}>50 MB (Media / Video)</option>
                        <option value={100}>100 MB (Proyek Besar)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Format / Ekstensi Berkas yang Diizinkan:
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllTypes}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Pilih Semua Preset Format
                        </button>
                      </div>

                      <div className="space-y-2">
                        {PRESET_FILE_TYPES.map((group) => (
                          <div key={group.group} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                              {group.group}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {group.types.map((ext) => {
                                const isChecked = (tugasForm.allowedFileTypes || []).includes(ext);
                                return (
                                  <button
                                    type="button"
                                    key={ext}
                                    onClick={() => handleToggleFileType(ext)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition flex items-center gap-1 ${
                                      isChecked
                                        ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {isChecked && <Check className="h-3 w-3" />}
                                    <span>.{ext}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pembentuk Soal jika tipe KUIS */}
            {tugasForm.tipe === "KUIS" && (
              <div className="border border-indigo-100 dark:border-slate-800 bg-indigo-50/10 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>Pembuat Soal Pilihan Ganda</span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {(tugasForm.soalKuis || []).length} Soal Terbuat
                  </span>
                </h4>

                {/* List Soal */}
                <div className="space-y-2">
                  {(tugasForm.soalKuis || []).map((q: any, qIdx: number) => (
                    <div key={q.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Soal {qIdx + 1}: {q.pertanyaan}</span>
                      <div className="grid grid-cols-2 gap-1 text-slate-500 dark:text-slate-400">
                        {q.pilihan.map((pil: string, pIdx: number) => (
                          <span key={pIdx} className={q.jawabanBenar === pIdx ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>
                            {String.fromCharCode(65 + pIdx)}. {pil}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form tambah soal baru */}
                <div className="space-y-3 pt-3 border-t border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-150 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pertanyaan Kuis</label>
                    <input
                      type="text"
                      value={newQuestion.pertanyaan}
                      onChange={(e) => setNewQuestion({ ...newQuestion, pertanyaan: e.target.value })}
                      placeholder="Masukkan teks soal..."
                      className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newQuestion.pilihan.map((pil, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase">Pilihan {String.fromCharCode(65 + idx)}</label>
                        <input
                          type="text"
                          value={pil}
                          onChange={(e) => {
                            const nextPil = [...newQuestion.pilihan];
                            nextPil[idx] = e.target.value;
                            setNewQuestion({ ...newQuestion, pilihan: nextPil });
                          }}
                          placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                          className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Benar</label>
                    <select
                      value={newQuestion.jawabanBenar}
                      onChange={(e) => setNewQuestion({ ...newQuestion, jawabanBenar: Number(e.target.value) })}
                      className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      <option value={0}>Pilihan A</option>
                      <option value={1}>Pilihan B</option>
                      <option value={2}>Pilihan C</option>
                      <option value={3}>Pilihan D</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuestionToForm}
                    className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
                  >
                    + Tambahkan Soal ke Kuis
                  </button>
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
                onClick={() => setIsCreatingTugas(false)}
                className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Terbitkan Evaluasi
              </button>
            </div>
          </form>
        </div>
      ) : selectedTugas ? (
        // Workspace Aktif Tugas Terpilih
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => {
              setSelectedTugas(null);
              setQuizScoreResult(null);
              setQuizAnswers({});
              setUploadedFile(null);
              setFileValidationError("");
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold mb-4 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Tugas</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
              {selectedTugas.tipe.replace("_", " ")}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Elemen {selectedTugas.elemen}</span>
            <span className="text-xs text-slate-400 font-semibold">• Batas: {selectedTugas.deadline}</span>
          </div>

          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">{selectedTugas.judul}</h3>

          <div
            className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedTugas.instruksi }}
          />

          {/* ALUR SISWA: MENGERJAKAN TUGAS / KUIS */}
          {user.role === "SISWA" && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              {/* Check status submission siswa */}
              {(() => {
                const mySub = submissions.find((s) => s.tugasId === selectedTugas.id && s.siswaId === user.id);
                if (mySub && !isEditingSubmission) {
                  return (
                    <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                          <CheckCircle className="h-5 w-5 shrink-0" />
                          <span>Anda telah berhasil mengumpulkan tugas ini!</span>
                        </div>
                        {selectedTugas.tipe !== "KUIS" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSubmissionJawabanText(mySub.jawabanSiswa || "");
                              if (mySub.fileData && mySub.fileNama) {
                                setUploadedFile({
                                  fileNama: mySub.fileNama,
                                  fileTipe: mySub.fileTipe || "application/octet-stream",
                                  fileUkuran: mySub.fileUkuran || 0,
                                  fileData: mySub.fileData,
                                });
                              } else {
                                setUploadedFile(null);
                              }
                              setIsEditingSubmission(true);
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Kirim Ulang / Edit Tugas</span>
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-900/30">
                        <p><strong>Tanggal Dikumpul:</strong> {new Date(mySub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                        <p><strong>Nilai Diperoleh:</strong> {mySub.nilai !== undefined ? `${mySub.nilai} / ${selectedTugas.totalPoin}` : "Menunggu penilaian guru"}</p>
                        {mySub.catatanGuru && <p className="bg-emerald-100/60 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-900 dark:text-emerald-200"><strong>Catatan Guru:</strong> {mySub.catatanGuru}</p>}

                        {/* Jawaban Teks Siswa */}
                        {mySub.jawabanSiswa && selectedTugas.tipe !== "KUIS" && (
                          <div className="space-y-1">
                            <span className="font-bold text-slate-600 dark:text-slate-400 block">Jawaban Teks Terkirim:</span>
                            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-h-48 overflow-y-auto font-mono text-xs">
                              <div dangerouslySetInnerHTML={{ __html: mySub.jawabanSiswa }} />
                            </div>
                          </div>
                        )}

                        {/* Berkas Terlampir Siswa */}
                        {mySub.fileData && (
                          <div className="space-y-1 pt-1">
                            <span className="font-bold text-slate-600 dark:text-slate-400 block">Berkas Terlampir:</span>
                            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {renderFileIcon(mySub.fileNama)}
                                <div className="overflow-hidden">
                                  <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{mySub.fileNama}</p>
                                  <p className="text-[10px] text-slate-400">{formatBytes(mySub.fileUkuran)}</p>
                                </div>
                              </div>
                              <a
                                href={mySub.fileData}
                                download={mySub.fileNama || "tugas_siswa"}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Unduh</span>
                              </a>
                            </div>

                            {/* Live Media Preview if image / audio / video */}
                            {mySub.fileData.startsWith("data:image/") && (
                              <div className="mt-2">
                                <img
                                  src={mySub.fileData}
                                  alt={mySub.fileNama}
                                  referrerPolicy="no-referrer"
                                  className="max-h-60 rounded-xl border border-slate-200 dark:border-slate-800 object-contain"
                                />
                              </div>
                            )}
                            {mySub.fileData.startsWith("data:audio/") && (
                              <div className="mt-2">
                                <audio controls src={mySub.fileData} className="w-full" />
                              </div>
                            )}
                            {mySub.fileData.startsWith("data:video/") && (
                              <div className="mt-2">
                                <video controls src={mySub.fileData} className="max-h-60 w-full rounded-xl border border-slate-200 dark:border-slate-800" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // JIKA BELUM SUBMIT & TIPENYA KUIS
                if (selectedTugas.tipe === "KUIS") {
                  if (quizScoreResult !== null) {
                    return (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl text-center space-y-2">
                        <Award className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                        <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">Kuis Selesai!</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Skor Anda berhasil dihitung otomatis oleh sistem LMTMS:</p>
                        <span className="inline-block text-3xl font-display font-bold text-indigo-700 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 px-6 py-2 rounded-xl mt-2">
                          {quizScoreResult} / {selectedTugas.totalPoin}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-2">Kerjakan Soal Kuis</h4>
                      {(selectedTugas.soalKuis || []).map((soal: any, idx: number) => (
                        <div key={soal.id} className="space-y-3 border-b border-slate-50 dark:border-slate-800/60 pb-5">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {idx + 1}. {soal.pertanyaan}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {soal.pilihan.map((pil: string, pIdx: number) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setQuizAnswers({ ...quizAnswers, [soal.id]: pIdx })}
                                className={`p-3 text-left border rounded-xl text-xs transition flex items-center justify-between ${
                                  quizAnswers[soal.id] === pIdx
                                    ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-800 dark:text-indigo-300 dark:bg-indigo-950/30"
                                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                <span>{String.fromCharCode(65 + pIdx)}. {pil}</span>
                                {quizAnswers[soal.id] === pIdx && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSubmissionSubmit}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 dark:shadow-none"
                      >
                        Kirim & Selesaikan Kuis
                      </button>
                    </div>
                  );
                }

                // JIKA BELUM SUBMIT & TIPENYA TUGAS TERULIS
                const mode = selectedTugas.modePengumpulan || "TEKS_DAN_FILE";
                const maxMb = selectedTugas.maxFileSizeMb || 10;
                const allowedTypes = selectedTugas.allowedFileTypes || ALL_DEFAULT_TYPES;

                return (
                  <div className="space-y-5">
                    {isEditingSubmission && (
                      <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs">
                        <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                          <Edit2 className="h-4 w-4 text-indigo-600" />
                          <span>Mode Edit / Kirim Ulang: Anda sedang memperbarui tanggapan atau berkas tugas.</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditingSubmission(false)}
                          className="text-slate-500 hover:text-slate-800 dark:text-slate-300 font-bold hover:underline text-[11px]"
                        >
                          Batal Edit
                        </button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b dark:border-slate-800 pb-3">
                      <div>
                        <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-sm">Form Lembar Jawaban & Berkas Tugas</h4>
                        <p className="text-xs text-slate-400">Kerjakan tugas sesuai dengan ketentuan yang diberikan guru.</p>
                      </div>

                      {/* Info Badge Ketentuan */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900 font-bold">
                          Mode: {mode === "TEKS_DAN_FILE" ? "Teks & Berkas" : mode === "FILE" ? "Hanya Unggah Berkas" : "Hanya Teks"}
                        </span>
                        {mode !== "TEKS" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold">
                            Max: {maxMb} MB
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ringkasan Format Berkas yang Diizinkan Guru */}
                    {mode !== "TEKS" && (
                      <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold">
                          <Info className="h-4 w-4 shrink-0 text-indigo-500" />
                          <span>Ketentuan Berkas yang Diizinkan Guru:</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                          Kapasitas maksimal: <strong className="text-slate-900 dark:text-white font-mono">{maxMb} MB</strong> per berkas.
                          <br />
                          Format ekstensi: <span className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">{allowedTypes.join(", ")}</span>.
                        </p>
                      </div>
                    )}

                    {/* INPUT TEKS LANGSUNG */}
                    {(mode === "TEKS" || mode === "TEKS_DAN_FILE") && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Jawaban / Tanggapan Teks Langsung {mode === "FILE" ? "(Opsional)" : ""}
                        </label>
                        <WysiwygEditor
                          id="submission-jawaban-editor"
                          value={submissionJawabanText}
                          onChange={(val) => setSubmissionJawabanText(val)}
                          placeholder="Ketik tanggapan, kode program Python, atau penjelasan tugas Anda di sini..."
                          heightClass="min-h-[180px]"
                        />
                      </div>
                    )}

                    {/* UNGGAH BERKAS FILE */}
                    {(mode === "FILE" || mode === "TEKS_DAN_FILE") && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Unggah Berkas File Tugas {mode === "TEKS" ? "(Opsional)" : ""}
                        </label>

                        {!uploadedFile ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/20 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                          >
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full">
                              <Upload className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Ketuk untuk memilih berkas tugas dari perangkat Anda
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Mendukung dokumen (doc, pdf), spreadsheet (xls), presentasi (ppt), video (mp4), audio (mp3), animasi (gif), gambar & arsip (zip)
                              </p>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              accept={allowedTypes.map((t) => `.${t}`).join(",")}
                            />
                          </div>
                        ) : (
                          // Live Card Preview Berkas Terpilih
                          <div className="p-4 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 overflow-hidden">
                                {renderFileIcon(uploadedFile.fileNama)}
                                <div className="overflow-hidden">
                                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {uploadedFile.fileNama}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Ukuran: {formatBytes(uploadedFile.fileUkuran)} • Siap diunggah
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveUploadedFile}
                                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 rounded-lg transition"
                                title="Hapus Berkas"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Preview Media Langsung */}
                            {uploadedFile.fileData.startsWith("data:image/") && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] text-slate-400 block mb-1">Pratinjau Gambar:</span>
                                <img
                                  src={uploadedFile.fileData}
                                  alt={uploadedFile.fileNama}
                                  referrerPolicy="no-referrer"
                                  className="max-h-48 rounded-xl border border-slate-200 dark:border-slate-700 object-contain"
                                />
                              </div>
                            )}

                            {uploadedFile.fileData.startsWith("data:audio/") && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] text-slate-400 block mb-1">Pratinjau Suara/Audio:</span>
                                <audio controls src={uploadedFile.fileData} className="w-full" />
                              </div>
                            )}

                            {uploadedFile.fileData.startsWith("data:video/") && (
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] text-slate-400 block mb-1">Pratinjau Video:</span>
                                <video controls src={uploadedFile.fileData} className="max-h-56 w-full rounded-xl border border-slate-200 dark:border-slate-700" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {fileValidationError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{fileValidationError}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmissionSubmit}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Mengirim Berkas & Jawaban...</span>
                      ) : (
                        <>
                          <Paperclip className="h-4 w-4" />
                          <span>Kumpulkan Tugas Praktik</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ALUR GURU: GRADING / MENILAI TUGAS SISWA */}
          {user.role === "GURU" && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                <Users className="h-5 w-5 text-indigo-500" />
                <span>Daftar Pengumpulan Siswa</span>
              </h4>

              {/* List submissions dari seluruh siswa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.filter((s) => s.tugasId === selectedTugas.id).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 col-span-2 text-center">Belum ada siswa yang mengumpulkan.</p>
                ) : (
                  submissions
                    .filter((s) => s.tugasId === selectedTugas.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-2xl space-y-3 relative transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 text-xs">{sub.siswaNama}</h5>
                            <p className="text-[10px] text-slate-400">Dikumpul: {new Date(sub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                              sub.status === "SELESAI" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}
                          >
                            {sub.status === "SELESAI" ? `NILAI: ${sub.nilai}` : "BELUM DINILAI"}
                          </span>
                        </div>

                        {/* Teks Jawaban */}
                        {sub.jawabanSiswa && (
                          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg max-h-36 overflow-y-auto">
                            {selectedTugas.tipe === "KUIS" ? (
                              <p className="font-mono text-[10px]">Jawaban Kuis: {sub.jawabanSiswa}</p>
                            ) : (
                              <div dangerouslySetInnerHTML={{ __html: sub.jawabanSiswa }} />
                            )}
                          </div>
                        )}

                        {/* File Lampiran Siswa */}
                        {sub.fileData && (
                          <div className="bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                {renderFileIcon(sub.fileNama)}
                                <div className="overflow-hidden">
                                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{sub.fileNama}</p>
                                  <p className="text-[10px] text-slate-400">{formatBytes(sub.fileUkuran)}</p>
                                </div>
                              </div>
                              <a
                                href={sub.fileData}
                                download={sub.fileNama || "file_siswa"}
                                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-lg flex items-center gap-1 transition"
                              >
                                <Download className="h-3 w-3" />
                                <span>Unduh</span>
                              </a>
                            </div>

                            {/* Media Player jika Gambar/Audio/Video */}
                            {sub.fileData.startsWith("data:image/") && (
                              <img
                                src={sub.fileData}
                                alt={sub.fileNama}
                                referrerPolicy="no-referrer"
                                className="max-h-48 rounded-lg border border-slate-100 dark:border-slate-800 object-contain"
                              />
                            )}
                            {sub.fileData.startsWith("data:audio/") && (
                              <audio controls src={sub.fileData} className="w-full" />
                            )}
                            {sub.fileData.startsWith("data:video/") && (
                              <video controls src={sub.fileData} className="max-h-48 w-full rounded-lg" />
                            )}
                          </div>
                        )}

                        {sub.catatanGuru && (
                          <p className="text-[10px] text-slate-500 bg-indigo-50/30 dark:bg-indigo-950/20 p-1.5 rounded">
                            <strong>Umpan Balik:</strong> {sub.catatanGuru}
                          </p>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              setSelectedSubmissionForGrading(sub);
                              setGradingScore(sub.nilai || 100);
                              setGradingComment(sub.catatanGuru || "");
                            }}
                            className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>{sub.status === "SELESAI" ? "Koreksi Nilai" : "Berikan Nilai"}</span>
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Modal Panel Grading */}
              {selectedSubmissionForGrading && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
                    <h4 className="font-display font-bold text-slate-800 dark:text-white text-sm">Penilaian & Koreksi Tugas</h4>
                    <p className="text-xs text-slate-500">
                      Memberikan penilaian untuk siswa: <strong className="text-indigo-600 dark:text-indigo-400">{selectedSubmissionForGrading.siswaNama}</strong>
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Perolehan Nilai (Maks {selectedTugas.totalPoin})</label>
                      <input
                        type="number"
                        required
                        min={0}
                        max={selectedTugas.totalPoin}
                        value={gradingScore}
                        onChange={(e) => setGradingScore(Number(e.target.value))}
                        className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Umpan Balik & Catatan Guru</label>
                      <WysiwygEditor
                        id="grading-comment-editor"
                        value={gradingComment}
                        onChange={(val) => setGradingComment(val)}
                        placeholder="Tulis masukan konstruktif untuk memotivasi siswa..."
                        heightClass="min-h-[120px]"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmissionForGrading(null)}
                        className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleGradeSubmission}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Simpan Penilaian
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Daftar seluruh evaluasi (Tugas & Kuis)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tugasList.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Belum ada evaluasi atau tugas yang diterbitkan.</p>
            </div>
          ) : (
            tugasList.map((t) => {
              const submissionsCount = submissions.filter((s) => s.tugasId === t.id).length;
              const mySub = submissions.find((s) => s.tugasId === t.id && s.siswaId === user.id);
              return (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
                        {t.tipe.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">Elemen {t.elemen}</span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm mt-3.5 line-clamp-1">{t.judul}</h3>
                    <div
                      className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: t.instruksi }}
                    />

                    {/* Badge Ketentuan Pengumpulan untuk Tugas Terulis */}
                    {t.tipe === "TUGAS_TERULIS" && (
                      <div className="mt-3 flex flex-wrap gap-1 text-[10px] font-mono">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {t.modePengumpulan === "TEKS" ? "Hanya Teks" : t.modePengumpulan === "FILE" ? "Hanya File" : "Teks & File"}
                        </span>
                        {t.modePengumpulan !== "TEKS" && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            Max: {t.maxFileSizeMb || 10} MB
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4 mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Batas: {t.deadline}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Poin: {t.totalPoin}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedTugas(t)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-0.5 transition"
                    >
                      <span>
                        {user.role === "SISWA"
                          ? mySub
                            ? "Tinjau Hasil"
                            : "Mulai Kerjakan"
                          : "Kelola Evaluasi"}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    {user.role === "GURU" && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-150/20">
                        {submissionsCount} Dikumpul
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
