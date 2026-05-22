import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { carService } from "@/services/car-service";

export function ForecastChart() {
  const data = carService.getForecastIndustry();
  const last = data[data.length - 1];

  return (
    <Card className="p-3">
      <div className="text-[12px] font-semibold mb-1">
        5. DỰ BÁO CAR 2026 (TỔNG NGÀNH – ARIMA)
      </div>
      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 25, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} domain={[8, 14]} />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v) => [`${v}%`, "CAR"]}
            />
            <Line type="monotone" dataKey="car" stroke="var(--color-primary)" strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-primary)" }}>
              <LabelList dataKey="car" position="top" formatter={(v) => `${v}%`} fontSize={10} fill="var(--color-foreground)" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-muted-foreground text-center mt-1">
        Dự báo CAR trung bình ngành năm 2026:{" "}
        <span className="text-primary font-bold">{last.car}%</span>
      </div>
    </Card>
  );
}
