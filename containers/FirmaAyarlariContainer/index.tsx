'use client';
import Button from '@/components/panel/Button';
import { FormSection, PageHeader } from '@/components/panel/Card';
import Input from '@/components/panel/Input';
import RadioGroup from '@/components/panel/RadioGroup';
import Textarea from '@/components/panel/Textarea';
import { updateCompanyInfos } from '@/services/companyService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { WHEEL_MODE_ITEMS } from '@/types/ICompany';
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
    wheel_mode: user?.company?.wheel_mode || 'before',
    spin_cooldown_hours: user?.company?.spin_cooldown_hours || 24,
    embed_address: user?.company?.embed_address || '',
    address_text: user?.company?.address_text || '',
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
      { ...data, phone: '+90' + data.phone },
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
    <div className="flex flex-col gap-5 max-w-[1100px] pb-24">
      <PageHeader
        title="Firma Ayarları"
        description="Salonunun müşterilere görünen bilgilerini ve çark davranışını buradan düzenle."
      />

      <div className="grid gap-5 lg:grid-cols-2 items-stretch">
        <FormSection title="Genel bilgiler">
          <Input
            label="Firma Adı"
            value={data.title}
            onChange={(e) => handleChangeData('title', e.target.value)}
          />

          <div className="w-full flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ck-ink">Telefon</span>

            <div className="flex items-stretch">
              <div className="w-[56px] min-w-[56px] h-[45px] flex items-center justify-center bg-ck-cream border border-r-0 border-slate-300 text-sm font-medium text-ck-muted rounded-l-xl">
                +90
              </div>
              <Input
                className="!rounded-l-none"
                placeholder="5xx xxx xx xx"
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

          <Textarea
            label="Firma Açıklaması"
            value={data.description}
            onChange={(e) => handleChangeData('description', e.target.value)}
          />
        </FormSection>
        <FormSection
          title="Konum"
          description="Salon sayfanda harita ve adres olarak gösterilir."
        >
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <Textarea
            label="Google Maps Embed Kodu"
            value={data.embed_address}
            onChange={(e) => handleChangeData('embed_address', e.target.value)}
          />
        </FormSection>
        <FormSection title="Sosyal medya">
          <Input
            label="Instagram URL"
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
        </FormSection>
        <FormSection title="Çark">
          <Input
            label="Çark yeniden dönme süresi (saat)"
            value={data.spin_cooldown_hours}
            onChange={(e) =>
              handleChangeData('spin_cooldown_hours', e.target.value)
            }
          />

          <RadioGroup
            title="Çark ne zaman çevrilsin?"
            vertical
            value={data.wheel_mode}
            items={WHEEL_MODE_ITEMS}
            onChange={(v) => handleChangeData('wheel_mode', v)}
          />
        </FormSection>
      </div>

      <div className="flex justify-end">
        <Button color="primary" loading={loading} onClick={handleUpdate}>
          Güncelle
        </Button>
      </div>
    </div>
  );
};

export default FirmaAyarlariContainer;
