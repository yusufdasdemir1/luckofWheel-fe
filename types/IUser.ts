import ICompany from './ICompany';

export default interface IUser {
  id: number;
  name: string;
  surname: string;
  company: ICompany;
}
