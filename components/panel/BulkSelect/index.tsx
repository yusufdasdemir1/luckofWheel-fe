'use client';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../Button';

// Listede kart seçerek toplu işlem: seçim modu + seçili kimlikler (sadece geçerli sayfa)
export const useBulkSelect = (pageIds: number[]) => {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const key = pageIds.join(',');

  // sayfa ya da filtre değişince listede olmayan seçimler düşer
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => pageIds.includes(id)));
      return next.size === prev.size ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const toggle = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected = pageIds.length > 0 && selected.size === pageIds.length;

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(pageIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelected, key]);

  const cancel = useCallback(() => {
    setSelecting(false);
    setSelected(new Set());
  }, []);

  return useMemo(
    () => ({
      selecting,
      start: () => setSelecting(true),
      cancel,
      selected,
      ids: [...selected],
      count: selected.size,
      isSelected: (id: number) => selected.has(id),
      toggle,
      allSelected,
      toggleAll,
    }),
    [selecting, selected, toggle, allSelected, toggleAll, cancel],
  );
};

// Seçim modunda altta sabit duran işlem çubuğu
export const BulkBar = ({
  count,
  total,
  allSelected,
  onToggleAll,
  onCancel,
  onDelete,
}: {
  count: number;
  total: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) => (
  <div className="fixed inset-x-0 bottom-3 sm:bottom-5 lg:left-[270px] z-40 flex justify-center px-3 pointer-events-none">
    <div
      role="region"
      aria-label="Toplu işlem"
      className={classNames(
        'pointer-events-auto w-full max-w-[640px] box-border',
        'flex flex-wrap items-center gap-x-3 gap-y-2 p-3',
        'bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(42,26,28,.25)]',
      )}
    >
      <div className="flex flex-col leading-tight mr-auto">
        <strong className="text-sm text-ck-ink">{count} seçili</strong>
        <span className="text-xs text-slate-500">Bu sayfada {total} kayıt</span>
      </div>

      <Button size="small" color="primaryOutline" onClick={onToggleAll}>
        {allSelected ? 'Seçimi kaldır' : 'Tümünü seç'}
      </Button>
      <Button size="small" color="primaryOutline" onClick={onCancel}>
        Vazgeç
      </Button>
      <Button
        size="small"
        color="red"
        disabled={count === 0}
        onClick={onDelete}
      >
        Seçilenleri sil
      </Button>
    </div>
  </div>
);
