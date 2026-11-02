import ICompany from '@/types/ICompany';
import React from 'react';
import { LuMapPin, LuNavigation } from 'react-icons/lu';
import Reveal from '@/components/home/Reveal';
import { directionsUrl, mapEmbedSrc } from './map';

interface SalonMapProps {
  company: ICompany;
}

const SalonMap = ({ company }: SalonMapProps) => {
  const src = mapEmbedSrc(company);
  if (!src) return null;

  const directions = directionsUrl(company);
  const location = [company.district, company.city].filter(Boolean).join(', ');

  return (
    <section id="konum" className="px-4 sm:px-6 pb-20 scroll-mt-20">
      <Reveal className="max-w-[1100px] mx-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-brand-dark">
              Konum
            </span>
            <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(28px,3.4vw,40px)] tracking-[-.03em]">
              Bizi bul
            </h2>
            {(company.address_text || location) && (
              <p className="m-0 flex items-start gap-2 text-ck-muted">
                <LuMapPin size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {company.address_text}
                  {company.address_text && location ? ' · ' : ''}
                  {location}
                </span>
              </p>
            )}
          </div>

          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="ck-btn bg-ck-night text-white no-underline font-bold text-[15px] px-6 rounded-full min-h-12 inline-flex items-center gap-2 hover:bg-ck-night-soft hover:shadow-[0_10px_24px_rgba(86,14,34,.3)]"
            >
              <LuNavigation size={18} aria-hidden="true" />
              Yol tarifi al
            </a>
          )}
        </div>

        <div className="h-[380px] rounded-[28px] overflow-hidden border-[1.5px] border-ck-line shadow-[0_20px_50px_rgba(86,14,34,.12)]">
          <iframe
            src={src}
            title={`${company.title} konumu`}
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            // Google Haritalar'ın çalışması için gereken en dar izin kümesi
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="!w-full !h-full"
          />
        </div>
      </Reveal>
    </section>
  );
};

export default SalonMap;
