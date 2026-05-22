import { create } from "zustand";

type CarState = {
  car: number;
  bankGroup: string;
  bank: string;
  period: string;
  metric: string;
  setCar: (v: number) => void;
  setBankGroup: (v: string) => void;
  setBank: (v: string) => void;
  setPeriod: (v: string) => void;
  setMetric: (v: string) => void;
};

export const useCarStore = create<CarState>((set) => ({
  car: 12,
  bankGroup: "NHTMCP lớn",
  bank: "ACB - Á Châu",
  period: "2014 - 2025",
  metric: "ROA & ROE",
  setCar: (car) => set({ car }),
  setBankGroup: (bankGroup) => set({ bankGroup }),
  setBank: (bank) => set({ bank }),
  setPeriod: (period) => set({ period }),
  setMetric: (metric) => set({ metric }),
}));
