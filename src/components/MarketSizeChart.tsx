import { useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { bricsLatamTotal } from "@/data/lcBondsData";
import { t } from "@/i18n";
import ExportButton from "./ExportButton";
import EstBadge from "./EstBadge";
import { Share2 } from "lucide-react";

interface Props { onSourceClick: (id: string) => void; onEmbedClick: (id: string) => void; }

export default function MarketSizeChart({ onSourceClick, onEmbedClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <section id="market-size" className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8" ref={chartRef}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1"><EstBadge /></div>
            <h2 className="text-xl font-bold text-[#e0e0e0] tracking-tight">{t("section2.title")}</h2>
            <p className="text-[11px] font-mono text-[#555] mt-1">{t("section2.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton chartRef={chartRef} filename="market-size" jsonData={{ marketSize: bricsLatamTotal }} />
            <button onClick={() => onEmbedClick("market-size")} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#555] hover:text-[#00FFFF] transition-colors border border-[#222] hover:border-[#00FFFF]/40"><Share2 size={12} /></button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bricsLatamTotal} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gBrics" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00FFFF" stopOpacity={0.15}/><stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/></linearGradient>
                <linearGradient id="gLatam" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF8C00" stopOpacity={0.15}/><stop offset="95%" stopColor="#FF8C00" stopOpacity={0}/></linearGradient>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e0e0e0" stopOpacity={0.1}/><stop offset="95%" stopColor="#e0e0e0" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#555", fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "#222" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#555", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: 0, fontSize: 11, fontFamily: "JetBrains Mono", color: "#e0e0e0" }} />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono", color: "#555" }} />
              <Area type="monotone" dataKey="brics" name={t("section2.seriesBrics")} stroke="#00FFFF" strokeWidth={1.5} fill="url(#gBrics)" dot={false} />
              <Area type="monotone" dataKey="latam" name={t("section2.seriesLatam")} stroke="#FF8C00" strokeWidth={1.5} fill="url(#gLatam)" dot={false} />
              <Area type="monotone" dataKey="total" name={t("section2.seriesTotal")} stroke="#555" strokeWidth={1} strokeDasharray="4 4" fill="url(#gTotal)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4"><button onClick={() => onSourceClick("bis-debt")} className="text-[9px] font-mono text-[#444] hover:text-[#00FFFF] transition-colors">{t("section2.source")}: BIS Debt Securities Statistics →</button></div>
      </div>
    </section>
  );
}
