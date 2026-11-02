import { fetchPublicCompanies } from '@/services/publicService';
import { absoluteUrl } from '@/utils/siteUrl';
import type { MetadataRoute } from 'next';

// salon listesi her istekte backend'den gelir (build sırasında backend yok)
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 24; // backend'in izin verdiği en büyük sayfa

const fetchAllSlugs = async (): Promise<string[]> => {
  const slugs: string[] = [];
  let totalPages = 1;

  for (let page = 1; page <= totalPages && page <= 100; page++) {
    const [err, data] = await fetchPublicCompanies({
      page,
      page_size: PAGE_SIZE,
    });
    if (err || !data || !Array.isArray(data.results)) break;

    data.results.forEach((salon: { slug: string }) => slugs.push(salon.slug));
    totalPages = data.total_pages ?? 1;
  }

  return slugs;
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const slugs = await fetchAllSlugs();

  return [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    {
      url: absoluteUrl('/salon-basvuru'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...slugs.map((slug) => ({
      url: absoluteUrl(`/${slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
};

export default sitemap;
