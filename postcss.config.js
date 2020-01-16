/* eslint-disable @typescript-eslint/no-var-requires */

const dev = process.env.NODE_ENV !== 'production';

const devPlugins = {
  stylelint: {},
  'postcss-easy-import': {},
  tailwindcss: {},
  autoprefixer: {},
  'postcss-reporter': { clearReportedMessages: true },
};

const prodPlugins = {
  stylelint: {},
  'postcss-easy-import': {},
  tailwindcss: {},
  '@fullhuman/postcss-purgecss': {
    content: ['./pages/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
    defaultExtractor: (content) => content.match(/[\w-:/]+(?<!:)/g) || [],
  },
  autoprefixer: {},
  cssnano: {},
  'postcss-reporter': { clearReportedMessages: true },
};

module.exports = {
  plugins: dev ? devPlugins : prodPlugins,
};
