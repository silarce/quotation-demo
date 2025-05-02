import { useState, useEffect, useCallback, useMemo } from 'react';

// ==================================================================

interface Tstate_demandForm {
  readonly id: string;
  readonly itemName: string; // 項目名稱
  readonly doorModel: string; // 門型
  readonly fullWidth: number; // L
  readonly WG: number; // WG
  readonly height: number; // h
  readonly volume: number; // 才數
  readonly motor: string;
  readonly horsepower: string; // 馬力數
  readonly voltage: string; // 電壓
  readonly antiTyphoonBaseLock: number; // 防颱鎖固
  readonly obstacleSensor: boolean; // 障感器
  readonly infrared: boolean; // 紅外線
  readonly remoteControl: boolean; // 遙控器
  readonly smartSwitch: boolean; // 智慧開關
  readonly antiTyphoonColumn: boolean; // 防颱中柱
  readonly ul: boolean; // UL熔金體
  readonly wheel: boolean; // 檔輪

  checked: boolean;
  floor: string; // 樓層
  locationArea: string; // 區域
}

type Tinstance_useDemandForm = ReturnType<typeof useDemandForm>;
type TstateKit = ReturnType<Tinstance_useDemandForm['createStateKit']>;

// ==================================================================
const useDemandForm = (rawData: unknown | undefined) => {
  const defaultState = useDefaultState(rawData);
  const [stateArr, setStateArr] = useState<Tstate_demandForm[]>(defaultState);

  // -------------------------------------------------------------------------

  const checkedStateArr = useMemo(() => {
    return stateArr.filter((item) => item.checked);
  }, [stateArr]);

  // -------------------------------------------------------------------------

  const createStateKit = (index: number) => {
    const state = stateArr[index];

    const setChecked = (value: boolean) => {
      setStateArr((prev) => {
        const copy = [...prev];
        copy[index].checked = value;

        return copy;
      });
    };

    const setFloor = (value: string) => {
      setStateArr((prev) => {
        const copy = [...prev];
        copy[index].floor = value;

        return copy;
      });
    };

    const setLocationArea = (value: string) => {
      setStateArr((prev) => {
        const copy = [...prev];
        copy[index].locationArea = value;

        return copy;
      });
    };

    return {
      state,
      setChecked,
      setFloor,
      setLocationArea,
    };
  };

  // -------------------------------------------------------------------------
  const reset = () => {
    setStateArr(defaultState);
  };

  // -------------------------------------------------------------------------
  useEffect(() => {
    reset();
  }, [defaultState]);

  // -------------------------------------------------------------------------
  return {
    stateArr,
    createStateKit,
    reset,
    checkedStateArr,
  };
};

const useDefaultState = (rawData: unknown | undefined) => {
  return useCallback(() => {
    return fakeStateArr();
  }, [rawData]);
};

const fakeStateArr = (): Tstate_demandForm[] => {
  return [
    {
      id: 'aaaaa',
      checked: false,
      itemName: 'SD1',
      doorModel: 'SJ-302',
      fullWidth: 0,
      WG: 0,
      height: 0,
      volume: 0,
      motor: '東元',
      horsepower: '1/2',
      voltage: '單相220V',
      antiTyphoonBaseLock: 2,
      obstacleSensor: true,
      infrared: false,
      remoteControl: true,
      smartSwitch: true,
      antiTyphoonColumn: true,
      ul: false,
      wheel: false,

      floor: '',
      locationArea: '',
    },
    {
      id: 'bbbbb',
      checked: false,
      itemName: 'SD2',
      doorModel: 'SJ-302',
      fullWidth: 0,
      WG: 0,
      height: 0,
      volume: 0,
      motor: '東元',
      horsepower: '1/2',
      voltage: '單相220V',
      antiTyphoonBaseLock: 5,
      obstacleSensor: false,
      infrared: false,
      remoteControl: false,
      smartSwitch: false,
      antiTyphoonColumn: false,
      ul: false,
      wheel: true,

      floor: '',
      locationArea: '',
    },
    {
      id: 'ccccc',
      checked: false,
      itemName: 'SD3',
      doorModel: 'SJ-302',
      fullWidth: 0,
      WG: 0,
      height: 0,
      volume: 0,
      motor: '東元',
      horsepower: '5',
      voltage: '三相380V',
      antiTyphoonBaseLock: 0,
      obstacleSensor: false,
      infrared: false,
      remoteControl: true,
      smartSwitch: false,
      antiTyphoonColumn: false,
      ul: false,
      wheel: false,

      floor: '',
      locationArea: '',
    },
  ];
};

export type { Tinstance_useDemandForm, TstateKit };
export { useDemandForm };
