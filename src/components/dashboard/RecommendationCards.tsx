import { Card } from "@/components/ui/card";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";
import { ArrowUp, ArrowDown, Star } from "lucide-react";
import { useT } from "@/hooks/useTranslation";

export function RecommendationCards() {
  const car = useCarStore((s) => s.car);
  const status = carService.getStatus(car);
  const th = carService.getThresholds();
  const t = useT();

  const cards = [
    {
      key: "under" as const,
      title: t("rec_increase_title"),
      sub: `(> ${th.high}%)`,
      Icon: ArrowUp,
      color: "warning",
      points: [t("rec_inc_p1"), t("rec_inc_p2"), t("rec_inc_p3")],
    },
    {
      key: "optimal" as const,
      title: t("rec_maintain_title"),
      sub: `(${th.low}% – ${th.high}%)`,
      Icon: Star,
      color: "success",
      points: [t("rec_mnt_p1"), t("rec_mnt_p2"), t("rec_mnt_p3")],
    },
    {
      key: "over" as const,
      title: t("rec_decrease_title"),
      sub: `(< ${th.low}%)`,
      Icon: ArrowDown,
      color: "destructive",
      points: [
        t("rec_dec_p1"),
        t("rec_dec_p2"),
        `${t("rec_dec_rec_prefix")} ${th.low}% ${t("rec_dec_rec_suffix")}`,
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((c) => {
        const active = c.key === status;
        const borderCls =
          c.color === "warning"
            ? "border-warning/30"
            : c.color === "success"
              ? "border-success/30"
              : "border-destructive/30";
        const bgCls = active
          ? c.color === "warning"
            ? "bg-warning/10"
            : c.color === "success"
              ? "bg-success/10"
              : "bg-destructive/10"
          : "";
        const iconCls =
          c.color === "warning"
            ? "text-warning"
            : c.color === "success"
              ? "text-success"
              : "text-destructive";
        return (
          <Card
            key={c.key}
            className={`p-3 border ${borderCls} ${bgCls} ${active ? "ring-2 ring-offset-1 ring-offset-background" : ""}`}
            style={active ? { boxShadow: `0 0 0 2px var(--color-${c.color})` } : undefined}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.Icon className={`w-4 h-4 ${iconCls}`} />
              <div className={`font-bold text-sm ${iconCls}`}>{c.title}</div>
              <div className="text-[11px] text-muted-foreground">{c.sub}</div>
            </div>
            <ul className="space-y-1 text-[11px] text-foreground/90 list-disc pl-4">
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
