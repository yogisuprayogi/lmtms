import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  GraduationCap,
  Layers,
  Clock,
  Map,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Search,
  BookOpen,
  School,
  Settings
} from "lucide-react";
import { User, TahunPelajaran } from "../types";

interface Rombel {
  id: string;
  nama: string;
  tingkat: string;
  waliKelasId: string;
}

interface Jadwal {
  id: string;
  hari: string;
  jam: string;
  kelas: string;
  mapel: string;
  guruId: string;
}

interface CalendarEvent {
  id: string;
  tanggal: string;
  judul: string;
  jenis: "AKADEMIK" | "LIBUR" | "UJIAN";
}

interface GuruMapping {
  id: string;
  guruId: string;
  kelas: string;
  elemen: string;
}

interface AcademicManagementViewProps {
  user: User;
}

type SubTab = "tahun" | "kalender" | "guru" | "siswa" | "rombel" | "jadwal" | "mapping" | "identitas";

export const AcademicManagementView: React.FC<AcademicManagementViewProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("tahun");
  const [identitasForm, setIdentitasForm] = useState({
    nama: "SMAN 1 Informatika",
    npsn: "20103241",
    alamat: "Jl. Core IT No. 102, Silicon Valley",
    kepalaSekolah: "Yogi Suprayogi, S.Kom.",
    logo: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Raw data from APIs
  const [years, setYears] = useState<TahunPelajaran[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [rombels, setRombels] = useState<Rombel[]>([]);
  const [jadwals, setJadwals] = useState<Jadwal[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [mappings, setMappings] = useState<GuruMapping[]>([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [tpForm, setTpForm] = useState({ tahun: "", semester: "GANJIL" as "GANJIL" | "GENAP" });
  const [calForm, setCalForm] = useState({ tanggal: "", judul: "", jenis: "AKADEMIK" as "AKADEMIK" | "LIBUR" | "UJIAN" });
  const [userForm, setUserForm] = useState({
    id: "",
    username: "",
    nama: "",
    email: "",
    role: "SISWA" as "SISWA" | "GURU",
    nip: "",
    nisn: "",
    kelas: "X-1",
    password: ""
  });
  const [romForm, setRomForm] = useState({ id: "", nama: "", tingkat: "X", waliKelasId: "" });
  const [jadForm, setJadForm] = useState({ id: "", hari: "Senin", jam: "", kelas: "X-1", mapel: "", guruId: "" });
  const [mapForm, setMapForm] = useState({ id: "", guruId: "", kelas: "X-1", elemen: "BK" });

  const [isEditing, setIsEditing] = useState(false);

  // Load all academic data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const headers = { "x-user-role": user.role };
      
      const [resYears, resUsers, resRombels, resJadwals, resCalendar, resMappings, resIdentitas] = await Promise.all([
        fetch("/api/tahun-pelajaran", { headers }),
        fetch("/api/users", { headers }),
        fetch("/api/academic/rombels", { headers }),
        fetch("/api/academic/jadwals", { headers }),
        fetch("/api/academic/calendar", { headers }),
        fetch("/api/academic/mappings", { headers }),
        fetch("/api/academic/identitas", { headers })
      ]);

      if (resYears.ok) setYears(await resYears.json());
      if (resUsers.ok) setUsersList(await resUsers.json());
      if (resRombels.ok) setRombels(await resRombels.json());
      if (resJadwals.ok) setJadwals(await resJadwals.json());
      if (resCalendar.ok) setCalendarEvents(await resCalendar.json());
      if (resMappings.ok) setMappings(await resMappings.json());
      if (resIdentitas.ok) {
        const idData = await resIdentitas.json();
        if (idData.success && idData.identitas) {
          setIdentitasForm(idData.identitas);
        }
      }

    } catch (err) {
      console.error("Gagal memuat data akademik:", err);
      setErrorMsg("Gagal memuat data akademik dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerNotification = (type: "success" | "error", msg: string) => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  // ==========================================
  // HANDLERS FOR YEARS (TAHUN & SEMESTER)
  // ==========================================
  const handleCreateTp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpForm.tahun) return;
    try {
      const res = await fetch("/api/tahun-pelajaran", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(tpForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Tahun pelajaran ${tpForm.tahun} (${tpForm.semester}) berhasil ditambahkan!`);
        setTpForm({ tahun: "", semester: "GANJIL" });
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menambahkan tahun pelajaran.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi jaringan gagal.");
    }
  };

  const handleActivateTp = async (id: string) => {
    try {
      const res = await fetch("/api/tahun-pelajaran/aktifkan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", "Tahun pelajaran aktif berhasil diperbarui!");
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal mengaktifkan tahun pelajaran.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi jaringan gagal.");
    }
  };

  // ==========================================
  // HANDLERS FOR IDENTITAS SEKOLAH
  // ==========================================
  const handleSaveIdentitas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/academic/identitas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify(identitasForm)
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { success: false, message: `Error server (${res.status}): Format data respons tidak valid.` };
      }

      if (res.ok && data.success) {
        triggerNotification("success", "Identitas Sekolah berhasil disimpan!");
        setIdentitasForm(data.identitas);
        
        // Also trigger a custom event so that the global app state or sidebar can reactively update
        window.dispatchEvent(new CustomEvent("identitas_updated", { detail: data.identitas }));
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan identitas sekolah.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi jaringan gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerNotification("error", "Ukuran berkas logo terlalu besar. Maksimum 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setIdentitasForm({ ...identitasForm, logo: event.target.result as string });
        triggerNotification("success", "Pratinjau logo berhasil dimuat! Silakan klik 'Simpan Perubahan' di bawah untuk memperbarui.");
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // HANDLERS FOR CALENDAR
  // ==========================================
  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/academic/calendar/${calForm.judul}` : "/api/academic/calendar"; // Simplified mock or ID
      const method = "POST"; // We can do POST for creation and re-load
      const res = await fetch("/api/academic/calendar", {
        method,
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(calForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Agenda kalender berhasil disimpan!`);
        setCalForm({ tanggal: "", judul: "", jenis: "AKADEMIK" });
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan agenda kalender.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteCalendar = async (id: string) => {
    if (!window.confirm("Hapus agenda kalender ini?")) return;
    try {
      const res = await fetch(`/api/academic/calendar/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role }
      });
      if (res.ok) {
        triggerNotification("success", "Agenda kalender berhasil dihapus.");
        loadAllData();
      }
    } catch (err) {
      triggerNotification("error", "Gagal menghapus.");
    }
  };

  // ==========================================
  // HANDLERS FOR USERS (GURU / SISWA)
  // ==========================================
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !userForm.id;
      const url = isNew ? "/api/academic/users" : `/api/academic/users/${userForm.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Data ${userForm.role} berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`);
        resetUserForm();
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan pengguna.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  const resetUserForm = () => {
    setUserForm({
      id: "",
      username: "",
      nama: "",
      email: "",
      role: activeSubTab === "guru" ? "GURU" : "SISWA",
      nip: "",
      nisn: "",
      kelas: "X-1",
      password: ""
    });
    setIsEditing(false);
  };

  const handleEditUser = (u: User) => {
    setUserForm({
      id: u.id,
      username: u.username,
      nama: u.nama,
      email: u.email,
      role: u.role as "SISWA" | "GURU",
      nip: u.nip || "",
      nisn: u.nisn || "",
      kelas: u.kelas || "X-1",
      password: u.password || ""
    });
    setIsEditing(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini permanen.")) return;
    try {
      const res = await fetch(`/api/academic/users/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", "Pengguna berhasil dihapus.");
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menghapus pengguna.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  // ==========================================
  // HANDLERS FOR ROMBEL (CLASSES)
  // ==========================================
  const handleSaveRombel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !romForm.id;
      const url = isNew ? "/api/academic/rombels" : `/api/academic/rombels/${romForm.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(romForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Rombel ${romForm.nama} berhasil ${isNew ? "dibuat" : "diperbarui"}!`);
        setRomForm({ id: "", nama: "", tingkat: "X", waliKelasId: "" });
        setIsEditing(false);
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan Rombel.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteRombel = async (id: string) => {
    if (!window.confirm("Hapus Rombel ini?")) return;
    try {
      const res = await fetch(`/api/academic/rombels/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role }
      });
      if (res.ok) {
        triggerNotification("success", "Rombel berhasil dihapus.");
        loadAllData();
      }
    } catch (err) {
      triggerNotification("error", "Gagal menghapus Rombel.");
    }
  };

  // ==========================================
  // HANDLERS FOR JADWAL (SCHEDULES)
  // ==========================================
  const handleSaveJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !jadForm.id;
      const url = isNew ? "/api/academic/jadwals" : `/api/academic/jadwals/${jadForm.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(jadForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Jadwal berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`);
        setJadForm({ id: "", hari: "Senin", jam: "", kelas: "X-1", mapel: "", guruId: "" });
        setIsEditing(false);
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan jadwal.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteJadwal = async (id: string) => {
    if (!window.confirm("Hapus jadwal pelajaran ini?")) return;
    try {
      const res = await fetch(`/api/academic/jadwals/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role }
      });
      if (res.ok) {
        triggerNotification("success", "Jadwal berhasil dihapus.");
        loadAllData();
      }
    } catch (err) {
      triggerNotification("error", "Gagal menghapus jadwal.");
    }
  };

  // ==========================================
  // HANDLERS FOR MAPPING GURU
  // ==========================================
  const handleSaveMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !mapForm.id;
      const url = isNew ? "/api/academic/mappings" : `/api/academic/mappings/${mapForm.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-user-role": user.role },
        body: JSON.stringify(mapForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", `Pemetaan guru pengajar berhasil ${isNew ? "disimpan" : "diperbarui"}!`);
        setMapForm({ id: "", guruId: "", kelas: "X-1", elemen: "BK" });
        setIsEditing(false);
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal menyimpan pemetaan guru.");
      }
    } catch (err) {
      triggerNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteMapping = async (id: string) => {
    if (!window.confirm("Hapus pemetaan guru ini?")) return;
    try {
      const res = await fetch(`/api/academic/mappings/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role }
      });
      if (res.ok) {
        triggerNotification("success", "Pemetaan guru berhasil dihapus.");
        loadAllData();
      }
    } catch (err) {
      triggerNotification("error", "Gagal menghapus pemetaan.");
    }
  };

  // Helper arrays of users
  const teachersOnly = usersList.filter((u) => u.role === "GURU");
  const studentsOnly = usersList.filter((u) => u.role === "SISWA");

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto" id="academic-management-root">
      {/* Jumbotron Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight">Manajemen Akademik Sekolah</h2>
              <p className="text-indigo-200/80 text-xs mt-1 max-w-2xl leading-relaxed">
                Kelola infrastruktur akademik sekolah secara terpusat: Tahun Pelajaran, Semester, Kalender, Guru, Siswa, Rombongan Belajar (Rombel), Jadwal Pelajaran, dan Pemetaan Tugas Guru.
              </p>
            </div>
          </div>
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition flex items-center gap-2 border border-white/10"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-sm rounded-xl flex items-center gap-2 shadow-sm animate-fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Horizontal SubTabs Navigation */}
      <div className="bg-white p-2 border border-slate-200 rounded-2xl shadow-sm flex flex-wrap gap-1">
        {[
          { id: "tahun", label: "Tahun & Semester", icon: Calendar },
          { id: "kalender", label: "Kalender Akademik", icon: Calendar },
          { id: "guru", label: "Daftar Guru", icon: Users },
          { id: "siswa", label: "Daftar Siswa", icon: GraduationCap },
          { id: "rombel", label: "Rombel (Kelas)", icon: Layers },
          { id: "jadwal", label: "Jadwal Pelajaran", icon: Clock },
          { id: "mapping", label: "Mapping Guru", icon: Map },
          { id: "identitas", label: "Identitas Sekolah", icon: School }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as SubTab);
                setSearchTerm("");
                setIsEditing(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB DETAILS */}

      {/* 1. TAHUN & SEMESTER */}
      {activeSubTab === "tahun" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-tahun">
          {/* Admin Input Form */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Plus className="h-4 w-4 text-indigo-600" />
                <span>Tambah Tahun Pelajaran</span>
              </h3>
              <form onSubmit={handleCreateTp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Pelajaran (YYYY/YYYY)</label>
                  <input
                    type="text"
                    required
                    value={tpForm.tahun}
                    onChange={(e) => setTpForm({ ...tpForm, tahun: e.target.value })}
                    placeholder="Contoh: 2026/2027"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Semester Aktif</label>
                  <select
                    value={tpForm.semester}
                    onChange={(e) => setTpForm({ ...tpForm, semester: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-bold text-slate-700"
                  >
                    <option value="GANJIL">GANJIL</option>
                    <option value="GENAP">GENAP</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambahkan Tahun</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Akses Terbatas</p>
              Hanya Administrator sekolah yang memiliki otorisasi penuh untuk menambah, mengedit, atau mengaktifkan Tahun Pelajaran dan Semester baru di sistem LMTMS.
            </div>
          )}

          {/* List TP */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Riwayat Tahun Pelajaran & Status</h3>
            <div className="divide-y divide-slate-100">
              {years.map((y) => (
                <div key={y.id} className="py-4 flex justify-between items-center text-xs hover:bg-slate-50/50 px-2 rounded-lg transition">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-700">
                      TP
                    </div>
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm block">Tahun Pelajaran {y.tahun}</span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider mt-1 inline-block">
                        Semester {y.semester}
                      </span>
                    </div>
                  </div>
                  {y.aktif ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shadow-emerald-50">
                      <Check className="h-3.5 w-3.5" />
                      Aktif Sekarang
                    </span>
                  ) : (
                    user.role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handleActivateTp(y.id)}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        Aktifkan
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. KALENDER AKADEMIK */}
      {activeSubTab === "kalender" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-calendar">
          {/* Calendar Creator Form */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Plus className="h-4 w-4 text-indigo-600" />
                <span>Tambah Agenda Sekolah</span>
              </h3>
              <form onSubmit={handleSaveCalendar} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    required
                    value={calForm.tanggal}
                    onChange={(e) => setCalForm({ ...calForm, tanggal: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-mono font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Judul / Kegiatan</label>
                  <input
                    type="text"
                    required
                    value={calForm.judul}
                    onChange={(e) => setCalForm({ ...calForm, judul: e.target.value })}
                    placeholder="Contoh: Pembagian Rapor Semester"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori / Jenis</label>
                  <select
                    value={calForm.jenis}
                    onChange={(e) => setCalForm({ ...calForm, jenis: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                  >
                    <option value="AKADEMIK">AKADEMIK (Pembelajaran)</option>
                    <option value="LIBUR">LIBUR SEKOLAH</option>
                    <option value="UJIAN">UJIAN (PAS / PTS)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Simpan Agenda</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Akses Terbatas</p>
              Agenda kalender akademik dapat dibaca oleh seluruh civitas sekolah (Guru & Siswa), namun hanya Admin yang berwenang memperbarui daftar agenda resmi sekolah.
            </div>
          )}

          {/* List Events */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Kalender Resmi Sekolah</h3>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1">
              {calendarEvents.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-400">Belum ada agenda sekolah.</p>
              ) : (
                calendarEvents.map((evt) => (
                  <div key={evt.id} className="py-3 flex justify-between items-center text-xs hover:bg-slate-50/50 px-2 rounded-lg transition">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-2 font-mono text-center shrink-0 w-16">
                        <span className="block text-[10px] text-slate-400 font-bold">TGL</span>
                        <span className="font-bold text-slate-700">{evt.tanggal.substring(8, 10)}</span>
                        <span className="block text-[8px] text-slate-400">{evt.tanggal.substring(5, 7)}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{evt.judul}</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1 uppercase tracking-wider ${
                          evt.jenis === "AKADEMIK" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                          evt.jenis === "UJIAN" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {evt.jenis}
                        </span>
                      </div>
                    </div>
                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => handleDeleteCalendar(evt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DAFTAR GURU */}
      {activeSubTab === "guru" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-guru">
          {/* Guru Form Editor (ADMIN Only) */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                {isEditing ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-indigo-600" />}
                <span>{isEditing ? "Ubah Akun Guru" : "Daftarkan Guru Baru"}</span>
              </h3>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={userForm.nama}
                    onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })}
                    placeholder="Contoh: Dra. Herawati, M.Pd."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    required
                    value={userForm.nip}
                    onChange={(e) => setUserForm({ ...userForm, nip: e.target.value })}
                    placeholder="18 digit angka NIP"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Belajar.id / Resmi</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="nama@guru.smk.belajar.id"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Username Sistem</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="Contoh: herawati"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white disabled:bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Akun</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="Masukkan sandi default"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    {isEditing ? "Perbarui" : "Daftarkan"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetUserForm}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Akses</p>
              Manajemen registrasi data guru sekolah sepenuhnya dimandatkan kepada Administrator Akademik demi keselarasan sistem kepegawaian sekolah.
            </div>
          )}

          {/* List Guru */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-800 text-sm">Direktori Guru ({teachersOnly.length} orang)</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari guru..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {teachersOnly
                .filter((t) => t.nama.toLowerCase().includes(searchTerm.toLowerCase()) || (t.nip && t.nip.includes(searchTerm)))
                .map((g) => (
                  <div key={g.id} className="py-3 flex justify-between items-center text-xs hover:bg-slate-50/50 px-2 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                        {g.nama.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{g.nama}</span>
                        <span className="text-slate-500 text-[10px] font-mono">NIP: {g.nip || "-"}</span>
                        <span className="text-slate-400 block text-[10px] mt-0.5">{g.email}</span>
                      </div>
                    </div>
                    {user.role === "ADMIN" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditUser(g)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(g.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. DAFTAR SISWA */}
      {activeSubTab === "siswa" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-siswa">
          {/* Siswa Form Editor */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                {isEditing ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-indigo-600" />}
                <span>{isEditing ? "Ubah Akun Siswa" : "Daftarkan Siswa Baru"}</span>
              </h3>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    value={userForm.nama}
                    onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })}
                    placeholder="Contoh: Ahmad Dhani"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NISN</label>
                  <input
                    type="text"
                    required
                    value={userForm.nisn}
                    onChange={(e) => setUserForm({ ...userForm, nisn: e.target.value })}
                    placeholder="10 digit nomor NISN"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rombel (Kelas)</label>
                  <select
                    value={userForm.kelas}
                    onChange={(e) => setUserForm({ ...userForm, kelas: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                  >
                    <option value="X-1">X-1 (Fase E)</option>
                    <option value="XI-1">XI-1 (Fase F)</option>
                    <option value="XII-1">XII-1 (Fase F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Email Siswa</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="ahmad@siswa.lmtms.sch.id"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="Contoh: ahmad"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white disabled:bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Akun</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="Masukkan sandi default"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    {isEditing ? "Perbarui" : "Daftarkan"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetUserForm}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Akses</p>
              Akun siswa dikelola oleh Admin sekolah. Data siswa akan secara dinamis sinkron dengan absensi, penugasan, dan rekapitulasi nilai rapor kurikulum mandiri.
            </div>
          )}

          {/* List Siswa */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-800 text-sm">Data Peserta Didik ({studentsOnly.length} orang)</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau NISN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-48"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {studentsOnly
                .filter((s) => s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || (s.nisn && s.nisn.includes(searchTerm)))
                .map((s) => (
                  <div key={s.id} className="py-3 flex justify-between items-center text-xs hover:bg-slate-50/50 px-2 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                        {s.nama.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{s.nama}</span>
                        <div className="flex gap-2 text-slate-400 text-[10px] font-mono mt-0.5">
                          <span>NISN: {s.nisn}</span>
                          <span>•</span>
                          <span className="text-indigo-600 font-bold">Kelas {s.kelas}</span>
                        </div>
                        <span className="text-slate-400 block text-[10px]">{s.email}</span>
                      </div>
                    </div>
                    {user.role === "ADMIN" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditUser(s)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(s.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ROMBONGAN BELAJAR (ROMBEL) */}
      {activeSubTab === "rombel" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-rombel">
          {/* Rombel Form Editor (Admin Only) */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                {romForm.id ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-indigo-600" />}
                <span>{romForm.id ? "Ubah Rombel" : "Buat Rombongan Belajar"}</span>
              </h3>
              <form onSubmit={handleSaveRombel} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Rombel / Kelas</label>
                  <input
                    type="text"
                    required
                    value={romForm.nama}
                    onChange={(e) => setRomForm({ ...romForm, nama: e.target.value })}
                    placeholder="Contoh: X-1, XI-IPA-2"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tingkat Kelas</label>
                  <select
                    value={romForm.tingkat}
                    onChange={(e) => setRomForm({ ...romForm, tingkat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                  >
                    <option value="X">Kelas X (Fase E)</option>
                    <option value="XI">Kelas XI (Fase F)</option>
                    <option value="XII">Kelas XII (Fase F)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Wali Kelas</label>
                  <select
                    value={romForm.waliKelasId}
                    onChange={(e) => setRomForm({ ...romForm, waliKelasId: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-medium"
                  >
                    <option value="">-- Tentukan Wali Kelas --</option>
                    {teachersOnly.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    {romForm.id ? "Perbarui" : "Simpan"}
                  </button>
                  {romForm.id && (
                    <button
                      type="button"
                      onClick={() => setRomForm({ id: "", nama: "", tingkat: "X", waliKelasId: "" })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Rombel</p>
              Tingkatan kelas ini mewakili pembagian Fase E dan Fase F kurikulum sekolah untuk pengelompokan presensi dan mata pelajaran.
            </div>
          )}

          {/* List Rombel */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Grup Kelas Aktif Sekolah</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rombels.map((rom) => {
                const wali = teachersOnly.find((t) => t.id === rom.waliKelasId);
                const countSiswa = studentsOnly.filter((s) => s.kelas === rom.nama).length;
                return (
                  <div key={rom.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 relative hover:border-indigo-200 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase font-bold font-mono">
                          Tingkat {rom.tingkat}
                        </span>
                        <h4 className="font-display font-extrabold text-xl text-slate-900 mt-2">Kelas {rom.nama}</h4>
                      </div>
                      {user.role === "ADMIN" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setRomForm({ id: rom.id, nama: rom.nama, tingkat: rom.tingkat, waliKelasId: rom.waliKelasId });
                              setIsEditing(true);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-white transition"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRombel(rom.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-white transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 border-t border-slate-200/60 pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Wali Kelas:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[150px]" title={wali ? wali.nama : "Belum Ditentukan"}>
                          {wali ? wali.nama : "Belum Ditentukan"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Jumlah Siswa:</span>
                        <span className="font-bold text-indigo-600 font-mono">{countSiswa} Siswa</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. JADWAL PELAJARAN */}
      {activeSubTab === "jadwal" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-jadwal">
          {/* Jadwal Form Creator (ADMIN & GURU) */}
          {user.role === "ADMIN" || user.role === "GURU" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                {jadForm.id ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-indigo-600" />}
                <span>{jadForm.id ? "Ubah Jadwal" : "Sertakan Jadwal Pelajaran"}</span>
              </h3>
              <form onSubmit={handleSaveJadwal} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Hari</label>
                    <select
                      value={jadForm.hari}
                      onChange={(e) => setJadForm({ ...jadForm, hari: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                    >
                      {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas</label>
                    <select
                      value={jadForm.kelas}
                      onChange={(e) => setJadForm({ ...jadForm, kelas: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                    >
                      {rombels.map((r) => (
                        <option key={r.id} value={r.nama}>
                          Kelas {r.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rentang Jam Belajar</label>
                  <input
                    type="text"
                    required
                    value={jadForm.jam}
                    onChange={(e) => setJadForm({ ...jadForm, jam: e.target.value })}
                    placeholder="Contoh: 07:30 - 09:00"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mata Pelajaran & Kompetensi</label>
                  <input
                    type="text"
                    required
                    value={jadForm.mapel}
                    onChange={(e) => setJadForm({ ...jadForm, mapel: e.target.value })}
                    placeholder="Informatika (Berpikir Komputasional)"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guru Pengajar</label>
                  <select
                    value={jadForm.guruId}
                    onChange={(e) => setJadForm({ ...jadForm, guruId: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-medium"
                    required
                  >
                    <option value="">-- Pilih Guru --</option>
                    {teachersOnly.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    {jadForm.id ? "Perbarui" : "Simpan Jadwal"}
                  </button>
                  {jadForm.id && (
                    <button
                      type="button"
                      onClick={() => setJadForm({ id: "", hari: "Senin", jam: "", kelas: "X-1", mapel: "", guruId: "" })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Jadwal</p>
              Jadwal pelajaran diatur secara berkala demi menjamin kejelasan elemen kurikulum pembelajaran harian di laboratorium komputer.
            </div>
          )}

          {/* List Jadwal */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Skenario Jadwal Pelajaran Mingguan</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => {
                const dayJadwals = jadwals.filter((j) => j.hari === day);
                return (
                  <div key={day} className="space-y-2">
                    <span className="block text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg w-fit">
                      Hari {day}
                    </span>
                    {dayJadwals.length === 0 ? (
                      <p className="text-[11px] text-slate-400 pl-3 py-1">Tidak ada jadwal.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                        {dayJadwals.map((j) => {
                          const g = teachersOnly.find((t) => t.id === j.guruId);
                          return (
                            <div key={j.id} className="p-3 border border-slate-150 rounded-xl bg-slate-50/50 flex justify-between items-center hover:border-slate-300">
                              <div>
                                <span className="text-[10px] text-indigo-600 font-bold font-mono block">{j.jam}</span>
                                <span className="font-bold text-slate-900 block text-xs mt-1">{j.mapel}</span>
                                <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                                  <span>Kelas {j.kelas}</span>
                                  <span>•</span>
                                  <span>Guru: {g ? g.nama.split(",")[0] : "-"}</span>
                                </div>
                              </div>
                              {(user.role === "ADMIN" || user.role === "GURU") && (
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setJadForm({ id: j.id, hari: j.hari, jam: j.jam, kelas: j.kelas, mapel: j.mapel, guruId: j.guruId });
                                      setIsEditing(true);
                                    }}
                                    className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-white transition"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJadwal(j.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-white transition"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. MAPPING GURU */}
      {activeSubTab === "mapping" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="subtab-mapping">
          {/* Mapping Form Editor (ADMIN Only) */}
          {user.role === "ADMIN" ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-3">
                {mapForm.id ? <Edit2 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-indigo-600" />}
                <span>{mapForm.id ? "Ubah Pemetaan" : "Petakan Mengajar Guru"}</span>
              </h3>
              <form onSubmit={handleSaveMapping} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guru Pengampu</label>
                  <select
                    value={mapForm.guruId}
                    onChange={(e) => setMapForm({ ...mapForm, guruId: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-semibold"
                    required
                  >
                    <option value="">-- Pilih Guru --</option>
                    {teachersOnly.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas Mengajar</label>
                  <select
                    value={mapForm.kelas}
                    onChange={(e) => setMapForm({ ...mapForm, kelas: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                  >
                    {rombels.map((r) => (
                      <option key={r.id} value={r.nama}>
                        Kelas {r.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Elemen Informatika (Kurikulum Merdeka)</label>
                  <select
                    value={mapForm.elemen}
                    onChange={(e) => setMapForm({ ...mapForm, elemen: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-700 font-bold"
                  >
                    <option value="BK">BK (Berpikir Komputasional)</option>
                    <option value="TIK">TIK (Teknologi Informasi & Komunikasi)</option>
                    <option value="SK">SK (Sistem Komputer)</option>
                    <option value="JKI">JKI (Jaringan Komputer & Internet)</option>
                    <option value="AD">AD (Analisis Data)</option>
                    <option value="AP">AP (Algoritma & Pemrograman)</option>
                    <option value="DSI">DSI (Dampak Sosial Informatika)</option>
                    <option value="PLB">PLB (Praktik Lintas Bidang)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    {mapForm.id ? "Perbarui" : "Petakan Mengajar"}
                  </button>
                  {mapForm.id && (
                    <button
                      type="button"
                      onClick={() => setMapForm({ id: "", guruId: "", kelas: "X-1", elemen: "BK" })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Pemetaan</p>
              Pemetaan Guru ini menyesuaikan elemen Kurikulum Merdeka Informatika SMA yang diajarkan oleh masing-masing guru pada rombel yang bersangkutan.
            </div>
          )}

          {/* List Mappings */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Matriks Pemetaan Tugas Mengajar Guru</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Guru</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Elemen Mata Pelajaran</th>
                    {user.role === "ADMIN" && <th className="py-3 px-4 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {mappings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Belum ada pemetaan pengajar.
                      </td>
                    </tr>
                  ) : (
                    mappings.map((m) => {
                      const g = teachersOnly.find((t) => t.id === m.guruId);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-800">{g ? g.nama : "Guru Tidak Dikenal"}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono text-[10px]">
                              Kelas {m.kelas}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">
                            {m.elemen === "BK" ? "Berpikir Komputasional" :
                             m.elemen === "TIK" ? "Teknologi Informasi & Komunikasi" :
                             m.elemen === "SK" ? "Sistem Komputer" :
                             m.elemen === "JKI" ? "Jaringan Komputer & Internet" :
                             m.elemen === "AD" ? "Analisis Data" :
                             m.elemen === "AP" ? "Algoritma & Pemrograman" :
                             m.elemen === "DSI" ? "Dampak Sosial Informatika" :
                             "Praktik Lintas Bidang"} ({m.elemen})
                          </td>
                          {user.role === "ADMIN" && (
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteMapping(m.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-50 transition"
                              >
                                <Trash2 className="h-4 w-4 inline" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. IDENTITAS SEKOLAH */}
      {activeSubTab === "identitas" && (
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-6 animate-fade-in" id="subtab-identitas">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-2">
              <School className="h-5 w-5 text-indigo-600 animate-pulse" />
              <span>Konfigurasi Identitas Resmi Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Atur identitas resmi sekolah untuk kop laporan, administrasi LMTMS, dan representasi visual institusi.
            </p>
          </div>

          <form onSubmit={handleSaveIdentitas} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo Upload Panel */}
            <div className="lg:col-span-1 space-y-4">
              <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Logo Instansi Sekolah</span>
              <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center space-y-4 hover:bg-slate-50 transition relative min-h-[220px]">
                {identitasForm.logo ? (
                  <div className="relative group">
                    <img
                      src={identitasForm.logo}
                      alt="Logo Sekolah"
                      className="max-h-40 max-w-full object-contain rounded-lg shadow-sm border border-slate-200 bg-white p-2"
                      referrerPolicy="no-referrer"
                    />
                    {user.role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => setIdentitasForm({ ...identitasForm, logo: "" })}
                        className="absolute -top-2 -right-2 bg-rose-600 text-white hover:bg-rose-700 p-1 rounded-full shadow-lg transition"
                        title="Hapus Logo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <GraduationCap className="h-8 w-8 text-indigo-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Belum Ada Logo Khusus</span>
                  </div>
                )}

                {user.role === "ADMIN" ? (
                  <div className="w-full">
                    <label className="block w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold cursor-pointer transition text-center">
                      <span>Pilih Berkas Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                      Format yang didukung: PNG, JPG, JPEG, SVG. Maksimum ukuran file 2MB.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hanya Administrator yang dapat mengganti logo sekolah.
                  </p>
                )}
              </div>
            </div>

            {/* Fields Form Panel */}
            <div className="lg:col-span-2 space-y-5">
              <span className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Detail Informasi Sekolah</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Resmi Sekolah <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={user.role !== "ADMIN"}
                    value={identitasForm.nama}
                    onChange={(e) => setIdentitasForm({ ...identitasForm, nama: e.target.value })}
                    placeholder="Contoh: SMA Negeri 1 Informatika"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-500 bg-white font-semibold text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">NPSN (Nomor Pokok Sekolah Nasional) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={user.role !== "ADMIN"}
                    value={identitasForm.npsn}
                    onChange={(e) => setIdentitasForm({ ...identitasForm, npsn: e.target.value })}
                    placeholder="Contoh: 20103241"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-500 bg-white font-mono text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kepala Sekolah <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  disabled={user.role !== "ADMIN"}
                  value={identitasForm.kepalaSekolah}
                  onChange={(e) => setIdentitasForm({ ...identitasForm, kepalaSekolah: e.target.value })}
                  placeholder="Contoh: Yogi Suprayogi, S.Kom."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-indigo-500 bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap Sekolah <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  disabled={user.role !== "ADMIN"}
                  rows={3}
                  value={identitasForm.alamat}
                  onChange={(e) => setIdentitasForm({ ...identitasForm, alamat: e.target.value })}
                  placeholder="Contoh: Jl. Core IT No. 102, Silicon Valley, Bandung"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:outline-indigo-500 bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              {user.role === "ADMIN" ? (
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Simpan Perubahan Identitas</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center gap-2 text-slate-500 text-[11px]">
                  <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Anda login sebagai Guru. Mengedit identitas sekolah hanya dapat dilakukan oleh peran Administrator.</span>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
