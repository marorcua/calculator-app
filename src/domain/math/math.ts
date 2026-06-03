/**
 * Calculates the future value with compound interest.
 * A = P(1 + r/n)^(nt)
 * @param principal - Initial amount (P)
 * @param annualRate - Annual interest rate as decimal (r) (e.g., 0.05 for 5%)
 * @param timesCompounded - Compounding frequency per year (n)
 * @param years - Time in years (t)
 */
export const calculateCompoundInterest = (
  principal: number,
  annualRate: number,
  timesCompounded: number,
  years: number,
): number => {
  if (isNaN(principal) || isNaN(annualRate) || isNaN(years)) return 0;
  if (principal < 0 || years < 0) return 0;
  return (
    principal *
    Math.pow(1 + annualRate / timesCompounded, timesCompounded * years)
  );
};

/**
 * Generates year-by-year breakdown of compound interest
 */
export const generateYearlyBreakdown = (
  principal: number,
  annualRate: number,
  timesCompounded: number,
  years: number,
) => {
  const breakdown = [];

  for (let year = 0; year <= years; year++) {
    const value = calculateCompoundInterest(
      principal,
      annualRate,
      timesCompounded,
      year,
    );
    breakdown.push({
      year,
      value,
      interestEarned: value - principal,
    });
  }

  return breakdown;
};

/**
 * Calculates the monthly loan payment.
 * M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
 * @param principal - Loan amount (P)
 * @param annualRate - Annual interest rate as decimal (e.g., 0.05 for 5%)
 * @param loanTermYears - Length of loan in years
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  loanTermYears: number,
): number => {
  if (
    isNaN(principal) ||
    isNaN(annualRate) ||
    isNaN(loanTermYears) ||
    principal === 0
  )
    return 0;

  const monthlyRate = annualRate / 12;
  const numberOfPayments = loanTermYears * 12;

  if (monthlyRate === 0)
    return numberOfPayments > 0 ? principal / numberOfPayments : 0;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
};

/**
 * Formats a number as currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
