import { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// type
import { TquotationProductItemDto, TupdateWorkSheetItem, TdoorModelInfoDto } from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { checkIsFloat } from 'js/utils/checkValue';

// =====================================================================

// 簡略set目錄
// setBasicSpec

type Tworksheet = {
  readonly contractProductItem_ori: TquotationProductItemDto | undefined;
  doorModelInfo: TdoorModelInfoDto | undefined;
  //
  itemIdArr: string[];
  qty: number;
  //
  basicSpec: {
    itemName: string;
    doorModelName: string;
    qty: string;
    fullWidth: string;
    WG: string;
    height: string;
    material: string;
    isAntiTyphoon: boolean;
  };
  ABCD: {
    gapA: string;
    gapC: string;
    boxB: string;
    boxD: string;
  };
  //
  init: (props: {
    itemIdArr: Tworksheet['itemIdArr'];
    contractProductItem: Tworksheet['contractProductItem_ori'];
    qty: Tworksheet['qty'];
  }) => void;

  setDoorModelInfo: (doorModelInfo: TdoorModelInfoDto | undefined) => void;

  getOptions_material: () => Toption[];

  //

  setBasicSpec_str: (props: {
    //
    key: keyof Omit<
      Exclude<Tworksheet['basicSpec'], undefined>,
      'isAntiTyphoon' | 'fullWidth' | 'WG' | 'height' | 'doorModelName'
    >;
    value: string;
  }) => void;

  setBasicSpec_material: (str: string) => void;

  setBasicSpec_strNum: (props: {
    //
    key: keyof Pick<Exclude<Tworksheet['basicSpec'], undefined>, 'fullWidth' | 'WG' | 'height'>;
    value: string;
  }) => void;

  setBasicSpec_bool: (props: { key: 'isAntiTyphoon'; value: boolean }) => void;

  //
  setABCD: (props: { key: keyof Tworksheet['ABCD']; value: string }) => void;

  //
};

const useWorksheet = create<Tworksheet, [['zustand/immer', never]]>(
  immer(
    (set, get) => ({
      contractProductItem_ori: undefined,
      doorModelInfo: undefined,
      //
      itemIdArr: [],
      qty: 0,
      //

      basicSpec: {
        itemName: '',
        doorModelName: '',
        qty: '0',
        fullWidth: '',
        WG: '',
        height: '',
        material: '',
        isAntiTyphoon: false,
      },

      ABCD: {
        gapA: '',
        gapC: '',
        boxB: '',
        boxD: '',
      },

      //
      init: ({ itemIdArr, contractProductItem, qty }) =>
        set((state) => {
          state.itemIdArr = itemIdArr;
          state.qty = qty;
          state.contractProductItem_ori = contractProductItem;
          state.basicSpec = {
            itemName: contractProductItem?.itemName ?? '',
            doorModelName: contractProductItem?.doorModelName ?? '',
            qty: String(qty),
            fullWidth: new Decimal(contractProductItem?.fullWidth ?? 0).div(1000).toFixed(2),
            WG: new Decimal(contractProductItem?.WG || 0).div(1000).toFixed(2),
            height: new Decimal(contractProductItem?.height || 0).div(1000).toFixed(2),
            material: contractProductItem?.materialName ?? '',
            isAntiTyphoon: contractProductItem?.isAntiTyphoon ?? false,
          };

          state.ABCD = {
            gapA: contractProductItem?.gapA ?? '',
            gapC: contractProductItem?.gapC ?? '',
            boxB: String(contractProductItem?.boxB ?? ''),
            boxD: String(contractProductItem?.boxD ?? ''),
          };
        }), // inite
      //
      //
      setDoorModelInfo: (doorModelInfo) =>
        set((state) => {
          state.doorModelInfo = doorModelInfo;
          state.basicSpec.doorModelName = doorModelInfo?.name ?? '';
        }),

      getOptions_material: () => {
        const optiions_material = get().doorModelInfo?.slatMaterials.map((item) => {
          return {
            value: item.name,
            label: item.name,
          };
        });

        return optiions_material ?? [];
      },

      //
      setBasicSpec_str: ({ key, value }) => {
        set((state) => {
          if (state.basicSpec) {
            state.basicSpec[key] = value;
          }
        });
      },
      setBasicSpec_strNum: ({ key, value }) => {
        set((state) => {
          state.basicSpec[key] = value;
        });
      },
      setBasicSpec_bool: ({ key, value }) => {
        set((state) => {
          if (state.basicSpec) {
            state.basicSpec[key] = value;
          }
        });
      },

      setBasicSpec_material: (str) => {
        set((state) => {
          state.basicSpec.material = str;
        });
      },

      //
      setABCD: ({ key, value }) => {
        set((state) => {
          state.ABCD[key] = value;
        });
      },
      //
    }) // set get
  ) //immer
);

// =====================================================================
export { useWorksheet };
