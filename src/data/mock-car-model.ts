// Mock CAR -> ROA/ROE non-linear model.
// Replace with API later: see src/services/car-service.ts

export const CAR_OPTIMAL_LOW = 8.76;
export const CAR_OPTIMAL_HIGH = 13.11;
export const CAR_OPTIMAL_ROA = 13.11; // CAR mức cho ROA tối đa
export const CAR_OPTIMAL_ROE = 8.76; // CAR mức cho ROE tối đa
export const ROA_MAX = 1.24;
export const ROE_MAX = 14.60;

const CURVE_POINTS = [
  { car: 5.0, roa: 1.03, roe: 13.80 },
  { car: 5.5, roa: 1.06, roe: 13.95 },
  { car: 6.0, roa: 1.09, roe: 14.10 },
  { car: 6.5, roa: 1.11, roe: 14.25 },
  { car: 7.0, roa: 1.14, roe: 14.40 },
  { car: 7.5, roa: 1.16, roe: 14.50 },
  { car: 8.0, roa: 1.18, roe: 14.55 },
  { car: 8.5, roa: 1.19, roe: 14.59 },
  { car: 8.76, roa: 1.19, roe: 14.60 },
  { car: 9.0, roa: 1.20, roe: 14.59 },
  { car: 9.5, roa: 1.21, roe: 14.53 },
  { car: 10.0, roa: 1.22, roe: 14.45 },
  { car: 10.5, roa: 1.23, roe: 14.33 },
  { car: 11.0, roa: 1.23, roe: 14.20 },
  { car: 11.5, roa: 1.24, roe: 14.02 },
  { car: 12.0, roa: 1.24, roe: 13.80 },
  { car: 12.5, roa: 1.24, roe: 13.62 },
  { car: 13.0, roa: 1.24, roe: 13.45 },
  { car: 13.11, roa: 1.24, roe: 13.40 },
  { car: 13.5, roa: 1.24, roe: 13.20 },
  { car: 14.0, roa: 1.23, roe: 13.00 },
  { car: 14.5, roa: 1.23, roe: 12.75 },
  { car: 15.0, roa: 1.22, roe: 12.50 },
  { car: 16.0, roa: 1.20, roe: 11.90 },
  { car: 17.0, roa: 1.18, roe: 11.20 },
  { car: 18.0, roa: 1.15, roe: 10.50 },
  { car: 19.0, roa: 1.11, roe: 9.80 },
  { car: 20.0, roa: 1.07, roe: 9.10 },
];

function interpolate(car: number, key: "roa" | "roe"): number {
  if (car <= CURVE_POINTS[0].car) return CURVE_POINTS[0][key];
  if (car >= CURVE_POINTS[CURVE_POINTS.length - 1].car) return CURVE_POINTS[CURVE_POINTS.length - 1][key];

  for (let i = 0; i < CURVE_POINTS.length - 1; i++) {
    const p1 = CURVE_POINTS[i];
    const p2 = CURVE_POINTS[i + 1];
    if (car >= p1.car && car <= p2.car) {
      const ratio = (car - p1.car) / (p2.car - p1.car);
      return p1[key] + ratio * (p2[key] - p1[key]);
    }
  }
  return 0;
}

export function calcRoa(car: number): number {
  return +interpolate(car, "roa").toFixed(2);
}

export function calcRoe(car: number): number {
  return +interpolate(car, "roe").toFixed(2);
}

export const ROA_AVG = 0.92;
export const ROE_AVG = 13.51;

export type ZoneStatus = "under" | "optimal" | "over";

export function getStatus(car: number): ZoneStatus {
  if (car < CAR_OPTIMAL_LOW) return "under";
  if (car > CAR_OPTIMAL_HIGH) return "over";
  return "optimal";
}
