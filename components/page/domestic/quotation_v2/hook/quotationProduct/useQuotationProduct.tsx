import { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { nanoid } from 'nanoid';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

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
import {
  //
  // calcProdTotalPrice,
  // w注意 calcAndRenewAllProdPrice_sideEffect有副作用
  calcAndRenewAllProdPrice_sideEffect,
  //
} from './method/calcProd';

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

  // ------------------------------------------------------------------------
  // 門型列表
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // ------------------------------------------------------------------------

  // region STATE

  // const {
  //   // state_quotationDiscount,
  //   // setState_quotationDiscount,
  //   //

  //   state_totalPrice,

  //   setProdPriceTotal,
  //   setTuneTotal,
  //   setCurrency,
  //   setExchangeRate,
  // } = useQuotationTotalPrice({
  //   raw_quotationContent: raw_quotationContent,
  //   disabled,
  // });

  const defaultState_prodDict = useDefaultState_prodDict({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });
  // 深拷貝，避免在編輯state_prodDict內的物件時影響原始的defaultState
  const defaultState_copy = useMemo(() => {
    return _.cloneDeep(defaultState_prodDict);
  }, [defaultState_prodDict, disabled]);

  // 總折數
  const [state_quotationDiscount, setState_quotationDiscount] = useState<`${number}` | ''>(
    (raw_quotationContent?.discount ?? '') as `${number}` | ''
  );

  const [prodKeyArr, setProdKeyArr] = useState<string[]>(defaultState_copy.prodKeyArr); // 主產品的key
  const [activeProdKey, setActiveProdKey] = useState<string>();

  const [cellKeyArr, setCellKeyArr] = useState<TcellKey[]>([...defaultKeyArr]); // 欄位的key
  const [cellKeyArr_component, setCellKeyArr_component] = useState<TcellKey_component[]>([...defaultKeyArr_component]); // 欄位的key
  const [cellKeyArr_accessory, setCellKeyArr_accessory] = useState<TcellKey_accessory[]>([...defaultKeyArr_accessory]); // 欄位的key

  // state用來儲存資料狀態
  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState_copy.stateProdDict);

  const nodeConfig_prime = useMemo(() => {
    return createNodeConfig_prime({
      doorModelDict,
    });
  }, [doorModelDict]);

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

  // const setQuotationDiscount = (value: typeof state_quotationDiscount) => {
  //   setState_quotationDiscount(value);
  //   // 總折數改變後要重新計算主產品的金額
  //   //
  // };

  const setQuotationDiscount = (value: `${number}` | '') => {
    setState_quotationDiscount(value);

    // w注意 calcAndRenewAllProdPrice_sideEffect有副作用
    calcAndRenewAllProdPrice_sideEffect({
      prodDict: state_prodDict,
      quotationDiscount: value,
    });

    onProdAllTotalChange();
    // let total_d = new Decimal(0);
    // Object.values(state_prodDict).forEach((prod) => {
    //   total_d = total_d.add(prod.data_prod.totalPrice || 0);
    // });
  };

  // -----------------------------------------------------------------------

  // region CREATE CLASS

  const activedProd = activeProdKey ? state_prodDict[activeProdKey] : undefined;

  const componentKeyArr = activedProd?.componentKeyArr;
  const accessoryKeyArr = activedProd?.accessoryKeyArr;

  // MARK:createSetProd
  const createSetProd = (key: string): TsetProd => {
    const setProd: TsetProd = (newState) => {
      setState_prodDict((prev) => {
        const newStateValue = typeof newState === 'function' ? newState(prev[key]) : newState;

        return {
          ...prev,
          [key]: {
            ...prev[key],
            ...newStateValue,
          },
        };
      });
    };

    return setProd;
  };

  // MARK:createSetComponent
  const createSetComponent: TcreateSetComponent = <T extends keyof TstateProd['data_componentDict']>({
    pordKey,
    componentKey,
  }: {
    pordKey: string;
    componentKey: T;
  }): TsetComponent<T> => {
    const setComponent: TsetComponent<T> = (newStateComponent) => {
      setState_prodDict((prev) => {
        const copy = { ...prev };
        copy[pordKey] = { ...copy[pordKey] }; // 就是更新activedProd
        const prod = copy[pordKey];
        const data_componentDict = prod.data_componentDict;

        const newStateValue =
          typeof newStateComponent === 'function'
            ? newStateComponent(data_componentDict[componentKey])
            : newStateComponent;

        data_componentDict[componentKey] = newStateValue;

        return copy;
      });
    };

    return setComponent;
  };

  // MARK:createSetAccessory
  const createSetAccessory: TcreateSetAccessory = ({ prodKey, accessoryKey }) => {
    const setAccessory: TsetAccessory = (newStateAcce) => {
      setState_prodDict((prev) => {
        const copy = { ...prev };
        copy[prodKey] = { ...copy[prodKey] }; // 就是更新activedProd

        const accessoriesDict = copy[prodKey].data_accessoryDict;
        const acce = accessoriesDict[accessoryKey];
        const newStateValue = typeof newStateAcce === 'function' ? newStateAcce(acce) : newStateAcce;
        accessoriesDict[accessoryKey] = newStateValue;

        return copy;
      });
    };

    return setAccessory;
  };

  const createActivedClassAccessoryDict = (
    // activedProd: TstateProd | undefined
    activedClassProd: ClassProd | undefined
  ) => {
    if (!activedClassProd) {
      return {};
    }

    return createAccessoryDict({
      activedClassProd,
      createSetAccessory,
    });
  };

  // const createClassProd = useCallback(
  //   (stateProd: TstateProd) => {
  //     const classProd = new ClassProd({
  //       stateProd: stateProd,
  //       setStateProd: createSetProd(stateProd.key),
  //       nodeConfig: nodeConfig_prime,
  //       quotationDiscount: state_quotationDiscount || 0,
  //       onPordTotalChange: onProdAllTotalChange,
  //     });

  //     return classProd;
  //   },
  //   [
  //     nodeConfig_prime,
  //     // 編輯總折數state_quotationDiscount時會呼叫calcAndRenewAllProdPrice_sideEffect
  //     // 本來就會使所有prod更新，所以暫時不用在這裡考慮效能的問題
  //     state_quotationDiscount,
  //   ]
  // );
  const createClassProd = (stateProd: TstateProd) => {
    const classProd = new ClassProd({
      stateProd: stateProd,
      setStateProd: createSetProd(stateProd.key),
      nodeConfig: nodeConfig_prime,
      quotationDiscount: state_quotationDiscount || 0,
      onPordTotalChange: onProdAllTotalChange,
    });

    return classProd;
  };

  const createActivedClassComponentDict = (activedProd: TstateProd | undefined) => {
    if (!activedProd) {
      return {};
    }

    const activedClassProd = createClassProd(activedProd);

    if (!activedClassProd.isValid_doorModel) {
      return {};
    }

    return createClassComponentDict({
      activedClassProd,
      createSetComponent,
    });
  };

  const {
    //
    activedClassProd,
    activedClassComponentDict,
    activedClassPseudoComponentDict,
    activedClassAccessoryDict,
  } = useMemo(() => {
    // let activedProd = activedProd;

    if (!activedProd) {
      return {};
    }

    const activedClassProd = createClassProd(activedProd);

    const stateProd = activedClassProd.state; // 同activedProd 為同一個參照

    // const isComponentExist = !!Object.keys(stateProd.data_componentDict ?? {}).length;

    // if (!isComponentExist && activedClassProd.doorModelName !== 'special') {
    //   activedClassProd.replaceToEmptyComponent();
    //   activedClassProd.resetComponentKeyArr();
    // }

    const activedClassComponentDict = createActivedClassComponentDict(stateProd);
    activedClassProd.registerClassComponentDict(activedClassComponentDict);

    if (activedClassProd.doorModelName !== 'special') {
      Object.values(activedClassComponentDict).forEach((classComponent) =>
        classComponent.setClassProd(activedClassProd)
      );
    }

    const activedPseudoComponentDict: TclassPsuedoComponentDict = {
      distributionBox: new Class_distributionBox({
        stateProd: stateProd,
        setStateProd: createSetProd(stateProd.key),
        classProd: activedClassProd,
      }),
      installationFee: new Class_installationFee({
        stateProd: stateProd,
        setStateProd: createSetProd(stateProd.key),
        classProd: activedClassProd,
      }),
    };

    if (activedClassProd.doorModelName === 'W2') {
      delete activedPseudoComponentDict.installationFee;
    }

    const activedClassAccessoryDict = createAccessoryDict({
      activedClassProd,
      createSetAccessory,
    });

    activedClassProd.registerClassAccessoryDict(activedClassAccessoryDict);

    return {
      activedClassProd,
      activedClassComponentDict,
      activedClassPseudoComponentDict: activedPseudoComponentDict,
      activedClassAccessoryDict,
    };
  }, [activedProd, activedProd?.renderCount, createClassProd]);

  // -----------------------------------------------------------------------

  // region METHOD

  const addEmptyProd = () => {
    const newProd = createEmptyStateProd();
    const key = newProd.key;

    setState_prodDict((prev) => {
      return {
        ...prev,
        [key]: newProd,
      };
    });

    setProdKeyArr((prev) => {
      return [...prev, key];
    });
  };

  const removeProd = (prodKey: string) => {
    setProdKeyArr((prev) => {
      const newProdKeyArr = prev.filter((key) => key !== prodKey);

      return newProdKeyArr;
    });

    // let newProdDict: TstateProdDict = {};

    setState_prodDict((prev) => {
      const { [prodKey]: removedProd, ...rest } = prev;

      onProdAllTotalChange(rest);
      // newProdDict = rest;

      return rest;
    });

    if (prodKey === activeProdKey) {
      setActiveProdKey(undefined);
    }

    // onProdAllTotalChange(newProdDict);
  };

  const copyProd = (prodKey: string) => {
    const copyedProd = state_prodDict[prodKey];

    const data_prod = {
      ...copyedProd.data_prod,
      id: undefined,
      attachedToProductId: undefined,
      rootProductId: undefined,
    };

    const newProd: TstateProd = {
      ...copyedProd,
      data_prod,
      key: 'new-' + nanoid(),
      renderCount: undefined,
      afterChangeQueue: undefined,
    };

    let newProdDict: TstateProdDict = {};

    setState_prodDict((prev) => {
      const copy = {
        ...prev,
        [newProd.key]: newProd,
      };

      newProdDict = copy;

      return copy;
    });

    setProdKeyArr((prev) => {
      return [...prev, newProd.key];
    });

    onProdAllTotalChange(newProdDict);
  };

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
    const totalQty_decimal = new Decimal(0);
    let isAllDoorModalValid = true;
    // let isAllComponentValid = true;
    // let isAllComponentValid = true;
    const invalidComponentArr: number[] = [];

    const classProdArr = prodKeyArr.map((key) => {
      return createClassProd(state_prodDict[key]);
    });

    const stateArr = classProdArr.map((classProd, index) => {
      const { state: stateProd, isComponentValid } = classProd;

      // 目前isComponentValid只會為true，未來要再製作
      if (!isComponentValid) {
        const indexNumber = index + 1; // 給使用者看得流水號
        invalidComponentArr.push(indexNumber);
      }

      const { doorModelName, quantity } = stateProd.data_prod;
      totalQty_decimal.add(quantity || 0);

      !doorModelName && (isAllDoorModalValid = false);

      stateProd.data_prod.order = index;

      return stateProd;
    });

    const quotationProductArr = stateArr.map((stateProd) => formatProdStateToBody(stateProd));

    return {
      quotationProductArr,
      isAllDoorModalValid,
      invalidComponentArr,
      totalQty: totalQty_decimal.toNumber(),
    };
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
    setState_quotationDiscount((raw_quotationContent?.discount ?? '') as `${number}` | '');
  }, [disabled, raw_quotationContent]);

  // useEffect(() => {
  //   onProdAllTotalChange();
  // }, [Object.keys(state_prodDict).length]);

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
    componentKeyArr,
    setComponentKeyArr,
    //
    // activedClassAccessoryDict,
    cellKeyArr_accessory,
    setCellKeyArr_accessory,
    accessoryKeyArr,
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
};
export { useQuotationProduct };
