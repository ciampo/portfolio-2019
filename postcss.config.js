/* eslint-disable @typescript-eslint/no-var-requires */

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: [
    require('stylelint'),
    require('postcss-easy-import'),
    require('tailwindcss'),
    dev
      ? null
      : require('@fullhuman/postcss-purgecss')({
          content: ['./pages/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
          defaultExtractor: (content) => content.match(/[\w-:/]+(?<!:)/g) || [],
        }),
    require('autoprefixer'),
    dev ? null : require('cssnano'),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ].filter((plugin) => plugin !== null),
};
