import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// Tarayıcının erişeceği API adresi (build'e gömülür); resim ve fetch için CSP'ye eklenir
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL || '').origin;
  } catch {
    return '';
  }
})();

// Güvenlik header'ları. HSTS burada değil, TLS'i sonlandıran Nginx'te verilir
// (bkz. deploy/nginx.conf.example); uygulama arkada http ile çalışır.
//
// script-src'te 'unsafe-inline' var: Next.js sayfa başlatma kodunu ve Google Analytics
// satır içi script olarak ekler. Bunu kaldırmak nonce tabanlı CSP ve tüm sayfaların
// dinamik render edilmesini gerektirir. 'unsafe-eval' production'da kapalıdır.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `img-src 'self' data: blob: ${apiOrigin} https://www.google-analytics.com https://www.googletagmanager.com`,
  // ana sayfa hero videosu API'den gelir (Hero.tsx)
  `media-src 'self' ${apiOrigin}`,
  `connect-src 'self' ${apiOrigin} https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`,
  `frame-src https://www.google.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  // API https ise karışık içerik engellenir (local http'de açılırsa API istekleri kırılır)
  ...(apiOrigin.startsWith('https://') ? [`upgrade-insecure-requests`] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
];

const nextConfig: NextConfig = {
  // Docker imajı için minimal, kendi kendine yeten çıktı üretir
  output: 'standalone',

  // "X-Powered-By: Next.js" başlığını kaldırır
  poweredByHeader: false,

  // Tüm <Image> bileşenleri zaten unoptimized; görsel optimizasyon ucu (/_next/image)
  // kapatılır, böylece o uçtaki açıklar uygulamaya ulaşamaz.
  images: { unoptimized: true },

  // Production'da console.* ve debugger kaldırılır
  compiler: { removeConsole: isProd },

  // Dev sunucusu eval kullandığı için CSP sadece production'da uygulanır
  async headers() {
    if (!isProd) return [];
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
