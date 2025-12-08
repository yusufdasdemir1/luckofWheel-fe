import { useContext } from 'react';
import { TableContext } from './tableContext';
import { useCalcGridSize } from '../../../hooks/useCalcGridSize';

const TableGridLayout = () => {
  const { layout, data, gridElement } = useContext(TableContext);
  const { gridSize } = useCalcGridSize();

  if (layout !== 'grid') return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="grid gap-6 w-full relative transition-all mt-4 box-border duration-300"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {data.map((row: any, rowIndex: number) =>
          gridElement ? gridElement(row, rowIndex) : null
        )}
      </div>
    </div>
  );
};

export default TableGridLayout;
