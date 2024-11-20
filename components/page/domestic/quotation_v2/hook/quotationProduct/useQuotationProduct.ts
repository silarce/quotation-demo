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

// ================================================================================

type TsetProd = React.Dispatch<React.SetStateAction<TstateProd>>;

interface TconfigItem {
  label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createInputSelProps: (classProd: Interface_ClassProd_base) => TinputSelProps | null;
}

// type TcellKey = keyof Interface_ClassProd_base;
type TcellKey = keyof Pick<
  Interface_ClassProd_base,
  'itemName' | 'discount' | 'quoteType'
  // | 'doorModelName'
  // | 'fullWidth'
  // | 'WG'
  // | 'height'
  // | 'boxB'
  // | 'boxD'
  // | 'area'
  // | 'volume'
>;

// type Tconfig = {
//   [key in TcellKey]: TconfigItem;
// };

type Tconfig = {
  [key in TcellKey]: TconfigItem;
};

// ================================================================================

const useQuotationProduct = ({
  //
  raw_productArr,
  disabled,
}: {
  raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  // region STATE
  const defaultState = useDefaultState(raw_productArr);

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>(createDefaultCellKeyArr()); // 欄位的key
  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState.prodKeyArr); // 主產品的key

  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState.stateProdDict);

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

  const classProdDict = useMemo(() => {
    const dict: { [key: string]: Interface_ClassProd_base } = {};

    // Object.entries(lookup_classProd).forEach(([key, value]) => {
    //   dict[key] = new value();
    // });

    Object.entries(state_prodDict).forEach(([key, state]) => {
      const { doorModelName } = state;

      if (!(doorModelName in lookup_classProd)) {
        return;
      }

      const prodName = doorModelName as keyof typeof lookup_classProd;

      const theClass = lookup_classProd[prodName];

      dict[key] = new theClass({
        stateProd: state,
        setStateProd: createSetProd(key),
      });
    });

    return dict;
  }, [state_prodDict]);

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
    setProdKeyArr,
  };
};

// ================================================================================

const createDefaultCellKeyArr = () => {
  const keyArr: TcellKey[] = [
    'itemName',
    'discount',
    'quoteType',
    // 'fullWidth',
    // 'WG',
    // 'height',
    // 'boxB',
    // 'boxD',
    // 'area',
    // 'volume',
  ];

  return keyArr;
};

const config: Tconfig = {
  itemName: {
    label: '項目',
    style: { width: 150 },
    createInputSelProps(classProd) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.itemName,
          onChange: (e) => {
            classProd.itemName = e.target.value;
          },
        },
      };

      return { inputProps };
    },
  },
  discount: {
    label: '折扣',
    style: { width: 60 },
    createInputSelProps(classProd) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.discount,
          onChange: (e) => {
            classProd.discount = e.target.value;
          },
        },
      };

      return { inputProps };
    },
  },
  quoteType: {
    label: '報價類型',
    style: { width: 200 },
    createInputSelProps(classProd) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.quoteType,
          onChange: (e) => {
            classProd.quoteType = e.target.value;
          },
        },
      };

      return { inputProps };
    },
  },
};

// ================================================================================

export { useQuotationProduct, config };
