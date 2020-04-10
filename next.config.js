/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
// const fs = require('fs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
require('dotenv').config();

// const routesConfig = require('./routes-config.js');

// const ROOT_FOLDER = process.cwd();
// const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const nextConfig = {
  webpack(config, options) {
    // From preact netx.js example
    if (options.isServer) {
      config.externals = ['react', 'react-dom', ...config.externals];
    }

    // From preact netx.js example
    config.resolve.alias = {
      ...config.resolve.alias,
      react: 'preact/compat',
      react$: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom$': 'preact/compat',
    };

    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true,
      },
    });

    return config;
  },
  env: {
    GA: process.env.GA,
    CANONICAL_URL: process.env.CANONICAL_URL,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
