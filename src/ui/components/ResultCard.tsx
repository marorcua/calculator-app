import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { formatCurrency } from "@/domain/math/math";
import { CalculationResult } from "@/domain/models/calculator";

interface ResultCardProps {
  result: CalculationResult;
  principal: number;
}

export const ResultCard = ({ result, principal }: ResultCardProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <View className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl items-center border border-blue-500">
      <Text className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">
        Your Future Value
      </Text>
      <Text className="text-white text-5xl font-extrabold mb-6">
        {formatCurrency(result.futureValue)}
      </Text>

      <View className="flex-row w-full justify-between mb-4 gap-2">
        <View className="flex-1 bg-blue-500 bg-opacity-60 px-4 py-3 rounded-xl border border-blue-400">
          <Text className="text-blue-200 text-xs font-bold text-center">
            Annual FIRE
          </Text>
          <Text className="text-white font-semibold text-center mt-1">
            {formatCurrency(result.fireIncome)}
          </Text>
        </View>
        <View className="flex-1 bg-blue-500 bg-opacity-60 px-4 py-3 rounded-xl border border-blue-400">
          <Text className="text-blue-200 text-xs font-bold text-center">
            Monthly FIRE
          </Text>
          <Text className="text-white font-semibold text-center mt-1">
            {formatCurrency(result.monthlyFireIncome)}
          </Text>
        </View>
      </View>

      <View className="bg-blue-500 bg-opacity-60 px-6 py-3 rounded-full border border-blue-400 w-full">
        <Text className="text-white font-semibold text-center">
          Interest Earned:{" "}
          <Text className="text-blue-100">
            {formatCurrency(result.totalInterest)}
          </Text>
        </Text>
      </View>

      {principal > 0 && (
        <View className="mt-6 bg-blue-700 bg-opacity-50 w-full px-4 py-3 rounded-xl border border-blue-500">
          <Text className="text-blue-100 text-center font-medium">
            Your money will grow by {result.growthPercentage.toFixed(1)}%
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => setShowBreakdown(!showBreakdown)}
        className="mt-6 w-full flex-row items-center justify-between bg-blue-500 bg-opacity-40 px-4 py-3 rounded-lg border border-blue-400"
      >
        <Text className="text-blue-100 font-semibold">
          Year-by-Year Breakdown
        </Text>
        {showBreakdown ? (
          <ChevronUp size={20} color="#dbeafe" />
        ) : (
          <ChevronDown size={20} color="#dbeafe" />
        )}
      </Pressable>

      {showBreakdown && (
        <ScrollView className="mt-4 w-full max-h-64 bg-blue-900 bg-opacity-30 rounded-lg p-4 border border-blue-400">
          {result.yearlyBreakdown.map((year) => (
            <View
              key={year.year}
              className="flex-row justify-between mb-3 pb-3 border-b border-blue-500"
            >
              <View className="flex-1">
                <Text className="text-blue-100 font-semibold">
                  Year {year.year}
                </Text>
                <Text className="text-blue-200 text-xs">
                  +{formatCurrency(year.interestEarned)}
                </Text>
              </View>
              <Text className="text-blue-50 font-bold text-right">
                {formatCurrency(year.value)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
