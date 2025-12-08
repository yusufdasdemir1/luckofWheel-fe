'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../panel/Button';

const SiteHeader = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-slate-50 h-[80px] flex items-center">
      <div className="container flex items-center flex-1 justify-between">
        <Link href="/">
          <Image
            loader={({ src }) => src}
            src="https://placehold.co/250x60"
            width={250}
            height={60}
            alt="Logo"
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/kayit-ol">
            <Button size="small" color="green" className="px-4">
              Kayıt Ol
            </Button>
          </Link>
          <Link href="/giris-yap">
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
