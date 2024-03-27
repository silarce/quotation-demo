import { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';

import { create } from 'zustand';
// 使用 immer middleware會使typescript不正確的判斷型別，導致型別錯誤(實際上沒錯)
// import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';

// type
import {
  //
  TquotationProductItemDto,
  TupdateWorkSheetItem,
  TdoorModelInfoDto,
  TquotationProductComponentDto,
  TdoorComponentType,
  TdoorGeneralSpecsDto,
  TdoorModel,
  TdoorComponentListDto,
} from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { checkIsFloat } from 'js/utils/checkValue';
import { lookup_motorPhase } from 'config/product/lookup';

import { lookup_options_bottomBarAngleIronAndPlate } from 'js/utils/options/productOptions';

import { apiGetProdCalcGeneralSpec, apiGetProdAvailableComponents } from 'js/api/api_product';

// =====================================================================

// 簡略set目錄
// setBasicSpec

type Tworksheet = {
  readonly contractProductItem_ori: TquotationProductItemDto | undefined;
  doorModelInfo: TdoorModelInfoDto | undefined;
  componentList: { [key in TdoorComponentType]: TquotationProductComponentDto } | undefined;

  generalSpec: TdoorGeneralSpecsDto | undefined;
  avalibleComponents: TdoorComponentListDto | undefined;
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
  };

  ABCD: {
    getGapA: () => string;
    getGapC: () => string;
    boxB: string;
    boxD: string;
    setGapA: (value: string) => void;
    setGapC: (value: string) => void;
    setBoxB: (value: string) => void;
    setBoxD: (value: string) => void;
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
    setMotor_supply: (props: { phase: string; voltage: string }) => void;

    setMotor_str: (props: {
      key: 'horsepower' | 'electricMotorChainType' | 'hasMotorSupportStand' | 'motorLockBox' | 'electricMotorDirection';
      value: string;
    }) => void;
  };

  headBox: {
    material: string;
    headBoxThickness: string;
    surface: string;
    headBoxFront: string;
    headBoxProtruding: string;
    isIntegratedHeadBox: boolean;
    headBoxAngleIronQuantity: string;
    getIsIntegratedHeadBox: () => string;
    setHeadBox_str: (props: {
      key: Exclude<keyof Tworksheet['headBox'], 'isIntegratedHeadBox' | 'getIsIntegratedHeadBox'>;
      value: string;
    }) => void;

    setHeadBox_bool: (props: { key: 'isIntegratedHeadBox'; value: boolean }) => void;
  };

  roller: {
    getDiameter: () => string;
    rollerSpec: string;
    setRoller_str: (props: { key: 'diameter' | 'rollerSpec'; value: string }) => void;
  };

  slat: {
    material: string;
    surface: string;
    setSlat_str: (props: { key: 'material' | 'surface'; value: string }) => void;
  };

  guideRail: {
    material: string;
    guideRailThickness: string;
    surface: string;
    hasSilencingStrip: boolean;
    guideRailType: string;
    guideRail: string;
    getHasSilencingStrip: () => string;
  };

  bottomBar: {
    material: string;
    bottomBarAngleIron: string;
    bottomBarPlate: string;
    bottomBar: string;
    surface: string;
  };

  sidePlate: {
    getBearingName: () => string;
    getSprocketWheelModel: () => string;
    sidePlateDirection: string;
  };
  //
  init: (props: {
    itemIdArr: Tworksheet['itemIdArr'];
    contractProductItem: Tworksheet['contractProductItem_ori'];
    qty: Tworksheet['qty'];
  }) => void;

  setDoorModelInfo: (doorModelInfo: TdoorModelInfoDto | undefined) => void;

  getOptions_material: () => Toption[];
  getOptions_bottomBarAngleIronAndPlate: () => {
    options_angleIron: Toption[];
    options_plate: Toption[];
  };

  // -----------------------------------------------------------------------------
  reqGeneralSpec: () => Promise<TdoorGeneralSpecsDto>;
  update_generalSpec: () => Promise<void>;

  update_availableComponents: () => Promise<void>;

  // -----------------------------------------------------------------------------
  calcData: () => Promise<void>;

  // -----------------------------------------------------------------------------

  setGuideRail_str: (props: {
    key: //
    'material' | 'guideRailThickness' | 'surface' | 'guideRailType' | 'guideRail';
    value: string;
  }) => void;

  setGuideRail_hasSilencingStrip: (value: boolean) => void;

  // ___________________________________________________________

  setBottomBar_str: (props: {
    key: 'material' | 'bottomBarAngleIron' | 'bottomBarPlate' | 'bottomBar' | 'surface';
    value: string;
  }) => void;

  // ___________________________________________________________

  setSidePlate_str: (props: {
    key: 'bearingName' | 'sprocketWheelModel' | 'sidePlateDirection';
    value: string;
  }) => void;

  // -----------------------------------------------------------------------------

  // getABCD: () => Tworksheet['ABCD'];

  // -----------------------------------------------------------------------------

  getFullWidth_mm: () => number;
  getWG_mm: () => number;
  getHeight_mm: () => number;

  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  //
};

// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================

const useWorksheet = create<Tworksheet>(
  (set, get) => ({
    contractProductItem_ori: undefined,
    doorModelInfo: undefined,
    componentList: undefined,
    generalSpec: undefined,
    avalibleComponents: undefined,
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
      setBasicSpec_str: ({ key, value }) => {
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec[key] = value;
            }
          })
        );
      },
      setBasicSpec_strNum: ({ key, value }) => {
        set(
          produce((state) => {
            state.basicSpec[key] = value;
          })
        );
      },
      setBasicSpec_bool: ({ key, value }) => {
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec[key] = value;
            }
          })
        );
      },
      setBasicSpec_material: (str) => {
        set(
          produce((state) => {
            state.basicSpec.material = str;
          })
        );
      },
    },

    ABCD: {
      getGapA: () => String(get().generalSpec?.gapA ?? ''),
      getGapC: () => String(get().generalSpec?.gapC ?? ''),
      boxB: '',
      boxD: '',
      setGapA: (value) => {
        set(produce((state) => (state.generalSpec.gapA = value)));
      },
      setGapC: (value) => {
        set(produce((state) => (state.generalSpec.gapC = value)));
      },
      setBoxB: (value) => {
        set(produce((state) => (state.ABCD.boxB = value)));
      },
      setBoxD: (value) => {
        set(produce((state) => (state.ABCD.boxD = value)));
      },
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
      setMotor_supply: ({ phase, voltage }) => {
        set(
          produce((state) => {
            state.motor.motorVoltage = voltage;
            state.motor.motorPhase = phase;
          })
        );
      },

      setMotor_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.motor[key] = value;
          })
        );
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
      setHeadBox_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.headBox[key] = value;
          })
        );
      },

      setHeadBox_bool: ({ key, value }) => {
        set(
          produce((state) => {
            state.headBox[key] = value;
          })
        );
      },
    },

    roller: {
      getDiameter: () => String(get().generalSpec?.diameter ?? ''),
      rollerSpec: '',
      setRoller_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.roller[key] = value;
          })
        );
      },
    },

    slat: {
      material: '',
      surface: '',
      setSlat_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.slat[key] = value;
          })
        );
      },
    },

    guideRail: {
      material: '',
      guideRailThickness: '',
      surface: '',
      hasSilencingStrip: false,
      guideRailType: '',
      guideRail: '',
      getHasSilencingStrip: () => {
        const hasSilencingStrip = get().guideRail.hasSilencingStrip;

        return hasSilencingStrip ? '有' : '無';
      },
    },

    bottomBar: {
      material: '',
      bottomBarAngleIron: '',
      bottomBarPlate: '',
      bottomBar: '',
      surface: '',
    },

    sidePlate: {
      getBearingName: () => get().generalSpec?.bearingName ?? '',
      getSprocketWheelModel: () => get().generalSpec?.sprocketWheelModel ?? '',
      sidePlateDirection: '',
    },

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    //
    init: async ({ itemIdArr, contractProductItem, qty }) => {
      set(
        produce<Tworksheet>((state) => {
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
            ...state.basicSpec,
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
            ...state.ABCD,
            boxB: String(contractProductItem?.boxB ?? ''),
            boxD: String(contractProductItem?.boxD ?? ''),
          };

          state.motor = {
            ...state.motor,
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
            ...state.headBox,
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
            ...state.roller,
            rollerSpec: contractProductItem?.rollerSpec ?? '',
          };

          state.slat = {
            ...state.slat,
            material: componentList?.slat?.material ?? '',
            surface: componentList?.slat?.materialSurface ?? '',
          };

          state.guideRail = {
            ...state.guideRail,
            material: componentList?.guideRail?.material ?? '',
            guideRailThickness: String(contractProductItem?.guideRailThickness ?? ''),
            surface: componentList?.guideRail?.materialSurface ?? '',
            hasSilencingStrip: !!contractProductItem?.hasSilencingStrip,
            guideRailType: contractProductItem?.guideRailType ?? '',
            guideRail: contractProductItem?.guideRail ?? '',
            getHasSilencingStrip: state.guideRail.getHasSilencingStrip,
          };

          state.bottomBar = {
            ...state.bottomBar,
            material: componentList?.bottomBar?.material ?? '',
            bottomBarAngleIron: String(contractProductItem?.bottomBarAngleIron ?? ''),
            bottomBarPlate: contractProductItem?.bottomBarPlate ?? '',
            bottomBar: contractProductItem?.bottomBar ?? '',
            surface: componentList?.bottomBar.materialSurface ?? '',
          };

          state.sidePlate = {
            ...state.sidePlate,
            sidePlateDirection: contractProductItem?.sidePlateDirection ?? '',
          };

          //
          //
        })
      ); // set

      if (contractProductItem) {
        const generalSpec = await get().reqGeneralSpec();

        generalSpec.bearingHousingSize = contractProductItem.bearingHousingSize ?? -1;
        generalSpec.bearingHousingTotalLength = Number(contractProductItem.bearingHousingTotalLength ?? -1);
        generalSpec.bearingInnerDiameter = contractProductItem.bearingInnerDiameter ?? '';
        generalSpec.bearingName = contractProductItem.bearingName ?? '';
        // generalSpec.defaultMotorIndex = contractProductItem.defaultMotorIndex;
        // generalSpec.density = contractProductItem.density;
        generalSpec.diameter = Number(contractProductItem.diameter ?? 0);
        generalSpec.gapA = Number(contractProductItem.gapA);
        generalSpec.gapC = Number(contractProductItem.gapC);
        // generalSpec.motors = contractProductItem.motors;
        generalSpec.gearNumber = contractProductItem.gearNumber ?? '';
        generalSpec.sprocketWheelModel = contractProductItem.sprocketWheelModel ?? '';
        generalSpec.sprocketWheelTeethNumber = contractProductItem.sprocketWheelTeethNumber ?? '';
        generalSpec.sprocketWheelChains = Number(contractProductItem.sprocketWheelChains ?? 0);
        generalSpec.weight = Number(contractProductItem.weight ?? 0);
        generalSpec.slatLength = Number(contractProductItem.slatLength ?? 0);
        generalSpec.guideRailLength = Number(contractProductItem.guideRailLength ?? 0);
        generalSpec.headBoxLength = Number(contractProductItem.headBoxLength ?? 0);
        generalSpec.thickness = contractProductItem.thickness ?? '';

        set(
          produce((state) => {
            state.generalSpec = generalSpec;
          })
        );
      }
    }, // init
    //
    //
    setDoorModelInfo: (doorModelInfo) =>
      set(
        produce((state) => {
          state.doorModelInfo = doorModelInfo;
          state.basicSpec.doorModelName = doorModelInfo?.name ?? '';
        })
      ),

    getOptions_material: () => {
      const optiions_material = get().doorModelInfo?.slatMaterials.map((item) => {
        return {
          value: item.name,
          label: item.name,
        };
      });

      return optiions_material ?? [];
    },

    getOptions_bottomBarAngleIronAndPlate: () => {
      const basicSpec = get().basicSpec;
      const doorModelName = basicSpec?.doorModelName as keyof typeof lookup_options_bottomBarAngleIronAndPlate;

      if (!doorModelName) {
        return {
          options_angleIron: [],
          options_plate: [],
        };
      }

      const { angleIron, plate } = lookup_options_bottomBarAngleIronAndPlate[doorModelName];

      return {
        options_angleIron: angleIron() ?? [],
        options_plate: plate() ?? [],
      };
    },

    //
    // ---------------------------------------------------------------------

    reqGeneralSpec: async () => {
      const generalSpec = await apiGetProdCalcGeneralSpec({
        modelName: get().basicSpec.doorModelName as TdoorModel,
        fullWidth: get().getFullWidth_mm(),
        height: get().getHeight_mm(),
        isAntiTyphoon: get().basicSpec.isAntiTyphoon,
      });

      return generalSpec;
    },

    update_generalSpec: async () => {
      const generalSpec = await get().reqGeneralSpec();

      set(
        produce((state) => {
          state.generalSpec = generalSpec;
        })
      );
      get().update_availableComponents();
    },

    // _________________________________________________________________
    update_availableComponents: async () => {
      const generalSpec = get().generalSpec;
      const basicSpec = get().basicSpec;

      if (!generalSpec) {
        return alert('執行update_availableComponents時generalSpec為undefined');
      }

      const avalibleComponents = await apiGetProdAvailableComponents({
        modelName: basicSpec.doorModelName as TdoorModel,
        weight: generalSpec.weight,
        isAntiTyphoon: basicSpec.isAntiTyphoon,
        rollerDiameter: generalSpec.diameter,
      });

      set(
        produce((state) => {
          state.avalibleComponents = avalibleComponents;
        })
      );
    },

    // ---------------------------------------------------------------------

    // ________________________________________________________________________
    calcData: async () => {
      await get().update_generalSpec();
    },

    // ---------------------------------------------------------------------

    // ___________________________________________________________

    setGuideRail_str: ({ key, value }) => {
      set(
        produce((state) => {
          state.guideRail[key] = value;
        })
      );
    },

    setGuideRail_hasSilencingStrip: (value) => {
      set(
        produce((state) => {
          state.guideRail.hasSilencingStrip = value;
        })
      );
    },

    // ___________________________________________________________

    setBottomBar_str: ({ key, value }) => {
      set(
        produce((state) => {
          state.bottomBar[key] = value;
        })
      );
    },

    // ___________________________________________________________

    setSidePlate_str: ({ key, value }) => {
      set(
        produce((state) => {
          state.sidePlate[key] = value;
        })
      );
    },

    // ---------------------------------------------------------------------

    getFullWidth_mm: () => {
      return new Decimal(get().basicSpec.fullWidth || 0).mul(1000).toNumber();
    },

    getWG_mm: () => {
      return new Decimal(get().basicSpec.WG || 0).mul(1000).toNumber();
    },

    getHeight_mm: () => {
      return new Decimal(get().basicSpec.height || 0).mul(1000).toNumber();
    },

    // ---------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------

    //
  }) // set get
);

// =====================================================================
export { useWorksheet };
