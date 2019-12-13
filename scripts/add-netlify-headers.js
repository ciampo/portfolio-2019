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
  // reaplce [placeholder] with :placeholder
  .map((rc) => rc.route.replace(/\/\[([^/]+)\]/g, '/:$1'))
  .map(
    (routePath) => `${routePath}
  Content-Security-Policy: ${[
    // No sources accepted for generic content. Single content types are specified below.
    `default-src 'none'`,
    // Allow images from same origin, Netlify, Google Analytics and data scheme (e.g. base64)
    `img-src 'self' https://images.ctfassets.net http://www.google-analytics.com data:`,
    // Allow audio/video from same origin, Netlify and data scheme (e.g. base64)
    `media-src 'self' https://images.ctfassets.net data:`,
    // Allow styles from same origin and inline
    `style-src 'self' 'unsafe-inline'`,
    // No external fonts allowed
    `font-src 'self' data:`,
    // Allow script coming from same origin and Google Analytics (and inline)
    `script-src 'self' 'unsafe-inline' https://www.google-analytics.com`,
    // Allow XHR to same origin and Google Analytics
    `connect-src 'self' https://www.google-analytics.com`,
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
`;

console.log('\nGenerating Netlify headers...');

const ROOT_FOLDER = process.cwd();
const OUT_FOLDER = path.join(ROOT_FOLDER, 'out');

fs.writeFileSync(path.join(OUT_FOLDER, '_headers'), _headersContent, {
  encoding: 'utf8',
});

console.log('Netlify headers added successfully');
