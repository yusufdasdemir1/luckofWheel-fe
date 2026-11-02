'use client';
import type { ReactNode } from 'react';
import RadioItem from './RadioItem';
import cn from 'classnames';

interface RadioGroupProps {
  title?: string;
  value?: string;
  items: { value: string; title: ReactNode }[];
  onChange: (value: string) => void;
  vertical?: boolean;
}

const RadioGroup = ({
  title,
  value,
  items = [],
  onChange,
  vertical = false,
}: RadioGroupProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && (
        <span className="text-sm font-semibold text-ck-ink">{title}</span>
      )}

      <div
        className={cn('flex flex-wrap', {
          'flex-col gap-3': vertical,
          'flex-row gap-6': !vertical,
        })}
      >
        {items.map((item, index) => (
          <RadioItem
            key={index}
            title={item.title}
            checked={item.value === value}
            onClick={() => onChange(item.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
