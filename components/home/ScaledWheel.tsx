'use client';
import Wheel2 from '@/components/Wheel2';
import React, { useEffect, useRef, useState } from 'react';

// Wheel2 sabit 300px (+14px çerçeve payı) çizer; kapsayıcıya göre ölçeklenir
const BASE = 328;
const PAD = 14;

interface ScaledWheelProps {
  maxSize: number;
  data: any[];
  winnerTitle?: string | null;
  autoSpin?: boolean;
  idle?: boolean;
  muted?: boolean;
  spinKey?: number;
  onFinish?: (title: string) => void;
}

const ScaledWheel = ({ maxSize, ...wheelProps }: ScaledWheelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.min(maxSize, entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [maxSize]);

  const scale = size / BASE;

  return (
    <div ref={ref} className="w-full flex justify-center">
      <div style={{ width: size, height: size }}>
        <div
          style={{
            width: BASE,
            height: BASE,
            paddingLeft: PAD,
            paddingTop: PAD,
            boxSizing: 'border-box',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Wheel2 {...wheelProps} className="" quality={scale} />
        </div>
      </div>
    </div>
  );
};

export default ScaledWheel;
