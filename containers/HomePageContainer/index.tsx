'use client';
import Button from '@/components/panel/Button';
import ICompany from '@/types/ICompany';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface HomePageContainerProps {
  list: ICompany[];
}

const WHY_CHOOSE_US = [
  {
    title: 'Uzman ve Deneyimli Ekip',
    description:
      'Kadın ve erkek kuaförlüğünde uzmanlaşmış, sürekli kendini geliştiren profesyonel stilistlerimiz ile her tarza uygun kaliteli hizmet sunuyoruz.',
  },
  {
    title: 'Kişiye Özel Stil Tasarımı',
    description:
      'Saç yapınız, yüz şekliniz ve tarzınız analiz edilerek size özel saç kesimi, renklendirme ve bakım hizmetleri sunuyoruz.',
  },
  {
    title: 'Hijyen ve Steril Çalışma Alanı',
    description:
      'Tüm ekipmanlarımız düzenli sterilizasyondan geçer. Temiz, güvenli ve sağlıklı bir kuaför deneyimi sunarız.',
  },
  {
    title: 'Geniş Hizmet Yelpazesi',
    description:
      'Saç kesimi, renklendirme, ombre, balyaj, fön, bakım, sakal düzenleme ve daha birçok hizmeti tek çatıda topluyoruz.',
  },
  {
    title: 'Kaliteli ve Güvenilir Ürünler',
    description:
      'Saç ve cilt sağlığınızı korumak için yalnızca seçili, profesyonel ve dermatolojik olarak onaylı ürünler kullanıyoruz.',
  },
  {
    title: 'Müşteri Memnuniyeti Odaklı Hizmet',
    description:
      'İhtiyaçlarınızı dinler, beklentinizi karşılayan hatta aşan bir hizmet sunmak için özenle çalışırız.',
  },
];

const HomePageContainer = ({ list = [] }: HomePageContainerProps) => {
  return (
    <>
      <div className="w-full px-4 box-border md:px-0 py-20 bg-slate-50 border-b border-slate-200 min-h-[350px] flex items-center justify-center">
        <div className="container flex flex-col gap-4 items-center justify-center">
          <h2 className="text-4xl lg:text-5xl text-center font-bold leading-[56px]">
            Benzersiz <br />
            Berber Deneyimi
          </h2>
          <p className="md:text-xl text-center text-slate-600 md:max-w-[35%] mt-2">
            Uzman berberlerimizle mükemmel saç kesimi randevunuzu alın. Hızlı,
            pratik ve modern hayata uygun.
          </p>
          <div className="flex gap-4 mx-auto w-fit mt-4">
            <Link href="/kayit-ol">
              <Button color="green" size="small">
                Hemen Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-8 box-border md:px-0 w-full py-20 min-h-[350px] flex items-center justify-center">
        <div className="container flex flex-col gap-4 items-center justify-center">
          <h2 className="text-4xl lg:text-5xl text-center font-bold leading-[56px]">
            Berberlerimizle
            <br />
            Tanışın
          </h2>
          <p className="md:text-xl text-center text-slate-600 max-w-[80%] md:max-w-[35%] mt-2">
            Tercih ettiğiniz berberi seçin ve randevunuzu alın
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 gap-6">
            {list.map((company, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 rounded-lg bg-white flex flex-col gap-2 shadow-lg"
              >
                <Link href={`/${company.slug}`}>
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
                    className="w-full !aspect-video object-cover rounded-lg mb-2 overflow-hidden"
                  />
                </Link>
                <Link href={`/${company.slug}`}>
                  <h3 className="text-2xl font-semibold">{company.title}</h3>
                </Link>
                <p className="text-slate-600 mb-4">{company.description}</p>

                <span className="mt-auto mb-2 text-sm text-slate-500 italic">
                  {company.district}, {company.city}
                </span>
                <Link href={`/${company.slug}`}>
                  <Button color="blue" size="small">
                    Randevu Al
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full py-20 bg-slate-50 border-b border-t border-slate-200 min-h-[350px] flex items-center justify-center">
        <div className="container flex flex-col gap-4 items-center justify-center">
          <h2 className="text-4xl lg:text-5xl  text-center font-bold leading-[56px]">
            Neden
            <br />
            Bizi Seçmelisiniz?
          </h2>
          <p className="md:text-xl text-center text-slate-600 max-w-[80%] md:max-w-[35%] mt-2">
            Mükemmelliğe ve müşteri memnuniyetine bağlıyız
          </p>

          <div className="px-8 box-border md:px-0 max-w-[1150px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
            {WHY_CHOOSE_US.map((item, index) => (
              <div
                key={index}
                className="w-full p-8 border border-slate-300 rounded-lg flex items-center justify-center flex-col gap-4 bg-white"
              >
                <h3 className="text-center text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-center text-slate-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageContainer;
