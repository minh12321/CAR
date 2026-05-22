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
import { FORECAST_INDUSTRY, FORECAST_BY_GROUP } from "@/data/mock-forecast";
import { BANKS, BANK_GROUPS, PERIODS, METRICS } from "@/data/mock-banks";

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
    for (let c = 5; c <= 20; c += 0.5) {
      points.push({ car: +c.toFixed(1), roa: calcRoa(c), roe: calcRoe(c) });
    }
    return points;
  },
  getForecastIndustry: () => FORECAST_INDUSTRY,
  getForecastByGroup: () => FORECAST_BY_GROUP,
  getBanks: () => BANKS,
  getBankGroups: () => BANK_GROUPS,
  getPeriods: () => PERIODS,
  getMetrics: () => METRICS,
};
