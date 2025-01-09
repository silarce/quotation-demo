import { useMemo } from 'react';

import type { TdoorQtySubTotalList } from '../profile';
import type { TworksheetDto } from 'js/api/dtoTypes';

const useCalcDoorModal = (worksheetArr: TworksheetDto[]) => {
  const obj: {
    doorModalQtyList: TdoorQtySubTotalList;
    doorQtyTotal: number;
  } = useMemo(() => {
    const list: TdoorQtySubTotalList = {};
    let total = 0;

    worksheetArr.forEach((worksheet) => {
      const { latestRecord, isAbandoned, isAlreadyToElectronicSupplies } = worksheet;

      if (isAbandoned || !isAlreadyToElectronicSupplies) {
        return;
      }

      const { contractProductItems } = latestRecord;

      if (!contractProductItems?.[0]) {
        return;
      }

      const qty = contractProductItems.length;
      const doorModelName = contractProductItems[0].doorModelName;

      if (!list[doorModelName]) {
        list[doorModelName] = 0;
      }

      list[doorModelName] += qty;
      total += qty;
    }); // forEach

    return {
      doorModalQtyList: list,
      doorQtyTotal: total,
    };
    //
  }, [worksheetArr]);

  return obj;
};

export { useCalcDoorModal };
