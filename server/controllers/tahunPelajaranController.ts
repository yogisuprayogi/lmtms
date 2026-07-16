import { Request, Response } from "express";
import { readDB, writeDB } from "../db";

export const getTahunPelajaran = (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.years || []);
};

export const createTahunPelajaran = (req: Request, res: Response) => {
  const { tahun, semester } = req.body;
  if (!tahun || !semester) {
    return res.status(400).json({ success: false, message: "Tahun dan semester wajib diisi." });
  }

  const db = readDB();
  const newYear = {
    id: `tp-${Date.now()}`,
    tahun,
    semester,
    aktif: false,
  };
  if (!db.years) db.years = [];
  db.years.push(newYear);
  writeDB(db);
  res.json({ success: true, year: newYear });
};

export const aktifkanTahunPelajaran = (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: "ID Tahun pelajaran wajib ditentukan." });
  }

  const db = readDB();
  db.years = (db.years || []).map((y: any) => ({
    ...y,
    aktif: y.id === id,
  }));
  writeDB(db);
  res.json({ success: true, years: db.years });
};
