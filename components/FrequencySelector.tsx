import React from 'react';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { CompoundingFrequency, FREQUENCY_LABELS } from '@/types/calculator';

interface FrequencySelectorProps {
  value: CompoundingFrequency;
  onChange: (freq: CompoundingFrequency) => void;
}

const FREQUENCIES: CompoundingFrequency[] = ['daily', 'monthly', 'quarterly', 'yearly'];

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  return (
    <View className="mb-6">
      <Text className="text-sm font-bold text-gray-600 mb-3 ml-1 uppercase tracking-wide">Compounding Frequency</Text>
      <View className="flex-row gap-2 justify-between">
        {FREQUENCIES.map((freq) => (
          <Pressable
            key={freq}
            onPress={() => onChange(freq)}
            className={`flex-1 py-3 px-2 rounded-xl border-2 ${
              value === freq
                ? 'border-blue-600 bg-blue-100'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <Text
              className={`text-center font-semibold text-xs ${
                value === freq ? 'text-blue-700' : 'text-gray-600'
              }`}
            >
              {FREQUENCY_LABELS[freq]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
