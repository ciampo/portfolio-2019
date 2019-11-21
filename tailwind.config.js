/* eslint-disable @typescript-eslint/no-var-requires */

const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          '100': '#e8e8e8',
          '800': '#323232',
          '900': '#212121',
        },
      },
      screens: {
        xsm: '480px',
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
