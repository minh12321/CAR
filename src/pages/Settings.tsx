import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useThemeStore } from "@/stores/theme-store";
import { useAuthStore } from "@/stores/auth-store";
import { Sun, Moon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const username = useAuthStore((s) => s.username);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-3">Cài đặt</h2>
      <Tabs defaultValue="app">
        <TabsList>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="app">Ứng dụng</TabsTrigger>
          <TabsTrigger value="data">Dữ liệu</TabsTrigger>
          <TabsTrigger value="roles">Phân quyền</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card className="p-4 space-y-4">
            <div className="font-semibold text-sm">Giao diện</div>
            <div className="space-y-2">
              <Label>Chế độ giao diện</Label>
              <div className="flex gap-2">
                <Button variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")} className="flex-1">
                  <Sun className="w-4 h-4 mr-2" /> Sáng
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")} className="flex-1">
                  <Moon className="w-4 h-4 mr-2" /> Tối
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mật độ hiển thị</Label>
              <Select defaultValue="medium">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="loose">Thoáng</SelectItem>
                  <SelectItem value="medium">Vừa</SelectItem>
                  <SelectItem value="dense">Chật</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngôn ngữ</Label>
              <Select defaultValue="vi">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast.success("Đã lưu thay đổi")}>Lưu thay đổi</Button>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="font-semibold text-sm">Thông tin tài khoản</div>
            <Info label="Tên người dùng" value={username ?? "Admin"} />
            <Info label="Email" value="admin@bank.com" />
            <Info label="Vai trò" value="Quản trị viên" />
            <div className="font-semibold text-sm pt-3 border-t border-border">Thông tin hệ thống</div>
            <Info label="Phiên bản" value="1.0.0" />
            <Info label="Cập nhật lần cuối" value="20/05/2026 09:30" />
            <Info label="Trạng thái" value="Hoạt động" valueClass="text-success" />
          </Card>
        </TabsContent>

        {(["account", "data", "roles", "system"] as const).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <Card className="p-8 text-center text-sm text-muted-foreground">
              Phần này đang được phát triển.
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
