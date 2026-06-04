import { calculateMonthlyPayment, formatCurrency } from "@/domain/math/math";
import { usePersistence } from "@/infrastructure/persistence/usePersistence";
import { InputField } from "@/ui/components/InputField";
import { NumberRoulette } from "@/ui/components/NumberRoulette";
import { Landmark, Settings2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoansScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData, isLoaded] = usePersistence("loan_data", {
    amount: "10000",
    rate: "5",
    years: "10",
  });
  const [showConditions, setShowConditions] = useState(false);

  const updateField = useCallback(
    (field: string, value: string) => {
      setData({ ...data, [field]: value });
    },
    [data, setData],
  );

  const handleAmountChange = useCallback(
    (val: number) => {
      updateField("amount", String(val));
    },
    [updateField],
  );

  if (!isLoaded) return null;

  const amount = parseFloat(data.amount) || 0;
  const rate = (parseFloat(data.rate) || 0) / 100;
  const years = parseFloat(data.years) || 0;

  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPayment = monthlyPayment * years * 12;
  const totalInterest = totalPayment - amount;

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <View className="flex-row items-center mb-6">
            <View className="bg-emerald-100 p-3 rounded-2xl mr-4">
              <Landmark size={24} color="#10b981" />
            </View>

            <Text className="text-2xl font-bold text-gray-800">
              Loan Calculator
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-500 mb-2 ml-1">
              Loan Amount
            </Text>
            <NumberRoulette
              value={amount}
              onChange={handleAmountChange}
              min={0}
              max={1000000}
              step={5000}
            />
          </View>

          <Pressable
            onPress={() => setShowConditions(!showConditions)}
            className="flex-row items-center mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100"
          >
            <Settings2 size={20} color="#10b981" style={{ marginRight: 8 }} />
            <Text className="text-emerald-700 font-semibold">
              {showConditions ? "Hide Conditions" : "Show Conditions"}
            </Text>
          </Pressable>

          {showConditions && (
            <View>
              <InputField
                label="Annual Rate (%)"
                value={data.rate}
                onChangeText={(v) => updateField("rate", v)}
                keyboardType="numeric"
              />
              <InputField
                label="Loan Term (Years)"
                value={data.years}
                onChangeText={(v) => updateField("years", v)}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>

        <View className="bg-emerald-600 p-8 rounded-3xl shadow-md items-center mb-4">
          <Text className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">
            Monthly Payment
          </Text>
          <Text className="text-white text-4xl font-extrabold">
            {formatCurrency(monthlyPayment)}
          </Text>
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Total Interest
            </Text>
            <Text className="text-gray-800 text-xl font-bold">
              {formatCurrency(totalInterest > 0 ? totalInterest : 0)}
            </Text>
          </View>
          <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">
              Total Payment
            </Text>
            <Text className="text-gray-800 text-xl font-bold">
              {formatCurrency(totalPayment > 0 ? totalPayment : 0)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
