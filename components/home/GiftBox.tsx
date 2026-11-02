import React from 'react';

// Konfeti gibi saçılan parıltıların yönleri (derece) ve mesafesi
export const GIFT_BURST = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    deg,
    tx: Math.round(Math.cos(rad) * 38),
    ty: Math.round(Math.sin(rad) * 38),
  };
});

// Hediye kutusu: kapak ödül düşünce açılır
export const GiftBoxIcon = ({
  open,
  size = 30,
}: {
  open: boolean;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="overflow-visible"
  >
    <rect x="9" y="24" width="30" height="19" rx="2.5" />
    <path d="M24 24v19" />
    <g
      className={open ? 'ck-lid-open' : ''}
      style={{ transformOrigin: '9px 22px' }}
    >
      <rect x="6" y="15" width="36" height="9" rx="2.5" />
      <path d="M24 15v9" />
      <path d="M24 15c-1.5-6-9-8-10-3.5C13.5 14 20 15 24 15z" />
      <path d="M24 15c1.5-6 9-8 10-3.5C34.5 14 28 15 24 15z" />
    </g>
  </svg>
);
