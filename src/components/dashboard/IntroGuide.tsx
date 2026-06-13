import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  SlidersHorizontal, BarChart2, TrendingUp,
  Sparkles, LineChart, BookOpen, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useT } from "@/hooks/useTranslation";

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  {
    selector: "[data-tour='car-slider']",
    icon: SlidersHorizontal,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    titleKey: "intro_step1_title" as const,
    descKey: "intro_step1_desc" as const,
  },
  {
    selector: "[data-tour='kpi-cards']",
    icon: BarChart2,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    titleKey: "intro_step2_title" as const,
    descKey: "intro_step2_desc" as const,
  },
  {
    selector: "[data-tour='nonlinear-chart']",
    icon: TrendingUp,
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/30",
    titleKey: "intro_step3_title" as const,
    descKey: "intro_step3_desc" as const,
  },
  {
    selector: "[data-tour='ai-insight']",
    icon: Sparkles,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    titleKey: "intro_step4_title" as const,
    descKey: "intro_step4_desc" as const,
  },
  {
    selector: "[data-tour='rec-cards']",
    icon: LineChart,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    titleKey: "intro_step5_title" as const,
    descKey: "intro_step5_desc" as const,
  },
] as const;

const PADDING = 10; // px xung quanh element highlight
const TOOLTIP_W = 320;
const TOOLTIP_H = 220; // estimated

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r;
}

/** Tính vị trí tooltip để không ra ngoài viewport */
function calcTooltipPos(
  rect: DOMRect,
  vpW: number,
  vpH: number,
): {
  top: number;
  left: number;
  arrowSide: "top" | "bottom" | "left" | "right";
  arrowOffset: number;
} {
  const spaceBelow = vpH - rect.bottom - PADDING;
  const spaceAbove = rect.top - PADDING;
  const spaceRight = vpW - rect.right - PADDING;

  let top: number;
  let left: number;
  let arrowSide: "top" | "bottom" | "left" | "right";

  // Ưu tiên đặt bên dưới
  if (spaceBelow >= TOOLTIP_H + 16) {
    top = rect.bottom + PADDING + 8;
    arrowSide = "top";
  } else if (spaceAbove >= TOOLTIP_H + 16) {
    top = rect.top - PADDING - TOOLTIP_H - 8;
    arrowSide = "bottom";
  } else if (spaceRight >= TOOLTIP_W + 16) {
    top = Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2);
    arrowSide = "left";
  } else {
    top = Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2);
    arrowSide = "right";
  }

  // Căn ngang
  if (arrowSide === "top" || arrowSide === "bottom") {
    left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    left = Math.max(8, Math.min(left, vpW - TOOLTIP_W - 8));
  } else if (arrowSide === "left") {
    left = rect.right + PADDING + 8;
    left = Math.min(left, vpW - TOOLTIP_W - 8);
  } else {
    left = rect.left - PADDING - TOOLTIP_W - 8;
    left = Math.max(8, left);
  }

  top = Math.max(8, Math.min(top, vpH - TOOLTIP_H - 8));

  // Arrow offset relative to tooltip edge
  let arrowOffset = 0;
  if (arrowSide === "top" || arrowSide === "bottom") {
    arrowOffset = rect.left + rect.width / 2 - left;
    arrowOffset = Math.max(20, Math.min(arrowOffset, TOOLTIP_W - 20));
  } else {
    arrowOffset = rect.top + rect.height / 2 - top;
    arrowOffset = Math.max(20, Math.min(arrowOffset, TOOLTIP_H - 20));
  }

  return { top, left, arrowSide, arrowOffset };
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IntroGuide() {
  const t = useT();
  const hasSeenIntro = useAuthStore((s) => s.hasSeenIntro);
  const markIntroSeen = useAuthStore((s) => s.markIntroSeen);

  const [phase, setPhase] = useState<"welcome" | "tour" | "closed">("closed");
  const [stepIdx, setStepIdx] = useState(0);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<ReturnType<typeof calcTooltipPos> | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const rafRef = useRef<number>(0);

  // Auto-open on first login of session
  useEffect(() => {
    if (!hasSeenIntro) {
      const t = setTimeout(() => setPhase("welcome"), 500);
      return () => clearTimeout(t);
    }
  }, [hasSeenIntro]);

  // Tính vị trí highlight khi step thay đổi
  const updatePos = useCallback(() => {
    if (phase !== "tour") return;
    const step = STEPS[stepIdx];
    const rect = getRect(step.selector);
    if (!rect) return;

    // Scroll element vào giữa màn hình
    const el = document.querySelector(step.selector) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });

    // Đợi scroll xong rồi tính lại
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const updated = getRect(step.selector);
      if (!updated) return;
      setHighlight(updated);
      setTooltipPos(calcTooltipPos(updated, window.innerWidth, window.innerHeight));
    });
  }, [phase, stepIdx]);

  useLayoutEffect(() => {
    if (phase !== "tour") return;
    // Ngắn delay để scroll trước
    const timer = setTimeout(updatePos, 250);
    return () => clearTimeout(timer);
  }, [phase, stepIdx, updatePos]);

  // Recalc on resize
  useEffect(() => {
    if (phase !== "tour") return;
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [phase, updatePos]);

  // Cleanup
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const goTo = (idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setHighlight(null);
    setTimeout(() => {
      setStepIdx(idx);
      setTransitioning(false);
    }, 200);
  };

  const next = () => {
    if (stepIdx < STEPS.length - 1) goTo(stepIdx + 1);
    else finish();
  };

  const prev = () => {
    if (stepIdx > 0) goTo(stepIdx - 1);
  };

  const finish = () => {
    markIntroSeen();
    setPhase("closed");
  };

  const startTour = () => {
    setStepIdx(0);
    setHighlight(null);
    setPhase("tour");
  };

  // ── CLOSED: chỉ hiện nút replay ───────────────────────────────────────────
  if (phase === "closed") {
    return (
      <button
        onClick={() => setPhase("welcome")}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        title={t("intro_btn_replay")}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t("intro_btn_replay")}</span>
      </button>
    );
  }

  // ── WELCOME modal ─────────────────────────────────────────────────────────
  if (phase === "welcome") {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      >
        <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={finish}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center text-center px-8 py-10 gap-5">
            <div className="w-18 h-18 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-sm p-4">
              <BookOpen className="w-9 h-9 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">{t("intro_welcome_title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("intro_welcome_desc")}</p>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${s.bg} ${s.border} ${s.color}`}>
                    <Icon className="w-3 h-3" />
                    {t(s.titleKey)}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={finish}>
                {t("intro_btn_skip")}
              </Button>
              <Button className="flex-1" onClick={startTour}>
                {t("intro_btn_next")}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // ── SPOTLIGHT TOUR ────────────────────────────────────────────────────────
  const step = STEPS[stepIdx];
  const Icon = step.icon;
  const hlRect = highlight;

  // Vùng highlight với padding
  const hl = hlRect
    ? {
        x: hlRect.left - PADDING,
        y: hlRect.top - PADDING,
        w: hlRect.width + PADDING * 2,
        h: hlRect.height + PADDING * 2,
        r: 10,
      }
    : null;

  const vpW = window.innerWidth;
  const vpH = window.innerHeight;

  return createPortal(
    <>
      {/* ── SVG Overlay (backdrop với lỗ hổng) ── */}
      <svg
        className="fixed inset-0 z-[9998] pointer-events-none"
        width={vpW}
        height={vpH}
        style={{ transition: "all 0.3s ease" }}
      >
        <defs>
          <mask id="tour-mask">
            {/* Toàn màn hình trắng = hiện backdrop */}
            <rect x={0} y={0} width={vpW} height={vpH} fill="white" />
            {/* Lỗ hổng đen = trong suốt (không bị tối) */}
            {hl && (
              <rect
                x={hl.x}
                y={hl.y}
                width={hl.w}
                height={hl.h}
                rx={hl.r}
                fill="black"
                style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
              />
            )}
          </mask>
        </defs>
        {/* Lớp tối áp dụng mask */}
        <rect
          x={0} y={0} width={vpW} height={vpH}
          fill="rgba(0,0,0,0.65)"
          mask="url(#tour-mask)"
        />
        {/* Viền sáng quanh element */}
        {hl && (
          <rect
            x={hl.x} y={hl.y} width={hl.w} height={hl.h} rx={hl.r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            opacity={0.8}
            style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>

      {/* ── Click-through blocker (chặn click ngoài tooltip) ── */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={next}
        style={{ cursor: "pointer" }}
      />

      {/* ── Tooltip ── */}
      {tooltipPos && !transitioning && (
        <div
          className="fixed z-[10000] pointer-events-auto"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: TOOLTIP_W,
            animation: "tourFadeIn 0.2s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <Arrow side={tooltipPos.arrowSide} offset={tooltipPos.arrowOffset} />

          {/* Card */}
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-medium ${step.bg} ${step.border} ${step.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t(step.titleKey)}
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Dot indicators */}
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-200 ${i === stepIdx ? "w-4 h-2 bg-primary" : "w-2 h-2 bg-muted hover:bg-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/90 leading-relaxed">
                {t(step.descKey)}
              </p>

              {/* Step counter + nav */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">
                  {stepIdx + 1} {t("intro_step_of")} {STEPS.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={finish}
                    className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
                  >
                    {t("intro_btn_skip")}
                  </button>
                  {stepIdx > 0 && (
                    <Button size="sm" variant="outline" onClick={prev} className="h-7 px-2 text-xs gap-1">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      {t("intro_btn_prev")}
                    </Button>
                  )}
                  <Button size="sm" onClick={next} className="h-7 px-3 text-xs gap-1">
                    {stepIdx < STEPS.length - 1 ? t("intro_btn_next") : t("intro_btn_start")}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>,
    document.body,
  );
}

// ─── Arrow component ──────────────────────────────────────────────────────────
function Arrow({
  side,
  offset,
}: {
  side: "top" | "bottom" | "left" | "right";
  offset: number;
}) {
  const size = 10;

  if (side === "top") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ top: -size, left: offset - size / 2 }}
      >
        <svg width={size * 2} height={size} viewBox={`0 0 ${size * 2} ${size}`}>
          <polygon
            points={`${size},0 ${size * 2},${size} 0,${size}`}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        </svg>
      </div>
    );
  }
  if (side === "bottom") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ bottom: -size, left: offset - size / 2 }}
      >
        <svg width={size * 2} height={size} viewBox={`0 0 ${size * 2} ${size}`}>
          <polygon
            points={`0,0 ${size * 2},0 ${size},${size}`}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        </svg>
      </div>
    );
  }
  if (side === "left") {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: -size, top: offset - size / 2 }}
      >
        <svg width={size} height={size * 2} viewBox={`0 0 ${size} ${size * 2}`}>
          <polygon
            points={`${size},0 ${size},${size * 2} 0,${size}`}
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        </svg>
      </div>
    );
  }
  // right
  return (
    <div
      className="absolute pointer-events-none"
      style={{ right: -size, top: offset - size / 2 }}
    >
      <svg width={size} height={size * 2} viewBox={`0 0 ${size} ${size * 2}`}>
        <polygon
          points={`0,0 ${size},${size} 0,${size * 2}`}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
