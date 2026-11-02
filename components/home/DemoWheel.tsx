'use client';
import React, { CSSProperties, useState } from 'react';
import { DEMO_SLICES, PRIZES } from './constants';
import { GIFT_BURST, GiftBoxIcon } from './GiftBox';
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

  const opened = !!result && !spinning;

  return (
    <section
      id="cark"
      className="bg-ck-brand text-white relative overflow-hidden scroll-mt-16"
    >
      <div className="max-w-[1240px] mx-auto px-6 py-[100px] flex flex-wrap items-center gap-16">
        <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-white">
            Canlı deneme
          </span>
          <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(36px,4.6vw,60px)] leading-none tracking-[-.03em]">
            Şansını şimdi dene.
          </h2>
          <p className="m-0 text-lg leading-[1.55] text-[#F1DDE0] max-w-[460px]">
            Bu bir deneme çarkı. Gerçek hediyeni kazanmak için bir salon seç ve
            onun çarkını çevir.
          </p>

          {/* sonuç kutusu: ödül yukarıdan hediye kutusuna düşer, kutu açılır */}
          <div className="relative bg-ck-night rounded-[22px] px-6 py-[22px] flex items-center gap-4 min-h-[96px]">
            {opened && (
              <span
                key={`drop-${spinKey}`}
                aria-hidden="true"
                className="ck-drop absolute left-[48px] top-1/2 z-20 whitespace-nowrap rounded-full bg-white text-ck-night font-bold text-[13px] px-3 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,.4)]"
              >
                {result}
              </span>
            )}

            <span
              className={`relative w-12 h-12 rounded-full bg-white text-ck-night shadow-[0_6px_16px_rgba(0,0,0,.35)] flex items-center justify-center shrink-0 ${
                spinning ? 'ck-wiggle' : ''
              }`}
            >
              <GiftBoxIcon open={opened} />
              {opened &&
                GIFT_BURST.map((dot) => (
                  <span
                    key={`${spinKey}-${dot.deg}`}
                    aria-hidden="true"
                    className="ck-burst absolute top-1/2 left-1/2 -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full"
                    style={
                      {
                        '--tx': `${dot.tx}px`,
                        '--ty': `${dot.ty}px`,
                        backgroundColor: dot.deg % 90 === 0 ? '#FFFFFF' : '#EE4B58',
                      } as CSSProperties
                    }
                  />
                ))}
            </span>

            <div className="flex flex-col gap-1" aria-live="polite">
              {opened ? (
                <div
                  key={`text-${spinKey}`}
                  className="ck-reveal-text flex flex-col gap-1"
                >
                  <span className="text-[13px] text-ck-muted-dark">
                    Tebrikler, kazandın!
                  </span>
                  <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-[26px] text-ck-coral">
                    {result}
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-[13px] text-ck-muted-dark">
                    {spinning ? 'Çark dönüyor' : 'Ödülün burada görünecek'}
                  </span>
                  <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-[26px] text-ck-coral">
                    {spinning ? '…' : 'Hazır mısın?'}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSpin}
              disabled={spinning}
              className="cursor-pointer border-0 bg-ck-cream text-ck-ink font-bold text-[17px] px-[30px] rounded-full min-h-[52px] disabled:opacity-70 disabled:cursor-not-allowed ck-btn enabled:hover:brightness-105 enabled:hover:shadow-[0_10px_24px_rgba(0,0,0,.25)]"
            >
              {spinning ? 'Dönüyor…' : result ? 'Tekrar Çevir' : 'Çarkı Çevir'}
            </button>
            <a
              href="#salonlar"
              className="text-white no-underline font-bold text-[17px] px-[26px] rounded-full border-[1.5px] border-white/55 min-h-[52px] inline-flex items-center ck-btn hover:bg-white/10 hover:border-white"
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
              idle
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
