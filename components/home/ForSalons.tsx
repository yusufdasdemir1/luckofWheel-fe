import Link from 'next/link';
import React from 'react';
import {
  LuChartLine,
  LuCircleDot,
  LuInstagram,
  LuMessageCircle,
  LuShieldCheck,
  LuUserPlus,
} from 'react-icons/lu';
import { SALON_APPLY_HREF } from './constants';
import Reveal from './Reveal';

const FEATURES = [
  {
    icon: LuCircleDot,
    title: 'Kendi ödüllerini belirle',
    text: 'Dilimleri, ödülleri ve kazanma oranlarını panelden ayarla.',
  },
  {
    icon: LuUserPlus,
    title: 'Müşteri listesi oluşur',
    text: 'Her çevirme ad, telefon ve e-postayla kayıt olur; kampanyalar için hazır liste.',
  },
  {
    icon: LuMessageCircle,
    title: "WhatsApp'a direkt randevu",
    text: 'Sayfandaki WhatsApp butonuyla müşterin tek dokunuşla sana yazar.',
  },
  {
    icon: LuChartLine,
    title: 'Ne işe yaradığını gör',
    text: 'Panelden randevuları ve müşterilerin kazandığı hediyeleri takip et.',
  },
  {
    icon: LuInstagram,
    title: 'Instagram bio linki',
    text: 'Tek link: sayfan, çarkın, iletişim ve konumun bir arada.',
  },
  {
    icon: LuShieldCheck,
    title: 'Çevirme sıklığını sen belirle',
    text: 'Telefon numarasıyla eşleşen çevirme hakkı; bekleme süresini firma ayarlarından seçersin.',
  },
];

const ForSalons = () => {
  return (
    <section id="kuafor" className="bg-ck-ink text-white scroll-mt-16">
      <div className="max-w-[1240px] mx-auto px-6 py-[110px]">
        <Reveal className="flex flex-wrap gap-14 items-start">
          <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-5 lg:sticky lg:top-24">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-yellow">
              Kuaförler için
            </span>
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(34px,4.2vw,54px)] leading-[1.02] tracking-[-.03em]">
              Instagram takipçini randevuya çevir.
            </h2>
            <p className="m-0 text-lg leading-[1.55] text-[#D6D0DC]">
              Salonuna özel sayfan ve çarkın hazır. Linki bio&apos;na koy;
              müşterin çevirir, kazanır, randevusunu oluşturur.
            </p>
            <div className="bg-ck-ink-soft border border-ck-ink-line rounded-2xl px-[18px] py-3.5 font-mono text-[15px] text-ck-yellow break-all">
              cevirkazan360.com/<span className="text-white">salon-adin</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-1.5">
              <Link
                href={SALON_APPLY_HREF}
                className="bg-ck-yellow text-ck-ink no-underline font-bold text-[17px] px-7 rounded-full min-h-[52px] inline-flex items-center"
              >
                Salonunu ücretsiz aç
              </Link>
            </div>
          </div>

          <div className="flex-[1_1_520px] min-w-0 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-ck-ink-soft border border-ck-ink-line rounded-3xl p-[26px] flex flex-col gap-3"
              >
                <Icon size={30} className="text-ck-yellow" aria-hidden="true" />
                <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-xl">
                  {title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.55] text-ck-muted-dark">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ForSalons;
