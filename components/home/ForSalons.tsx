import Link from 'next/link';
import React from 'react';
import {
  LuCalendarCheck,
  LuCheck,
  LuCircleDot,
  LuGift,
  LuInstagram,
  LuScissors,
  LuShieldCheck,
  LuUserPlus,
} from 'react-icons/lu';
import { SALON_APPLY_HREF } from './constants';
import Reveal from './Reveal';

const CHECKS = [
  'Başvuru formunu doldur',
  'Sana dönüş yapıp birlikte kuralım',
  "Linkini Instagram bio'na koy",
];

const FEATURES = [
  {
    icon: LuGift,
    title: 'Kendi ödüllerini belirle',
    text: 'Ödülleri ve kazanma oranlarını panelden sen ayarlarsın.',
  },
  {
    icon: LuCalendarCheck,
    title: 'Randevular panelinde',
    text: 'Müşterin çarkı çevirdikten sonra tarih ve saat seçip randevusunu oluşturur.',
  },
  {
    icon: LuUserPlus,
    title: 'Müşteri listesi oluşur',
    text: 'Her çevirme ad, telefon ve e-postayla kayıt olur; kampanyalar için hazır liste.',
  },
  {
    icon: LuInstagram,
    title: 'Instagram bio linki',
    text: 'Tek link: sayfan, çarkın, iletişim ve konumun bir arada.',
  },
  {
    icon: LuScissors,
    title: 'Hizmetlerini ve fiyatlarını yönet',
    text: 'Hizmetlerini ekle; süre ve fiyatlarını istediğin zaman panelden güncelle.',
  },
  {
    icon: LuShieldCheck,
    title: 'Çevirme sıklığını sen belirle',
    text: 'Telefon numarasıyla eşleşen çevirme hakkı; bekleme süresini sen seçersin.',
  },
];

const PREVIEW_PRIZES = ['%10 İndirim', 'Ücretsiz Fön', 'Bakım Hediyesi'];

const ForSalons = () => {
  return (
    <section
      id="kuafor"
      className="bg-ck-night text-white scroll-mt-16 overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-6 py-[110px]">
        <div className="flex flex-wrap items-center gap-16">
          {/* sol: vaat + çağrı (parça parça, sırayla belirir) */}
          <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-6">
            <Reveal>
              <span className="text-[13px] font-bold tracking-[.08em] uppercase text-ck-coral">
                Kuaförler ve güzellik merkezleri için
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[clamp(36px,4.6vw,60px)] leading-[1] tracking-[-.03em]">
                Instagram takipçini{' '}
                <span className="text-ck-coral">randevuya çevir.</span>
              </h2>
            </Reveal>

            <Reveal delay={180}>
              <p className="m-0 text-lg leading-[1.6] text-[#EBCFD3] max-w-[520px]">
                Kadın kuaförü, erkek kuaförü ya da güzellik merkezi, salonuna
                özel sayfan ve çarkın hazır. Linki bio&apos;na koy; müşterin
                çevirir, kazanır, randevusunu oluşturur.
              </p>
            </Reveal>

            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {CHECKS.map((item, i) => (
                <li key={item}>
                  <Reveal
                    direction="left"
                    delay={280 + i * 110}
                    className="flex items-center gap-3 text-base"
                  >
                    <span className="w-6 h-6 rounded-full bg-ck-coral text-white flex items-center justify-center shrink-0">
                      <LuCheck size={14} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal
              delay={640}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href={SALON_APPLY_HREF}
                className="bg-white text-ck-night no-underline font-bold text-[17px] px-8 rounded-full min-h-[52px] inline-flex items-center ck-btn hover:shadow-[0_10px_24px_rgba(0,0,0,.3)] hover:bg-ck-cream"
              >
                Salonunu ekle
              </Link>
              <div className="bg-white/10 border border-white/20 rounded-full px-5 min-h-[52px] inline-flex items-center font-mono text-[15px] text-white">
                cevirkazan360.com/
                <span className="font-bold text-ck-coral underline underline-offset-4">
                  salon-adin
                </span>
              </div>
            </Reveal>
          </div>

          {/* sağ: salon sayfası önizlemesi (sağdan kayarak gelir, arkasında parıltı) */}
          <div className="flex-[1_1_380px] min-w-0 flex justify-center py-6">
            <Reveal
              direction="right"
              delay={150}
              className="relative w-full max-w-[400px]"
            >
              <span
                aria-hidden="true"
                className="ck-glow pointer-events-none absolute -inset-10 rounded-full bg-ck-coral/25 blur-3xl"
              />

              <div className="relative z-10 rounded-[28px] bg-white text-ck-ink overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,.45)]">
                <div className="flex items-center gap-3 px-4 py-3 bg-ck-surface border-b border-ck-line">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-ck-input" />
                    <span className="w-2.5 h-2.5 rounded-full bg-ck-input" />
                    <span className="w-2.5 h-2.5 rounded-full bg-ck-input" />
                  </span>
                  <span className="flex-1 truncate rounded-full bg-white px-3 py-1 text-xs text-ck-muted">
                    cevirkazan360.com/salon-adin
                  </span>
                </div>

                <div className="px-7 pt-8 pb-7 flex flex-col items-center text-center gap-4">
                  <span className="w-16 h-16 rounded-full bg-ck-night text-white flex items-center justify-center">
                    <LuCircleDot size={30} aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-2xl tracking-[-.02em]">
                      Salon adın
                    </h3>
                    <p className="m-0 text-sm text-ck-muted">
                      Çarkı çevir, hediyeni kazan, randevunu al.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {PREVIEW_PRIZES.map((prize) => (
                      <span
                        key={prize}
                        className="rounded-full bg-ck-surface border border-ck-line px-3 py-1 text-[13px] font-medium"
                      >
                        {prize}
                      </span>
                    ))}
                  </div>
                  <span className="w-full rounded-full bg-ck-brand text-white font-bold text-base py-3.5">
                    Çarkı Çevir
                  </span>
                </div>
              </div>

              {/* bildirim kartları: kart geldikten sonra zıplayarak belirir, sonra süzülür */}
              <Reveal
                direction="scale"
                delay={800}
                className="absolute z-20 -bottom-6 -left-4 sm:-left-8"
              >
                <div className="ck-float2 bg-white text-ck-ink rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.4)] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-ck-brand text-white flex items-center justify-center">
                    <LuCalendarCheck size={20} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[11px] text-ck-muted">Yeni randevu</span>
                    <span className="font-bold text-sm">Cumartesi 14:00</span>
                  </span>
                </div>
              </Reveal>

              <Reveal
                direction="scale"
                delay={1050}
                className="absolute z-20 -top-4 -right-2 sm:-right-6"
              >
                <div className="ck-float bg-white text-ck-ink rounded-2xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,.4)] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-ck-night text-white flex items-center justify-center">
                    <LuUserPlus size={20} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[11px] text-ck-muted">Yeni müşteri</span>
                    <span className="font-bold text-sm">Listene eklendi</span>
                  </span>
                </div>
              </Reveal>
            </Reveal>
          </div>
        </div>

        {/* faydalar: kutusuz, sade liste; sırayla belirir, üzerine gelince ikon kalkar */}
        <div className="mt-24 pt-14 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 130}
              className="group flex items-start gap-4"
            >
              <span className="w-12 h-12 rounded-full bg-white/10 border border-white/25 text-white/90 backdrop-blur-sm flex items-center justify-center shrink-0 transition duration-300 group-hover:-translate-y-1 group-hover:bg-white/20 group-hover:border-white/50">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-[family-name:var(--font-bricolage)] font-bold text-xl">
                  {title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-white">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForSalons;
