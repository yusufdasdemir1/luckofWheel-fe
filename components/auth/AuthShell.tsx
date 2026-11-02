import { SITE_LOGO_DARK_RATIO, SITE_LOGO_DARK_URL } from '@/utils/siteLogo';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { IoArrowBack } from 'react-icons/io5';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

const POINTS = [
  'Randevular, hediyeler ve çalışanlar tek panelde',
  'Müşterin çarkı çevirir, hediyesini kazanır, randevusunu alır',
  'Çalışma saatlerini ve kuaförlerini sen yönetirsin',
];

const AuthShell = ({ title, subtitle, children, footer, wide }: AuthShellProps) => {
  return (
    <div className="min-h-screen grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* marka alanı: mobilde ince üst bant, masaüstünde sol panel */}
      <aside className="relative overflow-hidden bg-ck-night text-white px-5 py-4 sm:px-8 lg:px-14 lg:py-12 flex flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 w-[420px] h-[420px] rounded-full bg-ck-night-soft/70 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 w-[340px] h-[340px] rounded-full bg-ck-brand/30 blur-3xl"
        />

        <Link href="/" className="relative inline-flex w-fit no-underline">
          <Image
            src={SITE_LOGO_DARK_URL}
            width={Math.round(44 * SITE_LOGO_DARK_RATIO)}
            height={44}
            alt="Çevir Kazan 360"
            unoptimized
            priority
            className="block h-8 sm:h-9 lg:h-11 w-auto"
          />
        </Link>

        <div className="relative hidden lg:flex flex-col gap-8 my-auto max-w-[460px]">
          <h2 className="font-[family-name:var(--font-bricolage)] text-[44px] leading-[1.08] font-extrabold m-0">
            Salonunu <span className="text-ck-coral">çevir</span>, müşterini{' '}
            <span className="text-ck-accent">kazan</span>.
          </h2>
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[#EADFDF]">
                <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-ck-accent shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative hidden lg:block text-sm text-ck-muted-dark m-0">
          © {new Date().getFullYear()} Çevir Kazan 360
        </p>
      </aside>

      {/* form alanı */}
      <section className="flex flex-col min-w-0 px-5 py-6 sm:px-8 lg:px-14 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 w-fit text-sm text-ck-muted no-underline hover:text-ck-brand"
        >
          <IoArrowBack aria-hidden="true" /> Ana sayfaya dön
        </Link>

        <div
          className={`w-full mx-auto my-auto py-8 ${
            wide ? 'max-w-[560px]' : 'max-w-[440px]'
          }`}
        >
          <h1 className="font-[family-name:var(--font-bricolage)] text-[28px] sm:text-[34px] leading-tight font-extrabold text-ck-ink m-0">
            {title}
          </h1>
          <p className="text-ck-muted mt-2 mb-7">{subtitle}</p>

          {children}

          {footer && (
            <div className="mt-8 text-sm text-ck-muted text-center">{footer}</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AuthShell;
