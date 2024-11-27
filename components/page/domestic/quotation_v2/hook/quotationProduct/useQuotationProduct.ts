import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  TnodeConfig_component,
  TcellKey_component,
  defaultKeyArr_component,
  createNodeConfig_component,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config_component';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

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
} from './type';

// ================================================================================

type TcreateSetComponent = <T extends keyof TstateProd['data_componentDict']>({
  pordKey,
  componentKey,
}: {
  pordKey: string;
  componentKey: T;
}) => TsetComponent<T>;

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

  const [cellKeyArr_component, setCellKeyArr_component] = useState<TcellKey_component[]>([...defaultKeyArr_component]); // 欄位的key

  // state用來儲存資料狀態
  const [state_prodDict, setState_prodDict] = useState<TstateProdDict>(defaultState_copy.stateProdDict);

  // -----------------------------------------------------------------------
  // region COOKED

  const nodeConfig_prime = useMemo(() => {
    return createNodeConfig_prime({
      doorModelDict,
    });
  }, [doorModelDict]);

  // -----------------------------------------------------------------------
  // region STATE HANDLER

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

  // -----------------------------------------------------------------------

  // region COOKED

  const activedProd = activeProdKey ? state_prodDict[activeProdKey] : undefined;

  const componentKeyArr = activedProd?.componentKeyArr;

  // class用來管理資料狀態
  // MARK:classProdDict
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
  const activedClassProd = useMemo(() => {
    if (!activeProdKey) {
      return undefined;
    }

    return classProdDict[activeProdKey];
  }, [activeProdKey, classProdDict]);

  // MARK:activeClassComponentArr
  const activedClassComponentArr = useMemo(() => {
    if (!activedClassProd) {
      return undefined;
    }

    const data_componentDict = activedClassProd.state.data_componentDict;

    const classComponentDict: TclassComponentDict = createClassComponentDict({
      data_componentDict,
      activeClassProdKey: activedClassProd.state.key,
      createSetComponent,
    });

    return Object.values(classComponentDict);
  }, [activedClassProd]);

  const activedClassComponentDict = useMemo(() => {
    if (!activedClassProd) {
      return undefined;
    }

    const data_componentDict = activedClassProd.state.data_componentDict;

    const classComponentDict: TclassComponentDict = createClassComponentDict({
      data_componentDict,
      activeClassProdKey: activedClassProd.state.key,
      createSetComponent,
    });

    return classComponentDict;
  }, [activedClassProd]);

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    setState_prodDict(defaultState_copy.stateProdDict);
    setProdKeyArr(defaultState_copy.prodKeyArr);
  }, [defaultState_copy, disabled]);

  // -----------------------------------------------------------------------------
  // MARK: RETURN
  return {
    classProdDict,
    activedClassProd,
    activedProd,
    //
    cellKeyArr,
    setCellKeyArr,
    prodKeyArr,
    setProdKeyArr,
    //
    choseActiveProd,
    //
    activedClassComponentArr,
    activedClassComponentDict,
    cellKeyArr_component,
    setCellKeyArr_component,
    componentKeyArr,
    setComponentKeyArr,
  };
};

// ================================================================================

const createClassComponentDict = ({
  //
  data_componentDict,
  activeClassProdKey,
  createSetComponent,
}: {
  data_componentDict: Tdata_componentDict;
  activeClassProdKey: string;
  createSetComponent: TcreateSetComponent;
}) => {
  const slat =
    data_componentDict['slat'] &&
    new ClassCompnent_slat({
      state_component: data_componentDict['slat'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'slat',
      }),
    });

  const bottomBar =
    data_componentDict['bottomBar'] &&
    new ClassCompnent_bottomBar({
      state_component: data_componentDict['bottomBar'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'bottomBar',
      }),
    });

  const guideRail =
    data_componentDict['guideRail'] &&
    new ClassCompnent_guideRail({
      state_component: data_componentDict['guideRail'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'guideRail',
      }),
    });

  const sidePlate =
    data_componentDict['sidePlate'] &&
    new ClassCompnent_sidePlate({
      state_component: data_componentDict['sidePlate'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'sidePlate',
      }),
    });

  const roller =
    data_componentDict['roller'] &&
    new ClassCompnent_roller({
      state_component: data_componentDict['roller'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'roller',
      }),
    });

  const motor =
    data_componentDict['motor'] &&
    new ClassCompnent_motor({
      state_component: data_componentDict['motor'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'motor',
      }),
    });

  const motorAccessories =
    data_componentDict['motorAccessories'] &&
    new ClassCompnent_motorAccessories({
      state_component: data_componentDict['motorAccessories'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'motorAccessories',
      }),
    });
  const headBox =
    data_componentDict['headBox'] &&
    new ClassCompnent_headBox({
      state_component: data_componentDict['headBox'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'headBox',
      }),
    });
  const middlePillar =
    data_componentDict['middlePillar'] &&
    new ClassCompnent_middlePillar({
      state_component: data_componentDict['middlePillar'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'middlePillar',
      }),
    });
  const backBone =
    data_componentDict['backBone'] &&
    new ClassCompnent_backBone({
      state_component: data_componentDict['backBone'],
      setState_component: createSetComponent({
        pordKey: activeClassProdKey,
        componentKey: 'backBone',
      }),
    });

  const classComponentDict: TclassComponentDict = {
    slat,
    bottomBar,
    guideRail,
    sidePlate,
    roller,
    motor,
    motorAccessories,
    headBox,
    middlePillar,
    backBone,
  };

  return classComponentDict;
};

// ================================================================================
// createNodeConfig_component

const nodeConfig_component_origin = createNodeConfig_component();

export type { TuseQuotationProductInstance };
export { useQuotationProduct, nodeConfig_origin, nodeConfig_component_origin };
