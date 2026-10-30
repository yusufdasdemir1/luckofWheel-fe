import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import React, { ReactNode } from 'react';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`${bricolage.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] bg-ck-cream text-ck-ink min-h-screen`}
    >
      {children}
    </div>
  );
};

export default Layout;
