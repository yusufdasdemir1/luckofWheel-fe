'use client';
import Reveal from '@/components/home/Reveal';
import { scrollToBooking, useSalonPickStore } from '@/stores/salonPickStore';
import IService from '@/types/IService';
import React from 'react';
import { LuArrowRight, LuClock } from 'react-icons/lu';

const SalonServices = ({ services }: { services: IService[] }) => {
  const pickService = useSalonPickStore((s) => s.pickService);

  if (services.length === 0) return null;

  const handlePick = (title: string) => {
    pickService(title);
    scrollToBooking();
  };

  return (
    <section aria-labelledby="hizmetler">
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            Hizmetler
          </span>
          <h2
            id="hizmetler"
            className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]"
          >
            Ne yaptırmak istersin?
          </h2>
        </div>

        <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.id ?? s.title}>
              <button
                type="button"
                onClick={() => handlePick(s.title)}
                className="ck-btn group w-full h-full text-left cursor-pointer flex flex-col gap-3 rounded-3xl border-[1.5px] border-ck-line bg-white p-5 hover:border-ck-brand/50 hover:shadow-[0_14px_30px_rgba(86,14,34,.10)]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-[family-name:var(--font-bricolage)] font-bold text-xl leading-snug tracking-[-.01em]">
                    {s.title}
                  </span>
                  <span className="shrink-0 font-extrabold text-ck-brand">
                    {s.price} TL
                  </span>
                </span>

                {s.description && (
                  <span className="text-sm leading-[1.55] text-ck-muted line-clamp-2">
                    {s.description}
                  </span>
                )}

                <span className="mt-auto flex items-center justify-between pt-1 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-ck-muted">
                    <LuClock size={15} aria-hidden="true" />
                    {s.duration} dk
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-ck-brand opacity-80 group-hover:opacity-100">
                    Randevu al
                    <LuArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
};

export default SalonServices;
