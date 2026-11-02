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
  DateRange,
  Pagination,
  SearchBox,
  SelectBox,
  useUrlFilters,
} from '@/components/panel/ListTools';
import { whatsappUrl } from '@/components/salon/contact';
import PanelStats, { IMeetingStats } from '@/components/panel/PanelStats';
import { updateGiftStatus } from '@/services/hediyeCarkiService';
import {
  bulkDeleteRandevu,
  deleteRandevu,
  updateRandevu,
} from '@/services/randevuService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import IPage from '@/types/IPage';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaTrashAlt, FaWhatsapp } from 'react-icons/fa';
import {
  IoCallOutline,
  IoClose,
  IoGiftOutline,
  IoOptionsOutline,
} from 'react-icons/io5';

interface IItem {
  id: number;
  user_name: string;
  user_surname: string;
  date: string;
  time: string;
  end_time: string;
  status: 'waiting' | 'arrived' | 'canceled';
  service_title: string;
  service_price: string;
  user_phone: string;
  note: string | null;
  staff_name?: string | null;
  created_at?: string;
  unused_gifts?: {
    id: number;
    title: string;
    description: string;
    created_at?: string;
  }[];
}

type MeetingPage = IPage<IItem, { staff?: { id: number; name: string }[] }>;

const STATUS = {
  waiting: { tone: 'orange', label: 'Beklemede' },
  arrived: { tone: 'green', label: 'Geldi' },
  canceled: { tone: 'red', label: 'İptal edildi' },
} as const;

const WHEN_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'today', label: 'Bugün' },
  { value: 'tomorrow', label: 'Yarın' },
  { value: 'week', label: 'Bu hafta' },
  { value: 'upcoming', label: 'Yaklaşan' },
  { value: 'past', label: 'Geçmiş' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'waiting', label: 'Beklemede' },
  { value: 'arrived', label: 'Geldi' },
  { value: 'canceled', label: 'İptal' },
];

interface ActiveTag {
  key: string;
  label: string;
  clear: Record<string, string>;
}

const CONTACT_BTN =
  'h-9 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-ck-ink no-underline inline-flex items-center justify-center gap-2 transition-colors hover:border-primary hover:text-primary';

const FILTER_KEYS = ['q', 'when', 'status', 'staff_id', 'date_from', 'date_to'];

const formatDay = (date: string) => {
  const parsed = DateTime.fromISO(date);
  if (!parsed.isValid) return date;
  const today = DateTime.now().setZone('Europe/Istanbul').startOf('day');
  const diff = Math.round(parsed.startOf('day').diff(today, 'days').days);
  const label = parsed.setLocale('tr').toFormat('d MMMM cccc');
  if (diff === 0) return `Bugün · ${label}`;
  if (diff === 1) return `Yarın · ${label}`;
  return label;
};

const formatCreated = (value?: string) => {
  const parsed = value ? DateTime.fromISO(value) : null;
  return parsed?.isValid
    ? parsed
        .setZone('Europe/Istanbul')
        .setLocale('tr')
        .toFormat('d MMM yyyy HH:mm')
    : '-';
};

const initials = (name: string, surname: string) =>
  `${name?.charAt(0) ?? ''}${surname?.charAt(0) ?? ''}`.toUpperCase();

interface RandevularContainerProps {
  page: MeetingPage;
  stats?: IMeetingStats | null;
}

const RandevularContainer = ({ page, stats }: RandevularContainerProps) => {
  const router = useRouter();
  const { addAlert } = useAlertStore();
  const { user } = useAuthStore();
  const filters = useUrlFilters();

  const [activeId, setActiveId] = React.useState<number | null>(null);
  // silme onayı: seçilen randevu
  const [deleteTarget, setDeleteTarget] = React.useState<IItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // UI kontrolü — asıl yetki kontrolü backend'de yapılmalı
  const isStaff = user?.role === 'staff';
  const list = page.results;
  const bulk = useBulkSelect(list.map((item) => item.id));
  const [showBulkConfirm, setShowBulkConfirm] = React.useState(false);
  const [bulkDeleting, setBulkDeleting] = React.useState(false);
  const staffOptions = [
    { value: '', label: 'Tüm kuaförler' },
    ...(page.filters?.staff ?? []).map((s) => ({
      value: String(s.id),
      label: s.name,
    })),
  ];
  const hasFilters = FILTER_KEYS.some((key) => filters.get(key));
  const [showMore, setShowMore] = React.useState(false);

  const labelOf = (options: { value: string; label: string }[], v: string) =>
    options.find((o) => o.value === v)?.label ?? v;
  const shortDay = (iso: string) =>
    DateTime.fromISO(iso).setLocale('tr').toFormat('d MMM');

  const dateFrom = filters.get('date_from');
  const dateTo = filters.get('date_to');
  const activeTags: ActiveTag[] = [];
  if (filters.get('when'))
    activeTags.push({
      key: 'when',
      label: labelOf(WHEN_OPTIONS, filters.get('when')),
      clear: { when: '' },
    });
  if (filters.get('status'))
    activeTags.push({
      key: 'status',
      label: labelOf(STATUS_OPTIONS, filters.get('status')),
      clear: { status: '' },
    });
  if (!isStaff && filters.get('staff_id'))
    activeTags.push({
      key: 'staff_id',
      label: labelOf(staffOptions, filters.get('staff_id')),
      clear: { staff_id: '' },
    });
  if (dateFrom || dateTo)
    activeTags.push({
      key: 'date',
      label:
        dateFrom && dateTo
          ? `${shortDay(dateFrom)} – ${shortDay(dateTo)}`
          : dateFrom
            ? `${shortDay(dateFrom)} sonrası`
            : `${shortDay(dateTo)} öncesi`,
      clear: { date_from: '', date_to: '' },
    });
  // mobilde gizlenen filtrelerden kaç tanesi aktif
  const advancedCount = ['status', 'staff_id', 'date_from', 'date_to'].filter(
    (k) => filters.get(k),
  ).length;

  const notify = (type: 'success' | 'error', title: string, content: string) =>
    addAlert({ id: String(Date.now() + Math.random()), type, title, content });

  const handleUpdateStatus = async (
    id: number,
    status: 'arrived' | 'canceled',
  ) => {
    const [err] = await updateRandevu(id, { status });

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Randevu durumu güncellenemedi, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Başarılı', 'Randevu durumu başarıyla güncellendi.');
    router.refresh();
  };

  const handleDeleteRandevu = async (id: number) => {
    const [err] = await deleteRandevu(id);
    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Randevu silinemedi, lütfen tekrar deneyin.'),
      );
    }

    router.refresh();
    notify('success', 'Başarılı', 'Randevu başarıyla silindi.');
  };

  const confirmBulkDelete = async () => {
    setBulkDeleting(true);
    const [err, res] = await bulkDeleteRandevu(bulk.ids);
    setBulkDeleting(false);

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Randevular silinemedi, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Başarılı', `${res.deleted} randevu silindi.`);
    setShowBulkConfirm(false);
    bulk.cancel();
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await handleDeleteRandevu(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleUseGift = async (giftId: number) => {
    const [err] = await updateGiftStatus(giftId, { is_used: true });

    if (err) {
      return notify(
        'error',
        'Hata',
        apiErrorMessage(err, 'Hediye kullanılamadı, lütfen tekrar deneyin.'),
      );
    }

    router.refresh();
    notify('success', 'Başarılı', 'Hediye başarıyla kullanıldı.');
  };

  return (
    <>
      <PageHeader
        title={isStaff ? 'Randevularım' : 'Randevular'}
        description={
          isStaff
            ? 'Sana atanan randevuları buradan takip edersin.'
            : 'Salonundaki tüm randevuları ara, filtrele ve yönet.'
        }
        action={
          !isStaff && list.length > 0 && !bulk.selecting ? (
            <Button size="small" color="primaryOutline" onClick={bulk.start}>
              Toplu seç
            </Button>
          ) : undefined
        }
      />

      {stats && <PanelStats stats={stats} />}

      {/* arama + filtreler: seçimler anında uygulanır, arama ve tarih sakinleşince */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <SearchBox
            value={filters.get('q')}
            onChange={(q) => filters.set({ q })}
            placeholder="Müşteri adı, telefon, işlem veya kuaför ara"
          />
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            className="sm:hidden shrink-0 relative h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <IoOptionsOutline size={18} />
            Filtre
            {advancedCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {advancedCount}
              </span>
            )}
          </button>
        </div>

        <Chips
          label="Zaman"
          options={WHEN_OPTIONS}
          value={filters.get('when')}
          onChange={(when) =>
            // hızlı zaman seçimi ile tarih aralığı birbirini dışlar
            filters.set({ when, date_from: '', date_to: '' })
          }
        />

        <div
          className={classNames(
            'flex-col gap-3 lg:flex-row lg:items-center lg:justify-between sm:flex',
            showMore ? 'flex' : 'hidden',
          )}
        >
          <Chips
            label="Durum"
            options={STATUS_OPTIONS}
            value={filters.get('status')}
            onChange={(status) => filters.set({ status })}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:gap-x-4 w-full lg:w-auto">
            <DateRange
              label="Tarih"
              from={filters.get('date_from')}
              to={filters.get('date_to')}
              onChange={({ from, to }) =>
                filters.set({ date_from: from, date_to: to, when: '' })
              }
            />

            {!isStaff && staffOptions.length > 1 && (
              <SelectBox
                label="Kuaför"
                value={filters.get('staff_id')}
                options={staffOptions}
                onChange={(staff_id) => filters.set({ staff_id })}
              />
            )}
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              {page.count} randevu
            </span>

            {activeTags.map((tag) => (
              <button
                key={tag.key}
                type="button"
                onClick={() => filters.set(tag.clear)}
                aria-label={`${tag.label} filtresini kaldır`}
                className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border-0 cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {tag.label}
                <IoClose size={14} />
              </button>
            ))}

            <button
              type="button"
              onClick={() => filters.clear(FILTER_KEYS)}
              className="ml-auto text-xs font-medium text-slate-500 hover:text-primary bg-transparent border-0 cursor-pointer whitespace-nowrap"
            >
              Tümünü temizle
            </button>
          </div>
        )}
      </div>

      <div
        className={classNames(
          'flex flex-col gap-4 transition-opacity',
          bulk.selecting ? 'pb-32' : 'pb-10',
          filters.pending && 'opacity-50 pointer-events-none',
        )}
      >
        {list.length === 0 ? (
          <EmptyState
            title={
              hasFilters
                ? 'Bu filtrelere uyan randevu yok'
                : 'Henüz randevu bulunmuyor'
            }
            text={
              hasFilters
                ? 'Arama veya filtreleri değiştirmeyi dene.'
                : 'Müşteriler randevu aldığında burada görünecek.'
            }
          />
        ) : (
          <CardGrid dense equal>
            {list.map((item) => {
              const status = STATUS[item.status];
              const gifts = item.unused_gifts ?? [];

              return (
                <Card
                  key={item.id}
                  tone={status.tone}
                  selecting={bulk.selecting}
                  selected={bulk.isSelected(item.id)}
                  onToggle={() => bulk.toggle(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex w-10 h-10 min-w-10 rounded-full bg-primary/10 text-primary text-sm font-bold items-center justify-center">
                      {initials(item.user_name, item.user_surname)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-base text-ck-ink truncate">
                        {item.user_name} {item.user_surname}
                      </strong>
                      <a
                        href={`tel:${item.user_phone}`}
                        className="inline-flex items-center gap-1 text-sm text-slate-500 no-underline hover:text-primary"
                      >
                        <IoCallOutline aria-hidden="true" />
                        {item.user_phone}
                      </a>
                    </div>
                    <div className="shrink-0">
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                    <span className="text-sm font-semibold text-ck-ink">
                      {formatDay(item.date)}
                    </span>
                    <span className="text-lg font-bold text-primary tabular-nums">
                      {item.time.slice(0, 5)}
                    </span>
                  </div>

                  <FieldGrid>
                    <Field label="İşlem">{item.service_title}</Field>
                    <Field label="Tutar">{item.service_price} TL</Field>
                    <Field label="Kuaför">{item.staff_name || '-'}</Field>
                    <Field label="Bitiş">{item.end_time.slice(0, 5)}</Field>
                    <Field label="Oluşturulma" className="col-span-2">
                      {formatCreated(item.created_at)}
                    </Field>
                  </FieldGrid>

                  {item.note && <Field label="Not">{item.note}</Field>}

                  {activeId === item.id && gifts.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-xl bg-primary/5 border border-primary/10 p-3">
                      <span className="text-xs font-semibold text-primary">
                        Kullanılmamış hediyeler
                      </span>
                      {gifts.map((gift) => (
                        <div
                          key={gift.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 bg-white rounded-lg border border-slate-200 p-2.5"
                        >
                          <div className="min-w-0">
                            <strong className="block text-sm break-words">
                              {gift.title}
                            </strong>
                            <span className="block text-xs text-slate-500 break-words">
                              {gift.description}
                            </span>
                            <span className="block text-xs text-slate-400 mt-0.5">
                              Kazanıldı: {formatCreated(gift.created_at)}
                            </span>
                          </div>
                          <Button
                            size="xSmall"
                            color="blue"
                            className="w-full sm:w-auto shrink-0"
                            onClick={() => handleUseGift(gift.id)}
                          >
                            Kullanıldı
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* müşteriye hızlı ulaşım: ara + WhatsApp */}
                  {item.user_phone && (
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${item.user_phone}`}
                        aria-label="Ara"
                        className={CONTACT_BTN}
                      >
                        <IoCallOutline size={16} aria-hidden="true" />
                        <span>Ara</span>
                      </a>
                      <a
                        href={whatsappUrl(
                          item.user_phone,
                          `Merhaba ${item.user_name}, ${formatDay(item.date)} saat ${item.time.slice(0, 5)} randevunuz hakkında yazıyoruz.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp ile yaz"
                        className={CONTACT_BTN}
                      >
                        <FaWhatsapp
                          size={16}
                          className="text-emerald-600"
                          aria-hidden="true"
                        />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}

                  <CardActions>
                    {item.status === 'waiting' && (
                      <>
                        <Button
                          size="small"
                          color="green"
                          className="flex-1"
                          onClick={() => handleUpdateStatus(item.id, 'arrived')}
                        >
                          Müşteri Geldi
                        </Button>
                        <Button
                          size="small"
                          color="red"
                          className="flex-1"
                          onClick={() =>
                            handleUpdateStatus(item.id, 'canceled')
                          }
                        >
                          İptal
                        </Button>
                      </>
                    )}

                    {gifts.length > 0 && (
                      <Button
                        size="small"
                        color="primaryOutline"
                        onClick={() =>
                          setActiveId(activeId === item.id ? null : item.id)
                        }
                      >
                        <IoGiftOutline />
                        {activeId === item.id
                          ? 'Gizle'
                          : `Hediye (${gifts.length})`}
                      </Button>
                    )}

                    {!isStaff && (
                      <Button
                        size="small"
                        color="white"
                        className="ml-auto shrink-0 !w-9 !min-h-9 !h-9 !p-0 !text-red-500 hover:!bg-red-50"
                        aria-label="Randevuyu sil"
                        title="Randevuyu sil"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <FaTrashAlt size={15} />
                      </Button>
                    )}
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
        size="xSmall"
        title="Silmek istediğine emin misin?"
        show={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
      >
        <ModalForm>
          <p className="m-0 text-sm text-slate-600">
            <strong className="text-ck-ink">
              {deleteTarget?.user_name} {deleteTarget?.user_surname}
            </strong>{' '}
            adlı müşterinin {deleteTarget && formatDay(deleteTarget.date)} saat{' '}
            {deleteTarget?.time.slice(0, 5)} randevusunu silmek üzeresin. Bu
            işlem geri alınamaz.
          </p>

          <ModalActions>
            <Button
              color="primaryOutline"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              Vazgeç
            </Button>
            <Button color="red" loading={deleting} onClick={confirmDelete}>
              Sil
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      <Modal
        size="xSmall"
        title="Silmek istediğine emin misin?"
        show={showBulkConfirm}
        onClose={() => !bulkDeleting && setShowBulkConfirm(false)}
      >
        <ModalForm>
          <p className="m-0 text-sm text-slate-600">
            Seçtiğin{' '}
            <strong className="text-ck-ink">{bulk.count} randevuyu</strong>{' '}
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
              {bulk.count} Randevuyu Sil
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {bulk.selecting && (
        <BulkBar
          count={bulk.count}
          total={list.length}
          allSelected={bulk.allSelected}
          onToggleAll={bulk.toggleAll}
          onCancel={bulk.cancel}
          onDelete={() => setShowBulkConfirm(true)}
        />
      )}
    </>
  );
};

export default RandevularContainer;
