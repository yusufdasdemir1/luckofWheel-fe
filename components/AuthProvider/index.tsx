'use client';
import { useAuthStore } from '@/stores/authStore';
import IUser from '@/types/IUser';
import { clearAuthCookie } from '@/utils/authCookie';
import { useEffect } from 'react';

interface Props {
  user?: IUser;
}

const AuthProviver = ({ user }: Props) => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      clearAuthCookie();
      setUser(undefined);
      return;
    }

    setUser(user);
  }, [user]);

  return <></>;
};

export default AuthProviver;
