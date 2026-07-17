import { Request, Response } from "express";
import { readDB, writeDB } from "../db";

export const getMateri = (req: Request, res: Response) => {
  const { kelas, elemen, tahunPelajaranId } = req.query;
  const db = readDB();
  let list = db.materis || [];

  // MULTI TAHUN: Filter by academic year
  if (tahunPelajaranId) {
    list = list.filter((m: any) => m.tahunPelajaranId === tahunPelajaranId);
  } else {
    // Default fallback to active academic year
    const activeYear = (db.years || []).find((y: any) => y.aktif);
    if (activeYear) {
      list = list.filter((m: any) => m.tahunPelajaranId === activeYear.id);
    }
  }

  if (kelas) list = list.filter((m: any) => m.kelas === kelas);
  if (elemen) list = list.filter((m: any) => m.elemen === elemen);

  res.json(list);
};

export const createMateri = (req: Request, res: Response) => {
  const {
    judul,
    deskripsi,
    konten,
    elemen,
    kelas,
    lampiranUrl,
    tahunPelajaranId,
    tipe,
    fileNama,
    fileTipe,
    fileUkuran,
    fileData
  } = req.body;

  const db = readDB();

  let targetYearId = tahunPelajaranId;
  if (!targetYearId) {
    const activeYear = (db.years || []).find((y: any) => y.aktif);
    targetYearId = activeYear ? activeYear.id : "tp-2";
  }

  if (!judul || !deskripsi || !elemen || !kelas || !targetYearId) {
    return res.status(400).json({ success: false, message: "Judul, deskripsi, elemen, dan kelas wajib diisi." });
  }

  const resolvedTipe = tipe || "TEKS";
  const resolvedKonten = konten || (resolvedTipe === "FILE" ? `Materi Berupa File Lampiran: ${fileNama || ""}` : `Materi Berupa Tautan Link: ${lampiranUrl || ""}`);

  const newMateri = {
    id: `mat-${Date.now()}`,
    judul,
    deskripsi,
    konten: resolvedKonten,
    elemen,
    kelas,
    lampiranUrl,
    tahunPelajaranId: targetYearId,
    tanggalDibuat: new Date().toISOString().split("T")[0],
    tipe: resolvedTipe,
    fileNama,
    fileTipe,
    fileUkuran,
    fileData
  };

  if (!db.materis) db.materis = [];
  db.materis.push(newMateri);
  writeDB(db);
  res.json({ success: true, data: newMateri });
};

export const deleteMateri = (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDB();
  const index = (db.materis || []).findIndex((m: any) => m.id === id);
  if (index !== -1) {
    db.materis.splice(index, 1);
    writeDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: "Materi tidak ditemukan." });
};
