import Decimal from 'decimal.js';

export const calcProductArea = ({
  height: h,
  boxb: b,
  fullWidth: l,
  WG: w,
}: {
  height: number;
  boxb: number;
  fullWidth: number;
  WG: number;
}) => {
  const area = Decimal.add(h, b) // h+b
    .mul(w || l)
    .toFixed(2)
    .toString();

  return area;
};
