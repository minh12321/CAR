import { Card } from "@/components/ui/card";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";
import { CheckCircle2, AlertTriangle, AlertCircle, Target } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useT } from "@/hooks/useTranslation";
import pt from "@/assets/pt.png"; 
import tron from "@/assets/tron.png";

export function KpiCards() {
  const car = useCarStore((s) => s.car);
  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);
  const avg = carService.getAverages();
  const status = carService.getStatus(car);
  const th = carService.getThresholds();
  const theme = useThemeStore((s) => s.theme);
  const t = useT();

  const roaDiff = +(roa - avg.roa).toFixed(2);
  const roeDiff = +(roe - avg.roe).toFixed(2);

  const statusMeta =
    status === "optimal"
      ? {
          label: t("kpi_optimal"),
          color: "text-success",
          bg: "bg-success/10 border-success/30",
          Icon: CheckCircle2,
          desc: `CAR ${car.toFixed(2)}% ${t("kpi_desc_optimal")} (${th.low}% – ${th.high}%)`,
        }
      : status === "under"
        ? {
            label: t("kpi_under"),
            color: "text-warning",
            bg: "bg-warning/10 border-warning/30",
            Icon: AlertTriangle,
            desc: `CAR ${car.toFixed(2)}% ${t("kpi_desc_under")} (${th.low}%)`,
          }
        : {
            label: t("kpi_over"),
            color: "text-destructive",
            bg: "bg-destructive/10 border-destructive/30",
            Icon: AlertCircle,
            desc: `CAR ${car.toFixed(2)}% ${t("kpi_desc_over")} (${th.high}%)`,
          };

  return (
    <div data-tour="kpi-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        icon={<img src={pt} alt="ROA" className="w-15 h-10" />}
        iconBg=""
        title={t("kpi_roa_title")}
        value={`${roa.toFixed(2)}%`}
        diff={roaDiff}
        sub={t("common_compared_avg")}
        pctLabel={t("kpi_pct_diff")}
      />
      <KpiCard
        icon={<img src={tron} alt="ROE" className="w-15 h-10" />}
        iconBg=""
        title={t("kpi_roe_title")}
        value={`${roe.toFixed(2)}%`}
        diff={roeDiff}
        sub={t("common_compared_avg")}
        pctLabel={t("kpi_pct_diff")}
      />
      <Card className={`p-3 border ${statusMeta.bg}`}>
        <div className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-muted-foreground mb-1 whitespace-nowrap tracking-tight truncate" title={t("kpi_status_title")}>
          {t("kpi_status_title")}
        </div>
        <div className="flex items-center justify-between">
          <div className={`text-xl lg:text-2xl font-bold ${statusMeta.color}`}>{statusMeta.label}</div>
          <statusMeta.Icon className={`w-7 h-7 ${statusMeta.color}`} />
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
          {statusMeta.desc}
        </div>
      </Card>
      <Card className="p-3">
        <div className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-muted-foreground mb-1.5 whitespace-nowrap tracking-tight truncate" title={t("kpi_threshold_title")}>
          {t("kpi_threshold_title")}
        </div>
        <div className="space-y-1.5 text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-info" />
            <span className="text-muted-foreground">{t("kpi_roa_threshold")}</span>
            <span className="ml-auto font-bold tabular-nums">{th.roaOptimalCar.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-success" />
            <span className="text-muted-foreground">{t("kpi_roe_threshold")}</span>
            <span className="ml-auto font-bold tabular-nums">{th.roeOptimalCar.toFixed(2)}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function KpiCard({
  icon,
  iconBg,
  title,
  value,
  diff,
  sub,
  pctLabel,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  diff: number;
  sub: string;
  pctLabel: string;
}) {
  const positive = diff >= 0;
  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-muted-foreground whitespace-nowrap tracking-tight truncate" title={title}>{title}</div>
          <div className="text-xl lg:text-2xl font-bold text-primary tabular-nums leading-tight">{value}</div>
          <div className={`text-[11px] font-medium ${positive ? "text-success" : "text-destructive"}`}>
            {positive ? "↑" : "↓"} {Math.abs(diff).toFixed(2)} {pctLabel}
          </div>
          <div className="text-[10px] text-muted-foreground">{sub}</div>
        </div>
      </div>
    </Card>
  );
}
