import React from "react";
import { View, TextInput, Text } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "numeric" | "decimal-pad" | "default";
  error?: string;
}

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder = "0.00",
  keyboardType = "numeric",
  error,
}: InputFieldProps) => {
  return (
    <View className="mb-6">
      <Text className="text-sm font-bold text-gray-600 mb-3 ml-1 uppercase tracking-wide">
        {label}
      </Text>
      <TextInput
        className={`p-4 rounded-2xl text-lg font-semibold border ${
          error
            ? "bg-red-50 border-red-300 text-red-900"
            : "bg-gray-100 border-gray-300 text-gray-800"
        }`}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
      {error && <Text className="text-red-500 text-xs mt-2 ml-1">{error}</Text>}
    </View>
  );
};
