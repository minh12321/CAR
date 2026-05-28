// Single facade for all dashboard data.
// Today: returns mock data. Tomorrow: swap each function to fetch from API.

import {
  calcRoa,
  calcRoe,
  getStatus,
  ROA_AVG,
  ROE_AVG,
  CAR_OPTIMAL_LOW,
  CAR_OPTIMAL_HIGH,
  CAR_OPTIMAL_ROA,
  CAR_OPTIMAL_ROE,
  ROA_MAX,
  ROE_MAX,
  type ZoneStatus,
} from "@/data/mock-car-model";
import { FULL_FORECAST_DATA } from "@/data/mock-forecast";
import { BANKS, BANKS_BY_GROUP, BANK_GROUPS, PERIODS, METRICS } from "@/data/mock-banks";

export const carService = {
  getRoa: (car: number) => calcRoa(car),
  getRoe: (car: number) => calcRoe(car),
  getStatus: (car: number): ZoneStatus => getStatus(car),
  getAverages: () => ({ roa: ROA_AVG, roe: ROE_AVG }),
  getThresholds: () => ({
    low: CAR_OPTIMAL_LOW,
    high: CAR_OPTIMAL_HIGH,
    roaOptimalCar: CAR_OPTIMAL_ROA,
    roeOptimalCar: CAR_OPTIMAL_ROE,
    roaMax: ROA_MAX,
    roeMax: ROE_MAX,
  }),
  getCurveData: () => {
    const points: { car: number; roa: number; roe: number }[] = [];
    for (let c = 5; c <= 20.05; c += 0.1) {
      points.push({ car: +c.toFixed(1), roa: calcRoa(c), roe: calcRoe(c) });
    }
    return points;
  },
  getForecastIndustry: (period: string) => {
    const match = period.match(/\d{4}/g);
    const start = match ? +match[0] : 2014;
    const end = match ? +match[1] : 2026;
    const maxEnd = Math.min(2026, end + 1);

    const filtered = FULL_FORECAST_DATA.filter(d => +d.year >= start && +d.year <= maxEnd);
    return filtered.map((d, i) => ({
      year: i === filtered.length - 1 ? `${d.year}F` : d.year,
      car: d["Toàn ngành"]
    }));
  },
  getForecastByGroup: (period: string) => {
    const match = period.match(/\d{4}/g);
    const start = match ? +match[0] : 2014;
    const end = match ? +match[1] : 2026;
    const maxEnd = Math.min(2026, end + 1);

    const filtered = FULL_FORECAST_DATA.filter(d => +d.year >= start && +d.year <= maxEnd);
    const years = filtered.map((d, i) => i === filtered.length - 1 ? `${d.year}F` : d.year);

    const groups = ["NHTM Nhà nước", "NHTMCP lớn", "NHTMCP vừa", "NHTMCP nhỏ"];
    const rows = groups.map(g => {
      const values: Record<string, number> = {};
      filtered.forEach((d, i) => {
        const yearKey = i === filtered.length - 1 ? `${d.year}F` : d.year;
        values[yearKey] = d[g as keyof typeof d] as number;
      });
      const firstVal = values[years[0]];
      const lastVal = values[years[years.length - 1]];
      const trend = lastVal >= firstVal ? "up" : "down";
      return { group: g, values, trend };
    });

    return { years, rows };
  },
  getBanks: (group?: string) => group ? BANKS_BY_GROUP[group] || [] : BANKS,
  getBankGroups: () => BANK_GROUPS,
  getPeriods: () => PERIODS,
  getMetrics: () => METRICS,
};
