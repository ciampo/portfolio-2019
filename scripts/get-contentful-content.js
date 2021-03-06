/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const urlParser = require('url');
const https = require('https');
const del = require('del');
const { promisify } = require('util');
const { createClient } = require('contentful');

const routesConfig = require('../routes-config');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

require('dotenv').config();

const SPACE = process.env.CONTENTFUL_SPACE;
const TOKEN = process.env.CONTENTFUL_TOKEN;

const client = createClient({
  space: SPACE,
  accessToken: TOKEN,
});

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const THUMB_KEY = '__base64Thumb';

const cleanDataFolder = async () => {
  if (await existsAsync(DATA_FOLDER)) {
    // Using `del` as fs.rmdir can not delete folders recursively.
    await del(DATA_FOLDER);
  }

  await mkdirAsync(DATA_FOLDER, { recursive: true });
};

async function downloadBase64ThumbData(url) {
  return new Promise((resolve) => {
    https
      .get(urlParser.parse(`https:${url}?w=20&fit=fill&fm=jpg&q=10`), (response) => {
        const chunks = [];

        response
          .on('data', (chunk) => {
            chunks.push(chunk);
          })
          .on('end', () => {
            resolve(`data:image/jpeg;base64,${Buffer.concat(chunks).toString('base64')}`);
          });
      })
      .on('error', (err) => {
        console.error(err);
      });
  });
}

async function addBase64ThumbData(obj) {
  if (Array.isArray(obj)) {
    let i = 0;
    for (const child of obj) {
      // NOTE: this function will not add augmented data to arrays of FIFE urls
      obj[i] = await addBase64ThumbData(child);
      i += 1;
    }
  } else if (typeof obj === 'object') {
    if ('contentType' in obj && /image/.test(obj.contentType)) {
      // eslint-disable-next-line require-atomic-updates
      obj[THUMB_KEY] = await downloadBase64ThumbData(obj.url);
    }

    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line require-atomic-updates
      obj[key] = await addBase64ThumbData(value, obj);
    }
  }

  return obj;
}

// 'sys' gets replaced by 'just the id'
// all properties in 'fields' are moved up
function flattenContentfulApis(obj) {
  if (Array.isArray(obj)) {
    let i = 0;
    for (const child of obj) {
      obj[i] = flattenContentfulApis(child);
      i += 1;
    }
  } else if (typeof obj === 'object' && obj.nodeType !== 'document') {
    if ('sys' in obj && 'fields' in obj) {
      const id = obj.sys.id;
      const updatedAt = obj.sys.updatedAt;
      const fields = obj.fields;

      obj = {
        id,
        _updatedAt: updatedAt,
        ...fields,
      };
    }

    for (const [key, value] of Object.entries(obj)) {
      obj[key] = flattenContentfulApis(value);
    }
  }

  return obj;
}

const defaultOpts = {
  isSingleton: false,
  filterFunction: () => true,
  sortFunction: () => 0,
};

async function getEntries(type, opts) {
  const computedOpts = Object.assign({}, defaultOpts, opts);

  const entries = await client.getEntries({
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: type,
  });

  let contents = flattenContentfulApis(entries.items)
    .filter(computedOpts.filterFunction)
    .sort(computedOpts.sortFunction);

  if (contents.length === 0) {
    return;
  }

  // When singleton, assume the first entry is the only entry.
  if (computedOpts.isSingleton) {
    contents = contents[0];
  }

  contents = await addBase64ThumbData(contents);

  await writeFileAsync(path.join(DATA_FOLDER, `${type}.json`), JSON.stringify(contents, null, 2));
}

const pullContentfulData = async () => {
  await cleanDataFolder();

  await getEntries('homePage', { isSingleton: true });
  await getEntries('about', { isSingleton: true });
  await getEntries('pageProjects', { isSingleton: true });
  await getEntries('pageProject', { isSingleton: true });
  await getEntries('structuredData', { isSingleton: true });
  await getEntries('project', {
    sortFunction: (a, b) => {
      const coolA = a.coolFactor;
      const dA = Date.parse(a.date);
      const coolB = b.coolFactor;
      const dB = Date.parse(b.date);

      // Sort by cool rating first (highest to lowest)
      // If same cool rating, sort by date (newest to oldest)
      return coolA < coolB ? 1 : coolA > coolB ? -1 : dA < dB ? 1 : dA > dB ? -1 : 0;
    },
  });

  // Create navLinks data
  const navLinksData = [];
  for (const { route, contentfulPageId } of routesConfig) {
    if (contentfulPageId) {
      const routeData = await readFileAsync(path.join(DATA_FOLDER, `${contentfulPageId}.json`), {
        encoding: 'utf8',
      });

      if (routeData) {
        const parsed = JSON.parse(routeData);

        if (parsed.navTitle) {
          navLinksData.push({
            href: route,
            label: parsed.navTitle,
          });
        }
      }
    }
  }

  await writeFileAsync(
    path.join(DATA_FOLDER, 'navLinks.json'),
    JSON.stringify(navLinksData, null, 2)
  );
};

pullContentfulData();
