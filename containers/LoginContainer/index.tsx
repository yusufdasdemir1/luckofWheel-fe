'use client';
import Button from '@/components/panel/Button';
import Input from '@/components/panel/Input';
import { fetchMe, login } from '@/services/authService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';

const LoginPageContainer = () => {
  const { addAlert } = useAlertStore();
  const { setUser } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChangeData = (field: string, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const [err, res] = await login(data.email, data.password);
    setLoading(false);

    if (err) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: ' Hata',
        content: err.error || 'Giriş işlemi sırasında bir hata oluştu.',
      });
    }

    document.cookie = `token=${res.tokens.access}; path=/`;

    const [userDataErr, userData] = await fetchMe();

    if (userDataErr) return;

    setUser(userData);
    router.push('/panel');
  };

  return (
    <>
      <div className="flex flex-col gap-4 container max-w-[450px] pb-24 px-6 mx-auto box-border mt-8">
        <h2 className="text-3xl font-semibold">Giriş Yap</h2>

        <Input
          label="E-posta"
          value={data.email}
          onChange={(e) => handleChangeData('email', e.target.value)}
        />

        <Input
          label="Şifre"
          type="password"
          value={data.password}
          onChange={(e) => handleChangeData('password', e.target.value)}
        />

        <Button
          color="green"
          className="ml-auto"
          loading={loading}
          onClick={handleSubmit}
        >
          Giriş Yap
        </Button>
      </div>
    </>
  );
};

export default LoginPageContainer;
