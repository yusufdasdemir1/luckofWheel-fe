'use client';
import { createSalonApplication } from '@/services/publicService';
import React, { FormEvent, useState } from 'react';
import { LuCircleCheck, LuMessageCircle, LuSend } from 'react-icons/lu';

const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(
  /\D/g,
  ''
);

interface FormState {
  salon: string;
  owner: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  instagram: string;
  note: string;
  website: string; // bot tuzağı: gerçek kullanıcılar boş bırakır
}

const EMPTY: FormState = {
  salon: '',
  owner: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  instagram: '',
  note: '',
  website: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

const FIELD =
  'w-full font-[inherit] text-base px-4 rounded-2xl border-[1.5px] border-ck-input bg-white min-h-12 text-ck-ink box-border focus:outline-none focus:border-ck-ink';

// Backend alan adları -> form alanları
const API_FIELDS: Record<string, keyof FormState> = {
  salon_name: 'salon',
  owner_name: 'owner',
  phone: 'phone',
  email: 'email',
  city: 'city',
  district: 'district',
  instagram: 'instagram',
  note: 'note',
};

const SalonApplyForm = () => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!form.salon.trim()) next.salon = 'Salon adını yazın.';
    if (!form.owner.trim()) next.owner = 'Ad soyad yazın.';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 12)
      next.phone = 'Geçerli bir telefon numarası yazın.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = 'Geçerli bir e-posta adresi yazın.';
    if (!form.city.trim()) next.city = 'Şehir yazın.';
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const [err] = await createSalonApplication({
      salon_name: form.salon.trim(),
      owner_name: form.owner.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      instagram: form.instagram.trim(),
      note: form.note.trim(),
      website: form.website,
    });
    setLoading(false);

    if (!err) {
      setDone(true);
      return;
    }

    // alan bazlı hatalar ilgili alanın altında, diğerleri formun üstünde gösterilir
    const fieldErrors: Errors = {};
    let generic = '';
    if (typeof err === 'object' && err) {
      for (const [key, value] of Object.entries(err as Record<string, unknown>)) {
        const message = Array.isArray(value) ? String(value[0]) : String(value);
        const field = API_FIELDS[key];
        if (field) fieldErrors[field] = message;
        else generic = message;
      }
    }
    setErrors(fieldErrors);
    setFormError(
      generic ||
        (Object.keys(fieldErrors).length
          ? ''
          : 'Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyin.')
    );
  };

  if (done) {
    const message = encodeURIComponent(
      `Merhaba, Çevir Kazan 360'a salon başvurusu yaptım. Salon adı: ${form.salon.trim()}`
    );
    return (
      <div
        className="bg-ck-surface border-[1.5px] border-ck-line rounded-[28px] p-6 md:p-8 flex flex-col gap-4"
        aria-live="polite"
      >
        <span className="w-14 h-14 rounded-full bg-ck-wa/20 text-[#08311A] flex items-center justify-center">
          <LuCircleCheck size={30} aria-hidden="true" />
        </span>
        <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[26px] tracking-[-.02em]">
          Başvurun bize ulaştı!
        </h2>
        <p className="m-0 text-base leading-[1.55] text-ck-muted">
          Bilgilerini inceleyip <strong>{form.email.trim()}</strong> adresine
          veya telefonuna en kısa sürede dönüş yapacağız.
        </p>
        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-ck-wa text-[#08311A] no-underline font-bold text-base px-6 rounded-full min-h-12 inline-flex items-center justify-center gap-2.5 ck-btn hover:brightness-95 hover:shadow-[0_10px_24px_rgba(37,211,102,.35)]"
          >
            <LuMessageCircle size={20} aria-hidden="true" />
            Hızlı iletişim için WhatsApp&apos;tan yaz
          </a>
        )}
      </div>
    );
  }

  let fieldIndex = 0; // her render'da sıfırlanır; alanlar sırayla girer
  const textField = (
    field: keyof FormState,
    label: string,
    opts: { required?: boolean; type?: string; placeholder?: string } = {}
  ) => (
    <label
      className="ck-enter-up flex flex-col gap-1.5 text-sm font-bold text-ck-muted"
      style={{ animationDelay: `${300 + fieldIndex++ * 70}ms` }}
    >
      <span>
        {label}
        {opts.required && <span className="text-ck-error"> *</span>}
      </span>
      <input
        type={opts.type || 'text'}
        value={form[field]}
        onChange={(e) => set(field, e.target.value)}
        placeholder={opts.placeholder}
        aria-invalid={!!errors[field]}
        className={`${FIELD} ${errors[field] ? 'border-ck-error' : ''}`}
      />
      {errors[field] && (
        <span className="text-[13px] font-medium text-ck-error">
          {errors[field]}
        </span>
      )}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-ck-surface border-[1.5px] border-ck-line rounded-[28px] p-6 md:p-8 flex flex-col gap-4"
    >
      <div
        className="ck-enter-up flex flex-col gap-1.5"
        style={{ animationDelay: '200ms' }}
      >
        <h2 className="m-0 font-[family-name:var(--font-bricolage)] font-extrabold text-[26px] tracking-[-.02em]">
          Salon başvuru formu
        </h2>
        <p className="m-0 text-[15px] leading-normal text-ck-muted">
          Bilgilerini yaz, başvurun doğrudan ekibimize ulaşsın. Size en kısa
          sürede dönüş yapalım.
        </p>
      </div>

      {textField('salon', 'Salon adı', { required: true })}
      {textField('owner', 'Yetkili ad soyad', { required: true })}
      {textField('phone', 'Telefon', {
        required: true,
        type: 'tel',
        placeholder: '05xx xxx xx xx',
      })}
      {textField('email', 'E-posta', { required: true, type: 'email' })}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {textField('city', 'Şehir', { required: true })}
        {textField('district', 'İlçe')}
      </div>
      {textField('instagram', 'Instagram (opsiyonel)', {
        placeholder: '@salonadin',
      })}

      <label
        className="ck-enter-up flex flex-col gap-1.5 text-sm font-bold text-ck-muted"
        style={{ animationDelay: '720ms' }}
      >
        Eklemek istediğin not (opsiyonel)
        <textarea
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
          rows={3}
          maxLength={1000}
          className={`${FIELD} py-3 resize-y`}
        />
      </label>

      {/* bot tuzağı: ekranda görünmez, klavye ve ekran okuyucudan gizli */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      >
        <label>
          Web siteniz
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
          />
        </label>
      </div>

      {formError && (
        <p
          className="m-0 text-sm rounded-xl bg-ck-error/10 border border-ck-error px-4 py-3 text-ck-error"
          role="alert"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer border-0 bg-ck-brand text-white font-bold text-[17px] px-7 rounded-full min-h-[52px] inline-flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed ck-btn enabled:hover:bg-ck-brand-dark enabled:hover:shadow-[0_10px_24px_rgba(107,14,36,.35)]"
      >
        <LuSend size={20} aria-hidden="true" />
        {loading ? 'Gönderiliyor…' : 'Başvuruyu gönder'}
      </button>
    </form>
  );
};

export default SalonApplyForm;
