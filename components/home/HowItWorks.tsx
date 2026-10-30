import React from 'react';
import { LuCalendarCheck, LuCircleDot, LuSearch } from 'react-icons/lu';
import Reveal from './Reveal';

const STEPS = [
  {
    no: '01',
    icon: <LuSearch size={26} aria-hidden="true" />,
    title: 'Salonunu seç',
    text: 'Şehrindeki salonlar arasından tarzına uyanı bul ve sayfasına gir.',
    card: 'bg-white border-[1.5px] border-ck-line',
    iconBox: 'bg-ck-ink text-ck-yellow',
    noColor: 'text-ck-line',
    textColor: 'text-ck-muted',
  },
  {
    no: '02',
    icon: <LuCircleDot size={26} aria-hidden="true" />,
    title: 'Çarkı çevir, kazan',
    text: 'İndirim, ücretsiz fön, bakım hediyesi… Her salon kendi ödüllerini belirler.',
    card: 'bg-ck-ink text-white',
    iconBox: 'bg-ck-yellow text-ck-ink',
    noColor: 'text-ck-ink-line',
    textColor: 'text-[#D6D0DC]',
  },
  {
    no: '03',
    icon: <LuCalendarCheck size={26} aria-hidden="true" />,
    title: 'Randevunu oluştur',
    text: 'Kazandığın hediyeyle tarih ve saat seç, salon randevunu onaylasın.',
    card: 'bg-white border-[1.5px] border-ck-line',
    iconBox: 'bg-ck-wa text-[#08311A]',
    noColor: 'text-ck-line',
    textColor: 'text-ck-muted',
  },
];

const HowItWorks = () => {
  return (
    <section
      id="nasil"
      className="max-w-[1240px] mx-auto px-6 pt-[110px] pb-[90px] scroll-mt-16"
    >
      <Reveal>
        <div className="flex flex-wrap justify-between items-end gap-6 mb-[52px]">
          <div className="flex flex-col gap-3.5 max-w-[640px]">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-red-dark">
              Müşteriler için
            </span>
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(34px,4.2vw,54px)] leading-[1.02] tracking-[-.03em]">
              Üç adımda hediyeli randevu
            </h2>
          </div>
          <p className="m-0 max-w-[400px] text-[17px] leading-[1.55] text-ck-muted">
            Uygulama indirmek yok, üyelik yok. Sadece adını ve telefonunu yaz,
            çevir.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px]">
          {STEPS.map((step) => (
            <div
              key={step.no}
              className={`${step.card} rounded-[28px] p-[30px] flex flex-col gap-[18px]`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`${step.iconBox} w-14 h-14 rounded-[18px] flex items-center justify-center`}
                >
                  {step.icon}
                </span>
                <span
                  className={`${step.noColor} font-[family-name:var(--font-bricolage)] font-extrabold text-[44px]`}
                >
                  {step.no}
                </span>
              </div>
              <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-2xl tracking-[-.02em]">
                {step.title}
              </h3>
              <p className={`m-0 text-base leading-[1.55] ${step.textColor}`}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default HowItWorks;
