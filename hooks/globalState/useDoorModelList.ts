import _ from 'lodash';

import {
  create,
  // StoreApi
} from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

import { TdoorModelInfoDto, apiGetProdDoorModels } from 'js/api/api_product';

type TdoorModelDir = {
  [name: string]: TdoorModelInfoDto;
};

type TdoorModelList = {
  raw?: TdoorModelInfoDto[];
  doorModelArr: TdoorModelInfoDto[];
  doorModelDir: TdoorModelDir;

  checkIsSpecialDoor: (doorModelName: string) => boolean;
};

// type Tset = StoreApi<TdoorModelList>['setState'];
// type Tget = StoreApi<TdoorModelList>['getState'];

const useDoorModelList = create<TdoorModelList>()(
  immer<TdoorModelList>(
    (set, get) => {
      // 我完全不知道(好啦，可能知道，這大概是建構函式)為什麼const doorModelList這一行之前程式碼只執行一次
      apiGetProdDoorModels().then((data) => {
        const list: TdoorModelDir = data.reduce((acc, item) => {
          acc[item.name] = item;

          return acc;
        }, {} as TdoorModelDir);

        set((state) => ({
          raw: data,
          doorModelArr: _.cloneDeep(data),
          doorModelDir: list,
        }));
      });

      //
      const doorModelList: TdoorModelList = {
        doorModelDir: {},
        doorModelArr: [],
        checkIsSpecialDoor: (doorModelName: string) => {
          let isSpecial = true;
          const doorModelDir = get().doorModelDir;

          if (doorModelName in doorModelDir) {
            isSpecial = false;
          }

          if (doorModelName === 'W2') {
            isSpecial = true;
          }

          return isSpecial;
        },
      };

      return doorModelList;
    } // main
  ) // immer
);

export { useDoorModelList, useShallow };
