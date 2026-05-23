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
import { useMemo } from "react";

export function NonlinearChart() {
  const car = useCarStore((s) => s.car);
  const metric = useCarStore((s) => s.metric);
  const th = useMemo(() => carService.getThresholds(), []);
  const data = useMemo(() => carService.getCurveData(), []);
  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);

  const showRoa = metric === "All" || metric === "ROA";
  const showRoe = metric === "All" || metric === "ROE";
  const refAxis = showRoa ? "roa" : "roe";

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] font-semibold">
          2. QUAN HỆ PHI TUYẾN GIỮA CAR VÀ HIỆU QUẢ KINH DOANH
        </div>
      </div>

      <div className="h-[260px] relative">
        <div className="absolute left-[61px] right-[85px] top-[20px] bottom-[56px] flex pointer-events-none overflow-hidden rounded">
          {/* Thiếu vốn */}
          <div className="w-[155px] bg-yellow-400/10 border-r border-yellow-400/20" />

          {/* Tối ưu */}
          <div className="w-[180px] bg-green-500/10 border-r border-green-500/20" />

          {/* Vốn thừa */}
          <div className="flex-1 bg-red-500/10" />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 25, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis
              dataKey="car"
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              label={{ value: "CAR", position: "insideBottom", offset: -5, fontSize: 10, fill: "var(--color-muted-foreground)" }}
            />
            {showRoa && (
              <YAxis
                yAxisId="roa"
                tick={{ fontSize: 10, fill: "#2563eb" }}
                label={{ value: "Dự báo ROA", angle: -90, position: "insideLeft", fontSize: 10, fill: "#2563eb" }}
                domain={['dataMin - 0.05', 'dataMax + 0.05']}
              />
            )}
            {showRoe && (
              <YAxis
                yAxisId="roe"
                orientation="right"
                tick={{ fontSize: 10, fill: "#16a34a" }}
                label={{ value: "Dự báo ROE", angle: 90, position: "insideRight", fontSize: 10, fill: "#16a34a" }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
            )}
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
            {/* 3 vùng nền: Thiếu vốn | Tối ưu | Thừa vốn */}
            {/* <ReferenceArea yAxisId={refAxis} x1={5} x2={th.roeOptimalCar} fill="#fbbf24" fillOpacity={0.18} />
            <ReferenceArea yAxisId={refAxis} x1={th.roeOptimalCar} x2={th.roaOptimalCar} fill="#22c55e" fillOpacity={0.18} />
            <ReferenceArea yAxisId={refAxis} x1={th.roaOptimalCar} x2={20} fill="#ef4444" fillOpacity={0.18} /> */}
            <ReferenceDot
              yAxisId="roa"
              x={th.roaOptimalCar}
              y={th.roaMax}
              r={6}
              fill="#2563eb"
              stroke="white"
              strokeWidth={2}
            />

            <ReferenceDot
              yAxisId="roe"
              x={th.roeOptimalCar}
              y={th.roeMax}
              r={6}
              fill="#16a34a"
              stroke="white"
              strokeWidth={2}
            />
            {/* Đường ROA = xanh dương, ROE = xanh lá */}
            {showRoa && <Line yAxisId="roa" type="monotone" dataKey="roa" name="ROA" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive={false} />}
            {showRoe && <Line yAxisId="roe" type="monotone" dataKey="roe" name="ROE" stroke="#16a34a" strokeWidth={2.5} dot={false} isAnimationActive={false} />}
            {/* Đường gạch đứt tại đỉnh ROE (xanh lá) — render SAU Line để nằm trên cùng */}
            <ReferenceLine yAxisId={refAxis} x={th.roeOptimalCar} stroke="#16a34a" strokeDasharray="8 5" strokeWidth={4} label={{ value: `(${(th.roeOptimalCar / 100).toFixed(4)}; ${(th.roeMax / 100).toFixed(4)})`, position: "top", fontSize: 9, fill: "#16a34a", fontWeight: 600 }} />
            {/* Đường gạch đứt tại đỉnh ROA (xanh dương) */}
            <ReferenceLine yAxisId={refAxis} x={th.roaOptimalCar} stroke="#2563eb" strokeDasharray="8 5" strokeWidth={4} label={{ value: `(${(th.roaOptimalCar / 100).toFixed(4)}; ${(th.roaMax / 100).toFixed(4)})`, position: "top", fontSize: 9, fill: "#2563eb", fontWeight: 600 }} />
            {/* Đường di chuyển CAR hiện tại */}
            <ReferenceLine yAxisId={refAxis} x={car} stroke="var(--color-primary)" strokeWidth={2} label={{ value: `CAR ${car.toFixed(2)}%`, position: "top", fontSize: 10, fill: "var(--color-primary)" }} />
            {showRoa && <ReferenceDot yAxisId="roa" x={car} y={roa} r={5} fill="#2563eb" stroke="var(--color-card)" strokeWidth={2} />}
            {showRoe && <ReferenceDot yAxisId="roe" x={car} y={roe} r={5} fill="#16a34a" stroke="var(--color-card)" strokeWidth={2} />}
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
