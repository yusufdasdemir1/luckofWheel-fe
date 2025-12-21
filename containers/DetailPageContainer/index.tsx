'use client';
import Button from '@/components/panel/Button';
import Input from '@/components/panel/Input';
import Select from '@/components/panel/Select';
import Textarea from '@/components/panel/Textarea';
import Wheel2 from '@/components/Wheel2';
import { createMeeting, registerByCompanySlug } from '@/services/publicService';
import { useAlertStore } from '@/stores/alertStore';
import ICompany from '@/types/ICompany';
import IGift from '@/types/IGift';
import IService from '@/types/IService';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa6';

const today = DateTime.now().toISODate();
const todayDateTime = DateTime.now();

const nextDays: any[] = [];
let offset = 0;

while (nextDays.length < 7) {
  const day = DateTime.now().plus({ days: offset });

  // 1 = Pazartesi
  if (day.weekday !== 1) {
    nextDays.push(day.toISODate());
  }

  offset++;
}

const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8;
  return hour < 10 ? `0${hour}` : `${hour}`;
});

const halfs = ['00', '30'];

interface DetailPageContainerProps {
  company: ICompany;
  gifts: IGift[];
  services: IService[];
  occupiedSlots: any[];
}

const DetailPageContainer = ({
  company,
  gifts = [],
  services = [],
  occupiedSlots = [],
}: DetailPageContainerProps) => {
  const { addAlert } = useAlertStore();

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'before' | 'wheel' | 'meet' | 'success'>(
    'before'
  );
  const [data, setData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
  });
  const [earnedGift, setEarnedGift] = useState<any>(null);
  const [earnedGiftMessage, setEarnedGiftMessage] = useState<any>(null);
  const [meetData, setMeetData] = useState<any>({
    date: today,
    time: null,
    note: '',
  });
  const [service, setService] = useState<string>(
    services.length > 0 ? services[0].title : ''
  );

  const totalChance = gifts.reduce((acc, gift) => acc + gift.chance, 0);
  const diff = 1 - totalChance;

  const servicesOptions = services.map((s) => ({
    label: `${s.title} (${s.duration} dk - ${s.price} TL)`,
    value: s.title,
  }));

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
    const [err, res] = await registerByCompanySlug(company.slug, {
      ...data,
      phone: '+90' + data.phone.substring(data.phone.length - 10),
    });
    setLoading(false);

    if (err) {
      return addAlert({
        id: Math.random().toString(36).substring(2, 9),
        type: 'error',
        title: 'Hata',
        content:
          Object.values(err).join(', ') || 'Kayıt sırasında bir hata oluştu.',
      });
    }

    setMode('wheel');
    setEarnedGift(res.gift_views);
    setEarnedGiftMessage(res.message);

    setTimeout(() => {
      setMode('meet');
      const audio = new Audio('/win.mp3');
      audio.play();
      audio.volume = 1;
    }, 4000);
  };

  const handleCreateMeet = async () => {
    const payload = {
      phone: '+90' + data.phone.substring(data.phone.length - 10),
      service_title: service,
      date: meetData.date,
      time: meetData.time,
      note: meetData.note,
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

    addAlert({
      id: Math.random().toString(36).substring(2, 9),
      type: 'success',
      title: 'Başarılı',
      content: 'Randevunuz başarıyla oluşturuldu.',
    });
  };

  const isTimeBusy = (
    date: string,
    time: string,
    busySlots: {
      date: string;
      time: string;
      end_time: string;
    }[]
  ) => {
    return busySlots.some((slot) => {
      if (slot.date !== date) return false;

      const selectedTime = DateTime.fromISO(`${date}T${time}`);
      const start = DateTime.fromISO(`${slot.date}T${slot.time}`);
      const end = DateTime.fromISO(`${slot.date}T${slot.end_time}`);

      return selectedTime >= start && selectedTime < end;
    });
  };

  const company_color = company.company_color || 'black';

  return (
    <>
      <div className="container flex items-center justify-center mt-12">
        <div className="w-full max-w-[960px] border border-slate-200 p-8 rounded-lg box-border flex flex-col md:flex-row md:gap-8 gap-4">
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
            className="w-full md:max-w-[400px] md:min-w-[400px] !aspect-video object-cover rounded-lg overflow-hidden"
          />
          <div className="flex-1 flex flex-col gap-2">
            <h1
              className="text-4xl font-bold border-b-2 pb-2 w-fit"
              style={{
                borderColor: company_color,
              }}
            >
              {company.title}
            </h1>
            <p className="text-slate-600 mt-2">{company.description}</p>

            <p className="text-slate-600 mt-auto">
              <span>Telefon: </span>
              <Link
                className="font-bold"
                href={`tel:${company.phone}`}
                style={{
                  color: company_color,
                }}
              >
                {company.phone}
              </Link>
            </p>
            <p className="text-slate-600">
              <span>E-posta: </span>
              <Link
                className="font-bold"
                href={`mailto:${company.email}`}
                style={{
                  color: company_color,
                }}
              >
                {company.email}
              </Link>
            </p>

            <p className="text-slate-600 mb-2">{company.address_text}</p>
            <span className="text-sm text-slate-500 italic">
              {company.district}, {company.city}
            </span>

            <div className="flex gap-3" style={{ color: company_color }}>
              {company.instagram_url && (
                <Link
                  href={company.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </Link>
              )}
              {company.youtube_url && (
                <Link
                  href={company.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube />
                </Link>
              )}
              {company.facebook_url && (
                <Link
                  href={company.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center mt-12">
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

            <div className="w-full flex flex-col gap-1">
              <span className="text-sm text-black/90">Telefon</span>

              <div className="flex items-end">
                <div className="w-[50px] min-w-[50px] h-[45px] flex items-center justify-center bg-white border border-[#AEAEAE] text-sm font-medium rounded-l-md">
                  +90
                </div>
                <Input
                  value={data.phone}
                  placeholder="Telefon"
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="!border-l-0 !rounded-l-none"
                />
              </div>
            </div>

            <Input
              label="E-posta"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <Button
              loading={loading}
              onClick={handleShowWheel}
              style={{
                backgroundColor: company_color,
                borderColor: company_color,
              }}
            >
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
          <>
            <div className="w-full max-w-[460px] flex flex-col items-center gap-4">
              <h2 className="text-3xl font-semibold text-center">Tebrikler!</h2>
              <p className="text-2xl text-center inline-flex flex-col items-center justify-center gap-2">
                <strong className="text-green-500 text-3xl">
                  {earnedGift}
                </strong>
                <strong className="text-green-500 text-3xl underline">
                  {earnedGiftMessage}
                </strong>
                kazandınız!
              </p>

              <p className="w-[90%] mt-4 text-center text-slate-700">
                Randevu almak için lütfen aşağıdan tarih ve saat seçiniz.
              </p>
            </div>

            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-2 my-12">
              <div className="flex px-4 md:px-0 flex-col md:flex-row items-center gap-1">
                {nextDays.map((date) => (
                  <button
                    className={classNames(
                      'w-full h-[40px] flex items-center justify-center bg-slate-50 px-2 box-border rounded-md cursor-pointer hover:font-medium',
                      { 'text-white': date === meetData.date }
                    )}
                    style={{
                      backgroundColor:
                        date === meetData.date ? company_color : '#fcf9fa',
                    }}
                    key={date}
                    onClick={() => setMeetData({ ...meetData, date: date })}
                  >
                    {date === today
                      ? 'Bugün'
                      : date === DateTime.now().plus({ days: 1 }).toISODate()
                      ? 'Yarın'
                      : DateTime.fromISO(date)
                          .setLocale('tr')
                          .toFormat('dd LLLL cccc')}
                  </button>
                ))}
              </div>

              <div className="w-fit mx-auto my-4">
                <div className="flex flex-col gap-2">
                  {hours.map((hour) => (
                    <div
                      className={classNames(
                        'flex items-center gap-2 border-b border-slate-200 pb-2 last:border-0',
                        {
                          hidden:
                            DateTime.fromISO(meetData.date).weekday === 7 &&
                            ['08', '09'].includes(hour),
                        }
                      )}
                      key={hour}
                    >
                      <div className="w-[100px] min-w-[100px] flex items-center justify-center mr-2">
                        <strong className="font-bold text-lg">{hour}:00</strong>
                      </div>

                      {halfs.map((h, index) => (
                        <button
                          className={classNames(
                            'w-[60px] min-w-[60px] h-[40px] flex items-center justify-center bg-slate-100 px-2 box-border rounded-md cursor-pointer hover:font-medium',
                            {
                              hidden: ['08:00'].includes(`${hour}:${h}`),
                              'ml-auto': hour === '08' && h === '30',
                              'text-white': meetData.time === `${hour}:${h}`,
                              '!opacity-50 line-through !cursor-not-allowed hover:font-normal':
                                isTimeBusy(
                                  meetData.date,
                                  `${hour}:${h}`,
                                  occupiedSlots
                                ) ||
                                DateTime.fromISO(
                                  `${meetData.date}T${hour}:${h}`
                                ) <= todayDateTime,
                            }
                          )}
                          style={{
                            backgroundColor:
                              meetData.time === `${hour}:${h}`
                                ? company_color
                                : '#f9f3f4',
                          }}
                          key={index}
                          onClick={() =>
                            !isTimeBusy(
                              meetData.date,
                              `${hour}:${h}`,
                              occupiedSlots
                            ) &&
                            setMeetData({
                              ...meetData,
                              time: `${hour}:${h}`,
                            })
                          }
                        >
                          {hour}:{h}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full max-w-[400px] flex flex-col items-center gap-4">
              <Select
                label="Hizmet Seçiniz"
                options={servicesOptions}
                value={service}
                onSelect={setService}
              />

              <Textarea
                label="Not (İsteğe bağlı)"
                value={meetData.note}
                onChange={(e) =>
                  setMeetData({ ...meetData, note: e.target.value })
                }
              />

              <Button
                loading={loading}
                onClick={handleCreateMeet}
                disabled={!meetData.time || !meetData.date || !service}
                style={{
                  backgroundColor: company_color,
                  borderColor: company_color,
                }}
              >
                Randevu Al
              </Button>
            </div>
          </>
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
            <div className="w-full px-6 md:px-0 md:max-w-[960px] h-[400px] mt-8 rounded-lg overflow-hidden">
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

      <Link
        href={`https://api.whatsapp.com/send?phone=${company.phone}&text=Randevu%20olu%C5%9Fturmak%20istiyorum.`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[60px] h-[60px] rounded-full bg-[#128C7E] text-white fixed bottom-5 right-5 z-30 flex items-center justify-center cursor-pointer shadow-lg"
      >
        <FaWhatsapp size={24} />
      </Link>
    </>
  );
};

export default DetailPageContainer;
