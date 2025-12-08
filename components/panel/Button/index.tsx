'use client';
import classnames from 'classnames/bind';
import type { ButtonHTMLAttributes } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const cn = classnames.bind({
  xSmall: 'px-2 min-h-[32px] text-xs',
  small: 'px-4 min-h-[36px] text-sm',
  medium: 'px-4 min-h-[48px]',
  large: 'px-8 min-h-[60px] text-lg',

  primary: 'bg-primary border-primary hover:opacity-80 text-white',
  primaryOutline:
    ' bg-white border-primary hover:bg-primary hover:text-white text-primary',
  black: 'bg-black border-black hover:opacity-80 text-white',
  white: 'bg-white border-transparent hover:bg-slate-200 text-black',
  red: 'bg-red-400 border-red-400 hover:opacity-80 text-white',
  sky: 'bg-sky-400 border-sky-400 hover:opacity-80 text-white',
  orange: 'bg-orange-400 border-orange-400 hover:opacity-80 text-white',
  green: 'bg-green-400 border-green-400 hover:opacity-80 text-white',
  blue: 'bg-blue-400 border-blue-400 hover:opacity-80 text-white',
  yellow: 'bg-yellow-400 border-yellow-400 hover:opacity-80 text-white',
});

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: 'xSmall' | 'small' | 'medium' | 'large';
  color?:
    | 'primary'
    | 'primaryOutline'
    | 'black'
    | 'white'
    | 'red'
    | 'sky'
    | 'orange'
    | 'green'
    | 'blue'
    | 'yellow';
  loading?: boolean;
}

const Button = ({
  className,
  children,
  size = 'medium',
  color = 'primary',
  disabled = false,
  loading = false,
  ...args
}: Props) => {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'w-fit rounded-lg cursor-pointer',
        'flex items-center justify-center gap-2',
        'text-center',
        'transition-all duration-200',
        'disabled:!opacity-75 disabled:!cursor-not-allowed disabled:!bg-slate-200 disabled:!text-slate-800',
        'font-medium',
        'border-2 box-border',
        className,
        size,
        color
      )}
      {...args}
    >
      {loading && <BiLoaderAlt size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
