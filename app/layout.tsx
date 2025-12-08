import type { Metadata } from 'next';
import '../assets/globals.css';
import { ReactNode } from 'react';
import { fetchMe } from '@/services/authService';
import AuthProvider from '@/components/AuthProvider';
import AlertProvider from '@/components/AlertProvider';

export const generateMetadata = (): Metadata => {
  return {
    title: 'Kuafor Randevu ve Hizmet Platformu',
    description:
      'Kuafor, güzellik salonları ve hizmet sağlayıcıları için randevu ve hizmet yönetim platformu.',
  };
};

export default async function ({ children }: { children: ReactNode }) {
  const [meErr, me] = await fetchMe();

  return (
    <html lang="tr">
      <body className={`antialiased`}>
        {children}

        <AuthProvider user={meErr ? undefined : me} />
        <AlertProvider />
      </body>
    </html>
  );
}
