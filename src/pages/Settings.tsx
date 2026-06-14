import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLangStore } from "@/stores/lang-store";
import { useT } from "@/hooks/useTranslation";
import { Sun, Moon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const username = useAuthStore((s) => s.username);
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();

  return (
    <Card data-tour="settings-page" className="p-4">
      <h2 className="text-xl font-bold mb-3">{t("settings_title")}</h2>
      <Tabs defaultValue="app">
        <TabsList>
          <TabsTrigger value="account">{t("settings_tab_account")}</TabsTrigger>
          <TabsTrigger value="app">{t("settings_tab_app")}</TabsTrigger>
          <TabsTrigger value="data">{t("settings_tab_data")}</TabsTrigger>
          <TabsTrigger value="roles">{t("settings_tab_roles")}</TabsTrigger>
          <TabsTrigger value="system">{t("settings_tab_system")}</TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card data-tour="settings-appearance" className="p-4 space-y-4">
            <div className="font-semibold text-sm">{t("settings_appearance")}</div>
            <div className="space-y-2">
              <Label>{t("settings_theme_mode")}</Label>
              <div className="flex gap-2">
                <Button variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")} className="flex-1">
                  <Sun className="w-4 h-4 mr-2" /> {t("settings_theme_light")}
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")} className="flex-1">
                  <Moon className="w-4 h-4 mr-2" /> {t("settings_theme_dark")}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("settings_density")}</Label>
              <Select defaultValue="medium">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="loose">{t("settings_density_loose")}</SelectItem>
                  <SelectItem value="medium">{t("settings_density_med")}</SelectItem>
                  <SelectItem value="dense">{t("settings_density_dense")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings_language")}</Label>
              <Select value={lang} onValueChange={(v) => setLang(v as "vi" | "en")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast.success(t("settings_saved_toast"))}>{t("settings_save")}</Button>
          </Card>

          <Card data-tour="settings-account" className="p-4 space-y-3">
            <div className="font-semibold text-sm">{t("settings_account_info")}</div>
            <Info label={t("settings_username_lbl")} value={username ?? "Admin"} />
            <Info label={t("settings_email_lbl")} value="admin@bank.com" />
            <Info label={t("settings_role_lbl")} value={t("settings_role_val")} />
            <div className="font-semibold text-sm pt-3 border-t border-border">{t("settings_sys_info")}</div>
            <Info label={t("settings_version_lbl")} value="1.0.0" />
            <Info label={t("settings_last_update")} value="20/05/2026 09:30" />
            <Info label={t("settings_status_lbl")} value={t("settings_status_val")} valueClass="text-success" />
          </Card>
        </TabsContent>

        {(["account", "data", "roles", "system"] as const).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <Card className="p-8 text-center text-sm text-muted-foreground">
              {t("common_under_dev")}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

function Info({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
