import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
  Settings,
  KeyRound,
  Camera,
  Upload,
  FileSpreadsheet,
  Download,
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileUp,
  Eye,
  Filter,
  Info
} from "lucide-react";
import { User, TahunPelajaran } from "../types";
import { InteractiveCalendar } from "./InteractiveCalendar";

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
  onActivateYear?: (id: string) => void;
  activeYearId?: string;
}

type SubTab = "tahun" | "kalender" | "guru" | "siswa" | "rombel" | "jadwal" | "mapping" | "identitas";

export const AcademicManagementView: React.FC<AcademicManagementViewProps> = ({ user, onActivateYear, activeYearId }) => {
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
    password: "",
    foto: ""
  });
  const [romForm, setRomForm] = useState({ id: "", nama: "", tingkat: "X", waliKelasId: "" });
  const [jadForm, setJadForm] = useState({ id: "", hari: "Senin", jam: "", kelas: "X-1", mapel: "", guruId: "" });
  const [mapForm, setMapForm] = useState({ id: "", guruId: "", kelas: "X-1", elemen: "BK" });

  const [isEditing, setIsEditing] = useState(false);

  // Bulk Student Import State
  const [studentInputMode, setStudentInputMode] = useState<"single" | "bulk">("single");
  const [parsedStudents, setParsedStudents] = useState<Array<{
    nama: string;
    nisn: string;
    kelas: string;
    email: string;
    password?: string;
    isValid: boolean;
    errorReason?: string;
  }>>([]);
  const [bulkFileName, setBulkFileName] = useState("");
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [showImportPreviewModal, setShowImportPreviewModal] = useState(false);
  const [previewSearchTerm, setPreviewSearchTerm] = useState("");
  const [previewFilterStatus, setPreviewFilterStatus] = useState<"all" | "valid" | "invalid">("all");

  // Reset Password Modal State
  const [selectedStudentForReset, setSelectedStudentForReset] = useState<User | null>(null);
  const [resetCustomPassword, setResetCustomPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

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
        if (onActivateYear) onActivateYear(id);
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
      password: "",
      foto: ""
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
      password: u.password || "",
      foto: u.foto || ""
    });
    setIsEditing(true);
  };

  const handleStudentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerNotification("error", "Ukuran berkas foto terlalu besar. Maksimum 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserForm({ ...userForm, foto: event.target.result as string });
        triggerNotification("success", "Foto profil siswa berhasil dimuat!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetStudentPassword = (student: User) => {
    setSelectedStudentForReset(student);
    setResetCustomPassword(`${student.username}123`);
  };

  // ==========================================
  // BULK STUDENT UPLOAD HANDLERS
  // ==========================================
  const handleDownloadTemplate = (format: "xlsx" | "csv") => {
    const sampleData = [
      {
        "Nama Lengkap": "Ahmad Rizky Pratama",
        "NISN": "0081234567",
        "Kelas": "X-1",
        "Email": "ahmad.rizky@siswa.lmtms.sch.id",
        "Password Default (Opsional)": "0081234567"
      },
      {
        "Nama Lengkap": "Siti Nurhaliza",
        "NISN": "0081234568",
        "Kelas": "X-1",
        "Email": "siti.nurhaliza@siswa.lmtms.sch.id",
        "Password Default (Opsional)": "0081234568"
      },
      {
        "Nama Lengkap": "Dharma Putra Utama",
        "NISN": "0081234569",
        "Kelas": "XI-1",
        "Email": "dharma.putra@siswa.lmtms.sch.id",
        "Password Default (Opsional)": "0081234569"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 32 },
      { wch: 28 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Siswa");

    if (format === "xlsx") {
      XLSX.writeFile(workbook, "Template_Format_Upload_Siswa_LMTMS.xlsx");
    } else {
      XLSX.writeFile(workbook, "Template_Format_Upload_Siswa_LMTMS.csv", { bookType: "csv" });
    }

    triggerNotification("success", `Template format upload siswa (.${format.toUpperCase()}) berhasil diunduh!`);
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          triggerNotification("error", "Berkas tidak berisi data atau format tidak sesuai.");
          setParsedStudents([]);
          return;
        }

        const existingNisns = new Set(usersList.map((u) => u.nisn || u.username));
        const existingEmails = new Set(usersList.map((u) => u.email ? u.email.toLowerCase() : ""));

        const processed = jsonData.map((row) => {
          const nama = String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || row["Name"] || "").trim();
          const nisn = String(row["NISN"] || row["nisn"] || row["Nomor NISN"] || "").trim();
          const kelas = String(row["Kelas"] || row["Rombel"] || row["kelas"] || "X-1").trim();
          const email = String(row["Email"] || row["email"] || row["Alamat Email"] || (nisn ? `${nisn}@siswa.lmtms.sch.id` : "")).trim().toLowerCase();
          const password = String(row["Password Default (Opsional)"] || row["Password"] || row["password"] || nisn).trim();

          let isValid = true;
          let errorReason = "";

          if (!nama) {
            isValid = false;
            errorReason = "Nama siswa kosong";
          } else if (!nisn) {
            isValid = false;
            errorReason = "NISN kosong";
          } else if (existingNisns.has(nisn)) {
            isValid = false;
            errorReason = `NISN (${nisn}) sudah terdaftar`;
          } else if (existingEmails.has(email)) {
            isValid = false;
            errorReason = `Email (${email}) sudah terdaftar`;
          }

          return { nama, nisn, kelas, email, password, isValid, errorReason };
        });

        setParsedStudents(processed);
        setShowImportPreviewModal(true);
        setPreviewSearchTerm("");
        setPreviewFilterStatus("all");
        triggerNotification("success", `Pratinjau data dibuat dari berkas ${file.name} (${processed.length} baris).`);
      } catch (err) {
        console.error("Gagal membaca file spreadsheet:", err);
        triggerNotification("error", "Gagal membaca berkas. Pastikan format file .xlsx, .xls, atau .csv.");
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset file value to allow re-uploading the same file if needed
    e.target.value = "";
  };

  const handleProcessBulkImport = async () => {
    const validStudents = parsedStudents.filter((s) => s.isValid);
    if (validStudents.length === 0) {
      triggerNotification("error", "Tidak ada data siswa valid yang siap diimpor.");
      return;
    }

    setIsSubmittingBulk(true);
    try {
      const res = await fetch("/api/academic/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({ students: validStudents })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", data.message || `Berhasil mengimpor ${validStudents.length} data siswa!`);
        setParsedStudents([]);
        setBulkFileName("");
        setShowImportPreviewModal(false);
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal mengimpor data siswa.");
      }
    } catch (err) {
      triggerNotification("error", "Terjadi kesalahan jaringan saat impor data.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const confirmResetPassword = async () => {
    if (!selectedStudentForReset) return;
    setIsResetting(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({
          studentId: selectedStudentForReset.id,
          newPassword: resetCustomPassword || `${selectedStudentForReset.username}123`,
          teacherId: user.id,
          teacherName: user.nama
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerNotification("success", data.message);
        setSelectedStudentForReset(null);
        setResetCustomPassword("");
        loadAllData();
      } else {
        triggerNotification("error", data.message || "Gagal melakukan reset kata sandi.");
      }
    } catch (err) {
      triggerNotification("error", "Gagal menghubungi server untuk reset kata sandi.");
    } finally {
      setIsResetting(false);
    }
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
          {/* Admin & Guru Input Form */}
          {user.role === "ADMIN" || user.role === "GURU" ? (
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambahkan Tahun</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Akses Siswa</p>
              Tahun pelajaran aktif diatur oleh Guru Pengampu dan Administrator Sekolah.
            </div>
          )}

          {/* List TP */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Riwayat Tahun Pelajaran & Status Akses</h3>
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
                  {y.aktif || y.id === activeYearId ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Check className="h-3.5 w-3.5" />
                      Aktif Sekarang
                    </span>
                  ) : (
                    (user.role === "ADMIN" || user.role === "GURU") && (
                      <button
                        type="button"
                        onClick={() => handleActivateTp(y.id)}
                        className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Pilih & Aktifkan
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
        <InteractiveCalendar
          user={user}
          calendarEvents={calendarEvents}
          onAddEvent={async (evt) => {
            const res = await fetch("/api/academic/calendar", {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-user-role": user.role },
              body: JSON.stringify(evt)
            });
            if (res.ok) {
              loadAllData();
            } else {
              throw new Error("Gagal menyimpan agenda kalender");
            }
          }}
          onDeleteEvent={handleDeleteCalendar}
          onReload={loadAllData}
          triggerNotification={triggerNotification}
        />
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserForm({
                        ...userForm,
                        nip: val,
                        username: val,
                        password: (!userForm.password || userForm.password === userForm.nip) ? val : userForm.password
                      });
                    }}
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Username Sistem (Otomatis = NIP)</label>
                  <input
                    type="text"
                    disabled
                    value={userForm.nip || userForm.username}
                    placeholder="Sesuai NIP Guru"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-100 text-slate-600 cursor-not-allowed font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Akun (Default = NIP)</label>
                  <input
                    type="password"
                    required={!isEditing}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={isEditing ? "Biarkan kosong jika tidak diubah" : "Default sama dengan NIP"}
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
          {/* Siswa Form Editor / Bulk Upload Panel (Admin & Guru Access) */}
          {(user.role === "ADMIN" || user.role === "GURU") ? (
            <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4 h-fit">
              {/* Header with Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <Edit2 className="h-4 w-4 text-amber-500" />
                  ) : studentInputMode === "bulk" ? (
                    <UploadCloud className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <Plus className="h-4 w-4 text-indigo-600" />
                  )}
                  <span className="font-display font-bold text-slate-800 text-sm">
                    {isEditing ? "Ubah Data Siswa" : studentInputMode === "bulk" ? "Upload Siswa Serentak" : "Daftarkan Siswa Baru"}
                  </span>
                </div>
                
                {!isEditing && (
                  <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setStudentInputMode("single")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        studentInputMode === "single" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Satuan
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentInputMode("bulk")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                        studentInputMode === "bulk" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Serentak
                    </button>
                  </div>
                )}
              </div>

              {/* MODE 1: SINGLE FORM REGISTRATION */}
              {studentInputMode === "single" ? (
                <form onSubmit={handleSaveUser} className="space-y-4">
                  {/* Foto Profil Input & Preview */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Foto Profil {activeSubTab === "guru" ? "Guru" : "Siswa"}</span>
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      {userForm.foto ? (
                        <img
                          src={userForm.foto}
                          alt="Foto Profil"
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-full object-cover border-2 border-indigo-200 shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm shrink-0 border border-slate-300">
                          {userForm.nama ? userForm.nama.charAt(0) : (activeSubTab === "guru" ? "G" : "S")}
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-2xs">
                          <Upload className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Pilih Foto Berkas</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleStudentPhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 leading-tight">Maksimal 2MB (JPG/PNG). Foto ini otomatis menjadi foto resmi akun {activeSubTab === "guru" ? "guru" : "siswa"}.</p>
                      </div>
                    </div>
                  </div>

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
                    <label className="block text-xs font-semibold text-slate-600 mb-1">NISN (Nomor Induk Siswa Nasional)</label>
                    <input
                      type="text"
                      required
                      value={userForm.nisn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserForm({
                          ...userForm,
                          nisn: val,
                          username: val,
                          password: (!userForm.password || userForm.password === userForm.nisn) ? val : userForm.password
                        });
                      }}
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Username Login (Otomatis = NISN)</label>
                    <input
                      type="text"
                      disabled
                      value={userForm.nisn || userForm.username}
                      placeholder="Sesuai NISN Siswa"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-100 text-slate-600 cursor-not-allowed font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Kata Sandi Akun (Default = NISN)</label>
                    <input
                      type="password"
                      required={!isEditing}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder={isEditing ? "Biarkan kosong jika tidak diubah" : "Default sama dengan NISN"}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-indigo-500 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm cursor-pointer"
                    >
                      {isEditing ? "Perbarui Data Siswa" : "Daftarkan Siswa"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetUserForm}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* MODE 2: BULK UPLOAD EXCEL / CSV */
                <div className="space-y-4">
                  {/* Download Template Banner */}
                  <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/80 p-3.5 rounded-xl border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      <span>Unduh Sample Template Format</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Gunakan berkas contoh di bawah ini untuk mengisi data NISN, Nama, Kelas, dan Email secara massal sebelum diunggah:
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate("xlsx")}
                        className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2.5 rounded-lg text-[11px] transition shadow-2xs cursor-pointer"
                        title="Unduh Format Berkas Excel (.xlsx)"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                        <span>Template .XLSX</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadTemplate("csv")}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-2.5 rounded-lg text-[11px] transition shadow-2xs cursor-pointer"
                        title="Unduh Format Berkas CSV (.csv)"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Template .CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* File Upload Box */}
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/50 rounded-xl p-4 text-center transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".csv, .xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleBulkFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="h-8 w-8 text-indigo-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-800">
                      {bulkFileName ? bulkFileName : "Pilih / Seret Berkas Spreadsheet"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Format didukung: .XLSX, .XLS, atau .CSV
                    </p>
                  </div>

                  {/* Parsed Students Preview */}
                  {parsedStudents.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 pb-2">
                        <span className="text-slate-800">Pratinjau Impor ({parsedStudents.length} siswa)</span>
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px]">
                          {parsedStudents.filter((s) => s.isValid).length} Siap
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowImportPreviewModal(true)}
                        className="w-full bg-slate-900 hover:bg-indigo-900 text-white font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="h-4 w-4 text-indigo-300" />
                        <span>Buka Modal Pratinjau Data Lengkap</span>
                      </button>

                      <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/40">
                        {parsedStudents.map((s, idx) => (
                          <div key={idx} className="p-2.5 text-[11px] flex justify-between items-center gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 truncate">{s.nama || "(Nama Kosong)"}</p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                NISN: {s.nisn || "-"} • Kelas: {s.kelas}
                              </p>
                            </div>
                            {s.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Siap
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0" title={s.errorReason}>
                                <XCircle className="h-3 w-3 text-amber-600" /> {s.errorReason}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isSubmittingBulk || parsedStudents.filter((s) => s.isValid).length === 0}
                          onClick={handleProcessBulkImport}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSubmittingBulk ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Memproses Impor...</span>
                            </>
                          ) : (
                            <>
                              <FileUp className="h-3.5 w-3.5" />
                              <span>Proses Impor ({parsedStudents.filter((s) => s.isValid).length} Siswa)</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setParsedStudents([]); setBulkFileName(""); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-1 bg-slate-50 p-5 border border-slate-200 rounded-2xl text-slate-500 text-xs h-fit leading-relaxed">
              <p className="font-bold text-slate-800 mb-2">Informasi Akses</p>
              Akun siswa dikelola oleh Guru dan Admin sekolah. Data siswa secara dinamis sinkron dengan absensi, penugasan, dan rekapitulasi nilai rapor kurikulum mandiri.
            </div>
          )}

          {/* List Siswa */}
          <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">Data Peserta Didik ({studentsOnly.length} orang)</h3>
                <p className="text-[11px] text-slate-400">Guru & Admin dapat mengedit profil, mengunggah foto, dan melakukan reset password siswa.</p>
              </div>
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
                      {s.foto ? (
                        <img
                          src={s.foto}
                          alt={s.nama}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 rounded-xl object-cover border border-indigo-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {s.nama.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{s.nama}</span>
                        <div className="flex gap-2 text-slate-400 text-[10px] font-mono mt-0.5">
                          <span>NISN: {s.nisn || "-"}</span>
                          <span>•</span>
                          <span className="text-indigo-600 font-bold">Kelas {s.kelas}</span>
                        </div>
                        <span className="text-slate-400 block text-[10px]">{s.email}</span>
                      </div>
                    </div>
                    
                    {(user.role === "ADMIN" || user.role === "GURU") && (
                      <div className="flex items-center gap-1.5">
                        {/* Tombol Reset Password Khusus Guru/Admin */}
                        <button
                          onClick={() => handleResetStudentPassword(s)}
                          className="flex items-center gap-1 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-2xs"
                          title="Reset Password Siswa"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Reset Pass</span>
                        </button>
                        <button
                          onClick={() => handleEditUser(s)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Profil & Foto"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {user.role === "ADMIN" && (
                          <button
                            onClick={() => handleDeleteUser(s.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                            title="Hapus Akun"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
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

      {/* Modal Reset Password Siswa (Khusus Guru & Admin) */}
      {selectedStudentForReset && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">Reset Kata Sandi Siswa</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ganti sandi akun siswa dengan aman</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForReset(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-3.5 rounded-xl border border-slate-150 dark:border-slate-600 text-xs space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Nama Siswa:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedStudentForReset.nama}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Username Login:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedStudentForReset.username}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Kelas:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedStudentForReset.kelas || "-"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
              <input
                type="text"
                value={resetCustomPassword}
                onChange={(e) => setResetCustomPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-indigo-500"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                Standar bawaan: <code className="font-mono text-indigo-600 dark:text-indigo-400">{selectedStudentForReset.username}123</code>. Siswa nantinya dapat login kembali menggunakan kata sandi ini.
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedStudentForReset(null)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isResetting || !resetCustomPassword}
                onClick={confirmResetPassword}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-100 transition flex items-center justify-center gap-1.5"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Mereset...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Konfirmasi Reset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Data Impor Spreadsheet (.csv, .xls, .xlsx) */}
      {showImportPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col my-auto max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      Pratinjau Data Impor Spreadsheet
                    </h3>
                    <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                      .CSV / .XLS / .XLSX
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/80 mt-0.5">
                    Verifikasi kelayakan format data siswa sebelum disimpan ke basis data LMTMS
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowImportPreviewModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-indigo-200 hover:text-white transition"
                title="Tutup Pratinjau"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Info bar & controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* File Info & Stats */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{bulkFileName || "Berkas Spreadsheet"}</span>
                </span>
                <span className="bg-slate-200/70 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold px-2.5 py-1 rounded-lg">
                  Total: {parsedStudents.length} Baris
                </span>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{parsedStudents.filter(s => s.isValid).length} Siap Diimpor</span>
                </span>
                {parsedStudents.filter(s => !s.isValid).length > 0 && (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span>{parsedStudents.filter(s => !s.isValid).length} Bermasalah (Dilewati)</span>
                  </span>
                )}
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex items-center gap-2">
                {/* Search Box */}
                <div className="relative flex-1 md:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={previewSearchTerm}
                    onChange={(e) => setPreviewSearchTerm(e.target.value)}
                    placeholder="Cari nama, NISN, kelas..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-0"
                  />
                  {previewSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setPreviewSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Filter Selector */}
                <div className="inline-flex rounded-lg bg-slate-200/70 dark:bg-slate-700 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewFilterStatus("all")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      previewFilterStatus === "all"
                        ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    Semua ({parsedStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFilterStatus("valid")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      previewFilterStatus === "valid"
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    Valid ({parsedStudents.filter(s => s.isValid).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFilterStatus("invalid")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                      previewFilterStatus === "invalid"
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    Error ({parsedStudents.filter(s => !s.isValid).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Warning / Validation Notice */}
            {parsedStudents.filter(s => !s.isValid).length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-800/50 px-4 py-2.5 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <span className="font-bold">Perhatian Format Data: </span>
                  Baris berstatus bermasalah/error (misalnya NISN/Email duplikat atau kolom nama/NISN kosong) akan dilewati secara otomatis saat proses impor agar tidak menimbulkan eror pada basis data. Hanya <b>{parsedStudents.filter(s => s.isValid).length} data valid</b> yang akan disimpan.
                </div>
              </div>
            )}

            {/* Table Area */}
            <div className="flex-1 overflow-auto max-h-[50vh] p-4 bg-white dark:bg-slate-800">
              {(() => {
                const filtered = parsedStudents.filter((s) => {
                  const matchSearch =
                    s.nama.toLowerCase().includes(previewSearchTerm.toLowerCase()) ||
                    s.nisn.toLowerCase().includes(previewSearchTerm.toLowerCase()) ||
                    s.kelas.toLowerCase().includes(previewSearchTerm.toLowerCase()) ||
                    s.email.toLowerCase().includes(previewSearchTerm.toLowerCase());
                  if (!matchSearch) return false;
                  if (previewFilterStatus === "valid") return s.isValid;
                  if (previewFilterStatus === "invalid") return !s.isValid;
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <FileSpreadsheet className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
                      <p className="text-xs font-semibold">Tidak ada baris data yang cocok dengan kriteria pencarian / filter.</p>
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0">
                        <th className="p-2.5 w-12 text-center">No.</th>
                        <th className="p-2.5 w-36">Status Format</th>
                        <th className="p-2.5">Nama Lengkap Siswa</th>
                        <th className="p-2.5 w-32 font-mono">NISN</th>
                        <th className="p-2.5 w-24">Kelas</th>
                        <th className="p-2.5">Email Akun</th>
                        <th className="p-2.5 font-mono w-28">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {filtered.map((s, idx) => (
                        <tr
                          key={idx}
                          className={`transition ${
                            s.isValid
                              ? "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                              : "bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60"
                          }`}
                        >
                          <td className="p-2.5 text-center text-slate-400 font-mono text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="p-2.5">
                            {s.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Siap Impor
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/80 dark:bg-amber-950/80 dark:text-amber-200 px-2 py-0.5 rounded-full" title={s.errorReason}>
                                <XCircle className="h-3 w-3 text-amber-600" /> {s.errorReason || "Format Salah"}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">
                            {s.nama || <span className="text-amber-600 italic">(Nama Kosong)</span>}
                          </td>
                          <td className="p-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {s.nisn || <span className="text-amber-600 italic">(Kosong)</span>}
                          </td>
                          <td className="p-2.5">
                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                              {s.kelas || "X-1"}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {s.email}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {s.password || s.nisn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-auto">
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs w-full sm:w-auto">
                  <UploadCloud className="h-4 w-4 text-indigo-600" />
                  <span>Pilih Berkas Spreadsheet Lain</span>
                  <input
                    type="file"
                    accept=".csv, .xls, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleBulkFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowImportPreviewModal(false)}
                  className="px-4 py-2 bg-slate-200/80 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmittingBulk || parsedStudents.filter(s => s.isValid).length === 0}
                  onClick={handleProcessBulkImport}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingBulk ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Memproses Simpan Data...</span>
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4" />
                      <span>Konfirmasi & Simpan {parsedStudents.filter(s => s.isValid).length} Data Valid</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
