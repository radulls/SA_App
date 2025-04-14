const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Настройка трансформера для SVG
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  // Настройка разрешений для SVG
  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...config.resolver.sourceExts, "svg"],
  };

  // Добавляем кастомный репортер, чтобы убрать логи Metro
  config.reporter = {
    update: () => {}, // Отключаем все логи Metro
  };

  return config;
})();
