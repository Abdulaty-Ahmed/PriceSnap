module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Temporarily disabled - causing Babel errors
      // 'react-native-reanimated/plugin',
    ],
  };
};

