'use client';
import { useAuthStore } from '@/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

// Çalışan (kuaför) sadece bu sayfalara girebilir; diğerleri firma sahibine aittir.
// (Asıl yetki kontrolü backend'dedir; bu koruma sadece boş/hatalı sayfa görünmesini önler.)
const STAFF_PATHS = ['/panel', '/panel/kazanilan-hediyeler'];

const RoleGuard = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // UI kontrolü — asıl yetki kontrolü backend'de yapılmalı
  const blocked = user?.role === 'staff' && !STAFF_PATHS.includes(pathname);

  useEffect(() => {
    if (blocked) router.replace('/panel');
  }, [blocked, router]);

  if (blocked) return null;
  return <>{children}</>;
};

export default RoleGuard;
