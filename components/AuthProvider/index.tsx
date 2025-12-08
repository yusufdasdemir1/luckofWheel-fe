'use client';
import { useAuthStore } from '@/stores/authStore';
import IUser from '@/types/IUser';
import { useEffect } from 'react';

interface Props {
  user?: IUser;
}

const AuthProviver = ({ user }: Props) => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      document.cookie =
        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      setUser(undefined);
      return;
    }

    setUser(user);
  }, [user]);

  return <></>;
};

export default AuthProviver;
