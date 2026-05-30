import { useMemo } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { nanoid } from 'nanoid';

import type {
  TdoorModelInfoDto,
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type { TstateProd, TstateProdData, TstateProdDict, TstateComponentData } from './type';
import type { TquotationProductDto_addition } from 'js/api/api_quotation';
import type { TprodSource } from './useQuotationProduct';

import { calcQtyReduceModified } from './method/calcProd';

// ===========================================================================

interface TdefaultState {
  stateProdDict: TstateProdDict;
  prodKeyArr: string[];
}

// type Taddition = {
//   qty_reduce: number; // 追減數量 // 好像用不到...
//   // qty_modify: number; // 變更數量 // 好像用不到...
//   latestIterativeId: string;
//   deductedPrice: number;
//   modifyedProduct: Record<
//     string,
//     {
//       key: string;
//       quantity: number;
//     }
//   >;
// };

// type TprodSource = TquotationProductDto & { addition: Taddition };

// ===========================================================================
// MARK:useDefaultState
const useDefaultState_prodDict = ({
  prodSourceArr,
  doorModelDict,
  action: action_cover,
  stateProdDict_iterative,
}: {
  prodSourceArr: TprodSource[] | undefined;
  doorModelDict: Record<string, TdoorModelInfoDto> | null | undefined;
  action?: TstateProd['action'];
  stateProdDict_iterative?: TstateProdDict;
}) => {
  const defaultState: TdefaultState = useMemo(() => {
    if (!prodSourceArr || doorModelDict === undefined) {
      return {
        stateProdDict: {} as TstateProdDict,
        prodKeyArr: [] as string[],
      };
    }

    let prodSource_copy = _.cloneDeep(prodSourceArr);
    prodSource_copy = _.sortBy(prodSource_copy, 'order');

    const dict: TstateProdDict = {};
    const keyArr: string[] = [];

    prodSource_copy.forEach((prodSource) => {
      const {
        addition: {
          //
          qty_reduce,
          deductedPrice = 0,
          modifyedProduct = {},
          latestIterativeId,
          rootRootProductKey,
          quotationDiscount,
          priceDiscount_percent,
          action,
        } = {},
      } = prodSource;

      keyArr.push(prodSource.id);

      const data_prod = createDateProd(prodSource);

      let componentsArr = prodSource.items[0]?.components ?? [];
      componentsArr = _.sortBy(componentsArr, 'order');
      const data_componentDict = createData_componentDict(componentsArr);
      const componentKeyArr = componentsArr.map((item) => item.type);

      let accessoriesArr = prodSource.items[0]?.accessories ?? [];
      accessoriesArr = _.sortBy(accessoriesArr, 'order');
      const data_accessoryDict = createData_accessoryDict(accessoriesArr);
      const accessoryKeyArr = Object.keys(data_accessoryDict);

      let rootProduct: TstateProd | undefined = undefined;

      if (rootRootProductKey) {
        rootProduct = stateProdDict_iterative?.[rootRootProductKey];

        if (!rootProduct) {
          console.error('stateProdDict_iterative', stateProdDict_iterative);
          console.error('prodSource', prodSource);

          throw new Error('useDefaultState_prodDict: 找不到rootProduct');
        }
      }

      const isQuantityValid = (() => {
        const qty_reduceModified = calcQtyReduceModified({
          stateProd: {
            qty_reduce: `${qty_reduce || 0}`,
            modifyedProduct,
          },
        });

        const qty_prod = Number(data_prod.quantity || 0);

        return qty_reduceModified <= qty_prod;
      })();

      // 在這裡，generalSpecs與availableComponents必須是undefined
      // undefined視為未曾初始化
      const state: TstateProd & {
        generalSpecs: undefined;
        availableComponents: undefined;
      } = {
        key: data_prod.id,
        data_prod: data_prod,
        data_componentDict,
        componentKeyArr,

        data_accessoryDict,
        accessoryKeyArr,

        doorModel: doorModelDict?.[data_prod.doorModelName] || null,
        isCustomPrice: doorModelDict ? !(data_prod.doorModelName in doorModelDict) : true,
        generalSpecs: undefined,
        availableComponents: undefined,

        qty_reduce: qty_reduce ? `${qty_reduce}` : '',
        deductedPrice,
        modifyedProduct: modifyedProduct,
        quotationDiscount_iterativeProd: quotationDiscount,
        isQuantityValid,

        latestIterativeId: latestIterativeId,

        action: action_cover || action || '追加',

        rootProduct,
      };

      calcQtyReduceModified({ stateProd: state });

      dict[data_prod.id] = state;
    });

    return {
      stateProdDict: dict,
      prodKeyArr: keyArr,
    };
  }, [prodSourceArr, doorModelDict]);

  return defaultState;
};

// ========================================================================
// ========================================================================
// ========================================================================

// MARK: createDateProd
const createDateProd = (raw: TprodSource) => {
  const data_prod: TstateProdData & { id: string } = {
    id: raw.id,
    itemName: raw.itemName,
    discount: raw.discount as `${number}`,
    quoteType: raw.quoteType,
    doorModelName: raw.doorModelName,
    fullWidth: new Decimal(raw.fullWidth).div(1000).toString() as `${number}` | '',
    height: new Decimal(raw.height).div(1000).toString() as `${number}` | '',

    area: raw.area as `${number}` | null,

    materialName: raw.materialName,
    materialSurface: raw.materialSurface,

    quantity: `${raw.quantity}`,
    price: `${raw.price || 0}`, // 牌價
    dualPrice: `${raw.dualPrice || 0}`, // 牌價複價
    unitPrice: `${raw.unitPrice || 0}`, // 單價 會乘上折數的價格
    totalPrice: `${raw.totalPrice || 0}`, // 複價 會乘上折數的價格
  };

  return data_prod;
};

// MARK:createData_componentDict
const createData_componentDict = (componentsArr: TquotationProductComponentDto[]) => {
  const data_componentDict: TstateProd['data_componentDict'] = componentsArr.reduce((componentDict, item) => {
    const {
      //
      type,
      number,
      desc,
      material,
      materialSurface,
      quantity,
      price,
    } = item;

    const data_component: TstateComponentData<typeof type> = {
      type,
      number,
      desc: desc || '',
      material,
      materialSurface: materialSurface || '',
      quantity: quantity as `${number}` | '',
      price: `${price}`,
    };

    switch (type) {
      case 'slat':
        componentDict['slat'] = data_component as TstateComponentData<'slat'>;
        break;
      case 'bottomBar':
        componentDict['bottomBar'] = data_component as TstateComponentData<'bottomBar'>;
        break;
      case 'guideRail':
        componentDict['guideRail'] = data_component as TstateComponentData<'guideRail'>;
        break;
      case 'sidePlate':
        componentDict['sidePlate'] = data_component as TstateComponentData<'sidePlate'>;
        break;
      case 'roller':
        componentDict['roller'] = data_component as TstateComponentData<'roller'>;
        break;
      case 'motor':
        componentDict['motor'] = data_component as TstateComponentData<'motor'>;
        break;
      case 'motorAccessories':
        componentDict['motorAccessories'] = data_component as TstateComponentData<'motorAccessories'>;
        break;
      case 'headBox':
        componentDict['headBox'] = data_component as TstateComponentData<'headBox'>;
        break;
      case 'middlePillar':
        componentDict['middlePillar'] = data_component as TstateComponentData<'middlePillar'>;
        break;
      case 'backBone':
        componentDict['backBone'] = data_component as TstateComponentData<'backBone'>;
        break;
      default:
        break;
    }

    return componentDict;
  }, {} as TstateProd['data_componentDict']);

  return data_componentDict;
};

const createData_accessoryDict = (accessoriesArr: TquotationProductAccessoryDto[]) => {
  const dict: TstateProd['data_accessoryDict'] = {};

  accessoriesArr.forEach((acce) => {
    const {
      id,
      codeName,
      name,
      unit,
      quantity,
      unitPrice,
      totalPrice,
      originalPrice,
      price,
      dualPrice,
      order,
      referenceSpec,
    } = acce;

    const stateAcce: TstateProd['data_accessoryDict'][string] = {
      codeName,
      name,
      unit,
      quantity: `${quantity}`,
      unitPrice: `${unitPrice}`,
      totalPrice: `${totalPrice}`,
      originalPrice,
      price: `${price}`,
      dualPrice: `${dualPrice}`,
      order,
      referenceSpec,
    };

    if (!dict[codeName]) {
      dict[codeName] = stateAcce;
    } else {
      dict[id] = stateAcce;
    }
  });

  return dict;
};

// ========================================================================

const createEmptydataProd = () => {
  const data_prod: TstateProdData = {
    id: null,
    itemName: '',
    discount: '100',
    quoteType: '',
    doorModelName: '',

    fullWidth: '',
    height: '',

    area: null,

    materialName: '',
    materialSurface: null,

    quantity: '1',
    price: '',
    dualPrice: '',
    unitPrice: '',
    totalPrice: '',
    order: 9999,
  };

  return data_prod;
};

const createEmptyStateProd = () => {
  const stateProd: TstateProd = {
    key: 'new-' + nanoid(),
    data_prod: createEmptydataProd(),
    data_componentDict: {},
    componentKeyArr: [],

    data_accessoryDict: {},
    accessoryKeyArr: [],

    doorModel: null,
    generalSpecs: null,
    availableComponents: null,

    qty_reduce: '',
    deductedPrice: 0,
    modifyedProduct: {},
    isQuantityValid: true,

    latestIterativeId: undefined,
    action: '追加',
  };

  return stateProd;
};

// ========================================================================

function isTquotationProductDtoAddition(
  raw: TquotationProductDto | TquotationProductDto_addition
): raw is TquotationProductDto_addition {
  return (raw as TquotationProductDto_addition).latestIterativeId !== undefined;
}

// ========================================================================
export { useDefaultState_prodDict, createEmptyStateProd };
