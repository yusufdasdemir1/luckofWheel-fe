import { clearAuthCookie, readAuthCookie } from '@/utils/authCookie';
import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axios.interceptors.request.use(
  async (config) => {
    let token: string | undefined = '';

    // server
    if (typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
      // Docker'da sunucu tarafı backend'e tarayıcıdan farklı adresle ulaşabilir
      if (process.env.API_INTERNAL_URL) {
        config.baseURL = process.env.API_INTERNAL_URL;
      }
    } else {
      // client
      token = readAuthCookie();
    }

    // Herkese açık uçlara token eklenmez: eski/geçersiz bir token backend'de 401'e yol açıp
    // salon sayfasını "bulunamadı" gösterir. Bu uçlar zaten giriş gerektirmez.
    const isPublic = (config.url ?? '').startsWith('/public/');

    if (token && token !== 'undefined' && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Süresi dolmuş/geçersiz token: oturum temizlenir. Refresh token istemcide tutulmadığı için
// sessizce yenileme yapılamaz (bkz. güvenlik raporu 3.5); kullanıcı yeniden giriş yapar.
let redirecting = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBrowser = typeof window !== 'undefined';
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? '';
    const sentToken = !!error?.config?.headers?.Authorization;

    // giriş denemesindeki 401 yanlış şifre demektir, oturum süresi değil
    if (isBrowser && status === 401 && sentToken && !url.includes('/login')) {
      clearAuthCookie();

      // sadece panelde giriş sayfasına yönlendir; herkese açık salon sayfaları açık kalır
      if (window.location.pathname.startsWith('/panel') && !redirecting) {
        redirecting = true;
        window.location.href = '/giris-yap';
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
