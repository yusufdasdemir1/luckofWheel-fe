import Link from 'next/link';
import React from 'react';
import { LuCalendarCheck, LuCheck, LuClock, LuPhone, LuScissors, LuUser } from 'react-icons/lu';
import { dayLabel } from './time';

export interface BookingSummary {
  date: string;
  time: string;
  service: string;
  staff: string;
  price?: string;
  gift: string | null;
}

interface StepSuccessProps {
  summary: BookingSummary;
  phone: string;
  salonTitle: string;
}

const Row = ({
  Icon,
  label,
  value,
}: {
  Icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <li className="flex items-center gap-3">
    <span className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white/90 flex items-center justify-center shrink-0">
      <Icon size={18} aria-hidden="true" />
    </span>
    <span className="flex flex-col">
      <span className="text-xs text-ck-muted-dark">{label}</span>
      <span className="font-bold text-base">{value}</span>
    </span>
  </li>
);

const StepSuccess = ({ summary, phone, salonTitle }: StepSuccessProps) => {
  const day = dayLabel(summary.date);

  return (
    <div className="ck-enter-scale relative overflow-hidden rounded-3xl bg-ck-night text-white px-6 py-12 md:py-14 flex flex-col items-center text-center gap-6">
      <span
        aria-hidden="true"
        className="ck-glow pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] max-w-full rounded-full bg-ck-coral/25 blur-3xl"
      />

      <span className="relative w-20 h-20 rounded-full bg-white text-ck-brand flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,.4)] ck-enter-scale">
        <LuCheck size={40} strokeWidth={3} aria-hidden="true" />
      </span>

      <div className="relative flex flex-col gap-2" aria-live="polite">
        <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(32px,4.4vw,52px)] leading-none tracking-[-.03em]">
          Randevun <span className="text-ck-coral">oluşturuldu!</span>
        </h2>
        <p className="m-0 text-base text-[#E0D2D3]">
          {salonTitle} seni bekliyor. Teşekkür ederiz!
        </p>
      </div>

      <ul className="relative list-none m-0 p-5 md:p-6 w-full max-w-[460px] rounded-3xl bg-white/5 border border-white/15 flex flex-col gap-4 text-left">
        <Row Icon={LuCalendarCheck} label="Tarih" value={day} />
        <Row Icon={LuClock} label="Saat" value={summary.time} />
        <Row Icon={LuScissors} label="Hizmet" value={summary.service} />
        <Row Icon={LuUser} label="Kuaför" value={summary.staff} />
      </ul>

      {summary.gift && (
        <p className="relative m-0 text-sm text-[#E0D2D3] max-w-[420px]">
          Kazandığın <strong className="text-white">{summary.gift}</strong>{' '}
          hediyesini randevunda salona göstermeyi unutma.
        </p>
      )}

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <a
          href={`tel:${phone}`}
          className="ck-btn bg-white text-ck-night no-underline font-bold text-[15px] px-6 rounded-full min-h-12 inline-flex items-center gap-2 hover:bg-ck-cream hover:shadow-[0_10px_24px_rgba(0,0,0,.3)]"
        >
          <LuPhone size={18} aria-hidden="true" />
          Salonu ara
        </a>
        <Link
          href="/"
          className="ck-btn text-white no-underline font-bold text-[15px] px-6 rounded-full border-[1.5px] border-white/35 min-h-12 inline-flex items-center hover:bg-white/10 hover:border-white"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
};

export default StepSuccess;
