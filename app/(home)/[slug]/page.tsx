import DetailPageContainer from '@/containers/DetailPageContainer';
import { fetchCompanyBySlug } from '@/services/companyService';
import {
  fetchGiftsByCompanySlug,
  fetchOccupiedSlotsByCompanySlug,
  fetchReviewsByCompanySlug,
  fetchServicesByCompanySlug,
  fetchStaffByCompanySlug,
  fetchWorkingHoursByCompanySlug,
} from '@/services/publicService';
import { imageUrl } from '@/utils/apiUrl';
import { SITE_LOGO_URL } from '@/utils/siteLogo';
import { SITE_NAME, truncate } from '@/utils/siteUrl';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// başlık (metadata) ve sayfa aynı salon bilgisini kullanır, tek istek atılır
const getCompany = cache((slug: string) => fetchCompanyBySlug(slug));

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const [err, company] = await getCompany(slug);

  if (err) {
    return {
      title: 'Salon bulunamadı — Çevir Kazan 360',
      robots: { index: false, follow: false },
    };
  }

  const title = `${company.title} — Çarkı çevir, randevunu al | Çevir Kazan 360`;
  const place = [company.district, company.city].filter(Boolean).join(', ');
  const description = truncate(
    company.description ||
      `${company.title}${place ? ` (${place})` : ''} salonunda çarkı çevir, hediyeni kazan ve online randevunu oluştur.`
  );

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website' as const,
      images: [company.logo ? imageUrl(company.logo) : SITE_LOGO_URL],
    },
    twitter: { card: 'summary' as const, title, description },
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const [err, company] = await getCompany(slug);

  const [giftErr, gifts] = await fetchGiftsByCompanySlug(slug);

  const [serviceErr, services] = await fetchServicesByCompanySlug(slug);

  const [slotsErr, slots] = await fetchOccupiedSlotsByCompanySlug(slug);

  const [staffErr, staff] = await fetchStaffByCompanySlug(slug);

  const [hoursErr, hours] = await fetchWorkingHoursByCompanySlug(slug);

  const [reviewsErr, reviews] = await fetchReviewsByCompanySlug(slug, {
    page_size: 6,
  });

  if (err) {
    return notFound();
  }

  return (
    <DetailPageContainer
      company={company}
      gifts={!giftErr ? gifts : []}
      services={!serviceErr ? services : []}
      occupiedSlots={!slotsErr ? slots : []}
      staff={!staffErr && Array.isArray(staff) ? staff : []}
      workingHours={!hoursErr && Array.isArray(hours) ? hours : []}
      reviews={!reviewsErr && reviews?.count > 0 ? reviews : null}
    />
  );
};

export default Page;
