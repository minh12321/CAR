import { Card } from "@/components/ui/card";
import { carService } from "@/services/car-service";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCarStore } from "@/stores/car-store";

export function ForecastByGroupTable() {
  const period = useCarStore((s) => s.period);
  const { years, rows } = carService.getForecastByGroup(period);

  return (
    <Card className="p-3">
      <div className="text-[12px] font-semibold mb-2">
        6. DỰ BÁO CAR {period} THEO NHÓM NGÂN HÀNG (ARIMA)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-muted-foreground border-b border-border">
            <tr>
              <th className="text-left py-1.5 font-medium whitespace-nowrap pr-4">Nhóm ngân hàng</th>
              {years.map(y => (
                <th key={y} className="text-right py-1.5 font-medium min-w-[45px]">{y}</th>
              ))}
              <th className="text-right py-1.5 font-medium min-w-[60px] pl-2">Xu hướng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.group} className="border-b border-border/40 last:border-0 hover:bg-muted/30">
                <td className="py-1.5 whitespace-nowrap pr-4">{r.group}</td>
                {years.map(y => (
                  <td
                    key={y}
                    className={`text-right tabular-nums ${y === years[years.length - 1] ? 'font-semibold text-success' : ''}`}
                  >
                    {r.values[y].toFixed(2)}%
                  </td>
                ))}
                <td className="text-right pl-2">
                  {r.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-success inline" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-destructive inline" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
