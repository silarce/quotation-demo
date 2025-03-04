import { useEffect } from 'react';

import WorksheetForm from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/form/productForm';

import { useWorksheet } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useWorksheet';
import { useShallow } from 'zustand/react/shallow';

export default function Research() {
  const init = useWorksheet(useShallow((state) => state.init));

  useEffect(() => {
    init({
      worksheetId: 'foo',
      itemIdArr: [],
      contractProductItem: undefined,
      contractProductItemArr: [],
      qty: 1,
      originalAccessories: [],
    });
  }, []);

  return (
    <div className="overflow-auto h-full">
      <WorksheetForm calcOnly={true} />
    </div>
  );
}
