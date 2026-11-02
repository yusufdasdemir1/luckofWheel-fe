'use client';
import IWorkingHour from '@/types/IWorkingHour';
import React, { useEffect, useState } from 'react';
import { LuClock } from 'react-icons/lu';
import { DEFAULT_HOURS, nowTR, WEEKDAY_NAMES } from './time';

const SalonHours = ({ hours }: { hours: IWorkingHour[] }) => {
  // bugünü vurgulamak tarayıcı saatine bağlı, sunucuda hesaplanmaz
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(nowTR().weekday - 1), []);

  const list = hours.length === 7 ? hours : DEFAULT_HOURS;

  return (
    <section
      aria-labelledby="saatler"
      className="rounded-[28px] border-[1.5px] border-ck-line bg-white p-6 sm:p-8 flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-ck-surface text-ck-brand flex items-center justify-center">
          <LuClock size={20} aria-hidden="true" />
        </span>
        <h2
          id="saatler"
          className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-2xl tracking-[-.02em]"
        >
          Çalışma saatleri
        </h2>
      </div>

      <ul className="list-none m-0 p-0 flex flex-col">
        {WEEKDAY_NAMES.map((name, weekday) => {
          const day = list.find((h) => h.weekday === weekday);
          const isToday = today === weekday;
          return (
            <li
              key={name}
              aria-current={isToday ? 'date' : undefined}
              className={`flex items-center justify-between gap-3 py-2.5 px-3 -mx-3 rounded-xl text-[15px] ${
                isToday ? 'bg-ck-surface font-bold text-ck-ink' : 'text-ck-muted'
              }`}
            >
              <span>
                {name}
                {isToday && (
                  <span className="ml-2 text-[11px] font-bold uppercase tracking-[.06em] text-ck-brand">
                    Bugün
                  </span>
                )}
              </span>
              <span className={day?.is_closed ? 'text-ck-error font-bold' : ''}>
                {!day || day.is_closed ? 'Kapalı' : `${day.opens} – ${day.closes}`}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SalonHours;
