import { z } from "zod";
import {
  CalculatorData,
  ValidationError,
} from "@/src/domain/models/calculator";

const CONSTRAINTS = {
  principal: { min: 0, max: 10_000_000 },
  rate: { min: -10, max: 100 },
  years: { min: 0, max: 100 },
};

const calculatorDataSchema = z.object({
  principal: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .min(CONSTRAINTS.principal.min, "Principal must be a positive number")
        .max(
          CONSTRAINTS.principal.max,
          `Principal cannot exceed $${CONSTRAINTS.principal.max.toLocaleString()}`,
        ),
    ),
  rate: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .min(
          CONSTRAINTS.rate.min,
          `Interest rate must be at least ${CONSTRAINTS.rate.min}%`,
        )
        .max(
          CONSTRAINTS.rate.max,
          `Interest rate cannot exceed ${CONSTRAINTS.rate.max}%`,
        ),
    ),
  years: z
    .string()
    .transform(Number)
    .pipe(
      z
        .number()
        .min(CONSTRAINTS.years.min, "Years must be a positive number")
        .max(
          CONSTRAINTS.years.max,
          `Years cannot exceed ${CONSTRAINTS.years.max}`,
        ),
    ),
  frequency: z.enum(["daily", "monthly", "quarterly", "yearly"]),
});

export const validateCalculatorData = (
  data: CalculatorData,
): ValidationError[] => {
  const result = calculatorDataSchema.safeParse(data);
  const errors: ValidationError[] = [];

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors.push({
        field: issue.path[0] as keyof CalculatorData,
        message: issue.message,
      });
    });
  }

  // Handle specific custom warnings not easily represented in basic Zod schema
  const rate = parseFloat(data.rate);
  if (!isNaN(rate) && rate > 30 && rate <= CONSTRAINTS.rate.max) {
    errors.push({
      field: "rate",
      message: "⚠️ Rate seems unusually high. Double-check?",
    });
  }

  return errors;
};

export const hasErrors = (errors: ValidationError[]): boolean =>
  errors.length > 0;

export const getFieldError = (
  field: keyof CalculatorData,
  errors: ValidationError[],
): string | undefined => {
  return errors.find((e) => e.field === field)?.message;
};
