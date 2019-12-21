import { createContext } from 'react';

let rootStyles;
if (process.browser) {
  rootStyles = window.getComputedStyle(document.documentElement);
}

const themes = {
  DARK: rootStyles ? rootStyles.getPropertyValue('--color-primary') || '#fff' : '#fff',
  LIGHT: rootStyles ? rootStyles.getPropertyValue('--color-background') || '#000' : '#000',
};

const classNames = {
  LIGHT: 'theme--light',
};

const localStorageKey = 'theme-color';

const ThemeContext = createContext({
  value: themes.DARK,
  toggle: () => {},
});

export { ThemeContext, themes, classNames, localStorageKey };
