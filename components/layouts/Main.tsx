import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

import Nav from '../Nav';
import { UiLink } from '../../typings';

type MainLayoutProps = PropsWithChildren<{
  navLinks: UiLink[];
}>;

const MainLayout: React.FC<MainLayoutProps> = ({ children, navLinks }) => (
  <>
    <Nav links={navLinks} />

    <main className="w-full">{children}</main>

    {/* <Footer /> */}
  </>
);

MainLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  navLinks: PropTypes.array.isRequired,
};

export default MainLayout;
