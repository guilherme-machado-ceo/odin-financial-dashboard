import { X, ExternalLink } from "lucide-react";
import { sourceRefs } from "@/data/lcBondsData";
import { t } from "@/i18n";

interface Props { sourceId: string | null; onClose: () => void; }

export default function SourceOverlay({ sourceId, onClose }: Props) {
  if (!sourceId) return null;
  const source = sourceRefs.find((s) => s.id === sourceId);
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-[#222] w-full max-w-lg mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-[#00FFFF] transition-colors"><X size={16} /></button>
        <div className="mb-4"><span className="text-[10px] font-mono uppercase tracking-widest text-[#00FFFF]">{t("sourceOverlay.title")}</span></div>
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">{source.name}</h3>
        <div className="mb-4"><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-[#00FFFF] hover:underline flex items-center gap-1"><ExternalLink size={10} />{source.url}</a></div>
        <div className="border-t border-[#222] pt-4 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#555] block mb-2">{t("sourceOverlay.methodology")}</span>
          <p className="text-[12px] text-[#aaa] leading-relaxed">{source.methodology}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#555]">{t("sourceOverlay.lastUpdated")}: {source.lastUpdated}</span>
          <button onClick={onClose} className="px-4 py-1.5 text-[11px] font-mono border border-[#222] text-[#aaa] hover:text-[#00FFFF] hover:border-[#00FFFF]/40 transition-colors">{t("sourceOverlay.close")}</button>
        </div>
      </div>
    </div>
  );
}
