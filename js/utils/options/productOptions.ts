import { Toption, addEmpty } from './options';
import { annotationAndQuotationRangeType } from 'js/api/dtoTypes';
import { annotationAndQuotationRangeTypeLookup } from 'config/lookupTable';

export type { Toption };

const createOptionsCreator = ({ optionsArr }: { optionsArr: Toption[] }) => {
  const fuc = ({ haveEmpty }: { haveEmpty?: boolean } = {}): Toption[] => {
    const arr = optionsArr;

    if (haveEmpty) {
      addEmpty(arr);
    }

    return arr;
  };

  return fuc;
};

// 類別
export const optionsCreator_category = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: '防火防煙捲門系列', label: '防火防煙捲門系列' },
    { value: '防水防洪門系列', label: '防水防洪門系列' },
    { value: '抗風防颱捲門系列', label: '抗風防颱捲門系列' },
    { value: '上折門', label: '上折門' },
    { value: '廠辦管制門', label: '廠辦管制門' },
    { value: '圍牆大門', label: '圍牆大門' },
    { value: '機械門', label: '機械門' },
    { value: '客製化', label: '客製化' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

// 門型
export const optionsCreator_doorModel = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { quoteType: '捲門', value: 'SJ-302' as const, label: 'SJ-302 電動防火捲門P:110', name: '電動防火捲門P:110' },
    { quoteType: '捲門', value: 'SJ-312' as const, label: 'SJ-312 重型防颱捲門P:120', name: '重型防颱捲門P:120' },
    { quoteType: '捲門', value: 'SJ-303S' as const, label: 'SJ-303S 遮煙捲簾', name: '遮煙捲簾' },
    { quoteType: '捲門', value: 'SJ-305D' as const, label: 'SJ-305D 花格型捲門', name: '花格型捲門' },
    { quoteType: '捲門', value: 'SJ-120A' as const, label: 'SJ-120A 120A葉片式阻熱捲門', name: '120A葉片式阻熱捲門' },
    { quoteType: '捲門', value: 'SJ-303A' as const, label: 'SJ-303A 60A葉片式阻熱捲門', name: '60A葉片式阻熱捲門' },
    { quoteType: '捲門', value: 'SJ-303F' as const, label: 'SJ-303F 60A折疊式阻熱捲門', name: '60A折疊式阻熱捲門' },
    {
      quoteType: '捲門',
      value: 'SJ-303AS' as const,
      label: 'SJ-303AS 60A葉片式阻熱具遮煙性',
      name: '60A葉片式阻熱具遮煙性',
    },
    { quoteType: '捲門', value: 'SJ-PVC' as const, label: 'SJ-PVC PVC飛迅門', name: 'PVC飛迅門' },
    { quoteType: '捲門', value: 'SJ-OSD' as const, label: 'SJ-OSD 滑升門', name: '滑升門' },
    { quoteType: '捲門', value: 'SJ-HSD' as const, label: 'SJ-HSD 快速捲門', name: '快速捲門' },
    { quoteType: '捲門', value: 'SJ-FDS' as const, label: 'SJ-FDS 電動防水捲門', name: '電動防水捲門' },
    { quoteType: '捲門', value: 'SJ-60BS' as const, label: 'SJ-60BS 防火遮煙捲簾', name: '防火遮煙捲簾' },
    //
    { quoteType: '伸縮大門', value: 'L' as const, label: 'L L型電動大門', name: 'L型電動大門' },
    { quoteType: '伸縮大門', value: 'S' as const, label: 'S S型電動大門', name: 'S型電動大門' },
    { quoteType: '伸縮大門', value: 'SL1' as const, label: 'SL1 1300伸縮', name: '1300伸縮' },
    { quoteType: '伸縮大門', value: 'SL2' as const, label: 'SL2 1500伸縮', name: '1500伸縮' },
    { quoteType: '伸縮大門', value: 'SM' as const, label: 'SM 1750伸縮', name: '1750伸縮' },
    { quoteType: '伸縮大門', value: 'SH' as const, label: 'SH 1950伸縮', name: '1950伸縮' },
    { quoteType: '伸縮大門', value: 'SX' as const, label: 'SX 伸縮大門', name: '伸縮大門' },
    { quoteType: '伸縮大門', value: 'SS' as const, label: 'SS S型小門', name: 'S型小門' },
    //
    { quoteType: '水閘門', value: 'W1' as const, label: 'W1 扇形水閘門', name: '扇形水閘門' },
    { quoteType: '水閘門', value: 'W2' as const, label: 'W2 插板水閘門', name: '插板水閘門' },
    { quoteType: '水閘門', value: 'W3' as const, label: 'W3 電動油壓水閘門', name: '電動油壓水閘門' },
    { quoteType: '水閘門', value: 'W4' as const, label: 'W4 水密門', name: '水密門' },
    { quoteType: '水閘門', value: 'W5' as const, label: 'W5 無框水閘門', name: '無框水閘門' },
    { quoteType: '水閘門', value: 'W6' as const, label: 'W6 溝渠式水閘門', name: '溝渠式水閘門' },
    //
    { quoteType: '客製化', value: 'SP' as const, label: 'SP 特殊大門', name: '特殊大門' },
    //
    // { quoteType: '上折門', value: '無資料' as const, label: '無資料', name: '重型防颱捲門P:120' },
    // { quoteType: '上折門', value: '無資料' as const, label: '無資料', name: '輕型' },
    // { quoteType: '上折門', value: '無資料' as const, label: '無資料', name: '中型' },
    // //
    // { quoteType: '機庫門', value: '無資料' as const, label: '無資料', name: '柔性門' },
    // { quoteType: '機庫門', value: '無資料' as const, label: '無資料', name: '橫移式機庫門' },
    { quoteType: '上折門', value: '重型防颱捲門P:120' as const, label: '重型防颱捲門P:120', name: '重型防颱捲門P:120' },
    { quoteType: '上折門', value: '輕型' as const, label: '輕型', name: '輕型' },
    { quoteType: '上折門', value: '中型' as const, label: '中型', name: '中型' },
    //
    { quoteType: '機庫門', value: '柔性門' as const, label: '柔性門', name: '柔性門' },
    { quoteType: '機庫門', value: '橫移式機庫門' as const, label: '橫移式機庫門', name: '橫移式機庫門' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

/**後端可以接收的門型 */
export const optionsCreator_doorModel_2 = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: 'SJ-302', label: 'SJ-302' },
    { value: 'SJ-303A', label: 'SJ-303A' },
    { value: 'SJ-303AS', label: 'SJ-303AS' },
    { value: 'SJ-303S', label: 'SJ-303S' },
    { value: 'SJ-305D', label: 'SJ-305D' },
    { value: 'SJ-312', label: 'SJ-312' },
    { value: 'SJ-120A', label: 'SJ-120A' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

// 門的形式
export const optionsCreator_doorForm = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;

  const arr = [
    { value: 'normal', label: annotationAndQuotationRangeTypeLookup['normal'] },
    { value: 'anti-typhoon', label: annotationAndQuotationRangeTypeLookup['anti-typhoon'] },
    { value: 'heat-protection', label: annotationAndQuotationRangeTypeLookup['heat-protection'] },
    {
      value: 'heat-protection-smoke-covering',
      label: annotationAndQuotationRangeTypeLookup['heat-protection-smoke-covering'],
    },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

// 報價別
export const optionsCreator_quoteType = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: '捲門' as const, label: '捲門' },
    // { value: '伸縮大門' as const, label: '伸縮大門' },
    // { value: '水閘門' as const, label: '水閘門' },
    // { value: '上折門' as const, label: '上折門' },
    // { value: '機庫門' as const, label: '機庫門' },
    // { value: '客製化' as const, label: '客製化' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

export const optionsCreator_quoteType_02 = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: '捲門' as const, label: '捲門' },
    { value: '伸縮大門' as const, label: '伸縮大門' },
    { value: '水閘門' as const, label: '水閘門' },
    { value: '上折門' as const, label: '上折門' },
    { value: '機庫門' as const, label: '機庫門' },
    { value: '客製化' as const, label: '客製化' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

export const optionsCreator_bottomBar = createOptionsCreator({
  optionsArr: [
    { value: 'none', label: '無' },
    { value: '鋁障感型', label: '鋁障感型' },
    { value: '止水型', label: '止水型' },
  ],
});

export const optionsCreator_bottomBar_2 = createOptionsCreator({
  optionsArr: [
    { value: 'null', label: '無' },
    { value: '鋁障感型', label: '鋁障感型' },
    { value: '止水型', label: '止水型' },
  ],
});

export const optionsCreator_motorLockBox = createOptionsCreator({
  optionsArr: [
    { value: '外露', label: '外露' },
    { value: '防盜', label: '防盜' },
  ],
});

export const optionsCreator_rollerSpec = createOptionsCreator({
  optionsArr: [
    { value: '無凸', label: '無凸' },
    { value: '雙凸', label: '雙凸' },
  ],
});

export const optionsCreator_closingType = createOptionsCreator({
  optionsArr: [
    { value: '電動', label: '電動' },
    { value: '手動', label: '手動' },
  ],
});

export const optionsCreator_chainType = createOptionsCreator({
  optionsArr: [
    { value: '單排', label: '單排' },
    { value: '雙排', label: '雙排' },
  ],
});

export const optionsCreator_direction = createOptionsCreator({
  optionsArr: [
    { value: '左', label: '左' },
    { value: '右', label: '右' },
  ],
});

export const optionsCreator_bendStright = createOptionsCreator({
  optionsArr: [
    { value: '彎', label: '彎' },
    { value: '直', label: '直' },
  ],
});

export const optionsCreator_isIntegratedHeadBox = createOptionsCreator({
  optionsArr: [
    { value: 'true', label: '一體式捲箱' },
    { value: 'false', label: '捲箱加機箱' },
  ],
});

export const optionsCreator_boolean = createOptionsCreator({
  optionsArr: [
    { value: 'true', label: '有' },
    { value: 'false', label: '無' },
  ],
});

export const optionsCreator_horsePower = createOptionsCreator({
  optionsArr: [
    { value: '1/4HP', label: '1/4HP', hpValue: '0.25' },
    { value: '1/3HP', label: '1/3HP', hpValue: '0.33' },
    { value: '1/2HP', label: '1/2HP', hpValue: '0.5' },
    { value: '3/4HP', label: '3/4HP', hpValue: '0.75' },
    { value: '1HP', label: '1HP', hpValue: '1' },
    { value: '1 1/2HP', label: '1 1/2HP', hpValue: '1.5' },
    { value: '2HP', label: '2HP', hpValue: '2' },
    { value: '3HP', label: '3HP', hpValue: '3' },
    { value: '5HP', label: '5HP', hpValue: '5' },
  ],
});

const options_horsePower = optionsCreator_horsePower();

export const lookup_horsePowerToToptions = {
  '1/4HP': options_horsePower[0],
  '1/3HP': options_horsePower[1],
  '1/2HP': options_horsePower[2],
  '3/4HP': options_horsePower[3],
  '1HP': options_horsePower[4],
  '1 1/2HP': options_horsePower[5],
  '2HP': options_horsePower[6],
  '3HP': options_horsePower[7],
  '5HP': options_horsePower[8],
} as const;

export const optionsCreator_productMaterial = createOptionsCreator({
  optionsArr: [
    { value: '黑鐵', label: '鐵材烤漆' },
    { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
    { value: 'SST#304', label: 'SST#304' },
    { value: 'SST#316', label: 'SST#316' },
    { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
  ],
});

export const optionsCreator_componentMaterial_01 = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
    { value: 'SST#304', label: 'SST#304' },
    { value: 'SST#316', label: 'SST#316' },
    { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
  ],
});

export const optionsCreator_componentMaterial_02 = createOptionsCreator({
  optionsArr: [{ value: '黑鐵', label: '黑鐵' }],
});

export const optionsCreator_componentMaterial_03 = createOptionsCreator({
  optionsArr: [{ value: '其他', label: '其他' }],
});

// !如果options有變動，要去確認hooks/quotation/prodCellConfig.ts的bottomBarAngleIron有沒有不對
export const optionsCreator_bottomBarAngleIron = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 50*50*4T', label: '鍍鋅 50*50*4T', material: '鍍鋅鋼板' },
    // { value: '高耐鍍鋅鋼板 50*50*3T', label: '高耐鍍鋅鋼板 50*50*3T', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 50*50*3T', label: '不鏽鋼#304 50*50*3T', material: 'SST#304' },
    { value: '不鏽鋼#316 50*50*3T', label: '不鏽鋼#316 50*50*3T', material: 'SST#316' },
  ],
});

// !如果options有變動，要去確認hooks/quotation/prodCellConfig.ts的bottomBarPlate有沒有不對
export const optionsCreator_bottomBarPlate = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.5T', label: '鍍鋅 1.5T', material: '鍍鋅鋼板' },
    // { value: '高耐鍍鋅鋼板 1.5T', label: '高耐鍍鋅鋼板 1.5T', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarAngleIron_303A = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.0T', label: '鍍鋅 1.0T', material: '鍍鋅鋼板' },
    { value: '高耐鍍鋅鋼板 1.0T', label: '高耐鍍鋅鋼板 1.0T', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.0T', label: '不鏽鋼#304 1.0T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.0T', label: '不鏽鋼#316 1.0T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarPlate_303A = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.5T', label: '鍍鋅 1.5T', material: '鍍鋅鋼板' },
    { value: '高耐鍍鋅鋼板 1.5T', label: '高耐鍍鋅鋼板 1.5T', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarAngleIron_303AS = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.0T', label: '鍍鋅 1.0T(含遮菸條)', material: '鍍鋅鋼板' },
    { value: '高耐鍍鋅鋼板 1.0T', label: '高耐鍍鋅鋼板 1.0T(含遮菸條)', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.0T', label: '不鏽鋼#304 1.0T(含遮菸條)', material: 'SST#304' },
    { value: '不鏽鋼#316 1.0T', label: '不鏽鋼#316 1.0T(含遮菸條)', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarPlate_303AS = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.5T', label: '鍍鋅 1.5T', material: '鍍鋅鋼板' },
    { value: '高耐鍍鋅鋼板 1.5T', label: '高耐鍍鋅鋼板 1.5T', material: '高耐鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarAngleIron_305D = createOptionsCreator({
  optionsArr: [
    { value: '不鏽鋼#304 50*50*3T', label: '不鏽鋼#304 50*50*3T', material: 'SST#304' },
    { value: '不鏽鋼#316 50*50*3T', label: '不鏽鋼#316 50*50*3T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarPlate_305D = createOptionsCreator({
  optionsArr: [
    { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarAngleIron_312 = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 75*75*6T', label: '鍍鋅 75*75*6T', material: '鍍鋅鋼板' },
    { value: '不鏽鋼#304 75*75*6T', label: '不鏽鋼#304 75*75*6T', material: 'SST#304' },
    { value: '不鏽鋼#316 75*75*6T', label: '不鏽鋼#316 75*75*6T', material: 'SST#316' },
  ],
});

export const optionsCreator_bottomBarPlate_312 = createOptionsCreator({
  optionsArr: [
    { value: '鍍鋅 1.5T', label: '鍍鋅 1.5T', material: '鍍鋅鋼板' },
    { value: '不鏽鋼#304 1.5T', label: '不鏽鋼#304 1.5T', material: 'SST#304' },
    { value: '不鏽鋼#316 1.5T', label: '不鏽鋼#316 1.5T', material: 'SST#316' },
  ],
});

export const optionsCreator_surface = createOptionsCreator({
  optionsArr: [
    { value: '2B', label: '2B' },
    { value: 'HL', label: 'HL' },
    { value: 'BA', label: 'BA' },
    { value: 'NO.4', label: 'NO.4' },
    { value: '烤漆', label: '烤漆' },
    { value: '氟碳', label: '氟碳' },
    { value: '無烤漆', label: '無烤漆' },
  ],
});
export const optionsCreator_surface_onlyPaint = createOptionsCreator({
  optionsArr: [
    { value: '烤漆', label: '烤漆' },
    { value: '氟碳', label: '氟碳' },
    { value: '無烤漆', label: '無烤漆' },
  ],
});

export const optionsCreator_boxB_SJ302 = createOptionsCreator({
  optionsArr: [
    { value: '0.35', label: '0.35' },
    { value: '0.40', label: '0.40' },
    { value: '0.45', label: '0.45' },
    { value: '0.50', label: '0.50' },
    { value: '0.55', label: '0.55' },
    { value: '0.60', label: '0.60' },
    { value: '0.70', label: '0.70' },
    { value: '0.75', label: '0.75' },
  ],
});
export const optionsCreator_boxB_SJ303A = createOptionsCreator({
  optionsArr: [
    { value: '0.63', label: '0.63' },
    { value: '0.70', label: '0.70' },
    { value: '0.77', label: '0.77' },
    { value: '0.82', label: '0.82' },
    { value: '0.88', label: '0.88' },
    { value: '0.95', label: '0.95' },
    { value: '1.02', label: '1.02' },
  ],
});

// 電供
export const optionsCreator_motorSupply = createOptionsCreator({
  optionsArr: [
    {
      value: '單相 220V',
      label: '單相 220V',
      phase: '1',
      voltage: '220',
    },
    {
      value: '三相 220V',
      label: '三相 220V',
      phase: '3',
      voltage: '220',
    },
    {
      value: '三相 380V',
      label: '三相 380V',
      phase: '3',
      voltage: '380',
    },
  ],
});

// 馬達支撐架
export const optionsCreator_motorSupportStand = createOptionsCreator({
  optionsArr: [
    { value: '有', label: '有' },
    { value: '無', label: '無' },
  ],
});

// 正面
export const optionsCreator_front = createOptionsCreator({
  optionsArr: [
    { value: '無', label: '無' },
    { value: '正雲白', label: '正雲白' },
    { value: '正乳白', label: '正乳白' },
  ],
});

// const optionsCreator_foooooo = (props: { haveEmpty?: boolean } = {}): Toption[] => {
//   const { haveEmpty } = props;
//   const arr = [{ value: 'foooo' as const, label: 'fooooo' }];

//   if (haveEmpty) {
//     addEmpty(arr);
//   }

//   return arr;
// };

// ===================================================================

const lookup_options_bottomBarAngleIronAndPlate = {
  'SJ-302': {
    angleIron: optionsCreator_bottomBarAngleIron,
    plate: optionsCreator_bottomBarPlate,
  },
  'SJ-303A': {
    angleIron: optionsCreator_bottomBarAngleIron_303A,
    plate: optionsCreator_bottomBarPlate_303A,
  },
  'SJ-303AS': {
    angleIron: optionsCreator_bottomBarAngleIron_303AS,
    plate: optionsCreator_bottomBarPlate_303AS,
  },
  'SJ-305D': {
    angleIron: optionsCreator_bottomBarAngleIron_305D,
    plate: optionsCreator_bottomBarPlate_305D,
  },
  'SJ-312': {
    angleIron: optionsCreator_bottomBarAngleIron_312,
    plate: optionsCreator_bottomBarPlate_312,
  },
} as const;

export { lookup_options_bottomBarAngleIronAndPlate };
