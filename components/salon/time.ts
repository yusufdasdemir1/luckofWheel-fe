import IWorkingHour from '@/types/IWorkingHour';
import { DateTime } from 'luxon';

// Salonlar Türkiye saatine göre çalışır: tarayıcı başka saat diliminde olsa da aynı sonuç çıkar
export const ZONE = 'Europe/Istanbul';

export interface BusySlot {
  date: string;
  time: string;
  end_time: string;
}

export const nowTR = () => DateTime.now().setZone(ZONE);

// bugünden başlayıp ileri doğru gün listesi (YYYY-MM-DD)
export const nextDays = (count = 7): string[] => {
  const start = nowTR().startOf('day');
  return Array.from(
    { length: count },
    (_, i) => start.plus({ days: i }).toISODate() as string
  );
};

export const dayDate = (date: string) =>
  DateTime.fromISO(date, { zone: ZONE }).setLocale('tr');

// "01 Kasım Cumartesi" gibi, her kelimenin baş harfi büyük gün etiketi
export const dayLabel = (date: string) =>
  dayDate(date)
    .toFormat('dd LLLL cccc')
    .split(' ')
    .map((w) => w.charAt(0).toLocaleUpperCase('tr') + w.slice(1))
    .join(' ');

// API'ye ulaşılamazsa kullanılan varsayılan saatler (Pzt-Cmt 09:00-17:30, Pazar 10:00-17:30)
export const DEFAULT_HOURS: IWorkingHour[] = Array.from({ length: 7 }, (_, weekday) => ({
  weekday,
  is_closed: false,
  opens: weekday === 6 ? '10:00' : '09:00',
  closes: '17:30',
}));

// o günün çalışma saati (luxon: Pazartesi=1 ... Pazar=7, API: Pazartesi=0 ... Pazar=6)
export const hoursForDate = (date: string, hours?: IWorkingHour[]) => {
  const weekday = dayDate(date).weekday - 1;
  const list = hours && hours.length === 7 ? hours : DEFAULT_HOURS;
  return list.find((h) => h.weekday === weekday) ?? DEFAULT_HOURS[weekday];
};

export const isClosedDay = (date: string, hours?: IWorkingHour[]) =>
  hoursForDate(date, hours).is_closed;

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// Açılıştan kapanışa yarım saatlik randevu saatleri; hizmet kapanışı aşacaksa o saat gösterilmez
export const buildSlots = (
  date: string,
  hours: IWorkingHour[] | undefined,
  duration = 30
): string[] => {
  const day = hoursForDate(date, hours);
  if (day.is_closed) return [];

  const open = toMinutes(day.opens);
  const close = toMinutes(day.closes);
  const slots: string[] = [];
  for (let minute = open; minute + duration <= close; minute += 30) {
    slots.push(toTime(minute));
  }
  return slots;
};

export const WEEKDAY_NAMES = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

// bugünün çalışma durumu: "Şu an açık · 17:30'a kadar" gibi bir etiket
export const openStatus = (
  hours: IWorkingHour[] | undefined,
  now: DateTime = nowTR()
): { open: boolean; label: string } => {
  const day = hoursForDate(now.toISODate() as string, hours);
  if (day.is_closed) return { open: false, label: 'Bugün kapalı' };

  const minutes = now.hour * 60 + now.minute;
  if (minutes < toMinutes(day.opens))
    return { open: false, label: `Bugün ${day.opens}'da açılıyor` };
  if (minutes >= toMinutes(day.closes))
    return { open: false, label: 'Bugün kapandı' };
  return { open: true, label: `Şu an açık · ${day.closes}'a kadar` };
};

const slotTime = (date: string, time: string) =>
  DateTime.fromISO(`${date}T${time}`, { zone: ZONE });

export const isPast = (date: string, time: string) =>
  slotTime(date, time) <= nowTR();

// Seçilen saatten başlayıp `duration` dakika süren işlem dolu bir randevuyla çakışıyor mu?
// duration=1 verilirse sadece saatin kendisinin dolu olup olmadığına bakar.
export const isBusy = (
  date: string,
  time: string,
  busy: BusySlot[],
  duration = 1
) =>
  busy.some((slot) => {
    if (slot.date !== date) return false;
    const start = slotTime(date, time);
    const end = start.plus({ minutes: duration });
    return (
      start < slotTime(slot.date, slot.end_time) &&
      end > slotTime(slot.date, slot.time)
    );
  });
