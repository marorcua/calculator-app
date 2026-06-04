import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

jest.mock("react-native-css-interop", () => ({
  cssInterop: (component: any) => component,
  useColorScheme: jest.fn(() => "light"),
  getColorScheme: jest.fn(() => "light"),
}));

import { InputField } from "@/ui/components/InputField";

describe("InputField", () => {
  it("renders correctly with label and value", () => {
    const { getByText, getByDisplayValue } = render(
      <InputField
        label="Test Label"
        value="100"
        onChangeText={jest.fn()}
        placeholder="Enter value"
      />,
    );

    expect(getByText("Test Label")).toBeTruthy();
    expect(getByDisplayValue("100")).toBeTruthy();
  });

  it("calls onChangeText when text changes", () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <InputField
        label="Test Label"
        value="100"
        onChangeText={onChangeText}
        placeholder="Enter value"
      />,
    );

    fireEvent.changeText(getByDisplayValue("100"), "200");
    expect(onChangeText).toHaveBeenCalledWith("200");
  });
});
