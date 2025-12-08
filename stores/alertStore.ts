import { create } from 'zustand';
import type { IAlert } from '../types/IAlert';

type Store = {
  alerts: IAlert[];
  addAlert: (alert: IAlert) => void;
  removeAlert: (id: string) => void;
};

export const useAlertStore = create<Store>()((set, get) => ({
  alerts: [],

  addAlert: (alert) => {
    set((state) => ({ ...state, alerts: [...state.alerts, alert] }));

    setTimeout(() => {
      get().removeAlert(alert.id);
    }, 6500);
  },
  removeAlert: (id) =>
    set((state) => ({
      ...state,
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));
