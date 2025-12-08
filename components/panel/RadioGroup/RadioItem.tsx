'use client';
import type { ReactNode } from 'react';
import cn from 'classnames';

interface RadioItemProps {
  title: ReactNode;
  checked: boolean;
  onClick: () => void;
}

const RadioItem = ({ title, checked, onClick }: RadioItemProps) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center cursor-pointer"
    >
      <div className="w-[18px] h-[18px] rounded-full border border-primary relative">
        <div
          className={cn(
            'w-[10px] h-[10px] bg-primary rounded-full transition-all duration-300',
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            {
              'scale-0': !checked,
              'scale-100': checked,
            }
          )}
        ></div>
      </div>

      <span className="text-purple font-medium">{title}</span>
    </button>
  );
};

export default RadioItem;
