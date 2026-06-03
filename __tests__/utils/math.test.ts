import { calculateCompoundInterest, generateYearlyBreakdown, formatCurrency } from '@/src/domain/math/math';

describe('Math Utilities', () => {
  describe('calculateCompoundInterest', () => {
    it('should calculate correct future value', () => {
      // $1000 at 5% annual, compounded monthly for 1 year
      const result = calculateCompoundInterest(1000, 0.05, 12, 1);
      expect(result).toBeCloseTo(1051.16, 1);
    });

    it('should return 0 for negative principal', () => {
      const result = calculateCompoundInterest(-1000, 0.05, 12, 1);
      expect(result).toBe(0);
    });

    it('should return 0 for NaN values', () => {
      expect(calculateCompoundInterest(NaN, 0.05, 12, 1)).toBe(0);
      expect(calculateCompoundInterest(1000, NaN, 12, 1)).toBe(0);
      expect(calculateCompoundInterest(1000, 0.05, 12, NaN)).toBe(0);
    });

    it('should handle 0% interest rate', () => {
      const result = calculateCompoundInterest(1000, 0, 12, 5);
      expect(result).toBe(1000);
    });

    it('should handle daily compounding', () => {
      const result = calculateCompoundInterest(1000, 0.05, 365, 1);
      expect(result).toBeCloseTo(1051.27, 1);
    });

    it('should handle 0 years', () => {
      const result = calculateCompoundInterest(1000, 0.05, 12, 0);
      expect(result).toBe(1000);
    });
  });

  describe('generateYearlyBreakdown', () => {
    it('should generate correct breakdown', () => {
      const breakdown = generateYearlyBreakdown(1000, 0.05, 12, 2);
      
      expect(breakdown).toHaveLength(3); // Years 0, 1, 2
      expect(breakdown[0].year).toBe(0);
      expect(breakdown[0].value).toBe(1000);
      expect(breakdown[0].interestEarned).toBe(0);
      
      expect(breakdown[1].year).toBe(1);
      expect(breakdown[1].value).toBeCloseTo(1051.16, 1);
      expect(breakdown[1].interestEarned).toBeCloseTo(51.16, 1);
    });

    it('should show growth over time', () => {
      const breakdown = generateYearlyBreakdown(1000, 0.05, 12, 3);
      
      expect(breakdown[0].value).toBeLessThan(breakdown[1].value);
      expect(breakdown[1].value).toBeLessThan(breakdown[2].value);
      expect(breakdown[2].value).toBeLessThan(breakdown[3].value);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1000.5)).toBe('$1,000.50');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should handle decimals', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
    });

    it('should handle 0', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });
});
