import { Request, Response } from "express";
import { readDB, writeDB, addActivityLog } from "../db";

// ==========================================
// 1. MANAJEMEN PENGGUNA (GURU & SISWA)
// ==========================================

export const createUser = (req: Request, res: Response) => {
  const { username, nama, email, role, nip, nisn, kelas, password } = req.body;
  if (!username || !nama || !email || !role || !password) {
    return res.status(400).json({ success: false, message: "Kredensial dasar wajib diisi." });
  }

  const db = readDB();
  const exists = db.users.find(
    (u: any) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ success: false, message: "Username atau email sudah terdaftar." });
  }

  const newUser: any = {
    id: `usr-${Date.now()}`,
    username,
    nama,
    email,
    role,
    password,
    mfaEnabled: false,
    mfaSecret: Math.random().toString(36).substring(2, 12).toUpperCase(),
  };

  if (role === "GURU") {
    newUser.nip = nip || "19900101000000000";
  } else if (role === "SISWA") {
    newUser.nisn = nisn || "0080000000";
    newUser.kelas = kelas || "X-1";
  }

  db.users.push(newUser);
  writeDB(db);

  // Log activity
  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "CREATE_USER", `Membuat pengguna baru: ${nama} (${role})`, req.ip);

  res.json({ success: true, user: newUser });
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, email, nip, nisn, kelas, password } = req.body;

  const db = readDB();
  const index = db.users.findIndex((u: any) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  const oldUser = db.users[index];
  const updatedUser = {
    ...oldUser,
    nama: nama || oldUser.nama,
    email: email || oldUser.email,
    password: password || oldUser.password,
  };

  if (oldUser.role === "GURU") {
    updatedUser.nip = nip || oldUser.nip;
  } else if (oldUser.role === "SISWA") {
    updatedUser.nisn = nisn || oldUser.nisn;
    updatedUser.kelas = kelas || oldUser.kelas;
  }

  db.users[index] = updatedUser;
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_USER", `Mengedit detail akun pengguna: ${nama}`, req.ip);

  res.json({ success: true, user: updatedUser });
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();

  const user = db.users.find((u: any) => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  }

  if (id === "usr-admin" || id === "usr-yogi") {
    return res.status(400).json({ success: false, message: "Akun sistem bawaan tidak dapat dihapus." });
  }

  db.users = db.users.filter((u: any) => u.id !== id);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "DELETE_USER", `Menghapus akun pengguna: ${user.nama} (${user.role})`, req.ip);

  res.json({ success: true, message: "Pengguna berhasil dihapus." });
};


// ==========================================
// 2. ROMBONGAN BELAJAR (ROMBEL)
// ==========================================

export const getRombels = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.rombels || []);
};

export const createRombel = (req: Request, res: Response) => {
  const { nama, tingkat, waliKelasId } = req.body;
  if (!nama || !tingkat) {
    return res.status(400).json({ success: false, message: "Nama rombel dan tingkat wajib diisi." });
  }

  const db = readDB();
  const exists = db.rombels.find((r: any) => r.nama.toLowerCase() === nama.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: "Nama rombel sudah terdaftar." });
  }

  const newRombel = {
    id: `rom-${Date.now()}`,
    nama,
    tingkat,
    waliKelasId: waliKelasId || "",
  };

  db.rombels.push(newRombel);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "CREATE_ROMBEL", `Membuat Rombel baru: ${nama}`, req.ip);

  res.json({ success: true, rombel: newRombel });
};

export const updateRombel = (req: Request, res: Response) => {
  const { id } = req.params;
  const { nama, tingkat, waliKelasId } = req.body;

  const db = readDB();
  const index = db.rombels.findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Rombel tidak ditemukan." });
  }

  db.rombels[index] = {
    ...db.rombels[index],
    nama: nama || db.rombels[index].nama,
    tingkat: tingkat || db.rombels[index].tingkat,
    waliKelasId: waliKelasId !== undefined ? waliKelasId : db.rombels[index].waliKelasId,
  };

  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_ROMBEL", `Mengedit detail rombel: ${nama}`, req.ip);

  res.json({ success: true, rombel: db.rombels[index] });
};

export const deleteRombel = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();

  const rombel = db.rombels.find((r: any) => r.id === id);
  if (!rombel) {
    return res.status(404).json({ success: false, message: "Rombel tidak ditemukan." });
  }

  db.rombels = db.rombels.filter((r: any) => r.id !== id);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "DELETE_ROMBEL", `Menghapus rombel: ${rombel.nama}`, req.ip);

  res.json({ success: true, message: "Rombel berhasil dihapus." });
};


// ==========================================
// 3. JADWAL MATA PELAJARAN (JADWAL)
// ==========================================

export const getJadwals = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.jadwals || []);
};

export const createJadwal = (req: Request, res: Response) => {
  const { hari, jam, kelas, mapel, guruId } = req.body;
  if (!hari || !jam || !kelas || !mapel || !guruId) {
    return res.status(400).json({ success: false, message: "Detail jadwal wajib dilengkapi." });
  }

  const db = readDB();
  const newJadwal = {
    id: `jad-${Date.now()}`,
    hari,
    jam,
    kelas,
    mapel,
    guruId,
  };

  db.jadwals.push(newJadwal);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "CREATE_JADWAL", `Menambahkan jadwal baru: ${mapel} di kelas ${kelas} (${hari})`, req.ip);

  res.json({ success: true, jadwal: newJadwal });
};

export const updateJadwal = (req: Request, res: Response) => {
  const { id } = req.params;
  const { hari, jam, kelas, mapel, guruId } = req.body;

  const db = readDB();
  const index = db.jadwals.findIndex((j: any) => j.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Jadwal tidak ditemukan." });
  }

  db.jadwals[index] = {
    ...db.jadwals[index],
    hari: hari || db.jadwals[index].hari,
    jam: jam || db.jadwals[index].jam,
    kelas: kelas || db.jadwals[index].kelas,
    mapel: mapel || db.jadwals[index].mapel,
    guruId: guruId || db.jadwals[index].guruId,
  };

  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_JADWAL", `Mengedit jadwal: ${mapel} kelas ${kelas}`, req.ip);

  res.json({ success: true, jadwal: db.jadwals[index] });
};

export const deleteJadwal = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();

  const jadwal = db.jadwals.find((j: any) => j.id === id);
  if (!jadwal) {
    return res.status(404).json({ success: false, message: "Jadwal tidak ditemukan." });
  }

  db.jadwals = db.jadwals.filter((j: any) => j.id !== id);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "DELETE_JADWAL", `Menghapus jadwal ${jadwal.mapel} kelas ${jadwal.kelas}`, req.ip);

  res.json({ success: true, message: "Jadwal berhasil dihapus." });
};


// ==========================================
// 4. KALENDER AKADEMIK (CALENDAR EVENTS)
// ==========================================

export const getCalendarEvents = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.calendarEvents || []);
};

export const createCalendarEvent = (req: Request, res: Response) => {
  const { tanggal, judul, jenis } = req.body;
  if (!tanggal || !judul || !jenis) {
    return res.status(400).json({ success: false, message: "Tanggal, judul, dan jenis acara wajib diisi." });
  }

  const db = readDB();
  const newEvent = {
    id: `cal-${Date.now()}`,
    tanggal,
    judul,
    jenis,
  };

  db.calendarEvents.push(newEvent);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "CREATE_CALENDAR", `Menambahkan agenda kalender: ${judul} (${tanggal})`, req.ip);

  res.json({ success: true, event: newEvent });
};

export const updateCalendarEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  const { tanggal, judul, jenis } = req.body;

  const db = readDB();
  const index = db.calendarEvents.findIndex((c: any) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Agenda kalender tidak ditemukan." });
  }

  db.calendarEvents[index] = {
    ...db.calendarEvents[index],
    tanggal: tanggal || db.calendarEvents[index].tanggal,
    judul: judul || db.calendarEvents[index].judul,
    jenis: jenis || db.calendarEvents[index].jenis,
  };

  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_CALENDAR", `Mengubah agenda kalender: ${judul}`, req.ip);

  res.json({ success: true, event: db.calendarEvents[index] });
};

export const deleteCalendarEvent = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();

  const event = db.calendarEvents.find((c: any) => c.id === id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Agenda kalender tidak ditemukan." });
  }

  db.calendarEvents = db.calendarEvents.filter((c: any) => c.id !== id);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "DELETE_CALENDAR", `Menghapus agenda kalender: ${event.judul}`, req.ip);

  res.json({ success: true, message: "Agenda kalender berhasil dihapus." });
};


// ==========================================
// 5. MAPPING GURU (GURU MAPPING)
// ==========================================

export const getGuruMappings = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.guruMappings || []);
};

export const createGuruMapping = (req: Request, res: Response) => {
  const { guruId, kelas, elemen } = req.body;
  if (!guruId || !kelas || !elemen) {
    return res.status(400).json({ success: false, message: "Guru, kelas, dan elemen kompetensi wajib diisi." });
  }

  const db = readDB();
  const exists = db.guruMappings.find((m: any) => m.guruId === guruId && m.kelas === kelas && m.elemen === elemen);
  if (exists) {
    return res.status(400).json({ success: false, message: "Pemetaan guru tersebut sudah ada." });
  }

  const newMapping = {
    id: `gmap-${Date.now()}`,
    guruId,
    kelas,
    elemen,
  };

  db.guruMappings.push(newMapping);
  writeDB(db);

  const guru = db.users.find((u: any) => u.id === guruId);
  const guruNama = guru ? guru.nama : "Guru";

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "CREATE_MAPPING", `Menambahkan pemetaan mengajar: ${guruNama} pada kelas ${kelas} (Elemen: ${elemen})`, req.ip);

  res.json({ success: true, mapping: newMapping });
};

export const updateGuruMapping = (req: Request, res: Response) => {
  const { id } = req.params;
  const { guruId, kelas, elemen } = req.body;

  const db = readDB();
  const index = db.guruMappings.findIndex((m: any) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Pemetaan tidak ditemukan." });
  }

  db.guruMappings[index] = {
    ...db.guruMappings[index],
    guruId: guruId || db.guruMappings[index].guruId,
    kelas: kelas || db.guruMappings[index].kelas,
    elemen: elemen || db.guruMappings[index].elemen,
  };

  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_MAPPING", `Mengubah pemetaan mengajar guru`, req.ip);

  res.json({ success: true, mapping: db.guruMappings[index] });
};

export const deleteGuruMapping = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();

  const mapping = db.guruMappings.find((m: any) => m.id === id);
  if (!mapping) {
    return res.status(404).json({ success: false, message: "Pemetaan tidak ditemukan." });
  }

  db.guruMappings = db.guruMappings.filter((m: any) => m.id !== id);
  writeDB(db);

  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "DELETE_MAPPING", `Menghapus pemetaan mengajar guru`, req.ip);

  res.json({ success: true, message: "Pemetaan berhasil dihapus." });
};

export const getIdentitasSekolah = (req: Request, res: Response) => {
  const db = readDB();
  res.json({ success: true, identitas: db.identitasSekolah });
};

export const updateIdentitasSekolah = (req: Request, res: Response) => {
  const { nama, npsn, alamat, kepalaSekolah, logo } = req.body;
  const db = readDB();
  
  db.identitasSekolah = {
    nama: nama || "SMAN 1 Informatika",
    npsn: npsn || "20103241",
    alamat: alamat || "Jl. Core IT No. 102, Silicon Valley",
    kepalaSekolah: kepalaSekolah || "Yogi Suprayogi, S.Kom.",
    logo: logo !== undefined ? logo : (db.identitasSekolah?.logo || "")
  };
  
  writeDB(db);
  
  addActivityLog("usr-admin", "Administrator LMTMS", "ADMIN", "UPDATE_IDENTITAS_SEKOLAH", `Memperbarui Identitas Sekolah: ${db.identitasSekolah.nama}`, req.ip);
  
  res.json({ success: true, identitas: db.identitasSekolah });
};
