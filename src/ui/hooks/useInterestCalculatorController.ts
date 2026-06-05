import { useCallback, useState } from "react";
import { useCalculatorStore } from "@/infrastructure/state/useCalculatorStore";
import { useCompoundInterestCalculator } from "@/application/hooks/useCompoundInterestCalculator";
import { validateCalculatorData } from "@/domain/validation/validation";
import {
  CalculatorData,
  CompoundingFrequency,
} from "@/domain/models/calculator";

export const useInterestCalculatorController = () => {
  const { investmentData, setInvestmentField, isLoaded } = useCalculatorStore();
  const [showConditions, setShowConditions] = useState(false);

  const result = useCompoundInterestCalculator(investmentData);
  const errors = validateCalculatorData(investmentData);
  const principal = parseFloat(investmentData.principal) || 0;

  const updateField = useCallback(
    (field: keyof CalculatorData, value: string) => {
      setInvestmentField(field, value);
    },
    [setInvestmentField],
  );

  const handlePrincipalChange = useCallback(
    (val: number) => {
      updateField("principal", String(val));
    },
    [updateField],
  );

  const handleFrequencyChange = useCallback(
    (freq: CompoundingFrequency) => {
      updateField("frequency", freq);
    },
    [updateField],
  );

  const getFieldError = useCallback(
    (field: keyof CalculatorData) => {
      return errors.find((e) => e.field === field)?.message;
    },
    [errors],
  );

  return {
    data: investmentData,
    isLoaded,
    showConditions,
    setShowConditions,
    result,
    principal,
    updateField,
    handlePrincipalChange,
    handleFrequencyChange,
    getFieldError,
  };
};
