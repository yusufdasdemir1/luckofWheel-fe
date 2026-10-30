import Link from 'next/link';
import React from 'react';
import { SALON_APPLY_HREF } from './constants';

const LINKS = [
  { href: '#nasil', label: 'Nasıl Çalışır' },
  { href: '#cark', label: 'Çarkı Dene' },
  { href: '#salonlar', label: 'Salonlar' },
  { href: '#kuafor', label: 'Kuaförler İçin' },
];

const HomeNav = () => {
  return (
    <header className="sticky top-0 z-20 bg-ck-ink/90 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-[1240px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-white no-underline"
        >
          <span
            className="block w-[34px] h-[34px] rounded-full border-[3px] border-white"
            style={{
              background:
                'conic-gradient(#E2492F 0 25%, #F2B33D 0 50%, #FFFFFF 0 75%, #F2B33D 0)',
            }}
            aria-hidden="true"
          />
          <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-xl tracking-tight">
            Çevir Kazan <span className="text-ck-yellow">360</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6 text-[15px]">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#E9E4EE] no-underline hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/giris-yap"
            className="text-white no-underline font-medium px-4 rounded-full border border-white/25 min-h-11 inline-flex items-center"
          >
            Giriş Yap
          </Link>
          <Link
            href={SALON_APPLY_HREF}
            className="hidden sm:inline-flex text-ck-ink bg-ck-yellow no-underline font-bold px-[18px] rounded-full min-h-11 items-center"
          >
            Salonunu Ekle
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default HomeNav;
