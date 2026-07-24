import React, { useState } from "react";
import { Clock, Bell, Sun, Moon, Palette, Wifi, WifiOff, Menu, CheckCircle, Trash2, ShieldAlert, Calendar, ChevronDown } from "lucide-react";
import { User, TahunPelajaran } from "../types";

interface HeaderProps {
  user: User;
  activeYear: TahunPelajaran | null;
  years?: TahunPelajaran[];
  onSelectYear?: (yearId: string) => void;
  notifications: any[];
  onClearNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTheme: string;
  onChangeTheme: (themeName: string) => void;
  isOnline: boolean;
  onToggleOnlineSimulated: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeYear,
  years = [],
  onSelectYear,
  notifications,
  onClearNotification,
  onClearAllNotifications,
  isDarkMode,
  onToggleDarkMode,
  activeTheme,
  onChangeTheme,
  isOnline,
  onToggleOnlineSimulated,
  onOpenMobileSidebar,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const themeList = [
    { id: "classic", name: "Classic Indigo", color: "bg-indigo-600" },
    { id: "emerald", name: "Emerald Oasis", color: "bg-emerald-600" },
    { id: "amethyst", name: "Amethyst Crown", color: "bg-violet-600" },
    { id: "sunset", name: "Sunset Flare", color: "bg-pink-600" },
    { id: "amber", name: "Amber Glow", color: "bg-amber-600" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 no-print relative z-30" id="app-top-header">
      
      {/* Left side: Hamburger & Academic Year */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
            id="mobile-hamburger-btn"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Tahun Pelajaran:</span>
          </span>
          {(user.role === "GURU" || user.role === "ADMIN") && years && years.length > 0 ? (
            <div className="relative inline-flex items-center">
              <select
                value={activeYear?.id || ""}
                onChange={(e) => onSelectYear && onSelectYear(e.target.value)}
                className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs transition"
                title="Klik untuk memilih Tahun Pelajaran yang diakses"
                id="header-academic-year-select"
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans font-medium">
                    {y.tahun} ({y.semester}) {y.id === activeYear?.id ? "• [Aktif]" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 absolute right-2 pointer-events-none" />
            </div>
          ) : (
            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-theme-primary dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900 px-2.5 py-1 rounded-md font-semibold text-[11px] sm:text-xs font-mono" id="active-academic-year-badge">
              {activeYear ? `${activeYear.tahun} (${activeYear.semester})` : "Memuat..."}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Actions, Offline, Theme, Notifications */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Offline Status Indicator with simulator switch */}
        <button
          onClick={onToggleOnlineSimulated}
          title={isOnline ? "Aplikasi Terhubung. Klik untuk simulasikan offline." : "Aplikasi Offline. Klik untuk hubungkan kembali."}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all tracking-wider ${
            isOnline
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 hover:bg-emerald-100"
              : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/50 hover:bg-rose-100 animate-pulse"
          }`}
          id="offline-sim-toggle"
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              <span className="hidden xs:inline">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span className="hidden xs:inline">OFFLINE MODE</span>
            </>
          )}
        </button>

        {/* Theme customization palette */}
        <div className="relative">
          <button
            onClick={() => { setShowThemeDropdown(!showThemeDropdown); setShowNotifDropdown(false); }}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Ubah Warna Tema & Tampilan"
          >
            <Palette className="h-4.5 w-4.5" />
          </button>

          {showThemeDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilih Aksen</span>
                <button
                  onClick={onToggleDarkMode}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  title="Toggle Gelap/Terang"
                >
                  {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-600" />}
                </button>
              </div>

              <div className="space-y-1">
                {themeList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { onChangeTheme(t.id); setShowThemeDropdown(false); }}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeTheme === t.id
                        ? "bg-slate-100 dark:bg-slate-700 text-theme-primary font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${t.color}`}></span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification center */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowThemeDropdown(false); }}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            title="Notifikasi LMTMS"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-rose-600 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1">
                  <Bell className="h-4 w-4 text-theme-primary" /> Notifikasi ({unreadCount} baru)
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => { onClearAllNotifications(); setShowNotifDropdown(false); }}
                    className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Bersihkan
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700 overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition flex gap-2 items-start ${
                        !n.read ? "bg-indigo-50/20 dark:bg-slate-700/40" : "hover:bg-slate-50 dark:hover:bg-slate-700/20"
                      }`}
                    >
                      {n.type === "alert" ? (
                        <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-0.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{n.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">{n.time}</span>
                      </div>
                      <button
                        onClick={() => onClearNotification(n.id)}
                        className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    Tidak ada notifikasi aktif saat ini.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Student Class Info or Server Indicator */}
        <div className="hidden xs:flex items-center gap-4">
          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5" id="server-session-indicator">
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sesi Server: Aktif (2026)</span>
          </div>
          {user.role === "SISWA" && (
            <span className="bg-blue-50 dark:bg-indigo-950/40 text-theme-primary border border-blue-150 dark:border-indigo-900 font-bold px-3 py-1 rounded-md text-xs" id="student-class-badge">
              Kelas: {user.kelas}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
