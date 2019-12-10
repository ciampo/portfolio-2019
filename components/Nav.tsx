import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType } from 'next';

import { slugify } from './utils/utils';
import { UiLink } from '../typings';

type NavProps = {
  links: UiLink[];
};

const Nav: NextComponentType<{}, NavProps, NavProps> = ({ links }) => {
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
      <nav className="fixed contain-layout-paint z-50 top-0 left-0 bg-background">
        {links && links.length && (
          <ul className="py-1 px-2 flex lg:block lg:py-2 lg:px-4">
            {links.map(({ href, label }, index) => (
              <li key={`${index}-${slugify(label)}`} className="flex pt-1 pb-2 px-4">
                <Link href={href} scroll={false}>
                  <a
                    className={`no-underline text-base md:text-lg lg:text-xl text-primary font-light lowercase opacity-75 focus:opacity-100 focus:border-primary outline-none contain-layout-paint nav-link ${
                      router.route === href ? 'nav-link--selected' : ''
                    } ${loadingRoute === href ? 'nav-link--loading' : ''}`}
                  >
                    <span
                      className={`hidden lg:inline ${router.route !== href && 'opacity-0'}`}
                      aria-hidden="true"
                    >
                      &bull;&nbsp;
                    </span>
                    {label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* {isRouteLoading && (
        <div aria-hidden="true" className="nav-spinner fixed z-50 top-0 right-0 bg-background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            className="block w-4 h-4 md:w-8 md:h-8 m-3 md:m-4"
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
      )} */}
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
