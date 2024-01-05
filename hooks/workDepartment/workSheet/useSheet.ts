import { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { Class_workSheet } from './class_WorkSheet';

// type
import {
  //  TquotationProductDto ,
  TquotationProductItemDto,
  TupdateWorkSheetItem,
} from 'js/api/dtoTypes';

import { useApiGetProdDoorModels, apiGetProdAccessories, TdoorAccessoryDto } from 'js/api/api_product';

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

type TaccessoriesArrList = {
  [key: string]: TdoorAccessoryDto[] | undefined;
};

// =====================================================================
const useWorkSheet = ({
  itemTokenList,
  itemIdArrList,
}: {
  itemTokenList: TitemTokenList_new;
  itemIdArrList: TitemIdArrList_new;
}) => {
  const [isHookLoading, setIsHookLoading] = useState(false);

  const [sheetList, setSheetList] = useState<TsheetList>({});

  const forceUpdate = useCallback(() => {
    setSheetList((state) => ({ ...state }));
  }, []);

  const [changedSheetList, setChangedSheetList] = useState<TchangedSheetList>({});

  const [accessoriesArrList, setAccessoriesArrList] = useState<TaccessoriesArrList>({});

  // ------------------------------------------------------------

  const { doorModelList, update: update_doorModelList } = useApiGetProdDoorModels();
  useEffect(() => {
    (async () => {
      try {
        setIsHookLoading(true);

        await update_doorModelList();
      } catch (error) {
      } finally {
        setIsHookLoading(false);
      }
    })();
  }, []);

  // ------------------------------------------------------------

  const reqGetAccessoriesArr = async (doorModelName: string) => {
    try {
      const res = await apiGetProdAccessories({ modelName: doorModelName });

      return res;
    } catch (error) {
      const err = error as { response: { data: { message: string; statusCode: number } } };
      const { message, statusCode } = err.response.data;
      myAlert.err({ title: '取得選配列表失敗', content: statusCode + ' ' + message });
    }
  };

  const lookupAccessoriesArr = async (doorModelName: string) => {
    const acceArr = accessoriesArrList[doorModelName];

    if (acceArr) {
      return _.cloneDeep(acceArr);
    }

    const res = await reqGetAccessoriesArr(doorModelName);

    if (res) {
      // setAccessoriesArrList會在整個迭代結束後才更新，所以必須要先更新accessoriesArrList
      // 迭代寫在reset裡面
      accessoriesArrList[doorModelName] = res;
      setAccessoriesArrList((state) => ({ ...state, [doorModelName]: res }));

      return _.cloneDeep(res);
    }

    return [];
  };

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
    if (!doorModelList) {
      myAlert.err({ title: '尚未取得門型列表', content: '請稍後' });

      return;
    }

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
        deleteSheet: () => deleteSheet({ pKey, cKey }),
        clearSheet: () => clearSheet({ pKey, cKey }),
        lookupAccessoriesArr,
        doorModelList,
      });
      // 分堆了，就要記錄在被改變清單中
      setChangedSheetList((state) => ({ ...state, [cKey]: sheetList[pKey][cKey] }));

      return { ...sheetList };
    });
  };

  const deleteSheet = ({
    //
    pKey,
    cKey,
  }: {
    pKey: string;
    cKey: string;
  }) => {
    setSheetList((sheetList) => {
      delete sheetList[pKey][cKey];

      return { ...sheetList };
    });
  };

  const clearSheet = ({
    //
    pKey,
    cKey,
  }: {
    pKey: string;
    cKey: string;
  }) => {
    setSheetList((sheetList) => {
      const itemIdArr = sheetList[pKey][cKey].itemIdArr;
      const adjustedItemId = sheetList[pKey][cKey].adjustedItemId;

      sheetList[pKey][pKey].gatherBack({ itemIdArr, adjustedItemId });
      delete sheetList[pKey][cKey];

      return { ...sheetList };
    });
  };

  // --------------------------------------------------------------------

  const options_doorModel = useMemo(() => {
    const oprions = Object.values(doorModelList || {}).map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });

    return oprions;
  }, [doorModelList]);

  // --------------------------------------------------------------------

  const reset = async () => {
    if (!doorModelList) {
      return;
    }

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
          deleteSheet: () => deleteSheet({ pKey, cKey }),
          clearSheet: () => clearSheet({ pKey, cKey }),
          lookupAccessoriesArr,
          doorModelList,
        });
      });
    });

    const workSheetArr = _.flatMap(_.values(list), (innerObject) => _.values(innerObject));

    for (const classSheet of workSheetArr) {
      await classSheet.getAccessoriesArr();
    }

    setSheetList(list);
    setChangedSheetList({});
  };

  // ------------------------------------------------------------
  return { sheetList, changedSheetList, reset, isHookLoading, doorModelList, options_doorModel };
};

export { useWorkSheet };
export type { Class_workSheet, TforceUpdate_workSheet, TaccessoriesArrList };
