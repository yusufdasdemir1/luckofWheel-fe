'use client';
import AuthField from '@/components/auth/AuthField';
import AuthShell from '@/components/auth/AuthShell';
import { SALON_APPLY_HREF } from '@/components/home/constants';
import { fetchMe, login } from '@/services/authService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { apiErrorMessage } from '@/utils/apiError';
import { setAuthCookie } from '@/utils/authCookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const LoginPageContainer = () => {
  const { addAlert } = useAlertStore();
  const { setUser } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChangeData = (field: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const [err, res] = await login(data.email, data.password);

    if (err) {
      setLoading(false);
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: ' Hata',
        content: apiErrorMessage(
          err,
          'Giriş işlemi sırasında bir hata oluştu.',
        ),
      });
    }

    setAuthCookie(res.tokens.access);

    const [userDataErr, userData] = await fetchMe();

    if (userDataErr) {
      setLoading(false);
      return;
    }

    setUser(userData);
    router.push('/panel');
  };

  return (
    <AuthShell
      title="Tekrar hoş geldin"
      subtitle="Salon paneline girmek için e-posta ve şifreni yaz. Kuaförler kendilerine tanımlanan bilgilerle girer."
      footer={
        <>
          Salonun henüz yok mu?{' '}
          <Link
            href={SALON_APPLY_HREF}
            className="font-bold text-ck-brand no-underline hover:underline"
          >
            Başvuru yap
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          label="E-posta"
          type="email"
          autoComplete="username"
          placeholder="ornek@salon.com"
          value={data.email}
          onChange={(e) => handleChangeData('email', e.target.value)}
          required
        />

        <AuthField
          label="Şifre"
          type="password"
          autoComplete="current-password"
          placeholder="Şifren"
          value={data.password}
          onChange={(e) => handleChangeData('password', e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="ck-btn mt-2 h-12 w-full rounded-xl bg-ck-brand text-white font-bold cursor-pointer border-0 flex items-center justify-center gap-2 hover:bg-ck-brand-dark hover:shadow-[0_12px_26px_rgba(142,19,48,.28)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <BiLoaderAlt size={18} className="animate-spin" />}
          Giriş Yap
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginPageContainer;
