# CAR Optimization Engine — React SPA

Frontend thuần React (Vite + React 19 + React Router + Tailwind v4 + shadcn/ui + Zustand + Recharts).

## Chạy dự án

```bash
npm install 
npm run dev       
npm run build
npm run preview
```

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

