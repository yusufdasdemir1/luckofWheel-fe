'use client';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';
import {
  IoChevronBack,
  IoChevronForward,
  IoClose,
  IoSearch,
} from 'react-icons/io5';

// Liste durumu (arama, filtre, sayfa) URL'de tutulur; değişince sunucu yeniden veri çeker.
export const useUrlFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? '';

  const set = (patch: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    // sayfa dışındaki bir filtre değişince ilk sayfaya dön
    if (!('page' in patch)) next.delete('page');

    const qs = next.toString();
    startTransition(() =>
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
    );
  };

  const clear = (keys: string[]) =>
    set(Object.fromEntries(keys.map((key) => [key, null])));

  return { get, set, clear, pending };
};

export const SearchBox = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [text, setText] = useState(value);

  // URL dışarıdan değiştiyse (filtreleri temizle gibi) kutuyu eşitle
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (text === value) return;
    const timer = setTimeout(() => onChange(text.trim()), 350);
    return () => clearTimeout(timer);
  }, [text, value, onChange]);

  return (
    <div className="relative w-full">
      <IoSearch
        aria-hidden="true"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        spellCheck={false}
        className="w-full h-11 pl-10 pr-10 box-border rounded-xl bg-white border border-slate-300 text-base md:text-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('');
            onChange('');
          }}
          aria-label="Aramayı temizle"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 bg-transparent border-0 cursor-pointer"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};

export interface ChipOption {
  value: string;
  label: string;
}

export const Chips = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div
    role="group"
    aria-label={label}
    className="flex items-center gap-2 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <span className="text-xs font-semibold text-slate-500 shrink-0 mr-1">
      {label}
    </span>
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option.value)}
          className={classNames(
            'shrink-0 h-9 px-3.5 rounded-full text-sm font-medium border cursor-pointer transition-colors',
            active
              ? 'bg-ck-night text-white border-ck-night'
              : 'bg-white text-slate-600 border-slate-300 hover:border-primary hover:text-primary',
          )}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export const SelectBox = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ChipOption[];
}) => (
  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 w-full sm:w-auto">
    {label}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 pl-3 pr-8 flex-1 min-w-0 sm:flex-none rounded-xl bg-white border border-slate-300 text-base md:text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-primary focus:ring-4 focus:ring-primary/10"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

// Tarih aralığı: iki uç da dahil, biri boş bırakılabilir (YYYY-MM-DD)
export const DateRange = ({
  label,
  from,
  to,
  onChange,
}: {
  label: string;
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}) => {
  const input =
    'h-9 px-2.5 flex-1 min-w-0 sm:flex-none rounded-xl bg-white border border-slate-300 text-base md:text-sm font-medium text-slate-700 outline-none cursor-pointer focus:border-primary focus:ring-4 focus:ring-primary/10';

  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2 text-xs font-semibold text-slate-500 w-full sm:w-auto"
    >
      {label}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          type="date"
          value={from}
          max={to || undefined}
          aria-label={`${label} başlangıç`}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className={input}
        />
        <span aria-hidden="true">–</span>
        <input
          type="date"
          value={to}
          min={from || undefined}
          aria-label={`${label} bitiş`}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className={input}
        />
      </div>
    </div>
  );
};

// 1 … 4 5 [6] 7 8 … 20 şeklinde sayfa numaraları
const pageWindow = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= total - 2)
    [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
};

export const Pagination = ({
  page,
  totalPages,
  count,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  count: number;
  pageSize: number;
  onPage: (page: number) => void;
}) => {
  if (totalPages <= 1) {
    return count > 0 ? (
      <p className="text-xs text-slate-500 text-center m-0">{count} kayıt</p>
    ) : null;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);
  const btn =
    'min-w-10 h-10 px-2 rounded-xl text-sm font-medium border flex items-center justify-center cursor-pointer transition-colors';

  return (
    <nav
      aria-label="Sayfalama"
      className="flex flex-col items-center gap-3 pt-2"
    >
      <p className="text-xs text-slate-500 m-0">
        {count} kayıttan {from}–{to} arası gösteriliyor
      </p>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Önceki sayfa"
          className={classNames(
            btn,
            'bg-white border-slate-300 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600',
          )}
        >
          <IoChevronBack />
        </button>

        {pageWindow(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={classNames(
                btn,
                p === page
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-primary hover:text-primary',
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          aria-label="Sonraki sayfa"
          className={classNames(
            btn,
            'bg-white border-slate-300 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600',
          )}
        >
          <IoChevronForward />
        </button>
      </div>
    </nav>
  );
};
