'use client';
import { apiErrorMessage } from '@/utils/apiError';
import Button from '@/components/panel/Button';
import { BulkBar, useBulkSelect } from '@/components/panel/BulkSelect';
import Modal, { ModalActions, ModalForm } from '@/components/panel/Modal';
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
import {
  Chips,
  Pagination,
  SearchBox,
  useUrlFilters,
} from '@/components/panel/ListTools';
import WinStats, { IWinStats } from '@/components/panel/WinStats';
import {
  bulkDeleteEarnedGifts,
  deleteEarnedGift,
  updateGiftStatus,
} from '@/services/hediyeCarkiService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import IPage from '@/types/IPage';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { IoGiftOutline } from 'react-icons/io5';

interface IWin {
  id: number;
  user_name: string;
  user_surname: string;
  gift_title: string;
  is_used: boolean;
  created_at: string;
  meeting_id: number | null;
  meeting_status: string | null;
}

interface KazanilanHediyelerContainerProps {
  page: IPage<IWin>;
  stats?: IWinStats | null;
}

const USED_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'false', label: 'Kullanılmadı' },
  { value: 'true', label: 'Kullanıldı' },
];

const FILTER_KEYS = ['q', 'is_used'];

const KazanilanHediyelerContainer = ({
  page,
  stats,
}: KazanilanHediyelerContainerProps) => {
  const router = useRouter();
  const { addAlert } = useAlertStore();
  const { user } = useAuthStore();
  const filters = useUrlFilters();

  // UI kontrolü — asıl yetki kontrolü backend'de yapılmalı
  const isStaff = user?.role === 'staff';
  const hasFilters = FILTER_KEYS.some((key) => filters.get(key));
  const bulk = useBulkSelect(page.results.map((item) => item.id));
  const [showBulkConfirm, setShowBulkConfirm] = React.useState(false);
  const [bulkDeleting, setBulkDeleting] = React.useState(false);

  const formatDate = (dateStr: string) => {
    const date = DateTime.fromISO(dateStr);
    return date.isValid
      ? date
          .setZone('Europe/Istanbul')
          .setLocale('tr')
          .toFormat('d MMM yyyy HH:mm')
      : dateStr;
  };

  const notify = (type: 'success' | 'error', title: string, content: string) =>
    addAlert({ id: String(Date.now() + Math.random()), type, title, content });

  const handleChangeStatusGift = async (giftId: number, status: boolean) => {
    const [err] = await updateGiftStatus(giftId, { is_used: status });

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Hediye durumu güncellenemedi, lütfen tekrar deneyin.'),
      );
    }

    router.refresh();
    notify(
      'success',
      'Başarılı',
      status
        ? 'Hediye kullanıldı olarak işaretlendi.'
        : 'Hediye kullanılmadı olarak işaretlendi.',
    );
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    const [err, res] = await bulkDeleteEarnedGifts(bulk.ids);
    setBulkDeleting(false);

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Hediyeler silinemedi, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Başarılı', `${res.deleted} hediye silindi.`);
    setShowBulkConfirm(false);
    bulk.cancel();
    router.refresh();
  };

  const handleDelete = async (giftId: number) => {
    const [err] = await deleteEarnedGift(giftId);

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Hediye silinemedi, lütfen tekrar deneyin.'),
      );
    }

    router.refresh();
    notify('success', 'Başarılı', 'Hediye başarıyla silindi.');
  };

  return (
    <>
      <PageHeader
        title="Kazanılan Hediyeler"
        description="Müşterilerin çarktan kazandığı hediyeler ve kullanım durumları."
        action={
          !isStaff && page.results.length > 0 && !bulk.selecting ? (
            <Button size="small" color="primaryOutline" onClick={bulk.start}>
              Toplu seç
            </Button>
          ) : undefined
        }
      />

      {stats && <WinStats stats={stats} />}

      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <SearchBox
          value={filters.get('q')}
          onChange={(q) => filters.set({ q })}
          placeholder="Müşteri adı veya hediye ara"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <Chips
              label="Durum"
              options={USED_OPTIONS}
              value={filters.get('is_used')}
              onChange={(is_used) => filters.set({ is_used })}
            />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => filters.clear(FILTER_KEYS)}
              className="self-end sm:self-auto shrink-0 text-sm font-medium text-primary hover:underline bg-transparent border-0 cursor-pointer whitespace-nowrap"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      <div
        className={classNames(
          'flex flex-col gap-4 transition-opacity',
          bulk.selecting ? 'pb-32' : 'pb-10',
          filters.pending && 'opacity-50 pointer-events-none',
        )}
      >
        {page.results.length === 0 ? (
          <EmptyState
            title={
              hasFilters
                ? 'Bu filtrelere uyan hediye yok'
                : 'Henüz kazanılan hediye yok'
            }
            text={
              hasFilters
                ? 'Arama veya filtreleri değiştirmeyi dene.'
                : 'Müşteriler çarkı çevirip hediye kazandığında burada görünecek.'
            }
          />
        ) : (
          <CardGrid equal>
            {page.results.map((item) => (
              <Card
                key={item.id}
                tone={item.is_used ? 'green' : 'wine'}
                selecting={bulk.selecting}
                selected={bulk.isSelected(item.id)}
                onToggle={() => bulk.toggle(item.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={classNames(
                      'w-10 h-10 min-w-10 rounded-full flex items-center justify-center',
                      item.is_used
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    <IoGiftOutline size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-base leading-6 text-ck-ink break-words min-h-12">
                      {item.gift_title}
                    </strong>
                    <span className="block text-sm text-slate-500 break-words">
                      {item.user_name} {item.user_surname}
                    </span>
                  </div>
                  <Badge tone={item.is_used ? 'green' : 'wine'}>
                    {item.is_used ? 'Kullanıldı' : 'Kullanılmadı'}
                  </Badge>
                </div>

                <FieldGrid>
                  <Field label="Oluşturulma tarihi">
                    {formatDate(item.created_at)}
                  </Field>
                  <Field label="Randevu">
                    {item.meeting_status === 'canceled' ? (
                      <span
                        className="text-red-600"
                        title="Bağlı randevu iptal edildi. Hediyeyi tutabilir ya da silebilirsin."
                      >
                        İptal edildi
                      </span>
                    ) : item.meeting_id ? (
                      'Bağlı'
                    ) : (
                      '-'
                    )}
                  </Field>
                </FieldGrid>

                <CardActions>
                  {item.is_used ? (
                    <Button
                      size="small"
                      color="primaryOutline"
                      className="flex-1"
                      onClick={() => handleChangeStatusGift(item.id, false)}
                    >
                      Kullanılmadı yap
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      className="flex-1"
                      onClick={() => handleChangeStatusGift(item.id, true)}
                    >
                      Kullanıldı yap
                    </Button>
                  )}

                  {!isStaff && (
                    <Button
                      size="small"
                      color="white"
                      className="shrink-0 !w-9 !min-h-9 !h-9 !p-0 !text-red-500 hover:!bg-red-50"
                      aria-label="Hediyeyi sil"
                      title="Hediyeyi sil"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt size={15} />
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
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
        size="xSmall"
        title="Silmek istediğine emin misin?"
        show={showBulkConfirm}
        onClose={() => !bulkDeleting && setShowBulkConfirm(false)}
      >
        <ModalForm>
          <p className="m-0 text-sm text-slate-600">
            Seçtiğin{' '}
            <strong className="text-ck-ink">
              {bulk.count} kazanılan hediyeyi
            </strong>{' '}
            silmek üzeresin. Bu işlem geri alınamaz.
          </p>

          <ModalActions>
            <Button
              color="primaryOutline"
              disabled={bulkDeleting}
              onClick={() => setShowBulkConfirm(false)}
            >
              Vazgeç
            </Button>
            <Button
              color="red"
              loading={bulkDeleting}
              onClick={confirmBulkDelete}
            >
              {bulk.count} Hediyeyi Sil
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {bulk.selecting && (
        <BulkBar
          count={bulk.count}
          total={page.results.length}
          allSelected={bulk.allSelected}
          onToggleAll={bulk.toggleAll}
          onCancel={bulk.cancel}
          onDelete={() => setShowBulkConfirm(true)}
        />
      )}
    </>
  );
};

export default KazanilanHediyelerContainer;
