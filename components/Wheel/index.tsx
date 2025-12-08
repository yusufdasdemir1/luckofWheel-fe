// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';

const Wheel = ({ data, winnerTitle }) => {
  const canvasRef = useRef(null);

  const [angle, setAngle] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isSpinningFinal, setIsSpinningFinal] = useState(false);

  // ÇARKI ÇİZ
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
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'semibold 10px sans-serif';
      ctx.fillText(item.title, radius - 20, 5);
      ctx.restore();

      startAngle += sliceAngle;
    });

    ctx.restore();
  };

  // CANVAS ÇİZİMİ
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, angle);
  }, [angle, data]);

  // WINNER YOKKEN SÜREKLİ DÖNDÜR
  useEffect(() => {
    if (!isWaiting) return;
    if (isSpinningFinal) return;

    let frame;
    let last = performance.now();

    const rotate = (now) => {
      const delta = now - last;
      last = now;

      const speed = 0.06; // sabit hız → final spin’e daha yakın hissettirir
      setAngle((prev) => prev + delta * speed);

      frame = requestAnimationFrame(rotate);
    };

    rotate(performance.now());

    return () => cancelAnimationFrame(frame);
  }, [isWaiting, isSpinningFinal]);

  // WINNER GELİNCE OTOMATİK FİNAL SPİN
  useEffect(() => {
    if (!winnerTitle) return; // hâlâ bekliyoruz
    if (!isWaiting) return; // start'a basılmadıysa
    if (isSpinningFinal) return;

    startFinalSpin();
  }, [winnerTitle]);

  // FİNAL SPİN FONKSİYONU
  const startFinalSpin = () => {
    setIsWaiting(false);
    setIsSpinningFinal(true);

    const winnerIndex = data.findIndex((d) => d.title === winnerTitle);
    if (winnerIndex === -1) return;

    const winnerStart = data
      .slice(0, winnerIndex)
      .reduce((sum, item) => sum + item.chance, 0);

    const winnerMid = winnerStart + data[winnerIndex].chance / 2;
    const winnerAngle = (winnerMid / 100) * 2 * Math.PI;

    const totalRotation = 15 * 2 * Math.PI + (2 * Math.PI - winnerAngle);

    let start = null;
    const duration = 3000;

    const animate = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = totalRotation * easeOut;

      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinningFinal(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // START → SÜREKLİ DÖNMEMİZİ BAŞLAT
  const onStart = () => {
    if (isWaiting || isSpinningFinal) return;
    setIsWaiting(true);
  };

  return (
    <div
      className="mt-8"
      style={{ textAlign: 'center', position: 'relative', width: 420 }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        />

        <div
          className="absolute top-1/2 -right-4 -translate-y-1/2 rotate-[270deg]"
          style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '30px solid black',
          }}
        />
      </div>

      <div>
        <button
          onClick={onStart}
          disabled={isWaiting || isSpinningFinal}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
          }}
        >
          {isWaiting ? 'Kazanan Bekleniyor...' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default Wheel;
