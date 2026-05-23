import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Activity, BarChart3, ShieldCheck, LineChart, Users, FileText,
  Database, Settings, Sun, Moon, Bell, CalendarDays, Landmark, LogOut, ChevronDown,
} from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const NAV = [
  { to: "/dashboard", label: "Tổng quan", icon: Home },
  { to: "/simulation", label: "Mô phỏng CAR", icon: Activity },
  { to: "/performance", label: "Hiệu quả hoạt động", icon: BarChart3 },
  { to: "/risk", label: "Rủi ro & An toàn", icon: ShieldCheck },
  { to: "/forecast", label: "Dự báo 2026", icon: LineChart },
  { to: "/compare", label: "So sánh ngân hàng", icon: Users },
  { to: "/reports", label: "Báo cáo", icon: FileText },
  { to: "/data", label: "Dữ liệu", icon: Database },
  { to: "/settings", label: "Cài đặt", icon: Settings },
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
  const [lang, setLang] = useState("vi");

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
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
          {NAV.map((item) => {
            const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/40"
                  }`}>
                <Icon className="w-4 h-4" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-center">
            <ShieldCheck className="w-7 h-7 text-primary mx-auto mb-1" />
            <div className="text-[11px] font-semibold text-sidebar-foreground">An toàn hệ thống</div>
            <div className="text-[10px] text-muted-foreground">Hiệu quả bền vững</div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-5">
          <div>
            <h1 className="text-base font-bold tracking-tight">CAR OPTIMIZATION ENGINE</h1>
            <p className="text-[11px] text-muted-foreground">Banking Decision & Performance Simulator</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* Button */}
              <button
                className="
                flex items-center gap-2
                h-9 px-3
                rounded-xl
                border border-white/10
                bg-white/5
                hover:bg-white/10
                text-white
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
                    onClick={() => setLang(item.code)}
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
              <CalendarDays className="w-3.5 h-3.5" /><span>Cập nhật: 20/05/2026</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Đổi giao diện" className="rounded-full">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                    {(username ?? "A").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-medium">{username ?? "Admin"}</div>
                    <div className="text-[10px] text-muted-foreground">Quản trị viên</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" /> Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
