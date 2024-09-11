type TpariBD = {
  [key: string]:
    | {
        BtoD: {
          [key: string]: string | undefined;
        };
        DtoB: {
          [key: string]: string | undefined;
        };
      }
    | undefined;
};
// 單位為公尺
export const lookup_boxBAndBoxD: TpariBD = {
  'SJ-302': {
    BtoD: {
      '0.35': '0.56',
      '0.40': '0.60',
      '0.45': '0.65',
      '0.50': '0.75',
      '0.55': '0.80',
      '0.60': '0.90',
    },
    DtoB: {
      '0.56': '0.35',
      '0.60': '0.40',
      '0.65': '0.45',
      '0.75': '0.50',
      '0.80': '0.55',
      '0.90': '0.60',
    },
  },
};

// 配電箱及按鈕開關
export const lookup_distributionBoxPrice: { [key: string]: number | undefined } = {
  '1/4HP': 5940,
  '1/3HP': 5940,
  '1/2HP': 5940,
  '3/4HP': 5940,
  '1HP': 5940,
  '1 1/2HP': 5940,
  '1.5HP': 5940,
  '2HP': 12900,
  '3HP': 12900,
  '5HP': 13500,
};

// 馬力對照表
export const lookup_horsePowerToNumber: { [key: string]: number | undefined } = {
  '1/4HP': 0.25,
  '1/3HP': 0.33,
  '1/2HP': 0.5,
  '3/4HP': 0.75,
  '1HP': 1,
  '1 1/2HP': 1.5,
  '1.5HP': 1.5,
  '2HP': 2,
  '3HP': 3,
  '5HP': 5,
};

// 這些unicode是客製unicode，必須要安裝指定的字型才能看到
// 該字型是天心系統附的，需要安裝的話找會計部怡君
// 門軌unicode查找表
export const lookup_guideRailUnicode: {
  [guideRail: string]: string | undefined;
} = {
  // SJ-302
  SJ302_30: '\uE010',
  SJ302_75_30t: '\uE013',
  SJ302_90_30t: '\uE013',
  SJ302_95_30t: '\uE016',
  SJ302_95_45t: '\uE016',
  SJ302_60: '\uE011',
  // SJ-312
  SJ312_106_60t: '\uE014',
};

export const findGuideRailUnicode = ({ guideRail }: { guideRail: string }) => {
  return lookup_guideRailUnicode[guideRail] || '';
};

export const lookup_hpToGapAGapC = {
  '1/4HP': {
    HPValue: 0.25,
    outputTooth: 9,
    reelGear: 50,
    gapA: 30,
    gapC: 20,
  },
  '1/3HP': {
    HPValue: 0.3,
    outputTooth: 9,
    reelGear: 50,
    gapA: 40,
    gapC: 20,
  },
  '1/2HP': {
    HPValue: 0.5,
    outputTooth: 9,
    reelGear: 50,
    gapA: 50,
    gapC: 20,
  },
  '3/4HP': {
    HPValue: 0.75,
    outputTooth: 9,
    reelGear: 50,
    gapA: 60,
    gapC: 20,
  },
  '1HP': {
    HPValue: 1,
    outputTooth: 9,
    reelGear: 50,
    gapA: 70,
    gapC: 20,
  },
  '1 1/2HP': {
    HPValue: 1.5,
    outputTooth: 9,
    reelGear: 60,
    gapA: 70,
    gapC: 20,
  },
  '2HP': {
    HPValue: 2,
    outputTooth: 15,
    reelGear: 60,
    gapA: 120,
    gapC: 20,
  },
  '3HP': {
    HPValue: 3,
    outputTooth: 15,
    reelGear: 60,
    gapA: 150,
    gapC: 20,
  },
  '5HP': {
    HPValue: 5,
    outputTooth: 17,
    reelGear: 60,
    gapA: 170,
    gapC: 20,
  },
  '50Nm': {
    HPValue: 50,
    outputTooth: 17,
    reelGear: 60,
    gapA: 40,
    gapC: 10,
  },
};

export const lookup_motorPhase = {
  '1': '單相',
  '3': '三相',
} as const;

export const lookup_motorPhase_reverse = {
  單相: '1',
  三相: '3',
} as const;
