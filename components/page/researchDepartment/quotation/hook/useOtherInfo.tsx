import { useState, useEffect, useCallback } from 'react';

import { Moment } from 'moment';

// ====================================================================

interface Tstate_otherInfo {
  deliveryLocation: string; // 交貨地點
  deliveryDate: Moment | null; // 交貨日期
  paymentMethods: {
    milestone: string;
    totalPaymentRatio: `${number}` | ''; // 0~100 浮點數
  }[]; //付款辦法
}

type Tinstance_useOtherInfo = ReturnType<typeof useOtherInfo>;

// =================================================================================
const useOtherInfo = (rawDarta: unknown | undefined) => {
  const defaultState = useDefaultState(rawDarta);
  const [state_otherInfo, setState_otherInfo] = useState<Tstate_otherInfo>(defaultState);

  // -------------------------------------------------------------------

  const addPaymentMethod = () => {
    setState_otherInfo((prev) => {
      const copy = { ...prev };
      copy.paymentMethods.push({
        milestone: '',
        totalPaymentRatio: '',
      });

      return copy;
    });
  };

  const removePaymentMethod = (index: number) => {
    setState_otherInfo((prev) => {
      const copy = { ...prev };
      copy.paymentMethods.splice(index, 1);

      return copy;
    });
  };

  const editPaymentMethod = ({
    index,
    milestone,
    totalPaymentRatio,
  }: {
    index: number;
    milestone?: string;
    totalPaymentRatio?: `${number}` | '';
  }) => {
    setState_otherInfo((prev) => {
      const copy = { ...prev };

      if (milestone !== undefined) {
        copy.paymentMethods[index].milestone = milestone;
      }

      if (totalPaymentRatio !== undefined) {
        copy.paymentMethods[index].totalPaymentRatio = totalPaymentRatio;
      }

      return copy;
    });
  };

  // -------------------------------------------------------------------
  const reset = () => {
    setState_otherInfo(defaultState());
  };

  // -------------------------------------------------------------------
  useEffect(() => {
    reset();
  }, [defaultState]);

  // -------------------------------------------------------------------
  return {
    state_otherInfo,
    setState_otherInfo,
    addPaymentMethod,
    removePaymentMethod,
    editPaymentMethod,
    reset,
  };
};

const useDefaultState = (rawData: unknown | undefined) => {
  return useCallback(() => {
    if (!rawData) {
      return emptyState();
    }

    return emptyState();
  }, [rawData]);
};

const emptyState = (): Tstate_otherInfo => ({
  deliveryLocation: '',
  deliveryDate: null,
  paymentMethods: [
    {
      milestone: '訂製同時付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '門軌安裝完成付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '門扇安裝完成付總金額',
      totalPaymentRatio: '',
    },
    {
      milestone: '驗收完成(保留款)付總金額',
      totalPaymentRatio: '',
    },
  ],
});

export type { Tinstance_useOtherInfo };
export { useOtherInfo };
