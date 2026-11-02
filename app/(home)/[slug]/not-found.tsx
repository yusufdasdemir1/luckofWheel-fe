import HomeFooter from '@/components/home/HomeFooter';
import HomeNav from '@/components/home/HomeNav';
import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  return (
    <>
      <HomeNav />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-[520px] text-center flex flex-col items-center gap-5">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            404
          </span>
          <h1 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(36px,5vw,56px)] leading-[1] tracking-[-.035em]">
            Sayfa bulunamadı
          </h1>
          <p className="m-0 text-lg leading-[1.6] text-ck-muted">
            Aradığın salon yayından kaldırılmış ya da adres yanlış yazılmış
            olabilir.
          </p>
          <Link
            href="/#salonlar"
            className="ck-btn bg-ck-brand text-white no-underline font-bold text-[17px] px-8 rounded-full min-h-[52px] inline-flex items-center hover:bg-ck-brand-dark hover:shadow-[0_10px_24px_rgba(107,14,36,.35)]"
          >
            Salonlara göz at
          </Link>
        </div>
      </main>
      <HomeFooter />
    </>
  );
};

export default NotFoundPage;
