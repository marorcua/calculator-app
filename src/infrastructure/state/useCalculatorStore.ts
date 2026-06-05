import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalculatorData, FIRE_SETTINGS } from "@/domain/models/calculator";

interface LoanData {
  amount: string;
  rate: string;
  years: string;
}

interface CalculatorState {
  investmentData: CalculatorData;
  loanData: LoanData;
  isLoaded: boolean;
  setInvestmentField: (field: keyof CalculatorData, value: string) => void;
  setLoanField: (field: keyof LoanData, value: string) => void;
  setLoaded: (loaded: boolean) => void;
}

const initialInvestmentData: CalculatorData = {
  principal: "10000",
  rate: "5",
  years: "10",
  frequency: "monthly",
  withdrawalRate: (FIRE_SETTINGS.withdrawalRate * 100).toString(),
  taxRate: (FIRE_SETTINGS.taxRate * 100).toString(),
};

const initialLoanData: LoanData = {
  amount: "10000",
  rate: "5",
  years: "10",
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      investmentData: initialInvestmentData,
      loanData: initialLoanData,
      isLoaded: false,
      setInvestmentField: (field, value) =>
        set((state) => ({
          investmentData: { ...state.investmentData, [field]: value },
        })),
      setLoanField: (field, value) =>
        set((state) => ({
          loanData: { ...state.loanData, [field]: value },
        })),
      setLoaded: (loaded) => set({ isLoaded: loaded }),
    }),
    {
      name: "calculator-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Merge defaults to handle new fields automatically
          state.investmentData = {
            ...initialInvestmentData,
            ...state.investmentData,
          };
          state.loanData = { ...initialLoanData, ...state.loanData };
          state.setLoaded(true);
        }
      },
    },
  ),
);
