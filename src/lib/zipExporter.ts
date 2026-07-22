import JSZip from "jszip";
import { DocumentData, generateDocumentPdfArrayBuffer } from "./pdfExporter";
import { ELEMEN_INFORMATIKA } from "../types";

function formatMarkdownToHtml(text: string): string {
  if (!text) return "<p><em>Tidak ada konten.</em></p>";

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += "<br/>";
      continue;
    }

    if (line.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h1 style="color: #0f172a; font-size: 14pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px;">${line.replace("# ", "")}</h1>`;
    } else if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2 style="color: #1e293b; font-size: 12pt; margin-top: 14px;">${line.replace("## ", "")}</h2>`;
    } else if (line.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3 style="color: #334155; font-size: 11pt; margin-top: 12px;">${line.replace("### ", "")}</h3>`;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        html += "<ul style='margin-left: 20px; line-height: 1.6;'>";
        inList = true;
      }
      html += `<li>${line.substring(2)}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p style='margin-left: 15px; margin-y: 2px;'>${line}</p>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p style='margin-bottom: 8px; line-height: 1.6;'>${line}</p>`;
    }
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

export function generateDocumentWordHtml(doc: DocumentData, schoolName = "SMK NEGERI GURU BELAJAR INDONESIA"): string {
  const namaElemen = ELEMEN_INFORMATIKA.find(e => e.kode === doc.elemen)?.nama || doc.elemen;
  const friendlyJenis = (doc.jenis || "MODUL_AJAR").replace("_", " ");
  const todayFormatted = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });

  return `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <title>${doc.judul}</title>
    <style>
      body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; margin: 30px; }
      .kop { text-align: center; margin-bottom: 20px; border-bottom: 3px double #0f172a; padding-bottom: 10px; }
      .kop-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #1e293b; }
      .kop-sub { font-size: 9pt; text-transform: uppercase; }
      .kop-school { font-size: 12pt; font-weight: bold; color: #1e3a8a; }
      .kop-info { font-size: 8pt; color: #64748b; }
      .doc-title { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 20px 0 15px 0; color: #0f172a; }
      .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9.5pt; background-color: #f8fafc; border: 1px solid #cbd5e1; }
      .meta-table td { padding: 6px 10px; border: 1px solid #e2e8f0; }
      .meta-label { font-weight: bold; color: #334155; width: 22%; }
      .content { font-size: 10.5pt; line-height: 1.6; }
      .signature-block { margin-top: 40px; width: 100%; font-size: 10pt; page-break-inside: avoid; }
      .signature-table { width: 100%; border-collapse: collapse; border: none; }
      .signature-table td { border: none; padding: 4px; vertical-align: top; }
    </style>
  </head>
  <body>
    <div class="kop">
      <div class="kop-title">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI</div>
      <div class="kop-sub">DIREKTORAT JENDERAL PENDIDIKAN VOKASI</div>
      <div class="kop-school">${schoolName}</div>
      <div class="kop-info">Program Keahlian: PPLG / TJKT | Website: smk.belajar.id | Email: info@smk.belajar.id</div>
    </div>

    <div class="doc-title">${doc.judul}</div>

    <table class="meta-table">
      <tr>
        <td class="meta-label">Jenis Dokumen</td>
        <td>${friendlyJenis}</td>
        <td class="meta-label">Kelas / Fase</td>
        <td>Kelas ${doc.kelas} (Fase ${doc.kelas === "X" ? "E" : "F"})</td>
      </tr>
      <tr>
        <td class="meta-label">Elemen Capaian</td>
        <td>${doc.elemen} - ${namaElemen}</td>
        <td class="meta-label">Tahun Ajaran</td>
        <td>2026/2027</td>
      </tr>
      <tr>
        <td class="meta-label">Penyusun</td>
        <td>${doc.userEmail}</td>
        <td class="meta-label">Status Dokumen</td>
        <td><strong>TERVERIFIKASI & SIAP DIGUNAKAN</strong></td>
      </tr>
    </table>

    <div class="content">
      ${formatMarkdownToHtml(doc.konten)}
    </div>

    <div class="signature-block">
      <table class="signature-table">
        <tr>
          <td style="width: 50%;">
            Mengetahui,<br/>
            <strong>Kepala Sekolah</strong><br/><br/><br/><br/>
            <strong>Dr. H. Ahmad Fauzi, M.Pd.</strong><br/>
            NIP. 19780512 200501 1 002
          </td>
          <td style="width: 50%; text-align: right;">
            Jakarta, ${todayFormatted}<br/>
            <strong>Guru Mata Pelajaran</strong><br/><br/><br/><br/>
            <strong>Yogi Suprayogi, S.Kom.</strong><br/>
            NUPTK. ${doc.userEmail.substring(0, 8).toUpperCase()}
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}

export async function downloadSelectedDocumentsZip(
  docs: DocumentData[],
  archiveFilename = "Perangkat_Pembelajaran_Terpilih.zip"
): Promise<void> {
  if (!docs || docs.length === 0) return;

  const zip = new JSZip();

  // Root Table of Contents / Summary File
  let tocContent = `===================================================\n`;
  tocContent += `ARSIP DOKUMEN PERANGKAT PEMBELAJARAN (KURIKULUM MERDEKA)\n`;
  tocContent += `SMK NEGERI GURU BELAJAR INDONESIA\n`;
  tocContent += `Tanggal Pengunduhan: ${new Date().toLocaleString("id-ID")}\n`;
  tocContent += `Jumlah Dokumen Dalam Bundel: ${docs.length}\n`;
  tocContent += `===================================================\n\n`;

  docs.forEach((doc, idx) => {
    const cleanTitle = (doc.judul || "Dokumen")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .substring(0, 50);

    const folderName = `${idx + 1}_[${doc.jenis}]_${cleanTitle}`;
    const docFolder = zip.folder(folderName) || zip;

    // 1. PDF File
    try {
      const pdfArrayBuffer = generateDocumentPdfArrayBuffer(doc);
      docFolder.file(`${cleanTitle}.pdf`, pdfArrayBuffer);
    } catch (e) {
      console.error("Gagal menyusun PDF untuk zip:", doc.judul, e);
    }

    // 2. Word (.doc) File
    const docHtml = generateDocumentWordHtml(doc);
    docFolder.file(`${cleanTitle}.doc`, docHtml);

    // 3. Raw Markdown (.md) File
    docFolder.file(`${cleanTitle}.md`, doc.konten || "");

    // Update Table of Contents
    tocContent += `${idx + 1}. [${doc.jenis}] ${doc.judul}\n`;
    tocContent += `   - Kelas: ${doc.kelas} | Elemen: ${doc.elemen}\n`;
    tocContent += `   - Penyusun: ${doc.userEmail}\n\n`;
  });

  zip.file("00_DAFTAR_ISI_BUNDEL.txt", tocContent);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = archiveFilename.endsWith(".zip") ? archiveFilename : `${archiveFilename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
