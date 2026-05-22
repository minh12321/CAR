import { CarSliderCard } from "@/components/dashboard/CarSliderCard";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { NonlinearChart } from "@/components/dashboard/NonlinearChart";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { CurrentVsOptimalTable } from "@/components/dashboard/CurrentVsOptimalTable";
import { RecommendationCards } from "@/components/dashboard/RecommendationCards";
import { ForecastChart } from "@/components/dashboard/ForecastChart";
import { ForecastByGroupTable } from "@/components/dashboard/ForecastByGroupTable";

export default function DashboardPage() {
  return (
    <div className="space-y-3">
      <CarSliderCard />
      <KpiCards />
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3">
        <div className="space-y-3">
          <NonlinearChart />
          <CurrentVsOptimalTable />
        </div>
        <div className="space-y-3">
          <AiInsightCard />
          <ForecastChart />
        </div>
      </div>
      <RecommendationCards />
      <ForecastByGroupTable />
      <div className="flex flex-wrap justify-between gap-2 text-[10px] text-muted-foreground pt-2 border-t border-border">
        <div className="flex gap-4">
          <span>Nguồn: Báo cáo tài chính các NHTM niêm yết giai đoạn 2014 – 2025</span>
          <span>Phương pháp: FGLS & ARIMA</span>
          <span>Mô hình: CAR, CAR² và các biến kiểm soát</span>
        </div>
        <div>Developed by Student Research Team | 05/2026</div>
      </div>
    </div>
  );
}
