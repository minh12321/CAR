import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, Send, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useT } from "@/hooks/useTranslation";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export function Placeholder({ title }: { title: string }) {
  const t = useT();
  const username = useAuthStore((s) => s.username);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleRequest = () => {
    if (status === "sending" || status === "sent") return;
    setStatus("sending");

    // Giả lập gửi request (0.8s)
    setTimeout(() => {
      setStatus("sent");
      toast.success(t("access_sent_title"), {
        description: t("access_sent_desc"),
      });
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-5 border-destructive/20 bg-destructive/5">

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/25 flex items-center justify-center">
          {status === "sent"
            ? <CheckCircle2 className="w-8 h-8 text-success" />
            : <ShieldX className="w-8 h-8 text-destructive" />
          }
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <div className="flex items-center justify-center gap-1.5 text-sm text-destructive font-medium">
            <Lock className="w-3.5 h-3.5" />
            {t("access_title")}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {status === "sent" ? t("access_sent_desc") : t("access_desc")}
        </p>

        {/* Request info khi đã gửi */}
        {status === "sent" && (
          <div className="rounded-lg bg-success/10 border border-success/25 px-4 py-3 text-sm space-y-1">
            <div className="flex items-center justify-center gap-2 text-success font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {t("access_sent_title")}
            </div>
            <p className="text-muted-foreground text-xs">
              {username && (
                <span className="font-medium text-foreground">{username}</span>
              )}{" "}
              → Admin
            </p>
          </div>
        )}

        {/* Button */}
        <div className="flex flex-col gap-2">
          {status !== "sent" ? (
            <Button
              onClick={handleRequest}
              disabled={status === "sending"}
              className="w-full gap-2"
              variant={status === "sending" ? "outline" : "default"}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("access_sending")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("access_btn")}
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full gap-2 text-muted-foreground"
              onClick={() => setStatus("idle")}
            >
              <Send className="w-4 h-4" />
              {t("access_sent_again")}
            </Button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground">
          © 2026 CAR Optimization Engine — Student Research Team
        </p>
      </Card>
    </div>
  );
}
