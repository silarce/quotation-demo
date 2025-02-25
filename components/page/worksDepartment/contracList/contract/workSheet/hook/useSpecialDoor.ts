import { useState, useMemo, useEffect } from 'react';

import type { TquotationProductItemDto, TupdateContractProductItemDto } from 'js/api/dtoTypes';
import type { TworksheetRecordDto_addition, TupdateWorkSheet } from 'js/api/api_engineering';

type Tstate_specialDoor = {
  // 項目名
  readonly itemName: string;
  // 報價別
  readonly quoteType: string;
  // 門型
  readonly doorModelName: string;
  readonly qty: number;

  //

  // L(mm)全寬
  fullWidth: `${number}` | '';
  WG: `${number}` | '';
  // h(mm)
  height: `${number}` | '';
  // B(mm)
  boxB: `${number}` | '';
  // D(mm)
  boxD: `${number}` | '';
  // 面積
  area: `${number}` | '';
  // 才數
  volume: `${number}` | '';
  // 材料
  materialName: string;
  // 表面
  materialSurface: string;
  // 門軌
  guideRail: string;
  // 馬力
  horsepower: string;
  // 馬達廠商
  motorVendor: string;

  // 電壓
  motorVoltage: 110 | 380 | null;
  // 相數
  motorPhase: 1 | 3 | null;

  // 馬達支撐架
  hasMotorSupportStand: boolean;
  // 底座類型
  bottomBar: string;
  // 馬達鎖盒
  motorLockBox: string;
  // 門軌厚度
  guideRailThickness: `${number}` | '';
  // 門軌消音條
  hasSilencingStrip: boolean;
  // 一體式捲箱
  isIntegratedHeadBox: boolean;
  // 捲箱厚度
  headBoxThickness: `${number}` | '';
  // 防颱
  isAntiTyphoon: boolean;
  // 彈射門
  // bounceDoor: boolean;
  // 彈射門寬度
  // bounceDoorWidth: `${number}` | '';
  // 彈射門高度
  // bounceDoorHeight: `${number}` | '';
  // 彈射門長度
  // bounceDoorLength: `${number}` | '';
  // 關閉方式
  closingType: string;

  // 底座角鐵
  bottomBarAngleIron: string;
  // 底座板
  bottomBarPlate: string;

  // 門片厚度
  thickness: `${number}` | '';

  // 門片 - 捲片支數
  // slatCount: `${number}` | '';

  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel: string;
  // 鏈齒輪 - 大鏈輪
  // sprocketWheelTeethNumber: string;
  // 可能為鍊條數量
  // sprocketWheelChains: `${number}` | '';
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  // bearingInnerDiameter: string;

  // 捲軸 - 尺寸
  diameter: `${number}` | '';
  // 捲軸 - 總長
  bearingHousingTotalLength: `${number}` | '';
  // 底座 - 開口
  guideRailsOpening: string;
  // 門片長度
  slatLength: `${number}` | '';
  // 門軌長度
  guideRailLength: `${number}` | '';
  // 捲箱長度
  headBoxLength: `${number}` | '';
  // 軸承座寸法
  bearingHousingSize: `${number}` | '';
  // 軸承
  bearingName: string;

  gapA: `${number}` | '';
  gapC: `${number}` | '';
  gearNumber: string;
  weight: `${number}` | '';
  // 捲箱 - 正面
  headBoxFront: string;

  // 捲箱 - 有無凸 // 棄用
  // headBoxProtruding: string | null; // 棄用

  // 捲箱 - 角鐵數量
  headBoxAngleIronQuantity: `${number}` | '';
  // 支板 - 鏈條
  sidePlateChain: string;
  // 支板 - 方向
  sidePlateDirection: string;
  // 電動機 - 鍊條形式
  electricMotorChainType: string;
  // 電動機 - 方向
  electricMotorDirection: string;
  // 門軌 - 型式
  guideRailType: string;
  // 底座 - 表面
  bottomBarSurface: string;
  // 門軌 - 表面
  guideRailSurface: string;
  guideRailG: `${number}` | '';
  isULGuideRail: boolean;

  // 門編號
  serialNumberArr: string[];
  // 樓層
  floor: string;
  // 區域位置
  locationArea: string;

  hasWheel: boolean;
  headBoxCover: TupdateContractProductItemDto['headBoxCover'] | null;
  headBoxTopCover: boolean;

  headBoxSizeX: `${number}` | '';
  headBoxSizeY: `${number}` | '';
  headBoxSizeM: `${number}` | '';
  headBoxSizeN: `${number}` | '';
  headBoxSizeO: `${number}` | '';
  headBoxSizeP: `${number}` | '';
  headBoxSizeQ: `${number}` | '';

  // 骨架
  skeleton: string;
  // 上遮板
  upperMask: boolean;
};

// MARK:useSpecialDoor
const useSpecialDoor = ({
  activeRecordData,
  disabled,
}: {
  activeRecordData: TworksheetRecordDto_addition | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDefaultState_specialDoor({
    // quotationProductItem: activeRecordData?.contractProductItems?.[0],
    contractProductItems: activeRecordData?.contractProductItems,
    qty: activeRecordData?.contractProductItems?.length ?? 0,
  });

  const [state_specialDoor, setState_specialDoor] = useState<Tstate_specialDoor>(defaultState);

  const { invalidKeyArr, readonlyKeyArr, isValid } = useMemo(() => {
    const invalidKeyArr: (keyof Tstate_specialDoor)[] = [];
    const readonlyKeyArr: (keyof Tstate_specialDoor)[] = [];

    const { doorModelName, closingType } = state_specialDoor;

    if (doorModelName === 'W3') {
      if (closingType === '電動') {
        readonlyKeyArr.push('closingType');
      } else {
        invalidKeyArr.push('closingType');
      }
    }

    const isValid = invalidKeyArr.length === 0;

    return {
      invalidKeyArr,
      readonlyKeyArr,
      isValid,
    };
  }, [state_specialDoor]);

  const createBody = () => {
    const itemArr = activeRecordData?.contractProductItems ?? [];

    const contractProductItems = itemArr.map((item) => {
      const contractProductItem: TupdateWorkSheet['contractProductItems'][number] = {
        id: item.id,
        itemNumber: item.itemNumber,
        discount: item.discount,
        bounceDoor: item.bounceDoor,
        bounceDoorWidth: item.bounceDoorWidth,
        bounceDoorHeight: item.bounceDoorHeight,
        bounceDoorLength: item.bounceDoorLength,
        guideRailG: item.guideRailG,
        unitPrice: item.unitPrice,
        price: item.price,
        dualPrice: item.dualPrice,
        totalPrice: item.totalPrice,
        slatCount: item.slatCount,

        accessories: [],
        components: [],

        itemName: state_specialDoor.itemName,
        quoteType: state_specialDoor.quoteType,
        doorModelName: state_specialDoor.doorModelName,
        fullWidth: Number(state_specialDoor.fullWidth),
        WG: Number(state_specialDoor.WG || 0),
        height: Number(state_specialDoor.height || 0),
        boxB: Number(state_specialDoor.boxB || 0),
        boxD: Number(state_specialDoor.boxD || 0),
        area: state_specialDoor.area || null,
        volume: state_specialDoor.volume || null,
        materialName: state_specialDoor.materialName,
        materialSurface: state_specialDoor.materialSurface,
        guideRail: state_specialDoor.guideRail,
        horsepower: state_specialDoor.horsepower,
        motorVendor: state_specialDoor.motorVendor,
        motorVoltage: state_specialDoor.motorVoltage,
        hasMotorSupportStand: state_specialDoor.hasMotorSupportStand,
        bottomBar: state_specialDoor.bottomBar,
        motorLockBox: state_specialDoor.motorLockBox,
        guideRailThickness: state_specialDoor.guideRailThickness || null,
        rollerSpec: item.rollerSpec,
        hasSilencingStrip: state_specialDoor.hasSilencingStrip,
        isIntegratedHeadBox: state_specialDoor.isIntegratedHeadBox,
        headBoxThickness: state_specialDoor.headBoxThickness || null,

        isAntiTyphoon: state_specialDoor.isAntiTyphoon,

        closingType: state_specialDoor.closingType,
        notes: item.notes,
        motorPhase: state_specialDoor.motorPhase,
        bottomBarAngleIron: state_specialDoor.bottomBarAngleIron,
        bottomBarPlate: state_specialDoor.bottomBarPlate,
        thickness: state_specialDoor.thickness || null,

        sprocketWheelModel: state_specialDoor.sprocketWheelModel,
        sprocketWheelChains: item.sprocketWheelChains || null,
        sprocketWheelTeethNumber: item.sprocketWheelTeethNumber,
        bearingInnerDiameter: item.bearingInnerDiameter || null,
        diameter: state_specialDoor.diameter || null,
        bearingHousingTotalLength: state_specialDoor.bearingHousingTotalLength || null,
        guideRailsOpening: state_specialDoor.guideRailsOpening,
        slatLength: Number(state_specialDoor.slatLength || 0),
        guideRailLength: Number(state_specialDoor.guideRailLength || 0),
        headBoxLength: Number(state_specialDoor.headBoxLength || 0),
        bearingHousingSize: Number(state_specialDoor.bearingHousingSize || 0),
        bearingName: state_specialDoor.bearingName,
        gapA: state_specialDoor.gapA,
        gapC: state_specialDoor.gapC,
        gearNumber: state_specialDoor.gearNumber,
        weight: state_specialDoor.weight || null,
        headBoxFront: state_specialDoor.headBoxFront,
        headBoxProtruding: item.headBoxProtruding,
        headBoxAngleIronQuantity: Number(state_specialDoor.headBoxAngleIronQuantity || 0),
        sidePlateChain: state_specialDoor.sidePlateChain,
        sidePlateDirection: state_specialDoor.sidePlateDirection,
        electricMotorChainType: state_specialDoor.electricMotorChainType,
        electricMotorDirection: state_specialDoor.electricMotorDirection,
        guideRailType: state_specialDoor.guideRailType,

        isULGuideRail: state_specialDoor.isULGuideRail,

        headBoxCover: state_specialDoor.headBoxCover,
        headBoxTopCover: state_specialDoor.headBoxTopCover,
        headBoxSizeX: state_specialDoor.headBoxSizeX || null,
        headBoxSizeY: state_specialDoor.headBoxSizeY || null,
        headBoxSizeM: state_specialDoor.headBoxSizeM || null,
        headBoxSizeN: state_specialDoor.headBoxSizeN || null,
        headBoxSizeO: state_specialDoor.headBoxSizeO || null,
        headBoxSizeP: state_specialDoor.headBoxSizeP || null,
        headBoxSizeQ: state_specialDoor.headBoxSizeQ || null,
        hasWheel: state_specialDoor.hasWheel,

        skeleton: state_specialDoor.skeleton,
        upperMask: state_specialDoor.upperMask,
      };

      return contractProductItem;
    });

    const floorLocations = state_specialDoor.serialNumberArr.map((serialNumber) => {
      return {
        serialNumber,
        floor: state_specialDoor.floor,
        locationArea: state_specialDoor.locationArea,
      };
    });

    const body: TupdateWorkSheet = {
      contractProductItems,
      floorLocations,
    };

    return body;
  };

  useEffect(() => {
    setState_specialDoor(defaultState);
  }, [defaultState, disabled]);

  return { state_specialDoor, setState_specialDoor, createBody, invalidKeyArr, readonlyKeyArr, isValid };
};

// MARK:useDefaultState_specialDoor

const useDefaultState_specialDoor = ({
  contractProductItems,
  qty,
}: {
  contractProductItems: TquotationProductItemDto[] | undefined;
  qty: number;
}) => {
  const defaultState: Tstate_specialDoor = useMemo(() => {
    if (!contractProductItems || contractProductItems.length === 0) {
      return emptyState_specialDoor();
    }

    const quotationProductItem = contractProductItems[0];

    const defaultState: Tstate_specialDoor = {
      itemName: quotationProductItem.itemName,
      quoteType: quotationProductItem.quoteType,
      doorModelName: quotationProductItem.doorModelName,
      qty: qty,

      fullWidth: `${quotationProductItem.fullWidth}`,
      WG: `${quotationProductItem.WG}`,
      height: `${quotationProductItem.height}`,
      boxB: `${quotationProductItem.boxB}`,
      boxD: `${quotationProductItem.boxD ?? ''}`,
      area: `${quotationProductItem.area ?? ''}` as `${number}` | '',
      volume: `${quotationProductItem.volume ?? ''}` as `${number}` | '',
      materialName: quotationProductItem.materialName,
      materialSurface: quotationProductItem.materialSurface ?? '',
      guideRail: quotationProductItem.guideRail ?? '',
      horsepower: quotationProductItem.horsepower,
      motorVendor: quotationProductItem.motorVendor ?? '',
      motorVoltage: quotationProductItem.motorVoltage as 110 | 380 | null,
      motorPhase: quotationProductItem.motorPhase as 1 | 3 | null,
      hasMotorSupportStand: !!quotationProductItem.hasMotorSupportStand,
      bottomBar: quotationProductItem.bottomBar ?? '',
      motorLockBox: quotationProductItem.motorLockBox ?? '',
      guideRailThickness: `${quotationProductItem.guideRailThickness ?? ''}` as `${number}` | '',
      hasSilencingStrip: !!quotationProductItem.hasSilencingStrip,
      isIntegratedHeadBox: !!quotationProductItem.isIntegratedHeadBox,
      headBoxThickness: `${quotationProductItem.headBoxThickness ?? ''}` as `${number}` | '',
      isAntiTyphoon: !!quotationProductItem.isAntiTyphoon,
      // bounceDoor: !!quotationProductItem.bounceDoor,
      // bounceDoorWidth: `${quotationProductItem.bounceDoorWidth ?? ''}` as `${number}` | '',
      // bounceDoorHeight: `${quotationProductItem.bounceDoorHeight ?? ''}` as `${number}` | '',
      // bounceDoorLength: `${quotationProductItem.bounceDoorLength ?? ''}` as `${number}` | '',
      closingType: quotationProductItem.closingType ?? '',
      bottomBarAngleIron: quotationProductItem.bottomBarAngleIron ?? '',
      bottomBarPlate: quotationProductItem.bottomBarPlate ?? '',
      thickness: `${quotationProductItem.thickness ?? ''}` as `${number}` | '',
      // slatCount: `${quotationProductItem.slatCount ?? ''}` as `${number}` | '',
      diameter: `${quotationProductItem.diameter ?? ''}` as `${number}` | '',
      bearingHousingTotalLength: `${quotationProductItem.bearingHousingTotalLength ?? ''}` as `${number}` | '',
      guideRailsOpening: quotationProductItem.guideRailsOpening ?? '',
      slatLength: `${quotationProductItem.slatLength ?? ''}` as `${number}` | '',
      guideRailLength: `${quotationProductItem.guideRailLength ?? ''}` as `${number}` | '',
      headBoxLength: `${quotationProductItem.headBoxLength ?? ''}` as `${number}` | '',
      bearingHousingSize: `${quotationProductItem.bearingHousingSize ?? ''}` as `${number}` | '',
      bearingName: quotationProductItem.bearingName ?? '',
      gapA: `${quotationProductItem.gapA ?? ''}` as `${number}` | '',
      gapC: `${quotationProductItem.gapC ?? ''}` as `${number}` | '',
      gearNumber: quotationProductItem.gearNumber ?? '',
      weight: `${quotationProductItem.weight ?? ''}` as `${number}` | '',
      headBoxFront: quotationProductItem.headBoxFront ?? '',
      headBoxAngleIronQuantity: `${quotationProductItem.headBoxAngleIronQuantity ?? ''}` as `${number}` | '',
      sidePlateChain: quotationProductItem.sidePlateChain ?? '',
      sidePlateDirection: quotationProductItem.sidePlateDirection ?? '',
      electricMotorChainType: quotationProductItem.electricMotorChainType ?? '',
      electricMotorDirection: quotationProductItem.electricMotorDirection ?? '',
      guideRailType: quotationProductItem.guideRailType ?? '',
      bottomBarSurface: quotationProductItem.bottomBarSurface ?? '',
      guideRailSurface: quotationProductItem.guideRailSurface ?? '',
      guideRailG: `${quotationProductItem.guideRailG ?? ''}` as `${number}` | '',
      isULGuideRail: !!quotationProductItem.isULGuideRail,
      serialNumberArr: contractProductItems.map((item) => item.serialNumber ?? ''),
      floor: quotationProductItem.floor ?? '',
      locationArea: quotationProductItem.locationArea ?? '',
      //
      hasWheel: !!quotationProductItem.hasWheel,
      headBoxCover: quotationProductItem.headBoxCover,
      headBoxTopCover: !!quotationProductItem.headBoxTopCover,
      headBoxSizeX: `${quotationProductItem.headBoxSizeX ?? ''}` as `${number}` | '',
      headBoxSizeY: `${quotationProductItem.headBoxSizeY ?? ''}` as `${number}` | '',
      headBoxSizeM: `${quotationProductItem.headBoxSizeM ?? ''}` as `${number}` | '',
      headBoxSizeN: `${quotationProductItem.headBoxSizeN ?? ''}` as `${number}` | '',
      headBoxSizeO: `${quotationProductItem.headBoxSizeO ?? ''}` as `${number}` | '',
      headBoxSizeP: `${quotationProductItem.headBoxSizeP ?? ''}` as `${number}` | '',
      headBoxSizeQ: `${quotationProductItem.headBoxSizeQ ?? ''}` as `${number}` | '',
      //
      sprocketWheelModel: quotationProductItem.sprocketWheelModel ?? '',

      skeleton: quotationProductItem.skeleton ?? '',
      upperMask: !!quotationProductItem.upperMask,
    };

    return defaultState;
  }, [contractProductItems]);

  return defaultState;
};

const emptyState_specialDoor = (): Tstate_specialDoor => {
  const state: Tstate_specialDoor = {
    itemName: '',
    quoteType: '',
    doorModelName: '',
    qty: 0,

    fullWidth: '',
    WG: '',
    height: '',
    boxB: '',
    boxD: '',
    area: '',
    volume: '',
    materialName: '',
    materialSurface: '',
    guideRail: '',
    horsepower: '',
    motorVendor: '',
    motorVoltage: null,
    motorPhase: null,
    hasMotorSupportStand: false,
    bottomBar: '',
    motorLockBox: '',
    guideRailThickness: '',
    hasSilencingStrip: false,
    isIntegratedHeadBox: false,
    headBoxThickness: '',
    isAntiTyphoon: false,
    // bounceDoor: false,
    // bounceDoorWidth: '',
    // bounceDoorHeight: '',
    // bounceDoorLength: '',
    closingType: '',
    bottomBarAngleIron: '',
    bottomBarPlate: '',
    thickness: '',
    // slatCount: '',
    diameter: '',
    bearingHousingTotalLength: '',
    guideRailsOpening: '',
    slatLength: '',
    guideRailLength: '',
    headBoxLength: '',
    bearingHousingSize: '',
    bearingName: '',
    gapA: '',
    gapC: '',
    gearNumber: '',
    weight: '',
    headBoxFront: '',
    headBoxAngleIronQuantity: '',
    sidePlateChain: '',
    sidePlateDirection: '',
    electricMotorChainType: '',
    electricMotorDirection: '',
    guideRailType: '',
    bottomBarSurface: '',
    guideRailSurface: '',
    guideRailG: '',
    isULGuideRail: false,
    serialNumberArr: [],
    floor: '',
    locationArea: '',
    //
    hasWheel: false,
    headBoxCover: null,
    headBoxTopCover: false,
    headBoxSizeX: '',
    headBoxSizeY: '',
    headBoxSizeM: '',
    headBoxSizeN: '',
    headBoxSizeO: '',
    headBoxSizeP: '',
    headBoxSizeQ: '',
    //
    sprocketWheelModel: '',

    skeleton: '',
    upperMask: false,
  };

  return state;
};

export { useSpecialDoor };
export type { Tstate_specialDoor };
