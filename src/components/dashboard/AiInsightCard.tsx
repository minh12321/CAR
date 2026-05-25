import { Card } from "@/components/ui/card";
import { Bot, CheckCircle2 } from "lucide-react";
import { useCarStore } from "@/stores/car-store";
import { carService } from "@/services/car-service";
import vi from "@/assets/vi.png";
import nh_congnghe from "@/assets/nh_congnghe.png";
import { useThemeStore } from "@/stores/theme-store";

export function AiInsightCard() {
  const car = useCarStore((s) => s.car);
  const th = carService.getThresholds();
  const status = carService.getStatus(car);
  const theme = useThemeStore((s) => s.theme);

  const headline =
    status === "optimal"
      ? `CAR hiện tại ${car.toFixed(2)}% đang nằm trong vùng tối ưu (${th.low}% – ${th.high}%). Ngân hàng đang đạt được sự cân bằng giữa an toàn vốn và hiệu quả sinh lời.`
      : status === "under"
        ? `CAR hiện tại ${car.toFixed(2)}% đang nằm dưới ngưỡng tối ưu (${th.low}%). Rủi ro thanh khoản/vốn đang ở mức cao, cần cân nhắc tăng CAR.`
        : `CAR hiện tại ${car.toFixed(2)}% đang vượt ngưỡng tối ưu (${th.high}%). Hiệu quả sinh lời có thể giảm do chi phí vốn cao.`;

  const tips =
    status === "optimal"
      ? [
          "Duy trì cân bằng rủi ro – lợi nhuận trong vùng tối ưu",
          "Duy trì tăng cường quản trị rủi ro thanh khoản và rủi ro tín dụng",
        ]
      : status === "under"
        ? [
            "Tăng vốn cấp 1 thông qua phát hành cổ phiếu hoặc giữ lại lợi nhuận",
            "Giảm tài sản rủi ro hoặc cơ cấu lại danh mục tín dụng, xử lý mạnh nợ xấu",
            "Tái cấu trúc bảng cân đối, thoái vốn đầu tư không hiệu quả",
            "Tăng cường quản trị rủi ro thanh khoản và rủi ro tín dụng",
          ]
        : [
            "Cân nhắc tái phân bổ vốn và/hoặc mở rộng tín dụng chất lượng",
            "Duy trì quản trị rủi ro thanh khoản và rủi ro tín dụng",
          ];

  return (
    <Card className="p-3">
      <div className="flex  gap-2 mb-2">
        <div className="t-30 w-15 h-15 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
          <Bot className="w-25 h-25 text-primary" />
        </div>
        <div className="text-[12px] font-semibold">3. AI INSIGHT
        <div className="flex">
          <div className="mt-3 t-30 w-full h-25 rounded-md bg-secondary/15 border border-primary/30 flex items-center justify-center">
              <p className="text-xs text-foreground/90 leading-relaxed mb-3 mt-3 m-3">
                {highlightCar(headline, car)}
                
              </p></div>
              <img src={theme === "dark" ? vi : nh_congnghe} alt="Vietnamese" className="w-35 rounded-md mb-3" />
              </div>

        </div>
      </div >
      
      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Gợi ý từ AI</div>
      <ul className="space-y-1.5">
        {tips.map((t) => (
          <li key={t} className="flex items-start gap-2 text-[12px] text-foreground/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
            <span>{t}</span>
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
