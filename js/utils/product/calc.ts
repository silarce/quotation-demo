import Decimal from 'decimal.js';

import { lookup_boxBAndBoxD } from 'config/product/lookup';

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

  return area as `${number}`;
};

/**計算主產品才數 */
export const calcProductVolume = (area: number) => {
  return Decimal.mul(area, 10.89).toFixed(2).toString() as `${number}`;
};

// warning 注意，變更fullWidth就意味著gapA與gapC也會變更
// 所以這個計算是要配合apiGetProdCalcGeneralSpec取得新的gapA與gapC再使用
/**計算WG 單位為mm*/
export const calcProductWG = ({
  //
  fullWidth,
  gapA,
  gapC,
}: {
  fullWidth: number | `${number}`;
  gapA: number | `${number}`;
  gapC: number | `${number}`;
}) => {
  // const wg = new Decimal(fullWidth).sub(gapA).sub(gapC).toNumber();
  const wg = Number(new Decimal(fullWidth).sub(gapA).sub(gapC).toFixed(3));

  return wg;
};

export const calcProductWG_withWAndG = ({ W, G }: { W: number; G: number }) => {
  return new Decimal(W).add(G).add(G).toNumber();
};

// warning 注意，變更WG就意味著gapA與gapC也會變更
// 所以這個計算是要配合apiGetProdCalcGeneralSpec取得新的gapA與gapC再使用
/**計算fullWidth 單位為mm*/
export const calcProductFullWidth = ({ WG, gapA, gapC }: { WG: number; gapA: number; gapC: number }) => {
  // const fullWidth = new Decimal(WG).add(gapA).add(gapC).toNumber();
  const fullWidth = Number(new Decimal(WG).add(gapA).add(gapC).toFixed(3));

  return fullWidth;
};

// G就是門軌的width
// 例如這個api get https://sanjeou-erp-be.caprover.credot-web.com/products/door/models
// G = guideRails.width
// 注意要長度單位要一致
export const calcW = ({
  //
  WG,
  G,
}: {
  WG: number | `${number}`;
  G: number | `${number}`;
}) => {
  return new Decimal(WG).sub(G).sub(G).toNumber();
};

export const calcW_2 = ({
  //
  fullWidth,
  gapA,
  gapC,
  G,
}: {
  fullWidth: number;
  gapA: number;
  gapC: number;
  G: number;
}) => {
  return new Decimal(fullWidth).sub(gapA).sub(gapC).sub(G).sub(G).toNumber();
};

export const findBDoptions = (doorModelName: string) => {
  const BDList = lookup_boxBAndBoxD[doorModelName]?.BtoD;
  const DBList = lookup_boxBAndBoxD[doorModelName]?.DtoB;

  let options_boxB: { value: string; label: string }[] | undefined = undefined;
  let options_boxD: { value: string; label: string }[] | undefined = undefined;

  if (BDList) {
    options_boxB = Object.keys(BDList).map((key) => {
      return {
        value: key,
        label: key,
      };
    });
  }

  if (DBList) {
    options_boxD = Object.keys(DBList).map((key) => {
      return {
        value: key,
        label: key,
      };
    });
  }

  return {
    options_boxB,
    options_boxD,
  };
};

export const calcFullHeight = ({ height, boxB }: { height: number; boxB: number }) => {
  return new Decimal(height).add(boxB).toNumber();
};

export const calcAngleIronSize = ({ gapA, gapC, WG }: { gapA: number; gapC: number; WG: number }) => {
  return new Decimal(gapA).add(gapC).add(WG).minus(10).toNumber();
};
