'use client';
import React from 'react';
import { IoTrophyOutline } from 'react-icons/io5';

export interface IWinStats {
  scope: 'company' | 'staff';
  total_wins: number;
  used_wins: number;
  unused_wins: number;
  usage_rate: number;
  unique_customers: number;
  recent_wins: number;
  recent_days: number;
  top_gift: { title: string; count: number } | null;
  top_gifts: { title: string; count: number; used: number; percent: number }[];
}

const Tile = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) => (
  <div className="flex flex-col gap-1 p-3.5 box-border bg-white border border-slate-200 rounded-2xl shadow-sm">
    <span className="text-xs text-slate-500">{label}</span>
    <strong className="text-xl text-ck-ink">{value}</strong>
    {hint && <span className="text-xs text-slate-400">{hint}</span>}
  </div>
);

// Sabit sıra: renk hediyeye aittir (sıralama değişse bile boyanma düzeni korunur)
// Palet doğrulandı: açık zeminde yeterli ayrışma; düşük kontrastlı altın için sayılar listede de yazılı
const SLICE_COLORS = ['#A8203F', '#D49A22', '#0A93B3', '#7A5FD0'];
const OTHER_COLOR = '#94A3B8';
const SHOWN = SLICE_COLORS.length;

interface Slice {
  key: string;
  title: string;
  count: number;
  percent: number;
  color: string;
}

const pct = (n: number) => n.toLocaleString('tr-TR');

const DonutChart = ({
  slices,
  total,
  active,
  onActive,
}: {
  slices: Slice[];
  total: number;
  active: string | null;
  onActive: (key: string | null) => void;
}) => {
  const R = 70;
  const STROKE = 28;
  const GAP = 2; // dilimler arası zemin rengi boşluğu
  const C = 2 * Math.PI * R;
  const current = slices.find((s) => s.key === active);

  let offset = 0;

  return (
    <div className="relative w-[190px] h-[190px] shrink-0">
      <svg
        viewBox="0 0 190 190"
        width="190"
        height="190"
        role="img"
        aria-label={`Kazanılan hediyelerin dağılımı: ${slices
          .map((s) => `${s.title} %${pct(s.percent)}`)
          .join(', ')}`}
      >
        <g transform="rotate(-90 95 95)">
          {slices.length === 1 ? (
            <circle
              cx="95"
              cy="95"
              r={R}
              fill="none"
              stroke={slices[0].color}
              strokeWidth={STROKE}
            />
          ) : (
            slices.map((slice) => {
              const len = (slice.count / total) * C;
              const dash = Math.max(0, len - GAP);
              const el = (
                <circle
                  key={slice.key}
                  cx="95"
                  cy="95"
                  r={R}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={active === slice.key ? STROKE + 6 : STROKE}
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                  opacity={active && active !== slice.key ? 0.35 : 1}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => onActive(slice.key)}
                  onMouseLeave={() => onActive(null)}
                >
                  <title>{`${slice.title}: ${slice.count} kez · %${pct(slice.percent)}`}</title>
                </circle>
              );
              offset += len;
              return el;
            })
          )}
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 pointer-events-none">
        {current ? (
          <>
            <strong className="text-xl text-ck-ink">
              %{pct(current.percent)}
            </strong>
            <span className="text-xs text-slate-500 leading-tight line-clamp-2">
              {current.title}
            </span>
          </>
        ) : (
          <>
            <strong className="text-2xl text-ck-ink">{total}</strong>
            <span className="text-xs text-slate-500">kazanım</span>
          </>
        )}
      </div>
    </div>
  );
};

const WinStats = ({ stats }: { stats: IWinStats }) => {
  const [active, setActive] = React.useState<string | null>(null);

  // ilk 4 hediye kendi rengiyle, kalanı "Diğer" olarak tek dilimde toplanır
  const slices: Slice[] = stats.top_gifts.slice(0, SHOWN).map((g, i) => ({
    key: g.title,
    title: g.title,
    count: g.count,
    percent: g.percent,
    color: SLICE_COLORS[i],
  }));
  const restCount =
    stats.total_wins - slices.reduce((sum, slice) => sum + slice.count, 0);
  if (restCount > 0) {
    slices.push({
      key: '__other',
      title: 'Diğer',
      count: restCount,
      percent: Math.round((restCount * 1000) / stats.total_wins) / 10,
      color: OTHER_COLOR,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Tile label="Toplam kazanılan" value={stats.total_wins} />
        <Tile
          label="Kullanıldı"
          value={<span className="text-emerald-600">{stats.used_wins}</span>}
        />
        <Tile label="Kullanılmadı" value={stats.unused_wins} />
        <Tile
          label="Kullanım oranı"
          value={`%${stats.usage_rate.toLocaleString('tr-TR')}`}
        />
        <Tile label="Müşteri sayısı" value={stats.unique_customers} />
        <Tile
          label={`Son ${stats.recent_days} gün`}
          value={stats.recent_wins}
        />
      </div>

      <div className="flex flex-col gap-4 p-4 box-border bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <IoTrophyOutline className="text-primary" size={18} />
          <h3 className="m-0 text-base font-semibold text-ck-ink">
            En çok kazanılan hediyeler
          </h3>
        </div>

        {slices.length === 0 ? (
          <p className="m-0 text-sm text-slate-500">
            Henüz kazanılan hediye yok.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <DonutChart
              slices={slices}
              total={stats.total_wins}
              active={active}
              onActive={setActive}
            />

            <ol className="m-0 p-0 list-none flex flex-col gap-3 w-full min-w-0">
              {slices.map((slice) => (
                <li
                  key={slice.key}
                  onMouseEnter={() => setActive(slice.key)}
                  onMouseLeave={() => setActive(null)}
                  className={`flex items-center gap-3 transition-opacity ${
                    active && active !== slice.key ? 'opacity-40' : ''
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 min-w-3 rounded-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <strong className="text-sm text-ck-ink break-words">
                        {slice.title}
                      </strong>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {slice.count} kez · %{pct(slice.percent)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${slice.percent}%`,
                          backgroundColor: slice.color,
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinStats;
