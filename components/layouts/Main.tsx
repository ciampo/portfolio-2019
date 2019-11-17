import React from 'react';
import PropTypes from 'prop-types';

import Nav from '../Nav';
import Footer from '../Footer';

const MainLayout: React.FC<{}> = ({ children }) => (
  <>
    <Nav />

    <main className="w-full min-h-screen pt-16 pb-12">{children}</main>

    <Footer />
  </>
);

MainLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default MainLayout;
