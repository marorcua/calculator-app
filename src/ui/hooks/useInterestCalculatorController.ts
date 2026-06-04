import { useCallback, useState } from "react";
import { usePersistence } from "@/infrastructure/persistence/usePersistence";
import { useCompoundInterestCalculator } from "@/application/hooks/useCompoundInterestCalculator";
import { validateCalculatorData } from "@/domain/validation/validation";
import {
  CalculatorData,
  CompoundingFrequency,
  FIRE_SETTINGS,
} from "@/domain/models/calculator";

export const useInterestCalculatorController = () => {
  const [data, setData, isLoaded] = usePersistence<CalculatorData>(
    "interest_data",
    {
      principal: "10000",
      rate: "5",
      years: "10",
      frequency: "monthly",
      withdrawalRate: (FIRE_SETTINGS.withdrawalRate * 100).toString(),
      taxRate: (FIRE_SETTINGS.taxRate * 100).toString(),
    },
  );
  const [showConditions, setShowConditions] = useState(false);

  const result = useCompoundInterestCalculator(data);
  const errors = validateCalculatorData(data);
  const principal = parseFloat(data.principal) || 0;

  const updateField = useCallback(
    (field: keyof CalculatorData, value: string) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [setData],
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
    data,
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
