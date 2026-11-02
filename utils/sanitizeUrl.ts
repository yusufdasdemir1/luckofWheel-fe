// Kullanıcıdan/API'den gelen adresleri href, src veya yönlendirmede kullanmadan önce doğrular.
// `javascript:`, `data:`, `vbscript:` gibi şemalar reddedilir.
const DEFAULT_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// "instagram.com/salon" gibi şemasız ama alan adına benzeyen girdiler https ile tamamlanır
const BARE_DOMAIN = /^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i;

export const sanitizeUrl = (
  raw: string | null | undefined,
  allowedProtocols: string[] = DEFAULT_PROTOCOLS
): string | null => {
  if (!raw) return null;

  // görünmez/kontrol karakterleriyle şema gizlemeyi ("java\tscript:") engeller
  // eslint-disable-next-line no-control-regex
  const value = raw.replace(/[\u0000-\u001f\u007f\s]+/g, '');
  if (!value) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : BARE_DOMAIN.test(value)
      ? `https://${value}`
      : null;
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return allowedProtocols.includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

// Sosyal medya bağlantıları sadece web adresi olabilir
export const sanitizeWebUrl = (raw: string | null | undefined) =>
  sanitizeUrl(raw, ['http:', 'https:']);
