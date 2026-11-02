'use client';
import classNames from 'classnames';
import { IoMdHome } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PiGear, PiSpinnerBallLight } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import {
  IoClose,
  IoGiftOutline,
  IoLogOutOutline,
  IoMenuSharp,
  IoOpenOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import { useAuthStore } from '@/stores/authStore';
import { MdOutlineDesignServices } from 'react-icons/md';
import { SITE_LOGO_DARK_RATIO, SITE_LOGO_DARK_URL } from '@/utils/siteLogo';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const [show, setShow] = useState(false);

  // mobilde menü açıkken sayfa kaymasın, Esc ile kapansın
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShow(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show]);

  const getShortName = () => {
    if (!user?.name) return '';
    const fullName = `${user.name} ${user.surname}`.trim();
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  // UI kontrolü — asıl yetki kontrolü backend'de yapılmalı
  const isStaff = user?.role === 'staff';

  // çalışan (kuaför) sadece kendi randevularını ve hediyelerini görür
  const links = isStaff
    ? [
        { to: '/panel', label: 'Randevularım', icon: <IoMdHome size={20} /> },
        {
          to: '/panel/kazanilan-hediyeler',
          label: 'Kazanılan Hediyeler',
          icon: <IoGiftOutline size={20} />,
        },
      ]
    : [
        { to: '/panel', label: 'Anasayfa', icon: <IoMdHome size={20} /> },
        {
          to: '/panel/calisanlar',
          label: 'Çalışanlar',
          icon: <IoPeopleOutline size={20} />,
        },
        {
          to: '/panel/hizmetler',
          label: 'Hizmetler',
          icon: <MdOutlineDesignServices size={20} />,
        },
        {
          to: '/panel/calisma-saatleri',
          label: 'Çalışma Saatleri',
          icon: <IoTimeOutline size={20} />,
        },
        {
          to: '/panel/hediye-carki',
          label: 'Hediye Çarkı',
          icon: <PiSpinnerBallLight size={20} />,
        },
        {
          to: '/panel/firma-ayarlari',
          label: 'Firma Ayarları',
          icon: <PiGear size={20} />,
        },
        {
          to: '/panel/kazanilan-hediyeler',
          label: 'Kazanılan Hediyeler',
          icon: <IoGiftOutline size={20} />,
        },
        {
          to: '/panel/yorumlar',
          label: 'Yorumlar',
          icon: <IoStarOutline size={20} />,
        },
      ];

  const logo = (
    <Image
      src={SITE_LOGO_DARK_URL}
      width={Math.round(36 * SITE_LOGO_DARK_RATIO)}
      height={36}
      alt="Çevir Kazan 360"
      unoptimized
      className="block h-8 w-auto"
    />
  );

  const companySlug = user?.company?.slug;

  return (
    <>
      {/* mobil üst çubuk */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-4 flex items-center justify-between bg-ck-night text-white shadow-md">
        <Link href="/panel" className="flex items-center no-underline">
          {logo}
        </Link>
        <button
          type="button"
          onClick={() => setShow(true)}
          aria-label="Menüyü aç"
          className="w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-white bg-transparent border-0 cursor-pointer hover:bg-white/10"
        >
          <IoMenuSharp size={26} />
        </button>
      </header>

      {/* mobil arka plan */}
      <div
        onClick={() => setShow(false)}
        aria-hidden="true"
        className={classNames(
          'lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      <aside
        className={classNames(
          'fixed top-0 left-0 z-50 h-full w-[270px] max-w-[85vw] box-border',
          'flex flex-col bg-ck-night text-white',
          'transition-transform duration-300 lg:translate-x-0',
          show ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* logo + salon */}
        <div className="px-5 pt-5 pb-4 flex flex-col gap-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link
              href="/panel"
              onClick={() => setShow(false)}
              className="flex items-center no-underline"
            >
              {logo}
            </Link>
            <button
              type="button"
              onClick={() => setShow(false)}
              aria-label="Menüyü kapat"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white bg-transparent border-0 cursor-pointer hover:bg-white/10"
            >
              <IoClose size={22} />
            </button>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <span className="block text-[11px] uppercase tracking-wider text-ck-muted-dark">
              {isStaff ? 'Çalıştığın salon' : 'Salonun'}
            </span>
            <strong className="block text-sm truncate">
              {user?.company?.title || 'Panel'}
            </strong>
          </div>
        </div>

        {/* linkler */}
        <nav className="flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setShow(false)}
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  'relative w-full h-11 px-3 rounded-xl no-underline',
                  'flex items-center gap-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/12 text-white'
                    : 'text-[#EADFDF] hover:bg-white/8 hover:text-white'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r bg-ck-accent" />
                )}
                <span className={active ? 'text-ck-accent' : 'text-ck-muted-dark'}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}

          {companySlug && !isStaff && (
            <Link
              href={`/${companySlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 h-11 px-3 rounded-xl no-underline flex items-center gap-3 text-sm font-medium text-ck-muted-dark border border-dashed border-white/20 hover:text-white hover:border-white/40"
            >
              <IoOpenOutline size={20} />
              Salon sayfamı gör
            </Link>
          )}
        </nav>

        {/* kullanıcı */}
        <div className="mt-auto p-3 border-t border-white/10 flex items-center gap-3">
          <div className="text-xs font-bold bg-ck-accent text-ck-ink w-10 h-10 min-w-10 flex items-center justify-center rounded-full">
            {getShortName()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">
              {user?.name} {user?.surname}
            </span>
            <span className="text-xs text-ck-muted-dark truncate">
              {isStaff ? 'Kuaför' : 'Salon sahibi'}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Çıkış yap"
            title="Çıkış yap"
            className="ml-auto w-10 h-10 min-w-10 flex items-center justify-center rounded-lg text-ck-muted-dark bg-transparent border-0 cursor-pointer hover:bg-white/10 hover:text-white"
          >
            <IoLogOutOutline size={22} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
