import ICompany from './ICompany';

// Ana sayfadaki salon kartlarının kullandığı alanlar (public/companies yanıtı)
export type ISalonCard = Pick<
  ICompany,
  'title' | 'description' | 'phone' | 'slug' | 'city' | 'district' | 'logo' | 'is_show_wheel' | 'rating_avg' | 'rating_count'
>;

export interface ICityFilter {
  city: string;
  districts: string[];
}

export default interface ICompanyPage {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ISalonCard[];
  filters: {
    cities: ICityFilter[];
  };
}
