/* eslint-disable @typescript-eslint/no-var-requires */

const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          '100': '#e0e0e0',
          '900': '#212121',
        },
      },
    },
    colors: {
      ...colors,
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      background: 'var(--color-background)',
    },
  },
  variants: {},
  plugins: [],
};
