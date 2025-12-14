'use client';
import Button from '@/components/panel/Button';
import Input from '@/components/panel/Input';
import Modal from '@/components/panel/Modal';
import Select from '@/components/panel/Select';
import Textarea from '@/components/panel/Textarea';
import {
  createService,
  deleteService,
  updateService,
} from '@/services/serviceService';
import { useAlertStore } from '@/stores/alertStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface IItem {
  id?: number;
  title: string;
  description: string;
  duration: number;
  price: string;
  is_active: boolean;
}

interface IServicesContainerProps {
  list: IItem[] | [];
}

const ACTIVE_OPTIONS = [
  { label: 'Aktif', value: true },
  { label: 'Pasif', value: false },
];

const ServicesContainer = ({ list }: IServicesContainerProps) => {
  const { addAlert } = useAlertStore();
  const router = useRouter();

  const [loadings, setLoadings] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [data, setData] = useState<IItem>({
    title: '',
    description: '',
    duration: 30,
    is_active: true,
    price: '0',
  });

  const handleCreate = async () => {
    setLoadings((pre) => [...pre, 'create']);
    const [err, response] = await createService({
      ...data,
    });
    setLoadings((pre) => pre.filter((item) => item !== 'create'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hizmet Oluşturulamadı',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hizmet Oluşturuldu',
      content: 'Hizmet başarıyla oluşturuldu.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      description: '',
      duration: 30,
      is_active: true,
      price: '0',
    });
  };

  const handleUpdate = async () => {
    if (!data.id) return;

    setLoadings((pre) => [...pre, 'update']);
    const [err, response] = await updateService(data.id, {
      ...data,
    });
    setLoadings((pre) => pre.filter((item) => item !== 'update'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hizmet Güncellenemedi',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hizmet Güncellendi',
      content: 'Hizmet başarıyla güncellendi.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      description: '',
      duration: 30,
      is_active: true,
      price: '0',
    });
  };

  const handleDelete = async () => {
    if (!data.id) return;

    setLoadings((pre) => [...pre, 'delete']);
    const [err, response] = await deleteService(data.id);
    setLoadings((pre) => pre.filter((item) => item !== 'delete'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hizmet Silinemedi',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hizmet Silindi',
      content: 'Hizmet başarıyla silindi.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      description: '',
      duration: 30,
      is_active: true,
      price: '0',
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Hizmet</h2>
        <Button
          size="small"
          className="ml-auto mt-4"
          color="green"
          onClick={() => {
            setShowCreateModal(true);
            setMode('create');
          }}
        >
          Yeni Ekle
        </Button>
      </div>

      <div className="w-full flex flex-col gap-2 pb-64">
        {list.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-0.5 p-2 box-border bg-white border border-slate-200 rounded-md"
          >
            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Hizmet Adı:
              </span>
              <strong>{item.title}</strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Açıklama:
              </span>
              <strong>{item.description}</strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Fiyat:
              </span>
              <strong>{Number(item.price).toFixed(2)} TL</strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Süre(Dakika):
              </span>
              <strong>{item.duration} Dakika</strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Durum:
              </span>
              <strong>{item.is_active ? 'Aktif' : 'Pasif'}</strong>
            </div>

            <div className="w-full flex items-center gap-2 mt-2">
              <Button
                className="!w-full"
                size="xSmall"
                color="green"
                onClick={() => {
                  setMode('edit');
                  setData({
                    id: item.id,
                    title: item.title,
                    is_active: item.is_active,
                    description: item.description,
                    price: item.price,
                    duration: item.duration,
                  });
                  setShowCreateModal(true);
                }}
              >
                Güncelle
              </Button>
              <Button
                className="!w-full"
                size="xSmall"
                color="red"
                onClick={() => {
                  setMode('delete');
                  setData({
                    id: item.id,
                    title: item.title,
                    is_active: item.is_active,
                    description: item.description,
                    price: item.price,
                    duration: item.duration,
                  });
                  setShowCreateModal(true);
                }}
              >
                Sil
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        size="xSmall"
        show={showCreateModal && mode === 'create'}
        onClose={() => setShowCreateModal(false)}
      >
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Hizmet Oluştur</h3>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            label="Hizmet Adı"
          />

          <Input
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            label="Fiyat"
          />

          <Input
            value={data.duration}
            onChange={(e) =>
              setData({ ...data, duration: Number(e.target.value) })
            }
            label="Süre (Dakika)"
          />

          <Select
            label="Durum"
            options={ACTIVE_OPTIONS}
            value={data.is_active}
            onSelect={(e) => setData({ ...data, is_active: e })}
          />

          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            label="Açıklama"
          />

          <Button
            color="green"
            loading={loadings.includes('create')}
            onClick={handleCreate}
          >
            Kaydet
          </Button>
        </div>
      </Modal>

      <Modal
        size="xSmall"
        show={showCreateModal && mode === 'edit'}
        onClose={() => setShowCreateModal(false)}
      >
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Düzenle</h3>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            label="Hizmet Adı"
          />

          <Input
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            label="Fiyat"
          />

          <Input
            value={data.duration}
            onChange={(e) =>
              setData({ ...data, duration: Number(e.target.value) })
            }
            label="Süre (Dakika)"
          />

          <Select
            label="Durum"
            options={ACTIVE_OPTIONS}
            value={data.is_active}
            onSelect={(e) => setData({ ...data, is_active: e })}
          />

          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            label="Açıklama"
          />

          <Button
            color="green"
            loading={loadings.includes('edit')}
            onClick={handleUpdate}
          >
            Güncelle
          </Button>
        </div>
      </Modal>

      <Modal
        size="xSmall"
        show={showCreateModal && mode === 'delete'}
        onClose={() => setShowCreateModal(false)}
      >
        <div className="w-full flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">
            Silmek istediğine emin misin?
          </h3>
          <p>
            <strong>"{data.title}"</strong> adlı hizmeti silmek üzeresiniz. Bu
            işlem geri alınamaz.
          </p>

          <Button
            color="red"
            loading={loadings.includes('delete')}
            onClick={handleDelete}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ServicesContainer;
