import { CalculatorData, ValidationError } from '@/types/calculator';

const CONSTRAINTS = {
  principal: { min: 0, max: 10_000_000 },
  rate: { min: -10, max: 100 },
  years: { min: 0, max: 100 },
};

export const validateCalculatorData = (data: CalculatorData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Principal validation
  const principal = parseFloat(data.principal);
  if (data.principal && (isNaN(principal) || principal < CONSTRAINTS.principal.min)) {
    errors.push({
      field: 'principal',
      message: 'Principal must be a positive number',
    });
  }
  if (principal > CONSTRAINTS.principal.max) {
    errors.push({
      field: 'principal',
      message: `Principal cannot exceed $${CONSTRAINTS.principal.max.toLocaleString()}`,
    });
  }

  // Rate validation
  const rate = parseFloat(data.rate);
  if (data.rate && isNaN(rate)) {
    errors.push({
      field: 'rate',
      message: 'Interest rate must be a valid number',
    });
  }
  if (rate < CONSTRAINTS.rate.min || rate > CONSTRAINTS.rate.max) {
    errors.push({
      field: 'rate',
      message: `Interest rate must be between ${CONSTRAINTS.rate.min}% and ${CONSTRAINTS.rate.max}%`,
    });
  }
  if (rate > 30) {
    errors.push({
      field: 'rate',
      message: '⚠️ Rate seems unusually high. Double-check?',
    });
  }

  // Years validation
  const years = parseFloat(data.years);
  if (data.years && (isNaN(years) || years < CONSTRAINTS.years.min)) {
    errors.push({
      field: 'years',
      message: 'Years must be a positive number',
    });
  }
  if (years > CONSTRAINTS.years.max) {
    errors.push({
      field: 'years',
      message: `Years cannot exceed ${CONSTRAINTS.years.max}`,
    });
  }

  return errors;
};

export const hasErrors = (errors: ValidationError[]): boolean => errors.length > 0;

export const getFieldError = (field: keyof CalculatorData, errors: ValidationError[]): string | undefined => {
  return errors.find((e) => e.field === field)?.message;
};
