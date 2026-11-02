import ICompany from '@/types/ICompany';

// Panelde "embed kodu" alanına <iframe ...> kodu da, düz bağlantı da yapıştırılabilir
const parseMapUrl = (raw: string) => {
  const value = raw.trim();
  const src = value.match(/src=["']([^"']+)["']/i)?.[1] ?? value;

  try {
    const url = new URL(src);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    // sadece embed adresleri iframe'de açılır; paylaşım bağlantıları (share.google, maps.app.goo.gl) açılmaz
    const embeddable =
      /(^|\.)google\.com$/.test(url.hostname) &&
      url.pathname.startsWith('/maps/embed');
    return { href: url.toString(), embeddable };
  } catch {
    return null;
  }
};

// adres metni: yol tarifi ve gömülü harita buradan kurulur.
// Salon adı eklenmez: Google'da kayıtlı olmayan salonlarda ad aramayı bozup alakasız yerleri gösteriyor
const addressQuery = (company: ICompany) =>
  [company.address_text, company.district, company.city]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(', ');

/** Yol tarifi bağlantısı: adres varsa adrese, yoksa kayıtlı harita bağlantısına gider */
export const directionsUrl = (company: ICompany): string | null => {
  const query = addressQuery(company);
  if (query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      query
    )}`;
  }
  return company.embed_address
    ? parseMapUrl(company.embed_address)?.href ?? null
    : null;
};

/** Sayfada açık gösterilecek harita adresi (iframe). Hiç adres yoksa null */
export const mapEmbedSrc = (company: ICompany): string | null => {
  const saved = company.embed_address
    ? parseMapUrl(company.embed_address)
    : null;
  if (saved?.embeddable) return saved.href;

  // kayıtlı bağlantı gömülemiyorsa (ör. share.google) adres metninden harita kurulur
  const query = addressQuery(company);
  return query
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        query
      )}&hl=tr&output=embed`
    : null;
};
