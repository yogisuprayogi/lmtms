import { jsPDF } from "jspdf";
import { ELEMEN_INFORMATIKA } from "../types";

export interface DocumentData {
  judul: string;
  konten: string;
  jenis: string;
  kelas: string;
  elemen: string;
  userEmail: string;
}

export function buildDocumentPdf(docData: DocumentData): jsPDF {
  const { judul, konten, jenis, kelas, elemen, userEmail } = docData;

  // Inisialisasi dokumen A4 (210mm x 297mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;
  
  let currentY = 15;

  // Helper untuk menambah halaman baru & menggambar running header
  const addNewPage = () => {
    doc.addPage();
    currentY = 20;
    drawRunningHeader();
  };

  const checkPageOverflow = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      addNewPage();
      return true;
    }
    return false;
  };

  // 1. KOP SURAT RESMI (First Page Only)
  const drawKopSurat = () => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI", pageWidth / 2, currentY, { align: "center" });
    currentY += 4.5;

    doc.setFontSize(9);
    doc.setFont("Helvetica", "normal");
    doc.text("DIREKTORAT JENDERAL PENDIDIKAN VOKASI", pageWidth / 2, currentY, { align: "center" });
    currentY += 4.5;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SMK NEGERI GURU BELAJAR INDONESIA", pageWidth / 2, currentY, { align: "center" });
    currentY += 4;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text("Program Keahlian: Pengembangan Perangkat Lunak dan Gim (PPLG) / TJKT", pageWidth / 2, currentY, { align: "center" });
    currentY += 3.5;
    doc.text("Website: smk.belajar.id | Email: info@smk.belajar.id", pageWidth / 2, currentY, { align: "center" });
    currentY += 4;

    // Double Line Separator
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.6);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    doc.setLineWidth(0.2);
    doc.line(marginX, currentY + 0.8, pageWidth - marginX, currentY + 0.8);
    currentY += 6;
  };

  // Running Header untuk Halaman Kedua dst.
  const drawRunningHeader = () => {
    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("DOKUMEN ADMINISTRASI PEMBELAJARAN - KURIKULUM MERDEKA", marginX, 12);
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.2);
    doc.line(marginX, 14, pageWidth - marginX, 14);
  };

  // 2. METADATA BOX (First Page Only)
  const drawMetadataBox = () => {
    const namaElemen = ELEMEN_INFORMATIKA.find(e => e.kode === elemen)?.nama || elemen;
    const friendlyJenis = jenis.replace("_", " ");

    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setFillColor(248, 250, 252); // Slate-50
    // Draw rounded rect container
    doc.roundedRect(marginX, currentY, contentWidth, 28, 2, 2, "FD");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    
    // Left column
    doc.text("Jenis Dokumen :", marginX + 4, currentY + 6);
    doc.setFont("Helvetica", "normal");
    doc.text(friendlyJenis, marginX + 32, currentY + 6);

    doc.setFont("Helvetica", "bold");
    doc.text("Guru Penyusun :", marginX + 4, currentY + 12);
    doc.setFont("Helvetica", "normal");
    doc.text(userEmail, marginX + 32, currentY + 12);

    doc.setFont("Helvetica", "bold");
    doc.text("Satuan Sekolah :", marginX + 4, currentY + 18);
    doc.setFont("Helvetica", "normal");
    doc.text("SMK Negeri Guru Belajar", marginX + 32, currentY + 18);

    doc.setFont("Helvetica", "bold");
    doc.text("Elemen Capaian :", marginX + 4, currentY + 24);
    doc.setFont("Helvetica", "normal");
    doc.text(`${elemen} - ${namaElemen}`, marginX + 32, currentY + 24);

    // Right column inside box
    const rightColX = marginX + 115;
    doc.setFont("Helvetica", "bold");
    doc.text("Fase / Kelas :", rightColX, currentY + 6);
    doc.setFont("Helvetica", "normal");
    doc.text(`Fase E / Kelas ${kelas}`, rightColX + 24, currentY + 6);

    doc.setFont("Helvetica", "bold");
    doc.text("Tahun Ajaran :", rightColX, currentY + 12);
    doc.setFont("Helvetica", "normal");
    doc.text("2026/2027", rightColX + 24, currentY + 12);

    doc.setFont("Helvetica", "bold");
    doc.text("Status Draf :", rightColX, currentY + 18);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text("SIAP CETAK / VERIFIED", rightColX + 24, currentY + 18);

    doc.setTextColor(30, 41, 59);
    currentY += 34;
  };

  // Draw Kop on the first page
  drawKopSurat();

  // Document Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate-900
  const splitTitle = doc.splitTextToSize(judul.toUpperCase(), contentWidth);
  doc.text(splitTitle, pageWidth / 2, currentY, { align: "center" });
  currentY += splitTitle.length * 6 + 2;

  // Metadata Box
  drawMetadataBox();

  // 3. PARSING & RENDERING MARKDOWN CONTENT
  const lines = konten.split("\n");

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // Slate-700

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    if (trimmedLine === "") {
      currentY += 4;
      continue;
    }

    // Headers
    if (trimmedLine.startsWith("# ")) {
      checkPageOverflow(12);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      const text = trimmedLine.replace("# ", "");
      const splitText = doc.splitTextToSize(text, contentWidth);
      doc.text(splitText, marginX, currentY);
      currentY += splitText.length * 6 + 3;
    } 
    else if (trimmedLine.startsWith("## ")) {
      checkPageOverflow(10);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      const text = trimmedLine.replace("## ", "");
      const splitText = doc.splitTextToSize(text, contentWidth);
      doc.text(splitText, marginX, currentY);
      currentY += splitText.length * 5.5 + 2.5;
    } 
    else if (trimmedLine.startsWith("### ")) {
      checkPageOverflow(8);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      const text = trimmedLine.replace("### ", "");
      const splitText = doc.splitTextToSize(text, contentWidth);
      doc.text(splitText, marginX, currentY);
      currentY += splitText.length * 5 + 2;
    } 
    // Bullet Points
    else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      checkPageOverflow(6);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const text = trimmedLine.substring(2);
      const splitText = doc.splitTextToSize(text, contentWidth - 6);

      doc.setFillColor(71, 85, 105);
      doc.circle(marginX + 2, currentY - 1, 0.8, "F");

      doc.text(splitText, marginX + 6, currentY);
      currentY += splitText.length * 4.5 + 1.5;
    } 
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      checkPageOverflow(6);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const numPrefix = trimmedLine.match(/^\d+\.\s/)?.[0] || "";
      const text = trimmedLine.replace(/^\d+\.\s/, "");
      const splitText = doc.splitTextToSize(text, contentWidth - 8);

      doc.text(numPrefix, marginX, currentY);
      doc.text(splitText, marginX + 7, currentY);
      currentY += splitText.length * 4.5 + 1.5;
    } 
    // Tables
    else if (trimmedLine.startsWith("|")) {
      if (trimmedLine.includes("---") || trimmedLine.includes("-|-")) {
        continue;
      }
      checkPageOverflow(8);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);

      const cells = trimmedLine.split("|").filter(x => x.trim() !== "").map(c => c.trim());
      const cellCount = cells.length;
      if (cellCount > 0) {
        const colWidth = contentWidth / cellCount;
        const isHeader = i === 0 || (lines[i-1] && lines[i-1].trim() === "") || !lines[i-1].trim().startsWith("|");
        if (isHeader) {
          doc.setFillColor(241, 245, 249);
          doc.rect(marginX, currentY - 4, contentWidth, 6, "F");
          doc.setFont("Helvetica", "bold");
        } else {
          doc.setFont("Helvetica", "normal");
        }

        for (let cIdx = 0; cIdx < cellCount; cIdx++) {
          const cellX = marginX + (cIdx * colWidth) + 2;
          const splitCell = doc.splitTextToSize(cells[cIdx], colWidth - 4);
          doc.text(splitCell, cellX, currentY);
        }
        
        doc.setDrawColor(226, 232, 240);
        doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
        currentY += 6.5;
      }
    } 
    // Normal paragraphs
    else {
      checkPageOverflow(7);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const splitText = doc.splitTextToSize(trimmedLine, contentWidth);
      doc.text(splitText, marginX, currentY);
      currentY += splitText.length * 4.5 + 2.5;
    }
  }

  // 4. LEMBAR PENGESAHAN / SIGNATURE BLOCK
  checkPageOverflow(42);
  currentY += 8;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  
  const todayFormatted = new Date().toLocaleDateString("id-ID", { dateStyle: "long" });
  doc.text(`Jakarta, ${todayFormatted}`, pageWidth - marginX - 60, currentY);
  currentY += 5;

  const leftSignX = marginX + 10;
  const rightSignX = pageWidth - marginX - 60;

  doc.text("Mengetahui,", leftSignX, currentY);
  doc.text("Guru Mata Pelajaran,", rightSignX, currentY);
  currentY += 4.5;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Kepala SMK Negeri Guru Belajar,", leftSignX, currentY);
  doc.text("Informatika,", rightSignX, currentY);
  
  currentY += 18;
  
  doc.setFont("Helvetica", "bold");
  doc.text("Dr. H. Ahmad Fauzi, M.Pd.", leftSignX, currentY);
  doc.text("Yogi Suprayogi, S.Kom.", rightSignX, currentY);
  currentY += 4;
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("NIP. 19780512 200501 1 002", leftSignX, currentY);
  doc.text(`NUPTK. ${userEmail.substring(0, 8).toUpperCase()}`, rightSignX, currentY);

  // 5. FOOTER & PAGINATION
  const totalPages = doc.internal.pages.length - 1;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`SMK Negeri Guru Belajar - Perangkat Administrasi Kurikulum Merdeka`, marginX, pageHeight - 10);
    doc.text(`Halaman ${pageNum} dari ${totalPages}`, pageWidth - marginX, pageHeight - 10, { align: "right" });
    
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);
  }

  return doc;
}

export function exportDocumentToPdf(docData: DocumentData) {
  const doc = buildDocumentPdf(docData);
  const fileNameClean = docData.judul.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  doc.save(`Perangkat_Ajar_${fileNameClean}.pdf`);
}

export function generateDocumentPdfArrayBuffer(docData: DocumentData): ArrayBuffer {
  const doc = buildDocumentPdf(docData);
  return doc.output("arraybuffer");
}
