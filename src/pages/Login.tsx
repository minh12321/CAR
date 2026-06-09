import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, Eye, EyeOff, KeyRound, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useThemeStore } from "@/stores/theme-store";
import { useT } from "@/hooks/useTranslation";
import tlu from "@/assets/tlu.png";
import lo1 from "@/assets/lo1.jpg";
import lo2 from "@/assets/lo2.jpg";
import lo3 from "@/assets/lo3.jpg";
import lo4 from "@/assets/lo4.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const t = useT();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(user.trim(), pass)) {
      toast.success(t("login_success"));
      navigate("/dashboard");
    } else {
      setError(t("login_error"));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2  ">
      
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary/15 via-background to-info/10 p-12">
        
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Landmark className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">CAR OPTIMIZATION ENGINE</h1>
            <p className="mt-2 text-sm text-muted-foreground">Banking Decision & Performance Simulator</p>
          </div>
          <p className="text-sm text-muted-foreground">{t("login_tagline")}</p>
        </div>
        <img src={tlu} alt="TLU" className="w-15 mt-10 opacity-80" />
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={toggle} aria-label="Đổi giao diện" className="rounded-full">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <div className="lg:hidden text-center mb-4">
            <Landmark className="w-10 h-10 text-primary mx-auto" />
            <h1 className="mt-2 text-xl font-bold">CAR OPTIMIZATION ENGINE</h1>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{t("login_title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("login_subtitle")}</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="user">{t("login_username")}</Label>
              <Input id="user" value={user} onChange={(e) => setUser(e.target.value)}
                placeholder={t("login_username")} autoComplete="username" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pass">{t("login_password")}</Label>
              <div className="relative">
                <Input id="pass" type={showPass ? "text" : "password"} value={pass}
                  onChange={(e) => setPass(e.target.value)} placeholder={t("login_password")}
                  autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={t("login_show_pass")}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                {t("login_remember")}
              </label>
              <button type="button" className="text-primary hover:underline"
                onClick={() => toast.info(t("login_forgot_toast"))}>
                {t("login_forgot")}
              </button>
            </div>

            {error && (
              <p className="text-sm text-destructive border border-destructive/30 bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">{t("login_btn")}</Button>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="bg-background px-2 relative z-10">{t("login_or")}</span>
            <div className="absolute inset-0 top-1/2 border-t border-border" />
          </div>

          <Button type="button" variant="outline" className="w-full"
            onClick={() => toast.info(t("login_sso_toast"))}>
            <KeyRound className="w-4 h-4 mr-2" /> {t("login_sso")}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            © 2026 Student Research Team. All rights reserved.
          </p>
        </form>
      </div>
      <>
        {/* Mobile */}
        <img
          src={theme === "dark" ? lo1 : lo2}
          className="block md:hidden absolute inset-0 w-full h-full object-cover  -z-10"
        />
        {/* Desktop */}
        <img
          src={theme === "dark" ? lo4 : lo3}
          className="hidden md:block absolute inset-0 w-full h-full object-cover  -z-10"
        />
      </>
    </div>
  );
}
