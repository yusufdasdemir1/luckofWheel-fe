// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';

const Wheel2 = ({ data, winnerTitle }) => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

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
      ctx.stroke();

      // Yazı
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

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  // Canvas her frame'de yeniden çizilsin
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, angle);
  }, [angle, data]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const audio = new Audio('/audio.wav');
    audio.play();
    audio.volume = 1;

    setTimeout(() => {
      audio.pause();
    }, 3400);

    const winnerIndex = data.findIndex((d) => d.title === winnerTitle);
    if (winnerIndex === -1) {
      alert('Winner not found!');
      setIsSpinning(false);
      return;
    }

    // Kazananın ortalama açısı
    const winnerStart = data
      .slice(0, winnerIndex)
      .reduce((sum, item) => sum + item.chance, 0);
    const winnerMid = winnerStart + data[winnerIndex].chance / 2;
    const winnerAngle = (winnerMid / 100) * 2 * Math.PI;

    const totalRotation = 10 * 2 * Math.PI + (2 * Math.PI - winnerAngle);

    let start = null;
    const duration = 3500;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = totalRotation * easeOut;
      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    spinWheel();
  }, []);

  return (
    <div
      className="mt-8"
      style={{ textAlign: 'center', position: 'relative', width: 420 }}
    >
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
