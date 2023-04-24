import React, { useContext } from 'react';
import ReactGA from 'react-ga4';

import { ThemeContext, themes } from './utils/ThemeContext';

const ThemeSwitcher = (): JSX.Element => {
  const { value: theme, toggle: toggleTheme } = useContext(ThemeContext);

  function onInputChange(): void {
    toggleTheme();

    if (window.IS_GA_INIT) {
      ReactGA.event({
        category: 'User',
        action: 'Toggled theme',
        label: theme === themes.LIGHT ? 'Light' : 'Dark',
      });
    }
  }

  return (
    <>
      <input
        type="checkbox"
        id="light-theme"
        checked={theme === themes.LIGHT}
        onChange={onInputChange}
        className="sr-only light-theme-checkbox"
        aria-label={'Toggle between dark and light theme'}
      />
      <label
        htmlFor="light-theme"
        className="z-50 absolute right-0 top-0 block bg-background text-primary p-3 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
        >
          <g fill="none" fillRule="evenodd" stroke="currentColor" strokeWidth="2">
            <circle cx="24" cy="24" r="19" />
            <path
              strokeLinecap="square"
              d="M24 5v37.5M24.5 12H38M24.5 18H41M24 24h19M24 30h17M25 36h13"
            />
          </g>
        </svg>
      </label>
    </>
  );
};

export default ThemeSwitcher;
