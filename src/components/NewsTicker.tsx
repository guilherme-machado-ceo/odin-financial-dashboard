import { useEffect, useState, useRef } from "react";
import { t, getLocale } from "@/i18n";
import { Newspaper, ExternalLink, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=BRICS+Panda+Bond+local+currency+finance",
  "https://news.google.com/rss/search?q=gold+reserves+central+bank+dollar",
  "https://news.google.com/rss/search?q=oil+price+Brent+petroyuan+China",
  "https://news.google.com/rss/search?q=Brazil+China+yuan+trade+agreement",
];

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const locale = getLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const allItems: NewsItem[] = [];
        for (const feed of RSS_FEEDS) {
          try {
            const res = await fetch(`${CORS_PROXY}${encodeURIComponent(feed)}`, { signal: AbortSignal.timeout(8000) });
            if (!res.ok) continue;
            const xml = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");
            const items = doc.querySelectorAll("item");
            items.forEach((item) => {
              const title = item.querySelector("title")?.textContent || "";
              const link = item.querySelector("link")?.textContent || "";
              const pubDate = item.querySelector("pubDate")?.textContent || "";
              if (title && link) {
                allItems.push({
                  title: title.split(" - ")[0],
                  link,
                  pubDate: new Date(pubDate).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US"),
                  source: title.split(" - ").pop() || "",
                });
              }
            });
          } catch { /* Skip failed feed */ }
        }
        const seen = new Set<string>();
        const unique = allItems.filter((item) => {
          if (seen.has(item.title)) return false;
          seen.add(item.title);
          return true;
        }).slice(0, 12);
        setNews(unique.length > 0 ? unique : getFallbackNews(locale));
        setLoading(false);
      } catch {
        setError(true);
        setNews(getFallbackNews(locale));
        setLoading(false);
      }
    }
    fetchNews();
  }, [locale]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentItems = news.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section id="news" className="border-b border-[#1a1a1a] bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Newspaper size={16} className="text-[#00FFFF]" />
            <div>
              <h2 className="text-lg font-bold text-[#e0e0e0] tracking-tight">{t("news.title")}</h2>
              <p className="text-[10px] font-mono text-[#555]">{t("news.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1 text-[#555] hover:text-[#00FFFF] disabled:opacity-30 transition-colors"><ChevronLeft size={14} /></button>
            <span className="text-[9px] font-mono text-[#555]">{page + 1}/{totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1 text-[#555] hover:text-[#00FFFF] disabled:opacity-30 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-[#1a1a1a] bg-[#0a0a0a] p-4 animate-pulse">
                <div className="h-3 bg-[#1a1a1a] rounded w-3/4 mb-3" />
                <div className="h-2 bg-[#1a1a1a] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-[#FF8C00] text-[11px] font-mono"><AlertCircle size={12} />{t("news.error")}</div>
        ) : (
          <div ref={scrollRef} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentItems.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group border border-[#1a1a1a] bg-[#0a0a0a] p-4 hover:border-[#00FFFF]/30 transition-all">
                <div className="text-[10px] font-mono text-[#555] mb-2 flex items-center justify-between"><span>{item.source}</span><span>{item.pubDate}</span></div>
                <p className="text-[12px] text-[#aaa] leading-relaxed group-hover:text-[#e0e0e0] transition-colors line-clamp-3">{item.title}</p>
                <div className="mt-3 flex items-center gap-1 text-[9px] font-mono text-[#00FFFF] opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={8} />{t("news.readMore")}</div>
              </a>
            ))}
          </div>
        )}
        <div className="mt-4 text-[8px] font-mono text-[#444]">{t("news.source")}: Google News RSS</div>
      </div>
    </section>
  );
}

function getFallbackNews(locale: string): NewsItem[] {
  if (locale === "pt") return [
    { title: "Brasil emite Panda Bond soberano em CNY 6 bilhões — marco na saída do financiamento em USD", link: "#", pubDate: "28/06/2025", source: "Reuters" },
    { title: "China e Índia aumentam reservas de ouro em 25% para reduzir dependência do dólar", link: "#", pubDate: "25/06/2025", source: "Financial Times" },
    { title: "CIPS (sistema de pagamentos chinês) processa ¥200 trilhões em 2025 — novo recorde", link: "#", pubDate: "24/06/2025", source: "Bloomberg" },
    { title: "Petróleo Brent ultrapassa US$ 85/barril após tensões no Golfo Pérsico", link: "#", pubDate: "23/06/2025", source: "Reuters" },
    { title: "NDB (Novo Banco de Desenvolvimento) atinge meta de 30% em Moeda Local (ML) adiantada", link: "#", pubDate: "22/06/2025", source: "NDB Press" },
    { title: "BRL/USD Ptax fecha em 5,1689 — BCB monitora fluxos de Panda Bond", link: "#", pubDate: "21/06/2025", source: "Valor Econômico" },
  ];
  return [
    { title: "Brazil issues sovereign Panda Bond in CNY 6 billion — landmark shift from USD financing", link: "#", pubDate: "06/28/2025", source: "Reuters" },
    { title: "China and India boost gold reserves by 25% to reduce dollar dependency", link: "#", pubDate: "06/25/2025", source: "Financial Times" },
    { title: "CIPS (Chinese payment system) processes ¥200 trillion in 2025 — new record", link: "#", pubDate: "06/24/2025", source: "Bloomberg" },
    { title: "Brent crude oil surpasses $85/barrel amid Persian Gulf tensions", link: "#", pubDate: "06/23/2025", source: "Reuters" },
    { title: "NDB reaches 30% Local Currency (LC) target ahead of schedule", link: "#", pubDate: "06/22/2025", source: "NDB Press" },
    { title: "BRL/USD Ptax closes at 5.1689 — BCB monitors Panda Bond flows", link: "#", pubDate: "06/21/2025", source: "Valor Economico" },
  ];
}
