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
  <nav className="fixed top-0 left-0 w-full h-12 flex items-center bg-gray-200 shadow text-center">
    {links && links.length && (
      <ul className="flex justify-between w-full py-1 px-4">
        {links.map(({ href, label }, index) => (
          <li key={`${index}-${slugify(label)}`} className="flex py-1 px-2">
            <Link href={href}>
              <a className="no-underline text-sm text-primary">{label}</a>
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
    })
  ).isRequired,
};

export default Nav;
