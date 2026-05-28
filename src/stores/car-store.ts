import { create } from "zustand";
import { BANKS_BY_GROUP } from "@/data/mock-banks";

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
  metric: "All",
  setCar: (car) =>
    set({
      car: Math.round(car * 100) / 100,
    }),
  setBankGroup: (bankGroup) => set({
    bankGroup,
    bank: BANKS_BY_GROUP[bankGroup]?.[0] || ""
  }),
  setBank: (bank) => set({ bank }),
  setPeriod: (period) => set({ period }),
  setMetric: (metric) => set({ metric }),
}));
