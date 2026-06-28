const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  assetPlugins: [],
};

config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

module.exports = config;
