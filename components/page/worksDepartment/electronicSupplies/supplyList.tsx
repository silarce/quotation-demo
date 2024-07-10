import { useMemo } from 'react';

// component
import SupplyTable, { Tgroup, Tprops_cell, Tprops_cell_input } from './ui/supplyTable';

// css
import scss from './supplyList.module.scss';

import type { TelectronicSuppliesContentDto } from 'js/api/dtoTypes';

// ==================================================================

type TstateItem = {
  itemName: string;
  subItemName?: string | null;
  category: string;

  // 已領數量
  pickUpQuantity?: number | null;
  // 未領數量
  stayQuantity?: number | null;
  // 總需求數量
  quantity?: number | null;

  // 領取數量
  pickupRecord?: number | null;
  // 需求數量
  requirementQty?: number | null;
};

export type { TstateItem };

// ==================================================================

export default function SupplyList({
  electronicSuppliesContents,
}: {
  electronicSuppliesContents: TelectronicSuppliesContentDto[];
}) {
  // const defaultState: TstateItem[] = useMemo(() => {
  //   return electronicSuppliesContents.map((item) => {
  //     const { itemName, category, unit, pickUpQuantity, stayQuantity, quantity } = item;

  //     const state: TstateItem = {
  //       itemName,
  //       category,
  //       pickUpQuantity,
  //       stayQuantity,
  //       quantity,
  //     };
  //   });
  // }, [electronicSuppliesContents]);

  const groupArr = useMemo(() => {
    const list: {
      [key: string]: Tgroup;
    } = {};

    electronicSuppliesContents.forEach((item) => {
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

// const fakeData_lockbox: Tcontrol_nestedRow = {
//   name: '鎖盒',
//   subTypeArr: [
//     {
//       name: '智慧型（含主機）',
//       unclaimedQty: 1,
//       receivedQty: 2,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器',
//       unclaimedQty: 5,
//       receivedQty: <span className={'text-success'}>OK</span>,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發射器',
//       unclaimedQty: 9,
//       receivedQty: <span className={'text-pass'}>OK</span>,
//       needQty: 9,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器 + 發射器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '面板式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '埋入式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '外露式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_key: Tcontrol_nestedRow = {
//   name: '鎖匙',
//   subTypeArr: [
//     {
//       name: '鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '特殊鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_panel: Tcontrol_nestedRow = {
//   name: '控制箱/盤',
//   typeName: '捲門/水閘門',
//   subTypeArr: [
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_pressButton: Tcontrol_nestedRow = {
//   name: '押扣',
//   subTypeArr: [
//     {
//       name: '三點式（一般）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_firefightingSupplies: Tcontrol_nestedRow = {
//   name: '消防備品',
//   subTypeArr: [
//     {
//       name: '煙感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 1φ 220v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 3φ 380v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_host: Tcontrol_nestedRow = {
//   name: '主機',
//   subTypeArr: [
//     {
//       name: '遙控器（1:2）+ 障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '遙控器（1:2）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_infrared: Tcontrol_nestedRow = {
//   name: '紅外線',
//   subTypeArr: [
//     {
//       name: '反射式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '對照式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
