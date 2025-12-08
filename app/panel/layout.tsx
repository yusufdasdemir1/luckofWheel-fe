import Sidebar from '@/components/panel/Sidebar';
import React, { ReactNode } from 'react';

const PanelLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full h-full flex flex-col gap-6">
      <Sidebar />
      <div className="flex flex-col gap-6 w-full box-border p-4 bg-slate-50">
        {children}
      </div>
    </main>
  );
};

export default PanelLayout;
