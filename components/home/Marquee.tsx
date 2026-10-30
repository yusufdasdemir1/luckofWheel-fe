import React from 'react';

const ITEMS = [
  '%10 İNDİRİM',
  'ÜCRETSİZ FÖN',
  'BAKIM HEDİYESİ',
  'KAŞ TASARIMI',
  '%20 İNDİRİM',
  'SÜRPRİZ HEDİYE',
  'SAKAL DÜZENLEME',
];

const Marquee = () => {
  // şerit -%50 kayar; içerik iki kez yazılınca döngü kesintisiz olur
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div
      className="bg-ck-yellow overflow-hidden border-y-2 border-ck-ink"
      aria-hidden="true"
    >
      <div className="ck-marquee flex w-max gap-11 py-4 font-[family-name:var(--font-bricolage)] font-extrabold text-[22px] tracking-tight whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i}>{item} ✦</span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
