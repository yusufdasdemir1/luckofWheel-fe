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
import Input from '@/components/panel/Input';
import Modal, { ModalActions, ModalForm } from '@/components/panel/Modal';
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
        content: apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
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
        content: apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
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
        content: apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
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
      <PageHeader
        title="Hizmetler"
        description="Müşterilerin randevu alırken seçtiği hizmetler, fiyatları ve süreleri."
        action={
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setShowCreateModal(true);
              setMode('create');
            }}
          >
            + Yeni Ekle
          </Button>
        }
      />

      <div className="pb-10">
        {list.length === 0 ? (
          <EmptyState
            title="Henüz hizmet eklemedin"
            text="Müşterilerin randevu alabilmesi için en az bir hizmet ekle."
          />
        ) : (
          <CardGrid>
            {list.map((item) => (
              <Card key={item.id} tone={item.is_active ? 'wine' : 'slate'}>
                <div className="flex items-start justify-between gap-3">
                  <strong className="text-base text-ck-ink break-words min-w-0">
                    {item.title}
                  </strong>
                  <Badge tone={item.is_active ? 'wine' : 'slate'}>
                    {item.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-sm text-slate-500 m-0 break-words">
                    {item.description}
                  </p>
                )}

                <FieldGrid>
                  <Field label="Fiyat">{item.price} TL</Field>
                  <Field label="Süre">{item.duration} dakika</Field>
                </FieldGrid>

                <CardActions>
                  <Button
                    className="flex-1"
                    size="small"
                    color="primaryOutline"
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
                    size="small"
                    color="white"
                    className="!text-red-500 hover:!bg-red-50"
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
                </CardActions>
              </Card>
            ))}
          </CardGrid>
        )}
      </div>

      <Modal
        size="xSmall"
        title="Hizmet Oluştur"
        show={showCreateModal && mode === 'create'}
        onClose={() => setShowCreateModal(false)}
      >
        <ModalForm>
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

          <ModalActions>
            <Button
              color="primaryOutline"
              onClick={() => setShowCreateModal(false)}
            >
              Vazgeç
            </Button>
            <Button
              color="primary"
              loading={loadings.includes('create')}
              onClick={handleCreate}
            >
              Kaydet
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      <Modal
        size="xSmall"
        title="Düzenle"
        show={showCreateModal && mode === 'edit'}
        onClose={() => setShowCreateModal(false)}
      >
        <ModalForm>
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

          <ModalActions>
            <Button
              color="primaryOutline"
              onClick={() => setShowCreateModal(false)}
            >
              Vazgeç
            </Button>
            <Button
              color="primary"
              loading={loadings.includes('edit')}
              onClick={handleUpdate}
            >
              Güncelle
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      <Modal
        size="xSmall"
        title="Silmek istediğine emin misin?"
        show={showCreateModal && mode === 'delete'}
        onClose={() => setShowCreateModal(false)}
      >
        <ModalForm>
          <p>
            <strong>&quot;{data.title}&quot;</strong> adlı hizmeti silmek üzeresiniz. Bu
            işlem geri alınamaz.
          </p>

          <ModalActions>
            <Button
              color="primaryOutline"
              onClick={() => setShowCreateModal(false)}
            >
              Vazgeç
            </Button>
            <Button
              color="red"
              loading={loadings.includes('delete')}
              onClick={handleDelete}
            >
              Sil
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>
    </>
  );
};

export default ServicesContainer;
