import RandevularContainer from '@/containers/RandevularContainer';
import {
  fetchMeetingStatistics,
  fetchRandevular,
} from '@/services/randevuService';
import IPage, { EMPTY_PAGE } from '@/types/IPage';
import { listQuery } from '@/utils/listQuery';
import React from 'react';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const query = listQuery(
    await searchParams,
    ['page', 'q', 'status', 'when', 'staff_id', 'date_from', 'date_to'],
    12
  );

  const [, data] = await fetchRandevular(query);
  const [statsErr, stats] = await fetchMeetingStatistics();

  const pageData: IPage<any> =
    data && Array.isArray(data.results) ? data : EMPTY_PAGE;

  return (
    <RandevularContainer page={pageData} stats={statsErr ? null : stats} />
  );
};

export default Page;
