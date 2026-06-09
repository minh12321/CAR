import { Card } from "@/components/ui/card";
import { Bot, CheckCircle2 } from "lucide-react";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";
import { useThemeStore } from "@/stores/theme-store";
import { useT } from "@/hooks/useTranslation";
import vi from "@/assets/vi.png";
import nh_congnghe from "@/assets/nh_congnghe.png";

export function AiInsightCard() {
  const car = useCarStore((s) => s.car);
  const th = carService.getThresholds();
  const status = carService.getStatus(car);
  const theme = useThemeStore((s) => s.theme);
  const t = useT();

  const headline =
    status === "optimal"
      ? `CAR ${car.toFixed(2)}% ${t("ai_optimal_headline")} (${th.low}% – ${th.high}%). ${t("ai_optimal_suffix")}`
      : status === "under"
        ? `CAR ${car.toFixed(2)}% ${t("ai_under_headline")} (${th.low}%). ${t("ai_under_suffix")}`
        : `CAR ${car.toFixed(2)}% ${t("ai_over_headline")} (${th.high}%). ${t("ai_over_suffix")}`;

  const tips =
    status === "optimal"
      ? [t("ai_tip_opt_1"), t("ai_tip_opt_2")]
      : status === "under"
        ? [t("ai_tip_und_1"), t("ai_tip_und_2"), t("ai_tip_und_3"), t("ai_tip_und_4")]
        : [t("ai_tip_ovr_1"), t("ai_tip_ovr_2")];

  return (
    <Card className="p-3">
      <div className="flex  gap-2 mb-2">
        <div className="t-30 w-15 h-15 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Bot className="w-25 h-25 text-primary" />
        </div>
        <div className="text-[12px] font-semibold">{t("ai_title")}
        <div className="flex">
          <div className="mt-3 t-30 w-full h-25 rounded-md bg-secondary/15 border border-primary/30 flex items-center justify-center">
              <p className="text-xs text-foreground/90 leading-relaxed mb-3 mt-3 m-3">
                {highlightCar(headline, car)}
              </p></div>
              <img src={theme === "dark" ? vi : nh_congnghe} alt="Vietnamese" className="w-35 rounded-md mb-3" />
              </div>

        </div>
      </div >
      
      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">{t("ai_tips_label")}</div>
      <ul className="space-y-1.5">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-[12px] text-foreground/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function highlightCar(text: string, car: number) {
  const token = `${car.toFixed(2)}%`;
  const parts = text.split(token);
  return parts.flatMap((p, i) =>
    i < parts.length - 1
      ? [p, <span key={i} className="text-primary font-semibold">{token}</span>]
      : [p],
  );
}
