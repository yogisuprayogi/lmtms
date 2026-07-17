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
  X
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentTab,
  setCurrentTab,
  onLogout,
  setSelectedDoc,
  isOpen = false,
  onClose
}) => {
  const [identitas, setIdentitas] = React.useState({
    nama: "SMAN 1 Informatika",
    logo: ""
  });

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
      <div>
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

          <button
            onClick={() => changeTab("tugas")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === "tugas"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            id="nav-link-tugas"
          >
            <FileCheck className="h-4 w-4" />
            <span>Tugas & Kuis</span>
          </button>

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
    </>
  );
};
