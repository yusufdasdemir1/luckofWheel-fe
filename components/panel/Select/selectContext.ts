import { createContext } from 'react';

export const SelectContext = createContext<{
  show: boolean;
  loading?: boolean;
  setShow: (show: boolean) => void;
  handleOnSelect: (value: any) => void;
  currentValue?: any;
  size?: 'small' | 'medium' | 'large';
  options?: any[];
}>({
  show: false,
  setShow: () => {},
  handleOnSelect: () => {},
  options: [],
});
