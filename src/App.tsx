import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { AppShell } from "@/components/layout/AppShell";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import SettingsPage from "@/pages/Settings";
import { Placeholder } from "@/components/layout/Placeholder";

function ProtectedLayout() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  if (!isAuth) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulation" element={<Placeholder title="Mô phỏng CAR" />} />
          <Route path="/performance" element={<Placeholder title="Hiệu quả hoạt động" />} />
          <Route path="/risk" element={<Placeholder title="Rủi ro & An toàn" />} />
          <Route path="/forecast" element={<Placeholder title="Dự báo 2026" />} />
          <Route path="/compare" element={<Placeholder title="So sánh ngân hàng" />} />
          <Route path="/reports" element={<Placeholder title="Báo cáo" />} />
          <Route path="/data" element={<Placeholder title="Dữ liệu" />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
