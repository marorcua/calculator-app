import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface PresetButtonsProps {
  onSelect: (amount: number) => void;
}

const PRESETS = [
  { label: '$50k', value: 50000 },
  { label: '$100k', value: 100000 },
  { label: '$500k', value: 500000 },
];

export const PresetButtons = ({ onSelect }: PresetButtonsProps) => {
  return (
    <View className="flex-row gap-3 justify-between mb-6">
      {PRESETS.map((preset) => (
        <Pressable
          key={preset.value}
          onPress={() => onSelect(preset.value)}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-xl active:opacity-80"
        >
          <Text className="text-white font-bold text-center">{preset.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};
