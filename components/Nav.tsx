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
  const [isRouteLoading, setRouteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleRouteChange(): void {
      setRouteLoading(true);
    }

    function handleRouteComplete(): void {
      setRouteLoading(false);
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
                    className={`no-underline text-base md:text-lg lg:text-xl text-primary font-light lowercase opacity-75 border-b border-transparent border-solid focus:opacity-100 focus:border-primary outline-none contain-layout-paint ${router.route ===
                      href && 'border-primary'}`}
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

      {isRouteLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          className="fixed top-0 right-0 block w-4 h-4 lg:w-8 lg:h-8 m-3 lg:m-4 nav-spinner"
        >
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
      )}
    </>
  );
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
Nav.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      selected: PropTypes.bool,
    })
  ).isRequired,
};

export default Nav;
