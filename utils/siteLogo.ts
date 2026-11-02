import { imageUrl } from './apiUrl';

// Site logosu backend'den servis edilir (salon logolarından ayrıdır).
// Tek logo var: koyu zeminler için (beyaz yazı, coral 360, şeffaf arka plan), 2400x553.
// Açık zeminde kullanılırsa görünmez, koyu bir zemin üstüne koy.
export const SITE_LOGO_DARK_URL = imageUrl('cevirkazan360-koyu-zemin-v2.png');
export const SITE_LOGO_DARK_RATIO = 2400 / 553;

// Sosyal paylaşım görseli ve JSON-LD gibi yerlerde kullanılan genel ad
export const SITE_LOGO_URL = SITE_LOGO_DARK_URL;
export const SITE_LOGO_RATIO = SITE_LOGO_DARK_RATIO;
