'use client';
import classNames from 'classnames';
import { useContext, type ReactNode } from 'react';
import { SelectContext } from './selectContext';

interface Props {
  children?: ReactNode;
  className?: string;
  value?: string | number | boolean | null;
}

const SelectOption = ({ children, className, value }: Props) => {
  const { handleOnSelect, currentValue, size } = useContext(SelectContext);

  return (
    <div
      className={classNames(
        'w-full min-h-[30px]',
        'p-2 box-border',
        'flex items-center gap-2',
        'cursor-pointer',
        'text-sm',
        'hover:text-white hover:bg-black',
        {
          '!text-white !bg-black': value === currentValue,
          '!text-xs !px-2 !py-1 min-h-[25px]': size === 'small',
        },
        className
      )}
      onClick={() => handleOnSelect(value)}
    >
      {children}
    </div>
  );
};

export default SelectOption;
