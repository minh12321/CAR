import { CarSliderCard } from "@/components/dashboard/CarSliderCard";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { NonlinearChart } from "@/components/dashboard/NonlinearChart";
import { AiInsightCard } from "@/components/dashboard/AiInsightCard";
import { CurrentVsOptimalTable } from "@/components/dashboard/CurrentVsOptimalTable";
import { RecommendationCards } from "@/components/dashboard/RecommendationCards";
import { ForecastChart } from "@/components/dashboard/ForecastChart";
import { ForecastByGroupTable } from "@/components/dashboard/ForecastByGroupTable";
import { useT } from "@/hooks/useTranslation";

export default function DashboardPage() {
  const t = useT();
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
      <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-border">
        <div className="flex gap-4">
          <span>{t("dashboard_source")}</span>
          <span>{t("dashboard_method")}</span>
          <span>{t("dashboard_model")}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Developed by Research Team of Thuyloi University in 2026 || Version: Car Optimization Engine 2026.1.1</span>
        </div>
      </div>
    </div>
  );
}
