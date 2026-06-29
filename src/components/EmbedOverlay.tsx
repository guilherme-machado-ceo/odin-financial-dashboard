import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { t } from "@/i18n";

interface Props { sectionId: string | null; onClose: () => void; }

export default function EmbedOverlay({ sectionId, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  if (!sectionId) return null;
  const iframeCode = `<iframe src="${typeof window !== "undefined" ? window.location.origin : "https://hubstry.dev"}/embed/${sectionId}" width="100%" height="500" frameborder="0" style="background:#0a0a0a;" title="ODIN Dashboard"></iframe>`;
  const handleCopy = () => { navigator.clipboard.writeText(iframeCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#222] w-full max-w-xl mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-[#00FFFF] transition-colors"><X size={16} /></button>
        <div className="mb-4"><span className="text-[10px] font-mono uppercase tracking-widest text-[#00FFFF]">{t("embedOverlay.title")}</span></div>
        <p className="text-[12px] text-[#aaa] mb-4">{t("embedOverlay.description")}</p>
        <div className="bg-[#111] border border-[#222] p-3 mb-4 relative"><pre className="text-[11px] font-mono text-[#888] overflow-x-auto whitespace-pre-wrap break-all">{iframeCode}</pre></div>
        <div className="flex items-center justify-between">
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono border border-[#222] text-[#aaa] hover:text-[#00FFFF] hover:border-[#00FFFF]/40 transition-colors">{copied ? <Check size={12} className="text-[#00FF88]" /> : <Copy size={12} />}{copied ? t("embedOverlay.copied") : t("embedOverlay.copy")}</button>
          <button onClick={onClose} className="px-4 py-1.5 text-[11px] font-mono border border-[#222] text-[#aaa] hover:text-[#00FFFF] hover:border-[#00FFFF]/40 transition-colors">{t("embedOverlay.close")}</button>
        </div>
      </div>
    </div>
  );
}
