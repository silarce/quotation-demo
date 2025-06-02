import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

import type { TquotationContentOtherDto, TcreateQuotationContentOtherDto } from 'js/api/dtoTypes';

import type { TstateOther } from './type';

// ===========================================================================

type TsetOther = <K extends keyof TstateOther>(key: K, value: TstateOther[K]) => void;
type Tinstance_useQuotationOther = ReturnType<typeof useQuotationOther>;

type Tstate = TstateOther[];

type TexportState = Tstate;

// ===========================================================================

const useQuotationOther = ({
  disabled,
  raw_contentOtherArr,
  onOtherPriceAllTotalChange,
}: {
  disabled: boolean;
  raw_contentOtherArr: TquotationContentOtherDto[] | undefined;
  onOtherPriceAllTotalChange: (total: number) => void;
}) => {
  const defaultState = useDefaultState({ raw_contentOtherArr });

  const [state, setState] = useState<Tstate>([]);

  const createSetOther = (index: number) => {
    const setOther: TsetOther = (key, value) => {
      setState((prev) => {
        if (key === 'unitPrice') {
          const value_num = Number(value);
          value = isNaN(value_num) ? '' : `${Math.floor(value_num)}`;
        }

        const copy = [...prev];

        const target = copy[index];

        target[key] = value;

        if (key === 'quantity' || key === 'unitPrice') {
          const quantity = new Decimal(target.quantity || 0);
          const unitPrice = new Decimal(target.unitPrice || 0);

          target.totalPrice = quantity.mul(unitPrice).toDecimalPlaces(0).toString() as `${number}`;
        }

        copy[index] = { ...target };

        if (key === 'quantity' || key === 'unitPrice') {
          onOtherPriceAllTotalChange(calcAllOtherTotalPrice(copy));
        }

        return copy;
      });
    };

    return setOther;
  };

  const calcAllOtherTotalPrice = (newState?: Tstate) => {
    let allTotal_d = new Decimal(0);

    (newState ?? state).forEach((other) => {
      allTotal_d = allTotal_d.add(other.totalPrice || 0);
    });

    return allTotal_d.toNumber();
  };

  const addOther = () => {
    setState((prev) => {
      const copy = [...prev];

      copy.push({
        item: '',
        description: '',
        quantity: '',
        unit: null,
        unitPrice: '',
        totalPrice: '',
        notes: '',
        spec: null,
      });

      return copy;
    });
  };

  const removeOther = (index: number) => {
    setState((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);

      onOtherPriceAllTotalChange(calcAllOtherTotalPrice(copy));

      return copy;
    });
  };

  const restoreState = (backupState: TexportState) => {
    setState(backupState);
  };

  useEffect(() => {
    setState(_.cloneDeep(defaultState));
  }, [defaultState, disabled]);

  return {
    state_otherArr: state,
    createSetOther,
    formatToBody_other: () => formatToBody_other(state),
    calcAllOtherTotalPrice,
    addOther,
    removeOther,

    restoreState,
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

// ===========================================================================

const formatToBody_other = (state_otherArr: TstateOther[]) => {
  const body: TcreateQuotationContentOtherDto[] = state_otherArr.map((other) => {
    const bodyItem: TcreateQuotationContentOtherDto = {
      item: other.item,
      description: other.description,
      unit: other.unit || null,
      unitPrice: Number(other.unitPrice || 0),
      notes: other.notes,
      spec: other.spec || null,
      quantity: other.quantity || '0',
      totalPrice: other.totalPrice || '0',
    };

    return bodyItem;
  });

  return body;
};

// ===========================================================================
export { useQuotationOther };
export type { TstateOther, Tinstance_useQuotationOther, TsetOther, TexportState };
