import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileImage, FileText, FileJson } from "lucide-react";
import { t } from "@/i18n";

interface Props { chartRef: React.RefObject<HTMLDivElement | null>; filename: string; jsonData?: Record<string, unknown>; }

export default function ExportButton({ chartRef, filename, jsonData }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const exportPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: "#0a0a0a", scale: 2 });
    const link = document.createElement("a"); link.download = `${filename}.png`; link.href = canvas.toDataURL("image/png"); link.click(); setOpen(false);
  };
  const exportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, { backgroundColor: "#0a0a0a", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
    const iw = pw - 20, ih = (canvas.height * iw) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, ih > ph - 20 ? 10 : (ph - ih) / 2, iw, Math.min(ih, ph - 20));
    pdf.save(`${filename}.pdf`); setOpen(false);
  };
  const exportJSON = () => {
    if (!jsonData) return;
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.download = `${filename}.json`; link.href = URL.createObjectURL(blob); link.click(); URL.revokeObjectURL(link.href); setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#555] hover:text-[#00FFFF] transition-colors border border-[#222] hover:border-[#00FFFF]/40" title="Export"><Download size={12} /></button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#111] border border-[#222] z-50 min-w-[140px]">
          <button onClick={exportPNG} className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-mono text-[#aaa] hover:text-[#00FFFF] hover:bg-[#1a1a1a] transition-colors text-left"><FileImage size={12} />{t("section1.exportPNG")}</button>
          <button onClick={exportPDF} className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-mono text-[#aaa] hover:text-[#00FFFF] hover:bg-[#1a1a1a] transition-colors text-left"><FileText size={12} />{t("section1.exportPDF")}</button>
          {jsonData && <button onClick={exportJSON} className="flex items-center gap-2 w-full px-3 py-2 text-[11px] font-mono text-[#aaa] hover:text-[#00FFFF] hover:bg-[#1a1a1a] transition-colors text-left"><FileJson size={12} />{t("section1.exportJSON")}</button>}
        </div>
      )}
    </div>
  );
}
