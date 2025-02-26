import { useEffect } from 'react';

import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  create,
  // StoreApi
} from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

import { TdoorModelInfoDto, apiGetProdDoorModels, useApiGetProdDoorModels } from 'js/api/api_product';

type TdoorModelDict = {
  [name: string]: TdoorModelInfoDto;
};

type TdoorModelList = {
  isReady: boolean;
  raw: undefined | null | TdoorModelInfoDto[];
  doorModelArr: undefined | null | TdoorModelInfoDto[];
  doorModelDict: undefined | null | TdoorModelDict;
  checkIsSpecialDoor: (doorModelName: string) => boolean;
  parseDoorModelSort: (doorModelName: string) => undefined | 'normal' | 'special' | 'w13456';
  update: () => void;
};

// type Tset = StoreApi<TdoorModelList>['setState'];
// type Tget = StoreApi<TdoorModelList>['getState'];

const useDoorModel_prime = create<TdoorModelList>()(
  immer<TdoorModelList>(
    (set, get) => {
      // 我完全不知道(好啦，可能知道，這大概是建構函式)為什麼const doorModelList這一行之前程式碼只執行一次

      const update = async () => {
        return await apiGetProdDoorModels()
          .then((data) => {
            const dict: TdoorModelDict = data.reduce((acc, item) => {
              acc[item.name] = item;

              return acc;
            }, {} as TdoorModelDict);

            set((state) => ({
              raw: data,
              doorModelArr: _.cloneDeep(data),
              doorModelDict: dict,
              isReady: true,
            }));
          })
          .catch(() => {
            set((state) => ({
              raw: null,
              doorModelArr: null,
              doorModelDict: null,
              isReady: true,
            }));
            myAlert.notify.error({ message: '取得門型列表失敗' });
          });
      };

      const checkIsSpecialDoor = (doorModelName: string) => {
        let isSpecial = true;
        const doorModelDir = get().doorModelDict;

        if (doorModelDir && doorModelName in doorModelDir) {
          isSpecial = false;
        }

        // if (doorModelName === 'W2') {
        //   isSpecial = true;
        // }

        return isSpecial;
      };

      const parseDoorModelSort = (doorModelName: string) => {
        if (!get().isReady) {
          return undefined;
        }

        const isSpecialDoor = !!doorModelName && checkIsSpecialDoor(doorModelName);

        let doorModelSort: 'normal' | 'special' | 'w13456';

        if (/^W[123456]$/.test(doorModelName)) {
          doorModelSort = 'w13456';
        } else if (isSpecialDoor) {
          doorModelSort = 'special';
        } else {
          doorModelSort = 'normal';
        }

        return doorModelSort;
      };

      //
      const doorModelList: TdoorModelList = {
        raw: undefined,
        doorModelDict: undefined,
        doorModelArr: undefined,
        isReady: false,
        update,
        checkIsSpecialDoor,
        parseDoorModelSort,
      };

      return doorModelList;
    } // main
  ) // immer
);

const useGlobal_doorModel = () => {
  const store = useDoorModel_prime((store) => store);

  useEffect(() => {
    if (!store.raw) {
      store.update();
    }
  }, []);

  return store;
};

export { useGlobal_doorModel, useShallow };
