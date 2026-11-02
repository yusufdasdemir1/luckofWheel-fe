'use client';
import type { TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  error?: string | boolean;
}

const Textarea = ({ className, label, error, placeholder, ...args }: Props) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-ck-ink">{label}</span>
      )}
      <textarea
        placeholder={placeholder || label}
        className={classNames(
          'w-full min-h-[110px] px-3 py-2.5 resize-y bg-white text-base md:text-sm',
          'rounded-xl box-border border border-slate-300',
          'outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'read-only:opacity-50 read-only:cursor-not-allowed',
          { '!border-red-400': error },
          className
        )}
        spellCheck="false"
        {...args}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Textarea;
