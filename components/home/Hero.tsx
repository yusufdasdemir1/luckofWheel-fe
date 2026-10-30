'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LuCheck, LuGift, LuMessageCircle, LuRotateCw } from 'react-icons/lu';
import { HERO_SLICES, HERO_VIDEO_SRC, SALON_APPLY_HREF } from './constants';
import ScaledWheel from './ScaledWheel';

interface HeroProps {
  salonTitle: string;
  salonSlug: string;
}

const TRUST = [
  'Üyelik gerekmez',
  'Her salonda bir çevirme hakkı',
  'WhatsApp ile anında randevu',
];

const Hero = ({ salonTitle, salonSlug }: HeroProps) => {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ck-ink text-white scroll-mt-20"
    >
      {!videoFailed && (
        <>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          >
            <source
              src={HERO_VIDEO_SRC}
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        </>
      )}

      <div className="relative max-w-[1240px] mx-auto px-6 pt-16 pb-20 lg:pt-[88px] lg:pb-[110px] flex flex-wrap items-center gap-14">
        <div className="ck-rise flex-[1_1_480px] min-w-0 flex flex-col gap-6">
          <span className="self-start text-[13px] font-bold tracking-[.08em] uppercase text-ck-yellow border border-ck-yellow/40 px-3.5 py-[7px] rounded-full">
            Kuaförler için çark kampanya platformu
          </span>
          <h1 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(42px,6vw,76px)] leading-[.98] tracking-[-.035em]">
            Çarkı çevir,
            <br />
            <span className="text-ck-yellow">hediyeni kazan,</span>
            <br />
            randevunu al.
          </h1>
          <p className="m-0 text-[19px] leading-[1.55] text-[#D6D0DC] max-w-[540px]">
            Favori salonunun çarkını çevir, indirim veya ücretsiz hizmet kazan,
            tek dokunuşla WhatsApp&apos;tan randevunu oluştur. Kuaförler için:
            her çevirme yeni bir müşteri, her hediye yeni bir randevu.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#cark"
              className="ck-pulse bg-ck-yellow text-ck-ink no-underline font-bold text-[17px] px-7 rounded-full min-h-[52px] inline-flex items-center gap-2.5"
            >
              Çarkı Şimdi Dene
              <LuRotateCw size={18} aria-hidden="true" />
            </a>
            <Link
              href={SALON_APPLY_HREF}
              className="text-white no-underline font-bold text-[17px] px-[26px] rounded-full border-[1.5px] border-white/35 min-h-[52px] inline-flex items-center"
            >
              Salonuma çark kur
            </Link>
          </div>
          <ul className="list-none m-0 p-0 pt-1.5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-ck-muted-dark">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <LuCheck
                  size={18}
                  className="text-ck-yellow"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-[1_1_380px] min-w-0 relative flex justify-center py-5">
          <div className="ck-float w-[300px] max-w-full rounded-[40px] bg-[#0B0A0D] p-3 shadow-[0_40px_80px_rgba(0,0,0,.5)] border border-white/10">
            <div className="rounded-[30px] bg-ck-cream text-ck-ink px-[18px] pt-[22px] pb-6 flex flex-col items-center gap-3.5">
              <div className="w-full flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-full shrink-0"
                  style={{
                    background:
                      'repeating-linear-gradient(45deg, #E7DFD4 0 6px, #DCD2C5 6px 12px)',
                  }}
                  aria-hidden="true"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[13px] truncate">
                    {salonTitle}
                  </span>
                  <span className="text-[11px] text-[#5E5765] truncate">
                    cevirkazan360.com/{salonSlug}
                  </span>
                </div>
              </div>

              {/* vitrin çarkı: kendi kendine döner, tıklanamaz */}
              <div
                className="w-full pointer-events-none select-none"
                aria-hidden="true"
              >
                <ScaledWheel
                  maxSize={230}
                  data={HERO_SLICES}
                  autoSpin={false}
                  idle
                  muted
                />
              </div>

              <span className="w-full text-center bg-ck-red text-white font-bold text-sm py-3 rounded-full">
                Çarkı Çevir
              </span>
            </div>
          </div>

          <div className="ck-float2 absolute top-10 left-0 bg-white text-ck-ink rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.35)] flex items-center gap-2.5">
            <span className="w-[34px] h-[34px] rounded-[10px] bg-ck-yellow flex items-center justify-center">
              <LuGift size={18} aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="text-[11px] text-[#5E5765]">Kazandın!</span>
              <span className="font-bold text-sm">Ücretsiz Fön</span>
            </span>
          </div>

          <div className="ck-float absolute bottom-[30px] right-0 bg-ck-wa text-[#08311A] rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.35)] flex items-center gap-2.5">
            <LuMessageCircle size={22} aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-[11px]">Randevu talebi</span>
              <span className="font-bold text-sm">Cumartesi 14:00</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
