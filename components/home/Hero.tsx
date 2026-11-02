'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LuCalendarCheck, LuGift, LuRotateCw } from 'react-icons/lu';
import { imageUrl } from '@/utils/apiUrl';
import {
  HERO_SLICES,
  HERO_VIDEO_FILE,
  HERO_VIDEO_WEBM,
  PRIZES,
  SALON_APPLY_HREF,
} from './constants';
import ScaledWheel from './ScaledWheel';

interface HeroProps {
  salonTitle: string;
  salonSlug: string;
}

const Hero = ({ salonTitle, salonSlug }: HeroProps) => {
  const [videoFailed, setVideoFailed] = useState(false);

  // telefondaki deneme çarkı: backend'e istek atmaz, gerçek hak tüketmez
  const [spinKey, setSpinKey] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    if (spinning) return;
    setWinner(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
    setResult(null);
    setSpinning(true);
    setSpinKey((key) => key + 1);
  };

  const handleFinish = (title: string) => {
    setSpinning(false);
    setResult(title);
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ck-night text-white scroll-mt-20 flex flex-col justify-center min-h-[calc(100svh-8.5rem)]"
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
            <source src={imageUrl(HERO_VIDEO_WEBM)} type="video/webm" />
            <source
              src={imageUrl(HERO_VIDEO_FILE)}
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
          <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        </>
      )}

      <div className="relative w-full max-w-[1240px] mx-auto px-6 pt-16 pb-20 lg:pt-[88px] lg:pb-[110px] flex flex-wrap items-center gap-14">
        <div className="ck-rise flex-[1_1_480px] min-w-0 flex flex-col gap-6">
          <span className="self-start text-[13px] font-bold tracking-[.08em] uppercase text-white border border-white/40 px-3.5 py-[7px] rounded-full">
            Güzellik ve bakım salonları için çark kampanya platformu
          </span>
          <h1 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(42px,6vw,76px)] leading-[.98] tracking-[-.035em]">
            Çarkı çevir,
            <br />
            <span className="text-ck-coral">hediyeni kazan,</span>
            <br />
            randevunu al.
          </h1>
          <p className="m-0 text-[19px] leading-[1.55] text-[#E0D2D3] max-w-[540px]">
            Favori salonunun çarkını çevir, indirim veya ücretsiz hizmet kazan,
            ardından tarih ve saatini seçip randevunu hemen oluştur. Salonlar
            için: her çevirme yeni bir müşteri, her hediye yeni bir randevu.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#cark"
              className="ck-pulse bg-ck-cream text-ck-ink no-underline font-bold text-[17px] px-7 rounded-full min-h-[52px] inline-flex items-center gap-2.5 ck-btn hover:brightness-105"
            >
              Çarkı Şimdi Dene
              <LuRotateCw size={18} aria-hidden="true" />
            </a>
            <Link
              href={SALON_APPLY_HREF}
              className="text-white no-underline font-bold text-[17px] px-[26px] rounded-full border-[1.5px] border-white/35 min-h-[52px] inline-flex items-center ck-btn hover:bg-white/10 hover:border-white"
            >
              Salonuma çark kur
            </Link>
          </div>
        </div>

        <div className="flex-[1_1_380px] min-w-0 relative flex justify-center py-5">
          <div className="ck-float w-[300px] max-w-full rounded-[40px] bg-[#2E0711] p-3 shadow-[0_40px_80px_rgba(0,0,0,.5)] border border-white/10">
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
                  <span className="text-[11px] text-[#7B6A6C] truncate">
                    cevirkazan360.com/{salonSlug}
                  </span>
                </div>
              </div>

              {/* çark yavaşça kendi kendine döner; butona basınca gerçekten çevrilir */}
              <div className="w-full pointer-events-none select-none">
                <ScaledWheel
                  maxSize={230}
                  data={HERO_SLICES}
                  winnerTitle={winner}
                  autoSpin={false}
                  idle
                  spinKey={spinKey}
                  onFinish={handleFinish}
                />
              </div>

              <button
                type="button"
                onClick={handleSpin}
                disabled={spinning}
                className="w-full cursor-pointer border-0 text-center bg-ck-brand text-white font-bold text-sm py-3 rounded-full min-h-11 ck-btn disabled:opacity-70 disabled:cursor-not-allowed enabled:hover:bg-ck-brand-dark enabled:hover:shadow-[0_10px_24px_rgba(107,14,36,.35)]"
              >
                {spinning
                  ? 'Dönüyor…'
                  : result
                    ? 'Tekrar Çevir'
                    : 'Çarkı Çevir'}
              </button>
            </div>
          </div>

          <div className="ck-float2 absolute top-10 left-0 bg-white text-ck-ink rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.35)] flex items-center gap-2.5">
            <span className="w-[34px] h-[34px] rounded-[10px] bg-ck-brand text-white flex items-center justify-center">
              <LuGift size={18} aria-hidden="true" />
            </span>
            <span className="flex flex-col" aria-live="polite">
              <span className="text-[11px] text-[#7B6A6C]">
                {spinning ? 'Çark dönüyor…' : 'Kazandın!'}
              </span>
              <span className="font-bold text-sm">
                {spinning ? '…' : (result ?? 'Ücretsiz Fön')}
              </span>
            </span>
          </div>

          <div className="ck-float absolute bottom-[30px] right-0 bg-ck-brand text-white rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.35)] flex items-center gap-2.5">
            <LuCalendarCheck size={22} aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-[11px]">Randevu oluşturuldu</span>
              <span className="font-bold text-sm">Cumartesi 14:00</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
