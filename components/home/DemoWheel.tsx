'use client';
import React, { useState } from 'react';
import { LuGift } from 'react-icons/lu';
import { DEMO_SLICES, PRIZES } from './constants';
import ScaledWheel from './ScaledWheel';

// Deneme çarkı: form yok, backend'e istek atmaz, gerçek hak tüketmez
const DemoWheel = () => {
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
      id="cark"
      className="bg-ck-red text-white relative overflow-hidden scroll-mt-16"
    >
      <div className="max-w-[1240px] mx-auto px-6 py-[100px] flex flex-wrap items-center gap-16">
        <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-[#FFE2A8]">
            Canlı deneme
          </span>
          <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(36px,4.6vw,60px)] leading-none tracking-[-.03em]">
            Şansını şimdi dene.
          </h2>
          <p className="m-0 text-lg leading-[1.55] text-[#FFE9E3] max-w-[460px]">
            Bu bir deneme çarkı. Gerçek hediyeni kazanmak için bir salon seç ve
            onun çarkını çevir.
          </p>

          <div className="bg-ck-ink rounded-[22px] px-6 py-[22px] flex items-center gap-4 min-h-[92px]">
            <span className="w-12 h-12 rounded-[14px] bg-ck-yellow text-ck-ink flex items-center justify-center shrink-0">
              <LuGift size={24} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1" aria-live="polite">
              <span className="text-[13px] text-ck-muted-dark">
                {spinning
                  ? 'Çark dönüyor'
                  : result
                  ? 'Tebrikler, kazandın!'
                  : 'Ödülün burada görünecek'}
              </span>
              <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-[26px] text-ck-yellow">
                {spinning ? '…' : result || 'Hazır mısın?'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSpin}
              disabled={spinning}
              className="cursor-pointer border-0 bg-ck-yellow text-ck-ink font-bold text-[17px] px-[30px] rounded-full min-h-[52px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {spinning ? 'Dönüyor…' : result ? 'Tekrar Çevir' : 'Çarkı Çevir'}
            </button>
            <a
              href="#salonlar"
              className="text-white no-underline font-bold text-[17px] px-[26px] rounded-full border-[1.5px] border-white/55 min-h-[52px] inline-flex items-center"
            >
              Gerçek çark için salon seç
            </a>
          </div>
        </div>

        <div className="flex-[1_1_380px] min-w-0 flex justify-center">
          <div className="w-full max-w-[440px]">
            <ScaledWheel
              maxSize={440}
              data={DEMO_SLICES}
              winnerTitle={winner}
              autoSpin={false}
              spinKey={spinKey}
              onFinish={handleFinish}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoWheel;
