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
  TcreateQuotationProductDto,
  TcreateQuotationProductComponentDto,
  TcreateQuotationProductAccessoryDto,
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

// import { lookup_classProd } from './class/prod/lookup_classProd';
import { ClassProd } from './class/prod/classProd_remake';
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

  const createClassProd = useCallback(
    (stateProd: TstateProd) => {
      // const { doorModelName } = stateProd.data_prod;
      // const prodName = (doorModelName in lookup_classProd ? doorModelName : 'special') as keyof typeof lookup_classProd;

      // const TheClass = lookup_classProd[prodName];

      // const classProd = new TheClass({
      //   stateProd: stateProd,
      //   setStateProd: createSetProd(stateProd.key),
      //   nodeConfig: nodeConfig_prime,
      // });

      const classProd = new ClassProd({
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

    if (!activedClassProd.isValid_doorModel) {
      return {};
    }

    return createClassComponentDict_v2({
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

    const activedPseudoComponentDict = {
      distributionBox: new Class_distributionBox({
        stateProd: stateProd,
        setStateProd: createSetProd(stateProd.key),
      }),
      installationFee: new Class_installationFee({
        stateProd: stateProd,
        setStateProd: createSetProd(stateProd.key),
      }),
    };

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
  }, [
    //
    activedProd,
    createClassProd,
    // ...Object.values(activedProd?.data_componentDict ?? {}),
    // ...Object.values(activedProd?.data_accessoryDict ?? {}),
  ]);

  // -----------------------------------------------------------------------

  // region METHOD

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
      totalQty_decimal.add(quantity);

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
    //
    calcProduct: calcProductBody,
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
  // activedClassProd: Interface_ClassProd_prime;
  activedClassProd: ClassProd;
  createSetComponent: TcreateSetComponent;
}) => {
  const data_componentDict = activedClassProd.state.data_componentDict;
  const activeProdKey = activedClassProd.key;

  const slat =
    data_componentDict['slat'] &&
    new (ClassCompnent_slat.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['slat'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'slat',
      }),
      // activedClassProd,
    });

  const bottomBar =
    data_componentDict['bottomBar'] &&
    new (ClassCompnent_bottomBar.subspecies(activedClassProd.doorModelName))({
      state_component: data_componentDict['bottomBar'],
      setState_component: createSetComponent({
        pordKey: activeProdKey,
        componentKey: 'bottomBar',
      }),
      // activedClassProd,
    });

  const guideRail =
    data_componentDict['guideRail'] &&
    new (ClassCompnent_guideRail.subspecies(activedClassProd.doorModelName))({
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
    new (ClassCompnent_headBox.subspecies(activedClassProd.doorModelName))({
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
  activedClassProd,
  createSetAccessory,
}: {
  activedClassProd: ClassProd;
  createSetAccessory: TcreateSetAccessory;
}) => {
  const data_accessoryDict = activedClassProd.state.data_accessoryDict;

  const classAccessoryDict: TclassAccessoryDict = {};
  Object.entries(data_accessoryDict).forEach(([key, acce]) => {
    classAccessoryDict[key] = new Class_accessory({
      state_accessory: acce,
      setState_accessory: createSetAccessory({
        prodKey: activedClassProd.key,
        accessoryKey: key,
      }),
      classProd: activedClassProd,
    });
  });

  return classAccessoryDict;
};

// MARK: formatProdStateToBody
const formatProdStateToBody = (stateProd: TstateProd) => {
  const {
    data_prod,

    data_componentDict,
    componentKeyArr,

    data_accessoryDict,
    accessoryKeyArr,
  } = stateProd;

  const componentArr = componentKeyArr.map((key) => data_componentDict[key]);

  let someComponentInvalid = false;

  const components_pre: (TcreateQuotationProductComponentDto | 'invalid' | undefined)[] = componentArr.map(
    (component, index) => {
      if (component === undefined) {
        return undefined;
      }

      const { number, componentId, rawData } = component;

      if (!number || !componentId || !rawData) {
        someComponentInvalid = true;

        return 'invalid';
      }

      const body: TcreateQuotationProductComponentDto = {
        type: component.type,
        number,
        componentId,
        rawData: {}, // 必須要送隨便送一個物件
        bom: component.bom,
        material: component.material,
        materialSurface: component.materialSurface || undefined,
        isPainted: component.isPainted,
        price: Number(component.price || 0),
        quantity: component.quantity,
        order: index,
        desc: component.desc,
        density: component.density,
      };

      return body;
    }
  );

  const components: TcreateQuotationProductComponentDto[] = components_pre.filter(
    (item) => item !== 'invalid' && item !== undefined
  ) as TcreateQuotationProductComponentDto[];

  const accessoryArr = accessoryKeyArr.map((key) => data_accessoryDict[key]);
  const accessories: TcreateQuotationProductAccessoryDto[] = accessoryArr.map((acce) => {
    const body: TcreateQuotationProductAccessoryDto = {
      codeName: acce.codeName,
      name: acce.name,
      unit: acce.unit,
      quantity: Number(acce.quantity || 0),
      unitPrice: Number(acce.unitPrice || 0),
      totalPrice: Number(acce.totalPrice || 0),
      originalPrice: acce.originalPrice,
      price: Number(acce.price || 0),
      dualPrice: Number(acce.dualPrice || 0),
      order: acce.order,
      referenceSpec: acce.referenceSpec,
    };

    return body;
  });

  const formated: TcreateQuotationProductDto = {
    // 產品id
    // id?: string;
    // 折數
    discount: data_prod.discount, // `${number}`
    // 項目名
    itemName: data_prod.itemName,
    // 報價別
    quoteType: data_prod.quoteType,
    // 門型
    doorModelName: data_prod.doorModelName,
    // L(mm)全寬 // 單位為mm
    fullWidth: new Decimal(data_prod.fullWidth).mul(1000).toNumber(),

    WG: new Decimal(data_prod.WG).mul(1000).toNumber(),
    // h(mm) // 單位為mm
    height: new Decimal(data_prod.height).mul(1000).toNumber(),
    // B(mm) // 單位為mm
    boxB: new Decimal(data_prod.boxB).mul(1000).toNumber(),
    // D(mm) // 單位為mm
    boxD: new Decimal(data_prod.boxD).mul(1000).toNumber(),
    // 面積
    area: data_prod.area,
    // 才數
    volume: data_prod.volume,
    // 材料
    materialName: data_prod.materialName,
    // 表面
    materialSurface: data_prod.materialSurface,
    // 門軌
    guideRail: data_prod.guideRail,
    // 馬力
    horsepower: data_prod.horsepower,
    // 馬達廠商
    motorVendor: data_prod.motorVendor,
    // 電壓
    motorVoltage: data_prod.motorVoltage,
    // 馬達支撐架
    hasMotorSupportStand: data_prod.hasMotorSupportStand,
    // 底座類型
    bottomBar: data_prod.bottomBar, // 鋁障感 | 止水型 | ''
    // 馬達鎖盒
    motorLockBox: data_prod.motorLockBox,
    // 門軌厚度
    guideRailThickness: data_prod.guideRailThickness,
    // 捲軸規格  // 棄用
    rollerSpec: null, // 無凸 | 雙凸
    // 門軌消音條
    hasSilencingStrip: data_prod.hasMotorSupportStand,
    // 一體式捲箱
    isIntegratedHeadBox: data_prod.isIntegratedHeadBox,
    // 捲箱厚度
    headBoxThickness: data_prod.headBoxThickness,
    // 數量
    quantity: Number(data_prod.quantity || 0),
    // 單價
    unitPrice: Number(data_prod.unitPrice || 0),
    // 牌價
    price: Number(data_prod.price || 0),
    // 複價
    totalPrice: Number(data_prod.totalPrice || 0),
    // 牌價複價
    dualPrice: Number(data_prod.dualPrice || 0),
    // 防颱
    isAntiTyphoon: data_prod.isAntiTyphoon,
    // 彈射門
    bounceDoor: data_prod.bounceDoor,
    // 彈射門寬度
    bounceDoorWidth: Number(data_prod.bounceDoorWidth || 0),
    // 彈射門高度
    // bounceDoorHeight?: data_prod.bounceDoorHeight,
    // 彈射門長度
    // bounceDoorLength?: data_prod.bounceDoorLength,
    // 關閉方式 // 在前端顯示的label為開閉方式
    closingType: data_prod.closingType,
    // 備註
    notes: data_prod.notes,
    // 相數
    motorPhase: data_prod.motorPhase,
    // 底座角鐵
    bottomBarAngleIron: data_prod.bottomBarAngleIron,
    // 底座板
    bottomBarPlate: data_prod.bottomBarPlate,
    // 排序
    order: data_prod.order ?? 9999,
    // 門片厚度
    thickness: data_prod.thickness,
    // 配電箱牌價
    distributionBoxPrice: data_prod.distributionBoxPrice ? Number(data_prod.distributionBoxPrice) : null,
    // 配電箱單價
    distributionBoxUnitPrice: data_prod.distributionBoxUnitPrice ? Number(data_prod.distributionBoxUnitPrice) : null,
    // 配電箱數量
    distributionBoxQuantity: data_prod.distributionBoxQuantity ? Number(data_prod.distributionBoxQuantity) : null,
    // 配電箱牌價複價
    distributionBoxDualPrice: data_prod.distributionBoxDualPrice ? Number(data_prod.distributionBoxDualPrice) : null,
    // 配電箱複價
    distributionBoxTotalPrice: data_prod.distributionBoxTotalPrice ? Number(data_prod.distributionBoxTotalPrice) : null,
    // 安裝費牌價
    installationFeePrice: data_prod.installationFeePrice ? Number(data_prod.installationFeePrice) : null,
    // 安裝費牌價複價
    installationFeeDualPrice: data_prod.installationFeeDualPrice || null,
    // 安裝費數量
    installationFeeQuantity: data_prod.installationFeeQuantity || null,
    // 安裝費單價
    installationFeeUnitPrice: data_prod.installationFeeUnitPrice ? Number(data_prod.installationFeeUnitPrice) : null,
    // 安裝費複價
    installationFeeTotalPrice: data_prod.installationFeeTotalPrice || null,
    // 門片 - 捲片支數
    slatCount: data_prod.slatCount,
    // 鏈齒輪 - 鏈齒輪番號
    sprocketWheelModel: data_prod.sprocketWheelModel,
    // 鏈齒輪 - 大鏈輪
    sprocketWheelTeethNumber: data_prod.sprocketWheelTeethNumber,
    // 不確定這個property的意義，可能為鍊條數量
    sprocketWheelChains: data_prod.sprocketWheelChains,
    // 鏈齒輪/捲軸 - 孔徑/軸徑
    bearingInnerDiameter: data_prod.bearingInnerDiameter,
    // 捲軸 - 尺寸
    diameter: data_prod.diameter,
    // 捲軸 - 總長
    bearingHousingTotalLength: data_prod.bearingHousingTotalLength,
    // 底座 - 開口
    guideRailsOpening: data_prod.guideRailsOpening,
    // 門片長度
    slatLength: data_prod.slatLength,
    // 門軌長度
    guideRailLength: data_prod.guideRailLength,
    // 捲箱長度
    headBoxLength: data_prod.headBoxLength,
    // 軸承座寸法
    bearingHousingSize: data_prod.bearingHousingSize,
    // 軸承
    bearingName: data_prod.bearingName,
    gapA: data_prod.gapA,
    gapC: data_prod.gapC,
    gearNumber: data_prod.gearNumber,
    weight: data_prod.weight,
    // guideRailG為門軌的width
    // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
    guideRailG: data_prod.guideRailG,
    // 門軌UL
    isULGuideRail: data_prod.isULGuideRail,
    // 材料/配件設定
    components: components,
    // 選配設定
    accessories: accessories,
    // 來源產品
    attachedToProductId: data_prod.attachedToProductId,
    //
  };

  return formated;
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
