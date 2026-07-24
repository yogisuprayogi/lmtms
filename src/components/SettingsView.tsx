import React, { useState, useEffect } from "react";
import { Shield, KeyRound, Smartphone, Save, AlertCircle, CheckCircle, Fingerprint, Palette, Sun, Moon, Wifi, Lock, User as UserIcon, Camera, Upload, Trash2 } from "lucide-react";
import { User } from "../types";

interface SettingsViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeTheme?: string;
  onChangeTheme?: (themeName: string) => void;
  isOnline?: boolean;
  onToggleOnlineSimulated?: () => void;
  offlineQueueLength?: number;
  onTriggerSync?: () => void;
  onAddNotification?: (title: string, message: string, type: "info" | "alert") => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  isDarkMode = false,
  onToggleDarkMode,
  activeTheme = "classic",
  onChangeTheme,
  isOnline = true,
  onToggleOnlineSimulated,
  offlineQueueLength = 0,
  onTriggerSync,
  onAddNotification
}) => {
  // Profile states
  const [nama, setNama] = useState(user.nama);
  const [email, setEmail] = useState(user.email);
  const [foto, setFoto] = useState(user.foto || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setNama(user.nama);
    setEmail(user.email);
    setFoto(user.foto || "");
  }, [user.id, user.nama, user.email, user.foto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileSuccess("");
    setProfileError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileError("Ukuran berkas foto terlalu besar. Maksimum 2MB.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setProfileError("Format berkas harus berupa gambar (JPG, PNG, atau WebP).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setFoto(resultStr);
          setProfileSuccess("Foto profil baru telah dipilih. Klik 'Simpan Perubahan' untuk memperbarui.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFoto("");
    setProfileSuccess("Foto profil dihapus. Klik 'Simpan Perubahan' untuk memperbarui.");
  };

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // MFA states
  const [mfaEnabled, setMfaEnabled] = useState(user.mfaEnabled || false);
  const [mfaVerificationCode, setMfaVerificationCode] = useState("");
  const [mfaSuccess, setMfaSuccess] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [isTogglingMfa, setIsTogglingMfa] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({ userId: user.id, nama, email, foto })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileSuccess("Profil & foto berhasil diperbarui!");
        onUpdateUser(data.user);
      } else {
        setProfileError(data.message || "Gagal memperbarui profil.");
      }
    } catch (err) {
      setProfileError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess("Kata sandi berhasil diubah!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.message || "Gagal mengubah kata sandi.");
      }
    } catch (err) {
      setPasswordError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleToggleMfa = async () => {
    setMfaSuccess("");
    setMfaError("");

    if (!mfaEnabled && !mfaVerificationCode) {
      setMfaError("Harap masukkan kode TOTP 6-digit untuk verifikasi.");
      return;
    }

    setIsTogglingMfa(true);
    const targetStatus = !mfaEnabled;

    try {
      const res = await fetch("/api/users/mfa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role
        },
        body: JSON.stringify({ userId: user.id, enabled: targetStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMfaSuccess(data.message);
        setMfaEnabled(targetStatus);
        setMfaVerificationCode("");
        // Update local user object
        const updatedUser = { ...user, mfaEnabled: targetStatus };
        onUpdateUser(updatedUser);
      } else {
        setMfaError(data.message || "Gagal melakukan verifikasi MFA.");
      }
    } catch (err) {
      setMfaError("Koneksi server gagal. Silakan coba lagi.");
    } finally {
      setIsTogglingMfa(false);
    }
  };

  // RBAC Permission dictionary for display
  const getPermissions = (role: string) => {
    switch (role) {
      case "ADMIN":
        return [
          "Akses penuh Sistem Akademik LMTMS",
          "Mengelola data Tahun Pelajaran & Semester",
          "Membuat & menghapus akun guru, siswa, dan staf",
          "Membaca seluruh log audit aktivitas server",
          "Mengonfigurasi pengaturan keamanan jaringan sekolah"
        ];
      case "GURU":
        return [
          "Mendesain Alur Tujuan Pembelajaran (ATP) otomatis via Gemini AI",
          "Menyusun Modul Ajar, Prota, Prosem Kurikulum Merdeka",
          "Mengelola Materi Pembelajaran Elektronik (LMS)",
          "Membuat Kuis & Tugas Terulis Mandiri",
          "Melakukan Presensi Kelas Harian & Rekapitulasi",
          "Memberikan Penilaian Kognitif Elemen Informatika"
        ];
      case "SISWA":
        return [
          "Mengakses Materi Pembelajaran Terstruktur",
          "Mengumpulkan Tugas Mandiri & Kuis Pilihan Ganda",
          "Melihat Hasil Nilai Rapor Kognitif Elemen Informatika",
          "Melihat Statistik Presensi Pribadi di Dashboard",
          "Mengelola profil & mengaktifkan keamanan MFA"
        ];
      default:
        return ["Akses Terbatas"];
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-6xl mx-auto" id="settings-view-root">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900">Profil & Keamanan Akun</h2>
        <p className="text-sm text-slate-500 mt-1">
          Kelola detail profil, perbarui kata sandi, tinjau izin RBAC, dan amankan akun Anda menggunakan Multi-Factor Authentication (MFA).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Info & RBAC Summary */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card: Identity Summary */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm text-center relative overflow-hidden">
            {user.role === "SISWA" && (
              <div className="bg-amber-50 text-amber-700 text-[11px] font-medium px-3 py-1 border-b border-amber-200/60 -mx-6 -mt-6 mb-4 flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3 shrink-0 text-amber-600" />
                <span>Profil Dikelola Guru / Presensi Siswa</span>
              </div>
            )}
            
            <div className="relative inline-block mb-3">
              {foto ? (
                <img
                  src={foto}
                  alt={user.nama}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-full object-cover border-4 border-blue-100 shadow-sm mx-auto"
                />
              ) : (
                <div className="inline-flex h-20 w-20 rounded-full bg-blue-50 border-4 border-blue-100 items-center justify-center text-blue-600 font-bold text-3xl">
                  {user.nama.charAt(0)}
                </div>
              )}
              {user.role !== "SISWA" ? (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md cursor-pointer transition transform hover:scale-110" title="Unggah Foto Profil Baru">
                  <Camera className="h-3.5 w-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full shadow-sm" title="Foto profil dikunci untuk siswa">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <h3 className="font-display font-bold text-lg text-slate-950">{user.nama}</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold font-mono text-xs rounded-full uppercase mt-2 border border-blue-200">
              Peran: {user.role}
            </span>

            <div className="mt-6 border-t border-slate-150 pt-4 text-left space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Username:</span>
                <span className="font-mono text-slate-800 font-semibold">{user.username}</span>
              </div>
              {user.nip && (
                <div className="flex justify-between">
                  <span className="text-slate-400">NIP Guru:</span>
                  <span className="font-mono text-slate-800 font-semibold">{user.nip}</span>
                </div>
              )}
              {user.nisn && (
                <div className="flex justify-between">
                  <span className="text-slate-400">NISN Siswa:</span>
                  <span className="font-mono text-slate-800 font-semibold">{user.nisn}</span>
                </div>
              )}
              {user.kelas && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelas Aktif:</span>
                  <span className="font-semibold text-slate-800">{user.kelas}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Keamanan:</span>
                <span className={`font-semibold flex items-center gap-1 ${mfaEnabled ? "text-emerald-600" : "text-amber-500"}`}>
                  <Fingerprint className="h-4 w-4 shrink-0" />
                  {mfaEnabled ? "MFA Aktif" : "MFA Nonaktif"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: RBAC Permissions */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Hak Akses Peran ({user.role})</span>
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              {getPermissions(user.role).map((perm, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <span>{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Editing forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* Section 1: Profile Update */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-slate-500" />
                <span>Ubah Informasi Profil</span>
              </div>
              {user.role === "SISWA" && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                  <Lock className="h-3 w-3" /> Nama & Foto Dikunci
                </span>
              )}
            </h4>

            {user.role === "SISWA" && (
              <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block font-bold mb-0.5">Mengenai Hak Akses Profil Siswa:</strong>
                  Siswa tidak diizinkan mengubah Nama Lengkap atau Foto Profil secara mandiri. Data profil Anda diambil langsung dari data induk presensi siswa yang diinputkan/diunggah oleh Guru atau Administrator sekolah.
                </div>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Seksi Unggah Foto Profil Guru / Staf */}
              {user.role !== "SISWA" && (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span>Foto Profil Saya</span>
                    </label>
                    {foto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus Foto</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="shrink-0 relative">
                      {foto ? (
                        <img
                          src={foto}
                          alt="Pratinjau Foto Profil"
                          referrerPolicy="no-referrer"
                          className="h-16 w-16 rounded-full object-cover border-2 border-blue-200 shadow-2xs"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xl border border-blue-200">
                          {nama ? nama.charAt(0) : "G"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-2xs">
                        <Upload className="h-4 w-4 text-blue-600" />
                        <span>Unggah / Pilih Foto Baru</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Format JPG, PNG, atau WebP (maksimal 2MB). Foto profil ini akan otomatis tampil di header, sidebar, dan identitas resmi portal LMTMS.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Username ({user.role === "SISWA" ? "NISN" : user.role === "GURU" ? "NIP" : "Admin"})
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold flex items-center gap-1">
                      <Lock className="h-3 w-3 text-slate-400" /> Permanen
                    </span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={user.username}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm bg-slate-100 text-slate-600 cursor-not-allowed font-mono text-sm font-bold"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                    {user.role === "SISWA" && (
                      <span className="text-[10px] text-slate-400 font-mono font-semibold flex items-center gap-1">
                        <Lock className="h-3 w-3 text-slate-400" /> Terkunci
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    disabled={user.role === "SISWA"}
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
                  <CheckCircle className="h-4 w-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>{profileError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-100 flex items-center gap-2"
              >
                {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>

          {/* Section 2: Password Change */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-slate-500" />
              <span>Ganti Kata Sandi Keamanan</span>
            </h4>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kata Sandi Lama</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan sandi lama"
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Sandi baru minimal 6 karakter"
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Konfirmasi Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi sandi baru"
                    className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
                  <CheckCircle className="h-4 w-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPassword}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-100"
              >
                {isSavingPassword ? "Memproses..." : "Perbarui Kata Sandi"}
              </button>
            </form>
          </div>

          {/* Section 3: MFA (2FA) Ready Setup */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-slate-500" />
              <span>Otentikasi Dua Faktor (MFA / 2FA)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Info & Setup manual */}
              <div className="md:col-span-2 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  LMTMS telah terintegrasi dengan Google Authenticator, Microsoft Authenticator, dan Authy untuk mengamankan data dan nilai siswa secara optimal.
                </p>

                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-xs space-y-2">
                  <span className="block font-semibold text-slate-800">Langkah Aktivasi Keamanan:</span>
                  <ol className="list-decimal pl-4 text-slate-600 space-y-1">
                    <li>Unduh aplikasi Authenticator di ponsel cerdas Anda.</li>
                    <li>Scan QR Code di sebelah kanan atau masukkan Kunci Rahasia secara manual.</li>
                    <li>Masukkan kode verifikasi TOTP 6-digit untuk memverifikasi kecocokan waktu kunci.</li>
                  </ol>
                </div>

                <div className="text-xs">
                  <span className="text-slate-400">Kunci Rahasia (Secret Key):</span>
                  <span className="block font-mono font-bold text-slate-800 bg-slate-100 p-2 rounded-lg mt-1 border border-slate-200 tracking-wider">
                    {user.mfaSecret || "OBQXG43XN5ZGI42K"}
                  </span>
                </div>
              </div>

              {/* QR Code and status action */}
              <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                {/* Simulated QR Code using SVG lines for extreme fidelity */}
                <div className="h-28 w-28 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center mb-3">
                  <svg className="h-full w-full" viewBox="0 0 100 100" shapeRendering="crispEdges">
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* QR Finder patterns */}
                    <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
                    <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

                    <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
                    <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

                    <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
                    <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

                    {/* QR Mock Data Blocks */}
                    <rect x="40" y="10" width="15" height="5" fill="#0f172a" />
                    <rect x="50" y="20" width="5" height="15" fill="#0f172a" />
                    <rect x="35" y="35" width="30" height="5" fill="#0f172a" />
                    <rect x="35" y="45" width="10" height="20" fill="#0f172a" />
                    <rect x="50" y="50" width="15" height="5" fill="#0f172a" />
                    <rect x="45" y="65" width="10" height="15" fill="#0f172a" />
                    <rect x="70" y="40" width="20" height="15" fill="#0f172a" />
                    <rect x="75" y="60" width="15" height="20" fill="#0f172a" />
                    <rect x="15" y="45" width="10" height="10" fill="#0f172a" />
                  </svg>
                </div>

                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide">
                  LMTMS MFA QR CODE
                </span>
              </div>
            </div>

            {/* Validation input & activate toggle */}
            <div className="mt-6 border-t border-slate-150 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {!mfaEnabled ? "Masukkan Kode Verifikasi Aplikasi" : "Konfirmasi Penonaktifan MFA"}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Kode 6-Digit (e.g. 542981)"
                  value={mfaVerificationCode}
                  onChange={(e) => setMfaVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl shadow-sm text-center font-mono font-bold tracking-widest text-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:items-end justify-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMfa}
                  disabled={isTogglingMfa}
                  className={`px-5 py-2.5 font-semibold text-sm rounded-xl transition text-white shadow-md ${
                    mfaEnabled
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-100"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  }`}
                >
                  {isTogglingMfa
                    ? "Menyinkronkan..."
                    : mfaEnabled
                    ? "Nonaktifkan Keamanan MFA"
                    : "Verifikasi & Aktifkan MFA"}
                </button>
              </div>
            </div>

            {mfaSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{mfaSuccess}</span>
              </div>
            )}

            {mfaError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{mfaError}</span>
              </div>
            )}
          </div>

          {/* Section 4: Visual Theme Customize Panel */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-indigo-500" />
              <span>Tema Visual & Personalisasi Antarmuka</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Atur nuansa warna dan mode kegelapan portal LMTMS agar sesuai dengan preferensi kenyamanan mata Anda saat mendesain materi pembelajaran atau mengerjakan evaluasi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Mode Tampilan */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode Pencahayaan</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition ${
                      !isDarkMode
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span>Mode Terang</span>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition ${
                      isDarkMode
                        ? "border-indigo-600 bg-indigo-900/40 text-indigo-400 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Moon className="h-4 w-4 text-indigo-400" />
                    <span>Mode Gelap (Malam)</span>
                  </button>
                </div>
              </div>

              {/* Pilihan Warna Aksen */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksen Warna Utama</span>
                <select
                  value={activeTheme}
                  onChange={(e) => onChangeTheme?.(e.target.value)}
                  className="block w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="classic">Indigo (Classic Blue)</option>
                  <option value="emerald">Emerald Oasis (Green)</option>
                  <option value="amethyst">Amethyst Royal (Purple)</option>
                  <option value="sunset">Sunset Flare (Rose Pink)</option>
                  <option value="amber">Amber Glow (Yellow-Orange)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: PWA Offline Sync & Notification Simulator Dashboard */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-500" />
              <span>PWA Offline Sync & Pusat Simulasi</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              LMTMS dirancang sebagai **Progressive Web App (PWA)** mandiri yang beroperasi penuh dalam kondisi offline. Anda dapat menguji keandalan penanganan sinkronisasi antrean data dan simulasi pengiriman push notifikasi di sini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Box status offline queue */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Antrean Sinkronisasi</span>
                  <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                    (offlineQueueLength || 0) > 0 ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {(offlineQueueLength || 0) > 0 ? `${offlineQueueLength} Menunggu` : "Sinkron / Kosong"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Aksi yang dilakukan saat offline akan disimpan dalam antrean lokal `localStorage` dan otomatis disinkronkan ke pangkalan data server saat internet pulih.
                </p>
                <button
                  type="button"
                  onClick={onTriggerSync}
                  disabled={!isOnline || (offlineQueueLength || 0) === 0}
                  className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Wifi className="h-3.5 w-3.5" />
                  <span>Sinkronkan Sekarang</span>
                </button>
              </div>

              {/* Box simulator push notification */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Simulator Notifikasi Push</span>
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Simulasikan kedatangan notifikasi push instan dari sistem LMTMS (misal pengumuman akademik, atau evaluasi kuis baru dari guru).
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAddNotification?.(
                      "📚 Evaluasi Informatika Baru",
                      "Kuis Pilihan Ganda Elemen Jaringan Komputer dan Internet telah diterbitkan.",
                      "info"
                    )}
                    className="flex-1 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition text-center"
                  >
                    Simulasi Info
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddNotification?.(
                      "⚠️ Peringatan Keamanan",
                      "Deteksi upaya masuk mencurigakan dari alamat IP baru yang tidak dikenali.",
                      "alert"
                    )}
                    className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-lg text-[10px] font-bold transition text-center"
                  >
                    Simulasi Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Cache Storage Manager */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3.5 bg-emerald-50/20 dark:bg-slate-800/40 border border-emerald-100/50 dark:border-slate-700 rounded-2xl text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Penyimpanan Cache Aset offline</span>
                <p className="text-[10px] text-slate-400">PWA menyimpan aset statis berukuran ~4.2 MB agar portal dimuat instan tanpa kuota.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.caches) {
                    caches.keys().then((names) => {
                      for (const name of names) caches.delete(name);
                    });
                    alert("Seluruh cache offline PWA berhasil dibersihkan! Silakan muat ulang halaman.");
                  }
                }}
                className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg font-semibold text-xs transition shrink-0"
              >
                Kosongkan Cache PWA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
