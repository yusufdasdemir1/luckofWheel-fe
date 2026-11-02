'use client';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import classnames from 'classnames/bind';
import { IoChevronDownOutline } from 'react-icons/io5';
import SelectList from './SelectList';
import SelectOption from './SelectOption';
import { SelectContext } from './selectContext';
import { TbLoader2 } from 'react-icons/tb';

const cn = classnames.bind({
  small: 'h-[32px] text-xs',
  medium: 'h-[40px] text-sm',
  large: 'h-[48px]',
});

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  className?: string;
  inputClassName?: string;
  label?: string;
  error?: string | boolean;
  size?: 'small' | 'medium' | 'large';
  children?: ReactNode;
  onSelect: (value: any) => void;
  options: any[];
  value?: any;
  loading?: boolean;
  placeholder?: string;
}

const Select = ({
  className,
  label,
  error,
  size = 'medium',
  children,
  onSelect,
  options = [],
  value,
  loading,
  inputClassName,
  placeholder = 'Select an option',
}: Props) => {
  const [show, setShow] = useState(false);
  const selectRef = useRef<any>(null);

  const selectedValue = options.find((option) => option.value === value);

  const handleOnSelect = (value: any) => {
    setShow(false);
    onSelect(value);
  };

  useEffect(() => {
    const clickEvent = (event: any) => {
      if (!selectRef?.current.contains(event.target)) {
        setShow(false);
      }
    };

    window.addEventListener('click', clickEvent);
    return () => {
      window.removeEventListener('click', clickEvent);
    };
  }, []);

  return (
    <SelectContext.Provider
      value={{
        show,
        setShow,
        handleOnSelect,
        currentValue: value,
        loading,
        size,
        options,
      }}
    >
      <div
        ref={selectRef}
        className={cn('w-full flex flex-col gap-1.5', className)}
      >
        {label && <span className="text-sm font-medium text-ck-ink">{label}</span>}

        <div className="w-full relative">
          <div
            className={cn(
              'cursor-pointer bg-white',
              'w-full px-3 resize-none',
              'rounded-xl box-border border border-slate-300',
              'flex items-center text-ck-ink transition-colors',
              show && 'border-primary ring-4 ring-primary/10',
              {
                '!border-red-400': error,
                'bg-slate-50': loading,
              },
              size,
              inputClassName
            )}
            onClick={() => !loading && setShow(!show)}
          >
            {selectedValue?.label || placeholder}
          </div>

          {!loading ? (
            <IoChevronDownOutline
              className={cn(
                'absolute right-2 top-3',
                'transition-all duration-200',
                'cursor-pointer',
                'text-slate-500',
                {
                  'rotate-180': show,
                  '!top-2': size === 'small',
                  '!top-4': size === 'large',
                }
              )}
              onClick={() => !loading && setShow(!show)}
            />
          ) : (
            <TbLoader2
              className={cn(
                'absolute right-2 top-3',
                'transition-all duration-200',
                'text-slate-500',
                'animate-spin'
              )}
            />
          )}

          <SelectList>
            {children
              ? children
              : options.map((option, index) => (
                  <SelectOption key={index} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
          </SelectList>
        </div>

        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </SelectContext.Provider>
  );
};

Select.SelectList = SelectList;
Select.Option = SelectOption;

export default Select;
