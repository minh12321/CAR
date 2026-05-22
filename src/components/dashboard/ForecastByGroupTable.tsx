import { Card } from "@/components/ui/card";
import { carService } from "@/services/car-service";
import { TrendingUp } from "lucide-react";

export function ForecastByGroupTable() {
  const rows = carService.getForecastByGroup();
  return (
    <Card className="p-3">
      <div className="text-[12px] font-semibold mb-2">
        6. DỰ BÁO CAR 2026 THEO NHÓM NGÂN HÀNG (ARIMA)
      </div>
      <table className="w-full text-xs">
        <thead className="text-muted-foreground border-b border-border">
          <tr>
            <th className="text-left py-1.5 font-medium">Nhóm ngân hàng</th>
            <th className="text-right py-1.5 font-medium">2023</th>
            <th className="text-right py-1.5 font-medium">2024</th>
            <th className="text-right py-1.5 font-medium">2025</th>
            <th className="text-right py-1.5 font-medium">2026F</th>
            <th className="text-right py-1.5 font-medium">Xu hướng</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.group} className="border-b border-border/40 last:border-0">
              <td className="py-1.5">{r.group}</td>
              <td className="text-right tabular-nums">{r["2023"].toFixed(2)}%</td>
              <td className="text-right tabular-nums">{r["2024"].toFixed(2)}%</td>
              <td className="text-right tabular-nums">{r["2025"].toFixed(2)}%</td>
              <td className="text-right tabular-nums font-semibold text-success">
                {r["2026F"].toFixed(2)}%
              </td>
              <td className="text-right">
                <TrendingUp className="w-3.5 h-3.5 text-success inline" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
