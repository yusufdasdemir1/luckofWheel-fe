'use client';
import Button from '@/components/panel/Button';
import Checkbox from '@/components/panel/Checkbox';
import Input from '@/components/panel/Input';
import Textarea from '@/components/panel/Textarea';
import { updateCompanyInfos } from '@/services/companyService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const FirmaAyarlariContainer = () => {
  const router = useRouter();
  const { addAlert } = useAlertStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: user?.company?.title || '',
    description: user?.company?.description || '',
    phone: user?.company?.phone ? user.company.phone.replace('+90', '') : '',
    email: user?.company?.email || '',
    show_before_meeting: user?.company?.show_before_meeting || false,
    is_show_wheel: user?.company?.is_show_wheel || false,
    spin_cooldown_hours: user?.company?.spin_cooldown_hours || 24,
    embed_address: user?.company?.embed_address || '',
    address_text: user?.company?.address_text || '',
    company_color: user?.company?.company_color || '#000000',
    city: user?.company?.city || '',
    district: user?.company?.district || '',
    youtube_url: user?.company?.youtube_url || '',
    instagram_url: user?.company?.instagram_url || '',
    facebook_url: user?.company?.facebook_url || '',
  });

  const handleChangeData = (field: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    const [error, result] = await updateCompanyInfos(
      user?.company?.slug || '',
      { ...data, phone: '+90' + data.phone }
    );
    setLoading(false);

    if (error) {
      return addAlert({
        id: String(Math.random().toString(36).substring(2, 9)),
        title: 'Hata',
        type: 'error',
        content: error.message || 'Güncelleme sırasında bir hata oluştu.',
      });
    }

    addAlert({
      id: String(Math.random().toString(36).substring(2, 9)),
      type: 'success',
      title: 'Başarılı',
      content: 'Firma bilgileri başarıyla güncellendi.',
    });
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 max-w-[460px] pb-64">
      <h2 className="text-3xl font-semibold">Firma Ayarları</h2>

      <Input
        label="Firma Adı"
        value={data.title}
        onChange={(e) => handleChangeData('title', e.target.value)}
      />

      <div className="w-full flex flex-col gap-1">
        <span className="text-sm text-black/90">Telefon</span>

        <div className="flex items-end">
          <div className="w-[50px] min-w-[50px] h-[45px] flex items-center justify-center bg-white border border-[#AEAEAE] text-sm font-medium rounded-l-md">
            +90
          </div>
          <Input
            value={data.phone}
            onChange={(e) => handleChangeData('phone', e.target.value)}
          />
        </div>
      </div>

      <Input
        label="Firma E-Posta"
        value={data.email}
        onChange={(e) => handleChangeData('email', e.target.value)}
      />
      <Input
        label="Firma Çark Yeniden Dönme Süresi (Saat)"
        value={data.spin_cooldown_hours}
        onChange={(e) =>
          handleChangeData('spin_cooldown_hours', e.target.value)
        }
      />
      <Input
        label="İl"
        value={data.city}
        onChange={(e) => handleChangeData('city', e.target.value)}
      />
      <Input
        label="İlçe"
        value={data.district}
        onChange={(e) => handleChangeData('district', e.target.value)}
      />

      <Input
        label="Renk"
        type="color"
        value={data.company_color}
        onChange={(e) => handleChangeData('company_color', e.target.value)}
        placeholder="Firma Tema Rengi"
        className="max-w-[50px] !p-0"
      />

      <hr className="border-slate-200 my-2" />

      <Input
        label="Instalgram URL"
        value={data.instagram_url}
        onChange={(e) => handleChangeData('instagram_url', e.target.value)}
      />

      <Input
        label="Youtube URL"
        value={data.youtube_url}
        onChange={(e) => handleChangeData('youtube_url', e.target.value)}
      />

      <Input
        label="Facebook URL"
        value={data.facebook_url}
        onChange={(e) => handleChangeData('facebook_url', e.target.value)}
      />

      <hr className="border-slate-200 my-2" />

      <Textarea
        label="Firma Açıklaması"
        value={data.description}
        onChange={(e) => handleChangeData('description', e.target.value)}
      />
      <Textarea
        label="Google Maps Embed Kodu"
        value={data.embed_address}
        onChange={(e) => handleChangeData('embed_address', e.target.value)}
      />

      <hr className="border-slate-200 my-2" />

      <Checkbox
        title="Çarkı Göster"
        value={data.is_show_wheel}
        onChange={(e) => handleChangeData('is_show_wheel', e)}
      />
      <Checkbox
        title="Çarkı Randevudan Önce Göster"
        value={data.show_before_meeting}
        onChange={(e) => handleChangeData('show_before_meeting', e)}
      />

      <Button
        color="green"
        className="ml-auto"
        loading={loading}
        onClick={handleUpdate}
      >
        Güncelle
      </Button>
    </div>
  );
};

export default FirmaAyarlariContainer;
