import React from "react";
import {
  GraduationCap,
  UserCheck,
  CheckSquare,
  Award,
  Activity,
  Layers,
  BookMarked
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Analitika, ELEMEN_INFORMATIKA, User } from "../types";

interface AnalitikaViewProps {
  user: User;
  analitika: Analitika;
}

export const AnalitikaView: React.FC<AnalitikaViewProps> = ({ user, analitika }) => {
  return (
    <div className="space-y-6" id="analitika-view-container">
      {/* Jumbotron Selamat Datang */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-slate-800" id="welcome-jumbotron">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
          <GraduationCap className="h-72 w-72" />
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 font-semibold px-3 py-1 rounded-full text-xs tracking-wide uppercase">
            Kurikulum Merdeka Mandiri Berbagi
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mt-3 mb-2 tracking-tight">
            Sistem Pembelajaran Informatika Terpadu SMA
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Selamat datang di LMTMS, {user.nama}. Platform terpadu untuk penyusunan Alur Tujuan Pembelajaran (ATP), Modul Ajar, pencatatan presensi, hingga monitoring kognitif pencapaian elemen Informatika secara real-time.
          </p>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="kpi-stats-grid">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow transition flex items-center gap-4" id="kpi-card-presensi">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presensi Kelas Rata-Rata</p>
            <h3 className="text-2xl font-display font-bold text-slate-800 mt-1">{analitika.kehadiranRataRata}%</h3>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow transition flex items-center gap-4" id="kpi-card-tugas">
          <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepatuhan Tugas Siswa</p>
            <h3 className="text-2xl font-display font-bold text-slate-800 mt-1">{analitika.tugasDiselesaikan}%</h3>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow transition flex items-center gap-4" id="kpi-card-nilai">
          <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai Kognitif Rerata</p>
            <h3 className="text-2xl font-display font-bold text-slate-800 mt-1">{analitika.nilaiRataRata} / 100</h3>
          </div>
        </div>
      </div>

      {/* ANALYTICS CHARTS (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="analytics-charts-grid">
        {/* Chart 1: Distribusi Nilai */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm" id="chart-distribusi-nilai">
          <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <span>Distribusi Capaian Nilai Siswa</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analitika.distribusiNilai}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="rentang" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="jumlah" name="Jumlah Siswa" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Capaian per Elemen Informatika */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm" id="chart-capaian-elemen">
          <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            <span>Kinerja Rata-Rata per Elemen Informatika</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analitika.pencapaianElemen}>
                <PolarGrid />
                <PolarAngleAxis dataKey="elemen" tick={{ fontSize: 12, fontWeight: "bold" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Skor Kognitif" dataKey="nilai" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Elemen Kurikulum Merdeka Card & Deskripsi */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm" id="elemen-pembelajaran-card">
        <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-blue-500" />
          <span>8 Elemen Capaian Pembelajaran Informatika SMA</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="elemen-cards-grid">
          {ELEMEN_INFORMATIKA.map((el) => (
            <div key={el.kode} className="p-4 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-xl transition" id={`elemen-card-${el.kode}`}>
              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold font-mono">
                {el.kode}
              </span>
              <h4 className="font-display font-bold text-sm text-slate-800 mt-2">{el.nama}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-3">{el.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
