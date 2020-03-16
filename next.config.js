/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
require('dotenv').config();

const routesConfig = require('./routes-config.js');

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const nextConfig = {
  exportPathMap() {
    const pathMap = {};

    for (const { route, dynamicRoute } of routesConfig) {
      if (dynamicRoute && dynamicRoute.contentfulItemsId && dynamicRoute.params) {
        // Contentful based routes.
        const dataItems = JSON.parse(
          fs.readFileSync(path.join(DATA_FOLDER, `${dynamicRoute.contentfulItemsId}.json`), {
            encoding: 'utf8',
          })
        );

        for (const dataItem of dataItems) {
          let itemRoute = route;
          const queryParams = {};

          // If params is not specified, the route is supposes to be a "singleton"
          // and only the last dataItem will be used as the resolvedData.
          for (const [pattern, replacerFn] of Object.entries(dynamicRoute.params)) {
            const replacementValue = replacerFn(dataItem);
            itemRoute = itemRoute.replace(`[${pattern}]`, replacementValue);
            queryParams[pattern] = replacementValue;
          }

          pathMap[itemRoute] = { page: route, query: queryParams };
        }
      } else {
        // If dynamicRoute is not specified, the route is supposes to be a "singleton",
        // with a 1:1 relation between the page template and the output pages.
        pathMap[route] = { page: route };
      }
    }

    return pathMap;
  },
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
