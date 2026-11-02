import KazanilanHediyelerContainer from '@/containers/KazanilanHediyelerContainer';
import {
  fetchSpinHistory,
  fetchWinStatistics,
} from '@/services/hediyeCarkiService';
import IPage, { EMPTY_PAGE } from '@/types/IPage';
import { listQuery } from '@/utils/listQuery';
import React from 'react';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const query = listQuery(await searchParams, ['page', 'q', 'is_used'], 12);

  const [[, data], [statsErr, stats]] = await Promise.all([
    fetchSpinHistory(query),
    fetchWinStatistics(),
  ]);

  const pageData: IPage<any> =
    data && Array.isArray(data.results) ? data : EMPTY_PAGE;

  return (
    <KazanilanHediyelerContainer
      page={pageData}
      stats={statsErr ? null : stats}
    />
  );
};

export default Page;
