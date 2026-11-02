'use client';
import Button from '@/components/panel/Button';
import { PageHeader } from '@/components/panel/Card';
import Checkbox from '@/components/panel/Checkbox';
import Input from '@/components/panel/Input';
import { saveWorkingHours } from '@/services/workingHoursService';
import { useAlertStore } from '@/stores/alertStore';
import IWorkingHour from '@/types/IWorkingHour';
import { apiErrorMessage } from '@/utils/apiError';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DAY_NAMES = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

interface CalismaSaatleriContainerProps {
  list: IWorkingHour[];
}

const CalismaSaatleriContainer = ({ list }: CalismaSaatleriContainerProps) => {
  const { addAlert } = useAlertStore();
  const router = useRouter();

  const [hours, setHours] = useState<IWorkingHour[]>(list);
  const [loading, setLoading] = useState(false);

  const notify = (type: 'success' | 'error', title: string, content: string) =>
    addAlert({ id: String(Date.now() + Math.random()), type, title, content });

  const change = (weekday: number, patch: Partial<IWorkingHour>) =>
    setHours((prev) =>
      prev.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)),
    );

  const handleSave = async () => {
    const invalid = hours.find((h) => !h.is_closed && h.opens >= h.closes);
    if (invalid) {
      return notify(
        'error',
        'Saatler Geçersiz',
        `${DAY_NAMES[invalid.weekday]}: kapanış saati açılış saatinden sonra olmalı.`,
      );
    }

    setLoading(true);
    const [err] = await saveWorkingHours(hours);
    setLoading(false);

    if (err) {
      return notify(
        'error',
        'Kaydedilemedi',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Kaydedildi', 'Çalışma saatleri güncellendi.');
    router.refresh();
  };

  return (
    <>
      <PageHeader
        title="Çalışma Saatleri"
        description="Müşteriler sadece açık olduğun gün ve saatlerde randevu alabilir. Randevu süresi kapanış saatini aşıyorsa o saat gösterilmez."
      />

      <div className="w-full flex flex-col gap-4 pb-24 max-w-[1100px]">
        <div className="grid gap-3 lg:grid-cols-2 items-stretch">
          {hours.map((h) => (
            <div
              key={h.weekday}
              className={classNames(
                'w-full flex flex-col gap-3 p-4 box-border bg-white border rounded-2xl shadow-sm transition-colors',
                h.is_closed
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-200',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <strong
                  className={classNames(
                    'text-base',
                    h.is_closed ? 'text-slate-400' : 'text-ck-ink',
                  )}
                >
                  {DAY_NAMES[h.weekday]}
                </strong>
                <Checkbox
                  title={h.is_closed ? 'Kapalı' : 'Açık'}
                  value={!h.is_closed}
                  onChange={(open) => change(h.weekday, { is_closed: !open })}
                />
              </div>

              {!h.is_closed && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="time"
                    label="Açılış"
                    value={h.opens}
                    onChange={(e) =>
                      change(h.weekday, { opens: e.target.value })
                    }
                  />
                  <Input
                    type="time"
                    label="Kapanış"
                    value={h.closes}
                    onChange={(e) =>
                      change(h.weekday, { closes: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-1">
          <Button color="primary" loading={loading} onClick={handleSave}>
            Kaydet
          </Button>
        </div>
      </div>
    </>
  );
};

export default CalismaSaatleriContainer;
