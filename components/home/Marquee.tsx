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

// Bir grup ekrandan geniş olmalı (4K dahil), yoksa döngü sonunda boşluk görünür
const GROUP = [...ITEMS, ...ITEMS, ...ITEMS];

const Marquee = () => {
  return (
    <div
      className="bg-ck-night text-white overflow-hidden border-t border-white/10 h-16 flex items-center"
      aria-hidden="true"
    >
      {/* iki özdeş grup yan yana; şerit tam bir grup genişliği kayıp başa döner (-%50) */}
      <div className="ck-marquee flex w-max items-center font-[family-name:var(--font-bricolage)] font-extrabold text-[22px] tracking-tight whitespace-nowrap">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 gap-11 pr-11">
            {GROUP.map((item, i) => (
              <span key={i}>
                {item} <span className="text-ck-coral">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
