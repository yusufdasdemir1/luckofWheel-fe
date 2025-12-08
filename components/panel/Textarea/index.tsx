'use client';
import type { InputHTMLAttributes } from 'react';
import classnames from 'classnames/bind';

const cn = classnames.bind({
  small: 'h-[35px] text-xs',
  medium: 'h-[45px] text-sm',
  large: 'h-[55px]',
});

interface Props extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  className?: string;
  label?: string;
  error?: string | boolean;
  size?: 'small' | 'medium' | 'large';
}

const Textarea = ({
  className,
  label,
  error,
  size = 'medium',
  placeholder,
  ...args
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <span className="text-sm text-black/90">{label}</span>}
      <textarea
        placeholder={placeholder || label}
        className={cn(
          'w-full min-h-[120px] p-3 resize-none bg-white',
          'rounded-md box-border border border-[#AEAEAE]',
          'outline-none focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'read-only:opacity-50 read-only:cursor-not-allowed',
          { '!border-red-400': error },
          className,
          size
        )}
        spellCheck="false"
        {...args}
      />
      {error && <span className="text-xs italic text-red-400">{error}</span>}
    </div>
  );
};

export default Textarea;
