import {
  validateCalculatorData,
  hasErrors,
  getFieldError,
} from "@/domain/validation/validation";
import { CalculatorData } from "@/domain/models/calculator";

describe("Validation Utilities", () => {
  describe("validateCalculatorData", () => {
    const validData: CalculatorData = {
      principal: "1000",
      rate: "5",
      years: "10",
      frequency: "monthly",
    };

    it("should accept valid data", () => {
      const errors = validateCalculatorData(validData);
      expect(errors).toHaveLength(0);
    });

    it("should reject negative principal", () => {
      const data: CalculatorData = { ...validData, principal: "-100" };
      const errors = validateCalculatorData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "principal" }),
      );
    });

    it("should reject invalid principal", () => {
      const data: CalculatorData = { ...validData, principal: "abc" };
      const errors = validateCalculatorData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "principal" }),
      );
    });

    it("should warn for unusually high interest rates", () => {
      const data: CalculatorData = { ...validData, rate: "50" };
      const errors = validateCalculatorData(data);
      expect(
        errors.some(
          (e) => e.field === "rate" && e.message.includes("unusually high"),
        ),
      ).toBe(true);
    });

    it("should reject interest rate out of range", () => {
      const data: CalculatorData = { ...validData, rate: "150" };
      const errors = validateCalculatorData(data);
      expect(errors).toContainEqual(expect.objectContaining({ field: "rate" }));
    });

    it("should reject negative years", () => {
      const data: CalculatorData = { ...validData, years: "-5" };
      const errors = validateCalculatorData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "years" }),
      );
    });

    it("should reject years exceeding max", () => {
      const data: CalculatorData = { ...validData, years: "200" };
      const errors = validateCalculatorData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "years" }),
      );
    });

    it("should allow empty strings (not required to be filled)", () => {
      const data: CalculatorData = {
        principal: "",
        rate: "",
        years: "",
        frequency: "monthly",
      };
      const errors = validateCalculatorData(data);
      expect(errors).toHaveLength(0);
    });
  });

  describe("hasErrors", () => {
    it("should return true when errors exist", () => {
      const errors = [{ field: "principal" as const, message: "Invalid" }];
      expect(hasErrors(errors)).toBe(true);
    });

    it("should return false when no errors", () => {
      expect(hasErrors([])).toBe(false);
    });
  });

  describe("getFieldError", () => {
    const errors = [
      { field: "principal" as const, message: "Too low" },
      { field: "rate" as const, message: "Invalid rate" },
    ];

    it("should return error message for field", () => {
      expect(getFieldError("principal", errors)).toBe("Too low");
      expect(getFieldError("rate", errors)).toBe("Invalid rate");
    });

    it("should return undefined if no error for field", () => {
      expect(getFieldError("years", errors)).toBeUndefined();
    });
  });
});
