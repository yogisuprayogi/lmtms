import { Request, Response } from "express";
import { readDB, writeDB, addActivityLog } from "../db";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username dan password wajib diisi." });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());

  if (user) {
    const isCorrectPassword = user.password 
      ? password === user.password 
      : (password === user.username || password === user.nisn || password === user.nip || password === "admin123");

    if (isCorrectPassword) {
      // Log successful login
      addActivityLog(user.id, user.nama, user.role, "LOGIN", "Otentikasi berhasil via Portal LMTMS.", req.ip);
      return res.json({ success: true, user });
    }
  }

  // Log failed login
  addActivityLog("unauthenticated", username, "UNKNOWN", "LOGIN_FAILED", `Gagal melakukan login. Percobaan username: ${username}`, req.ip);

  return res.status(401).json({
    success: false,
    message: "Kredensial salah. Gunakan NIP untuk Guru / NISN untuk Siswa (misal Guru Yogi Suprayogi: 197912302022211006)"
  });
};

export const getUsers = (req: Request, res: Response) => {
  const { role, kelas } = req.query;
  const db = readDB();
  let list = db.users || [];
  if (role) list = list.filter((u: any) => u.role === role);
  if (kelas) list = list.filter((u: any) => u.kelas === kelas);
  res.json(list);
};

export const updateProfile = (req: Request, res: Response) => {
  const { userId, nama, email, foto } = req.body;
  const userRole = req.headers["x-user-role"] as string;

  if (!userId || !email) {
    return res.status(400).json({ success: false, message: "Data profil tidak lengkap." });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  const oldUser = db.users[userIndex];

  // Kebijakan: Jika pengguna adalah SISWA, nama dan foto profil dikunci (diambil dari data presensi/induk yang diunggah Guru)
  let updatedNama = nama;
  let updatedFoto = foto !== undefined ? foto : oldUser.foto;

  if (oldUser.role === "SISWA") {
    updatedNama = oldUser.nama; // Tetapkan nama awal dari Guru/Admin
    if (userRole === "SISWA") {
      updatedFoto = oldUser.foto; // Tetapkan foto dari Guru/Admin
    }
  }

  db.users[userIndex] = {
    ...oldUser,
    nama: updatedNama || oldUser.nama,
    email: email || oldUser.email,
    foto: updatedFoto
  };

  writeDB(db);

  // Log profile update
  addActivityLog(userId, db.users[userIndex].nama, oldUser.role, "UPDATE_PROFILE", `Memperbarui detail profil (Email: ${email}).`, req.ip);

  res.json({ success: true, user: db.users[userIndex] });
};

export const resetStudentPassword = (req: Request, res: Response) => {
  const { studentId, newPassword, teacherId, teacherName } = req.body;
  const requestingRole = req.headers["x-user-role"] as string;

  if (requestingRole !== "GURU" && requestingRole !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Akses ditolak. Hanya Guru dan Admin yang dapat melakukan reset password siswa." });
  }

  if (!studentId) {
    return res.status(400).json({ success: false, message: "ID siswa wajib disertakan." });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === studentId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Siswa tidak ditemukan." });
  }

  const student = db.users[userIndex];
  const targetPassword = newPassword || student.nisn || student.username;

  db.users[userIndex].password = targetPassword;
  writeDB(db);

  addActivityLog(
    teacherId || "usr-guru",
    teacherName || "Guru",
    requestingRole,
    "RESET_STUDENT_PASSWORD",
    `Melakukan reset password siswa ${student.nama} (${student.username}) ke kata sandi baru/default.`,
    req.ip
  );

  return res.json({
    success: true,
    message: `Kata sandi siswa ${student.nama} berhasil direset! Kata sandi baru: ${targetPassword}`,
    password: targetPassword,
    student: db.users[userIndex]
  });
};

export const updatePassword = (req: Request, res: Response) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Password lama dan baru wajib diisi." });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  const user = db.users[userIndex];
  const isCorrect = user.password ? user.password === currentPassword : (currentPassword === `${user.username}123` || currentPassword === "admin123" || currentPassword === "yogi123");

  if (!isCorrect) {
    return res.status(400).json({ success: false, message: "Kata sandi lama tidak sesuai." });
  }

  db.users[userIndex].password = newPassword;
  writeDB(db);

  // Log password change
  addActivityLog(userId, user.nama, user.role, "UPDATE_PASSWORD", "Mengubah kata sandi akun keamanan.", req.ip);

  res.json({ success: true, message: "Kata sandi berhasil diperbarui!" });
};

export const toggleMfa = (req: Request, res: Response) => {
  const { userId, enabled } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID wajib disertakan." });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  const user = db.users[userIndex];
  db.users[userIndex].mfaEnabled = enabled;
  writeDB(db);

  // Log MFA toggle
  addActivityLog(userId, user.nama, user.role, "TOGGLE_MFA", `${enabled ? "Mengaktifkan" : "Menonaktifkan"} otentikasi dua faktor (MFA/2FA).`, req.ip);

  res.json({ success: true, user: db.users[userIndex], message: `Otentikasi dua faktor (MFA) berhasil ${enabled ? "diaktifkan" : "dinonaktifkan"}!` });
};

export const getActivityLogs = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.activityLogs || []);
};
