'use client';
import Button from '@/components/panel/Button';
import Input from '@/components/panel/Input';
import Modal from '@/components/panel/Modal';
import Textarea from '@/components/panel/Textarea';
import {
  createHediyeCarki,
  deleteHediyeCarki,
  updateHediyeCarki,
} from '@/services/hediyeCarkiService';
import { useAlertStore } from '@/stores/alertStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface IItem {
  id?: number;
  title: string;
  chance: number;
  description: string;
  is_active: boolean;
  gift_color: string;
}

interface IHediyeCarkiContainerProps {
  list: IItem[] | [];
}

const HediyeCarkiContainer = ({ list }: IHediyeCarkiContainerProps) => {
  const { addAlert } = useAlertStore();
  const router = useRouter();

  const [loadings, setLoadings] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [data, setData] = useState<IItem>({
    title: '',
    chance: 20,
    description: '',
    is_active: true,
    gift_color: '',
  });

  const handleCreate = async () => {
    setLoadings((pre) => [...pre, 'create']);
    const [err, response] = await createHediyeCarki({
      ...data,
      chance: Number(data.chance) / 100,
    });
    setLoadings((pre) => pre.filter((item) => item !== 'create'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hediye Çarkı Oluşturulamadı',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hediye Çarkı Oluşturuldu',
      content: 'Hediye çarkı başarıyla oluşturuldu.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      chance: 0,
      description: '',
      is_active: true,
      gift_color: '',
    });
  };

  const handleUpdate = async () => {
    if (!data.id) return;

    setLoadings((pre) => [...pre, 'update']);
    const [err, response] = await updateHediyeCarki(data.id, {
      ...data,
      chance: Number(data.chance) / 100,
    });
    setLoadings((pre) => pre.filter((item) => item !== 'update'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hediye Çarkı Güncellenemedi',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hediye Çarkı Güncellendi',
      content: 'Hediye çarkı başarıyla güncellendi.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      chance: 0,
      description: '',
      is_active: true,
      gift_color: '',
    });
  };

  const handleDelete = async () => {
    if (!data.id) return;

    setLoadings((pre) => [...pre, 'delete']);
    const [err, response] = await deleteHediyeCarki(data.id);
    setLoadings((pre) => pre.filter((item) => item !== 'delete'));

    if (err) {
      return addAlert({
        id: String(Date.now()),
        type: 'error',
        title: 'Hediye Çarkı Silinemedi',
        content: err.message || 'Bir hata oluştu, lütfen tekrar deneyin.',
      });
    }

    addAlert({
      id: String(Date.now()),
      type: 'success',
      title: 'Hediye Çarkı Silindi',
      content: 'Hediye çarkı başarıyla silindi.',
    });

    router.refresh();
    setMode(null);
    setShowCreateModal(false);
    setData({
      title: '',
      chance: 0,
      description: '',
      is_active: true,
      gift_color: '',
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold">Hediye Çarkı</h2>
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

      <p className="p-3 box-border rounded-md border-orange-300 bg-orange-100 text-orange-500">
        Toplam yüzde oranı 100% olmalıdır. Aksi takdirde hediye çarkı çalışmaz.
        100%'e tamamlamak için <strong>"Kaybettiniz!"</strong> hediyesini
        kullanabilirsiniz.
      </p>

      <div className="w-full flex flex-col gap-2 pb-64">
        {list.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-0.5 p-2 box-border bg-white border border-slate-200 rounded-md"
          >
            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Hediye Adı:
              </span>
              <strong>{item.title}</strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Açıklama:
              </span>
              <strong className="text-black/70 font-medium">
                {item.description}
              </strong>
            </div>

            <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
              <span className="inline-block w-[130px] min-w-[130px]">
                Şans:
              </span>
              <strong>{(item.chance * 100).toFixed(2)}%</strong>
            </div>

            {item.gift_color && (
              <div className="flex flex-col gap-1 text-sm px-2 py-1 box-border">
                <span className="inline-block w-[130px] min-w-[130px]">
                  Renk:
                </span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: item.gift_color,
                  }}
                ></div>
              </div>
            )}

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
                    chance: item.chance * 100,
                    description: item.description,
                    gift_color: '',
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
                    chance: item.chance * 100,
                    description: item.description,
                    gift_color: '',
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
          <h3 className="text-2xl font-semibold">Hediye Çarkı Oluştur</h3>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Hediye Adı"
          />

          <div className="flex items-center gap-2">
            <Input
              value={data.chance}
              onChange={(e) =>
                setData({ ...data, chance: Number(e.target.value) })
              }
              placeholder="Şans (%)"
            />
            <span className="text-xl">%</span>
          </div>

          <Input
            label="Renk"
            type="color"
            value={data.gift_color}
            onChange={(e) => setData({ ...data, gift_color: e.target.value })}
            placeholder="Hediye Rengi"
            className="max-w-[50px] !p-0"
          />

          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Açıklama"
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
            placeholder="Hediye Adı"
          />

          <div className="flex items-center gap-2">
            <Input
              value={data.chance}
              onChange={(e) =>
                setData({ ...data, chance: Number(e.target.value) })
              }
              placeholder="Şans (%)"
            />
            <span className="text-xl">%</span>
          </div>

          <Input
            label="Renk"
            type="color"
            value={data.gift_color}
            onChange={(e) => setData({ ...data, gift_color: e.target.value })}
            placeholder="Hediye Rengi"
            className="max-w-[50px] !p-0"
          />

          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Açıklama"
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
            <strong>"{data.title}"</strong> adlı hediye çarkını silmek
            üzeresiniz. Bu işlem geri alınamaz.
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

export default HediyeCarkiContainer;
