import React, { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Undo2,
  Redo2,
  Eye,
  Code,
  Palette,
  Type,
  Minus,
  Table
} from "lucide-react";

// Markdown to HTML conversion
export function markdownToHtml(md: string): string {
  if (!md) return "<p><br></p>";
  
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  
  const closeList = () => {
    if (inList && listType) {
      html += `</${listType}>`;
      inList = false;
      listType = null;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === "") {
      closeList();
      html += "<p><br></p>";
      continue;
    }

    // Horizontal Rule / Pemisah
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      closeList();
      html += "<hr class='my-4 border-t border-slate-200 dark:border-slate-700' />";
      continue;
    }
    
    // Check Headings
    if (trimmed.startsWith("### ")) {
      closeList();
      html += `<h3>${parseInline(trimmed.substring(4))}</h3>`;
    } else if (trimmed.startsWith("## ")) {
      closeList();
      html += `<h2>${parseInline(trimmed.substring(3))}</h2>`;
    } else if (trimmed.startsWith("# ")) {
      closeList();
      html += `<h1>${parseInline(trimmed.substring(2))}</h1>`;
    } 
    // Blockquote
    else if (trimmed.startsWith("> ")) {
      closeList();
      html += `<blockquote>${parseInline(trimmed.substring(2))}</blockquote>`;
    }
    // Bullet List
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        closeList();
        html += "<ul>";
        inList = true;
        listType = "ul";
      }
      html += `<li>${parseInline(trimmed.substring(2))}</li>`;
    }
    // Numbered List
    else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, "");
      if (!inList || listType !== "ol") {
        closeList();
        html += "<ol>";
        inList = true;
        listType = "ol";
      }
      html += `<li>${parseInline(content)}</li>`;
    }
    // Table
    else if (trimmed.startsWith("|")) {
      closeList();
      const cols = trimmed.split("|").filter(x => x.trim() !== "");
      html += `<div class="grid grid-cols-4 gap-2 text-xs border-b border-slate-100 dark:border-slate-800 py-1 font-mono text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 px-2 rounded mb-2">`;
      cols.forEach(col => {
        html += `<span>${parseInline(col.trim())}</span>`;
      });
      html += `</div>`;
    }
    // Regular Paragraph
    else {
      closeList();
      html += `<p>${parseInline(line)}</p>`;
    }
  }
  
  closeList();
  return html;
}

function parseInline(text: string): string {
  let res = text;
  // Bold
  res = res.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  res = res.replace(/__(.*?)__/g, "<strong>$1</strong>");
  // Italic
  res = res.replace(/\*(.*?)\*/g, "<em>$1</em>");
  res = res.replace(/_(.*?)_/g, "<em>$1</em>");
  // Link
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline font-semibold">$1</a>');
  return res;
}

// HTML to Markdown conversion
export function htmlToMarkdown(html: string): string {
  if (!html) return "";
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  let markdown = "";
  
  const processNode = (node: Node, parentListType: "ul" | "ol" | null = null, listIndex: number = 1) => {
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.textContent || "";
      return;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    
    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case "hr":
        markdown += "\n\n---\n\n";
        break;
      case "h1":
        markdown += "\n# ";
        element.childNodes.forEach(child => processNode(child));
        markdown += "\n\n";
        break;
      case "h2":
        markdown += "\n## ";
        element.childNodes.forEach(child => processNode(child));
        markdown += "\n\n";
        break;
      case "h3":
        markdown += "\n### ";
        element.childNodes.forEach(child => processNode(child));
        markdown += "\n\n";
        break;
      case "p":
        markdown += "\n";
        element.childNodes.forEach(child => processNode(child));
        markdown += "\n\n";
        break;
      case "blockquote":
        markdown += "\n> ";
        element.childNodes.forEach(child => processNode(child));
        markdown += "\n\n";
        break;
      case "ul":
        element.childNodes.forEach(child => processNode(child, "ul"));
        markdown += "\n";
        break;
      case "ol":
        let idx = 1;
        element.childNodes.forEach(child => {
          if (child.nodeName.toLowerCase() === "li") {
            processNode(child, "ol", idx++);
          } else {
            processNode(child, "ol", idx);
          }
        });
        markdown += "\n";
        break;
      case "li":
        if (parentListType === "ol") {
          markdown += `\n${listIndex}. `;
        } else {
          markdown += `\n- `;
        }
        element.childNodes.forEach(child => processNode(child));
        break;
      case "strong":
      case "b":
        markdown += "**";
        element.childNodes.forEach(child => processNode(child));
        markdown += "**";
        break;
      case "em":
      case "i":
        markdown += "*";
        element.childNodes.forEach(child => processNode(child));
        markdown += "*";
        break;
      case "u":
        markdown += "<u>";
        element.childNodes.forEach(child => processNode(child));
        markdown += "</u>";
        break;
      case "strike":
      case "s":
      case "del":
        markdown += "~~";
        element.childNodes.forEach(child => processNode(child));
        markdown += "~~";
        break;
      case "a":
        const href = element.getAttribute("href") || "";
        markdown += "[";
        element.childNodes.forEach(child => processNode(child));
        markdown += `](${href})`;
        break;
      case "br":
        markdown += "\n";
        break;
      case "div":
        if (element.classList.contains("grid")) {
          // Table layout parsing
          markdown += "\n|";
          element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              markdown += ` ${(child as HTMLElement).innerText} |`;
            }
          });
          markdown += "\n";
        } else {
          markdown += "\n";
          element.childNodes.forEach(child => processNode(child));
          markdown += "\n";
        }
        break;
      default:
        element.childNodes.forEach(child => processNode(child));
        break;
    }
  };
  
  doc.body.childNodes.forEach(node => processNode(node));
  
  // Clean up
  let result = markdown;
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim();
}

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  heightClass?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Mulai menulis...",
  id = "wysiwyg-editor",
  heightClass = "min-h-[300px]"
}) => {
  const [isVisual, setIsVisual] = useState<boolean>(true);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Keep track of internal content to avoid cursor jumps
  const internalHtmlRef = useRef<string>("");

  // Sync value prop -> internal HTML state
  useEffect(() => {
    const desiredHtml = markdownToHtml(value);
    if (editorRef.current && desiredHtml !== internalHtmlRef.current) {
      editorRef.current.innerHTML = desiredHtml;
      internalHtmlRef.current = desiredHtml;
    }
  }, [value]);

  const handleVisualChange = () => {
    if (!editorRef.current) return;
    const currentHtml = editorRef.current.innerHTML;
    internalHtmlRef.current = currentHtml;
    
    // Convert to markdown and fire parent onChange
    const md = htmlToMarkdown(currentHtml);
    onChange(md);
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value;
    onChange(rawVal);
    
    // Convert to HTML so it is synced for visual editor
    const html = markdownToHtml(rawVal);
    internalHtmlRef.current = html;
  };

  const execCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleVisualChange();
  };

  const insertMarkdownText = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement = "";
    if (selectedText) {
      replacement = `${prefix}${selectedText}${suffix}`;
    } else {
      const placeholderText = prefix.startsWith("#")
        ? "Judul"
        : prefix.includes("**")
        ? "Teks Tebal"
        : prefix.includes("*")
        ? "Teks Miring"
        : prefix.includes("-")
        ? "Poin Daftar"
        : prefix.includes("1.")
        ? "Poin Angka"
        : "";
      replacement = `${prefix}${placeholderText}${suffix}`;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 0)
      );
    }, 30);
  };

  const insertLink = () => {
    const url = prompt("Masukkan URL Tautan:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const changeTextColor = (color: string) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const toggleMode = () => {
    if (isVisual) {
      setIsVisual(false);
    } else {
      setIsVisual(true);
      setTimeout(() => {
        if (editorRef.current) {
          const html = markdownToHtml(value);
          editorRef.current.innerHTML = html;
          internalHtmlRef.current = html;
        }
      }, 50);
    }
  };

  const textColors = [
    { name: "Default", class: "#e2e8f0", hex: "inherit" },
    { name: "Biru", class: "#6366f1", hex: "#6366f1" },
    { name: "Hijau", class: "#10b981", hex: "#10b981" },
    { name: "Kuning", class: "#f59e0b", hex: "#f59e0b" },
    { name: "Merah", class: "#ef4444", hex: "#ef4444" },
    { name: "Ungu", class: "#8b5cf6", hex: "#8b5cf6" },
    { name: "Oranye", class: "#f97316", hex: "#f97316" }
  ];

  // Stats
  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = value ? value.length : 0;

  return (
    <div className="w-full border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 transition flex flex-col text-left">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950/40 gap-2 select-none">
        <div className="flex flex-wrap items-center gap-1.5">
          {isVisual ? (
            <>
              {/* Text formatting group */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("bold")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Tebal (Bold)"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("italic")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Miring (Italic)"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("underline")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Garis Bawah (Underline)"
                >
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("strikeThrough")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Coret (Strikethrough)"
                >
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Headings */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "h1")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition font-black text-xs"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "h2")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition font-black text-xs"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "h3")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition font-black text-xs"
                  title="Heading 3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "p")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition font-medium text-xs"
                  title="Paragraph Normal"
                >
                  <Type className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("insertUnorderedList")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Daftar Bulatan (Unordered List)"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("insertOrderedList")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Daftar Angka (Ordered List)"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("formatBlock", "blockquote")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Kutipan (Blockquote)"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Divider & Table */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("insertHorizontalRule")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Garis Pemisah (Horizontal Rule)"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Alignments */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("justifyLeft")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Rata Kiri"
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("justifyCenter")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Rata Tengah"
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("justifyRight")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Rata Kanan"
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Color Picker & Link */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5 relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition flex items-center gap-0.5"
                  title="Warna Teks"
                >
                  <Palette className="h-3.5 w-3.5" />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-xl flex flex-col gap-1 w-32 animate-fade-in">
                    <p className="text-[9px] font-bold text-slate-400 px-1 mb-1 uppercase">Pilih Warna</p>
                    {textColors.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => changeTextColor(col.hex)}
                        className="text-left text-xs px-2 py-1 rounded hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.hex !== "inherit" ? col.hex : "#cbd5e1" }} />
                        {col.name}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={insertLink}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Sisipkan Tautan"
                >
                  <Link className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Undo / Redo */}
              <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => execCommand("undo")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Urungkan (Undo)"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("redo")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Ulangi (Redo)"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Quick Access Format Toolbar for Raw Markdown Mode */
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Akses Cepat Format:
              </span>
              <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/60 rounded-lg p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n# ", "\n")}
                  className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-md transition text-xs"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n## ", "\n")}
                  className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-md transition text-xs"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n### ", "\n")}
                  className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-md transition text-xs"
                  title="Heading 3"
                >
                  H3
                </button>
              </div>

              <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/60 rounded-lg p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => insertMarkdownText("**", "**")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Tebal (**tebal**)"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("*", "*")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Miring (*miring*)"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/60 rounded-lg p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n- ", "")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Daftar Bulatan (- Poin)"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n1. ", "")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Daftar Angka (1. Poin)"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n> ", "\n")}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition"
                  title="Kutipan (> Catatan)"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/60 rounded-lg p-0.5 gap-0.5">
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n\n---\n\n", "")}
                  className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition text-[11px] font-bold flex items-center gap-1"
                  title="Pemisah / Garis Horizontal"
                >
                  <Minus className="h-3 w-3" />
                  <span>Pemisah</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownText("\n| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Data 1 | Data 2 |\n", "")}
                  className="px-2 py-1 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition text-[11px] font-bold flex items-center gap-1"
                  title="Tabel Contoh"
                >
                  <Table className="h-3 w-3" />
                  <span>Tabel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View mode toggler */}
        <button
          type="button"
          onClick={toggleMode}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/60 dark:bg-slate-800/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition shrink-0"
          title={isVisual ? "Ganti ke Kode Markdown" : "Ganti ke Editor Visual"}
        >
          {isVisual ? (
            <>
              <Code className="h-3.5 w-3.5" />
              <span>Kode Markdown</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              <span>Editor Visual</span>
            </>
          )}
        </button>
      </div>

      {/* EDITABLE WRAPPER */}
      <div className="flex-1 relative bg-white dark:bg-slate-900/50">
        {isVisual ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualChange}
            id={id}
            className={`w-full p-4 outline-none prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm overflow-y-auto ${heightClass}`}
            data-placeholder={placeholder}
            style={{
              minHeight: "300px",
              maxHeight: "60vh"
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleMarkdownChange}
            placeholder="Tulis format markdown di sini..."
            className={`w-full p-4 outline-none font-mono text-sm text-slate-800 dark:text-slate-200 bg-slate-950/5 focus:bg-slate-950/20 border-0 ${heightClass} focus:ring-0`}
            style={{
              minHeight: "300px",
              maxHeight: "60vh"
            }}
          />
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 text-[10px] font-mono text-slate-500">
        <span>WYSIWYG / Markdown Editor</span>
        <div className="flex gap-3">
          <span>{wordCount} Kata</span>
          <span>{charCount} Karakter</span>
        </div>
      </div>
      
      {/* Styles for placeholder in contentEditable */}
      <style>{`
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
        }
        .dark div[contenteditable]:empty:before {
          color: #475569;
        }
        div[contenteditable] h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        div[contenteditable] h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
          color: inherit;
        }
        div[contenteditable] h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 0.6rem;
          margin-bottom: 0.3rem;
          color: inherit;
        }
        div[contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        div[contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        div[contenteditable] blockquote {
          border-left: 3px solid #6366f1;
          padding-left: 0.8rem;
          color: #64748b;
          font-style: italic;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

