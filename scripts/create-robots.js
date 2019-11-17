/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ROOT_FOLDER = process.cwd();
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');

const robotsString = `User-agent: *

Allow: /

Sitemap: ${process.env.CANONICAL_URL}/sitemap.xml`;

fs.writeFileSync(path.join(PUBLIC_FOLDER, 'robots.txt'), robotsString, { encoding: 'utf8' });
