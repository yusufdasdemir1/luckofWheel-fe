// weekday: 0 = Pazartesi ... 6 = Pazar
export default interface IWorkingHour {
  weekday: number;
  is_closed: boolean;
  opens: string; // "09:00"
  closes: string; // "17:30"
}
