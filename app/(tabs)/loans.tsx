import React from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { usePersistence } from '@/hooks/usePersistence';
import { calculateMonthlyPayment, formatCurrency } from '@/utils/math';
import { Landmark } from 'lucide-react-native';

export default function LoansScreen() {
  const [data, setData, isLoaded] = usePersistence('loan_data', {
    amount: '',
    rate: '',
    years: '',
  });

  if (!isLoaded) return null;

  const amount = parseFloat(data.amount) || 0;
  const rate = (parseFloat(data.rate) || 0) / 100;
  const years = parseFloat(data.years) || 0;

  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const totalPayment = monthlyPayment * years * 12;
  const totalInterest = totalPayment - amount;

  const updateField = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
          <View className="flex-row items-center mb-6">
            <View className="bg-emerald-100 p-3 rounded-2xl mr-4">
              <Landmark size={24} color="#10b981" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">Loan Calculator</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1 ml-1">Loan Amount ($)</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl text-lg font-semibold text-gray-800 border border-gray-200"
                placeholder="0.00"
                keyboardType="numeric"
                value={data.amount}
                onChangeText={(v) => updateField('amount', v)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1 ml-1">Annual Rate (%)</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl text-lg font-semibold text-gray-800 border border-gray-200"
                placeholder="0.00"
                keyboardType="numeric"
                value={data.rate}
                onChangeText={(v) => updateField('rate', v)}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1 ml-1">Loan Term (Years)</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl text-lg font-semibold text-gray-800 border border-gray-200"
                placeholder="0"
                keyboardType="numeric"
                value={data.years}
                onChangeText={(v) => updateField('years', v)}
              />
            </View>
          </View>
        </View>

        <View className="bg-emerald-600 p-8 rounded-3xl shadow-md items-center mb-4">
          <Text className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Monthly Payment</Text>
          <Text className="text-white text-4xl font-extrabold">{formatCurrency(monthlyPayment)}</Text>
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Total Interest</Text>
            <Text className="text-gray-800 text-xl font-bold">{formatCurrency(totalInterest > 0 ? totalInterest : 0)}</Text>
          </View>
          <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center">
            <Text className="text-gray-500 text-xs font-bold uppercase mb-1">Total Payment</Text>
            <Text className="text-gray-800 text-xl font-bold">{formatCurrency(totalPayment > 0 ? totalPayment : 0)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
