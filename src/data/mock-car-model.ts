// Mock CAR -> ROA/ROE non-linear model.
// Replace with API later: see src/services/car-service.ts

export const CAR_OPTIMAL_LOW = 8.76;
export const CAR_OPTIMAL_HIGH = 13.11;
export const CAR_OPTIMAL_ROA = 13.11; // CAR mức cho ROA tối đa
export const CAR_OPTIMAL_ROE = 8.76; // CAR mức cho ROE tối đa
export const ROA_MAX = 1.76;
export const ROE_MAX = 16.57;

// Parabola: y = ymax - k*(car - peak)^2  (clamped >= 0)
export function calcRoa(car: number): number {
  const k = 0.04;
  const y = ROA_MAX - k * (car - CAR_OPTIMAL_ROA) ** 2;
  return Math.max(0, +y.toFixed(2));
}

export function calcRoe(car: number): number {
  const k = 0.35;
  const y = ROE_MAX - k * (car - CAR_OPTIMAL_ROE) ** 2;
  return Math.max(0, +y.toFixed(2));
}

export const ROA_AVG = 0.92;
export const ROE_AVG = 13.51;

export type ZoneStatus = "under" | "optimal" | "over";

export function getStatus(car: number): ZoneStatus {
  if (car < CAR_OPTIMAL_LOW) return "under";
  if (car > CAR_OPTIMAL_HIGH) return "over";
  return "optimal";
}
