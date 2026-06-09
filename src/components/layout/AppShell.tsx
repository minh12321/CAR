import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Activity, BarChart3, ShieldCheck, LineChart, Users, FileText,
  Database, Settings, Sun, Moon, Bell, CalendarDays, Landmark, LogOut, ChevronDown, Menu
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import nh_den from "@/assets/nh_den.png";
import nh_trang from "@/assets/nh_trang.png";
import { useLangStore } from "@/stores/lang-store";
import { useT } from "@/hooks/useTranslation";

const NAV_ROUTES = [
  { to: "/dashboard",   labelKey: "nav_dashboard",   icon: Home },
  { to: "/simulation",  labelKey: "nav_simulation",  icon: Activity },
  { to: "/performance", labelKey: "nav_performance", icon: BarChart3 },
  { to: "/risk",        labelKey: "nav_risk",        icon: ShieldCheck },
  { to: "/forecast",    labelKey: "nav_forecast",    icon: LineChart },
  { to: "/compare",     labelKey: "nav_compare",     icon: Users },
  { to: "/reports",     labelKey: "nav_reports",     icon: FileText },
  { to: "/data",        labelKey: "nav_data",        icon: Database },
  { to: "/settings",    labelKey: "nav_settings",    icon: Settings },
] as const;

const languages = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const t = useT();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-sidebar-foreground">CAR OPTIMIZATION</div>
            <div className="text-[10px] text-muted-foreground">Banking Simulator</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ROUTES.map((item) => {
          const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/40"
                }`}>
              <Icon className="w-4 h-4" /><span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
      <div>
        <img src={theme === "dark" ? nh_den : nh_trang} alt="Bank" className="w-full h-38 object-cover " />
      </div>
      <div className="p-4 ">
        <div className=" text-center">
          <div className="text-[20px] font-bold text-sidebar-foreground">{t("common_safe")}</div>
          <div className="text-[20px] font-bold text-sidebar-foreground">{t("common_efficient")}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex-col">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-3 md:px-5">
          <div className="flex items-center gap-2 md:gap-0">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r-sidebar-border">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-sm md:text-base font-bold tracking-tight">CAR OPTIMIZATION ENGINE</h1>
              <p className="text-[10px] md:text-[11px] text-muted-foreground hidden sm:block">Banking Decision & Performance Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <div className="relative group hidden sm:block">
              {/* Button */}
              <button
                className="
                flex items-center gap-2
                h-9 px-3
                rounded-xl
                border border-white/10
                bg-white/5
                hover:bg-white/10

                transition-all duration-200
                backdrop-blur-md
                shadow-sm
              "
              >
                <Globe size={16} className="opacity-80" />

                <span className="text-sm font-medium uppercase">
                  {lang}
                </span>
              </button>

              {/* Dropdown */}
              <div
                className="
                absolute right-0 mt-2
                w-28
                overflow-hidden
                rounded-xl
                border border-white/10
                bg-[#111827]/95
                backdrop-blur-xl
                shadow-2xl
                opacity-0 invisible
                translate-y-1
                transition-all duration-200
                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0
                z-50
              "
              >
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code as "vi" | "en")}
                    className={`
                    w-full px-4 py-2.5
                    text-left text-sm
                    transition-colors
                    hover:bg-white/10
                    ${lang === item.code
                        ? "text-primary font-semibold"
                        : "text-gray-200"
                      }
                  `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
              <CalendarDays className="w-3.5 h-3.5" /><span>{t("common_update")}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Đổi giao diện" className="rounded-full hidden sm:inline-flex">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-1 md:px-2 py-1 rounded-md hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                    {(username ?? "A").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-medium">{username ?? "Admin"}</div>
                    <div className="text-[10px] text-muted-foreground">{t("common_admin")}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" /> {t("common_settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
                  <LogOut className="w-4 h-4 mr-2" /> {t("common_logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-2 md:p-4">{children}</main>
      </div>
    </div>
  );
}
