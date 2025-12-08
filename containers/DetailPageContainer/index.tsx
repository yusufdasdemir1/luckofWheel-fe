'use client';
import Button from '@/components/panel/Button';
import Input from '@/components/panel/Input';
import Wheel2 from '@/components/Wheel2';
import { createMeeting, registerByCompanySlug } from '@/services/publicService';
import { useAlertStore } from '@/stores/alertStore';
import ICompany from '@/types/ICompany';
import IGift from '@/types/IGift';
import IService from '@/types/IService';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface DetailPageContainerProps {
  company: ICompany;
  gifts: IGift[];
  services: IService[];
}

const DetailPageContainer = ({
  company,
  gifts,
  services,
}: DetailPageContainerProps) => {
  const { addAlert } = useAlertStore();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'before' | 'wheel' | 'meet' | 'success'>(
    'before'
  );
  const [data, setData] = useState({
    name: 'nazif can',
    surname: 'durgut',
    phone: '05370281404',
    email: 'nazifcandurgt@gmail.com',
  });
  const [earnedGift, setEarnedGift] = useState<any>(null);
  const [meetData, setMeetData] = useState({
    date: '2025-12-08',
    time: '10:00',
  });
  const [service, setService] = useState<string>(
    services.length > 0 ? services[0].title : ''
  );

  const totalChance = gifts.reduce((acc, gift) => acc + gift.chance, 0);
  const diff = 1 - totalChance;

  if (diff > 0) {
    gifts.push({
      title: 'Kazanamadınız!',
      chance: diff,
      description: '',
      is_active: true,
      gift_color: '#E1BEE7',
    });
  }

  const handleChange = (field: string, value: string) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleShowWheel = async () => {
    setLoading(true);
    const [err, res] = await registerByCompanySlug(company.slug, data);
    setLoading(false);

    if (err) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: 'Hata',
        content: err.error || 'Kayıt sırasında bir hata oluştu.',
      });
    }

    setMode('wheel');
    setEarnedGift(res.gift_views);

    setTimeout(() => {
      setMode('meet');
    }, 4000);
  };

  const handleCreateMeet = async () => {
    const payload = {
      phone: data.phone,
      service_title: service,
      date: meetData.date,
      time: meetData.time,
    };

    setLoading(true);
    const [err, res] = await createMeeting(company.slug, payload);
    setLoading(false);

    if (err) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: 'Hata',
        content: err.error || 'Kayıt sırasında bir hata oluştu.',
      });
    }

    setMode('success');

    console.log({ res });

    addAlert({
      id: Math.random().toString(36).substring(2, 9),
      type: 'success',
      title: 'Başarılı',
      content: 'Randevunuz başarıyla oluşturuldu.',
    });
  };

  return (
    <>
      <div className="container flex items-center justify-center mt-12">
        <div className="w-full max-w-[960px] border border-slate-200 p-8 rounded-lg box-border flex gap-8">
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
            className="w-full max-w-[400px] min-w-[400px] !aspect-video object-cover rounded-lg mb-2 overflow-hidden shadow-lg"
          />
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-4xl font-bold">{company.title}</h1>
            <p className="text-slate-600 mt-2">{company.description}</p>

            <p className="text-slate-600 mt-auto">
              <span>Telefon: </span>
              <Link className="font-bold" href={`tel:${company.phone}`}>
                {company.phone}
              </Link>
            </p>
            <p className="text-slate-600">
              <span>E-posta: </span>
              <Link className="font-bold" href={`mailto:${company.email}`}>
                {company.email}
              </Link>
            </p>

            <p className="text-slate-600 mb-2">{company.address_text}</p>
            <span className="text-sm text-slate-500 italic">
              {company.district}, {company.city}
            </span>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-center mt-12">
        {mode === 'before' && (
          <div className="w-full max-w-[400px] flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold mr-auto">Çark için</h2>
            <Input
              label="Adınız"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Soyadınız"
              value={data.surname}
              onChange={(e) => handleChange('surname', e.target.value)}
            />
            <Input
              label="Telefon"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <Input
              label="E-posta"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <Button loading={loading} onClick={handleShowWheel}>
              Çarkı Çevir
            </Button>
          </div>
        )}

        {mode === 'wheel' && (
          <Wheel2
            winnerTitle={earnedGift}
            data={gifts.map((i) => ({ ...i, chance: Number(i.chance) * 100 }))}
          />
        )}

        {mode === 'meet' && earnedGift && (
          <div className="w-full max-w-[400px] flex flex-col items-center gap-4">
            <h2 className="text-3xl font-semibold text-center">Tebrikler!</h2>
            <p className="text-2xl text-center inline-flex items-center gap-2">
              <strong className="text-green-500 text-4xl">{earnedGift}</strong>
              kazandınız!
            </p>

            <p className="w-[90%] mt-4 text-center text-slate-700">
              Randevu almak için lütfen aşağıdan tarih ve saat seçiniz.
            </p>

            <Input
              label="Randevu Tarihi"
              type="date"
              value={meetData.date}
              onChange={(e) =>
                setMeetData({ ...meetData, date: e.target.value })
              }
            />
            <Input
              label="Randevu Saati"
              type="time"
              value={meetData.time}
              onChange={(e) =>
                setMeetData({ ...meetData, time: e.target.value })
              }
            />

            <Button loading={loading} onClick={handleCreateMeet}>
              Randevu Al
            </Button>
          </div>
        )}

        {mode === 'success' && (
          <div className="w-full max-w-[450px] flex flex-col items-center gap-4">
            <h2 className="text-5xl font-semibold text-center text-green-500">
              Başarılı!
            </h2>
            <p className="text-2xl text-center inline-flex items-center gap-2">
              Randevunuz başarıyla oluşturuldu.
            </p>

            <p className="w-[90%] mt-4 text-center text-slate-700">
              Randevunuz için teşekkür ederiz. Sizi en kısa sürede bekliyoruz!
            </p>
          </div>
        )}
      </div>

      {company.embed_address && (
        <div className="container flex items-center justify-center mt-12">
          {
            <div className="w-full max-w-[960px] h-[400px] mt-8 rounded-lg overflow-hidden border border-slate-200">
              <iframe
                src={company.embed_address}
                style={{ border: 0 }}
                loading="lazy"
                className="!w-full !h-full"
              ></iframe>
            </div>
          }
        </div>
      )}
    </>
  );
};

export default DetailPageContainer;
