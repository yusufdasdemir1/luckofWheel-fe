import ICompany from '@/types/ICompany';
import IWorkingHour from '@/types/IWorkingHour';
import { imageUrl } from '@/utils/apiUrl';
import { sanitizeWebUrl } from '@/utils/sanitizeUrl';
import { SITE_NAME, absoluteUrl } from '@/utils/siteUrl';
import { SITE_LOGO_URL } from '@/utils/siteLogo';
import React from 'react';

// weekday: 0 = Pazartesi ... 6 = Pazar
const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Google'a salonu yapılandırılmış veri olarak tanıtır (adres, saatler, puan)
const SalonJsonLd = ({
  company,
  workingHours,
}: {
  company: ICompany;
  workingHours: IWorkingHour[];
}) => {
  const hasAddress = company.address_text || company.district || company.city;
  const sameAs = [
    company.instagram_url,
    company.facebook_url,
    company.youtube_url,
  ]
    .map((url) => sanitizeWebUrl(url))
    .filter((url): url is string => !!url);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: company.title,
    url: absoluteUrl(`/${company.slug}`),
    image: company.logo ? imageUrl(company.logo) : SITE_LOGO_URL,
    ...(company.description && { description: company.description }),
    ...(company.phone && { telephone: company.phone }),
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        ...(company.address_text && { streetAddress: company.address_text }),
        ...(company.district && { addressLocality: company.district }),
        ...(company.city && { addressRegion: company.city }),
        addressCountry: 'TR',
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(workingHours.length > 0 && {
      openingHoursSpecification: workingHours
        .filter((hour) => !hour.is_closed && DAYS[hour.weekday])
        .map((hour) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: DAYS[hour.weekday],
          opens: hour.opens.slice(0, 5),
          closes: hour.closes.slice(0, 5),
        })),
    }),
    // sadece onaylı yorum varsa eklenir (Google sahte/boş puanı cezalandırır)
    ...(company.rating_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: company.rating_avg,
        reviewCount: company.rating_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    provider: { '@type': 'Organization', name: SITE_NAME },
  };

  return (
    <script
      type="application/ld+json"
      // "<" kaçışlanır: salon adı/açıklaması </script> içerse bile sayfa bozulmaz
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
};

export default SalonJsonLd;
