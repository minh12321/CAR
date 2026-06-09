import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useT } from "@/hooks/useTranslation";

export function Placeholder({ title }: { title: string }) {
  const t = useT();
  return (
    <Card className="p-12 text-center">
      <Construction className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{t("common_under_dev")}</p>
    </Card>
  );
}
