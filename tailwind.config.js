/* eslint-disable @typescript-eslint/no-var-requires */

const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    colors: {
      ...colors,
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
    },
  },
  variants: {},
  plugins: [],
};
