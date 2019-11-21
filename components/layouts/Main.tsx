import React from 'react';
import PropTypes from 'prop-types';

import Nav from '../Nav';
// import Footer from '../Footer';
import { UiLink } from '../../typings';

type MainLayoutProps = {
  navLinks: UiLink[];
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, navLinks }) => (
  <>
    <Nav links={navLinks} />

    <main className="w-full">{children}</main>

    {/* <Footer /> */}
  </>
);

/* eslint-disable @typescript-eslint/ban-ts-ignore */
MainLayout.propTypes = {
  // @ts-ignore
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  navLinks: PropTypes.array.isRequired,
};

export default MainLayout;
