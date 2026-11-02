import IUser from '@/types/IUser';
import { clearAuthCookie } from '@/utils/authCookie';
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
    // Backend'de refresh token geçersiz kılma ucu var (/company/logout) ama istemci
    // refresh token tutmuyor; bu yüzden token sadece burada silinir. Bkz. güvenlik raporu 3.6.
    clearAuthCookie();
    set((state) => ({ ...state, user: undefined }));
    // tam sayfa yenileme: bellekteki tüm durum (store, önbellek) sıfırlanır
    window.location.href = '/';
  },
}));
