'use client';
import { apiErrorMessage } from '@/utils/apiError';
import Button from '@/components/panel/Button';
import {
  Badge,
  Card,
  CardActions,
  CardGrid,
  EmptyState,
  Field,
  FieldGrid,
  PageHeader,
} from '@/components/panel/Card';
import { Chips, Pagination, useUrlFilters } from '@/components/panel/ListTools';
import Modal, { ModalActions, ModalForm } from '@/components/panel/Modal';
import Textarea from '@/components/panel/Textarea';
import { Stars } from '@/components/StarRating';
import { updateReview } from '@/services/reviewService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import IPage from '@/types/IPage';
import { IPanelReview, ReviewStatus } from '@/types/IReview';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import React from 'react';

type ReviewsPage = IPage<IPanelReview> & {
  counts: Record<ReviewStatus, number>;
};

const STATUS_META: Record<
  ReviewStatus,
  { label: string; tone: 'orange' | 'green' | 'slate' }
> = {
  pending: { label: 'Beklemede', tone: 'orange' },
  approved: { label: 'Yayında', tone: 'green' },
  hidden: { label: 'Gizli', tone: 'slate' },
};

const MAX_REPLY = 1000;

const formatDate = (iso: string) => {
  const date = DateTime.fromISO(iso).setZone('Europe/Istanbul').setLocale('tr');
  return date.isValid ? date.toFormat('d MMM yyyy HH:mm') : iso;
};

const YorumlarContainer = ({ page }: { page: ReviewsPage }) => {
  const router = useRouter();
  const { addAlert } = useAlertStore();
  const { user } = useAuthStore();
  const filters = useUrlFilters();

  const [replyTarget, setReplyTarget] = React.useState<IPanelReview | null>(
    null,
  );
  const [replyText, setReplyText] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const counts = page.counts;
  const total = counts.pending + counts.approved + counts.hidden;
  const statusFilter = filters.get('status');

  const options = [
    { value: '', label: `Tümü (${total})` },
    { value: 'pending', label: `Beklemede (${counts.pending})` },
    { value: 'approved', label: `Yayında (${counts.approved})` },
    { value: 'hidden', label: `Gizli (${counts.hidden})` },
  ];

  const notify = (type: 'success' | 'error', title: string, content: string) =>
    addAlert({ id: String(Date.now() + Math.random()), type, title, content });

  const save = async (
    id: number,
    data: { status?: ReviewStatus; reply?: string },
    successText: string,
  ) => {
    const [err] = await updateReview(id, data);
    if (err) {
      notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Yorum güncellenemedi, lütfen tekrar deneyin.'),
      );
      return false;
    }
    notify('success', 'Başarılı', successText);
    router.refresh();
    return true;
  };

  const openReply = (review: IPanelReview) => {
    setReplyTarget(review);
    setReplyText(review.reply);
  };

  const submitReply = async () => {
    if (!replyTarget) return;
    setSaving(true);
    const ok = await save(
      replyTarget.id,
      { reply: replyText },
      replyText.trim() ? 'Cevabın kaydedildi.' : 'Cevap kaldırıldı.',
    );
    setSaving(false);
    if (ok) setReplyTarget(null);
  };

  // sadece firma sahibi yorumları yönetir; çalışan linkle gelirse bilgilendirilir
  // UI kontrolü — asıl yetki kontrolü backend'de yapılmalı
  if (user?.role === 'staff') {
    return (
      <EmptyState
        title="Bu sayfa sadece salon sahibi içindir"
        text="Yorumları salon sahibi yönetir."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Yorumlar"
        description="Müşterilerin randevu sonrası bıraktığı yorumlar. Onayladığın yorumlar salon sayfanda yayınlanır."
      />

      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Chips
          label="Durum"
          options={options}
          value={statusFilter}
          onChange={(status) => filters.set({ status })}
        />
      </div>

      <div
        className={
          filters.pending
            ? 'flex flex-col gap-4 pb-10 opacity-50 pointer-events-none'
            : 'flex flex-col gap-4 pb-10'
        }
      >
        {page.results.length === 0 ? (
          <EmptyState
            title={statusFilter ? 'Bu durumda yorum yok' : 'Henüz yorum yok'}
            text={
              statusFilter
                ? 'Başka bir durum seçmeyi dene.'
                : 'Randevu mailindeki linkten müşteriler yorum bıraktığında burada görünecek.'
            }
          />
        ) : (
          <CardGrid equal>
            {page.results.map((review) => {
              const meta = STATUS_META[review.status];
              return (
                <Card key={review.id} tone={meta.tone}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <strong className="block text-base leading-6 text-ck-ink break-words">
                        {review.customer}
                      </strong>
                      <Stars value={review.rating} size={16} />
                    </div>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>

                  {review.comment ? (
                    <p className="m-0 text-sm leading-6 text-slate-700 break-words whitespace-pre-line">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="m-0 text-sm text-slate-400">
                      Sadece puan verdi, yorum yazmadı.
                    </p>
                  )}

                  {review.reply && (
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                      <span className="block text-xs font-semibold text-slate-500">
                        Cevabın
                      </span>
                      <p className="m-0 mt-0.5 text-sm text-slate-700 break-words whitespace-pre-line">
                        {review.reply}
                      </p>
                    </div>
                  )}

                  <FieldGrid>
                    <Field label="Hizmet">{review.service_title}</Field>
                    <Field label="Kuaför">{review.staff || '-'}</Field>
                    <Field label="Yorum tarihi">
                      {formatDate(review.created_at)}
                    </Field>
                  </FieldGrid>

                  <CardActions>
                    {review.status === 'approved' ? (
                      <Button
                        size="small"
                        color="primaryOutline"
                        className="flex-1"
                        onClick={() =>
                          save(
                            review.id,
                            { status: 'hidden' },
                            'Yorum yayından kaldırıldı.',
                          )
                        }
                      >
                        Gizle
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        className="flex-1"
                        onClick={() =>
                          save(
                            review.id,
                            { status: 'approved' },
                            'Yorum yayınlandı.',
                          )
                        }
                      >
                        Onayla
                      </Button>
                    )}
                    {review.status === 'pending' && (
                      <Button
                        size="small"
                        color="primaryOutline"
                        onClick={() =>
                          save(
                            review.id,
                            { status: 'hidden' },
                            'Yorum gizlendi.',
                          )
                        }
                      >
                        Gizle
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="primaryOutline"
                      onClick={() => openReply(review)}
                    >
                      {review.reply ? 'Cevabı düzenle' : 'Cevapla'}
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </CardGrid>
        )}

        <Pagination
          page={page.page}
          totalPages={page.total_pages}
          count={page.count}
          pageSize={page.page_size}
          onPage={(p) => filters.set({ page: p })}
        />
      </div>

      <Modal
        size="small"
        title={`${replyTarget?.customer ?? ''} yorumuna cevap`}
        show={!!replyTarget}
        onClose={() => !saving && setReplyTarget(null)}
      >
        <ModalForm>
          <Textarea
            label="Cevabın"
            placeholder="Cevabın salon sayfasında yorumun altında görünür"
            value={replyText}
            maxLength={MAX_REPLY}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <ModalActions>
            <Button
              color="primaryOutline"
              disabled={saving}
              onClick={() => setReplyTarget(null)}
            >
              Vazgeç
            </Button>
            <Button color="primary" loading={saving} onClick={submitReply}>
              Kaydet
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>
    </>
  );
};

export default YorumlarContainer;
