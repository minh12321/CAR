import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SlidersHorizontal, BarChart2, TrendingUp, Sparkles,
  LineChart, Settings, Sun, UserCircle, BookOpen, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useT } from "@/hooks/useTranslation";
import { create } from "zustand";

// ─── Shared tour phase store ──────────────────────────────────────────────────
type TourPhase = "welcome" | "tour" | "closed";
type TourStore = { phase: TourPhase; setPhase: (p: TourPhase) => void };
export const useTourStore = create<TourStore>((set) => ({
  phase: "closed",
  setPhase: (phase) => set({ phase }),
}));

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  {
    selector: "[data-tour='car-slider']",
    route: "/dashboard",
    icon: SlidersHorizontal,
    color: "text-primary",   bg: "bg-primary/10",    border: "border-primary/30",
    titleKey: "intro_step1_title" as const,
    descKey:  "intro_step1_desc"  as const,
  },
  {
    selector: "[data-tour='kpi-cards']",
    route: "/dashboard",
    icon: BarChart2,
    color: "text-success",   bg: "bg-success/10",    border: "border-success/30",
    titleKey: "intro_step2_title" as const,
    descKey:  "intro_step2_desc"  as const,
  },
  {
    selector: "[data-tour='nonlinear-chart']",
    route: "/dashboard",
    icon: TrendingUp,
    color: "text-info",      bg: "bg-info/10",       border: "border-info/30",
    titleKey: "intro_step3_title" as const,
    descKey:  "intro_step3_desc"  as const,
  },
  {
    selector: "[data-tour='ai-insight']",
    route: "/dashboard",
    icon: Sparkles,
    color: "text-warning",   bg: "bg-warning/10",    border: "border-warning/30",
    titleKey: "intro_step4_title" as const,
    descKey:  "intro_step4_desc"  as const,
  },
  {
    selector: "[data-tour='rec-cards']",
    route: "/dashboard",
    icon: LineChart,
    color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30",
    titleKey: "intro_step5_title" as const,
    descKey:  "intro_step5_desc"  as const,
  },
  // ── Settings steps ────────────────────────────────────────────────────────
  {
    selector: "[data-tour='settings-page']",
    route: "/settings",
    icon: Settings,
    color: "text-primary",   bg: "bg-primary/10",    border: "border-primary/30",
    titleKey: "intro_step6_title" as const,
    descKey:  "intro_step6_desc"  as const,
  },
  {
    selector: "[data-tour='settings-appearance']",
    route: "/settings",
    icon: Sun,
    color: "text-warning",   bg: "bg-warning/10",    border: "border-warning/30",
    titleKey: "intro_step7_title" as const,
    descKey:  "intro_step7_desc"  as const,
  },
  {
    selector: "[data-tour='settings-account']",
    route: "/settings",
    icon: UserCircle,
    color: "text-success",   bg: "bg-success/10",    border: "border-success/30",
    titleKey: "intro_step8_title" as const,
    descKey:  "intro_step8_desc"  as const,
  },
] as const;

const PADDING  = 10;
const TOOLTIP_W = 340;
const TOOLTIP_H = 260; // max estimated height

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  return el ? el.getBoundingClientRect() : null;
}

function calcTooltipPos(rect: DOMRect, vpW: number, vpH: number) {
  const spaceBelow  = vpH - rect.bottom - PADDING;
  const spaceAbove  = rect.top  - PADDING;
  const spaceRight  = vpW - rect.right  - PADDING;
  const spaceLeft   = rect.left - PADDING;

  let top: number, left: number;
  let arrowSide: "top" | "bottom" | "left" | "right";

  if      (spaceBelow >= TOOLTIP_H + 16) { top = rect.bottom + PADDING + 8; arrowSide = "top"; }
  else if (spaceAbove >= TOOLTIP_H + 16) { top = rect.top - PADDING - TOOLTIP_H - 8; arrowSide = "bottom"; }
  else if (spaceRight >= TOOLTIP_W + 16) { top = Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2); arrowSide = "left"; }
  else if (spaceLeft  >= TOOLTIP_W + 16) { top = Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2); arrowSide = "right"; }
  else                                   { top = Math.max(8, rect.top + rect.height / 2 - TOOLTIP_H / 2); arrowSide = "bottom"; }

  if (arrowSide === "top" || arrowSide === "bottom") {
    left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    left = Math.max(8, Math.min(left, vpW - TOOLTIP_W - 8));
  } else if (arrowSide === "left") {
    left = Math.min(rect.right + PADDING + 8, vpW - TOOLTIP_W - 8);
  } else {
    left = Math.max(8, rect.left - PADDING - TOOLTIP_W - 8);
  }

  top = Math.max(8, Math.min(top, vpH - TOOLTIP_H - 8));

  let arrowOffset = 0;
  if (arrowSide === "top" || arrowSide === "bottom") {
    arrowOffset = Math.max(24, Math.min(rect.left + rect.width / 2 - left, TOOLTIP_W - 24));
  } else {
    arrowOffset = Math.max(24, Math.min(rect.top + rect.height / 2 - top, TOOLTIP_H - 24));
  }

  return { top, left, arrowSide, arrowOffset };
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IntroGuide() {
  const t            = useT();
  const navigate     = useNavigate();
  const location     = useLocation();
  const hasSeenIntro = useAuthStore((s) => s.hasSeenIntro);
  const markIntroSeen = useAuthStore((s) => s.markIntroSeen);
  const phase        = useTourStore((s) => s.phase);
  const setPhase     = useTourStore((s) => s.setPhase);

  const [stepIdx,      setStepIdx]      = useState(0);
  const [highlight,    setHighlight]    = useState<DOMRect | null>(null);
  const [tooltipPos,   setTooltipPos]   = useState<ReturnType<typeof calcTooltipPos> | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const rafRef = useRef<number>(0);

  // ── Auto-open đầu session ─────────────────────────────────────────────────
  useEffect(() => {
    if (!hasSeenIntro) {
      const timer = setTimeout(() => setPhase("welcome"), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenIntro, setPhase]);

  // ── Tính vị trí highlight — scroll trong <main>, KHÔNG lock body ──────────
  const updatePos = useCallback(() => {
    if (phase !== "tour") return;
    const step = STEPS[stepIdx];

    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (!el) return;

    // Scroll element vào giữa viewport bên trong <main>
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    cancelAnimationFrame(rafRef.current);
    // Đợi smooth scroll hoàn tất (~600ms) rồi mới đo rect
    rafRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        const updated = getRect(step.selector);
        if (!updated) return;
        setHighlight(updated);
        setTooltipPos(calcTooltipPos(updated, window.innerWidth, window.innerHeight));
      }, 600);
    });
  }, [phase, stepIdx]);

  useLayoutEffect(() => {
    if (phase !== "tour") return;
    const timer = setTimeout(updatePos, 300);
    return () => clearTimeout(timer);
  }, [phase, stepIdx, updatePos]);

  // Recalc on resize
  useEffect(() => {
    if (phase !== "tour") return;
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [phase, updatePos]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Navigate nếu cần đổi route ────────────────────────────────────────────
  const goTo = (idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setHighlight(null);
    setTooltipPos(null);

    const targetRoute = STEPS[idx].route;
    if (location.pathname !== targetRoute) {
      navigate(targetRoute);
      setTimeout(() => { setStepIdx(idx); setTransitioning(false); }, 500);
    } else {
      setTimeout(() => { setStepIdx(idx); setTransitioning(false); }, 150);
    }
  };

  const next   = () => stepIdx < STEPS.length - 1 ? goTo(stepIdx + 1) : finish();
  const prev   = () => stepIdx > 0 && goTo(stepIdx - 1);
  const finish = () => {
    if (location.pathname !== "/dashboard") navigate("/dashboard");
    markIntroSeen();
    setPhase("closed");
  };
  const startTour = () => {
    setStepIdx(0);
    setHighlight(null);
    setTooltipPos(null);
    if (location.pathname !== "/dashboard") navigate("/dashboard");
    setPhase("tour");
  };

  if (phase === "closed") return null;

  // ── WELCOME ───────────────────────────────────────────────────────────────
  if (phase === "welcome") {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      >
        <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button onClick={finish}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center text-center px-8 py-10 gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-sm">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{t("intro_welcome_title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("intro_welcome_desc")}</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${s.bg} ${s.border} ${s.color}`}>
                    <Icon className="w-3 h-3" />{t(s.titleKey)}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={finish}>{t("intro_btn_skip")}</Button>
              <Button className="flex-1" onClick={startTour}>
                {t("intro_btn_next")}<ChevronRight className="w-4 h-4 ml-1" />
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
  const vpW  = window.innerWidth;
  const vpH  = window.innerHeight;

  const hl = highlight ? {
    x: highlight.left   - PADDING,
    y: highlight.top    - PADDING,
    w: highlight.width  + PADDING * 2,
    h: highlight.height + PADDING * 2,
    r: 10,
  } : null;

  return createPortal(
    <>
      {/* ── Backdrop SVG với lỗ spotlight ── */}
      <svg className="fixed inset-0 z-[9998] pointer-events-none" width={vpW} height={vpH}>
        <defs>
          <mask id="tour-mask">
            <rect x={0} y={0} width={vpW} height={vpH} fill="white" />
            {hl && (
              <rect x={hl.x} y={hl.y} width={hl.w} height={hl.h} rx={hl.r}
                fill="black"
                style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
              />
            )}
          </mask>
        </defs>
        <rect x={0} y={0} width={vpW} height={vpH} fill="rgba(0,0,0,0.6)" mask="url(#tour-mask)" />
        {hl && (
          <rect x={hl.x} y={hl.y} width={hl.w} height={hl.h} rx={hl.r}
            fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} strokeDasharray="6 3" opacity={0.9}
            style={{ transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
      </svg>

      {/* ── Click backdrop → next ── */}
      <div className="fixed inset-0 z-[9998]" onClick={next} style={{ cursor: "pointer" }} />

      {/* ── Tooltip ── */}
      {tooltipPos && !transitioning && (
        <div
          className="fixed z-[10000] pointer-events-auto"
          style={{ top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_W, animation: "tourFadeIn 0.2s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Arrow side={tooltipPos.arrowSide} offset={tooltipPos.arrowOffset} />

          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <div className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
            </div>

            <div className="p-4 space-y-3">
              {/* Badge + dot nav */}
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${step.bg} ${step.border} ${step.color}`}>
                  <Icon className="w-3.5 h-3.5" />{t(step.titleKey)}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {STEPS.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === stepIdx ? "w-4 h-2 bg-primary" : "w-2 h-2 bg-muted hover:bg-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description — hỗ trợ xuống dòng \n */}
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {t(step.descKey)}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">{stepIdx + 1} {t("intro_step_of")} {STEPS.length}</span>
                <div className="flex gap-2 items-center">
                  <button onClick={finish}
                    className="text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors">
                    {t("intro_btn_skip")}
                  </button>
                  {stepIdx > 0 && (
                    <Button size="sm" variant="outline" onClick={prev} className="h-7 px-2 text-xs gap-1">
                      <ChevronLeft className="w-3.5 h-3.5" />{t("intro_btn_prev")}
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

// ─── Replay button ────────────────────────────────────────────────────────────
export function IntroReplayButton() {
  const t        = useT();
  const setPhase = useTourStore((s) => s.setPhase);
  return (
    <button
      onClick={() => setPhase("welcome")}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-1"
      title={t("intro_btn_replay")}
    >
      <BookOpen className="w-4 h-4" />
      <span className="hidden md:inline">{t("intro_btn_replay")}</span>
    </button>
  );
}

// ─── Arrow ────────────────────────────────────────────────────────────────────
function Arrow({ side, offset }: { side: "top" | "bottom" | "left" | "right"; offset: number }) {
  const s = 10;
  const card   = "hsl(var(--card))";
  const border = "hsl(var(--border))";
  if (side === "top")
    return <div className="absolute pointer-events-none" style={{ top: -s, left: offset - s }}>
      <svg width={s*2} height={s} viewBox={`0 0 ${s*2} ${s}`}><polygon points={`${s},0 ${s*2},${s} 0,${s}`} fill={card} stroke={border} strokeWidth={1}/></svg>
    </div>;
  if (side === "bottom")
    return <div className="absolute pointer-events-none" style={{ bottom: -s, left: offset - s }}>
      <svg width={s*2} height={s} viewBox={`0 0 ${s*2} ${s}`}><polygon points={`0,0 ${s*2},0 ${s},${s}`} fill={card} stroke={border} strokeWidth={1}/></svg>
    </div>;
  if (side === "left")
    return <div className="absolute pointer-events-none" style={{ left: -s, top: offset - s }}>
      <svg width={s} height={s*2} viewBox={`0 0 ${s} ${s*2}`}><polygon points={`${s},0 ${s},${s*2} 0,${s}`} fill={card} stroke={border} strokeWidth={1}/></svg>
    </div>;
  return <div className="absolute pointer-events-none" style={{ right: -s, top: offset - s }}>
    <svg width={s} height={s*2} viewBox={`0 0 ${s} ${s*2}`}><polygon points={`0,0 ${s},${s} 0,${s*2}`} fill={card} stroke={border} strokeWidth={1}/></svg>
  </div>;
}
