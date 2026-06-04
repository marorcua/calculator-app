const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg"];

config.resolver.unstable_enablePackageExports = true;

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  vaul: path.resolve(__dirname, "shims/vaul.js"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
