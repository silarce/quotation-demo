import { Toption, addEmpty } from './options';

export type { Toption };

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
    { 產品: '捲門', value: 'SJ-302' as const, label: 'SJ-302', name: '電動防火捲門P:110' },
    { 產品: '捲門', value: 'SJ-312' as const, label: 'SJ-312', name: '重型防颱捲門P:120' },
    { 產品: '捲門', value: 'SJ-303S' as const, label: 'SJ-303S', name: '遮煙捲簾' },
    { 產品: '捲門', value: 'SJ-305D' as const, label: 'SJ-305D', name: '花格型捲門' },
    { 產品: '捲門', value: 'SJ-120A' as const, label: 'SJ-120A', name: '120A葉片式阻熱捲門' },
    { 產品: '捲門', value: 'SJ-303A' as const, label: 'SJ-303A', name: '60A葉片式阻熱捲門' },
    { 產品: '捲門', value: 'SJ-303F' as const, label: 'SJ-303F', name: '60A折疊式阻熱捲門' },
    { 產品: '捲門', value: 'SJ-303AS' as const, label: 'SJ-303AS', name: '60A葉片式阻熱具遮煙性' },
    { 產品: '捲門', value: 'SJ-PVC' as const, label: 'SJ-PVC', name: 'PVC飛迅門' },
    { 產品: '捲門', value: 'SJ-OSD' as const, label: 'SJ-OSD', name: '滑升門' },
    { 產品: '捲門', value: 'SJ-HSD' as const, label: 'SJ-HSD', name: '快速捲門' },
    { 產品: '捲門', value: 'SJ-FDS' as const, label: 'SJ-FDS', name: '電動防水捲門' },
    { 產品: '捲門', value: 'SJ-60BS' as const, label: 'SJ-60BS', name: '防火遮煙捲簾' },
    //
    { 產品: '伸縮大門', value: 'L' as const, label: 'L', name: 'L型電動大門' },
    { 產品: '伸縮大門', value: 'S' as const, label: 'S', name: 'S型電動大門' },
    { 產品: '伸縮大門', value: 'SL1' as const, label: 'SL1', name: '1300伸縮' },
    { 產品: '伸縮大門', value: 'SL2' as const, label: 'SL2', name: '1500伸縮' },
    { 產品: '伸縮大門', value: 'SM' as const, label: 'SM', name: '1750伸縮' },
    { 產品: '伸縮大門', value: 'SH' as const, label: 'SH', name: '1950伸縮' },
    { 產品: '伸縮大門', value: 'SX' as const, label: 'SX', name: '伸縮大門' },
    { 產品: '伸縮大門', value: 'SS' as const, label: 'SS', name: 'S型小門' },
    //
    { 產品: '水閘門', value: 'W1' as const, label: 'W1', name: '扇形水閘門' },
    { 產品: '水閘門', value: 'W2' as const, label: 'W2', name: '插板水閘門' },
    { 產品: '水閘門', value: 'W3' as const, label: 'W3', name: '電動油壓水閘門' },
    { 產品: '水閘門', value: 'W4' as const, label: 'W4', name: '水密門' },
    { 產品: '水閘門', value: 'W5' as const, label: 'W5', name: '無框水閘門' },
    { 產品: '水閘門', value: 'W6' as const, label: 'W6', name: '溝渠式水閘門' },
    //
    // { 產品: '上折門', value: '無資料' as const, label: '無資料', name: '重型防颱捲門P:120' },
    // { 產品: '上折門', value: '無資料' as const, label: '無資料', name: '輕型' },
    // { 產品: '上折門', value: '無資料' as const, label: '無資料', name: '中型' },
    //
    // { 產品: '機庫門', value: '無資料' as const, label: '無資料', name: '柔性門' },
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
    { value: 'normal' as const, label: '一般' },
    { value: 'anti-typhoon' as const, label: '防颱' },
  ];

  if (haveEmpty) {
    addEmpty(arr);
  }

  return arr;
};
