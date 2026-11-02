import ICompanyPage from '@/types/ICompanyPage';

export const SALON_PAGE_SIZE = 8;

// Yanıt sayfalı değilse (eski backend: düz liste) tek sayfa gibi davranır
export const normalizeCompanyPage = (res: unknown): ICompanyPage => {
  const page = res as Partial<ICompanyPage> | null;

  if (page && Array.isArray(page.results)) {
    return {
      count: page.count ?? page.results.length,
      page: page.page ?? 1,
      page_size: page.page_size ?? SALON_PAGE_SIZE,
      total_pages: page.total_pages ?? 1,
      results: page.results,
      filters: { cities: page.filters?.cities ?? [] },
    };
  }

  const list = Array.isArray(res) ? (res as ICompanyPage['results']) : [];
  return {
    count: list.length,
    page: 1,
    page_size: list.length || SALON_PAGE_SIZE,
    total_pages: 1,
    results: list,
    filters: { cities: [] },
  };
};
