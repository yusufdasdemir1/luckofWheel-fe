import type { ReactNode } from 'react';

export type AlertTypes = 'success' | 'error' | 'info' | 'warning';

export interface IAlert {
  id: string;
  type: AlertTypes;
  title: string;
  content: ReactNode;
}
