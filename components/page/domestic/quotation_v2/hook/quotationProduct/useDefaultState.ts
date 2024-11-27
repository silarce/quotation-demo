import { useMemo } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

import type {
  TdoorModelInfoDto,
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { TstateProd, TstateProdData, TstateProdDict, TstateComponentData } from './type';

interface TdefaultState {
  stateProdDict: TstateProdDict;
  prodKeyArr: string[];
}

// ===========================================================================
// MARK:useDefaultState
const useDefaultState = ({
  raw_productArr,
  doorModelDict,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  doorModelDict: Record<string, TdoorModelInfoDto> | null | undefined;
}) => {
  const defaultState: TdefaultState = useMemo(() => {
    if (!raw_productArr || doorModelDict === undefined) {
      return {
        stateProdDict: {} as TstateProdDict,
        prodKeyArr: [] as string[],
      };
    }

    const raw_productArr_copy = _.cloneDeep(raw_productArr);

    const dict: TstateProdDict = {};
    const keyArr: string[] = [];

    raw_productArr_copy.forEach((raw) => {
      keyArr.push(raw.id);

      const data_prod = createDateProd(raw);
      let componentsArr = raw.items[0]?.components ?? [];
      componentsArr = _.sortBy(componentsArr, 'order');
      const data_componentDict = createData_componentDict(componentsArr);
      const componentKeyArr = componentsArr.map((item) => item.type);

      dict[data_prod.id] = {
        key: data_prod.id,
        data_prod: data_prod,
        data_componentDict,
        componentKeyArr,

        doorModel: doorModelDict?.[data_prod.doorModelName] || null,
      };
    });

    return {
      stateProdDict: dict,
      prodKeyArr: keyArr,
    };
  }, [raw_productArr, doorModelDict]);

  return defaultState;
};

// ========================================================================
// ========================================================================
// ========================================================================

// MARK: createDateProd
const createDateProd = (raw: TquotationProductDto) => {
  const data_prod: TstateProdData & { id: string } = {
    id: raw.id,
    itemName: raw.itemName,
    discount: raw.discount,
    quoteType: raw.quoteType,
    doorModelName: raw.doorModelName,
    fullWidth: new Decimal(raw.fullWidth).div(1000).toString() as `${number}` | '',
    WG: new Decimal(raw.WG).div(1000).toString() as `${number}` | '',
    height: new Decimal(raw.height).div(1000).toString() as `${number}` | '',
    boxB: new Decimal(raw.boxB).div(1000).toString() as `${number}` | '',
    boxD: new Decimal(raw.boxD).div(1000).toString() as `${number}` | '',
    area: raw.area as `${number}` | null,
    volume: raw.volume as `${number}` | null,

    materialName: raw.materialName,
    materialSurface: raw.materialSurface,

    horsepower: raw.horsepower,
    motorVendor: raw.motorVendor,
    motorVoltage: raw.motorVoltage,
    motorPhase: raw.motorPhase,

    guideRail: raw.guideRail,
    guideRailThickness: raw.guideRailThickness as `${number}` | null,
    hasSilencingStrip: raw.hasSilencingStrip,
    guideRailG: raw.guideRailG,
    isULGuideRail: raw.isULGuideRail,

    hasMotorSupportStand: raw.hasMotorSupportStand,
    bottomBar: raw.bottomBar,
    motorLockBox: raw.motorLockBox,
    isIntegratedHeadBox: raw.isIntegratedHeadBox,
    headBoxThickness: raw.headBoxThickness as `${number}` | null,

    isAntiTyphoon: raw.isAntiTyphoon,

    bounceDoor: raw.bounceDoor,
    bounceDoorWidth: raw.bounceDoorWidth
      ? (new Decimal(raw.bounceDoorWidth).div(1000).toString() as `${number}`)
      : `${raw.bounceDoorWidth || ''}`,

    closingType: raw.closingType,
    notes: raw.notes,

    bottomBarAngleIron: raw.bottomBarAngleIron,
    bottomBarPlate: raw.bottomBarPlate,

    // W 這些要做成component
    // distributionBoxPrice: `${raw.distributionBoxPrice || 0}`,
    // distributionBoxUnitPrice: `${raw.distributionBoxUnitPrice || 0}`,
    // distributionBoxQuantity: `${raw.distributionBoxQuantity || 0}`,
    // distributionBoxDualPrice: `${raw.distributionBoxDualPrice || 0}`,
    // distributionBoxTotalPrice: `${raw.distributionBoxTotalPrice || 0}`,
    // installationFeePrice: `${raw.installationFeePrice || 0}`,
    // installationFeeDualPrice: `${raw.installationFeeDualPrice || 0}` as `${number}`,
    // installationFeeQuantity: `${raw.installationFeeQuantity || 0}` as `${number}`,
    // installationFeeUnitPrice: `${raw.installationFeeUnitPrice || 0}`,
    // installationFeeTotalPrice: `${raw.installationFeeTotalPrice || 0}` as `${number}`,
    // W 這些要做成component

    gapA: raw.gapA,
    gapC: raw.gapC,
    gearNumber: raw.gearNumber,
    weight: raw.weight,
    thickness: raw.thickness as `${number}` | '',
    slatCount: raw.slatCount as `${number}` | null,
    sprocketWheelModel: raw.sprocketWheelModel,
    sprocketWheelTeethNumber: raw.sprocketWheelTeethNumber,
    sprocketWheelChains: raw.sprocketWheelChains as `${number}` | null,
    bearingInnerDiameter: raw.bearingInnerDiameter,
    diameter: raw.diameter as `${number}` | null,
    bearingHousingTotalLength: raw.bearingHousingTotalLength as `${number}` | null,
    guideRailsOpening: raw.guideRailsOpening,
    slatLength: raw.slatLength,
    guideRailLength: raw.guideRailLength,
    headBoxLength: raw.headBoxLength,
    bearingHousingSize: raw.bearingHousingSize,
    bearingName: raw.bearingName,

    quantity: raw.quantity,
    price: `${raw.price || 0}`, // 牌價
    dualPrice: `${raw.dualPrice || 0}`, // 牌價複價
    unitPrice: `${raw.unitPrice || 0}`, // 單價 會乘上折數的價格
    totalPrice: `${raw.totalPrice || 0}`, // 複價 會乘上折數的價格

    attachedToProductId: raw.attachedToProductId,
    rootProductId: raw.rootProductId,
  };

  return data_prod;
};

// MARK:createData_componentDict
const createData_componentDict = (componentsArr: TquotationProductComponentDto[]) => {
  const data_componentDict: TstateProd['data_componentDict'] = componentsArr.reduce((componentDict, item) => {
    const {
      //
      type,
      number,
      desc,
      material,
      materialSurface,
      density,
      isPainted,
      quantity,
      price,
      rawData,
    } = item;

    const data_component = {
      type,
      number,
      desc,
      material,
      materialSurface,
      density,
      isPainted,
      quantity,
      price,
      rawData,
    } as TstateComponentData<typeof type>;

    switch (type) {
      case 'slat':
        componentDict['slat'] = data_component as TstateComponentData<'slat'>;
        break;
      case 'bottomBar':
        componentDict['bottomBar'] = data_component as TstateComponentData<'bottomBar'>;
        break;
      case 'guideRail':
        componentDict['guideRail'] = data_component as TstateComponentData<'guideRail'>;
        break;
      case 'sidePlate':
        componentDict['sidePlate'] = data_component as TstateComponentData<'sidePlate'>;
        break;
      case 'roller':
        componentDict['roller'] = data_component as TstateComponentData<'roller'>;
        break;
      case 'motor':
        componentDict['motor'] = data_component as TstateComponentData<'motor'>;
        break;

      case 'motorAccessories':
        componentDict['motorAccessories'] = data_component as TstateComponentData<'motorAccessories'>;
        break;

      case 'headBox':
        componentDict['headBox'] = data_component as TstateComponentData<'headBox'>;
        break;

      case 'middlePillar':
        componentDict['middlePillar'] = data_component as TstateComponentData<'middlePillar'>;
        break;

      case 'backBone':
        componentDict['backBone'] = data_component as TstateComponentData<'backBone'>;
        break;

      default:
        break;
    }

    return componentDict;
  }, {} as TstateProd['data_componentDict']);

  return data_componentDict;
};

// ========================================================================
export { useDefaultState };
