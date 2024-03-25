import { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// type
import {
  //
  TquotationProductItemDto,
  TupdateWorkSheetItem,
  TdoorModelInfoDto,
  TquotationProductComponentDto,
  TdoorComponentType,
} from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { checkIsFloat } from 'js/utils/checkValue';
import { lookup_motorPhase } from 'config/product/lookup';

// =====================================================================

// 簡略set目錄
// setBasicSpec

type Tworksheet = {
  readonly contractProductItem_ori: TquotationProductItemDto | undefined;
  doorModelInfo: TdoorModelInfoDto | undefined;
  componentList: { [key in TdoorComponentType]: TquotationProductComponentDto } | undefined;
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

  motor: {
    horsepower: string;
    motorVoltage: string;
    motorPhase: string;
    vendor: string;
    hasMotorSupportStand: string;
    electricMotorChainType: string;
    motorLockBox: string;
    electricMotorDirection: string;
    getElectricSupply: () => string;
  };

  // | 'slat'
  // | 'bottomBar'
  // | 'guideRail'
  // | 'sidePlate'
  // | 'roller'
  // | 'motor'
  // | 'motorAccessories'
  // | 'headBox';

  headBox: {
    material: string;
    headBoxThickness: string;
    surface: string;
    headBoxFront: string;
    headBoxProtruding: string;
    isIntegratedHeadBox: boolean;
    headBoxAngleIronQuantity: string;
    getIsIntegratedHeadBox: () => string;
  };

  roller: {
    diameter: string;
    rollerSpec: string;
  };

  slat: {
    material: string;
    surface: string;
  };

  //
  init: (props: {
    itemIdArr: Tworksheet['itemIdArr'];
    contractProductItem: Tworksheet['contractProductItem_ori'];
    qty: Tworksheet['qty'];
  }) => void;

  setDoorModelInfo: (doorModelInfo: TdoorModelInfoDto | undefined) => void;

  getOptions_material: () => Toption[];

  // -----------------------------------------------------------------------------

  setBasicSpec_str: (props: {
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

  // -----------------------------------------------------------------------------

  setABCD: (props: { key: keyof Tworksheet['ABCD']; value: string }) => void;

  // -----------------------------------------------------------------------------

  setMotor_supply: (props: { phase: string; voltage: string }) => void;

  setMotor_str: (props: {
    key: 'horsepower' | 'electricMotorChainType' | 'hasMotorSupportStand' | 'motorLockBox' | 'electricMotorDirection';
    value: string;
  }) => void;

  // -----------------------------------------------------------------------------

  setHeadBox_str: (props: {
    key: Exclude<keyof Tworksheet['headBox'], 'isIntegratedHeadBox' | 'getIsIntegratedHeadBox'>;
    value: string;
  }) => void;

  setHeadBox_bool: (props: { key: 'isIntegratedHeadBox'; value: boolean }) => void;

  // -----------------------------------------------------------------------------

  setRoller_str: (props: { key: 'diameter' | 'rollerSpec'; value: string }) => void;

  // -----------------------------------------------------------------------------

  setSlat_str: (props: { key: 'material' | 'surface'; value: string }) => void;

  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  //
};

const useWorksheet = create<Tworksheet, [['zustand/immer', never]]>(
  immer(
    (set, get) => ({
      contractProductItem_ori: undefined,
      doorModelInfo: undefined,
      componentList: undefined,
      // ---------------------------------------------------------------------
      itemIdArr: [],
      qty: 0,
      // ---------------------------------------------------------------------

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

      motor: {
        horsepower: '',
        motorVoltage: '',
        motorPhase: '',
        vendor: '',
        hasMotorSupportStand: '',
        electricMotorChainType: '',
        motorLockBox: '',
        electricMotorDirection: '',
        getElectricSupply: () => {
          const { motorVoltage, motorPhase } = get().motor;

          return `${lookup_motorPhase[motorPhase as '1' | '3'] ?? ''} ${motorVoltage}V`;
        },
      },

      headBox: {
        material: '',
        headBoxThickness: '',
        surface: '',
        headBoxFront: '',
        headBoxProtruding: '',
        isIntegratedHeadBox: false,
        headBoxAngleIronQuantity: '0',
        getIsIntegratedHeadBox: () => {
          const isIntegratedHeadBox = get().headBox.isIntegratedHeadBox;

          return isIntegratedHeadBox ? '一體式捲箱' : '捲箱加機箱';
        },
      },

      roller: {
        diameter: '',
        rollerSpec: '',
      },

      slat: {
        material: '',
        surface: '',
      },

      // ---------------------------------------------------------------------
      // ---------------------------------------------------------------------
      //
      init: ({ itemIdArr, contractProductItem, qty }) =>
        set((state) => {
          // ____________________________________________________________________
          // ____________________________________________________________________

          const componentArr = contractProductItem?.components;

          const componentList = (() => {
            if (!componentArr) {
              return undefined;
            }

            const list: Partial<Tworksheet['componentList']> = {};
            componentArr?.forEach((component) => {
              list[component.type] = component;
            });

            return list as Required<Tworksheet['componentList']>;
          })();

          // ____________________________________________________________________
          // ____________________________________________________________________
          state.itemIdArr = itemIdArr;
          state.qty = qty;
          state.contractProductItem_ori = contractProductItem;
          state.componentList = componentList;
          // ____________________________________________________________________
          // ____________________________________________________________________
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

          state.motor = {
            horsepower: String(contractProductItem?.horsepower ?? ''),
            motorVoltage: String(contractProductItem?.motorVoltage ?? ''),
            motorPhase: String(contractProductItem?.motorPhase ?? ''),
            vendor: contractProductItem?.motorVendor ?? '',
            hasMotorSupportStand: contractProductItem?.hasMotorSupportStand ? '有' : '無',
            electricMotorChainType: contractProductItem?.electricMotorChainType ?? '',
            motorLockBox: contractProductItem?.motorLockBox ?? '',
            electricMotorDirection: contractProductItem?.electricMotorDirection ?? '',
            getElectricSupply: state.motor.getElectricSupply,
          };

          state.headBox = {
            material: componentList?.headBox?.material ?? '',
            headBoxThickness: String(contractProductItem?.thickness ?? ''),
            surface: componentList?.headBox?.materialSurface ?? '',
            headBoxFront: contractProductItem?.headBoxFront ?? '',
            headBoxProtruding: contractProductItem?.headBoxProtruding ?? '',
            isIntegratedHeadBox: !!contractProductItem?.isIntegratedHeadBox,
            headBoxAngleIronQuantity: String(contractProductItem?.headBoxAngleIronQuantity ?? '0'),
            getIsIntegratedHeadBox: state.headBox.getIsIntegratedHeadBox,
          };

          state.roller = {
            diameter: contractProductItem?.diameter ?? '',
            rollerSpec: contractProductItem?.rollerSpec ?? '',
          };

          state.slat = {
            material: componentList?.slat?.material ?? '',
            surface: componentList?.slat?.materialSurface ?? '',
          };

          //
          //
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
      // ---------------------------------------------------------------------

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

      // ---------------------------------------------------------------------

      setABCD: ({ key, value }) => {
        set((state) => {
          state.ABCD[key] = value;
        });
      },

      // ---------------------------------------------------------------------

      setMotor_supply: ({ phase, voltage }) => {
        set((state) => {
          state.motor.motorVoltage = voltage;
          state.motor.motorPhase = phase;
        });
      },

      setMotor_str: ({ key, value }) => {
        set((state) => {
          state.motor[key] = value;
        });
      },
      // ---------------------------------------------------------------------

      setHeadBox_str: ({ key, value }) => {
        set((state) => {
          state.headBox[key] = value;
        });
      },

      setHeadBox_bool: ({ key, value }) => {
        set((state) => {
          state.headBox[key] = value;
        });
      },

      // ---------------------------------------------------------------------

      setRoller_str: ({ key, value }) => {
        set((state) => {
          state.roller[key] = value;
        });
      },

      // ---------------------------------------------------------------------

      setSlat_str: ({ key, value }) => {
        set((state) => {
          state.slat[key] = value;
        });
      },

      // ---------------------------------------------------------------------
      // ---------------------------------------------------------------------
      // ---------------------------------------------------------------------

      //
    }) // set get
  ) //immer
);

// =====================================================================
export { useWorksheet };
