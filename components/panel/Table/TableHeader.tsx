import { BsFillGridFill } from 'react-icons/bs';
import { ImTable2 } from 'react-icons/im';
import { IoIosSearch } from 'react-icons/io';
import { IoFilterOutline } from 'react-icons/io5';
import Input from '../Input';
import { useContext } from 'react';
import { TableContext } from './tableContext';
import cn from 'classnames';
import { useSearchParams } from 'next/navigation';

const TableHeader = () => {
  const { search }: any = useSearchParams();

  const {
    filterable,
    searchable,
    changeableLayout,
    layout,
    setLayout,
    setShowFilterModal,
    showFilterModal,
    filters,
  } = useContext(TableContext);

  return (
    <div className="w-full flex flex-col gap-4 justify-center">
      <div className="ml-auto flex items-center gap-6">
        {/* filter */}
        {filterable && (
          <button
            className="h-[45px] bg-[#F7F6FD] cursor-pointer text-purple text-sm flex items-center justify-center gap-2 px-4 py-2 border rounded-xl box-border border-purple"
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <IoFilterOutline className="text-inherit" size={18} />
            <span>Filters</span>
          </button>
        )}

        {/* search */}
        {searchable && (
          <div className="relative w-[250px]">
            <IoIosSearch
              size={20}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              placeholder="Search..."
              value={search || ''}
              className="rounded-xl border-purple pl-10"
              onChange={() => undefined}
            />
          </div>
        )}

        {/* change layout */}
        {changeableLayout && (
          <div className="flex items-center gap-4">
            <button
              className={cn('cursor-pointer', {
                'text-orange': layout === 'grid',
                'text-gray': layout !== 'grid',
              })}
              onClick={() => setLayout('grid')}
            >
              <BsFillGridFill size={28} />
            </button>
            <button
              className={cn('cursor-pointer', {
                'text-orange': layout === 'table',
                'text-gray': layout !== 'table',
              })}
              onClick={() => setLayout('table')}
            >
              <ImTable2 size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
