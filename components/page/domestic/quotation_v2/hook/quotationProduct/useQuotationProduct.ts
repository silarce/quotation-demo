import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
// import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import { useGlobal_doorModel } from 'hooks/globalState/useGlobal_doorModel';

import type {
  TquotationContentDto,
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
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

import { lookup_classProd } from './class/prod/lookup_classProd';
import {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/interface';

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
import { useDefaultState } from './useDefaultState';
import { useQuotationTotalPrice } from './useQuotationPrice';

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
  // raw_productArr,
  disabled,
}: {
  raw_quotationContent: TquotationContentDto | undefined;
  // raw_productArr: undefined | TquotationProductDto[];
  disabled: boolean;
}) => {
  const raw_productArr = raw_quotationContent?.products;

  // ------------------------------------------------------------------------
  // 門型列表
  const { doorModelDict, isReady } = useGlobal_doorModel();

  // ------------------------------------------------------------------------

  // region STATE

  const {
    state_quotationDiscount,
    setState_quotationDiscount,
    //

    state_totalPrice,
    setProdPriceTotal,
    setTuneTotal,
    setCurrency,
    setExchangeRate,
  } = useQuotationTotalPrice({
    raw_quotationContent: raw_quotationContent,
    disabled,
  });

  const defaultState = useDefaultState({
    raw_productArr,
    doorModelDict: isReady ? doorModelDict || null : undefined,
  });
  // 深拷貝，避免在編輯狀態內的物件時影響原始的defaultState
  const defaultState_copy = useMemo(() => {
    return _.cloneDeep(defaultState);
  }, [defaultState, disabled]);

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

  const setQuotationDiscount = (value: typeof state_quotationDiscount) => {
    setState_quotationDiscount(value);
    // 總折數改變後要重新計算主產品的金額
    //
  };

  // -----------------------------------------------------------------------

  // region COOKED

  // class用來管理資料狀態
  // MARK:classProdDict
  // const classProdDict = useMemo(() => {
  //   if (!doorModelDict) {
  //     return {};
  //   }

  //   // const dict: { [key: string]: Interface_ClassProd_base } = {};
  //   const dict: { [key: string]: Interface_ClassProd_prime | Interface_ClassProd_special } = {};

  //   Object.entries(state_prodDict).forEach(([key, state]) => {
  //     if (state.key !== key) {
  //       throw new Error('classProdDict發生錯誤，key與state.key不一致');
  //     }

  //     const { doorModelName } = state.data_prod;

  //     const prodName = (doorModelName in lookup_classProd ? doorModelName : 'special') as keyof typeof lookup_classProd;

  //     const theClass = lookup_classProd[prodName];

  //     dict[key] = new theClass({
  //       stateProd: state,
  //       setStateProd: createSetProd(key),
  //       nodeConfig: nodeConfig_prime,
  //     });
  //   });

  //   return dict;
  // }, [state_prodDict, nodeConfig_prime]);

  // const activedClassProd = useMemo(() => {
  //   if (!activeProdKey) {
  //     return undefined;
  //   }

  //   return classProdDict[activeProdKey];
  // }, [activeProdKey, classProdDict]);

  // const activedClassComponentArr = useMemo(() => {
  //   if (!activedClassProd) {
  //     return undefined;
  //   }

  //   const data_componentDict = activedClassProd.state.data_componentDict;

  //   const classComponentDict: TclassComponentDict = createClassComponentDict({
  //     data_componentDict,
  //     activeClassProdKey: activedClassProd.state.key,
  //     createSetComponent,
  //   });

  //   return Object.values(classComponentDict);
  // }, [activedClassProd]);

  // const activedClassComponentDict = useMemo(() => {
  //   if (!activedClassProd) {
  //     return undefined;
  //   }

  //   const data_componentDict = activedClassProd.state.data_componentDict;

  //   const classComponentDict: TclassComponentDict = createClassComponentDict({
  //     data_componentDict,
  //     activeClassProdKey: activedClassProd.state.key,
  //     createSetComponent,
  //   });

  //   return classComponentDict;
  // }, [activedClassProd]);

  // const activedClassAccessoryDict = useMemo(() => {
  //   if (!activedClassProd) {
  //     return undefined;
  //   }

  //   const data_accessoryDict = activedClassProd.state.data_accessoryDict;

  //   const classAccessoryDict: TclassAccessoryDict = {};
  //   Object.entries(data_accessoryDict).forEach(([key, acce]) => {
  //     classAccessoryDict[key] = new Class_accessory({
  //       state_accessory: acce,
  //       setState_accessory: createSetAccessory({
  //         prodKey: activedClassProd.state.key,
  //         accessoryKey: key,
  //       }),
  //     });
  //   });

  //   return classAccessoryDict;
  // }, [activedClassProd]);

  // -----------------------------------------------------------------------

  // region CREATE CLASS
  //
  //
  //
  //

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
        copy[pordKey] = { ...copy[pordKey] };
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
        const accessoriesDict = copy[prodKey].data_accessoryDict;
        const acce = accessoriesDict[accessoryKey];
        const newStateValue = typeof newStateAcce === 'function' ? newStateAcce(acce) : newStateAcce;
        accessoriesDict[accessoryKey] = newStateValue;

        return copy;
      });
    };

    return setAccessory;
  };

  const createActivedClassAccessoryDict = (activedProd: TstateProd | undefined) => {
    if (!activedProd) {
      return {};
    }

    return createAccessoryDict({
      activedProd,
      createSetAccessory,
    });
  };

  const createClassProd = useCallback(
    (stateProd: TstateProd) => {
      const { doorModelName } = stateProd.data_prod;
      const prodName = (doorModelName in lookup_classProd ? doorModelName : 'special') as keyof typeof lookup_classProd;

      const TheClass = lookup_classProd[prodName];

      const classProd = new TheClass({
        stateProd: stateProd,
        setStateProd: createSetProd(stateProd.key),
        nodeConfig: nodeConfig_prime,
      });

      return classProd;
    },
    [nodeConfig_prime]
  );

  // const createActivedClassComponentDict = (activedProd: TstateProd | undefined) => {
  //   if (!activedProd) {
  //     return {};
  //   }

  //   return createClassComponentDict_v2({
  //     activedProd,
  //     createSetComponent,
  //   });
  // };

  const createActivedClassComponentDict = (
    // activedClassProd: Interface_ClassProd_prime | undefined | null
    activedProd: TstateProd | undefined
  ) => {
    if (!activedProd) {
      return {};
    }

    const activedClassProd = createClassProd(activedProd);

    if (activedClassProd.doorModel === 'special') {
      return {};
    }

    return createClassComponentDict_v2({
      activedClassProd,
      createSetComponent,
    });
  };

  const { activedClassProd, activedClassComponentDict } = useMemo(() => {
    if (!activedProd) {
      return {};
    }

    const activedClassProd = createClassProd(activedProd);

    const activedClassComponentDict = createActivedClassComponentDict(activedProd);
    activedClassProd.setClassComponentDict(activedClassComponentDict);

    if (activedClassProd.doorModel !== 'special') {
      Object.values(activedClassComponentDict).forEach((classComponent) =>
        classComponent.setClassProd(activedClassProd)
      );
    }

    return {
      activedClassProd,
      activedClassComponentDict,
    };
  }, [
    //
    activedProd,
    createClassProd,
    // ...Object.values(activedProd?.data_componentDict ?? {}),
    // ...Object.values(activedProd?.data_accessoryDict ?? {}),
  ]);

  // -----------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    if (disabled) {
      setState_prodDict(defaultState_copy.stateProdDict);
      setProdKeyArr(defaultState_copy.prodKeyArr);
    }
  }, [defaultState_copy, disabled]);

  // useEffect(() => {
  //   setState_prodDict(defaultState_copy.stateProdDict);
  //   setProdKeyArr(defaultState_copy.prodKeyArr);
  // }, [defaultState_copy, disabled]);

  // useEffect(() => {
  //   if (disabled) {
  //     setState_prodDict(defaultState_copy.stateProdDict);
  //     setProdKeyArr(defaultState_copy.prodKeyArr);
  //   }
  // }, [disabled]);

  // useEffect(() => {
  //   setState_prodDict(defaultState_copy.stateProdDict);
  //   setProdKeyArr(defaultState_copy.prodKeyArr);
  // }, [defaultState_copy]);

  useEffect(() => {
    if (activedProd) {
      const activedClassProd = createClassProd(activedProd);

      if (!activedClassProd.isInited) {
        activedClassProd.init();
      }
    }
  }, [activeProdKey]);

  // -----------------------------------------------------------------------------
  // MARK: RETURN
  return {
    // classProdDict,
    // activedClassProd,
    activedProd,
    activedClassProd,
    activedClassComponentDict,
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
    state_totalPrice, // 完整狀態
    // setProdPriceTotal,
    setTuneTotal,
    setCurrency,
    setExchangeRate,
    //
    //
    //
    state_prodDict,

    // lookup_classProd,
    // nodeConfig_prime,

    createActivedClassComponentDict,
    createActivedClassAccessoryDict,
    createClassProd,
  };
};

// MARK: END
//

// ================================================================================

// MARK:createClassComponentDict
// const createClassComponentDict = ({
//   //
//   data_componentDict,
//   activeClassProdKey,
//   createSetComponent,
// }: {
//   data_componentDict: Tdata_componentDict;
//   activeClassProdKey: string;
//   createSetComponent: TcreateSetComponent;
// }) => {
//   const slat =
//     data_componentDict['slat'] &&
//     new ClassCompnent_slat({
//       state_component: data_componentDict['slat'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'slat',
//       }),
//     });

//   const bottomBar =
//     data_componentDict['bottomBar'] &&
//     new ClassCompnent_bottomBar({
//       state_component: data_componentDict['bottomBar'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'bottomBar',
//       }),
//     });

//   const guideRail =
//     data_componentDict['guideRail'] &&
//     new ClassCompnent_guideRail({
//       state_component: data_componentDict['guideRail'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'guideRail',
//       }),
//     });

//   const sidePlate =
//     data_componentDict['sidePlate'] &&
//     new ClassCompnent_sidePlate({
//       state_component: data_componentDict['sidePlate'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'sidePlate',
//       }),
//     });

//   const roller =
//     data_componentDict['roller'] &&
//     new ClassCompnent_roller({
//       state_component: data_componentDict['roller'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'roller',
//       }),
//     });

//   const motor =
//     data_componentDict['motor'] &&
//     new ClassCompnent_motor({
//       state_component: data_componentDict['motor'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'motor',
//       }),
//     });

//   const motorAccessories =
//     data_componentDict['motorAccessories'] &&
//     new ClassCompnent_motorAccessories({
//       state_component: data_componentDict['motorAccessories'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'motorAccessories',
//       }),
//     });
//   const headBox =
//     data_componentDict['headBox'] &&
//     new ClassCompnent_headBox({
//       state_component: data_componentDict['headBox'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'headBox',
//       }),
//     });
//   const middlePillar =
//     data_componentDict['middlePillar'] &&
//     new ClassCompnent_middlePillar({
//       state_component: data_componentDict['middlePillar'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'middlePillar',
//       }),
//     });
//   const backBone =
//     data_componentDict['backBone'] &&
//     new ClassCompnent_backBone({
//       state_component: data_componentDict['backBone'],
//       setState_component: createSetComponent({
//         pordKey: activeClassProdKey,
//         componentKey: 'backBone',
//       }),
//     });

//   const classComponentDict: TclassComponentDict = {
//     slat,
//     bottomBar,
//     guideRail,
//     sidePlate,
//     roller,
//     motor,
//     motorAccessories,
//     headBox,
//     middlePillar,
//     backBone,
//   };

//   return classComponentDict;
// };

const createClassComponentDict_v2 = ({
  //
  activedClassProd,
  createSetComponent,
}: {
  activedClassProd: Interface_ClassProd_prime;
  createSetComponent: TcreateSetComponent;
}) => {
  const data_componentDict = activedClassProd.state.data_componentDict;
  const activeProdKey = activedClassProd.key;

  const slat =
    data_componentDict['slat'] &&
    new ClassCompnent_slat({
      state_component: data_componentDict['slat'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'slat',
      }),
      // activedClassProd,
    });

  const bottomBar =
    data_componentDict['bottomBar'] &&
    new ClassCompnent_bottomBar({
      state_component: data_componentDict['bottomBar'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'bottomBar',
      }),
      // activedClassProd,
    });

  const guideRail =
    data_componentDict['guideRail'] &&
    new ClassCompnent_guideRail({
      state_component: data_componentDict['guideRail'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'guideRail',
      }),
      // activedClassProd,
    });

  const sidePlate =
    data_componentDict['sidePlate'] &&
    new ClassCompnent_sidePlate({
      state_component: data_componentDict['sidePlate'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'sidePlate',
      }),
      // activedClassProd,
    });

  const roller =
    data_componentDict['roller'] &&
    new ClassCompnent_roller({
      state_component: data_componentDict['roller'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'roller',
      }),
      // activedClassProd,
    });

  const motor =
    data_componentDict['motor'] &&
    new ClassCompnent_motor({
      state_component: data_componentDict['motor'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'motor',
      }),
      // activedClassProd,
    });

  const motorAccessories =
    data_componentDict['motorAccessories'] &&
    new ClassCompnent_motorAccessories({
      state_component: data_componentDict['motorAccessories'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'motorAccessories',
      }),
      // activedClassProd,
    });
  const headBox =
    data_componentDict['headBox'] &&
    new ClassCompnent_headBox({
      state_component: data_componentDict['headBox'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'headBox',
      }),
      // activedClassProd,
    });
  const middlePillar =
    data_componentDict['middlePillar'] &&
    new ClassCompnent_middlePillar({
      state_component: data_componentDict['middlePillar'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'middlePillar',
      }),
      // activedClassProd,
    });
  const backBone =
    data_componentDict['backBone'] &&
    new ClassCompnent_backBone({
      state_component: data_componentDict['backBone'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'backBone',
      }),
      // activedClassProd,
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

  // 清除classComponentDict中為undefined的項目
  Object.keys(classComponentDict).forEach((key) => {
    const theKey = key as keyof TclassComponentDict;

    if (classComponentDict[theKey] === undefined) {
      delete classComponentDict[theKey];
    }
  });

  return classComponentDict;
};

const createAccessoryDict = ({
  activedProd,
  createSetAccessory,
}: {
  activedProd: TstateProd;
  createSetAccessory: TcreateSetAccessory;
}) => {
  const data_accessoryDict = activedProd.data_accessoryDict;

  const classAccessoryDict: TclassAccessoryDict = {};
  Object.entries(data_accessoryDict).forEach(([key, acce]) => {
    classAccessoryDict[key] = new Class_accessory({
      state_accessory: acce,
      setState_accessory: createSetAccessory({
        prodKey: activedProd.key,
        accessoryKey: key,
      }),
    });
  });

  return classAccessoryDict;
};

// ================================================================================

export type { TuseQuotationProductInstance, TstateProd, TclassComponentDict };
export { useQuotationProduct };

// import { DeepReadonly } from 'ts-essentials';

// interface Tfoo {
//   a: {
//     b: {
//       c: string;
//     };
//   };
// }

// type Tfoo_readonly = DeepReadonly<Tfoo>;

// const foo: Tfoo_readonly = {
//   a: {
//     b: {
//       c: 'c',
//     },
//   },
// };

// foo.a.b.c = 'a';
