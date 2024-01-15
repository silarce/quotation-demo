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
export const lookup_guideRailUnicode = {
  normal_silencing: '\uE011',
  normal: '\uE010',
  antiTyphoon: '\uE013',
  antiTyphoon_silencing: '\uE016',
  //
  normal_silencing_thin: '\uE001',
  normal_thin: '\uE000',
  antiTyphoon_thin: '\uE003',
  antiTyphoon_silencing_thin: '\uE016',
  //
  unknown01: '\uE002',
  unknown02: '\uE004',
  unknown03: '\uE005',
  // unknown04: '\uE006',
  // unknown05: '\uE007',
  // unknown06: '\uE008',
  // unknown07: '\uE009',
  // unknown08: '\uE010',
  // unknown09: '\uE011',
  unknown10: '\uE012',
  // unknown11: '\uE013',
  // unknown12: '\uE014',
  unknown13: '\uE015',
};

export const findGuideRailUnicode = ({
  isAntiTyphoon,
  isSilencing,
}: {
  isAntiTyphoon: boolean;
  isSilencing: boolean;
}) => {
  let index: keyof typeof lookup_guideRailUnicode = 'normal';

  if (isAntiTyphoon) {
    index = 'antiTyphoon';
  }

  if (isSilencing) {
    index = `${index}_silencing`;
  }

  return lookup_guideRailUnicode[index];
};
