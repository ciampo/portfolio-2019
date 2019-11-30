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
  variants: {
    zIndex: ['responsive', 'focus'],
  },
  plugins: [
    require('tailwindcss-aspect-ratio')(),
    function({ addUtilities }) {
      const newUtilities = {
        // Contain
        '.contain-strict': {
          contain: 'strict',
        },
        '.contain-layout-paint': {
          contain: 'layout paint',
        },
        '.contain-paint': {
          contain: 'paint',
        },
        '.contain-layout': {
          contain: 'layout',
        },
        // Transition
        '.transition-tf-custom': {
          transitionTimingFunction: 'cubic-bezier(0.175, 0.85, 0.42, 0.96)',
        },
        '.transition-d-100': {
          transitionDuration: '0.1s',
        },
        '.transition-d-150': {
          transitionDuration: '0.15s',
        },
        '.transition-d-200': {
          transitionDuration: '0.2s',
        },
        '.transition-d-300': {
          transitionDuration: '0.3s',
        },
        '.transition-d-500': {
          transitionDuration: '0.5s',
        },
        '.transition-p-opacity': {
          transitionProperty: 'opacity',
        },
        '.transition-p-opacity-transform': {
          transitionProperty: 'opacity, transform',
        },
        '.transition-inherit': {
          transition: 'inherit',
        },
        // Transform
        '.transform-scale-up': {
          transform: 'scale(1.05)',
        },
        '.transform-scale-down': {
          transform: 'scale(0.96)',
        },
        '.transform-none': {
          transform: 'none',
        },
        // Tap color
        '.tap-transparent': {
          ['-webkit-tap-highlight-color']: 'transparent',
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus']);
    },
  ],
};
