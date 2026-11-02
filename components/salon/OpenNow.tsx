'use client';
import IWorkingHour from '@/types/IWorkingHour';
import React, { useEffect, useState } from 'react';
import { nowTR, openStatus } from './time';

// Saate bağlı olduğu için sadece tarayıcıda hesaplanır (sunucu/istemci uyuşmazlığı olmasın)
const OpenNow = ({ hours }: { hours: IWorkingHour[] }) => {
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(
    null
  );

  useEffect(() => {
    const update = () => setStatus(openStatus(hours, nowTR()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [hours]);

  if (!status) return null;

  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-bold text-white border border-white/35 px-3.5 py-[7px] rounded-full">
      <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
        {status.open && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-ck-online opacity-60 animate-ping motion-reduce:animate-none" />
        )}
        <span
          className={`relative inline-flex w-2.5 h-2.5 rounded-full ${
            status.open ? 'bg-ck-online' : 'bg-white/40'
          }`}
        />
      </span>
      {status.label}
    </span>
  );
};

export default OpenNow;
