import { useState, useEffect, useMemo } from 'react';

// =====================================================================
type TstateArr = string[];

type Tinstance_useRemark = ReturnType<typeof useRemark>;

// =====================================================================
const useRemark = (data: unknown | undefined) => {
  const defaultState = useDefaultState(data);

  const [stateArr_remark, setStateArr_remark] = useState<TstateArr>([...defaultState.remarkArr]);
  const [stateArr_quotationRange, setStateArr_quotationRange] = useState<TstateArr>([
    ...defaultState.quotationRangeArr,
  ]);

  // -----------------------------------------------------------------------

  const setRemark = (index: number, value: string) => {
    setStateArr_remark((prev) => {
      const newArr = [...prev];
      newArr[index] = value;

      return newArr;
    });
  };

  const setQuotationRange = (index: number, value: string) => {
    setStateArr_quotationRange((prev) => {
      const newArr = [...prev];
      newArr[index] = value;

      return newArr;
    });
  };

  const addRemark = (valueArr: string[] = ['']) => {
    setStateArr_remark((prev) => {
      const newArr = [...prev, ...valueArr];

      return newArr;
    });
  };

  const addQuotationRange = (valueArr: string[] = ['']) => {
    setStateArr_quotationRange((prev) => {
      const newArr = [...prev, ...valueArr];

      return newArr;
    });
  };

  const removeRemark = (index: number) => {
    setStateArr_remark((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);

      return newArr;
    });
  };

  const removeQuotationRange = (index: number) => {
    setStateArr_quotationRange((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);

      return newArr;
    });
  };

  // -----------------------------------------------------------------------

  const reset = () => {
    setStateArr_remark([...defaultState.remarkArr]);
    setStateArr_quotationRange([...defaultState.quotationRangeArr]);
  };

  // -----------------------------------------------------------------------
  useEffect(() => {
    reset();
  }, [defaultState]);

  //
  return {
    stateArr_remark,
    stateArr_quotationRange,
    setRemark,
    setQuotationRange,
    addRemark,
    addQuotationRange,
    removeRemark,
    removeQuotationRange,
    reset,
  };
};

const useDefaultState = (data: unknown | undefined) => {
  return useMemo(() => {
    if (!data) {
      return {
        remarkArr: [] as TstateArr,
        quotationRangeArr: [] as TstateArr,
      };
    }

    return {
      remarkArr: [] as TstateArr,
      quotationRangeArr: [] as TstateArr,
    };
  }, [data]);
};

export type { Tinstance_useRemark };
export { useRemark };
