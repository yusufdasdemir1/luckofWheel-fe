'use client';
import ScaledWheel from '@/components/home/ScaledWheel';
import IGift from '@/types/IGift';
import React from 'react';
import { LuArrowRight, LuRotateCw } from 'react-icons/lu';

interface StepWheelProps {
  gifts: IGift[];
  /** hakkı varsa çevirme butonu çıkar, yoksa kalan süre yazar */
  canSpin: boolean;
  remainingSeconds: number;
  /** backend çevirdikten sonra gelen hediye; spinKey artınca çark bu hediyede durur */
  winner: string | null;
  spinKey: number;
  loading: boolean;
  /** hakkı olmayan ya da çevirmek istemeyen müşterinin devam butonu */
  continueLabel: string;
  onSpin: () => void;
  onContinue: () => void;
  onFinish: () => void;
}

// 93600 sn -> "1 gün 2 saat", 4500 sn -> "1 saat 15 dakika"
export const formatRemaining = (seconds: number) => {
  const totalMinutes = Math.max(1, Math.ceil(seconds / 60));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days} gün`);
  if (hours) parts.push(`${hours} saat`);
  if (minutes && !days) parts.push(`${minutes} dakika`);
  return parts.join(' ');
};

// Çark hep ekranda durur; hak varsa buton, yoksa kalan süre gösterilir
const StepWheel = ({
  gifts,
  canSpin,
  remainingSeconds,
  winner,
  spinKey,
  loading,
  continueLabel,
  onSpin,
  onContinue,
  onFinish,
}: StepWheelProps) => {
  const spinning = !!winner;

  return (
    <div className="ck-enter-scale relative overflow-hidden rounded-3xl bg-ck-night text-white px-5 py-10 md:py-14 flex flex-col items-center gap-8">
      <span
        aria-hidden="true"
        className="ck-glow pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] max-w-full rounded-full bg-ck-coral/25 blur-3xl"
      />

      <div className="relative text-center flex flex-col gap-2" aria-live="polite">
        <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-coral">
          {spinning ? 'Şansını deniyoruz' : 'Şansını dene'}
        </span>
        <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(30px,4vw,46px)] leading-none tracking-[-.03em]">
          {spinning ? 'Çark dönüyor…' : 'Çarkı çevir'}
        </h2>
      </div>

      <div className="relative w-full max-w-[420px]">
        <ScaledWheel
          maxSize={420}
          data={gifts}
          winnerTitle={winner}
          spinKey={spinKey}
          autoSpin={false}
          idle={!spinning}
          onFinish={onFinish}
        />
      </div>

      {!spinning && (
        <div className="relative flex flex-col items-center gap-3 text-center">
          {canSpin ? (
            <>
              <button
                type="button"
                onClick={onSpin}
                disabled={loading}
                className="ck-btn cursor-pointer border-0 bg-ck-coral text-white font-bold text-[17px] px-7 rounded-full min-h-[54px] inline-flex items-center justify-center gap-2.5 enabled:hover:brightness-110 enabled:hover:shadow-[0_10px_24px_rgba(0,0,0,.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <LuRotateCw
                  size={20}
                  className={loading ? 'animate-spin' : ''}
                  aria-hidden="true"
                />
                {loading ? 'Hazırlanıyor…' : 'Çarkı Çevir'}
              </button>
              <button
                type="button"
                onClick={onContinue}
                disabled={loading}
                className="cursor-pointer border-0 bg-transparent text-sm font-bold text-[#E0D2D3] underline underline-offset-4 hover:text-white disabled:opacity-60"
              >
                Şimdi değil, devam et
              </button>
            </>
          ) : (
            <>
              <p
                role="status"
                className="m-0 max-w-[380px] text-base leading-[1.6] text-[#E0D2D3]"
              >
                Çevirme hakkın şu an yok.{' '}
                <strong className="text-white">
                  {formatRemaining(remainingSeconds)}
                </strong>{' '}
                süre sonra çevirebilirsiniz.
              </p>
              <button
                type="button"
                onClick={onContinue}
                className="ck-btn cursor-pointer border-0 bg-white text-ck-night font-bold text-[15px] px-6 rounded-full min-h-12 inline-flex items-center gap-2 hover:bg-ck-cream hover:shadow-[0_10px_24px_rgba(0,0,0,.3)]"
              >
                {continueLabel}
                <LuArrowRight size={18} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StepWheel;
