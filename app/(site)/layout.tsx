import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SiteHeader />
      <main className="h-full">{children}</main>
      <SiteFooter />
    </>
  );
};

export default Layout;
