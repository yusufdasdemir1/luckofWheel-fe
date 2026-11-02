// Backend hataları {"error": "..."} ya da {"alan": ["..."]} biçiminde gelir.
// Kullanıcıya sadece kısa, düz metin ve backend'in bilerek yazdığı mesajlar gösterilir;
// teknik görünen (HTML, stack trace, JSON, çok uzun) ya da İngilizce framework
// mesajları ("detail") yerine fallback kullanılır.
const MAX_LENGTH = 200;
const TECHNICAL = /<\/?[a-z!]|traceback|exception|\bat\s+\S+\s+\(|\bselect\b.+\bfrom\b|\binsert\s+into\b|^\s*[{[]/i;

const safeText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || text.length > MAX_LENGTH || TECHNICAL.test(text)) return null;
  return text;
};

export const apiErrorMessage = (err: unknown, fallback: string): string => {
  if (!err || typeof err !== 'object') return fallback;
  const data = err as Record<string, unknown>;

  const direct = safeText(data.error) ?? safeText(data.message);
  if (direct) return direct;

  // alan hataları: {"phone": ["Geçerli bir numara girin."]}
  // (DRF'in genel `detail` alanı bilerek atlanır: İngilizce ve teknik)
  for (const [key, value] of Object.entries(data)) {
    if (key === 'detail') continue;
    const text = safeText(Array.isArray(value) ? value[0] : value);
    if (text) return text;
  }

  return fallback;
};
