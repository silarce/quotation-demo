import { useMemo } from 'react';

// component
import SupplyTable, {
  Tgroup,
  // Tprops_cell, Tprops_cell_input
} from './ui/supplyTable';

// css
import scss from './supplyList.module.scss';

import type { TelectronicSuppliesContentDto } from 'js/api/dtoTypes';

import { orderDetailArr } from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

// ==================================================================

export default function SupplyList({
  electronicSuppliesContents,
}: {
  electronicSuppliesContents: TelectronicSuppliesContentDto[];
}) {
  const groupArr = useMemo(() => {
    const list: {
      [key: string]: Tgroup;
    } = {};

    orderDetailArr({ detailArr: electronicSuppliesContents }).forEach((item) => {
      const {
        //
        itemName,
        category,
        // unit,
        // pickUpQuantity,
        // stayQuantity,
        // quantity,
      } = item;

      const subItemName = itemName === '控制箱/盤' ? '捲門/水閘門' : undefined;

      if (!list[itemName]) {
        list[itemName] = {
          itemName,
          subItemName,
          rowArr: [],
        };
      }

      list[itemName].rowArr.push({
        category,
        valueArr: keyArr.map((key) => ({
          defaultValue: String(item[key] || '0'),
        })),
      });
    }); // forEach

    return Object.values(list);
  }, [electronicSuppliesContents]);

  // MARK: RENDER
  return (
    <div className={scss.supplyList}>
      <SupplyTable valueLabelArr={labelArr} groupArr={groupArr} disabled={true} />
    </div>
  );
}

// MARK: END

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================

// region CONFIG
const keyArr = ['stayQuantity', 'pickUpQuantity', 'quantity'] as const;
const labelArr = ['未領數量', '已領數量', '需求總數量'];

// ==================================================================
