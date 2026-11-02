import React from 'react';
import { LuCalendarCheck, LuCircleDot, LuSearch } from 'react-icons/lu';
import Reveal from './Reveal';

const STEPS = [
  {
    icon: <LuSearch size={30} aria-hidden="true" />,
    title: 'Salonunu seç',
    text: 'Şehrindeki salonlar arasından tarzına uyanı bul ve sayfasına gir.',
  },
  {
    icon: <LuCircleDot size={30} aria-hidden="true" />,
    title: 'Çarkı çevir, kazan',
    text: 'İndirim, ücretsiz fön, bakım hediyesi… Her salon kendi ödüllerini belirler.',
  },
  {
    icon: <LuCalendarCheck size={30} aria-hidden="true" />,
    title: 'Randevunu oluştur',
    text: 'Kazandığın hediyeyle tarih ve saat seç, salon randevunu onaylasın.',
  },
];

const HowItWorks = () => {
  return (
    <section
      id="nasil"
      className="max-w-[1240px] mx-auto px-6 pt-[110px] pb-[100px] scroll-mt-16"
    >
      <Reveal>
        <div className="flex flex-col items-center text-center gap-4 max-w-[680px] mx-auto mb-16">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            Müşteriler için
          </span>
          <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(34px,4.2vw,54px)] leading-[1.02] tracking-[-.03em]">
            Üç adımda hediyeli randevu
          </h2>
          <p className="m-0 text-[17px] leading-[1.55] text-ck-muted">
            Uygulama indirmek yok, üyelik yok. Sadece adını ve telefonunu yaz,
            çevir.
          </p>
        </div>

        <ol className="list-none m-0 p-0 relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* masaüstü: ikonları birbirine bağlayan yol çizgisi */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute top-[38px] left-[16.66%] right-[16.66%] border-t-2 border-dashed border-ck-input"
          />

          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative flex items-start gap-5 md:flex-col md:items-center md:gap-6 md:text-center"
            >
              {/* mobil: ikonlar arası dikey çizgi */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="md:hidden absolute left-[37px] top-[80px] -bottom-12 border-l-2 border-dashed border-ck-input"
                />
              )}

              <span className="relative z-10 shrink-0 w-[76px] h-[76px] rounded-full bg-ck-brand text-white flex items-center justify-center ring-8 ring-ck-cream shadow-[0_12px_28px_rgba(142,19,48,.28)]">
                {step.icon}
              </span>

              <div className="flex flex-col gap-2 md:max-w-[300px]">
                <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-[25px] tracking-[-.02em]">
                  {step.title}
                </h3>
                <p className="m-0 text-base leading-[1.6] text-ck-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <a
            href="#salonlar"
            className="ck-btn bg-ck-brand text-white no-underline font-bold text-[17px] px-8 rounded-full min-h-[52px] inline-flex items-center hover:bg-ck-brand-dark hover:shadow-[0_10px_24px_rgba(107,14,36,.35)]"
          >
            Hemen bir salon seç
          </a>
        </div>
      </Reveal>
    </section>
  );
};

export default HowItWorks;
