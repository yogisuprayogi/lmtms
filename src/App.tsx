import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Users,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Printer,
  Download,
  Plus,
  Trash2,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  ChevronRight,
  LogOut,
  ChevronLeft,
  RefreshCw,
  Search,
  BookMarked,
  Layers,
  ChevronDown,
  Activity,
  Edit2,
  Save,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Bold,
  Italic,
  List
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { exportDocumentToPdf } from "./lib/pdfExporter";
import { downloadSelectedDocumentsZip } from "./lib/zipExporter";
import * as XLSX from "xlsx";
import { ELEMEN_INFORMATIKA, User, TahunPelajaran } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { WysiwygEditor } from "./components/WysiwygEditor";
import { AnalitikaView } from "./components/AnalitikaView";
import { LoginView } from "./components/LoginView";
import { LogsView } from "./components/LogsView";
import { SettingsView } from "./components/SettingsView";
import { AcademicManagementView } from "./components/AcademicManagementView";
import { LmsView } from "./components/LmsView";
import { TeachingManagementView } from "./components/TeachingManagementView";
import { AiTeachingAssistantView } from "./components/AiTeachingAssistantView";
import { MateriView } from "./components/MateriView";
import { TugasView } from "./components/TugasView";

export default function App() {
  // Default demo user (Guru Pengampu) if no session saved
  const defaultGuruUser: User = {
    id: "u1",
    username: "yogi",
    nama: "Yogi Suprayogi, S.Kom.",
    role: "GURU",
    nip: "19850615 201001 1 012",
    email: "yogisuprayogi02@guru.smk.belajar.id"
  };

  // Auth states
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("lmtms_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // General App states
  const [currentTab, setCurrentTab] = useState<
    "dashboard" | "lms" | "teaching" | "perangkat" | "materi" | "tugas" | "absensi" | "administrasi" | "logs" | "settings" | "ai_assistant"
  >("dashboard");
  const [years, setYears] = useState<TahunPelajaran[]>([]);
  const [activeYear, setActiveYear] = useState<TahunPelajaran | null>(null);

  // Perangkat Guru states
  const [perangkatDocs, setPerangkatDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [selectedPerangkatIds, setSelectedPerangkatIds] = useState<string[]>([]);
  const [isZippingPerangkat, setIsZippingPerangkat] = useState(false);
  const [filterJenis, setFilterJenis] = useState<string>("ALL");
  const [filterKelas, setFilterKelas] = useState<string>("ALL");
  const [searchPerangkat, setSearchPerangkat] = useState<string>("");

  const filteredPerangkatDocs = perangkatDocs.filter((doc) => {
    const matchJenis = filterJenis === "ALL" || doc.jenis === filterJenis;
    const matchKelas = filterKelas === "ALL" || doc.kelas === filterKelas;
    const matchSearch =
      !searchPerangkat ||
      doc.judul?.toLowerCase().includes(searchPerangkat.toLowerCase()) ||
      doc.konten?.toLowerCase().includes(searchPerangkat.toLowerCase());
    return matchJenis && matchKelas && matchSearch;
  });
  const [docForm, setDocForm] = useState({
    judul: "",
    jenis: "MODUL_AJAR",
    elemen: "BK",
    kelas: "X",
    konten: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiDocType, setAiDocType] = useState("Modul Ajar / RPP");
  const [aiNotification, setAiNotification] = useState("");

  const handleDownloadSelectedZip = async () => {
    if (selectedPerangkatIds.length === 0) return;
    setIsZippingPerangkat(true);
    showToast(`Membundel ${selectedPerangkatIds.length} dokumen ke dalam arsip ZIP...`, "info");

    try {
      const selectedDocsData = perangkatDocs
        .filter((doc) => selectedPerangkatIds.includes(doc.id))
        .map((doc) => ({
          judul: doc.judul,
          konten: doc.konten,
          jenis: doc.jenis,
          kelas: doc.kelas,
          elemen: doc.elemen,
          userEmail: user?.email || "yogisuprayogi02@guru.smk.belajar.id"
        }));

      await downloadSelectedDocumentsZip(
        selectedDocsData,
        `Perangkat_Pembelajaran_Terpilih_${new Date().toISOString().slice(0, 10)}.zip`
      );
      showToast(`Berhasil mengunduh ${selectedPerangkatIds.length} dokumen dalam format ZIP!`, "success");
    } catch (err) {
      console.error("Gagal mengunduh ZIP:", err);
      showToast("Gagal mengunduh arsip ZIP. Silakan coba lagi.", "error");
    } finally {
      setIsZippingPerangkat(false);
    }
  };

  // Materi states
  const [materiList, setMateriList] = useState<any[]>([]);
  const [selectedMateri, setSelectedMateri] = useState<any | null>(null);
  const [isCreatingMateri, setIsCreatingMateri] = useState(false);
  const [materiForm, setMateriForm] = useState({
    judul: "",
    deskripsi: "",
    elemen: "BK",
    kelas: "X",
    konten: "",
  });

  // Tugas & Kuis states
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [selectedTugas, setSelectedTugas] = useState<any | null>(null);
  const [isCreatingTugas, setIsCreatingTugas] = useState(false);
  const [tugasForm, setTugasForm] = useState<any>({
    judul: "",
    instruksi: "",
    elemen: "BK",
    kelas: "X",
    deadline: "",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS",
    soalKuis: [],
  });
  // State kuis pembuat
  const [newQuestion, setNewQuestion] = useState({
    pertanyaan: "",
    pilihan: ["", "", "", ""],
    jawabanBenar: 0,
  });

  // Submission / Kumpul tugas
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionJawabanText, setSubmissionJawabanText] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScoreResult, setQuizScoreResult] = useState<number | null>(null);
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<any | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(100);
  const [gradingComment, setGradingComment] = useState("");

  // Absensi states
  const [attendanceDate, setAttendanceDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [attendanceClass, setAttendanceClass] = useState("X-1");
  const [exportMonth, setExportMonth] = useState<string>(() => new Date().toISOString().split("T")[0].substring(0, 7));
  const [studentList, setStudentList] = useState<any[]>([]);
  const [attendanceGrid, setAttendanceGrid] = useState<Record<string, { status: string; catatan: string }>>({});
  const [absensiNotification, setAbsensiNotification] = useState("");

  // Analitika states
  const [analitika, setAnalitika] = useState<any>({
    kehadiranRataRata: 92,
    tugasDiselesaikan: 84,
    nilaiRataRata: 83,
    distribusiNilai: [
      { rentang: "90-100 (A)", jumlah: 5 },
      { rentang: "80-89 (B)", jumlah: 12 },
      { rentang: "70-79 (C)", jumlah: 8 },
      { rentang: "60-69 (D)", jumlah: 2 },
      { rentang: "0-59 (E)", jumlah: 1 },
    ],
    pencapaianElemen: [
      { elemen: "BK", nilai: 90 },
      { elemen: "AP", nilai: 82 },
      { elemen: "TIK", nilai: 88 },
      { elemen: "SK", nilai: 80 },
    ],
  });

  // Admin / User Management
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newTpForm, setNewTpForm] = useState({ tahun: "2025/2026", semester: "GANJIL" });

  // PWA & Simulated Offline states
  const [isOnline, setIsOnline] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("lmtms_dark") === "true";
  });
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("lmtms_theme") || "classic";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [hasShownDeadlinePopup, setHasShownDeadlinePopup] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    const stored = localStorage.getItem("lmtms_offline_queue");
    return stored ? JSON.parse(stored) : [];
  });
  const [notifications, setNotifications] = useState<any[]>(() => {
    const stored = localStorage.getItem("lmtms_notifications");
    if (stored) return JSON.parse(stored);
    return [
      {
        id: "1",
        title: "👋 Selamat Datang di LMTMS!",
        message: "Sistem Portal Administrasi & LMS terpadu siap digunakan.",
        time: "10:00",
        type: "info",
        read: false
      },
      {
        id: "2",
        title: "📱 PWA Offline Ready!",
        message: "Aplikasi ini dapat diakses sepenuhnya tanpa koneksi internet.",
        time: "10:01",
        type: "info",
        read: false
      }
    ];
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Student role protection guard
  useEffect(() => {
    if (user?.role === "SISWA") {
      const teacherOnlyTabs = ["teaching", "perangkat", "ai_assistant", "absensi", "administrasi", "logs"];
      if (teacherOnlyTabs.includes(currentTab)) {
        setCurrentTab("dashboard");
      }
    }
  }, [user, currentTab]);

  const handleAddNotification = (title: string, message: string, type: "info" | "alert" = "info") => {
    const newNotif = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      type,
      read: false
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("lmtms_notifications", JSON.stringify(updated));
    showToast(title, type === "alert" ? "error" : "success");
  };

  const handleClearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("lmtms_notifications", JSON.stringify(updated));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("lmtms_notifications", "[]");
    showToast("Seluruh notifikasi berhasil dibersihkan.", "info");
  };

  // Sync offline queue actions
  const processOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem("lmtms_offline_queue") || "[]");
    if (queue.length === 0) return;

    showToast(`Mensinkronisasikan ${queue.length} perubahan offline...`, "info");
    let successCount = 0;

    for (const item of queue) {
      try {
        if (item.action === "save_attendance") {
          const dataAbsensi = Object.entries(item.payload.grid).map(([siswaId, info]: [string, any]) => {
            return {
              siswaId,
              siswaNama: "Siswa",
              status: info.status,
              catatan: info.catatan,
            };
          });

          await fetch("/api/absensi/simpan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tanggal: item.payload.date,
              kelas: item.payload.class,
              dataAbsensi,
            }),
          });
        } else if (item.action === "grade_submission") {
          await fetch("/api/tugas/nilai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: item.payload.id,
              nilai: item.payload.nilai,
              catatanGuru: item.payload.catatan,
            }),
          });
        }
        successCount++;
      } catch (err) {
        console.error("Gagal sinkronisasi item:", item, err);
      }
    }

    localStorage.setItem("lmtms_offline_queue", "[]");
    setOfflineQueue([]);
    
    if (successCount > 0) {
      showToast(`Berhasil menyinkronkan ${successCount} data ke server!`, "success");
      handleAddNotification(
        "🔄 Sinkronisasi Offline Berhasil",
        `Sebanyak ${successCount} perubahan berhasil diselaraskan ke server utama.`,
        "info"
      );
      fetchAnalitika();
    }
  };

  const handleToggleOnlineSimulated = () => {
    if (isOnline) {
      setIsOnline(false);
      showToast("Mode Offline PWA Diaktifkan (Simulasi)", "info");
    } else {
      setIsOnline(true);
      showToast("Kembali Online. Menyinkronkan...", "success");
      processOfflineQueue();
    }
  };

  // Browser online listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Koneksi Internet Pulih! Mensinkronisasikan...", "success");
      processOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("Koneksi Internet Terputus. Masuk ke Mode Offline.", "info");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Apply theme & dark mode to document element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("lmtms_dark", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const themes: Record<string, Record<string, string>> = {
      classic: {
        "--theme-primary": "#4f46e5",
        "--theme-primary-hover": "#3730a3",
        "--theme-bg-light": "#f5f3ff",
        "--theme-text": "#4f46e5",
        "--theme-border": "#ddd6fe"
      },
      emerald: {
        "--theme-primary": "#10b981",
        "--theme-primary-hover": "#047857",
        "--theme-bg-light": "#ecfdf5",
        "--theme-text": "#047857",
        "--theme-border": "#a7f3d0"
      },
      amethyst: {
        "--theme-primary": "#8b5cf6",
        "--theme-primary-hover": "#6d28d9",
        "--theme-bg-light": "#f5f3ff",
        "--theme-text": "#6d28d9",
        "--theme-border": "#ddd6fe"
      },
      sunset: {
        "--theme-primary": "#ec4899",
        "--theme-primary-hover": "#be185d",
        "--theme-bg-light": "#fdf2f8",
        "--theme-text": "#be185d",
        "--theme-border": "#fbcfe8"
      },
      amber: {
        "--theme-primary": "#f59e0b",
        "--theme-primary-hover": "#b45309",
        "--theme-bg-light": "#fffbeb",
        "--theme-text": "#b45309",
        "--theme-border": "#fde68a"
      }
    };

    const currentMap = themes[activeTheme] || themes.classic;
    Object.entries(currentMap).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val);
    });
    localStorage.setItem("lmtms_theme", activeTheme);
  }, [activeTheme]);

  // Fetch initial system data
  useEffect(() => {
    fetchYears();
    fetchAnalitika();
    if (user?.role === "GURU" || user?.role === "ADMIN") {
      fetchPerangkatDocs();
      fetchUsers();
    }
    fetchMateriList();
    fetchTugasList();
  }, [user]);

  // Auto-trigger deadline notification popup once when data is loaded and user is authenticated
  useEffect(() => {
    if (user && !hasShownDeadlinePopup && (tugasList.length > 0 || submissions.length > 0)) {
      let hasPending = false;
      if (user.role === "SISWA") {
        const pendingCount = tugasList.filter((t) => {
          const hasSubmitted = submissions.some(
            (s) => s.tugasId === t.id && s.siswaId === user.id
          );
          return !hasSubmitted;
        }).length;
        if (pendingCount > 0) hasPending = true;
      } else {
        const pendingCount = submissions.filter((s) => s.status === "BELUM_DINILAI").length;
        if (pendingCount > 0) hasPending = true;
      }

      if (hasPending) {
        setShowDeadlinePopup(true);
        setHasShownDeadlinePopup(true);
      }
    }
  }, [tugasList, submissions, user, hasShownDeadlinePopup]);

  // Handle Absensi form load when class or date changes
  useEffect(() => {
    if (user?.role === "GURU" && attendanceClass) {
      loadAttendanceData();
    }
  }, [attendanceDate, attendanceClass, user]);

  const fetchYears = async () => {
    try {
      const res = await fetch("/api/tahun-pelajaran");
      const data = await res.json();
      setYears(data);
      const active = data.find((y: any) => y.aktif);
      setActiveYear(active || null);
    } catch (err) {
      console.error("Gagal mengambil data tahun pelajaran:", err);
    }
  };

  const fetchAnalitika = async () => {
    try {
      const res = await fetch("/api/analitika");
      const data = await res.json();
      setAnalitika(data);
    } catch (err) {
      console.error("Gagal mengambil data analitika:", err);
    }
  };

  const fetchPerangkatDocs = async () => {
    try {
      const res = await fetch("/api/perangkat");
      const data = await res.json();
      setPerangkatDocs(data);
    } catch (err) {
      console.error("Gagal mengambil perangkat pembelajaran:", err);
    }
  };

  const fetchMateriList = async () => {
    try {
      const res = await fetch("/api/materi");
      const data = await res.json();
      setMateriList(data);
    } catch (err) {
      console.error("Gagal mengambil materi:", err);
    }
  };

  const fetchTugasList = async () => {
    try {
      const res = await fetch("/api/tugas");
      const data = await res.json();
      setTugasList(data);

      // Ambil submissions jika ada user login
      if (user) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error("Gagal mengambil data tugas:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const url = user?.role === "SISWA" 
        ? `/api/tugas/kumpul?siswaId=${user.id}`
        : `/api/tugas/kumpul`;
      const res = await fetch(url);
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error("Gagal mengambil pengumpulan tugas:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setAllUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
    }
  };

  const loadAttendanceData = async () => {
    try {
      // 1. Ambil daftar siswa di kelas tersebut
      const sRes = await fetch(`/api/users?role=SISWA&kelas=${attendanceClass}`);
      const students = await sRes.json();
      setStudentList(students);

      // 2. Ambil absensi hari ini kelas hari ini
      const aRes = await fetch(`/api/absensi?tanggal=${attendanceDate}&kelas=${attendanceClass}`);
      const attendances = await aRes.json();

      // Bangun kisi status absensi siswa
      const grid: Record<string, { status: string; catatan: string }> = {};
      students.forEach((s: any) => {
        const found = attendances.find((a: any) => a.siswaId === s.id);
        grid[s.id] = {
          status: found ? found.status : "HADIR",
          catatan: found ? found.catatan || "" : "",
        };
      });
      setAttendanceGrid(grid);
    } catch (err) {
      console.error("Gagal memuat absensi kelas:", err);
    }
  };

  // Auth Functions
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoadingAuth(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("lmtms_user", JSON.stringify(data.user));
        // Reset inputs
        setUsernameInput("");
        setPasswordInput("");
      } else {
        setLoginError(data.message || "Nama pengguna atau kata sandi salah.");
      }
    } catch (err) {
      setLoginError("Koneksi gagal. Pastikan server aktif.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("lmtms_user");
    setCurrentTab("dashboard");
    setSelectedDoc(null);
    setSelectedMateri(null);
    setSelectedTugas(null);
    setQuizScoreResult(null);
    setQuizAnswers({});
  };

  // Shortcut login cepat untuk mempermudah evaluasi
  const quickLogin = async (role: "GURU" | "SISWA" | "ADMIN") => {
    let u = "admin";
    let p = "admin123";
    if (role === "GURU") { u = "yogi"; p = "yogi123"; }
    else if (role === "SISWA") { u = "ahmad"; p = "ahmad123"; }

    setUsernameInput(u);
    setPasswordInput(p);
    // Jalankan login langsung setelah input diset
    setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: u, password: p }),
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem("lmtms_user", JSON.stringify(data.user));
          setUsernameInput("");
          setPasswordInput("");
        }
      } catch (err) {
        console.error(err);
      }
    }, 100);
  };

  // Perangkat Pembelajaran CRUD
  const handleCreatePerangkat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/perangkat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...docForm,
          tahunPelajaranId: activeYear?.id || "tp-2",
          pembuatId: user?.id || "usr-yogi",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPerangkatDocs([data.data, ...perangkatDocs]);
        setIsCreatingDoc(false);
        setSelectedDoc(data.data);
        // Reset form
        setDocForm({ judul: "", jenis: "MODUL_AJAR", elemen: "BK", kelas: "X", konten: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDocEdit = async () => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`/api/perangkat/${selectedDoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: selectedDoc.judul,
          konten: selectedDoc.konten,
          elemen: selectedDoc.elemen,
          kelas: selectedDoc.kelas,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPerangkatDocs(perangkatDocs.map(p => p.id === selectedDoc.id ? data.data : p));
        alert("Dokumen berhasil disimpan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePerangkat = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus perangkat pembelajaran ini?")) return;
    try {
      const res = await fetch(`/api/perangkat/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPerangkatDocs(perangkatDocs.filter(p => p.id !== id));
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Document Generator (Gemini Integration)
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiNotification("Sedang memproses instruksi menggunakan Gemini AI...");
    try {
      const friendlyTypes: Record<string, string> = {
        MODUL_AJAR: "Modul Ajar / RPP",
        RPP_LENGKAP: "RPP Lengkap",
        ATP: "Alur Tujuan Pembelajaran (ATP)",
        SILABUS: "Silabus Pembelajaran",
        PROTA: "Program Tahunan (Prota)",
        PROMES: "Program Semester (Promes)",
      };
      const displayType = friendlyTypes[docForm.jenis] || docForm.jenis;

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          jenisDokumen: docForm.jenis,
          elemen: docForm.elemen,
          kelas: docForm.kelas,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocForm({
          ...docForm,
          judul: `${displayType} ${ELEMEN_INFORMATIKA.find(e => e.kode === docForm.elemen)?.nama || ""} Kelas ${docForm.kelas}`,
          konten: data.content,
        });
        if (data.note) {
          alert(data.note);
        }
        setAiNotification("Draf berhasil dibuat! Silakan tinjau dan sesuaikan konten.");
      } else {
        setAiNotification("Gagal memanggil asisten AI. Silakan coba kembali.");
      }
    } catch (err) {
      setAiNotification("Terjadi kesalahan jaringan.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Materi CRUD
  const handleCreateMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materiForm),
      });
      const data = await res.json();
      if (data.success) {
        setMateriList([data.data, ...materiList]);
        setIsCreatingMateri(false);
        setSelectedMateri(data.data);
        setMateriForm({ judul: "", deskripsi: "", elemen: "BK", kelas: "X", konten: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMateri = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
    try {
      const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMateriList(materiList.filter(m => m.id !== id));
        if (selectedMateri?.id === id) setSelectedMateri(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Tugas & Kuis CRUD
  const handleAddQuestionToForm = () => {
    if (!newQuestion.pertanyaan) return;
    const currentQuestions = tugasForm.soalKuis || [];
    setTugasForm({
      ...tugasForm,
      soalKuis: [...currentQuestions, { ...newQuestion, id: `q-${Date.now()}` }]
    });
    // Reset question builder
    setNewQuestion({ pertanyaan: "", pilihan: ["", "", "", ""], jawabanBenar: 0 });
  };

  const handleCreateTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tugasForm),
      });
      const data = await res.json();
      if (data.success) {
        setTugasList([data.data, ...tugasList]);
        setIsCreatingTugas(false);
        setSelectedTugas(data.data);
        setTugasForm({
          judul: "",
          instruksi: "",
          elemen: "BK",
          kelas: "X",
          deadline: "",
          totalPoin: 100,
          tipe: "TUGAS_TERULIS",
          soalKuis: [],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Siswa Mengumpulkan Tugas / Kuis
  const handleSubmissionSubmit = async () => {
    if (!selectedTugas || !user) return;

    let jawabanPayload = "";
    if (selectedTugas.tipe === "KUIS") {
      jawabanPayload = JSON.stringify(quizAnswers);
    } else {
      if (!submissionJawabanText.trim()) {
        alert("Silakan tulis jawaban Anda sebelum mengirim!");
        return;
      }
      jawabanPayload = submissionJawabanText;
    }

    try {
      const res = await fetch("/api/tugas/kumpul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tugasId: selectedTugas.id,
          siswaId: user.id,
          siswaNama: user.nama,
          jawabanSiswa: jawabanPayload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions([...submissions.filter(s => s.tugasId !== selectedTugas.id), data.data]);
        if (selectedTugas.tipe === "KUIS") {
          setQuizScoreResult(data.data.nilai);
        } else {
          alert("Tugas berhasil dikirim!");
          setSubmissionJawabanText("");
        }
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmissionForGrading) return;
    
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

      // Local state update to feel instantaneous
      const updatedSubmission = {
        ...selectedSubmissionForGrading,
        nilai: gradingScore,
        catatanGuru: gradingComment,
        status: "SELESAI"
      };
      setSubmissions(submissions.map(s => s.id === selectedSubmissionForGrading.id ? updatedSubmission : s));
      setSelectedSubmissionForGrading(null);
      
      showToast("Offline Mode: Penilaian disimpan dalam antrean lokal!", "success");
      handleAddNotification(
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
        setSubmissions(submissions.map(s => s.id === selectedSubmissionForGrading.id ? data.data : s));
        setSelectedSubmissionForGrading(null);
        showToast("Penilaian berhasil disimpan ke server!", "success");
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
      showToast("Koneksi gagal. Gagal menyimpan penilaian.", "error");
    }
  };

  // Absensi Simpan
  const handleSaveAttendance = async () => {
    if (!isOnline) {
      const queueItem = {
        id: Math.random().toString(36).substr(2, 9),
        action: "save_attendance",
        payload: { date: attendanceDate, class: attendanceClass, grid: attendanceGrid },
        title: `Presensi Kelas ${attendanceClass}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
      
      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("lmtms_offline_queue", JSON.stringify(updatedQueue));
      
      showToast("Offline Mode: Presensi disimpan dalam antrean lokal!", "success");
      setAbsensiNotification("Presensi hari ini berhasil direkam secara lokal (Offline Mode)!");
      setTimeout(() => setAbsensiNotification(""), 4000);
      
      handleAddNotification(
        "📝 Presensi Disimpan Offline",
        `Daftar kehadiran kelas ${attendanceClass} tanggal ${attendanceDate} dicatat secara lokal.`,
        "info"
      );
      return;
    }

    const dataAbsensi = Object.entries(attendanceGrid).map(([siswaId, info]: [string, any]) => {
      const student = studentList.find(s => s.id === siswaId);
      return {
        siswaId,
        siswaNama: student ? student.nama : "Siswa",
        status: info.status,
        catatan: info.catatan,
      };
    });

    try {
      const res = await fetch("/api/absensi/simpan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal: attendanceDate,
          kelas: attendanceClass,
          dataAbsensi,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Presensi hari ini berhasil disinkronkan ke server!", "success");
        setAbsensiNotification("Presensi hari ini berhasil disimpan ke pangkalan data!");
        setTimeout(() => setAbsensiNotification(""), 4000);
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
      showToast("Koneksi gagal. Gagal menyimpan presensi.", "error");
    }
  };

  // Ekspor Rekapitulasi Presensi Kehadiran Siswa per Bulan ke Excel
  const handleExportExcelAbsensi = async () => {
    try {
      const [yearStr, monthStr] = (exportMonth || "2026-07").split("-");
      const year = parseInt(yearStr, 10) || 2026;
      const month = parseInt(monthStr, 10) || 7;

      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const monthName = monthNames[month - 1] || "Juli";

      // Hitung jumlah hari pada bulan tersebut
      const daysInMonth = new Date(year, month, 0).getDate();

      // Ambil seluruh data absensi dari server untuk kelas terkait
      const resAbs = await fetch(`/api/absensi?kelas=${attendanceClass}`);
      const absensiData = await resAbs.json();

      // Filter absensi untuk bulan yang dipilih
      const targetMonthPrefix = `${yearStr}-${monthStr.padStart(2, "0")}`;
      const filteredAbsensi = Array.isArray(absensiData)
        ? absensiData.filter((a: any) => a.tanggal && a.tanggal.startsWith(targetMonthPrefix))
        : [];

      // Pastikan data daftar siswa tersedia
      let listSiswa = studentList;
      if (!listSiswa || listSiswa.length === 0) {
        const resSiswa = await fetch(`/api/users?role=SISWA&kelas=${attendanceClass}`);
        listSiswa = await resSiswa.json();
      }

      // Susun baris header dan judul
      const rows: any[][] = [];
      rows.push(["REKAPITULASI PRESENSI KEHADIRAN SISWA BULANAN"]);
      rows.push([`Rombel / Kelas: ${attendanceClass}`, `Bulan: ${monthName} ${year}`, `Total Siswa: ${listSiswa.length}`]);
      rows.push([`Tahun Pelajaran: ${activeYear?.tahun || "2025/2026"}`, `Mata Pelajaran: Informatika`, `Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}`]);
      rows.push([]); // Baris kosong pemisah

      // Header Kolom Tabel Spreadsheet
      const headerRow: any[] = ["No", "NISN", "Nama Siswa", "Kelas"];
      for (let d = 1; d <= daysInMonth; d++) {
        headerRow.push(d.toString().padStart(2, "0"));
      }
      headerRow.push("Hadir (H)", "Izin (I)", "Sakit (S)", "Alpa (A)", "Persentase Kehadiran (%)");
      rows.push(headerRow);

      // Inisialisasi hitungan per tanggal untuk ringkasan bawah
      const dayTotals: Record<number, { H: number; I: number; S: number; A: number }> = {};
      for (let d = 1; d <= daysInMonth; d++) {
        dayTotals[d] = { H: 0, I: 0, S: 0, A: 0 };
      }

      let grandH = 0, grandI = 0, grandS = 0, grandA = 0;

      listSiswa.forEach((st: any, idx: number) => {
        let hCount = 0;
        let iCount = 0;
        let sCount = 0;
        let aCount = 0;

        const row: any[] = [idx + 1, st.nisn || "-", st.nama, st.kelas || attendanceClass];

        for (let d = 1; d <= daysInMonth; d++) {
          const dateFormatted = `${yearStr}-${monthStr.padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const rec = filteredAbsensi.find((a: any) => a.siswaId === st.id && a.tanggal === dateFormatted);

          if (rec) {
            const stUpper = (rec.status || "").toUpperCase();
            if (stUpper === "HADIR") {
              row.push("H");
              hCount++;
              dayTotals[d].H++;
            } else if (stUpper === "IZIN") {
              row.push("I");
              iCount++;
              dayTotals[d].I++;
            } else if (stUpper === "SAKIT") {
              row.push("S");
              sCount++;
              dayTotals[d].S++;
            } else if (stUpper === "ALPA") {
              row.push("A");
              aCount++;
              dayTotals[d].A++;
            } else {
              row.push("-");
            }
          } else {
            row.push("-");
          }
        }

        const totalRecorded = hCount + iCount + sCount + aCount;
        const pct = totalRecorded > 0 ? `${Math.round((hCount / totalRecorded) * 100)}%` : "100%";

        grandH += hCount;
        grandI += iCount;
        grandS += sCount;
        grandA += aCount;

        row.push(hCount, iCount, sCount, aCount, pct);
        rows.push(row);
      });

      // Baris Total / Ringkasan Bawah
      const totalRow: any[] = ["TOTAL HADIR KELAS", "", "", ""];
      for (let d = 1; d <= daysInMonth; d++) {
        totalRow.push(dayTotals[d].H > 0 ? dayTotals[d].H : "-");
      }
      const grandTotalSessions = grandH + grandI + grandS + grandA;
      const grandPct = grandTotalSessions > 0 ? `${Math.round((grandH / grandTotalSessions) * 100)}%` : "100%";
      totalRow.push(grandH, grandI, grandS, grandA, grandPct);
      rows.push(totalRow);

      // Buat lembar kerja Spreadsheet (Worksheet & Workbook)
      const ws = XLSX.utils.aoa_to_sheet(rows);

      // Konfigurasi Lebar Kolom
      const cols = [
        { wch: 5 },  // No
        { wch: 16 }, // NISN
        { wch: 28 }, // Nama Siswa
        { wch: 10 }, // Kelas
      ];
      for (let d = 1; d <= daysInMonth; d++) {
        cols.push({ wch: 4 });
      }
      cols.push({ wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 24 });
      ws["!cols"] = cols;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Absensi_${attendanceClass}`);

      const fileName = `Rekap_Absensi_Kelas_${attendanceClass}_${monthName}_${year}.xlsx`;
      XLSX.writeFile(wb, fileName);

      showToast(`Rekapitulasi presensi kelas ${attendanceClass} bulan ${monthName} ${year} berhasil diekspor ke Excel!`, "success");
    } catch (err) {
      console.error("Gagal mengekspor data absensi ke Excel:", err);
      showToast("Gagal merangkum data absensi. Silakan coba lagi.", "error");
    }
  };

  // Admin: Tahun Pelajaran Baru
  const handleCreateTp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tahun-pelajaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTpForm),
      });
      const data = await res.json();
      if (data.success) {
        setYears([...years, data.year]);
        alert("Tahun pelajaran baru ditambahkan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateTp = async (id: string) => {
    try {
      const res = await fetch("/api/tahun-pelajaran/aktifkan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setYears(data.years);
        const active = data.years.find((y: any) => y.aktif);
        setActiveYear(active || null);
        alert("Tahun pelajaran aktif diperbarui.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format Helper Markdown Sederhana
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      // H1
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-3xl font-display font-bold text-slate-800 border-b border-slate-200 pb-2 mt-6 mb-4">{line.replace("# ", "")}</h1>;
      }
      // H2
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-2xl font-display font-semibold text-slate-800 mt-5 mb-3">{line.replace("## ", "")}</h2>;
      }
      // H3
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-xl font-display font-medium text-slate-800 mt-4 mb-2">{line.replace("### ", "")}</h3>;
      }
      // Code Block
      if (line.startsWith("```")) {
        return null; // Skip wrapper line, just do raw formatting
      }
      // List
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={idx} className="ml-5 list-disc text-slate-600 my-1">{line.substring(2)}</li>;
      }
      // Number List
      if (/^\d+\.\s/.test(line)) {
        return <li key={idx} className="ml-5 list-decimal text-slate-600 my-1">{line.replace(/^\d+\.\s/, "")}</li>;
      }
      // Table rows (Simpel)
      if (line.startsWith("|")) {
        return (
          <div key={idx} className="grid grid-cols-4 gap-2 text-xs border-b border-slate-100 py-1 font-mono text-slate-700 bg-slate-50/50 px-2 rounded">
            {line.split("|").filter(x => x.trim() !== "").map((col, cIdx) => (
              <span key={cIdx}>{col.trim()}</span>
            ))}
          </div>
        );
      }
      // Plain line
      return line.trim() === "" ? <div key={idx} className="h-2"></div> : <p key={idx} className="text-slate-600 leading-relaxed mb-2">{line}</p>;
    });
  };

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

  // Render Login Screen jika belum login
  if (!user) {
    return (
      <LoginView
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        loginError={loginError}
        isLoadingAuth={isLoadingAuth}
        handleLogin={handleLogin}
        quickLogin={quickLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* SIDEBAR NAVIGATION - NO-PRINT */}
      <Sidebar
        user={user}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        setSelectedDoc={setSelectedDoc}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        tugasList={tugasList}
        submissions={submissions}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER BAR - NO-PRINT */}
        <Header
          user={user}
          activeYear={activeYear}
          notifications={notifications}
          onClearNotification={handleClearNotification}
          onClearAllNotifications={handleClearAllNotifications}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          activeTheme={activeTheme}
          onChangeTheme={(theme) => setActiveTheme(theme)}
          isOnline={isOnline}
          onToggleOnlineSimulated={handleToggleOnlineSimulated}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* FLOATING TOAST STACK */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full no-print">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in transition-all ${
                toast.type === "success"
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : toast.type === "error"
                  ? "bg-rose-600 border-rose-500 text-white"
                  : "bg-slate-800 border-slate-700 text-white"
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => setToasts(toasts.filter((t) => t.id !== toast.id))}
                className="text-white/70 hover:text-white font-bold ml-2 font-mono text-[10px]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* COMPONENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full h-full"
            >
              {/* ======================================= */}
              {/* TAB 1: DASHBOARD ANALITIKA & RINGKASAN */}
              {/* ======================================= */}
          {currentTab === "dashboard" && (
            <AnalitikaView user={user} analitika={analitika} onRefresh={fetchAnalitika} />
          )}

          {/* ======================================= */}
          {/* TAB: LEARNING MANAGEMENT SYSTEM (LMS)   */}
          {/* ======================================= */}
          {currentTab === "lms" && (
            <LmsView user={user} />
          )}

          {/* ======================================= */}
          {/* TAB: TEACHING MANAGEMENT                */}
          {/* ======================================= */}
          {currentTab === "teaching" && (
            <TeachingManagementView user={user} />
          )}

          {/* ======================================= */}
          {/* TAB 2: PERANGKAT PEMBELAJARAN (AI DRAFT) */}
          {/* ======================================= */}
          {currentTab === "perangkat" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar Dokumen */}
              <div className={`lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[650px] no-print ${
                selectedDoc || isCreatingDoc ? "hidden lg:flex" : "flex"
              }`}>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base">Administrasi Guru</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Ketuk kartu untuk detail singkat</p>
                  </div>
                  <button
                    onClick={() => { setIsCreatingDoc(true); setSelectedDoc(null); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow active:scale-95 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Baru</span>
                  </button>
                </div>

                {/* Search & Filter Controls */}
                <div className="space-y-2 mb-3 bg-slate-50/70 border border-slate-200 rounded-xl p-2.5">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari judul / kata kunci..."
                      value={searchPerangkat}
                      onChange={(e) => setSearchPerangkat(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    />
                    {searchPerangkat && (
                      <button
                        type="button"
                        onClick={() => setSearchPerangkat("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold hover:bg-slate-300"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Dropdown Filters */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        value={filterJenis}
                        onChange={(e) => setFilterJenis(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">Semua Jenis</option>
                        <option value="MODUL_AJAR">Modul Ajar</option>
                        <option value="ATP">ATP</option>
                        <option value="PROTA">PROTA</option>
                        <option value="PROSEM">PROSEM</option>
                        <option value="RUBRIK_ASESMEN">Rubrik Asesmen</option>
                        <option value="LKPD">LKPD</option>
                        <option value="MODUL_PROJEK">Modul Projek</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={filterKelas}
                        onChange={(e) => setFilterKelas(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="ALL">Semua Kelas</option>
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary & Reset */}
                  {(filterJenis !== "ALL" || filterKelas !== "ALL" || searchPerangkat) && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                      <span className="text-slate-500 font-medium">
                        Hasil: <strong className="text-blue-600">{filteredPerangkatDocs.length}</strong> dari {perangkatDocs.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterJenis("ALL");
                          setFilterKelas("ALL");
                          setSearchPerangkat("");
                        }}
                        className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>

                {/* Multi-Select & ZIP Download Action Bar */}
                {filteredPerangkatDocs.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={
                            filteredPerangkatDocs.length > 0 &&
                            filteredPerangkatDocs.every((d) => selectedPerangkatIds.includes(d.id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const filteredIds = filteredPerangkatDocs.map((d) => d.id);
                              const newSelected = Array.from(new Set([...selectedPerangkatIds, ...filteredIds]));
                              setSelectedPerangkatIds(newSelected);
                            } else {
                              const filteredIds = filteredPerangkatDocs.map((d) => d.id);
                              setSelectedPerangkatIds(selectedPerangkatIds.filter((id) => !filteredIds.includes(id)));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Pilih Hasil Ini ({filteredPerangkatDocs.length})</span>
                      </label>
                      {selectedPerangkatIds.length > 0 && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                          {selectedPerangkatIds.length} Terpilih
                        </span>
                      )}
                    </div>

                    {selectedPerangkatIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDownloadSelectedZip}
                        disabled={isZippingPerangkat}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{isZippingPerangkat ? "Mengepak Arsip ZIP..." : `Unduh ${selectedPerangkatIds.length} Dokumen Terpilih (.ZIP)`}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* List Perangkat dengan Expandable Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                  {filteredPerangkatDocs.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500 font-medium">
                        {perangkatDocs.length === 0
                          ? "Belum ada dokumen perangkat pembelajaran."
                          : "Tidak ada dokumen yang sesuai dengan filter pencarian."}
                      </p>
                      {(filterJenis !== "ALL" || filterKelas !== "ALL" || searchPerangkat) && (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterJenis("ALL");
                            setFilterKelas("ALL");
                            setSearchPerangkat("");
                          }}
                          className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                        >
                          Reset semua filter
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredPerangkatDocs.map((doc) => {
                      const isExpanded = expandedDocId === doc.id;
                      const isChecked = selectedPerangkatIds.includes(doc.id);
                      return (
                        <div
                          key={doc.id}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                            selectedDoc?.id === doc.id
                              ? "bg-blue-50/80 border-blue-300 shadow-sm"
                              : isChecked
                              ? "bg-indigo-50/40 border-indigo-200"
                              : "bg-white border-slate-150 hover:bg-slate-50/70"
                          }`}
                        >
                          {/* Upper row: Badges, Checkbox, and Expand toggle */}
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (isChecked) {
                                    setSelectedPerangkatIds(selectedPerangkatIds.filter((id) => id !== doc.id));
                                  } else {
                                    setSelectedPerangkatIds([...selectedPerangkatIds, doc.id]);
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                                aria-label={`Pilih ${doc.judul}`}
                              />
                              <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg uppercase font-bold tracking-wider">
                                {doc.jenis.replace("_", " ")}
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-bold font-mono">
                                Kelas {doc.kelas}
                              </span>
                            </div>
                            
                            {/* Thumb-friendly Inline Expand Toggle Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedDocId(isExpanded ? null : doc.id);
                              }}
                              className="p-2 -mr-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-90"
                              aria-label={isExpanded ? "Sembunyikan detail" : "Tampilkan detail"}
                            >
                              <ChevronDown className={`h-4.5 w-4.5 text-slate-500 transition-transform duration-200 ${isExpanded ? "transform rotate-180 text-blue-600" : ""}`} />
                            </button>
                          </div>

                          {/* Card Content Tappable Header */}
                          <div
                            onClick={() => {
                              // On mobile, tap toggles expansion to view details without moving screen.
                              // On desktop, it selects the document to display on the side editor.
                              if (window.innerWidth < 1024) {
                                setExpandedDocId(isExpanded ? null : doc.id);
                              } else {
                                setSelectedDoc(doc);
                                setIsCreatingDoc(false);
                              }
                            }}
                            className="cursor-pointer mt-2 space-y-1.5"
                          >
                            <h4 className="font-display font-bold text-sm text-slate-800 leading-snug">
                              {doc.judul}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                              <span>Elemen: <span className="text-slate-600 font-semibold">{doc.elemen}</span></span>
                            </div>
                          </div>

                          {/* Expanded Content Area (Inline Preview & Quick Actions) */}
                          {isExpanded && (
                            <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3.5 animate-fade-in">
                              {/* Metadata & Stats Grid */}
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold font-mono bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                <div>
                                  <span className="text-slate-400 block uppercase tracking-wider text-[8px] mb-0.5">Jumlah Karakter</span>
                                  <span className="text-slate-700">{doc.konten ? doc.konten.length : 0} Karakter</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block uppercase tracking-wider text-[8px] mb-0.5">Saran Waktu Baca</span>
                                  <span className="text-slate-700">{Math.ceil((doc.konten ? doc.konten.length : 0) / 800)} Menit</span>
                                </div>
                              </div>

                              {/* Truncated scrollable Markdown Content Preview */}
                              <div className="bg-slate-50/30 border border-slate-100 p-3 rounded-xl max-h-[180px] overflow-y-auto text-xs text-slate-600 leading-relaxed font-sans scrollbar-thin relative">
                                <div className="prose prose-xs text-slate-600 max-w-none">
                                  {formatMarkdown(doc.konten || "*Tidak ada konten*")}
                                </div>
                              </div>

                              {/* Thumb-friendly Action Grid */}
                              <div className="grid grid-cols-3 gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDoc(doc);
                                    setIsCreatingDoc(false);
                                  }}
                                  className="flex items-center justify-center gap-1.5 py-2 px-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition shadow-xs active:scale-95"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  <span>Buka Detail</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    exportDocumentToPdf({
                                      judul: doc.judul,
                                      konten: doc.konten,
                                      jenis: doc.jenis,
                                      kelas: doc.kelas,
                                      elemen: doc.elemen,
                                      userEmail: user?.email || "yogisuprayogi02@guru.smk.belajar.id"
                                    });
                                  }}
                                  className="flex items-center justify-center gap-1.5 py-2 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-[11px] font-bold transition active:scale-95"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>PDF</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDoc(doc);
                                    setTimeout(() => window.print(), 150);
                                  }}
                                  className="flex items-center justify-center gap-1.5 py-2 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-bold transition active:scale-95"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  <span>Cetak</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeletePerangkat(doc.id);
                                  }}
                                  className="flex items-center justify-center gap-1.5 py-2 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-[11px] font-bold transition active:scale-95"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Collapse view footers when NOT expanded */}
                          {!isExpanded && (
                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                              <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-slate-400/80">
                                Ketuk untuk expand
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDoc(doc);
                                  setIsCreatingDoc(false);
                                }}
                                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 focus:outline-none"
                              >
                                <span>Buka</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Viewer & Editor */}
              <div className={`lg:col-span-8 flex flex-col h-[650px] ${
                selectedDoc || isCreatingDoc ? "flex" : "hidden lg:flex"
              }`}>
                {isCreatingDoc ? (
                  // Form pembuatan dokumen baru dengan bantuan AI
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full overflow-y-auto">
                    {/* Back button for mobile devices */}
                    <button
                      type="button"
                      onClick={() => { setIsCreatingDoc(false); setSelectedDoc(null); }}
                      className="lg:hidden self-start flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl mb-4 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Kembali ke Daftar</span>
                    </button>

                    <h3 className="font-display font-bold text-lg text-slate-800 mb-4">
                      Rancang Perangkat Pembelajaran Baru
                    </h3>
                    <form onSubmit={handleCreatePerangkat} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Jenis Dokumen</label>
                          <select
                            value={docForm.jenis}
                            onChange={(e) => setDocForm({ ...docForm, jenis: e.target.value })}
                            className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 font-semibold text-slate-800"
                          >
                            <option value="RPP_LENGKAP">✨ RPP Lengkap Berbasis AI</option>
                            <option value="MODUL_AJAR">Modul Ajar / RPP</option>
                            <option value="ATP">Alur Tujuan Pembelajaran (ATP)</option>
                            <option value="SILABUS">Silabus Pembelajaran</option>
                            <option value="PROTA">Program Tahunan (Prota)</option>
                            <option value="PROMES">Program Semester (Promes)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Elemen Kurikulum</label>
                          <select
                            value={docForm.elemen}
                            onChange={(e) => setDocForm({ ...docForm, elemen: e.target.value })}
                            className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500"
                          >
                            {ELEMEN_INFORMATIKA.map((el) => (
                              <option key={el.kode} value={el.kode}>{el.kode} - {el.nama}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Tingkat Kelas</label>
                          <select
                            value={docForm.kelas}
                            onChange={(e) => setDocForm({ ...docForm, kelas: e.target.value as any })}
                            className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500"
                          >
                            <option value="X">Kelas X (Fase E)</option>
                            <option value="XI">Kelas XI (Fase F)</option>
                            <option value="XII">Kelas XII (Fase F)</option>
                          </select>
                        </div>
                      </div>

                      {/* Gemini AI Drafter Section */}
                      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-blue-800 font-display font-semibold text-sm">
                          <Sparkles className="h-4.5 w-4.5 text-blue-500" />
                          <span>Asisten AI Penyusun Administrasi Guru (Gemini Engine)</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {docForm.jenis === "RPP_LENGKAP" ? (
                            <span>
                              🚀 <strong>Fitur Baru: RPP Lengkap AI.</strong> Tulis topik pembelajaran RPP yang diinginkan (misal: <em>"Pemrograman Percabangan Python"</em> atau <em>"Konsep Berpikir Komputasional"</em>). AI akan menyusun dokumen RPP terstruktur lengkap meliputi: <strong>Tujuan Pembelajaran (TP)</strong>, <strong>Langkah Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)</strong>, dan <strong>Asesmen Formatif Lengkap (Lembar Sikap & Rubrik Kinerja)</strong>.
                            </span>
                          ) : (
                            "Tulis deskripsi topik atau topik spesifik yang ingin Anda rancang (misal: \"materi sorting bubble sort kelas X dengan un-plugged dan un-guided exploration\"). AI akan mengonstruksikan dokumen Kurikulum Merdeka secara otomatis."
                          )}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Tulis topik atau instruksi modul di sini..."
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-blue-500"
                          />
                          <button
                            type="button"
                            onClick={generateWithAI}
                            disabled={isGeneratingAi}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 shrink-0 transition"
                          >
                            {isGeneratingAi ? "Memproses..." : "Draf dengan AI"}
                          </button>
                        </div>
                        {aiNotification && (
                          <div className="text-xs font-medium text-blue-700 bg-white/50 border border-blue-100 p-2 rounded-lg flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 animate-spin text-blue-500" />
                            <span>{aiNotification}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Judul Dokumen</label>
                        <input
                          type="text"
                          required
                          value={docForm.judul}
                          onChange={(e) => setDocForm({ ...docForm, judul: e.target.value })}
                          placeholder="Masukkan Judul Perangkat Pembelajaran"
                          className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-blue-500"
                        />
                      </div>

                      <div className="flex-1 min-h-[220px] flex flex-col text-left">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Isi Dokumen (Editor WYSIWYG / Markdown)</label>
                        <WysiwygEditor
                          id="doc-content-textarea-create"
                          value={docForm.konten}
                          onChange={(val) => setDocForm({ ...docForm, konten: val })}
                          placeholder="Tulis isi draf secara detail atau gunakan generator AI di atas..."
                          heightClass="min-h-[240px]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCreatingDoc(false)}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                        >
                          Simpan Dokumen
                        </button>
                      </div>
                    </form>
                  </div>
                ) : selectedDoc ? (
                  // Viewer & Editor Perangkat Terpilih
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden print-card">
                    {/* Header Doc Viewer */}
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between no-print gap-2">
                      <div className="flex items-center gap-2">
                        {/* Mobile back button */}
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(null)}
                          className="lg:hidden p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition"
                          title="Kembali ke Daftar"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                          {selectedDoc.jenis.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">Kelas {selectedDoc.kelas}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportDocumentToPdf({
                            judul: selectedDoc.judul,
                            konten: selectedDoc.konten,
                            jenis: selectedDoc.jenis,
                            kelas: selectedDoc.kelas,
                            elemen: selectedDoc.elemen,
                            userEmail: user?.email || "yogisuprayogi02@guru.smk.belajar.id"
                          })}
                          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Ekspor PDF</span>
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Cetak Dokumen</span>
                        </button>
                        <button
                          onClick={handleSaveDocEdit}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Simpan Perubahan</span>
                        </button>
                      </div>
                    </div>

                    {/* Editor / Live Viewer Split */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                      {/* Left: Raw Editor */}
                      <div className="border-r border-slate-100 flex flex-col h-full no-print">
                        <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Editor Markdown
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <input
                            type="text"
                            value={selectedDoc.judul}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, judul: e.target.value })}
                            className="font-bold text-base text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 focus:outline-none focus:border-blue-500 mb-4 bg-transparent"
                          />
                          
                          <WysiwygEditor
                            id="doc-content-textarea-edit"
                            value={selectedDoc.konten}
                            onChange={(val) => setSelectedDoc({ ...selectedDoc, konten: val })}
                            placeholder="Mulai menulis konten dokumen..."
                            heightClass="min-h-[300px]"
                          />
                        </div>
                      </div>

                      {/* Right: Rich Preview */}
                      <div className="flex flex-col h-full overflow-y-auto print-card">
                        <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider no-print">
                          Tinjauan Cetak (Auto-Generated Format)
                        </div>
                        <div className="p-6 bg-white prose max-w-none flex-1">
                          <h2 className="text-xl font-display font-bold text-slate-900 border-b pb-2 mb-4">
                            {selectedDoc.judul}
                          </h2>
                          <div className="space-y-4">
                            {formatMarkdown(selectedDoc.konten)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Tampilan Awal Kosong
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center justify-center h-full">
                    <FileText className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="font-display font-bold text-lg text-slate-800">Dokumen Administrasi Guru</h3>
                    <p className="text-slate-500 text-sm max-w-md mt-2">
                      Pilih dokumen di panel samping untuk melihat dan mengedit, atau buat dokumen ATP & Modul Ajar baru dengan bantuan asisten cerdas Gemini AI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ======================================= */}
          {/* TAB 3: MATERI PEMBELAJARAN INFORMATIKA   */}
          {/* ======================================= */}
          {currentTab === "materi" && (
            <MateriView
              user={user}
              materiList={materiList}
              onAddMateri={(newM) => setMateriList([newM, ...materiList])}
              onDeleteMateri={(id) => setMateriList(materiList.filter((m) => m.id !== id))}
            />
          )}

          {/* ======================================= */}
          {/* TAB 4: TUGAS & KUIS WORKSPACE            */}
          {/* ======================================= */}
          {currentTab === "tugas" && (
            <TugasView
              user={user}
              tugasList={tugasList}
              submissions={submissions}
              isOnline={isOnline}
              offlineQueue={offlineQueue}
              setOfflineQueue={setOfflineQueue}
              onAddTugas={(newT) => setTugasList([newT, ...tugasList])}
              onAddSubmission={(newSub) => setSubmissions([...submissions.filter(s => s.tugasId !== newSub.tugasId), newSub])}
              onUpdateSubmission={(updatedSub) => setSubmissions(submissions.map(s => s.id === updatedSub.id ? updatedSub : s))}
              showToast={showToast}
              onAddNotification={handleAddNotification}
              fetchAnalitika={fetchAnalitika}
            />
          )}

          {/* ======================================= */}
          {/* TAB 5: ABSENSI KELAS                     */}
          {/* ======================================= */}
          {currentTab === "absensi" && user.role === "GURU" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-800">Presensi Kelas Harian</h2>
                  <p className="text-slate-500 text-xs mt-1">Kelola pencatatan kehadiran harian siswa secara real-time.</p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Input</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rombel / Kelas</label>
                    <select
                      value={attendanceClass}
                      onChange={(e) => setAttendanceClass(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 font-bold"
                    >
                      <option value="X-1">X-1 (Fase E)</option>
                      <option value="XI-1">XI-1 (Fase F)</option>
                      <option value="XII-1">XII-1 (Fase F)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bulan Rekap</label>
                    <input
                      type="month"
                      value={exportMonth}
                      onChange={(e) => setExportMonth(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 font-mono font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleExportExcelAbsensi}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition shadow-xs cursor-pointer active:scale-95"
                    title="Unduh Rekapitulasi Presensi Siswa Bulanan dalam Format Spreadsheet (.xlsx)"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Ekspor ke Excel</span>
                  </button>
                </div>
              </div>

              {absensiNotification && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium text-xs rounded-xl flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{absensiNotification}</span>
                </div>
              )}

              {/* Grid Absensi */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-150 grid grid-cols-12 gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <span className="col-span-1">No</span>
                  <span className="col-span-4">Nama Siswa</span>
                  <span className="col-span-4 text-center">Status Kehadiran</span>
                  <span className="col-span-3">Catatan / Keterangan</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {studentList.length === 0 ? (
                    <p className="p-8 text-center text-xs text-slate-400">Belum ada siswa yang terdaftar di kelas {attendanceClass}.</p>
                  ) : (
                    studentList.map((st, sIdx) => {
                      const gridInfo = attendanceGrid[st.id] || { status: "HADIR", catatan: "" };
                      return (
                        <div key={st.id} className="p-4 grid grid-cols-12 gap-2 text-xs items-center hover:bg-slate-50/50">
                          <span className="col-span-1 font-mono font-medium text-slate-400">{sIdx + 1}</span>
                          <div className="col-span-4">
                            <span className="font-semibold text-slate-800 block">{st.nama}</span>
                            <span className="text-[10px] text-slate-400 font-mono">NISN: {st.nisn}</span>
                          </div>
                          <div className="col-span-4 flex items-center justify-center gap-1 bg-slate-50 p-1.5 rounded-lg">
                            {["HADIR", "IZIN", "SAKIT", "ALPA"].map((stType) => (
                              <button
                                key={stType}
                                type="button"
                                onClick={() => setAttendanceGrid({
                                  ...attendanceGrid,
                                  [st.id]: { ...gridInfo, status: stType }
                                })}
                                className={`px-2 py-1.5 rounded text-[10px] font-bold transition flex-1 text-center ${
                                  gridInfo.status === stType
                                    ? stType === "HADIR" ? "bg-emerald-600 text-white shadow-sm"
                                      : stType === "IZIN" ? "bg-blue-600 text-white shadow-sm"
                                      : stType === "SAKIT" ? "bg-amber-500 text-white shadow-sm"
                                      : "bg-rose-600 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-200/50"
                                }`}
                              >
                                {stType}
                              </button>
                            ))}
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={gridInfo.catatan}
                              onChange={(e) => setAttendanceGrid({
                                ...attendanceGrid,
                                [st.id]: { ...gridInfo, catatan: e.target.value }
                              })}
                              placeholder="Keterangan..."
                              className="border border-slate-200 rounded px-2 py-1 w-full text-xs focus:outline-blue-500 bg-white"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={studentList.length === 0}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan & Sinkronkan Presensi</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 6: ADMINISTRASI AKADEMIK & TAHUN    */}
          {/* ======================================= */}
          {currentTab === "administrasi" && (user.role === "ADMIN" || user.role === "GURU") && (
            <AcademicManagementView user={user} />
          )}

          {/* ======================================= */}
          {/* TAB 7: LOG AKTIVITAS (AUDIT TRAIL)      */}
          {/* ======================================= */}
          {currentTab === "logs" && (user.role === "ADMIN" || user.role === "GURU") && (
            <LogsView user={user} />
          )}

          {/* ======================================= */}
          {/* TAB: AI TEACHING ASSISTANT              */}
          {/* ======================================= */}
          {currentTab === "ai_assistant" && (user.role === "GURU" || user.role === "ADMIN") && (
            <AiTeachingAssistantView user={user} />
          )}

          {/* ======================================= */}
          {/* TAB 8: PROFIL & KEAMANAN                */}
          {/* ======================================= */}
          {currentTab === "settings" && (
            <SettingsView
              user={user}
              onUpdateUser={(updatedUser) => {
                setUser(updatedUser);
                localStorage.setItem("lmtms_user", JSON.stringify(updatedUser));
              }}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              activeTheme={activeTheme}
              onChangeTheme={(theme) => setActiveTheme(theme)}
              isOnline={isOnline}
              onToggleOnlineSimulated={handleToggleOnlineSimulated}
              offlineQueueLength={offlineQueue.length}
              onTriggerSync={processOfflineQueue}
              onAddNotification={handleAddNotification}
            />
          )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MODAL POPUP: NOTIFIKASI TENGGAT WAKTU TUGAS (DEADLINE ALERT) */}
      {showDeadlinePopup && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowDeadlinePopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold transition font-mono text-sm"
              id="close-deadline-popup-x"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/40">
                <Clock className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-black text-slate-900 dark:text-white text-sm tracking-wide uppercase">
                  {user.role === "SISWA" ? "Pengingat Batas Waktu Tugas" : "Pemberitahuan Antrean Nilai"}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono italic">
                  Sistem Pemantauan Capaian Akademik LMTMS
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
              {user.role === "SISWA" ? (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hai <strong className="text-indigo-600 dark:text-indigo-400">{user.nama}</strong>, Anda memiliki beberapa penugasan aktif yang belum dikerjakan. Segera selesaikan sebelum tenggat waktu berakhir:
                  </p>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {tugasList
                      .filter((t) => {
                        const hasSubmitted = submissions.some(
                          (s) => s.tugasId === t.id && s.siswaId === user.id
                        );
                        return !hasSubmitted;
                      })
                      .map((t) => {
                        const remaining = (() => {
                          if (!t.deadline) return { text: "Tanpa batas", style: "bg-slate-100 text-slate-600" };
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          const deadline = new Date(t.deadline);
                          deadline.setHours(0,0,0,0);
                          const diffTime = deadline.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays < 0) {
                            return { text: `Terlewat ${Math.abs(diffDays)} hari`, style: "bg-rose-50 text-rose-700 border border-rose-100 font-bold dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40" };
                          } else if (diffDays === 0) {
                            return { text: "Hari Ini!", style: "bg-rose-600 text-white font-bold animate-pulse" };
                          } else if (diffDays === 1) {
                            return { text: "Besok!", style: "bg-amber-100 text-amber-800 border border-amber-200 font-bold dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40" };
                          } else if (diffDays <= 3) {
                            return { text: `${diffDays} hari lagi`, style: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-350 dark:border-amber-900/30" };
                          } else {
                            return { text: `${diffDays} hari`, style: "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" };
                          }
                        })();

                        return (
                          <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1.5 flex flex-col justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 transition">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-900/40 uppercase">
                                  {t.tipe.replace("_", " ")}
                                </span>
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-1">
                                  {t.judul}
                                </h5>
                              </div>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full leading-none shrink-0 ${remaining.style}`}>
                                {remaining.text}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400">
                              <span>Elemen: {t.elemen}</span>
                              <span>Batas: {t.deadline}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Hai Guru <strong className="text-indigo-600 dark:text-indigo-400">{user.nama}</strong>, terdapat pengumpulan tugas baru dari siswa yang belum Anda berikan nilai. Segera ulas dan berikan penilaian untuk pemutakhiran buku rapor hasil belajar:
                  </p>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {submissions
                      .filter((s) => s.status === "BELUM_DINILAI")
                      .map((s) => {
                        const targetTugas = tugasList.find((t) => t.id === s.tugasId);
                        return (
                          <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 flex flex-col justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex-shrink-0">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                  {s.siswaNama}
                                </h5>
                                <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">
                                  Tugas: {targetTugas?.judul || "Evaluasi"}
                                </p>
                              </div>
                              <span className="text-[8px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono shrink-0">
                                Belum Dinilai
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/50">
                              <span>Kelas: {targetTugas?.kelas || "X"}</span>
                              <span>Dikumpul: {new Date(s.tanggalDikumpul).toLocaleDateString("id-ID")}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeadlinePopup(false)}
                className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
                id="btn-close-deadline-popup"
              >
                Nanti Saja
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeadlinePopup(false);
                  setCurrentTab("tugas");
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-100 dark:shadow-none"
                id="btn-action-deadline-popup"
              >
                {user.role === "SISWA" ? "Kerjakan Sekarang" : "Buka Menu Nilai"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
