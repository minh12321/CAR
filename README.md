# CAR Optimization Engine — React SPA

Frontend thuần React (Vite + React 19 + React Router + Tailwind v4 + shadcn/ui + Zustand + Recharts).

## Chạy dự án

```bash
npm install        # hoặc: bun install / pnpm install
npm run dev        # mở http://localhost:5173
npm run build
npm run preview
```

## Đăng nhập demo

- User: `DHTL2026`
- Pass: `thanhcong@2026`

## Cấu trúc thư mục

```
src/
  pages/              # Login, Dashboard, Settings
  components/
    layout/AppShell.tsx
    dashboard/        # CAR slider, KPI, biểu đồ, AI insight, bảng, dự báo
    ui/               # shadcn/ui
  stores/             # zustand: auth, theme, car
  data/               # mock-banks, mock-car-model, mock-forecast
  services/car-service.ts   # facade — thay bằng API thật ở đây
  styles.css          # Tailwind v4 + design tokens (light/dark)
```

## Thay mock data bằng API

Tất cả component đọc dữ liệu qua `src/services/car-service.ts`. Đổi từng
hàm trong file này từ "đọc mock" sang `fetch(...)` là đủ — UI không cần
sửa.

## Tính năng

- Slider CAR ở Phân vùng 1 cập nhật reactive: Trạng thái hiện tại, biểu
  đồ phi tuyến ROA/ROE, AI Insight, bảng so sánh, thẻ khuyến nghị.
- Login giả lập (`DHTL2026` / `thanhcong@2026`) → điều hướng vào dashboard.
- Dark/Light mode: nút mặt trời/mặt trăng ở góc trên phải, hoặc trong
  Cài đặt → Ứng dụng → Giao diện.
