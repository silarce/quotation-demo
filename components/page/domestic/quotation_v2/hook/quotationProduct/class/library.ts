// 檢查是否為SST
const checkIsSST = (material: string) => {
  let isSST = false;

  if (material.startsWith('SST')) {
    isSST = true;
  } else if (material.includes('外SST')) {
    isSST = true;
  }

  return isSST;
};

// 檢查是否鍍鋅
const checkIsGalvanized = (material: string) => {
  let isGalvanized = false;

  if (material.includes('鍍鋅')) {
    isGalvanized = true;
  }

  return isGalvanized;
};

/** 去除小數點後超過三位的值，無條件捨去  */
const fixedToFloat3 = (v: number | `${number}`) => {
  // const v_num = new Decimal(v || 0).toDecimalPlaces(3, Decimal.ROUND_DOWN).toNumber();

  let v_str = `${v}`;

  // eslint-disable-next-line prefer-const
  let [a, b] = v_str.split('.');
  b = b?.slice(0, 3) || '';
  v_str = b ? `${a}.${b}` : a;

  return Number(v_str);
};

// ========================================================================
export { checkIsSST, checkIsGalvanized, fixedToFloat3 };
