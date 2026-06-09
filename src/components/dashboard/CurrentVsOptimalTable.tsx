import { Card } from "@/components/ui/card";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";
import { useT } from "@/hooks/useTranslation";

export function CurrentVsOptimalTable() {
  const car = useCarStore((s) => s.car);
  const metric = useCarStore((s) => s.metric);
  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);
  const avg = carService.getAverages();
  const th = carService.getThresholds();
  const t = useT();

  const roaDiff = +(roa - avg.roa).toFixed(2);
  const roeDiff = +(roe - avg.roe).toFixed(2);

  const showRoa = metric === "All" || metric === "ROA";
  const showRoe = metric === "All" || metric === "ROE";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card className="p-3">
        <div className="text-[11px] font-semibold mb-2">
          {t("table_current_title")} ({car.toFixed(2)}%)
        </div>
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left py-1.5 font-medium">{t("table_col_metric")}</th>
              <th className="text-right py-1.5 font-medium">{t("table_col_current")}</th>
              <th className="text-right py-1.5 font-medium">{t("table_col_avg")}</th>
              <th className="text-right py-1.5 font-medium">{t("table_col_diff")}</th>
            </tr>
          </thead>
          <tbody>
            {showRoa && <Row label="ROA (%)" current={roa} avg={avg.roa} diff={roaDiff} pctLabel={t("table_pct_diff")} />}
            {showRoe && <Row label="ROE (%)" current={roe} avg={avg.roe} diff={roeDiff} pctLabel={t("table_pct_diff")} />}
          </tbody>
        </table>
      </Card>

      <Card className="p-3">
        <div className="text-[11px] font-semibold mb-2">{t("table_optimal_title")}</div>
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left py-1.5 font-medium">{t("table_col_metric")}</th>
              <th className="text-right py-1.5 font-medium">{t("table_col_car_opt")}</th>
              <th className="text-right py-1.5 font-medium">{t("table_col_max_eff")}</th>
            </tr>
          </thead>
          <tbody>
            {showRoa && (
              <tr className="border-b border-border/50">
                <td className="py-1.5">ROA (%)</td>
                <td className="text-right tabular-nums">{th.roaOptimalCar.toFixed(2)}%</td>
                <td className="text-right tabular-nums">{th.roaMax.toFixed(2)}%</td>
              </tr>
            )}
            {showRoe && (
              <tr>
                <td className="py-1.5">ROE (%)</td>
                <td className="text-right tabular-nums">{th.roeOptimalCar.toFixed(2)}%</td>
                <td className="text-right tabular-nums">{th.roeMax.toFixed(2)}%</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Row({
  label,
  current,
  avg,
  diff,
  pctLabel,
}: {
  label: string;
  current: number;
  avg: number;
  diff: number;
  pctLabel: string;
}) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-1.5">{label}</td>
      <td className="text-right tabular-nums font-semibold">{current.toFixed(2)}%</td>
      <td className="text-right tabular-nums text-muted-foreground">{avg.toFixed(2)}%</td>
      <td className={`text-right tabular-nums font-medium ${diff >= 0 ? "text-success" : "text-destructive"}`}>
        {diff >= 0 ? "+" : ""}
        {diff.toFixed(2)} {pctLabel}
      </td>
    </tr>
  );
}
