import { Card } from "@/components/ui/card";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";

export function CurrentVsOptimalTable() {
  const car = useCarStore((s) => s.car);
  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);
  const avg = carService.getAverages();
  const th = carService.getThresholds();

  const roaDiff = +(roa - avg.roa).toFixed(2);
  const roeDiff = +(roe - avg.roe).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card className="p-3">
        <div className="text-[11px] font-semibold mb-2">
          TẠI MỨC CAR HIỆN TẠI ({car.toFixed(2)}%)
        </div>
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left py-1.5 font-medium">Chỉ tiêu</th>
              <th className="text-right py-1.5 font-medium">Giá trị hiện tại</th>
              <th className="text-right py-1.5 font-medium">Trung bình 2014–2025</th>
              <th className="text-right py-1.5 font-medium">Chênh lệch</th>
            </tr>
          </thead>
          <tbody>
            <Row label="ROA (%)" current={roa} avg={avg.roa} diff={roaDiff} />
            <Row label="ROE (%)" current={roe} avg={avg.roe} diff={roeDiff} />
          </tbody>
        </table>
      </Card>

      <Card className="p-3">
        <div className="text-[11px] font-semibold mb-2">NGƯỠNG TỐI ƯU (THEO MÔ HÌNH)</div>
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="text-left py-1.5 font-medium">Chỉ tiêu</th>
              <th className="text-right py-1.5 font-medium">CAR tối ưu</th>
              <th className="text-right py-1.5 font-medium">Hiệu quả tối đa</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-1.5">ROA (%)</td>
              <td className="text-right tabular-nums">{th.roaOptimalCar.toFixed(2)}%</td>
              <td className="text-right tabular-nums">{th.roaMax.toFixed(2)}%</td>
            </tr>
            <tr>
              <td className="py-1.5">ROE (%)</td>
              <td className="text-right tabular-nums">{th.roeOptimalCar.toFixed(2)}%</td>
              <td className="text-right tabular-nums">{th.roeMax.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Row({ label, current, avg, diff }: { label: string; current: number; avg: number; diff: number }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-1.5">{label}</td>
      <td className="text-right tabular-nums font-semibold">{current.toFixed(2)}%</td>
      <td className="text-right tabular-nums text-muted-foreground">{avg.toFixed(2)}%</td>
      <td className={`text-right tabular-nums font-medium ${diff >= 0 ? "text-success" : "text-destructive"}`}>
        {diff >= 0 ? "+" : ""}
        {diff.toFixed(2)} điểm %
      </td>
    </tr>
  );
}
