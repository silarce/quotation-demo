// getUpdateWorkSheetItemArr

import _ from 'lodash';
import Decimal from 'decimal.js';
import { AxiosError } from 'axios';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { optionsCreator_motorVender, optionsCreator_horsePower } from 'js/utils/options/productOptions';

import { create } from 'zustand';
// 使用 immer middleware會使typescript不正確的判斷型別，導致型別錯誤(實際上沒錯)
// import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';

import { calcProductArea, calcProductVolume } from 'js/utils/product/calc';

// api
import {
  TpcgsPrams,
  //
  apiGetProdDoorModels,
  apiGetProdCalcGeneralSpec,
  apiGetProdAvailableComponents,
  apiGetProdCalcDetailSpec,
  apiPostProdGenerateDoorProductBom,
} from 'js/api/api_product';

// type
import {
  //
  TquotationProductItemDto,
  TupdateContractProductItemDto,
  TfloorLocations,
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
  TdoorMaterialDto,
  TcreateQuotationProductComponentDto,
  TgenerateDoorProductBomDto,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto_ComponentInfo,
  TmaterialSurface,
  TdoorProductBomDto,
  TupdateQuotationProductComponentDto,
} from 'js/api/dtoTypes';

// utils
import { Toption } from 'js/utils/options/options';
import {
  lookup_options_bottomBarAngleIronAndPlate,
  lookup_horsePowerToToptions,
  optionsCreator_quoteType,
  lookup_sprocketWheelModel_gearNumberAndChainQty,
  optionsCreator_componentMaterial_01,
} from 'js/utils/options/productOptions';
import { lookup_motorPhase } from 'config/product/lookup';

import {
  filter_slats,
  filter_bottomBars,
  filter_guideRails,
  filter_sidePlates,
  filter_rollers,
  // filter_motors,
  filter_motors_worksheet,
  filter_motorAccessories,
  filter_headBoxes,
  lookup_errorTip,
} from 'hooks/quotation/componentFilters';

// =====================================================================
const options_doorType = optionsCreator_quoteType();
// =====================================================================

// region TYPE

type TdoorComponentType_old = Extract<
  TdoorComponentType,
  'slat' | 'bottomBar' | 'guideRail' | 'sidePlate' | 'roller' | 'motor' | 'motorAccessories' | 'headBox'
>;

type TupdateQuotationProductComponentDto_old = Omit<TupdateQuotationProductComponentDto, 'type'> & {
  type: TdoorComponentType_old;
};

type TquotationProductComponentDto_old = Omit<TquotationProductComponentDto, 'type'> & {
  type: TdoorComponentType_old;
};

type TcreateQuotationProductComponentDto_old = Omit<TcreateQuotationProductComponentDto, 'type'> & {
  type: TdoorComponentType_old;
};

type TquotationProductItemDto_old = Omit<TquotationProductItemDto, 'components'> & {
  components: TquotationProductComponentDto_old[];
};

type TavalibleComponentIdList = {
  slat: string;
  bottomBar: string;
  guideRail: string;
  sidePlate: string;
  roller: string;
  motor: string;
  motorAccessories: string;
  headBox: string;
};

// type TcreateComponentList = {
//   slat: TcreateQuotationProductComponentDto;
//   bottomBar: TcreateQuotationProductComponentDto;
//   guideRail: TcreateQuotationProductComponentDto;
//   sidePlate: TcreateQuotationProductComponentDto;
//   roller: TcreateQuotationProductComponentDto;
//   motor: TcreateQuotationProductComponentDto;
//   motorAccessories: TcreateQuotationProductComponentDto;
//   headBox: TcreateQuotationProductComponentDto;
// };
type TcreateComponentList = {
  slat: TcreateQuotationProductComponentDto_old;
  bottomBar: TcreateQuotationProductComponentDto_old;
  guideRail: TcreateQuotationProductComponentDto_old;
  sidePlate: TcreateQuotationProductComponentDto_old;
  roller: TcreateQuotationProductComponentDto_old;
  motor: TcreateQuotationProductComponentDto_old;
  motorAccessories: TcreateQuotationProductComponentDto_old;
  headBox: TcreateQuotationProductComponentDto_old;
};

type Tworksheet = {
  contractProductItem_ori: TquotationProductItemDto_old | undefined;
  contractProductItemArr_ori: TquotationProductItemDto_old[] | undefined;
  doorModelInfoList: { [key: string]: TdoorModelInfoDto } | undefined;
  doorModelInfo: TdoorModelInfoDto | undefined;
  // componentList: { [key in TdoorComponentType]: TquotationProductComponentDto } | undefined;
  componentList: { [key in TdoorComponentType_old]: TupdateQuotationProductComponentDto_old } | undefined;
  accessories: TquotationProductAccessoryDto[];

  // 從後端取得，在init與calcData取得
  // 在init，若為特殊門，會帶入空的generalSpec
  generalSpec: TdoorGeneralSpecsDto | undefined;

  // 從後端取得的avalibleComponents，用於產生options以及在calcData_2過濾出適配的component
  // 會在init與calcData取得
  avalibleComponents: TdoorComponentListDto | undefined;

  // options_accessories: Toption[];
  originalAccessories: TquotationProductAccessoryDto[];
  //
  worksheetId: string;
  itemIdArr: string[];
  qty: number;
  // isAntiTyphoonLock: boolean;
  getIsAntiTyphoonLock: () => boolean;

  getIsSpecialProd: () => boolean;

  shouldCalcData: boolean;
  shouldCalcData2: boolean;
  //

  calcTarget: 'fullWidth' | 'WG';
  setCalcTarget: (value: 'fullWidth' | 'WG') => void;
  // calcFullWidth: () => `${number}`;
  // calcWG: () => `${number}`;
  //
  locationArea: string;
  setLocationArea: (value: string) => void;
  floor: string;
  setFloor: (value: string) => void;
  serialNumberArr: string[];
  // setSerialNumberArr: (value: string[]) => void;
  setSerialNumber: (props: { index: number; value: string }) => void;

  //
  basicSpec: {
    quoteType: string;
    itemName: string;
    doorModelName: string;
    qty: string;
    fullWidth: string;
    WG: string;
    height: string;
    material: string;
    isAntiTyphoon: boolean;
    area: string;
    volume: string; // 才數

    setBasicSpec_quoteType: (value: string) => void;
    setBasicSpec_doorModelName: (value: string) => void;
    setBasicSpec_itemName: (value: string) => void;
    setBasicSpec_material: (str: string) => void;
    setBasicSpec_bool: (props: { key: 'isAntiTyphoon'; value: boolean }) => void;
    setBasicSpec_fullWidth: (value: string) => void;
    setBasicSpec_WG: (value: string) => void;
    setBasicSpec_height: (value: string) => void;
    setBasicSpec_fullWidth_simple: (value: string) => void;
    setBasicSpec_WG_simple: (value: string) => void;
  };

  ABCD: {
    getGapA: () => string;
    getGapC: () => string;
    boxB: string; // 單位為mm
    boxD: string; // 單位為mm
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

    // 捲箱前遮
    headBoxCover: NonNullable<TquotationProductItemDto_old['headBoxCover']>;
    // 捲箱上蓋
    headBoxTopCover: 'true' | 'false';
    // 是否有檔輪
    hasWheel: 'true' | 'false';
    // 捲箱sizeX
    headBoxSizeX: `${number}` | '';
    // 捲箱sizeY
    headBoxSizeY: `${number}` | '';
    // 捲箱sizeM
    headBoxSizeM: `${number}` | '';
    // 捲箱sizeN
    headBoxSizeN: `${number}` | '';
    // 捲箱sizeO
    headBoxSizeO: `${number}` | '';
    // 捲箱sizeP
    headBoxSizeP: `${number}` | '';
    // 捲箱sizeQ
    headBoxSizeQ: `${number}` | '';

    getIsIntegratedHeadBox: () => string;
    setHeadBox_str: (props: {
      key: Exclude<keyof Tworksheet['headBox'], 'isIntegratedHeadBox' | 'getIsIntegratedHeadBox'>;
      value: string;
    }) => void;

    setHeadBox_bool: (props: { key: 'isIntegratedHeadBox'; value: boolean }) => void;

    setHeadBoxCover: (value: Tworksheet['headBox']['headBoxCover']) => void;
    setBoxTopCover: (value: 'true' | 'false') => void;
    setHasWheel: (value: 'true' | 'false') => void;
    setBoxXYMNOPQ: (props: {
      key:
        | 'headBoxSizeX'
        | 'headBoxSizeY'
        | 'headBoxSizeM'
        | 'headBoxSizeN'
        | 'headBoxSizeO'
        | 'headBoxSizeP'
        | 'headBoxSizeQ';
      value: `${number}` | '';
    }) => void;
  };

  roller: {
    getDiameter: () => string;
    rollerSpec: string;
    setDiameter: (value: string) => void;
  };

  slat: {
    material: string;
    surface: string;
    setSlat_str: (props: { key: 'material' | 'surface'; value: string }) => void;
    slatCount: string;
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
    setSidePlate_sidePlateDirection: (value: string) => void;
    setBearingName: (value: string) => void;
    setSprocketWheelModel: (value: string) => void;
  };

  other: {
    isULGuideRail: boolean;
    setIsULGuideRail: (value: boolean) => void;
  };

  //
  init: (props: {
    worksheetId: string;
    itemIdArr: Tworksheet['itemIdArr'];
    contractProductItem: Tworksheet['contractProductItem_ori'];
    contractProductItemArr: Tworksheet['contractProductItemArr_ori'];
    qty: Tworksheet['qty'];
    originalAccessories: TquotationProductAccessoryDto[];
  }) => void;

  setDoorModelInfo: (doorModelInfo: TdoorModelInfoDto | undefined) => void;

  getOptions_material: () => Toption[];
  getOptions_material_stable: () => Toption[];
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
  reqGeneralSpec: (calcTarget?: 'fullWidth' | 'WG') => Promise<TdoorGeneralSpecsDto | undefined>;
  update_generalSpec: () => Promise<void>;
  update_availableComponents: () => Promise<void>;

  updateSlatCount: () => Promise<void>;

  // -----------------------------------------------------------------------------
  calcData: () => Promise<void>;
  calcData_2: () => Promise<void>;

  // -----------------------------------------------------------------------------

  getFullWidth_mm: () => number;
  getWG_mm: () => number;
  getHeight_mm: () => number;
  getFullHeight_mm: () => number;
  getAngleIronSize_mm: () => string;

  // -----------------------------------------------------------------------------

  setAccessories: (acceNameArr: string[]) => void;

  // -----------------------------------------------------------------------------

  getUpdateWorkSheetItemArr: () => TupdateContractProductItemDto[] | null;
  getFloorLocations: () => TfloorLocations[] | null;

  // -----------------------------------------------------------------------------
  //
};

// endregion

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
// MARK: useWorksheet
const useWorksheet = create<Tworksheet>(
  (set, get) => ({
    contractProductItem_ori: undefined,
    contractProductItemArr_ori: undefined,
    doorModelInfoList: undefined,
    doorModelInfo: undefined,
    componentList: undefined,
    accessories: [],
    generalSpec: undefined,
    // ---------------------------------------------------------------------
    avalibleComponents: undefined,
    originalAccessories: [],
    // ---------------------------------------------------------------------
    worksheetId: '',
    itemIdArr: [],
    qty: 0,
    // isAntiTyphoonLock: true,
    shouldCalcData: false,
    shouldCalcData2: false,

    getIsSpecialProd: () => {
      const isSpecial = !options_doorType.some((option) => option.value === get().basicSpec.quoteType);

      return isSpecial;
    },

    //
    calcTarget: 'fullWidth',
    setCalcTarget: (value) => {
      set(
        produce((state) => {
          state.calcTarget = value;
          // state.basicSpec.fullWidth = '';
          // state.basicSpec.WG = '';
        })
      );
    },

    // ---------------------------------------------------------------------
    locationArea: '',
    setLocationArea: (value) => {
      set(
        produce((state) => {
          state.locationArea = value;
        })
      );
    },

    floor: '',
    setFloor: (value) => {
      set(
        produce((state) => {
          state.floor = value;
        })
      );
    },
    serialNumberArr: [],
    // setSerialNumberArr: (serialNumberArr) => {
    //   set(
    //     produce((state) => {
    //       state.serialNumberArr = serialNumberArr;
    //     })
    //   );
    // },
    setSerialNumber: ({ index, value }) => {
      set(
        produce((state) => {
          state.serialNumberArr[index] = value;
        })
      );
    },

    basicSpec: {
      quoteType: '',
      itemName: '',
      doorModelName: '',
      qty: '0',
      fullWidth: '',
      WG: '',
      height: '',
      material: '',
      isAntiTyphoon: false,
      area: '',
      volume: '',

      setBasicSpec_quoteType: (value) => {
        get().setDoorModelInfo(undefined);
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec.quoteType = value;
              state.basicSpec.material = '';
              state.shouldCalcData = true;
              state.shouldCalcData2 = true;
            }
          })
        );
      },
      setBasicSpec_doorModelName: (value) => {
        set(
          produce<Tworksheet>((state) => {
            state.basicSpec.doorModelName = value;
            state.shouldCalcData = true;
            state.shouldCalcData2 = true;
          })
        );
        console.log(get().basicSpec);
      },
      setBasicSpec_itemName: (value) => {
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec.itemName = value;
            }
          })
        );
      },
      setBasicSpec_height: (value) => {
        set(
          produce((state) => {
            state.basicSpec.height = value;
            state.shouldCalcData = true;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBasicSpec_bool: ({ key, value }) => {
        set(
          produce((state) => {
            if (state.basicSpec) {
              state.basicSpec[key] = value;
              state.shouldCalcData = true;
              state.shouldCalcData2 = true;
            }
          })
        );
      },
      setBasicSpec_material: (str) => {
        set(
          produce((state) => {
            state.basicSpec.material = str;
            state.shouldCalcData = true;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBasicSpec_fullWidth: (str) => {
        set(
          produce((state) => {
            state.basicSpec.fullWidth = str;

            if (str && !state.getIsSpecialProd()) {
              state.basicSpec.WG = '';
            }

            state.shouldCalcData = true;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBasicSpec_WG: (str) => {
        set(
          produce((state) => {
            state.basicSpec.WG = str;

            if (str && !state.getIsSpecialProd()) {
              state.basicSpec.fullWidth = '';
            }

            state.shouldCalcData = true;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBasicSpec_fullWidth_simple: (str) => {
        set(
          produce((state) => {
            state.basicSpec.fullWidth = str;
          })
        );
      },
      setBasicSpec_WG_simple: (str) => {
        set(
          produce((state) => {
            state.basicSpec.WG = str;
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
            state.shouldCalcData2 = true;

            const calcTarget = state.calcTarget;

            if (calcTarget === 'fullWidth') {
              state.basicSpec.WG = calcWG_M({
                fullWidth_M: Number(state.basicSpec.fullWidth),
                gapA: state.generalSpec?.gapA ?? 0,
                gapC: state.generalSpec?.gapC ?? 0,
              }).toString();
            } else if (calcTarget === 'WG') {
              state.basicSpec.fullWidth = calcFullWidth_M({
                WG: Number(state.basicSpec.WG),
                gapA: state.generalSpec?.gapA ?? 0,
                gapC: state.generalSpec?.gapC ?? 0,
              }).toString();
            }
          })
        );
      },
      setGapC: (value) => {
        set(
          produce<Tworksheet>((state) => {
            state.generalSpec && (state.generalSpec.gapC = Number(value));
            state.shouldCalcData2 = true;

            const calcTarget = state.calcTarget;

            if (calcTarget === 'fullWidth') {
              state.basicSpec.WG = calcWG_M({
                fullWidth_M: Number(state.basicSpec.fullWidth),
                gapA: state.generalSpec?.gapA ?? 0,
                gapC: state.generalSpec?.gapC ?? 0,
              }).toString();
            } else if (calcTarget === 'WG') {
              state.basicSpec.fullWidth = calcFullWidth_M({
                WG: Number(state.basicSpec.WG),
                gapA: state.generalSpec?.gapA ?? 0,
                gapC: state.generalSpec?.gapC ?? 0,
              }).toString();
            }
          })
        );
      },
      setBoxB: async (value) => {
        set(
          produce((state) => {
            state.ABCD.boxB = value;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBoxD: (value) => {
        set(
          produce((state) => {
            state.ABCD.boxD = value;
            state.shouldCalcData2 = true;
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
            state.shouldCalcData2 = true;
          })
        );
      },

      setMotor_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.motor[key] = value;
            state.shouldCalcData2 = true;
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

      headBoxCover: '無' as Tworksheet['headBox']['headBoxCover'],
      headBoxTopCover: 'false',
      hasWheel: 'false',
      headBoxSizeX: '',
      headBoxSizeY: '',
      headBoxSizeM: '',
      headBoxSizeN: '',
      headBoxSizeO: '',
      headBoxSizeP: '',
      headBoxSizeQ: '',

      getIsIntegratedHeadBox: () => {
        const isIntegratedHeadBox = get().headBox.isIntegratedHeadBox;

        return isIntegratedHeadBox ? '一體式捲箱' : '捲箱加機箱';
      },
      setHeadBox_str: ({ key, value }) => {
        set(
          produce((state) => {
            state.headBox[key] = value;
            state.shouldCalcData2 = true;
          })
        );
      },

      setHeadBox_bool: ({ key, value }) => {
        set(
          produce((state) => {
            state.headBox[key] = value;
            state.shouldCalcData2 = true;
          })
        );
      },

      setHeadBoxCover: (value) => {
        set(
          produce((state) => {
            state.headBox.headBoxCover = value;
          })
        );
      },

      setBoxTopCover: (value) => {
        set(
          produce((state) => {
            state.headBox.headBoxTopCover = value;
          })
        );
      },

      setHasWheel: (value) => {
        set(
          produce((state) => {
            state.headBox.hasWheel = value;
          })
        );
      },

      setBoxXYMNOPQ: ({ key, value }) => {
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
      setDiameter: (value) => {
        const value_num = Number(value);

        if (Number.isNaN(value_num)) {
          return;
        }

        set(
          produce<Tworksheet>((state) => {
            if (state.generalSpec) {
              state.generalSpec.diameter = value_num;
              state.shouldCalcData2 = true;
            }
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
            state.shouldCalcData2 = true;
          })
        );
      },
      slatCount: '',
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
            state.shouldCalcData2 = true;
          })
        );
      },
      setGuideRail_hasSilencingStrip: (value) => {
        set(
          produce((state) => {
            state.guideRail.hasSilencingStrip = value;
            state.shouldCalcData2 = true;
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

            state.shouldCalcData2 = true;
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
            state.shouldCalcData2 = true;
          })
        );
      },
    },

    sidePlate: {
      getBearingName: () => get().generalSpec?.bearingName ?? '',
      getSprocketWheelModel: () => get().generalSpec?.sprocketWheelModel ?? '',
      sidePlateDirection: '',
      setSidePlate_sidePlateDirection: (value) => {
        set(
          produce((state) => {
            state.sidePlate.sidePlateDirection = value;
            state.motor['electricMotorDirection'] = value;
            state.shouldCalcData2 = true;
          })
        );
      },
      setBearingName: (value) => {
        set(
          produce((state) => {
            if (state.generalSpec) {
              state.generalSpec.bearingName = value;
              state.shouldCalcData2 = true;
            }
          })
        );
      },
      setSprocketWheelModel: (value) => {
        set(
          produce<Tworksheet>((state) => {
            if (state.generalSpec) {
              if (value in lookup_sprocketWheelModel_gearNumberAndChainQty) {
                const key = value as keyof typeof lookup_sprocketWheelModel_gearNumberAndChainQty;
                const { gearNumber, sprocketWheelChains } = lookup_sprocketWheelModel_gearNumberAndChainQty[key];

                state.generalSpec.gearNumber = gearNumber;
                state.generalSpec.sprocketWheelChains = sprocketWheelChains;

                state.motor['electricMotorChainType'] =
                  lookup_sprocketWheelChains_electricMotorChainType[sprocketWheelChains] ?? '';
              } else {
                state.generalSpec.gearNumber = '';
                state.generalSpec.sprocketWheelChains = 0;
                state.motor['electricMotorChainType'] = '';
              }

              state.generalSpec.sprocketWheelModel = value;

              state.shouldCalcData2 = true;
            }
          })
        );
      },
    },

    other: {
      isULGuideRail: false,
      setIsULGuideRail: (value) => {
        set(
          produce((state) => {
            state.other.isULGuideRail = value;
            state.shouldCalcData2 = true;
          })
        );
      },
    },

    // ---------------------------------------------------------------------
    // ---------------------------------------------------------------------
    //
    init: async ({
      //
      worksheetId,
      itemIdArr,
      contractProductItem,
      contractProductItemArr,
      qty,
      originalAccessories,
    }) => {
      const doorModelInfoList = get().doorModelInfoList;

      if (!doorModelInfoList) {
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

      if (contractProductItemArr) {
        const serialNumberArr = contractProductItemArr.map((item) => item.serialNumber || '');
        set(
          produce((state) => {
            state.serialNumberArr = serialNumberArr;
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
          state.worksheetId = worksheetId;
          state.itemIdArr = itemIdArr;
          state.qty = qty;
          state.contractProductItem_ori = contractProductItem;
          state.contractProductItemArr_ori = contractProductItemArr;
          state.componentList = componentList;
          state.shouldCalcData = false;
          state.shouldCalcData2 = false;
          state.originalAccessories = originalAccessories;
          state.accessories = accessories;
          // ____________________________________________________________________
          // ____________________________________________________________________
          state.basicSpec = {
            ...state.basicSpec,
            quoteType: contractProductItem?.quoteType ?? '',
            itemName: contractProductItem?.itemName ?? '',
            doorModelName: contractProductItem?.doorModelName ?? '',
            qty: String(qty),
            fullWidth: new Decimal(contractProductItem?.fullWidth ?? 0).div(1000).toFixed(2),
            WG: new Decimal(contractProductItem?.WG || 0).div(1000).toFixed(2),
            height: new Decimal(contractProductItem?.height || 0).div(1000).toFixed(2),
            material: contractProductItem?.materialName ?? '',
            isAntiTyphoon: contractProductItem?.isAntiTyphoon ?? false,
            area: contractProductItem?.area ?? '',
            volume: contractProductItem?.volume ?? '',
          };

          state.ABCD = {
            ...state.ABCD,
            boxB: String(contractProductItem?.boxB ?? ''),
            boxD: String(contractProductItem?.boxD ?? ''),
          };

          const sprocketWheelChains =
            lookup_sprocketWheelChains_electricMotorChainType[+(contractProductItem?.sprocketWheelChains ?? 0)] ?? '';

          state.motor = {
            ...state.motor,
            horsepower: String(contractProductItem?.horsepower ?? ''),
            motorVoltage: String(contractProductItem?.motorVoltage ?? ''),
            motorPhase: String(contractProductItem?.motorPhase ?? ''),
            vendor: contractProductItem?.motorVendor ?? '',
            hasMotorSupportStand: contractProductItem?.hasMotorSupportStand ? '有' : '無',

            electricMotorChainType: sprocketWheelChains,

            motorLockBox: contractProductItem?.motorLockBox ?? '',
            electricMotorDirection: contractProductItem?.electricMotorDirection ?? '',
            getElectricSupply: state.motor.getElectricSupply,
          };

          state.headBox = {
            ...state.headBox,
            material: componentList?.headBox?.material ?? '',
            headBoxThickness: String(contractProductItem?.headBoxThickness ?? ''),
            surface: componentList?.headBox?.materialSurface ?? '',
            headBoxFront: contractProductItem?.headBoxFront ?? '',
            headBoxProtruding: contractProductItem?.headBoxProtruding ?? '',
            isIntegratedHeadBox: !!contractProductItem?.isIntegratedHeadBox,
            headBoxAngleIronQuantity: String(contractProductItem?.headBoxAngleIronQuantity ?? '0'),
            getIsIntegratedHeadBox: state.headBox.getIsIntegratedHeadBox,

            headBoxCover: contractProductItem?.headBoxCover ?? ('無' as Tworksheet['headBox']['headBoxCover']),
            headBoxTopCover: !!contractProductItem?.headBoxTopCover ? 'true' : 'false',
            hasWheel: !!contractProductItem?.hasWheel ? 'true' : 'false',

            headBoxSizeX: `${contractProductItem?.headBoxSizeX || 0}`,
            headBoxSizeY: `${contractProductItem?.headBoxSizeY || 0}`,
            headBoxSizeM: `${contractProductItem?.headBoxSizeM || 0}`,
            headBoxSizeN: `${contractProductItem?.headBoxSizeN || 0}`,
            headBoxSizeO: `${contractProductItem?.headBoxSizeO || 0}`,
            headBoxSizeP: `${contractProductItem?.headBoxSizeP || 0}`,
            headBoxSizeQ: `${contractProductItem?.headBoxSizeQ || 0}`,
          };

          state.roller = {
            ...state.roller,
            rollerSpec: contractProductItem?.rollerSpec ?? '',
          };

          state.slat = {
            ...state.slat,
            material: componentList?.slat?.material ?? '',
            surface: componentList?.slat?.materialSurface ?? '',
            slatCount: contractProductItem?.slatCount ?? '0',
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
            surface: componentList?.bottomBar?.materialSurface ?? '',
          };

          state.sidePlate = {
            ...state.sidePlate,
            sidePlateDirection: contractProductItem?.sidePlateDirection ?? '',
          };

          state.other = {
            ...state.other,
            isULGuideRail: !!contractProductItem?.isULGuideRail,
          };

          //
          //
        })
      ); // set

      if (contractProductItem) {
        const { serialNumber, floor, locationArea } = contractProductItem;

        // const generalSpec = await get().reqGeneralSpec();
        const generalSpec = get().getIsSpecialProd()
          ? cre_EmptyGeneralSpec()
          : (await get().reqGeneralSpec()) ?? cre_EmptyGeneralSpec();

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
            state.serialNumber = serialNumber ?? '';
            state.floor = floor ?? '';
            state.locationArea = locationArea ?? '';
          })
        );

        if (!get().getIsSpecialProd()) {
          get().update_availableComponents();
        }
      }
    }, // init
    //
    //
    setDoorModelInfo: (doorModelInfo) => {
      set(
        produce<Tworksheet>((state) => {
          state.doorModelInfo = doorModelInfo;
          state.basicSpec.doorModelName = doorModelInfo?.name ?? '';

          // SJ-312固定防颱
          if (doorModelInfo?.name === 'SJ-312') {
            state.basicSpec.isAntiTyphoon = true;
            // 非SJ-312且非SJ-302，固定不防颱
          } else if (doorModelInfo?.name !== 'SJ-302') {
            state.basicSpec.isAntiTyphoon = false;
          }

          state.shouldCalcData = true;
          state.shouldCalcData2 = true;
        })
      );
    },

    // ---------------------------------------------------------------------
    getOptions_material: () => getOptions_material(get().doorModelInfo?.slatMaterials ?? []),
    getOptions_material_stable: () => {
      const doorModelName = get().basicSpec.doorModelName;

      if (doorModelName === 'SJ-305D') {
        return optionsCreator_componentMaterial_01();
      }

      return getOptions_material(get().doorModelInfo?.slatMaterials ?? []);
    },

    getOptions_bottomBarAngleIronAndPlate: () =>
      getOptions_bottomBarAngleIronAndPlate(get().basicSpec.doorModelName as TdoorModel),
    getOptions_horsepower: () => {
      if (get().getIsSpecialProd()) {
        return optionsCreator_horsePower();
      }

      return getOptions_horsepower(get().avalibleComponents?.motors ?? []);
    },
    getOptions_motorVendor: () => {
      if (get().getIsSpecialProd()) {
        return optionsCreator_motorVender();
      }

      return getOptions_motorVendor(get().avalibleComponents?.motors ?? []);
    },
    getOptions_electricSupply: () => getOptions_electricSupply(get().avalibleComponents?.motors ?? []),
    getOptions_headBoxThickness: () => getOptions_headBoxThickness(get().avalibleComponents?.headBoxes ?? []),
    getOptions_diameter: () => getOptions_diameter(get().avalibleComponents?.rollers ?? []),
    getOptions_guideRailThickness: () => getOptions_guideRailThickness(get().avalibleComponents?.guideRails ?? []),
    getOptions_guideRail: () =>
      getOptions_guideRail({
        //
        guideRailArr: get().doorModelInfo?.guideRails ?? [],
        doorModelName: get().basicSpec.doorModelName as TdoorModel,
        isAntiTyphoon: get().basicSpec.isAntiTyphoon,
      }),
    getOptions_doorModelInfo: () => getOptions_doorModelInfo(get().doorModelInfoList),
    getOptions_accessories: () => getOptions_accessories(get().originalAccessories),
    // ---------------------------------------------------------------------

    getIsAntiTyphoonLock: () => {
      const doorModelName = get().doorModelInfo?.name;

      if (doorModelName === 'SJ-302') {
        return false;
      } else {
        return true;
      }
    },

    // ---------------------------------------------------------------------
    // MARK: reqGeneralSpec
    reqGeneralSpec: async (calcTarget = get().calcTarget) => {
      type Tbody = {
        modelName: string;
        fullWidth: number | undefined;
        WG: number | undefined;
        height: number;
        isAntiTyphoon: boolean;
      };

      const body: Tbody = {
        modelName: get().basicSpec.doorModelName as TdoorModel,
        fullWidth: get().getFullWidth_mm(),
        WG: get().getWG_mm(),
        height: get().getHeight_mm(),
        isAntiTyphoon: get().basicSpec.isAntiTyphoon,
      };

      // if (body.fullWidth) {
      //   body.WG = undefined;
      // } else if (body.WG) {
      //   body.fullWidth = undefined;
      // } else if (!body.fullWidth && !body.WG) {
      //   body.fullWidth = 0;
      // }
      if (calcTarget === 'fullWidth') {
        body.WG = undefined;
      } else if (calcTarget === 'WG') {
        body.fullWidth = undefined;
      }

      if (!body.fullWidth && !body.WG) {
        myAlert.warning({ title: '請輸入全寬或WG' });

        return;
      }

      try {
        const generalSpec = await apiGetProdCalcGeneralSpec(body as TpcgsPrams);

        return generalSpec;
      } catch (error) {
        const err = error as Error;

        myAlert.err({ title: '取得產品規格失敗', content: err.message });
      }
    },
    // MARK:update_generalSpec
    update_generalSpec: async () => {
      // const { calcTarget } = get();

      const generalSpec = await get().reqGeneralSpec();
      set(
        produce<Tworksheet>((state) => {
          state.generalSpec = generalSpec;
        })
      );
    },

    // _________________________________________________________________
    // MARK:update_availableComponents
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
    // MARK:updateSlatCount
    updateSlatCount: async () => {
      const doorModelName = get().basicSpec.doorModelName as TdoorModel;
      const boxB = Number(get().ABCD.boxB);
      const height = get().getHeight_mm();

      try {
        const res = await apiGetProdCalcDetailSpec({
          modelName: doorModelName,
          B: boxB,
          height,
        });

        const count = res.slatCount;

        set(
          produce((state) => {
            state.slat.slatCount = String(count);
          })
        );
      } catch (error) {
        const err = error as AxiosError;
        myAlert.err({ title: '取得取得捲片數量失敗', content: err.message });
      }
    },

    // ---------------------------------------------------------------------
    //  MARK:calcData
    calcData: async () => {
      const {
        calcTarget,
        basicSpec,
        getIsSpecialProd,
        update_generalSpec,
        update_availableComponents,
        getOptions_electricSupply,
        getOptions_headBoxThickness,
        getOptions_guideRailThickness,
        getOptions_guideRail,
        getOptions_bottomBarAngleIronAndPlate,
        guideRail,
        generalSpec,
      } = get();

      const isSpecialProd = getIsSpecialProd();

      if (!basicSpec.material || !basicSpec.doorModelName || !basicSpec.quoteType) {
        myAlert.warning({
          title: '請確認已輸入以下資料',
          content: '報價別、門型、材質',
        });

        return;
      }

      if (calcTarget === 'fullWidth' && !basicSpec.fullWidth) {
        myAlert.warning({ title: '請輸入全寬' });

        return;
      } else if (calcTarget === 'WG' && !basicSpec.WG) {
        myAlert.warning({ title: '請輸入WG' });

        return;
      }

      // ___________________________________________________________________
      // ___________________________________________________________________

      const material = (() => {
        if (basicSpec.doorModelName === 'SJ-305D') {
          const sst304 = optionsCreator_componentMaterial_01().find((option) => {
            return option.value.includes('304');
          });

          return sst304?.value ?? '';
        }

        return basicSpec.material;
      })();

      set(
        produce<Tworksheet>((state) => {
          if (!isSpecialProd) {
            state.headBox.material = material;
            state.slat.material = basicSpec.material;
            state.guideRail.material = material;
            state.bottomBar.material = material;
          } else {
            state.headBox.material = '';
            state.slat.material = '';
            state.guideRail.material = '';
            state.bottomBar.material = '';
            state.headBox.surface = '';
            state.slat.surface = '';
            state.guideRail.surface = '';
            state.bottomBar.surface = '';
            state.guideRail.guideRail = '';
          }
        })
      );

      // _____________________________________________________________________
      // _____________________________________________________________________

      if (getIsSpecialProd()) {
        set(
          produce((state) => {
            state.shouldCalcData = false;
            state.headBox.headBoxThickness = '';
          })
        );

        return;
      }

      // _____________________________________________________________________
      // _____________________________________________________________________

      // set(
      //   produce((state) => {
      //     const basicSpec = state.basicSpec;

      //     if (basicSpec.fullWidth) {
      //       basicSpec.WG = '';
      //     }
      //   })
      // );

      await update_generalSpec();

      if (!get().generalSpec) {
        return;
      }

      set(
        produce((state) => {
          const { defaultHp, defaultVendor, defaultBoxB, defaultBoxD } = produceMotor(
            state.generalSpec?.motors[state.generalSpec.defaultMotorIndex]
          );

          state.motor.horsepower = defaultHp;
          state.motor.vendor = defaultVendor;
          state.ABCD.boxB = String(defaultBoxB ?? '');
          state.ABCD.boxD = String(defaultBoxD ?? '');

          // 為了更新fullWidth或WG
          state.ABCD.setGapA(state.generalSpec.gapA);
          state.ABCD.setGapC(state.generalSpec.gapC);
        })
      );

      set(
        produce<Tworksheet>((state) => {
          const calcTarget = state.calcTarget;

          if (calcTarget === 'fullWidth') {
            state.basicSpec.WG = calcWG_M({
              fullWidth_M: Number(state.basicSpec.fullWidth),
              gapA: state.generalSpec?.gapA ?? 0,
              gapC: state.generalSpec?.gapC ?? 0,
            }).toString();
          } else if (calcTarget === 'WG') {
            state.basicSpec.fullWidth = calcFullWidth_M({
              WG: Number(state.basicSpec.WG),
              gapA: state.generalSpec?.gapA ?? 0,
              gapC: state.generalSpec?.gapC ?? 0,
            }).toString();
          }
        })
      );

      await update_availableComponents();
      const option_electricSupply = getOptions_electricSupply()[0];
      const option_headBoxThickness = getOptions_headBoxThickness()[0];
      const option_guideRailThickness = getOptions_guideRailThickness()[0];
      const options_guideRail = getOptions_guideRail()[0];
      const { options_angleIron, options_plate } = getOptions_bottomBarAngleIronAndPlate();

      guideRail.setGuideRail({
        guideRail: options_guideRail.value,
        hasSilencingStrip: options_guideRail.hasSilencingStrip as boolean,
        width: options_guideRail.width as number,
        opening: options_guideRail.opening as string,
        thickness: options_guideRail.thickness as string,
      });

      set(
        produce((state) => {
          state.motor.motorVoltage = (option_electricSupply.voltage ?? '') as string;
          state.motor.motorPhase = (option_electricSupply.phase ?? '') as string;
          state.headBox.headBoxThickness = option_headBoxThickness.value;
          state.guideRail.guideRailThickness = option_guideRailThickness.value;
          state.bottomBar.bottomBarAngleIron = options_angleIron[0].value;
          state.bottomBar.bottomBarPlate = options_plate[0].value;

          state.shouldCalcData = false;
        })
      );
    }, // clacData

    // MARK:calcData_2
    // 預計把取得component與bom的處理寫在這邊
    // 過濾出適配的component並帶入，然後取得bom資料後帶入
    calcData_2: async () => {
      const worksheet = get();

      const {
        //
        getIsSpecialProd,
        updateSlatCount,
        // componentList,
        avalibleComponents,
        //
        generalSpec,
        //
        ABCD,
        basicSpec,
        motor,
        headBox,
        roller,
        slat,
        guideRail,
        bottomBar,
        // sidePlate,
        //
      } = worksheet;
      const isSpecialProd = getIsSpecialProd();

      // headBox, slat, guideRail, bottomBar

      if (
        !isSpecialProd &&
        (!headBox.material ||
          !headBox.surface ||
          !slat.material ||
          !slat.surface ||
          !guideRail.material ||
          !guideRail.surface ||
          !bottomBar.material ||
          !bottomBar.surface)
      ) {
        myAlert.warning({ title: '請確認所有的材質與表面都已選取' });

        return;
      }

      // ______________________________________________________________________

      // 計算fullWidth或WG
      // 沒有必要，在calcData與編輯gapA或gapC時就計算了
      // set(
      //   produce<Tworksheet>((state) => {
      //     const calcTarget = state.calcTarget;

      //     if (calcTarget === 'fullWidth') {
      //       state.basicSpec.WG = calcWG_M({
      //         fullWidth_M: Number(state.basicSpec.fullWidth),
      //         gapA: state.generalSpec?.gapA ?? 0,
      //         gapC: state.generalSpec?.gapC ?? 0,
      //       }).toString();
      //     } else if (calcTarget === 'WG') {
      //       state.basicSpec.fullWidth = calcFullWidth_M({
      //         WG: Number(state.basicSpec.WG),
      //         gapA: state.generalSpec?.gapA ?? 0,
      //         gapC: state.generalSpec?.gapC ?? 0,
      //       }).toString();
      //     }
      //   })
      // );

      // ______________________________________________________________________
      // ______________________________________________________________________
      // 特殊門的處理
      if (isSpecialProd) {
        set(
          produce((state) => {
            state.shouldCalcData2 = false;
          })
        );

        return;
      }

      // ______________________________________________________________________
      // ______________________________________________________________________

      // 一般門的處理
      const avalibleComponentIdList: TavalibleComponentIdList | null = (() => {
        // ______________________________________________________________________
        // ______________________________________________________________________
        if (avalibleComponents) {
          return avalibleComponentFilter({
            avalibleComponentList: avalibleComponents,
            //
            isAntiTyphoon: basicSpec.isAntiTyphoon,
            //
            isWaterProof: bottomBar.bottomBar === '止水型',
            hasAluminumBarrier: bottomBar.bottomBar === '鋁障感型',
            //
            guideRailThickness: guideRail.guideRailThickness as `${number}`,
            hasSilencingStrip: guideRail.hasSilencingStrip,
            guideRail: guideRail.guideRail,
            // warning =======================================================
            isUL: false, // 要新增isUL的欄位
            // warning =======================================================
            //
            horsepower: motor.horsepower,
            gearNumber: generalSpec?.gearNumber ?? 'undefined',
            motorVendor: motor.vendor,
            phase: Number(motor.motorPhase),
            voltage: Number(motor.motorVoltage),
            weight: generalSpec?.weight ?? 99999999,
            hasSupportStand: motor.hasMotorSupportStand === '有',
            //
            bearingType: generalSpec?.bearingName ?? 'undefined',
            isIntegrated: headBox.isIntegratedHeadBox,
            boxB_mm: Number(ABCD.boxB),
            //
            diameter: roller.getDiameter() as `${number}`,
            //
            chains: generalSpec?.sprocketWheelChains ?? -1,
            //
            headBoxThickness: headBox.headBoxThickness as `${number}`,
          });
        } // if

        return null;
      })();

      if (!avalibleComponentIdList) {
        return;
      }

      const componentIdListEntries = Object.entries(avalibleComponentIdList ?? {});

      // ______________________________________________________________________
      // ______________________________________________________________________
      let isComponentOk = true;

      componentIdListEntries.forEach(([key, value]) => {
        if (!value) {
          let key_worksheet = key;
          key_worksheet === 'motor' && (key_worksheet = 'motor_worksheet');

          const message = lookup_errorTip[key_worksheet] ?? { title: '無資料', content: '無資料' };
          myAlert.warning({ ...message });
          isComponentOk = false;
        }
      });

      if (!isComponentOk) {
        return;
      }

      // ______________________________________________________________________
      // ______________________________________________________________________

      const { slatLength } = (await get().reqGeneralSpec('WG')) ?? {};

      if (!slatLength) {
        myAlert.warning({ title: '取得門片長度失敗' });

        return;
      }

      set(
        produce((state) => {
          state.generalSpec.slatLength = slatLength;
        })
      );

      // ______________________________________________________________________
      // ______________________________________________________________________

      const generateDoorProductBom = takeGenerateDoorProductBom({
        worksheet: worksheet,
        avalibleComponentIdList,
      });

      let doorProductBom: TdoorProductBomDto | undefined = undefined;

      if (generateDoorProductBom) {
        try {
          doorProductBom = await apiPostProdGenerateDoorProductBom(generateDoorProductBom);
        } catch (error) {
          const err = error as AxiosError<
            | {
                error: string;
                message: string;
                statusCode: number;
              }
            | undefined
          >;

          const message = err.response?.data?.message ?? err.message;

          myAlert.err({ title: '取得BOM失敗', content: message });
        }
      }

      if (!doorProductBom) {
        return;
      }
      // ______________________________________________________________________
      // ______________________________________________________________________

      const createComponentList_partial: Partial<TcreateComponentList> = {};

      componentIdListEntries.forEach(([theKey, value]) => {
        const key = theKey as TdoorComponentType_old;

        const bom = doorProductBom![key];

        createComponentList_partial[key] = {
          type: key,
          number: bom.number,
          componentId: value,
          rawData: { foo: 'foo' },
          bom,
          material: generateDoorProductBom![key]?.material ?? '',
          materialSurface: generateDoorProductBom![key]?.materialSurface,
          isPainted: !!generateDoorProductBom![key]?.isPainted,
          price: new Decimal(bom.unitPrice).mul(bom.quantity).round().toNumber(),
          quantity: String(bom.quantity),
          order: 0,

          desc: '',
          density: generalSpec?.density ? String(generalSpec.density) : null,
        };
      });

      const createComponentList = createComponentList_partial as TcreateComponentList;

      set(
        produce<Tworksheet>((state) => {
          state.componentList = createComponentList;
        })
      );

      // ______________________________________________________________________
      // ______________________________________________________________________

      // 更新門片數量
      await updateSlatCount();

      set(
        produce((state) => {
          state.shouldCalcData2 = false;
        })
      );

      const { fullWidth, height } = basicSpec;
      const { boxB } = ABCD;

      const area = calcProductArea({
        height: Number(height),
        fullWidth: Number(fullWidth),
        boxb: new Decimal(boxB).div(1000).toNumber(),
      });

      const volume = calcProductVolume(Number(area));

      set(
        produce((state) => {
          state.basicSpec.area = area;
          state.basicSpec.volume = volume;
        })
      );
    }, // calcData_2

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

    getUpdateWorkSheetItemArr: () => {
      const {
        //
        contractProductItem_ori,
        contractProductItemArr_ori,
        componentList,
        accessories,
        // itemIdArr,
        shouldCalcData,
        shouldCalcData2,

        generalSpec,

        basicSpec,
        ABCD,
        motor,
        headBox,
        roller,
        slat,
        guideRail,
        bottomBar,
        sidePlate,
        other,

        getFullWidth_mm,
        getWG_mm,
        getHeight_mm,
        // getFullHeight_mm,
        // getAngleIronSize_mm,
        getIsSpecialProd,
      } = get();

      const itemOri_copy = _.cloneDeep(contractProductItem_ori);
      const isSpecialProd = getIsSpecialProd();

      if (!itemOri_copy) {
        return null;
      }

      if (shouldCalcData || shouldCalcData2) {
        myAlert.warning({ title: '請先計算資料', content: '請先按下計算按鈕/取得剩餘資料按鈕' });

        return null;
      }

      if (!generalSpec) {
        myAlert.warning({ title: '錯誤:generalSpec為空', content: '請聯絡資訊部前端工程師' });

        return null;
      }

      const componentList_copy = _.cloneDeep(componentList);

      const updateWorkSheetItem: TupdateContractProductItemDto = {
        ...itemOri_copy,
        //
        // basicSpec
        quoteType: basicSpec.quoteType,
        itemName: basicSpec.itemName,
        doorModelName: basicSpec.doorModelName as TdoorModel,
        fullWidth: getFullWidth_mm(),
        WG: getWG_mm(),
        height: getHeight_mm(),
        materialName: basicSpec.material,
        isAntiTyphoon: basicSpec.isAntiTyphoon,
        area: basicSpec.area,
        volume: basicSpec.volume,

        //
        // ABCD
        gapA: ABCD.getGapA() || '0',
        gapC: ABCD.getGapC() || '0',
        boxB: Number(ABCD.boxB || 0),
        boxD: Number(ABCD.boxD || 0),
        //
        // motor
        horsepower: motor.horsepower,
        motorVendor: motor.vendor,
        motorVoltage: Number(motor.motorVoltage),
        motorPhase: Number(motor.motorPhase),
        hasMotorSupportStand: motor.hasMotorSupportStand === '有',
        electricMotorChainType: motor.electricMotorChainType,
        motorLockBox: motor.motorLockBox,
        electricMotorDirection: motor.electricMotorDirection,
        //
        // headBox
        // 將小數位去掉，例如"3.0"轉變為"3"
        headBoxThickness: headBox.headBoxThickness ? `${Number(headBox.headBoxThickness)}` : null,
        headBoxFront: headBox.headBoxFront,
        headBoxProtruding: headBox.headBoxProtruding || null,
        isIntegratedHeadBox: headBox.isIntegratedHeadBox,
        headBoxAngleIronQuantity: Number(headBox.headBoxAngleIronQuantity),
        //
        // roller
        rollerSpec: roller.rollerSpec || null,
        //
        // slat
        slatCount: slat.slatCount || '0',
        //
        // guideRail
        // 將小數位去掉，例如"3.0"轉變為"3"
        guideRailThickness: guideRail.guideRailThickness ? `${Number(guideRail.guideRailThickness)}` : null,
        hasSilencingStrip: guideRail.hasSilencingStrip,
        guideRailType: guideRail.guideRailType,
        guideRail: guideRail.guideRail || null,
        guideRailsOpening: guideRail.guideRailsOpening,
        guideRailG: guideRail.guideRailG,
        //
        // bottomBar
        bottomBarAngleIron: bottomBar.bottomBarAngleIron,
        bottomBarPlate: bottomBar.bottomBarPlate,
        bottomBar: bottomBar.bottomBar,
        //
        // sidePlate
        sidePlateDirection: sidePlate.sidePlateDirection,
        //
        // generalSpec
        bearingHousingSize: generalSpec.bearingHousingSize || null,
        bearingHousingTotalLength: String(generalSpec.bearingHousingTotalLength) || null,
        bearingInnerDiameter: generalSpec.bearingInnerDiameter || null,
        bearingName: generalSpec.bearingName || null,
        diameter: String(generalSpec.diameter) || null,
        // gapA: generalSpec.gapA,
        // gapC: generalSpec.gapC,
        gearNumber: generalSpec.gearNumber || null,
        sprocketWheelModel: generalSpec.sprocketWheelModel || null,
        sprocketWheelTeethNumber: generalSpec.sprocketWheelTeethNumber || null,
        sprocketWheelChains: generalSpec.sprocketWheelChains ? String(generalSpec.sprocketWheelChains) : null,
        weight: String(generalSpec.weight) || null,
        slatLength: generalSpec.slatLength || null,
        guideRailLength: generalSpec.guideRailLength || null,
        headBoxLength: generalSpec.headBoxLength || null,
        thickness: generalSpec.thickness || null,
        //
        isULGuideRail: other.isULGuideRail,
      };

      updateWorkSheetItem.components = Object.values(componentList_copy ?? {});
      updateWorkSheetItem.accessories = accessories.map((acce) => {
        return {
          ...acce,
          id: undefined,
        };
      });

      const updateWorkSheetArr = (contractProductItemArr_ori ?? []).map((item) => {
        const { id: itemId, components: oldComponentArr } = item;

        const newComponent = (() => {
          if (isSpecialProd) {
            return [];
          }

          if (oldComponentArr.length === 0) {
            return Object.values(componentList_copy ?? {});
          }

          return oldComponentArr.map((oldComponent) => {
            const { type, id } = oldComponent;

            return {
              ...componentList_copy?.[type],
              id,
            };
          });
        })();

        return {
          ...updateWorkSheetItem,
          id: itemId,
          components: Object.values(newComponent),
        };
      });

      return updateWorkSheetArr;
    },

    getFloorLocations: () => {
      const { floor, locationArea, serialNumberArr } = get();

      const arr = serialNumberArr.map((serialNumber) => {
        const floorLocation: TfloorLocations = {
          floor,
          locationArea,
          serialNumber,
        };

        return floorLocation;
      });

      return arr;
    },

    // ---------------------------------------------------------------------
    //
  }) // set get
);

// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================

// 取得材質選項
const getOptions_material = (materialArr: TdoorMaterialDto[]) => {
  const optiions_material = materialArr.map((item) => {
    return {
      value: item.name,
      label: item.name,
    };
  });

  return optiions_material ?? [];
};

// 取得底座角鐵選項與底座版選項
const getOptions_bottomBarAngleIronAndPlate = (doorModelName: TdoorModel | undefined) => {
  if (doorModelName && doorModelName in lookup_options_bottomBarAngleIronAndPlate) {
    const { angleIron, plate } =
      lookup_options_bottomBarAngleIronAndPlate[
        doorModelName as keyof typeof lookup_options_bottomBarAngleIronAndPlate
      ];

    return {
      options_angleIron: angleIron() ?? [],
      options_plate: plate() ?? [],
    };
  }

  return {
    options_angleIron: [],
    options_plate: [],
  };
};

// 取得馬達廠商選項
const getOptions_motorVendor = (motorArr: TdoorMotorDto[]) => {
  const vendors = motorArr.map((motor) => motor.motorVendor);
  const theVendors = _.uniq(vendors).filter((vendor) => !!vendor) as string[];
  const options = theVendors.map((vendor) => {
    return {
      value: vendor,
      label: vendor,
    };
  });

  return options;
};

//取得門軌厚度選項
const getOptions_guideRailThickness = (guideRailArr: TdoorComponentListDto['guideRails']) => {
  let thicknessArr = guideRailArr.map((guideRail) => guideRail.thickness);
  thicknessArr = _.uniq(thicknessArr);
  const options = thicknessArr.map((thickness) => {
    return {
      value: thickness ?? '',
      label: thickness + 'T',
    };
  });

  return options;
};

// 取得門軌選項
const getOptions_guideRail = ({
  //
  guideRailArr,
  doorModelName,
  isAntiTyphoon,
}: {
  guideRailArr: TdoorModelInfoDto['guideRails'];
  doorModelName: string;
  isAntiTyphoon: boolean;
}) => {
  let options = guideRailArr.map((guideRail) => {
    const { imgSrc, hasSilencingStrip, opening, thickness, width, withHook } = guideRail;

    return {
      value: imgSrc,
      label: '',
      icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
      hasSilencingStrip,
      opening,
      thickness,
      width,
      withHook,
    };
  });

  if (doorModelName === 'SJ-302') {
    if (isAntiTyphoon) {
      options = options.filter((option) => option.withHook === true);
    } else {
      options = options.filter((option) => option.withHook === false);
    }
  }

  return options;
};

// 取得門型選項
const getOptions_doorModelInfo = (
  doorModelInfoList:
    | {
        [key: string]: TdoorModelInfoDto;
      }
    | undefined
) => {
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
};

// 取得配件選項
const getOptions_accessories = (accessories: TquotationProductAccessoryDto[]) => {
  const options = accessories.map((acce) => {
    return {
      value: acce.name,
      label: acce.name,
    };
  });

  return options;
};

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
  const boxList = defaultMotor?.box;

  const defaultVendor = !boxList ? '東元' : '東元' in boxList || 'default' in boxList ? '東元' : '大同';

  const box = boxList?.東元 || boxList?.default || boxList?.大同;

  const { boxB, boxD } = box ?? {};
  let defaultHp = defaultMotor?.hp;

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

const avalibleComponentFilter = (
  //
  {
    avalibleComponentList,
    //
    isAntiTyphoon,
    //
    isWaterProof,
    hasAluminumBarrier,
    //
    guideRailThickness,
    hasSilencingStrip,
    guideRail,
    isUL,
    //
    horsepower,
    gearNumber,
    motorVendor,
    phase,
    voltage,
    weight,
    hasSupportStand,
    //
    bearingType,
    isIntegrated,
    boxB_mm,
    //
    diameter,
    //
    chains,
    //
    headBoxThickness,
  }: {
    avalibleComponentList: TdoorComponentListDto;
    //
    isAntiTyphoon: boolean;
    isIntegrated: boolean; // 一體式捲箱
    bearingType: string; // 軸承
    gearNumber: string;
    // bottomBar
    isWaterProof: boolean; // '止水型'
    hasAluminumBarrier: boolean; // 鋁障感型
    // guideRail
    guideRailThickness: `${number}`;
    hasSilencingStrip: boolean;
    guideRail: string;
    isUL: boolean;
    // motor
    horsepower: string;
    motorVendor: string;
    phase: number;
    voltage: number;
    weight: number;
    hasSupportStand: boolean;
    // sidePlates
    boxB_mm: number;
    // roller
    diameter: `${number}`;
    // motorAccessories
    chains: number; // 鍊條排數
    // heaxBox
    headBoxThickness: `${number}`;
  }
) => {
  //
  const com_slat: TdoorComponentListDto['slats'][number] | null = filter_slats({
    //
    dataArr: avalibleComponentList.slats,
    filterParams: { isAntiTyphoon },
  });
  //
  const com_bottomBar: TdoorComponentListDto['bottomBars'][number] | null = filter_bottomBars({
    dataArr: avalibleComponentList.bottomBars,
    filterParams: {
      isAntiTyphoon,
      isWaterProof,
      hasAluminumBarrier,
    },
  });
  //
  const com_guideRail: TdoorComponentListDto['guideRails'][number] | null = filter_guideRails({
    dataArr: avalibleComponentList.guideRails,
    filterParams: {
      thickness: String(guideRailThickness),
      isAntiTyphoon,
      hasSilencingStrip,
      imageName: guideRail,
      isUL,
    },
  });
  //
  const com_motor: TdoorComponentListDto['motors'][number] | null = filter_motors_worksheet({
    dataArr: avalibleComponentList.motors,
    filterParams: {
      horsePower: horsepower,
      gearNumber: gearNumber, // 那時好像是因為沒有鍊齒輪番號的資料所以才先略過
      motorVendor,
      phase,
      voltage,
      weight,
      hasSupportStand,
    },
  });

  //
  const com_sidePlate: TdoorComponentListDto['sidePlates'][number] | null = filter_sidePlates({
    dataArr: avalibleComponentList.sidePlates,
    filterParams: {
      bearingType, // 從doorGeneralSpecs取得
      gearNumber,
      isIntegrated,
      motorVendor,
      weight,
      sizeB: boxB_mm,
    },
  });
  //
  const com_roller: TdoorComponentListDto['rollers'][number] | null = filter_rollers({
    dataArr: avalibleComponentList.rollers,
    filterParams: {
      diameter,
    },
  });
  //
  const com_motorAccessories: TdoorComponentListDto['motorAccessories'][number] | null = filter_motorAccessories({
    dataArr: avalibleComponentList.motorAccessories,
    filterParams: {
      chains, //鍊條排數
      bearingType,
      gearNumber,
    },
  });
  //
  const com_headBox: TdoorComponentListDto['headBoxes'][number] | null = filter_headBoxes({
    dataArr: avalibleComponentList.headBoxes,
    filterParams: {
      thickness: headBoxThickness, // 捲箱厚度
      isIntegrated,
    },
  });
  //

  return {
    slat: com_slat?.id,
    bottomBar: com_bottomBar?.id,
    guideRail: com_guideRail?.id,
    sidePlate: com_sidePlate?.id,
    roller: com_roller?.id,
    motor: com_motor?.id,
    motorAccessories: com_motorAccessories?.id,
    headBox: com_headBox?.id,
  };

  //
  //
}; // componentFilter

const cre_EmptyGeneralSpec = (): TdoorGeneralSpecsDto => {
  return {
    bearingHousingSize: 0, // 軸承座寸法
    bearingHousingTotalLength: 0, // 軸承座總長(=捲軸長度)
    bearingInnerDiameter: '', // 軸承內徑
    bearingName: '', // 軸承
    defaultMotorIndex: 0,
    density: 0, // 密度
    diameter: 0, // 捲軸直徑
    gapA: 0,
    gapC: 0,
    motors: [],
    gearNumber: '',
    sprocketWheelModel: '',
    sprocketWheelTeethNumber: '',
    sprocketWheelChains: 0,
    weight: 0,
    slatLength: 0, // 門片長度
    guideRailLength: 0, // 門軌長度
    headBoxLength: 0, //  捲箱長度
    thickness: '', // 門片厚度
  };
};

const takeGenerateDoorProductBom = ({
  worksheet,
  avalibleComponentIdList,
}: {
  worksheet: Tworksheet;
  avalibleComponentIdList: TavalibleComponentIdList;
}): TgenerateDoorProductBomDto | null => {
  const {
    generalSpec,
    //
    basicSpec,
    ABCD,
    // motor,
    headBox,
    // roller,
    slat,
    guideRail,
    bottomBar,
    // sidePlate,
    //
    getHeight_mm,
    getFullWidth_mm,
  } = worksheet;

  if (!generalSpec) {
    return null;
  }

  const {
    slatLength,
    guideRailLength,
    headBoxLength,
    bearingHousingTotalLength,
    diameter,
    bearingName,
    gearNumber,
    sprocketWheelChains,
  } = generalSpec;

  const doorSpec: TgenerateDoorProductBomDto_DoorSpec = {
    modelName: basicSpec.doorModelName as TdoorModel,
    weight: generalSpec.weight,
    height: getHeight_mm(),
    B: Number(ABCD.boxB),
    D: Number(ABCD.boxD),
    slatLength,
    guideRailLength,
    rollerLength: bearingHousingTotalLength,
    headBoxLength,
    isAntiTyphoon: basicSpec.isAntiTyphoon,
    rollerDiameter: diameter,
    bearingType: bearingName,
    gearNumber,
    chains: sprocketWheelChains,
    fullWidth: getFullWidth_mm(),
    bottomBarAngleIron: bottomBar.bottomBarAngleIron,
    bottomBarPlate: bottomBar.bottomBarPlate,
  };

  const body_slat: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.slat,
    material: slat.material || '',
    // materialSurface: (reduceMaterialSurface(slat.surface) || null) as TmaterialSurface,
    materialSurface: (slat.surface || null) as TmaterialSurface,
    isPainted: false,
  };

  const body_guideRail: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.guideRail,
    material: guideRail.material || '',
    // materialSurface: (reduceMaterialSurface(guideRail.surface) || null) as TmaterialSurface,
    materialSurface: (guideRail.surface || null) as TmaterialSurface,
    isPainted: false,
    thickness: guideRail.guideRailThickness,
  };

  const body_headBox: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.headBox,
    material: headBox.material || '',
    // materialSurface: (reduceMaterialSurface(headBox.surface) || null) as TmaterialSurface,
    materialSurface: (headBox.surface || null) as TmaterialSurface,
    isPainted: false,
  };

  const body_bottomBar: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.bottomBar,
    material: bottomBar.material || '',
    // 在報價單的classProduct特別把bottomBar的表面拿掉，因此這邊做一樣的處理
    // 只是不知道是為什麼
    // materialSurface: (reduceMaterialSurface(bottomBar.surface) || null) as TmaterialSurface,
    materialSurface: (bottomBar.surface || null) as TmaterialSurface,
    isPainted: false,
  };

  const body_sidePlate: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.sidePlate,
    material: '黑鐵',
    isPainted: false,
  };

  const body_roller: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.roller,
    material: '黑鐵',
    isPainted: false,
  };

  const body_motor: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.motor,
    material: '黑鐵',
    isPainted: false,
  };

  const body_motorAccessory: TgenerateDoorProductBomDto_ComponentInfo = {
    id: avalibleComponentIdList.motorAccessories,
    material: '其他',
    isPainted: false,
  };

  return {
    doorSpec,
    slat: body_slat,
    guideRail: body_guideRail,
    headBox: body_headBox,
    bottomBar: body_bottomBar,
    sidePlate: body_sidePlate,
    roller: body_roller,
    motor: body_motor,
    motorAccessories: body_motorAccessory,
  };

  //
};

const reduceMaterialSurface = (materialSurface: string) => {
  if (materialSurface === '烤漆' || materialSurface === '氟碳') {
    materialSurface = '2B';
  }

  return materialSurface;
};

const calcFullWidth_M = ({ gapA: gapA_mm, gapC: gapC_mm, WG: WG_M }: { gapA: number; gapC: number; WG: number }) => {
  const fullWidth_M = new Decimal(WG_M) //
    .mul(1000)
    .add(gapA_mm)
    .add(gapC_mm)
    .div(1000)
    .toNumber();

  return fullWidth_M;
};

const calcWG_M = ({
  gapA: gapA_mm,
  gapC: gapC_mm,
  fullWidth_M: fullWidth,
}: {
  gapA: number;
  gapC: number;
  fullWidth_M: number;
}) => {
  const WG_M = new Decimal(fullWidth) //
    .mul(1000)
    .minus(gapA_mm)
    .minus(gapC_mm)
    .div(1000)
    .toNumber();

  return WG_M;
};

const lookup_sprocketWheelChains_electricMotorChainType = [undefined, '單排', '雙排'];

// =====================================================================
export { useWorksheet };

export type {
  Tworksheet,
  TdoorComponentType_old,
  TupdateQuotationProductComponentDto_old,
  TquotationProductComponentDto_old,
  TcreateQuotationProductComponentDto_old,
  TquotationProductItemDto_old,
};
