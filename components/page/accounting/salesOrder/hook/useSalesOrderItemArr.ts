import { useState, useMemo, useEffect, useReducer } from 'react';
import Decimal from 'decimal.js';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TsalesOrder_Dto } from 'js/api/api_netCore/api_accountsReceivable';

type TsalesOrderItem = NonNullable<TsalesOrder_Dto['salesOrderItems']>[number];

interface Tstate {
  raw: TsalesOrderItem;
  quantity: `${number}` | '';
  unitPrice: `${number}` | '';
  amount: number;
}

type Taction_salsesOrderItem =
  | {
      type: 'quantity';
      payload: {
        index: number;
        quantity: `${number}` | '';
      };
    }
  | {
      type: 'unitPrice';
      payload: {
        index: number;
        unitPrice: `${number}` | '';
      };
    }
  | {
      type: 'replace';
      payload: Tstate[];
    }
  | {
      type: 'delete';
      payload: {
        index: number;
      };
    };

type Tinstance_salesOrderItemArr = ReturnType<typeof useSalesOrderItemArr>;

const reducer_salesOrderItem = (state: Tstate[], action: Taction_salsesOrderItem) => {
  if (action.type === 'replace') {
    return action.payload;
  }

  if (!state[action.payload.index]) {
    myAlert.notify.error({
      message: 'reducer,無效的索引',
    });

    return state;
  }

  const copy = [...state];
  let target = { ...copy[action.payload.index] };

  if (action.type === 'delete') {
    copy.splice(action.payload.index, 1);

    return copy;
  }

  switch (action.type) {
    case 'quantity': {
      const quantity = action.payload.quantity;
      const unitPrice = target.unitPrice;
      const amount = new Decimal(quantity || 0).mul(unitPrice || 0).toNumber();
      target = {
        ...target,
        quantity,
        amount,
      };
      break;
    }

    case 'unitPrice': {
      const unitPrice = action.payload.unitPrice;
      const quantity = target.quantity;
      const amount = new Decimal(unitPrice || 0).mul(quantity || 0).toNumber();
      target = {
        ...target,
        unitPrice,
        amount,
      };
      break;
    }
  }

  copy[action.payload.index] = target;

  return copy;
};

const useDefaultState = (raw: TsalesOrderItem[] | undefined | null): Tstate[] => {
  return useMemo(() => {
    if (!raw) {
      return [];
    }

    return raw.map((item) => ({
      raw: item,
      quantity: `${item.quantity || ''}`,
      unitPrice: `${item.unitPrice || ''}`,
      amount: item.amount || 0,
    }));
  }, [raw]);
};

const useSalesOrderItemArr = (raw: TsalesOrderItem[] | undefined | null) => {
  const defaultState = useDefaultState(raw);

  const [state, dispatch] = useReducer(reducer_salesOrderItem, defaultState);

  const reset = () => {
    dispatch({ type: 'replace', payload: defaultState });
  };

  useEffect(() => {
    reset();
  }, [defaultState]);

  return {
    state,
    dispatch,
    reset,
  };
};

export { useSalesOrderItemArr };

export type { Tinstance_salesOrderItemArr, TsalesOrderItem, Tstate, Taction_salsesOrderItem };
