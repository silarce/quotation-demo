import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';
import _, { remove } from 'lodash';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
import {
  useDefaultState_prodDict,
  //  createEmptyStateProd
} from './useDefaultState_prodDict';

// method
// import { formatProdStateToBody } from './method/formatProdStateToBody';
// import { createClassComponentDict } from './method/createClassComponentDict';
// import { createAccessoryDict } from './method/createAccessoryDict';
import { calcProductBody as _calcProductBody } from './method/calcProductBody';

import {
  //
  // calcProdTotalPrice,
  // w注意 calcAndRenewAllProdPrice_sideEffect有副作用
  calcAndRenewAllProdPrice_sideEffect,
  calcAndRenewAllProdPrice,
  calcPriceDiscount_percent,
  calcProdAllTotal as the_calcProdAllTotal,
  calcProdRemain,
  calcProdDeductedPrice,
} from './method/calcProd';
import {
  calcProdSummary,
  doorModelSummery_reduceModified as calcDoorModelSummery_reduceModified,
  TdoorModelSummeryItem,
} from './method/calcProdSummary';

import { kit_createClass, useActivedClass } from './method/kit_createClass';

import type { TquotationProductDto, TquotationProductDto_addition } from 'js/api/api_quotation';

// ================================================================================

type Taddition = {
  qty_reduce?: number; // 追減數量
  latestIterativeId?: string;
  deductedPrice?: number;
  modifyedProduct?: Record<
    string,
    {
      key: string;
      quantity: number;
    }
  >;
  rootRootProductKey?: string;
  action: TstateProd['action'];
  //
  // 因為材料配件原始的型別並沒有unitPrice與totalPrice
  // 為了可以使總主產品的材料配件顯示正確的unitPrice與totalPrice
  // 必須在迭代時就取得所屬報價單的discount
  quotationDiscount: number | `${number}`; // 會送到TstateProd['quotationDiscount_iterativeProd']
  priceDiscount_percent: number | `${number}`;
};

type TprodSource = TquotationProductDto & { addition: Taddition };

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

  createClassProd: (stateProd: TstateProd) => ClassProd;

  addEmptyProd: () => void;
  removeProd: (prodKey: string) => void;
  avgDiscount: number;

  copyProd: (props: { prodKey: string }) => void;
  modifyProd: (props: { qty_modify: number; prodKey: string }) => void;
  resetModify: (props: { prodKey: string }) => void;

  isIterativeProd: boolean;
  isIterativeProdExist: boolean;
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
  raw_quotationProductArr: TprodSource[] | undefined;
  iterativeContractProductArr: TprodSource[] | undefined;
  // raw_quotationProductArr: TquotationContentDto['products'] | undefined;
  // iterativeContractProductArr: TquotationProductDto_addition[] | undefined;
  raw_quotationDiscount: TquotationContentDto['discount'] | undefined;
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

  const defaultState_iterativeProdDict = useDefaultState_prodDict({
    prodSourceArr: iterativeContractProductArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
    action: '追減', // 總主產品預設為追減
  });

  const defaultState_prodDict = useDefaultState_prodDict({
    prodSourceArr: raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
    stateProdDict_iterative: defaultState_iterativeProdDict.stateProdDict,
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

  const [state_iterativeProdDict, setState_iterativeProdDict] = useState<TstateProdDict>(
    defaultState_iterative_copy.stateProdDict
  );

  const nodeConfig_prime = useMemo(() => {
    return createNodeConfig_prime({
      doorModelDict,
    });
  }, [doorModelDict]);

  const prodKeyArr_iterative = useMemo(() => Object.keys(state_iterativeProdDict), [state_iterativeProdDict]);

  const isIterativeProdExist = !!Object.keys(state_iterativeProdDict).length;

  // ______________________________________________________________________
  const {
    //
    debouncedState: debounced_state_prodDict,
    isBouncing: isBouncing_state_prodDict,
  } = useDebounce(state_prodDict, 500);

  const {
    //
    debouncedState: debounced_state_iterativeProdDict,
    isBouncing: isBouncing_state_iterativeProdDict,
  } = useDebounce(state_iterativeProdDict, 500);

  const {
    //
    debouncedState: debounced_state_quotationDiscount,
    isBouncing: isBouncing_state_quotationDiscount,
  } = useDebounce(state_quotationDiscount, 300);
  // ______________________________________________________________________

  const { avgDiscount, doorModelSummery } = useMemo(() => {
    const { avgDiscount, doorModelSummery } = calcProdSummary({
      state_prodDict: debounced_state_prodDict,
      state_quotationDiscount: state_quotationDiscount || 0,
    });

    return { avgDiscount, doorModelSummery };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced_state_prodDict]);

  const doorModelSummery_reduceModified = useMemo(() => {
    return calcDoorModelSummery_reduceModified({ state_prodDict: state_iterativeProdDict });
  }, [debounced_state_iterativeProdDict]);

  const allProdTotal = useMemo(() => {
    return the_calcProdAllTotal({ state_prodDict });
  }, [debounced_state_prodDict]);

  const allProdTotal_iterative = useMemo(() => {
    return Object.values(state_iterativeProdDict)
      .reduce((total, stateProd) => {
        total = total.add(stateProd.deductedPrice || 0);

        return total;
      }, new Decimal(0))
      .toNumber();
  }, [debounced_state_iterativeProdDict]);

  const theProductTotal = useMemo(() => {
    return new Decimal(allProdTotal).add(allProdTotal_iterative).toNumber();
  }, [allProdTotal, allProdTotal_iterative]);

  // -----------------------------------------------------------------------
  // region STATE HANDLER
  //
  //
  //
  //

  // const onProdAllTotalChange = () => {
  //   _onProdAllTotalChange(calcProdAllTotal());
  // };

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
    // calcAndRenewAllProdPrice_sideEffect會給改變state_prodDict的內容卻不會新狀態...
    // 為什麼不避免副作用?因為要改的東西太多了，難以一一抽離出來
    // calcAndRenewAllProdPrice_sideEffect({
    //   prodDict: state_prodDict,
    //   quotationDiscount: value,
    // });

    // onProdAllTotalChange();
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
    onProdAllTotalChange: () => {}, // 重構完成後確認沒問題就把這個參數拿掉
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
    state_quotationDiscount: null,
    onProdAllTotalChange: () => {},
    setProdKeyArr: () => {},
    state_prodDict: state_iterativeProdDict,
    activeProdKey: activeProdKey_iterative,
    setActiveProdKey: setActiveProdKey_iterative,
  });

  const copy_prodToProd: Tinstance_useQuotationProduct['copyProd'] = ({ prodKey }) => {
    const stateProd = state_prodDict[prodKey];
    copyProd({ stateProd });
  };

  const copyProd_iterativeToNormal: Tinstance_useQuotationProduct['copyProd'] = ({ prodKey }: { prodKey: string }) => {
    if (!prodKey) {
      throw new Error('instance_iterative的copyProd出錯。prodKey不存在');
    }

    const stateProd = state_iterativeProdDict[prodKey];
    copyProd({ stateProd });
  };

  const modifyProd = ({ qty_modify, prodKey }: { qty_modify: number; prodKey: string }) => {
    const stateProd_iterative = state_iterativeProdDict[prodKey];

    const allowQty = calcProdRemain({ stateProd: stateProd_iterative });

    if (qty_modify === 0) {
      return;
    } else if (!Number.isInteger(qty_modify) || qty_modify < 0) {
      myAlert.err({ title: '數量只能是正整數' });

      return;
    } else if (allowQty < qty_modify) {
      myAlert.err({ title: '數量不可超過剩餘數量' });

      return;
    }

    // stateProd_iterative.qty_modify = new Decimal(qty_modify || 0).add(stateProd_iterative.qty_modify || 0).toNumber();

    const newProd = copyProd({
      stateProd: stateProd_iterative,
      quantity: qty_modify,
      attachedToProduct: stateProd_iterative,
      quotationDiscount: state_quotationDiscount || 0,
    });

    stateProd_iterative.modifyedProduct[newProd.key] = {
      key: newProd.key,
      quantity: qty_modify,
    };

    stateProd_iterative.deductedPrice = calcProdDeductedPrice({ stateProd: stateProd_iterative });

    stateProd_iterative.renderCount = (stateProd_iterative.renderCount ?? 0) + 1;

    setState_iterativeProdDict({ ...state_iterativeProdDict });
  };

  const resetModify = ({ prodKey }: { prodKey: string }) => {
    const state_prodDict_copy = { ...state_prodDict };
    const state_iterativeProdDict_copy = { ...state_iterativeProdDict };
    const prodKeyArr_copy = [...prodKeyArr];

    const stateProd_iterative = state_iterativeProdDict_copy[prodKey];

    Object.keys(stateProd_iterative.modifyedProduct).forEach((key) => {
      delete state_prodDict_copy[key];
      prodKeyArr_copy.splice(prodKeyArr_copy.indexOf(key), 1);
    });

    stateProd_iterative.modifyedProduct = {};
    stateProd_iterative.deductedPrice = calcProdDeductedPrice({ stateProd: stateProd_iterative });
    stateProd_iterative.renderCount = (stateProd_iterative.renderCount ?? 0) + 1;

    setState_prodDict(state_prodDict_copy);
    setState_iterativeProdDict(state_iterativeProdDict_copy);
    setProdKeyArr(prodKeyArr_copy);
  };

  const removeProd_withIterative = (prodKey: string) => {
    const stateProdWillRemove = state_prodDict[prodKey];
    const rootProductKey = stateProdWillRemove.rootProduct?.key;
    const rootProduct = rootProductKey ? state_iterativeProdDict[rootProductKey] : undefined;

    removeProd(prodKey);

    if (!rootProduct) {
      console.error('prodKey', prodKey);
      console.error('state_prodDict', state_prodDict);

      throw new Error('removeProd_withIterative，rootProduct不存在');
    }

    delete rootProduct.modifyedProduct[prodKey];
    rootProduct.deductedPrice = calcProdDeductedPrice({ stateProd: rootProduct });

    rootProduct.renderCount = (rootProduct.renderCount ?? 0) + 1;
    setState_iterativeProdDict({ ...state_iterativeProdDict });
  };

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

  const calcProductBody = () => {
    return _calcProductBody({
      prodKeyArr,
      state_prodDict,
      state_iterativeProdDict,
      createClassProd,
    });
  };

  const checkIsIterativeProdValid = () => {
    const IsIterativeProdInvalid = Object.values(state_iterativeProdDict).some(
      (stateProd) => !stateProd.isQuantityValid
    );

    return !IsIterativeProdInvalid;
  };

  // const calcProductBody_2 = () => {
  //   const body_normal = _calcProductBody({
  //     prodKeyArr,
  //     createClassProd,
  //     state_prodDict,
  //   });

  //   const body_iterative = _calcProductBody({
  //     prodKeyArr: prodKeyArr_iterative,
  //     createClassProd: createClassProd_iterative,
  //     state_prodDict: state_iterativeProdDict,
  //   });
  // };

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

  useEffect(() => {
    const newState_prodDict = calcAndRenewAllProdPrice({
      prodDict: state_prodDict,
      // 因為state_quotationDiscount更及時
      // 所以用state_quotationDiscount而不用debounced_state_quotationDiscount
      quotationDiscount: state_quotationDiscount,
    });

    setState_prodDict(newState_prodDict);

    // calcAndRenewAllProdPrice
  }, [debounced_state_quotationDiscount]);

  useEffect(() => {
    _onProdAllTotalChange(theProductTotal);
  }, [theProductTotal]);

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
    componentKeyArr: activedProd?.componentKeyArr,
    accessoryKeyArr: activedProd?.accessoryKeyArr,
    choseActiveProd,
    //
    cellKeyArr,
    setCellKeyArr,
    setProdKeyArr,
    //
    cellKeyArr_component,
    setCellKeyArr_component,
    setComponentKeyArr,
    //
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    setAccessoryKeyArr,
    //
    nodeConfig_origin,
    nodeConfig_component_origin,
    nodeConfig_accessory_origin,
    //
    quotationDiscount: state_quotationDiscount, // 總折數
    setQuotationDiscount,
    //
    createClassProd,
    // calcProductBody,
    // calcProdAllTotal,
    //
    addEmptyProd,
    // removeProd,
    removeProd: removeProd_withIterative,
    copyProd: copy_prodToProd,
    //
    avgDiscount,

    //
    isIterativeProd: false,
    isIterativeProdExist,
    //
    modifyProd: throwErr,
    resetModify: throwErr,
  };

  const instance_iterative: Tinstance_useQuotationProduct | null = !isIterativeProdExist
    ? null
    : {
        state_prodDict: state_iterativeProdDict,
        activedProd: activedProd_iterative,
        activedClassProd: activedClassProd_iterative,
        prodKeyArr: prodKeyArr_iterative,
        activedClassComponentDict: activedClassComponentDict_iterative,
        activedClassPseudoComponentDict: activedClassPseudoComponentDict_iterative,
        activedClassAccessoryDict: activedClassAccessoryDict_iterative,
        componentKeyArr: activedProd_iterative?.componentKeyArr,
        accessoryKeyArr: activedProd_iterative?.accessoryKeyArr,
        choseActiveProd: choseActiveProd_iterative,
        //
        copyProd: copyProd_iterativeToNormal,
        modifyProd,
        resetModify,
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

        //
        isIterativeProd: true,
        isIterativeProdExist,
        //
        setProdKeyArr: throwErr,
        setComponentKeyArr: throwErr,
        setAccessoryKeyArr: throwErr,
        setQuotationDiscount: throwErr,
        // calcProductBody: throwErr,
        // calcProdAllTotal: throwErr,
        addEmptyProd: throwErr,
        removeProd: throwErr,
      };

  // MARK: RETURN

  return {
    instance,
    instance_iterative,
    isBouncing: isBouncing_state_prodDict || isBouncing_state_iterativeProdDict || isBouncing_state_quotationDiscount,
    allProdTotal,
    allProdTotal_iterative,
    theProductTotal,
    calcProductBody,
    doorModelSummery,
    doorModelSummery_reduceModified,
    checkIsIterativeProdValid,
  };
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
  TprodSource,
};
export { useQuotationProduct, ClassProd };
