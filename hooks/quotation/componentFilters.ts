// type
import type { TdoorComponentListDto } from 'js/api/dtoTypes';
import { title } from 'process';

// slats
// bottomBars
// guideRails
// sidePlates
// rollers
// motors
// motorAccessories
// headBoxes

const filter_slats = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['slats'];
  filterParams: {
    isAntiTyphoon: boolean;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    return data.isAntiTyphoon === filterParams.isAntiTyphoon;
  });

  if (!filteredArr[0]) {
    console.log('slat', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_bottomBars = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['bottomBars'];
  filterParams: {
    isAntiTyphoon: boolean;
    isWaterProof: boolean;
    hasAluminumBarrier: boolean;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    if (data.isAntiTyphoon !== filterParams.isAntiTyphoon) {
      return false;
    } else if (data.isWaterProof !== filterParams.isWaterProof) {
      return false;
    } else if (data.hasAluminumBarrier !== filterParams.hasAluminumBarrier) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('bottomBars', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_guideRails = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['guideRails'];
  filterParams: {
    thickness: string; // 不用過濾
    isAntiTyphoon: boolean;
    /**消音條 */
    hasSilencingStrip: boolean; // 消音條
    imageName: string;
    isUL: boolean;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    if (Number(data.thickness) !== Number(filterParams.thickness)) {
      return false;
    } else if (data.isAntiTyphoon !== filterParams.isAntiTyphoon) {
      return false;
    } else if (data.imageName !== null && data.imageName !== filterParams.imageName) {
      return false;
    } else if (data.hasSilencingStrip !== filterParams.hasSilencingStrip) {
      // if (Number(data.thickness) !== 4.5) {
      //   return false;
      // }
      return false;
    } else if (data.isUL !== filterParams.isUL) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('guideRails', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_sidePlates = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['sidePlates'];
  filterParams: {
    bearingType: string; // 軸承
    gearNumber: string | undefined; // 鍊齒輪番號
    /**一體式捲箱 */
    isIntegrated: boolean; // 一體式捲箱
    motorVendor: string; // 馬達廠商
    weight: number; // /products/door/calc-general-spec給的weight
    sizeB: number;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    if (data.bearingType !== null && data.bearingType !== filterParams.bearingType) {
      return false;
    } else if (data.gearNumber !== null && data.gearNumber !== filterParams.gearNumber) {
      return false;
    } else if (data.isIntegrated !== null && data.isIntegrated !== filterParams.isIntegrated) {
      return false;
    } else if (data.motorVendor !== null && data.motorVendor !== filterParams.motorVendor) {
      return false;
    } else if (data.sizeB !== null && data.sizeB !== filterParams.sizeB) {
      return false;
    } else if (data.maxDoorWeight !== null && data.maxDoorWeight < filterParams.weight) {
      return false;
    } else if (data.minDoorWeight !== null && data.minDoorWeight >= filterParams.weight) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('sidePlates', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_rollers = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['rollers'];
  filterParams: {
    diameter: string;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    if (data.diameter !== filterParams.diameter) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('roller', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_motors = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['motors'];
  filterParams: {
    horsePower: string; // 馬力數
    // gearNumber: string; // 鍊齒輪番號 // DuST說先略過
    gearNumber: string; // 鍊齒輪番號 // 那時好像是因為沒有鍊齒輪番號的資料所以才先略過
    motorVendor: string; // 馬達廠商
    phase: number; // 相數
    /**電壓(V) */
    voltage: number; // 電壓(V)
    /**荷重(kg) */
    weight: number; // 荷重(kg) 用weight來比
    hasSupportStand: boolean; // 有腳 // 馬達支撐架
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let horsePoswer = filterParams.horsePower;
    let d_horsePower = data.horsePower;

    if (horsePoswer === '1 1/2HP') {
      horsePoswer = '1.5HP';
    }

    if (d_horsePower === '1 1/2HP') {
      d_horsePower = '1.5HP';
    }

    if (d_horsePower !== horsePoswer) {
      return false;
    }
    //  else if (data.gearNumber !== filterParams.gearNumber) {
    //   return false;
    // }
    // else if (data.motorVendor !== null && data.motorVendor !== filterParams.motorVendor) {
    //   return false;
    // }
    else if (data.phase !== null && data.phase !== filterParams.phase) {
      return false;
    }
    //  else if (data.voltage !== null && data.voltage !== filterParams.voltage) {
    //   return false;
    // }
    else if (data.loadWeight !== null && data.loadWeight < filterParams.weight) {
      return false;
    }
    // else if (data.hasSupportStand !== null && data.hasSupportStand !== filterParams.hasSupportStand) {
    //   return false;
    // }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('motors', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_motorAccessories = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['motorAccessories'];
  filterParams: {
    /**鍊條排數 */
    chains: number; // 鍊條排數
    /**軸承 */
    bearingType: string; // 軸承
    gearNumber: string;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    if (data.chains !== filterParams.chains) {
      return false;
    } else if (data.bearingType !== filterParams.bearingType) {
      return false;
    } else if (data.gearNumber !== null && data.gearNumber !== filterParams.gearNumber) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('motorAccessories', filterParams);
  }

  return filteredArr[0] || null;
};

const filter_headBoxes = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['headBoxes'];
  filterParams: {
    thickness: string; // 厚度 // 主產品設定裡的捲箱厚度
    /**一體式捲箱 */
    isIntegrated: boolean; // 一體式捲箱
  };
}) => {
  const fThickness_num = Number(filterParams.thickness);

  const filteredArr = dataArr.filter((data) => {
    const dThickness_num = Number(data.thickness);

    if (isNaN(fThickness_num)) {
      return false;
    } else if (dThickness_num !== fThickness_num) {
      return false;
    } else if (data.isIntegrated !== filterParams.isIntegrated) {
      return false;
    }

    return true;
  });

  if (!filteredArr[0]) {
    console.log('headBoxes', filterParams);
  }

  return filteredArr[0] || null;
};

// ================================================================================

type TerrorTip = {
  title: string;
  content: string;
};

type Tlookup_errorTip = {
  slat: TerrorTip;
  bottomBar: TerrorTip;
  guideRail: TerrorTip;
  sidePlate: TerrorTip;
  roller: TerrorTip;
  motor: TerrorTip;
  motorAccessory: TerrorTip;
  headBox: TerrorTip;
  [key: string]: TerrorTip | undefined;
};

const lookup_errorTip: Tlookup_errorTip = {
  slat: {
    title: '沒有適配的門片，請檢查相關參數是否正確',
    content: '相關參數: 防颱',
  },
  bottomBar: {
    title: '沒有適配的底座，請檢查相關參數是否正確',
    content: '相關參數: 防颱、底座類型(止水型、鋁障感型)',
  },
  guideRail: {
    title: '沒有適配的門軌，請檢查相關參數是否正確',
    content: '相關參數: 防颱、厚度、消音條、UL、形式(圖片選項)',
  },
  sidePlate: {
    title: '沒有適配的支板，請檢查相關參數是否正確',
    content: '相關參數: 軸承、齒輪、捲箱形式(一體式或捲加機)、馬達廠商、重量(由門型、寬、高、防颱計算而出)、支板尺寸B',
  },
  roller: {
    title: '沒有適配的捲軸，請檢查相關參數是否正確',
    content: '相關參數: 捲軸直徑',
  },
  motor: {
    title: '沒有適配的馬達，請檢查相關參數是否正確',
    content: '相關參數: 馬力、齒輪、馬達廠商、電相、電壓、馬達支撐架、重量(由門型、寬、高、防颱計算而出)',
  },
  motorAccessory: {
    title: '沒有適配的馬達配件，請檢查相關參數是否正確',
    content: '相關參數: 鍊條排數、軸承、齒輪',
  },
  headBox: {
    title: '沒有適配的捲箱，請檢查相關參數是否正確',
    content: '相關參數: 捲箱厚度、捲箱形式(一體式或捲加機)',
  },
};

// ================================================================================

export {
  filter_slats,
  filter_bottomBars,
  filter_guideRails,
  filter_sidePlates,
  filter_rollers,
  filter_motors,
  filter_motorAccessories,
  filter_headBoxes,
  //
  lookup_errorTip,
};
