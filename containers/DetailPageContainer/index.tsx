import HomeFooter from '@/components/home/HomeFooter';
import HomeNav from '@/components/home/HomeNav';
import SalonFlow from '@/components/salon/SalonFlow';
import SalonHero from '@/components/salon/SalonHero';
import SalonHours from '@/components/salon/SalonHours';
import SalonMap from '@/components/salon/SalonMap';
import SalonJsonLd from '@/components/salon/SalonJsonLd';
import SalonReviews from '@/components/salon/SalonReviews';
import SalonServices from '@/components/salon/SalonServices';
import SalonTeam from '@/components/salon/SalonTeam';
import type { BusySlot } from '@/components/salon/time';
import ICompany from '@/types/ICompany';
import IGift from '@/types/IGift';
import IService from '@/types/IService';
import { IStaffPublic } from '@/types/IStaff';
import IWorkingHour from '@/types/IWorkingHour';
import React from 'react';

interface DetailPageContainerProps {
  company: ICompany;
  gifts: IGift[];
  services: IService[];
  occupiedSlots: BusySlot[];
  staff: IStaffPublic[];
  workingHours: IWorkingHour[];
  reviews?: React.ComponentProps<typeof SalonReviews>['initial'] | null;
}

const DetailPageContainer = ({
  company,
  gifts = [],
  services = [],
  occupiedSlots = [],
  staff = [],
  workingHours = [],
  reviews = null,
}: DetailPageContainerProps) => {
  return (
    <>
      <SalonJsonLd company={company} workingHours={workingHours} />
      <HomeNav />
      <main>
        <SalonHero company={company} workingHours={workingHours} />
        <SalonFlow
          company={company}
          gifts={gifts}
          services={services}
          occupiedSlots={occupiedSlots}
          staffList={staff}
          workingHours={workingHours}
        />

        {/* web: sol sütunda hizmet + ekip, sağda çalışma saatleri (kaydırınca sabit kalır) */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-20 grid gap-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10 items-start">
          <div className="flex flex-col gap-12 min-w-0">
            <SalonServices services={services} />
            <SalonTeam staff={staff} />
            {reviews && <SalonReviews slug={company.slug} initial={reviews} />}
          </div>
          <aside className="lg:sticky lg:top-24">
            <SalonHours hours={workingHours} />
          </aside>
        </div>

        <SalonMap company={company} />
      </main>
      <HomeFooter />
    </>
  );
};

export default DetailPageContainer;
