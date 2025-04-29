import React, { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import Decimal from 'decimal.js';

import { taxRate } from 'config/config_common';

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

interface Tstate_quotationPriceInfo {
  haveTax: boolean;
  discount_quotation: `${number}` | ''; // 總折數
  discount_avg: number; // 平均折數
  tuneTotal: `${number}` | ''; // 小計調整
  subTotal: number; // 小計
  salesTax: number; // 營業稅
  total: number; // 總計
}

interface Tref_state {
  state_prodDict: Tstate_prodDict;
  state_quotationPriceInfo: Tstate_quotationPriceInfo;
}

// =====================================================================

const useProduct = (rawData: unknown | undefined) => {
  const defaultState_prodDict = useDefault_prodDict(rawData);
  const defaultState_keyArr = useDefault_keyArr(rawData);
  const defaultState_allProd = useDefault_allProd(rawData);

  const [state_prodDict, setState_prodDict] = useState<Tstate_prodDict>(defaultState_prodDict);
  const [state_keyArr, setState_KeyArr] = useState<string[]>(defaultState_keyArr);
  const [state_quotationPriceInfo, setState_quotationPriceInfo] =
    useState<Tstate_quotationPriceInfo>(defaultState_allProd);

  // ref_state使setAvgDiscount與setQuotationPrice可以取得最新狀態
  // 否則會因為閉包的問題導致取得的狀態不是最新的
  const ref_state = useRef<Tref_state>({
    state_prodDict,
    state_quotationPriceInfo,
  });
  ref_state.current = {
    state_prodDict,
    state_quotationPriceInfo,
  };

  const { addDebounce } = useDebounceFuc();

  // ---------------------------------------------------------------------

  const setAvgDiscount = () => {
    const discount_avg = calcDiscount_avg({
      discount_quotation: ref_state.current.state_quotationPriceInfo.discount_quotation,
      prodDict: ref_state.current.state_prodDict,
    });

    setState_quotationPriceInfo((state) => {
      return {
        ...state,
        discount_avg: discount_avg,
      };
    });
  };

  const setQuotationPrice = () => {
    const result = calcQuotationPrice({
      prodDict: ref_state.current.state_prodDict,
      quotationPriceInfo: ref_state.current.state_quotationPriceInfo,
    });

    setState_quotationPriceInfo((state) => {
      return {
        ...state,
        ...result,
      };
    });
  };

  // ---------------------------------------------------------------------

  // region:createStateKit

  const createStateKit = (key: string) => {
    const state_prod = state_prodDict[key];

    const setState: React.Dispatch<React.SetStateAction<Tstate_prod>> = (action) => {
      let newStates: Tstate_prod;

      if (typeof action === 'function') {
        newStates = action(state_prod);
      } else {
        newStates = action;
      }

      setState_prodDict((dict) => {
        const newDict = { ...dict };
        newDict[key] = newStates;

        return newDict;
      });
    };

    // MARK:copySelf
    const copySelf = () => {
      const newKey = nanoid();

      const newState = _.cloneDeep(state_prod);
      newState.id = undefined;

      setState_prodDict((dict) => {
        const copy = {
          ...dict,
          [newKey]: newState,
        };

        return copy;
      });
      setState_KeyArr((arr) => {
        return [...arr, newKey];
      });

      addDebounce({
        setAvgDiscount,
        setQuotationPrice,
      });
    };

    // MARK:deleteSelf
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

      addDebounce({
        setAvgDiscount,
        setQuotationPrice,
      });
    };

    // MARK: getAllPrice
    const getAllPrice = (state: Tstate_prod): Pick<Tstate_prod, 'price' | 'dualPrice' | 'unitPrice' | 'totalPrice'> => {
      const discount_price = calcPriceDiscount({
        discount_quotation: state_quotationPriceInfo.discount_quotation,
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
        setState((state) => {
          const copy = {
            ...state,
            quantity: v,
          };

          return {
            ...copy,
            ...getAllPrice(copy),
          };
        });

        addDebounce({
          setAvgDiscount,
          setQuotationPrice,
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

        addDebounce({
          setQuotationPrice,
        });
      },
      // 牌價複價
      getDualPrice: () => state_prod.dualPrice,
      // 單價
      getUnitPrice: () => state_prod.unitPrice,
      // 複價
      getTotalPrice: () => state_prod.totalPrice,
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
        setState((state) => {
          const copy = {
            ...state,
            discount: v,
          };

          return {
            ...copy,
            ...getAllPrice(copy),
          };
        });

        addDebounce({
          setAvgDiscount,
          setQuotationPrice,
        });
      },
      //
      getImgUrl: () => state_prod.imgUrl,
      //
    };
  };

  // endregion

  // region:createStateKit_allProd

  //
  const setDiscount_all = (value: `${number}` | '' | number) => {
    setState_quotationPriceInfo((state) => {
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

      addDebounce({
        setAvgDiscount,
        setQuotationPrice,
      });

      return newDict;
    });
  };

  const setTuneTotal = (value: `${number}` | '' | number) => {
    setState_quotationPriceInfo((state) => {
      return {
        ...state,
        tuneTotal: `${value}`,
      };
    });

    addDebounce({ setQuotationPrice });
  };

  const setHaveTax = (haveTax: boolean) => {
    setState_quotationPriceInfo((state) => {
      return {
        ...state,
        haveTax: haveTax,
      };
    });
    addDebounce({ setQuotationPrice });
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

    addDebounce({
      setAvgDiscount,
    });
  };

  const reset = () => {
    setState_prodDict(defaultState_prodDict);
    setState_quotationPriceInfo(defaultState_allProd);
    setState_KeyArr(defaultState_keyArr);
  };

  // endregion

  // ---------------------------------------------------------------------

  // region: useEffect

  useEffect(() => {
    setState_prodDict(defaultState_prodDict);
  }, [defaultState_prodDict]);

  useEffect(() => {
    setState_quotationPriceInfo(defaultState_allProd);
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

    state_allProd: state_quotationPriceInfo,
    // createStateKit_allProd,
    // state_allProd,
    setDiscount_all,
    setTuneTotal,
    setHaveTax,
  };
};

// MARK: END

// ====================================================================

const useDefault_prodDict = (rawData: unknown | undefined) => {
  return useCallback(() => {
    if (!rawData) {
      return {} as Tstate_prodDict;
    }

    return {} as Tstate_prodDict;
  }, [rawData]);
};

const useDefault_allProd = (rawData: unknown | undefined) => {
  return useCallback(() => {
    const empty: Tstate_quotationPriceInfo = {
      discount_quotation: '100',
      discount_avg: 100,
      tuneTotal: '0',
      subTotal: 0,
      salesTax: 0,
      total: 0,
      haveTax: true,
    };

    if (!rawData) {
      return empty;
    }

    return empty;
  }, [rawData]);
};

const useDefault_keyArr = (rawData: unknown | undefined) => {
  return useCallback(() => {
    if (!rawData) {
      return [] as string[];
    }

    return [] as string[];
  }, [rawData]);
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

const calcDiscount_avg = (props: { discount_quotation: `${number}` | number | ''; prodDict: Tstate_prodDict }) => {
  const discount_all = new Decimal(props.discount_quotation || 0).div(100);

  let discountTotal = new Decimal(0);
  let qty = new Decimal(0);

  Object.values(props.prodDict).forEach((state_prod) => {
    const quantity = new Decimal(state_prod.quantity || 0);

    discountTotal = discountTotal.add(quantity.mul(state_prod.discount || 0));
    qty = qty.add(quantity);
  });

  if (!discountTotal.toNumber() && !qty.toNumber()) {
    return discount_all.mul(100).toDecimalPlaces(3).toNumber();
  }

  return discountTotal.div(qty).mul(discount_all).toDecimalPlaces(3).toNumber();
};

const calcQuotationPrice = ({
  prodDict,
  quotationPriceInfo: { tuneTotal, haveTax },
}: {
  prodDict: Tstate_prodDict;
  quotationPriceInfo: Pick<Tstate_quotationPriceInfo, 'tuneTotal' | 'haveTax'>;
}) => {
  let prodTotal = new Decimal(0);

  Object.values(prodDict).forEach((state_prod) => {
    prodTotal = prodTotal.add(state_prod.totalPrice || 0);
  });

  prodTotal = prodTotal.add(tuneTotal || 0);

  const subTotal = prodTotal;
  const salesTax = haveTax ? subTotal.mul(taxRate).toNumber() : 0; // 營業稅
  const total = subTotal.add(salesTax); // 總計

  return {
    subTotal: subTotal.toNumber(),
    salesTax: salesTax,
    total: total.toNumber(),
  };
};

interface TdebounceFuc {
  [string: string]: () => void;
}

// ===========================================================================
const useDebounceFuc = ({ delay = 300 }: { delay?: number } = {}) => {
  const ref_timeout = useRef<NodeJS.Timeout | null>(null);
  const ref_debounce = useRef<TdebounceFuc>({});

  const addDebounce = (dict: TdebounceFuc, { coverDelay }: { coverDelay?: number } = {}) => {
    ref_timeout.current && clearTimeout(ref_timeout.current);
    ref_debounce.current = { ...ref_debounce.current, ...dict };

    ref_timeout.current = setTimeout(() => {
      Object.values(ref_debounce.current).forEach((func) => {
        func();
      });

      ref_debounce.current = {};
    }, coverDelay ?? delay);
  };

  const clearDebounce = () => {
    ref_timeout.current && clearTimeout(ref_timeout.current);
    ref_debounce.current = {};
  };

  useEffect(() => {
    return () => {
      ref_timeout.current && clearTimeout(ref_timeout.current);
      ref_debounce.current = {};
    };
  }, []);

  return { addDebounce, clearDebounce };
};

// ===========================================================================

type Tinstance_useProduct = ReturnType<typeof useProduct>;

// ===========================================================================
export type { Tinstance_useProduct };
export { useProduct };
