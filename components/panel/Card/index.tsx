import classNames from 'classnames';
import React, { ReactNode } from 'react';

type Tone = 'green' | 'orange' | 'red' | 'slate' | 'wine';

const ACCENT: Record<Tone, string> = {
  green: 'bg-emerald-500',
  orange: 'bg-amber-400',
  red: 'bg-red-400',
  slate: 'bg-slate-300',
  wine: 'bg-primary',
};

const BADGE: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  orange: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-600 ring-red-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  wine: 'bg-primary/10 text-primary ring-primary/20',
};

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <h2 className="text-2xl sm:text-3xl font-semibold m-0 text-ck-ink">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-slate-500 mt-1.5 mb-0 max-w-[600px]">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const Card = ({
  tone = 'slate',
  className,
  children,
  selecting = false,
  selected = false,
  onToggle,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  /** toplu seçim modu: kart tıklanınca seçilir, içindeki butonlar pasifleşir */
  selecting?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) => (
  <div
    className={classNames(
      'relative flex flex-col gap-3 box-border min-w-0 overflow-hidden',
      'bg-white border rounded-2xl p-4 pt-5 shadow-sm',
      'transition-shadow hover:shadow-md',
      selected ? 'border-primary ring-2 ring-primary/40' : 'border-slate-200',
      className,
    )}
  >
    <span
      aria-hidden="true"
      className={classNames('absolute inset-x-0 top-0 h-1', ACCENT[tone])}
    />

    {selecting && (
      <>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          aria-label={selected ? 'Seçimi kaldır' : 'Seç'}
          className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent border-0 p-0"
        />
        <span
          aria-hidden="true"
          className={classNames(
            'flex items-center gap-2 text-xs font-semibold',
            selected ? 'text-primary' : 'text-slate-500',
          )}
        >
          <span
            className={classNames(
              'w-5 h-5 rounded-md border-2 flex items-center justify-center',
              selected
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-slate-300',
            )}
          >
            {selected && (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                <path
                  d="M2.5 6.5l2.2 2.2L9.5 3.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          {selected ? 'Seçildi' : 'Seç'}
        </span>
      </>
    )}

    {children}
  </div>
);

export const Badge = ({
  tone = 'slate',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) => (
  <span
    className={classNames(
      'inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full',
      'text-xs font-semibold ring-1 ring-inset whitespace-nowrap',
      BADGE[tone],
    )}
  >
    {children}
  </span>
);

export const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={classNames('flex flex-col gap-0.5 min-w-0', className)}>
    <span className="text-xs text-slate-500">{label}</span>
    <strong className="text-sm font-semibold text-ck-ink break-words">
      {children}
    </strong>
  </div>
);

export const FieldGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
);

export const CardActions = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-slate-100">
    {children}
  </div>
);

export const CardGrid = ({
  children,
  equal = false,
  dense = false,
}: {
  children: ReactNode;
  /** true: aynı satırdaki kartlar eşit yükseklikte durur */
  equal?: boolean;
  /** true: mobilde 1, geniş ekranda 4 kolon (12 kartlık liste için) */
  dense?: boolean;
}) => (
  <div
    className={classNames(
      'grid',
      dense
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
        : 'gap-4 sm:grid-cols-2 xl:grid-cols-3',
      equal ? 'items-stretch' : 'items-start',
    )}
  >
    {children}
  </div>
);

export const EmptyState = ({
  title,
  text,
}: {
  title: string;
  text?: string;
}) => (
  <div className="flex flex-col items-center gap-1 text-center py-14 px-4 bg-white border border-dashed border-slate-300 rounded-2xl">
    <strong className="text-base text-ck-ink">{title}</strong>
    {text && <p className="text-sm text-slate-500 m-0 max-w-[360px]">{text}</p>}
  </div>
);

// Ayar/form sayfalarında bölüm kutusu: başlık + alanlar
export const FormSection = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={classNames(
      'flex flex-col gap-4 box-border p-4 sm:p-5',
      'bg-white border border-slate-200 rounded-2xl shadow-sm',
      className,
    )}
  >
    <header className="flex flex-col gap-0.5">
      <h3 className="m-0 text-base font-semibold text-ck-ink">{title}</h3>
      {description && (
        <p className="m-0 text-sm text-slate-500">{description}</p>
      )}
    </header>
    {children}
  </section>
);
