'use client';
import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import { BsCheckLg } from 'react-icons/bs';

const cn = classNames.bind({
  small: 'min-w-4 w-4 h-4',
  medium: 'min-w-6 w-6 h-6',
  large: 'min-w-8 w-8 h-8',
});

interface Props {
  title?: ReactNode;
  className?: string;
  value: boolean;
  onChange: (val: boolean) => void;
  size?: 'small' | 'medium' | 'large';
}

const Checkbox = ({
  className,
  value,
  onChange,
  size = 'medium',
  title,
}: Props) => {
  return (
    <div
      className="group flex items-center gap-2 cursor-pointer w-fit"
      onClick={() => onChange(!value)}
    >
      <div
        className={cn(
          'flex items-center justify-center',
          'border border-slate-300 bg-white rounded-md transition-colors',
          'aspect-square',
          { '!border-primary !bg-primary/10': value },
          className,
          size
        )}
      >
        <BsCheckLg
          size={14}
          className={cn('text-primary hidden group-hover:block', {
            '!block': value,
          })}
        />
      </div>

      {title && (
        <span className="text-ck-ink text-sm font-medium">{title}</span>
      )}
    </div>
  );
};

export default Checkbox;
