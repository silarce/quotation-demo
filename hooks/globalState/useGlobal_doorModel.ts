import { useEffect } from 'react';

import _ from 'lodash';
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  create,
  // StoreApi
} from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

import { TdoorModelInfoDto } from 'js/api/api_product';
import { lookup_doorModelInfoMinimal } from 'config/product/lookup';

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
  formatOptions: () => undefined | { value: string; label: string }[];
};

// type Tset = StoreApi<TdoorModelList>['setState'];
// type Tget = StoreApi<TdoorModelList>['getState'];

const useDoorModel_prime = create<TdoorModelList>()(
  immer<TdoorModelList>(
    (set, get) => {
      const update = async () => {
        const data = lookup_doorModelInfoMinimal;
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
      };

      const checkIsSpecialDoor = (doorModelName: string) => {
        let isSpecial = true;
        const doorModelDir = get().doorModelDict;

        if (doorModelDir && doorModelName in doorModelDir) {
          isSpecial = false;
        }

        return isSpecial;
      };

      const parseDoorModelSort = (doorModelName: string) => {
        if (!get().isReady) {
          return undefined;
        }

        const isSpecialDoor = !!doorModelName && checkIsSpecialDoor(doorModelName);

        let doorModelSort: 'normal' | 'special' | 'w13456';

        if (/^W[13456]$/.test(doorModelName)) {
          doorModelSort = 'w13456';
        } else if (isSpecialDoor) {
          doorModelSort = 'special';
        } else {
          doorModelSort = 'normal';
        }

        return doorModelSort;
      };

      const formatOptions = () => {
        return get().doorModelArr?.map((item) => ({
          value: item.name,
          label: item.name,
          ...item,
        }));
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
        formatOptions,
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
export type { TdoorModelDict };
