import { SITE_LOGO_DARK_RATIO, SITE_LOGO_DARK_URL } from '@/utils/siteLogo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const LINK = 'text-ck-muted-dark no-underline hover:text-white';

// KVKK / gizlilik / kampanya koşulları sayfaları henüz yok: bağlantı olmadan listelenir
const LEGAL = [
  'KVKK aydınlatma metni',
  'Gizlilik politikası',
  'Kampanya koşulları',
];

const HomeFooter = () => {
  return (
    <footer className="bg-ck-night text-ck-muted-dark pb-16 md:pb-0">
      <div className="max-w-[1240px] mx-auto px-6 pt-14 pb-9 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        <div className="flex flex-col gap-3">
          <Image
            src={SITE_LOGO_DARK_URL}
            width={Math.round(52 * SITE_LOGO_DARK_RATIO)}
            height={52}
            alt="Çevir Kazan 360"
            unoptimized
            className="block self-start h-[52px] w-auto"
          />
          <span className="text-sm leading-relaxed">
            Güzellik ve bakım salonları için çark kampanyası ve randevu platformu.
          </span>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-white font-bold">Müşteriler</span>
          <Link href="/#salonlar" className={LINK}>
            Salonlar
          </Link>
          <Link href="/#cark" className={LINK}>
            Çarkı dene
          </Link>
          <Link href="/#nasil" className={LINK}>
            Nasıl çalışır
          </Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-white font-bold">Kuaförler</span>
          <Link href="/salon-basvuru" className={LINK}>
            Salonunu ekle
          </Link>
          <Link href="/giris-yap" className={LINK}>
            Salon girişi
          </Link>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-white font-bold">Yasal</span>
          {LEGAL.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto px-6 pt-5 pb-8 border-t border-[#7C2338] text-[13px]">
        &copy; {new Date().getFullYear()} cevirkazan360.com · Tüm hakları
        saklıdır.
      </div>
    </footer>
  );
};

export default HomeFooter;
