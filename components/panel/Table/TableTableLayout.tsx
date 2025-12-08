import { TableContext } from './tableContext';
import cn from 'classnames';
import { useContext } from 'react';
import { BsSortDownAlt, BsSortDown } from 'react-icons/bs';
import { CgCheckO, CgRadioCheck, CgRadioChecked } from 'react-icons/cg';
import { TbDotsVertical } from 'react-icons/tb';

const TableTableLayout = () => {
  const {
    layout,
    data,
    columns,
    selectable,
    selecteds,
    actions,
    handleOnSelect,
    handleRowOnSelect,
    setShowManageColModal,
    hiddenCols,
  } = useContext(TableContext);

  if (layout !== 'table') return null;

  return (
    <div className="w-full max-w-[calc(100vw_-_120px)] flex rounded-lg border border-light-gray box-border bg-white">
      {/* left section */}
      <div className="md:min-w-[250px] lg:min-w-[275px] xl:min-w-[300px] 2xl:min-w-[350px] flex flex-col">
        <div className="w-full flex gap-4 h-[45px] py-1 border-b border-light-gray box-border">
          {selectable && (
            <div
              className={cn(
                'min-w-[70px] w-[70px] max-w-[70px]',
                'flex items-center justify-center',
                'text-center text-black font-semibold',
                'px-2 pr-4.5 box-border'
              )}
            >
              {selecteds?.length === data.length && data.length !== 0 && (
                <CgCheckO
                  className="text-black cursor-pointer"
                  size={22}
                  onClick={() => handleOnSelect()}
                />
              )}

              {selecteds.length === 0 && (
                <CgRadioCheck
                  className="text-black cursor-pointer"
                  size={24}
                  onClick={() => handleOnSelect(true)}
                />
              )}

              {selecteds.length > 0 && selecteds.length < data.length && (
                <CgRadioChecked
                  className="text-black cursor-pointer"
                  size={24}
                  onClick={() => handleOnSelect(true)}
                />
              )}
            </div>
          )}

          {columns
            .filter((c: any) => !hiddenCols.includes(c.title))
            .slice(0, 1)
            .map((col: any, index: number) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-2',
                  'text-black font-semibold',
                  'px-2 box-border',
                  {
                    'cursor-pointer': col.order,
                  },
                  col.className ? col.className() : ''
                )}
                style={{
                  minWidth: col.size,
                  maxWidth: col.size,
                  width: col.size,
                }}
              >
                {col.title}
              </div>
            ))}
        </div>

        {/* rows */}
        {data.map((row: any, rowIndex: number) => (
          <div
            key={rowIndex}
            className={cn(
              'w-full flex gap-4',
              'h-[45px] py-1 w-full',
              'border-b border-light-gray box-border last:border-b-0',
              {
                'bg-[#F7F6FD]': selecteds?.includes(row.id),
              }
            )}
          >
            {selectable && (
              <div
                className={cn(
                  'min-w-[70px] w-[70px] max-w-[70px]',
                  'flex items-center justify-center gap-1.5',
                  'px-2 box-border'
                )}
              >
                {selecteds?.includes(row.id) ? (
                  <CgCheckO
                    className="text-black cursor-pointer"
                    size={22}
                    onClick={() => handleRowOnSelect(row.id)}
                  />
                ) : (
                  <CgRadioCheck
                    className="text-black cursor-pointer"
                    size={22}
                    onClick={() => handleRowOnSelect(row.id)}
                  />
                )}
                <span className="text-sm text-black">{rowIndex + 1}</span>
              </div>
            )}

            {columns
              .filter((c: any) => !hiddenCols.includes(c.title))
              .slice(0, 1)
              .map((col: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'w-full flex items-center',
                    'text-black text-sm font-medium',
                    'px-2 box-border',
                    'truncate',

                    col.className ? col.className() : ''
                  )}
                  style={{
                    minWidth: col.size,
                    maxWidth: col.size,
                    width: col.size,
                  }}
                >
                  {col.value(row, rowIndex)}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="w-[16px] min-w-[16px]">
        {data.map((_: any, index: number) => (
          <div
            key={index}
            className="h-[45px] box-border border-b border-light-gray"
          ></div>
        ))}
      </div>

      {/* center section */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="w-full min-w-max flex justify-end gap-4 h-[45px] py-1 border-b border-light-gray box-border">
          {columns
            .filter((c: any) => !hiddenCols.includes(c.title))
            .slice(1)
            .map((col: any, index: number) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-2',
                  'text-black font-semibold',
                  'px-2 box-border',
                  {
                    'flex-1': col.flex,
                    'cursor-pointer': col.order,
                  },
                  col.className ? col.className() : ''
                )}
                style={{
                  minWidth: col.size,
                  maxWidth: col.size,
                  width: col.size,
                }}
              >
                {col.title}
              </div>
            ))}
        </div>

        {/* rows */}
        {data.map((row: any, rowIndex: number) => (
          <div
            key={rowIndex}
            className={cn(
              'flex gap-4 min-w-max justify-end',
              'h-[45px] py-1',
              'border-b border-light-gray box-border last:border-b-0',
              {
                'bg-[#F7F6FD]': selecteds?.includes(row.id),
              }
            )}
          >
            {columns
              .filter((c: any) => !hiddenCols.includes(c.title))
              .slice(1)
              .map((col: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center',
                    'text-black text-sm font-medium',
                    'px-2 box-border',
                    'truncate',
                    {
                      'flex-1': col.flex,
                    },
                    col.className ? col.className() : ''
                  )}
                  style={{
                    minWidth: col.size,
                    maxWidth: col.size,
                    width: col.size,
                  }}
                >
                  {col.value(row, rowIndex)}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="w-[16px] min-w-[16px]">
        {data.map((_: any, index: number) => (
          <div
            key={index}
            className="h-[45px] box-border border-b border-light-gray"
          ></div>
        ))}
      </div>

      {/* right section */}
      <div className="min-w-[30px] w-[30px] max-w-[30px] flex flex-col">
        <div
          className={cn(
            'min-w-[30px] w-[30px] max-w-[30px] h-[45px]',
            'relative group',
            'flex items-center',
            'box-border border-b border-light-gray'
          )}
        >
          <TbDotsVertical size={18} className="cursor-pointer" />
          <div className="w-[175px] min-h-[25px] flex-col gap-1 rounded-md overflow-hidden border-2 border-black bg-white hidden absolute right-[20px] top-[25px] z-10 shadow-md group-hover:flex">
            <button
              className="w-full flex items-center gap-1 px-2 py-1.5 hover:bg-black hover:text-white cursor-pointer"
              onClick={() => setShowManageColModal(true)}
            >
              <span className="!text-sm">Manage Columns</span>
            </button>
          </div>
        </div>

        {/* rows */}
        {data.map((row: any, rowIndex: number) => (
          <div
            key={rowIndex}
            className={cn(
              'flex gap-4',
              'h-[45px] py-1 w-full',
              'border-b border-light-gray box-border last:border-b-0',
              {
                'bg-[#F7F6FD]': selecteds?.includes(row.id),
              }
            )}
          >
            <div
              className={cn(
                'min-w-[30px] w-[30px] max-w-[30px]',
                'relative group',
                'flex items-center',
                'box-border'
              )}
            >
              <TbDotsVertical size={18} className="cursor-pointer" />
              <div className="w-[200px] min-h-[25px] flex-col gap-1 rounded-md overflow-hidden border-2 border-black bg-white hidden absolute right-[20px] top-[25px] z-10 shadow-md group-hover:flex">
                {actions.map((action: any, actionIndex: number) => (
                  <button
                    key={actionIndex}
                    className="w-full flex items-center gap-1 px-2 py-1.5 hover:bg-black hover:text-white cursor-pointer"
                    onClick={() => action.action(row, rowIndex)}
                  >
                    <div className="w-[20px] h-[25px] flex items-center justify-center">
                      {action.icon}
                    </div>
                    <span className="!text-sm">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTableLayout;
