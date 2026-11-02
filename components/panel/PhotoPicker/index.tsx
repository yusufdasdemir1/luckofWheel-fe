'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoCameraOutline } from 'react-icons/io5';
import CropDialog from './CropDialog';

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_ACCEPT = 'image/png,image/jpeg,image/webp';

interface PhotoPickerProps {
  /** kayıtlı fotoğrafın tam adresi */
  src?: string | null;
  /** fotoğraf yokken gösterilen harfler */
  initials: string;
  /** henüz yüklenmemiş, seçilen dosya (önizleme için) */
  file?: File | null;
  loading?: boolean;
  onPick: (file: File) => void;
  /** kayıtlı ya da seçilmiş fotoğrafı kaldırır */
  onRemove?: () => void;
  onError?: (message: string) => void;
}

const PhotoPicker = ({
  src,
  initials,
  file,
  loading = false,
  onPick,
  onRemove,
  onError,
}: PhotoPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // seçilen fotoğraf önce yuvarlak alana göre kırpılır
  const [cropping, setCropping] = useState<File | null>(null);

  // seçilen dosyanın yerel önizlemesi, kullanılmayınca serbest bırakılır
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview || src;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = ''; // aynı dosya tekrar seçilebilsin
    if (!picked) return;

    if (!PHOTO_ACCEPT.split(',').includes(picked.type)) {
      return onError?.('Sadece PNG, JPG veya WEBP yükleyebilirsin.');
    }
    if (picked.size > PHOTO_MAX_BYTES) {
      return onError?.('Fotoğraf en fazla 5 MB olabilir.');
    }
    setCropping(picked);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 min-w-20 rounded-full overflow-hidden bg-primary/10 text-primary text-xl font-bold flex items-center justify-center">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
        {loading && (
          <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-medium text-slate-600">
            Yükleniyor…
          </span>
        )}
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept={PHOTO_ACCEPT}
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-transparent border-0 p-0 cursor-pointer hover:underline disabled:opacity-60"
        >
          <IoCameraOutline size={18} />
          {shown ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}
        </button>
        {shown && onRemove && (
          <button
            type="button"
            disabled={loading}
            onClick={onRemove}
            className="text-sm text-red-500 bg-transparent border-0 p-0 cursor-pointer hover:underline disabled:opacity-60"
          >
            Kaldır
          </button>
        )}
        <span className="text-xs text-slate-500">
          PNG, JPG veya WEBP · en fazla 5 MB
        </span>
      </div>

      {cropping && (
        <CropDialog
          file={cropping}
          onCancel={() => setCropping(null)}
          onError={onError}
          onDone={(cropped) => {
            setCropping(null);
            onPick(cropped);
          }}
        />
      )}
    </div>
  );
};

export default PhotoPicker;
