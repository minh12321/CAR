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
import { useT } from "@/hooks/useTranslation";

export function NonlinearChart() {
  const car = useCarStore((s) => s.car);
  const metric = useCarStore((s) => s.metric);
  const t = useT();

  const th = useMemo(() => carService.getThresholds(), []);
  const data = useMemo(() => carService.getCurveData(), []);

  const roa = carService.getRoa(car);
  const roe = carService.getRoe(car);

  const showRoa = metric === "All" || metric === "ROA";
  const showRoe = metric === "All" || metric === "ROE";

  const refAxis = showRoa ? "roa" : "roe";

  return (
    <Card className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[12px] font-semibold">
          {t("chart_title")}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 25,
              bottom: 10,
              left: 10,
            }}
          >
            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.4}
            />

            {/* Thiếu vốn */}
            <ReferenceArea
              x1={5}
              x2={th.roeOptimalCar}
              yAxisId={refAxis}
              fill="#facc15"
              fillOpacity={0.12}
              ifOverflow="extendDomain"
            />

            {/* Tối ưu */}
            <ReferenceArea
              x1={th.roeOptimalCar}
              x2={th.roaOptimalCar}
              yAxisId={refAxis}
              fill="#22c55e"
              fillOpacity={0.12}
              ifOverflow="extendDomain"
            />

            {/* Vốn thừa */}
            <ReferenceArea
              x1={th.roaOptimalCar}
              x2={20}
              yAxisId={refAxis}
              fill="#ef4444"
              fillOpacity={0.12}
              ifOverflow="extendDomain"
            />

            {/* X AXIS */}
            <XAxis
              type="number"
              dataKey="car"
              domain={[5, 20]}
              tick={{
                fontSize: 10,
                fill: "var(--color-muted-foreground)",
              }}
              label={{
                value: "CAR (%)",
                position: "insideBottom",
                offset: -5,
                fontSize: 10,
                fill: "var(--color-muted-foreground)",
              }}
            />

            {/* Y AXIS ROA */}
            {showRoa && (
              <YAxis
                yAxisId="roa"
                tick={{
                  fontSize: 10,
                  fill: "#2563eb",
                }}
                label={{
                  value: t("chart_roa_label"),
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                  fill: "#2563eb",
                }}
                domain={["dataMin - 0.05", "dataMax + 0.05"]}
              />
            )}

            {/* Y AXIS ROE */}
            {showRoe && (
              <YAxis
                yAxisId="roe"
                orientation="right"
                tick={{
                  fontSize: 10,
                  fill: "#16a34a",
                }}
                label={{
                  value: t("chart_roe_label"),
                  angle: 90,
                  position: "insideRight",
                  fontSize: 10,
                  fill: "#16a34a",
                }}
                domain={["dataMin - 1", "dataMax + 1"]}
              />
            )}

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(v) => `CAR: ${v}%`}
            />

            {/* LEGEND */}
            <Legend wrapperStyle={{ fontSize: 11 }} />

            {/* ===== ĐỈNH ROA ===== */}
            {showRoa && (
              <>
                <ReferenceDot
                  yAxisId="roa"
                  x={th.roaOptimalCar}
                  y={th.roaMax}
                  r={6}
                  fill="#2563eb"
                  stroke="white"
                  strokeWidth={2}
                />

                <ReferenceLine
                  yAxisId="roa"
                  x={th.roaOptimalCar}
                  stroke="#2563eb"
                  strokeDasharray="8 5"
                  strokeWidth={3}
                  label={{
                    value: `(${(
                      th.roaOptimalCar / 100
                    ).toFixed(4)}; ${(th.roaMax / 100).toFixed(4)})`,
                    position: "top",
                    fontSize: 9,
                    fill: "#2563eb",
                    fontWeight: 600,
                  }}
                />
              </>
            )}

            {/* ===== ĐỈNH ROE ===== */}
            {showRoe && (
              <>
                <ReferenceDot
                  yAxisId="roe"
                  x={th.roeOptimalCar}
                  y={th.roeMax}
                  r={6}
                  fill="#16a34a"
                  stroke="white"
                  strokeWidth={2}
                />

                <ReferenceLine
                  yAxisId="roe"
                  x={th.roeOptimalCar}
                  stroke="#16a34a"
                  strokeDasharray="8 5"
                  strokeWidth={3}
                  label={{
                    value: `(${(
                      th.roeOptimalCar / 100
                    ).toFixed(4)}; ${(th.roeMax / 100).toFixed(4)})`,
                    position: "top",
                    fontSize: 9,
                    fill: "#16a34a",
                    fontWeight: 600,
                  }}
                />
              </>
            )}

            {/* ===== CAR HIỆN TẠI ===== */}
            <ReferenceLine
              yAxisId={refAxis}
              x={car}
              stroke="var(--color-primary)"
              strokeWidth={2}
              label={{
                value: `CAR ${car.toFixed(2)}%`,
                position: "top",
                fontSize: 10,
                fill: "var(--color-primary)",
              }}
            />

            {/* DOT ROA */}
            {showRoa && (
              <ReferenceDot
                yAxisId="roa"
                x={car}
                y={roa}
                r={5}
                fill="#2563eb"
                stroke="var(--color-card)"
                strokeWidth={2}
              />
            )}

            {/* DOT ROE */}
            {showRoe && (
              <ReferenceDot
                yAxisId="roe"
                x={car}
                y={roe}
                r={5}
                fill="#16a34a"
                stroke="var(--color-card)"
                strokeWidth={2}
              />
            )}

            {/* ===== LINE ROA ===== */}
            {showRoa && (
              <Line
                yAxisId="roa"
                type="monotone"
                dataKey="roa"
                name="ROA"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* ===== LINE ROE ===== */}
            {showRoe && (
              <Line
                yAxisId="roe"
                type="monotone"
                dataKey="roe"
                name="ROE"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Zone legend */}
      <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[10px]">
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded p-1.5">
          <div className="font-semibold text-yellow-500">
            {t("chart_zone_under")}
          </div>
          <div className="text-muted-foreground">
            {t("chart_zone_under_sub")}
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded p-1.5">
          <div className="font-semibold text-green-600">
            {t("chart_zone_optimal")}
          </div>
          <div className="text-muted-foreground">
            {t("chart_zone_opt_sub")}
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded p-1.5">
          <div className="font-semibold text-red-500">
            {t("chart_zone_over")}
          </div>
          <div className="text-muted-foreground">
            {t("chart_zone_over_sub")}
          </div>
        </div>
      </div>
    </Card>
  );
}
