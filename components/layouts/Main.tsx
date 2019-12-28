import React, { PropsWithChildren } from 'react';

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

export default MainLayout;
