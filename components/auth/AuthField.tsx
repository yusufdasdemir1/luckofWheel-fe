'use client';
import classNames from 'classnames';
import React, { InputHTMLAttributes, TextareaHTMLAttributes, useId, useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export const authInputClass =
  'w-full px-4 box-border rounded-xl bg-white border border-ck-input text-ck-ink text-base outline-none transition-colors placeholder:text-ck-muted/60 focus:border-ck-brand focus:ring-4 focus:ring-ck-brand/10 disabled:opacity-60';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthField = ({ label, error, type = 'text', className, ...args }: AuthFieldProps) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-ck-ink">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          spellCheck={false}
          className={classNames(
            authInputClass,
            'h-12',
            { 'pr-12': isPassword, '!border-ck-error': error },
            className
          )}
          {...args}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-ck-muted hover:text-ck-brand cursor-pointer bg-transparent border-0"
          >
            {visible ? <LuEyeOff size={18} /> : <LuEye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="text-xs text-ck-error">{error}</span>}
    </div>
  );
};

interface AuthTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const AuthTextarea = ({ label, className, ...args }: AuthTextareaProps) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-ck-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className={classNames(authInputClass, 'py-3 resize-none', className)}
        {...args}
      />
    </div>
  );
};

export default AuthField;
