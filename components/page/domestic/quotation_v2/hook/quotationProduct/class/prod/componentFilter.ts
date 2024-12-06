import type { TdoorComponentListDto } from 'js/api/dtoTypes';

const filter_slat = (
  slats: TdoorComponentListDto['slats'],
  params: {
    isAntiTyphoon: boolean;
  }
) => {
  const { isAntiTyphoon } = params;

  const optionalArr = slats.filter((slat) => {
    return slat.isAntiTyphoon === isAntiTyphoon;
  });

  const slat = (optionalArr[0] || null) as TdoorComponentListDto['slats'][number] | null;

  return {
    slat,
    optionalSlats: optionalArr,
  };
};

const filter_bottomBar = (
  bottomBars: TdoorComponentListDto['bottomBars'],
  params: {
    isAntiTyphoon: boolean;
    isWaterProof: boolean;
    hasAluminumBarrier: boolean;
  }
) => {
  const { isAntiTyphoon, isWaterProof, hasAluminumBarrier } = params;

  const optionalArr = bottomBars.filter((bottomBar) => {
    return (
      bottomBar.isAntiTyphoon === isAntiTyphoon &&
      bottomBar.isWaterProof === isWaterProof &&
      bottomBar.hasAluminumBarrier === hasAluminumBarrier
    );
  });

  const bottomBar = (optionalArr[0] || null) as TdoorComponentListDto['bottomBars'][number] | null;

  return {
    bottomBar,
    optionalBottomBars: optionalArr,
  };
};

const filter_guideRail = ({
  guideRails,
  params,
}: {
  guideRails: TdoorComponentListDto['guideRails'];
  params: {
    thickness: `${number}` | number;
    isAntiTyphoon: boolean;
    hasSilencingStrip: boolean; // 消音條
    imageName: string;
    isUL: boolean;
  };
}) => {
  const { thickness, isAntiTyphoon, hasSilencingStrip, imageName, isUL } = params;

  const optionalArr = guideRails.filter((guideRail) => {
    return (
      Number(guideRail.thickness) === Number(thickness) &&
      guideRail.isAntiTyphoon === isAntiTyphoon &&
      guideRail.hasSilencingStrip === hasSilencingStrip &&
      (guideRail.imageName === imageName || guideRail.imageName === null) &&
      guideRail.isUL === isUL
    );
  });

  const guideRail = (optionalArr[0] || null) as TdoorComponentListDto['guideRails'][number] | null;

  return {
    guideRail,
    optionalGuideRails: optionalArr,
  };
};

const filter_sidePlate = (
  sidePlates: TdoorComponentListDto['sidePlates'],
  params: {
    bearingType: string; // 軸承
    gearNumber: string | undefined | null; // 鍊齒輪番號
    isIntegrated: boolean; // 一體式捲箱
    motorVendor: string; // 馬達廠商
    sizeB: number;
    weight: number; // /products/door/calc-general-spec給的weight
  }
) => {
  const { bearingType, gearNumber, isIntegrated, motorVendor, weight, sizeB } = params;

  const optionalArr = sidePlates.filter((sidePlate) => {
    let { maxDoorWeight, minDoorWeight } = sidePlate;

    // 規則為 值若為null就不比較，應該可以這樣吧
    maxDoorWeight = maxDoorWeight !== null ? maxDoorWeight : Infinity;
    minDoorWeight = minDoorWeight !== null ? minDoorWeight : -Infinity;
    const isWeightInRange = weight >= minDoorWeight && weight <= maxDoorWeight;

    return (
      (sidePlate.bearingType === bearingType || sidePlate.bearingType === null) &&
      (sidePlate.gearNumber === gearNumber || sidePlate.gearNumber === null) &&
      (sidePlate.isIntegrated === isIntegrated || sidePlate.isIntegrated === null) &&
      (sidePlate.motorVendor === motorVendor || sidePlate.motorVendor === null) &&
      (sidePlate.sizeB === sizeB || sidePlate.sizeB === null) &&
      isWeightInRange
    );
  });

  const sidePlate = (optionalArr[0] || null) as TdoorComponentListDto['sidePlates'][number] | null;

  return {
    sidePlate,
    optionalSidePlates: optionalArr,
  };
};

const filter_roller = (
  rollers: TdoorComponentListDto['rollers'],
  params: {
    diameter: string;
  }
) => {
  const { diameter } = params;

  const optionalArr = rollers.filter((roller) => {
    return roller.diameter === diameter;
  });

  const roller = (optionalArr[0] || null) as TdoorComponentListDto['rollers'][number] | null;

  return {
    roller,
    optionalRollers: optionalArr,
  };
};

const filter_motor = (
  motors: TdoorComponentListDto['motors'],
  params: {
    horsePower: string; // 馬力數
    gearNumber: string; // 鍊齒輪番號
    motorVendor: string; // 馬達廠商
    phase: number; // 相數
    voltage: number; // 電壓(V)
    weight: number; // 荷重(kg) 用weight來比
    hasSupportStand: boolean; // 有腳 // 馬達支撐架
  }
) => {
  const { gearNumber, motorVendor, phase, voltage, weight, hasSupportStand } = params;
  let horsePower = params.horsePower;

  const optionalArr = motors.filter((motor) => {
    let motorHP = motor.horsePower;
    motorHP === '1 1/2HP' && (motorHP = '1.5HP');
    horsePower === '1 1/2HP' && (horsePower = '1.5HP');

    return (
      motorHP === horsePower &&
      // motor.gearNumber === gearNumber &&
      // motor.motorVendor === motorVendor &&
      motor.phase === phase &&
      // motor.voltage === voltage &&
      // motor.hasSupportStand === hasSupportStand &&
      (motor.loadWeight === null || motor.loadWeight >= weight)
    );
  });

  const motor = (optionalArr[0] || null) as TdoorComponentListDto['motors'][number] | null;

  return {
    motor,
    optionalMotors: optionalArr,
  };
};

const filter_motorAccessory = (
  motorAccessories: TdoorComponentListDto['motorAccessories'],
  params: {
    chains: number; // 鍊條排數
    bearingType: string; // 軸承
    gearNumber: string;
  }
) => {
  const { chains, bearingType, gearNumber } = params;

  const optionalArr = motorAccessories.filter((motorAccessory) => {
    return (
      motorAccessory.chains === chains &&
      motorAccessory.bearingType === bearingType &&
      (motorAccessory.gearNumber === gearNumber || motorAccessory.gearNumber === null)
    );
  });

  const motorAccessory = (optionalArr[0] || null) as TdoorComponentListDto['motorAccessories'][number] | null;

  return {
    motorAccessory,
    optionalMotorAccessories: optionalArr,
  };
};

const filter_headBox = (
  headBoxes: TdoorComponentListDto['headBoxes'],
  params: {
    thickness: `${number}` | number; // 厚度 // 主產品設定裡的捲箱厚度
    isIntegrated: boolean; // 一體式捲箱
  }
) => {
  const { thickness, isIntegrated } = params;

  const optionalArr = headBoxes.filter((headBox) => {
    return Number(headBox.thickness) === Number(thickness) && headBox.isIntegrated === isIntegrated;
  });

  const headBox = (optionalArr[0] || null) as TdoorComponentListDto['headBoxes'][number] | null;

  return {
    headBox,
    optionalHeadBoxes: optionalArr,
  };
};

const filter_backBone = (backBones: TdoorComponentListDto['backBone']) => {
  const backBone = backBones?.[0] || null;
  const optionalArr = backBones?.filter(() => true) ?? [];

  return {
    backBone,
    optionalBackBones: optionalArr,
  };
};

const filter_middlePillar = (middlePillars: TdoorComponentListDto['middlePillar']) => {
  const middlePillar = middlePillars?.[0] || null;
  const optionalArr = middlePillars?.filter(() => true) ?? [];

  return {
    middlePillar,
    optionalMiddlePillars: optionalArr,
  };
};

export {
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
};
