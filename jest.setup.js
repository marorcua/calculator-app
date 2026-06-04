console.log("Jest setup loaded");
global.__DEV__ = true;

jest.mock("react-native", () => require("react-native/jest/mock"));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native-css-interop", () => ({
  cssInterop: (component) => component,
  getColorScheme: jest.fn(() => "light"),
}));
