'use client';
import Button from '@/components/panel/Button';
import { updateGiftStatus } from '@/services/hediyeCarkiService';
import { useAlertStore } from '@/stores/alertStore';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import React from 'react';

interface KazanilanHediyelerContainerProps {
  list: any[];
}

const KazanilanHediyelerContainer = ({
  list = [],
}: KazanilanHediyelerContainerProps) => {
  const router = useRouter();
  const { addAlert } = useAlertStore();

  const formatDate = (dateStr: string) => {
    const date = DateTime.fromISO(dateStr);
    return date.isValid
      ? date.setLocale('tr').toLocaleString(DateTime.DATETIME_MED)
      : dateStr;
  };

  const handleChangeStatusGift = async (giftId: number, status: boolean) => {
    const [err, response] = await updateGiftStatus(giftId, {
      is_used: status,
    });

    if (err) {
      return addAlert({
        id: String(new Date().getTime()),
        title: 'Hata',
        type: 'error',
        content: err.message || 'Hediye kullanılamadı, lütfen tekrar deneyin.',
      });
    }

    router.refresh();
    addAlert({
      id: String(new Date().getTime()),
      title: 'Başarılı',
      type: 'success',
      content: 'Hediye başarıyla kullanıldı.',
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Kazanılan Hediyeler</h2>
      </div>

      <div className="w-full flex flex-col gap-2 md:max-w-[400px]">
        {list.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-col p-2 box-border bg-white border border-slate-200 rounded-md"
          >
            <div className="flex flex-col text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Ad Soyad:</span>
              <strong>{`${item.user_name} ${item.user_surname}`}</strong>
            </div>

            <div className="flex flex-col text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Hediye:</span>
              <strong>{item.gift_title}</strong>
            </div>

            <div className="flex flex-col text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Kazanma Zamanı:</span>
              <strong>{formatDate(item.created_at)}</strong>
            </div>

            <div className="flex flex-col text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Durum:</span>
              <strong>
                {item.is_used ? (
                  <span className="text-red-600">Kullanıldı</span>
                ) : (
                  <span className="text-green-600">Kullanılmadı</span>
                )}
              </strong>
            </div>

            {item.is_used ? (
              <Button
                size="small"
                color="green"
                className="flex-1"
                onClick={() => handleChangeStatusGift(item.id, false)}
              >
                Kullanılmadı Olarak İşaretle
              </Button>
            ) : (
              <Button
                size="small"
                color="red"
                className="flex-1"
                onClick={() => handleChangeStatusGift(item.id, true)}
              >
                Kullanıldı Olarak İşaretle
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default KazanilanHediyelerContainer;
