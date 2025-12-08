'use client';
import { createPortal } from 'react-dom';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { CgClose } from 'react-icons/cg';

const cn = classNames.bind({
  xSmall: 'max-w-[90vw] md:max-w-[30vw]',
  small: 'max-w-[45vw]',
  medium: 'max-w-[60vw]',
  large: 'max-w-[75vw]',

  white: 'bg-[#FAFAFA]',
  lightPurple: 'bg-[#F7F6FD]',
});

interface IModal {
  show?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
  size?: 'xSmall' | 'small' | 'medium' | 'large';
  color?: 'white' | 'lightPurple';
}

const Modal = ({
  show,
  onClose,
  children,
  title,
  size = 'medium',
  color = 'white',
}: IModal) => {
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'unset';
  }, [show]);

  const element = (
    <>
      <div
        className="w-full h-full fixed top-0 left-0 bg-black/40 backdrop-blur-md bg-opacity-50 cursor-pointer"
        onClick={onClose}
      ></div>

      <div
        className={cn(
          'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-full max-h-[90vh]',
          'p-6 box-border rounded-2xl',
          'bg-[#F7F6FD]',
          'flex flex-col gap-4',
          size,
          color
        )}
      >
        <CgClose
          className="absolute top-4 right-4 text-black cursor-pointer"
          size={26}
          onClick={onClose}
        />

        <h3 className="text-black font-semibold text-2xl">{title}</h3>

        {children}
      </div>
    </>
  );

  return show && createPortal(element, document.body);
};

export default Modal;
