import IUser from '@/types/IUser';
import { create } from 'zustand';

type Store = {
  user?: IUser;
  setUser: (user: IUser | undefined) => void;

  logout: () => void;
};

export const useAuthStore = create<Store>()((set) => ({
  user: undefined,
  setUser: (user) => set((state) => ({ ...state, user })),

  logout: () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    window.location.href = '/';
    set((state) => ({ ...state, user: undefined }));
  },
}));
