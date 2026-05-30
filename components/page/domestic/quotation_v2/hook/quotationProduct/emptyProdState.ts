import type { TstateProd, TstateProdData, TstateProdDict, TstateComponentData } from './type';

const createEmptyStateProdData = () => {
  const emptyStateProdData: TstateProdData = {
    id: null,
    itemName: '',
    discount: '',
    quoteType: '',
    doorModelName: '',
    fullWidth: '',
    height: '',
    area: '',
    materialName: '',
    materialSurface: '',
    quantity: '',
    price: '',
    dualPrice: '',
    unitPrice: '',
    totalPrice: '',
  };

  return emptyStateProdData;
};

const createEmptyStateProd = (key: string) => {
  const emptyStateProd: TstateProd = {
    key,

    data_prod: createEmptyStateProdData(),
    data_componentDict: {},
    componentKeyArr: [],

    data_accessoryDict: {},
    accessoryKeyArr: [],

    doorModel: null,

    generalSpecs: null,
    availableComponents: null,
    generateDoorProductBom: null,
    isFetching: false,
    afterChangeQueue: undefined,

    qty_reduce: '',
    deductedPrice: 0,
    modifyedProduct: {},
    isQuantityValid: true,

    latestIterativeId: undefined,
    action: '追加',
  };

  return emptyStateProd;
};

export { createEmptyStateProd };
