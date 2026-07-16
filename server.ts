import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import router from "./server/routes";
import { DB_FILE, getInitialSeeds, writeDB, syncFromSupabase, supabase } from "./server/db";

dotenv.config();

const app = express();
const PORT = 3000;

// Inisialisasi Database lokal jika belum ada file db.json
if (!fs.existsSync(DB_FILE)) {
  writeDB(getInitialSeeds());
}

// Express middlewares
app.use(express.json());

// Sambungkan REST API Router di bawah prefix /api
app.use("/api", router);

// VITE MIDDLEWARE SETUP & STATIC RUNTIME
async function startServer() {
  // Jalankan sinkronisasi awal dari Supabase Cloud saat server boot secara aman
  if (supabase) {
    try {
      await syncFromSupabase();
    } catch (error) {
      console.error("[Boot] Initial Supabase sync failed:", error);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LMTMS Backend] Server is running on http://localhost:${PORT}`);
  });
}

startServer();
