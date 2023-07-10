import _ from 'lodash';

// tool
import { generateYearArray } from 'js/tools/date/generateYearArray';

// icon
import iconDoorRail75 from 'public/image/icon/doorRail/doorRail75.svg';
import iconDoorRail60 from 'public/image/icon/doorRail/doorRail60.svg';
import iconDoorRail98 from 'public/image/icon/doorRail/doorRail98.svg';
import iconDoorRail_sj302_30 from 'public/image/fakeDB/doorRail/normal/SJ302_30.svg';
import iconDoorRail_sj302_75_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_75_30t.svg';
import iconDoorRail_sj302_90_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_90_30t.svg';
import iconDoorRail_sj302_95_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_30t.svg';
import iconDoorRail_sj302_95_45t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_45t.svg';

interface Toption {
  value: string;
  label: string;
  seriesType?: string;
  icon?: string;
  [key: string]: string | undefined;
}

interface ToptionPlus {
  obj: { [key: string]: Toption };
  options: Toption[];
}

/**會改變原本的陣列 */
const addEmpty = (optionArr: Toption[]) => {
  optionArr.unshift({ value: '', label: '不拘' });
};

// =======================================================================

const createNumberRangeOptionArr = ({
  start,
  end,
  suffix,
  padStart,
}: {
  start: number;
  end: number;
  suffix?: string;
  padStart?: [number, string];
}): Toption[] => {
  const arr = _.range(start, end + 1);
  const arrStr = arr.map((item) => item.toString());
  const arrOption = arrStr.map((item) => {
    const value = item;
    let label = item;

    if (padStart) {
      label = label.padStart(padStart[0], padStart[1]);
    }

    if (suffix) {
      label = label + suffix;
    }

    return { value, label };
  });

  return arrOption;
};

// =======================================================================

// 性別
export const optionsCreator_gender = (): Toption[] => [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

// 婚姻狀況
export const optionsCreator_marital = (): Toption[] => [
  { value: '已婚', label: '未婚' },
  { value: '未婚', label: '已婚' },
];

// 扣稅類別
export const optionsCreator_taxDeductionCategory = (): Toption[] => [
  { value: '應稅', label: '應稅' },
  { value: '應稅外加', label: '應稅外加' },
  { value: '免稅', label: '免稅' },
];
// export const optionsCreator_customerCategory =
//   (): Toption[] => [
//     { value: "營造", label: "營造" },
//     { value: "事務所", label: "事務所" },
//     { value: "業主", label: "業主" },
//   ]

// 類別
export const optionsCreator_prodClass = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: '防火防煙捲門系列', label: '防火防煙捲門系列' },
    // { value: "防水防洪門系列", label: "防水防洪門系列" },
    // { value: "抗風防颱捲門系列", label: "抗風防颱捲門系列" },
    // { value: "廠辦管制門", label: "廠辦管制門" },
    // { value: "圍牆大門", label: "圍牆大門" },
    // { value: "機械門", label: "機械門" },
    // { value: "客製化", label: "客製化" },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

// 門型
export const optionsCreator_doorType = (props: { haveEmpty?: boolean } = {}): Toption[] => {
  const { haveEmpty } = props;
  const arr = [
    { value: 'SJ-302', label: 'SJ-302' },
    // { value: "SJ-302A", label: "SJ-302A" },
    // { value: "SJ-302AS", label: "SJ-302AS" },
    // { value: "SJ-305D", label: "SJ-305D" },
    // { value: "SJ-312", label: "SJ-312" },
    // { value: "SJ-120A", label: "SJ-120A" },
    // { value: "SJ-303S", label: "SJ-303S" },
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
    // { value: "", label: "不拘" },
    { value: '一般', label: '一般' },
    { value: '防颱', label: '防颱' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};

// 客戶列表搜尋用
export const optionsCreator_clientSearch = (): Toption[] => [
  { value: 'customerNumber', label: '客戶編號' },
  { value: 'name', label: '客戶全稱' },
  { value: 'contacts.name', label: '聯絡人' },
  { value: 'phone', label: '電話' },
];

type ToptionsSeries = Toption & { seriesType: 'rollerDoor' | 'normal' };
// 報價別
export const optionsCreator_series = (): ToptionsSeries[] => [
  { value: '捲門', label: '捲門', seriesType: 'rollerDoor' },
  // { value: "大捲門", label: "大捲門", quoteTypeType: "rollerDoor" },
  { value: '不是捲門', label: '不是捲門', seriesType: 'normal' },
];

// 材料
export const optionsCreator_material = (): Toption[] => [
  { value: 'SST304#', label: 'SST 304#' },
  // { value: "SST316#", label: "SST 316#" },
  // { value: "鐵材烤漆", label: "鐵材烤漆" },
  // { value: "鍍鋅鋼板", label: "鍍鋅鋼板" },
  // { value: "高耐鍍鋅鋼板", label: "高耐鍍鋅鋼板" },
];

// 表面
export const optionsCreator_surface = (): Toption[] => [
  { value: '2B', label: '2B' },
  // { value: "BA", label: "BA" },
  // { value: "HL", label: "HL" },
  // { value: "NO.4", label: "NO.4" },
];

// 門軌
export const optionsCreator_doorRail = (): Toption[] => [
  { value: '75', label: '75', icon: iconDoorRail75.src },
  { value: '60', label: '60', icon: iconDoorRail60.src },
  { value: '98', label: '98', icon: iconDoorRail98.src },
];

export const optionsCreator_doorRail_normal = (): Toption[] => [
  { value: 'sj302_30', label: 'sj302_30', icon: iconDoorRail_sj302_30.src },
];

export const optionsCreator_doorRail_antyTyphoon = (): Toption[] => [
  { value: 'sj302_75_30t', label: 'sj302_75_30t', icon: iconDoorRail_sj302_75_30t.src },
  { value: 'sj302_90_30t', label: 'sj302_90_30t', icon: iconDoorRail_sj302_90_30t.src },
  { value: 'sj302_95_30t', label: 'sj302_95_30t', icon: iconDoorRail_sj302_95_30t.src },
  { value: 'sj302_95_45t', label: 'sj302_95_45t', icon: iconDoorRail_sj302_95_45t.src },
];

// B 報價單的B
export const optionsCreator_B = (): Toption[] => [
  { value: '77', label: '77' },
  { value: '45', label: '45' },
  { value: '20', label: '20' },
];

// 馬力
export const optionsCreator_horsepower = (): Toption[] => [
  { value: 'autoCalc', label: '自動計算' },
  { value: '1/4 HP', label: '1/4 HP' },
  { value: '1/3 HP', label: '1/3 HP' },
  { value: '1/2 HP', label: '1/2 HP' },
  { value: '3/4 HP', label: '3/4 HP' },
  { value: '1 HP', label: '1 HP' },
  { value: '1 1/2HP', label: '1 1/2 HP' },
  { value: '2 HP', label: '2 HP' },
  { value: '3 HP', label: '3 HP' },
  { value: '5 HP', label: '5 HP' },
];
// 報價單狀態
export const optionsCreator_quotationState = (): Toption[] => [
  { value: '預算', label: '預算' },
  { value: '投標', label: '投標' },
  { value: '發包', label: '發包' },
];

export const optionsCreator_month = ({
  ch,
  emptyOption,
}: {
  ch?: boolean;
  emptyOption?: boolean;
} = {}): Toption[] => {
  const arrNumber = [
    { value: '1', label: '1月' },
    { value: '2', label: '2月' },
    { value: '3', label: '3月' },
    { value: '4', label: '4月' },
    { value: '5', label: '5月' },
    { value: '6', label: '6月' },
    { value: '7', label: '7月' },
    { value: '8', label: '8月' },
    { value: '9', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
  ];
  const arrCh = [
    { value: '1', label: '一月' },
    { value: '2', label: '二月' },
    { value: '3', label: '三月' },
    { value: '4', label: '四月' },
    { value: '5', label: '五月' },
    { value: '6', label: '六月' },
    { value: '7', label: '七月' },
    { value: '8', label: '八月' },
    { value: '9', label: '九月' },
    { value: '10', label: '十月' },
    { value: '11', label: '十一月' },
    { value: '12', label: '十二月' },
  ];
  const optionArr = ch ? arrCh : arrNumber;

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘' });
  }

  return optionArr;
};

export const optionsCreator_region = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = [
    { value: '北部', label: '北部' },
    { value: '中部', label: '中部' },
    { value: '南部', label: '南部' },
    { value: '東部', label: '東部' },
  ];

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘' });
  }

  return optionArr;
};

export const optionsCreator_year = ({
  startYear,
  endYear,
  emptyOption,
}: {
  startYear?: number;
  endYear?: number;
  emptyOption?: boolean;
} = {}): Toption[] => {
  const yearArr = generateYearArray({ startYear, endYear }).reverse();
  const optionArr = yearArr.map((year) => ({
    value: year,
    label: year + '年',
  }));

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘' });
  }

  return optionArr;
};

export const optionsCreator_dailyReportPeriod = ({ emptyOption }: { emptyOption?: boolean } = {}): Toption[] => {
  const optionArr = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  if (emptyOption) {
    optionArr.unshift({ value: '', label: '不拘' });
  }

  return optionArr;
};

/**餐費類別 */
export const optionsCreator_mealsCost = (): Toption[] => {
  return [
    { value: 'none', label: '無' },
    { value: 'breakfast', label: '早餐' },
    { value: 'lunch', label: '午餐' },
    { value: 'dinner', label: '晚餐' },
  ];
};

// export const optionsCreator_ =
//   ():Toption[] => [

//   ]

export type { Toption, ToptionPlus };

export { addEmpty, createNumberRangeOptionArr };
