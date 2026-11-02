import React from 'react';
import Reveal from './Reveal';

const QUESTIONS = [
  {
    q: 'Çarkı kaç kez çevirebilirim?',
    a: 'Her salonda telefon numarası başına bir çevirme hakkın var. Çarkın ne kadar sürede yeniden dönebileceğini her salon sahibi kendi belirlediği aralıkla ayarlar. Bu süre dolunca aynı salonda tekrar çevirebilirsin.',
  },
  {
    q: 'Kazandığım hediyeyi nasıl kullanırım?',
    a: 'Çarkı çevirdikten sonra tarih ve saat seçip randevunu oluştur. Randevunda kazandığın hediyeyi salona göster.',
  },
  {
    q: 'Salon eklemenin ücreti nedir?',
    a: 'Fiyat, salonunun ihtiyacına göre birlikte konuşularak belirlenir ve aylık abonelik şeklinde ilerler. Başvuru formunu doldur, sana dönüş yapıp detayları anlatalım.',
  },
  {
    q: 'Salonumu nasıl eklerim?',
    a: 'Salon başvuru formunu doldur; bilgilerin hazır bir mesajla WhatsApp üzerinden bize ulaşır. Sana dönüş yapıp salonunun sayfasını ve çarkını birlikte kuralım.',
  },
];

const Faq = () => {
  return (
    <section className="max-w-[900px] mx-auto px-6 pt-[110px] pb-[110px]">
      <Reveal>
        <h2 className="m-0 mb-7 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(30px,3.6vw,44px)] tracking-[-.03em]">
          Sık sorulanlar
        </h2>
        <div className="flex flex-col gap-3">
          {QUESTIONS.map((item) => (
            <details
              key={item.q}
              className="bg-ck-surface border-[1.5px] border-ck-line rounded-[20px] px-6 py-5"
            >
              <summary className="cursor-pointer font-bold text-[17px] min-h-6">
                {item.q}
              </summary>
              <p className="mt-3 mb-0 text-ck-muted leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
};

export default Faq;
