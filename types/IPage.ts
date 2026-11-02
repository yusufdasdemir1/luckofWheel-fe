// Backend'in sayfalı liste yanıtı (core/pagination.py)
export default interface IPage<T, F = Record<string, unknown>> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
  filters?: F;
}

export const EMPTY_PAGE: IPage<never> = {
  count: 0,
  page: 1,
  page_size: 10,
  total_pages: 1,
  results: [],
};
