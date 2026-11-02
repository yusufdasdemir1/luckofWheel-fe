import RoleGuard from '@/components/panel/RoleGuard';
import Sidebar from '@/components/panel/Sidebar';
import React, { ReactNode } from 'react';

// panel arama sonuçlarında çıkmasın
export const metadata = { robots: { index: false, follow: false } };

const PanelLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-[270px] min-w-0">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 box-border px-3 py-4 sm:px-5 lg:px-8 lg:py-8">
          <RoleGuard>{children}</RoleGuard>
        </div>
      </main>
    </div>
  );
};

export default PanelLayout;
