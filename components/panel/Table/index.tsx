'use client';
import { useState, type ReactNode } from 'react';
import { TableContext } from './tableContext';
import TableHeader from './TableHeader';
import TableGridLayout from './TableGridLayout';
import TableTableLayout from './TableTableLayout';
import TableManageCols from './TableManageCols';

interface TableColumn {
  title: ReactNode;
  value: (row: any, rowIndex: number) => ReactNode;
  size?: string;
  flex?: boolean;
  className?: () => string;
  order?: string;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSelect?: (selected: number[]) => void;
  selecteds?: number[];
  selectable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  // TODO: Type ekle
  filters?: any[];
  total?: number;
  actions?: any[];
  defaultLayout?: 'table' | 'grid';
  changeableLayout?: boolean;
  gridElement?: (row: any, rowIndex: number) => ReactNode;
}

const Table = ({
  data = [],
  columns,
  onSelect,
  selecteds = [],
  selectable = false,
  searchable = false,
  filterable = false,
  filters = [],
  total = 0,
  actions = [],
  defaultLayout = 'table',
  changeableLayout = false,
  gridElement = undefined,
}: TableProps) => {
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [showManageColModal, setShowManageColModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [layout, setLayout] = useState<'table' | 'grid'>(defaultLayout);

  const handleOnSelect = (isFull = false) => {
    if (!onSelect || !selecteds) return;

    const newSelecteds = isFull ? data.map((row) => row.id) : [];
    onSelect(newSelecteds);
  };

  const handleRowOnSelect = (rowId: number) => {
    if (!onSelect || !selecteds) return;

    const findIndex = selecteds?.findIndex((id) => id === rowId);
    if (findIndex !== undefined && findIndex >= 0) {
      const newSelecteds = selecteds.filter((id) => id !== rowId);
      onSelect(newSelecteds);
    } else {
      const newSelecteds = selecteds ? [...selecteds, rowId] : [rowId];
      onSelect(newSelecteds);
    }
  };

  return (
    <TableContext.Provider
      value={{
        data,
        columns,
        onSelect,
        selecteds,
        selectable,
        searchable,
        filterable,
        filters,
        total,
        actions,
        defaultLayout,
        changeableLayout,
        gridElement,
        layout,
        setLayout,
        showFilterModal,
        setShowFilterModal,
        handleOnSelect,
        handleRowOnSelect,
        showManageColModal,
        setShowManageColModal,
        hiddenCols,
        setHiddenCols,
      }}
    >
      <div className="flex flex-col gap-4">
        {/* header */}
        <TableHeader />

        {/* table */}
        <TableTableLayout />

        {/* grid */}
        <TableGridLayout />
      </div>

      {/* manage columns */}
      <TableManageCols />
    </TableContext.Provider>
  );
};

export default Table;
