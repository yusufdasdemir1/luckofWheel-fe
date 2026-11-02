'use client';
import IGift from '@/types/IGift';
import ICompany, { WheelMode } from '@/types/ICompany';
import React, { FormEvent } from 'react';
import { LuArrowRight, LuClock, LuGift, LuRotateCw, LuX } from 'react-icons/lu';
import { FIELD } from './fields';

export interface InfoData {
  name: string;
  surname: string;
  phone: string;
  email: string;
}

export type InfoErrors = Partial<Record<keyof InfoData, string>>;

interface StepInfoProps {
  /** sayfadaki hizmet/kuaför kartlarından seçilenler; yoksa null */
  selection?: { service: string; staff: string; onClear: () => void } | null;
  company: ICompany;
  wheelMode: WheelMode;
  gifts: IGift[];
  data: InfoData;
  errors: InfoErrors;
  loading: boolean;
  onChange: (field: keyof InfoData, value: string) => void;
  onSubmit: () => void;
}

const StepInfo = ({
  selection = null,
  company,
  wheelMode,
  gifts,
  data,
  errors,
  loading,
  onChange,
  onSubmit,
}: StepInfoProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const field = (
    key: keyof InfoData,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <label className="flex flex-col gap-1.5 text-sm font-bold text-ck-muted">
      <span>
        {label}
        <span className="text-ck-error"> *</span>
      </span>
      <input
        value={data[key]}
        onChange={(e) => onChange(key, e.target.value)}
        aria-invalid={!!errors[key]}
        className={`${FIELD} ${errors[key] ? 'border-ck-error' : ''}`}
        {...props}
      />
      {errors[key] && (
        <span className="text-[13px] font-medium text-ck-error">
          {errors[key]}
        </span>
      )}
    </label>
  );

  const hasWheel = wheelMode !== 'none';
  const wheelFirst = wheelMode === 'before';

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      {/* sol: vaat ve ödüller */}
      <aside className="ck-enter-left relative overflow-hidden rounded-3xl bg-ck-night text-white p-7 md:p-9 flex flex-col gap-7">
        <span
          aria-hidden="true"
          className="ck-glow pointer-events-none absolute -bottom-24 -right-16 w-[320px] h-[320px] rounded-full bg-ck-coral/25 blur-3xl"
        />

        <div className="relative flex flex-col gap-3">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-white">
            {hasWheel ? 'Hediyeli randevu' : 'Online randevu'}
          </span>
          <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(30px,3.6vw,42px)] leading-[1.02] tracking-[-.03em]">
            {wheelFirst ? (
              <>
                Çarkı çevir,{' '}
                <span className="text-ck-coral">hediyeni kazan.</span>
              </>
            ) : hasWheel ? (
              <>
                Randevunu al,{' '}
                <span className="text-ck-coral">çarkı çevir.</span>
              </>
            ) : (
              <>
                Randevunu{' '}
                <span className="text-ck-coral">hemen oluştur.</span>
              </>
            )}
          </h2>
          <p className="m-0 text-base leading-[1.6] text-[#E0D2D3]">
            {wheelFirst
              ? 'Bilgilerini yaz, çarkı çevir. Kazandığın hediyeyle tarih ve saat seçip randevunu hemen oluştur.'
              : hasWheel
              ? 'Bilgilerini yaz, tarih ve saat seç. Randevun oluşunca çarkı çevirip hediyeni kazan.'
              : 'Bilgilerini yaz, tarih ve saat seçip randevunu hemen oluştur.'}
          </p>
        </div>

        {hasWheel && gifts.length > 0 && (
          <div className="relative flex flex-col gap-3">
            <p className="m-0 text-sm font-bold text-white">
              Çarkta seni bekleyen ödüller
            </p>
            <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
              {gifts.map((gift) => (
                <li
                  key={gift.title}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[13px] font-medium"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: gift.gift_color }}
                    aria-hidden="true"
                  />
                  {gift.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="relative list-none m-0 p-0 flex flex-col gap-3 text-[15px]">
          {hasWheel && (
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0">
                <LuGift size={18} aria-hidden="true" />
              </span>
              Kazandığın hediyeyi randevunda salona göster
            </li>
          )}
          {hasWheel && company.spin_cooldown_hours > 0 && (
            <li className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0">
                <LuClock size={18} aria-hidden="true" />
              </span>
              Çevirme hakkın {company.spin_cooldown_hours} saatte bir yenilenir
            </li>
          )}
        </ul>
      </aside>

      {/* sağ: form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="ck-enter-right flex flex-col gap-4 rounded-3xl border-[1.5px] border-ck-line bg-ck-surface p-6 md:p-8"
      >
        {selection && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-2xl border border-ck-brand/25 bg-white px-4 py-3"
          >
            <div className="min-w-0 flex flex-col text-sm">
              <span className="text-[12px] font-bold uppercase tracking-[.06em] text-ck-muted">
                Seçimin
              </span>
              <span className="font-bold text-ck-ink truncate">
                {selection.service}
                {selection.staff && (
                  <span className="font-medium text-ck-muted">
                    {' '}
                    · {selection.staff}
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={selection.onClear}
              aria-label="Seçimi iptal et"
              className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-ck-line bg-ck-surface px-3.5 min-h-9 text-[13px] font-bold text-ck-ink hover:border-ck-error hover:text-ck-error"
            >
              <LuX size={15} aria-hidden="true" />
              İptal et
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-2xl tracking-[-.02em]">
            Bilgilerini yaz
          </h3>
          <p className="m-0 text-[15px] text-ck-muted">
            {wheelFirst
              ? 'Çarkı çevirmek için kısa bir form.'
              : 'Randevu için kısa bir form.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {field('name', 'Adın', { autoComplete: 'given-name' })}
          {field('surname', 'Soyadın', { autoComplete: 'family-name' })}
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-bold text-ck-muted">
          <span>
            Telefon<span className="text-ck-error"> *</span>
          </span>
          <div className="flex">
            <span className="min-h-12 px-4 flex items-center rounded-l-2xl border-[1.5px] border-r-0 border-ck-input bg-white text-ck-ink text-base font-bold">
              +90
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="5xx xxx xx xx"
              maxLength={14}
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              aria-invalid={!!errors.phone}
              className={`${FIELD} !rounded-l-none ${
                errors.phone ? 'border-ck-error' : ''
              }`}
            />
          </div>
          {errors.phone && (
            <span className="text-[13px] font-medium text-ck-error">
              {errors.phone}
            </span>
          )}
        </label>

        {field('email', 'E-posta', { type: 'email', autoComplete: 'email' })}

        <button
          type="submit"
          disabled={loading}
          className="ck-btn mt-1 cursor-pointer border-0 bg-ck-brand text-white font-bold text-[17px] px-7 rounded-full min-h-[54px] inline-flex items-center justify-center gap-2.5 enabled:hover:bg-ck-brand-dark enabled:hover:shadow-[0_10px_24px_rgba(107,14,36,.35)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {wheelFirst ? (
            <LuRotateCw
              size={20}
              className={loading ? 'animate-spin' : ''}
              aria-hidden="true"
            />
          ) : (
            <LuArrowRight size={20} aria-hidden="true" />
          )}
          {loading
            ? 'Hazırlanıyor…'
            : wheelFirst
            ? 'Çarkı Çevir'
            : 'Randevuya Geç'}
        </button>
      </form>
    </div>
  );
};

export default StepInfo;
