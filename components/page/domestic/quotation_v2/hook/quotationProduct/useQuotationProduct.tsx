import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { nanoid } from 'nanoid';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

import { useDebounce } from 'hooks/useDebounce';

import type {
  TquotationContentDto,
  // TquotationProductDto,
  // TquotationProductComponentDto,
  // TquotationProductAccessoryDto,
  // TcreateQuotationProductDto,
  // TcreateQuotationProductComponentDto,
  // TcreateQuotationProductAccessoryDto,
} from 'js/api/dtoTypes';

// -------------------------------------------------------------------------------

// type
import type {
  TstateProd,
  TsetProd,
  //
  // TstateProdData,
  TstateProdDict,
  //
  // TstateComponentData,
  // TcomponentRawDataDict,
  Tdata_componentDict,
  TsetComponent,
  //
  TstateAccessoryData,
  TsetAccessory,
} from './type';

import { ClassProd } from './class/prod/classProd_remake';

import {
  TconfigItem,
  TcellKey,
  TnodeConfig,

  //
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
  //
} from './class/prod/config';

import {
  //
  TdoorComponentType,
  //
  ClassCompnent_slat,
  ClassCompnent_bottomBar,
  ClassCompnent_guideRail,
  ClassCompnent_sidePlate,
  ClassCompnent_roller,
  ClassCompnent_motor,
  ClassCompnent_motorAccessories,
  ClassCompnent_headBox,
  ClassCompnent_middlePillar,
  ClassCompnent_backBone,
} from './class/component';

import { Class_distributionBox, Class_installationFee } from './class/pseudoComponent';

import {
  TnodeConfig_component,
  TcellKey_component,
  defaultKeyArr_component,
  createNodeConfig_component,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import { Interface_ClassAccessory, Class_accessory } from './class/accessory/classAccessory';
import {
  TconfigItem_accessory,
  TnodeConfig_accessory,
  TcellKey_accessory,
  defaultKeyArr_accessory,
  createNodeConfig_accessory,
} from './class/accessory/config';

// hook
import { useDefaultState_prodDict, createEmptyStateProd } from './useDefaultState_prodDict';

// method
import { formatProdStateToBody } from './method/formatProdStateToBody';
import { createClassComponentDict } from './method/createClassComponentDict';
import { createAccessoryDict } from './method/createAccessoryDict';
import { calcProductBody as _calcProductBody } from './method/calcProductBody';

import {
  //
  // calcProdTotalPrice,
  // w注意 calcAndRenewAllProdPrice_sideEffect有副作用
  calcAndRenewAllProdPrice_sideEffect,
  calcPriceDiscount_percent,
  //
} from './method/calcProd';
import { calcProdSummary } from './method/calcProdSummary';

import { kit_createClass, useActivedClass } from './method/kit_createClass';

// ================================================================================

type TcreateSetComponent = <T extends keyof TstateProd['data_componentDict']>({
  pordKey,
  componentKey,
}: {
  pordKey: string;
  componentKey: T;
}) => TsetComponent<T>;

type TcreateSetAccessory = (props: { prodKey: string; accessoryKey: string }) => TsetAccessory;

type TuseQuotationProductInstance = ReturnType<typeof useQuotationProduct>;

type TclassComponentDict = {
  [K in TdoorComponentType]?: K extends 'slat'
    ? ClassCompnent_slat
    : K extends 'bottomBar'
    ? ClassCompnent_bottomBar
    : K extends 'guideRail'
    ? ClassCompnent_guideRail
    : K extends 'sidePlate'
    ? ClassCompnent_sidePlate
    : K extends 'roller'
    ? ClassCompnent_roller
    : K extends 'motor'
    ? ClassCompnent_motor
    : K extends 'motorAccessories'
    ? ClassCompnent_motorAccessories
    : K extends 'headBox'
    ? ClassCompnent_headBox
    : K extends 'middlePillar'
    ? ClassCompnent_middlePillar
    : K extends 'backBone'
    ? ClassCompnent_backBone
    : never;
};

type TclassPsuedoComponentDict = {
  distributionBox: Class_distributionBox;
  installationFee?: Class_installationFee;
};

interface TclassAccessoryDict {
  [key: string]: Class_accessory;
}

// ================================================================================

const nodeConfig_component_origin = createNodeConfig_component();
const nodeConfig_accessory_origin = createNodeConfig_accessory();

// ================================================================================

// MARK:START
const useQuotationProduct = ({
  raw_quotationContent,
  disabled,
  onProdAllTotalChange: _onProdAllTotalChange,
}: {
  raw_quotationContent: TquotationContentDto | undefined;
  disabled: boolean;
  onProdAllTotalChange: (alltotal: number) => void;
}) => {
  const raw_productArr = raw_quotationContent?.products;
  const defaultQuotationDiscount = (raw_quotationContent ? raw_quotationContent.discount : '100') as `${number}`;

  // ------------------------------------------------------------------------
  // 門型列表
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // ------------------------------------------------------------------------

  // region STATE

  const defaultState_prodDict = useDefaultState_prodDict({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });
  // 深拷貝，避免在編輯state_prodDict內的物件時影響原始的defaultState
  const defaultState_copy = useMemo(() => {
    return _.cloneDeep(defaultState_prodDict);
  }, [defaultState_prodDict, disabled]);

  // 總折數
  const [state_quotationDiscount, setState_quotationDiscount] = useState<`${number}` | ''>(defaultQuotationDiscount);

  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState_copy.prodKeyArr); // 主產品的key
  const [activeProdKey, setActiveProdKey] = useState<string>();

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>([...defaultKeyArr]); // 欄位的key
  const [cellKeyArr_component, setCellKeyArr_component] = useState<TcellKey_component[]>([...defaultKeyArr_component]); // 欄位的key
  const [cellKeyArr_accessory, setCellKeyArr_accessory] = useState<TcellKey_accessory[]>([...defaultKeyArr_accessory]); // 欄位的key

  // state用來儲存資料狀態
  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState_copy.stateProdDict);
  const { debouncedState: debounced_state_prodDict, isBouncing } = useDebounce(state_prodDict, 500);

  const nodeConfig_prime = useMemo(() => {
    return createNodeConfig_prime({
      doorModelDict,
    });
  }, [doorModelDict]);

  const { avgDiscount, doorModelSummery } = useMemo(() => {
    const { avgDiscount, doorModelSummery } = calcProdSummary({
      state_prodDict: debounced_state_prodDict,
      state_quotationDiscount: state_quotationDiscount || 0,
    });

    return { avgDiscount, doorModelSummery };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced_state_prodDict]);

  // -----------------------------------------------------------------------
  // region STATE HANDLER
  //
  //
  //
  //

  const onProdAllTotalChange = (state_prodDict?: TstateProdDict) => {
    _onProdAllTotalChange(calcProdAllTotal(state_prodDict));
  };

  const choseActiveProd = (stateProd: TstateProd | undefined) => {
    setActiveProdKey(stateProd?.key);
  };

  const setComponentKeyArr = (newKeyArr: TdoorComponentType[]) => {
    if (!activeProdKey) {
      return;
    }

    setState_prodDict((prev) => {
      const copy = { ...prev };
      const activedProd = copy[activeProdKey];
      activedProd.componentKeyArr = newKeyArr;

      return copy;
    });
  };

  const setAccessoryKeyArr = (newKeyArr: string[]) => {
    if (!activeProdKey) {
      return;
    }

    setState_prodDict((prev) => {
      const copy = { ...prev };
      const activedProd = copy[activeProdKey];
      activedProd.accessoryKeyArr = newKeyArr;

      return copy;
    });
  };

  const setQuotationDiscount = (value: `${number}` | '') => {
    setState_quotationDiscount(value);

    // w注意 calcAndRenewAllProdPrice_sideEffect有副作用
    calcAndRenewAllProdPrice_sideEffect({
      prodDict: state_prodDict,
      quotationDiscount: value,
    });

    onProdAllTotalChange();
  };

  // -----------------------------------------------------------------------

  // region CREATE CLASS

  const activedProd = activeProdKey ? state_prodDict[activeProdKey] : undefined;

  const {
    createSetProd,
    // createSetComponent,
    createSetAccessory,
    createActivedClassAccessoryDict,
    createClassProd,
    createActivedClassComponentDict,
    //
    addEmptyProd,
    removeProd,
    copyProd,
  } = kit_createClass({
    setState_prodDict,
    nodeConfig_prime,
    state_quotationDiscount,
    onProdAllTotalChange,
    setProdKeyArr,
    state_prodDict,
    activeProdKey,
    setActiveProdKey,
  });

  const {
    //
    activedClassProd,
    activedClassComponentDict,
    activedClassPseudoComponentDict,
    activedClassAccessoryDict,
  } = useActivedClass({
    activedProd,
    createClassProd,
    createActivedClassComponentDict,
    createSetProd,
    createSetAccessory,
  });

  // -----------------------------------------------------------------------

  // region METHOD

  function calcProdAllTotal(newState_prodDict?: TstateProdDict) {
    const prodDict = newState_prodDict ?? state_prodDict;

    let total_d = new Decimal(0);
    // 運作如預期的話，state_prodDict裡每一個物件的參考都不會改變
    // 不會有物件狀態未更新而金額不對的問題
    Object.values(prodDict).forEach((prod) => {
      total_d = total_d.add(prod.data_prod.totalPrice || 0);
    });

    return total_d.toNumber();
  }

  const calcProductBody = () => {
    return _calcProductBody({
      prodKeyArr,
      createClassProd,
      state_prodDict,
    });
  };

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    if (disabled) {
      setState_prodDict(defaultState_copy.stateProdDict);
      setProdKeyArr(defaultState_copy.prodKeyArr);
      setActiveProdKey(undefined);
    }
  }, [defaultState_copy, disabled]);

  useEffect(() => {
    if (activedProd) {
      const activedClassProd = createClassProd(activedProd);

      if (!activedClassProd.isInited) {
        activedClassProd.init();
      }
    }
  }, [activeProdKey]);

  useEffect(() => {
    setState_quotationDiscount(defaultQuotationDiscount);
  }, [disabled, defaultQuotationDiscount]);

  // -----------------------------------------------------------------------------
  // MARK: RETURN
  return {
    // classProdDict,
    // activedClassProd,
    activedProd,
    activedClassProd,
    activedClassComponentDict,
    activedClassPseudoComponentDict,
    activedClassAccessoryDict,
    //
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
    //
    // activedClassComponentArr,
    // activedClassComponentDict,
    cellKeyArr_component,
    setCellKeyArr_component,
    componentKeyArr: activedProd?.componentKeyArr,
    setComponentKeyArr,
    //
    // activedClassAccessoryDict,
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr: activedProd?.accessoryKeyArr,
    setAccessoryKeyArr,
    // showAccessorySelector,
    //
    nodeConfig_origin,
    nodeConfig_component_origin,
    nodeConfig_accessory_origin,
    //
    //
    //
    quotationDiscount: state_quotationDiscount, // 總折數
    setQuotationDiscount,
    //
    // state_totalPrice, // 完整狀態
    // setProdPriceTotal,
    // setTuneTotal,
    // setCurrency,
    // setExchangeRate,
    //
    //
    //
    state_prodDict,

    // lookup_classProd,
    // nodeConfig_prime,

    createActivedClassComponentDict,
    createActivedClassAccessoryDict,
    createClassProd,
    //
    calcProductBody,
    calcProdAllTotal,
    //
    addEmptyProd,
    removeProd,
    copyProd,
    //
    avgDiscount,
    doorModelSummery,
  };
};

// MARK: END
//

// ================================================================================

// ================================================================================

export type {
  TuseQuotationProductInstance,
  TstateProd,
  TclassComponentDict,
  TcreateSetComponent,
  TcreateSetAccessory,
  TclassAccessoryDict,
  TstateProdDict,
  TsetComponent,
  TsetAccessory,
  TclassPsuedoComponentDict,
};
export { useQuotationProduct, ClassProd };
