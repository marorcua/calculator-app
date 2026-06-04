export type CompoundingFrequency = "daily" | "monthly" | "quarterly" | "yearly";

export interface CalculatorData {
  principal: string;
  rate: string;
  years: string;
  frequency: CompoundingFrequency;
}

export interface ValidationError {
  field: keyof CalculatorData;
  message: string;
}

export interface CalculationResult {
  futureValue: number;
  totalInterest: number;
  growthPercentage: number;
  yearlyBreakdown: YearlyData[];
  fireIncome: number;
  monthlyFireIncome: number;
}

export interface YearlyData {
  year: number;
  value: number;
  interestEarned: number;
}

export const FIRE_SETTINGS = {
  withdrawalRate: 0.038,
  taxRate: 0.2, // 1 - 0.8 = 0.2
};

export const COMPOUNDING_FREQUENCY_MAP: Record<CompoundingFrequency, number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

export const FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  daily: "Daily",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};
