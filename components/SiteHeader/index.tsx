'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_LOGO_RATIO, SITE_LOGO_URL } from '@/utils/siteLogo';
import Button from '../panel/Button';

const SiteHeader = () => {
  return (
    <header className="w-full border-b border-white/10 bg-ck-night h-[80px] flex items-center">
      <div className="container flex items-center flex-1 justify-between">
        <Link href="/">
          <Image
            loader={({ src }) => src}
            src={SITE_LOGO_URL}
            width={Math.round(48 * SITE_LOGO_RATIO)}
            height={48}
            alt="Çevir Kazan 360"
          />
        </Link>

        <div className="flex items-center gap-2">
<Link href="/giris-yap" className="">
            <Button size="small" color="white" className="px-4">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
