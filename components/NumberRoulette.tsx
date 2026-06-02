import React from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface NumberRouletteProps {
  value: string;
  onChangeText: (text: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  placeholder?: string;
  step?: number;
  error?: string;
}

export const NumberRoulette = ({
  value,
  onChangeText,
  onIncrement,
  onDecrement,
  placeholder = '$0.00',
  step = 10000,
  error,
}: NumberRouletteProps) => {
  return (
    <View>
      <View
        className={`flex-row items-center justify-between rounded-2xl p-2 border ${
          error ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}
      >
        <Pressable
          onPress={onDecrement}
          className="p-3 rounded-xl active:bg-red-100"
          hitSlop={8}
        >
          <ChevronDown size={24} color="#ef4444" />
        </Pressable>

        <TextInput
          className="flex-1 text-center text-3xl font-bold text-blue-600 p-4"
          placeholder={placeholder}
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
        />

        <Pressable
          onPress={onIncrement}
          className="p-3 rounded-xl active:bg-green-100"
          hitSlop={8}
        >
          <ChevronUp size={24} color="#10b981" />
        </Pressable>
      </View>
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
      <Text className="text-xs text-gray-500 mt-2 ml-1">±${(step / 1000).toFixed(0)}k</Text>
    </View>
  );
};
