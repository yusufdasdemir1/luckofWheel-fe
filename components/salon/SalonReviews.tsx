'use client';
import Reveal from '@/components/home/Reveal';
import { Stars } from '@/components/StarRating';
import { fetchReviewsByCompanySlug } from '@/services/publicService';
import IPage from '@/types/IPage';
import { IPublicReview, IReviewSummary } from '@/types/IReview';
import { DateTime } from 'luxon';
import React from 'react';

type ReviewPage = IPage<IPublicReview> & IReviewSummary;

const formatDate = (iso: string) => {
  const date = DateTime.fromISO(iso).setZone('Europe/Istanbul').setLocale('tr');
  return date.isValid ? date.toFormat('d MMMM yyyy') : '';
};

const SalonReviews = ({
  slug,
  initial,
}: {
  slug: string;
  initial: ReviewPage;
}) => {
  const [items, setItems] = React.useState(initial.results);
  const [page, setPage] = React.useState(initial.page);
  const [loading, setLoading] = React.useState(false);

  if (initial.count === 0) return null;

  const hasMore = page < initial.total_pages;
  const avgText = initial.rating_avg.toFixed(1).replace('.', ',');

  const loadMore = async () => {
    setLoading(true);
    const [err, data] = await fetchReviewsByCompanySlug(slug, {
      page: page + 1,
      page_size: initial.page_size,
    });
    setLoading(false);
    if (err || !data) return;
    setItems((prev) => [...prev, ...data.results]);
    setPage(data.page);
  };

  return (
    <section aria-labelledby="yorumlar">
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            Yorumlar
          </span>
          <h2
            id="yorumlar"
            className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]"
          >
            Müşteriler ne diyor?
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-[auto_1fr] items-center rounded-3xl border-[1.5px] border-ck-line bg-white p-5 sm:p-6">
          <div className="flex flex-col items-center gap-1 sm:px-4">
            <strong className="font-[family-name:var(--font-bricolage)] font-extrabold text-5xl leading-none">
              {avgText}
            </strong>
            <Stars value={initial.rating_avg} size={20} />
            <span className="text-sm text-ck-muted">
              {initial.rating_count} yorum
            </span>
          </div>

          <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = initial.distribution[String(star)] ?? 0;
              const pct = (n / initial.rating_count) * 100;
              return (
                <li key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-right font-bold">{star}</span>
                  <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="w-6 text-ck-muted">{n}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="list-none m-0 p-0 flex flex-col gap-3">
          {items.map((review) => (
            <li
              key={review.id}
              className="rounded-3xl border-[1.5px] border-ck-line bg-white p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex flex-col">
                  <strong className="text-base break-words">
                    {review.customer}
                  </strong>
                  <span className="text-[13px] text-ck-muted">
                    {review.service_title} · {formatDate(review.created_at)}
                  </span>
                </div>
                <Stars value={review.rating} size={16} className="shrink-0" />
              </div>

              {review.comment && (
                <p className="m-0 text-[15px] leading-[1.65] break-words whitespace-pre-line">
                  {review.comment}
                </p>
              )}

              {review.reply && (
                <div className="rounded-2xl bg-ck-surface px-4 py-3 flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-ck-brand-dark">
                    Salonun cevabı
                  </span>
                  <p className="m-0 text-sm leading-[1.6] break-words whitespace-pre-line">
                    {review.reply}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="ck-btn self-center px-6 min-h-[48px] rounded-full border-[1.5px] border-ck-line bg-white font-bold cursor-pointer hover:border-ck-brand/50 disabled:opacity-50"
          >
            {loading ? 'Yükleniyor…' : 'Daha fazla göster'}
          </button>
        )}
      </Reveal>
    </section>
  );
};

export default SalonReviews;
