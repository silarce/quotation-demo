import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import { useDefaultState } from './useDefaultState';

import type {
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { TstateProd, TstateProdDict } from './type';

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

// ================================================================================

type TsetProd = React.Dispatch<React.SetStateAction<TstateProd>>;

// ================================================================================

const useQuotationProduct = ({
  //
  raw_productArr,
  disabled,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // region STATE
  const defaultState = useDefaultState({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>([...defaultKeyArr]); // 欄位的key
  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState.prodKeyArr); // 主產品的key

  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState.stateProdDict);

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

  // -----------------------------------------------------------------------

  // 將state與class分離的作法不可行
  // 效能被消耗得太嚴重
  const classProdDict = useMemo(() => {
    if (!doorModelDict) {
      return {};
    }

    const dict: { [key: string]: Interface_ClassProd_base } = {};

    Object.entries(state_prodDict).forEach(([key, state]) => {
      const { doorModelName } = state.data;

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

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    setState_prodDict(defaultState.stateProdDict);
    setProdKeyArr(defaultState.prodKeyArr);
  }, [defaultState, disabled]);

  // console.log(classProdDict);

  return {
    classProdDict,
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    // prodKeyArr: [prodKeyArr[0]],
    setProdKeyArr,
  };
};

// ================================================================================

// ================================================================================

export { useQuotationProduct, nodeConfig_origin as configFotThead };
