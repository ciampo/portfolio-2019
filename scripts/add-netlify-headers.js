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
    // Images
    `img-src 'self' https://images.ctfassets.net https://videos.ctfassets.net https://*.google-analytics.com data: http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io;`,
    // Audio/video
    `media-src 'self' https://images.ctfassets.net https://videos.ctfassets.net data:`,
    // Styles
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    // Fonts
    `font-src 'self' data: http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io`,
    // Scripts
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google-analytics.com http://*.hotjar.com https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io https://*.netlify.app https://*.googletagmanager.com`,
    // XHR / WebSockets
    `connect-src 'self' https://*.google-analytics.com http://*.hotjar.com:* https://*.hotjar.com:* http://*.hotjar.io https://*.hotjar.io wss://*.hotjar.com`,
    // Webmanifest
    `manifest-src 'self'`,
    // Iframes
    `frame-src 'self' https://*.hotjar.com http://*.hotjar.io https://*.hotjar.io https://*.netlify.com`,
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
