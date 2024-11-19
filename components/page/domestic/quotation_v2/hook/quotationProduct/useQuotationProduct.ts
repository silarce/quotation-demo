import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';

import { useDefaultState } from './useDefaultState';

import type {
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { Tstate_prod } from './type';

// ================================================================================

const useQuotationProduct = ({
  //
  raw_productArr,
  disabled,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  const defaultState = useDefaultState(raw_productArr);

  const [stateArr_prod, setStateArr_prod] = useState<Tstate_prod[]>(defaultState);

  useEffect(() => {
    setStateArr_prod(defaultState);
  }, [defaultState, disabled]);
};

// ================================================================================

export { useQuotationProduct };
