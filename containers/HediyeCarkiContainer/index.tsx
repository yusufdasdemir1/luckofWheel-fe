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

const ACTIVE_OPTIONS = [
  { label: 'Aktif', value: true },
  { label: 'Pasif', value: false },
];

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
        content: apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
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
        content: err.non_field_errors
          ? err.non_field_errors.join(', ')
          : 'Bir hata oluştu, lütfen tekrar deneyin.',
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
        content: apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
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
      <PageHeader
        title="Hediye Çarkı"
        description="Çarkta çıkabilecek hediyeler ve kazanma şansları."
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

      <p className="m-0 p-3.5 box-border rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-700">
        Toplam yüzde oranı <strong>100%</strong> olmalıdır. Aksi takdirde hediye
        çarkı çalışmaz. 100%&apos;e tamamlamak için{' '}
        <strong>&quot;Kaybettiniz!&quot;</strong> hediyesini kullanabilirsiniz.
      </p>

      <div className="pb-10">
        {list.length === 0 ? (
          <EmptyState
            title="Henüz hediye eklemedin"
            text="Çarkın dönebilmesi için hediyeler ekle."
          />
        ) : (
          <CardGrid equal>
            {list.map((item, index) => (
              <Card
                key={item.id ?? index}
                tone={item.is_active ? 'wine' : 'slate'}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 min-w-4 mt-1 rounded-full shadow border border-slate-200"
                    style={{ backgroundColor: item.gift_color || '#cbd5e1' }}
                  />
                  <strong
                    title={item.title}
                    className="text-base leading-6 text-ck-ink break-words min-w-0 flex-1 min-h-12"
                  >
                    {item.title}
                  </strong>
                  <Badge tone={item.is_active ? 'wine' : 'slate'}>
                    {item.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>

                {/* açıklama olsun olmasın aynı yükseklik: 2 satır ayrılır */}
                <p
                  title={item.description || undefined}
                  className="text-sm text-slate-500 m-0 break-words line-clamp-2 min-h-10"
                >
                  {item.description}
                </p>

                <FieldGrid>
                  <Field label="Kazanma şansı">
                    {(item.chance * 100).toFixed(2)}%
                  </Field>
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
                        chance: item.chance * 100,
                        description: item.description,
                        gift_color: item.gift_color,
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
                        chance: item.chance * 100,
                        description: item.description,
                        gift_color: '',
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
        title="Hediye Çarkı Oluştur"
        show={showCreateModal && mode === 'create'}
        onClose={() => setShowCreateModal(false)}
      >
        <ModalForm>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            label="Hediye Adı"
          />

          <div className="flex items-end gap-2">
            <Input
              value={data.chance}
              onChange={(e) =>
                setData({ ...data, chance: Number(e.target.value) })
              }
              label="Şans (%)"
            />
            <span className="text-xl pb-2.5 text-slate-500">%</span>
          </div>

          <Select
            label="Durum"
            options={ACTIVE_OPTIONS}
            value={data.is_active}
            onSelect={(e) => setData({ ...data, is_active: e })}
          />

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
            label="Hediye Adı"
          />

          <div className="flex items-end gap-2">
            <Input
              value={data.chance}
              onChange={(e) =>
                setData({ ...data, chance: Number(e.target.value) })
              }
              label="Şans (%)"
            />
            <span className="text-xl pb-2.5 text-slate-500">%</span>
          </div>

          <Select
            label="Durum"
            options={ACTIVE_OPTIONS}
            value={data.is_active}
            onSelect={(e) => setData({ ...data, is_active: e })}
          />

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
            <strong>&quot;{data.title}&quot;</strong> adlı hediye çarkını silmek
            üzeresiniz. Bu işlem geri alınamaz.
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

export default HediyeCarkiContainer;
