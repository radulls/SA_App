module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            // 🚨 Говорим Metro не загружать `react-native-maps` на вебе
            'react-native-maps': 'react-native-web',
          },
        },
      ],
    ],
  };
};
