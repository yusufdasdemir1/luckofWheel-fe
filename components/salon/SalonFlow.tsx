'use client';
import { apiErrorMessage } from '@/utils/apiError';
import {
  createMeeting,
  fetchOccupiedSlotsByCompanySlug,
  registerByCompanySlug,
  spinByCompanySlug,
} from '@/services/publicService';
import { useAlertStore } from '@/stores/alertStore';
import { useSalonPickStore } from '@/stores/salonPickStore';
import ICompany, { WheelMode } from '@/types/ICompany';
import IGift from '@/types/IGift';
import IService from '@/types/IService';
import { IStaffPublic } from '@/types/IStaff';
import IWorkingHour from '@/types/IWorkingHour';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import StepBooking from './StepBooking';
import StepInfo, { InfoData, InfoErrors } from './StepInfo';
import StepSuccess, { BookingSummary } from './StepSuccess';
import StepWheel from './StepWheel';
import Stepper, { StepKey } from './Stepper';
import { BusySlot, isClosedDay, nextDays } from './time';

type Mode = StepKey | 'success';

// adımların sırası çark moduna göre değişir
const STEPS_BY_WHEEL_MODE: Record<WheelMode, StepKey[]> = {
  before: ['info', 'wheel', 'meet'],
  after: ['info', 'meet', 'wheel'],
  none: ['info', 'meet'],
};

interface SalonFlowProps {
  company: ICompany;
  gifts: IGift[];
  services: IService[];
  occupiedSlots: BusySlot[];
  staffList: IStaffPublic[];
  workingHours: IWorkingHour[];
}

// telefonun son 10 hanesi: 0 ile ya da +90 ile yazılmış olsa da aynı numara
const toE164 = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return '+90' + digits.slice(-10);
};

const randomId = () => Math.random().toString(36).substring(2, 9);

// Hediyede renk boş ya da geçersizse çark site paletinden bir renk alır
const WHEEL_PALETTE = ['#8E1330', '#C9A35B', '#560E22', '#F2EAE2'];
const isHexColor = (color?: string) =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((color ?? '').trim());

const SalonFlow = ({
  company,
  gifts,
  services,
  occupiedSlots,
  staffList,
  workingHours,
}: SalonFlowProps) => {
  const { addAlert } = useAlertStore();

  // wheel_mode gelmezse eski is_show_wheel bayrağına düşülür
  const wheelMode: WheelMode =
    company.wheel_mode ?? (company.is_show_wheel ? 'before' : 'none');
  const steps = STEPS_BY_WHEEL_MODE[wheelMode];

  const [mode, setMode] = useState<Mode>('info');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InfoData>({
    name: '',
    surname: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<InfoErrors>({});
  const [earnedGift, setEarnedGift] = useState<string | null>(null);
  const [earnedGiftMessage, setEarnedGiftMessage] = useState<string | null>(null);

  const days = useMemo(() => nextDays(7), []);
  // açılışta ilk açık gün seçili gelir (bugün kapalıysa ertesi gün gibi)
  const [date, setDate] = useState<string>(
    () => days.find((d) => !isClosedDay(d, workingHours)) ?? days[0]
  );
  const [time, setTime] = useState<string | null>(null);
  const [service, setService] = useState<string>(services[0]?.title ?? '');
  const [staffId, setStaffId] = useState<number | null>(null);
  // dolu saatler: çalışan seçilince o çalışanın takvimi yüklenir
  const [busy, setBusy] = useState<BusySlot[]>(occupiedSlots);
  const [busyLoading, setBusyLoading] = useState(false);
  const busyRequest = useRef(0);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  // çark hakkı: before'da kayıt cevabından, after'da randevu cevabından gelir
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const duration = services.find((s) => s.title === service)?.duration ?? 30;
  const staffName = (() => {
    const st = staffList.find((x) => x.id === staffId);
    return st ? `${st.name} ${st.surname}`.trim() : '';
  })();

  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // adım değişince kartın başına yumuşakça kaydır (ilk açılışta değil)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cardRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [mode]);

  const coloredGifts = useMemo(
    () =>
      gifts.map((g, i) => ({
        ...g,
        gift_color: isHexColor(g.gift_color)
          ? g.gift_color
          : WHEEL_PALETTE[i % WHEEL_PALETTE.length],
      })),
    [gifts]
  );

  // Çark dilimleri: şans toplamı 1'in altındaysa kalan kısım "Kazanamadınız!" dilimi olur
  const wheelGifts = useMemo(() => {
    const list = coloredGifts.map((g) => ({
      ...g,
      chance: Number(g.chance) * 100,
    }));
    const total = gifts.reduce((acc, g) => acc + Number(g.chance), 0);
    const rest = 1 - total;
    if (rest > 0.0001) {
      list.push({
        title: 'Kazanamadınız!',
        chance: rest * 100,
        description: '',
        is_active: true,
        gift_color: '#F2EAE2',
      });
    }
    return list;
  }, [coloredGifts, gifts]);

  const handleChange = (field: keyof InfoData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next: InfoErrors = {};
    if (!data.name.trim()) next.name = 'Adını yaz.';
    if (!data.surname.trim()) next.surname = 'Soyadını yaz.';
    if (data.phone.replace(/\D/g, '').length < 10)
      next.phone = 'Geçerli bir telefon numarası yaz.';
    if (!/^\S+@\S+\.\S+$/.test(data.email.trim()))
      next.email = 'Geçerli bir e-posta adresi yaz.';
    return next;
  };

  const handleShowWheel = async () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const [err, res] = await registerByCompanySlug(company.slug, {
      ...data,
      email: data.email.trim(),
      phone: toE164(data.phone),
    });
    setLoading(false);

    if (err) {
      return addAlert({
        id: randomId(),
        type: 'error',
        title: 'Hata',
        content: apiErrorMessage(err, 'Kayıt sırasında bir hata oluştu.'),
      });
    }

    // çark burada çevrilmez: hak bilgisi alınır, çark randevudan önceyse çark adımı açılır
    setCanSpin(!!res?.can_spin);
    setRemainingSeconds(res?.remaining_seconds ?? 0);
    setMode(wheelMode === 'before' && gifts.length > 0 ? 'wheel' : 'meet');
  };

  // çark adımından sonra: randevudan önceyse randevuya, sonraysa başarı ekranına geçilir
  const leaveWheel = () => setMode(wheelMode === 'after' ? 'success' : 'meet');

  const handleWheelFinish = () => {
    setTimeout(() => {
      leaveWheel();
      new Audio('/win.mp3').play().catch(() => {});
    }, 900);
  };

  // müşteri çark butonuna basınca backend çevirir, çark kazanılan hediyede durur
  const handleSpin = async () => {
    setSpinLoading(true);
    const [err, res] = await spinByCompanySlug(company.slug, {
      phone: toE164(data.phone),
      ...(meetingId ? { meeting_id: meetingId } : {}),
    });
    setSpinLoading(false);

    if (err) {
      // hak dolmuşsa çark adımı kalan süreyi gösterir
      if (typeof err.remaining_seconds === 'number') {
        setCanSpin(false);
        setRemainingSeconds(err.remaining_seconds);
      }
      return addAlert({
        id: randomId(),
        type: 'error',
        title: 'Çark',
        content: apiErrorMessage(err, 'Çark çevrilemedi, lütfen tekrar deneyin.'),
      });
    }

    const gift: string | null = res?.gift_views ?? null;
    if (!gift) return;

    setEarnedGift(gift);
    setEarnedGiftMessage(res?.message ?? null);
    setCanSpin(false);
    setRemainingSeconds(res?.remaining_seconds ?? 0);
    setSummary((prev) => (prev ? { ...prev, gift } : prev));

    // hediye çarkta yoksa animasyon atlanır
    if (wheelGifts.some((g) => g.title === gift)) {
      setSpinKey((k) => k + 1);
    } else {
      leaveWheel();
    }
  };

  // her çalışanın takvimi ayrıdır: seçilince sadece o çalışanın dolu saatleri gelir
  const handlePickStaff = async (id: number) => {
    setStaffId(id);
    setTime(null);

    const request = ++busyRequest.current;
    setBusyLoading(true);
    const [err, res] = await fetchOccupiedSlotsByCompanySlug(company.slug, id);
    if (request !== busyRequest.current) return; // daha yeni bir seçim var

    setBusyLoading(false);
    if (err) {
      setBusy([]);
      return addAlert({
        id: randomId(),
        type: 'error',
        title: 'Hata',
        content: 'Dolu saatler yüklenemedi. Lütfen kuaförü tekrar seçin.',
      });
    }
    setBusy(Array.isArray(res) ? res : []);
  };

  // sayfadaki hizmet/kuaför kartlarından gelen seçim forma işlenir
  const pickedService = useSalonPickStore((s) => s.service);
  const pickedStaff = useSalonPickStore((s) => s.staff);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (!pickedService.nonce) return;
    if (!services.some((s) => s.title === pickedService.value)) return;
    setService(pickedService.value as string);
    setTime(null);
    setPicked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedService.nonce]);

  useEffect(() => {
    if (!pickedStaff.nonce || pickedStaff.value === null) return;
    if (!staffList.some((st) => st.id === pickedStaff.value)) return;
    handlePickStaff(pickedStaff.value);
    setPicked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedStaff.nonce]);

  // sayfadaki kartlardan yapılan seçimi iptal eder: form ilk açılıştaki haline döner
  const clearSelection = () => {
    busyRequest.current++; // yoldaki dolu saat isteği varsa sonucu yok sayılır
    setPicked(false);
    setService(services[0]?.title ?? '');
    setStaffId(null);
    setTime(null);
    setBusy(occupiedSlots);
    setBusyLoading(false);
  };

  const handleCreateMeet = async () => {
    if (!time) return;

    setLoading(true);
    const [err, res] = await createMeeting(company.slug, {
      phone: toE164(data.phone),
      service_title: service,
      date,
      time,
      staff_id: staffId,
      note: '',
    });

    if (err) {
      setLoading(false);

      // başkası aynı saati almış olabilir: dolu saatleri tazele, seçimi temizle
      setTime(null);
      const [, fresh] = await fetchOccupiedSlotsByCompanySlug(
        company.slug,
        staffId
      );
      if (Array.isArray(fresh)) setBusy(fresh);

      return addAlert({
        id: randomId(),
        type: 'error',
        title: 'Hata',
        content: apiErrorMessage(err, 'Randevu oluşturulurken bir hata oluştu.'),
      });
    }

    const base: BookingSummary = {
      date,
      time,
      service,
      staff: staffName,
      price: services.find((s) => s.title === service)?.price,
      gift: earnedGift,
    };

    addAlert({
      id: randomId(),
      type: 'success',
      title: 'Başarılı',
      content: 'Randevunuz başarıyla oluşturuldu.',
    });

    setLoading(false);
    setSummary(base);

    // çark randevudan sonraysa: hak bilgisiyle çark adımı açılır
    if (wheelMode === 'after' && res?.meeting_id && gifts.length > 0) {
      setMeetingId(res.meeting_id);
      setCanSpin(!!res.can_spin);
      setRemainingSeconds(res.remaining_seconds ?? 0);
      return setMode('wheel');
    }

    setMode('success');
  };

  return (
    <section
      id="randevu"
      className="relative -mt-24 pb-20 px-4 sm:px-6 scroll-mt-20"
    >
      <div
        ref={cardRef}
        className="max-w-[1100px] mx-auto scroll-mt-24 bg-white rounded-[32px] border border-ck-line shadow-[0_30px_80px_rgba(86,14,34,.18)] p-5 sm:p-8 md:p-10 flex flex-col gap-8"
      >
        <Stepper
          steps={steps}
          current={mode === 'success' ? steps.length : steps.indexOf(mode)}
        />

        {mode === 'info' && (
          <StepInfo
            selection={
              picked
                ? { service, staff: staffName, onClear: clearSelection }
                : null
            }
            company={company}
            wheelMode={wheelMode}
            gifts={coloredGifts}
            data={data}
            errors={errors}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleShowWheel}
          />
        )}

        {mode === 'wheel' && (
          <StepWheel
            gifts={wheelGifts}
            canSpin={canSpin}
            remainingSeconds={remainingSeconds}
            winner={earnedGift}
            spinKey={spinKey}
            loading={spinLoading}
            continueLabel={
              wheelMode === 'after' ? 'Tamam' : 'Randevuya devam et'
            }
            onSpin={handleSpin}
            onContinue={leaveWheel}
            onFinish={handleWheelFinish}
          />
        )}

        {mode === 'meet' && (
          <StepBooking
            earnedGift={earnedGift}
            earnedGiftMessage={earnedGiftMessage}
            services={services}
            days={days}
            date={date}
            time={time}
            service={service}
            staffList={staffList}
            staffId={staffId}
            hours={workingHours}
            duration={duration}
            busyLoading={busyLoading}
            busySlots={busy}
            loading={loading}
            onPickDate={(d) => {
              setDate(d);
              setTime(null);
            }}
            onPickTime={setTime}
            onPickService={(title) => {
              setService(title);
              setTime(null); // süre değişince seçili saat sığmayabilir
            }}
            onPickStaff={handlePickStaff}
            onSubmit={handleCreateMeet}
          />
        )}

        {mode === 'success' && summary && (
          <StepSuccess
            summary={summary}
            phone={company.phone}
            salonTitle={company.title}
          />
        )}
      </div>
    </section>
  );
};

export default SalonFlow;
