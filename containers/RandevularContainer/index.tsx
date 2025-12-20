'use client';
import Button from '@/components/panel/Button';
import { deleteRandevu, updateRandevu } from '@/services/randevuService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

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
}

const STATUSES = {
  waiting: (
    <p className="bg-orange-200 text-orange-600 px-2.5 py-1 rounded-lg text-sm font-medium">
      Beklemede
    </p>
  ),
  arrived: (
    <p className="bg-green-200 text-green-600 px-2.5 py-1 rounded-lg text-sm font-medium">
      Geldi
    </p>
  ),
  canceled: (
    <p className="bg-red-200 text-red-600 px-2.5 py-1 rounded-lg text-sm font-medium">
      İptal Edildi
    </p>
  ),
};

interface RandevularContainerProps {
  list: IItem[];
}

const RandevularContainer = ({ list }: RandevularContainerProps) => {
  const router = useRouter();
  const { addAlert } = useAlertStore();
  const { user } = useAuthStore();

  const handleUpdateStatus = async (
    id: number,
    status: 'arrived' | 'canceled'
  ) => {
    const [err, response] = await updateRandevu(id, { status });

    if (err) {
      return addAlert({
        id: String(new Date().getTime()),
        title: 'Hata',
        type: 'error',
        content:
          err.message ||
          'Randevu durumu güncellenemedi, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(new Date().getTime()),
      title: 'Başarılı',
      type: 'success',
      content: 'Randevu durumu başarıyla güncellendi.',
    });

    router.refresh();
  };

  const handleDeleteRandevu = async (id: number) => {
    const [err, response] = await deleteRandevu(id);
    if (err) {
      return addAlert({
        id: String(new Date().getTime()),
        title: 'Hata',
        type: 'error',
        content: err.message || 'Randevu silinemedi, lütfen tekrar deneyin.',
      });
    }

    router.refresh();
    addAlert({
      id: String(new Date().getTime()),
      title: 'Başarılı',
      type: 'success',
      content: 'Randevu başarıyla silindi.',
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Randevular</h2>
      </div>

      <div className="w-full flex flex-col gap-2 pb-64">
        {list.length === 0 && (
          <p className="text-center text-gray-500 mr-auto">
            Randevunuz bulunmamaktadır.
          </p>
        )}

        {list.map((item: IItem, index: number) => (
          <div
            key={index}
            className={classNames(
              'w-full flex flex-col gap-0.5 p-2 box-border bg-green-500/10 border border-green-200  rounded-md',
              {
                '!bg-red-500/10 border-red-200': item.status === 'canceled',
                '!bg-orange-500/10 border-orange-200':
                  item.status === 'waiting',
              }
            )}
          >
            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <strong>{STATUSES[item.status]}</strong>
            </div>

            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Müşteri Adı</span>
              <span>:</span>
              <strong>
                {item.user_name} {item.user_surname}
              </strong>
            </div>

            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Müşteri Telefon</span>
              <span>:</span>
              <strong>{item.user_phone}</strong>
            </div>

            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Randevu Tarihi</span>
              <span>:</span>
              <strong>{item.date}</strong>
            </div>

            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Randevu Saati</span>
              <span>:</span>
              <strong>{item.time}</strong>
            </div>

            <div className="flex items-center gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">İşlem</span>
              <span>:</span>
              <strong>
                {item.service_title} ({item.service_price}TL)
              </strong>
            </div>

            <div className="flex flex-col gap-2 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px]">Not:</span>
              <strong>{item.note || '-'}</strong>
            </div>

            {item.status === 'waiting' && (
              <div className="w-full flex items-center gap-2 mt-4">
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
                  onClick={() => handleUpdateStatus(item.id, 'canceled')}
                >
                  Iptal
                </Button>
              </div>
            )}
            <Button
              size="small"
              color="red"
              className="flex-1 max-w-[100px] mt-2"
              onClick={() => handleDeleteRandevu(item.id)}
            >
              <FaTrashAlt /> Sil
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default RandevularContainer;
