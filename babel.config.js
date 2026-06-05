module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.NODE_ENV === "test";

  const presets = [
    ["babel-preset-expo", { jsxImportSource: isTest ? "react" : "nativewind" }],
  ];

  if (!isTest) {
    presets.push("nativewind/babel");
  }

  return {
    presets,
    plugins: [
      "babel-plugin-transform-import-meta",
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      "react-native-reanimated/plugin",
    ],
  };
};
