import React from "react";
import {
  GraduationCap,
  TrendingUp,
  BookOpen,
  FileCheck,
  ClipboardCheck,
  Layers,
  Smartphone,
  LogOut,
  ShieldCheck,
  Activity,
  Sparkles,
  X,
  Calendar,
  Bell,
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { User } from "../types";

interface SidebarProps {
  user: User;
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  onLogout: () => void;
  setSelectedDoc?: (doc: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  tugasList?: any[];
  submissions?: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentTab,
  setCurrentTab,
  onLogout,
  setSelectedDoc,
  isOpen = false,
  onClose,
  tugasList = [],
  submissions = []
}) => {
  const [identitas, setIdentitas] = React.useState({
    nama: "SMAN 1 Informatika",
    logo: ""
  });
  const [showDeadlineTooltip, setShowDeadlineTooltip] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("ALL");
  const [selectedClass, setSelectedClass] = React.useState("ALL");
  const [selectedPriority, setSelectedPriority] = React.useState("ALL");

  React.useEffect(() => {
    // Fetch initial identity
    fetch("/api/academic/identitas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.identitas) {
          setIdentitas(data.identitas);
        }
      })
      .catch((err) => console.error("Error loading identitas inside sidebar:", err));

    // Listen to updates
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIdentitas(customEvent.detail);
      }
    };
    window.addEventListener("identitas_updated", handleUpdate);
    return () => {
      window.removeEventListener("identitas_updated", handleUpdate);
    };
  }, []);

  // Find pending items for tooltip and urgency calculations
  const pendingItems = React.useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);

    if (user.role === "SISWA") {
      return tugasList
        .filter((t) => {
          const hasSubmitted = submissions.some(
            (s) => s.tugasId === t.id && s.siswaId === user.id
          );
          return !hasSubmitted;
        })
        .map((t) => {
          // Calculate remaining days
          let daysLeft = 999;
          if (t.deadline) {
            const deadline = new Date(t.deadline);
            deadline.setHours(0,0,0,0);
            const diffTime = deadline.getTime() - today.getTime();
            daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          let urgencyStyle = "text-emerald-400";
          let urgencyText = `${daysLeft} hari lagi`;
          if (daysLeft < 0) {
            urgencyStyle = "text-rose-500 font-bold";
            urgencyText = `Terlewat ${Math.abs(daysLeft)} hari`;
          } else if (daysLeft === 0) {
            urgencyStyle = "text-rose-500 font-bold animate-pulse";
            urgencyText = "HARI INI!";
          } else if (daysLeft === 1) {
            urgencyStyle = "text-orange-400 font-bold";
            urgencyText = "Besok!";
          } else if (daysLeft <= 3) {
            urgencyStyle = "text-amber-350 font-semibold";
          } else if (daysLeft <= 5) {
            urgencyStyle = "text-amber-300";
          }

          let priority = "RENDAH";
          if (daysLeft < 0 || daysLeft <= 1) {
            priority = "TINGGI";
          } else if (daysLeft <= 5) {
            priority = "SEDANG";
          }

          return {
            id: t.id,
            title: t.judul,
            deadline: t.deadline || "Tanpa batas",
            daysLeft,
            type: t.tipe,
            detail: `Elemen: ${t.elemen}`,
            urgencyStyle,
            urgencyText,
            badgeLabel: t.deadline || "Tanpa batas",
            kelas: t.kelas || "X",
            priority
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft);
    } else {
      // GURU or ADMIN
      // 1. Tasks approaching deadlines
      const activeTugasItems = tugasList
        .filter((t) => t.deadline)
        .map((t) => {
          const deadlineDate = new Date(t.deadline);
          deadlineDate.setHours(0,0,0,0);
          const diffTime = deadlineDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let urgencyStyle = "text-emerald-400";
          let urgencyText = `${daysLeft} hari lagi`;
          if (daysLeft < 0) {
            urgencyStyle = "text-rose-500 font-bold";
            urgencyText = `Terlewat ${Math.abs(daysLeft)} hari`;
          } else if (daysLeft === 0) {
            urgencyStyle = "text-rose-500 font-bold animate-pulse";
            urgencyText = "HARI INI!";
          } else if (daysLeft === 1) {
            urgencyStyle = "text-orange-400 font-bold";
            urgencyText = "Besok!";
          } else if (daysLeft <= 3) {
            urgencyStyle = "text-amber-350 font-semibold";
          } else if (daysLeft <= 7) {
            urgencyStyle = "text-amber-300";
          }

          let priority = "RENDAH";
          if (daysLeft < 0 || daysLeft <= 1) {
            priority = "TINGGI";
          } else if (daysLeft <= 5) {
            priority = "SEDANG";
          }

          return {
            id: `tugas-${t.id}`,
            title: `Tenggat: ${t.judul}`,
            deadline: t.deadline,
            daysLeft,
            type: "TUGAS_DEADLINE",
            detail: `Kelas: ${t.kelas || "X"} • ${t.tipe.replace("_", " ")}`,
            urgencyStyle,
            urgencyText,
            badgeLabel: t.deadline,
            kelas: t.kelas || "X",
            priority
          };
        })
        .filter((t) => t.daysLeft >= -7 && t.daysLeft <= 30); // Show recent past and future up to 30 days

      // 2. Ungraded submissions
      const ungradedSubmissionsItems = submissions
        .filter((s) => s.status === "BELUM_DINILAI")
        .map((s) => {
          const targetTugas = tugasList.find((t) => t.id === s.tugasId);
          let daysSinceSubmitted = 0;
          if (s.tanggalDikumpul) {
            const submitDate = new Date(s.tanggalDikumpul);
            const diffTime = today.getTime() - submitDate.getTime();
            daysSinceSubmitted = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          }

          let urgencyStyle = "text-amber-350";
          let urgencyText = "Hari ini";
          if (daysSinceSubmitted === 1) {
            urgencyStyle = "text-orange-400 font-bold";
            urgencyText = "Kemarin";
          } else if (daysSinceSubmitted >= 3) {
            urgencyStyle = "text-rose-500 font-bold animate-pulse";
            urgencyText = `${daysSinceSubmitted} hari lalu`;
          } else if (daysSinceSubmitted >= 2) {
            urgencyStyle = "text-rose-400 font-bold";
            urgencyText = `${daysSinceSubmitted} hari lalu`;
          }

          let priority = "RENDAH";
          if (daysSinceSubmitted >= 2) {
            priority = "TINGGI";
          } else if (daysSinceSubmitted === 1) {
            priority = "SEDANG";
          }

          return {
            id: `sub-${s.id}`,
            title: `Nilai: ${s.siswaNama}`,
            deadline: "Belum Dinilai",
            daysLeft: -daysSinceSubmitted,
            type: "SUBMISSION",
            detail: `Tugas: ${targetTugas?.judul || "Evaluasi"} • Kelas: ${targetTugas?.kelas || "X"}`,
            urgencyStyle,
            urgencyText,
            badgeLabel: "Belum Dinilai",
            kelas: targetTugas?.kelas || "X",
            priority
          };
        });

      return [...activeTugasItems, ...ungradedSubmissionsItems].sort((a, b) => a.daysLeft - b.daysLeft);
    }
  }, [tugasList, submissions, user]);

  const badgeStyle = React.useMemo(() => {
    if (pendingItems.length === 0) return { className: "", label: "Low" };
    
    if (user.role === "SISWA") {
      const minDays = Math.min(...pendingItems.map((item) => item.daysLeft));
      if (minDays <= 0) {
        return {
          className: "bg-rose-600 text-white border-rose-400 animate-pulse font-black ring-2 ring-rose-500/40",
          label: "Sangat Mendesak"
        };
      } else if (minDays <= 2) {
        return {
          className: "bg-orange-500 text-white border-orange-400 font-bold",
          label: "Mendesak"
        };
      } else if (minDays <= 5) {
        return {
          className: "bg-amber-400 text-slate-900 border-amber-300 font-bold",
          label: "Sedang"
        };
      } else {
        return {
          className: "bg-emerald-500 text-white border-emerald-400 font-medium",
          label: "Aman"
        };
      }
    } else {
      // Guru
      const hasExtremeUrgency = pendingItems.some(
        (item) => 
          (item.type === "TUGAS_DEADLINE" && item.daysLeft <= 0) ||
          (item.type === "SUBMISSION" && item.daysLeft <= -3)
      );
      const hasHighUrgency = pendingItems.some(
        (item) => 
          (item.type === "TUGAS_DEADLINE" && item.daysLeft <= 2) ||
          (item.type === "SUBMISSION" && item.daysLeft <= -1)
      );

      if (hasExtremeUrgency) {
        return {
          className: "bg-rose-600 text-white border-rose-400 animate-pulse font-black ring-2 ring-rose-500/40",
          label: "Sangat Mendesak"
        };
      } else if (hasHighUrgency) {
        return {
          className: "bg-orange-500 text-white border-orange-400 font-bold",
          label: "Mendesak"
        };
      } else {
        return {
          className: "bg-amber-400 text-slate-900 border-amber-300 font-bold",
          label: "Aman"
        };
      }
    }
  }, [pendingItems, user]);

  const badgeCount = pendingItems.length;

  const filteredModalItems = React.useMemo(() => {
    let items = pendingItems;

    // Search term filtering
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.detail.toLowerCase().includes(term) ||
          (item.badgeLabel && item.badgeLabel.toLowerCase().includes(term))
      );
    }

    // Tab filter
    if (activeFilter === "URGENT") {
      if (user.role === "SISWA") {
        items = items.filter((item) => item.daysLeft <= 2);
      } else {
        items = items.filter((item) => {
          if (item.type === "TUGAS_DEADLINE") return item.daysLeft <= 2;
          if (item.type === "SUBMISSION") return item.daysLeft <= -1;
          return true;
        });
      }
    } else if (activeFilter === "SUBMISSION") {
      items = items.filter((item) => item.type === "SUBMISSION");
    } else if (activeFilter === "DEADLINE") {
      items = items.filter((item) => item.type === "TUGAS_DEADLINE");
    }

    // Class filter (Kelas)
    if (selectedClass !== "ALL") {
      items = items.filter((item) => item.kelas === selectedClass);
    }

    // Priority filter (Prioritas)
    if (selectedPriority !== "ALL") {
      items = items.filter((item) => item.priority === selectedPriority);
    }

    return items;
  }, [pendingItems, searchTerm, activeFilter, selectedClass, selectedPriority, user]);

  const modalTheme = React.useMemo(() => {
    if (badgeCount === 0) {
      return {
        bg: "from-emerald-500/10 to-teal-500/10",
        border: "border-emerald-500/20",
        iconColor: "text-emerald-400",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        title: "Semua Tugas Aman"
      };
    }
    
    if (user.role === "SISWA") {
      const minDays = Math.min(...pendingItems.map((item) => item.daysLeft));
      if (minDays <= 0) {
        return {
          bg: "from-rose-500/10 to-red-600/10",
          border: "border-rose-500/20",
          iconColor: "text-rose-400 animate-pulse",
          badgeColor: "bg-rose-500/20 text-rose-300",
          title: "Sangat Mendesak"
        };
      } else if (minDays <= 2) {
        return {
          bg: "from-orange-500/10 to-amber-600/10",
          border: "border-orange-500/20",
          iconColor: "text-orange-400",
          badgeColor: "bg-orange-500/20 text-orange-300",
          title: "Tenggat Mendesak"
        };
      } else {
        return {
          bg: "from-indigo-500/10 to-blue-600/10",
          border: "border-indigo-500/20",
          iconColor: "text-indigo-400",
          badgeColor: "bg-indigo-500/20 text-indigo-300",
          title: "Tugas Terjadwal"
        };
      }
    } else {
      // Guru
      const hasExtremeUrgency = pendingItems.some(
        (item) => 
          (item.type === "TUGAS_DEADLINE" && item.daysLeft <= 0) ||
          (item.type === "SUBMISSION" && item.daysLeft <= -3)
      );
      if (hasExtremeUrgency) {
        return {
          bg: "from-rose-500/10 to-red-600/10",
          border: "border-rose-500/20",
          iconColor: "text-rose-400 animate-pulse",
          badgeColor: "bg-rose-500/20 text-rose-300",
          title: "Perlu Penilaian Segera"
        };
      } else {
        return {
          bg: "from-indigo-500/10 to-blue-600/10",
          border: "border-indigo-500/20",
          iconColor: "text-indigo-400",
          badgeColor: "bg-indigo-500/20 text-indigo-300",
          title: "Agenda & Penilaian"
        };
      }
    }
  }, [badgeCount, pendingItems, user]);

  const changeTab = (tab: any) => {
    setCurrentTab(tab);
    if (setSelectedDoc) {
      setSelectedDoc(null);
    }
    if (onClose) {
      onClose(); // Auto-close drawer on mobile navigation
    }
  };

  const navContent = (
    <>
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
        {/* Logo Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between" id="brand-logo-container">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center font-bold overflow-hidden shrink-0 h-10 w-10 bg-indigo-600 text-white rounded-lg p-1.5">
              {identitas.logo ? (
                <img
                  src={identitas.logo}
                  alt="School Logo"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <GraduationCap className="h-6 w-6" />
              )}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-white font-display font-bold text-sm leading-tight truncate" title={identitas.nama}>
                {identitas.nama}
              </h1>
              <p className="text-[9px] text-slate-400 tracking-wider">LMTMS • Portal Guru</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Profile Summary */}
        <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800" id="user-profile-summary">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
              {user.nama.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-white truncate leading-tight">{user.nama}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1" id="sidebar-nav-links">
          <button
            onClick={() => changeTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === "dashboard"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            id="nav-link-dashboard"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Dashboard Analitik</span>
          </button>

          <button
            onClick={() => changeTab("lms")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === "lms"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            id="nav-link-lms"
          >
            <GraduationCap className="h-4 w-4 text-indigo-400 font-bold" />
            <span className="font-bold">LMS (Learning System)</span>
          </button>

          {(user.role === "GURU" || user.role === "ADMIN") && (
            <button
              onClick={() => changeTab("teaching")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "teaching"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-teaching"
            >
              <ClipboardCheck className="h-4 w-4 text-emerald-400 font-bold" />
              <span className="font-bold">Teaching Management</span>
            </button>
          )}

          {(user.role === "GURU" || user.role === "ADMIN") && (
            <button
              onClick={() => changeTab("ai_assistant")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "ai_assistant"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-ai-assistant"
            >
              <Sparkles className="h-4 w-4 text-amber-400 font-bold animate-pulse" />
              <span className="font-bold text-amber-300">AI Teaching Assistant</span>
            </button>
          )}

          {(user.role === "GURU" || user.role === "ADMIN") && (
            <button
              onClick={() => changeTab("perangkat")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "perangkat"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-perangkat"
            >
              <Layers className="h-4 w-4" />
              <span>Perangkat (AI Draft)</span>
            </button>
          )}

          <button
            onClick={() => changeTab("materi")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === "materi"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            id="nav-link-materi"
          >
            <BookOpen className="h-4 w-4" />
            <span>Materi Pembelajaran</span>
          </button>

          <div className="relative" id="tugas-nav-wrapper">
            <button
              onClick={() => changeTab("tugas")}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "tugas"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-tugas"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="h-4 w-4" />
                <span>Tugas & Kuis</span>
              </div>
              {badgeCount > 0 && (
                <span 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent changing tab when clicking the badge
                    setShowDeadlineTooltip(!showDeadlineTooltip);
                  }}
                  className={`px-1.5 py-0.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center border leading-none cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${badgeStyle.className}`}
                  title={user.role === "SISWA" ? `Klik untuk melihat ${badgeCount} tugas belum dikerjakan` : `Klik untuk melihat ${badgeCount} tugas belum dinilai`}
                  id="tugas-badge"
                >
                  {badgeCount}
                </span>
              )}
            </button>

            {/* The old constrained absolute tooltip has been removed to make way for the new full popup panel */}
          </div>

          {user.role === "GURU" && (
            <button
              onClick={() => changeTab("absensi")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "absensi"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-absensi"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Presensi Kelas</span>
            </button>
          )}

          {(user.role === "ADMIN" || user.role === "GURU") && (
            <button
              onClick={() => changeTab("administrasi")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "administrasi"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-administrasi"
            >
              <Layers className="h-4 w-4" />
              <span>Manajemen Akademik</span>
            </button>
          )}

          {(user.role === "ADMIN" || user.role === "GURU") && (
            <button
              onClick={() => changeTab("logs")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === "logs"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
              id="nav-link-logs"
            >
              <Activity className="h-4 w-4" />
              <span>Log Aktivitas</span>
            </button>
          )}

          <button
            onClick={() => changeTab("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === "settings"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            id="nav-link-settings"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Profil & Keamanan</span>
          </button>
        </nav>
      </div>

      {/* PWA State & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/20" id="sidebar-footer">
        <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/50 p-2.5 rounded-lg" id="pwa-status-box">
          <span className="flex items-center gap-1">
            <Smartphone className="h-3 w-3 text-emerald-400" />
            <span>PWA Offline Ready</span>
          </span>
          <span className="font-mono text-emerald-400 text-[9px] font-bold">TERPASANG</span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between text-xs hover:text-rose-400 py-1.5 transition"
          id="btn-logout"
        >
          <span className="font-medium">Keluar Akun</span>
          <LogOut className="h-4 w-4 text-rose-400" />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR - STAYS PINNED */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 no-print hidden md:flex h-screen sticky top-0 border-r border-slate-800" id="app-sidebar-nav">
        {navContent}
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      <div
        className={`fixed inset-0 bg-slate-950/60 z-40 transition-opacity duration-300 md:hidden no-print ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* MOBILE DRAWER PANEL */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between no-print z-50 transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        id="app-sidebar-nav-mobile"
      >
        {navContent}
      </aside>

      {/* DETAILED POPUP PANEL FOR DEADLINES & ASSIGNMENTS */}
      {showDeadlineTooltip && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md no-print"
          onClick={() => {
            setShowDeadlineTooltip(false);
            setSearchTerm("");
            setActiveFilter("ALL");
            setSelectedClass("ALL");
            setSelectedPriority("ALL");
          }}
          id="deadline-panel-overlay"
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
            id="deadline-panel-card"
          >
            {/* Header with status based dynamic gradient */}
            <div className={`p-5 bg-gradient-to-r ${modalTheme.bg} border-b border-slate-800 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-900/80 border border-slate-800 ${modalTheme.iconColor}`}>
                  {badgeCount === 0 ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : user.role === "SISWA" ? (
                    <Calendar className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-snug">
                    {user.role === "SISWA" ? "Agenda & Tenggat Tugas Anda" : "Pusat Tenggat & Penilaian Kelas"}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-400">Status Urgensi:</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider ${modalTheme.badgeColor}`}>
                      {modalTheme.title}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowDeadlineTooltip(false);
                  setSearchTerm("");
                  setActiveFilter("ALL");
                  setSelectedClass("ALL");
                  setSelectedPriority("ALL");
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
                title="Tutup Panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="px-5 pt-4 pb-2 border-b border-slate-800 bg-slate-950/20">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={user.role === "SISWA" ? "Cari judul tugas, pelajaran..." : "Cari tugas, siswa, kelas..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 outline-none transition"
                  id="deadline-search"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2.5 text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-2 border-b border-slate-800/50 bg-slate-950/10 flex gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`px-3 py-1 text-[11px] font-medium rounded-full transition whitespace-nowrap ${
                  activeFilter === "ALL"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                Semua ({pendingItems.length})
              </button>
              <button
                onClick={() => setActiveFilter("URGENT")}
                className={`px-3 py-1 text-[11px] font-medium rounded-full transition whitespace-nowrap ${
                  activeFilter === "URGENT"
                    ? "bg-rose-600 text-white font-semibold"
                    : "bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                Mendesak ({
                  user.role === "SISWA" 
                    ? pendingItems.filter(i => i.daysLeft <= 2).length
                    : pendingItems.filter(i => (i.type === "TUGAS_DEADLINE" && i.daysLeft <= 2) || (i.type === "SUBMISSION" && i.daysLeft <= -1)).length
                })
              </button>
              {user.role !== "SISWA" && (
                <>
                  <button
                    onClick={() => setActiveFilter("DEADLINE")}
                    className={`px-3 py-1 text-[11px] font-medium rounded-full transition whitespace-nowrap ${
                      activeFilter === "DEADLINE"
                        ? "bg-amber-500 text-slate-950 font-semibold"
                        : "bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    Tenggat Dekat ({pendingItems.filter(i => i.type === "TUGAS_DEADLINE").length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("SUBMISSION")}
                    className={`px-3 py-1 text-[11px] font-medium rounded-full transition whitespace-nowrap ${
                      activeFilter === "SUBMISSION"
                        ? "bg-teal-600 text-white font-semibold"
                        : "bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                    }`}
                  >
                    Belum Dinilai ({pendingItems.filter(i => i.type === "SUBMISSION").length})
                  </button>
                </>
              )}
            </div>

            {/* Secondary Multi-Dimensional Filters */}
            <div className="px-5 py-3 border-b border-slate-800/40 bg-slate-950/20 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Filter Kelas / Tingkat
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none transition cursor-pointer"
                  id="filter-kelas-select"
                >
                  <option value="ALL">Semua Kelas</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prioritas Tugas
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none transition cursor-pointer"
                  id="filter-prioritas-select"
                >
                  <option value="ALL">Semua Prioritas</option>
                  <option value="TINGGI">🔴 Tinggi / Mendesak</option>
                  <option value="SEDANG">🟡 Sedang</option>
                  <option value="RENDAH">🟢 Rendah</option>
                </select>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {filteredModalItems.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3 bg-slate-950/20 rounded-xl border border-dashed border-slate-800/60">
                  <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs">Agenda Bersih & Aman</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
                      {searchTerm 
                        ? "Tidak ada tugas atau agenda yang cocok dengan pencarian Anda." 
                        : "Tidak ada tugas, deadline mendesak, atau penilaian tertinggal yang ditemukan."}
                    </p>
                  </div>
                </div>
              ) : (
                filteredModalItems.map((item) => {
                  // Define left border indicator color
                  let borderIndicator = "border-l-emerald-500";
                  if (item.urgencyText.includes("HARI INI") || item.urgencyText.includes("Terlewat") || item.urgencyText.includes("lalu")) {
                    borderIndicator = "border-l-rose-500";
                  } else if (item.urgencyText.includes("Besok") || item.urgencyText.includes("Kemarin")) {
                    borderIndicator = "border-l-orange-500";
                  } else if (item.daysLeft <= 3 && item.daysLeft >= 0) {
                    borderIndicator = "border-l-amber-400";
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setShowDeadlineTooltip(false);
                        setSearchTerm("");
                        setActiveFilter("ALL");
                        setSelectedClass("ALL");
                        setSelectedPriority("ALL");
                        changeTab("tugas");
                      }}
                      className={`p-3 border border-slate-800/60 hover:border-slate-700/80 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 border-l-4 ${borderIndicator} ${
                        item.type !== "SUBMISSION" && item.daysLeft < 0 
                          ? "bg-rose-950/25 border-rose-900/60 hover:bg-rose-950/45" 
                          : "bg-slate-950/40 hover:bg-slate-950/90"
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            item.type === "SUBMISSION" 
                              ? "bg-teal-500/20 text-teal-400 border border-teal-500/10" 
                              : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/10"
                          }`}>
                            {item.type === "SUBMISSION" ? "Penilaian" : "Tenggat"}
                          </span>
                          <span className={`text-[9px] font-mono font-black ${item.urgencyStyle}`}>
                            {item.urgencyText}
                          </span>
                          
                          {/* PENANDA SUDAH LEWAT DEADLINE */}
                          {item.type !== "SUBMISSION" && item.daysLeft < 0 && (
                            <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded bg-rose-600 text-white animate-pulse border border-rose-500 flex items-center gap-0.5 shadow-sm shadow-rose-600/30">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              SUDAH LEWAT DEADLINE
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold line-clamp-1 ${
                          item.type !== "SUBMISSION" && item.daysLeft < 0 ? "text-rose-200" : "text-slate-200"
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.detail}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-mono block ${
                          item.type !== "SUBMISSION" && item.daysLeft < 0 
                            ? "bg-rose-950/80 text-rose-300 border border-rose-800 font-bold" 
                            : "bg-slate-900 text-slate-300 border border-slate-800"
                        }`}>
                          {item.badgeLabel}
                        </span>
                        <span className="text-[8px] text-indigo-400 font-medium hover:underline mt-1 block">
                          {item.type === "SUBMISSION" ? "Nilai Sekarang →" : "Buka Tugas →"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with summary and close button */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>Menampilkan {filteredModalItems.length} dari {pendingItems.length} agenda</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDeadlineTooltip(false);
                    setSearchTerm("");
                    setActiveFilter("ALL");
                    setSelectedClass("ALL");
                    setSelectedPriority("ALL");
                    changeTab("tugas");
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg transition text-xs shadow-md shadow-indigo-600/20"
                >
                  Lihat semua tugas
                </button>
                <button
                  onClick={() => {
                    setShowDeadlineTooltip(false);
                    setSearchTerm("");
                    setActiveFilter("ALL");
                    setSelectedClass("ALL");
                    setSelectedPriority("ALL");
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 font-semibold rounded-lg transition text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
