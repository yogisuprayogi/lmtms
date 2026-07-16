import { Request, Response } from "express";
import { readDB, writeDB } from "../db";

export const getAbsensi = (req: Request, res: Response) => {
  const { tanggal, kelas, tahunPelajaranId } = req.query;
  const db = readDB();
  let list = db.absensis || [];

  // MULTI TAHUN: Filter by academic year
  if (tahunPelajaranId) {
    list = list.filter((a: any) => a.tahunPelajaranId === tahunPelajaranId);
  } else {
    // Default fallback to active academic year
    const activeYear = (db.years || []).find((y: any) => y.aktif);
    if (activeYear) {
      list = list.filter((a: any) => a.tahunPelajaranId === activeYear.id);
    }
  }

  if (tanggal) list = list.filter((a: any) => a.tanggal === tanggal);
  if (kelas) list = list.filter((a: any) => a.kelas === kelas);

  res.json(list);
};

export const simpanAbsensi = (req: Request, res: Response) => {
  const { tanggal, kelas, dataAbsensi, tahunPelajaranId } = req.body;
  if (!tanggal || !kelas || !dataAbsensi || !tahunPelajaranId) {
    return res.status(400).json({ success: false, message: "Parameter absensi tidak lengkap." });
  }

  const db = readDB();
  if (!db.absensis) db.absensis = [];

  // Remove existing entries for the same date & class & academic year to avoid duplicates
  db.absensis = db.absensis.filter(
    (a: any) => !(a.tanggal === tanggal && a.kelas === kelas && a.tahunPelajaranId === tahunPelajaranId)
  );

  dataAbsensi.forEach((item: any) => {
    db.absensis.push({
      id: `abs-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      tanggal,
      kelas,
      siswaId: item.siswaId,
      siswaNama: item.siswaNama,
      status: item.status || "HADIR",
      catatan: item.catatan || "",
      tahunPelajaranId,
    });
  });

  writeDB(db);
  res.json({ success: true, message: "Absensi berhasil disimpan." });
};
