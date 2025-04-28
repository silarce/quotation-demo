import React, { useState, useEffect, useMemo, useRef } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import Decimal from 'decimal.js';

interface Tstate_prod {
  id?: string;

  productid: string; // 品名
  spec: string;
  material: string;
  thickness: `${number}` | '';
  surface: string;
  note: string;

  discount: `${number}` | ''; // 折數
  quantity: `${number}` | '';
  price: `${number}` | ''; // 牌價
  dualPrice: number; // 牌價複價
  unitPrice: number; // 單價
  totalPrice: number; // 複價

  imgUrl?: string; // 圖片網址
}

interface Tstate_prodDict {
  [id: string]: Tstate_prod;
}

interface Tstate_quotationPrice {
  discount_quotation: `${number}` | ''; // 總折數
  discount_avg: number; // 平均折數
  tuneTotal: `${number}` | ''; // 小計調整
  subTotal: number; // 小計
  salesTax: number; // 營業稅
  total: number; // 總計

  // deliveryLocation: string; // 交貨地點
  // deliveryDate: Moment; // 交貨日期
  // paymentMethods: {
  //   milestone: string;
  //   totalPaymentRatio: `${number}` | ''; // 0~100 浮點數
  // }[]; //付款辦法
}

// =====================================================================

const useProduct = ({ rawData }: { rawData: unknown | undefined }) => {
  const defaultState_prodDict = useDefault_prodDict(rawData);
  const defaultState_keyArr = useDefault_keyArr(rawData);
  const defaultState_allProd = useDefault_allProd(undefined);

  const [state_prodDict, setState_prodDict] = useState<Tstate_prodDict>(defaultState_prodDict);
  const [state_keyArr, setState_KeyArr] = useState<string[]>(defaultState_keyArr);
  const [state_allProd, setState_allProd] = useState<Tstate_quotationPrice>(defaultState_allProd);

  const ref_timeout_avgDiscount = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------

  const setAvgDiscount = ({
    discount_all,
    prodDict,
  }: {
    discount_all: `${number}` | '' | number;
    prodDict: Tstate_prodDict;
  }) => {
    ref_timeout_avgDiscount.current && clearTimeout(ref_timeout_avgDiscount.current);
    ref_timeout_avgDiscount.current = setTimeout(() => {
      const discount_avg = calcDiscount_avg({
        discount_all,
        prodDict,
      });

      setState_allProd((state) => {
        return {
          ...state,
          discount_avg: discount_avg,
        };
      });
    }, 300);
  };

  // ---------------------------------------------------------------------

  // region:createStateKit

  const createStateKit = (key: string) => {
    const state_prod = state_prodDict[key];

    const setState: (action: React.SetStateAction<Tstate_prod>) => Tstate_prodDict = (action) => {
      let newStates: Tstate_prod;

      if (typeof action === 'function') {
        newStates = action(state_prod);
      } else {
        newStates = action;
      }

      let newDict: Tstate_prodDict = {};

      setState_prodDict((dict) => {
        newDict = { ...dict };
        newDict[key] = newStates;

        return newDict;
      });

      return newDict;
    };

    const copySelf = () => {
      const newKey = nanoid();

      const newState = _.cloneDeep(state_prod);
      newState.id = undefined;

      let prodDict: Tstate_prodDict = {};

      setState_prodDict((dict) => {
        const copy = {
          ...dict,
          [newKey]: newState,
        };
        prodDict = copy;

        return copy;
      });
      setState_KeyArr((arr) => {
        return [...arr, newKey];
      });

      setAvgDiscount({
        discount_all: state_allProd.discount_quotation,
        prodDict,
      });
    };

    const deleteSelf = () => {
      let prodDict: Tstate_prodDict = {};

      setState_prodDict((dict) => {
        const copy = { ...dict };
        delete copy[key];
        prodDict = copy;

        return copy;
      });

      setState_KeyArr((arr) => {
        return arr.filter((item) => item !== key);
      });

      setAvgDiscount({
        discount_all: state_allProd.discount_quotation,
        prodDict,
      });
    };

    const getAllPrice = (state: Tstate_prod): Pick<Tstate_prod, 'price' | 'dualPrice' | 'unitPrice' | 'totalPrice'> => {
      const discount_price = calcPriceDiscount({
        discount_quotation: state_allProd.discount_quotation,
        discount_prod: state.discount,
      });

      const { price, dualPrice, unitPrice, totalPrice } = calcAllPrice({
        discount: discount_price,
        quantity: state.quantity,
        price: state.price,
      });

      return {
        price: `${price}` as `${number}`,
        dualPrice: dualPrice,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      };
    };

    return {
      state_prod,
      copySelf,
      deleteSelf,
      //
      getProductid: () => state_prod.productid,
      setProductid: (v: string) => {
        setState((state) => ({
          ...state,
          productid: v,
        }));
      },
      //
      getSpec: () => state_prod.spec,
      setSpec: (v: string) => {
        setState((state) => ({
          ...state,
          spec: v,
        }));
      },
      //
      getMaterial: () => state_prod.material,
      setMaterial: (v: string) => {
        setState((state) => ({
          ...state,
          material: v,
        }));
      },
      //
      getThickness: () => state_prod.thickness,
      setThickness: (v: `${number}` | '') => {
        setState((state) => ({
          ...state,
          thickness: v,
        }));
      },
      //
      getSurface: () => state_prod.surface,
      setSurface: (v: string) => {
        setState((state) => ({
          ...state,
          surface: v,
        }));
      },
      //
      getQuantity: () => state_prod.quantity,
      setQuantity: (v: `${number}` | '') => {
        const prodDict = setState((state) => {
          const copy = {
            ...state,
            quantity: v,
          };

          return {
            ...copy,
            ...getAllPrice(copy),
          };
        });

        setAvgDiscount({
          discount_all: state_allProd.discount_quotation,
          prodDict: prodDict,
        });
      },
      // 牌價
      getPrice: () => state_prod.price,
      setPrice: (v: `${number}` | '') => {
        setState((state) => {
          const copy = {
            ...state,
            price: v,
          };

          return {
            ...copy,
            ...getAllPrice(copy),
          };
        });
      },
      // 牌價複價
      getDualPrice: () => state_prod.dualPrice,
      // setDualPrice: (v: number) => {
      //   setState((state) => ({
      //     ...state,
      //     dualPrice: v,
      //   }));
      // },
      // 單價
      getUnitPrice: () => state_prod.unitPrice,
      // setUnitPrice: (v: number) => {
      //   setState((state) => ({
      //     ...state,
      //     unitPrice: v,
      //   }));
      // },
      // 複價
      getTotalPrice: () => state_prod.totalPrice,
      // setTotalPrice: (v: number) => {
      //   setState((state) => ({
      //     ...state,
      //     totalPrice: v,
      //   }));
      // },
      //
      getNote: () => state_prod.note,
      setNote: (v: string) => {
        setState((state) => ({
          ...state,
          note: v,
        }));
      },
      //
      getDiscount: () => state_prod.discount,
      setDiscount: (v: `${number}` | '') => {
        const prodDict = setState((state) => {
          const copy = {
            ...state,
            discount: v,
          };

          return {
            ...copy,
            ...getAllPrice(copy),
          };
        });

        setAvgDiscount({
          discount_all: state_allProd.discount_quotation,
          prodDict: prodDict,
        });
      },
      //
      getImgUrl: () => state_prod.imgUrl,
      // setImgUrl: (v: string | undefined) => {
      //   setState((state) => ({
      //     ...state,
      //     imgUrl: v,
      //   }));
      // },
      //
    };
  };

  // endregion

  // region:createStateKit_allProd

  //
  const setDiscount_all = (value: `${number}` | '' | number) => {
    setState_allProd((state) => {
      const copy = { ...state };
      copy.discount_quotation = `${value}`;

      return copy;
    });

    setState_prodDict((dict) => {
      const newDict = { ...dict };
      Object.entries(newDict).forEach(([key, state_prod]) => {
        const discount_price = calcPriceDiscount({
          discount_quotation: value,
          discount_prod: state_prod.discount,
        });

        const allPrice = calcAllPrice({
          discount: discount_price,
          quantity: state_prod.quantity,
          price: state_prod.price,
        });

        newDict[key] = {
          ...state_prod,
          ...allPrice,
          price: `${allPrice.price}` as `${number}`,
        };
      });

      setAvgDiscount({
        discount_all: value,
        prodDict: newDict,
      });

      return newDict;
    });
  };

  const setTuneTotal = (value: `${number}` | '' | number) => {
    setState_allProd((state) => {
      return {
        ...state,
        tuneTotal: `${value}`,
      };
    });
  };

  // endregion

  // ---------------------------------------------------------------------

  // region: method

  const addProd = () => {
    const newKey = nanoid();

    let prodDict: Tstate_prodDict = {};

    setState_prodDict((dict) => {
      const copy = {
        ...dict,
        [newKey]: {
          ...emptyState_prod(),
        },
      };
      prodDict = copy;

      return copy;
    });
    setState_KeyArr((arr) => {
      return [...arr, newKey];
    });

    setAvgDiscount({
      discount_all: state_allProd.discount_quotation,
      prodDict,
    });
  };

  const reset = () => {
    setState_prodDict(defaultState_prodDict);
    setState_allProd(defaultState_allProd);
    setState_KeyArr(defaultState_keyArr);
  };

  // endregion

  // ---------------------------------------------------------------------

  // region: useEffect

  useEffect(() => {
    setState_prodDict(defaultState_prodDict);
  }, [defaultState_prodDict]);

  useEffect(() => {
    setState_allProd(defaultState_allProd);
  }, [defaultState_allProd]);

  useEffect(() => {
    setState_KeyArr(defaultState_keyArr);
  }, [defaultState_keyArr]);

  // endregion

  // ---------------------------------------------------------------------
  return {
    state_keyArr,

    reset,
    createStateKit,
    addProd,

    state_allProd,
    // createStateKit_allProd,
    // state_allProd,
    setDiscount_all,
    setTuneTotal,
  };
};

// MARK: END

// ====================================================================

const useDefault_prodDict = (data: unknown | undefined) => {
  const defaultState: Tstate_prodDict = useMemo(() => {
    if (!data) {
      return {} as Tstate_prodDict;
    }

    return {} as Tstate_prodDict;
  }, [data]);

  return defaultState;
};

const useDefault_allProd = (data: unknown | undefined) => {
  const defaultState: Tstate_quotationPrice = useMemo(() => {
    const state: Tstate_quotationPrice = {
      discount_quotation: '100',
      discount_avg: 100,
      tuneTotal: '0',
      subTotal: 0,
      salesTax: 0,
      total: 0,
    };

    return state;
  }, [data]);

  return defaultState;
};

// =============================================================================

const useDefault_keyArr = (data: unknown | undefined) => {
  const defaultState: string[] = useMemo(() => {
    if (!data) {
      return [] as string[];
    }

    return [] as string[];
  }, [data]);

  return defaultState;
};

const emptyState_prod = (): Tstate_prod => ({
  id: undefined,
  productid: '', // 品名
  spec: '', // 規格
  material: '', // 材質
  thickness: '', // 厚度
  surface: '', // 表面處理
  note: '', // 備註

  quantity: '1', // 數量
  price: '0', // 牌價
  dualPrice: 0, // 複價
  unitPrice: 0, // 單價
  totalPrice: 0, // 總價

  discount: '100', // 折數
  // imgUrl: undefined,
  imgUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/220px-Cat_November_2010-1a.jpg',
});

// ===========================================================================

const calcPriceDiscount = ({
  discount_quotation, // ex 50 37
  discount_prod, // ex 50 37
}: {
  discount_quotation: `${number}` | number | '';
  discount_prod: `${number}` | number | '';
}) =>
  new Decimal(discount_quotation || 0)
    .mul(discount_prod || 0)
    .div(100)
    // .div(100)
    .toNumber();

const calcAllPrice = (props: {
  discount: number; // ex 50 37
  quantity: `${number}` | number | '';
  price: `${number}` | number | '';
}) => {
  const quantity = new Decimal(props.quantity || 0);
  const price = new Decimal(props.price || 0);

  const discount = new Decimal(props.discount).div(100);

  const dualPrice = price.mul(quantity); // 複價
  const unitPrice = price.mul(discount).toDecimalPlaces(0);
  const totalPrice = unitPrice.mul(quantity); // 總價

  return {
    price: price.toNumber(),
    dualPrice: dualPrice.toNumber(),
    unitPrice: unitPrice.toNumber(),
    totalPrice: totalPrice.toNumber(),
  };
};

const calcDiscount_avg = (props: { discount_all: `${number}` | number | ''; prodDict: Tstate_prodDict }) => {
  const discount_all = new Decimal(props.discount_all || 0).div(100);

  let discountTotal = new Decimal(0);
  let qty = new Decimal(0);

  Object.values(props.prodDict).forEach((state_prod) => {
    const quantity = new Decimal(state_prod.quantity || 0);

    discountTotal = discountTotal.add(quantity.mul(state_prod.discount || 0));
    qty = qty.add(quantity);
  });

  return discountTotal.div(qty).mul(discount_all).toDecimalPlaces(3).toNumber();
};

// ===========================================================================

type Tinstance_useProduct = ReturnType<typeof useProduct>;

// ===========================================================================
export type { Tinstance_useProduct };
export { useProduct };
