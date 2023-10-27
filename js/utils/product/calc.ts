import Decimal from 'decimal.js';

/**計算主產品面積 */
export const calcProductArea = ({
  height: h,
  boxb: b,
  fullWidth: l,
  WG: w,
}: {
  height: number;
  boxb: number;
  fullWidth?: number;
  WG?: number;
}) => {
  const area = Decimal.add(h, b) // h+b
    .mul(l || w || 0)
    .toFixed(2)
    .toString();

  return area;
};

/**計算主產品才數 */
export const calcProductVolume = (area: number) => {
  return Decimal.mul(area, 10.89).toFixed(2).toString();
};

// warning 注意，變更fullWidth就意味著gapA與gapC也會變更
// 所以這個計算是要配合apiGetProdCalcGeneralSpec取得新的gapA與gapC再使用
/**計算WG 單位為mm*/
export const calcProductWG = ({ fullWidth, gapA, gapC }: { fullWidth: number; gapA: number; gapC: number }) => {
  return fullWidth - gapA - gapC;
};

// warning 注意，變更WG就意味著gapA與gapC也會變更
// 所以這個計算是要配合apiGetProdCalcGeneralSpec取得新的gapA與gapC再使用
/**計算fullWidth 單位為mm*/
export const calcProductFullWidth = ({ WG, gapA, gapC }: { WG: number; gapA: number; gapC: number }) => {
  return WG + gapA + gapC;
};
