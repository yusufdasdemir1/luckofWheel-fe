'use client';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

const Reveal = ({ children, className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pre' | 'in'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ekranın altında kalan bölümler gizlenip scroll'da gösterilir
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

  return (
    <div
      ref={ref}
      className={classNames(className, {
        'ck-reveal-pre': state === 'pre',
        'ck-reveal-in': state === 'in',
      })}
    >
      {children}
    </div>
  );
};

export default Reveal;
