import { useState, useEffect, useCallback } from 'react';

interface Tstate {
  readonly id: string;
  readonly catagory: string;
  readonly name: string;
  readonly spec: string;
  quantity: `${number}` | '';
  readonly unit: string;
  readonly note: string;
}

interface TstateDict {
  [key: string]: Tstate;
}

type Tinstance_useDemandFormDetail = ReturnType<typeof useDemandFormDetail>;
type TstateKit = ReturnType<Tinstance_useDemandFormDetail['createStateKit']>;

// =================================================================
const useDemandFormDetail = (rawData: unknown | undefined) => {
  const defaultState = useDefaultState(rawData);
  const [stateDict, setStateDict] = useState<TstateDict>(defaultState);

  // -------------------------------------------------------------------------

  const createStateKit = (key: string) => {
    const setQuantity = (value: `${number}` | '') => {
      setStateDict((prev) => {
        const copy = { ...prev };

        if (key === '鎖盒' || key === '鎖匙' || key === '押扣') {
          copy['鎖盒'] = { ...copy['鎖盒'], quantity: value };
          copy['鎖匙'] = { ...copy['鎖匙'], quantity: value };
          copy['押扣'] = { ...copy['押扣'], quantity: value };
        } else {
          copy[key] = {
            ...copy[key],
            quantity: value,
          };
        }

        return copy;
      });
    };

    return {
      state: stateDict[key],
      setQuantity,
    };
  };

  // -------------------------------------------------------------------------
  const reset = () => {
    setStateDict(defaultState);
  };

  // -------------------------------------------------------------------------
  useEffect(() => {
    reset();
  }, [defaultState]);

  // -------------------------------------------------------------------------
  return {
    stateDict,
    createStateKit,
    reset,
  };
};

const useDefaultState = (rawData: unknown | undefined) => {
  return useCallback(() => {
    return fakeStateDict();
  }, [rawData]);
};

const fakeStateDict = (): TstateDict => {
  return {
    鎖盒: {
      id: 'aa',
      catagory: '鎖盒',
      name: 'Item 1',
      spec: 'Spec 1',
      quantity: '',
      unit: 'pcs',
      note: 'Note 1',
    },
    鎖匙: {
      id: 'bb',
      catagory: '鎖匙',
      name: 'Item 2',
      spec: 'Spec 2',
      quantity: '10',
      unit: 'pcs',
      note: 'Note 2',
    },
    押扣: {
      id: 'cc',
      catagory: '押扣',
      name: 'Item 3',
      spec: 'Spec 3',
      quantity: '',
      unit: 'pcs',
      note: 'Note 3',
    },
    主機: {
      id: 'cc',
      catagory: '主機',
      name: 'meow',
      spec: 'meowmeow',
      quantity: '',
      unit: 'meowmeowmeow',
      note: 'meowmeowmeowmeowmeow',
    },
  };
};

export { useDemandFormDetail };

export type { Tstate, Tinstance_useDemandFormDetail, TstateKit };
