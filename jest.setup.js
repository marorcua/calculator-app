import React from "react";

global.__DEV__ = true;

// Manually mock basic components to ensure they are never undefined
jest.mock("react-native", () => {
  const React = require("react");
  const View = ({ children, ...props }) =>
    React.createElement("View", props, children);
  const Text = ({ children, ...props }) =>
    React.createElement("Text", props, children);
  const TextInput = React.forwardRef((props, ref) =>
    React.createElement("TextInput", { ...props, ref }),
  );
  const Pressable = ({ children, ...props }) =>
    React.createElement("Pressable", props, children);
  const ScrollView = ({ children, ...props }) =>
    React.createElement("ScrollView", props, children);

  const StyleSheet = {
    create: (obj) => obj,
    flatten: (style) =>
      Array.isArray(style) ? Object.assign({}, ...style) : style,
    hairlineWidth: 1,
  };

  const Platform = {
    OS: "ios",
    select: (obj) => obj.ios || obj.default,
  };

  return {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Platform,
    NativeModules: {},
  };
});

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  return {
    default: {
      View: ({ children, ...props }) =>
        React.createElement("View", props, children),
      ScrollView: ({ children, ...props }) =>
        React.createElement("ScrollView", props, children),
      Text: ({ children, ...props }) =>
        React.createElement("Text", props, children),
    },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: (cb) => ({}),
    useAnimatedScrollHandler: (cb) => ({}),
    interpolate: (v, input, output) => 0,
    Extrapolation: { CLAMP: "clamp" },
    runOnJS: (fn) => fn,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

jest.mock("react-native-css-interop", () => ({
  cssInterop: (c) => c,
  useColorScheme: () => ({
    colorScheme: "light",
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  }),
  getColorScheme: () => "light",
  remapProps: (c) => c,
}));

jest.mock("expo-font", () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => "/",
  Link: ({ children }) => children,
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));
