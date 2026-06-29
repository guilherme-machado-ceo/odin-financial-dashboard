import { useRef, useEffect, useState } from "react";
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, ComposedChart } from "recharts";
import { oilData } from "@/data/goldOilData";
import { t, getLocale } from "@/i18n";
import ExportButton from "./ExportButton";
import EstBadge from "./EstBadge";
import { Share2, Radio, TrendingUp, TrendingDown } from "lucide-react";

interface LivePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Props { onSourceClick: (id: string) => void; onEmbedClick: (id: string) => void; }

const YAHOO_TICKERS = [
  { symbol: "BZ=F", name: "Brent" },
  { symbol: "CL=F", name: "WTI" },
];

export default function OilVectorChart({ onSourceClick, onEmbedClick }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const locale = getLocale();

  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const prices: LivePrice[] = [];
        for (const ticker of YAHOO_TICKERS) {
          try {
            const res = await fetch(
              `https://query1.finance.yahoo.com/v8/finance/chart/${ticker.symbol}?interval=1d&range=1d`,
              { signal: AbortSignal.timeout(8000) }
            );
            if (!res.ok) continue;
            const json = await res.json();
            const result = json.chart?.result?.[0];
            if (!result) continue;
            const meta = result.meta;
            const current = meta.regularMarketPrice || meta.previousClose;
            const prev = meta.chartPreviousClose || meta.previousClose;
            const change = current - prev;
            const changePercent = (change / prev) * 100;
            prices.push({ symbol: ticker.name, price: current, change, changePercent });
          } catch {
            // Skip failed ticker
          }
        }
        if (prices.length > 0) {
          setLivePrices(prices);
          setIsLive(true);
          setLastUpdated(new Date().toLocaleString(locale === "pt" ? "pt-BR" : "en-US"));
        }
      } catch {
        // Keep fallback
      }
    }
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <section id="oil" className="border-b border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 py-8" ref={chartRef}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-[#00FF88] border border-[#00FF88]/30 px-1.5 py-0.5">
                  <Radio size={10} className="animate-pulse" />
                  {locale === "pt" ? "DADOS AO VIVO" : "LIVE DATA"}
                  {lastUpdated && <span className="text-[#00FF88]/60">— {lastUpdated}</span>}
                </span>
              ) : (
                <EstBadge />
              )}
            </div>
            <h2 className="text-xl font-bold text-[#e0e0e0] tracking-tight">{t("oil.title")}</h2>
            <p className="text-[11px] font-mono text-[#555] mt-1 max-w-2xl leading-relaxed">{t("oil.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton chartRef={chartRef} filename="oil-vector" jsonData={{ oil: oilData, livePrices }} />
            <button onClick={() => onEmbedClick("oil")} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-[#555] hover:text-[#00FFFF] transition-colors border border-[#222] hover:border-[#00FFFF]/40"><Share2 size={12} /></button>
          </div>
        </div>

        {isLive && livePrices.length > 0 && (
          <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a] mb-6">
            {livePrices.map((p) => (
              <div key={p.symbol} className="bg-[#0a0a0a] p-4 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono text-[#555] uppercase tracking-widest">
                    {p.symbol} {locale === "pt" ? "(Cotacao ao vivo)" : "(Live Quote)"}
                  </div>
                  <div className="text-2xl font-mono font-bold text-[#e0e0e0]">${p.price.toFixed(2)}</div>
                </div>
                <div className={`flex items-center gap-1 text-[12px] font-mono ${p.change >= 0 ? "text-[#00FF88]" : "text-[#FF4444]"}`}>
                  {p.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{p.change >= 0 ? "+" : ""}{p.change.toFixed(2)} ({p.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            ))}
          </div>
        )}

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

        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => onSourceClick("bloomberg")} className="text-[9px] font-mono text-[#444] hover:text-[#00FFFF] transition-colors">
            {isLive ? "Fonte: Yahoo Finance (BZ=F, CL=F) + EIA — " : t("oil.source")}
            {isLive ? locale === "pt" ? "atualiza a cada 60s" : "refreshes every 60s" : "→"}
          </button>
          {isLive && (
            <span className="text-[8px] font-mono text-[#00FF88]/60">
              {locale === "pt" ? "Cotacao de mercado em tempo real" : "Real-time market quote"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
