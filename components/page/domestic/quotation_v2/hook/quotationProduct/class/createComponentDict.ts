import type { TdoorComponentListDto } from 'js/api/dtoTypes';

import * as componentFilter from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/componentFilter';

import { ClassProd_base } from './prod/classProd_base';
import type { Tdata_componentDict } from '../type';

// ========================================================================

// MARK:createComponentDict
const createComponentDict = ({
  classProd,
  availableComponents,
}: {
  classProd: ClassProd_base;
  availableComponents: TdoorComponentListDto;
}) => {
  const {
    slat,
    optionalSlats,

    bottomBar,
    optionalBottomBars,

    guideRail,
    optionalGuideRails,

    sidePlate,
    optionalSidePlates,

    roller,
    optionalRollers,

    motorAccessory,
    optionalMotorAccessories,

    headBox,
    optionalHeadBoxes,

    backBone,
    optionalBackBones,

    middlePillar,
    optionalMiddlePillars,
    //
    //
    changedMotorVendor,
  } = filterComponent(classProd, availableComponents);

  const componentDict: Tdata_componentDict = {};

  slat &&
    (componentDict.slat = {
      type: 'slat',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: (`${classProd.state.doorModel?.density ?? ''}` || null) as `${number}` | null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: slat,
      optionalComponent: optionalSlats,
    });

  bottomBar &&
    (componentDict.bottomBar = {
      type: 'bottomBar',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: bottomBar,
      optionalComponent: optionalBottomBars,
    });

  guideRail &&
    (componentDict.guideRail = {
      type: 'guideRail',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: guideRail,
      optionalComponent: optionalGuideRails,
    });

  sidePlate &&
    (componentDict.sidePlate = {
      type: 'sidePlate',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: sidePlate,
      optionalComponent: optionalSidePlates,
    });

  roller &&
    (componentDict.roller = {
      type: 'roller',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: roller,
      optionalComponent: optionalRollers,
    });

  motorAccessory &&
    (componentDict.motorAccessories = {
      type: 'motorAccessories',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: motorAccessory,
      optionalComponent: optionalMotorAccessories,
    });

  headBox &&
    (componentDict.headBox = {
      type: 'headBox',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: headBox,
      optionalComponent: optionalHeadBoxes,
    });

  backBone &&
    (componentDict.backBone = {
      type: 'backBone',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: backBone,
      optionalComponent: optionalBackBones,
    });

  middlePillar &&
    (componentDict.middlePillar = {
      type: 'middlePillar',
      number: undefined,
      desc: '稍後建立desc產生器',
      material: '稍後處理',
      materialSurface: '稍後處理',
      density: null,
      isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
      quantity: '',
      price: '',
      rawData: middlePillar,
      optionalComponent: optionalMiddlePillars,
    });

  return { componentDict, changedMotorVendor };
}; // createComponentDict

// ========================================================================

// MARK: filterComponent
const filterComponent = (classProd: ClassProd_base, availableComponents: TdoorComponentListDto) => {
  const {
    filter_slat,
    filter_bottomBar,
    filter_guideRail,
    filter_sidePlate,
    filter_roller,
    filter_motor,
    filter_motorAccessory,
    filter_headBox,
    filter_backBone,
    filter_middlePillar,
  } = componentFilter;

  const { slat, optionalSlats } = filter_slat(availableComponents.slats, {
    isAntiTyphoon: !!classProd.data.isAntiTyphoon,
  });

  const { bottomBar, optionalBottomBars } = filter_bottomBar(availableComponents.bottomBars, {
    isAntiTyphoon: !!classProd.data.isAntiTyphoon,
    isWaterProof: classProd.data.bottomBar === '止水型',
    hasAluminumBarrier: classProd.data.bottomBar === '鋁障感型',
  });

  const { guideRail, optionalGuideRails } = filter_guideRail({
    guideRails: availableComponents.guideRails,
    params: {
      thickness: Number(classProd.data.guideRailThickness),
      isAntiTyphoon: !!classProd.data.isAntiTyphoon,
      hasSilencingStrip: !!classProd.data.hasSilencingStrip,
      imageName: classProd.data.guideRail || 'null',
      isUL: !!classProd.data.isULGuideRail,
    },
  });

  const { sidePlate, optionalSidePlates } = filter_sidePlate(availableComponents.sidePlates, {
    bearingType: classProd.data.bearingName || 'null',
    gearNumber: classProd.data.gearNumber,
    isIntegrated: !!classProd.data.isIntegratedHeadBox,
    motorVendor: classProd.data.motorVendor || 'null',
    sizeB: classProd.boxB_mm,
    weight: Number(classProd.data.weight ?? NaN),
  });

  const { roller, optionalRollers } = filter_roller(availableComponents.rollers, {
    diameter: classProd.data.diameter ?? '-1',
  });

  let motorVendor = classProd.data.motorVendor;
  let changedMotorVendor = null;
  let { motor, optionalMotors } = filter_motor(availableComponents.motors, {
    horsePower: classProd.data.horsepower,
    gearNumber: classProd.data.gearNumber || 'null',
    motorVendor: motorVendor || 'null',
    phase: Number(classProd.data.motorPhase ?? NaN),
    voltage: Number(classProd.data.motorVoltage ?? NaN),
    weight: Number(classProd.data.weight ?? NaN),
    hasSupportStand: !!classProd.data.hasMotorSupportStand,
  });

  // 現在使用者不能選擇馬達廠商，因此在這裡自動轉換
  if (!motor && motorVendor) {
    if (motorVendor === '東元') {
      motorVendor = '大同';
    } else if (motorVendor === '大同') {
      motorVendor = '東元';
    }

    const result = filter_motor(availableComponents.motors, {
      horsePower: classProd.data.horsepower,
      gearNumber: classProd.data.gearNumber || 'null',
      motorVendor: motorVendor || 'null',
      phase: Number(classProd.data.motorPhase ?? NaN),
      voltage: Number(classProd.data.motorVoltage ?? NaN),
      weight: Number(classProd.data.weight ?? NaN),
      hasSupportStand: !!classProd.data.hasMotorSupportStand,
    });

    if (result) {
      motor = result.motor;
      optionalMotors = result.optionalMotors;
      changedMotorVendor = motorVendor;
      // classProd.data.motorVendor = motorVendor;
    }
  }

  const { motorAccessory, optionalMotorAccessories } = filter_motorAccessory(availableComponents.motorAccessories, {
    chains: Number(classProd.data.sprocketWheelChains ?? NaN),
    bearingType: classProd.data.bearingName ?? 'null',
    gearNumber: classProd.data.gearNumber ?? 'null',
  });

  const { headBox, optionalHeadBoxes } = filter_headBox(availableComponents.headBoxes, {
    thickness: Number(classProd.data.headBoxThickness ?? NaN),
    isIntegrated: !!classProd.data.isIntegratedHeadBox,
  });

  const { backBone, optionalBackBones } = filter_backBone(availableComponents.backBone);

  const { middlePillar, optionalMiddlePillars } = filter_middlePillar(availableComponents.middlePillar);

  return {
    slat,
    optionalSlats,

    bottomBar,
    optionalBottomBars,

    guideRail,
    optionalGuideRails,

    sidePlate,
    optionalSidePlates,

    roller,
    optionalRollers,

    motorAccessory,
    optionalMotorAccessories,

    headBox,
    optionalHeadBoxes,

    backBone,
    optionalBackBones,

    middlePillar,
    optionalMiddlePillars,
    //
    //
    changedMotorVendor,
  };
};

export { createComponentDict };
