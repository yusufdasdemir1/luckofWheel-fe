'use client';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** animasyon başlamadan önce beklenecek süre (ms) */
  delay?: number;
  /** nereden gelerek belirsin */
  direction?: 'up' | 'left' | 'right' | 'scale';
}

const ENTER = {
  up: 'ck-enter-up',
  left: 'ck-enter-left',
  right: 'ck-enter-right',
  scale: 'ck-enter-scale',
} as const;

/**
 * Ekranda zaten görünen öğeler sayfa açılırken animasyonla girer (CSS, JS'i beklemez).
 * Ekranın altında kalanlar gizlenir ve kaydırıp görünür olunca animasyonla belirir.
 */
const Reveal = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'enter' | 'pre' | 'in'>('enter');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ekranda: giriş animasyonu zaten oynuyor
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState('pre');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = !delay
    ? undefined
    : state === 'enter'
    ? { animationDelay: `${delay}ms` }
    : state === 'in'
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      className={classNames(className, {
        [ENTER[direction]]: state === 'enter',
        'ck-reveal-pre': state === 'pre',
        'ck-reveal-in': state === 'in',
        'ck-reveal-left': state === 'pre' && direction === 'left',
        'ck-reveal-right': state === 'pre' && direction === 'right',
        'ck-reveal-scale': state === 'pre' && direction === 'scale',
      })}
      style={style}
    >
      {children}
    </div>
  );
};

export default Reveal;
