import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NextComponentType } from 'next';

import { slugify } from './utils/utils';
import { UiLink } from '../typings';

type NavProps = {
  links: UiLink[];
};

const Nav: NextComponentType<{}, NavProps, NavProps> = ({ links }) => (
  <nav className="fixed z-50 top-0 left-0 bg-background">
    {links && links.length && (
      <ul className="w-full py-1 px-2 flex lg:block lg:py-2 lg:px-4">
        {links.map(({ href, label, selected }, index) => (
          <li key={`${index}-${slugify(label)}`} className="flex pt-1 pb-2 px-4">
            <Link href={href} scroll={false}>
              <a
                className={`no-underline text-base md:text-lg lg:text-xl text-primary font-light lowercase opacity-75 border-b border-transparent border-solid focus:opacity-100 focus:border-primary outline-none contain-layout-paint ${selected &&
                  'border-primary'}`}
              >
                <span className={`hidden lg:inline ${!selected && 'opacity-0'}`} aria-hidden="true">
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
);

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
