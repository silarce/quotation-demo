import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

// type
import {
  TcreateQuotationProductAccessoriesDto,
  TquotationProductAccessoriesDto,
  TdoorAccessoryDto,
} from 'js/api/dtoTypes';

import { Class_product } from './classProduct';

// =======================================================================
class Class_accessories {
  constructor({
    //
    reRender,
    data = emptyAccessoriesOri(),
    delSelf,
    copySelf,
    // calcOptionsAllprice,
    prod,
  }: {
    reRender: TreRender;
    data?: Taccessories;
    delSelf: () => void;
    copySelf: () => void;
    // calcOptionsAllprice: () => void;
    prod: Class_product;
  }) {
    this.reRender = reRender;
    this._acceData = data;
    this._prod = prod;

    this.delSelf = delSelf;
    this.copySelf = copySelf;

    this.calcPrice();
    this.calcAllPrice();
    // this.calcOptionsAllprice = calcOptionsAllprice;
  } // constructor

  private reRender;
  private _acceData;
  private _prod;
  readonly delSelf;
  readonly copySelf;
  // readonly calcOptionsAllprice;

  calcPrice() {
    const price = this._acceData.price;
    const referenceSpec = this._acceData.referenceSpec;
    let mulNumber = 1;

    if (!referenceSpec) {
      return;
    }

    // length跟width互斥，length為0的時候 price為0?
    if (referenceSpec === 'fullWidth') {
      const l = Number(this._prod.length);
      const w = Number(this._prod.width);
      mulNumber = l || w;
    }
    // 現在只確定有fullWidth
    // else if (referenceSpec === 'WG') {
    //   mulNumber = Number(this._prod.width);
    // } else if (referenceSpec === 'height ') {
    //   mulNumber = Number(this._prod.height);
    // }

    // this.price = new Decimal(price).mul(mulNumber).toNumber().toLocaleString(undefined, { maximumFractionDigits: 2 });
    this.price = new Decimal(price).mul(mulNumber).toString();
    this.calcAllPrice();
    this.reRender();
  }

  calcAllPrice({
    toCalcAccessoriesAllprice: toCalcAccessoriesAllprice = true,
  }: { toCalcAccessoriesAllprice?: boolean } = {}) {
    const discount = new Decimal(this._prod.discount).div(100);

    const price = this.price;
    const quantity = this.quantity;
    // 牌價複價
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價
    const unitPrice = new Decimal(price).mul(discount);
    // 複價
    const totalPrice = new Decimal(unitPrice).mul(quantity);

    this._acceData.dualPrice = dualPrice.toNumber();
    this._acceData.unitPrice = unitPrice.toNumber();
    this._acceData.totalPrice = totalPrice.toNumber();

    if (toCalcAccessoriesAllprice) {
      this._prod.calcAccessoriesAllprice();
    }

    this.reRender();
  }

  get codeName() {
    return this._acceData.codeName;
  }
  set codeName(v) {
    this._acceData.codeName = v;
    this.reRender();
  }

  get name() {
    return this._acceData.name;
  }
  set name(v) {
    this._acceData.name = v;
    this.reRender();
  }

  get unit() {
    return this._acceData.unit;
  }
  set unit(v) {
    this._acceData.unit = v;
    this.reRender();
  }

  get quantity() {
    return this._acceData.quantity;
  }
  set quantity(v) {
    this._acceData.quantity = v;
    this.calcAllPrice();
    this.reRender();
  }

  get price() {
    return String(this._acceData.price);
  }
  set price(str) {
    const num = Number(str);
    this._acceData.price = num;
    this.calcAllPrice();
    this.reRender();
  }

  get dualPrice() {
    return this._acceData.dualPrice;
  }
  set dualPrice(v) {
    this.reRender();
  }

  get unitPrice() {
    return String(this._acceData.unitPrice);
  }
  set unitPrice(str) {
    this.reRender();
  }

  get totalPrice() {
    return String(this._acceData.totalPrice);
  }
  set totalPrice(str) {
    // this._data.totalPrice = num;
    this.reRender();
  }

  // ---------------------------------------------------------

  get body() {
    return this._acceData;
  }
} // Class_accessories  close

// ============================================================================

type Taccessories = {
  id?: string;

  codeName: string; //代號
  name: string; //名稱
  unit: string; // 單位
  quantity: number; // 數量
  price: number; // 牌價
  totalPrice: number; // 複價
  unitPrice: number; // 單價
  dualPrice: number; // 牌價複價
  //
  referenceSpec?: string | null;
};

type TaccessoriesKey = Exclude<keyof Taccessories, 'id'>;

const accessoriesKeyArrOri: () => TaccessoriesKey[] = () => {
  return [
    //
    // 'codeName',
    'name',
    'unit',
    'quantity',
    'price',
    'dualPrice',
    'unitPrice',
    'totalPrice',
  ];
};

const accessoriesCellConfig: TcellConfig = {
  codeName: {
    label: '代號',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  name: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '550px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  unit: {
    label: '單位',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '40px' },
      inputProps: {
        props: {},
      },
    },
  },
  price: {
    label: '牌價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  dualPrice: {
    label: '牌價複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
};

// ============================================================================
const emptyAccessoriesOri: () => Taccessories = () => {
  return {
    codeName: '',
    name: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    price: 0,
    dualPrice: 0,
  };
};

// ============================================================================
export type { Taccessories, TaccessoriesKey };
export { Class_accessories, accessoriesCellConfig, accessoriesKeyArrOri, emptyAccessoriesOri };
