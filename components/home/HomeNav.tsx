import { SITE_LOGO_DARK_RATIO, SITE_LOGO_DARK_URL } from '@/utils/siteLogo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SALON_APPLY_HREF } from './constants';

const LINKS = [
  { href: '/#nasil', label: 'Nasıl Çalışır' },
  { href: '/#cark', label: 'Çarkı Dene' },
  { href: '/#salonlar', label: 'Salonlar' },
  { href: '/#kuafor', label: 'Kuaförler İçin' },
];

const HomeNav = () => {
  return (
    <header className="sticky top-0 z-20 bg-ck-night/90 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-[1240px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white no-underline"
        >
          <Image
            src={SITE_LOGO_DARK_URL}
            width={Math.round(44 * SITE_LOGO_DARK_RATIO)}
            height={44}
            alt="Çevir Kazan 360"
            unoptimized
            className="block h-9 sm:h-11 w-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-[15px]">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#EADFDF] no-underline hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/giris-yap"
            className="text-white no-underline font-medium px-4 rounded-full border border-white/25 min-h-11 inline-flex items-center whitespace-nowrap ck-btn hover:bg-white/10 hover:border-white"
          >
            Giriş Yap
          </Link>
          <Link
            href={SALON_APPLY_HREF}
            className="hidden sm:inline-flex text-ck-ink bg-ck-cream no-underline font-bold px-[18px] rounded-full min-h-11 items-center ck-btn hover:brightness-105 hover:shadow-[0_10px_24px_rgba(0,0,0,.25)]"
          >
            Salonunu Ekle
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default HomeNav;
