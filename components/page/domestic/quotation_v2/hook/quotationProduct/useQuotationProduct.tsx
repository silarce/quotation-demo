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
import { calcProdSummary, TdoorModelSummeryItem } from './method/calcProdSummary';

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

interface Tinstance_useQuotationProduct {
  state_prodDict: TstateProdDict;
  activedProd: TstateProd | undefined;
  activedClassProd: ClassProd | undefined;
  prodKeyArr: string[];

  activedClassComponentDict: TclassComponentDict | undefined;
  activedClassPseudoComponentDict: TclassPsuedoComponentDict | undefined;
  activedClassAccessoryDict: TclassAccessoryDict | undefined;

  cellKeyArr: TcellKey[];
  setCellKeyArr: React.Dispatch<React.SetStateAction<TcellKey[]>>;
  setProdKeyArr: React.Dispatch<React.SetStateAction<string[]>>;

  choseActiveProd: (stateProd: TstateProd | undefined) => void;

  cellKeyArr_component: TcellKey_component[];
  setCellKeyArr_component: React.Dispatch<React.SetStateAction<TcellKey_component[]>>;
  componentKeyArr: TdoorComponentType[] | undefined;
  setComponentKeyArr: (newKeyArr: TdoorComponentType[]) => void;

  cellKeyArr_accessory: TcellKey_accessory[];
  setCellKeyArr_accessory: React.Dispatch<React.SetStateAction<TcellKey_accessory[]>>;
  accessoryKeyArr: string[] | undefined;
  setAccessoryKeyArr: (newKeyArr: string[]) => void;

  nodeConfig_origin: TnodeConfig;
  nodeConfig_component_origin: TnodeConfig_component;
  nodeConfig_accessory_origin: TnodeConfig_accessory;

  quotationDiscount: `${number}` | '';
  setQuotationDiscount: (value: `${number}` | '') => void;

  // createActivedClassComponentDict: aaaaa;
  // createActivedClassAccessoryDict: aaaaa;
  createClassProd: (stateProd: TstateProd) => ClassProd;
  calcProductBody: () => ReturnType<typeof _calcProductBody>;
  calcProdAllTotal: (newState_prodDict?: TstateProdDict) => number;

  addEmptyProd: () => void;
  removeProd: (prodKey: string) => void;
  copyProd: (prodKey: string) => void;
  avgDiscount: number;
  doorModelSummery: Record<string, TdoorModelSummeryItem>;
}

// ================================================================================

const nodeConfig_component_origin = createNodeConfig_component();
const nodeConfig_accessory_origin = createNodeConfig_accessory();

const throwErr = () => {
  throw new Error('合約總主產品表格預期不可以呼叫這個方法');
};

// ================================================================================

// MARK:START
const useQuotationProduct = ({
  raw_quotationProductArr,
  raw_quotationDiscount,
  iterativeContractProductArr,
  disabled,
  onProdAllTotalChange: _onProdAllTotalChange,
}: {
  // raw_quotationContent: TquotationContentDto | undefined;
  raw_quotationProductArr: TquotationContentDto['products'] | undefined;
  raw_quotationDiscount: TquotationContentDto['discount'] | undefined;
  iterativeContractProductArr: TquotationContentDto['products'] | undefined;
  disabled: boolean;
  onProdAllTotalChange: (alltotal: number) => void;
}) => {
  const raw_productArr = raw_quotationProductArr;
  const defaultQuotationDiscount = (raw_quotationDiscount ? raw_quotationDiscount : '100') as `${number}`;

  // ------------------------------------------------------------------------
  // 門型列表
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // ------------------------------------------------------------------------

  // region STATE

  const defaultState_prodDict = useDefaultState_prodDict({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });
  const defaultState_iterativeProdDict = useDefaultState_prodDict({
    raw_productArr: iterativeContractProductArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });

  // 深拷貝，避免在編輯state_prodDict內的物件時影響原始的defaultState
  const defaultState_copy = useMemo(() => {
    return _.cloneDeep(defaultState_prodDict);
  }, [defaultState_prodDict, disabled]);

  const defaultState_iterative_copy = useMemo(() => {
    return _.cloneDeep(defaultState_iterativeProdDict);
  }, [defaultState_iterativeProdDict, disabled]);

  // 總折數
  const [state_quotationDiscount, setState_quotationDiscount] = useState<`${number}` | ''>(defaultQuotationDiscount);

  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState_copy.prodKeyArr); // 主產品的key
  const [activeProdKey, setActiveProdKey] = useState<string>();

  const [activeProdKey_iterative, setActiveProdKey_iterative] = useState<string>();

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>([...defaultKeyArr]); // 欄位的key
  const [cellKeyArr_component, setCellKeyArr_component] = useState<TcellKey_component[]>([...defaultKeyArr_component]); // 欄位的key
  const [cellKeyArr_accessory, setCellKeyArr_accessory] = useState<TcellKey_accessory[]>([...defaultKeyArr_accessory]); // 欄位的key

  // state用來儲存資料狀態
  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState_copy.stateProdDict);
  const { debouncedState: debounced_state_prodDict, isBouncing } = useDebounce(state_prodDict, 500);

  const [state_iterativeProdDict, setState_iterativeProdDict] = useState<TstateProdDict>(
    defaultState_iterative_copy.stateProdDict
  );
  const { debouncedState: debounced_state__iterativeProdDict, isBouncing: isBouncing_iterative } = useDebounce(
    state_prodDict,
    500
  );

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

  const prodKeyArr_iterative = useMemo(() => Object.keys(state_iterativeProdDict), [state_iterativeProdDict]);

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

  const choseActiveProd_iterative = (stateProd: TstateProd | undefined) => {
    setActiveProdKey_iterative(stateProd?.key);
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
  const activedProd_iterative = activeProdKey_iterative ? state_iterativeProdDict[activeProdKey_iterative] : undefined;

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
    createClassProd: createClassProd_iterative,
    createSetProd: createSetProd_iterative,
    // createSetComponent,
    createSetAccessory: createSetAccessory_iterative,
    createActivedClassAccessoryDict: createActivedClassAccessoryDict_iterative,
    createActivedClassComponentDict: createActivedClassComponentDict_iterative,
    //
    // addEmptyProd,
    // removeProd,
    // copyProd,
  } = kit_createClass({
    setState_prodDict: setState_iterativeProdDict,
    nodeConfig_prime,
    state_quotationDiscount: '',
    onProdAllTotalChange: () => {},
    setProdKeyArr: () => {},
    state_prodDict: state_iterativeProdDict,
    activeProdKey: activeProdKey_iterative,
    setActiveProdKey: setActiveProdKey_iterative,
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

  const {
    //
    activedClassProd: activedClassProd_iterative,
    activedClassComponentDict: activedClassComponentDict_iterative,
    activedClassPseudoComponentDict: activedClassPseudoComponentDict_iterative,
    activedClassAccessoryDict: activedClassAccessoryDict_iterative,
  } = useActivedClass({
    activedProd: activedProd_iterative,
    createClassProd: createClassProd_iterative,
    createActivedClassComponentDict: createActivedClassComponentDict_iterative,
    createSetProd: createSetProd_iterative,
    createSetAccessory: createSetAccessory_iterative,
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
    setState_iterativeProdDict(defaultState_iterative_copy.stateProdDict);
    // setProdKeyArr(defaultState_copy.prodKeyArr);
    setActiveProdKey_iterative(undefined);
  }, [defaultState_iterative_copy, disabled]);

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
  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------

  const instance: Tinstance_useQuotationProduct = {
    state_prodDict,
    activedProd,
    activedClassProd,
    prodKeyArr,

    activedClassComponentDict,
    activedClassPseudoComponentDict,
    activedClassAccessoryDict,
    //

    //
    cellKeyArr,
    setCellKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
    //

    cellKeyArr_component,
    setCellKeyArr_component,
    componentKeyArr: activedProd?.componentKeyArr,
    setComponentKeyArr,
    //

    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr: activedProd?.accessoryKeyArr,
    setAccessoryKeyArr,

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

    createClassProd,
    calcProductBody,
    calcProdAllTotal,

    addEmptyProd,
    removeProd,
    copyProd,
    //
    avgDiscount,
    doorModelSummery,
  };

  const instance_iterative: Tinstance_useQuotationProduct = {
    state_prodDict: state_iterativeProdDict,
    activedProd: activedProd_iterative,
    activedClassProd: activedClassProd_iterative,
    prodKeyArr: prodKeyArr_iterative,

    activedClassComponentDict: activedClassComponentDict_iterative,
    activedClassPseudoComponentDict: activedClassPseudoComponentDict_iterative,
    activedClassAccessoryDict: activedClassAccessoryDict_iterative,

    componentKeyArr: activedProd_iterative?.componentKeyArr,
    choseActiveProd: choseActiveProd_iterative,
    accessoryKeyArr: activedProd_iterative?.accessoryKeyArr,
    //
    setProdKeyArr: throwErr,
    setComponentKeyArr: throwErr,
    setAccessoryKeyArr: throwErr,
    setQuotationDiscount: throwErr,
    calcProductBody: throwErr,
    calcProdAllTotal: throwErr,
    addEmptyProd: throwErr,
    removeProd: throwErr,
    copyProd: throwErr,
    //
    createClassProd,
    //
    cellKeyArr,
    setCellKeyArr,

    cellKeyArr_component,
    setCellKeyArr_component,

    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    //
    nodeConfig_origin,
    nodeConfig_component_origin,
    nodeConfig_accessory_origin,
    //
    quotationDiscount: '', // 總折數
    //

    //
    avgDiscount: -1,
    doorModelSummery: {},
  };

  // MARK: RETURN

  return {
    instance,
    instance_iterative,
  };

  // return {
  //   // classProdDict,
  //   // activedClassProd,
  //   state_prodDict,
  //   activedProd,
  //   activedClassProd,
  //   prodKeyArr,

  //   activedClassComponentDict,
  //   activedClassPseudoComponentDict,
  //   activedClassAccessoryDict,
  //   //
  //   // state_iterativeProdDict,
  //   // activedProd_iterative,
  //   // activedClassProd_iterative,
  //   // prodKeyArr_iterative,

  //   // activedClassComponentDict_iterative,
  //   // activedClassPseudoComponentDict_iterative,
  //   // activedClassAccessoryDict_iterative,

  //   // componentKeyArr_iterative: activedProd_iterative?.componentKeyArr,
  //   // choseActiveProd_iterative,
  //   //
  //   cellKeyArr,
  //   setCellKeyArr,
  //   setProdKeyArr,
  //   //
  //   choseActiveProd,
  //   //
  //   // activedClassComponentArr,
  //   // activedClassComponentDict,
  //   cellKeyArr_component,
  //   setCellKeyArr_component,
  //   componentKeyArr: activedProd?.componentKeyArr,
  //   setComponentKeyArr,
  //   //
  //   // activedClassAccessoryDict,
  //   cellKeyArr_accessory,
  //   setCellKeyArr_accessory,
  //   accessoryKeyArr: activedProd?.accessoryKeyArr,
  //   setAccessoryKeyArr,
  //   // showAccessorySelector,
  //   //
  //   nodeConfig_origin,
  //   nodeConfig_component_origin,
  //   nodeConfig_accessory_origin,
  //   //
  //   //
  //   //
  //   quotationDiscount: state_quotationDiscount, // 總折數
  //   setQuotationDiscount,
  //   //
  //   // state_totalPrice, // 完整狀態
  //   // setProdPriceTotal,
  //   // setTuneTotal,
  //   // setCurrency,
  //   // setExchangeRate,
  //   //
  //   //
  //   //

  //   // lookup_classProd,
  //   // nodeConfig_prime,
  //   createClassProd,
  //   calcProductBody,
  //   calcProdAllTotal,

  //   // createActivedClassComponentDict,
  //   // createActivedClassAccessoryDict,
  //   //
  //   //
  //   addEmptyProd,
  //   removeProd,
  //   copyProd,
  //   //
  //   avgDiscount,
  //   doorModelSummery,
  // };
};

// MARK: END
//

// ================================================================================

// ================================================================================

export type {
  // TuseQuotationProductInstance,
  Tinstance_useQuotationProduct,
  TstateProd,
  TclassComponentDict,
  TcreateSetComponent,
  TcreateSetAccessory,
  TclassAccessoryDict,
  TstateProdDict,
  TsetComponent,
  TsetAccessory,
  TclassPsuedoComponentDict,
  // TstateProdDict,
  // TclassComponentDict,
  // TclassPsuedoComponentDict,
  // TclassAccessoryDict,
};
export { useQuotationProduct, ClassProd };
