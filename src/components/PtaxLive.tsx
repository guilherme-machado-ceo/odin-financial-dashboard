// ============================================================
// BRL/USD PTAX LIVE — BCB SGS API (sem chave)
// Endpoint: https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json
// Serie 10813 = Taxa de cambio (Ptax) — Venda — Dolar americano
// ============================================================

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

interface PtaxData {
  cotacaoVenda: number;
  data: string;
  horario: string;
}

export default function PtaxLive() {
  const [ptax, setPtax] = useState<PtaxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPtax() {
      try {
        const res = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json",
          { signal: AbortSignal.timeout(8000) }
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        const item = json[0];
        setPtax({
          cotacaoVenda: parseFloat(item.valor),
          data: item.data,
          horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        });
        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPtax();
    const interval = setInterval(fetchPtax, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Hardcoded fallback for display consistency
  const fallback = { cotacaoVenda: 5.1689, data: "25/06/2026", horario: "13:00" };
  const data = ptax || fallback;
  const isLive = !!ptax && !error;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Radio size={10} className={isLive ? "text-[#FF4444] animate-pulse" : "text-[#555]"} />
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#555]">
          BRL/USD Ptax
        </span>
        {isLive && (
          <span className="text-[7px] font-mono text-[#FF4444] animate-pulse">LIVE</span>
        )}
        {!isLive && !loading && (
          <span className="text-[7px] font-mono text-[#FF8C00]">⚠️ est.</span>
        )}
      </div>
      <span className="text-lg font-mono font-bold text-[#e0e0e0]">
        {loading ? "—" : data.cotacaoVenda.toFixed(4)}
      </span>
      <span className="text-[8px] font-mono text-[#444]">
        {data.data} · {isLive ? `${data.horario} · BCB SGS` : "BCB (fallback)"}
      </span>
    </div>
  );
}
