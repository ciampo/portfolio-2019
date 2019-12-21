import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType } from 'next';

import { slugify } from './utils/utils';
import { ThemeContext, themes } from './utils/ThemeContext';
import { UiLink } from '../typings';

type NavProps = {
  links: UiLink[];
};

const Nav: NextComponentType<{}, NavProps, NavProps> = ({ links }) => {
  const { value: theme, toggle: toggleTheme } = useContext(ThemeContext);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleRouteChange(url: string): void {
      setLoadingRoute(url);
    }

    function handleRouteComplete(): void {
      setLoadingRoute(null);
    }

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);

    return (): void => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router.events]);

  return (
    <>
      <nav className="fixed contain-layout-paint z-50 top-0 left-0 flex items-stretch">
        {links && links.length && (
          <ul className="bg-background flex py-1 px-2 lg:py-2 lg:px-4">
            {links.map(({ href, label }, index) => (
              <li key={`${index}-${slugify(label)}`} className="flex pt-1 pb-2 px-2 md:px-4">
                <Link href={href} scroll={false}>
                  <a
                    className={`no-underline text-base md:text-lg lg:text-xl text-primary font-light lowercase opacity-75 focus:opacity-100 focus:border-primary outline-none contain-layout-paint nav-link ${
                      router.route === href ? 'nav-link--selected' : ''
                    }`}
                  >
                    {label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div
          aria-hidden="true"
          className={`bg-background pointer-events-none flex items-center p-2 lg:p-4 nav-spinner ${
            loadingRoute !== null ? 'nav-spinner--animated' : ''
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            className="block w-5 h-5 lg:w-6 lg:h-6"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
          </svg>
        </div>
      </nav>

      {/* Theme switcher */}
      <input
        type="checkbox"
        id="light-theme"
        checked={theme === themes.LIGHT}
        onChange={toggleTheme}
        className="sr-only light-theme-checkbox"
      />
      <label
        htmlFor="light-theme"
        className="z-50 fixed right-0 top-0 block bg-background text-primary p-3 cursor-pointer"
      >
        <span className="sr-only">Toggle between dark and light theme</span>
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

Nav.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      selected: PropTypes.bool,
    }).isRequired
  ).isRequired,
};

export default Nav;
