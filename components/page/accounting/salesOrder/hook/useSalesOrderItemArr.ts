import { useState, useMemo, useEffect, useReducer } from 'react';
import Decimal from 'decimal.js';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TsalesOrder_Dto } from 'js/api/api_netCore/api_accountsReceivable';

type TsalesOrderItem = NonNullable<TsalesOrder_Dto['salesOrderItems']>[number];

interface Tstate {
  readonly attachedToProductId: string | null;

  quantity: `${number}` | '';
  unitPrice: `${number}` | '';
  amount: number;

  productId: string | null;
  productNumber: string;
  productName: string;
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
      type: 'productId';
      payload: {
        index: number;
        productId: string | null;
      };
    }
  | {
      type: 'productNumber';
      payload: {
        index: number;
        productNumber: string;
      };
    }
  | {
      type: 'productName';
      payload: {
        index: number;
        productName: string;
      };
    }
  | {
      type: 'add';
    }
  | {
      type: 'delete';
      payload: {
        index: number;
      };
    };

type Tinstance_salesOrderItemArr = ReturnType<typeof useSalesOrderItemArr>;

// ===============================================================================

const customProductNumber = 'A99999';

// ===============================================================================

// MARK: HOOK
const useDefaultState = (raw: TsalesOrderItem[] | undefined | null): Tstate[] => {
  return useMemo(() => {
    if (!raw) {
      return [];
    }

    return raw.map((item) => ({
      // raw: item,
      attachedToProductId: item.attachedToProductId,
      productId: item.productId,

      quantity: `${item.quantity || ''}`,
      unitPrice: `${item.unitPrice || ''}`,
      amount: item.amount || 0,
      productName: item.productName,
      productNumber: item.productNumber,
    }));
  }, [raw]);
};

// MARK:useSalesOrderItemArr
const useSalesOrderItemArr = (raw: TsalesOrderItem[] | undefined | null) => {
  const defaultState = useDefaultState(raw);

  const [state, dispatch] = useReducer(reducer_salesOrderItem, defaultState);

  // --------------------------------------------------------------------------------

  const totalAmount = useMemo(() => {
    return state.reduce((acc, cur) => acc.add(cur.amount || 0), new Decimal(0)).toNumber();
  }, [state]);

  // --------------------------------------------------------------------------------

  const setProduct_custom = (index: number, value: string) => {
    dispatch({
      type: 'productId',
      payload: { index: index, productId: null },
    });

    dispatch({
      type: 'productName',
      payload: { index: index, productName: value },
    });
    dispatch({
      type: 'productNumber',
      payload: { index: index, productNumber: customProductNumber },
    });
  };

  const setProduct = (
    index: number,
    value: {
      productId: string;
      productName: string;
      productNumber: string;
      price: number;
    }
  ) => {
    const { productId, productName, productNumber, price } = value;

    if (!state[index]) {
      myAlert.notify.error({
        message: 'state無效的索引',
      });

      return;
    }

    dispatch({
      type: 'productId',
      payload: { index: index, productId },
    });

    dispatch({
      type: 'productName',
      payload: { index: index, productName: productName },
    });
    dispatch({
      type: 'productNumber',
      payload: { index: index, productNumber: productNumber },
    });
    dispatch({
      type: 'unitPrice',
      payload: { index: index, unitPrice: `${price}` },
    });
  };

  const setUnitPrice = (index: number, unitPrice: `${number}` | '') => {
    if (!state[index]) {
      myAlert.notify.error({
        message: 'setUnitPrice,無效的索引',
      });

      return;
    }

    if (!checkIsAllowCustom(state[index].productNumber)) {
      myAlert.warning({ title: '非客制化主產品不可以編輯單價' });

      return;
    }

    dispatch({ type: 'unitPrice', payload: { index, unitPrice } });
  };

  // --------------------------------------------------------------------------------

  const reset = () => {
    dispatch({ type: 'replace', payload: defaultState });
  };

  // --------------------------------------------------------------------------------

  useEffect(() => {
    reset();
  }, [defaultState]);

  return {
    state,
    totalAmount,
    dispatch,
    //
    setUnitPrice,
    setProduct_custom,
    setProduct,
    //
    reset,
    checkIsAllowCustom,
  };
};

//  MARK: useSalesOrderItemArr END
//
//
//
//

// MARK: reducer
const reducer_salesOrderItem = (state: Tstate[], action: Taction_salsesOrderItem) => {
  if (action.type === 'replace') {
    return action.payload;
  }

  if (action.type === 'add') {
    const newItem: Tstate = emptyState();

    return [...state, newItem];
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

    case 'productId': {
      target = {
        ...target,
        productId: action.payload.productId,
      };
      break;
    }

    case 'productNumber': {
      target = {
        ...target,
        productNumber: action.payload.productNumber,
      };
      break;
    }

    case 'productName': {
      target = {
        ...target,
        productName: action.payload.productName,
      };
      break;
    }
  }

  copy[action.payload.index] = target;

  return copy;
};

// ===============================================================================

const emptyState = (): Tstate => ({
  attachedToProductId: null,
  productId: null,
  quantity: '',
  unitPrice: '',
  amount: 0,
  productName: '',
  productNumber: customProductNumber,
});

const checkIsAllowCustom = (productNumber: string) => {
  if (productNumber === customProductNumber) {
    return true;
  }

  return false;
};

export { useSalesOrderItemArr };

export type { Tinstance_salesOrderItemArr, TsalesOrderItem, Tstate, Taction_salsesOrderItem };
