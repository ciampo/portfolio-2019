/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const del = require('del');
const { promisify } = require('util');
const { createClient } = require('contentful');

const writeFileAsync = promisify(fs.writeFile);
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

const cleanDataFolder = async () => {
  if (await existsAsync(DATA_FOLDER)) {
    // Using `del` as fs.rmdir can not delete folders recursively.
    await del(DATA_FOLDER);
  }

  await mkdirAsync(DATA_FOLDER, { recursive: true });
};

async function getEntries(type, filterFuntion = () => true) {
  const entries = await client.getEntries({
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: type,
  });

  const contents = entries.items
    .map(({ sys, fields }) => ({
      id: sys.id,
      ...fields,
    }))
    .filter(filterFuntion);

  await writeFileAsync(path.join(DATA_FOLDER, `${type}.json`), JSON.stringify(contents, null, 2));
}

const pullContentfulData = async () => {
  await cleanDataFolder();
  await getEntries('homePage');
  await getEntries('about');
  await getEntries('project', (projectItem) => projectItem.type === 'personal');
  await getEntries('globalMeta');
};

pullContentfulData();
