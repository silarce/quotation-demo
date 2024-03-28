import { useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  TdoorMotorDto,
  TdoorGeneralSpecsMotorDto,
  TdoorRollerDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { checkIsFloat } from 'js/utils/checkValue';
import { lookup_motorPhase } from 'config/product/lookup';

import {
  lookup_options_bottomBarAngleIronAndPlate,
  lookup_horsePowerToToptions,
} from 'js/utils/options/productOptions';

import {
  //
  apiGetProdDoorModels,
  apiGetProdCalcGeneralSpec,
  apiGetProdAvailableComponents,
} from 'js/api/api_product';

// =====================================================================

// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做
// component的過濾與取得bom資料晚點記得要做

// =====================================================================

type Tworksheet = {
  readonly contractProductItem_ori: TquotationProductItemDto | undefined;
  doorModelInfoList: { [key: string]: TdoorModelInfoDto } | undefined;
  doorModelInfo: TdoorModelInfoDto | undefined;
  componentList: { [key in TdoorComponentType]: TquotationProductComponentDto } | undefined;
  accessories: TquotationProductAccessoryDto[];

  generalSpec: TdoorGeneralSpecsDto | undefined;
  //
  avalibleComponents: TdoorComponentListDto | undefined;
  // options_accessories: Toption[];
  originalAccessories: TquotationProductAccessoryDto[];
  //
  itemIdArr: string[];
  qty: number;
  isAntiTyphoonLock: boolean;
  shouldCalcData: boolean;
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

    setBasicSpec_itemName: (props: { key: 'itemName'; value: string }) => void;
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
      key:
        | 'horsepower'
        | 'vendor'
        | 'electricMotorChainType'
        | 'hasMotorSupportStand'
        | 'motorLockBox'
        | 'electricMotorDirection';
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
    guideRailsOpening: string;
    guideRailG: number;

    getHasSilencingStrip: () => string;
    setGuideRail_str: (props: {
      key: //
      'material' | 'guideRailThickness' | 'surface' | 'guideRailType' | 'guideRail';
      value: string;
    }) => void;

    setGuideRail_hasSilencingStrip: (value: boolean) => void;
    setGuideRail: (props: {
      //
      guideRail: string;
      hasSilencingStrip: boolean;
      width: number;
      opening: string;
      thickness: string;
    }) => void;
  };

  bottomBar: {
    material: string;
    bottomBarAngleIron: string;
    bottomBarPlate: string;
    bottomBar: string;
    surface: string;
    setBottomBar_str: (props: {
      key: 'material' | 'bottomBarAngleIron' | 'bottomBarPlate' | 'bottomBar' | 'surface';
      value: string;
    }) => void;
  };

  sidePlate: {
    getBearingName: () => string;
    getSprocketWheelModel: () => string;
    sidePlateDirection: string;
    setSidePlate_str: (props: {
      key: 'bearingName' | 'sprocketWheelModel' | 'sidePlateDirection';
      value: string;
    }) => void;
  };
  //
  init: (props: {
    itemIdArr: Tworksheet['itemIdArr'];
    contractProductItem: Tworksheet['contractProductItem_ori'];
    qty: Tworksheet['qty'];
    originalAccessories: TquotationProductAccessoryDto[];
  }) => void;

  setDoorModelInfo: (doorModelInfo: TdoorModelInfoDto | undefined) => void;

  getOptions_material: () => Toption[];
  getOptions_bottomBarAngleIronAndPlate: () => {
    options_angleIron: Toption[];
    options_plate: Toption[];
  };

  getOptions_horsepower: () => Toption[];
  getOptions_motorVendor: () => Toption[];
  getOptions_electricSupply: () => Toption[];
  getOptions_headBoxThickness: () => Toption[];
  getOptions_diameter: () => Toption[];
  getOptions_guideRailThickness: () => Toption[];
  getOptions_guideRail: () => Toption[];
  getOptions_doorModelInfo: () => Toption[];
  getOptions_accessories: () => Toption[];

  // -----------------------------------------------------------------------------
  reqGeneralSpec: () => Promise<TdoorGeneralSpecsDto>;
  update_generalSpec: () => Promise<void>;

  update_availableComponents: () => Promise<void>;

  // -----------------------------------------------------------------------------
  calcData: () => Promise<void>;

  // -----------------------------------------------------------------------------

  getFullWidth_mm: () => number;
  getWG_mm: () => number;
  getHeight_mm: () => number;
  getFullHeight_mm: () => number;
  getAngleIronSize_mm: () => string;

  // -----------------------------------------------------------------------------

  setAccessories: (acceNameArr: string[]) => void;

  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  test: () => void;
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
    doorModelInfoList: undefined,
    doorModelInfo: undefined,
    componentList: undefined,
    accessories: [],
    generalSpec: undefined,
    // ---------------------------------------------------------------------
    avalibleComponents: undefined,
    originalAccessories: [],
    // ---------------------------------------------------------------------
    itemIdArr: [],
    qty: 0,
    isAntiTyphoonLock: true,
    shouldCalcData: false,
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
      setBasicSpec_itemName: ({ key, value }) => {
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
            state.shouldCalcData = true;
          })
        );
      },
      setBasicSpec_bool: ({ key, value }) => {
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec[key] = value;
              state.shouldCalcData = true;
            }
          })
        );
      },
      setBasicSpec_material: (str) => {
        set(
          produce((state) => {
            state.basicSpec.material = str;
            state.shouldCalcData = true;
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
        set(
          produce<Tworksheet>((state) => {
            state.generalSpec && (state.generalSpec.gapA = Number(value));
          })
        );
      },
      setGapC: (value) => {
        set(
          produce<Tworksheet>((state) => {
            state.generalSpec && (state.generalSpec.gapC = Number(value));
          })
        );
      },
      setBoxB: (value) => {
        set(
          produce((state) => {
            state.ABCD.boxB = value;
          })
        );
      },
      setBoxD: (value) => {
        set(
          produce((state) => {
            state.ABCD.boxD = value;
          })
        );
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
      guideRailsOpening: '',
      guideRailG: 0,

      getHasSilencingStrip: () => {
        const hasSilencingStrip = get().guideRail.hasSilencingStrip;

        return hasSilencingStrip ? '有' : '無';
      },
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
      setGuideRail: ({
        //
        guideRail,
        hasSilencingStrip,
        width,
        opening,
        thickness,
      }) => {
        set(
          produce<Tworksheet>((state) => {
            state.guideRail.guideRail = guideRail;
            state.guideRail.hasSilencingStrip = hasSilencingStrip;
            state.guideRail.guideRailsOpening = opening;
            state.guideRail.guideRailG = width;
            // state.guideRail.guideRailThickness = thickness;
          })
        );
      },
    },

    bottomBar: {
      material: '',
      bottomBarAngleIron: '',
      bottomBarPlate: '',
      bottomBar: '',
      surface: '',
      setBottomBar_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.bottomBar[key] = value;
          })
        );
      },
    },

    sidePlate: {
      getBearingName: () => get().generalSpec?.bearingName ?? '',
      getSprocketWheelModel: () => get().generalSpec?.sprocketWheelModel ?? '',
      sidePlateDirection: '',
      setSidePlate_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.sidePlate[key] = value;
          })
        );
      },
    },

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    //
    init: async ({ itemIdArr, contractProductItem, qty, originalAccessories }) => {
      const doorModelInfo = get().doorModelInfoList;

      if (!doorModelInfo) {
        const doorModelArr = await apiGetProdDoorModels();
        set(
          produce<Tworksheet>((state) => {
            state.doorModelInfoList = {};
            doorModelArr.forEach((doorModel) => {
              state.doorModelInfoList![doorModel.name] = doorModel;
            });
          })
        );
      }

      set(
        produce<Tworksheet>((state) => {
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

          if (contractProductItem?.doorModelName) {
            state.doorModelInfo = state.doorModelInfoList![contractProductItem?.doorModelName];
          }

          const accessories = contractProductItem?.accessories ?? [];

          // ____________________________________________________________________
          // ____________________________________________________________________
          state.itemIdArr = itemIdArr;
          state.qty = qty;
          state.contractProductItem_ori = contractProductItem;
          state.componentList = componentList;
          state.shouldCalcData = false;
          state.originalAccessories = originalAccessories;
          state.accessories = accessories;
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
            guideRailsOpening: contractProductItem?.guideRailsOpening ?? '',
            guideRailG: contractProductItem?.guideRailG ?? 0,
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
        get().update_availableComponents();
      }
    }, // init
    //
    //
    setDoorModelInfo: (doorModelInfo) => {
      set(
        produce((state) => {
          state.doorModelInfo = doorModelInfo;
          state.basicSpec.doorModelName = doorModelInfo?.name ?? '';

          // 除了SJ-302，防颱選項都要鎖住
          if (doorModelInfo?.name === 'SJ-302') {
            state.isAntiTyphoonLock = false;
          } else {
            state.isAntiTyphoonLock = true;
          }

          // SJ-312固定防颱
          if (doorModelInfo?.name === 'SJ-312') {
            state.basicSpec.isAntiTyphoon = true;
            // 非SJ-312且非SJ-302，固定不防颱
          } else if (doorModelInfo?.name !== 'SJ-302') {
            state.basicSpec.isAntiTyphoon = false;
          }

          state.shouldCalcData = true;
        })
      );
    },

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

    getOptions_horsepower: () => getOptions_horsepower(get().avalibleComponents?.motors ?? []),

    getOptions_motorVendor: () => {
      const motors = get().avalibleComponents?.motors ?? [];
      const vendors = motors.map((motor) => motor.motorVendor);
      const theVendors = _.uniq(vendors).filter((vendor) => !!vendor) as string[];
      const options = theVendors.map((vendor) => {
        return {
          value: vendor,
          label: vendor,
        };
      });

      return options;
    },

    getOptions_electricSupply: () => getOptions_electricSupply(get().avalibleComponents?.motors ?? []),
    getOptions_headBoxThickness: () => getOptions_headBoxThickness(get().avalibleComponents?.headBoxes ?? []),
    getOptions_diameter: () => getOptions_diameter(get().avalibleComponents?.rollers ?? []),

    getOptions_guideRailThickness: () => {
      const guideRails = get().avalibleComponents?.guideRails ?? [];
      let thicknessArr = guideRails.map((guideRail) => guideRail.thickness);
      thicknessArr = _.uniq(thicknessArr);
      const options = thicknessArr.map((thickness) => {
        return {
          value: thickness ?? '',
          label: thickness + 'T',
        };
      });

      return options;
    },

    getOptions_guideRail: () => {
      const doorModelInfo = get().doorModelInfo;
      const guideRails = doorModelInfo?.guideRails ?? [];

      const options = guideRails.map((item) => {
        const { hasSilencingStrip, imgSrc, opening, thickness, width, withHook } = item;

        return {
          value: item.imgSrc,
          label: '',
          icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
          hasSilencingStrip,
          opening,
          thickness,
          width,
          withHook,
        };
      });

      return options;
    },

    getOptions_doorModelInfo: () => {
      const doorModelInfoList = get().doorModelInfoList;
      const doorModelInfoArr = Object.values(doorModelInfoList ?? {});
      const options = doorModelInfoArr.map((doorModel) => {
        const { name } = doorModel;

        return {
          label: name,
          value: name,
          obj: doorModel,
        };
      });

      return options;
    },

    getOptions_accessories: () => {
      const originalAccessories = get().originalAccessories;
      const options = originalAccessories.map((acce) => {
        return {
          value: acce.name,
          label: acce.name,
        };
      });

      return options;
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
        produce<Tworksheet>((state) => {
          state.generalSpec = generalSpec;
        })
      );
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

    calcData: async () => {
      await get().update_generalSpec();

      set(
        produce((state) => {
          const { defaultHp, defaultVendor, defaultBoxB, defaultBoxD } = produceMotor(
            state.generalSpec.motors[state.generalSpec.defaultMotorIndex]
          );

          state.motor.horsepower = defaultHp;
          state.motor.vendor = defaultVendor;
          state.ABCD.boxB = String(defaultBoxB ?? '');
          state.ABCD.boxD = String(defaultBoxD ?? '');
        })
      );

      await get().update_availableComponents();
      const option_electricSupply = get().getOptions_electricSupply()[0];
      const option_headBoxThickness = get().getOptions_headBoxThickness()[0];
      const option_guideRailThickness = get().getOptions_guideRailThickness()[0];

      set(
        produce((state) => {
          state.motor.motorVoltage = (option_electricSupply.voltage ?? '') as string;
          state.motor.motorPhase = (option_electricSupply.phase ?? '') as string;
          state.headBox.headBoxThickness = option_headBoxThickness.value;
          state.guideRail.guideRailThickness = option_guideRailThickness.value;

          state.shouldCalcData = false;
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

    // 全高
    getFullHeight_mm: () => {
      const height = get().getHeight_mm();
      const boxB = Number(get().ABCD.boxB);

      return new Decimal(height).add(boxB).toNumber();
    },

    getAngleIronSize_mm: () => {
      const gapA = get().ABCD.getGapA() || 0;
      const gapC = get().ABCD.getGapC() || 0;
      const WG = get().getWG_mm() || 0;

      return new Decimal(gapA).add(gapC).add(WG).minus(10).toString();
    },

    // ---------------------------------------------------------------------

    setAccessories: (acceNameArr) => {
      const originalAccessories = get().originalAccessories;

      const newAccessories: TquotationProductAccessoryDto[] = [];

      acceNameArr.forEach((name) => {
        const target = originalAccessories.find((acce) => acce.name === name);

        if (target) {
          newAccessories.push(target);
        }
      });

      set(
        produce((state) => {
          state.accessories = newAccessories;
        })
      );
    },

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------

    test: () => {
      console.log(get());
    },
    // ---------------------------------------------------------------------
    //
  }) // set get
);

// =====================================================================

// 取得馬力選項
const getOptions_horsepower = (motorArr: TdoorMotorDto[]) => {
  let horseposerArr = motorArr.map((motor) => {
    if (motor.horsePower === '1.5') {
      return '1 1/2HP';
    }

    return motor.horsePower;
  });

  horseposerArr = _.uniq(horseposerArr);

  let options = horseposerArr.map((item) => {
    if (item === '1.5HP') {
      item = '1 1/2HP';
    }

    const option = lookup_horsePowerToToptions[item as keyof typeof lookup_horsePowerToToptions];

    if (!option) {
      alert(`options_horsepower轉換錯誤，item:${item}`);
    }

    return option;
  });

  options = _.sortBy(options, 'hpValue');

  return options;
};

// 取得電供選項
const getOptions_electricSupply = (motorArr: TdoorMotorDto[]) => {
  let isValtage220 = false;
  let isValtage380 = false;
  let isPhase1 = false;
  let isPhase3 = false;
  motorArr.forEach((motor) => {
    const { voltage, phase } = motor;
    voltage === 220 && (isValtage220 = true);
    voltage === 380 && (isValtage380 = true);
    phase === 1 && (isPhase1 = true);
    phase === 3 && (isPhase3 = true);
  });

  const options: Toption[] = [];
  isValtage220 && isPhase1 && options.push({ value: '單相 220V', label: '單相 220V', voltage: '220', phase: '1' });
  isValtage220 && isPhase3 && options.push({ value: '三相 220V', label: '三相 220V', voltage: '220', phase: '3' });
  isValtage380 && isPhase3 && options.push({ value: '三相 380V', label: '三相 380V', voltage: '380', phase: '3' });

  return options;
};

const getOptions_headBoxThickness = (headBoxArr: TdoorComponentListDto['headBoxes']) => {
  let thicknessArr = headBoxArr.map((headBox) => headBox.thickness);
  thicknessArr = _.uniq(thicknessArr);
  const options = thicknessArr.map((thickness) => {
    return {
      value: thickness,
      label: thickness + 'T',
    };
  });

  return options;
};

const getOptions_diameter = (rollerArr: TdoorRollerDto[]) => {
  let diameterArr = rollerArr.map((roller) => roller.diameter);
  diameterArr = _.uniq(diameterArr);
  const options = diameterArr.map((diameter) => {
    return {
      value: diameter,
      label: diameter,
    };
  });

  return options;
};

// 取得各項馬達預設值
const produceMotor = (defaultMotor: TdoorGeneralSpecsMotorDto) => {
  const boxList = defaultMotor.box;

  const defaultVendor = !boxList ? '東元' : '東元' in boxList || 'default' in boxList ? '東元' : '大同';

  const box = boxList?.東元 || boxList?.default || boxList?.大同;

  const { boxB, boxD } = box ?? {};
  let defaultHp = defaultMotor.hp;

  if (defaultHp === '1.5') {
    defaultHp = '1 1/2';
  }

  return {
    defaultHp,
    defaultVendor,
    defaultBoxB: String(boxB ?? ''),
    defaultBoxD: String(boxD ?? ''),
  };
};

// =====================================================================
export { useWorksheet };
