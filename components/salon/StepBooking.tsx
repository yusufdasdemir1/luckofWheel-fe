'use client';
import { GIFT_BURST, GiftBoxIcon } from '@/components/home/GiftBox';
import IService from '@/types/IService';
import { IStaffPublic } from '@/types/IStaff';
import IWorkingHour from '@/types/IWorkingHour';
import { imageUrl } from '@/utils/apiUrl';
import Image from 'next/image';
import React, { CSSProperties } from 'react';
import {
  LuCalendarDays,
  LuCheck,
  LuClock,
  LuScissors,
  LuUser,
} from 'react-icons/lu';
import {
  BusySlot,
  buildSlots,
  dayDate,
  dayLabel,
  isBusy,
  isClosedDay,
  isPast,
  nowTR,
} from './time';

interface StepBookingProps {
  earnedGift: string | null;
  earnedGiftMessage: string | null;
  services: IService[];
  days: string[];
  date: string;
  time: string | null;
  service: string;
  staffList: IStaffPublic[];
  staffId: number | null;
  hours: IWorkingHour[];
  duration: number;
  busyLoading: boolean;
  busySlots: BusySlot[];
  loading: boolean;
  onPickDate: (date: string) => void;
  onPickTime: (time: string) => void;
  onPickService: (title: string) => void;
  onPickStaff: (id: number) => void;
  onSubmit: () => void;
}

const SectionTitle = ({
  Icon,
  children,
}: {
  Icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <h3 className="m-0 flex items-center gap-2.5 font-[family-name:var(--font-bricolage)] font-extrabold text-xl tracking-[-.02em]">
    <span className="w-9 h-9 rounded-full bg-ck-night text-white flex items-center justify-center">
      <Icon size={18} aria-hidden="true" />
    </span>
    {children}
  </h3>
);

const StepBooking = ({
  earnedGift,
  earnedGiftMessage,
  services,
  days,
  date,
  time,
  service,
  staffList,
  staffId,
  hours,
  duration,
  busyLoading,
  busySlots,
  loading,
  onPickDate,
  onPickTime,
  onPickService,
  onPickStaff,
  onSubmit,
}: StepBookingProps) => {
  const today = nowTR().toISODate();
  const tomorrow = nowTR().plus({ days: 1 }).toISODate();
  const hasStaff = staffList.length > 0;
  const pickedStaff = staffList.find((st) => st.id === staffId);
  const staffName = pickedStaff ? `${pickedStaff.name} ${pickedStaff.surname}`.trim() : '';
  const needStaff = hasStaff && !staffId;
  const closedToday = isClosedDay(date, hours);
  const slots = buildSlots(date, hours, duration);
  const ready = !!(time && date && service && (!hasStaff || staffId));

  return (
    <div className="flex flex-col gap-6 min-w-0">
      {/* kazanılan hediye */}
      {earnedGift && (
        <div className="ck-enter-scale relative overflow-hidden rounded-3xl bg-ck-night text-white p-6 md:p-8 flex flex-wrap items-center gap-5">
          <span
            aria-hidden="true"
            className="ck-glow pointer-events-none absolute -top-20 -right-10 w-[300px] h-[300px] rounded-full bg-ck-coral/25 blur-3xl"
          />
          <span className="relative w-16 h-16 rounded-full bg-white text-ck-night flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(0,0,0,.35)]">
            <GiftBoxIcon open size={32} />
            {GIFT_BURST.map((dot) => (
              <span
                key={dot.deg}
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
          <div className="relative flex-1 min-w-[220px] flex flex-col gap-1">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-coral">
              Tebrikler!
            </span>
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(26px,3.4vw,38px)] leading-[1.05] tracking-[-.03em]">
              {earnedGift} kazandın
            </h2>
            {earnedGiftMessage && (
              <p className="m-0 text-base text-[#E0D2D3]">{earnedGiftMessage}</p>
            )}
          </div>
          <p className="relative m-0 text-sm text-[#E0D2D3] max-w-[260px]">
            Hediyeni kullanmak için aşağıdan randevunu oluştur ve salona göster.
          </p>
        </div>
      )}

      <div className="grid gap-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* hizmet + kuaför */}
        <div className="flex flex-col gap-8 min-w-0">
          <div
            className="ck-enter-up flex flex-col gap-4 min-w-0"
            style={{ animationDelay: '100ms' }}
          >
            <SectionTitle Icon={LuScissors}>Hizmet seç</SectionTitle>
            {services.length === 0 ? (
              <p className="m-0 text-ck-muted">
                Bu salon henüz hizmet eklememiş.
              </p>
            ) : (
              <div
                role="radiogroup"
                aria-label="Hizmet"
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
              >
                {services.map((s) => {
                  const selected = s.title === service;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onPickService(s.title)}
                      className={`ck-btn text-left cursor-pointer rounded-2xl border-[1.5px] p-4 flex flex-col gap-1.5 ${
                        selected
                          ? 'border-ck-brand bg-ck-brand/5 shadow-[0_8px_20px_rgba(142,19,48,.12)]'
                          : 'border-ck-line bg-white hover:border-ck-brand/50'
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-bold text-base leading-snug">
                          {s.title}
                        </span>
                        {selected && (
                          <span className="w-5 h-5 shrink-0 rounded-full bg-ck-brand text-white flex items-center justify-center">
                            <LuCheck size={12} strokeWidth={3} aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-3 text-sm text-ck-muted">
                        <span className="inline-flex items-center gap-1">
                          <LuClock size={14} aria-hidden="true" />
                          {s.duration} dk
                        </span>
                        <span className="font-bold text-ck-ink">{s.price} TL</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {hasStaff && (
          <div
            className="ck-enter-up flex flex-col gap-4 min-w-0"
            style={{ animationDelay: '200ms' }}
          >
            <SectionTitle Icon={LuUser}>Kuaförünü seç</SectionTitle>
            <div
              role="radiogroup"
              aria-label="Kuaför"
              className="flex flex-wrap gap-2.5"
            >
              {staffList.map((st) => {
                const selected = st.id === staffId;
                const name = `${st.name} ${st.surname}`.trim();
                return (
                  <button
                    key={st.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onPickStaff(st.id)}
                    className={`ck-btn cursor-pointer inline-flex items-center gap-2.5 rounded-full border-[1.5px] pl-1.5 pr-5 min-h-[52px] font-bold text-[15px] ${
                      selected
                        ? 'border-ck-brand bg-ck-brand text-white'
                        : 'border-ck-line bg-white hover:border-ck-brand/50'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`w-10 h-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center text-sm font-extrabold ${
                        selected
                          ? 'bg-white/20 text-white'
                          : 'bg-ck-night text-white'
                      }`}
                    >
                      {st.photo ? (
                        <Image
                          alt=""
                          src={imageUrl(st.photo)}
                          width={80}
                          height={80}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${st.name.charAt(0)}${st.surname.charAt(0)}`.toLocaleUpperCase('tr')
                      )}
                    </span>
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          )}
        </div>

        {/* tarih + saat */}
        <div
          className="ck-enter-up flex flex-col gap-4 min-w-0"
          style={{ animationDelay: '150ms' }}
        >
          <SectionTitle Icon={LuCalendarDays}>Tarih ve saat seç</SectionTitle>

          <div
            role="radiogroup"
            aria-label="Tarih"
            className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x"
          >
            {days.map((d) => {
              const dt = dayDate(d);
              const selected = d === date;
              const closed = isClosedDay(d, hours);
              const label = closed
                ? 'Kapalı'
                : d === today
                ? 'Bugün'
                : d === tomorrow
                ? 'Yarın'
                : dt.toFormat('ccc');
              return (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={closed}
                  onClick={() => onPickDate(d)}
                  className={`ck-btn snap-start shrink-0 w-[78px] rounded-2xl border-[1.5px] py-3 flex flex-col items-center gap-0.5 ${
                    selected
                      ? 'cursor-pointer border-ck-brand bg-ck-brand text-white shadow-[0_8px_20px_rgba(142,19,48,.25)]'
                      : closed
                      ? 'cursor-not-allowed border-ck-line bg-ck-surface text-ck-muted/60'
                      : 'cursor-pointer border-ck-line bg-white hover:border-ck-brand/50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      selected ? 'text-white/85' : 'text-ck-muted'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="font-[family-name:var(--font-bricolage)] font-extrabold text-2xl leading-none">
                    {dt.toFormat('dd')}
                  </span>
                  <span
                    className={`text-xs ${
                      selected ? 'text-white/85' : 'text-ck-muted'
                    }`}
                  >
                    {dt.toFormat('LLL')}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="m-0 text-sm font-bold text-ck-muted" aria-live="polite">
            {dayLabel(date)}
          </p>

          {needStaff || closedToday || slots.length === 0 ? (
            <p className="m-0 rounded-2xl bg-ck-surface border border-ck-line p-4 text-sm text-ck-muted">
              {needStaff
                ? 'Müsait saatleri görmek için önce kuaförünü seç.'
                : closedToday
                ? 'Salon bu gün kapalı. Lütfen başka bir gün seç.'
                : 'Bu hizmet için bu günde uygun saat yok.'}
            </p>
          ) : (
            <div
              className={`grid grid-cols-3 sm:grid-cols-4 gap-2 transition-opacity duration-200 ${
                busyLoading ? 'opacity-50 pointer-events-none' : ''
              }`}
              role="group"
              aria-label="Saat"
              aria-busy={busyLoading}
            >
              {slots.map((slot) => {
                const taken = isBusy(date, slot, busySlots);
                // saat boş olsa da hizmet süresi sonraki dolu randevuya taşıyorsa seçilemez
                const busy = taken || isBusy(date, slot, busySlots, duration);
                const past = isPast(date, slot);
                const disabled = busy || past;
                const selected = time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    aria-pressed={selected}
                    title={
                      taken
                        ? 'Bu saat dolu'
                        : busy
                        ? `${duration} dk'lık hizmet için yeterli boşluk yok`
                        : past
                        ? 'Geçmiş saat'
                        : undefined
                    }
                    onClick={() => onPickTime(slot)}
                    className={`ck-btn min-h-11 rounded-xl border-[1.5px] font-bold text-[15px] ${
                      selected
                        ? 'cursor-pointer border-ck-brand bg-ck-brand text-white shadow-[0_8px_20px_rgba(142,19,48,.25)]'
                        : disabled
                        ? 'cursor-not-allowed border-ck-line bg-ck-surface text-ck-muted/60 line-through'
                        : 'cursor-pointer border-ck-line bg-white hover:border-ck-brand/60'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          <p className="m-0 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ck-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border border-ck-line bg-white" aria-hidden="true" />
              Müsait
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-ck-surface border border-ck-line" aria-hidden="true" />
              Dolu / geçmiş
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-ck-brand" aria-hidden="true" />
              Seçtiğin
            </span>
          </p>
        </div>
      </div>

      {/* özet + onay */}
      <div className="rounded-3xl border-[1.5px] border-ck-line bg-ck-surface p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-muted">
            Randevu özeti
          </span>
          {ready ? (
            <p className="m-0 font-bold text-base md:text-lg">
              {[dayLabel(date), time, service, staffName].filter(Boolean).join(' · ')}
            </p>
          ) : (
            <p className="m-0 text-ck-muted">
              Hizmet, kuaför, tarih ve saat seçince randevunu oluşturabilirsin.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!ready || loading}
          className="ck-btn cursor-pointer border-0 bg-ck-brand text-white font-bold text-[17px] px-8 rounded-full min-h-[54px] inline-flex items-center justify-center gap-2.5 enabled:hover:bg-ck-brand-dark enabled:hover:shadow-[0_10px_24px_rgba(107,14,36,.35)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LuCalendarDays size={20} aria-hidden="true" />
          {loading ? 'Oluşturuluyor…' : 'Randevu Al'}
        </button>
      </div>
    </div>
  );
};

export default StepBooking;
