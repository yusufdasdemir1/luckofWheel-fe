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
  // çarkın ekranda kaç kat büyütüldüğü (net çizim için canvas çözünürlüğü buna göre artar)
  quality?: number;
}

// çarkın mantıksal boyutu (CSS px)
const LOGICAL_SIZE = 300;

const Wheel2 = ({
  data,
  winnerTitle = null,
  autoSpin = true,
  idle = false,
  muted = false,
  spinKey = 0,
  onFinish,
  className = 'mt-8',
  quality = 1,
}: Wheel2Props) => {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const [angle, setAngle] = useState(0);

  // canvas çözünürlüğü: ekran yoğunluğu x büyütme oranı (hydration için önce 1)
  const [ratio, setRatio] = useState(1);
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    setRatio(Math.min(4, Math.max(1, quality * dpr)));
  }, [quality]);

  // İbre: çentikler (mıhlar) ibreye çarpar, ibre itilir ve yaylanarak geri döner
  const pointerRef = useRef(null);
  const pointerState = useRef({ def: 0, vel: 0, lastAngle: 0, lastTime: 0 });

  const updatePointer = (currentAngle) => {
    const el = pointerRef.current;
    if (!el) return;

    const st = pointerState.current;
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0.001, (now - (st.lastTime || now - 16)) / 1000));
    const speed = Math.abs(currentAngle - st.lastAngle) / dt; // rad/sn
    st.lastAngle = currentAngle;
    st.lastTime = now;

    const full = Math.PI * 2;
    const contact = 0.1; // mıhın ibreyi itmeye başladığı açı (rad)
    let engaged = 0;
    let acc = 0;
    for (const item of data) {
      // bölmenin başındaki çentiğin ekrandaki açısı (ibre 0 rad = sağ)
      let d = (((acc + currentAngle) % full) + full) % full;
      if (d > Math.PI) d -= full;
      if (d <= 0 && d >= -contact) engaged = Math.max(engaged, 1 + d / contact);
      acc += (item.chance / 100) * full;
    }

    // çok hızlıyken ibre sadece titrer, yavaşlayınca her çentik ayrı tıklar
    const maxDeflection = 26;
    const minDeflection = 6;
    const fast = Math.min(1, Math.max(0, (speed - 8) / 12));
    const amplitude = maxDeflection - (maxDeflection - minDeflection) * fast;
    const target = engaged * amplitude;

    if (target > st.def) {
      st.def = target; // çentik ibreyi iter
      st.vel = 0;
    } else {
      // çentik geçti: ibre yay gibi geri sıçrar
      st.vel += (-420 * st.def - 18 * st.vel) * dt;
      st.def += st.vel * dt;
    }
    el.style.transform = `rotate(${-st.def}deg)`;
  };

  const updateAngle = (value) => {
    angleRef.current = value;
    setAngle(value);
    updatePointer(value);
  };

  // Çarkı çiz
  const drawWheel = (ctx, angleOffset) => {
    const size = LOGICAL_SIZE;
    const radius = size / 2;
    let startAngle = 0;

    // canvas yüksek çözünürlükte olsa da çizim aynı koordinatlarla yapılır
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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
      ctx.font = '600 11px sans-serif';
      ctx.fillText(item.title, radius - 20, 5);
      ctx.restore();

      startAngle += sliceAngle;
    });

    // Bölme çizgileri ve çentikler (mıhlar)
    let boundary = 0;
    data.forEach((item) => {
      ctx.save();
      ctx.rotate(boundary);

      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(radius - 10, 0);
      ctx.strokeStyle = '#1F1315';
      ctx.lineWidth = 3;
      ctx.stroke();

      const pegX = radius - 16;
      const peg = ctx.createRadialGradient(pegX - 1, -1.5, 0.5, pegX, 0, 5);
      peg.addColorStop(0, '#6b5a5c');
      peg.addColorStop(0.55, '#2a1a1c');
      peg.addColorStop(1, '#120a0b');
      ctx.beginPath();
      ctx.arc(pegX, 0, 4.6, 0, Math.PI * 2);
      ctx.fillStyle = peg;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#E9D8A6';
      ctx.stroke();

      ctx.restore();
      boundary += (item.chance / 100) * 2 * Math.PI;
    });

    // İç halka (çerçeve)
    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1F1315';
    ctx.stroke();

    // Göbek
    const hub = ctx.createRadialGradient(-3, -4, 1, 0, 0, 17);
    hub.addColorStop(0, '#fff6c7');
    hub.addColorStop(0.55, '#d9a63a');
    hub.addColorStop(1, '#8a6214');
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = hub;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1F1315';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#5a3a10';
    ctx.fill();

    ctx.restore();
  };

  // Canvas her frame'de yeniden çizilsin
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawWheel(ctx, angle);
  }, [angle, data, ratio]);

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
      // tarayıcıyı kilitleyen alert yerine sessizce vazgeç
      console.warn('Wheel2: winner not found in data', winnerTitle);
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
          width={Math.round(LOGICAL_SIZE * ratio)}
          height={Math.round(LOGICAL_SIZE * ratio)}
          style={{
            width: LOGICAL_SIZE,
            height: LOGICAL_SIZE,
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        />
        {/* Sabit ok işareti */}
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-50">
          <div ref={pointerRef} style={{ transformOrigin: '75% 50%' }}>
            <Pointer />
          </div>
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
