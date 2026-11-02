import YorumlarContainer from '@/containers/YorumlarContainer';
import { fetchReviews } from '@/services/reviewService';
import { EMPTY_PAGE } from '@/types/IPage';
import { listQuery } from '@/utils/listQuery';
import React from 'react';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const query = listQuery(await searchParams, ['page', 'status'], 12);
  const [, data] = await fetchReviews(query);

  const pageData =
    data && Array.isArray(data.results)
      ? data
      : { ...EMPTY_PAGE, counts: { pending: 0, approved: 0, hidden: 0 } };

  return <YorumlarContainer page={pageData} />;
};

export default Page;
