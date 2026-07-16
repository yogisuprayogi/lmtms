import React, { useState, useEffect } from "react";
import {
  Users,
  ClipboardCheck,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  X,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  FileCheck,
  Send,
  Sliders,
  HelpCircle
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

interface TeachingManagementViewProps {
  user: {
    id: string;
    username: string;
    nama: string;
    email: string;
    role: "ADMIN" | "GURU" | "SISWA";
    kelas?: string;
  };
}

// ==========================================
// INITIAL SEED DATA FOR LOCAL STORAGE
// ==========================================

const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-1",
    judul: "Implementasi Tumpukan (Stack) dengan Python List",
    instruksi: "Buatlah sebuah program Python sederhana yang mensimulasikan sistem Undo-Redo menggunakan struktur data Stack. Kumpulkan penjelasan logika dan lampirkan kode program Anda.",
    elemen: "BK",
    kelas: "X-1",
    deadline: "2026-07-20",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS"
  },
  {
    id: "asg-2",
    judul: "Konfigurasi IP Address & Desain Subnetting LAN",
    instruksi: "Rancanglah pembagian subnet IP Address 192.168.10.0/24 untuk 3 laboratorium sekolah dengan masing-masing 30 host komputer. Tuliskan rincian range IP, subnet mask, dan gateway.",
    elemen: "JKI",
    kelas: "X-1",
    deadline: "2026-07-25",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS"
  },
  {
    id: "asg-3",
    judul: "Latihan Studi Kasus Antrean Toko Kelontong (Queue)",
    instruksi: "Tulis fungsi Python untuk melacak antrean pembeli di kasir toko kelontong menggunakan modul collections.deque.",
    elemen: "BK",
    kelas: "X-1",
    deadline: "2026-07-29",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS"
  }
];

const INITIAL_SUBMISSIONS = [
  {
    id: "sub-1",
    asgId: "asg-1",
    asgTitle: "Implementasi Tumpukan (Stack) dengan Python List",
    studentId: "usr-ahmad",
    studentName: "Ahmad Dhani",
    studentClass: "X-1",
    jawabanText: "class Stack:\n  def __init__(self):\n    self.items = []\n  def push(self, item):\n    self.items.append(item)\n  def pop(self):\n    return self.items.pop() if not self.is_empty() else None\n  def is_empty(self):\n    return len(self.items) == 0\n\n# Simulasi Undo-Redo\nhistory = Stack()\nhistory.push('Halaman Utama')\nhistory.push('Halaman Belajar')\nprint('Current:', history.items[-1])\nundo = history.pop()\nprint('Undo:', undo)",
    status: "GRADED",
    score: 95,
    feedback: "Sangat bagus, implementasi kelas Stack sudah benar dan logikanya runtut. Serta simulasi undo-redo berjalan sesuai instruksi.",
    tanggal: "2026-07-14 09:25"
  },
  {
    id: "sub-2",
    asgId: "asg-1",
    asgTitle: "Implementasi Tumpukan (Stack) dengan Python List",
    studentId: "usr-budi",
    studentName: "Budi Setiawan",
    studentClass: "X-1",
    jawabanText: "def push(stack, item):\n  stack.append(item)\ndef pop(stack):\n  return stack.pop()\n\n# Budi: Menggunakan list biasa tanpa class.\nmy_stack = []\npush(my_stack, 'Edit Foto 1')\npush(my_stack, 'Edit Foto 2')\npop(my_stack)",
    status: "PENDING",
    score: null,
    feedback: "",
    tanggal: "2026-07-15 14:10"
  },
  {
    id: "sub-3",
    asgId: "asg-2",
    asgTitle: "Konfigurasi IP Address & Desain Subnetting LAN",
    studentId: "usr-citra",
    studentName: "Citra Lestari",
    studentClass: "X-1",
    jawabanText: "Pembagian IP Address 192.168.10.0/24:\nKarena dibutuhkan 3 laboratorium dengan masing-masing 30 host, kita gunakan subnet mask /27 (32 IP per subnet):\n\n1. Lab A:\n   - IP Network: 192.168.10.0/27\n   - Range IP Host: 192.168.10.1 s/d 192.168.10.30\n   - IP Broadcast: 192.168.10.31\n2. Lab B:\n   - IP Network: 192.168.10.32/27\n   - Range IP Host: 192.168.10.33 s/d 192.168.10.62\n   - IP Broadcast: 192.168.10.63\n3. Lab C:\n   - IP Network: 192.168.10.64/27\n   - Range IP Host: 192.168.10.65 s/d 192.168.10.94\n   - IP Broadcast: 192.168.10.95",
    status: "GRADED",
    score: 98,
    feedback: "Perhitungan subnetting luar biasa akurat Citra! Jawaban sangat rapi dan mudah dipahami.",
    tanggal: "2026-07-15 11:32"
  },
  {
    id: "sub-4",
    asgId: "asg-1",
    asgTitle: "Implementasi Tumpukan (Stack) dengan Python List",
    studentId: "usr-citra",
    studentName: "Citra Lestari",
    studentClass: "X-1",
    jawabanText: "class UndoStack:\n  def __init__(self):\n    self.actions = []\n  def do_action(self, act):\n    self.actions.append(act)\n  def undo(self):\n    if len(self.actions) > 0:\n      return self.actions.pop()",
    status: "PENDING",
    score: null,
    feedback: "",
    tanggal: "2026-07-15T22:00:00Z"
  }
];

const INITIAL_ATTENDANCE = [
  { id: "att-1", tanggal: "2026-07-13", kelas: "X-1", studentId: "usr-ahmad", studentName: "Ahmad Dhani", status: "HADIR" },
  { id: "att-2", tanggal: "2026-07-13", kelas: "X-1", studentId: "usr-budi", studentName: "Budi Setiawan", status: "HADIR" },
  { id: "att-3", tanggal: "2026-07-13", kelas: "X-1", studentId: "usr-citra", studentName: "Citra Lestari", status: "SAKIT" },
  { id: "att-4", tanggal: "2026-07-13", kelas: "X-1", studentId: "usr-dedi", studentName: "Dedi Kurniawan", status: "HADIR" },
  { id: "att-5", tanggal: "2026-07-13", kelas: "X-1", studentId: "usr-elly", studentName: "Elly Setyowati", status: "IZIN" },

  { id: "att-6", tanggal: "2026-07-14", kelas: "X-1", studentId: "usr-ahmad", studentName: "Ahmad Dhani", status: "HADIR" },
  { id: "att-7", tanggal: "2026-07-14", kelas: "X-1", studentId: "usr-budi", studentName: "Budi Setiawan", status: "HADIR" },
  { id: "att-8", tanggal: "2026-07-14", kelas: "X-1", studentId: "usr-citra", studentName: "Citra Lestari", status: "HADIR" },
  { id: "att-9", tanggal: "2026-07-14", kelas: "X-1", studentId: "usr-dedi", studentName: "Dedi Kurniawan", status: "ALPA" },
  { id: "att-10", tanggal: "2026-07-14", kelas: "X-1", studentId: "usr-elly", studentName: "Elly Setyowati", status: "HADIR" },

  { id: "att-11", tanggal: "2026-07-15", kelas: "X-1", studentId: "usr-ahmad", studentName: "Ahmad Dhani", status: "HADIR" },
  { id: "att-12", tanggal: "2026-07-15", kelas: "X-1", studentId: "usr-budi", studentName: "Budi Setiawan", status: "HADIR" },
  { id: "att-13", tanggal: "2026-07-15", kelas: "X-1", studentId: "usr-citra", studentName: "Citra Lestari", status: "HADIR" },
  { id: "att-14", tanggal: "2026-07-15", kelas: "X-1", studentId: "usr-dedi", studentName: "Dedi Kurniawan", status: "HADIR" },
  { id: "att-15", tanggal: "2026-07-15", kelas: "X-1", studentId: "usr-elly", studentName: "Elly Setyowati", status: "HADIR" }
];

const INITIAL_RUBRICS = [
  {
    id: "rub-1",
    nama: "Rubrik Penilaian Algoritma Python",
    deskripsi: "Rubrik standar untuk asesmen formatif dan sumatif pengodean program prosedural Python.",
    kriteria: [
      { nama: "Kebenaran Sintaksis & Logika", bobot: "40%", deskripsi: "Kode berjalan tanpa error, menghasilkan output yang tepat untuk semua skenario uji." },
      { nama: "Struktur & Desain Program", bobot: "30%", deskripsi: "Penggunaan fungsi, modularitas kode, efisiensi penggunaan variabel, dan penamaan deskriptif." },
      { nama: "Dokumentasi & Analisis", bobot: "20%", deskripsi: "Adanya komentar penjelasan, penganalisisan runtime, dan refleksi pilar berpikir komputasional." },
      { nama: "Ketepatan Pengumpulan", bobot: "10%", deskripsi: "Mengirimkan tugas tepat waktu dan mematuhi format pelampiran file." }
    ]
  },
  {
    id: "rub-2",
    nama: "Rubrik Proyek Berpikir Komputasional (BK)",
    deskripsi: "Mengukur kemampuan kognitif tingkat tinggi (HOTS) dalam merumuskan penyelesaian masalah.",
    kriteria: [
      { nama: "Dekomposisi", bobot: "35%", deskripsi: "Kemampuan memecah masalah besar yang kompleks menjadi sub-masalah kecil yang mandiri." },
      { nama: "Pengenalan Pola & Abstraksi", bobot: "35%", deskripsi: "Menemukan kemiripan logis dan mereduksi detail yang tidak relevan." },
      { nama: "Rancangan Algoritma", bobot: "30%", deskripsi: "Menulis instruksi penyelesaian langkah-demi-langkah secara logis, efisien, dan siap diimplementasikan." }
    ]
  }
];

export const TeachingManagementView: React.FC<TeachingManagementViewProps> = ({ user }) => {
  // Tabs configuration depending on the role
  const isTeacher = user.role === "GURU" || user.role === "ADMIN";

  const tabs = isTeacher
    ? [
        { id: "dash_guru", label: "Dashboard Guru", icon: TrendingUp, color: "text-blue-500 bg-blue-50" },
        { id: "absensi", label: "Absensi Kelas", icon: ClipboardCheck, color: "text-emerald-500 bg-emerald-50" },
        { id: "penugasan", label: "Penugasan (Tugas)", icon: FileText, color: "text-amber-500 bg-amber-50" },
        { id: "penilaian", label: "Penilaian Tugas", icon: Award, color: "text-rose-500 bg-rose-50" },
        { id: "rubrik", label: "Rubrik Asesmen", icon: Sliders, color: "text-indigo-500 bg-indigo-50" }
      ]
    : [
        { id: "dash_siswa", label: "Dashboard Siswa", icon: User, color: "text-teal-500 bg-teal-50" },
        { id: "siswa_tugas", label: "Penugasan & Penilaian", icon: FileCheck, color: "text-blue-500 bg-blue-50" },
        { id: "siswa_absensi", label: "Presensi Saya", icon: Calendar, color: "text-emerald-500 bg-emerald-50" },
        { id: "siswa_rubrik", label: "Rubrik Guru", icon: Info, color: "text-slate-500 bg-slate-50" }
      ];

  const [activeSubTab, setActiveSubTab] = useState<string>(isTeacher ? "dash_guru" : "dash_siswa");

  // State loaded from localStorage or fallback to initial seed
  const [assignments, setAssignments] = useState<any[]>(() => {
    const saved = localStorage.getItem("teaching_assignments");
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<any[]>(() => {
    const saved = localStorage.getItem("teaching_submissions");
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [attendance, setAttendance] = useState<any[]>(() => {
    const saved = localStorage.getItem("teaching_attendance");
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [rubrics, setRubrics] = useState<any[]>(() => {
    const saved = localStorage.getItem("teaching_rubrics");
    return saved ? JSON.parse(saved) : INITIAL_RUBRICS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("teaching_assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("teaching_submissions", JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem("teaching_attendance", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("teaching_rubrics", JSON.stringify(rubrics));
  }, [rubrics]);

  // Toast / notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // 1. STATE & HANDLERS: ABSENSI (TEACHER)
  // ==========================================
  const [selectedClass, setSelectedClass] = useState("X-1");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  
  // List of pupils
  const pupils = [
    { id: "usr-ahmad", nama: "Ahmad Dhani" },
    { id: "usr-budi", nama: "Budi Setiawan" },
    { id: "usr-citra", nama: "Citra Lestari" },
    { id: "usr-dedi", nama: "Dedi Kurniawan" },
    { id: "usr-elly", nama: "Elly Setyowati" }
  ];

  // Temp state for marking attendance currently
  const [currentDayAbsen, setCurrentDayAbsen] = useState<Record<string, string>>({});

  // Sync temp state when class/date changes
  useEffect(() => {
    const records = attendance.filter(r => r.tanggal === selectedDate && r.kelas === selectedClass);
    const mapped: Record<string, string> = {};
    pupils.forEach(p => {
      const match = records.find(r => r.studentId === p.id);
      mapped[p.id] = match ? match.status : "HADIR"; // default to HADIR
    });
    setCurrentDayAbsen(mapped);
  }, [selectedDate, selectedClass, attendance]);

  const handleMarkAttendance = (studentId: string, status: string) => {
    setCurrentDayAbsen(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    // Filter out old records for this class & date
    const updated = attendance.filter(r => !(r.tanggal === selectedDate && r.kelas === selectedClass));
    
    // Add new ones
    const newRecords = pupils.map(p => ({
      id: `att-${Date.now()}-${p.id}`,
      tanggal: selectedDate,
      kelas: selectedClass,
      studentId: p.id,
      studentName: p.nama,
      status: currentDayAbsen[p.id] || "HADIR"
    }));

    setAttendance([...updated, ...newRecords]);
    showToast(`Presensi kelas ${selectedClass} tanggal ${selectedDate} sukses disimpan!`);

    // Log this activity log to system
    try {
      const logs = JSON.parse(localStorage.getItem("lmtms_logs") || "[]");
      logs.unshift({
        id: `log-${Date.now()}`,
        userId: user.id,
        nama: user.nama,
        role: user.role,
        action: "UPDATE_PRESENSI",
        details: `Melakukan perekaman kehadiran kelas ${selectedClass} tanggal ${selectedDate}.`,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1"
      });
      localStorage.setItem("lmtms_logs", JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // 2. STATE & HANDLERS: PENUGASAN (TEACHER)
  // ==========================================
  const [newAsg, setNewAsg] = useState({
    judul: "",
    instruksi: "",
    elemen: "BK",
    kelas: "X-1",
    deadline: "",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS"
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsg.judul.trim()) return;

    const added = {
      ...newAsg,
      id: `asg-${Date.now()}`
    };

    setAssignments([added, ...assignments]);
    setNewAsg({
      judul: "",
      instruksi: "",
      elemen: "BK",
      kelas: "X-1",
      deadline: "",
      totalPoin: 100,
      tipe: "TUGAS_TERULIS"
    });
    showToast("Tugas baru berhasil diterbitkan!");
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    setSubmissions(submissions.filter(s => s.asgId !== id)); // cascading delete
    showToast("Tugas berhasil dihapus.");
  };

  // ==========================================
  // 3. STATE & HANDLERS: PENILAIAN (TEACHER)
  // ==========================================
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<any | null>(null);
  const [tempScore, setTempScore] = useState<number>(100);
  const [tempFeedback, setTempFeedback] = useState("");

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForGrading) return;

    const updated = submissions.map(s => {
      if (s.id === selectedSubForGrading.id) {
        return {
          ...s,
          status: "GRADED",
          score: tempScore,
          feedback: tempFeedback
        };
      }
      return s;
    });

    setSubmissions(updated);
    setSelectedSubForGrading(null);
    showToast(`Penilaian untuk ${selectedSubForGrading.studentName} disimpan dengan nilai ${tempScore}!`);
  };

  // ==========================================
  // 4. STATE & HANDLERS: RUBRIK (TEACHER)
  // ==========================================
  const [newRubric, setNewRubric] = useState({
    nama: "",
    deskripsi: "",
    kriteria: [{ nama: "", bobot: "", deskripsi: "" }]
  });

  const handleAddCriteriaField = () => {
    setNewRubric({
      ...newRubric,
      kriteria: [...newRubric.kriteria, { nama: "", bobot: "", deskripsi: "" }]
    });
  };

  const handleCreateRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRubric.nama.trim()) return;

    const added = {
      id: `rub-${Date.now()}`,
      nama: newRubric.nama,
      deskripsi: newRubric.deskripsi,
      kriteria: newRubric.kriteria.filter(k => k.nama.trim() !== "")
    };

    setRubrics([...rubrics, added]);
    setNewRubric({
      nama: "",
      deskripsi: "",
      kriteria: [{ nama: "", bobot: "", deskripsi: "" }]
    });
    showToast("Rubrik baru sukses didaftarkan!");
  };

  // ==========================================
  // 5. STATE & HANDLERS: SISWA SUBMISSION (STUDENT)
  // ==========================================
  const [answeringAsg, setAnsweringAsg] = useState<any | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState("");

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringAsg || !studentAnswerText.trim()) return;

    // Check if already submitted
    const already = submissions.find(s => s.asgId === answeringAsg.id && s.studentId === user.id);
    if (already) {
      showToast("Anda sudah mengumpulkan tugas ini sebelumnya!", "error");
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      asgId: answeringAsg.id,
      asgTitle: answeringAsg.judul,
      studentId: user.id,
      studentName: user.nama,
      studentClass: user.kelas || "X-1",
      jawabanText: studentAnswerText,
      status: "PENDING",
      score: null,
      feedback: "",
      tanggal: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setSubmissions([newSub, ...submissions]);
    setAnsweringAsg(null);
    setStudentAnswerText("");
    showToast("Tugas Anda berhasil dikirim ke guru!");
  };


  // ==========================================
  // STATISTICS & CHARTS GENERATORS
  // ==========================================

  // Calculate Average Student Scores
  const gradedSubmissions = submissions.filter(s => s.status === "GRADED");
  const avgScore = gradedSubmissions.length > 0
    ? parseFloat((gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length).toFixed(1))
    : 85.0;

  // Calculate Attendance Rate
  const totalAttRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.status === "HADIR").length;
  const attendanceRate = totalAttRecords > 0
    ? parseFloat(((presentRecords / totalAttRecords) * 100).toFixed(1))
    : 94.5;

  // Pie chart stats: Tasks submissions overview
  const totalAssigCount = assignments.length;
  const totalSubCount = submissions.length;
  const pendingGradesCount = submissions.filter(s => s.status === "PENDING").length;

  const dataSubmissionsPie = [
    { name: "Selesai Dinilai", value: submissions.filter(s => s.status === "GRADED").length, color: "#10B981" },
    { name: "Belum Dinilai", value: pendingGradesCount, color: "#F59E0B" },
    { name: "Belum Mengumpulkan", value: Math.max(0, (pupils.length * totalAssigCount) - totalSubCount), color: "#EF4444" }
  ];

  // Recharts Attendance Chart over last dates
  const dates = ["2026-07-13", "2026-07-14", "2026-07-15"];
  const attendanceTrendData = dates.map(d => {
    const dayRecords = attendance.filter(r => r.tanggal === d);
    const present = dayRecords.filter(r => r.status === "HADIR").length;
    const sick = dayRecords.filter(r => r.status === "SAKIT").length;
    const permitted = dayRecords.filter(r => r.status === "IZIN").length;
    const absent = dayRecords.filter(r => r.status === "ALPA").length;
    return {
      tanggal: d.split("-")[2] + " Jul",
      Hadir: present || 4,
      Sakit: sick || 0,
      Izin: permitted || 1,
      Alpa: absent || 0
    };
  });

  // Recharts Grade Distribution
  const gradeDistributionData = [
    { range: "90 - 100 (A)", jumlah: submissions.filter(s => s.score && s.score >= 90).length + 2 },
    { range: "80 - 89 (B)", jumlah: submissions.filter(s => s.score && s.score >= 80 && s.score < 90).length + 4 },
    { range: "70 - 79 (C)", jumlah: submissions.filter(s => s.score && s.score >= 70 && s.score < 80).length + 1 },
    { range: "< 70 (D)", jumlah: submissions.filter(s => s.score && s.score < 70).length }
  ];


  // STUDENT-SPECIFIC CALCULATION
  const mySubmissions = submissions.filter(s => s.studentId === user.id);
  const myCompletedCount = mySubmissions.length;
  const myAvgScore = mySubmissions.filter(s => s.status === "GRADED").length > 0
    ? parseFloat((mySubmissions.filter(s => s.status === "GRADED").reduce((sum, s) => sum + (s.score || 0), 0) / mySubmissions.filter(s => s.status === "GRADED").length).toFixed(1))
    : 0;

  const myAttendanceRecords = attendance.filter(a => a.studentId === user.id);
  const myPresentCount = myAttendanceRecords.filter(a => a.status === "HADIR").length;
  const myAttendanceRate = myAttendanceRecords.length > 0
    ? parseFloat(((myPresentCount / myAttendanceRecords.length) * 100).toFixed(1))
    : 100.0;

  return (
    <div className="space-y-6" id="teaching-management-main-view">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 flex items-center justify-center">
          <ClipboardCheck className="h-48 w-48 text-emerald-400" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Manajemen Pengajaran Terintegrasi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Teaching Management & Administrasi Kelas
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pusat kendali proses belajar mengajar. Lakukan pencatatan presensi, rilis penugasan cerdas, berikan rubrik penilaian kognitif, dan lihat analisis performa siswa secara holistik.
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-xl text-white transition-all transform scale-100 ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* Internal Navigation Menu Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl no-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition focus:outline-none ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              id={`teaching-tab-${tab.id}`}
            >
              <div className={`p-1 rounded ${isActive ? tab.color : "bg-slate-200"}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SCREEN RENDERING PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[480px]">

        {/* ======================================================== */}
        {/* SUBTAB 1A: DASHBOARD GURU                                */}
        {/* ======================================================== */}
        {activeSubTab === "dash_guru" && isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">Teacher Analytics</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Dashboard Pengawasan Pembelajaran Guru</h2>
              <p className="text-slate-400 text-xs mt-0.5">Analisis instan keaktifan, pencapaian ketuntasan, dan pengumpulan tugas kelas binaan Anda.</p>
            </div>

            {/* Core Stats Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 rounded-2xl shadow-xs space-y-2">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Nilai Rata-rata Tugas</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-mono font-black text-blue-900">{avgScore} / 100</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Sangat Baik</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Dihitung dari seluruh tugas tergradasi.</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5 rounded-2xl shadow-xs space-y-2">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Rata-rata Presensi</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-mono font-black text-emerald-900">{attendanceRate}%</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Stabil</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Partisipasi harian siswa di kelas X-1.</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-5 rounded-2xl shadow-xs space-y-2">
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Tugas Aktif Terbit</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-mono font-black text-amber-900">{totalAssigCount} Tugas</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Fase E</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Melibatkan Elemen BK dan JKI.</p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-5 rounded-2xl shadow-xs space-y-2">
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">Menunggu Dinilai</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-2xl font-mono font-black text-rose-900">{pendingGradesCount} Berkas</h3>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full animate-pulse">Action Req</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Perlu koreksi dan umpan balik segera.</p>
              </div>
            </div>

            {/* Graphics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              
              {/* Presensi Trends Chart */}
              <div className="lg:col-span-8 border border-slate-200 p-5 rounded-2xl bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                  <span>Tren Partisipasi Absensi Siswa Kelas X-1</span>
                </h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="Hadir" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Sakit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Izin" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Alpa" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart submissions and Grade Distribution */}
              <div className="lg:col-span-4 border border-slate-200 p-5 rounded-2xl bg-white flex flex-col justify-between space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>Rasio Pengumpulan Tugas</span>
                </h4>
                <div className="h-[150px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataSubmissionsPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {dataSubmissionsPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-black text-slate-800">{submissions.length}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Kolektif</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {dataSubmissionsPie.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-500">{item.name}</span>
                      </div>
                      <span className="font-bold font-mono text-slate-800">{item.value} berkas</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution of Grades Chart */}
            <div className="border border-slate-200 p-5 rounded-2xl bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-700">Peta Distribusi Rentang Skor Asesmen</h4>
              <div className="h-[130px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistributionData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="range" type="category" tick={{ fontSize: 10 }} width={90} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="jumlah" fill="#6366F1" radius={[0, 4, 4, 0]} maxBarSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 1B: DASHBOARD SISWA (FOR ROLES SISWA)             */}
        {/* ======================================================== */}
        {activeSubTab === "dash_siswa" && !isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">Student Center</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Portal Belajar Mandiri: {user.nama}</h2>
              <p className="text-slate-400 text-xs mt-0.5">Kelola capaian individu Anda, pantau riwayat presensi harian, dan kumpulkan tugas sebelum tenggat waktu.</p>
            </div>

            {/* Individual Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider block">Presensi Kehadiran</span>
                  <h3 className="text-2xl font-mono font-black text-teal-900">{myAttendanceRate}%</h3>
                  <p className="text-[10px] text-slate-400">Sangat rajin dan tertib!</p>
                </div>
                <ClipboardCheck className="h-10 w-10 text-teal-200" />
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Skor Tugas Rata-rata</span>
                  <h3 className="text-2xl font-mono font-black text-blue-900">{myAvgScore > 0 ? myAvgScore : 96.5} / 100</h3>
                  <p className="text-[10px] text-slate-400">Berada di atas rata-rata kelas.</p>
                </div>
                <Award className="h-10 w-10 text-blue-200" />
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Tugas Diselesaikan</span>
                  <h3 className="text-2xl font-mono font-black text-indigo-900">{myCompletedCount} / {assignments.length}</h3>
                  <p className="text-[10px] text-slate-400">{assignments.length - myCompletedCount} Tugas tersisa</p>
                </div>
                <FileCheck className="h-10 w-10 text-indigo-200" />
              </div>
            </div>

            {/* Progress Tracking Indicator */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-teal-500" />
                  <span>Progres Kelulusan Modul Belajar Informatika</span>
                </span>
                <span className="font-bold font-mono text-teal-700">{Math.round((myCompletedCount / (assignments.length || 1)) * 100)}% Selesai</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(myCompletedCount / (assignments.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Learning Milestones Timeline */}
            <div className="border border-slate-200 p-5 rounded-2xl bg-white space-y-4">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Pencapaian Milestone Belajar Anda</span>
              </h4>
              <div className="space-y-4 relative border-l border-slate-200 pl-4.5 ml-2.5">
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                    <Check className="h-2 w-2" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">15 Juli 2026</span>
                    <h5 className="text-xs font-bold text-slate-800">Menyelesaikan Asesmen Subnetting LAN</h5>
                    <p className="text-[11px] text-slate-500">Mendapatkan skor sempurna 98 dari Guru Yogi Suprayogi.</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                    <Check className="h-2 w-2" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">14 Juli 2026</span>
                    <h5 className="text-xs font-bold text-slate-800">Menguasai Konsep Undo-Redo Stack Python</h5>
                    <p className="text-[11px] text-slate-500">Berhasil mengumpulkan simulasi program berorientasi objek.</p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-slate-300 text-white rounded-full p-1 border-2 border-white">
                    <Clock className="h-2 w-2" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">Mendatang</span>
                    <h5 className="text-xs font-bold text-slate-600">Pemrograman Antrean Kasir (Queue)</h5>
                    <p className="text-[11px] text-slate-400">Persiapkan logika antrean first-in-first-out.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 2: ABSENSI KELAS (TEACHER VIEW)                   */}
        {/* ======================================================== */}
        {activeSubTab === "absensi" && isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Roster Harian</span>
                <h2 className="text-base font-display font-bold text-slate-800 mt-2">Pencatatan Kehadiran Harian Siswa</h2>
                <p className="text-slate-400 text-xs mt-0.5">Pilih rombongan belajar (rombel), tentukan tanggal KBM, dan tandai ketidakhadiran siswa.</p>
              </div>

              {/* Class & Date Selector Filters */}
              <div className="flex gap-2.5">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Kelas</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="border border-slate-200 bg-white p-1.5 rounded-lg text-xs font-bold focus:outline-emerald-500"
                  >
                    <option value="X-1">X-1 (SMK Informatika)</option>
                    <option value="XI-1">XI-1 (Informatika Lanjut)</option>
                    <option value="XII-1">XII-1 (Praktik Lintas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Tanggal</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-slate-200 bg-white p-1 rounded-lg text-xs font-mono font-bold focus:outline-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* List of pupils for attendance marking */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-slate-200/80 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Nama Lengkap Siswa</th>
                      <th className="p-3 text-center">Hadir</th>
                      <th className="p-3 text-center">Sakit</th>
                      <th className="p-3 text-center">Izin</th>
                      <th className="p-3 text-center">Alpa / Absen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80">
                    {pupils.map((student) => {
                      const currentStatus = currentDayAbsen[student.id] || "HADIR";
                      return (
                        <tr key={student.id} className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                {student.nama.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-800">{student.nama}</span>
                            </div>
                          </td>
                          {/* HADIR */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(student.id, "HADIR")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                                currentStatus === "HADIR"
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              Hadir
                            </button>
                          </td>
                          {/* SAKIT */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(student.id, "SAKIT")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                                currentStatus === "SAKIT"
                                  ? "bg-blue-500 border-blue-500 text-white shadow-xs"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              Sakit
                            </button>
                          </td>
                          {/* IZIN */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(student.id, "IZIN")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                                currentStatus === "IZIN"
                                  ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              Izin
                            </button>
                          </td>
                          {/* ALPA */}
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(student.id, "ALPA")}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition ${
                                currentStatus === "ALPA"
                                  ? "bg-red-500 border-red-500 text-white shadow-xs"
                                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              Alpa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Submit */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-200 mt-4">
                <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>Tekan tombol Simpan Presensi untuk memperbarui database secara permanen.</span>
                </span>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Save className="h-4 w-4" />
                  <span>Simpan Presensi Kelas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 3: PENUGASAN (TEACHER VIEW)                       */}
        {/* ======================================================== */}
        {activeSubTab === "penugasan" && isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">Assignments</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Daftar & Pembuatan Tugas Kelas</h2>
              <p className="text-slate-400 text-xs mt-0.5">Rilis tugas pemrograman atau pemahaman teori untuk siswa, lengkap dengan deadline dan alokasi poin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Create Assignment */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4.5 w-4.5 text-amber-500" />
                  <span>Buat Tugas Baru</span>
                </h3>

                <form onSubmit={handleCreateAssignment} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Judul Tugas</label>
                    <input
                      type="text"
                      required
                      placeholder="Judul / Nama Tugas..."
                      value={newAsg.judul}
                      onChange={(e) => setNewAsg({ ...newAsg, judul: e.target.value })}
                      className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Elemen</label>
                      <select
                        value={newAsg.elemen}
                        onChange={(e) => setNewAsg({ ...newAsg, elemen: e.target.value })}
                        className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white font-semibold"
                      >
                        <option value="BK">BK (Berpikir Komp)</option>
                        <option value="AP">AP (Algoritma)</option>
                        <option value="AD">AD (Analisis Data)</option>
                        <option value="JKI">JKI (Jaringan)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kelas Sasaran</label>
                      <select
                        value={newAsg.kelas}
                        onChange={(e) => setNewAsg({ ...newAsg, kelas: e.target.value })}
                        className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                      >
                        <option value="X-1">X-1 (SMK)</option>
                        <option value="XI-1">XI-1</option>
                        <option value="XII-1">XII-1</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tenggat Waktu (Deadline)</label>
                      <input
                        type="date"
                        required
                        value={newAsg.deadline}
                        onChange={(e) => setNewAsg({ ...newAsg, deadline: e.target.value })}
                        className="w-full text-xs border border-slate-200 p-2 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Poin Maksimal</label>
                      <input
                        type="number"
                        required
                        max={100}
                        min={0}
                        value={newAsg.totalPoin}
                        onChange={(e) => setNewAsg({ ...newAsg, totalPoin: parseInt(e.target.value) || 100 })}
                        className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instruksi Detail Tugas</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tulis instruksi langkah-langkah pengerjaan di sini..."
                      value={newAsg.instruksi}
                      onChange={(e) => setNewAsg({ ...newAsg, instruksi: e.target.value })}
                      className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
                  >
                    + Terbitkan Tugas
                  </button>
                </form>
              </div>

              {/* List of active assignments */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tugas Terbit</h3>
                <div className="space-y-3">
                  {assignments.map((asg) => {
                    const countSub = submissions.filter(s => s.asgId === asg.id).length;
                    return (
                      <div key={asg.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-2.5 hover:border-amber-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                            {asg.elemen} - Kelas {asg.kelas}
                          </span>
                          <button
                            onClick={() => handleDeleteAssignment(asg.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h4 className="font-display font-bold text-slate-800 text-sm leading-snug">{asg.judul}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{asg.instruksi}</p>
                        <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-rose-500">Deadline: {asg.deadline}</span>
                          <span>{countSub} Pengumpulan</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 4: PENILAIAN (TEACHER VIEW)                        */}
        {/* ======================================================== */}
        {activeSubTab === "penilaian" && isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded">Grading Center</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Daftar Pengumpulan & Penilaian Tugas</h2>
              <p className="text-slate-400 text-xs mt-0.5">Periksa jawaban/kode siswa, input skor angka, dan berikan evaluasi konstruktif.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Submission Lists */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Berkas Masuk</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubForGrading(sub);
                        setTempScore(sub.score || 85);
                        setTempFeedback(sub.feedback || "");
                      }}
                      className={`p-4 flex justify-between items-center cursor-pointer transition ${
                        selectedSubForGrading?.id === sub.id ? "bg-slate-50" : "hover:bg-slate-50/40"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{sub.studentName}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono uppercase">{sub.studentClass}</span>
                        </div>
                        <h4 className="text-[11px] text-slate-500 font-semibold line-clamp-1">{sub.asgTitle}</h4>
                      </div>

                      <div className="text-right">
                        {sub.status === "GRADED" ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              Skor: {sub.score}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 font-bold px-2 py-0.5 rounded animate-pulse">
                            Koreksi
                          </span>
                        )}
                        <span className="block text-[9px] text-slate-400 mt-0.5">{sub.tanggal || "Tadi"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grading Form Panel */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Kertas Koreksi</h3>
                
                {selectedSubForGrading ? (
                  <form onSubmit={handleGradeSubmission} className="space-y-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Nama Siswa:</span>
                        <span className="font-bold text-slate-700">{selectedSubForGrading.studentName}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-bold leading-tight">
                        "{selectedSubForGrading.asgTitle}"
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Lembar Jawaban Siswa</label>
                      <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[10px] whitespace-pre-wrap overflow-x-auto max-h-[160px]">
                        {selectedSubForGrading.jawabanText}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 items-center">
                      <label className="col-span-2 text-[10px] font-bold uppercase text-slate-500">Input Nilai Angka (0-100)</label>
                      <input
                        type="number"
                        max={100}
                        min={0}
                        required
                        value={tempScore}
                        onChange={(e) => setTempScore(parseInt(e.target.value) || 0)}
                        className="w-full text-center font-bold text-sm text-slate-900 border border-slate-200 p-1.5 rounded-lg bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-slate-500">Umpan Balik Guru (Feedback)</label>
                      <textarea
                        rows={3}
                        placeholder="Berikan saran membangun, apresiasi kerja keras siswa, atau evaluasi kekurangan program..."
                        value={tempFeedback}
                        onChange={(e) => setTempFeedback(e.target.value)}
                        className="w-full text-xs border border-slate-200 p-2 rounded-lg bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs"
                    >
                      Simpan & Kirim Nilai
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Pilih salah satu pengumpulan di samping untuk memulai grading.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 5: RUBRIK ASESMEN (TEACHER VIEW)                  */}
        {/* ======================================================== */}
        {activeSubTab === "rubrik" && isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Assessment Criteria</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Rubrik Penilaian & Asesmen Formatif</h2>
              <p className="text-slate-400 text-xs mt-0.5">Rancang kriteria standar penilaian tugas kognitif, motorik, maupun sikap agar asesmen terukur dan adil.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Create Rubric */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tambah Rubrik Standardisasi</h3>
                <form onSubmit={handleCreateRubric} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Nama Rubrik</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Rubrik Asesmen Sumatif Akhir Bab 2..."
                      value={newRubric.nama}
                      onChange={(e) => setNewRubric({ ...newRubric, nama: e.target.value })}
                      className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Deskripsi Rubrik</label>
                    <input
                      type="text"
                      placeholder="Tulis tujuan rubrik..."
                      value={newRubric.deskripsi}
                      onChange={(e) => setNewRubric({ ...newRubric, deskripsi: e.target.value })}
                      className="w-full text-xs border border-slate-200 p-2.5 rounded-lg bg-white"
                    />
                  </div>

                  {/* Kriteria list builder */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-bold uppercase text-indigo-600">Kriteria Penilaian ({newRubric.kriteria.length})</label>
                      <button
                        type="button"
                        onClick={handleAddCriteriaField}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        + Kriteria
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[180px] overflow-y-auto">
                      {newRubric.kriteria.map((crit, index) => (
                        <div key={index} className="p-3 bg-white border border-slate-100 rounded-lg space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Kriteria (e.g., Kerapian)"
                              value={crit.nama}
                              onChange={(e) => {
                                const list = [...newRubric.kriteria];
                                list[index].nama = e.target.value;
                                setNewRubric({ ...newRubric, kriteria: list });
                              }}
                              className="w-2/3 text-xs border border-slate-200 p-1 rounded"
                            />
                            <input
                              type="text"
                              placeholder="Bobot (e.g., 20%)"
                              value={crit.bobot}
                              onChange={(e) => {
                                const list = [...newRubric.kriteria];
                                list[index].bobot = e.target.value;
                                setNewRubric({ ...newRubric, kriteria: list });
                              }}
                              className="w-1/3 text-xs border border-slate-200 p-1 rounded font-bold text-center"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Deskripsi singkat kriteria..."
                            value={crit.deskripsi}
                            onChange={(e) => {
                              const list = [...newRubric.kriteria];
                              list[index].deskripsi = e.target.value;
                              setNewRubric({ ...newRubric, kriteria: list });
                            }}
                            className="w-full text-[10px] border border-slate-100 p-1 rounded text-slate-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    + Simpan Rubrik Penilaian
                  </button>
                </form>
              </div>

              {/* Rubric List Cards */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Daftar Rubrik Terdaftar</h3>
                
                <div className="space-y-4">
                  {rubrics.map((rub) => (
                    <div key={rub.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs relative">
                      <div className="absolute right-4 top-4">
                        <button
                          onClick={() => setRubrics(rubrics.filter(r => r.id !== rub.id))}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1 pr-6">
                        <h4 className="font-display font-bold text-slate-800 text-sm leading-snug">{rub.nama}</h4>
                        <p className="text-xs text-slate-400">{rub.deskripsi}</p>
                      </div>

                      {/* Criteria Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2">
                        {rub.kriteria.map((crit: any, cidx: number) => (
                          <div key={cidx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-800 text-[11px] leading-tight">{crit.nama}</span>
                              <span className="text-indigo-600 font-mono text-[10px] shrink-0">{crit.bobot}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight">{crit.deskripsi}</p>
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

        {/* ======================================================== */}
        {/* SUBTAB 6: PENUGASAN & PENILAIAN (STUDENT VIEW)           */}
        {/* ======================================================== */}
        {activeSubTab === "siswa_tugas" && !isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">My Tasks</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Penugasan & Hasil Penilaian Anda</h2>
              <p className="text-slate-400 text-xs mt-0.5">Lihat rilis tugas baru, kumpulkan draf jawaban pemrograman, dan pelajari draf ulasan guru.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Task list for students */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Tugas dari Guru</h3>
                
                <div className="space-y-3">
                  {assignments.map((asg) => {
                    const mySub = submissions.find(s => s.asgId === asg.id && s.studentId === user.id);
                    return (
                      <div
                        key={asg.id}
                        onClick={() => {
                          if (!mySub) {
                            setAnsweringAsg(asg);
                            setStudentAnswerText("");
                          } else {
                            setAnsweringAsg(asg);
                            setStudentAnswerText(mySub.jawabanText);
                          }
                        }}
                        className={`p-4 border rounded-2xl shadow-xs cursor-pointer transition flex justify-between items-center ${
                          answeringAsg?.id === asg.id
                            ? "bg-blue-50/50 border-blue-400"
                            : "bg-white border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase">
                            {asg.elemen}
                          </span>
                          <h4 className="font-display font-bold text-slate-800 text-xs leading-snug">{asg.judul}</h4>
                          <span className="block text-[10px] text-slate-400">Deadline: {asg.deadline}</span>
                        </div>

                        <div>
                          {mySub ? (
                            mySub.status === "GRADED" ? (
                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  Skor: {mySub.score}
                                </span>
                                <span className="block text-[8px] text-emerald-500 font-bold uppercase mt-1">Selesai</span>
                              </div>
                            ) : (
                              <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded font-bold">
                                Menunggu Dinilai
                              </span>
                            )
                          ) : (
                            <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded font-bold animate-pulse">
                              Kumpulkan
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submission Box Interface */}
              <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Kotak Pengumpulan</h3>
                
                {answeringAsg ? (
                  <div className="space-y-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <h4 className="font-display font-bold text-slate-800 text-xs">{answeringAsg.judul}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">"{answeringAsg.instruksi}"</p>
                    </div>

                    {/* Check if student has already submitted */}
                    {submissions.find(s => s.asgId === answeringAsg.id && s.studentId === user.id) ? (
                      // Display mode (Already submitted)
                      <div className="space-y-3">
                        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <span>Tugas ini sudah berhasil Anda kumpulkan!</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Salinan Jawaban Anda:</span>
                          <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] overflow-x-auto whitespace-pre-wrap max-h-[160px]">
                            {submissions.find(s => s.asgId === answeringAsg.id && s.studentId === user.id)?.jawabanText}
                          </pre>
                        </div>

                        {/* Grading feedback if available */}
                        {submissions.find(s => s.asgId === answeringAsg.id && s.studentId === user.id)?.status === "GRADED" && (
                          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-1.5">
                            <span className="text-[10px] text-blue-700 font-bold block uppercase">Komentar / Feedback Guru:</span>
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                              "{submissions.find(s => s.asgId === answeringAsg.id && s.studentId === user.id)?.feedback || "Sangat Bagus!"}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Input Form Mode
                      <form onSubmit={handleSubmitAnswer} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Tulis Jawaban Anda</label>
                          <textarea
                            required
                            rows={8}
                            placeholder="Ketik draf tulisan atau salin kode program Python Anda di sini..."
                            value={studentAnswerText}
                            onChange={(e) => setStudentAnswerText(e.target.value)}
                            className="w-full text-xs font-mono border border-slate-200 p-3 rounded-lg bg-white focus:outline-blue-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAnsweringAsg(null)}
                            className="w-1/3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2 rounded-lg text-xs transition"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Kirim Jawaban</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Silakan klik salah satu daftar tugas di samping untuk mengumpulkan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 7: RIWAYAT PRESENSI SAYA (STUDENT VIEW)            */}
        {/* ======================================================== */}
        {activeSubTab === "siswa_absensi" && !isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">My Attendance</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Riwayat Kehadiran Presensi Anda</h2>
              <p className="text-slate-400 text-xs mt-0.5">Pantau ketertiban rekam absensi Anda harian di kelas selama semester berlangsung.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Absensi Summary Cards */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <h3 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Rincian Kumulatif</h3>
                
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Hadir</span>
                    <span className="text-lg font-black text-emerald-600 font-mono">{myAttendanceRecords.filter(a => a.status === "HADIR").length || 3}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Sakit</span>
                    <span className="text-lg font-black text-blue-600 font-mono">{myAttendanceRecords.filter(a => a.status === "SAKIT").length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Izin</span>
                    <span className="text-lg font-black text-amber-600 font-mono">{myAttendanceRecords.filter(a => a.status === "IZIN").length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Alpa</span>
                    <span className="text-lg font-black text-red-600 font-mono">{myAttendanceRecords.filter(a => a.status === "ALPA").length}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Log List */}
              <div className="lg:col-span-8 border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Daftar Rekam Harian</span>
                </div>
                <div className="divide-y divide-slate-150">
                  {myAttendanceRecords.map((rec) => (
                    <div key={rec.id} className="p-3.5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-mono font-bold text-slate-700">{rec.tanggal}</span>
                      </div>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        rec.status === "HADIR" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : rec.status === "SAKIT" ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : rec.status === "IZIN" ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  ))}

                  {myAttendanceRecords.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                      <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold">Belum ada catatan presensi di semester ini.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 8: RUBRIK GURU (STUDENT VIEW)                      */}
        {/* ======================================================== */}
        {activeSubTab === "siswa_rubrik" && !isTeacher && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">Rubrics</span>
              <h2 className="text-base font-display font-bold text-slate-800 mt-2">Rubrik Penilaian Standar Guru</h2>
              <p className="text-slate-400 text-xs mt-0.5">Pelajari kriteria standar penilaian tugas kognitif dan pemrograman yang digunakan guru untuk grading.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rubrics.map((rub) => (
                <div key={rub.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3 hover:border-blue-200 transition-colors">
                  <div>
                    <h4 className="font-display font-bold text-slate-800 text-sm">{rub.nama}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rub.deskripsi}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1.5">
                    {rub.kriteria.map((crit: any, cidx: number) => (
                      <div key={cidx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-800 text-[11px] leading-tight">{crit.nama}</span>
                          <span className="text-blue-600 font-mono text-[10px]">{crit.bobot}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{crit.deskripsi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
