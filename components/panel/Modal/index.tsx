'use client';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

// açık modallar; Esc sadece en üsttekini kapatır
const openModals: symbol[] = [];

const SIZES = {
  xSmall: 'sm:max-w-[440px]',
  small: 'sm:max-w-[540px]',
  medium: 'sm:max-w-[680px]',
  large: 'sm:max-w-[900px]',
};

interface IModal {
  show?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  size?: keyof typeof SIZES;
}

const Modal = ({
  show,
  onClose,
  children,
  title,
  description,
  size = 'medium',
}: IModal) => {
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'unset';
    if (!show) return;

    const id = Symbol('modal');
    openModals.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openModals[openModals.length - 1] === id) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      openModals.splice(openModals.indexOf(id), 1);
      // üstte başka modal açıksa kaydırma kilidi kalsın
      document.body.style.overflow = openModals.length ? 'hidden' : 'unset';
    };
  }, [show, onClose]);

  const element = (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames(
          'relative w-full max-h-[92vh] overflow-y-auto box-border',
          'bg-white border border-ck-line shadow-2xl',
          'rounded-t-3xl sm:rounded-2xl',
          'flex flex-col gap-5 p-5 pt-6 sm:p-6 sm:pt-7',
          SIZES[size],
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-primary"
        />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="m-0 text-xl font-semibold text-ck-ink">{title}</h3>
            )}
            {description && (
              <p className="m-0 mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="shrink-0 -mr-1.5 -mt-1.5 w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-ck-ink bg-transparent border-0 cursor-pointer transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );

  return show && createPortal(element, document.body);
};

// Form gövdesi: alanlar arası tutarlı boşluk
export const ModalForm = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full flex flex-col gap-4">{children}</div>
);

// Alt aksiyonlar: vazgeç + ana işlem
export const ModalActions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 mt-1 border-t border-slate-100 [&>button]:w-full sm:[&>button]:w-auto sm:[&>button]:min-w-[120px]">
    {children}
  </div>
);

export default Modal;
