'use client';
import Button from '@/components/panel/Button';
import Checkbox from '@/components/panel/Checkbox';
import Input from '@/components/panel/Input';
import Textarea from '@/components/panel/Textarea';
import { fetchMe, login, register } from '@/services/authService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const RegisterContainer = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { addAlert } = useAlertStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: '',
    surname: '',
    password: '',
    r_password: '',
    company_title: '',
    company_description: '',
    company_phone: '',
    company_email: '',
    show_before_meeting: false,
    is_show_wheel: false,
  });

  const handleChangeData = (field: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (data.password !== data.r_password) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: ' Hata',
        content: 'Şifreler eşleşmiyor.',
      });
    }

    setLoading(true);
    const [error, res] = await register(data);
    setLoading(false);

    if (error) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: ' Hata',
        content: error.error || 'Kayıt işlemi sırasında bir hata oluştu.',
      });
    }

    addAlert({
      id: Math.random().toString(36).substring(2, 9),
      type: 'success',
      title: ' Başarılı',
      content: 'Kayıt işlemi başarılı.',
    });

    setLoading(true);
    const [err, loginRes] = await login(data.company_email, data.password);
    setLoading(false);

    if (err) {
      return router.push('/giris-yap');
    }

    document.cookie = `token=${loginRes.tokens.access}; path=/`;

    const [userDataErr, userData] = await fetchMe();

    if (userDataErr) return;

    setUser(userData);
    router.push('/panel');
  };

  return (
    <div className="flex flex-col gap-4 container max-w-[450px] pb-24 px-6 mx-auto box-border mt-8">
      <h2 className="text-3xl font-semibold">Kayıt Ol</h2>

      <Input
        label="İsim"
        value={data.name}
        onChange={(e) => handleChangeData('name', e.target.value)}
      />
      <Input
        label="Soyisim"
        value={data.surname}
        onChange={(e) => handleChangeData('surname', e.target.value)}
      />
      <Input
        label="Şifre"
        type="password"
        value={data.password}
        onChange={(e) => handleChangeData('password', e.target.value)}
      />
      <Input
        label="Şifre"
        type="password"
        value={data.r_password}
        onChange={(e) => handleChangeData('r_password', e.target.value)}
      />

      <hr className="w-full h-[1px] my-4 border-slate-300" />

      <Input
        label="Firma Adı"
        value={data.company_title}
        onChange={(e) => handleChangeData('company_title', e.target.value)}
      />
      <Input
        label="Firma Telefon"
        value={data.company_phone}
        onChange={(e) => handleChangeData('company_phone', e.target.value)}
      />
      <Input
        label="Firma E-Posta"
        value={data.company_email}
        onChange={(e) => handleChangeData('company_email', e.target.value)}
      />

      <Textarea
        label="Firma Açıklaması"
        value={data.company_description}
        onChange={(e) =>
          handleChangeData('company_description', e.target.value)
        }
      />
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
        onClick={handleRegister}
      >
        Kayıt Ol
      </Button>
    </div>
  );
};

export default RegisterContainer;
