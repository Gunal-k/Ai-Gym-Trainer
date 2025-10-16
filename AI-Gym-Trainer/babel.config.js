module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This is the required plugin for Vision Camera and Reanimated
      'react-native-reanimated/plugin',
    ],
  };
};