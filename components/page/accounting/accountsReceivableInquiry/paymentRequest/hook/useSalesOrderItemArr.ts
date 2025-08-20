import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

// =============================================================================

type TsalesOrderItemArr = Tres_apiGetARPaymentData['salesOrder']['salesOrderItems'];

type TsalesOrderItem = TsalesOrderItemArr[number];

type Tstate_salesOrderItem = Omit<TsalesOrderItem, 'completedQuantity'> & {
  completedQuantity: `${number}` | ''; // 待api新增本期完成的property
};

// =============================================================================
const useDefaultState = (rawData: TsalesOrderItemArr | undefined | null): Tstate_salesOrderItem[] => {
  return useMemo(() => {
    return (rawData ?? []).map((item) => {
      const state: Tstate_salesOrderItem = {
        ...item,
        completedQuantity: item.completedQuantity === null ? '' : `${item.completedQuantity}`,
      };

      return state;
    });
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

    copy.totalCompletedQuantity = new Decimal(copy.prophaseCompletedQuantity || 0)
      .add(copy.completedQuantity || 0)
      .toNumber();

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

export type { Tinstance_salesOrderItem, TsalesOrderItemArr, TsalesOrderItem, Tstate_salesOrderItem };
export { useSalesOrderItemArr };
