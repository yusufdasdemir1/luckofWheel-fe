import { useContext, useState } from 'react';
import { TableContext } from './tableContext';
import Modal from '../Modal';
import Checkbox from '../Checkbox';
import Button from '../Button';

const TableManageCols = () => {
  const {
    showManageColModal,
    setShowManageColModal,
    hiddenCols,
    columns,
    setHiddenCols,
  } = useContext(TableContext);

  const [innerHiddenCols, setInnerHiddenCols] = useState<string[]>(hiddenCols);

  const handleOnChange = (colTitle: string, isChecked: boolean) => {
    if (isChecked) {
      const updatedHiddenCols = innerHiddenCols.filter(
        (title: string) => title !== colTitle
      );
      setInnerHiddenCols(updatedHiddenCols);
    } else {
      const updatedHiddenCols = [...innerHiddenCols, colTitle];
      setInnerHiddenCols(updatedHiddenCols);
    }
  };

  const handleOnApply = () => {
    setHiddenCols(innerHiddenCols);
    setShowManageColModal(false);
  };

  const handleOnClickAllSelect = () => {
    setInnerHiddenCols([]);
  };

  return (
    <Modal
      show={showManageColModal}
      onClose={() => setShowManageColModal(false)}
      size="xSmall"
    >
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-purple text-center font-semibold text-2xl">
          Select Columns to Display
        </h3>
        <p className="text-center max-w-[80%] mx-auto text-[#4C4C4C]">
          Tick the columns you want to see in the table. Unticked columns will
          be hidden.
        </p>

        <div className="flex items-center gap-4 w-full mx-auto max-w-[80%]">
          <span
            className="text-purple underline cursor-pointer font-medium font-lato text-sm"
            onClick={handleOnClickAllSelect}
          >
            Select All
          </span>
        </div>

        <div className="grid grid-cols-2 max-w-[80%] w-full mx-auto gap-4">
          {columns.map((col: any, index: number) => (
            <Checkbox
              key={index}
              title={col.title}
              value={!innerHiddenCols.includes(col.title)}
              onChange={(val) => handleOnChange(col.title, val)}
            />
          ))}
        </div>

        <div className="max-w-[70%] w-full flex gap-4 mx-auto mt-6">
          <Button
            color="primaryOutline"
            className="w-full"
            onClick={() => setShowManageColModal(false)}
          >
            Cancel
          </Button>
          <Button className="w-full" onClick={handleOnApply}>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TableManageCols;
