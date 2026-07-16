# Panduan Pengembang LMTMS (Developer Guide)

Dokumen ini ditujukan bagi pengembang sistem yang ingin memahami arsitektur kode, manajemen state, penanganan sinkronisasi offline, penyesuaian tema, serta integrasi teknologi AI pada sistem **LMTMS Informatika SMA**.

---

## 📂 1. Struktur Direktori Proyek & Arsitektur Sistem

LMTMS menggunakan pola full-stack monorepo modular untuk menyederhanakan siklus pengembangan dan mempermudah proses kompilasi satu arah (*unified build*). Untuk mendukung skalabilitas jangka panjang, backend dirancang menggunakan **Clean Architecture + Repository Pattern** di atas model MVC standar.

```bash
lmtms-root/
├── docs/                      # Dokumentasi teknis sistem (LNMP, API, UML, User, Dev)
├── public/                    # Aset statis client (manifest PWA, ikon, favicon)
├── server/                    # Backend Source Code (Clean Architecture)
│   ├── core/                  # Domain Entities & Business Rules
│   │   ├── entities/          # Objek domain murni (User, Perangkat, Sekolah)
│   │   └── use-cases/         # Interactor fungsional (GenerateRPP, SyncOfflineData)
│   ├── infrastructure/        # Implementasi teknis & detail eksternal
│   │   ├── db/                # Drizzle ORM, Migrations, Seeders
│   │   │   ├── migrations/    # SQL migration files
│   │   │   └── seeders/       # Seeder data awal multi-sekolah
│   │   ├── repositories/      # Implementasi Repository Pattern (MariaDB, Firestore)
│   │   ├── scheduler/         # Cron Job Scheduler (node-cron)
│   │   ├── queue/             # Queue System (Heavy Worker Queue)
│   │   ├── plugins/           # Core Plugin Engine & Hooks Registry
│   │   └── document-gen/      # Auto Document Generator (PDF, Word, Excel)
│   ├── interfaces/            # Adapters & Presenters
│   │   ├── controllers/       # Controller API (V1 / V2)
│   │   └── middlewares/       # RBAC, Multi-Tenant, & Audit Trail logger
│   ├── db.ts                  # Inisialisasi database
│   └── routes.ts              # Router Express Terpusat dengan Versi API
├── src/                       # Frontend Source Code (React 18 + Vite + Tailwind CSS)
│   ├── components/            # Komponen visual modular per fitur
│   ├── App.tsx                # Orchestrator state global & router tab
│   ├── index.css              # Pengendali Tailwind CSS & deklarasi variabel tema CSS
│   ├── main.tsx               # Entry point eksekusi React ke DOM
│   └── types.ts               # Deklarasi tipe data bersama (Shared TypeScript Interfaces)
```

### 1.1 Clean Architecture & Repository Pattern
Pola ini memisahkan logika bisnis inti dari kerangka kerja web dan detail database:
1. **Entities**: Berisi definisi data dan aturan bisnis tingkat tinggi (bebas dari framework/library luar).
2. **Use Cases**: Berisi alur kerja aplikasi spesifik (contoh: `SimpanAbsensiUseCase` yang menangani aturan batas kehadiran).
3. **Repositories**: Abstraksi akses data menggunakan interface. Controller hanya memanggil interface, sementara implementasinya dapat ditukar dari MariaDB ke MongoDB/Firestore tanpa menyentuh Use Case.

*Contoh implementasi Repository Pattern di LMTMS (`/server/core/repositories/IUserRepository.ts`):*
```typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string, schoolId: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

---

## 🏢 2. Fitur Multi-Sekolah (Multi-Tenant Architecture)

LMTMS mendukung multi-sekolah dalam satu instansi server tunggal dengan pendekatan **Shared Database, Isolated Schema/Tenant ID**.

### 2.1 Mekanisme Resolusi Tenant (Sekolah)
Setiap permintaan ke server divalidasi berdasarkan header `X-School-ID` atau subdomain sekolah (misal: `sma1jakarta.lmtms.sch.id`). Middleware multi-sekolah mendeteksi dan mengisolasi konteks data secara otomatis:

```typescript
// /server/infrastructure/middlewares/tenantResolver.ts
import { Request, Response, NextFunction } from "express";

export const tenantResolver = (req: Request, res: Response, next: NextFunction) => {
  const schoolId = req.headers["x-school-id"] as string || req.subdomains[0];
  
  if (!schoolId) {
    return res.status(400).json({
      success: false,
      message: "Identifikasi sekolah tidak ditemukan. Akses ditolak."
    });
  }
  
  req.schoolId = schoolId;
  next();
};
```

Setiap query ke database wajib menyertakan filter `school_id` guna menjamin keamanan dan isolasi data antar sekolah.

---

## 🔌 3. Sistem Plugin Terbuka (Plugin System)

LMTMS mengimplementasikan sistem plugin berbasis **Hooks & Event Listeners** yang memungkinkan pihak ketiga atau sekolah lain menambahkan fungsionalitas baru (seperti "Modul Presensi Face Recognition" atau "Integrasi Whatsapp Gateway") tanpa memodifikasi kode inti aplikasi.

### 3.1 Pendaftaran Plugin (Plugin Manifest)
Setiap plugin diletakkan di direktori `/server/infrastructure/plugins/` dengan format file ZIP atau folder mandiri yang memuat file `manifest.json`:
```json
{
  "id": "lmtms-whatsapp-notification",
  "name": "Sistem Notifikasi WhatsApp Otomatis",
  "version": "1.0.0",
  "description": "Mengirimkan notifikasi ketidakhadiran siswa langsung ke Whatsapp orang tua.",
  "entryPoint": "index.js",
  "hooks": {
    "after:absensi:simpan": "notifyParentViaWA"
  }
}
```

### 3.2 Registrasi & Trigger Hooks
Core Engine memicu kait (*hooks*) di berbagai titik kritis daur hidup aplikasi:
```typescript
// /server/infrastructure/plugins/PluginEngine.ts
export class PluginEngine {
  private static plugins: Map<string, any> = new Map();

  public static registerHook(hookName: string, callback: Function) {
    if (!this.plugins.has(hookName)) {
      this.plugins.set(hookName, []);
    }
    this.plugins.get(hookName).push(callback);
  }

  public static async triggerHook(hookName: string, payload: any): Promise<any> {
    const callbacks = this.plugins.get(hookName) || [];
    let currentPayload = payload;
    for (const callback of callbacks) {
      currentPayload = await callback(currentPayload);
    }
    return currentPayload;
  }
}
```

---

## 🔄 4. Penanganan Sinkronisasi Offline (PWA Local Storage Queue)

Inti dari ketangguhan offline LMTMS terletak pada penangkap aksi (*action interception*) berbasis status jaringan.

### 4.1 Mekanisme Pendeteksian Koneksi
Sistem memantau kondisi jaringan secara real-time menggunakan state `isOnline`. Keadaan koneksi disinkronkan dengan event browser bawaan:
```typescript
// Di App.tsx
useEffect(() => {
  const handleOnline = () => {
    setIsOnline(true);
    processOfflineQueue(); // Otomatis sync saat internet pulih
  };
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);
```

### 4.2 Antrean Data Tertunda (*Queue Saving*)
Saat pengguna melakukan tindakan mutasi data (misalnya mengisi presensi siswa atau memberi penilaian tugas) saat offline, aksi dicegat sebelum mencapai fungsi `fetch`:
```typescript
const handleGradeSubmission = async () => {
  if (!isOnline) {
    const queueItem = {
      id: Math.random().toString(36).substr(2, 9),
      action: "grade_submission",
      payload: { id: selectedId, nilai: score, catatan: comment },
      title: `Nilai Siswa: ${siswaNama}`,
      time: new Date().toLocaleTimeString("id-ID")
    };
    
    // Simpan ke array antrean & localStorage
    const updatedQueue = [...offlineQueue, queueItem];
    setOfflineQueue(updatedQueue);
    localStorage.setItem("lmtms_offline_queue", JSON.stringify(updatedQueue));
    return;
  }
  // Jalankan skenario online fetch normal...
};
```

---

## 🎨 5. Pengelola Tema Visual Dinamis (Theme Manager)

LMTMS menyediakan **Theme Manager API** untuk mendaftarkan dan menerapkan preset warna secara global bagi sekolah maupun pengguna individu.

### 5.1 Struktur Variabel CSS Tema
Tema warna dikonfigurasi melalui runtime DOM dengan memanipulasi Root CSS custom properties:
```typescript
// /src/components/ThemeManager.ts
export interface VisualTheme {
  name: string;
  primaryColor: string;
  hoverColor: string;
  bgLightColor: string;
  textColor: string;
  borderColor: string;
}

export const applyTheme = (theme: VisualTheme) => {
  const root = document.documentElement;
  root.style.setProperty("--theme-primary", theme.primaryColor);
  root.style.setProperty("--theme-primary-hover", theme.hoverColor);
  root.style.setProperty("--theme-bg-light", theme.bgLightColor);
  root.style.setProperty("--theme-text", theme.textColor);
  root.style.setProperty("--theme-border", theme.borderColor);
};
```

---

## ⚡ 6. Antrean Proses Berat (Heavy Queue System)

Untuk menjaga waktu respons API tetap di bawah **100ms**, proses berat seperti kompilasi PDF massal, backup database berkala, dan penulisan dokumen berbasis AI didelegasikan ke **Worker Queue**.

### 6.1 Implementasi Task Queue
Sistem LMTMS menggunakan Database-backed atau Redis-backed queue dengan status siklus hidup tugas:
```typescript
// /server/infrastructure/queue/TaskQueue.ts
export interface QueueJob {
  id: string;
  type: "BACKUP" | "EXCEL_EXPORT" | "AI_GENERATION";
  payload: any;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  error?: string;
  createdAt: Date;
}

export class TaskQueue {
  public static async addJob(type: string, payload: any): Promise<string> {
    const jobId = Math.random().toString(36).substr(2, 9);
    // Masukkan job ke tabel queue_jobs dengan status 'PENDING'
    await db.insertJob({ id: jobId, type, payload, status: "PENDING" });
    this.triggerWorker();
    return jobId;
  }

  private static async triggerWorker() {
    // Menjalankan background worker thread untuk memproses tugas
  }
}
```

---

## ⏰ 7. Penjadwal Tugas Berkala (Cron Job Scheduler)

Sistem LMTMS dilengkapi dengan modul penjadwal tugas otomatis terintegrasi menggunakan `node-cron` untuk menangani aktivitas pemeliharaan preventif secara mandiri.

### 7.1 Daftar Tugas Terjadwal (Cron Jobs)
1. **Daily Database Backup (Setiap jam 01:00 WIB)**: Melakukan ekspor skema dan data terkompresi ke penyimpanan awan aman.
2. **Status Sync Verification (Setiap jam 02:00 WIB)**: Menyelaraskan status absensi siswa yang tertunda dari antrean luring gantung.
3. **Audit Logs Cleanup (Mingguan - Hari Minggu jam 00:00 WIB)**: Melakukan rotasi berkas log aktivitas yang berusia lebih dari 90 hari untuk menghemat ruang disk.

*Konfigurasi Scheduler (`/server/infrastructure/scheduler/CronScheduler.ts`):*
```typescript
import cron from "node-cron";

export class CronScheduler {
  public static init() {
    // Deteksi cron ekspresi setiap hari jam 1 dini hari
    cron.schedule("0 1 * * *", async () => {
      console.log("[SCHEDULER] Memulai Backup Database Sekolah...");
      await DatabaseBackupService.execute();
    });

    // Deteksi cron ekspresi pembersihan mingguan
    cron.schedule("0 0 * * 0", async () => {
      console.log("[SCHEDULER] Menjalankan rotasi berkas log...");
      await AuditTrailService.rotateLogs(90); // Hapus log > 90 hari
    });
  }
}
```

---

## 🛡️ 8. Version Control Perangkat Pembelajaran & Audit Trail

Demi menjaga kedaulatan data administrasi sekolah, semua draf perangkat pembelajaran (RPP, Modul Ajar) dilengkapi dengan sistem pelacakan versi layaknya Git, dan setiap mutasi dilindungi oleh log audit komprehensif.

### 8.1 Manajemen Versi Dokumen (Document Version Control)
Setiap perubahan pada dokumen pendidikan direkam dalam tabel riwayat `document_versions` sehingga guru dapat meninjau kembali (*diffing*) atau mengembalikan (*rollback*) ke versi sebelumnya:
```typescript
// /server/core/entities/DocumentVersion.ts
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  contentSnapshot: string;
  changeSummary: string;
  modifiedBy: string;
  createdAt: Date;
}
```

### 8.2 Log Jejak Audit Lengkap (Audit Trail Logging)
Middleware audit melacak setiap interaksi sensitif untuk memenuhi kepatuhan tata kelola sekolah:
```typescript
// /server/infrastructure/middlewares/auditLogger.ts
export const auditLogger = async (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  const ipAddress = req.ip || req.socket.remoteAddress;

  res.send = function (data) {
    if (req.method !== "GET" && res.statusCode >= 200 && res.statusCode < 300) {
      // Rekam tindakan mutatif secara non-blocking
      db.saveAuditLog({
        userId: req.user?.id || "ANONYMOUS",
        schoolId: req.schoolId || "UNKNOWN",
        action: `${req.method} ${req.path}`,
        details: JSON.stringify(req.body),
        ipAddress,
        timestamp: new Date()
      });
    }
    return originalSend.apply(res, arguments as any);
  };
  next();
};
```

---

## 📃 9. Mesin Prompt AI & Pembuat Dokumen Otomatis

### 9.1 Dinamis AI Prompt Engine
Prompt sistem untuk Google Gemini API tidak ditulis keras (*hardcoded*) di dalam kode, melainkan disimpan pada database. Guru atau Admin dapat menyempurnakan struktur prompt langsung dari UI Settings tanpa perlu melakukan build atau deploy ulang aplikasi:
```typescript
// /server/infrastructure/ai/PromptEngine.ts
export class PromptEngine {
  public static async getPromptTemplate(type: string, schoolId: string): Promise<string> {
    const template = await db.getPromptByTypeAndSchool(type, schoolId);
    return template || this.getDefaultPrompt(type);
  }
}
```

### 9.2 Auto Document Generator (Word, PDF, Excel)
Sistem LMTMS menyertakan pustaka khusus untuk mengekspor dokumen dinamis secara real-time:
- **PDF**: Menggunakan `pdfkit` atau `puppeteer` untuk membuat dokumen cetak rapi dengan kop sekolah dinamis.
- **Word (DOCX)**: Menggunakan `docx` untuk mengekspor RPP berstandar nasional dengan layout tabel kustom.
- **Excel (XLSX)**: Menggunakan `exceljs` untuk rekap presensi kelas bulanan siap kirim ke dinas pendidikan.

