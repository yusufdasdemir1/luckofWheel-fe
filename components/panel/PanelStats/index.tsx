import React from 'react';

export interface IMeetingStats {
  scope: 'company' | 'staff';
  total_meetings: number;
  waiting_meetings: number;
  arrived_meetings: number;
  cancelled_meetings: number;
  total_income: string;
  income_skipped_count: number;
  top_service: string | null;
  top_service_count: number;
  by_staff?: {
    staff_id: number | null;
    name: string;
    total: number;
    arrived: number;
    waiting: number;
  }[];
}

const Card = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-1 p-3.5 box-border bg-white border border-slate-200 rounded-2xl shadow-sm">
    <span className="text-xs text-slate-500">{label}</span>
    <strong className="text-xl text-ck-ink">{value}</strong>
  </div>
);

const PanelStats = ({ stats }: { stats: IMeetingStats }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Card label="Toplam randevu" value={stats.total_meetings} />
        <Card label="Bekleyen" value={stats.waiting_meetings} />
        <Card label="Gelen müşteri" value={stats.arrived_meetings} />
        <Card label="İptal" value={stats.cancelled_meetings} />
        <Card label="Gelir (gelenler)" value={stats.total_income} />
        <Card
          label="En çok tercih edilen"
          value={
            stats.top_service ? (
              <span className="text-base">
                {stats.top_service} ({stats.top_service_count})
              </span>
            ) : (
              '-'
            )
          }
        />
      </div>

      {stats.income_skipped_count > 0 && (
        <p className="text-xs text-slate-500 m-0">
          Fiyatı aralık olan (örn. 2000-3000) {stats.income_skipped_count}{' '}
          randevu gelire dahil değildir.
        </p>
      )}

      {stats.by_staff && stats.by_staff.length > 0 && (
        <div className="flex flex-col gap-1 p-4 box-border bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-xs text-slate-500">Çalışan bazlı</span>
          {stats.by_staff.map((row) => (
            <div
              key={row.staff_id ?? 'none'}
              className="flex items-center justify-between gap-3 text-sm py-1 border-b border-slate-100 last:border-0"
            >
              <strong className="truncate">{row.name}</strong>
              <span className="text-slate-600 whitespace-nowrap">
                {row.total} randevu · {row.arrived} geldi · {row.waiting} bekliyor
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanelStats;
