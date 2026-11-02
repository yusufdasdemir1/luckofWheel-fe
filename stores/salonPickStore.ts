import { create } from 'zustand';

// Salon sayfasındaki hizmet/kuaför kartlarından randevu formuna seçim taşır.
// nonce, aynı kart tekrar seçilse de formun tepki vermesini sağlar.
type Pick<T> = { value: T; nonce: number };

type Store = {
  service: Pick<string | null>;
  staff: Pick<number | null>;
  pickService: (title: string) => void;
  pickStaff: (id: number) => void;
};

export const useSalonPickStore = create<Store>()((set) => ({
  service: { value: null, nonce: 0 },
  staff: { value: null, nonce: 0 },
  pickService: (title) =>
    set((s) => ({ service: { value: title, nonce: s.service.nonce + 1 } })),
  pickStaff: (id) =>
    set((s) => ({ staff: { value: id, nonce: s.staff.nonce + 1 } })),
}));

// kartlara basınca kullanıcıyı randevu formuna götürür
export const scrollToBooking = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document
    .getElementById('randevu')
    ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
