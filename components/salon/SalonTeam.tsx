'use client';
import Reveal from '@/components/home/Reveal';
import { scrollToBooking, useSalonPickStore } from '@/stores/salonPickStore';
import { IStaffPublic } from '@/types/IStaff';
import { imageUrl } from '@/utils/apiUrl';
import Image from 'next/image';
import React from 'react';

const initials = (st: IStaffPublic) =>
  `${st.name.charAt(0)}${st.surname.charAt(0)}`.toLocaleUpperCase('tr');

const SalonTeam = ({ staff }: { staff: IStaffPublic[] }) => {
  const pickStaff = useSalonPickStore((s) => s.pickStaff);

  if (staff.length === 0) return null;

  const handlePick = (id: number) => {
    pickStaff(id);
    scrollToBooking();
  };

  return (
    <section aria-labelledby="ekip">
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
            Ekibimiz
          </span>
          <h2
            id="ekip"
            className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]"
          >
            Seni kim karşılayacak?
          </h2>
        </div>

        <ul className="list-none m-0 p-0 grid gap-3 grid-cols-2 sm:grid-cols-3">
          {staff.map((st) => (
            <li key={st.id}>
              <button
                type="button"
                onClick={() => handlePick(st.id)}
                className="ck-btn group w-full cursor-pointer flex flex-col items-center gap-3 rounded-3xl border-[1.5px] border-ck-line bg-white px-4 py-6 text-center hover:border-ck-brand/50 hover:shadow-[0_14px_30px_rgba(86,14,34,.10)]"
              >
                <span
                  aria-hidden="true"
                  className="w-[84px] h-[84px] rounded-full overflow-hidden bg-ck-night text-white flex items-center justify-center font-[family-name:var(--font-bricolage)] font-extrabold text-3xl ring-4 ring-ck-surface group-hover:ring-ck-brand/30"
                >
                  {st.photo ? (
                    <Image
                      alt=""
                      src={imageUrl(st.photo)}
                      width={168}
                      height={168}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(st)
                  )}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-bold text-base leading-snug">
                    {st.name} {st.surname}
                  </span>
                  <span className="text-[13px] text-ck-brand font-bold opacity-80 group-hover:opacity-100">
                    Randevu al
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

export default SalonTeam;
