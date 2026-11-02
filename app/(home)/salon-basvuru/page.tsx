import HomeFooter from '@/components/home/HomeFooter';
import HomeNav from '@/components/home/HomeNav';
import Reveal from '@/components/home/Reveal';
import SalonApplyForm from '@/components/home/SalonApplyForm';
import React from 'react';
import {
  LuCalendarCheck,
  LuChartLine,
  LuGift,
  LuInstagram,
  LuScissors,
  LuUserPlus,
} from 'react-icons/lu';

export const generateMetadata = () => {
  return {
    title: 'Salonunu Ekle — Çevir Kazan 360',
    description:
      'Salonunu Çevir Kazan 360’a ekle: kendi çarkın, ödüllerin ve randevu sayfan hazır olsun. Başvuru formunu doldur, sana dönüş yapıp detayları ve fiyatı birlikte konuşalım.',
    alternates: { canonical: '/salon-basvuru' },
  };
};

const STEPS = [
  {
    no: '01',
    title: 'Formu doldur',
    text: 'Salon adını, yetkili bilgilerini ve şehrini yaz.',
  },
  {
    no: '02',
    title: 'Bize ulaşsın',
    text: 'Başvurun doğrudan ekibimize iletilir, sana en kısa sürede dönüş yaparız.',
  },
  {
    no: '03',
    title: 'Görüşüp kuralım',
    text: 'Sana dönüş yapıp ihtiyacına göre fiyatı (aylık abonelik) birlikte belirleriz, ardından salon sayfanı, çarkını ve ödüllerini hazırlarız.',
  },
];

const BENEFITS = [
  {
    icon: LuGift,
    title: 'Kendi çarkın',
    text: 'Ödülleri ve kazanma oranlarını panelden sen belirlersin.',
  },
  {
    icon: LuCalendarCheck,
    title: 'Randevular panelinde',
    text: 'Müşteri çarkı çevirir, tarih ve saat seçer; randevular panelinde listelenir.',
  },
  {
    icon: LuUserPlus,
    title: 'Müşteri listesi',
    text: 'Her çevirme ad, telefon ve e-postayla kayıt olur.',
  },
  {
    icon: LuInstagram,
    title: 'Instagram bio linki',
    text: 'Tek link: sayfan, çarkın, iletişim ve konumun bir arada.',
  },
  {
    icon: LuChartLine,
    title: 'Takip',
    text: 'Randevuları ve kazanılan hediyeleri panelden takip edersin.',
  },
  {
    icon: LuScissors,
    title: 'Hizmetlerini ve fiyatlarını yönet',
    text: 'Hizmetlerini ekle; süre ve fiyatlarını istediğin zaman panelden güncelle.',
  },
];

const Page = () => {
  return (
    <>
      <HomeNav />
      <main className="overflow-x-clip">
        <section className="relative overflow-hidden bg-ck-night text-white">
          <span
            aria-hidden="true"
            className="ck-glow pointer-events-none absolute -top-24 right-[-8%] w-[460px] h-[460px] rounded-full bg-ck-coral/25 blur-3xl"
          />
          <div className="relative max-w-[1240px] mx-auto px-6 pt-16 pb-20 lg:pt-20 lg:pb-24">
            <span className="ck-rise inline-block text-[13px] font-bold tracking-[.08em] uppercase text-ck-coral">
              Salonlar için
            </span>
            <h1
              className="ck-rise mt-4 mb-0 max-w-[820px] font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(38px,5.4vw,66px)] leading-[1] tracking-[-.035em]"
              style={{ animationDelay: '120ms' }}
            >
              Salonunu <span className="text-ck-coral">çarkla</span> tanıştır.
            </h1>
            <p
              className="ck-rise mt-5 mb-0 max-w-[620px] text-[19px] leading-[1.55] text-[#E0D2D3]"
              style={{ animationDelay: '240ms' }}
            >
              Müşterilerin çarkı çevirsin, hediye kazansın, randevusunu
              oluştursun. Başvurmak için formu doldur, sana dönüş yapıp
              detayları ve fiyatı birlikte konuşalım.
            </p>
          </div>
        </section>

        <section className="max-w-[1240px] mx-auto px-6 py-[80px] flex flex-wrap items-start gap-12 lg:gap-16">
          <div className="flex-[1_1_460px] min-w-0 flex flex-col gap-12">
            <div className="flex flex-col gap-5">
              <Reveal>
                <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]">
                  Nasıl işliyor?
                </h2>
              </Reveal>
              <ol className="list-none m-0 p-0 flex flex-col gap-4">
                {STEPS.map((step, i) => (
                  <li key={step.no}>
                    <Reveal
                      direction="left"
                      delay={i * 130}
                      className="group flex gap-4 bg-ck-surface border-[1.5px] border-ck-line rounded-3xl p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(86,14,34,.12)]"
                    >
                      <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-[34px] leading-none text-ck-coral transition-transform duration-300 group-hover:scale-110">
                        {step.no}
                      </span>
                      <div className="flex flex-col gap-1">
                        <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-xl">
                          {step.title}
                        </h3>
                        <p className="m-0 text-[15px] leading-normal text-ck-muted">
                          {step.text}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-5">
              <Reveal>
                <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]">
                  Neler kazanırsın?
                </h2>
              </Reveal>
              <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFITS.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="flex">
                    <Reveal
                      direction="scale"
                      delay={(i % 2) * 120 + Math.floor(i / 2) * 110}
                      className="group w-full bg-ck-night text-white rounded-3xl p-5 flex flex-col gap-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(86,14,34,.35)]"
                    >
                      <span className="w-11 h-11 rounded-full bg-white/10 border border-white/25 text-white/90 backdrop-blur-sm flex items-center justify-center transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/20 group-hover:border-white/50">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-lg">
                        {title}
                      </h3>
                      <p className="m-0 text-[15px] leading-normal text-white">
                        {text}
                      </p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-[1_1_420px] min-w-0 lg:sticky lg:top-24">
            <Reveal direction="right" delay={150}>
              <SalonApplyForm />
            </Reveal>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
};

export default Page;
