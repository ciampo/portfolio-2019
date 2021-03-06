import React, { useEffect, useState } from 'react';
import { NextComponentType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { slugify } from './utils/utils';
import { UiLink } from '../typings';

import navLinksData from '../data/navLinks.json';

const ThemeSwitcher = dynamic(() => import('./ThemeSwitcher'), { ssr: false });

const Nav: NextComponentType = () => {
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

  const navLinks: UiLink[] = navLinksData;

  return (
    <>
      <nav className="fixed contain-layout-paint z-50 top-0 left-0 flex items-stretch">
        {navLinks && navLinks.length && (
          <ul className="bg-background flex py-1 px-2 lg:py-2 lg:px-4">
            {navLinks.map(({ href, label }, index) => (
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

      <ThemeSwitcher />
    </>
  );
};

export default Nav;
