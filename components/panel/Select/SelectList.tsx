'use client';
import { type ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import { SelectContext } from './selectContext';

interface Props {
  children?: ReactNode;
  className?: string;
}

const SelectList = ({ children, className }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { show, loading, currentValue, options } = useContext(SelectContext);
  const currentValueIndex = useMemo(() => {
    return (options || []).findIndex((option) => option.value === currentValue);
  }, [currentValue, options]);

  useEffect(() => {
    if (!show || !listRef.current || currentValueIndex === -1) return;

    const optionElement = listRef.current.children[currentValueIndex];

    if (optionElement) {
      optionElement.scrollIntoView({
        block: 'center',
      });
    }
  }, [show, currentValue, options, currentValueIndex]);

  if (!show || loading) return null;

  return (
    <div
      ref={listRef}
      className={cn(
        'absolute top-full left-0 z-20 mt-1',
        'w-full max-h-[250px] overflow-y-auto',
        'bg-white',
        'rounded-md box-border border border-[#AEAEAE]',
        'flex flex-col gap-0.5',
        className
      )}
    >
      {children}
    </div>
  );
};

export default SelectList;
