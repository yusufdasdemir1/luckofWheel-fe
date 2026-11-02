import ICompany from '@/types/ICompany';
import IWorkingHour from '@/types/IWorkingHour';
import { imageUrl } from '@/utils/apiUrl';
import { sanitizeWebUrl } from '@/utils/sanitizeUrl';
import Image from 'next/image';
import React from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa6';
import {
  LuCalendarCheck,
  LuGift,
  LuMail,
  LuMapPin,
  LuNavigation,
  LuPhone,
} from 'react-icons/lu';
import { directionsUrl } from './map';
import { whatsappUrl } from './contact';
import OpenNow from './OpenNow';

interface SalonHeroProps {
  company: ICompany;
  workingHours: IWorkingHour[];
}

const SalonHero = ({ company, workingHours }: SalonHeroProps) => {
  const location = [company.district, company.city].filter(Boolean).join(', ');
  const directions = directionsUrl(company);
  // salon sahibinin girdiği adresler: sadece http(s) kabul edilir (javascript:/data: reddedilir)
  const socials = [
    { href: sanitizeWebUrl(company.instagram_url), label: 'Instagram', Icon: FaInstagram },
    { href: sanitizeWebUrl(company.youtube_url), label: 'YouTube', Icon: FaYoutube },
    { href: sanitizeWebUrl(company.facebook_url), label: 'Facebook', Icon: FaFacebook },
  ].filter((s): s is typeof s & { href: string } => !!s.href);

  return (
    <section className="relative overflow-hidden bg-ck-night text-white">
      <span
        aria-hidden="true"
        className="ck-glow pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[760px] max-w-full rounded-full bg-ck-coral/25 blur-3xl"
      />

      <div className="relative max-w-[820px] mx-auto px-6 pt-12 pb-36 lg:pt-16 lg:pb-40 flex flex-col items-center text-center gap-6">
        <div className="ck-enter-scale relative">
          <span
            aria-hidden="true"
            className="absolute -inset-2 rounded-full border border-ck-accent/60"
          />
          <div className="relative w-[190px] h-[190px] sm:w-[250px] sm:h-[250px] lg:w-[290px] lg:h-[290px] rounded-full overflow-hidden border-4 border-white/90 bg-ck-night-soft shadow-[0_24px_60px_rgba(0,0,0,.5)]">
            {company.logo ? (
              <Image
                alt={company.title}
                src={imageUrl(company.logo)}
                width={0}
                height={0}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="w-full h-full flex items-center justify-center font-[family-name:var(--font-bricolage)] font-extrabold text-6xl text-white/40"
              >
                {company.title.charAt(0).toLocaleUpperCase('tr')}
              </span>
            )}
          </div>
        </div>

        <div
          className="ck-enter-up flex flex-col items-center gap-4"
          style={{ animationDelay: '120ms' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[34px]">
            <OpenNow hours={workingHours} />
            {company.is_show_wheel && (
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ck-night bg-ck-accent px-3.5 py-[7px] rounded-full">
                <LuGift size={14} aria-hidden="true" />
                Çarklı hediye
              </span>
            )}
          </div>

          <h1 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(38px,6vw,68px)] leading-[1] tracking-[-.035em] break-words">
            {company.title}
          </h1>

          {company.description && (
            <p className="m-0 text-lg leading-[1.6] text-[#E0D2D3] max-w-[560px]">
              {company.description}
            </p>
          )}

          {(location || company.address_text) && (
            <p className="m-0 flex items-start justify-center gap-2 text-[15px] text-[#E0D2D3] max-w-[520px]">
              <LuMapPin
                size={18}
                className="mt-0.5 shrink-0 text-ck-coral"
                aria-hidden="true"
              />
              <span>
                {company.address_text && (
                  <>
                    {company.address_text}
                    <br />
                  </>
                )}
                {location}
              </span>
            </p>
          )}
        </div>

        <div
          className="ck-enter-up flex flex-col items-center gap-4 pt-1"
          style={{ animationDelay: '220ms' }}
        >
          {/* ana aksiyonlar: webde tek satır */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#randevu"
              className="ck-btn bg-ck-coral text-white no-underline font-bold text-[16px] px-7 rounded-full min-h-[52px] inline-flex items-center gap-2 hover:brightness-110 hover:shadow-[0_12px_28px_rgba(0,0,0,.35)]"
            >
              <LuCalendarCheck size={19} aria-hidden="true" />
              Randevu al
            </a>
            <a
              href={`tel:${company.phone}`}
              className="ck-btn md:hidden bg-white text-ck-night no-underline font-bold text-[15px] px-6 rounded-full min-h-[52px] inline-flex items-center gap-2 hover:bg-ck-cream hover:shadow-[0_10px_24px_rgba(0,0,0,.3)]"
            >
              <LuPhone size={18} aria-hidden="true" />
              Ara
            </a>
            <a
              href={whatsappUrl(company.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="ck-btn bg-ck-wa text-white no-underline font-bold text-[15px] px-6 rounded-full min-h-[52px] inline-flex items-center gap-2 hover:brightness-110 hover:shadow-[0_10px_24px_rgba(0,0,0,.3)]"
            >
              <FaWhatsapp size={19} aria-hidden="true" />
              WhatsApp
            </a>
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="ck-btn text-white no-underline font-bold text-[15px] px-6 rounded-full border-[1.5px] border-white/40 min-h-[52px] inline-flex items-center gap-2 hover:bg-white/10 hover:border-white"
              >
                <LuNavigation size={18} aria-hidden="true" />
                Yol tarifi al
              </a>
            )}
          </div>

          {/* iletişim ve sosyal medya: ana butonların altında */}
          {(company.email || socials.length > 0) && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  aria-label="E-posta gönder"
                  className="ck-btn w-[52px] h-[52px] rounded-full bg-white/10 border border-white/25 text-white/90 flex items-center justify-center hover:bg-white/20 hover:border-white/50"
                >
                  <LuMail size={19} aria-hidden="true" />
                </a>
              )}
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="ck-btn w-[52px] h-[52px] rounded-full bg-white/10 border border-white/25 text-white/90 flex items-center justify-center hover:bg-white/20 hover:border-white/50"
                >
                  <Icon size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SalonHero;
