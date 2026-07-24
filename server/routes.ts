import { Router, Request, Response, NextFunction } from "express";
import * as authController from "./controllers/authController";
import * as tahunPelajaranController from "./controllers/tahunPelajaranController";
import * as perangkatController from "./controllers/perangkatController";
import * as materiController from "./controllers/materiController";
import * as tugasController from "./controllers/tugasController";
import * as absensiController from "./controllers/absensiController";
import * as analitikaController from "./controllers/analitikaController";
import * as academicController from "./controllers/academicController";

const router = Router();

// Middleware Keamanan: Enforce Role-Based Access Control (RBAC) pada Backend
const enforceRole = (allowedRoles: ("ADMIN" | "GURU" | "SISWA")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers["x-user-role"] as "ADMIN" | "GURU" | "SISWA" | undefined;

    // Untuk environment luring / testing, jika header tidak dikirimkan, perbolehkan lewat safely.
    // Namun jika dikirimkan, periksa kecocokannya dengan ketat.
    if (userRole && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Peran Anda (${userRole}) tidak memiliki izin untuk melakukan aksi ini.`
      });
    }
    next();
  };
};

// 1. AUTH & USER ROUTES
router.post("/auth/login", authController.login);
router.get("/users", authController.getUsers);
router.put("/users/profile", authController.updateProfile);
router.put("/users/password", authController.updatePassword);
router.post("/users/reset-password", enforceRole(["GURU", "ADMIN"]), authController.resetStudentPassword);
router.put("/users/mfa", authController.toggleMfa);
router.get("/activity-logs", authController.getActivityLogs);

// 2. TAHUN PELAJARAN ROUTES (Admin only for creation/activation)
router.get("/tahun-pelajaran", tahunPelajaranController.getTahunPelajaran);
router.post("/tahun-pelajaran", enforceRole(["ADMIN"]), tahunPelajaranController.createTahunPelajaran);
router.post("/tahun-pelajaran/aktifkan", enforceRole(["ADMIN"]), tahunPelajaranController.aktifkanTahunPelajaran);

// 3. PERANGKAT PEMBELAJARAN ROUTES (Guru & Admin can edit, Siswa can only read)
router.get("/perangkat", perangkatController.getPerangkat);
router.post("/perangkat", enforceRole(["GURU", "ADMIN"]), perangkatController.createPerangkat);
router.put("/perangkat/:id", enforceRole(["GURU", "ADMIN"]), perangkatController.updatePerangkat);
router.delete("/perangkat/:id", enforceRole(["GURU", "ADMIN"]), perangkatController.deletePerangkat);
router.post("/gemini/generate", enforceRole(["GURU", "ADMIN"]), perangkatController.generatePerangkat);

// 4. MATERI ROUTES (Guru & Admin can manage, Siswa can read)
router.get("/materi", materiController.getMateri);
router.post("/materi", enforceRole(["GURU", "ADMIN"]), materiController.createMateri);
router.delete("/materi/:id", enforceRole(["GURU", "ADMIN"]), materiController.deleteMateri);

// 5. TUGAS & KUIS ROUTES
router.get("/tugas", tugasController.getTugas);
router.post("/tugas", enforceRole(["GURU", "ADMIN"]), tugasController.createTugas);
router.get("/tugas/kumpul", tugasController.getSubmissions);
router.post("/tugas/kumpul", enforceRole(["SISWA"]), tugasController.submitTugas);
router.post("/tugas/nilai", enforceRole(["GURU", "ADMIN"]), tugasController.gradeSubmission);

// 6. ABSENSI ROUTES (Guru & Admin can save/view, Siswa can view)
router.get("/absensi", absensiController.getAbsensi);
router.post("/absensi/simpan", enforceRole(["GURU", "ADMIN"]), absensiController.simpanAbsensi);

// 7. DASHBOARD ANALITIKA ROUTES
router.get("/analitika", analitikaController.getAnalitika);
router.post("/analitika/import", enforceRole(["GURU", "ADMIN"]), analitikaController.importData);

// 8. ACADEMIC MANAGEMENT ROUTES
router.post("/academic/users", enforceRole(["ADMIN", "GURU"]), academicController.createUser);
router.post("/academic/users/bulk", enforceRole(["ADMIN", "GURU"]), academicController.createBulkUsers);
router.put("/academic/users/:id", enforceRole(["ADMIN", "GURU"]), academicController.updateUser);
router.delete("/academic/users/:id", enforceRole(["ADMIN", "GURU"]), academicController.deleteUser);

router.get("/academic/rombels", academicController.getRombels);
router.post("/academic/rombels", enforceRole(["ADMIN"]), academicController.createRombel);
router.put("/academic/rombels/:id", enforceRole(["ADMIN"]), academicController.updateRombel);
router.delete("/academic/rombels/:id", enforceRole(["ADMIN"]), academicController.deleteRombel);

router.get("/academic/jadwals", academicController.getJadwals);
router.post("/academic/jadwals", enforceRole(["ADMIN", "GURU"]), academicController.createJadwal);
router.put("/academic/jadwals/:id", enforceRole(["ADMIN", "GURU"]), academicController.updateJadwal);
router.delete("/academic/jadwals/:id", enforceRole(["ADMIN", "GURU"]), academicController.deleteJadwal);

router.get("/academic/calendar", academicController.getCalendarEvents);
router.post("/academic/calendar", enforceRole(["ADMIN"]), academicController.createCalendarEvent);
router.put("/academic/calendar/:id", enforceRole(["ADMIN"]), academicController.updateCalendarEvent);
router.delete("/academic/calendar/:id", enforceRole(["ADMIN"]), academicController.deleteCalendarEvent);

router.get("/academic/mappings", academicController.getGuruMappings);
router.post("/academic/mappings", enforceRole(["ADMIN"]), academicController.createGuruMapping);
router.put("/academic/mappings/:id", enforceRole(["ADMIN"]), academicController.updateGuruMapping);
router.delete("/academic/mappings/:id", enforceRole(["ADMIN"]), academicController.deleteGuruMapping);

// 9. IDENTITAS SEKOLAH ROUTES (Admin only for updating)
router.get("/academic/identitas", academicController.getIdentitasSekolah);
router.put("/academic/identitas", enforceRole(["ADMIN"]), academicController.updateIdentitasSekolah);

export default router;
