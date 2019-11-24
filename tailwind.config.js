/* eslint-disable @typescript-eslint/no-var-requires */

const { colors, screens, maxWidth } = require('tailwindcss/defaultTheme');

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
    },
    screens: {
      xsm: '480px',
      ...screens,
    },
    colors: {
      ...colors,
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      background: 'var(--color-background)',
    },
    aspectRatio: {
      square: [1, 1],
      '16/9': [16, 9],
      '4/3': [4, 3],
      '21/9': [21, 9],
    },
    maxWidth: {
      ...maxWidth,
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
    },
  },
  variants: {},
  plugins: [require('tailwindcss-aspect-ratio')()],
};
