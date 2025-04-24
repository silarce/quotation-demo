import React, { useState, useEffect, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { nanoid } from 'nanoid';
import _ from 'lodash';

interface Tstate_prod {
  id?: string;

  productid: string; // 品名
  spec: string;
  material: string;
  thickness: `${number}` | '';
  surface: string;
  quantity: `${number}` | '';
  unitPrice: number; // 單價
  price: number; // 牌價
  dualPrice: number; // 牌價複價
  totalPrice: number; // 複價
  note: string;

  discount: `${number}` | ''; // 折數
  imgUrl?: string; // 圖片網址
}

interface Tstate_prodDict {
  [id: string]: Tstate_prod;
}

interface Tstate_allProd {
  discount_all: `${number}` | ''; // 總折數
  discount_avg: number; // 平均折數
  tuneTotal: `${number}` | ''; // 小計調整
  subTotal: number; // 小計
  salesTax: number; // 營業稅
  total: number; // 總計

  deliveryLocation: string; // 交貨地點
  deliveryDate: Moment; // 交貨日期
  paymentMethods: {
    milestone: string;
    totalPaymentRatio: `${number}` | ''; // 0~100 浮點數
  }[]; //付款辦法
}

// =====================================================================

const useProduct = ({ diasbled }: { diasbled: boolean }) => {
  const defaultState_prodDict = useDefault_prodDict(undefined);
  const defaultState_allProd = useDefault_allProd(undefined);
  const [state_prodDict, setState_prodDict] = useState<Tstate_prodDict>(defaultState_prodDict);
  const [state_allProd, setState_allProd] = useState<Tstate_allProd>(defaultState_allProd);

  // ---------------------------------------------------------------------

  // region:setState

  const createKit = (key: string) => {
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

    const copySelf = () => {
      const newState = _.cloneDeep(state_prod);
      newState.id = undefined;

      setState_prodDict((dict) => {
        return {
          ...dict,
          [nanoid()]: newState,
        };
      });
    };

    const deleteSelf = () => {
      setState_prodDict((dict) => {
        const newDict = { ...dict };
        delete newDict[key];

        return newDict;
      });
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
    };
  };

  // endregion

  // ---------------------------------------------------------------------

  // region: method

  const addProd = () => {
    const key = nanoid();

    setState_prodDict((dict) => ({
      ...dict,
      [key]: {
        ...emptyState_prod(),
      },
    }));
  };

  const removeProd = (key: string) => {
    setState_prodDict((dict) => {
      const newDict = { ...dict };
      delete newDict[key];

      return newDict;
    });
  };

  const reset = () => {
    setState_prodDict(defaultState_prodDict);
    setState_allProd(defaultState_allProd);
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

  // endregion

  // ---------------------------------------------------------------------
  return {
    reset,
  };
};

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
  const defaultState: Tstate_allProd = useMemo(() => {
    return {
      discount_all: '0',
      discount_avg: 0,
      tuneTotal: '0',
      subTotal: 0,
      salesTax: 0,
      total: 0,

      deliveryLocation: '',
      deliveryDate: moment(), // 當前時間

      paymentMethods: [
        {
          milestone: 'test',
          totalPaymentRatio: '0',
        },
      ],
    };
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

  quantity: '', // 數量
  unitPrice: 0, // 單價
  price: 0, // 牌價
  dualPrice: 0, // 複價
  totalPrice: 0, // 總價

  discount: '', // 折數
  imgUrl: undefined,
});
