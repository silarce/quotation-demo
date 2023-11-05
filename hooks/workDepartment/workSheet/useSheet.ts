import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';

import { Class_workSheet } from './class_WorkSheet';

// type
import {
  //  TquotationProductDto ,
  TquotationProductItemDto,
  TupdateWorkSheetItem,
} from 'js/api/dtoTypes';

// =====================================================================

type TitemTokenList_new = {
  [key: string]: {
    originalItem: TquotationProductItemDto;
    [key: string]: TquotationProductItemDto;
  };
};
type TitemIdArrList_new = { [key: string]: { [key: string]: string[] } };

type TsheetList = {
  [key: string]: {
    [key: string]: Class_workSheet;
  };
};

type TchangedSheetList = {
  [key: string]: Class_workSheet;
};

type TforceUpdate_workSheet = (props?: { isNoChange?: boolean }) => void;

// =====================================================================
const useWorkSheet = ({
  itemTokenList,
  itemIdArrList,
}: {
  itemTokenList: TitemTokenList_new;
  itemIdArrList: TitemIdArrList_new;
}) => {
  // const [, updateState] = useState({});
  // const forceUpdate = useCallback(() => updateState({}), []);
  const [sheetList, setSheetList] = useState<TsheetList>({});

  const forceUpdate = useCallback(() => {
    setSheetList((state) => ({ ...state }));
  }, []);

  const [changedSheetList, setChangedSheetList] = useState<TchangedSheetList>({});

  // ------------------------------------------------------------

  const addSheet = ({
    //
    item,
    oldItem,
    pKey,
    cKey,
    itemIdArr,
  }: {
    item: TquotationProductItemDto | TupdateWorkSheetItem;
    oldItem: TquotationProductItemDto;
    pKey: string;
    cKey: string;
    itemIdArr: string[];
  }) => {
    setSheetList((sheetList) => {
      sheetList[pKey][cKey] = new Class_workSheet({
        identifyKey_p: pKey,
        identifyKey_c: cKey,
        forceUpdate: ({ isNoChange }: { isNoChange?: boolean } = {}) => {
          forceUpdate();

          if (isNoChange) {
            return;
          }

          setChangedSheetList((state) => ({ ...state, [cKey]: sheetList[pKey][cKey] }));
        },
        prod: item,
        oldProd: oldItem,
        itemIdArr: itemIdArr,
        addSheet,
      });
      // 分堆了，就要記錄在被改變清單中
      setChangedSheetList((state) => ({ ...state, [cKey]: sheetList[pKey][cKey] }));

      return { ...sheetList };
    });
  };

  const reset = async () => {
    const list: TsheetList = {};

    Object.keys(itemTokenList).forEach((pKey) => {
      list[pKey] = {};

      Object.keys(itemTokenList[pKey]).forEach((cKey) => {
        if (cKey === 'originalItem') {
          return;
        }

        const prod = itemTokenList[pKey][cKey];

        list[pKey][cKey] = new Class_workSheet({
          identifyKey_p: pKey,
          identifyKey_c: cKey,
          forceUpdate: ({ isNoChange }: { isNoChange?: boolean } = {}) => {
            forceUpdate();

            if (isNoChange) {
              return;
            }

            setChangedSheetList((state) => ({ ...state, [cKey]: list[pKey][cKey] }));
          },
          prod,
          oldProd: prod,
          itemIdArr: itemIdArrList[pKey][cKey],
          addSheet,
        });
      });
    });

    setSheetList(list);
    setChangedSheetList({});
  };

  // ------------------------------------------------------------
  return { sheetList, changedSheetList, reset };
};

export { useWorkSheet };
export type { Class_workSheet, TforceUpdate_workSheet };

// ======================================================================
/*
需求

左側的產品列的作用為選擇產品，
未來可能有將產品分堆的需求(例如，2個產品A，變成一個產品A，一個產品copyA)

右側為產品的內容
未來可能需要可以查看所有編輯前的內容(也就是說不限於"合約產品項目"這區塊的欄位)
>>用id找到原本的資料，產生class就可以了，如果沒有id就用empty資料產生class

除了最上面的區塊外，其他的其實都是主產品的材料配件
下面有一個選配，不屬於主產品，而是報價單的others(選配)
現在others不能追加追減，所以直接取任一個content的others就好了

有計算功能，也就是說需要呼叫product系列api

所有的下拉式選單，應該也是要從api取資料

有很多欄位是原本的主產品材料配件所沒有的

選配的選項應該是需要呼叫api取得

取消編輯時要重置資料

*/
// ======================================================================

// const useWorkSheet = ({
//   itemTokenList,
//   itemIdArrList,
// }: {
//   itemTokenList: { [key: string]: TquotationProductItemDto };
//   itemIdArrList: { [key: string]: string[] };
// }) => {
//   // const [, updateState] = useState({});
//   // const forceUpdate = useCallback(() => updateState({}), []);
//   const [sheetList, setSheetList] = useState<TsheetList>({});

//   const forceUpdate = useCallback(() => {
//     setSheetList((state) => ({ ...state }));
//   }, []);

//   const [changedSheetList, setChangedSheetList] = useState<TsheetList>({});

//   // ------------------------------------------------------------

//   const reset = async () => {
//     const list: TsheetList = {};
//     Object.keys(itemTokenList).forEach((key) => {
//       const prod = itemTokenList[key];
//       list[key] = new Class_workSheet({
//         identifyKey: key,
//         forceUpdate: ({ isNoChange }: { isNoChange?: boolean } = {}) => {
//           forceUpdate();

//           if (isNoChange) {
//             return;
//           }

//           setChangedSheetList((state) => ({ ...state, [key]: list[key] }));
//         },
//         prod,
//         itemIdArr: itemIdArrList[key],
//       });
//     });
//     setSheetList(list);
//     setChangedSheetList({});

//     // const arr = Object.values(list);
//     // for (const classSheet of arr) {
//     //   await classSheet.getWholeProduct();
//     // }
//   };

//   // ------------------------------------------------------------
//   return { sheetList, changedSheetList, reset };
// };
