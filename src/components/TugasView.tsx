import React, { useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Award,
  CheckCircle,
  Users,
  Edit2,
  Trash2,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { User, Tugas, PengumpulanTugas, ELEMEN_INFORMATIKA } from "../types";
import { WysiwygEditor } from "./WysiwygEditor";

interface TugasViewProps {
  user: User;
  tugasList: Tugas[];
  submissions: PengumpulanTugas[];
  isOnline: boolean;
  offlineQueue: any[];
  setOfflineQueue: (q: any[]) => void;
  onAddTugas: (tugas: Tugas) => void;
  onAddSubmission: (sub: PengumpulanTugas) => void;
  onUpdateSubmission: (sub: PengumpulanTugas) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  onAddNotification: (title: string, msg: string, type: "info" | "alert") => void;
  fetchAnalitika: () => void;
}

export const TugasView: React.FC<TugasViewProps> = ({
  user,
  tugasList,
  submissions,
  isOnline,
  offlineQueue,
  setOfflineQueue,
  onAddTugas,
  onAddSubmission,
  onUpdateSubmission,
  showToast,
  onAddNotification,
  fetchAnalitika
}) => {
  const [isCreatingTugas, setIsCreatingTugas] = useState(false);
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);

  const [tugasForm, setTugasForm] = useState({
    judul: "",
    instruksi: "",
    elemen: "BK",
    kelas: "X" as "X" | "XI" | "XII",
    deadline: "",
    totalPoin: 100,
    tipe: "TUGAS_TERULIS" as "TUGAS_TERULIS" | "KUIS",
    soalKuis: [] as any[],
  });

  const [newQuestion, setNewQuestion] = useState({
    pertanyaan: "",
    pilihan: ["", "", "", ""],
    jawabanBenar: 0,
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScoreResult, setQuizScoreResult] = useState<number | null>(null);
  const [submissionJawabanText, setSubmissionJawabanText] = useState("");

  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<any | null>(null);
  const [gradingScore, setGradingScore] = useState<number>(100);
  const [gradingComment, setGradingComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddQuestionToForm = () => {
    if (!newQuestion.pertanyaan.trim()) return;
    const currentQuestions = tugasForm.soalKuis || [];
    setTugasForm({
      ...tugasForm,
      soalKuis: [...currentQuestions, { ...newQuestion, id: `q-${Date.now()}` }]
    });
    setNewQuestion({
      pertanyaan: "",
      pilihan: ["", "", "", ""],
      jawabanBenar: 0,
    });
  };

  const handleCreateTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch("/api/tugas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tugasForm),
      });
      const data = await res.json();
      if (data.success) {
        onAddTugas(data.data);
        setIsCreatingTugas(false);
        setSelectedTugas(data.data);
        setTugasForm({
          judul: "",
          instruksi: "",
          elemen: "BK",
          kelas: "X",
          deadline: "",
          totalPoin: 100,
          tipe: "TUGAS_TERULIS",
          soalKuis: [],
        });
      } else {
        setErrorMsg(data.message || "Gagal menerbitkan evaluasi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal menghubungi server.");
    }
  };

  const handleSubmissionSubmit = async () => {
    if (!selectedTugas || !user) return;

    let jawabanPayload = "";
    if (selectedTugas.tipe === "KUIS") {
      jawabanPayload = JSON.stringify(quizAnswers);
    } else {
      if (!submissionJawabanText.trim()) {
        alert("Silakan tulis jawaban Anda sebelum mengirim!");
        return;
      }
      jawabanPayload = submissionJawabanText;
    }

    try {
      const res = await fetch("/api/tugas/kumpul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tugasId: selectedTugas.id,
          siswaId: user.id,
          siswaNama: user.nama,
          jawabanSiswa: jawabanPayload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAddSubmission(data.data);
        if (selectedTugas.tipe === "KUIS") {
          setQuizScoreResult(data.data.nilai);
        } else {
          alert("Tugas berhasil dikirim!");
          setSubmissionJawabanText("");
        }
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
      alert("Koneksi gagal saat mengumpulkan tugas.");
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmissionForGrading || !selectedTugas) return;

    if (!isOnline) {
      const queueItem = {
        id: Math.random().toString(36).substr(2, 9),
        action: "grade_submission",
        payload: {
          id: selectedSubmissionForGrading.id,
          nilai: gradingScore,
          catatan: gradingComment
        },
        title: `Nilai Siswa: ${selectedSubmissionForGrading.siswaNama}`,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };

      const updatedQueue = [...offlineQueue, queueItem];
      setOfflineQueue(updatedQueue);
      localStorage.setItem("lmtms_offline_queue", JSON.stringify(updatedQueue));

      const updatedSubmission = {
        ...selectedSubmissionForGrading,
        nilai: gradingScore,
        catatanGuru: gradingComment,
        status: "SELESAI" as const
      };
      onUpdateSubmission(updatedSubmission);
      setSelectedSubmissionForGrading(null);

      showToast("Offline Mode: Penilaian disimpan dalam antrean lokal!", "success");
      onAddNotification(
        "🗃️ Penilaian Disimpan Offline",
        `Hasil evaluasi siswa ${selectedSubmissionForGrading.siswaNama} dicatat dalam antrean sinkronisasi lokal.`,
        "info"
      );
      return;
    }

    try {
      const res = await fetch("/api/tugas/nilai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSubmissionForGrading.id,
          nilai: gradingScore,
          catatanGuru: gradingComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSubmission(data.data);
        setSelectedSubmissionForGrading(null);
        showToast("Penilaian berhasil disimpan ke server!", "success");
        fetchAnalitika();
      }
    } catch (err) {
      console.error(err);
      showToast("Koneksi gagal. Tidak dapat mengirim nilai.", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto" id="tugas-view-root">
      {/* Header Tab */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Workspace Tugas & Kuis Informatika</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Kegiatan belajar harian, pengumpulan tugas praktik, dan evaluasi berbasis kuis.</p>
        </div>
        {user.role === "GURU" && (
          <button
            onClick={() => {
              setIsCreatingTugas(true);
              setSelectedTugas(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Evaluasi Baru</span>
          </button>
        )}
      </div>

      {isCreatingTugas ? (
        // Form membuat tugas / kuis
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Buat Lembar Evaluasi</h3>
          <form onSubmit={handleCreateTugas} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tipe Evaluasi</label>
                <select
                  value={tugasForm.tipe}
                  onChange={(e) => setTugasForm({ ...tugasForm, tipe: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="TUGAS_TERULIS">Tugas Praktik / Tertulis</option>
                  <option value="KUIS">Kuis Pilihan Ganda (Otomatis Dinilai)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Elemen</label>
                <select
                  value={tugasForm.elemen}
                  onChange={(e) => setTugasForm({ ...tugasForm, elemen: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {ELEMEN_INFORMATIKA.map((el) => (
                    <option key={el.kode} value={el.kode}>
                      {el.kode}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kelas</label>
                <select
                  value={tugasForm.kelas}
                  onChange={(e) => setTugasForm({ ...tugasForm, kelas: e.target.value as any })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Batas Pengumpulan (Deadline)</label>
                <input
                  type="date"
                  required
                  value={tugasForm.deadline}
                  onChange={(e) => setTugasForm({ ...tugasForm, deadline: e.target.value })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Poin Maksimal</label>
                <input
                  type="number"
                  required
                  value={tugasForm.totalPoin}
                  onChange={(e) => setTugasForm({ ...tugasForm, totalPoin: Number(e.target.value) })}
                  className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Judul Evaluasi</label>
              <input
                type="text"
                required
                value={tugasForm.judul}
                onChange={(e) => setTugasForm({ ...tugasForm, judul: e.target.value })}
                placeholder="Contoh: Kuis 1 Dasar Struktur Data"
                className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Instruksi / Pertanyaan Esai</label>
              <WysiwygEditor
                id="tugas-instruksi-editor"
                value={tugasForm.instruksi}
                onChange={(val) => setTugasForm({ ...tugasForm, instruksi: val })}
                placeholder="Instruksi pengerjaan detail untuk tugas atau kuis..."
                heightClass="min-h-[160px]"
              />
            </div>

            {/* Pembentuk Soal jika tipe KUIS */}
            {tugasForm.tipe === "KUIS" && (
              <div className="border border-indigo-100 dark:border-slate-800 bg-indigo-50/10 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <span>Pembuat Soal Pilihan Ganda</span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {(tugasForm.soalKuis || []).length} Soal Terbuat
                  </span>
                </h4>

                {/* List Soal yang sudah ditambahkan */}
                <div className="space-y-2">
                  {(tugasForm.soalKuis || []).map((q: any, qIdx: number) => (
                    <div key={q.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Soal {qIdx + 1}: {q.pertanyaan}</span>
                      <div className="grid grid-cols-2 gap-1 text-slate-500 dark:text-slate-400">
                        {q.pilihan.map((pil: string, pIdx: number) => (
                          <span key={pIdx} className={q.jawabanBenar === pIdx ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>
                            {String.fromCharCode(65 + pIdx)}. {pil}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form tambah soal baru */}
                <div className="space-y-3 pt-3 border-t border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-150 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pertanyaan Kuis</label>
                    <input
                      type="text"
                      value={newQuestion.pertanyaan}
                      onChange={(e) => setNewQuestion({ ...newQuestion, pertanyaan: e.target.value })}
                      placeholder="Masukkan teks soal..."
                      className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {newQuestion.pilihan.map((pil, idx) => (
                      <div key={idx}>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase">Pilihan {String.fromCharCode(65 + idx)}</label>
                        <input
                          type="text"
                          value={pil}
                          onChange={(e) => {
                            const nextPil = [...newQuestion.pilihan];
                            nextPil[idx] = e.target.value;
                            setNewQuestion({ ...newQuestion, pilihan: nextPil });
                          }}
                          placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                          className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Benar</label>
                    <select
                      value={newQuestion.jawabanBenar}
                      onChange={(e) => setNewQuestion({ ...newQuestion, jawabanBenar: Number(e.target.value) })}
                      className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-indigo-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      <option value={0}>Pilihan A</option>
                      <option value={1}>Pilihan B</option>
                      <option value={2}>Pilihan C</option>
                      <option value={3}>Pilihan D</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddQuestionToForm}
                    className="w-full py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
                  >
                    + Tambahkan Soal ke Kuis
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingTugas(false)}
                className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Terbitkan Evaluasi
              </button>
            </div>
          </form>
        </div>
      ) : selectedTugas ? (
        // Workspace Aktif Tugas Terpilih
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => {
              setSelectedTugas(null);
              setQuizScoreResult(null);
              setQuizAnswers({});
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold mb-4 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Tugas</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
              {selectedTugas.tipe.replace("_", " ")}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Elemen {selectedTugas.elemen}</span>
            <span className="text-xs text-slate-400 font-semibold">• Batas: {selectedTugas.deadline}</span>
          </div>

          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2">{selectedTugas.judul}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
            {selectedTugas.instruksi}
          </p>

          {/* ALUR SISWA: MENGERJAKAN TUGAS / KUIS */}
          {user.role === "SISWA" && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              {/* Check status submission siswa */}
              {(() => {
                const mySub = submissions.find((s) => s.tugasId === selectedTugas.id && s.siswaId === user.id);
                if (mySub) {
                  return (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                        <CheckCircle className="h-5 w-5" />
                        <span>Anda telah menyelesaikan evaluasi ini!</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1 border-t border-emerald-100/50 dark:border-emerald-900/30">
                        <p><strong>Tanggal Dikumpul:</strong> {new Date(mySub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                        <p><strong>Nilai Diperoleh:</strong> {mySub.nilai !== undefined ? `${mySub.nilai} / ${selectedTugas.totalPoin}` : "Menunggu penilaian guru"}</p>
                        {mySub.catatanGuru && <p><strong>Catatan Guru:</strong> {mySub.catatanGuru}</p>}
                      </div>
                    </div>
                  );
                }

                // JIKA BELUM SUBMIT & TIPENYA KUIS
                if (selectedTugas.tipe === "KUIS") {
                  if (quizScoreResult !== null) {
                    return (
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl text-center space-y-2">
                        <Award className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                        <h4 className="font-display font-bold text-slate-800 dark:text-slate-200">Kuis Selesai!</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Skor Anda berhasil dihitung otomatis oleh sistem LMTMS:</p>
                        <span className="inline-block text-3xl font-display font-bold text-indigo-700 bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 px-6 py-2 rounded-xl mt-2">
                          {quizScoreResult} / {selectedTugas.totalPoin}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-2">Kerjakan Soal Kuis</h4>
                      {(selectedTugas.soalKuis || []).map((soal: any, idx: number) => (
                        <div key={soal.id} className="space-y-3 border-b border-slate-50 dark:border-slate-800/60 pb-5">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {idx + 1}. {soal.pertanyaan}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {soal.pilihan.map((pil: string, pIdx: number) => (
                              <button
                                key={pIdx}
                                type="button"
                                onClick={() => setQuizAnswers({ ...quizAnswers, [soal.id]: pIdx })}
                                className={`p-3 text-left border rounded-xl text-xs transition flex items-center justify-between ${
                                  quizAnswers[soal.id] === pIdx
                                    ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-800 dark:text-indigo-300 dark:bg-indigo-950/30"
                                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                <span>{String.fromCharCode(65 + pIdx)}. {pil}</span>
                                {quizAnswers[soal.id] === pIdx && <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSubmissionSubmit}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 dark:shadow-none"
                      >
                        Kirim & Selesaikan Kuis
                      </button>
                    </div>
                  );
                }

                // JIKA BELUM SUBMIT & TIPENYA TUGAS TERULIS
                return (
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 border-b dark:border-slate-800 pb-2">Kirim Lembar Jawaban</h4>
                    <p className="text-xs text-slate-400">Tulis tanggapan atau letakkan tautan repositori/skrip kode pemrograman Anda di bawah ini:</p>
                    <WysiwygEditor
                      id="submission-jawaban-editor"
                      value={submissionJawabanText}
                      onChange={(val) => setSubmissionJawabanText(val)}
                      placeholder="Ketik tanggapan atau lampirkan sintaks Python Anda di sini..."
                      heightClass="min-h-[180px]"
                    />
                    <button
                      onClick={handleSubmissionSubmit}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                      Kumpulkan Tugas Praktik
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ALUR GURU: GRADING / MENILAI TUGAS SISWA */}
          {user.role === "GURU" && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                <Users className="h-5 w-5 text-indigo-500" />
                <span>Daftar Pengumpulan Siswa</span>
              </h4>

              {/* List submissions dari seluruh siswa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.filter((s) => s.tugasId === selectedTugas.id).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 col-span-2 text-center">Belum ada siswa yang mengumpulkan.</p>
                ) : (
                  submissions
                    .filter((s) => s.tugasId === selectedTugas.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-2xl space-y-2 relative transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-display font-bold text-slate-800 dark:text-slate-200 text-xs">{sub.siswaNama}</h5>
                            <p className="text-[10px] text-slate-400">Dikumpul: {new Date(sub.tanggalDikumpul).toLocaleString("id-ID")}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                              sub.status === "SELESAI" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}
                          >
                            {sub.status === "SELESAI" ? `NILAI: ${sub.nilai}` : "BELUM DINILAI"}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-lg max-h-36 overflow-y-auto">
                          {selectedTugas.tipe === "KUIS" ? (
                            <p className="font-mono text-[10px]">Jawaban Lembar Kuis: {sub.jawabanSiswa}</p>
                          ) : (
                            <pre className="font-mono whitespace-pre-wrap leading-tight text-[11px]">{sub.jawabanSiswa}</pre>
                          )}
                        </div>

                        {sub.catatanGuru && (
                          <p className="text-[10px] text-slate-500 bg-indigo-50/30 dark:bg-indigo-950/20 p-1.5 rounded">
                            <strong>Umpan Balik:</strong> {sub.catatanGuru}
                          </p>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              setSelectedSubmissionForGrading(sub);
                              setGradingScore(sub.nilai || 100);
                              setGradingComment(sub.catatanGuru || "");
                            }}
                            className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>{sub.status === "SELESAI" ? "Koreksi Nilai" : "Berikan Nilai"}</span>
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Modal Panel Grading */}
              {selectedSubmissionForGrading && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
                    <h4 className="font-display font-bold text-slate-800 dark:text-white text-sm">Penilaian & Koreksi Tugas</h4>
                    <p className="text-xs text-slate-500">
                      Memberikan penilaian untuk siswa: <strong className="text-indigo-600 dark:text-indigo-400">{selectedSubmissionForGrading.siswaNama}</strong>
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Perolehan Nilai (Maks {selectedTugas.totalPoin})</label>
                      <input
                        type="number"
                        required
                        min={0}
                        max={selectedTugas.totalPoin}
                        value={gradingScore}
                        onChange={(e) => setGradingScore(Number(e.target.value))}
                        className="block w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Umpan Balik & Catatan Guru</label>
                      <WysiwygEditor
                        id="grading-comment-editor"
                        value={gradingComment}
                        onChange={(val) => setGradingComment(val)}
                        placeholder="Tulis masukan konstruktif untuk memotivasi siswa..."
                        heightClass="min-h-[120px]"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmissionForGrading(null)}
                        className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleGradeSubmission}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Simpan Penilaian
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Daftar seluruh evaluasi (Tugas & Kuis)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tugasList.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Belum ada evaluasi atau tugas yang diterbitkan.</p>
            </div>
          ) : (
            tugasList.map((t) => {
              const submissionsCount = submissions.filter((s) => s.tugasId === t.id).length;
              const mySub = submissions.find((s) => s.tugasId === t.id && s.siswaId === user.id);
              return (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-150/40 uppercase">
                        {t.tipe.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">Elemen {t.elemen}</span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm mt-3.5 line-clamp-1">{t.judul}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">{t.instruksi}</p>

                    <div className="flex gap-4 mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Batas: {t.deadline}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Poin: {t.totalPoin}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedTugas(t)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-0.5 transition"
                    >
                      <span>
                        {user.role === "SISWA"
                          ? mySub
                            ? "Tinjau Hasil"
                            : "Mulai Kerjakan"
                          : "Kelola Evaluasi"}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    {user.role === "GURU" && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-150/20">
                        {submissionsCount} Dikumpul
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
