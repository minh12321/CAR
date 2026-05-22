import { Card } from "@/components/ui/card";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";

export function NonlinearChart() {
  const car = useCarStore((s) => s.car);
  const th = carService.getThresholds();
  const data = carService.getCurveData();
  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] font-semibold">
          2. QUAN HỆ PHI TUYẾN GIỮA CAR VÀ HIỆU QUẢ KINH DOANH
        </div>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 25, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis
              dataKey="car"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              label={{ value: "CAR (%)", position: "insideBottom", offset: -5, fontSize: 10, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              yAxisId="roa"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              label={{ value: "ROA (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              yAxisId="roe"
              orientation="right"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              label={{ value: "ROE (%)", angle: 90, position: "insideRight", fontSize: 10, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(v) => `CAR: ${v}%`}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceArea yAxisId="roa" x1={5} x2={th.low} fill="var(--color-warning)" fillOpacity={0.06} />
            <ReferenceArea yAxisId="roa" x1={th.low} x2={th.high} fill="var(--color-success)" fillOpacity={0.08} />
            <ReferenceArea yAxisId="roa" x1={th.high} x2={20} fill="var(--color-destructive)" fillOpacity={0.06} />
            <ReferenceLine yAxisId="roa" x={th.low} stroke="var(--color-warning)" strokeDasharray="4 4" label={{ value: `${th.low}%`, position: "top", fontSize: 10, fill: "var(--color-warning)" }} />
            <ReferenceLine yAxisId="roa" x={th.high} stroke="var(--color-destructive)" strokeDasharray="4 4" label={{ value: `${th.high}%`, position: "top", fontSize: 10, fill: "var(--color-destructive)" }} />
            <ReferenceLine yAxisId="roa" x={car} stroke="var(--color-primary)" strokeWidth={2} label={{ value: `CAR ${car.toFixed(2)}%`, position: "top", fontSize: 10, fill: "var(--color-primary)" }} />
            <Line yAxisId="roa" type="monotone" dataKey="roa" name="ROA (%)" stroke="var(--color-success)" strokeWidth={2} dot={false} />
            <Line yAxisId="roe" type="monotone" dataKey="roe" name="ROE (%)" stroke="var(--color-info)" strokeWidth={2} dot={false} />
            <ReferenceDot yAxisId="roa" x={car} y={roa} r={5} fill="var(--color-success)" stroke="var(--color-card)" strokeWidth={2} />
            <ReferenceDot yAxisId="roe" x={car} y={roe} r={5} fill="var(--color-info)" stroke="var(--color-card)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[10px]">
        <div className="bg-warning/10 border border-warning/30 rounded p-1.5">
          <div className="font-semibold text-warning">VÙNG THIẾU VỐN</div>
          <div className="text-muted-foreground">Rủi ro cao – Hiệu quả thấp</div>
        </div>
        <div className="bg-success/10 border border-success/30 rounded p-1.5">
          <div className="font-semibold text-success">VÙNG TỐI ƯU</div>
          <div className="text-muted-foreground">Cân bằng giữa rủi ro và lợi nhuận</div>
        </div>
        <div className="bg-destructive/10 border border-destructive/30 rounded p-1.5">
          <div className="font-semibold text-destructive">VÙNG VỐN THỪA</div>
          <div className="text-muted-foreground">Hiệu quả giảm do chi phí vốn cao</div>
        </div>
      </div>
    </Card>
  );
}
