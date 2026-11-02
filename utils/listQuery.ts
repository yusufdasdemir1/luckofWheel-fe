type SearchParams = Record<string, string | string[] | undefined>;

// URL'deki arama/filtre/sayfa değerlerinden backend sorgusu üretir (sadece izin verilenler).
// page her zaman gönderilir; backend de böylece sayfalı yanıt döndürür.
export const listQuery = (
  searchParams: SearchParams,
  keys: string[],
  pageSize = 10
) => {
  const query: Record<string, string> = { page_size: String(pageSize) };

  keys.forEach((key) => {
    const raw = searchParams[key];
    const value = (Array.isArray(raw) ? raw[0] : raw)?.trim();
    if (value) query[key] = value;
  });

  const page = Number(query.page);
  query.page = Number.isInteger(page) && page > 0 ? String(page) : '1';

  return query;
};
