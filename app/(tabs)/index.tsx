/** @format */
import { FrequencySelector } from "@/ui/components/FrequencySelector";
import { InputField } from "@/ui/components/InputField";
import { NumberRoulette } from "@/ui/components/NumberRoulette";
import { ResultCard } from "@/ui/components/ResultCard";
import { useInterestCalculatorController } from "@/ui/hooks/useInterestCalculatorController";

import { PiggyBank, Settings2 } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InterestScreen() {
  const insets = useSafeAreaInsets();
  const {
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
  } = useInterestCalculatorController();

  if (!isLoaded) return null;

  return (
    <View
      className="flex-1 bg-blue-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1"
        scrollEnabled={true}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <View className="bg-blue-600 p-4 rounded-2xl mr-4">
            <PiggyBank size={28} color="white" />
          </View>
          <View>
            <Text className="text-3xl font-bold text-gray-900">Investment</Text>
            <Text className="text-sm text-gray-600">
              Calculate your savings growth
            </Text>
          </View>
        </View>

        {/* Input Card */}
        <View className="bg-white p-8 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <View className="mb-8">
            <Text className="text-sm font-bold text-gray-600 mb-4 ml-1 uppercase tracking-wide">
              Loan Amount
            </Text>
            <NumberRoulette
              value={principal}
              onChange={handlePrincipalChange}
              min={0}
              max={1000000}
              step={5000}
              error={getFieldError("principal")}
            />
          </View>

          {/* Toggle Conditions */}
          <Pressable
            onPress={() => setShowConditions(!showConditions)}
            className="flex-row items-center mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100"
          >
            <Settings2 size={20} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-blue-700 font-semibold">
              {showConditions ? "Hide Conditions" : "Show Conditions"}
            </Text>
          </Pressable>

          {showConditions && (
            <View>
              {/* Annual Rate */}
              <InputField
                label="Annual Rate"
                value={data.rate}
                onChangeText={(v) => updateField("rate", v)}
                placeholder="0.00%"
                keyboardType="decimal-pad"
                error={getFieldError("rate")}
              />

              {/* Years */}
              <InputField
                label="Years"
                value={data.years}
                onChangeText={(v) => updateField("years", v)}
                placeholder="0"
                keyboardType="numeric"
                error={getFieldError("years")}
              />
            </View>
          )}

          {/* Compounding Frequency */}
          <FrequencySelector
            value={data.frequency}
            onChange={handleFrequencyChange}
          />
        </View>

        {/* Result Card */}
        <ResultCard result={result} principal={principal} />
      </ScrollView>
    </View>
  );
}
