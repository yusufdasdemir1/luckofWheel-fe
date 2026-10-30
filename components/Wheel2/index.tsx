// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import CarkBorder from '../../assets/cark';
import Pointer from '../../assets/pointer';

function getContrastTextColor(bgColor) {
  let r, g, b;

  // HEX desteği
  if (bgColor.startsWith('#')) {
    const hex = bgColor.replace('#', '');
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex,
      16
    );

    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  }
  // RGB desteği
  else if (bgColor.startsWith('rgb')) {
    [r, g, b] = bgColor.match(/\d+/g).map(Number);
  }

  // WCAG luminance hesaplama
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

interface Wheel2Props {
  data: any[];
  winnerTitle?: string | null;
  autoSpin?: boolean;
  idle?: boolean;
  muted?: boolean;
  spinKey?: number;
  onFinish?: (title: string) => void;
  className?: string;
}

const Wheel2 = ({
  data,
  winnerTitle = null,
  autoSpin = true,
  idle = false,
  muted = false,
  spinKey = 0,
  onFinish,
  className = 'mt-8',
}: Wheel2Props) => {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const [angle, setAngle] = useState(0);

  const updateAngle = (value) => {
    angleRef.current = value;
    setAngle(value);
  };

  // Çarkı çiz
  const drawWheel = (ctx, angleOffset) => {
    const size = ctx.canvas.width;
    const radius = size / 2;
    let startAngle = 0;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angleOffset);

    data.forEach((item) => {
      const sliceAngle = (item.chance / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 10, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = item.gift_color;
      ctx.fill();

      // Yazı
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = getContrastTextColor(item.gift_color);
      ctx.font = 'semibold 10px sans-serif';
      ctx.fillText(item.title, radius - 20, 5);
      ctx.restore();

      startAngle += sliceAngle;
    });

    ctx.restore();
  };

  // Canvas her frame'de yeniden çizilsin
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, angle);
  }, [angle, data]);

  const spinWheel = () => {
    if (spinningRef.current) return;
    spinningRef.current = true;

    if (!muted) {
      const audio = new Audio('/audio.wav');
      audio.play();
      audio.volume = 1;

      setTimeout(() => {
        audio.pause();
      }, 3400);
    }

    const winnerIndex = data.findIndex((d) => d.title === winnerTitle);
    if (winnerIndex === -1) {
      alert('Winner not found!');
      spinningRef.current = false;
      return;
    }

    // Kazananın ortalama açısı
    const winnerStart = data
      .slice(0, winnerIndex)
      .reduce((sum, item) => sum + item.chance, 0);
    const winnerMid = winnerStart + data[winnerIndex].chance / 2;
    const winnerAngle = (winnerMid / 100) * 2 * Math.PI;

    // Çark kaldığı yerden devam eder (tekrar çevirmede başa sıçramaz)
    const from = angleRef.current;
    const fullTurn = 2 * Math.PI;
    const target =
      from - (from % fullTurn) + 10 * fullTurn + (fullTurn - winnerAngle);

    let start = null;
    const duration = 3500;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      updateAngle(from + (target - from) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinningRef.current = false;
        if (onFinish) onFinish(winnerTitle);
      }
    };

    requestAnimationFrame(animate);
  };

  // Yavaş, kendi kendine dönen görünüm (tıklanamaz vitrin çarkı)
  useEffect(() => {
    if (!idle) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame;
    let last = null;
    const tick = (timestamp) => {
      if (last !== null && !spinningRef.current) {
        updateAngle(angleRef.current + (timestamp - last) * 0.00015);
      }
      last = timestamp;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [idle]);

  useEffect(() => {
    if (autoSpin) spinWheel();
  }, []);

  useEffect(() => {
    if (spinKey > 0) spinWheel();
  }, [spinKey]);

  return (
    <div
      className={`${className} z-10`}
      style={{ textAlign: 'center', position: 'relative', width: 300 }}
    >
      <CarkBorder />

      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        />
        {/* Sabit ok işareti */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-50">
          <Pointer />
        </div>
      </div>

      {/* <div>
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          {isSpinning ? 'Dönüyor...' : 'Start'}
        </button>
      </div> */}
    </div>
  );
};

export default Wheel2;
