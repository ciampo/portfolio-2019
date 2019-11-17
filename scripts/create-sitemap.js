/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const routesConfig = require('../routes-config.js');

const ROOT_FOLDER = process.cwd();
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const sitemapPages = [];

for (const { route, contentfulTypeId, params } of routesConfig) {
  if (contentfulTypeId) {
    // Contentful based routes.
    const data = JSON.parse(
      fs.readFileSync(path.join(DATA_FOLDER, `${contentfulTypeId}.json`), {
        encoding: 'utf8',
      })
    );

    for (const dataItem of data) {
      let itemRoute = route;

      // If params is not specified, the route is supposes to be a "singleton"
      // and only the last dataItem will be used as the resolvedData.
      if (params) {
        for (const [pattern, replacerFn] of Object.entries(params)) {
          itemRoute = itemRoute.replace(`[${pattern}]`, replacerFn(dataItem));
        }
      }

      sitemapPages.push(itemRoute);
    }
  } else {
    // All routes that have a 1:1 relation between route and page.
    sitemapPages.push(route);
  }
}

const sitemapString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapPages
    .map((slug) => `<url><loc>${process.env.CANONICAL_URL}${slug}</loc></url>`)
    .join('\n  ')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_FOLDER, 'sitemap.xml'), sitemapString, { encoding: 'utf8' });
