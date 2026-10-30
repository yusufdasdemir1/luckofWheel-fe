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
    <footer className="bg-ck-ink text-ck-muted-dark pb-16 md:pb-0">
      <div className="max-w-[1240px] mx-auto px-6 pt-14 pb-9 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        <div className="flex flex-col gap-3">
          <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-xl text-white">
            Çevir Kazan <span className="text-ck-yellow">360</span>
          </span>
          <span className="text-sm leading-relaxed">
            Kuaförler için çark kampanyası ve randevu platformu.
          </span>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-white font-bold">Müşteriler</span>
          <a href="#salonlar" className={LINK}>
            Salonlar
          </a>
          <a href="#cark" className={LINK}>
            Çarkı dene
          </a>
          <a href="#nasil" className={LINK}>
            Nasıl çalışır
          </a>
        </div>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-white font-bold">Kuaförler</span>
          <a href="#kuafor" className={LINK}>
            Salonunu ekle
          </a>
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
      <div className="max-w-[1240px] mx-auto px-6 pt-5 pb-8 border-t border-[#2C2731] text-[13px]">
        &copy; {new Date().getFullYear()} cevirkazan360.com · Tüm hakları
        saklıdır.
      </div>
    </footer>
  );
};

export default HomeFooter;
