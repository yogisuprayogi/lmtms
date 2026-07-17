import React, { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { User, Materi, ELEMEN_INFORMATIKA } from "../types";

interface MateriViewProps {
  user: User;
  materiList: Materi[];
  onAddMateri: (materi: Materi) => void;
  onDeleteMateri: (id: string) => void;
}

export const MateriView: React.FC<MateriViewProps> = ({
  user,
  materiList,
  onAddMateri,
  onDeleteMateri,
}) => {
  const [isCreatingMateri, setIsCreatingMateri] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [materiForm, setMateriForm] = useState({
    judul: "",
    deskripsi: "",
    elemen: "BK",
    kelas: "X" as "X" | "XI" | "XII",
    konten: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch("/api/materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materiForm),
      });
      const data = await res.json();
      if (data.success) {
        onAddMateri(data.data);
        setIsCreatingMateri(false);
        setSelectedMateri(data.data);
        setMateriForm({ judul: "", deskripsi: "", elemen: "BK", kelas: "X", konten: "" });
      } else {
        setErrorMsg(data.message || "Gagal menerbitkan materi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menghubungi server.");
    }
  };

  const handleDeleteMateri = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
    try {
      const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onDeleteMateri(id);
        if (selectedMateri?.id === id) setSelectedMateri(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatMarkdown = (text: string) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      // H1
      if (line.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6 mb-4"
          >
            {line.replace("# ", "")}
          </h1>
        );
      }
      // H2
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl font-display font-semibold text-slate-800 dark:text-slate-200 mt-5 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // H3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-display font-medium text-slate-800 dark:text-slate-300 mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Code Block
      if (line.startsWith("```")) {
        return null; // Skip wrapper line, just do raw formatting
      }
      // List
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-slate-600 dark:text-slate-300 my-1">
            {line.substring(2)}
          </li>
        );
      }
      // Number List
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-slate-600 dark:text-slate-300 my-1">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      // Table rows (Simpel)
      if (line.startsWith("|")) {
        return (
          <div
            key={idx}
            className="grid grid-cols-4 gap-2 text-xs border-b border-slate-100 dark:border-slate-800 py-1 font-mono text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 px-2 rounded"
          >
            {line
              .split("|")
              .filter((x) => x.trim() !== "")
              .map((col, cIdx) => (
                <span key={cIdx}>{col.trim()}</span>
              ))}
          </div>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-indigo-500 pl-4 py-1 my-3 text-slate-500 dark:text-slate-400 italic"
          >
            {line.substring(2)}
          </blockquote>
        );
      }
      // Bold syntax helper
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="materi-view-root">
      {/* Header Tab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Modul Belajar Informatika SMA</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Eksplorasi materi kurikulum merdeka berdasarkan elemen informatika.</p>
        </div>
        {user.role === "GURU" && (
          <button
            onClick={() => {
              setIsCreatingMateri(true);
              setSelectedMateri(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Unggah Materi Baru</span>
          </button>
        )}
      </div>

      {isCreatingMateri ? (
        // Form input materi baru
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Buat Modul Pembelajaran Baru</h3>
          <form onSubmit={handleCreateMateri} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Elemen Informatika</label>
                <select
                  value={materiForm.elemen}
                  onChange={(e) => setMateriForm({ ...materiForm, elemen: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {ELEMEN_INFORMATIKA.map((el) => (
                    <option key={el.kode} value={el.kode}>
                      {el.kode} - {el.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tingkat Kelas</label>
                <select
                  value={materiForm.kelas}
                  onChange={(e) => setMateriForm({ ...materiForm, kelas: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="X">Kelas X (Fase E)</option>
                  <option value="XI">Kelas XI (Fase F)</option>
                  <option value="XII">Kelas XII (Fase F)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Judul Materi</label>
              <input
                type="text"
                required
                value={materiForm.judul}
                onChange={(e) => setMateriForm({ ...materiForm, judul: e.target.value })}
                placeholder="Contoh: Algoritma Pencarian Binary Search"
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deskripsi Singkat</label>
              <input
                type="text"
                required
                value={materiForm.deskripsi}
                onChange={(e) => setMateriForm({ ...materiForm, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat modul belajar untuk daftar siswa..."
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Isi Materi Pembelajaran (Format Markdown)</label>
              <textarea
                required
                value={materiForm.konten}
                onChange={(e) => setMateriForm({ ...materiForm, konten: e.target.value })}
                placeholder="Tulis materi lengkap di sini..."
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-indigo-500 font-mono h-[300px] dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingMateri(false)}
                className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Terbitkan Materi
              </button>
            </div>
          </form>
        </div>
      ) : selectedMateri ? (
        // Detail view Materi
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => setSelectedMateri(null)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold mb-4 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Materi</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
              {selectedMateri.elemen}
            </span>
            <span className="text-xs text-slate-400 font-medium">Kelas {selectedMateri.kelas}</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
            {selectedMateri.judul}
          </h2>
          <div className="space-y-4">
            {formatMarkdown(selectedMateri.konten)}
          </div>
        </div>
      ) : (
        // Grid daftar materi
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materiList.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Belum ada materi pembelajaran yang diterbitkan.</p>
            </div>
          ) : (
            materiList.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
                      {m.elemen}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Kelas {m.kelas}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm mt-3.5 line-clamp-1">{m.judul}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">{m.deskripsi}</p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setSelectedMateri(m)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-0.5 transition"
                  >
                    <span>Buka Materi</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  {user.role === "GURU" && (
                    <button
                      onClick={() => handleDeleteMateri(m.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Hapus Materi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
