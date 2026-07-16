import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Users,
  Calendar,
  Sparkles,
  Printer,
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
  Smartphone
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
import { ELEMEN_INFORMATIKA, User, TahunPelajaran } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { AnalitikaView } from "./components/AnalitikaView";
import { LoginView } from "./components/LoginView";
import { LogsView } from "./components/LogsView";
import { SettingsView } from "./components/SettingsView";
import { AcademicManagementView } from "./components/AcademicManagementView";
import { LmsView } from "./components/LmsView";
import { TeachingManagementView } from "./components/TeachingManagementView";
import { AiTeachingAssistantView } from "./components/AiTeachingAssistantView";

export default function App() {
  // Auth states
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("lmtms_user");
    return saved ? JSON.parse(saved) : null;
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
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[650px] no-print">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-display font-bold text-slate-800">Administrasi Guru</h3>
                  <button
                    onClick={() => { setIsCreatingDoc(true); setSelectedDoc(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Buat Baru</span>
                  </button>
                </div>

                {/* List Perangkat */}
                <div className="flex-1 overflow-y-auto space-y-2">
                  {perangkatDocs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">Belum ada dokumen perangkat pembelajaran.</p>
                  ) : (
                    perangkatDocs.map((doc) => (
                      <div
                        key={doc.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => { setSelectedDoc(doc); setIsCreatingDoc(false); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedDoc(doc);
                            setIsCreatingDoc(false);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                          selectedDoc?.id === doc.id
                            ? "bg-blue-50/80 border-blue-200 shadow-sm"
                            : "bg-white border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">
                            {doc.jenis.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Kelas {doc.kelas}</span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-slate-800 mt-2 truncate">{doc.judul}</h4>
                        <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                          <span>Elemen: {doc.elemen}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeletePerangkat(doc.id); }}
                            className="text-slate-400 hover:text-red-500 transition focus:outline-none p-1 rounded-md"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Viewer & Editor */}
              <div className="lg:col-span-8 flex flex-col h-[650px]">
                {isCreatingDoc ? (
                  // Form pembuatan dokumen baru dengan bantuan AI
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full overflow-y-auto">
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

                      <div className="flex-1 min-h-[220px] flex flex-col">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Isi Dokumen (Format Markdown)</label>
                        <textarea
                          required
                          value={docForm.konten}
                          onChange={(e) => setDocForm({ ...docForm, konten: e.target.value })}
                          placeholder="Tulis isi draf secara detail atau gunakan generator AI di atas..."
                          className="flex-1 block w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-blue-500 font-mono resize-none h-[220px]"
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
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between no-print">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                          {selectedDoc.jenis.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-400">Kelas {selectedDoc.kelas}</span>
                      </div>
                      <div className="flex items-center gap-2">
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
                            className="font-bold text-base text-slate-800 border-b border-slate-200 pb-2 focus:outline-none focus:border-blue-500 mb-4"
                          />
                          <textarea
                            value={selectedDoc.konten}
                            onChange={(e) => setSelectedDoc({ ...selectedDoc, konten: e.target.value })}
                            className="flex-1 w-full p-2 text-xs font-mono focus:outline-none resize-none"
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
            <div className="space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-800">Modul Belajar Informatika SMA</h2>
                  <p className="text-slate-500 text-xs mt-1">Eksplorasi materi kurikulum merdeka berdasarkan elemen informatika.</p>
                </div>
                {user.role === "GURU" && (
                  <button
                    onClick={() => { setIsCreatingMateri(true); setSelectedMateri(null); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Unggah Materi Baru</span>
                  </button>
                )}
              </div>

              {isCreatingMateri ? (
                // Form input materi baru
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl">
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-4">Buat Modul Pembelajaran Baru</h3>
                  <form onSubmit={handleCreateMateri} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Elemen Informatika</label>
                        <select
                          value={materiForm.elemen}
                          onChange={(e) => setMateriForm({ ...materiForm, elemen: e.target.value })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
                        >
                          {ELEMEN_INFORMATIKA.map((el) => (
                            <option key={el.kode} value={el.kode}>{el.kode} - {el.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Tingkat Kelas</label>
                        <select
                          value={materiForm.kelas}
                          onChange={(e) => setMateriForm({ ...materiForm, kelas: e.target.value as any })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
                        >
                          <option value="X">Kelas X (Fase E)</option>
                          <option value="XI">Kelas XI (Fase F)</option>
                          <option value="XII">Kelas XII (Fase F)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Judul Materi</label>
                      <input
                        type="text"
                        required
                        value={materiForm.judul}
                        onChange={(e) => setMateriForm({ ...materiForm, judul: e.target.value })}
                        placeholder="Contoh: Algoritma Pencarian Binary Search"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Deskripsi Singkat</label>
                      <input
                        type="text"
                        required
                        value={materiForm.deskripsi}
                        onChange={(e) => setMateriForm({ ...materiForm, deskripsi: e.target.value })}
                        placeholder="Deskripsi singkat modul belajar untuk daftar siswa..."
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Isi Materi Pembelajaran (Format Markdown)</label>
                      <textarea
                        required
                        value={materiForm.konten}
                        onChange={(e) => setMateriForm({ ...materiForm, konten: e.target.value })}
                        placeholder="Tulis materi lengkap di sini..."
                        className="block w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-blue-500 font-mono h-[300px]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingMateri(false)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                      >
                        Terbitkan Materi
                      </button>
                    </div>
                  </form>
                </div>
              ) : selectedMateri ? (
                // Detail view Materi
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <button
                    onClick={() => setSelectedMateri(null)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Kembali ke Daftar Materi</span>
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {selectedMateri.elemen}
                    </span>
                    <span className="text-xs text-slate-400">Kelas {selectedMateri.kelas}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
                    {selectedMateri.judul}
                  </h2>
                  <div className="space-y-4">
                    {formatMarkdown(selectedMateri.konten)}
                  </div>
                </div>
              ) : (
                // Grid daftar materi
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {materiList.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                            {m.elemen}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Kelas {m.kelas}</span>
                        </div>
                        <h3 className="font-display font-bold text-slate-800 text-base mt-3 line-clamp-1">{m.judul}</h3>
                        <p className="text-slate-500 text-xs mt-1.5 line-clamp-3">{m.deskripsi}</p>
                      </div>

                      <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedMateri(m)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition"
                        >
                          <span>Baca Selengkapnya</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {user.role === "GURU" && (
                          <button
                            onClick={() => handleDeleteMateri(m.id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition"
                            title="Hapus Materi"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 4: TUGAS & KUIS WORKSPACE            */}
          {/* ======================================= */}
          {currentTab === "tugas" && (
            <div className="space-y-6">
              {/* Header Tab */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-800">Workspace Tugas & Kuis Informatika</h2>
                  <p className="text-slate-500 text-xs mt-1">Kegiatan belajar harian, pengumpulan tugas praktik, dan evaluasi berbasis kuis.</p>
                </div>
                {user.role === "GURU" && (
                  <button
                    onClick={() => { setIsCreatingTugas(true); setSelectedTugas(null); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Buat Evaluasi Baru</span>
                  </button>
                )}
              </div>

              {isCreatingTugas ? (
                // Form membuat tugas / kuis
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl">
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-4">Buat Lembar Evaluasi</h3>
                  <form onSubmit={handleCreateTugas} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Tipe Evaluasi</label>
                        <select
                          value={tugasForm.tipe}
                          onChange={(e) => setTugasForm({ ...tugasForm, tipe: e.target.value })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
                        >
                          <option value="TUGAS_TERULIS">Tugas Praktik / Tertulis</option>
                          <option value="KUIS">Kuis Pilihan Ganda (Otomatis Dinilai)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Elemen</label>
                        <select
                          value={tugasForm.elemen}
                          onChange={(e) => setTugasForm({ ...tugasForm, elemen: e.target.value })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
                        >
                          {ELEMEN_INFORMATIKA.map((el) => (
                            <option key={el.kode} value={el.kode}>{el.kode}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Kelas</label>
                        <select
                          value={tugasForm.kelas}
                          onChange={(e) => setTugasForm({ ...tugasForm, kelas: e.target.value as any })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500 bg-white"
                        >
                          <option value="X">Kelas X</option>
                          <option value="XI">Kelas XI</option>
                          <option value="XII">Kelas XII</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Batas Pengumpulan (Deadline)</label>
                        <input
                          type="date"
                          required
                          value={tugasForm.deadline}
                          onChange={(e) => setTugasForm({ ...tugasForm, deadline: e.target.value })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Total Poin Maksimal</label>
                        <input
                          type="number"
                          required
                          value={tugasForm.totalPoin}
                          onChange={(e) => setTugasForm({ ...tugasForm, totalPoin: Number(e.target.value) })}
                          className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Judul Evaluasi</label>
                      <input
                        type="text"
                        required
                        value={tugasForm.judul}
                        onChange={(e) => setTugasForm({ ...tugasForm, judul: e.target.value })}
                        placeholder="Contoh: Kuis 1 Dasar Struktur Data"
                        className="block w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Instruksi / Pertanyaan Esai</label>
                      <textarea
                        required
                        value={tugasForm.instruksi}
                        onChange={(e) => setTugasForm({ ...tugasForm, instruksi: e.target.value })}
                        placeholder="Instruksi pengerjaan detail untuk tugas atau kuis..."
                        className="block w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-blue-500 h-[100px]"
                      />
                    </div>

                    {/* Pembentuk Soal jika tipe KUIS */}
                    {tugasForm.tipe === "KUIS" && (
                      <div className="border border-blue-100 bg-blue-50/20 p-4 rounded-2xl space-y-3">
                        <h4 className="text-sm font-semibold text-blue-950 flex items-center gap-1.5">
                          <span>Pembuat Soal Pilihan Ganda</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-bold">
                            {(tugasForm.soalKuis || []).length} Soal Terbuat
                          </span>
                        </h4>

                        {/* List Soal yang sudah ditambahkan */}
                        <div className="space-y-2">
                          {(tugasForm.soalKuis || []).map((q: any, qIdx: number) => (
                            <div key={q.id} className="p-3 bg-white border border-slate-100 rounded-lg text-xs space-y-1">
                              <span className="font-bold text-slate-700">Soal {qIdx + 1}: {q.pertanyaan}</span>
                              <div className="grid grid-cols-2 gap-1 text-slate-500">
                                {q.pilihan.map((pil: string, pIdx: number) => (
                                  <span key={pIdx} className={q.jawabanBenar === pIdx ? "text-emerald-600 font-semibold" : ""}>
                                    {String.fromCharCode(65 + pIdx)}. {pil}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Form tambah soal baru */}
                        <div className="space-y-3 pt-3 border-t border-blue-100 bg-white p-3 rounded-lg">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500">Pertanyaan</label>
                            <input
                              type="text"
                              value={newQuestion.pertanyaan}
                              onChange={(e) => setNewQuestion({ ...newQuestion, pertanyaan: e.target.value })}
                              placeholder="Masukkan teks soal..."
                              className="block w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {newQuestion.pilihan.map((pil, idx) => (
                              <div key={idx}>
                                <label className="block text-[11px] font-semibold text-slate-500">Pilihan {String.fromCharCode(65 + idx)}</label>
                                <input
                                  type="text"
                                  value={pil}
                                  onChange={(e) => {
                                    const nextPil = [...newQuestion.pilihan];
                                    nextPil[idx] = e.target.value;
                                    setNewQuestion({ ...newQuestion, pilihan: nextPil });
                                  }}
                                  placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                                  className="block w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500">Jawaban Benar</label>
                            <select
                              value={newQuestion.jawabanBenar}
                              onChange={(e) => setNewQuestion({ ...newQuestion, jawabanBenar: Number(e.target.value) })}
                              className="block w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-blue-500 bg-white"
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
                            className="w-full py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                          >
                            + Tambahkan Soal ke Kuis
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingTugas(false)}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                      >
                        Terbitkan Evaluasi
                      </button>
                    </div>
                  </form>
                </div>
              ) : selectedTugas ? (
                // Workspace Aktif Tugas Terpilih
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <button
                    onClick={() => { setSelectedTugas(null); setQuizScoreResult(null); setQuizAnswers({}); }}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold mb-4 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Kembali ke Daftar Tugas</span>
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                      {selectedTugas.tipe.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-400">Elemen {selectedTugas.elemen}</span>
                    <span className="text-xs text-slate-400">• Deadline: {selectedTugas.deadline}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{selectedTugas.judul}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedTugas.instruksi}
                  </p>

                  {/* ALUR SISWA: MENGERJAKAN TUGAS / KUIS */}
                  {user.role === "SISWA" && (
                    <div className="border-t border-slate-100 pt-6">
                      {/* Check status submission siswa */}
                      {(() => {
                        const mySub = submissions.find(s => s.tugasId === selectedTugas.id && s.siswaId === user.id);
                        if (mySub) {
                          return (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                                <CheckCircle className="h-5 w-5" />
                                <span>Anda telah menyelesaikan evaluasi ini!</span>
                              </div>
                              <div className="text-xs text-slate-600 space-y-1">
                                <p><strong>Tanggal Dikumpul:</strong> {new Date(mySub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                                <p><strong>Nilai Diperoleh:</strong> {mySub.nilai !== undefined ? `${mySub.nilai} / ${selectedTugas.totalPoin}` : "Menunggu penilaian guru"}</p>
                                {mySub.catatanGuru && <p><strong>Catatan Guru:</strong> {mySub.catatanGuru}</p>}
                              </div>
                            </div>
                          );
                        }

                        // JIKA BELUM SUBMIT & TIPENYA KUIS
                        if (selectedTugas.tipe === "KUIS") {
                          if (quizScoreResult !== null) {
                            return (
                              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-2">
                                <Award className="h-10 w-10 text-emerald-600 mx-auto" />
                                <h4 className="font-display font-bold text-slate-800">Kuis Selesai!</h4>
                                <p className="text-sm text-slate-600">Skor Anda berhasil dihitung otomatis oleh sistem LMTMS:</p>
                                <span className="inline-block text-3xl font-display font-bold text-blue-700 bg-white border border-blue-100 px-6 py-2 rounded-xl">
                                  {quizScoreResult} / {selectedTugas.totalPoin}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-6">
                              <h4 className="font-display font-bold text-slate-800 border-b pb-2">Kerjakan Soal Kuis</h4>
                              {(selectedTugas.soalKuis || []).map((soal: any, idx: number) => (
                                <div key={soal.id} className="space-y-2 border-b border-slate-50 pb-4">
                                  <p className="text-sm font-semibold text-slate-800">
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
                                            ? "border-blue-600 bg-blue-50/50 font-semibold text-blue-800"
                                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                        }`}
                                      >
                                        <span>{String.fromCharCode(65 + pIdx)}. {pil}</span>
                                        {quizAnswers[soal.id] === pIdx && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleSubmissionSubmit}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition"
                              >
                                Kirim & Selesaikan Kuis
                              </button>
                            </div>
                          );
                        }

                        // JIKA BELUM SUBMIT & TIPENYA TUGAS TERULIS
                        return (
                          <div className="space-y-4">
                            <h4 className="font-display font-bold text-slate-800 border-b pb-2">Kirim Lembar Jawaban</h4>
                            <p className="text-xs text-slate-400">Tulis tanggapan atau letakkan tautan repositori/skrip kode pemrograman Anda di bawah ini:</p>
                            <textarea
                              required
                              value={submissionJawabanText}
                              onChange={(e) => setSubmissionJawabanText(e.target.value)}
                              placeholder="Ketik tanggapan atau lampirkan sintaks Python Anda di sini..."
                              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-blue-500 font-mono h-[180px]"
                            />
                            <button
                              onClick={handleSubmissionSubmit}
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition"
                            >
                              Kumpulkan Tugas Praktik
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ALUR GURU: GRADING / MENILAI TUGAS SISWA */}
                  {user.role === "GURU" && (
                    <div className="border-t border-slate-100 pt-6">
                      <h4 className="font-display font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span>Daftar Pengumpulan Siswa</span>
                      </h4>

                      {/* List submissions dari seluruh siswa */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {submissions.filter(s => s.tugasId === selectedTugas.id).length === 0 ? (
                          <p className="text-xs text-slate-400 py-4 col-span-2 text-center">Belum ada siswa yang mengumpulkan.</p>
                        ) : (
                          submissions
                            .filter(s => s.tugasId === selectedTugas.id)
                            .map((sub) => (
                              <div
                                key={sub.id}
                                className="p-4 border border-slate-200 bg-slate-50/20 hover:bg-slate-50 rounded-2xl space-y-2 relative transition"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-display font-bold text-slate-800 text-sm">{sub.siswaNama}</h5>
                                    <p className="text-[10px] text-slate-400">Dikumpul: {new Date(sub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                                  </div>
                                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                                    sub.status === "SELESAI" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                  }`}>
                                    {sub.status === "SELESAI" ? `NILAI: ${sub.nilai}` : "BELUM DINILAI"}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg max-h-36 overflow-y-auto">
                                  {selectedTugas.tipe === "KUIS" ? (
                                    <p className="font-mono text-[10px]">Jawaban Lembar Kuis: {sub.jawabanSiswa}</p>
                                  ) : (
                                    <pre className="font-mono whitespace-pre-wrap leading-tight text-[11px]">{sub.jawabanSiswa}</pre>
                                  )}
                                </div>

                                {sub.catatanGuru && (
                                  <p className="text-[10px] text-slate-400 bg-blue-50/30 p-1.5 rounded">
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
                                    className="flex items-center gap-1 border border-slate-200 hover:border-blue-200 px-3 py-1 bg-white rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 transition"
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
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                            <h4 className="font-display font-bold text-slate-800 text-base">
                              Penilaian & Koreksi Tugas
                            </h4>
                            <p className="text-xs text-slate-500">
                              Memberikan penilaian untuk siswa: <strong className="text-blue-600">{selectedSubmissionForGrading.siswaNama}</strong>
                            </p>

                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Perolehan Nilai (Maks {selectedTugas.totalPoin})</label>
                              <input
                                type="number"
                                required
                                min={0}
                                max={selectedTugas.totalPoin}
                                value={gradingScore}
                                onChange={(e) => setGradingScore(Number(e.target.value))}
                                className="block w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Umpan Balik & Catatan Guru</label>
                              <textarea
                                value={gradingComment}
                                onChange={(e) => setGradingComment(e.target.value)}
                                placeholder="Tulis masukan konstruktif untuk memotivasi siswa..."
                                className="block w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-blue-500 h-[80px]"
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedSubmissionForGrading(null)}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg text-xs transition"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={handleGradeSubmission}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition"
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
                  {tugasList.map((t) => {
                    const submissionsCount = submissions.filter(s => s.tugasId === t.id).length;
                    return (
                      <div
                        key={t.id}
                        className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
                              {t.tipe.replace("_", " ")}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Elemen {t.elemen}</span>
                          </div>
                          <h3 className="font-display font-bold text-slate-800 text-base mt-3 line-clamp-1">{t.judul}</h3>
                          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{t.instruksi}</p>

                          <div className="flex gap-4 mt-4 text-[11px] text-slate-400 font-medium font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-blue-500" />
                              <span>Batas: {t.deadline}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5 text-teal-500" />
                              <span>Poin: {t.totalPoin}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedTugas(t)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition"
                          >
                            <span>
                              {user.role === "SISWA" 
                                ? (submissions.find(s => s.tugasId === t.id && s.siswaId === user.id) ? "Tinjau Hasil" : "Mulai Kerjakan")
                                : "Kelola Evaluasi"
                              }
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </button>

                          {user.role === "GURU" && (
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                              {submissionsCount} Dikumpul
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal</label>
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
        </main>
      </div>
    </div>
  );
}
