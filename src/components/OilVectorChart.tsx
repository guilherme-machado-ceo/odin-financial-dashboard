import { useRef } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart } from "recharts";
import { oilData } from "@/data/goldOilData";
import { t } from "@/i18n";
import ExportButton from "./ExportButton";
import EstBadge from "./EstBadge";
import { Share2 } from "lucide-react";

interface Props { onSourceClick: (id: string) => void; onEmbedClick: (id: string) => void; }

export default function OilVectorChart({ onSourceClick, onEmbedClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  return (
    <section id="oil" className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8" ref={chartRef}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1"><EstBadge /></div>
            <h2 className="text-xl font-bold text-[#e0e0e0] tracking-tight">{t("oil.title")}</h2>
            <p className="text-[11px] font-mono text-[#555] mt-1 max-w-2xl leading-relaxed">{t("oil.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton chartRef={chartRef} filename="oil-vector" jsonData={{ oil: oilData }} />
            <button onClick={() => onEmbedClick("oil")} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#555] hover:text-[#00FFFF] transition-colors border border-[#222] hover:border-[#00FFFF]/40"><Share2 size={12} /></button>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={oilData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#555", fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "#222" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#555", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} label={{ value: "US$/barril", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 9, fill: "#555" } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#555", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} label={{ value: "US$ bi / mbd", angle: -90, position: "insideRight", offset: 10, style: { fontSize: 9, fill: "#555" } }} />
              <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: 0, fontSize: 11, fontFamily: "JetBrains Mono", color: "#e0e0e0" }} />
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono", color: "#555" }} />
              <Line yAxisId="left" type="monotone" dataKey="brent" name={t("oil.seriesBrent")} stroke="#FF8C00" strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="wti" name={t("oil.seriesWTI")} stroke="#e0e0e0" strokeWidth={1} strokeDasharray="4 4" dot={false} />
              <Bar yAxisId="right" dataKey="bricsProduction" name={t("oil.seriesProduction")} fill="#333" barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="petroyuanVolume" name={t("oil.seriesPetroyuan")} stroke="#00FFFF" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4"><button onClick={() => onSourceClick("bloomberg")} className="text-[9px] font-mono text-[#444] hover:text-[#00FFFF] transition-colors">{t("oil.source")} →</button></div>
      </div>
    </section>
  );
}
