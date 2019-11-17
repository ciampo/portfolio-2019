import React from 'react';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
  key: string;
}

const links: NavLink[] = [
  { href: 'https://github.com/zeit/next.js', label: 'GitHub', key: '' },
].map((link) => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav: React.FC<{}> = () => (
  <nav className="fixed top-0 left-0 w-full h-12 flex items-center bg-gray-200 shadow text-center">
    <ul className="flex justify-between w-full py-1 px-4">
      <li className="flex py-1 px-2">
        <Link href="/">
          <a className="no-underline text-sm text-primary">Home</a>
        </Link>
      </li>
      <li className="flex py-1 px-2">
        <Link href="/about">
          <a className="no-underline text-sm text-primary">About</a>
        </Link>
      </li>
      {links.map(({ key, href, label }) => (
        <li key={key} className="flex py-1 px-2">
          <a href={href} className="no-underline text-sm text-primary">
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
