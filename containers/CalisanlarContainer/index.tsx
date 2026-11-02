'use client';
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
import PhotoPicker from '@/components/panel/PhotoPicker';
import Select from '@/components/panel/Select';
import {
  createStaff,
  deleteStaff,
  deleteStaffPhoto,
  updateStaff,
  uploadStaffPhoto,
} from '@/services/staffService';
import { useAlertStore } from '@/stores/alertStore';
import IStaff from '@/types/IStaff';
import { apiErrorMessage } from '@/utils/apiError';
import { imageUrl } from '@/utils/apiUrl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface CalisanlarContainerProps {
  list: IStaff[];
}

interface FormData {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  is_active: boolean;
  photo: string;
}

const EMPTY: FormData = {
  name: '',
  surname: '',
  email: '',
  password: '',
  is_active: true,
  photo: '',
};

const initialsOf = (name: string, surname: string) =>
  ((name?.charAt(0) ?? '') + (surname?.charAt(0) ?? '')).toUpperCase();

const ACTIVE_OPTIONS = [
  { label: 'Aktif', value: true },
  { label: 'Pasif', value: false },
];

const CalisanlarContainer = ({ list }: CalisanlarContainerProps) => {
  const { addAlert } = useAlertStore();
  const router = useRouter();

  const [mode, setMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FormData>(EMPTY);
  // ekleme formunda seçilen fotoğraf, çalışan oluşunca yüklenir
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const notify = (type: 'success' | 'error', title: string, content: string) =>
    addAlert({ id: String(Date.now() + Math.random()), type, title, content });

  const close = () => {
    setMode(null);
    setData(EMPTY);
    setPhotoFile(null);
  };

  const handleCreate = async () => {
    setLoading(true);
    const [err, created] = await createStaff({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
    });

    if (err) {
      setLoading(false);
      return notify(
        'error',
        'Çalışan Oluşturulamadı',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    // çalışan oluştu; seçilen fotoğraf varsa yüklenir (başarısızsa sonradan eklenebilir)
    if (photoFile && created?.id) {
      const [photoErr] = await uploadStaffPhoto(created.id, photoFile);
      if (photoErr) {
        notify(
          'error',
          'Fotoğraf Yüklenemedi',
          apiErrorMessage(
            photoErr,
            'Çalışan eklendi, fotoğrafı düzenle ekranından tekrar deneyebilirsin.',
          ),
        );
      }
    }
    setLoading(false);

    notify(
      'success',
      'Çalışan Oluşturuldu',
      `${data.name} ${data.surname} artık bu e-posta ve şifreyle giriş yapabilir.`,
    );
    router.refresh();
    close();
  };

  const handleUpdate = async () => {
    if (!data.id) return;

    setLoading(true);
    const [err] = await updateStaff(data.id, {
      name: data.name,
      surname: data.surname,
      email: data.email,
      is_active: data.is_active,
      // boş bırakılırsa şifre değişmez
      ...(data.password ? { password: data.password } : {}),
    });
    setLoading(false);

    if (err) {
      return notify(
        'error',
        'Çalışan Güncellenemedi',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Çalışan Güncellendi', 'Bilgiler başarıyla güncellendi.');
    router.refresh();
    close();
  };

  const handleDelete = async () => {
    if (!data.id) return;

    setLoading(true);
    const [err] = await deleteStaff(data.id);
    setLoading(false);

    if (err) {
      return notify(
        'error',
        'Çalışan Silinemedi',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    notify('success', 'Çalışan Silindi', 'Çalışan başarıyla silindi.');
    router.refresh();
    close();
  };

  const openEdit = (item: IStaff, nextMode: 'edit' | 'delete') => {
    setData({
      id: item.id,
      name: item.name,
      surname: item.surname,
      email: item.email,
      password: '',
      is_active: item.is_active,
      photo: item.photo || '',
    });
    setMode(nextMode);
  };

  // düzenleme ekranında fotoğraf seçilir seçilmez yüklenir (Güncelle'ye basmak gerekmez)
  const handleUploadPhoto = async (file: File) => {
    if (!data.id) return;

    setPhotoLoading(true);
    const [err, updated] = await uploadStaffPhoto(data.id, file);
    setPhotoLoading(false);

    if (err) {
      return notify(
        'error',
        'Fotoğraf Yüklenemedi',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    setData((prev) => ({ ...prev, photo: updated?.photo || '' }));
    notify('success', 'Fotoğraf Yüklendi', 'Çalışanın fotoğrafı güncellendi.');
    router.refresh();
  };

  const handleRemovePhoto = async () => {
    if (!data.id) return;

    setPhotoLoading(true);
    const [err] = await deleteStaffPhoto(data.id);
    setPhotoLoading(false);

    if (err) {
      return notify(
        'error',
        'Fotoğraf Kaldırılamadı',
        apiErrorMessage(err, 'Bir hata oluştu, lütfen tekrar deneyin.'),
      );
    }

    setData((prev) => ({ ...prev, photo: '' }));
    notify('success', 'Fotoğraf Kaldırıldı', 'Çalışanın fotoğrafı kaldırıldı.');
    router.refresh();
  };

  return (
    <>
      <PageHeader
        title="Çalışanlar"
        description="Salonunda çalışan kuaförleri buradan ekle. Her çalışan kendi e-posta ve şifresiyle girer, sadece kendi randevularını ve hediyelerini görür. Müşteriler randevu alırken bu listeden kuaför seçer."
        action={
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setData(EMPTY);
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
            title="Henüz çalışan eklemedin"
            text="Çalışan eklemezsen müşteriler kuaför seçmeden doğrudan salondan randevu alır."
          />
        ) : (
          <CardGrid>
            {list.map((item) => (
              <Card key={item.id} tone={item.is_active ? 'wine' : 'slate'}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 min-w-10 rounded-full overflow-hidden bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {item.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl(item.photo)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initialsOf(item.name, item.surname)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block text-base text-ck-ink truncate">
                      {item.name} {item.surname}
                    </strong>
                    <span className="block text-sm text-slate-500 truncate">
                      {item.email}
                    </span>
                  </div>
                  <Badge tone={item.is_active ? 'wine' : 'slate'}>
                    {item.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>

                <FieldGrid>
                  <Field label="Randevu sayısı">{item.meeting_count}</Field>
                  <Field label="Giriş">E-posta + şifre</Field>
                </FieldGrid>

                <CardActions>
                  <Button
                    className="flex-1"
                    size="small"
                    color="primaryOutline"
                    onClick={() => openEdit(item, 'edit')}
                  >
                    Güncelle
                  </Button>
                  <Button
                    size="small"
                    color="white"
                    className="!text-red-500 hover:!bg-red-50"
                    onClick={() => openEdit(item, 'delete')}
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
        title="Çalışan Ekle"
        show={mode === 'create'}
        onClose={close}
      >
        <ModalForm>
          <PhotoPicker
            file={photoFile}
            initials={initialsOf(data.name, data.surname)}
            onPick={setPhotoFile}
            onRemove={() => setPhotoFile(null)}
            onError={(m) => notify('error', 'Fotoğraf', m)}
          />
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            label="Ad"
          />
          <Input
            value={data.surname}
            onChange={(e) => setData({ ...data, surname: e.target.value })}
            label="Soyad"
          />
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            label="E-posta (giriş için)"
          />
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            label="Şifre (en az 6 karakter)"
          />

          <ModalActions>
            <Button color="primaryOutline" onClick={close}>
              Vazgeç
            </Button>
            <Button color="primary" loading={loading} onClick={handleCreate}>
              Kaydet
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      <Modal
        size="xSmall"
        title="Çalışanı Düzenle"
        show={mode === 'edit'}
        onClose={close}
      >
        <ModalForm>
          <PhotoPicker
            src={data.photo ? imageUrl(data.photo) : null}
            initials={initialsOf(data.name, data.surname)}
            loading={photoLoading}
            onPick={handleUploadPhoto}
            onRemove={handleRemovePhoto}
            onError={(m) => notify('error', 'Fotoğraf', m)}
          />
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            label="Ad"
          />
          <Input
            value={data.surname}
            onChange={(e) => setData({ ...data, surname: e.target.value })}
            label="Soyad"
          />
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            label="E-posta (giriş için)"
          />
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            label="Yeni şifre (boş bırakırsan değişmez)"
          />
          <Select
            label="Durum"
            options={ACTIVE_OPTIONS}
            value={data.is_active}
            onSelect={(e) => setData({ ...data, is_active: e })}
          />
          <p className="text-xs text-slate-500 -mt-2">
            Pasif çalışan randevuda seçilemez ve panele giriş yapamaz.
          </p>

          <ModalActions>
            <Button color="primaryOutline" onClick={close}>
              Vazgeç
            </Button>
            <Button color="primary" loading={loading} onClick={handleUpdate}>
              Güncelle
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      <Modal
        size="xSmall"
        title="Silmek istediğine emin misin?"
        show={mode === 'delete'}
        onClose={close}
      >
        <ModalForm>
          <p>
            <strong>
              &quot;{data.name} {data.surname}&quot;
            </strong>{' '}
            adlı çalışanı silmek üzeresin. Bu işlem geri alınamaz. Randevusu
            olan bir çalışan silinemez, onu pasif yapabilirsin.
          </p>

          <ModalActions>
            <Button color="primaryOutline" onClick={close}>
              Vazgeç
            </Button>
            <Button color="red" loading={loading} onClick={handleDelete}>
              Sil
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>
    </>
  );
};

export default CalisanlarContainer;
