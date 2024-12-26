import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';

import type { TquotationContentOtherDto } from 'js/api/dtoTypes';

import type { TstateOther } from './type';

const useQuotationOther = ({
  disabled,
  raw_contentOtherArr,
}: {
  disabled: boolean;
  raw_contentOtherArr: TquotationContentOtherDto[] | undefined;
}) => {
  const defaultState = useDefaultState({ raw_contentOtherArr });

  const [state, setState] = useState<TstateOther[]>(defaultState);

  const createSetOther = (index: number) => {
    function setOther<K extends Exclude<keyof TstateOther, 'totalPrice'>>({
      key,
      value,
    }: {
      key: K;
      value: TstateOther[K];
    }) {
      setState((prev) => {
        const copy = [...prev];

        const target = copy[index];

        target[key] = value;

        if (key === 'quantity' || key === 'unitPrice') {
          const quantity = new Decimal(target.quantity || 0);
          const unitPrice = new Decimal(target.unitPrice || 0);

          target.totalPrice = quantity.mul(unitPrice).toNumber().toString() as `${number}`;
        }

        copy[index] = { ...target };

        return copy;
      });
    }

    return setOther;
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState, disabled]);

  return {
    state_otherArr: state,
    createSetOther,
  };
};

// ===========================================================================

const useDefaultState = ({ raw_contentOtherArr }: { raw_contentOtherArr: TquotationContentOtherDto[] | undefined }) => {
  const defaultState = useMemo(() => {
    if (!raw_contentOtherArr) {
      return [];
    }

    const arr: TstateOther[] = raw_contentOtherArr.map((other) => {
      const state: TstateOther = {
        // 項目
        item: other.item,
        // 內容
        description: other.description,
        // 數量
        quantity: `${other.quantity || ''}` as `${number}` | '',
        // 單位
        unit: other.unit,
        // 單價
        unitPrice: `${other.unitPrice || ''}` as `${number}` | '',
        // 複價
        totalPrice: `${other.totalPrice || ''}` as `${number}` | '',
        // 備註
        notes: other.notes,
        // 尺寸規格
        spec: other.spec,
      };

      return state;
    });

    return arr;
  }, [raw_contentOtherArr]);

  return defaultState;
};

export { useQuotationOther };
