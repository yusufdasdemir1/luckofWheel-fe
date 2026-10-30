'use client';
import ICompany from '@/types/ICompany';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { LuMapPin, LuPlus } from 'react-icons/lu';
import { SALON_APPLY_HREF } from './constants';
import Reveal from './Reveal';

interface SalonsProps {
  list: ICompany[];
}

const FIELD =
  'font-[inherit] text-[15px] px-3.5 rounded-[14px] border-[1.5px] border-ck-input bg-white min-h-12 text-ck-ink box-border';

const Salons = ({ list }: SalonsProps) => {
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');

  const cities = useMemo(
    () =>
      Array.from(new Set(list.map((c) => c.city).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'tr')
      ),
    [list]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr');
    return list.filter(
      (c) =>
        (!city || c.city === city) &&
        (!q || c.title.toLocaleLowerCase('tr').includes(q))
    );
  }, [list, city, query]);

  return (
    <section
      id="salonlar"
      className="max-w-[1240px] mx-auto px-6 pt-[110px] pb-[100px] scroll-mt-16"
    >
      <Reveal>
        <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
          <div className="flex flex-col gap-3.5">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-red-dark">
              Çarkı aktif salonlar
            </span>
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(34px,4.2vw,54px)] leading-[1.02] tracking-[-.03em]">
              Hangi salonda çevireceksin?
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <label className="flex flex-col gap-1.5 text-[13px] font-bold text-ck-muted">
              Şehir
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${FIELD} min-w-[170px]`}
              >
                <option value="">Tüm şehirler</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold text-ck-muted">
              Salon ara
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Salon adı…"
                className={`${FIELD} min-w-[220px]`}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[22px]">
          {filtered.map((company) => (
            <Link
              key={company.slug}
              href={`/${company.slug}`}
              className="no-underline text-ck-ink bg-white rounded-[28px] overflow-hidden border-[1.5px] border-ck-line flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="relative h-[200px] bg-ck-line">
                <Image
                  loader={({ src }) => src}
                  alt={company.title}
                  src={
                    company.logo
                      ? `https://api.cevirkazan360.com/public/images/${company.logo}`
                      : 'https://placehold.co/320x180?text=Hazırlanıyor...'
                  }
                  width={0}
                  height={0}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                {company.is_show_wheel && (
                  <span className="absolute top-3.5 left-3.5 bg-ck-ink text-ck-yellow text-xs font-bold px-3 py-[7px] rounded-full flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full bg-ck-yellow"
                      aria-hidden="true"
                    />
                    Çark aktif
                  </span>
                )}
              </div>
              <div className="px-[22px] pt-[22px] pb-6 flex flex-col gap-2.5 flex-1">
                <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-[21px] tracking-[-.01em]">
                  {company.title}
                </h3>
                {company.description && (
                  <p className="m-0 text-sm text-ck-muted leading-normal">
                    {company.description}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2 gap-3 mt-auto">
                  <span className="flex items-center gap-1.5 text-sm text-ck-muted">
                    <LuMapPin size={16} aria-hidden="true" />
                    {[company.district, company.city].filter(Boolean).join(', ')}
                  </span>
                  <span className="bg-ck-red text-white font-bold text-sm px-4 py-2.5 rounded-full whitespace-nowrap">
                    Çarkı Çevir
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <div className="rounded-[28px] border-2 border-dashed border-ck-input flex flex-col items-center justify-center gap-3.5 px-7 py-10 text-center min-h-[380px] box-border">
            <span className="w-16 h-16 rounded-full bg-ck-ink text-ck-yellow flex items-center justify-center">
              <LuPlus size={28} aria-hidden="true" />
            </span>
            <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-[22px]">
              Buraya senin salonun gelsin
            </h3>
            <p className="m-0 text-[15px] text-ck-muted leading-normal max-w-[260px]">
              Çarkını kur, müşterilerin hediye kazanarak randevu alsın.
            </p>
            <Link
              href={SALON_APPLY_HREF}
              className="font-bold text-[15px] text-ck-red-dark hover:text-[#8F2614]"
            >
              Salonunu ekle →
            </Link>
          </div>
        </div>

        {list.length > 0 && filtered.length === 0 && (
          <p className="mt-6 text-ck-muted" aria-live="polite">
            Aramanla eşleşen salon bulunamadı.
          </p>
        )}
      </Reveal>
    </section>
  );
};

export default Salons;
