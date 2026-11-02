'use client';
import classNames from 'classnames';
import React from 'react';
import { IoStar } from 'react-icons/io5';

const LABELS = ['Çok kötü', 'Kötü', 'Orta', 'İyi', 'Harika'];

// Sadece gösterim: 4.3 gibi değerleri yıldız doluluğuyla gösterir
export const Stars = ({
  value,
  size = 18,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) => (
  <span
    role="img"
    aria-label={`5 üzerinden ${value.toFixed(1).replace('.', ',')}`}
    className={classNames('inline-flex gap-0.5', className)}
  >
    {[1, 2, 3, 4, 5].map((star) => {
      const fill = Math.max(0, Math.min(1, value - (star - 1)));
      return (
        <span
          key={star}
          aria-hidden="true"
          className="relative inline-block"
          style={{ width: size, height: size }}
        >
          <IoStar size={size} className="absolute inset-0 text-slate-200" />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fill * 100}%` }}
          >
            <IoStar size={size} className="text-amber-400" />
          </span>
        </span>
      );
    })}
  </span>
);

// Puan seçici: 1-5 yıldız, klavye ve ekran okuyucu uyumlu (radio grubu)
export const StarInput = ({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) => {
  const [hover, setHover] = React.useState(0);
  const shown = hover || value;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="radiogroup"
        aria-label="Puan"
        className="flex gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} yıldız: ${LABELS[star - 1]}`}
            disabled={disabled}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
            className="p-1 bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed rounded-lg focus-visible:outline-2 focus-visible:outline-ck-brand"
          >
            <IoStar
              size={40}
              className={classNames(
                'transition-colors',
                star <= shown ? 'text-amber-400' : 'text-slate-200'
              )}
            />
          </button>
        ))}
      </div>
      <span className="h-5 text-sm font-bold text-ck-brand-dark">
        {shown ? LABELS[shown - 1] : ''}
      </span>
    </div>
  );
};
