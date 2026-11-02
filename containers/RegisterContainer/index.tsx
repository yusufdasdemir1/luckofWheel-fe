'use client';
import AuthField, { AuthTextarea, authInputClass } from '@/components/auth/AuthField';
import AuthShell from '@/components/auth/AuthShell';
import RadioGroup from '@/components/panel/RadioGroup';
import { fetchMe, login, register } from '@/services/authService';
import { useAlertStore } from '@/stores/alertStore';
import { useAuthStore } from '@/stores/authStore';
import { WHEEL_MODE_ITEMS, WheelMode } from '@/types/ICompany';
import { apiErrorMessage } from '@/utils/apiError';
import { setAuthCookie } from '@/utils/authCookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

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
    wheel_mode: 'before' as WheelMode,
  });

  const handleChangeData = (field: string, value: string | boolean) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const notify = (type: 'success' | 'error', content: string) =>
    addAlert({
      id: Math.random().toString(36).substring(2, 9),
      type,
      title: type === 'error' ? ' Hata' : ' Başarılı',
      content,
    });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (data.password !== data.r_password) {
      return notify('error', 'Şifreler eşleşmiyor.');
    }

    setLoading(true);
    const [error, res] = await register({
      ...data,
      phone:
        '+90' + data.company_phone.substring(data.company_phone.length - 10),
    });

    if (error) {
      setLoading(false);
      return notify(
        'error',
        apiErrorMessage(error, 'Kayıt işlemi sırasında bir hata oluştu.')
      );
    }

    notify('success', 'Kayıt işlemi başarılı.');

    const [err, loginRes] = await login(data.company_email, data.password);

    if (err) {
      setLoading(false);
      return router.push('/giris-yap');
    }

    setAuthCookie(loginRes.tokens.access);

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
      wide
      title="Salonunu oluştur"
      subtitle="Salon bilgilerini gir, panelini hemen kullanmaya başla."
      footer={
        <>
          Zaten hesabın var mı?{' '}
          <Link
            href="/giris-yap"
            className="font-bold text-ck-brand no-underline hover:underline"
          >
            Giriş yap
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            label="İsim"
            value={data.name}
            onChange={(e) => handleChangeData('name', e.target.value)}
            required
          />
          <AuthField
            label="Soyisim"
            value={data.surname}
            onChange={(e) => handleChangeData('surname', e.target.value)}
            required
          />
          <AuthField
            label="Şifre"
            type="password"
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => handleChangeData('password', e.target.value)}
            required
          />
          <AuthField
            label="Şifre (tekrar)"
            type="password"
            autoComplete="new-password"
            value={data.r_password}
            onChange={(e) => handleChangeData('r_password', e.target.value)}
            required
          />
        </div>

        <hr className="w-full h-px my-1 border-0 bg-ck-line" />

        <AuthField
          label="Firma adı"
          value={data.company_title}
          onChange={(e) => handleChangeData('company_title', e.target.value)}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ck-ink">Telefon</label>
            <div className="flex">
              <div className="w-14 min-w-14 h-12 flex items-center justify-center rounded-l-xl border border-r-0 border-ck-input bg-ck-surface text-sm font-medium text-ck-muted">
                +90
              </div>
              <input
                type="tel"
                inputMode="tel"
                value={data.company_phone}
                onChange={(e) =>
                  handleChangeData('company_phone', e.target.value)
                }
                className={`${authInputClass} h-12 !rounded-l-none min-w-0`}
                required
              />
            </div>
          </div>

          <AuthField
            label="Firma e-posta"
            type="email"
            value={data.company_email}
            onChange={(e) => handleChangeData('company_email', e.target.value)}
            required
          />
        </div>

        <AuthTextarea
          label="Firma açıklaması"
          value={data.company_description}
          onChange={(e) =>
            handleChangeData('company_description', e.target.value)
          }
        />

        <RadioGroup
          title="Çark"
          vertical
          value={data.wheel_mode}
          items={WHEEL_MODE_ITEMS}
          onChange={(v) => handleChangeData('wheel_mode', v)}
        />

        <button
          type="submit"
          disabled={loading}
          className="ck-btn mt-2 h-12 w-full rounded-xl bg-ck-brand text-white font-bold cursor-pointer border-0 flex items-center justify-center gap-2 hover:bg-ck-brand-dark hover:shadow-[0_12px_26px_rgba(142,19,48,.28)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <BiLoaderAlt size={18} className="animate-spin" />}
          Kayıt Ol
        </button>
      </form>
    </AuthShell>
  );
};

export default RegisterContainer;
