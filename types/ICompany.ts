export default interface ICompany {
  id: number;
  title: string;
  description: string;
  phone: string;
  email: string;
  slug: string;
  logo: string | null;
  thumbnail: string | null;
  show_before_meeting: boolean;
  is_show_wheel: boolean;
  spin_cooldown_hours: number;
  embed_address: string;
  address_text: string;
  status: string;
  company_color: string;
  city: string;
  district: string;
}
