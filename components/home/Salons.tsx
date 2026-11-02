'use client';
import { fetchPublicCompanies } from '@/services/publicService';
import ICompanyPage from '@/types/ICompanyPage';
import { imageUrl } from '@/utils/apiUrl';
import {
  normalizeCompanyPage,
  SALON_PAGE_SIZE,
} from '@/utils/normalizeCompanyPage';
import Image from 'next/image';
import Link from 'next/link';
import React, { FormEvent, useMemo, useRef, useState } from 'react';
import {
  LuChevronLeft,
  LuChevronRight,
  LuMapPin,
  LuPlus,
  LuSearch,
  LuStar,
} from 'react-icons/lu';
import { SALON_APPLY_HREF } from './constants';
import Reveal from './Reveal';

interface SalonsProps {
  initial: ICompanyPage;
}

interface Filters {
  city: string;
  district: string;
  q: string;
}

const EMPTY: Filters = { city: '', district: '', q: '' };

const FIELD =
  'w-full font-[inherit] text-[15px] px-3.5 rounded-[14px] border-[1.5px] border-ck-input bg-white min-h-12 text-ck-ink box-border disabled:opacity-60 disabled:cursor-not-allowed';

// 1 … 4 5 6 … 12 gibi, uzun listelerde araları kısaltan sayfa numaraları
const buildPages = (page: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const wanted = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => wanted.add(p));
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => wanted.add(p));

  const sorted = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
};

const PAGE_BTN =
  'ck-btn min-w-11 h-11 px-3 rounded-full border-[1.5px] border-ck-line bg-ck-surface text-ck-ink font-bold text-[15px] inline-flex items-center justify-center cursor-pointer enabled:hover:border-ck-brand enabled:hover:text-ck-brand disabled:opacity-40 disabled:cursor-not-allowed';

const Salons = ({ initial }: SalonsProps) => {
  const [data, setData] = useState<ICompanyPage>(initial);
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [applied, setApplied] = useState<Filters>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sectionRef = useRef<HTMLElement>(null);
  const requestId = useRef(0);

  const cities = initial.filters.cities;
  const districts = useMemo(
    () => cities.find((c) => c.city === draft.city)?.districts ?? [],
    [cities, draft.city]
  );
  const hasApplied = !!(applied.city || applied.district || applied.q);

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sectionRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const load = async (page: number, filters: Filters, scroll = false) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');

    const params: Record<string, string | number> = {
      page,
      page_size: SALON_PAGE_SIZE,
    };
    if (filters.city) params.city = filters.city;
    if (filters.district) params.district = filters.district;
    if (filters.q) params.q = filters.q;

    const [err, res] = await fetchPublicCompanies(params);
    if (id !== requestId.current) return; // daha yeni bir istek var, bunu yok say

    setLoading(false);
    if (err) {
      setError('Salonlar yüklenemedi. Lütfen tekrar deneyin.');
      return;
    }
    setData(normalizeCompanyPage(res));
    if (scroll) scrollToTop();
  };

  // filtreler canlı değil: sadece "Filtrele" butonuna (veya Enter'a) basınca uygulanır
  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    const next = { ...draft, q: draft.q.trim() };
    setApplied(next);
    load(1, next);
  };

  const clearFilters = () => {
    setDraft(EMPTY);
    setApplied(EMPTY);
    load(1, EMPTY);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > data.total_pages || page === data.page) return;
    load(page, applied, true);
  };

  const showAddCard = !hasApplied && data.results.length < SALON_PAGE_SIZE;

  return (
    <section
      ref={sectionRef}
      id="salonlar"
      className="max-w-[1240px] mx-auto px-6 pt-[110px] pb-[100px] scroll-mt-16"
    >
      <Reveal>
        <div className="flex flex-col gap-3.5 mb-8">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            Çarkı aktif salonlar
          </span>
          <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(34px,4.2vw,54px)] leading-[1.02] tracking-[-.03em]">
            Hangi salonda çevireceksin?
          </h2>
        </div>

        <form
          onSubmit={applyFilters}
          className="bg-ck-surface border-[1.5px] border-ck-line rounded-3xl p-4 sm:p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto] lg:items-end"
        >
          <label className="flex flex-col gap-1.5 text-[13px] font-bold text-ck-muted">
            Şehir
            <select
              value={draft.city}
              onChange={(e) =>
                setDraft((d) => ({ ...d, city: e.target.value, district: '' }))
              }
              className={FIELD}
            >
              <option value="">Tüm şehirler</option>
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[13px] font-bold text-ck-muted">
            İlçe
            <select
              value={draft.district}
              onChange={(e) =>
                setDraft((d) => ({ ...d, district: e.target.value }))
              }
              disabled={!draft.city || districts.length === 0}
              className={FIELD}
            >
              <option value="">
                {draft.city ? 'Tüm ilçeler' : 'Önce şehir seç'}
              </option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[13px] font-bold text-ck-muted sm:col-span-2 lg:col-span-1">
            Salon ara
            <input
              type="search"
              value={draft.q}
              onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
              placeholder="Salon adı…"
              className={FIELD}
            />
          </label>

          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="ck-btn flex-1 lg:flex-none cursor-pointer border-0 bg-ck-brand text-white font-bold text-[15px] px-6 rounded-full min-h-12 inline-flex items-center justify-center gap-2 enabled:hover:bg-ck-brand-dark enabled:hover:shadow-[0_10px_24px_rgba(107,14,36,.35)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LuSearch size={18} aria-hidden="true" />
              Filtrele
            </button>
            {hasApplied && (
              <button
                type="button"
                onClick={clearFilters}
                disabled={loading}
                className="cursor-pointer border-0 bg-transparent text-ck-brand-dark font-bold text-[15px] px-3 min-h-12 underline underline-offset-4 disabled:opacity-60"
              >
                Temizle
              </button>
            )}
          </div>
        </form>
      </Reveal>

      <p
        className="mt-5 mb-4 text-sm text-ck-muted"
        aria-live="polite"
        role="status"
      >
        {loading
          ? 'Salonlar yükleniyor…'
          : data.count > 0
          ? `${data.count} salon bulundu${
              data.total_pages > 1
                ? ` · Sayfa ${data.page} / ${data.total_pages}`
                : ''
            }`
          : ''}
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-2xl border border-ck-error bg-ck-error/10 text-ck-error px-4 py-3 flex flex-wrap items-center gap-3"
        >
          {error}
          <button
            type="button"
            onClick={() => load(data.page, applied)}
            className="cursor-pointer border-0 bg-transparent font-bold underline underline-offset-4 text-ck-error"
          >
            Tekrar dene
          </button>
        </div>
      )}

      <div
        aria-busy={loading}
        className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-[22px] transition-opacity duration-200 ${
          loading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {data.results.map((company) => (
          <Link
            key={company.slug}
            href={`/${company.slug}`}
            className="group no-underline text-ck-ink bg-ck-surface rounded-[20px] sm:rounded-[28px] overflow-hidden border-[1.5px] border-ck-line flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <div className="relative h-[120px] sm:h-[200px] bg-ck-line">
              <Image
                loader={({ src }) => src}
                alt={company.title}
                src={
                  company.logo
                    ? imageUrl(company.logo)
                    : 'https://placehold.co/320x180?text=Hazırlanıyor...'
                }
                width={0}
                height={0}
                unoptimized
                className="w-full h-full object-cover"
              />
              {company.is_show_wheel && (
                <span className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 bg-ck-night text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-[7px] rounded-full flex items-center gap-1.5">
                  <span className="relative flex w-2 h-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-ck-online opacity-60 animate-ping motion-reduce:animate-none" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-ck-online" />
                  </span>
                  Çark aktif
                </span>
              )}
            </div>
            <div className="px-3 pt-3 pb-3.5 sm:px-[22px] sm:pt-[22px] sm:pb-6 flex flex-col gap-1.5 sm:gap-2.5 flex-1">
              <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-[15px] sm:text-[21px] tracking-[-.01em] break-words line-clamp-2">
                {company.title}
              </h3>
              {company.rating_count > 0 && (
                <span
                  className="flex items-center gap-1 text-xs sm:text-sm font-bold"
                  aria-label={`5 üzerinden ${company.rating_avg
                    .toFixed(1)
                    .replace('.', ',')}, ${company.rating_count} yorum`}
                >
                  <LuStar
                    size={14}
                    className="text-amber-400 fill-amber-400"
                    aria-hidden="true"
                  />
                  {company.rating_avg.toFixed(1).replace('.', ',')}
                  <span className="font-normal text-ck-muted">
                    ({company.rating_count})
                  </span>
                </span>
              )}
              {company.description && (
                <p className="m-0 text-xs sm:text-sm text-ck-muted leading-normal line-clamp-2">
                  {company.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-1 sm:pt-2 gap-2 sm:gap-3 mt-auto">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm text-ck-muted min-w-0">
                  <LuMapPin size={14} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {[company.district, company.city].filter(Boolean).join(', ') ||
                      '—'}
                  </span>
                </span>
                <span className="bg-ck-brand text-white font-bold text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2.5 rounded-full whitespace-nowrap text-center transition-colors duration-200 group-hover:bg-ck-brand-dark">
                  Çarkı Çevir
                </span>
              </div>
            </div>
          </Link>
        ))}

        {showAddCard && (
          <Link
            href={SALON_APPLY_HREF}
            aria-label="Salonunu ekle"
            className="group no-underline text-ck-ink rounded-[20px] sm:rounded-[28px] border-2 border-dashed border-ck-input flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 px-4 py-6 sm:px-7 sm:py-10 text-center min-h-[200px] sm:min-h-[380px] box-border transition-all duration-200 hover:border-ck-brand hover:bg-ck-surface hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-ck-night text-white flex items-center justify-center transition duration-300 group-hover:bg-ck-brand group-hover:scale-110 group-hover:rotate-90 group-hover:shadow-[0_10px_24px_rgba(107,14,36,.35)] motion-reduce:transition-none motion-reduce:group-hover:transform-none">
              <LuPlus size={26} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-base sm:text-[22px]">
              Buraya senin salonun gelsin
            </h3>
            <p className="m-0 text-xs sm:text-[15px] text-ck-muted leading-normal max-w-[260px]">
              Çarkını kur, müşterilerin hediye kazanarak randevu alsın.
            </p>
            <span className="font-bold text-sm sm:text-[15px] text-ck-brand-dark inline-flex items-center gap-1 transition-colors group-hover:text-[#4A0A19]">
              Salonunu ekle
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </Link>
        )}
      </div>

      {!loading && !error && data.count === 0 && (
        <div className="py-12 text-center flex flex-col items-center gap-3 text-ck-muted">
          <p className="m-0 text-lg">Aramanla eşleşen salon bulunamadı.</p>
          {hasApplied && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer border-0 bg-transparent text-ck-brand-dark font-bold underline underline-offset-4"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      )}

      {data.total_pages > 1 && (
        <nav
          aria-label="Salon sayfaları"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            aria-label="Önceki sayfa"
            onClick={() => goToPage(data.page - 1)}
            disabled={loading || data.page <= 1}
            className={PAGE_BTN}
          >
            <LuChevronLeft size={20} aria-hidden="true" />
          </button>

          {buildPages(data.page, data.total_pages).map((p, i) =>
            p === '…' ? (
              <span
                key={`gap-${i}`}
                className="min-w-8 text-center text-ck-muted"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goToPage(p)}
                disabled={loading}
                aria-label={`Sayfa ${p}`}
                aria-current={p === data.page ? 'page' : undefined}
                className={`${PAGE_BTN} ${
                  p === data.page
                    ? '!bg-ck-brand !border-ck-brand !text-white'
                    : ''
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            aria-label="Sonraki sayfa"
            onClick={() => goToPage(data.page + 1)}
            disabled={loading || data.page >= data.total_pages}
            className={PAGE_BTN}
          >
            <LuChevronRight size={20} aria-hidden="true" />
          </button>
        </nav>
      )}
    </section>
  );
};

export default Salons;
