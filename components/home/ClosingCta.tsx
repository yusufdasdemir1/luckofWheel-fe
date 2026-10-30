import Link from 'next/link';
import React from 'react';
import { SALON_APPLY_HREF } from './constants';
import Reveal from './Reveal';

const ClosingCta = () => {
  return (
    <section className="px-6 pb-[90px]">
      <Reveal>
        <div className="max-w-[1240px] mx-auto bg-ck-red text-white rounded-[36px] px-8 py-14 md:px-12 md:py-16 flex flex-wrap items-center justify-between gap-8 box-border">
          <div className="flex flex-col gap-3 max-w-[620px]">
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(30px,3.8vw,48px)] leading-[1.02] tracking-[-.03em]">
              Salonun çarkıyla yayında.
            </h2>
            <p className="m-0 text-[17px] text-[#FFE9E3] leading-[1.55]">
              Bio&apos;na koyacağın tek link, her gün yeni hediyeli randevular.
            </p>
          </div>
          <Link
            href={SALON_APPLY_HREF}
            className="bg-ck-ink text-white no-underline font-bold text-[17px] px-[30px] rounded-full min-h-14 inline-flex items-center"
          >
            Hemen başla
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default ClosingCta;
