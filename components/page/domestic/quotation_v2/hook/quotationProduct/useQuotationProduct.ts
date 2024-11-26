import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import { useDefaultState } from './useDefaultState';

import type {
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

// import { ClassProd_SJ202 } from './class/prod/classProd_SJ302';
import { lookup_classProd, Interface_ClassProd_base } from './class/prod/lookup_classProd';

import {
  TconfigItem,
  TcellKey,
  TnodeConfig,
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
} from './class/prod/config';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

// type
import type { TstateProd, TstateProdDict } from './type';

// ================================================================================

type TsetProd = React.Dispatch<React.SetStateAction<TstateProd>>;

type TuseQuotationProductInstance = ReturnType<typeof useQuotationProduct>;

// ================================================================================

const useQuotationProduct = ({
  raw_productArr,
  disabled,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  // 門型列表
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // ------------------------------------------------------------------------

  // region STATE
  const defaultState = useDefaultState({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });
  // 深拷貝，避免在編輯狀態內的物件時影響原始的defaultState
  const defaultState_copy = useMemo(() => {
    return _.cloneDeep(defaultState);
  }, [defaultState, disabled]);

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>([...defaultKeyArr]); // 欄位的key
  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState_copy.prodKeyArr); // 主產品的key
  const [activeProdKey, setActiveProdKey] = useState<string>();

  // state用來儲存資料狀態
  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState_copy.stateProdDict);

  // -----------------------------------------------------------------------

  const nodeConfig_prime = useMemo(() => {
    return createNodeConfig_prime({
      doorModelDict,
    });
  }, [doorModelDict]);

  // -----------------------------------------------------------------------
  // region FUNCTION

  const createSetProd = (key: string): TsetProd => {
    const setProd: TsetProd = (newState) => {
      setState_prodDict((prev) => {
        const newStateValue = typeof newState === 'function' ? newState(prev[key]) : newState;

        return {
          ...prev,
          [key]: {
            ...prev[key],
            // ...newState, newState若是函數，這個寫法不會壞掉?
            ...newStateValue,
          },
        };
      });
    };

    return setProd;
  };

  const choseActiveProd = (stateProd: TstateProd | undefined) => {
    setActiveProdKey(stateProd?.key);
  };

  // -----------------------------------------------------------------------

  // region COOKED

  // class用來管理資料狀態
  const classProdDict = useMemo(() => {
    if (!doorModelDict) {
      return {};
    }

    const dict: { [key: string]: Interface_ClassProd_base } = {};

    Object.entries(state_prodDict).forEach(([key, state]) => {
      if (state.key !== key) {
        throw new Error('classProdDict發生錯誤，key與state.key不一致');
      }

      const { doorModelName } = state.data_prod;

      if (!(doorModelName in lookup_classProd)) {
        return;
      }

      const prodName = doorModelName as keyof typeof lookup_classProd;

      const theClass = lookup_classProd[prodName];

      dict[key] = new theClass({
        stateProd: state,
        setStateProd: createSetProd(key),
        nodeConfig: nodeConfig_prime,
      });
    });

    return dict;
  }, [state_prodDict, nodeConfig_prime]);

  // MARK:activeClassProd
  const activeClassProd = useMemo(() => {
    if (!activeProdKey) {
      return undefined;
    }

    return classProdDict[activeProdKey];
  }, [activeProdKey, classProdDict]);

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    setState_prodDict(defaultState_copy.stateProdDict);
    setProdKeyArr(defaultState_copy.prodKeyArr);
  }, [defaultState_copy, disabled]);

  return {
    classProdDict,
    activeClassProd,
    //
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
  };
};

// ================================================================================

// ================================================================================

export type { TuseQuotationProductInstance };
export { useQuotationProduct, nodeConfig_origin };
