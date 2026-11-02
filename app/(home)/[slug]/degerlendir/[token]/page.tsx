import ReviewPageContainer from '@/containers/ReviewPageContainer';
import { fetchReviewByToken } from '@/services/publicService';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string; token: string }>;
}

// kişiye özel bağlantı: arama motorlarına açılmaz
export const metadata = {
  title: 'Randevunu değerlendir — Çevir Kazan 360',
  robots: { index: false, follow: false },
};

const Page = async ({ params }: Props) => {
  const { slug, token } = await params;
  const [err, data] = await fetchReviewByToken(token);

  // token yoksa ya da başka bir salona aitse bağlantı geçersizdir
  if (err || !data || data.company?.slug !== slug) {
    return notFound();
  }

  return <ReviewPageContainer token={token} data={data} />;
};

export default Page;
