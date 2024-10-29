import React from 'react';
import Header from './header';

const Layout = ({ children }) => (
  <>
    <Header /> {/* Header always displays */}
    <main>{children}</main>
  </>
);

export default Layout;
