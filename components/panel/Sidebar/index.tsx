'use client';
import classNames from 'classnames';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PiGear, PiSpinnerBallLight } from 'react-icons/pi';
import { useState } from 'react';
import { IoMenuSharp } from 'react-icons/io5';
import { useAuthStore } from '@/stores/authStore';
import { MdOutlineDesignServices } from 'react-icons/md';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const [show, setShow] = useState(false);

  const getShortName = () => {
    if (!user?.name) return '';
    const fullName = `${user.name} ${user.surname}`.trim();
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  const links = [
    { to: '/panel', label: 'Anasayfa', icon: <IoMdHome size={24} /> },
    {
      to: '/panel/hizmetler',
      label: 'Hizmetler',
      icon: <MdOutlineDesignServices size={24} />,
    },
    {
      to: '/panel/hediye-carki',
      label: 'Hediye Çarkı',
      icon: <PiSpinnerBallLight size={24} />,
    },
    {
      to: '/panel/firma-ayarlari',
      label: 'Firma Ayarları',
      icon: <PiGear size={24} />,
    },
  ];

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="w-[50px] h-[50px] fixed top-4 right-4 z-30 cursor-pointer"
      >
        <IoMenuSharp size={28} />
      </button>

      <div
        className={classNames(
          'w-[300px] min-w-[300px] max-w-[300px] h-full',
          'flex flex-col gap-8 border-l border-slate-200 bg-white box-border',
          'fixed top-0 z-50',
          ' transition-all duration-300',
          'shadow',
          {
            'right-0': show,
            '-right-[300px]': !show,
          }
        )}
      >
        {/* logo */}
        <Link
          href="/panel"
          className="w-full h-[70px] flex flex-col items-center justify-center px-4 box-border border-b border-slate-200 relative font-bold text-3xl"
          onClick={() => setShow(false)}
        >
          {user?.company.title || 'Panel'}
        </Link>

        {/* links */}
        <nav className="flex flex-col gap-2 px-3">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setShow(false)}
              className={classNames(
                'w-full h-[45px]',
                'py-2',
                'block rounded-md',
                'flex items-center',
                'text-sm',
                {
                  'hover:bg-primary/10 hover:text-primary':
                    pathname !== link.to,
                  'bg-primary !text-white': pathname === link.to,
                }
              )}
            >
              <div className="w-[40px] h-[40px] flex items-center justify-center">
                {link.icon}
              </div>

              {link.label}
            </Link>
          ))}
        </nav>

        <div className="bg-slate-100 mt-auto p-3 box-border border-t border-slate-200 flex items-center gap-4">
          <div className="text-xs bg-primary text-white w-[40px] h-[40px] flex items-center justify-center rounded-full">
            {getShortName()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {user?.name} {user?.surname}
            </span>
            <span className="text-xs">{user?.company.title}</span>
          </div>

          <IoMdLogOut
            size={24}
            className="text-slate-600 ml-auto cursor-pointer"
            onClick={logout}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
