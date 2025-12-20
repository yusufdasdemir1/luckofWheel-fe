import React from 'react';

const Pointer = () => {
  return (
    <>
      <svg
        width="42"
        height="42"
        viewBox="0 0 42 42"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff7d4" />
            <stop offset="20%" stopColor="#ffe08a" />
            <stop offset="40%" stopColor="#f6c342" />
            <stop offset="60%" stopColor="#d7a22a" />
            <stop offset="100%" stopColor="#8d6211" />
          </linearGradient>

          <filter
            id="goldGlow"
            x="-40"
            y="-40"
            width="120"
            height="120"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points="0,21 42,0 42,42"
          fill="url(#goldGradient)"
          filter="url(#goldGlow)"
        />

        <polygon points="2,21 40,4 40,38" fill="rgba(255,255,255,0.15)" />

        <rect
          x="-30"
          y="0"
          width="30"
          height="42"
          fill="url(#shineGradient)"
          transform="skewX(-20)"
        >
          <animate
            attributeName="x"
            from="-30"
            to="72"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </>
  );
};

export default Pointer;
