import React, { useEffect, useState } from "react";
import { Activity, Search, RefreshCw, Filter, Calendar, Shield } from "lucide-react";
import { User } from "../types";

interface LogItem {
  id: string;
  userId: string;
  nama: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

interface LogsViewProps {
  user: User;
}

export const LogsView: React.FC<LogsViewProps> = ({ user }) => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [filterRole, setFilterRole] = useState("ALL");

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/activity-logs", {
        headers: {
          "x-user-role": user.role
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
        setFilteredLogs(data);
      }
    } catch (error) {
      console.error("Gagal memuat log aktivitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let result = logs;

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.nama.toLowerCase().includes(s) ||
          l.action.toLowerCase().includes(s) ||
          l.details.toLowerCase().includes(s) ||
          l.ip.toLowerCase().includes(s)
      );
    }

    if (filterAction !== "ALL") {
      result = result.filter((l) => l.action === filterAction);
    }

    if (filterRole !== "ALL") {
      result = result.filter((l) => l.role === filterRole);
    }

    setFilteredLogs(result);
  }, [searchTerm, filterAction, filterRole, logs]);

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "LOGIN_FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "UPDATE_PASSWORD":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "UPDATE_PROFILE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "TOGGLE_MFA":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CREATE_PERANGKAT":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "SUBMIT_TUGAS":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 font-sans" id="logs-view-root">
      {/* Jumbotron Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg border border-slate-700">
        <div className="max-w-3xl flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight">Audit Trail & Log Aktivitas Sistem</h2>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              Catatan komprehensif seluruh aktivitas sistem, akses otentikasi, administrasi guru, dan pengumpulan tugas siswa untuk kepatuhan administrasi dan keamanan siber sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4" id="logs-controls">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari log atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='grey' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'></path></svg>")`, paddingRight: "1.75rem", backgroundSize: "1.25rem" }}
            >
              <option value="ALL">Semua Aksi</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat bg-right"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='grey' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'></path></svg>")`, paddingRight: "1.75rem", backgroundSize: "1.25rem" }}
            >
              <option value="ALL">Semua Peran</option>
              <option value="ADMIN">ADMIN</option>
              <option value="GURU">GURU</option>
              <option value="SISWA">SISWA</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl transition flex items-center gap-2 justify-center shrink-0"
          id="btn-refresh-logs"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="logs-table-container">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm">Memuat riwayat aktivitas audit...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Activity className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium">Tidak ada rekaman log yang cocok dengan filter Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Waktu Server</th>
                  <th className="py-3 px-5">Pengguna</th>
                  <th className="py-3 px-4">Peran</th>
                  <th className="py-3 px-4">Aktivitas (Aksi)</th>
                  <th className="py-3 px-5">Deskripsi Rincian</th>
                  <th className="py-3 px-4">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-5 whitespace-nowrap text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                      })}
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-800">{log.nama}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        log.role === "ADMIN" ? "bg-red-50 text-red-600 border border-red-100" :
                        log.role === "GURU" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        log.role === "SISWA" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        "bg-slate-50 text-slate-500"
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500 max-w-xs md:max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-150 flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong>{filteredLogs.length}</strong> entri dari total {logs.length} audit logs.</span>
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-blue-500" />
            Keamanan Database ISO 27001 Ready
          </span>
        </div>
      </div>
    </div>
  );
};
