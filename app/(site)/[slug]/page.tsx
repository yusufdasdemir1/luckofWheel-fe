import DetailPageContainer from '@/containers/DetailPageContainer';
import { fetchCompanyBySlug } from '@/services/companyService';
import {
  fetchGiftsByCompanySlug,
  fetchServicesByCompanySlug,
} from '@/services/publicService';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const [err, company] = await fetchCompanyBySlug(slug);

  const [giftErr, gifts] = await fetchGiftsByCompanySlug(slug);

  const [serviceErr, services] = await fetchServicesByCompanySlug(slug);

  if (err) {
    return notFound();
  }

  return (
    <DetailPageContainer
      company={company}
      gifts={!giftErr ? gifts : []}
      services={!serviceErr ? services : []}
    />
  );
};

export default Page;
