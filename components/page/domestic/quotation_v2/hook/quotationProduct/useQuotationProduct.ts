import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';

import { useDefaultState } from './useDefaultState';

import type {
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { TstateProd, TstateProdDict } from './type';

// ================================================================================

type TsetProd = React.Dispatch<React.SetStateAction<TstateProd>>;

// ================================================================================

const useQuotationProduct = ({
  //
  raw_productArr,
  disabled,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  // region STATE
  const defaultState = useDefaultState(raw_productArr);

  const [cellKeyArr, setCellKeyArr] = useState<string[]>([]); // 欄位的key
  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState.prodKeyArr); // 主產品的key

  const [stateArr_prod, setStateArr_prod] = useState<TstateProdDict>(defaultState.stateProdDict);

  // -----------------------------------------------------------------------
  // region FUNCTION

  const createSetProd = (key: string): TsetProd => {
    const setProd: TsetProd = (newState) => {
      setStateArr_prod((prev) => {
        const newStateValue = typeof newState === 'function' ? newState(prev[key]) : newState;

        return {
          ...prev,
          [key]: {
            ...prev[key],
            // ...newState, newState若是函數，這個寫法不會壞掉?
            ...newStateValue,
          },
        };
      });
    };

    return setProd;
  };

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    setStateArr_prod(defaultState.stateProdDict);
    setProdKeyArr(defaultState.prodKeyArr);
  }, [defaultState, disabled]);
};

// ================================================================================

// ================================================================================

export { useQuotationProduct };
