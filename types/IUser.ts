import ICompany from './ICompany';

export type UserRole = 'owner' | 'staff' | 'customer';

export default interface IUser {
  id: number;
  name: string;
  surname: string;
  email?: string;
  // owner: firma sahibi, staff: çalışan (kuaför)
  role: UserRole;
  staff_id: number | null;
  company: ICompany;
}
