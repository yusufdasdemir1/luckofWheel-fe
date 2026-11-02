'use client';
import { useState, type InputHTMLAttributes } from 'react';
import Input from '../Input';
import cn from 'classnames';
import { LuEye, LuEyeOff } from 'react-icons/lu';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  label?: string;
  error?: string | boolean;
  size?: 'small' | 'medium' | 'large';
}

const PasswordInput = ({ label, error, placeholder, ...args }: Props) => {
  const [type, setType] = useState<'password' | 'text'>('password');

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ck-ink">{label}</span>}

      <div className="relative">
        <Input
          type={type}
          className={cn({
            '!text-2xl': type === 'password',
            'placeholder:!text-sm !pb-1.5': type === 'password',
          })}
          {...args}
          placeholder={placeholder || label}
        />

        <div className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer">
          {type === 'password' ? (
            <LuEye className="text-slate-500" onClick={() => setType('text')} />
          ) : (
            <LuEyeOff
              className="text-slate-500"
              onClick={() => setType('password')}
            />
          )}
        </div>
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default PasswordInput;
