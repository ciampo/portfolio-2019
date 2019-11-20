/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const routesConfig = require('../routes-config.js');

const ROOT_FOLDER = process.cwd();
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const sitemapPages = [];

for (const { route, dynamicRoute } of routesConfig) {
  if (dynamicRoute && dynamicRoute.contentfulItemsId && dynamicRoute.params) {
    const dataItems = JSON.parse(
      fs.readFileSync(path.join(DATA_FOLDER, `${dynamicRoute.contentfulItemsId}.json`), {
        encoding: 'utf8',
      })
    );

    // Generate one page for each item from the dynamicRoute.contentfulItemsId document.
    for (const dataItem of dataItems) {
      let itemRoute = route;

      for (const [pattern, replacerFn] of Object.entries(dynamicRoute.params)) {
        itemRoute = itemRoute.replace(`[${pattern}]`, replacerFn(dataItem));
      }

      sitemapPages.push(itemRoute);
    }
  } else {
    // If dynamicRoute is not specified, the route is supposes to be a "singleton",
    // with a 1:1 relation between the page template and the output pages.
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
