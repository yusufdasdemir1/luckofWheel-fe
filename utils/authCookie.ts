// Access token cookie'si. Tüm yazma/silme işlemleri buradan geçer.
//
// NOT: Cookie JS tarafından okunabilir (HttpOnly değil) çünkü tarayıcıdaki axios
// istekleri Authorization header'ını buradan kuruyor. HttpOnly'ye geçiş, tüm API
// çağrılarının Next sunucusu üzerinden (BFF) yapılmasını gerektirir; bkz. güvenlik raporu 3.2.
// Bu yüzden: SameSite=Lax (CSRF/çapraz site gönderimi), Secure (https'te) ve
// backend'deki access token ömrüyle (1 gün) aynı süre kullanılır.
const COOKIE_NAME = 'token';
const MAX_AGE_SECONDS = 60 * 60 * 24; // backend ACCESS_TOKEN_LIFETIME ile aynı olmalı

export const setAuthCookie = (token: string) => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
};

export const clearAuthCookie = () => {
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const readAuthCookie = (): string | undefined => {
  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return raw ? decodeURIComponent(raw) : undefined;
};
