import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

// =============================================================================

type TsalesOrderItemArr = Tres_apiGetARPaymentData['salesOrder']['salesOrderItems'];

type TsalesOrderItem = TsalesOrderItemArr[number];

type Tstate_salesOrderItem = TsalesOrderItem & {
  completedQuantity: `${number}` | ''; // 待api新增本期完成的property
  completedPayment: number | null; // 待api新增本期完成的property
};

// =============================================================================
const useDefaultState = (rawData: TsalesOrderItemArr | undefined | null): Tstate_salesOrderItem[] => {
  return useMemo(() => {
    return (rawData ?? []).map((item) => ({
      ...item,
      completedQuantity: '',
      completedPayment: null,
    }));
  }, [rawData]);
};

const useSalesOrderItemArr = (rawData: TsalesOrderItemArr | undefined | null) => {
  const defaultState = useDefaultState(rawData);

  const [stateArr, setStateArr] = useState<Tstate_salesOrderItem[]>(defaultState);

  const setCompletedInThisPeriod = (index: number, value: `${number}` | '') => {
    const copy = { ...stateArr[index] };
    const unitPrice = copy.unitPrice || 0;

    copy.completedQuantity = value;
    copy.completedPayment = new Decimal(value || 0).mul(unitPrice).toDecimalPlaces(0).toNumber();

    setStateArr((prev) => {
      const newState = [...prev];
      newState[index] = copy;

      return newState;
    });
  };

  const reset = () => {
    setStateArr(defaultState);
  };

  useEffect(() => {
    setStateArr(defaultState);
  }, [defaultState]);

  return {
    stateArr,
    setCompletedInThisPeriod,
    reset,
  };
};

// ============================================================================

type Tinstance_salesOrderItem = ReturnType<typeof useSalesOrderItemArr>;

export type { Tstate_salesOrderItem, Tinstance_salesOrderItem };
export { useSalesOrderItemArr };
