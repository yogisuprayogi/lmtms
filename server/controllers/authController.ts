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
      : (password === `${username}123` || password === "admin123" || password === "yogi123");

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
    message: "Kredensial salah. Gunakan username terdaftar (misal: yogi / yogi123, ahmad / ahmad123)"
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
  const { userId, nama, email } = req.body;
  if (!userId || !nama || !email) {
    return res.status(400).json({ success: false, message: "Data profil tidak lengkap." });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  const oldUser = db.users[userIndex];
  db.users[userIndex] = {
    ...oldUser,
    nama,
    email,
  };

  writeDB(db);

  // Log profile update
  addActivityLog(userId, nama, oldUser.role, "UPDATE_PROFILE", `Memperbarui detail profil (Email: ${email}, Nama: ${nama}).`, req.ip);

  res.json({ success: true, user: db.users[userIndex] });
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
