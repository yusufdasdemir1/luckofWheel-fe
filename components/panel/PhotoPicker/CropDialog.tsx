'use client';
import Button from '@/components/panel/Button';
import Modal, { ModalActions } from '@/components/panel/Modal';
import React, { useEffect, useRef, useState } from 'react';

const VIEW = 280; // kırpma alanı (px)
const OUTPUT = 512; // çıkan fotoğraf (px, kare)
const MAX_ZOOM = 3;

interface CropDialogProps {
  file: File;
  onCancel: () => void;
  onDone: (cropped: File) => void;
  onError?: (message: string) => void;
}

// Yuvarlak alana göre fotoğrafı sürükleyerek / yakınlaştırarak kırpar.
const CropDialog = ({ file, onCancel, onDone, onError }: CropDialogProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // fotoğraf alanı en az dolduracak şekilde başlar (cover)
  const base = size ? Math.max(VIEW / size.w, VIEW / size.h) : 1;
  const scale = base * zoom;

  // fotoğraf kırpma alanının dışına taşıp boşluk bırakmasın
  const clamp = (x: number, y: number, s = scale) => {
    if (!size) return { x: 0, y: 0 };
    const maxX = Math.max(0, (size.w * s - VIEW) / 2);
    const maxY = Math.max(0, (size.h * s - VIEW) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const changeZoom = (next: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(1, next));
    setZoom(z);
    setOffset((o) => clamp(o.x, o.y, base * z));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset(
      clamp(
        drag.current.ox + e.clientX - drag.current.x,
        drag.current.oy + e.clientY - drag.current.y,
      ),
    );
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 12;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setOffset((o) => clamp(o.x + move[0], o.y + move[1]));
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img || !size) return;

    setBusy(true);
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setBusy(false);
      return onError?.('Fotoğraf kırpılamadı, lütfen tekrar dene.');
    }

    // kırpma alanının fotoğraftaki karşılığı
    const side = VIEW / scale;
    const sx = size.w / 2 - (VIEW / 2 + offset.x) / scale;
    const sy = size.h / 2 - (VIEW / 2 + offset.y) / scale;
    ctx.drawImage(img, sx, sy, side, side, 0, 0, OUTPUT, OUTPUT);

    canvas.toBlob(
      (blob) => {
        setBusy(false);
        if (!blob) {
          return onError?.('Fotoğraf kırpılamadı, lütfen tekrar dene.');
        }
        onDone(new File([blob], 'calisan.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.92,
    );
  };

  return (
    <Modal
      show
      size="xSmall"
      title="Fotoğrafı ayarla"
      description="Fotoğrafı sağa sola sürükleyerek yuvarlak alana sığdır."
      onClose={onCancel}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          role="application"
          aria-label="Fotoğraf kırpma alanı, ok tuşlarıyla kaydırabilirsin"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={(e) => changeZoom(zoom - e.deltaY / 500)}
          className="relative overflow-hidden bg-slate-900 rounded-2xl touch-none select-none cursor-grab active:cursor-grabbing outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          style={{ width: VIEW, height: VIEW, maxWidth: '100%' }}
        >
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={url}
              alt=""
              draggable={false}
              onLoad={(e) =>
                setSize({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              className="absolute max-w-none pointer-events-none"
              style={
                size
                  ? {
                      width: size.w * scale,
                      height: size.h * scale,
                      left: VIEW / 2 - (size.w * scale) / 2 + offset.x,
                      top: VIEW / 2 - (size.h * scale) / 2 + offset.y,
                    }
                  : { opacity: 0 }
              }
            />
          )}

          {/* yuvarlak alan: dışı karartılır */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none border-2 border-white/90"
            style={{ boxShadow: '0 0 0 999px rgba(42, 26, 28, 0.6)' }}
          />
        </div>

        <label className="w-full flex items-center gap-3 text-xs font-semibold text-slate-500">
          Yakınlaştır
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="flex-1 accent-primary cursor-pointer"
          />
        </label>
      </div>

      <ModalActions>
        <Button color="primaryOutline" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button
          color="primary"
          loading={busy}
          disabled={!size}
          onClick={handleCrop}
        >
          Kullan
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default CropDialog;
