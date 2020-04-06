/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const routesConfig = require('../routes-config.js');

// Follows the convention for Netlify's _headers file
// Can't have tailored caching stategies because of https://github.com/zeit/next.js/issues/6303
const _headersContent = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
${routesConfig
  // replace `[placeholder]` with `:placeholder`
  .map((rc) => rc.route.replace(/\/\[([^/]+)\]/g, '/:$1'))
  .map(
    (routePath) => `${routePath}
  Content-Security-Policy: ${[
    // Only accept same origin by default
    `default-src 'self'`,
    // Allow images from same origin, Contentful, Google Analytics and data scheme (e.g. base64)
    `img-src 'self' https://images.ctfassets.net https://videos.ctfassets.net https://www.google-analytics.com data:`,
    // Allow audio/video from same origin, Contentful and data scheme (e.g. base64)
    `media-src 'self' https://images.ctfassets.net https://videos.ctfassets.net data:`,
    // Allow styles from same origin and inline
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    // No external fonts allowed
    `font-src 'self' data:`,
    // Allow script coming from same origin and Google Analytics (and inline)
    `script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://static.hotjar.com`,
    // Allow XHR to same origin and Google Analytics
    `connect-src 'self' https://www.google-analytics.com`,
    // Allow prefetching from same origin
    `prefetch-src 'self'`,
    // Allow webmanifest files from same origin
    `manifest-src 'self'`,
  ].join('; ')}
  X-XSS-Protection: 1; mode=block`
  )
  .join('\n')}
/*js
  Content-Type: application/javascript; charset=utf-8
/*webmanifest
  Content-Type: application/manifest+json; charset=utf-8
/fonts/*
  Cache-Control: public, max-age=3153600
`;

console.log('\nGenerating Netlify headers...');

const ROOT_FOLDER = process.cwd();
const OUT_FOLDER = path.join(ROOT_FOLDER, 'out');

fs.writeFileSync(path.join(OUT_FOLDER, '_headers'), _headersContent, {
  encoding: 'utf8',
});

console.log('Netlify headers added successfully');
