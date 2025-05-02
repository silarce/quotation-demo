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
    鼠: {
      id: '01',
      catagory: '鼠',
      name: 'Rat',
      spec: 'Spec 鼠',
      quantity: '',
      unit: 'pcs',
      note: '鼠鼠鼠',
    },
    牛: {
      id: '02',
      catagory: '牛',
      name: 'Ox',
      spec: 'Spec 牛',
      quantity: '',
      unit: 'pcs',
      note: '牛牛牛',
    },
    虎: {
      id: '03',
      catagory: '虎',
      name: 'Tiger',
      spec: 'Spec 虎',
      quantity: '',
      unit: 'pcs',
      note: '虎虎虎',
    },
    兔: {
      id: '04',
      catagory: '兔',
      name: 'Rabbit',
      spec: 'Spec 兔',
      quantity: '',
      unit: 'pcs',
      note: '兔兔兔',
    },
    龍: {
      id: '05',
      catagory: '龍',
      name: 'Dragon',
      spec: 'Spec 龍',
      quantity: '',
      unit: 'pcs',
      note: '龍龍龍',
    },
    蛇: {
      id: '06',
      catagory: '蛇',
      name: 'Snake',
      spec: 'Spec 蛇',
      quantity: '',
      unit: 'pcs',
      note: '蛇蛇蛇',
    },
    馬: {
      id: '07',
      catagory: '馬',
      name: 'Horse',
      spec: 'Spec 馬',
      quantity: '',
      unit: 'pcs',
      note: '馬馬馬',
    },
    羊: {
      id: '08',
      catagory: '羊',
      name: 'Goat',
      spec: 'Spec 羊',
      quantity: '',
      unit: 'pcs',
      note: '羊羊羊',
    },
    猴: {
      id: '09',
      catagory: '猴',
      name: 'Monkey',
      spec: 'Spec 猴',
      quantity: '',
      unit: 'pcs',
      note: '猴猴猴',
    },
    雞: {
      id: '10',
      catagory: '雞',
      name: 'Rooster',
      spec: 'Spec 雞',
      quantity: '',
      unit: 'pcs',
      note: '雞雞雞',
    },
    狗: {
      id: '11',
      catagory: '狗',
      name: 'Dog',
      spec: 'Spec 狗',
      quantity: '',
      unit: 'pcs',
      note: '狗狗狗',
    },
    豬: {
      id: '12',
      catagory: '豬',
      name: 'Pig',
      spec: 'Spec 豬',
      quantity: '',
      unit: 'pcs',
      note: '豬豬豬',
    },
  };
};

export { useDemandFormDetail };

export type { Tstate, Tinstance_useDemandFormDetail, TstateKit };
