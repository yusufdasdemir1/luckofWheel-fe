// before: çark randevudan önce, after: randevudan sonra, none: çark yok
export type WheelMode = 'before' | 'after' | 'none';

export const WHEEL_MODE_ITEMS: { value: WheelMode; title: string }[] = [
  { value: 'before', title: 'Çark randevudan önce çevrilsin' },
  { value: 'after', title: 'Çark randevudan sonra çevrilsin' },
  { value: 'none', title: 'Çark olmasın' },
];

export default interface ICompany {
  id: number;
  title: string;
  description: string;
  phone: string;
  email: string;
  slug: string;
  logo: string | null;
  thumbnail: string | null;
  wheel_mode: WheelMode;
  is_show_wheel: boolean;
  spin_cooldown_hours: number;
  embed_address: string;
  address_text: string;
  status: string;
  city: string;
  district: string;
  youtube_url: string;
  instagram_url: string;
  facebook_url: string;
  rating_avg: number;
  rating_count: number;
}
