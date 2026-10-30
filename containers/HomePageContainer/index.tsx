import ClosingCta from '@/components/home/ClosingCta';
import DemoWheel from '@/components/home/DemoWheel';
import Faq from '@/components/home/Faq';
import ForSalons from '@/components/home/ForSalons';
import Hero from '@/components/home/Hero';
import HomeFooter from '@/components/home/HomeFooter';
import HomeNav from '@/components/home/HomeNav';
import HowItWorks from '@/components/home/HowItWorks';
import Marquee from '@/components/home/Marquee';
import Salons from '@/components/home/Salons';
import ICompany from '@/types/ICompany';
import React from 'react';

interface HomePageContainerProps {
  list: ICompany[];
}

const HomePageContainer = ({ list = [] }: HomePageContainerProps) => {
  const first = list[0];

  return (
    <>
      <HomeNav />
      <main>
        <Hero
          salonTitle={first?.title ?? 'Salon adın'}
          salonSlug={first?.slug ?? 'salon-adin'}
        />
        <Marquee />
        <HowItWorks />
        <DemoWheel />
        <Salons list={list} />
        <ForSalons />
        <Faq />
        <ClosingCta />
      </main>
      <HomeFooter />

      <a
        href="#cark"
        className="md:hidden fixed bottom-4 left-4 right-4 z-30 bg-ck-yellow text-ck-ink no-underline font-bold text-base rounded-full min-h-12 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,.35)]"
      >
        Çarkı Dene
      </a>
    </>
  );
};

export default HomePageContainer;
