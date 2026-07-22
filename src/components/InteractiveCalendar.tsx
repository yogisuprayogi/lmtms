import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  CalendarDays,
  Tag,
  X,
  RefreshCw,
  Info
} from "lucide-react";
import { User } from "../types";

export interface CalendarEvent {
  id: string;
  tanggal: string; // YYYY-MM-DD
  judul: string;
  jenis: "AKADEMIK" | "LIBUR" | "UJIAN";
}

interface InteractiveCalendarProps {
  user: User;
  calendarEvents: CalendarEvent[];
  onAddEvent: (evt: { tanggal: string; judul: string; jenis: "AKADEMIK" | "LIBUR" | "UJIAN" }) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onReload: () => void;
  triggerNotification: (type: "success" | "error", msg: string) => void;
}

// Preset events for Indonesian School Academic Year 2026/2027
const NATIONAL_PRESET_EVENTS: Omit<CalendarEvent, "id">[] = [
  { tanggal: "2026-07-20", judul: "Awal Semester Ganjil & MPLS", jenis: "AKADEMIK" },
  { tanggal: "2026-08-17", judul: "HUT Kemerdekaan RI Ke-81 (Libur Nasional)", jenis: "LIBUR" },
  { tanggal: "2026-08-25", judul: "Maulid Nabi Muhammad SAW (Libur Nasional)", jenis: "LIBUR" },
  { tanggal: "2026-09-21", judul: "Penilaian Tengah Semester (PTS) Ganjil - Hari 1", jenis: "UJIAN" },
  { tanggal: "2026-09-22", judul: "Penilaian Tengah Semester (PTS) Ganjil - Hari 2", jenis: "UJIAN" },
  { tanggal: "2026-09-23", judul: "Penilaian Tengah Semester (PTS) Ganjil - Hari 3", jenis: "UJIAN" },
  { tanggal: "2026-09-24", judul: "Penilaian Tengah Semester (PTS) Ganjil - Hari 4", jenis: "UJIAN" },
  { tanggal: "2026-09-25", judul: "Penilaian Tengah Semester (PTS) Ganjil - Hari 5", jenis: "UJIAN" },
  { tanggal: "2026-11-25", judul: "Hari Guru Nasional", jenis: "AKADEMIK" },
  { tanggal: "2026-12-07", judul: "Penilaian Akhir Semester (PAS) Ganjil - Hari 1", jenis: "UJIAN" },
  { tanggal: "2026-12-08", judul: "Penilaian Akhir Semester (PAS) Ganjil - Hari 2", jenis: "UJIAN" },
  { tanggal: "2026-12-09", judul: "Penilaian Akhir Semester (PAS) Ganjil - Hari 3", jenis: "UJIAN" },
  { tanggal: "2026-12-10", judul: "Penilaian Akhir Semester (PAS) Ganjil - Hari 4", jenis: "UJIAN" },
  { tanggal: "2026-12-11", judul: "Penilaian Akhir Semester (PAS) Ganjil - Hari 5", jenis: "UJIAN" },
  { tanggal: "2026-12-18", judul: "Pembagian Rapor Semester Ganjil", jenis: "AKADEMIK" },
  { tanggal: "2026-12-21", judul: "Libur Semester Ganjil Hari 1", jenis: "LIBUR" },
  { tanggal: "2026-12-22", judul: "Libur Semester Ganjil Hari 2", jenis: "LIBUR" },
  { tanggal: "2026-12-23", judul: "Libur Semester Ganjil Hari 3", jenis: "LIBUR" },
  { tanggal: "2026-12-24", judul: "Cuti Bersama Natal", jenis: "LIBUR" },
  { tanggal: "2026-12-25", judul: "Hari Raya Natal (Libur Nasional)", jenis: "LIBUR" },
  { tanggal: "2026-12-28", judul: "Libur Semester Ganjil Hari 4", jenis: "LIBUR" },
  { tanggal: "2026-12-29", judul: "Libur Semester Ganjil Hari 5", jenis: "LIBUR" },
  { tanggal: "2026-12-30", judul: "Libur Semester Ganjil Hari 6", jenis: "LIBUR" },
  { tanggal: "2026-12-31", judul: "Libur Akhir Tahun 2026", jenis: "LIBUR" },
  { tanggal: "2027-01-01", judul: "Tahun Baru 2027 Masehi (Libur Nasional)", jenis: "LIBUR" },
  { tanggal: "2027-01-04", judul: "Awal Semester Genap 2026/2027", jenis: "AKADEMIK" }
];

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ming"];

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  user,
  calendarEvents,
  onAddEvent,
  onDeleteEvent,
  onReload,
  triggerNotification
}) => {
  // Calendar Navigation State
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // 0 = Jan, 6 = Juli

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-21");

  // Form input state
  const [formJudul, setFormJudul] = useState("");
  const [formJenis, setFormJenis] = useState<"AKADEMIK" | "LIBUR" | "UJIAN">("LIBUR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LMS Auto-Scheduler Modal State
  const [showLmsModal, setShowLmsModal] = useState(false);
  const [targetKelas, setTargetKelas] = useState("X-1");
  const [kbmDays, setKbmDays] = useState<{ [key: number]: boolean }>({
    1: true, // Senin
    3: true  // Rabu
  });
  const [kbmStartDate, setKbmStartDate] = useState("2026-07-20");
  const [autoScheduleResults, setAutoScheduleResults] = useState<any[]>([]);

  // Sync state when selected date changes
  useEffect(() => {
    setFormJudul("");
  }, [selectedDate]);

  // Navigate Month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear() < 2026 ? 2026 : today.getFullYear());
    setCurrentMonth(today.getMonth());
    const dateStr = today.toISOString().substring(0, 10);
    setSelectedDate(dateStr);
  };

  // Helper to generate calendar days for the current month view
  const getCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Calculate day offset for Monday as start of week (0 = Senin, 6 = Minggu)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1; // JS 0 = Minggu
    if (startDayOfWeek < 0) startDayOfWeek = 6; // Sunday becomes 6

    const totalDays = lastDayOfMonth.getDate();

    const days = [];

    // Empty padding cells before month start
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ dayNum: null, dateStr: "", isCurrentMonth: false });
    }

    // Month days
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true
      });
    }

    return days;
  };

  const daysGrid = getCalendarDays();

  // Helper to get events for a date string
  const getEventsForDate = (dateStr: string) => {
    return calendarEvents.filter((evt) => evt.tanggal === dateStr);
  };

  // Helper stats for active month
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const eventsInMonth = calendarEvents.filter((evt) => evt.tanggal.startsWith(monthPrefix));
  const holidayCount = eventsInMonth.filter((e) => e.jenis === "LIBUR").length;
  const examCount = eventsInMonth.filter((e) => e.jenis === "UJIAN").length;
  const academicCount = eventsInMonth.filter((e) => e.jenis === "AKADEMIK").length;

  // Add event handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddEvent({
        tanggal: selectedDate,
        judul: formJudul.trim(),
        jenis: formJenis
      });
      setFormJudul("");
      triggerNotification("success", `Agenda "${formJudul}" berhasil ditambahkan ke kalender!`);
    } catch (err) {
      triggerNotification("error", "Gagal menyimpan agenda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset Importer Handler
  const handleImportPresets = async () => {
    if (!window.confirm("Impor 26+ agenda resmi kalender nasional 2026/2027 (HUT RI, Maulid, PTS, PAS, Libur Semester)?")) return;
    setIsSubmitting(true);
    let successCount = 0;
    for (const preset of NATIONAL_PRESET_EVENTS) {
      // Avoid duplicate
      const exists = calendarEvents.some(
        (e) => e.tanggal === preset.tanggal && e.judul === preset.judul
      );
      if (!exists) {
        await onAddEvent(preset);
        successCount++;
      }
    }
    setIsSubmitting(false);
    onReload();
    triggerNotification("success", `Berhasil mengimpor ${successCount} agenda nasional ke kalender!`);
  };

  // LMS Auto-Scheduler Calculation Engine
  const calculateLmsSchedule = () => {
    // Read LMS modules from localStorage
    let modulList: any[] = [];
    const saved = localStorage.getItem("lms_modul_list");
    if (saved) {
      try { modulList = JSON.parse(saved); } catch (e) { console.error(e); }
    }

    if (!modulList || modulList.length === 0) {
      modulList = [
        { id: "mod-1", judul: "Modul 1: Abstraksi dan Logika Algoritma (BK)", elemen: "BK", alokasi: "4 JP" },
        { id: "mod-2", judul: "Modul 2: Percabangan & Perulangan Python (AP)", elemen: "AP", alokasi: "8 JP" },
        { id: "mod-3", judul: "Modul 3: Integrasi Konten Aplikasi Office (TIK)", elemen: "TIK", alokasi: "6 JP" },
        { id: "mod-4", judul: "Modul 4: Arsitektur Komputer & OS (SK)", elemen: "SK", alokasi: "6 JP" },
        { id: "mod-5", judul: "Modul 5: Jaringan Komputer & Topologi (JKI)", elemen: "JKI", alokasi: "8 JP" },
        { id: "mod-6", judul: "Modul 6: Analisis Data & Visualisasi Pandas (AD)", elemen: "AD", alokasi: "10 JP" }
      ];
    }

    const activeDaysList = Object.keys(kbmDays)
      .map(Number)
      .filter((dayNum) => kbmDays[dayNum]);

    if (activeDaysList.length === 0) {
      triggerNotification("error", "Pilih minimal 1 hari KBM mingguan.");
      return;
    }

    const results: any[] = [];
    let currDate = new Date(kbmStartDate);
    let moduleIndex = 0;
    let safetyCounter = 0;

    while (moduleIndex < modulList.length && safetyCounter < 180) {
      safetyCounter++;
      const dateStr = currDate.toISOString().substring(0, 10);
      let dayOfWeek = currDate.getDay(); // 0 = Sun, 1 = Mon ...
      if (dayOfWeek === 0) dayOfWeek = 7; // Normalize Sunday as 7

      const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;
      const isTargetKbmDay = activeDaysList.includes(dayOfWeek);

      // Check if this date is in calendar events
      const events = getEventsForDate(dateStr);
      const isHoliday = events.some((e) => e.jenis === "LIBUR");
      const isExam = events.some((e) => e.jenis === "UJIAN");

      if (isTargetKbmDay) {
        if (isHoliday) {
          const holidayTitle = events.find((e) => e.jenis === "LIBUR")?.judul || "Libur Sekolah";
          results.push({
            type: "SKIPPED",
            dateStr,
            dayName: NAMA_HARI[dayOfWeek - 1],
            reason: `Dilewati: ${holidayTitle} (LIBUR)`,
            modulJudul: modulList[moduleIndex].judul
          });
        } else if (isExam) {
          const examTitle = events.find((e) => e.jenis === "UJIAN")?.judul || "Ujian Sekolah";
          results.push({
            type: "SKIPPED",
            dateStr,
            dayName: NAMA_HARI[dayOfWeek - 1],
            reason: `Dilewati: ${examTitle} (UJIAN)`,
            modulJudul: modulList[moduleIndex].judul
          });
        } else {
          // Valid KBM Day!
          const targetModul = modulList[moduleIndex];
          results.push({
            type: "SCHEDULED",
            dateStr,
            dayName: NAMA_HARI[dayOfWeek - 1],
            modulId: targetModul.id,
            modulJudul: targetModul.judul,
            elemen: targetModul.elemen,
            pertemuanNum: moduleIndex + 1,
            reason: "✅ Hari KBM Efektif"
          });
          moduleIndex++;
        }
      }

      // Increment 1 day
      currDate.setDate(currDate.getDate() + 1);
    }

    setAutoScheduleResults(results);
  };

  // Execute Auto Schedule to LocalStorage
  const handleApplyLmsSchedule = () => {
    if (autoScheduleResults.length === 0) return;

    let modulList: any[] = [];
    const saved = localStorage.getItem("lms_modul_list");
    if (saved) {
      try { modulList = JSON.parse(saved); } catch (e) { console.error(e); }
    }

    const scheduledItems = autoScheduleResults.filter((r) => r.type === "SCHEDULED");

    const updatedModulList = modulList.map((mod) => {
      const sch = scheduledItems.find((s) => s.modulId === mod.id || s.modulJudul === mod.judul);
      if (sch) {
        return {
          ...mod,
          tanggalPertemuan: sch.dateStr,
          keteranganJadwal: `Pertemuan ${sch.pertemuanNum} - ${sch.dayName}, ${sch.dateStr}`
        };
      }
      return mod;
    });

    localStorage.setItem("lms_modul_list", JSON.stringify(updatedModulList));

    // Dispatch custom event to notify LMSView if mounted
    window.dispatchEvent(new CustomEvent("lms_schedule_updated", { detail: updatedModulList }));

    triggerNotification("success", `Penjadwalan otomatis ${scheduledItems.length} modul LMS berhasil diterapkan!`);
    setShowLmsModal(false);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateObj = new Date(selectedDate);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-6" id="interactive-calendar-view">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-slate-800">Kalender Akademik & Pemetaan KBM</h2>
              <p className="text-xs text-slate-500">
                Peta hari libur nasional, jadwal ujian, dan sinkronisasi otomatis penjadwalan materi LMS.
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleImportPresets}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-200"
              title="Impor agenda kalender resmi sekolah 2026/2027"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Impor Hari Libur & Ujian Nasional</span>
            </button>

            <button
              onClick={() => {
                setShowLmsModal(true);
                calculateLmsSchedule();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm shadow-indigo-200 active:scale-95"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              <span>Otomatisasi Penjadwalan LMS</span>
            </button>
          </div>
        </div>

        {/* Legend & Stats Counter */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
              Agenda KBM ({NAMA_BULAN[currentMonth]})
            </span>
            <span className="font-bold text-blue-700 font-mono text-sm">{academicCount}</span>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-rose-700 font-semibold flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              Libur Sekolah
            </span>
            <span className="font-bold text-rose-700 font-mono text-sm">{holidayCount}</span>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-amber-700 font-semibold flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              Hari Ujian (PTS/PAS)
            </span>
            <span className="font-bold text-amber-700 font-mono text-sm">{examCount}</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex items-center justify-between">
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Tersinkron LMS
            </span>
            <span className="font-bold text-emerald-700 font-mono text-xs">AKTIF</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Grid (Left 8 cols) + Date Detail Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MONTHLY CALENDAR GRID (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-slate-800 text-lg">
                {NAMA_BULAN[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={jumpToToday}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition"
              >
                Hari Ini
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-1 border-b border-slate-100">
            {NAMA_HARI.map((day, idx) => (
              <div key={day} className={`py-1 ${idx >= 5 ? "text-rose-500" : ""}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Cell Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysGrid.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[78px] bg-slate-50/40 border border-transparent rounded-xl p-1.5 opacity-30 select-none pointer-events-none"
                  />
                );
              }

              const events = getEventsForDate(item.dateStr);
              const isSelected = item.dateStr === selectedDate;
              const dayOfWeek = (idx % 7); // 0 = Sen, 5 = Sab, 6 = Min
              const isWeekend = dayOfWeek >= 5;

              const hasHoliday = events.some((e) => e.jenis === "LIBUR");
              const hasExam = events.some((e) => e.jenis === "UJIAN");
              const hasAcademic = events.some((e) => e.jenis === "AKADEMIK");

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`min-h-[82px] border rounded-2xl p-1.5 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50/30 shadow-sm"
                      : hasHoliday
                      ? "bg-rose-50/40 border-rose-200 hover:border-rose-400"
                      : hasExam
                      ? "bg-amber-50/40 border-amber-200 hover:border-amber-400"
                      : isWeekend
                      ? "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                      : "bg-white border-slate-200 hover:bg-slate-50/60 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-lg ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : hasHoliday || dayOfWeek === 6
                          ? "text-rose-600 bg-rose-100/60"
                          : "text-slate-700"
                      }`}
                    >
                      {item.dayNum}
                    </span>

                    {events.length > 0 && (
                      <span className="text-[9px] font-bold text-slate-400">
                        {events.length} evt
                      </span>
                    )}
                  </div>

                  {/* Badges preview inside cell */}
                  <div className="space-y-1 overflow-hidden mt-1">
                    {events.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate leading-tight ${
                          evt.jenis === "LIBUR"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : evt.jenis === "UJIAN"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                        title={evt.judul}
                      >
                        {evt.judul}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[8px] text-slate-400 font-bold px-1">
                        +{events.length - 2} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SELECTED DATE DETAIL & ADD EVENT FORM (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Detail Tanggal
                </span>
                <h3 className="font-display font-bold text-slate-800 text-sm capitalize mt-1">
                  {formattedSelectedDate}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                {selectedDate}
              </span>
            </div>

            {/* List Agenda on Selected Date */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Agenda Terdaftar ({selectedDateEvents.length})
              </span>

              {selectedDateEvents.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  Tidak ada agenda sekolah pada tanggal ini (Hari KBM Biasa).
                </div>
              ) : (
                selectedDateEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          evt.jenis === "LIBUR"
                            ? "bg-rose-100 text-rose-800"
                            : evt.jenis === "UJIAN"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {evt.jenis}
                      </span>
                      <p className="font-bold text-slate-800 text-xs leading-snug">{evt.judul}</p>
                    </div>

                    {(user.role === "ADMIN" || user.role === "GURU") && (
                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition shrink-0"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Form Add Event on Selected Date */}
            {(user.role === "ADMIN" || user.role === "GURU") && (
              <form onSubmit={handleFormSubmit} className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Tambah Agenda Pada {selectedDate}</span>
                </span>

                <div>
                  <input
                    type="text"
                    required
                    value={formJudul}
                    onChange={(e) => setFormJudul(e.target.value)}
                    placeholder="Contoh: Libur Kebudayaan / PTS Matematika"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <select
                    value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-bold text-slate-700"
                  >
                    <option value="LIBUR">🔴 LIBUR SEKOLAH (Dilewati LMS)</option>
                    <option value="UJIAN">🟠 UJIAN (PTS / PAS / Dilewati LMS)</option>
                    <option value="AKADEMIK">🔵 KEGIATAN KBM / AKADEMIK</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Simpan Agenda Ke Kalender</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* MODAL OTOMATISASI PENJADWALAN LMS */}
      {showLmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                  <Zap className="h-5 w-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    Otomatisasi Penjadwalan Modul Pembelajaran LMS
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sistem akan memetakan target tanggal KBM untuk tiap Modul LMS berdasarkan hari efektif (skipping Hari Libur & Ujian).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLmsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Configuration Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Target Kelas</label>
                <select
                  value={targetKelas}
                  onChange={(e) => setTargetKelas(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs bg-white font-bold"
                >
                  <option value="X-1">Kelas X-1 (Informatika)</option>
                  <option value="X-2">Kelas X-2 (Informatika)</option>
                  <option value="XI-1">Kelas XI-1 (Informatika Lanjutan)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tanggal Mulai KBM</label>
                <input
                  type="date"
                  value={kbmStartDate}
                  onChange={(e) => {
                    setKbmStartDate(e.target.value);
                  }}
                  className="w-full border border-slate-200 rounded-xl p-2 text-xs bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1.5">Hari KBM Mingguan</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 1, label: "Sen" },
                    { id: 2, label: "Sel" },
                    { id: 3, label: "Rab" },
                    { id: 4, label: "Kam" },
                    { id: 5, label: "Jum" }
                  ].map((h) => (
                    <label key={h.id} className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!kbmDays[h.id]}
                        onChange={(e) => setKbmDays({ ...kbmDays, [h.id]: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-700">{h.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>Simulasi Penjadwalan Materi LMS ({autoScheduleResults.length} Sesi Terkalkulasi)</span>
              </span>

              <button
                type="button"
                onClick={calculateLmsSchedule}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Hitung Ulang</span>
              </button>
            </div>

            {/* Results Table Preview */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-2.5">Sesi / Tanggal</th>
                    <th className="p-2.5">Hari</th>
                    <th className="p-2.5">Target Modul LMS</th>
                    <th className="p-2.5">Status Kalender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {autoScheduleResults.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">
                        Klik 'Hitung Ulang' untuk melihat simulasi penjadwalan.
                      </td>
                    </tr>
                  ) : (
                    autoScheduleResults.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          item.type === "SKIPPED"
                            ? "bg-rose-50/50 text-rose-800"
                            : "bg-white hover:bg-slate-50/70"
                        }
                      >
                        <td className="p-2.5 font-mono font-bold text-slate-800">
                          {item.dateStr}
                        </td>
                        <td className="p-2.5 font-bold">{item.dayName}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.modulJudul}</td>
                        <td className="p-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.type === "SKIPPED"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {item.reason}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLmsModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyLmsSchedule}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-100 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Terapkan Penjadwalan ke LMS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
