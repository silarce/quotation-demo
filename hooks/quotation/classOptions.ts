import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { Toption } from 'js/utils/options/options';

// type
import { TcreateQuotationProductOptionDto } from 'js/api/dtoTypes';

import { Class_product } from './classProduct';

// =======================================================================
class Class_options {
  constructor({
    //
    reRender,
    data = emptyOptionsOri(),
    delSelf,
    copySelf,
    // calcOptionsAllprice,
    prod,
  }: {
    reRender: TreRender;
    data?: Toptions;
    delSelf: () => void;
    copySelf: () => void;
    // calcOptionsAllprice: () => void;
    prod: Class_product;
  }) {
    this.reRender = reRender;
    this._data = data;
    this._prod = prod;

    this.delSelf = delSelf;
    this.copySelf = copySelf;
    // this.calcOptionsAllprice = calcOptionsAllprice;
  } // constructor

  private reRender;
  private _data;
  private _prod;
  readonly delSelf;
  readonly copySelf;
  // readonly calcOptionsAllprice;

  calcAllPrice({
    toCalcOptionsAllprice = true,
  }: //
  { toCalcOptionsAllprice?: boolean } = {}) {
    const discountRate = new Decimal(this._prod.discountRate).div(100);

    const price = this.price;
    const quantity = this.quantity;
    // 牌價複價
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價
    const unitPrice = new Decimal(price).mul(discountRate);
    // 複價
    const totalPrice = new Decimal(unitPrice).mul(quantity);

    this._data.dualPrice = dualPrice.toNumber();
    this._data.unitPrice = unitPrice.toNumber();
    this._data.totalPrice = totalPrice.toNumber();

    if (toCalcOptionsAllprice) {
      this._prod.calcOptionsAllprice();
    }

    this.reRender();
  }

  get codeName() {
    return this._data.codeName;
  }
  set codeName(v) {
    this._data.codeName = v;
    this.reRender();
  }

  get name() {
    return this._data.name;
  }
  set name(v) {
    this._data.name = v;
    this.reRender();
  }

  get unit() {
    return this._data.unit;
  }
  set unit(v) {
    this._data.unit = v;
    this.reRender();
  }

  get quantity() {
    return this._data.quantity;
  }
  set quantity(v) {
    this._data.quantity = v;
    this.calcAllPrice();
    this.reRender();
  }

  get price() {
    return String(this._data.price);
  }
  set price(str) {
    const num = Number(str);
    this._data.price = num;
    this.calcAllPrice();
    this.reRender();
  }

  get dualPrice() {
    return this._data.dualPrice;
  }
  set dualPrice(v) {
    this.reRender();
  }

  get unitPrice() {
    return String(this._data.unitPrice);
  }
  set unitPrice(str) {
    this.reRender();
  }

  get totalPrice() {
    return String(this._data.totalPrice);
  }
  set totalPrice(str) {
    // this._data.totalPrice = num;
    this.reRender();
  }

  // ---------------------------------------------------------

  get body() {
    return this._data;
  }
} // Class_options  close

// ============================================================================

type Toptions = {
  id?: string;
  codeName: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  price: number;
  dualPrice: number;
};

type ToptionsKey = Exclude<keyof Toptions, 'id'>;

const optionsKeyArrOri: () => ToptionsKey[] = () => {
  return [
    //
    'codeName',
    'name',
    'unit',
    'quantity',
    'price',
    'dualPrice',
    'unitPrice',
    'totalPrice',
  ];
};

const optionsCellConfig: TcellConfig = {
  codeName: {
    label: '代號',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  name: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  unit: {
    label: '單位',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  price: {
    label: '牌價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
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
const emptyOptionsOri: () => Toptions = () => {
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
export type { Toptions, ToptionsKey };
export { Class_options, optionsCellConfig, optionsKeyArrOri, emptyOptionsOri };
