import React from "react";
import { Clock } from "lucide-react";
import { User, TahunPelajaran } from "../types";

interface HeaderProps {
  user: User;
  activeYear: TahunPelajaran | null;
}

export const Header: React.FC<HeaderProps> = ({ user, activeYear }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 no-print" id="app-top-header">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-slate-500">
          Tahun Pelajaran:{" "}
          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md font-semibold text-xs font-mono ml-1.5" id="active-academic-year-badge">
            {activeYear ? `${activeYear.tahun} ${activeYear.semester}` : "Memuat..."}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5" id="server-session-indicator">
          <Clock className="h-3.5 w-3.5" />
          <span>Sesi Server: Aktif (2026)</span>
        </div>
        {user.role === "SISWA" && (
          <span className="bg-blue-50 text-blue-700 font-bold border border-blue-100 px-3 py-1 rounded-md text-xs" id="student-class-badge">
            Kelas: {user.kelas}
          </span>
        )}
      </div>
    </header>
  );
};
