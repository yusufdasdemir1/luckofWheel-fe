import React, { useId } from 'react';

// Çark ibresi: sivri uçlu bıçak gövde ve arkasında altın çerçeveli mil başlığı.
// Uç sola bakar; mil (dönme noktası) x=36,y=18 (genişliğin %75'i, yüksekliğin %50'si).
const Pointer = () => {
  // aynı sayfada birden fazla çark olabilir: her ibrenin kendi gradient kimlikleri olsun
  const uid = useId().replace(/:/g, '');
  const body = `ptr-body-${uid}`;
  const rim = `ptr-rim-${uid}`;
  const cap = `ptr-cap-${uid}`;
  const gem = `ptr-gem-${uid}`;
  const shadow = `ptr-shadow-${uid}`;

  return (
    <svg
      width="48"
      height="36"
      viewBox="0 0 48 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0354F" />
          <stop offset="55%" stopColor="#B01D3A" />
          <stop offset="100%" stopColor="#6B0E24" />
        </linearGradient>

        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3E3B0" />
          <stop offset="50%" stopColor="#C9A35B" />
          <stop offset="100%" stopColor="#8A6214" />
        </linearGradient>

        <radialGradient id={cap} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF6C7" />
          <stop offset="55%" stopColor="#D9A63A" />
          <stop offset="100%" stopColor="#7A5410" />
        </radialGradient>

        <radialGradient id={gem} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FF6B80" />
          <stop offset="60%" stopColor="#B01D3A" />
          <stop offset="100%" stopColor="#5C0A1E" />
        </radialGradient>

        <filter id={shadow} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.6"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      <g filter={`url(#${shadow})`}>
        {/* bıçak: sivri uç solda, yuvarlatılmış kök sağda */}
        <path
          d="M1 18 L26 9.5 Q32.5 8 32.5 14 L32.5 22 Q32.5 28 26 26.5 Z"
          fill={`url(#${body})`}
          stroke={`url(#${rim})`}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* bıçağın üstündeki ince yansıma */}
        <path
          d="M6 17 L25 11.2"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* mil başlığı: altın halka + içinde kırmızı mücevher */}
        <circle
          cx="36"
          cy="18"
          r="8.5"
          fill={`url(#${cap})`}
          stroke="#5A3A10"
          strokeWidth="1"
        />
        <circle
          cx="36"
          cy="18"
          r="4.8"
          fill={`url(#${gem})`}
          stroke="#3A260A"
          strokeWidth="1"
        />
        <circle cx="34.4" cy="16.2" r="1.3" fill="rgba(255,255,255,0.75)" />
      </g>
    </svg>
  );
};

export default Pointer;
