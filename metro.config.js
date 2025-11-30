const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable problematic node modules to avoid Windows path issues
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  blockList: [/node:sea/],
};

// Disable external shims that cause Windows path issues
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Skip node:sea module
      if (req.url && req.url.includes('node:sea')) {
        res.statusCode = 404;
        res.end();
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;

