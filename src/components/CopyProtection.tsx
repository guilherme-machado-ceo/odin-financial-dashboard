// ============================================================
// COPY PROTECTION ENGINE v1.0 — Hubstry Deep Tech
// Multi-layer defense: watermark, anti-copy, domain lock,
// console fingerprint, devtools detection
// ============================================================

import { useEffect, useRef } from "react";

// ── CONFIG ──
const AUTHORIZED_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "zql5spkdoior4.kimi.page",
  "odin-financial-dashboard.vercel.app",
  "odin-financial-dashboard-git-main-guilherme-machado-ceos-projects.vercel.app",
  "guilherme-machado-ceo.github.io",
];

const BRAND = "HUBSTRY Deep Tech";
const PRODUCT = "ODIN Financial Dashboard";
const COPYRIGHT = "© 2026 Hubstry Deep Tech · Overall 720°. All rights reserved.";
const WATERMARK_TEXT = "HUBSTRY · ODIN · CONFIDENTIAL";

export default function CopyProtection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watermarkInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Layer 1: Domain Lock ──
  useEffect(() => {
    const hostname = window.location.hostname;
    const isAuthorized = AUTHORIZED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
    if (!isAuthorized && hostname !== "") {
      document.body.innerHTML = `
        <div style="background:#050505;color:#FF4444;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;text-align:center;padding:2rem;">
          <div style="font-size:48px;margin-bottom:1rem;">🔒</div>
          <h1 style="font-size:18px;margin-bottom:0.5rem;">UNAUTHORIZED DOMAIN</h1>
          <p style="font-size:12px;color:#888;max-width:400px;">
            This instance of ${PRODUCT} is not licensed for use on this domain.<br/><br/>
            ${COPYRIGHT}<br/>
            Contact: hubstry@deeptech.ai
          </p>
        </div>
      `;
    }
  }, []);

  // ── Layer 2: Console Fingerprint ──
  useEffect(() => {
    const styles = "color: #00FFFF;font-size: 12px;font-family: JetBrains Mono, monospace;font-weight: bold;padding: 8px 0;";
    const warningStyles = "color: #FF8C00;font-size: 10px;font-family: JetBrains Mono, monospace;";

    console.log(
      `%c╔══════════════════════════════════════════╗\n║  ${PRODUCT}          ║\n║  ${COPYRIGHT}           ║\n║  Built by: ${BRAND}              ║\n╚══════════════════════════════════════════╝`,
      styles
    );
    console.log(
      `%c⚠️  This software is proprietary and confidential.\n⚠️  Unauthorized copying, distribution, or modification is strictly prohibited.\n⚠️  Violations will be prosecuted to the fullest extent of the law.`,
      warningStyles
    );

    const originalClear = console.clear;
    console.clear = () => {
      originalClear?.();
      console.log(`%c${PRODUCT} — Console protection active.`, warningStyles);
    };

    return () => { console.clear = originalClear; };
  }, []);

  // ── Layer 3: Watermark Canvas ──
  useEffect(() => {
    function drawWatermark() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.018)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const spacing = 200;
      const angle = -30 * (Math.PI / 180);

      for (let y = -canvas.height; y < canvas.height * 2; y += spacing) {
        for (let x = -canvas.width; x < canvas.width * 2; x += spacing * 1.5) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillText(WATERMARK_TEXT, 0, 0);
          ctx.fillText(`${BRAND} · ${new Date().getFullYear()}`, 0, 14);
          ctx.restore();
        }
      }
      ctx.restore();

      // Corner mark
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(0, 255, 255, 0.12)";
      ctx.textAlign = "right";
      ctx.fillText(`🔒 ${PRODUCT} · ${BRAND}`, canvas.width - 16, canvas.height - 16);
    }

    drawWatermark();
    window.addEventListener("resize", drawWatermark);
    watermarkInterval.current = setInterval(drawWatermark, 30000);

    return () => {
      window.removeEventListener("resize", drawWatermark);
      if (watermarkInterval.current) clearInterval(watermarkInterval.current);
    };
  }, []);

  // ── Layer 4: Anti-Copy Events ──
  useEffect(() => {
    function blockEvent(e: Event) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    function handleKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && (
        e.key === "c" || e.key === "s" || e.key === "u" || e.key === "p" ||
        (e.shiftKey && (e.key === "i" || e.key === "j" || e.key === "c"))
      )) {
        blockEvent(e);
      }
      if (e.key === "F12") blockEvent(e);
      if (e.key === "PrintScreen") {
        blockEvent(e);
        alert("📸 Screenshots are disabled for this confidential dashboard.");
      }
    }

    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("canvas") || target.closest("[data-chart]") || target.closest(".recharts-wrapper")) {
        blockEvent(e);
      }
    }

    function handleBeforePrint() {
      document.body.innerHTML = `
        <div style="background:#050505;color:#FF8C00;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;">
          <div>
            <div style="font-size:32px;margin-bottom:1rem;">🚫</div>
            <h1 style="font-size:16px;">PRINTING IS DISABLED</h1>
            <p style="font-size:11px;color:#888;margin-top:0.5rem;">${COPYRIGHT}</p>
          </div>
        </div>
      `;
    }

    document.addEventListener("copy", blockEvent, true);
    document.addEventListener("cut", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);
    document.addEventListener("selectstart", blockEvent, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeydown, true);
    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      document.removeEventListener("copy", blockEvent, true);
      document.removeEventListener("cut", blockEvent, true);
      document.removeEventListener("dragstart", blockEvent, true);
      document.removeEventListener("selectstart", blockEvent, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeydown, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, []);

  // ── Layer 5: DevTools Detection ──
  useEffect(() => {
    let devtoolsOpen = false;
    function detectDevTools() {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const isOpen = widthThreshold || heightThreshold;
      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        console.log(
          `%c⚠️ Developer tools detected. This is a monitored environment.`,
          "color: #FF4444; font-family: monospace; font-size: 12px;"
        );
      } else if (!isOpen) {
        devtoolsOpen = false;
      }
    }
    window.addEventListener("resize", detectDevTools);
    detectDevTools();
    return () => { window.removeEventListener("resize", detectDevTools); };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9998,
        }}
        aria-hidden="true"
      />
      <noscript>
        <div style={{
          position: "fixed", inset: 0, background: "#050505", color: "#FF4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: "14px", zIndex: 99999,
        }}>
          🔒 JavaScript is required to view this protected dashboard.
        </div>
      </noscript>
    </>
  );
}
