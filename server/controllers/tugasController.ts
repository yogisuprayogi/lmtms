import { Request, Response } from "express";
import { readDB, writeDB } from "../db";

export const getTugas = (req: Request, res: Response) => {
  const { kelas, elemen, tahunPelajaranId } = req.query;
  const db = readDB();
  let list = db.tugases || [];

  // MULTI TAHUN: Filter by academic year
  if (tahunPelajaranId) {
    list = list.filter((t: any) => t.tahunPelajaranId === tahunPelajaranId);
  } else {
    // Default fallback to active academic year
    const activeYear = (db.years || []).find((y: any) => y.aktif);
    if (activeYear) {
      list = list.filter((t: any) => t.tahunPelajaranId === activeYear.id);
    }
  }

  if (kelas) list = list.filter((t: any) => t.kelas === kelas);
  if (elemen) list = list.filter((t: any) => t.elemen === elemen);

  res.json(list);
};

export const createTugas = (req: Request, res: Response) => {
  const { judul, instruksi, elemen, kelas, deadline, totalPoin, tipe, soalKuis, tahunPelajaranId } = req.body;
  if (!judul || !instruksi || !elemen || !kelas || !deadline || !tahunPelajaranId) {
    return res.status(400).json({ success: false, message: "Semua field utama wajib diisi." });
  }

  const db = readDB();
  const newTugas = {
    id: `tug-${Date.now()}`,
    judul,
    instruksi,
    elemen,
    kelas,
    deadline,
    totalPoin: Number(totalPoin) || 100,
    tipe,
    soalKuis: tipe === "KUIS" ? soalKuis : undefined,
    tahunPelajaranId,
  };

  if (!db.tugases) db.tugases = [];
  db.tugases.push(newTugas);
  writeDB(db);
  res.json({ success: true, data: newTugas });
};

export const getSubmissions = (req: Request, res: Response) => {
  const { siswaId, tugasId } = req.query;
  const db = readDB();
  let list = db.pengumpulanTugases || [];
  if (siswaId) list = list.filter((p: any) => p.siswaId === siswaId);
  if (tugasId) list = list.filter((p: any) => p.tugasId === tugasId);
  res.json(list);
};

export const submitTugas = (req: Request, res: Response) => {
  const { tugasId, siswaId, siswaNama, jawabanSiswa } = req.body;
  if (!tugasId || !siswaId || !siswaNama || !jawabanSiswa) {
    return res.status(400).json({ success: false, message: "Data pengumpulan tugas tidak lengkap." });
  }

  const db = readDB();
  const tugas = (db.tugases || []).find((t: any) => t.id === tugasId);
  if (!tugas) {
    return res.status(404).json({ success: false, message: "Tugas tidak ditemukan." });
  }

  const existingSubmissionIdx = (db.pengumpulanTugases || []).findIndex(
    (p: any) => p.tugasId === tugasId && p.siswaId === siswaId
  );

  let score: number | undefined = undefined;
  let status: "BELUM_DINILAI" | "SELESAI" = "BELUM_DINILAI";

  // Auto-calculate for quizzes
  if (tugas.tipe === "KUIS" && tugas.soalKuis) {
    const jawabanUser = typeof jawabanSiswa === "string" ? JSON.parse(jawabanSiswa) : jawabanSiswa;
    let benar = 0;
    tugas.soalKuis.forEach((soal: any) => {
      if (jawabanUser[soal.id] === soal.jawabanBenar) {
        benar++;
      }
    });
    score = Math.round((benar / tugas.soalKuis.length) * 100);
    status = "SELESAI";
  }

  const submission = {
    id: `peng-${Date.now()}`,
    tugasId,
    siswaId,
    siswaNama,
    jawabanSiswa: typeof jawabanSiswa === "object" ? JSON.stringify(jawabanSiswa) : jawabanSiswa,
    nilai: score,
    catatanGuru: status === "SELESAI" ? "Kuis dinilai otomatis oleh sistem LMTMS." : "",
    tanggalDikumpul: new Date().toISOString(),
    status,
  };

  if (!db.pengumpulanTugases) db.pengumpulanTugases = [];

  if (existingSubmissionIdx !== -1) {
    db.pengumpulanTugases[existingSubmissionIdx] = submission;
  } else {
    db.pengumpulanTugases.push(submission);
  }

  writeDB(db);
  res.json({ success: true, data: submission });
};

export const gradeSubmission = (req: Request, res: Response) => {
  const { id, nilai, catatanGuru } = req.body;
  if (!id || nilai === undefined) {
    return res.status(400).json({ success: false, message: "ID pengumpulan dan nilai wajib diberikan." });
  }

  const db = readDB();
  const index = (db.pengumpulanTugases || []).findIndex((p: any) => p.id === id);

  if (index !== -1) {
    db.pengumpulanTugases[index] = {
      ...db.pengumpulanTugases[index],
      nilai: Number(nilai),
      catatanGuru: catatanGuru || "",
      status: "SELESAI",
    };
    writeDB(db);
    return res.json({ success: true, data: db.pengumpulanTugases[index] });
  }
  res.status(404).json({ success: false, message: "Pengumpulan tidak ditemukan." });
};
