import { useMemo } from "react";
import {
  CalculatorData,
  CalculationResult,
  COMPOUNDING_FREQUENCY_MAP,
  FIRE_SETTINGS,
} from "@/src/domain/models/calculator";
import {
  calculateCompoundInterest,
  generateYearlyBreakdown,
} from "@/src/domain/math/math";

export const useCompoundInterestCalculator = (
  data: CalculatorData,
): CalculationResult => {
  return useMemo(() => {
    const principal = parseFloat(data.principal) || 0;
    const rate = (parseFloat(data.rate) || 0) / 100;
    const years = parseFloat(data.years) || 0;
    const frequency = COMPOUNDING_FREQUENCY_MAP[data.frequency];

    const withdrawalRate =
      (parseFloat(data.withdrawalRate) || FIRE_SETTINGS.withdrawalRate * 100) /
      100;
    const taxRate =
      (parseFloat(data.taxRate) || FIRE_SETTINGS.taxRate * 100) / 100;

    const futureValue = calculateCompoundInterest(
      principal,
      rate,
      frequency,
      years,
    );
    const totalInterest = futureValue - principal;
    const growthPercentage =
      principal > 0 ? (futureValue / principal - 1) * 100 : 0;
    const yearlyBreakdown = generateYearlyBreakdown(
      principal,
      rate,
      frequency,
      years,
    );

    const fireIncome = futureValue * withdrawalRate * (1 - taxRate);
    const monthlyFireIncome = fireIncome / 12;

    return {
      futureValue,
      totalInterest,
      growthPercentage,
      yearlyBreakdown,
      fireIncome,
      monthlyFireIncome,
    };
  }, [
    data.principal,
    data.rate,
    data.years,
    data.frequency,
    data.withdrawalRate,
    data.taxRate,
  ]);
};
