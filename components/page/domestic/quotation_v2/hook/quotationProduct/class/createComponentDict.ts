import type { TdoorComponentListDto } from 'js/api/dtoTypes';

import * as componentFilter from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/componentFilter';

import { ClassProd_base } from './prod/classProd_base';
import type { Tdata_componentDict } from '../type';

import { ClassProd } from './prod/classProd_remake';

// ========================================================================

// MARK:createComponentDict
const createComponentDict = ({
  classProd,
  availableComponents,
}: {
  classProd: ClassProd;
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

    motor,
    optionalMotors,

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

  componentDict.slat = {
    type: 'slat',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: (`${classProd.state.doorModel?.density ?? ''}` || null) as `${number}` | null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: slat,
    optionalComponent: optionalSlats,
  };

  componentDict.bottomBar = {
    type: 'bottomBar',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: bottomBar,
    optionalComponent: optionalBottomBars,
  };

  componentDict.guideRail = {
    type: 'guideRail',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: guideRail,
    optionalComponent: optionalGuideRails,
  };

  componentDict.sidePlate = {
    type: 'sidePlate',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: sidePlate,
    optionalComponent: optionalSidePlates,
  };

  componentDict.roller = {
    type: 'roller',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: roller,
    optionalComponent: optionalRollers,
  };

  componentDict.motor = {
    type: 'motor',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: motor,
    optionalComponent: optionalMotors,
  };

  componentDict.motorAccessories = {
    type: 'motorAccessories',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: motorAccessory,
    optionalComponent: optionalMotorAccessories,
  };

  componentDict.headBox = {
    type: 'headBox',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: headBox,
    optionalComponent: optionalHeadBoxes,
  };

  componentDict.backBone = {
    type: 'backBone',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: backBone,
    optionalComponent: optionalBackBones,
  };

  componentDict.middlePillar = {
    type: 'middlePillar',
    shouldInit: true,
    number: undefined,
    desc: '',
    material: '',
    materialSurface: '',
    density: null,
    isPainted: false, // 是否應該根據表面判斷是否預設烤漆?
    quantity: '',
    price: '',
    rawData: middlePillar,
    optionalComponent: optionalMiddlePillars,
  };

  return { componentDict, changedMotorVendor };
}; // createComponentDict

// ========================================================================

// MARK: filterComponent
const filterComponent = (classProd: ClassProd, availableComponents: TdoorComponentListDto) => {
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
    // isWaterProof: classProd.data.bottomBar === '止水型',
    isWaterProof: classProd.doorModelName === 'W2' ? true : classProd.data.bottomBar === '止水型',
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
    // gearNumber: classProd.data.gearNumber || 'null',
    // motorVendor: motorVendor || 'null',
    phase: Number(classProd.data.motorPhase ?? NaN),
    // voltage: Number(classProd.data.motorVoltage ?? NaN),
    weight: Number(classProd.data.weight ?? NaN),
    // hasSupportStand: !!classProd.data.hasMotorSupportStand,
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
      // gearNumber: classProd.data.gearNumber || 'null',
      // motorVendor: motorVendor || 'null',
      phase: Number(classProd.data.motorPhase ?? NaN),
      // voltage: Number(classProd.data.motorVoltage ?? NaN),
      weight: Number(classProd.data.weight ?? NaN),
      // hasSupportStand: !!classProd.data.hasMotorSupportStand,
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

    motor,
    optionalMotors,

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

// 過濾參數一覽
// slat
// isAntiTyphoon: !!classProd.data.isAntiTyphoon,

// bottomBar;
// isAntiTyphoon: !!classProd.data.isAntiTyphoon,
// isWaterProof: classProd.data.bottomBar === '止水型',
// hasAluminumBarrier: classProd.data.bottomBar === '鋁障感型',

// guideRail;
// thickness: Number(classProd.data.guideRailThickness),
// isAntiTyphoon: !!classProd.data.isAntiTyphoon,
// hasSilencingStrip: !!classProd.data.hasSilencingStrip,
// imageName: classProd.data.guideRail || 'null',
// isUL: !!classProd.data.isULGuideRail,

// sidePlate;
// bearingType: classProd.data.bearingName || 'null',
// gearNumber: classProd.data.gearNumber,
// isIntegrated: !!classProd.data.isIntegratedHeadBox,
// motorVendor: classProd.data.motorVendor || 'null',
// sizeB: classProd.boxB_mm,
// weight: Number(classProd.data.weight ?? NaN),

// roller;
// diameter: classProd.data.diameter ?? '-1',

// motor;
// horsePower: classProd.data.horsepower,
// phase: Number(classProd.data.motorPhase ?? NaN),
// weight: Number(classProd.data.weight ?? NaN),

// motorAccessory
// chains: Number(classProd.data.sprocketWheelChains ?? NaN),
// bearingType: classProd.data.bearingName ?? 'null',
// gearNumber: classProd.data.gearNumber ?? 'null',

// headBox
// thickness: Number(classProd.data.headBoxThickness ?? NaN),
// isIntegrated: !!classProd.data.isIntegratedHeadBox,

// backBone
// 沒有

// middlePillar
// 沒有
