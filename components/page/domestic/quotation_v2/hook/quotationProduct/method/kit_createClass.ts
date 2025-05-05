import { useMemo } from 'react';
import { nanoid } from 'nanoid';
import _ from 'lodash';

import { createClassComponentDict } from 'components/page/domestic/quotation_v2/hook/quotationProduct/method/createClassComponentDict';
import { createAccessoryDict } from 'components/page/domestic/quotation_v2/hook/quotationProduct/method/createAccessoryDict';
import { ClassProd } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';
import {
  Class_distributionBox,
  Class_installationFee,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/pseudoComponent';

import type { TsetProd } from '../type';
import type {
  TstateProd,
  TclassComponentDict,
  TcreateSetComponent,
  TcreateSetAccessory,
  TclassAccessoryDict,
  TstateProdDict,
  TsetComponent,
  TsetAccessory,
  TclassPsuedoComponentDict,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';

import {
  TconfigItem,
  TcellKey,
  TnodeConfig,

  //
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
  //
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/config';

import {
  useDefaultState_prodDict,
  createEmptyStateProd,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useDefaultState_prodDict';

import { calcProdTotalPrice, calcPriceDiscount_percent, calcProdDistributionBoxAndInstallationFee } from './calcProd';

// ===========================================================================

const kit_createClass = ({
  //
  setState_prodDict,
  nodeConfig_prime,
  state_quotationDiscount,
  onProdAllTotalChange,
  setProdKeyArr,
  state_prodDict,
  activeProdKey,
  setActiveProdKey,
}: {
  setState_prodDict: React.Dispatch<React.SetStateAction<TstateProdDict>>;
  nodeConfig_prime: TnodeConfig;
  state_quotationDiscount: `${number}` | '' | null;
  onProdAllTotalChange: (state_prodDict?: TstateProdDict) => void;
  setProdKeyArr: React.Dispatch<React.SetStateAction<string[]>>;
  state_prodDict: TstateProdDict;
  activeProdKey: string | undefined;
  setActiveProdKey: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
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
  //

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

  // MARK:createActivedClassAccessoryDict
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

  // MARK:createClassProd
  const createClassProd = (stateProd: TstateProd) => {
    const quotationDiscount_iterativeProd = stateProd.quotationDiscount_iterativeProd;

    const quotationDiscount =
      state_quotationDiscount === null ? quotationDiscount_iterativeProd : state_quotationDiscount;

    const classProd = new ClassProd({
      stateProd: stateProd,
      setStateProd: createSetProd(stateProd.key),
      nodeConfig: nodeConfig_prime,
      quotationDiscount: quotationDiscount || 0,
      onPordTotalChange: onProdAllTotalChange,
    });

    return classProd;
  };

  // MARK:createActivedClassComponentDict
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
  // ---------------------------------------------------------------------------

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

    setState_prodDict((prev) => {
      const { [prodKey]: removedProd, ...rest } = prev;
      onProdAllTotalChange(rest);

      return rest;
    });

    if (prodKey === activeProdKey) {
      setActiveProdKey(undefined);
    }
  };

  // const copyProd = ({ prodKey, stateProd }: XOR<{ prodKey: string }, { stateProd: TstateProd }>) => {
  const copyProd = ({
    stateProd,
    quantity,
    attachedToProduct,
    quotationDiscount,
  }: {
    stateProd: TstateProd;
    quantity?: number;
    attachedToProduct?: TstateProd;
    quotationDiscount?: number | `${number}`;
  }) => {
    let copyedProd = _.cloneDeep(stateProd);

    if (!copyedProd) {
      throw new Error('copyProd出錯，copyedProd不存在');
    }

    // const action = attachedToProduct ? '變更追加' : '純追加';
    const action = attachedToProduct ? 'modify' : 'add';
    const attachedToProductId = attachedToProduct?.data_prod.id;

    if (action === 'modify' && !attachedToProductId) {
      console.log('attachedToProduct', attachedToProduct);

      throw new Error('copyProd出錯，變更時attachedToProductId不存在');
    }

    copyedProd = {
      ...copyedProd,
      qty_reduce: '',
      deductedPrice: 0,
      modifyedProduct: {},
      rootProduct: undefined,
      action: '追加',
    };

    const data_prod = {
      ...copyedProd.data_prod,
      id: undefined as string | undefined,
      rootProductId: undefined,
      attachedToProductId: undefined,
    };

    quantity !== undefined && (data_prod.quantity = `${quantity}`);

    copyedProd.data_prod = data_prod;

    if (action === 'modify') {
      copyedProd.rootProduct = attachedToProduct;
      copyedProd.action = '變更追加';

      const priceDiscount_percent = calcPriceDiscount_percent({
        prodDiscount: data_prod.discount,
        quotationDiscount: state_quotationDiscount || '',
      });

      data_prod.id = attachedToProductId!;

      const {
        distributionBoxUnitPrice,
        distributionBoxTotalPrice,
        installationFeeUnitPrice,
        installationFeeTotalPrice,
      } = calcProdDistributionBoxAndInstallationFee({
        stateProd: copyedProd,
        priceDiscount_percent: priceDiscount_percent,
      });

      data_prod.distributionBoxUnitPrice = distributionBoxUnitPrice;
      data_prod.distributionBoxTotalPrice = distributionBoxTotalPrice;
      data_prod.installationFeeUnitPrice = installationFeeUnitPrice;
      data_prod.installationFeeTotalPrice = installationFeeTotalPrice;

      const { price, dualPrice, unitPrice, totalPrice } = calcProdTotalPrice({
        stateProd: copyedProd,
        quotationDiscount: quotationDiscount || 0,
      });

      data_prod.dualPrice = dualPrice;
      data_prod.unitPrice = unitPrice;
      data_prod.totalPrice = totalPrice;

      const copmonentDict = copyedProd.data_componentDict;

      for (const component of Object.values(copmonentDict)) {
        component.isInited = false;
      }
    }

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

    return newProd;
  };

  return {
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
  };
};

// ===========================================================================

// MARK:useActivedClass
const useActivedClass = ({
  activedProd,
  createClassProd,
  createActivedClassComponentDict,
  createSetProd,
  createSetAccessory,
}: {
  activedProd: TstateProd | undefined;
  createClassProd: (stateProd: TstateProd) => ClassProd;
  createActivedClassComponentDict: (activedProd: TstateProd) => TclassComponentDict;
  createSetProd: (key: string) => TsetProd;
  createSetAccessory: TcreateSetAccessory;
}) => {
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
      delete activedPseudoComponentDict.distributionBox;
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

  return {
    activedClassProd,
    activedClassComponentDict,
    activedClassPseudoComponentDict,
    activedClassAccessoryDict,
  };
};

export { kit_createClass, useActivedClass };
