import React from 'react';

const CarkBorder = () => {
  return (
    <>
      <div
        className="
    w-[328px]
    h-[328px]
    rounded-full
    absolute
    top-[-14px]
    left-[-14px]
    z-50
    overflow-visible
    animate-gold-glow
  "
      />
      <svg
        width="328"
        height="328"
        viewBox="0 0 420 420"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[-14px] left-[-14px] z-20"
      >
        <defs>
          <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffefb0" />
            <stop offset="55%" stopColor="#d9a63a" />
            <stop offset="100%" stopColor="#b0740c" />
          </radialGradient>

          <radialGradient id="dotGold" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fff6c7" />
            <stop offset="45%" stopColor="#f7d463" />
            <stop offset="70%" stopColor="#d4a32c" />
            <stop offset="100%" stopColor="#8a6214" />
          </radialGradient>

          <filter
            id="glow"
            x="-80"
            y="-80"
            width="580"
            height="580"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <mask id="hole">
            <rect width="420" height="420" fill="white" />
            <circle cx="210" cy="210" r="180" fill="black" />
          </mask>
        </defs>

        {/* <circle
          cx="210"
          cy="210"
          r="210"
          fill="url(#goldGradient)"
          filter="url(#glow)"
          mask="url(#hole)"
        >
          <animate
            attributeName="opacity"
            values="0.75;1;0.75"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle> */}

        <circle
          cx="210"
          cy="210"
          r="210"
          fill="url(#goldGradient)"
          mask="url(#hole)"
        />

        <g filter="url(#glow)">
          <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />

          <g transform="rotate(15 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(30 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(45 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(60 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(75 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(90 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(105 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(120 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(135 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(150 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(165 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>

          <g transform="rotate(180 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(195 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(210 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(225 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(240 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(255 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(270 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(285 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(300 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(315 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(330 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
          <g transform="rotate(345 210 210)">
            <circle cx="210" cy="15" r="9" fill="url(#dotGold)" />
          </g>
        </g>
      </svg>
    </>
  );
};

export default CarkBorder;
