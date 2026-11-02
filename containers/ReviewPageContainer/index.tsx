'use client';
import { apiErrorMessage } from '@/utils/apiError';
import HomeFooter from '@/components/home/HomeFooter';
import HomeNav from '@/components/home/HomeNav';
import { StarInput } from '@/components/StarRating';
import { createReviewByToken } from '@/services/publicService';
import { IReviewPageData, ReviewPageState } from '@/types/IReview';
import { DateTime } from 'luxon';
import Link from 'next/link';
import React from 'react';

const MAX_COMMENT = 1000;

const STATE_TEXT: Record<
  Exclude<ReviewPageState, 'open'>,
  { title: string; text: string }
> = {
  too_early: {
    title: 'Biraz erken geldin',
    text: 'Randevun tamamlandıktan sonra bu bağlantıdan deneyimini paylaşabilirsin.',
  },
  canceled: {
    title: 'Bu randevu iptal edilmiş',
    text: 'İptal edilen randevular değerlendirilemez.',
  },
  done: {
    title: 'Teşekkürler!',
    text: 'Değerlendirmen bize ulaştı. Salon onayladıktan sonra salon sayfasında yayınlanır.',
  },
};

const CTA_CLASS =
  'ck-btn bg-ck-brand text-white no-underline font-bold text-[17px] px-8 rounded-full min-h-[52px] inline-flex items-center justify-center border-0 cursor-pointer hover:bg-ck-brand-dark hover:shadow-[0_10px_24px_rgba(107,14,36,.35)] disabled:opacity-50 disabled:cursor-not-allowed';

const ReviewPageContainer = ({
  token,
  data,
}: {
  token: string;
  data: IReviewPageData;
}) => {
  const [state, setState] = React.useState<ReviewPageState>(data.state);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState('');

  const { company, meeting } = data;

  const dateText = (() => {
    const date = DateTime.fromISO(meeting.date).setLocale('tr');
    return date.isValid ? date.toFormat('d MMMM yyyy') : meeting.date;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return setError('Lütfen bir puan seç.');

    setSending(true);
    setError('');
    const [err] = await createReviewByToken(token, { rating, comment });
    setSending(false);

    if (err) {
      // zaten yapılmış/erken/iptal durumları sayfa durumuna çevrilir
      if (err.state && err.state !== 'open') return setState(err.state);
      return setError(
        apiErrorMessage(err, 'Değerlendirme gönderilemedi, lütfen tekrar dene.')
      );
    }

    setState('done');
  };

  return (
    <>
      <HomeNav />
      <main className="px-4 sm:px-6 py-16 sm:py-24 flex justify-center">
        <div className="w-full max-w-[560px] flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
              {company.title}
            </span>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(30px,4.4vw,44px)] leading-[1.05] tracking-[-.035em]">
              {state === 'open' ? 'Randevun nasıldı?' : STATE_TEXT[state].title}
            </h1>
            <p className="m-0 text-base leading-[1.6] text-ck-muted">
              {meeting.service_title} · {dateText} {meeting.time}
              {meeting.staff ? ` · ${meeting.staff}` : ''}
            </p>
          </div>

          {state === 'open' ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-3xl border-[1.5px] border-ck-line bg-white p-5 sm:p-8"
            >
              <StarInput
                value={rating}
                onChange={(v) => {
                  setRating(v);
                  setError('');
                }}
                disabled={sending}
              />

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold">
                  Yorumun{' '}
                  <span className="font-normal text-ck-muted">(isteğe bağlı)</span>
                </span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={MAX_COMMENT}
                  rows={5}
                  disabled={sending}
                  placeholder="Deneyimini kısaca anlat"
                  className="w-full min-h-[120px] px-4 py-3 resize-y box-border bg-white text-base rounded-2xl border border-slate-300 outline-none transition-colors focus:border-ck-brand focus:ring-4 focus:ring-ck-brand/10"
                />
                <span className="self-end text-xs text-ck-muted">
                  {comment.length}/{MAX_COMMENT}
                </span>
              </label>

              {error && (
                <p role="alert" className="m-0 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button type="submit" disabled={sending} className={CTA_CLASS}>
                {sending ? 'Gönderiliyor…' : 'Değerlendirmeyi gönder'}
              </button>
              <p className="m-0 text-xs text-center text-ck-muted">
                Yorumun salon onayından sonra yayınlanır. Adın soyadının sadece
                baş harfiyle görünür.
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-5 rounded-3xl border-[1.5px] border-ck-line bg-white p-6 sm:p-8 text-center">
              <p className="m-0 text-lg leading-[1.6] text-ck-muted">
                {STATE_TEXT[state].text}
              </p>
              <Link href={`/${company.slug}`} className={CTA_CLASS}>
                Salon sayfasına git
              </Link>
            </div>
          )}
        </div>
      </main>
      <HomeFooter />
    </>
  );
};

export default ReviewPageContainer;
