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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
